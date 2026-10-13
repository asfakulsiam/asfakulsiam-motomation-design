#!/usr/bin/env node
// Runs the Delivery Gate on the fixtures and checks it still tells good from bad.
//
//   node scripts/check-fixtures.mjs            fixtures/good must pass; gate/3 Q and A fixtures (pin-static,
//                                              pin-progress, rm-pinned, a11y-bad, a11y-good) and the film's progression;
//                                              fixtures/good must pass, fixtures/bad must fail with ≥ the counts in
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
const run = (target, timeout = process.env.GATE_TIMEOUT || "300") => {
  const r = spawnSync(process.execPath, [GATE, target, "--json", "--timeout", String(timeout)], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  let json = null; try { json = JSON.parse(r.stdout); } catch {}
  return { code: r.status, out: r.stdout, json };
};

let failed = 0;
// the synthetic fixtures each test one measured axis; since gate/4 they are judged on the core counts (c o w rm a n q k)
// so a single-concern page doesn't need a canonical and a CSP to prove its contrast. fixtures/good passes everything.
const RULES = ["copy", "seo", "perf", "sec"];
const coreOk = (r) => !!r.json && Object.entries(r.json.counts).every(([k, v]) => RULES.includes(k) || v === 0);
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
say(dim.json?.counts?.contrast > 0 && inactive > 0, `fixtures/synthetic/scroll-steps-dimmed fails on inactive steps (exit ${dim.code}, ${inactive} inactive-step contrast failure(s))`);
const leg = run("fixtures/synthetic/scroll-steps-legible.html");
say(coreOk(leg), `fixtures/synthetic/scroll-steps-legible passes the core axes (exit ${leg.code}${leg.json ? ` · ${leg.json.stamp}` : ""})`);
// gate/3 Q axis (motion quality): a pin that never changes fails progression; the same pin with motion passes; a
// reduced-motion fallback that stays pinned fails rm-distinctness; the real film's pinned chapters progress
const zonesOk = (r) => (r.json?.quality?.zones || []).every((z) => z.ok);
const ps = run("fixtures/synthetic/pin-static.html");
say(ps.json?.counts?.quality > 0 && ps.json?.quality?.zones?.length > 0 && !zonesOk(ps) && /Q\d\[prog:Δ/.test(ps.json?.critique || ""), `fixtures/synthetic/pin-static fails progression (exit ${ps.code}, ${(ps.json?.critique || "").match(/Q\d\[[^\]]+\]/)?.[0] || "no Q axis"})`);
const pp = run("fixtures/synthetic/pin-progress.html");
say(coreOk(pp) && zonesOk(pp) && pp.json?.quality?.rm?.ok, `fixtures/synthetic/pin-progress passes progression and rm (exit ${pp.code}, ${(pp.json?.critique || "").match(/Q\d\[[^\]]+\]/)?.[0] || "no Q axis"})`);
const rp = run("fixtures/synthetic/rm-pinned.html");
say(rp.json?.counts?.quality > 0 && zonesOk(rp) && rp.json?.quality?.rm?.pinned?.length > 0, `fixtures/synthetic/rm-pinned fails rm-distinctness: still pinned under reduced motion (exit ${rp.code}, ${(rp.json?.critique || "").match(/Q\d\[[^\]]+\]/)?.[0] || "no Q axis"})`);
// gate/3 A axis (accessibility): each deliberate failure in a11y-bad is caught; a11y-good passes every A check
const ab = run("fixtures/synthetic/a11y-bad.html"); const cat = ab.json?.access?.cat || {};
for (const k of ["focus", "target", "zoom", "forced", "trap"]) say(cat[k] > 0, `fixtures/synthetic/a11y-bad: ${k} caught (${cat[k] ?? "?"})`);
say(ab.json?.access?.reflow?.px > 1, `fixtures/synthetic/a11y-bad: 320px reflow caught (${ab.json?.access?.reflow?.px ?? "?"}px sideways)`);
const ag = run("fixtures/synthetic/a11y-good.html");
say(ag.json?.access?.fails === 0, `fixtures/synthetic/a11y-good passes every A check (${(ag.json?.critique || "").match(/A\d\[[^\]]+\]/)?.[0] || "no A axis"})`);
// the real film: every pinned chapter progresses (its other axes are judged by its own stamp and --verify)
const film = run("skills/asfakulsiam-motomation-design/examples/html/motomation-film.html", process.env.GATE_TIMEOUT_FILM || "1800"); // a 500vh film with Q + A axes runs past 300s on a 2–4 CPU runner
say(film.json?.quality?.zones?.length > 0 && zonesOk(film), `examples/html/motomation-film: ${film.json?.quality?.zones?.length ?? 0} pinned zone(s), all progress (${(film.json?.critique || "").match(/Q\d\[[^\]]+\]/)?.[0] || "no Q axis"})`);
process.exit(failed ? 1 : 0);
