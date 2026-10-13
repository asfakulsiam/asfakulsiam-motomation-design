#!/usr/bin/env python3
"""Public model adapter for evals/run-agent-benchmark.mjs: Anthropic Messages API (api.anthropic.com).

Same contract as evals/adapters/pplx-llm.py, with no SDK: Python 3.8+ standard library only.

  export ANTHROPIC_API_KEY=sk-ant-...          (read from the environment only; never put it in a file in the repo)
  Agent mode (stdin) : JSON {model, system, messages:[{role, content: str | [{type:"text",text}|{type:"image",path}]}],
                       max_tokens, reasoning}   reasoning = none|minimal|low|medium|high (default medium)
                       → --agent raw-api --model-cmd "python3 evals/adapters/anthropic.py"
  Judge mode (argv)  : anthropic.py <model> <prompt-file> <images-file>   (one image path per line; prompt first)
                       → --judge-cmd "python3 evals/adapters/anthropic.py {model} {prompt} {images}" --models claude-sonnet-4-5
  stdout: the reply text. stderr: one JSON usage line {requested, served, in, cached, out, reasoning, secs}.

Replay (no key, no network):
  anthropic.py --replay <model> <prompt-file> <images-file>   prints the judgment recorded next to the prompt file
                       (<base>.json "raw", written by the runner's judge phase), so judge + score re-run from the
                       committed judgments.
  MOTOMATION_RECORD=calls.jsonl   on a live run, append every answer keyed by a hash of the request; then
  anthropic.py --replay < request.json   answers that request from the recording (agent mode).

Reasoning maps to extended thinking: none/minimal → off, low 2048, medium 8000, high 16000 budget tokens
(ANTHROPIC_THINKING=off turns it off for models without extended thinking). Model names are Anthropic's
(claude-sonnet-4-5, claude-opus-4-1, ...): the benchmark's internal names (claude_sonnet_5_5) are labels of the
recorded runs, not API ids.
"""
import base64, hashlib, json, mimetypes, os, sys, time, urllib.error, urllib.request

# ---- shared by anthropic.py, openai.py, openrouter.py (each file is self-contained on purpose: copy one, it runs) ----
def replay_judge(prompt_file):
    """Judge-mode replay: the runner writes <base>.prompt.txt and, after a judged reply, <base>.json with the reply as
    "raw". Print that recorded reply again; no network, no key."""
    base = prompt_file[: -len(".prompt.txt")] if prompt_file.endswith(".prompt.txt") else os.path.splitext(prompt_file)[0]
    rec = base + ".json"
    if not os.path.exists(rec):
        print(json.dumps({"error": f"replay: no recorded judgment at {rec}"}), file=sys.stderr); sys.exit(2)
    raw = json.load(open(rec))["raw"]
    print(json.dumps({"requested": "replay", "served": "replay:" + os.path.basename(rec), "in": 0, "cached": 0, "out": 0, "reasoning": 0, "secs": 0}), file=sys.stderr)
    sys.stdout.write(json.dumps(raw))


def req_key(req):
    return hashlib.sha256(json.dumps(req, sort_keys=True).encode()).hexdigest()


def replay_agent(req):
    """Agent-mode replay: answers recorded with MOTOMATION_RECORD=<file.jsonl> are looked up by the request's hash."""
    path = os.environ.get("MOTOMATION_RECORD")
    if not path or not os.path.exists(path):
        print(json.dumps({"error": "replay: set MOTOMATION_RECORD to a recording made by a live run"}), file=sys.stderr); sys.exit(2)
    k = req_key(req)
    for line in open(path):
        r = json.loads(line)
        if r["key"] == k:
            print(json.dumps({**r["usage"], "served": "replay:" + r["usage"].get("served", "?")}), file=sys.stderr)
            sys.stdout.write(r["text"]); return
    print(json.dumps({"error": f"replay: request {k[:12]} not in {path}"}), file=sys.stderr); sys.exit(2)


def record(req, text, usage):
    path = os.environ.get("MOTOMATION_RECORD")
    if path:
        with open(path, "a") as f: f.write(json.dumps({"key": req_key(req), "text": text, "usage": usage}) + "\n")


def load_request(argv):
    """argv without --replay: [] → agent mode (JSON on stdin); [model, prompt-file, images-file] → judge mode."""
    if len(argv) == 3:
        model, pf, imf = argv
        imgs = [l.strip() for l in open(imf) if l.strip()]
        return "judge", pf, {"model": model, "max_tokens": 8000, "messages": [{"role": "user", "content": [{"type": "text", "text": open(pf).read()}] + [{"type": "image", "path": p} for p in imgs]}]}
    return "agent", None, json.load(sys.stdin)


def image_b64(path):
    return (mimetypes.guess_type(path)[0] or "image/png"), base64.b64encode(open(path, "rb").read()).decode()


def post(url, headers, body):
    last = None
    for attempt in range(5):
        try:
            rq = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"content-type": "application/json", **headers}, method="POST")
            with urllib.request.urlopen(rq, timeout=900) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            last = f"HTTP {e.code}: {e.read()[:400].decode(errors='replace')}"
            if e.code in (400, 401, 403, 404): break   # not transient: say so instead of retrying
        except Exception as e:
            last = repr(e)[:400]
        time.sleep(5 * (attempt + 1))
    print(json.dumps({"error": last}), file=sys.stderr); sys.exit(2)


def run(call):
    argv = sys.argv[1:]
    replay = argv[:1] == ["--replay"]
    if replay: argv = argv[1:]
    mode, pf, req = load_request(argv)
    if replay:
        return replay_judge(pf) if mode == "judge" else replay_agent(req)
    t0 = time.time()
    text, usage = call(req)
    usage = {"requested": req["model"], **usage, "secs": round(time.time() - t0, 1)}
    record(req, text, usage)
    print(json.dumps(usage), file=sys.stderr)
    sys.stdout.write(text)


BUDGET = {"none": 0, "minimal": 0, "low": 2048, "medium": 8000, "high": 16000}


def blocks(content):
    if isinstance(content, str): return [{"type": "text", "text": content}]
    out = []
    for b in content:
        if b["type"] == "text": out.append({"type": "text", "text": b["text"]})
        elif b["type"] == "image":
            mt, data = image_b64(b["path"]); out.append({"type": "image", "source": {"type": "base64", "media_type": mt, "data": data}})
    return out


def call(req):
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key: print(json.dumps({"error": "ANTHROPIC_API_KEY is not set"}), file=sys.stderr); sys.exit(2)
    max_tokens = int(req.get("max_tokens", 16000))
    body = {"model": req["model"], "max_tokens": max_tokens, "messages": [{"role": m["role"], "content": blocks(m["content"])} for m in req["messages"]]}
    if req.get("system"): body["system"] = req["system"]
    budget = BUDGET.get(req.get("reasoning", "medium"), 8000)
    if budget and os.environ.get("ANTHROPIC_THINKING") != "off":
        body["thinking"] = {"type": "enabled", "budget_tokens": budget}; body["max_tokens"] = max_tokens + budget
    r = post(os.environ.get("ANTHROPIC_BASE_URL", "https://api.anthropic.com").rstrip("/") + "/v1/messages",
             {"x-api-key": key, "anthropic-version": "2023-06-01"}, body)
    text = "".join(b.get("text", "") for b in r.get("content", []) if b.get("type") == "text")
    u = r.get("usage", {})
    cached = u.get("cache_read_input_tokens") or 0
    return text, {"served": r.get("model"), "in": (u.get("input_tokens") or 0) + cached + (u.get("cache_creation_input_tokens") or 0),
                  "cached": cached, "out": u.get("output_tokens") or 0, "reasoning": None}


if __name__ == "__main__":
    run(call)
