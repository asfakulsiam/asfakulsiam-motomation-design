#!/usr/bin/env python3
"""Model adapter used for the v3 benchmark (2026-10-11): --model-cmd and --judge-cmd of evals/run-agent-benchmark.mjs.

It calls models through Perplexity's internal LLM SDK (pplx.python.sdks.llm_api), which is what the run had. It will not
run outside that environment: to reproduce with your own provider, keep the same stdin/stdout contract and swap the call.

Agent mode (stdin): JSON {model, system, messages:[{role, content: str | [{type:"text",text}|{type:"image",path}]}], max_tokens, reasoning}
                    reasoning = none|minimal|low|medium|high (default medium, as the v2 Claude Code runs)
Judge mode (argv) : pplx-llm.py <model> <prompt-file> <images-file>   (one image path per line; the prompt goes first)
stdout: the reply text. stderr: one JSON usage line (model requested and actually served, tokens, seconds).
"""
import asyncio, base64, json, sys, time, mimetypes
from pplx.python.sdks.llm_api import LLMAPIClient
from pplx.python.sdks.llm_api.types import (Client, Conversation, Identity, ImageBlock, ImageSource, ImageSourceType,
                                             Message, Role, ReasoningEffort, SamplingParams, TextBlock, ThinkingParams)


def blocks(content):
    if isinstance(content, str):
        return [TextBlock(text=content)]
    out = []
    for b in content:
        if b["type"] == "text":
            out.append(TextBlock(text=b["text"]))
        elif b["type"] == "image":
            data = base64.b64encode(open(b["path"], "rb").read()).decode()
            mt = mimetypes.guess_type(b["path"])[0] or "image/png"
            out.append(ImageBlock(source=ImageSource(type=ImageSourceType.BASE64, media_type=mt, data=data)))
    return out


async def main():
    if len(sys.argv) == 4:  # judge mode
        model, pf, imf = sys.argv[1:]
        imgs = [l.strip() for l in open(imf) if l.strip()]
        req = {"model": model, "max_tokens": 8000, "messages": [{"role": "user", "content": [{"type": "text", "text": open(pf).read()}] + [{"type": "image", "path": p} for p in imgs]}]}
    else:
        req = json.load(sys.stdin)
    convo = Conversation()
    if req.get("system"):
        convo.set_system(req["system"])
    for m in req["messages"]:
        convo.messages.append(Message(role=Role.USER if m["role"] == "user" else Role.ASSISTANT, content=blocks(m["content"])))
    client = LLMAPIClient()
    t0 = time.time()
    last = None
    for attempt in range(5):
        try:
            ev = await client.messages.create(model=req["model"], convo=convo, identity=Identity(client=Client("dev"), use_case="unclassified"),
                                              sampling_params=SamplingParams(max_tokens=int(req.get("max_tokens", 16000))),
                                              thinking_params=ThinkingParams(reasoning_effort=ReasoningEffort(req.get("reasoning", "medium"))))
            break
        except Exception as e:
            last = e
            await asyncio.sleep(5 * (attempt + 1))
    else:
        print(json.dumps({"error": repr(last)[:400]}), file=sys.stderr)
        sys.exit(2)
    text = "".join(getattr(b, "text", "") or "" for b in ev.content if str(b.type).endswith("text"))
    u = ev.usage
    print(json.dumps({"requested": req["model"], "served": ev.model_id or ev.model, "in": u.uncached_input_tokens + u.cached_input_tokens + (u.cache_write_tokens or 0) + (u.cache_write_1h_tokens or 0), "cached": u.cached_input_tokens,
                      "out": u.output_tokens, "reasoning": u.reasoning_tokens, "secs": round(time.time() - t0, 1)}), file=sys.stderr)
    sys.stdout.write(text)


asyncio.run(main())
