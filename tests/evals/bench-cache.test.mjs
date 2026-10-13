// Benchmark cache (v2.5.0, C8): the generate phase reuses a finished run when (brief, seed, arm, skill tree hash, model)
// are unchanged, and calls the agent again when any one of them changes. Unit tests on evals/bench-cache.mjs, then the
// real generate phase driven with fixtures/fake-claude.mjs as the agent (a mock: no model is called, no benchmark runs).
//   node tests/evals/bench-cache.test.mjs
import { execFileSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os"; import { join, dirname } from "node:path"; import { fileURLToPath } from "node:url";
import { cacheKey, skillTreeHash, cacheLookup, cacheStore, entryDir } from "../../evals/bench-cache.mjs";
const HERE = dirname(fileURLToPath(import.meta.url)); const ROOT = join(HERE, "../.."); const FAKE = join(HERE, "fixtures/fake-claude.mjs"); chmodSync(FAKE, 0o755);
let fails = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) fails++; };

// 1. the key: stable, and sensitive to each of the five parts
const base = { brief: "Brief A", seed: 7101, arm: "skill", skillHash: "a".repeat(64), model: "m1" };
const k = cacheKey(base);
say(/^[0-9a-f]{64}$/.test(k) && cacheKey({ ...base }) === k, "key is a stable sha256");
say(cacheKey({ model: "m1", skillHash: "a".repeat(64), arm: "skill", seed: 7101, brief: "Brief A" }) === k, "key ignores argument order");
for (const [part, v] of [["brief", "Brief B"], ["seed", 7102], ["arm", "baseline"], ["skillHash", "b".repeat(64)], ["model", "m2"]]) say(cacheKey({ ...base, [part]: v }) !== k, `changing ${part} changes the key`);
say(cacheKey({ ...base, arm: "matched:budget=20" }) !== cacheKey({ ...base, arm: "matched:budget=21" }), "matched arm: a different turn budget is a different key");
let threw = false; try { cacheKey({ ...base, model: null }); } catch { threw = true; } say(threw, "a missing part throws (no wildcard keys)");

// 2. the skill tree hash: content and path, not timestamps
const tree = mkdtempSync(join(tmpdir(), "tree-")); mkdirSync(join(tree, "sub")); writeFileSync(join(tree, "SKILL.md"), "one"); writeFileSync(join(tree, "sub/x.md"), "two");
const h1 = skillTreeHash(tree); const copy = mkdtempSync(join(tmpdir(), "tree-")); cpSync(tree, copy, { recursive: true });
say(skillTreeHash(copy) === h1, "the same files in another folder hash the same");
writeFileSync(join(copy, "sub/x.md"), "two!"); say(skillTreeHash(copy) !== h1, "one edited byte changes the hash");
mkdirSync(join(tree, "node_modules")); writeFileSync(join(tree, "node_modules/junk"), "x"); say(skillTreeHash(tree) === h1, "node_modules is ignored");

// 3. store and lookup
const cache = mkdtempSync(join(tmpdir(), "cache-")); const run = mkdtempSync(join(tmpdir(), "run-"));
writeFileSync(join(run, "index.html"), "<!doctype html>"); writeFileSync(join(run, "run.json"), JSON.stringify({ exit: 0, output: true }));
const dest = join(tmpdir(), `dest-${process.pid}`);
say(cacheLookup(cache, k, dest) === null, "lookup before store is a miss");
say(cacheStore(cache, k, run, base) === true && existsSync(join(entryDir(cache, k), "cache.json")), "store writes <dir>/<k[0..2]>/<k>/cache.json");
const got = cacheLookup(cache, k, dest);
say(got && got.key === k && readFileSync(join(dest, "index.html"), "utf8") === "<!doctype html>" && !existsSync(join(dest, "cache.json")), "lookup restores the run folder (without cache.json)");
say(!JSON.stringify(got.parts).includes("Brief A") && /^[0-9a-f]{64}$/.test(got.parts.brief_sha256), "the entry records the brief's hash, not its text");

// 4. the real generate phase with the mock agent
const out = mkdtempSync(join(tmpdir(), "bench-")); const counter = join(out, "calls.txt"); const cdir = join(out, "cache");
const gen = (extra = []) => execFileSync("node", [join(ROOT, "evals/run-agent-benchmark.mjs"), "generate", "--out", out, "--only", "studio", "--n", "1", "--arms", "skill", "--claude", FAKE, "--model", "fake-model-1", "--cache-dir", cdir, "--force", ...extra], { cwd: ROOT, env: { ...process.env, FAKE_WANTS: "5", FAKE_COUNTER: counter }, encoding: "utf8" });
const calls = () => (existsSync(counter) ? readFileSync(counter, "utf8").split("\n").filter(Boolean).length : 0);
const o1 = gen(); const rj = () => JSON.parse(readFileSync(join(out, "studio/skill-s7101/run.json"), "utf8"));
say(calls() === 1 && rj().cache?.hit === false && /cache: 0 hit\(s\), 1 miss\(es\), 1 stored/.test(o1), "first generate: miss, the agent runs once, the run is stored");
const o2 = gen();
say(calls() === 1 && rj().cache?.hit === true && /cache hit/.test(o2), "second generate, nothing changed: hit, the agent is not called");
const m = JSON.parse(readFileSync(join(out, "meta.json"), "utf8"));
say(m.cache?.hits === 1 && /^[0-9a-f]{64}$/.test(m.cache?.skill_tree_sha256 || "") && m.cache?.model === "fake-model-1", "meta.json records the cache dir, skill tree hash, model and hit count");
gen(["--model", "fake-model-2"]);
say(calls() === 2, "another model: miss, the agent runs again");
gen(["--no-cache"]);
say(calls() === 3 && rj().cache === undefined, "--no-cache: the agent runs, nothing is read or written");
const o5 = execFileSync("node", [join(ROOT, "evals/run-agent-benchmark.mjs"), "generate", "--out", out, "--only", "studio", "--n", "1", "--arms", "skill", "--claude", FAKE, "--cache-dir", cdir, "--force"], { cwd: ROOT, env: { ...process.env, FAKE_WANTS: "5", FAKE_COUNTER: counter }, encoding: "utf8" });
say(calls() === 4 && /cache: off for this call \(model not pinned/.test(o5), "unpinned model: cache off, said so, the agent runs");
console.log(fails ? `\n${fails} failure(s)` : "\nbenchmark cache: keyed on (brief, seed, arm, skill tree hash, model), reused only when all five match"); process.exit(fails ? 1 : 0);
