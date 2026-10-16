// v2.9.0 Phase 5: gate axis X (scripts/completeness.mjs) checks the scope the agent derived, nothing hardcoded.
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { completeness, completenessLines } from "../../skills/asfakulsiam-motomation-design/scripts/completeness.mjs";
let bad = 0; const say = (ok, msg) => { console.log(`${ok ? "ok  " : "FAIL"} ${msg}`); if (!ok) bad++; };
const put = (root, f, t = "// demo\n") => { mkdirSync(dirname(join(root, f)), { recursive: true }); writeFileSync(join(root, f), t); };
const SHAPE = ["README.md", "MOTION.md", "SCHEMA.md", "CRITIQUE.md", "GATE.md", "LICENSE", "CHANGELOG.md", ".env.example", "middleware.ts", "data/schema.json"];
function project(scopeRows, files) {
  const root = mkdtempSync(join(tmpdir(), "moto-x-"));
  for (const f of [...SHAPE, ...files]) put(root, f, f === "SCHEMA.md" ? "## Section contract\n| #cart | empty: Your cart is empty |\n" : f.startsWith("data/") && f.endsWith(".json") ? '{"demo": true, "items": []}' : "// demo\n");
  put(root, "DESIGN.md", `# DESIGN.md\n\n## Scope\n**Site type:** e-commerce\n**Admin panel:** yes\n\n| Kind | Item | Mark | Evidence |\n|---|---|---|---|\n${scopeRows.join("\n")}\n\n## Concept\n`);
  return root;
}
const rows = ["| route | / | requested | |", "| route | /products/[slug] | required | |", "| legal | /privacy | required | |", "| state | /cart: empty | required | SCHEMA.md#empty |", "| admin | /admin/orders | required | |", "| skeleton | product grid | required | app/products/loading.tsx |", "| edge | out of stock | required | |", "| function | wishlist | optional | |", "| route | /blog | not required for this brief, reason: no editorial content in the brief |"];
const files = ["app/page.tsx", "app/(shop)/products/[slug]/page.tsx", "app/products/loading.tsx", "app/admin/orders/page.tsx", "app/(legal)/privacy/page.tsx"];
const a = completeness(project(rows, files)); console.log(completenessLines(a).join("\n"));
say(!a.pass && a.missing.length === 1 && a.missing[0].kind === "edge", "an edge case with no evidence fails X; routes in route groups and dynamic segments are found");
say(a.tally.route.have === 2 && a.tally.route.need === 2 && a.tally.route.excused === 1, "an excused route with a reason is not counted; optional items are not counted");
const b = completeness(project([...rows.slice(0, 6), "| edge | out of stock | required | components/Add.tsx#out of stock |"], [...files, "components/Add.tsx"]));
say(!b.pass && /has no "out of stock"/.test(b.missing[0]?.why || ""), "evidence must contain its #needle");
const c = completeness(project([...rows.slice(0, 6), "| edge | out of stock | required | components/Add.tsx#out of stock |"], [...files]));
say(!c.pass, "evidence that does not exist fails");
const rootD = project([...rows.slice(0, 6), "| edge | out of stock | required | components/Add.tsx#out of stock |"], files); put(rootD, "components/Add.tsx", "// demo: disabled when out of stock\n");
const d = completeness(rootD); say(d.pass, "a complete build passes X");
const e = completeness(project(["| route | /about | maybe | |"], ["app/page.tsx"]));
say(!e.pass && e.invalid.length === 1, "an unknown mark is invalid (no silent pass)");
const f = completeness(project(["| route | /about | not required for this brief, reason: |"], ["app/page.tsx"]));
say(!f.pass && f.invalid.length === 1, "an excuse without a reason is invalid");
const gRoot = project(["| route | / | requested | |"], ["index.html"]); for (const x of ["middleware.ts"]) writeFileSync(join(gRoot, x), "");
const g = completeness(gRoot); say(g.pass && g.tally.route.have === 1, "static HTML routes are found too");
const hRoot = mkdtempSync(join(tmpdir(), "moto-x-")); put(hRoot, "DESIGN.md", "# x\n\n## Scope\n| Kind | Item | Mark | Evidence |\n|---|---|---|---|\n| route | / | requested | |\n| template | middleware.ts | not required for this brief, reason: single static page, no server |\n"); put(hRoot, "index.html", "<p>x</p>");
const h = completeness(hRoot); say(!h.pass && h.tally.template.excused === 1 && h.missing.some((m) => m.item === "README.md"), "template files are required unless excused with a reason");
console.log(bad ? `\n${bad} failure(s)` : "\ncompleteness (X) bites"); process.exit(bad ? 1 : 0);
