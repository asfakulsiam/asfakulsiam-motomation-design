#!/usr/bin/env node
// Completeness (gate axis X, v2.9.0): does the build contain the scope the agent derived in Step 0.7?
// Nothing is hardcoded here: the routes, states, legal pages, edge cases, admin surfaces and skeletons come from the
// `## Scope` table the agent wrote in DESIGN.md (thinking/sequence.md, Step 0.7). This script only checks that each item
// marked "requested" or "required" exists in the project, and that every excused item carries a reason.
// The deliverable shape the skill itself requires (templates/TEMPLATE.md) is checked too, as the "Template" line:
// the files, the README demo line, demo labels on every data/ entry, .env.example covering every env var the code
// reads, and a dev script for zero-configuration runs.
//
// Usage:
//   node scripts/completeness.mjs <project-dir | path/to/DESIGN.md> [--json]
// Exit: 0 complete · 1 something required is missing (or a mark is invalid) · 2 usage / no Scope section.
//
// Scope table (in DESIGN.md, under "## Scope"):
//   | Kind | Item | Mark | Evidence |
//   | route | /products/[slug] | required | (optional: found in app/, pages/ or static HTML) |
//   | state | /cart: empty | required | SCHEMA.md#cart.*empty |
//   | legal | /privacy | required | |
//   | edge | add to cart when out of stock | required | components/AddToCart.tsx#out of stock |
//   | admin | /admin/orders | required | |
//   | skeleton | product grid | required | app/products/loading.tsx |
//   | function | /cart: change quantity | requested | components/CartLine.tsx#quantity |
//   | template | middleware.ts | not required for this brief, reason: single static page, no server |
// Kinds: route, function, state, legal, edge, admin, skeleton, template. Marks: requested · required · optional ·
// "not required for this brief, reason: <why>". Evidence: a path, optionally "#<regex>" that the file must match.
// Routes, legal pages and admin items that start with "/" are found automatically; other kinds need evidence.
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const KINDS = { route: "Routes", function: "Functions", state: "States", legal: "Legal", edge: "Edge cases", admin: "Admin", skeleton: "Skeletons", template: "Template" };
const VERB = { route: "required present", function: "present", state: "defined", legal: "present", edge: "handled", admin: "present", skeleton: "present", template: "present" };
// the deliverable shape every build ships (templates/TEMPLATE.md); each can be excused in the Scope table with a reason
export const TEMPLATE_FILES = [
  ["README.md"], ["DESIGN.md"], ["MOTION.md"], ["SCHEMA.md"], ["DATA.md"], ["CRITIQUE.md"], ["GATE.md"], ["LICENSE", "LICENSE.md"],
  ["CHANGELOG.md"], [".env.example"], ["middleware.ts", "src/middleware.ts", "middleware.js", "src/middleware.js"], ["data/"], ["data/schema.json", "schema.json"],
];

function scopeTable(md) {
  const i = md.search(/^##\s+Scope\b/m); if (i < 0) return null;
  const body = md.slice(i).split("\n").slice(1); const end = body.findIndex((l) => /^##\s/.test(l)); const sec = (end < 0 ? body : body.slice(0, end)).join("\n");
  const admin = (/\*\*Admin panel:\*\*\s*([a-z]+)/i.exec(sec) || /Admin panel:\s*([a-z]+)/i.exec(sec) || [])[1] || null;
  const type = (/\*\*Site type:\*\*\s*([^\n]+)/i.exec(sec) || /Site type:\s*([^\n]+)/i.exec(sec) || [])[1]?.trim() || null;
  const rows = sec.split("\n").filter((l) => /^\s*\|/.test(l)).map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  const head = rows.findIndex((r) => r[0] && /^kind$/i.test(r[0]));
  const items = rows.slice(head + 1).filter((r) => r.length >= 3 && !/^-+$/.test(r[0].replace(/:/g, "")) && r[0] && !/^<.*>$/.test(r[1] || ""))
    .map((r) => ({ kind: r[0].toLowerCase().replace(/s$/, "").replace(/^edge case$|^edge-case$/, "edge"), item: r[1].replace(/^`|`$/g, ""), mark: r[2], evidence: (r[3] || "").replace(/^`|`$/g, "") }));
  return { admin, type, items };
}
function markOf(m) {
  const s = m.toLowerCase();
  if (/^requested\b/.test(s)) return { counts: true, label: "requested" };
  if (/^required\b/.test(s)) return { counts: true, label: "required" };
  if (/^optional\b/.test(s)) return { counts: false, label: "optional" };
  const r = /^not required for this brief,?\s*reason:\s*(.+)$/i.exec(m.trim());
  if (r && r[1].trim().length >= 3 && !/^<.*>$/.test(r[1].trim())) return { counts: false, label: "excused", reason: r[1].trim() };
  return { invalid: true, label: m || "(empty)" };
}

// every route the project serves, read from the file system: Next.js app/ and pages/, then static HTML
function walk(dir, out = [], depth = 0) {
  if (depth > 12 || !existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name); if (e.isDirectory()) walk(p, out, depth + 1); else out.push(p);
  }
  return out;
}
const norm = (r) => { let x = "/" + String(r).trim().replace(/^\/+|\/+$/g, ""); x = x.replace(/\[\[?\.{3}[^\]]+\]?\]/g, "[...]").replace(/\[[^\].]+\]/g, "[*]").replace(/:[a-z0-9_]+/gi, "[*]"); return x === "/" ? "/" : x.toLowerCase(); };
export function projectRoutes(root) {
  const routes = new Set();
  for (const app of ["app", "src/app"]) for (const f of walk(join(root, app))) {
    const m = /[\\/](page|route)\.(tsx|ts|jsx|js|mdx)$/.exec(f); if (!m) continue;
    const segs = relative(join(root, app), dirname(f)).split(sep).filter((s) => s && !/^\(.*\)$/.test(s) && !s.startsWith("@") && s !== ".");
    routes.add(norm(segs.join("/")));
  }
  for (const pages of ["pages", "src/pages"]) for (const f of walk(join(root, pages))) {
    const m = /\.(tsx|ts|jsx|js|mdx|astro|md)$/.exec(f); if (!m || /[\\/]_(app|document)\./.test(f)) continue;
    routes.add(norm(relative(join(root, pages), f).replace(/\.[^.]+$/, "").replace(/(^|[\\/])index$/, "").split(sep).join("/")));
  }
  for (const base of [root, join(root, "out"), join(root, "dist"), join(root, "build"), join(root, "public")]) for (const f of walk(base)) {
    if (!/\.html?$/.test(f) || /[\\/](node_modules|app|pages|src)[\\/]/.test(relative(root, f) ? "/" + relative(root, f) : "")) continue;
    routes.add(norm(relative(base, f).replace(/\.html?$/, "").replace(/(^|[\\/])index$/, "").split(sep).join("/")));
  }
  return routes;
}
function routeMatch(item, routes) {
  const want = norm(item.split(/\s/)[0]); if (routes.has(want)) return true;
  const w = want.split("/"); // a concrete item (/products/linen-shirt) matches a dynamic route (/products/[*])
  return [...routes].some((r) => { const s = r.split("/"); if (s.includes("[...]")) { const k = s.indexOf("[...]"); return w.length >= k && s.slice(0, k).every((x, i) => x === w[i] || x === "[*]"); } return s.length === w.length && s.every((x, i) => x === w[i] || x === "[*]" || w[i] === "[*]"); });
}
function evidenceOk(root, ev) {
  if (!ev || /^<.*>$/.test(ev) || ev === "-") return { ok: false, why: "no evidence" };
  for (const one of ev.split(/\s*[,;]\s*/)) {
    const [p, needle] = one.split("#"); const f = join(root, p.trim());
    if (!existsSync(f)) return { ok: false, why: `${p.trim()} not found` };
    if (needle) { let txt = ""; try { txt = statSync(f).isDirectory() ? walk(f).map((x) => readFileSync(x, "utf8")).join("\n") : readFileSync(f, "utf8"); } catch {} let re; try { re = new RegExp(needle, "i"); } catch { re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"); } if (!re.test(txt)) return { ok: false, why: `${p.trim()} has no "${needle}"` }; }
  }
  return { ok: true };
}

function demoLabelled(f) { try { const j = JSON.parse(readFileSync(f, "utf8")); if (j.demo !== true && j._demo !== true) return false; const arr = Array.isArray(j.items) ? j.items : j.item ? [j.item] : Array.isArray(j) ? j : []; return arr.every((x) => x && (x.demo === true || x._demo === true)); } catch { return false; } }
// environment variables the code reads (process.env.X, import.meta.env.X), public framework vars included
function envVars(root) {
  const out = new Set(); const skip = new Set(["NODE_ENV", "NEXT_RUNTIME", "VERCEL", "VERCEL_ENV", "VERCEL_URL", "CI", "PORT"]);
  for (const f of walk(root)) { if (!/\.(tsx|ts|jsx|js|mjs|astro|svelte)$/.test(f) || /[\\/](out|dist|build|\.next|data)[\\/]/.test(f)) continue; const t = readFileSync(f, "utf8"); for (const m of t.matchAll(/(?:process\.env|import\.meta\.env)\.([A-Z][A-Z0-9_]+)/g)) if (!skip.has(m[1])) out.add(m[1]); }
  return [...out].sort();
}
// heuristic warnings (never fail): middleware coverage, comments in non-trivial files, component headers, demo labels
function warnings(root) {
  const w = [];
  const mw = ["middleware.ts", "src/middleware.ts", "middleware.js", "src/middleware.js"].map((f) => join(root, f)).find(existsSync);
  if (mw) { const t = readFileSync(mw, "utf8"); for (const [k, re] of [["auth gate", /auth|session|redirect\(.*login/i], ["locale routing", /locale|i18n|accept-language/i], ["redirects", /redirect/i], ["rate limiting", /rate|limit|429/i], ["security headers", /content-security-policy|x-content-type-options|referrer-policy/i]]) if (!re.test(t)) w.push(`middleware: no ${k} found in ${relative(root, mw)}`); }
  const code = walk(root).filter((f) => /\.(tsx|ts|jsx|js|mjs|css)$/.test(f) && !/[\\/](out|dist|build|\.next)[\\/]/.test(f));
  const bare = code.filter((f) => { const t = readFileSync(f, "utf8"); return t.split("\n").length > 40 && !/\/\/|\/\*/.test(t); });
  if (bare.length) w.push(`comments: ${bare.length} non-trivial file(s) (> 40 lines) without a comment: ${bare.slice(0, 5).map((f) => relative(root, f)).join(", ")}`);
  const comps = code.filter((f) => /[\\/]components[\\/]/.test(f) && /\.(tsx|jsx)$/.test(f));
  const noHead = comps.filter((f) => { const t = readFileSync(f, "utf8").slice(0, 1500); return !["tier", "use-when", "avoid-when", "reduced-motion", "touch"].every((k) => new RegExp(`\\b${k}\\b`, "i").test(t)); });
  if (noHead.length) w.push(`component headers: ${noHead.length} of ${comps.length} component(s) lack tier / use-when / avoid-when / reduced-motion / touch: ${noHead.slice(0, 5).map((f) => relative(root, f)).join(", ")}`);
  return w;
}

export function completeness(target) {
  const t = resolve(target); const designFile = existsSync(t) && statSync(t).isDirectory() ? join(t, "DESIGN.md") : t; const root = dirname(designFile);
  if (!existsSync(designFile)) return { error: `no DESIGN.md at ${designFile}` };
  const scope = scopeTable(readFileSync(designFile, "utf8")); if (!scope) return { error: `${designFile} has no "## Scope" section (thinking/sequence.md, Step 0.7)` };
  const routes = projectRoutes(root); const rows = []; const invalid = [];
  for (const it of scope.items) {
    const m = markOf(it.mark); if (m.invalid) { invalid.push(`${it.kind} "${it.item}": mark "${m.label}" (use requested, required, optional, or "not required for this brief, reason: …")`); continue; }
    if (!KINDS[it.kind]) { invalid.push(`unknown kind "${it.kind}" for "${it.item}" (kinds: ${Object.keys(KINDS).join(", ")})`); continue; }
    let found = { ok: false, why: "" };
    if (m.counts) {
      if (it.evidence && !/^<.*>$/.test(it.evidence)) found = evidenceOk(root, it.evidence);
      else if (["route", "legal", "admin"].includes(it.kind) && it.item.startsWith("/")) found = routeMatch(it.item, routes) ? { ok: true } : { ok: false, why: "route not found in app/, pages/ or HTML" };
      else found = evidenceOk(root, it.evidence);
    }
    rows.push({ ...it, mark: m.label, reason: m.reason, counts: m.counts, ok: found.ok, why: found.why });
  }
  // the template shape, unless the Scope table excuses a file with a reason
  for (const alts of TEMPLATE_FILES) {
    const listed = rows.find((r) => r.kind === "template" && alts.some((a) => r.item.replace(/\/$/, "") === a.replace(/\/$/, "")));
    if (listed && !listed.counts) continue; if (listed) continue;
    const ok = alts.some((a) => existsSync(join(root, a)));
    rows.push({ kind: "template", item: alts[0], mark: "required (skill)", counts: true, ok, why: ok ? "" : "not found" });
  }
  // template content checks (templates/TEMPLATE.md), each excusable by a template row naming it
  const excused = (name) => rows.some((r) => r.kind === "template" && r.item === name && !r.counts);
  const add = (item, ok, why) => { if (!excused(item)) rows.push({ kind: "template", item, mark: "required (skill)", counts: true, ok, why: ok ? "" : why }); };
  const readme = join(root, "README.md");
  if (existsSync(readme)) add("README demo line", /All data in data\/ is demo\. Replace with real data before launch\./.test(readFileSync(readme, "utf8")), 'README.md lacks "All data in data/ is demo. Replace with real data before launch."');
  const dataFiles = walk(join(root, "data")).filter((f) => f.endsWith(".json") && !/schema\.json$/.test(f));
  if (existsSync(join(root, "data"))) { const bad = dataFiles.filter((f) => !demoLabelled(f)); add("demo labels", dataFiles.length > 0 && !bad.length, dataFiles.length ? `entries not labelled "demo": true in ${bad.slice(0, 4).map((f) => relative(root, f)).join(", ")}` : "data/ has no JSON files"); }
  const used = envVars(root); const envEx = join(root, ".env.example");
  if (used.length) { const listed = existsSync(envEx) ? readFileSync(envEx, "utf8") : ""; const miss = used.filter((v) => !new RegExp(`^\\s*#?\\s*${v}\\s*=`, "m").test(listed)); add(".env.example coverage", !miss.length, `.env.example lacks ${miss.slice(0, 6).join(", ")}`); }
  const pkg = join(root, "package.json");
  if (existsSync(pkg)) { let dev = false; try { dev = !!JSON.parse(readFileSync(pkg, "utf8")).scripts?.dev; } catch {} add("npm run dev", dev, 'package.json has no "dev" script (zero-configuration run)'); }
  const tally = Object.fromEntries(Object.keys(KINDS).map((k) => { const r = rows.filter((x) => x.kind === k && x.counts); return [k, { have: r.filter((x) => x.ok).length, need: r.length, excused: rows.filter((x) => x.kind === k && x.mark === "excused").length }]; }));
  const missing = rows.filter((r) => r.counts && !r.ok);
  return { designFile, root, type: scope.type, admin: scope.admin, routesFound: [...routes].sort(), rows, tally, missing, invalid, warnings: warnings(root), pass: !missing.length && !invalid.length && scope.items.length > 0, empty: scope.items.length === 0 };
}

export function completenessLines(r) {
  const L = [`  X — completeness${r.type ? ` (${r.type}${r.admin ? `, admin panel: ${r.admin}` : ""})` : ""}  ${r.pass ? "✓" : "✗"}`];
  for (const [k, label] of Object.entries(KINDS)) { const t = r.tally[k]; if (!t.need && !t.excused) continue; L.push(`      ${(label + ":").padEnd(12)} ${t.have}/${t.need} ${VERB[k]}${t.excused ? ` · ${t.excused} not required (reason given)` : ""}`); }
  if (r.empty) L.push("      ✗ the Scope table has no items: derive the scope in Step 0.7");
  for (const m of r.missing) L.push(`      ✗ ${m.kind} ${m.item}: ${m.why || "missing"}`);
  for (const i of r.invalid) L.push(`      ✗ ${i}`);
  for (const w of r.warnings) L.push(`      ⚠ ${w}  (warning)`);
  return L;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2); const json = args.includes("--json"); const target = args.find((a) => !a.startsWith("--"));
  if (!target || args.includes("--help")) { console.log("Usage: node scripts/completeness.mjs <project-dir | DESIGN.md> [--json]"); process.exit(target ? 0 : 2); }
  const r = completeness(target);
  if (r.error) { console.error(`completeness: ${r.error}`); process.exit(2); }
  if (json) console.log(JSON.stringify(r, null, 2)); else { console.log(relative(process.cwd(), r.designFile) || r.designFile); for (const l of completenessLines(r)) console.log(l); }
  process.exit(r.pass ? 0 : 1);
}
