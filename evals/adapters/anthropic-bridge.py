#!/usr/bin/env python3
"""Anthropic-Messages-compatible bridge used to run Claude Code for the v3 benchmark (2026-10-12).

Claude Code talks to ANTHROPIC_BASE_URL with the Anthropic Messages API. This bridge accepts those requests and answers
them through Perplexity's internal LLM SDK (pplx.python.sdks.llm_api), the same route the v2 runs used. It only runs
inside that environment; to reproduce elsewhere, point Claude Code at your own Anthropic endpoint and drop the bridge.

  python3 evals/adapters/anthropic-bridge.py --port 8787 --model claude_sonnet_5_5 --reasoning medium
  ANTHROPIC_BASE_URL=http://127.0.0.1:8787 ANTHROPIC_API_KEY=bridge claude -p "…"

Every request, whatever model Claude Code names (including its small background model), is served by --model, so one
run uses one model. Responses are produced whole and re-emitted as an SSE stream when Claude Code asks for a stream.
Thinking and tool-use blocks keep their provider signatures across turns (stored here by id), so multi-turn tool use
with reasoning works. Usage per request is appended to --log as JSON lines (requested model, served model, tokens).
"""
import argparse, asyncio, base64, json, sys, time, uuid
from aiohttp import web
from pplx.python.sdks.llm_api import LLMAPIClient
from pplx.python.sdks.llm_api.types import (Client, Conversation, Identity, ImageBlock, ImageSource, ImageSourceType, Message, Role,
                                             ReasoningEffort, SamplingParams, TextBlock, ThinkingBlock, ThinkingParams, Tool, ToolParams,
                                             ToolUseBlock, ToolResultBlock, ToolChoiceAuto, ToolChoiceAny, ToolChoiceNamed)

ap = argparse.ArgumentParser()
ap.add_argument("--port", type=int, default=8787)
ap.add_argument("--model", default="claude_sonnet_5_5")
ap.add_argument("--reasoning", default="medium")
ap.add_argument("--log", default="/tmp/anthropic-bridge.jsonl")
ap.add_argument("--max-tokens", type=int, default=32000)
A = ap.parse_args()
_client = None
def client_():
    global _client
    if _client is None: _client = LLMAPIClient()  # created inside the server's event loop
    return _client
SIG = {}   # tool_use id / thinking key -> provider block (keeps thought/endpoint signatures across turns)


def text_of(c):
    if isinstance(c, str): return c
    return "".join(b.get("text", "") for b in c if b.get("type") == "text")


def to_blocks(content, role):
    if isinstance(content, str): return [TextBlock(text=content)] if content else []
    out = []
    for b in content:
        t = b.get("type")
        if t == "text" and b.get("text"): out.append(TextBlock(text=b["text"]))
        elif t == "image" and b.get("source", {}).get("type") == "base64":
            s = b["source"]; out.append(ImageBlock(source=ImageSource(type=ImageSourceType.BASE64, media_type=s["media_type"], data=s["data"])))
        elif t == "thinking" and role == "assistant":
            k = b.get("signature", "")
            if k in SIG: out.append(SIG[k])
        elif t == "tool_use":
            prev = SIG.get(b["id"])
            out.append(prev if prev is not None else ToolUseBlock(id=b["id"], name=b["name"], input=b.get("input") or {}))
        elif t == "tool_result":
            c = b.get("content", "")
            if isinstance(c, list):
                parts = []
                for x in c:
                    if x.get("type") == "text": parts.append(TextBlock(text=x.get("text") or " "))
                    elif x.get("type") == "image" and x.get("source", {}).get("type") == "base64":
                        s = x["source"]; parts.append(ImageBlock(source=ImageSource(type=ImageSourceType.BASE64, media_type=s["media_type"], data=s["data"])))
                c = parts or [TextBlock(text=" ")]
            else:
                c = [TextBlock(text=str(c) or " ")]
            out.append(ToolResultBlock(tool_use_id=b["tool_use_id"], content=c, is_error=bool(b.get("is_error"))))
    return out


async def handle(req):
    body = await req.json()
    convo = Conversation()
    sys_txt = text_of(body.get("system") or "")
    if sys_txt: convo.set_system(sys_txt)
    msgs = []
    for m in body.get("messages", []):  # Claude Code also sends role "system" mid-conversation: fold it into the user turn
        if m["role"] == "system":
            m = {"role": "user", "content": [{"type": "text", "text": "<system>\n" + text_of(m["content"]) + "\n</system>"}]}
        if msgs and msgs[-1]["role"] == m["role"]:
            a = msgs[-1]["content"]; a = [{"type": "text", "text": a}] if isinstance(a, str) else list(a)
            b = m["content"]; b = [{"type": "text", "text": b}] if isinstance(b, str) else list(b)
            msgs[-1] = {"role": m["role"], "content": a + b}
        else:
            msgs.append(m)
    for m in msgs:
        bl = to_blocks(m["content"], m["role"])
        if bl: convo.messages.append(Message(role=Role.USER if m["role"] == "user" else Role.ASSISTANT, content=bl))
    kw = {}
    tools = [Tool(name=t["name"], description=t.get("description", ""), input_schema=t.get("input_schema") or {"type": "object"}) for t in body.get("tools", []) if t.get("name") and "input_schema" in t]
    if tools:
        tc = body.get("tool_choice") or {"type": "auto"}
        choice = ToolChoiceAny() if tc.get("type") == "any" else ToolChoiceNamed(name=tc["name"]) if tc.get("type") == "tool" else ToolChoiceAuto()
        kw["tool_params"] = ToolParams(tools=tools, tool_choice=choice)
    max_t = min(int(body.get("max_tokens") or A.max_tokens), A.max_tokens)
    small = max_t <= 1024 or not tools  # Claude Code's background calls (titles, summaries): no reasoning needed
    t0 = time.time(); last = None
    for attempt in range(6):
        try:
            ev = await client_().messages.create(model=A.model, convo=convo, identity=Identity(client=Client("dev"), use_case="unclassified"),
                                              sampling_params=SamplingParams(max_tokens=max(max_t, 2048)),
                                              thinking_params=ThinkingParams(reasoning_effort=ReasoningEffort("none" if small else A.reasoning)), **kw)
            break
        except Exception as e:
            last = e; print(f"upstream error (attempt {attempt + 1}): {repr(e)[:600]}", file=sys.stderr, flush=True)
            json.dump(body, open("/tmp/bridge-last-fail.json", "w"))
            await asyncio.sleep(4 * (attempt + 1))
    else:
        return web.json_response({"type": "error", "error": {"type": "api_error", "message": repr(last)[:500]}}, status=529)
    content = []
    for b in ev.content:
        t = getattr(b, "type", None); t = getattr(t, "value", t)
        if t == "text" and b.text: content.append({"type": "text", "text": b.text})
        elif t == "thinking":
            k = "br-" + uuid.uuid4().hex
            SIG[k] = ThinkingBlock(thinking=b.thinking or "", signature=getattr(b, "signature", None), reasoning_item_id=getattr(b, "reasoning_item_id", None), endpoint_signature=getattr(b, "endpoint_signature", None))
            content.append({"type": "thinking", "thinking": b.thinking or "", "signature": k})
        elif t == "tool_use":
            SIG[b.id] = ToolUseBlock(id=b.id, name=b.name, input=b.input or {}, thought_signature=getattr(b, "thought_signature", None), endpoint_signature=getattr(b, "endpoint_signature", None))
            content.append({"type": "tool_use", "id": b.id, "name": b.name, "input": b.input or {}})
    stop = "tool_use" if any(c["type"] == "tool_use" for c in content) else "end_turn"
    u = ev.usage
    tin = (u.uncached_input_tokens or 0) + (u.cached_input_tokens or 0) + (u.cache_write_tokens or 0) + (getattr(u, "cache_write_1h_tokens", 0) or 0)
    with open(A.log, "a") as f:
        f.write(json.dumps({"t": time.time(), "requested": body.get("model"), "served": ev.model_id or ev.model, "in": tin, "out": u.output_tokens, "reasoning": u.reasoning_tokens, "secs": round(time.time() - t0, 1), "tools": len(tools), "stop": stop}) + "\n")
    msg = {"id": "msg_" + uuid.uuid4().hex[:24], "type": "message", "role": "assistant", "model": body.get("model") or A.model, "content": content,
           "stop_reason": stop, "stop_sequence": None, "usage": {"input_tokens": tin, "output_tokens": u.output_tokens or 0}}
    if not body.get("stream"):
        return web.json_response(msg)
    resp = web.StreamResponse(headers={"Content-Type": "text/event-stream", "Cache-Control": "no-cache"}); await resp.prepare(req)
    async def ev_(name, data): await resp.write(f"event: {name}\ndata: {json.dumps(data)}\n\n".encode())
    await ev_("message_start", {"type": "message_start", "message": {**msg, "content": [], "stop_reason": None, "usage": {"input_tokens": tin, "output_tokens": 1}}})
    for i, c in enumerate(content):
        if c["type"] == "text":
            await ev_("content_block_start", {"type": "content_block_start", "index": i, "content_block": {"type": "text", "text": ""}})
            await ev_("content_block_delta", {"type": "content_block_delta", "index": i, "delta": {"type": "text_delta", "text": c["text"]}})
        elif c["type"] == "thinking":
            await ev_("content_block_start", {"type": "content_block_start", "index": i, "content_block": {"type": "thinking", "thinking": "", "signature": ""}})
            await ev_("content_block_delta", {"type": "content_block_delta", "index": i, "delta": {"type": "thinking_delta", "thinking": c["thinking"]}})
            await ev_("content_block_delta", {"type": "content_block_delta", "index": i, "delta": {"type": "signature_delta", "signature": c["signature"]}})
        else:
            await ev_("content_block_start", {"type": "content_block_start", "index": i, "content_block": {"type": "tool_use", "id": c["id"], "name": c["name"], "input": {}}})
            await ev_("content_block_delta", {"type": "content_block_delta", "index": i, "delta": {"type": "input_json_delta", "partial_json": json.dumps(c["input"])}})
        await ev_("content_block_stop", {"type": "content_block_stop", "index": i})
    await ev_("message_delta", {"type": "message_delta", "delta": {"stop_reason": stop, "stop_sequence": None}, "usage": {"output_tokens": u.output_tokens or 0}})
    await ev_("message_stop", {"type": "message_stop"})
    await resp.write_eof(); return resp


async def count_tokens(req):
    body = await req.json(); n = len(json.dumps(body)) // 4
    return web.json_response({"input_tokens": n})


async def other(req):
    return web.json_response({}, status=200 if req.method == "HEAD" else 404)


app = web.Application(client_max_size=256 << 20)
app.router.add_post("/v1/messages", handle)
app.router.add_post("/v1/messages/count_tokens", count_tokens)
app.router.add_route("*", "/{tail:.*}", other)
web.run_app(app, host="127.0.0.1", port=A.port, print=lambda *a: print(f"bridge on :{A.port} → {A.model} (reasoning {A.reasoning})", file=sys.stderr))
