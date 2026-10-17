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
console.log(bad ? `\n${bad} failing` : "\nall journey checks pass"); process.exit(bad ? 1 : 0);
