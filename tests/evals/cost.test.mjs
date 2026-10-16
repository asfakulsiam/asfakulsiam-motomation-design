// Cost tracking: the generate phase writes <out>/cost.json with, per build, tokens in/out, wall-clock time, tool calls by
// type, retries with reasons, whether the build completed, and the route the agent stated. Drives the real generate
// phase with fixtures/fake-claude.mjs in FAKE_RICH mode (no model is called; this is not a benchmark run).
//   node tests/evals/cost.test.mjs [--print] [--keep <dir>]
import { execFileSync } from "node:child_process"; import { mkdtempSync, readFileSync, chmodSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os"; import { join, dirname, resolve } from "node:path"; import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url)); const ROOT = join(HERE, "../.."); const FAKE = join(HERE, "fixtures/fake-claude.mjs"); chmodSync(FAKE, 0o755);
const ki = process.argv.indexOf("--keep"); const keep = ki > -1 ? resolve(process.argv[ki + 1]) : null;
const outL = keep ? join(keep, "light") : mkdtempSync(join(tmpdir(), "cost-light-")), outF = keep ? join(keep, "full") : mkdtempSync(join(tmpdir(), "cost-full-"));
if (keep) { mkdirSync(outL, { recursive: true }); mkdirSync(outF, { recursive: true }); }
const gen = (out, extra, wants) => execFileSync("node", [join(ROOT, "evals/run-agent-benchmark.mjs"), "generate", "--out", out, "--only", "studio", "--n", "1", "--arms", "skill", "--claude", FAKE, "--no-cache", ...extra], { cwd: ROOT, env: { ...process.env, FAKE_WANTS: wants, FAKE_RICH: "1" }, encoding: "utf8" });
const logL = gen(outL, ["--route", "light"], "6"); const logF = gen(outF, [], "12");
let fails = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) fails++; };
for (const [out, route, log, turns] of [[outL, "light", logL, 6], [outF, "full", logF, 12]]) {
  const f = join(out, "cost.json"); say(existsSync(f), `${route}: cost.json written by generate (${/cost: .*/.exec(log)?.[0] || "no cost line"})`);
  const c = JSON.parse(readFileSync(f, "utf8")); const b = c.builds[0];
  say(c.schema === "motomation-cost/1" && c.builds.length === 1, `${route}: schema ${c.schema}, ${c.builds.length} build`);
  const tin = Array.from({ length: turns }, (_, i) => 1200 + i * 10).reduce((a, x) => a + x, 0), tout = Array.from({ length: turns }, (_, i) => 300 + i).reduce((a, x) => a + x, 0);
  say(b.tokens.in === tin && b.tokens.out === tout, `${route}: tokens in ${b.tokens.in} (expected ${tin}), out ${b.tokens.out} (expected ${tout})`);
  say(b.elapsed_ms > 0 && typeof b.elapsed === "string", `${route}: wall clock ${b.elapsed_ms} ms (${b.elapsed})`);
  say(b.tool_calls.total === turns && b.tool_calls.by_type.Bash === 4 && b.tool_calls.bash["script:gate"] === 2, `${route}: ${b.tool_calls.total} tool calls by type ${JSON.stringify(b.tool_calls.by_type)}, commands ${JSON.stringify(b.tool_calls.bash)}`);
  say(b.retries.count === 2 && b.retries.by_reason["tool error"] === 1 && b.retries.by_reason["gate re-run"] === 1, `${route}: retries ${b.retries.count} ${JSON.stringify(b.retries.by_reason)}`);
  say(b.completed === true && b.completion === "completed", `${route}: completed (${b.completion})`);
  say(b.route.stated === route && b.route.requested === (route === "light" ? "light" : null), `${route}: route stated "${b.route.stated}", requested ${b.route.requested}`);
}
const capped = mkdtempSync(join(tmpdir(), "cost-cap-")); try { gen(capped, ["--max-turns", "4"], "30"); } catch {}
const cc = JSON.parse(readFileSync(join(capped, "cost.json"), "utf8")).builds[0];
say(cc.completed === false && cc.completion === "turn cap reached", `a capped build is recorded as not completed (${cc.completion})`);
if (process.argv.includes("--print")) console.log(JSON.stringify(JSON.parse(readFileSync(join(outL, "cost.json"), "utf8")), null, 1));
console.log(fails ? `\n${fails} failure(s)` : "\ncost.json records every build's cost"); process.exit(fails ? 1 : 0);
