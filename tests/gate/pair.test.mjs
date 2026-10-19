// scripts/pair.mjs (v3.0.1): two directions of one product, route by route. A restyled copy fails (cosmetic-only, shared
// markup); a recomposed direction with the same form and logic passes (required parity is not repetition); a dropped
// route fails route parity.
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const S = join(ROOT, "skills/asfakulsiam-motomation-design/scripts/pair.mjs"), F = join(ROOT, "fixtures/pair");
let bad = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) bad++; };
const { classify, coherence, skeleton, sharedFiles } = await import(S);
say(classify({ structure: 0.8, composition: 0.6, typography: 0.3, image: null, overall: 0.5 }) === "cosmetic-only", "classify: same structure and composition, different type → cosmetic-only");
say(classify({ structure: 0.8, composition: 0.6, typography: 0.7, image: null, overall: 0.7 }) === "repeat", "classify: everything shared → repeat");
say(classify({ structure: 0.2, composition: 0.6, typography: 0.3, image: 0, overall: 0.28 }) === "partial", "classify: one of structure/composition shared → partial");
say(classify({ structure: 0.1, composition: 0.2, typography: 0.3, image: 0, overall: 0.2 }) === "recomposed", "classify: neither shared → recomposed");
say(skeleton('<body><form><input><select><option>a</select></form><main><h1>x</h1></main></body>').join() === "form,main,h1", "skeleton: form internals collapse to one token, inline tags dropped");
say(coherence([{ display: "a", body: "b" }, { display: "a", body: "b" }, { display: "c", body: "b" }]).share === 0.67, "coherence: share of routes on the dominant pairing");
const sf = sharedFiles(join(F, "archival"), join(F, "poster"));
say(sf.presentation.length === 0 && sf.logic.join() === "order.js", `shared files: the shared order.js is logic, not presentation (${sf.logic.join(", ")})`);
// v3.0.2: a structural pass with partial routes says so, and says it is not the rubric's strict every-axis test
{
  const { pairLines } = await import("../../skills/asfakulsiam-motomation-design/scripts/pair.mjs");
  const mk = (cls) => ({ route: "/" + cls, class: cls, score: { structure: 0.3, composition: cls === "partial" ? 0.44 : 0.2, overall: 0.3 }, fn: {}, markup: 0.2 });
  const base = { pass: true, threshold: 0.4, routes: { a: 3, b: 3, shared: 3, onlyA: [], onlyB: [], compared: ["/a", "/b", "/c"], skipped: [] }, viewports: ["1440x900"], coherence: { a: { share: 1 }, b: { share: 1 } }, sharedFiles: { presentation: [], logic: [] }, fails: [], notes: [], limits: "x" };
  const t = pairLines({ ...base, per: [mk("recomposed"), mk("partial"), mk("partial")] }).join("\n");
  say(/1 route\(s\) recomposed, 2 partial/.test(t) && /structural pass only/.test(t) && !/recomposed or partial/.test(t), "pair summary: partial routes are counted apart and the pass is labelled structural only");
  const u = pairLines({ ...base, per: [mk("recomposed")] }).join("\n");
  say(/1 route\(s\) recomposed, no shared/.test(u) && !/structural pass only/.test(u), "pair summary: an all-recomposed pair has no partial caveat");
}
const run = (...a) => { const r = spawnSync(process.execPath, [S, ...a, "--json"], { encoding: "utf8", maxBuffer: 32 << 20 }); return { code: r.status, j: r.status === 3 ? null : JSON.parse(r.stdout) }; };
const rs = run(join(F, "archival"), join(F, "reskin"), "--viewport", "1440x900");
if (rs.code === 3) { console.log("not verified — no browser"); process.exit(0); }
say(rs.code === 1 && rs.j.per.every((p) => ["cosmetic-only", "repeat"].includes(p.class) && p.sharedMarkup) && rs.j.per.some((p) => p.class === "cosmetic-only"), `reskin: every route fails (cosmetic-only or repeat) with shared markup (${rs.j.per.map((p) => `${p.route} ${p.class} ${p.markup}`).join("; ")})`);
const ps = run(join(F, "archival"), join(F, "poster"));
say(ps.code === 0 && ps.j.pass, `poster: recomposed direction passes (${ps.j.per.map((p) => `${p.route} ${p.class}`).join("; ")}${ps.j.fails.length ? " · " + ps.j.fails.join("; ") : ""})`);
say(ps.j.per.find((p) => p.route === "/subscribe").fn.forms === 1, "poster: the shared form is reported as full functional parity (1.00), not as repetition");
const tmp = mkdtempSync(join(tmpdir(), "pair-")); cpSync(join(F, "poster"), tmp, { recursive: true }); rmSync(join(tmp, "shop.html"));
const dr = run(join(F, "archival"), tmp, "--viewport", "1440x900");
say(dr.code === 1 && dr.j.routes.onlyA.join() === "/shop" && dr.j.fails.some((f) => /route parity/.test(f)), `dropped route: route parity fails (only in A: ${dr.j.routes.onlyA.join(", ")})`);
console.log(bad ? `\n${bad} failing` : "\npaired directions are measured route by route"); process.exit(bad ? 1 : 0);
