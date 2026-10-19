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
say(frj.forms.ok === true && frj.forms.have === frj.forms.need && frj.forms.need >= 5, `form-replaced: success seen after the form is removed (${frj.forms.have}/${frj.forms.need}${frj.forms.fails.length ? ": " + frj.forms.fails[0].why : ""})`);
// v3.0.1 coverage: forms on pages linked after the first 12 (a contact page 16th in link order, a sign-up page one click
// deeper) are checked, a Scope route no link reaches is reported, and a home-page logo linking to itself is a response
const mp = run("many-pages"); const mpj = JSON.parse(mp.out);
say(mpj.forms.ok === true && mpj.forms.forms.length === 2 && mpj.forms.have === mpj.forms.need && mpj.forms.need >= 10, `many-pages: both late-linked forms checked (${mpj.forms.forms.length} form(s), ${mpj.forms.have}/${mpj.forms.need} states)`);
say(mpj.coverage && mpj.coverage.formPages.includes("/contact") && mpj.coverage.formPages.includes("/signup"), `many-pages: coverage names the form pages (${mpj.coverage?.formPages.join(", ")})`);
say(mpj.coverage && mpj.coverage.contractUnreached.join() === "/checkout", `many-pages: the Scope route no link reaches is reported (${mpj.coverage?.contractUnreached.join(", ") || "none"}), the dynamic one is skipped`);
say(mpj.coverage && mpj.coverage.notSampled.length === mpj.coverage.loaded - 12, `many-pages: pages beyond the tap/loading sample are listed (${mpj.coverage?.notSampled.length})`);
say(mpj.mobile.ok === true, `many-pages: a link to the current page (logo on home) counts as a response (${(mpj.mobile.fails || []).map((f) => f.el + ": " + f.why).join("; ") || "no fail"})`);
say(mp.code === 0 && mpj.pass, `many-pages: exit ${mp.code}, ${mpj.segment}`);
// v3.0.1: a page wider than the phone is one layout fail with its cause, not a list of taps that "did nothing"
const ov = run("overflow"); const ovj = JSON.parse(ov.out); const ovf = ovj.mobile.fails || [];
// v3.0.2: one cause shared by two pages is one failure naming both pages, not one per page
say(ovj.mobile.ok === false && ovf.length === 1 && ovf[0].gesture === "layout" && /div\.cta|header/.test(ovf[0].el + ovf[0].why) && /2 page\(s\)/.test(ovf[0].why), `overflow: reported once, as the layout cause shared by both pages (${ovf.length} fail(s): ${(ovf[0] || {}).why?.slice(0, 90)})`);
// v3.0.1: a form that rejects the auto-filled values (a calendar of available dates) is "not verified", not failed
const sf = run("strict-form"); const sfj = JSON.parse(sf.out);
say(sfj.forms.fails.length === 0 && (sfj.forms.uncovered || []).some((u) => /not verified/.test(u)), `strict-form: rejected fill is not verified, not failed (${sfj.forms.fails.map((f) => f.state + ": " + f.why).join("; ") || "no fail"})`);
// v3.0.1: clean URLs (/services answers services.html) are served as static hosts serve them, not read as broken links
const cu = run("clean-urls"); const cuj = JSON.parse(cu.out);
say(cu.code === 0 && cuj.nav.ok === true && cuj.nav.have === 3, `clean-urls: extensionless links resolve to .html files (nav ${cuj.nav.have}/${cuj.nav.need}, exit ${cu.code})`);
// v3.0.1: a live filter (no submit control) is not a submit flow; checkboxes disabled by an earlier pick are skipped; a
// confirm() dialog is a response; a disabled-until-complete submit and a save-then-next-step flow are not failed
const ll = run("live-and-locked"); const llj = JSON.parse(ll.out);
say(ll.code === 0 && llj.mobile.ok === true, `live-and-locked: disabled-by-limit checkboxes skipped, confirm() counts as a response (${(llj.mobile.fails || []).map((f) => f.el + ": " + f.why).join("; ") || "no fail"})`);
say(llj.forms.ok === true && llj.forms.forms.length === 2 && (llj.forms.live || []).length === 1, `live-and-locked: the filter is a live control, the builder and the checkout are checked (${llj.forms.forms.length} form(s), live ${(llj.forms.live || []).length})`);
const llb = llj.forms.forms.find((f) => /Choose two/.test(f.form)) || { states: {}, unverified: [] };
const llc = llj.forms.forms.find((f) => /Email/.test(f.form)) || { states: { x: 1 }, unverified: [] };
say(!Object.keys(llc.states).length && llc.unverified.length === 5, `live-and-locked: a checkout hidden behind an empty basket is not verified (5 states), not failed (${JSON.stringify(llc.states)}, unverified ${llc.unverified.length})`);
// v3.0.2: a save-then-next-step flow is a browser-only operation: its own states (feedback, honest), no server error to fake
say(llb.states.loading === true && llb.states.feedback === true && llb.states.honest === true && !("serverError" in llb.states) && !llb.unverified.includes("serverError") && llb.unverified.includes("validation"), `live-and-locked: save-then-next-step reads as a browser-only operation (loading, feedback, honest), locked validation not verified (${JSON.stringify(llb.states)}, unverified ${llb.unverified.join(",")})`);
// v3.0.2 honest operations: a form that sends nothing is read by what it did, and never claims what did not happen
const ho = run("honest-ops"); const hoj = JSON.parse(ho.out); const hf = (rx) => hoj.forms.forms.find((f) => rx.test(f.form)) || { states: {}, why: {} };
const [mis, sim, sav, lost, una, dbl] = [/Contact sales/, /Demo contact/, /Preferences/, /Notes/, /Booking/, /Order/].map(hf);
say(mis.states.honest === false && /no request/.test(mis.why.honest || ""), `honest-ops: a timer "Transmitting… received, a specialist will contact you" with no request fails honest (${mis.why.honest?.slice(0, 70)})`);
say(sim.operation === "interaction" && sim.states.feedback && sim.states.honest && !("serverError" in sim.states), `honest-ops: a labelled simulation ("nothing was sent") passes as interaction, no request states (${JSON.stringify(sim.states)})`);
say(sav.operation === "persisted" && sav.states.persisted === true && sav.states.honest === true, `honest-ops: a browser save that survives a reload passes as persisted (${JSON.stringify(sav.states)})`);
say(lost.states.persisted === false, `honest-ops: declared persisted but nothing written fails persisted (${lost.why.persisted?.slice(0, 60)})`);
say(una.operation === "interface" && una.states.honest === true, `honest-ops: an unavailable form that says so ("nothing was booked") passes (${JSON.stringify(una.states)}${una.why.honest ? " " + una.why.honest : ""})`);
say(dbl.states.duplicate === false && dbl.states.loading && dbl.states.success && dbl.states.serverError, `honest-ops: a server form without a double-submit guard fails duplicate only (${JSON.stringify(dbl.states)})`);
const sd = hf(/Schedule a demo|Work email/);
say(sd.states.honest === false && sd.operation !== "interaction", `honest-ops: a sales-demo form ("Schedule Demo" nav, "your demo instance") confirming with no request fails honest: the word demo is not a disclosure (${sd.operation} ${JSON.stringify(sd.states)})`);
say(ho.code === 1 && hoj.counts.forms === 4, `honest-ops: exactly the four dishonest or broken forms fail (forms ${hoj.counts.forms}, exit ${ho.code})`);
// v3.0.2 layout: one root cause across pages is one failure; overflow masked by overflow-x: hidden on the root is still found
const lc = run("layout-causes"); const lcj = JSON.parse(lc.out); const lf = (lcj.mobile.fails || []).filter((f) => f.gesture === "layout");
say(lf.length === 2 && lf.some((f) => f.el === "div.cta" && /3 page\(s\)/.test(f.why)) && lf.some((f) => f.el === "div.lanes" && /masked/.test(f.why)), `layout-causes: 2 causes (shared header on 3 pages, masked overflow), not 4 page fails (${lf.map((f) => f.el + ": " + f.why.slice(0, 50)).join(" | ")})`);
say(/320✗ 375✗/.test(lcj.mobile.layoutLine || "") && /1440✓/.test(lcj.mobile.layoutLine || ""), `layout-causes: widths 320, 375, 768, 1440 measured (${lcj.mobile.layoutLine})`);
// v3.0.2 routes: a confirmation reached by a form flow and a declared deep link are excused; an undeclared orphan fails
const re = run("routes-entry"); const rej = JSON.parse(re.out); const rf = rej.nav.fails.map((f) => f.route);
say(rf.length === 1 && rf[0] === "/orphan" && (rej.nav.excused || []).map((e) => e.route).sort().join() === "/confirmed,/status", `routes-entry: /confirmed (form flow) and /status (deep-link) excused, /orphan fails (fails ${rf.join(",")}; excused ${(rej.nav.excused || []).map((e) => e.route + ":" + e.entry).join(",")})`);
say(rej.pass === true || (rej.counts.nav === 1 && Object.entries(rej.counts).every(([k, n]) => k === "nav" || n === 0)), `routes-entry: only the orphan route fails (${rej.segment})`);
const { samplePages } = await import(join(ROOT, "skills/asfakulsiam-motomation-design/scripts/journey.mjs"));
const order = samplePages(["http://x/", "http://x/a", "http://x/b", "http://x/c.html"], { "/c": 1 }, "http://x/");
say(order.join() === "http://x/,http://x/c.html,http://x/a,http://x/b", `samplePages: home, then form pages, then the rest (${order.map((u) => new URL(u).pathname).join(" ")})`);
console.log(bad ? `\n${bad} failing` : "\nall journey checks pass"); process.exit(bad ? 1 : 0);
