// Drift test for scripts/template-rules.mjs: the rules must catch each known violation (the four P1 cases, fed as
// text), and every shipped template must satisfy them (Tier 5 film templates included). A rule that stops biting, or a template that drifts out of
// range, fails here.   node tests/templates/template-rules.test.mjs
import { readFileSync, existsSync, readdirSync } from "node:fs"; import { join, dirname } from "node:path"; import { fileURLToPath } from "node:url";
import { dials, pins, timingSheet, imagery, noPlaceholderArt, tier5Assets } from "../../scripts/template-rules.mjs";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../.."); const T = join(ROOT, "skills/asfakulsiam-motomation-design/examples/templates");
const D = (e, r, m, t, extra = "") => `- **Dials:** ENERGY ${e} · RHYTHM ${r} · MOTION ${m} → Tier ${t}${extra}\n`;
let fails = 0; const say = (ok, msg) => { console.log(`${ok ? "ok  " : "FAIL"} ${msg}`); if (!ok) fails++; };
// the violations P1 found (as they were before the fix) must be caught
say(dials(D(4, 3, 4, 4), 4).some((p) => /ENERGY 4 is out of range/.test(p)) && dials(D(4, 3, 4, 4), 4).some((p) => /MOTION 4 is out of range/.test(p)), "event as it was (ENERGY 4 · MOTION 4) → out of range");
say(dials(D(1, 2, 1, 2), 2).some((p) => /MOTION 1 allows Tier 1, but the page is Tier 2/.test(p)), "editorial-article as it was (MOTION 1 → Tier 2) → tier outside the dial's range");
say(dials(D(1, 1, 1, 2), 2).some((p) => /MOTION 1 allows Tier 1/.test(p)), "personal as it was (MOTION 1 → Tier 2) → tier outside the dial's range");
say(pins("critique: C5[x] H5[375:0] S5[x] R4[x] M4[t2:pins4/2,webgl0/1,js68/80KB,rm0] V5[x]").length === 1, "shop-product as it was (pins4/2) → over the pin budget");
// and the edges
say(dials(D(3, 3, 3, 4), 4).some((p) => /spatial/.test(p)), "MOTION 3 at Tier 4 without a named spatial concept → caught");
say(dials(D(2, 2, 2, 2), 3).some((p) => /components make it Tier 3/.test(p)), "DESIGN.md tier ≠ built tier → caught");
say(dials(D(2, 2, 2, 2), 2).length === 0 && pins("critique: M5[t2:pins2/2,webgl0/1]").length === 0, "in range and at budget → no problem");
say(timingSheet(4, null).length === 1 && timingSheet(2, null).length === 0, "timing sheet required at Tier 3–5 only");
const OLD = "\n## Imagery\n- Source: Photographs [NEEDS ASSET]\n- Treatment: none beyond what the section does\n";
say(imagery(OLD).length >= 2, "the old Imagery boilerplate (no Mode, no direction) → caught");
say(imagery("\n## Imagery\n- Mode: photography\n").some((p) => /stand-in/.test(p)) && imagery("\n## Imagery\n- Mode: none. words\n").length === 0, "photography without a stand-in → caught; Mode none → fine");
say(noPlaceholderArt('<img src={art(31, ["#e9d8bd", "#a8643a", "#f2c879"], 1600, 1000)} />', "x.tsx").length === 1 && noPlaceholderArt("// the old art() bands", "y.tsx").length === 0, "a section calling art() → caught (comments ignored)");
const SEC = join(ROOT, "skills/asfakulsiam-motomation-design/examples/sections");
const artLeft = readdirSync(SEC).filter((f) => f.endsWith(".tsx")).flatMap((f) => noPlaceholderArt(readFileSync(join(SEC, f), "utf8"), f));
say(artLeft.length === 0, `no section calls art()${artLeft.length ? ": " + artLeft.join("; ") : ""}`);
// Tier 5 assets: a film template without its poster, MOTION.md, manifest or fetch step is caught; a full one passes,
// with its frames on disk (fetched or rebuilt) or without them (main ships the lock, not the frames)
const seq = (n, d = "frames") => Array.from({ length: n }, (_, i) => `${d}/${String(i + 1).padStart(4, "0")}.webp`);
const SLIM = ["poster.webp", "MOTION.md", "DESIGN.md", "index.html", "frames.json", "frames.lock.json"];
const FULL = [...seq(180), ...seq(90, "frames-mobile"), ...SLIM];
const MAN = JSON.stringify({ desktop: { frames: 180 } });
const LOCK = JSON.stringify({ url: "https://example.org/f.tar.gz", sha256: "a".repeat(64) });
say(tier5Assets(5, FULL, MAN, LOCK).length === 0, "Tier 5 with frames/ (180), poster.webp, MOTION.md, a matching frames.json and a lock → no problem");
say(tier5Assets(5, SLIM, MAN, LOCK).length === 0, "Tier 5 on main (no frames/ on disk, lock present) → no problem");
say(tier5Assets(5, SLIM, MAN, null).some((p) => /no frames\.lock\.json/.test(p)), "Tier 5 without frames/ and without a fetch step → caught");
say(tier5Assets(5, SLIM, MAN, JSON.stringify({ url: "http://x", sha256: "zz" })).length === 2, "Tier 5 lock with a plain-http url and no sha256 → both caught");
say(tier5Assets(5, FULL.filter((f) => f !== "poster.webp"), MAN, LOCK).some((p) => /no poster\.webp/.test(p)), "Tier 5 without poster.webp → caught");
say(tier5Assets(5, FULL.filter((f) => f !== "MOTION.md"), MAN, LOCK).some((p) => /no MOTION\.md/.test(p)), "Tier 5 without MOTION.md → caught");
say(tier5Assets(5, SLIM, JSON.stringify({ desktop: { frames: 6 } }), LOCK).some((p) => /at least 24/.test(p)), "Tier 5 with a 6-frame manifest → caught");
say(tier5Assets(5, SLIM, null, LOCK).some((p) => /no frames\.json/.test(p)), "Tier 5 without frames.json → caught");
say(tier5Assets(5, FULL, JSON.stringify({ desktop: { frames: 120 } }), LOCK).some((p) => /says 120/.test(p)), "frames.json count ≠ frames/ on disk → caught");
say(tier5Assets(2, []).length === 0, "Tier 2 template → rule does not apply");
// the shipped Tier 5 film templates, as committed
const { collectFilms } = await import("../../scripts/build-templates.mjs");
for (const f of collectFilms()) {
  const read = (x) => (existsSync(join(T, f.id, x)) ? readFileSync(join(T, f.id, x), "utf8") : null);
  const p = [...tier5Assets(f.tier, f.files, f.manifest, read("frames.lock.json")), ...dials(read("DESIGN.md"), f.tier), ...pins(read("index.html")), ...timingSheet(f.tier, read("MOTION.md")), ...imagery(read("DESIGN.md"))];
  say(f.tier === 5 && p.length === 0, `film template ${f.id} (Tier ${f.tier}) within the rules${p.length ? ": " + p.join("; ") : ""}`);
}
// every shipped template, as committed
const { collect } = await import("../../scripts/build-templates.mjs"); const { templates } = await collect();
for (const t of templates) {
  const read = (f) => (existsSync(join(T, t.id, f)) ? readFileSync(join(T, t.id, f), "utf8") : null);
  const html = existsSync(join(T, `${t.id}.html`)) ? readFileSync(join(T, `${t.id}.html`), "utf8") : null;
  const p = [...dials(read("DESIGN.md"), t.tier), ...pins(html), ...timingSheet(t.tier, read("MOTION.md")), ...imagery(read("DESIGN.md"))];
  say(p.length === 0, `template ${t.id} (Tier ${t.tier}) within the rules${p.length ? ": " + p.join("; ") : ""}`);
}
console.log(fails ? `\n${fails} failure(s)` : "\nall rules bite, and no template drifts");
process.exit(fails ? 1 : 0);
