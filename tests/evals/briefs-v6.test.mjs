// Structure of the v6 evaluation briefs (evals/briefs/v6): type coverage, required sections, the paired briefs share one
// product contract. No build or benchmark is run.
//   node tests/evals/briefs-v6.test.mjs
import { readFileSync, readdirSync } from "node:fs"; import { join, dirname } from "node:path"; import { fileURLToPath } from "node:url";
const DIR = join(dirname(fileURLToPath(import.meta.url)), "../../evals/briefs/v6");
let fails = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) fails++; };
const files = readdirSync(DIR).filter((f) => /^\d+[a-z]?-.*\.md$/.test(f));
const briefs = files.map((f) => ({ f, s: readFileSync(join(DIR, f), "utf8") }));
const NEED = ["marketplace", "luxury", "b2b", "editorial", "saas-dashboard", "portfolio", "education", "travel-booking", "community-directory", "data-heavy", "mobile-accessibility", "paired"];
const types = briefs.map((b) => /^Type: (\S+)/m.exec(b.s)?.[1]);
for (const t of NEED) say(types.includes(t), `type covered: ${t}`);
for (const { f, s } of briefs) {
  for (const h of ["## The client", "## Product contract (expected)", "## Pressures", "## Bias probe", "## Pass criteria"]) say(s.includes(h), `${f}: has ${h}`);
  say(/Core journeys \(route sequences\):\n(?:- [^\n]*→[^\n]*\n)+/.test(s), `${f}: journeys are route sequences`);
  say(/^Required routes: .+404/m.test(s), `${f}: required routes include a 404`);
  say(/^Capability levels: .*(deferred|frontend|persisted)/m.test(s), `${f}: capability levels stated`);
  say(!/^\*\*Expect:\*\*/m.test(s), `${f}: no expected style line (the brief must not pick the look)`);
}
const contract = (s) => s.split("## Product contract (expected)")[1].split("## Pressures")[0];
const pair = briefs.filter((b) => /^Type: paired/m.test(b.s));
say(pair.length === 2, `two paired briefs (${pair.length})`);
if (pair.length === 2) {
  say(contract(pair[0].s) === contract(pair[1].s), "paired briefs share an identical product contract");
  const dir = (s) => /## Art direction[^\n]*\n([^\n]+)/.exec(s)?.[1];
  say(dir(pair[0].s) && dir(pair[1].s) && dir(pair[0].s) !== dir(pair[1].s), "paired briefs give different art directions");
}
console.log(fails ? `\n${fails} failure(s)` : `\nall ${briefs.length} v6 briefs well-formed`); process.exit(fails ? 1 : 0);
