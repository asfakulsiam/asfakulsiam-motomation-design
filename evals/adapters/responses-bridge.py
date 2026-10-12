#!/usr/bin/env python3
"""OpenAI-Responses-compatible bridge used to run the Codex CLI for the v3 multi-agent benchmark (2026-10-12).

Codex talks to a custom model provider with the Responses API (wire_api = "responses"). This bridge answers those
requests through Perplexity's internal LLM SDK, the same route as evals/adapters/anthropic-bridge.py for Claude Code.
It only runs inside that environment; elsewhere, run Codex against your own OpenAI account and drop the bridge.

  python3 evals/adapters/responses-bridge.py --port 8788 --model gpt_5_4 --reasoning medium
  # $CODEX_HOME/config.toml:  model_provider = "bridge"  [model_providers.bridge] base_url = "http://127.0.0.1:8788/v1"
  #                           env_key = "BRIDGE_KEY"  wire_api = "responses"

Function tools pass through. Codex's freeform tool (apply_patch, type "custom") is offered to the model as a function
with one string argument and handed back to Codex as a custom_tool_call. Hosted tools (web_search) are not offered.
Reasoning items keep their provider signatures across turns (stored here by id). Usage per request goes to --log.
"""
import argparse, asyncio, json, sys, time, uuid
from aiohttp import web
from pplx.python.sdks.llm_api import LLMAPIClient
from pplx.python.sdks.llm_api.types import (Client, Conversation, Identity, ImageBlock, ImageSource, ImageSourceType, Message, Role,
                                             ReasoningEffort, SamplingParams, TextBlock, ThinkingBlock, ThinkingParams, Tool, ToolParams,
                                             ToolUseBlock, ToolResultBlock, ToolChoiceAuto)

ap = argparse.ArgumentParser()
ap.add_argument("--port", type=int, default=8788)
ap.add_argument("--model", default="gpt_5_4")
ap.add_argument("--reasoning", default="medium")
ap.add_argument("--log", default="/tmp/responses-bridge.jsonl")
ap.add_argument("--max-tokens", type=int, default=32000)
A = ap.parse_args()
_client = None
def client_():
    global _client
    if _client is None: _client = LLMAPIClient()
    return _client
SIG = {}      # reasoning id / call id -> provider block
CUSTOM = set()  # names of freeform tools in the current request


def parts(content):
    if isinstance(content, str): return [TextBlock(text=content)] if content else []
    out = []
    for c in content or []:
        t = c.get("type")
        if t in ("input_text", "output_text", "text") and c.get("text"): out.append(TextBlock(text=c["text"]))
        elif t == "input_image" and str(c.get("image_url", "")).startswith("data:"):
            head, data = c["image_url"].split(",", 1); mt = head[5:].split(";")[0]
            out.append(ImageBlock(source=ImageSource(type=ImageSourceType.BASE64, media_type=mt, data=data)))
    return out


def out_text(o):
    if isinstance(o, str): return o or " "
    if isinstance(o, list): return "\n".join(x.get("text", "") for x in o if isinstance(x, dict)) or " "
    return json.dumps(o)


async def handle(req):
    body = await req.json()
    convo = Conversation(); system = [body.get("instructions") or ""]; turns = []
    def push(role, blocks):
        if not blocks: return
        if turns and turns[-1][0] == role: turns[-1][1].extend(blocks)
        else: turns.append([role, list(blocks)])
    for it in body.get("input", []):
        t = it.get("type", "message")
        if t == "message":
            r = it.get("role")
            if r in ("developer", "system"): system.append(out_text(it.get("content")) if not isinstance(it.get("content"), list) else "\n".join(b.text for b in parts(it["content"]) if isinstance(b, TextBlock)))
            else: push("user" if r == "user" else "assistant", parts(it.get("content")))
        elif t == "reasoning":
            k = it.get("encrypted_content") or it.get("id")
            if k in SIG: push("assistant", [SIG[k]])
        elif t in ("function_call", "custom_tool_call"):
            cid = it["call_id"]; prev = SIG.get(cid)
            raw = it.get("arguments") if t == "function_call" else json.dumps({"input": it.get("input", "")})
            push("assistant", [prev if prev is not None else ToolUseBlock(id=cid, name=it["name"], input=raw or "{}")])
        elif t in ("function_call_output", "custom_tool_call_output"):
            push("user", [ToolResultBlock(tool_use_id=it["call_id"], content=[TextBlock(text=out_text(it.get("output")))], is_error=False)])
    sys_txt = "\n\n".join(s for s in system if s)
    if sys_txt: convo.set_system(sys_txt)
    for role, blocks in turns: convo.messages.append(Message(role=Role.USER if role == "user" else Role.ASSISTANT, content=blocks))
    tools, custom = [], set()
    for t in body.get("tools", []):
        if t.get("type") == "function":
            tools.append(Tool(name=t["name"], description=t.get("description", ""), input_schema=t.get("parameters") or {"type": "object", "properties": {}}))
        elif t.get("type") == "custom":
            custom.add(t["name"]); fmt = t.get("format") or {}
            desc = (t.get("description", "") + "\n\nPass the complete freeform text as the `input` string." + (f"\nGrammar ({fmt.get('syntax')}):\n{fmt.get('definition')}" if fmt.get("definition") else ""))
            tools.append(Tool(name=t["name"], description=desc, input_schema={"type": "object", "properties": {"input": {"type": "string", "description": "The full freeform input"}}, "required": ["input"]}))
    kw = {"tool_params": ToolParams(tools=tools, tool_choice=ToolChoiceAuto())} if tools else {}
    t0 = time.time(); last = None
    for attempt in range(6):
        try:
            ev = await client_().messages.create(model=A.model, convo=convo, identity=Identity(client=Client("dev"), use_case="unclassified"),
                                                 sampling_params=SamplingParams(max_tokens=A.max_tokens),
                                                 thinking_params=ThinkingParams(reasoning_effort=ReasoningEffort(A.reasoning if tools else "none")), **kw)
            break
        except Exception as e:
            last = e; print(f"upstream error (attempt {attempt + 1}): {repr(e)[:600]}", file=sys.stderr, flush=True)
            json.dump(body, open("/tmp/responses-bridge-last-fail.json", "w")); await asyncio.sleep(4 * (attempt + 1))
    else:
        return web.json_response({"error": {"type": "server_error", "message": repr(last)[:500]}}, status=500)
    items = []
    for b in ev.content:
        t = getattr(b, "type", None); t = getattr(t, "value", t)
        if t == "thinking":
            k = "rs_" + uuid.uuid4().hex
            SIG[k] = ThinkingBlock(thinking=b.thinking or "", signature=getattr(b, "signature", None), reasoning_item_id=getattr(b, "reasoning_item_id", None), endpoint_signature=getattr(b, "endpoint_signature", None))
            items.append({"type": "reasoning", "id": k, "summary": [], "encrypted_content": k})
        elif t == "text" and b.text:
            items.append({"type": "message", "id": "msg_" + uuid.uuid4().hex[:20], "role": "assistant", "status": "completed", "content": [{"type": "output_text", "text": b.text, "annotations": []}]})
        elif t == "tool_use":
            raw = b.input if isinstance(b.input, str) else json.dumps(b.input or {})
            SIG[b.id] = ToolUseBlock(id=b.id, name=b.name, input=raw, thought_signature=getattr(b, "thought_signature", None), endpoint_signature=getattr(b, "endpoint_signature", None))
            if b.name in custom:
                try: inp = json.loads(raw).get("input", "")
                except Exception: inp = raw
                items.append({"type": "custom_tool_call", "id": "ctc_" + uuid.uuid4().hex[:20], "call_id": b.id, "name": b.name, "input": inp, "status": "completed"})
            else:
                items.append({"type": "function_call", "id": "fc_" + uuid.uuid4().hex[:20], "call_id": b.id, "name": b.name, "arguments": raw, "status": "completed"})
    u = ev.usage
    tin = (u.uncached_input_tokens or 0) + (u.cached_input_tokens or 0) + (u.cache_write_tokens or 0) + (getattr(u, "cache_write_1h_tokens", 0) or 0)
    with open(A.log, "a") as f:
        f.write(json.dumps({"t": time.time(), "requested": body.get("model"), "served": ev.model_id or ev.model, "in": tin, "out": u.output_tokens, "reasoning": u.reasoning_tokens, "secs": round(time.time() - t0, 1), "tools": len(tools), "items": [i["type"] for i in items]}) + "\n")
    rid = "resp_" + uuid.uuid4().hex[:24]
    usage = {"input_tokens": tin, "input_tokens_details": {"cached_tokens": u.cached_input_tokens or 0}, "output_tokens": u.output_tokens or 0,
             "output_tokens_details": {"reasoning_tokens": u.reasoning_tokens or 0}, "total_tokens": tin + (u.output_tokens or 0)}
    full = {"id": rid, "object": "response", "created_at": int(t0), "status": "completed", "model": body.get("model"), "output": items, "usage": usage}
    if not body.get("stream"): return web.json_response(full)
    resp = web.StreamResponse(headers={"Content-Type": "text/event-stream", "Cache-Control": "no-cache"}); await resp.prepare(req)
    seq = 0
    async def ev_(name, data):
        nonlocal seq; seq += 1; data = {"type": name, "sequence_number": seq, **data}
        await resp.write(f"event: {name}\ndata: {json.dumps(data)}\n\n".encode())
    await ev_("response.created", {"response": {**full, "status": "in_progress", "output": [], "usage": None}})
    for i, it in enumerate(items):
        if it["type"] == "message":
            await ev_("response.output_item.added", {"output_index": i, "item": {**it, "status": "in_progress", "content": []}})
            await ev_("response.output_text.delta", {"item_id": it["id"], "output_index": i, "content_index": 0, "delta": it["content"][0]["text"]})
        else:
            await ev_("response.output_item.added", {"output_index": i, "item": it})
        await ev_("response.output_item.done", {"output_index": i, "item": it})
    await ev_("response.completed", {"response": full})
    await resp.write_eof(); return resp


async def other(req):
    return web.json_response({"object": "list", "data": [{"id": A.model, "object": "model"}]} if req.path.endswith("/models") else {}, status=200)


app = web.Application(client_max_size=256 << 20)
app.router.add_post("/v1/responses", handle)
app.router.add_route("*", "/{tail:.*}", other)
web.run_app(app, host="127.0.0.1", port=A.port, print=lambda *a: print(f"responses bridge on :{A.port} → {A.model} (reasoning {A.reasoning})", file=sys.stderr))
