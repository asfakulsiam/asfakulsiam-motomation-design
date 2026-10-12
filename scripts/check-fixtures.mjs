#!/usr/bin/env node
// Runs the Delivery Gate on the fixtures and checks it still tells good from bad.
//
//   node scripts/check-fixtures.mjs            fixtures/good must pass, fixtures/bad must fail with ≥ the counts in
//                                              fixtures/bad/expected.json; the scroll-step fixtures must fail
//                                              (dimmed) and pass (legible)
//   REQUIRE_BROWSER=1 node scripts/check-fixtures.mjs   a missing browser is an error, not a skip (CI sets this
//                                              once Playwright installed)
//
// Playwright stays optional for the repo: without a browser this prints "not verified" and exits 0, unless
// REQUIRE_BROWSER=1. With a browser, any mismatch exits 1.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GATE = join(ROOT, "skills/asfakulsiam-motomation-design/scripts/gate.mjs");
const require = process.env.REQUIRE_BROWSER === "1";
const run = (target) => {
  const r = spawnSync(process.execPath, [GATE, target, "--json", "--timeout", process.env.GATE_TIMEOUT || "300"], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  let json = null; try { json = JSON.parse(r.stdout); } catch {}
  return { code: r.status, out: r.stdout, json };
};

let failed = 0;
const say = (ok, msg) => { console.log(`${ok ? "✓" : "✗"} ${msg}`); if (!ok) failed++; };

const good = run("fixtures/good/index.html");
if (good.code === 3) {
  console.log(`not verified — ${good.out.trim()}`);
  process.exit(require ? 1 : 0);
}
say(good.code === 0, `fixtures/good passes the gate (exit ${good.code}${good.json ? ` · ${good.json.stamp}` : ""})`);
if (good.code !== 0 && good.json) console.log(JSON.stringify(good.json.counts));

const bad = run("fixtures/bad/index.html");
const want = JSON.parse(readFileSync(join(ROOT, "fixtures/bad/expected.json"), "utf8"));
say(bad.code === want.exit, `fixtures/bad fails the gate (exit ${bad.code}, expected ${want.exit}${bad.json ? ` · ${bad.json.stamp}` : ""})`);
for (const [k, n] of Object.entries(want.atLeast)) {
  const got = bad.json?.counts?.[k];
  say(got >= n, `fixtures/bad: ${k} ${got ?? "?"} (expected ≥ ${n})`);
}
// scroll sequences (v2.5.0): a dimmed inactive step at 2.1:1 must fail, the same sequence at 8.3:1 must pass
const dim = run("fixtures/synthetic/scroll-steps-dimmed.html");
const inactive = (dim.json?.contrast?.fails || []).filter((f) => f.state === "inactive").length;
say(dim.code === 1 && inactive > 0, `fixtures/synthetic/scroll-steps-dimmed fails on inactive steps (exit ${dim.code}, ${inactive} inactive-step contrast failure(s))`);
const leg = run("fixtures/synthetic/scroll-steps-legible.html");
say(leg.code === 0, `fixtures/synthetic/scroll-steps-legible passes (exit ${leg.code}${leg.json ? ` · ${leg.json.stamp}` : ""})`);
process.exit(failed ? 1 : 0);
