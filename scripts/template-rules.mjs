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
// frames/ (the desktop sequence, scripts/build-frames.mjs), poster.webp (first paint and no-JS) and MOTION.md (the
// timing sheet), and when frames.json is present its frame count matches frames/. \`files\` is the template folder's
// file list (relative paths, "/" separators), \`manifest\` the text of frames.json or null, so the test can feed it lists.
export const TIER5_MIN_FRAMES = 24;
export function tier5Assets(tier, files, manifest = null) {
  if (+tier !== 5) return [];
  const p = [], has = (f) => files.includes(f);
  const frames = files.filter((f) => /^frames\/[^/]+\.(webp|avif|jpe?g|png)$/.test(f));
  if (!frames.length) p.push("Tier 5 template has no frames/ sequence (render one with scripts/build-frames.mjs)");
  else if (frames.length < TIER5_MIN_FRAMES) p.push(`frames/ has ${frames.length} frames; a scrubbed film needs at least ${TIER5_MIN_FRAMES}`);
  if (!has("poster.webp")) p.push("Tier 5 template has no poster.webp (the first paint before frames load, and the no-JS image)");
  if (!has("MOTION.md")) p.push("Tier 5 template has no MOTION.md (timing sheet, motion/choreography.md)");
  if (manifest !== null) {
    let m = null; try { m = JSON.parse(manifest); } catch { p.push("frames.json is not valid JSON"); }
    if (m && m.desktop?.frames !== frames.length) p.push(`frames.json says ${m.desktop?.frames} desktop frames, frames/ has ${frames.length}; rebuild with scripts/build-frames.mjs`);
  }
  return p;
}
