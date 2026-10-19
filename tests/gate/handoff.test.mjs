// The handoff status is computed from the gate's record, never typed (v3.0.2). No browser: synthetic gate results.
//   node tests/gate/handoff.test.mjs
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const { writeRecord, handoffStatus, checkReport, statusLine, siteHash } = await import(join(ROOT, "skills/asfakulsiam-motomation-design/scripts/handoff.mjs"));
let bad = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) bad++; };
const fresh = () => { const d = mkdtempSync(join(tmpdir(), "handoff-")); writeFileSync(join(d, "index.html"), "<!doctype html><title>x</title><h1>Site</h1>"); return d; };
const J = (over = {}) => ({ pass: true, segment: "journey: nav0 mobile0 forms0 loading- errors0 session0", counts: {}, coverage: { formsUncovered: [], contractUnreached: [], notLoaded: [], sampled: [], notSampled: [] }, nav: { excused: [] }, forms: { prototype: [] }, mobile: { layoutLine: "layout 4/4" }, ...over });
const full = (j = J(), pass = true) => ({ target: "index.html", pass, verified: true, stamp: "gate: c0 …", journey: j, completeness: { pass: true } });
const M = { gate: "gate/4", skill: "3.0.2" };

let d = fresh();
say(handoffStatus(d).status === "NOT VALIDATED", "no record: NOT VALIDATED (the full gate never ran)");
writeRecord(d, "rules", [{ target: "index.html", pass: true }], M); writeRecord(d, "journey", [{ target: "index.html", ...J() }], M);
let s = handoffStatus(d); say(s.status === "NOT VALIDATED" && /no full gate run/.test(s.why) && s.dev.length === 2, `development checks only (--rules, --journey): NOT VALIDATED (${s.why.slice(0, 60)})`);
writeRecord(d, "full", [full()], M); s = handoffStatus(d);
say(s.status === "VALIDATED" && !s.exceptions.length, `full run, J passed, nothing unverified: VALIDATED (${statusLine(s)})`);
const h0 = siteHash(d).hash; writeFileSync(join(d, "index.html"), readFileSync(join(d, "index.html"), "utf8") + "<!-- motomation · critique: C4[x] · gate: c0 o0 w0 rm0 a0 · gate/4 · 0123456789 -->");
say(siteHash(d).hash === h0 && handoffStatus(d).status === "VALIDATED", "a pasted stamp is not a change: still VALIDATED");
writeFileSync(join(d, "GATE.md"), "notes"); say(handoffStatus(d).status === "VALIDATED", "writing GATE.md is not a change: still VALIDATED");
writeFileSync(join(d, "index.html"), "<!doctype html><title>x</title><h1>Edited after the gate</h1>"); s = handoffStatus(d);
say(s.status === "NOT VALIDATED" && /older files/.test(s.why), `the site changed after the full run: NOT VALIDATED (${s.why.slice(0, 50)})`);
rmSync(d, { recursive: true });

d = fresh(); writeRecord(d, "full", [full(J({ coverage: { formsUncovered: ["Delivery details (/checkout): default, validation, loading, success, serverError not verified (hidden behind an empty cart)"], contractUnreached: ["/404", "/account/orders"], notLoaded: [] }, forms: { prototype: ["Full name (/contact): simulated, labelled"] } }))], M); s = handoffStatus(d);
say(s.status === "CONDITIONAL" && s.exceptions.length === 2 && s.prototype.length === 1, `unverified checkout and an unreached Scope route: CONDITIONAL, never VALIDATED (${s.exceptions.length} exception(s); /404 not one)`);
const note = (body) => `# GATE\n\n${statusLine(s)}\n\n${body}`;
say(checkReport(note("## Not verified\n- the checkout form\n"), s).some((p) => /exception not written/.test(p)), "CONDITIONAL note that omits an exception: rejected");
say(!checkReport(note(`## Not verified\n${s.exceptions.map((e) => "- " + e).join("\n")}\n`), s).length, "CONDITIONAL note listing every exception: accepted");
say(checkReport(note(`${s.exceptions.map((e) => "- " + e).join("\n")}\n- All core journeys work end to end.\n`), s).some((p) => /claims/.test(p)), "CONDITIONAL note that claims all journeys work: rejected");
rmSync(d, { recursive: true });

d = fresh(); writeRecord(d, "full", [full(J({ pass: false, segment: "journey: nav1 mobile12 forms3" }), false)], M); s = handoffStatus(d);
say(s.status === "NOT VALIDATED" && /FAILS/.test(s.why), "full run with J failing: NOT VALIDATED");
writeRecord(d, "full", [full({ error: "browser crashed", pass: false, segment: "journey: not measured" }, true)], M); s = handoffStatus(d);
say(s.status === "NOT VALIDATED", `J not measured: NOT VALIDATED (${s.why.slice(0, 50)})`);
writeRecord(d, "full", [full({ pass: true, skipped: true, segment: "journey: skipped (--reference)" })], M); s = handoffStatus(d);
say(s.status === "REFERENCE", "a --reference run: REFERENCE, not VALIDATED");
writeRecord(d, "full", [full()], M); writeRecord(d, "not-verified", [{ target: "index.html", pass: false, verified: false, reason: "sandbox too constrained: 2 CPUs" }], M); s = handoffStatus(d);
say(s.status === "NOT VALIDATED" && /not verified/.test(s.why), "a later run that ended not verified (constrained machine): NOT VALIDATED, with the reason");
rmSync(d, { recursive: true });

// the v3.0.1 B2B note: J never ran, the note says the journeys connect
d = fresh(); writeRecord(d, "rules", [{ target: "index.html", pass: true }], M); s = handoffStatus(d);
const b2b = readFileSync(join(ROOT, "fixtures/handoff/b2b-overclaim-GATE.md"), "utf8"); const pb = checkReport(b2b, s);
say(pb.some((p) => /no "handoff:" line/.test(p)) && pb.some((p) => /All 3 core journeys connect/.test(p)), `the v3.0.1 B2B GATE.md is rejected: no status line, and "All 3 core journeys connect" with J never run (${pb.length} problem(s))`);
const honest = readFileSync(join(ROOT, "fixtures/handoff/honest-rules-only-GATE.md"), "utf8").replace("HASH", s.hash);
const ph = checkReport(honest, s); say(!ph.length, `an honest rules-only note is accepted (${ph.join("; ") || "no problem"})`);
say(checkReport(honest.replace("NOT VALIDATED", "VALIDATED"), s).some((p) => /record gives "NOT VALIDATED"/.test(p)), "a typed \"handoff: VALIDATED\" over a rules-only record is rejected");
rmSync(d, { recursive: true });
console.log(bad ? `\n${bad} failing` : "\nall handoff checks pass"); process.exit(bad ? 1 : 0);
