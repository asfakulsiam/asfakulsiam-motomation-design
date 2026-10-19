// v2.9.0 Phase 5: gate axis X (scripts/completeness.mjs) checks the scope the agent derived, nothing hardcoded.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { completeness, completenessLines, maintenanceMedia } from "../../skills/asfakulsiam-motomation-design/scripts/completeness.mjs";
let bad = 0; const say = (ok, msg) => { console.log(`${ok ? "ok  " : "FAIL"} ${msg}`); if (!ok) bad++; };
const put = (root, f, t = "// demo\n") => { mkdirSync(dirname(join(root, f)), { recursive: true }); writeFileSync(join(root, f), t); };
const MEDIA = "# MEDIA.md\n\n| File or asset | Source URL | License / usage status | Placeholder? | Replace before production? |\n|---|---|---|---|---|\n| public/hero.jpg | client-supplied | approved by the client in writing | no | no |\n";
const SHAPE = ["MEDIA.md", "README.md", "MOTION.md", "SCHEMA.md", "DATA.md", "CRITIQUE.md", "GATE.md", "LICENSE", "CHANGELOG.md", ".env.example", "middleware.ts", "data/schema.json", "data/products.json"];
function project(scopeRows, files, mode = "") {
  const root = mkdtempSync(join(tmpdir(), "moto-x-"));
  for (const f of [...SHAPE, ...files]) put(root, f, f === "MEDIA.md" ? MEDIA : f === "SCHEMA.md" ? "## Section contract\n| #cart | empty: Your cart is empty |\n" : f === "data/products.json" ? '{"demo": true, "entity": "Product", "items": [{"id": "p1", "demo": true}]}' : f === "README.md" ? "# Demo\n\nAll data in data/ is demo. Replace with real data before launch.\n" : f === ".env.example" ? "# demo\nSHOP_API_KEY=placeholder\n" : "// demo\n");
  put(root, "DESIGN.md", `# DESIGN.md\n\n## Scope\n**Site type:** e-commerce\n**Admin panel:** yes\n${mode ? `**Delivery mode:** ${mode}\n` : ""}\n| Kind | Item | Mark | Evidence |\n|---|---|---|---|\n${scopeRows.join("\n")}\n\n## Product contract\nJobs: buy a coffee bag. Journeys: / → /shop.\n\n## Type research\n| Site | Type |\n|---|---|\n| shop-a | e-commerce |\n\n## References\n1. a\n\n## Concept\n`);
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
// v2.9.0 Phase 6: template content (README demo line, demo labels, .env.example coverage, npm run dev)
const iRoot = project(["| route | / | requested | |"], ["app/page.tsx"]);
writeFileSync(join(iRoot, "data/products.json"), '{"demo": true, "entity": "Product", "items": [{"id": "p1"}]}');
writeFileSync(join(iRoot, "README.md"), "# Shop\n");
put(iRoot, "lib/pay.ts", "// demo\nexport const key = process.env.STRIPE_SECRET_KEY;\n");
writeFileSync(join(iRoot, "package.json"), '{"scripts": {"build": "next build"}}');
const i = completeness(iRoot); const ids = i.missing.map((m) => m.item).sort().join(", ");
say(ids === ".env.example coverage, README demo line, demo labels, npm run dev", `template content checks bite (${ids})`);
// demo labels on a file not shaped items[] / item: its top-level arrays of records are checked as entries
const dRoot = project(["| route | / | requested | |"], ["app/page.tsx"]); const dl = (j) => { writeFileSync(join(dRoot, "data/products.json"), JSON.stringify(j)); return completeness(dRoot).missing.some((m) => m.item === "demo labels"); };
say(dl({ demo: true, chapters: [{ id: "a", demo: true }, { id: "b" }] }) && !dl({ demo: true, chapters: [{ id: "a", demo: true }], tags: ["x"] }), "demo labels: an unlabelled entry under another key (chapters) fails; plain value arrays are not entries");
// delivery modes and MEDIA.md (templates/TEMPLATE.md → Delivery modes; craft/media.md)
const explore = (media, extra = []) => { const r = mkdtempSync(join(tmpdir(), "moto-x-")); put(r, "DESIGN.md", "# x\n\n## Scope\n**Delivery mode:** design exploration\n\n| Kind | Item | Mark | Evidence |\n|---|---|---|---|\n| route | / | requested | |\n\n## Product contract\nJobs: buy a coffee bag. Journeys: / → /shop.\n\n## Type research\n| Site | Type |\n|---|---|\n| a | studio |\n\n## References\n1. a\n"); for (const f of ["README.md", "MOTION.md", "CRITIQUE.md", "GATE.md", "index.html"]) put(r, f, "x\n"); if (media !== null) put(r, "MEDIA.md", media); for (const [f, t] of extra) put(r, f, t); return r; };
const j = completeness(explore("# MEDIA.md\n\nNo external media assets were used; every visual is CSS or inline SVG drawn for this build.\n"));
say(j.pass && j.mode === "design exploration", "design exploration needs no SCHEMA, DATA, data/, LICENSE, CHANGELOG, .env.example or middleware");
const k = completeness(explore(null)); say(!k.pass && k.missing.some((m) => m.item === "MEDIA.md"), "MEDIA.md is required in every delivery mode");
const row = (a, s, l, p, r) => `# MEDIA.md\n\n| File or asset | Source URL | License / usage status | Placeholder? | Replace before production? |\n|---|---|---|---|---|\n| ${a} | ${s} | ${l} | ${p} | ${r} |\n`;
const l1 = completeness(explore(row("public/placeholder-dock.jpg", "https://unsplash.com/photos/x", "unknown", "yes", "no"), [["public/placeholder-dock.jpg", "x"]]));
say(!l1.pass && l1.missing.some((m) => /not needing replacement/.test(m.why)) && l1.missing.some((m) => /not marked for replacement/.test(m.why)), "a placeholder or unknown licence shown as production-approved fails");
const l2 = completeness(explore(row("public/placeholder-dock.jpg", "https://unsplash.com/photos/x", "unknown", "yes", "yes"), [["public/placeholder-dock.jpg", "x"], ["public/placeholder-pier.jpg", "x"]]));
say(!l2.pass && l2.missing.some((m) => /placeholder-pier\.jpg is not listed/.test(m.why)) && l2.missing.some((m) => /README\.md does not point to MEDIA\.md/.test(m.why)), "an undocumented placeholder fails, and so does a README that hides pending replacements");
const l3 = completeness(explore(row("public/placeholder-dock.jpg", "https://unsplash.com/photos/x", "unknown", "yes", "yes"), [["public/placeholder-dock.jpg", "x"], ["README.md", "# x\n\nMedia: see MEDIA.md; one temporary photo must be replaced before production.\n"]]));
say(l3.pass && l3.warnings.some((w) => /1 asset\(s\) in MEDIA\.md must be replaced/.test(w)), "a documented placeholder passes, with a not-production-ready warning");
const l4 = completeness(explore(row("public/icons/arrow.svg", "https://lucide.dev", "verified on the source's licence page", "no", "no")));
say(l4.pass && !l4.warnings.some((w) => /^media:/.test(w)), "a verified production asset from a stock or icon source is not treated as a placeholder");
const m1 = completeness(explore("# MEDIA.md\n\nSome photos.\n")); say(!m1.pass && m1.missing.some((m) => /no inventory table/.test(m.why)), "a MEDIA.md with no inventory fails");
const n1 = completeness(project(["| route | / | requested | |", "| template | MEDIA.md | not required for this brief, reason: no images |"], ["app/page.tsx"])); say(!n1.pass && n1.invalid.some((x) => /MEDIA\.md cannot be excused/.test(x)), "MEDIA.md cannot be excused");
const o1 = completeness(project(["| route | / | requested | |"], ["app/page.tsx"], "functional frontend")); for (const x of ["LICENSE", "CHANGELOG.md", "middleware.ts"]) writeFileSync(join(o1.root, x), "");
say(completeness(o1.root).mode === "functional frontend" && !completeness(o1.root).missing.some((m) => ["LICENSE", "CHANGELOG.md", "middleware.ts"].includes(m.item)), "functional frontend does not require LICENSE, CHANGELOG or middleware");
const q1Root = project(["| route | / | requested | |"], ["app/page.tsx"]); rmSync(join(q1Root, "MEDIA.md")); const q1 = completeness(q1Root);
say(q1.pass && q1.warnings.some((w) => /^media: no MEDIA\.md/.test(w)), "an older Scope with no delivery mode warns on a missing MEDIA.md instead of failing a fix");
const p1 = completeness(project(["| route | / | requested | |"], ["app/page.tsx"], "a vibe")); say(!p1.pass && p1.invalid.some((x) => /delivery mode/.test(x)), "an unknown delivery mode is invalid");
// research is required in every delivery mode (Steps 1–2): a stated mode without Type research fails
const rr = explore(row("public/a.svg", "custom, this build", "custom", "no", "no"), [["public/a.svg", "<svg/>"]]); writeFileSync(join(rr, "DESIGN.md"), "# x\n\n## Scope\n**Delivery mode:** design exploration\n\n| Kind | Item | Mark | Evidence |\n|---|---|---|---|\n| route | / | requested | |\n");
say(!completeness(rr).pass && completeness(rr).missing.some((m) => m.item === "DESIGN.md Type research"), "a small design exploration still needs Type research and References");
// coverage: every local media file has a MEDIA.md row (path, file name or folder row)
const cv = completeness(explore(row("public/icons/", "https://lucide.dev", "verified on the source's licence page", "no", "no"), [["public/icons/a.svg", "<svg/>"], ["public/icons/b.svg", "<svg/>"], ["public/hero.jpg", "x"]]));
say(!cv.pass && cv.missing.some((m) => /public\/hero\.jpg has no row/.test(m.why)) && !cv.missing.some((m) => /icons/.test(m.why)), "an unlisted media file fails; a folder row covers its files");
// maintenance (no Scope section): media only
const mt = (media, files) => { const r = mkdtempSync(join(tmpdir(), "moto-m-")); put(r, "DESIGN.md", "# Existing site\n\n## Concept\nx\n"); put(r, "index.html", "<p>x</p>"); if (media !== null) put(r, "MEDIA.md", media); for (const [f, t] of files) put(r, f, t); return r; };
const mm0 = maintenanceMedia(mt(row("public/hero.jpg", "client-supplied", "approved by the client in writing", "no", "no"), [["public/hero.jpg", "x"], ["styles.css", "a:hover{color:red}"]]));
say(mm0.pass && mm0.warnings.length === 1 && /no baseline/.test(mm0.warnings[0]), "maintenance with no media change passes and is not pushed through the full workflow; outside git it says it has no baseline");
const mm1 = maintenanceMedia(mt(row("public/hero.jpg", "client-supplied", "approved by the client in writing", "no", "no"), [["public/hero.jpg", "x"], ["public/team.jpg", "x"]]));
say(!mm1.pass && mm1.problems.some((p) => /public\/team\.jpg has no row/.test(p)), "maintenance that adds media without updating MEDIA.md fails");
const mm2 = maintenanceMedia(mt(row("public/hero.jpg", "client-supplied", "approved", "no", "no") + "| public/team.jpg | https://pexels.com/photo/x | unknown | no | yes |\n", [["public/hero.jpg", "x"], ["public/team.jpg", "x"]]));
say(mm2.pass && mm2.warnings.some((w) => /1 asset\(s\)/.test(w)), "maintenance that records the new asset passes; its unknown licence stays visible");
const mm3 = maintenanceMedia(mt(null, [["public/old.jpg", "x"]]));
say(mm3.pass && mm3.warnings.some((w) => /no MEDIA\.md/.test(w)), "an older site with media and no MEDIA.md gets a warning, not a failure");
const mm4 = maintenanceMedia(mt(null, [["public/placeholder-hero.jpg", "x"]]));
say(!mm4.pass && mm4.problems.some((p) => /placeholder-hero\.jpg is not listed/.test(p)), "an undocumented placeholder fails even without a Scope section or MEDIA.md");
const mm5 = maintenanceMedia(mt(null, [["styles.css", "a:hover{color:red}"]]));
say(mm5.pass && !mm5.warnings.length, "a non-media fix on a site with no media passes with nothing to report");
// a project kept under a folder named build/ (or dist/, out/) is still checked: only build output inside it is skipped
const under = (media, files) => { const r = join(mkdtempSync(join(tmpdir(), "moto-u-")), "build", "site"); put(r, "DESIGN.md", "# Existing site\n\n## Concept\nx\n"); if (media !== null) put(r, "MEDIA.md", media); for (const [f, t] of files) put(r, f, t); return r; };
const ub = maintenanceMedia(under(row("public/hero.jpg", "client-supplied", "approved", "no", "no"), [["public/hero.jpg", "x"], ["public/team.jpg", "x"], ["dist/team.jpg", "x"]]));
say(!ub.pass && ub.problems.some((p) => /public\/team\.jpg has no row/.test(p)) && !ub.problems.some((p) => /dist\//.test(p)), `a project under a build/ folder: its media are checked, its own dist/ is not (${ub.problems.join("; ")})`);
// a second table in MEDIA.md (fonts, with other columns) is not read as inventory rows
const fontsAfter = row("public/hero.webp", "custom", "custom", "no", "no") + "\n## Fonts\n\n| Font | Source | Licence |\n|---|---|---|\n| Fraunces | Google Fonts | OFL |\n";
const ft = maintenanceMedia(mt(fontsAfter, [["public/hero.webp", "x"]])); say(!ft.problems.length, `MEDIA.md: a fonts table after the inventory is not inventory (${ft.problems.join("; ")})`);
// maintenance in a git working tree: the last commit is the baseline for added and replaced media
const gitOk = spawnSync("git", ["--version"]).status === 0;
const committed = (media, files) => { const r = mt(media, files); const g = (...a) => spawnSync("git", ["-C", r, "-c", "user.email=t@t", "-c", "user.name=t", ...a]); g("init", "-q"); g("add", "-A"); g("commit", "-qm", "base"); return r; };
if (gitOk) {
  const g1 = committed(null, [["public/old.jpg", "x"]]); put(g1, "styles.css", "a:hover{color:red}");
  const r1 = maintenanceMedia(g1); say(r1.pass && r1.baseline && r1.warnings.some((w) => /none added or replaced since the last commit/.test(w)), "git: a CSS-only fix on an older site without MEDIA.md passes and says no media changed");
  put(g1, "public/new.jpg", "y"); const r2 = maintenanceMedia(g1);
  say(!r2.pass && r2.problems.some((p) => /adds or replaces media since the last commit \(public\/new\.jpg\).*no MEDIA\.md/.test(p)), "git: adding media to a site without MEDIA.md fails");
  const g3 = committed(null, [["public/old.jpg", "x"]]); put(g3, "public/old.jpg", "replaced"); const r3 = maintenanceMedia(g3);
  say(!r3.pass && r3.problems.some((p) => /public\/old\.jpg/.test(p)), "git: replacing a file under the same name, with no MEDIA.md, fails");
  const g4 = committed(row("public/hero.jpg", "client-supplied", "approved", "no", "no"), [["public/hero.jpg", "x"]]); put(g4, "public/hero.jpg", "replaced"); const r4 = maintenanceMedia(g4);
  say(r4.pass && r4.warnings.some((w) => /public\/hero\.jpg changed under the same name/.test(w)), "git: a same-name replacement with MEDIA.md untouched warns to confirm its row");
  put(g4, "MEDIA.md", row("public/hero.jpg", "client-supplied, new shoot", "approved", "no", "no")); const r5 = maintenanceMedia(g4);
  say(r5.pass && !r5.warnings.some((w) => /same name/.test(w)), "git: updating the row in the same change clears the warning");
  const g6 = committed(row("public/hero.jpg", "client-supplied", "approved", "no", "no"), [["public/hero.jpg", "x"]]); put(g6, "out/hero.jpg", "build"); put(g6, "public/favicon.png", "f"); const r6 = maintenanceMedia(g6);
  say(r6.pass && !r6.warnings.length, "git: new build output and a favicon need no row");
  const g7 = committed(row("public/hero.jpg", "client-supplied", "approved", "no", "no"), [["public/hero.jpg", "x"]]); rmSync(join(g7, "public/hero.jpg")); const r7 = maintenanceMedia(g7);
  say(r7.pass && r7.warnings.some((w) => /public\/hero\.jpg removed since the last commit/.test(w)), "git: media removed with its MEDIA.md row left in place warns");
} else console.log("skip git baseline cases (git not available)");
// readiness claims: a prototype is never production-ready, nor is a template with unresolved media
const rc1 = completeness(explore("# MEDIA.md\n\nNo external media assets were used.\n", [["README.md", "# x\n\nProduction-ready site.\n"]]));
say(!rc1.pass && rc1.missing.some((m) => m.item === "README readiness claim"), "a design exploration that calls itself production-ready fails");
const rc2 = completeness(explore(row("public/placeholder-a.jpg", "https://unsplash.com/photos/x", "unknown", "yes", "yes"), [["public/placeholder-a.jpg", "x"], ["README.md", "# x\n\nNot production-ready until the photo in MEDIA.md is replaced.\n"]]));
say(rc2.pass, "saying it is not production-ready, and pointing to MEDIA.md, passes");
// v3.0.0: journeys, capability levels, deferrals that keep their interface, the product contract, content realism
{
  const base = ["| route | / | requested | |", "| route | /shop | required | |", "| route | /checkout | required | |"];
  const fl = ["index.html", "shop/index.html", "checkout/index.html", "MEDIA.md", "README.md", "MOTION.md", "CRITIQUE.md", "GATE.md"];
  const v3 = (rows, files = fl, mode = "design exploration", contract = true) => { const r = mkdtempSync(join(tmpdir(), "moto-x3-")); for (const f of files) put(r, f, f === "MEDIA.md" ? "# MEDIA.md\n\nNo external media assets were used; every visual is CSS drawn for this build.\n" : "<html><body><main><h1>Shop</h1><p>Washed Ethiopian, 250 g</p></main></body></html>\n"); put(r, "DESIGN.md", `# x\n\n## Scope\n**Delivery mode:** ${mode}\n\n| Kind | Item | Mark | Evidence | Level |\n|---|---|---|---|---|\n${rows.join("\n")}\n\n${contract ? "## Product contract\nJobs: buy.\n\n" : ""}## Type research\n| Site |\n|---|\n\n## Research record\n| Source |\n|---|\n`); return r; };
  const j1 = completeness(v3([...base, "| journey | buy | required | / → /shop → /checkout | interaction |"]));
  say(j1.pass && j1.tally.journey.have === 1, "a journey whose routes all exist passes, and counts as connected");
  const j2 = completeness(v3([...base, "| journey | buy | required | / → /shop → /cart → /checkout | |"]));
  say(!j2.pass && /\/cart not found/.test(j2.missing.find((m) => m.kind === "journey")?.why || ""), "a journey through a missing route fails X and names the route");
  const d1 = completeness(v3([...base, "| function | card payments | not required for this brief, reason: payment provider integration deferred | | integration |"]));
  say(!d1.pass && d1.invalid.some((i) => /names no interface/.test(i)), "deferring a payment provider without naming the interface that still ships is invalid");
  const d2 = completeness(v3([...base, "| function | card payments | not required for this brief, reason: payment provider integration deferred; interface: /checkout | | integration |"]));
  say(d2.pass, "a deferred integration that names its shipped interface passes");
  const d3 = completeness(v3([...base, "| function | sign in | not required for this brief, reason: auth backend deferred; interface: /sign-in | | backend |"]));
  say(!d3.pass && d3.invalid.some((i) => /\/sign-in is not in/.test(i)), "a deferral whose promised interface route doesn't exist is invalid");
  const l1 = completeness(v3([...base, "| function | orders saved | required | index.html | backend |"]));
  say(!l1.pass && l1.invalid.some((i) => /claimed in a design exploration/.test(i)), "a design exploration cannot claim a backend capability");
  const l2 = completeness(v3([...base, "| function | cart | required | index.html | magic |"]));
  say(!l2.pass && l2.invalid.some((i) => /level "magic"/.test(i)), "an unknown capability level is invalid");
  // v3.0.1: a journey the Product contract writes must have a Scope row
  const cj = v3([...base, "| journey | buy | required | / → /shop → /checkout | interaction |"]); { const f = join(cj, "DESIGN.md"); writeFileSync(f, readFileSync(f, "utf8").replace("Jobs: buy.", "Jobs: buy.\n- **Core journeys:**\n  - Buy: `/ → /shop → /checkout`\n  - Return: `/ → /returns`")); }
  const cjr = completeness(cj); const cjm = cjr.missing.find((m) => /contract journey/.test(m.item));
  say(!cjr.pass && cjm && /\/returns/.test(cjm.item) && !cjr.missing.some((m) => /contract journey \/ → \/shop/.test(m.item)), `a contract journey missing from the Scope table fails X (${cjm?.item || "not reported"}); the one with a row does not`);
  const p1 = completeness(v3(base, fl, "design exploration", false));
  say(!p1.pass && p1.missing.some((m) => m.item === "DESIGN.md Product contract"), "a build that states its delivery mode needs a Product contract in DESIGN.md");
  const rRoot = v3(base); put(rRoot, "shop/index.html", "<main><h2>Product 1</h2><p>TODO: real copy from the brief</p><a href=\"#\">Buy</a></main>\n");
  const r1 = completeness(rRoot); const why = r1.missing.find((m) => m.item === "Content realism")?.why || "";
  say(!r1.pass && /leak/.test(why) && /generic/.test(why) && /dead/.test(why), "content realism fails leaked notes, template fixture names and dead links");
  const rRoot2 = v3([...base, "| template | data/ | optional | |"]); put(rRoot2, "data/products.json", JSON.stringify({ demo: true, items: Array.from({ length: 8 }, (_, i) => ({ id: "p" + i, demo: true, name: i % 2 ? "Ceramic mug" : "Ceramic bowl", price: 24 })) }));
  const r2 = completeness(rRoot2); const why2 = r2.missing.find((m) => m.item === "Content realism")?.why || "";
  say(!r2.pass && /share a name/.test(why2) && /same price/.test(why2), "content realism fails a fixture repeated with the same name and price");
  // found by a real static multi-page build (v3.0.0): a footer sentence on every generated page is site chrome, not a repeated fixture
  const foot = "<footer><p>Single-estate tea, packed in Dhaka by a small team of four.</p></footer>";
  const rRoot3 = v3(base); for (const f of ["index.html", "shop/index.html", "checkout/index.html", "a/index.html", "b/index.html"]) put(rRoot3, f, `<main><h1>${f}</h1></main>${foot}\n`);
  const w3 = completeness(rRoot3).warnings.join(" ");
  say(!/same sentence/.test(w3), "the same footer sentence on every static page is not reported as repeated content");
  put(rRoot3, "shop/index.html", "<main>" + "<p>Handmade in small batches by our team in the hills.</p>".repeat(4) + "</main>\n");
  say(/same sentence appears 4× on this page/.test(completeness(rRoot3).warnings.join(" ")), "one sentence repeated 4× on one static page still warns");
}
// v3.0.1 realism: domain words are not fixtures or leaks; text a vanilla-JS file renders is read
{
  const { realism } = await import("../../skills/asfakulsiam-motomation-design/scripts/realism.mjs");
  const ok = mkdtempSync(join(tmpdir(), "real-ok-")); writeFileSync(join(ok, "index.html"), '<html><body><h1>Freight for Tier 1 carriers</h1><p>We ship Category A dangerous goods under IATA rules.</p><p>Every project starts with the brief and ends with a launch.</p><p>Brand archetypes, explained.</p><p>The chef\'s signature move is smoke.</p><p>Book Room 2 for your meeting.</p></body></html>');
  const r = realism(ok); say(r.pass, `realism: Tier 1 carriers, Category A goods, "starts with the brief", a chef's signature move, Room 2 are not flagged (${r.problems.map((p) => p.what).join("; ") || "none"})`);
  const js = mkdtempSync(join(tmpdir(), "real-js-")); writeFileSync(join(js, "index.html"), '<html><body><h1>Shop</h1><div id="g"></div><script src="app.js"></script></body></html>');
  writeFileSync(join(js, "app.js"), 'const items = [{ name: "Product 1" }, { name: "Product 2" }];\nconst plans = [{ title: "Plan 1" }, { title: "Plan 2" }, { title: "Plan 3" }];\ng.innerHTML = items.map((i) => `<article><h3>${i.name}</h3><p>Lorem ipsum dolor sit amet</p><a href="#">Buy</a></article>`).join("");\n');
  const j = realism(js); const w = j.problems.map((p) => `${p.kind}:${p.what}`).join(" | ");
  say(!j.pass && /Product 1/.test(w) && /Plan 1, 2, 3/.test(w) && /lorem/i.test(w) && /dead/.test(w), `realism: fixtures, lorem, a numbered run and a dead link rendered by app.js are found (${j.problems.length} problem(s))`);
}
// v3.0.2 realism: unsourced proof (the B2B benchmark build: "SOC 2 TYPE II AUDITED" in every footer, "2,400 refrigerated
// TEUs annually" and "zero spoiled loads over 18 months" in a case study, none labelled illustrative)
{
  const { realism } = await import("../../skills/asfakulsiam-motomation-design/scripts/realism.mjs");
  const foot = '<footer><p>SOC 2 TYPE II AUDITED</p></footer>';
  const pr = mkdtempSync(join(tmpdir(), "real-proof-")); mkdirSync(join(pr, "stories/acme-foods"), { recursive: true });
  for (const f of ["index.html", "pricing.html", "contact.html"]) writeFileSync(join(pr, f), `<html><body><h1>Freight visibility</h1><p>Track 40% of your lanes today.</p>${foot}</body></html>`);
  writeFileSync(join(pr, "stories/acme-foods/index.html"), `<html><body><h1>Cold-chain certainty</h1><p>An importer moving 2,400 refrigerated TEUs annually cut demurrage.</p><p>Zero spoiled loads over 18 months.</p>${foot}</body></html>`);
  const r = realism(pr); const p = r.problems.filter((x) => x.kind === "proof"); const w = p.map((x) => x.what).join(" | ");
  say(!r.pass && p.length === 2 && /SOC 2 TYPE II AUDITED.*on 4 pages/.test(w) && /case-study/.test(w), `realism: an unsourced certification in a shared footer is one problem (4 pages), a case-study statistic another; a marketing "40%" outside a case study is not flagged (${w})`);
  const lab = mkdtempSync(join(tmpdir(), "real-proof-ok-")); mkdirSync(join(lab, "stories/acme-foods"), { recursive: true });
  writeFileSync(join(lab, "stories/acme-foods/index.html"), '<html><body><h1>Cold-chain certainty</h1><p>An importer moving 2,400 refrigerated TEUs annually.</p><p>SOC 2 Type II audited</p><p>Illustrative case study: a fictional customer and example figures.</p></body></html>');
  writeFileSync(join(lab, "security.html"), '<html><body><h1>Security</h1><p>SOC 2 Type II report: [NEEDS COPY]</p></body></html>');
  const r2 = realism(lab); say(r2.problems.every((x) => x.kind !== "proof"), `realism: the same claims labelled illustrative/fictional or left as [NEEDS COPY] pass (${r2.problems.map((x) => x.what).join(" | ") || "none"})`);
}
console.log(bad ? `\n${bad} failure(s)` : "\ncompleteness (X) bites"); process.exit(bad ? 1 : 0);
