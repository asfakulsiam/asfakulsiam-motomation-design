// Run provenance: the generate phase must write <out>/meta.json with the repo commit, the browser version, the adapter,
// the model and a timestamp, before the runs start, and fill in the models the agents reported after them. Drives the
// real generate phase with fixtures/fake-claude.mjs (no model is called).   node tests/evals/run-meta.test.mjs
import { execFileSync } from "node:child_process"; import { mkdtempSync, readFileSync, chmodSync, existsSync } from "node:fs";
import { tmpdir } from "node:os"; import { join, dirname } from "node:path"; import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url)); const ROOT = join(HERE, "../.."); const FAKE = join(HERE, "fixtures/fake-claude.mjs"); chmodSync(FAKE, 0o755);
const out = mkdtempSync(join(tmpdir(), "runmeta-"));
execFileSync("node", [join(ROOT, "evals/run-agent-benchmark.mjs"), "generate", "--out", out, "--only", "studio", "--n", "1", "--arms", "skill", "--claude", FAKE], { cwd: ROOT, env: { ...process.env, FAKE_WANTS: "6", FAKE_MODEL: "fake-model-1" }, stdio: "pipe" });
const f = join(out, "meta.json"); let fails = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) fails++; };
say(existsSync(f), "meta.json written by generate");
const m = JSON.parse(readFileSync(f, "utf8")); const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
say(m.repo?.sha === head, `repo.sha is the checked-out commit (${m.repo?.short})`);
say(typeof m.repo?.dirty === "boolean", `repo.dirty recorded (${m.repo?.dirty})`);
say(m.adapter?.name === "claude-code" && /fake claude/.test(m.adapter?.version || ""), `adapter + its version (${m.adapter?.name}, ${m.adapter?.version})`);
say(m.browser && ("version" in m.browser) && (m.browser.version ? /^\d+\./.test(m.browser.version) : !!m.browser.note), `browser version (${m.browser?.version ?? m.browser?.note})`);
say("pinned" in (m.model || {}) && m.models_reported?.includes("fake-model-1"), `model: pinned ${m.model?.pinned}, reported ${JSON.stringify(m.models_reported)}`);
say(!isNaN(Date.parse(m.started)) && !isNaN(Date.parse(m.finished)) && Date.parse(m.finished) >= Date.parse(m.started), `timestamps (${m.started} → ${m.finished})`);
say(/^[0-9a-f]{16}$/.test(m.runner?.sha256 || "") && m.runs?.length === 1, `runner hash ${m.runner?.sha256}, runs ${JSON.stringify(m.runs)}`);
execFileSync("node", [join(ROOT, "evals/run-agent-benchmark.mjs"), "generate", "--out", out, "--only", "studio", "--n", "1", "--arms", "matched", "--claude", FAKE], { cwd: ROOT, env: { ...process.env, FAKE_WANTS: "6", FAKE_MODEL: "fake-model-1" }, stdio: "pipe" });
const m2 = JSON.parse(readFileSync(f, "utf8"));
say(m2.runs?.[0] === "studio/matched-s7101" && m2.previous?.length === 1 && m2.previous[0].runs?.[0] === "studio/skill-s7101", "a second generate call (matched arm) keeps the first call's meta under previous");
if (process.argv.includes("--print")) console.log(JSON.stringify(m, null, 1));
console.log(fails ? `\n${fails} failure(s)` : "\nmeta.json carries the run's provenance"); process.exit(fails ? 1 : 0);
