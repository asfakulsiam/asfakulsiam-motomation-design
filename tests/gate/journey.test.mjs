// Axis J bites in a real browser: the complete fixture passes all six journey checks, the incomplete one fails all six.
//   node tests/gate/journey.test.mjs        (needs Playwright + Chromium; without them it prints "not verified" and exits 0)
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const GATE = join(ROOT, "skills/asfakulsiam-motomation-design/scripts/gate.mjs");
let bad = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) bad++; };
const run = (dir) => { const r = spawnSync(process.execPath, [GATE, "--journey", "--json", join(ROOT, "fixtures/journey", dir)], { encoding: "utf8", maxBuffer: 32 << 20 }); return { code: r.status, out: r.stdout }; };
const c = run("complete");
if (c.code === 3) { console.log("not verified — no browser"); process.exit(0); }
const cj = JSON.parse(c.out);
say(c.code === 0 && cj.pass, `complete: exit ${c.code}, ${cj.segment}`);
for (const k of ["nav", "mobile", "forms", "loading", "errors", "session"]) say(cj[k].ok === true, `complete: ${k} measured and passes (${cj[k].have}/${cj[k].need})`);
const i = run("incomplete"); const ij = JSON.parse(i.out);
say(i.code === 1 && !ij.pass, `incomplete: exit ${i.code}, ${ij.segment}`);
for (const k of ["nav", "mobile", "forms", "loading", "errors", "session"]) say(ij[k].ok === false && ij.counts[k] > 0, `incomplete: ${k} fails (${ij.counts[k]} missing: ${(ij[k].fails[0] || {}).why || "?"})`);
// a form replaced by its success message (React/Vue unmount it) still has its success state seen
const fr = run("form-replaced"); const frj = JSON.parse(fr.out);
const wrapped = (frj.mobile.fails || []).filter((f) => /here now/.test(f.el));
say(!wrapped.length, `form-replaced: a link wrapped over two lines responds to a tap (${wrapped.map((f) => f.why).join("; ") || "no fail"})`);
say(frj.forms.ok === true && frj.forms.have === 5, `form-replaced: success seen after the form is removed (${frj.forms.have}/${frj.forms.need}${frj.forms.fails.length ? ": " + frj.forms.fails[0].why : ""})`);
// v3.0.1 coverage: forms on pages linked after the first 12 (a contact page 16th in link order, a sign-up page one click
// deeper) are checked, a Scope route no link reaches is reported, and a home-page logo linking to itself is a response
const mp = run("many-pages"); const mpj = JSON.parse(mp.out);
say(mpj.forms.ok === true && mpj.forms.forms.length === 2 && mpj.forms.have === 10, `many-pages: both late-linked forms checked (${mpj.forms.forms.length} form(s), ${mpj.forms.have}/${mpj.forms.need} states)`);
say(mpj.coverage && mpj.coverage.formPages.includes("/contact") && mpj.coverage.formPages.includes("/signup"), `many-pages: coverage names the form pages (${mpj.coverage?.formPages.join(", ")})`);
say(mpj.coverage && mpj.coverage.contractUnreached.join() === "/checkout", `many-pages: the Scope route no link reaches is reported (${mpj.coverage?.contractUnreached.join(", ") || "none"}), the dynamic one is skipped`);
say(mpj.coverage && mpj.coverage.notSampled.length === mpj.coverage.loaded - 12, `many-pages: pages beyond the tap/loading sample are listed (${mpj.coverage?.notSampled.length})`);
say(mpj.mobile.ok === true, `many-pages: a link to the current page (logo on home) counts as a response (${(mpj.mobile.fails || []).map((f) => f.el + ": " + f.why).join("; ") || "no fail"})`);
say(mp.code === 0 && mpj.pass, `many-pages: exit ${mp.code}, ${mpj.segment}`);
// v3.0.1: a page wider than the phone is one layout fail with its cause, not a list of taps that "did nothing"
const ov = run("overflow"); const ovj = JSON.parse(ov.out); const ovf = ovj.mobile.fails || [];
say(ovj.mobile.ok === false && ovf.length >= 1 && ovf.every((f) => /wider than the phone/.test(f.why)) && /div\.cta|header/.test(ovf[0].why), `overflow: reported as the layout cause (${ovf.length} fail(s): ${(ovf[0] || {}).why?.slice(0, 90)})`);
const { samplePages } = await import(join(ROOT, "skills/asfakulsiam-motomation-design/scripts/journey.mjs"));
const order = samplePages(["http://x/", "http://x/a", "http://x/b", "http://x/c.html"], { "/c": 1 }, "http://x/");
say(order.join() === "http://x/,http://x/c.html,http://x/a,http://x/b", `samplePages: home, then form pages, then the rest (${order.map((u) => new URL(u).pathname).join(" ")})`);
console.log(bad ? `\n${bad} failing` : "\nall journey checks pass"); process.exit(bad ? 1 : 0);
