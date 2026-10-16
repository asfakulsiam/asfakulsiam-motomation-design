#!/usr/bin/env node
// Cost: what one build took. Tokens in and out, wall-clock time, tool calls by type, retries with their reason, whether
// the build completed, and which route the agent said it took (full or light). Read from the agent's own transcript and
// the runner's run.json, never estimated.
//
//   node scripts/cost.mjs record <build dir> [--json] [--out file]   one build: reads <dir>/transcript.jsonl (+ .gz) and run.json
//   node scripts/cost.mjs aggregate <run dir> [--json]               every build under <run>/<brief>/<arm>-s<seed>/ →
//                                                                    <run>/cost.json (per build, per arm, per route, totals)
//
// Transcript formats: Claude Code stream-json (assistant messages with usage and tool_use blocks, user messages with
// tool_result blocks, a final result event), Codex `exec --json` (item.completed events, turn.completed usage), and
// the runner's raw-API agent (one JSON line per turn with usage {in, out} and actions). Unknown lines are ignored.
//
// Retries are counted, each with a reason:
//   tool error      a tool call that returned an error, followed by another call of the same tool (the agent tried again)
//   gate re-run     scripts/gate.mjs run again after a run in the same build (fix, then check again); the first run is not
//                   a retry
//   resume          the runner resumed the session (matched arm: turn floor not reached), from run.json effort.resumes
//   api retry       the agent CLI reported a retried model request (stream-json system events with "retry" in the subtype)
// Completed means: the agent exited 0, the build output exists (index.html or a build folder), and the agent's final
// result was not an error (turn cap, timeout). Anything else is recorded as not completed, with the reason.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const COST_SCHEMA = "motomation-cost/1";
const BUILD_DIRS = ["out", "dist", "build", ".output/public", "_site", "public"];
const ROUTE_RX = /\bRoute:\s*(light|full|short)\b/i;

const readTranscript = (dir) => {
  const f = join(dir, "transcript.jsonl"), gz = f + ".gz";
  if (existsSync(f)) return readFileSync(f, "utf8"); if (existsSync(gz)) return gunzipSync(readFileSync(gz)).toString("utf8"); return null;
};
const lines = (text) => (text || "").split("\n").map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
/** what a Bash command is for: the skill script it runs, else its first word */
export const bashKind = (cmd = "") => { const m = String(cmd).match(/scripts\/([a-z-]+)\.mjs/); if (m) return `script:${m[1]}`; const w = String(cmd).trim().split(/\s+/)[0] || "?"; return `cmd:${basename(w)}`; };
const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };

/** parse any supported transcript into tokens, tool calls, retries, route, final result */
export function parseTranscript(text) {
  const out = { format: null, tokens: { in: 0, out: 0, cache_read: 0, cache_write: 0 }, tool_calls: { total: 0, by_type: {}, bash: {} }, retries: { count: 0, by_reason: {}, events: [] }, route: null, result: null, model: null, agent_ms: null };
  const evs = lines(text); if (!evs.length) return out;
  const calls = []; // [{ id, name, kind, error }]
  const seenMsg = new Set(); const fromResults = { in: 0, out: 0, cache_read: 0, cache_write: 0, n: 0 };
  for (const e of evs) {
    // Claude Code stream-json
    if (e.type === "system" && e.subtype === "init") { out.format ||= "claude-code"; out.model ||= e.model || null; continue; }
    if (e.type === "system" && /retry/i.test(e.subtype || "")) { out.format ||= "claude-code"; out.retries.events.push({ reason: "api retry", detail: e.error || e.message || e.subtype }); continue; }
    if (e.type === "assistant" && e.message) {
      out.format ||= "claude-code"; const m = e.message;
      // usage is per API message; stream-json repeats a message id once per content block, so count each id once
      if (m.usage && !(m.id && seenMsg.has(m.id))) { out.tokens.in += m.usage.input_tokens || 0; out.tokens.out += m.usage.output_tokens || 0; out.tokens.cache_read += m.usage.cache_read_input_tokens || 0; out.tokens.cache_write += m.usage.cache_creation_input_tokens || 0; }
      if (m.id) seenMsg.add(m.id);
      for (const c of m.content || []) {
        if (c.type === "tool_use") calls.push({ id: c.id, name: c.name, kind: c.name === "Bash" ? bashKind(c.input?.command) : c.name });
        if (c.type === "text" && !out.route) { const r = String(c.text || "").match(ROUTE_RX); if (r) out.route = r[1].toLowerCase() === "short" ? "light" : r[1].toLowerCase(); }
      }
      continue;
    }
    if (e.type === "user" && e.message) { for (const c of e.message.content || []) if (c.type === "tool_result" && c.is_error) { const hit = calls.find((x) => x.id === c.tool_use_id); if (hit) { hit.error = true; hit.detail = (Array.isArray(c.content) ? c.content.map((x) => x.text || "").join(" ") : String(c.content || "")).split("\n")[0].slice(0, 120); } } continue; }
    if (e.type === "result") { out.format ||= "claude-code"; out.result = { subtype: e.subtype || null, is_error: !!e.is_error, num_turns: e.num_turns ?? null };
      // each session's result event carries that session's total usage; a resumed build has one per session, summed
      if (e.usage && (e.usage.input_tokens || e.usage.output_tokens)) { const u = e.usage; fromResults.in += u.input_tokens || 0; fromResults.out += u.output_tokens || 0; fromResults.cache_read += u.cache_read_input_tokens || 0; fromResults.cache_write += u.cache_creation_input_tokens || 0; fromResults.n++; }
      if (e.duration_ms) out.agent_ms = (out.agent_ms || 0) + e.duration_ms; if (e.total_cost_usd !== undefined) out.usd = (out.usd || 0) + e.total_cost_usd; continue; }
    // Codex exec --json
    if (e.type === "item.completed" && e.item) { out.format ||= "codex"; const it = e.item;
      if (/command_execution/.test(it.type)) calls.push({ id: it.id, name: "command", kind: bashKind(it.command), error: it.exit_code !== undefined && it.exit_code !== 0, detail: it.aggregated_output?.split("\n")[0] });
      else if (/file_change/.test(it.type)) calls.push({ id: it.id, name: "file_change", kind: "file_change", error: it.status === "failed" });
      else if (/mcp_tool_call/.test(it.type)) calls.push({ id: it.id, name: "mcp", kind: `mcp:${it.tool || "?"}`, error: it.status === "failed" });
      else if (/agent_message/.test(it.type) && !out.route) { const r = String(it.text || "").match(ROUTE_RX); if (r) out.route = r[1].toLowerCase() === "short" ? "light" : r[1].toLowerCase(); }
      continue; }
    if (e.type === "turn.completed" && e.usage) { out.format ||= "codex"; out.tokens.in += e.usage.input_tokens || 0; out.tokens.out += e.usage.output_tokens || 0; out.tokens.cache_read += e.usage.cached_input_tokens || 0; continue; }
    // the runner's raw-API agent: { turn, reply, actions: [{ tool, ... }], results, usage: { in, out } }
    if (e.turn !== undefined && (e.actions || e.usage)) { out.format ||= "raw-api"; if (e.usage) { out.tokens.in += e.usage.in || 0; out.tokens.out += e.usage.out || 0; }
      (e.actions || []).forEach((a, i) => { const res = (e.results || [])[i] || ""; calls.push({ id: `${e.turn}-${i}`, name: a.tool || a.type || "action", kind: a.tool === "bash" || a.type === "bash" ? bashKind(a.cmd || a.command) : a.tool || a.type || "action", error: /^(error|ERROR)|exit code [1-9]/.test(String(res)) }); });
      if (!out.route) { const r = String(e.reply || "").match(ROUTE_RX); if (r) out.route = r[1].toLowerCase() === "short" ? "light" : r[1].toLowerCase(); } continue; }
  }
  if (fromResults.n) { const { n, ...t } = fromResults; out.tokens = t; out.tokens_source = "result events (session totals)"; } else if (out.tokens.in + out.tokens.out) out.tokens_source = "per-message usage";
  for (const c of calls) { out.tool_calls.total++; bump(out.tool_calls.by_type, c.name); if (c.kind !== c.name) bump(out.tool_calls.bash, c.kind); }
  // retries: an errored call followed by a call of the same kind; a gate run after the first
  calls.forEach((c, i) => { if (!c.error) return; const next = calls.slice(i + 1).find((x) => x.kind === c.kind); if (next) out.retries.events.push({ reason: "tool error", tool: c.kind, detail: c.detail || null }); });
  const gates = calls.filter((c) => c.kind === "script:gate").length; for (let i = 1; i < gates; i++) out.retries.events.push({ reason: "gate re-run" });
  return out;
}

const built = (dir) => existsSync(join(dir, "index.html")) || BUILD_DIRS.some((d) => existsSync(join(dir, d, "index.html")));
/** one build's cost record, from its folder (transcript.jsonl + run.json) */
export function costRecord(dir, extra = {}) {
  const run = existsSync(join(dir, "run.json")) ? JSON.parse(readFileSync(join(dir, "run.json"), "utf8")) : {};
  const t = parseTranscript(readTranscript(dir));
  const events = [...t.retries.events]; for (let i = 0; i < (run.effort?.resumes || 0); i++) events.push({ reason: "resume", detail: "turn floor not reached (matched arm)" });
  const by_reason = {}; for (const ev of events) bump(by_reason, ev.reason);
  // raw-API runs record their own token totals; prefer what the transcript shows, fall back to run.json
  const tokens = t.tokens.in + t.tokens.out > 0 ? t.tokens : run.tokens ? { in: run.tokens.in || 0, out: run.tokens.out || 0, cache_read: 0, cache_write: 0 } : t.tokens;
  const output = run.output ?? built(dir);
  const capped = t.result?.subtype === "error_max_turns" || run.finished === "turn cap";
  const reason = run.exit === undefined ? "no run.json" : run.exit !== 0 && !capped ? `agent exited ${run.exit}${run.finished === "error" ? " (error)" : ""}` : capped ? "turn cap reached" : !output ? "no build output" : t.result?.is_error ? `agent reported ${t.result.subtype || "an error"}` : "completed";
  const elapsed_ms = run.elapsed_ms ?? (run.seconds !== undefined ? run.seconds * 1000 : null);
  return {
    schema: COST_SCHEMA, build: run.slug ? `${run.slug}/${run.cond}-s${run.seed}` : basename(dir), dir: dir,
    arm: run.cond || null, brief: run.slug || null, seed: run.seed ?? null,
    route: { stated: t.route, requested: run.route || null },
    tokens: { ...tokens, total: tokens.in + tokens.out },
    elapsed_ms, elapsed: elapsed_ms === null ? null : `${Math.floor(elapsed_ms / 60000)}m ${Math.round((elapsed_ms % 60000) / 1000)}s`, agent_ms: t.agent_ms,
    tool_calls: t.tool_calls, retries: { count: events.length, by_reason, events: events.slice(0, 50) },
    turns: run.turns ?? t.result?.num_turns ?? null,
    completed: reason === "completed", completion: reason,
    cache: run.cache?.hit ? { hit: true, note: "copied from the cache: these are the numbers of the run that produced it, not of this session" } : undefined,
    transcript: t.format, model: t.model, usd: t.usd, ...extra,
  };
}
const sum = (rs, f) => rs.reduce((a, r) => a + (f(r) || 0), 0);
const group = (rs) => ({ builds: rs.length, completed: rs.filter((r) => r.completed).length, tokens_in: sum(rs, (r) => r.tokens.in), tokens_out: sum(rs, (r) => r.tokens.out), elapsed_ms: sum(rs, (r) => r.elapsed_ms), tool_calls: sum(rs, (r) => r.tool_calls.total), retries: sum(rs, (r) => r.retries.count),
  per_build: rs.length ? { tokens_in: Math.round(sum(rs, (r) => r.tokens.in) / rs.length), tokens_out: Math.round(sum(rs, (r) => r.tokens.out) / rs.length), elapsed_ms: Math.round(sum(rs, (r) => r.elapsed_ms) / rs.length), tool_calls: +(sum(rs, (r) => r.tool_calls.total) / rs.length).toFixed(1), retries: +(sum(rs, (r) => r.retries.count) / rs.length).toFixed(1) } : null });
/** every build under a run folder → <run>/cost.json */
export function aggregate(runDir, { write = true } = {}) {
  const records = [];
  for (const brief of readdirSync(runDir)) { const bd = join(runDir, brief); if (!statSync(bd).isDirectory()) continue;
    for (const arm of readdirSync(bd)) { const d = join(bd, arm); if (!/-s\d+$/.test(arm) || !statSync(d).isDirectory() || !existsSync(join(d, "run.json"))) continue; records.push(costRecord(d)); } }
  for (const r of records) r.dir = r.dir.replace(resolve(runDir) + "/", "");
  const by = (k) => { const o = {}; for (const r of records) (o[k(r) ?? "unknown"] ||= []).push(r); return Object.fromEntries(Object.entries(o).map(([x, rs]) => [x, group(rs)])); };
  const out = { schema: COST_SCHEMA, run: basename(resolve(runDir)), generated: new Date().toISOString(), totals: group(records), by_arm: by((r) => r.arm), by_route: by((r) => r.route.stated || r.route.requested || "not stated"), builds: records };
  if (write) writeFileSync(join(runDir, "cost.json"), JSON.stringify(out, null, 1));
  return out;
}

function print(rec) {
  console.log(`${rec.build} · ${rec.completed ? "completed" : `NOT completed (${rec.completion})`} · route ${rec.route.stated || "not stated"}${rec.route.requested ? ` (requested ${rec.route.requested})` : ""}`);
  console.log(`  tokens   in ${rec.tokens.in} · out ${rec.tokens.out}${rec.tokens.cache_read ? ` · cache read ${rec.tokens.cache_read}` : ""}${rec.tokens.cache_write ? ` · cache write ${rec.tokens.cache_write}` : ""}`);
  console.log(`  time     ${rec.elapsed ?? "not recorded"} wall clock${rec.agent_ms ? ` (agent reported ${Math.round(rec.agent_ms / 1000)}s)` : ""}`);
  console.log(`  tools    ${rec.tool_calls.total} call(s): ${Object.entries(rec.tool_calls.by_type).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}${Object.keys(rec.tool_calls.bash).length ? ` · commands: ${Object.entries(rec.tool_calls.bash).map(([k, v]) => `${k} ${v}`).join(", ")}` : ""}`);
  console.log(`  retries  ${rec.retries.count}${rec.retries.count ? `: ${Object.entries(rec.retries.by_reason).map(([k, v]) => `${k} ${v}`).join(", ")}` : ""}`);
}
async function main() {
  const [cmd, target, ...rest] = process.argv.slice(2); const json = rest.includes("--json"); const oi = rest.indexOf("--out");
  const USAGE = "Usage: node scripts/cost.mjs record <build dir> [--json] [--out file] | aggregate <run dir> [--json]";
  if (!cmd || cmd === "--help" || cmd === "-h") { console.log(USAGE); process.exit(cmd ? 0 : 2); }
  if (!["record", "aggregate"].includes(cmd) || !target) { console.error(`cost: ${!target ? "missing folder" : `unknown command "${cmd}"`}\n${USAGE}`); process.exit(2); }
  if (!existsSync(target) || !statSync(target).isDirectory()) { console.error(`cost: not a folder: ${target}\n${USAGE}`); process.exit(2); }
  if (cmd === "record") { const rec = costRecord(resolve(target)); if (oi > -1 && rest[oi + 1]) writeFileSync(rest[oi + 1], JSON.stringify(rec, null, 1)); if (json) console.log(JSON.stringify(rec, null, 1)); else print(rec); return; }
  const agg = aggregate(resolve(target));
  if (json) { console.log(JSON.stringify(agg, null, 1)); return; }
  console.log(`cost · ${agg.run} · ${agg.totals.builds} build(s), ${agg.totals.completed} completed → ${join(target, "cost.json")}`);
  for (const r of agg.builds) print(r);
  for (const [k, g] of Object.entries(agg.by_route)) console.log(`route ${k}: ${g.builds} build(s), per build: ${g.per_build.tokens_in} in / ${g.per_build.tokens_out} out tokens, ${Math.round(g.per_build.elapsed_ms / 1000)}s, ${g.per_build.tool_calls} tool calls, ${g.per_build.retries} retries`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
