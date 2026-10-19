#!/usr/bin/env node
// keyboard-walk.mjs regression (v3.0.2, found by the independent judge of the 05-saas-dashboard run): a journey whose
// steps are all reached but whose form stays put (a required field the walk cannot type) must not read as completed,
// and a <select> named by <label for> must be found by its label.   node tests/evals/keyboard-walk.test.mjs (needs Playwright)
import { spawnSync } from "node:child_process"; import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os"; import { join } from "node:path"; import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../..", import.meta.url)); let fails = 0;
const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) fails++; };
const site = mkdtempSync(join(tmpdir(), "kw-")); mkdirSync(join(site, "saved"));
writeFileSync(join(site, "index.html"), `<!doctype html><title>t</title><main>
<form action="/saved/" method="get"><label for="amt">Amount</label><input id="amt" name="amt" required>
<label for="cat">Category</label><select id="cat" name="cat"><option>Supplies</option><option>Rent</option></select>
<button type="submit">Save expense</button></form><a href="/saved/">Saved list</a></main>`);
writeFileSync(join(site, "saved/index.html"), `<!doctype html><title>s</title><main><h1>Saved</h1></main>`);
const run = (...a) => { const r = spawnSync(process.execPath, [join(ROOT, "evals/keyboard-walk.mjs"), site, ...a, "--json"], { encoding: "utf8" }); return { code: r.status, json: (() => { try { return JSON.parse(r.stdout); } catch { return null; } })(), err: r.stderr }; };
const probe = run("--journey", "Category");
if (probe.code === 3) { console.log("not verified — Playwright is not installed"); process.exit(process.env.REQUIRE_BROWSER === "1" ? 1 : 0); }
say(probe.json?.journeys[0]?.reached === true, `a <select> is found by its <label for> name (${probe.json?.journeys[0]?.steps[0]})`);
const stuck = run("--journey", "Save expense", "--expect", "/saved/");
say(stuck.json?.journeys[0]?.reached === true && stuck.json?.journeys[0]?.outcome === "failed", `a submit blocked by a required field fails against --expect (outcome ${stuck.json?.journeys[0]?.outcome}, ended on ${stuck.json?.journeys[0]?.endedOn})`);
const noexp = run("--journey", "Save expense");
say(noexp.json?.journeys[0]?.outcome === "not-verified", `without --expect a reached journey is not-verified, not a pass (${noexp.json?.journeys[0]?.outcome})`);
const link = run("--journey", "Saved list", "--expect", "/saved/");
say(link.json?.journeys[0]?.outcome === "completed", `a journey that ends on the expected route is completed (${link.json?.journeys[0]?.outcome})`);
console.log(fails ? `\n${fails} failure(s)` : "\nkeyboard walk reports reached, completed and not verified apart"); process.exit(fails ? 1 : 0);
