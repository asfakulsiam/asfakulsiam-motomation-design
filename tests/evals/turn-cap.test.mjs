// Matched-arm turn cap: the runner must never let a matched run use more turns than its budget (the paired skill
// run's num_turns), counted the way Claude Code counts them. Drives the real `generate` phase of
// evals/run-agent-benchmark.mjs with fixtures/fake-claude.mjs as the agent (--claude), so no model is called.
//   node tests/evals/turn-cap.test.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url)); const ROOT = join(HERE, "../..");
const FAKE = join(HERE, "fixtures/fake-claude.mjs"); chmodSync(FAKE, 0o755);
const cases = [
  { name: "agent wants far more than the budget", budget: 14, wants: "30" },
  { name: "agent stops early, resumed to the floor", budget: 20, wants: "8,30" },
  { name: "agent stops just under the cap", budget: 20, wants: "17,30" },
  { name: "agent stops inside [floor, budget]", budget: 10, wants: "9" },
  { name: "several short resumes", budget: 27, wants: "5,4,4,4,30" },
];
let fails = 0;
for (const c of cases) {
  const out = mkdtempSync(join(tmpdir(), "turncap-")); const skill = join(out, "studio", "skill-s7101"); mkdirSync(skill, { recursive: true });
  writeFileSync(join(skill, "run.json"), JSON.stringify({ slug: "studio", seed: 7101, cond: "skill", turns: c.budget }));
  execFileSync("node", [join(ROOT, "evals/run-agent-benchmark.mjs"), "generate", "--out", out, "--only", "studio", "--n", "1", "--arms", "matched", "--claude", FAKE],
    { env: { ...process.env, FAKE_WANTS: c.wants }, stdio: "pipe" });
  const dir = join(out, "studio", "matched-s7101"); const run = JSON.parse(readFileSync(join(dir, "run.json"), "utf8")); const e = run.effort;
  const flagsPassed = readFileSync(join(dir, ".fake-log"), "utf8").trim().split("\n").map((l) => JSON.parse(l).maxTurns);
  const ok = e.used <= e.budget && e.enforced === (e.used >= e.floor && e.used <= e.budget) && run.turns === e.used;
  if (!ok) fails++;
  console.log(`${ok ? "ok  " : "FAIL"} ${c.name.padEnd(40)} budget ${e.budget} floor ${e.floor} → used ${e.used}${e.used > e.budget ? ` (OVER by ${e.used - e.budget})` : ""}, resumes ${e.resumes}, enforced ${e.enforced}, --max-turns passed ${flagsPassed.join(",")}`);
}
console.log(fails ? `\n${fails} case(s) let a matched run past its budget` : `\nall ${cases.length} cases: the cap is exact (used <= budget)`);
process.exit(fails ? 1 : 0);
