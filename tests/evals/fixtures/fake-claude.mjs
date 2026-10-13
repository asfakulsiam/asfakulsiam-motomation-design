#!/usr/bin/env node
// Stand-in for the `claude` CLI, for tests/evals/turn-cap.test.mjs, run-meta.test.mjs and bench-cache.test.mjs. It reproduces how Claude Code counts turns,
// as recorded in benchmark v4's transcripts (e.g. public/matched-s5101: --max-turns 14 → 14 model calls, then
// result {subtype: "error_max_turns", num_turns: 15}): an agent that wants W turns under --max-turns M reports
// success with num_turns W when W <= M, else error_max_turns with num_turns M + 1.
// FAKE_WANTS="30" or "8,30": turns wanted by the first session, then by each resume (last value repeats).
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
for (let i = 0; i < calls; i++) console.log(JSON.stringify({ type: "assistant", message: { id: `m${n}-${i}`, content: [{ type: "tool_use", name: "Write" }] } }));
writeFileSync("index.html", "<!doctype html><title>x</title>");
const capped = W > M;
console.log(JSON.stringify({ type: "result", subtype: capped ? "error_max_turns" : "success", num_turns: capped ? M + 1 : W, session_id: "fake-session" }));
process.exit(capped ? 1 : 0);
