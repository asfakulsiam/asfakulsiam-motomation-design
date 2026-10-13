// Rules every page template must satisfy beyond "it builds", shared by scripts/check-repo.mjs and the drift test
// (tests/templates/template-rules.test.mjs). Each rule takes plain text, so the test can feed it broken inputs.
//   timingSheet(tier, motionMd)   Tier 3–5 templates ship MOTION.md with a timing sheet (motion/choreography.md)
//   dials(designMd, builtTier)    dials 1–3, tier inside the MOTION dial's range, DESIGN.md tier = built tier
//   pins(stampedHtml)             measured pins (stamp M trace) within the budget of 2

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
