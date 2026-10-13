// Rules every page template must satisfy beyond "it builds", shared by scripts/check-repo.mjs and the drift test
// (tests/templates/template-rules.test.mjs). Each rule takes plain text, so the test can feed it broken inputs.
//   timingSheet(tier, motionMd)   Tier 3–5 templates ship MOTION.md with a timing sheet (motion/choreography.md)
//   dials(designMd, builtTier)    dials 1–3, tier inside the MOTION dial's range, DESIGN.md tier = built tier
//   pins(stampedHtml)             measured pins (stamp M trace) within the budget of 2
//   imagery(designMd)             an Imagery block with a Mode line, a stand-in when images are used, no boilerplate
//   noPlaceholderArt(src, file)   no section calls the old abstract art() placeholder
//   tier5Assets(tier, files, manifest)  a Tier 5 template ships frames/, poster.webp and MOTION.md (and frames.json lists them)

// a timing sheet: at least one chapter header and one table with the sheet's columns and a beat row
export function timingSheet(tier, motionMd) {
  if (+tier < 3) return [];
  if (motionMd == null) return [`Tier ${tier} template has no MOTION.md; Tier 3–5 templates ship a timing sheet (motion/choreography.md)`];
  const p = [];
  if (!/^### Chapter \d+: .+ · .+ · (dense|still)\b/m.test(motionMd)) p.push("MOTION.md has no chapter header with a dense/still mark (### Chapter <n>: <name> · <length> · dense|still …)");
  if (!/^\| Beat \| Range \| Element \| Action \| Ease \| Overlap \| Camera \| Reduced motion \|$/m.test(motionMd)) p.push("MOTION.md has no timing-sheet table (| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |)");
  else if (!/^\| 01 \| [^|]+ \|/m.test(motionMd)) p.push("MOTION.md's timing sheet has no beat rows");
  if (!/^Rhythm:/m.test(motionMd)) p.push("MOTION.md has no Rhythm line (dense/still order and the breath in every run of three)");
  return p;
}

// principles/dials.md: each dial is 1–3, and the tier sits in the MOTION dial's allowed range
//   MOTION 1 → Tier 1 · MOTION 2 → Tier 1–3 · MOTION 3 → Tier 2–5 (Tier 4 only for a spatial concept)
export const TIER_RANGE = { 1: [1, 1], 2: [1, 3], 3: [2, 5] };
export function dials(designMd, builtTier) {
  const m = designMd?.match(/^- \*\*Dials:\*\* ENERGY (\d+) · RHYTHM (\d+) · MOTION (\d+) → Tier (\d+)/m);
  if (!m) return ["DESIGN.md has no Dials line (- **Dials:** ENERGY n · RHYTHM n · MOTION n → Tier n)"];
  const [, e, r, mo, t] = m.map(Number); const p = [];
  for (const [k, v] of [["ENERGY", e], ["RHYTHM", r], ["MOTION", mo]]) if (v < 1 || v > 3) p.push(`${k} ${v} is out of range (dials are 1–3, principles/dials.md)`);
  const range = TIER_RANGE[mo];
  if (range && (t < range[0] || t > range[1])) p.push(`MOTION ${mo} allows Tier ${range[0] === range[1] ? range[0] : range.join("–")}, but the page is Tier ${t}`);
  if (builtTier !== undefined && +builtTier !== t) p.push(`DESIGN.md says Tier ${t}, but the page's components make it Tier ${builtTier}`);
  if (mo === 3 && t === 4 && !/spatial/i.test(m.input.slice(m.index, m.input.indexOf("\n", m.index)))) p.push("MOTION 3 at Tier 4 needs the spatial concept named on the Dials line (principles/dials.md)");
  return p;
}

// principles/restraint.md: pinned sections ≤ 2 (Tier 2–3; Motomation chapters ≤ 2 at Tier 4–5). The count is the
// gate's measured one, read from the stamp's M trace (M<n>[t<tier>:pins<n>/2,…]), so it can't be typed
export const PIN_BUDGET = 2;
export function pins(stampedHtml) {
  const m = stampedHtml?.match(/critique: [^·]*?M\d\[t\d:pins(\d+)\/\d+/);
  if (!m) return [];
  return +m[1] > PIN_BUDGET ? [`${m[1]} pins measured against a budget of ${PIN_BUDGET} (principles/restraint.md); reduce the pins or justify the tier`] : [];
}

// principles/imagery.md: every template decides its imagery (one Mode line), and no section draws the old abstract
// placeholder art(): imagery is either the real subject drawn (examples/sections/_imagery.tsx) or none, on purpose
export const IMAGERY_MODES = ["photography", "illustration", "texture only", "none"];
export function imagery(designMd) {
  const at = designMd?.indexOf("\n## Imagery\n") ?? -1; const rest = at < 0 ? null : designMd.slice(at + 12); const sec = rest === null ? null : rest.slice(0, (rest.indexOf("\n## ") + 1 || rest.length + 1) - 1);
  if (!sec) return ["DESIGN.md has no ## Imagery block (principles/imagery.md)"];
  const mode = sec.match(/^- Mode: (photography|illustration|texture only|none)\b/m);
  const p = [];
  if (!mode) p.push(`## Imagery has no Mode line (one of: ${IMAGERY_MODES.join(", ")})`);
  if (mode && mode[1] !== "none" && !/^- Template stand-in: /m.test(sec)) p.push("## Imagery uses images but names no template stand-in (principles/imagery.md §6)");
  if (/Treatment: none beyond what the section does/.test(sec)) p.push("## Imagery still has the old boilerplate (no direction written)");
  return p;
}
export function noPlaceholderArt(sourceText, file) {
  return /\bart\(/.test(sourceText.replace(/\/\/.*$/gm, "")) ? [`${file} still calls art(); draw the real subject (examples/sections/_imagery.tsx) or use no imagery`] : [];
}

// Tier 5 (scroll-as-film, motion/tier-5-motomation.md): the film is real frames, not a promise. A Tier 5 template ships
// poster.webp (first paint and no-JS), MOTION.md (the timing sheet), frames.json (the manifest from scripts/build-frames.mjs)
// and frames.lock.json, the fetch step: where the frame tarball lives and its sha256 (scripts/fetch-frames.mjs restores it).
// The sequences themselves (frames/, frames-mobile/, film.mp4) are not on main, so the skill stays small; when they are on
// disk (fetched or rebuilt), their count must match frames.json. `files` is the template folder's file list (relative
// paths, "/" separators), `manifest` the text of frames.json and `lock` the text of frames.lock.json, or null.
export const TIER5_MIN_FRAMES = 24;
export function tier5Assets(tier, files, manifest = null, lock = null) {
  if (+tier !== 5) return [];
  const p = [], has = (f) => files.includes(f);
  const frames = files.filter((f) => /^frames\/[^/]+\.(webp|avif|jpe?g|png)$/.test(f));
  if (!has("poster.webp")) p.push("Tier 5 template has no poster.webp (the first paint before frames load, and the no-JS image)");
  if (!has("MOTION.md")) p.push("Tier 5 template has no MOTION.md (timing sheet, motion/choreography.md)");
  let m = null;
  if (manifest === null) p.push("Tier 5 template has no frames.json (render the sequence with scripts/build-frames.mjs)");
  else { try { m = JSON.parse(manifest); } catch { p.push("frames.json is not valid JSON"); } }
  if (m && !(m.desktop?.frames >= TIER5_MIN_FRAMES)) p.push(`frames.json lists ${m.desktop?.frames} desktop frames; a scrubbed film needs at least ${TIER5_MIN_FRAMES}`);
  if (lock === null) p.push("Tier 5 template has no frames.lock.json (the fetch step: url + sha256 of the frame tarball, scripts/fetch-frames.mjs)");
  else { let l = null; try { l = JSON.parse(lock); } catch { p.push("frames.lock.json is not valid JSON"); }
    if (l && !/^https:\/\//.test(l.url || "")) p.push("frames.lock.json has no https url");
    if (l && !/^[0-9a-f]{64}$/.test(l.sha256 || "")) p.push("frames.lock.json has no sha256"); }
  if (frames.length && m && m.desktop?.frames !== frames.length) p.push(`frames.json says ${m.desktop?.frames} desktop frames, frames/ has ${frames.length}; fetch again (scripts/fetch-frames.mjs --force) or rebuild with scripts/build-frames.mjs`);
  return p;
}

// ── v2.5.0 rule sets in the repo check (craft/copy.md, seo.md, performance.md, security.md; gates/delivery-gate.md Part 4)
// The four craft docs each hold 20 numbered rules; a doc that lost rules, or a rule that lost its reasoning, fails.
export const CRAFT_RULES = {
  "craft/copy.md": { prefix: "copy", n: 20, tags: null, minWords: 1200 }, // what, why, good, bad per rule
  "craft/seo.md": { prefix: "seo", n: 20, tags: ["M", "H"], minWords: 500 }, // checklist: item and how it is decided
  "craft/performance.md": { prefix: "perf", n: 20, tags: ["FE", "BE", "IN", "H"], minWords: 500 },
  "craft/security.md": { prefix: "sec", n: 20, tags: ["M", "H"], extra: ["sec-h1", "sec-h2", "sec-h3"], minWords: 500 },
};
export const ruleIds = (spec) => [...Array.from({ length: spec.n }, (_, i) => `${spec.prefix}-${String(i + 1).padStart(2, "0")}`), ...(spec.extra || [])];
export function craftDoc(file, text) {
  const spec = CRAFT_RULES[file]; if (!spec) return [];
  if (!text) return [`${file} is missing (one of the four rule sets)`];
  const out = []; const words = text.split(/\s+/).length;
  if (words < spec.minWords) out.push(`${file} is ${words} words; too thin for 20 rules with their reasoning (≥ ${spec.minWords})`);
  for (const id of ruleIds(spec).slice(0, spec.n)) {
    const line = text.split("\n").find((l) => new RegExp(`\\b${id}\\b`).test(l) && /^\s*(\||#{2,4}\s)/.test(l));
    if (!line) { out.push(`${file}: rule ${id} is missing`); continue; }
    if (spec.tags && !spec.tags.some((t) => line.includes(`[${t}]`))) out.push(`${file}: rule ${id} has no ${spec.tags.map((t) => `[${t}]`).join("/")} tag`);
    if (line.startsWith("|")) { const cells = line.split("|").slice(1, -1).map((c) => c.trim()); if (cells.length < 4 || cells.some((c) => c.length < 3)) out.push(`${file}: rule ${id} has an empty cell (what, why, good, bad)`); }
  }
  return out;
}
// The delivery gate lists every rule of the four sets (Part 4), so a rule added to a craft doc reaches the checklist.
export function gateListsRules(gateText, craftTexts) {
  const out = [];
  for (const [file, spec] of Object.entries(CRAFT_RULES)) for (const id of ruleIds(spec)) if (!new RegExp(`\\b${id}\\b`).test(gateText || "")) out.push(`gates/delivery-gate.md does not list ${id} (${file})`);
  return out;
}
// Every shipped template page: no em dash in body text, title or description; exactly one h1; a meta description; a canonical.
export function templatePage(html, file) {
  const out = []; if (!html) return [`${file} is missing`];
  const head = (html.match(/<head>([\s\S]*?)<\/head>/i) || [, ""])[1];
  const title = (head.match(/<title>([^<]*)<\/title>/i) || [, ""])[1];
  const desc = (head.match(/<meta name="description" content="([^"]*)"/i) || [, null])[1];
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, ""])[1].replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, "").replace(/<[^>]+>/g, " ");
  const n = (body.match(/\u2014/g) || []).length; if (n) out.push(`${file}: ${n} em dash(es) in body text (copy-04)`);
  if (/\u2014/.test(title)) out.push(`${file}: em dash in <title> (copy-04)`);
  if (desc === null) out.push(`${file}: no meta description (seo-06)`); else if (/\u2014/.test(desc)) out.push(`${file}: em dash in the meta description (copy-04)`);
  const h1 = (html.replace(/<script[\s\S]*?<\/script>/gi, "").match(/<h1[\s>]/gi) || []).length; if (h1 !== 1) out.push(`${file}: ${h1} h1 elements, needs exactly 1 (seo-07)`);
  const can = (head.match(/<link rel="canonical" href="([^"]+)"/gi) || []).length; if (can !== 1) out.push(`${file}: ${can} canonical links, needs exactly 1 (seo-04)`);
  return out;
}
