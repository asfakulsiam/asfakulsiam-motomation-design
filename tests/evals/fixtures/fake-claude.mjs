#!/usr/bin/env node
// Stand-in for the `claude` CLI, for tests/evals/turn-cap.test.mjs, run-meta.test.mjs and bench-cache.test.mjs. It reproduces how Claude Code counts turns,
// as recorded in benchmark v4's transcripts (e.g. public/matched-s5101: --max-turns 14 → 14 model calls, then
// result {subtype: "error_max_turns", num_turns: 15}): an agent that wants W turns under --max-turns M reports
// success with num_turns W when W <= M, else error_max_turns with num_turns M + 1.
// FAKE_WANTS="30" or "8,30": turns wanted by the first session, then by each resume (last value repeats).
// FAKE_RICH=1 (tests/evals/cost.test.mjs): each message also carries token usage, the first message states the route
// it read in the prompt, one Bash call fails and is retried, the gate runs twice, and the result event carries the
// session's total usage, the way Claude Code's stream-json does.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
const a = process.argv.slice(2);
if (a[0] === "--version") { console.log("0.0.0 (fake claude)"); process.exit(0); }
const M = +a[a.indexOf("--max-turns") + 1];
const wants = String(process.env.FAKE_WANTS || "30").split(",").map(Number);
const n = existsSync(".fake-calls") ? +readFileSync(".fake-calls", "utf8") : 0; writeFileSync(".fake-calls", String(n + 1));
appendFileSync(".fake-log", JSON.stringify({ call: n, maxTurns: M, resume: a.includes("--resume") }) + "\n");
if (process.env.FAKE_COUNTER) appendFileSync(process.env.FAKE_COUNTER, "call\n"); // bench-cache.test.mjs: counts real agent calls across run folders
const W = wants[Math.min(n, wants.length - 1)];
const calls = Math.min(W, M);
console.log(JSON.stringify({ type: "system", subtype: "init", model: process.env.FAKE_MODEL || "fake-model-1", session_id: "fake-session" })); // what Claude Code prints first
const rich = !!process.env.FAKE_RICH; const prompt = a[a.indexOf("-p") + 1] || ""; const route = /--route=light/.test(prompt) ? "light" : "full";
let tin = 0, tout = 0;
for (let i = 0; i < calls; i++) {
  if (!rich) { console.log(JSON.stringify({ type: "assistant", message: { id: `m${n}-${i}`, content: [{ type: "tool_use", name: "Write" }] } })); continue; }
  const usage = { input_tokens: 1200 + i * 10, output_tokens: 300 + i, cache_read_input_tokens: 5000, cache_creation_input_tokens: i === 0 ? 2000 : 0 }; tin += usage.input_tokens; tout += usage.output_tokens;
  const tool = i === 1 ? { type: "tool_use", id: `t${n}-${i}`, name: "Bash", input: { command: "node skill/scripts/collide.mjs --seed 7" } } : i === 2 ? { type: "tool_use", id: `t${n}-${i}`, name: "Bash", input: { command: "node skill/scripts/collide.mjs --seed 7 --json" } } : i === 3 || i === 5 ? { type: "tool_use", id: `t${n}-${i}`, name: "Bash", input: { command: "node skill/scripts/gate.mjs index.html" } } : { type: "tool_use", id: `t${n}-${i}`, name: i % 2 ? "Read" : "Write" };
  const content = i === 0 ? [{ type: "text", text: `Route: ${route} (fake agent, read from the prompt)` }, tool] : [tool];
  console.log(JSON.stringify({ type: "assistant", message: { id: `m${n}-${i}`, usage, content } }));
  console.log(JSON.stringify({ type: "user", message: { content: [{ type: "tool_result", tool_use_id: tool.id, is_error: i === 1, content: i === 1 ? "Error: collide.mjs: unknown flag --sed" : "ok" }] } }));
}
writeFileSync("index.html", "<!doctype html><title>x</title>");
const capped = W > M;
console.log(JSON.stringify({ type: "result", subtype: capped ? "error_max_turns" : "success", num_turns: capped ? M + 1 : W, session_id: "fake-session", ...(rich ? { usage: { input_tokens: tin, output_tokens: tout, cache_read_input_tokens: 5000 * calls, cache_creation_input_tokens: 2000 }, duration_ms: 1234, total_cost_usd: 0.0123 } : {}) }));
process.exit(capped ? 1 : 0);
