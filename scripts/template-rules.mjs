// Rules every page template must satisfy beyond "it builds", shared by scripts/check-repo.mjs and the drift test
// (tests/templates/template-rules.test.mjs). Each rule takes plain text, so the test can feed it broken inputs.
//   timingSheet(tier, motionMd)   Tier 3–5 templates ship MOTION.md with a timing sheet (motion/choreography.md)

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
