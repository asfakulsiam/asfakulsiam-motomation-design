// The size guard bites: a heavy artifact, a 2 MB file and a 16 MB total are each caught; fonts and LICENSE pass.
//   node tests/repo/size-guard.test.mjs
import { sizeProblems } from "../../scripts/repo-rules.mjs";
let bad = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) bad++; };
const MB = 1048576;
say(sizeProblems([{ path: "README.md", bytes: 20000 }]).problems.length === 0, "a small file → no problem");
say(sizeProblems([{ path: "evals/results/x/saas/skill-s1/shot-1440-fold.webp", bytes: 9000 }]).problems.some((p) => /evals branch/.test(p)), "a benchmark screenshot on main → caught, however small");
say(sizeProblems([{ path: "evals/results/x/saas/skill-s1/transcript.jsonl.gz", bytes: 9000 }]).problems.length === 1, "a transcript on main → caught");
say(sizeProblems([{ path: "skills/s/examples/templates/film/frames/0001.webp", bytes: 9000 }]).problems.length === 1, "a Tier 5 frame on main → caught");
say(sizeProblems([{ path: "docs/site/assets/big.js", bytes: 2 * MB }]).problems.some((p) => /over 1 MB/.test(p)), "a 2 MB file → caught");
say(sizeProblems([{ path: "skills/s/examples/templates/fonts/x.woff2", bytes: 2 * MB }, { path: "vendor/LICENSE", bytes: 2 * MB }]).problems.length === 0, "allowlisted font and LICENSE over 1 MB → pass");
say(sizeProblems(Array.from({ length: 20 }, (_, i) => ({ path: `src/${i}.js`, bytes: 0.8 * MB }))).problems.some((p) => /budget is 15 MB/.test(p)), "16 MB in total → caught");
if (bad) { console.error(`\n${bad} check(s) failed`); process.exit(1); }
console.log("\nthe size guard bites");
