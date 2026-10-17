#!/usr/bin/env node
// Completeness (gate axis X, v2.9.0): does the build contain the scope the agent derived in Step 0.7?
// Nothing is hardcoded here: the routes, states, legal pages, edge cases, admin surfaces and skeletons come from the
// `## Scope` table the agent wrote in DESIGN.md (thinking/sequence.md, Step 0.7). This script only checks that each item
// marked "requested" or "required" exists in the project, and that every excused item carries a reason.
// The deliverable shape the skill itself requires (templates/TEMPLATE.md) is checked too, as the "Template" line:
// the files, the README demo line, demo labels on every data/ entry, .env.example covering every env var the code
// reads, and a dev script for zero-configuration runs.
// Delivery mode (templates/TEMPLATE.md → Delivery modes), read from "**Delivery mode:**" in the Scope section, decides
// which template files are required: design exploration < functional frontend < production template (the default when
// the line is missing, so older builds are checked as before). Every mode requires MEDIA.md (craft/media.md), checked
// for a usable inventory, honest placeholder and licence status, and a README pointer when assets still need replacing.
// A Scope with no Delivery mode line predates modes: a missing MEDIA.md there is a warning, so a fix on an older build
// doesn't fail for an inventory it never had; every build that states its mode must ship MEDIA.md.
// Maintenance (no Scope section): the gate runs maintenanceMedia() instead of X, so an absent Scope is never taken as
// proof that media needs no record. Where MEDIA.md exists, every local media file must be listed in it, so an added or
// renamed asset fails until its row is written; placeholders are checked everywhere. In a git working tree the last
// commit is the baseline: media added, renamed or replaced since then is named, a project with no MEDIA.md fails when
// the change added or replaced media, and a file replaced under the same name with MEDIA.md untouched warns. Outside
// git there is no baseline: a same-name replacement can't be told apart from the original (craft/media.md).
//
// Usage:
//   node scripts/completeness.mjs <project-dir | path/to/DESIGN.md> [--json]
//   node scripts/completeness.mjs <project-dir> --maintenance [--json]   (media only, for a fix with no Scope section)
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
import { spawnSync } from "node:child_process";

const KINDS = { route: "Routes", function: "Functions", state: "States", legal: "Legal", edge: "Edge cases", admin: "Admin", skeleton: "Skeletons", template: "Template" };
const VERB = { route: "required present", function: "present", state: "defined", legal: "present", edge: "handled", admin: "present", skeleton: "present", template: "present" };
// the deliverable shape every build ships (templates/TEMPLATE.md); each can be excused in the Scope table with a reason
export const TEMPLATE_FILES = [
  ["README.md"], ["DESIGN.md"], ["MOTION.md"], ["SCHEMA.md"], ["DATA.md"], ["CRITIQUE.md"], ["GATE.md"], ["LICENSE", "LICENSE.md"],
  ["CHANGELOG.md"], [".env.example"], ["middleware.ts", "src/middleware.ts", "middleware.js", "src/middleware.js"], ["data/"], ["data/schema.json", "schema.json"],
  ["MEDIA.md"],
];
// files each delivery mode requires (first name of each TEMPLATE_FILES entry); production template requires them all
const EXPLORATION = ["README.md", "DESIGN.md", "MOTION.md", "CRITIQUE.md", "GATE.md", "MEDIA.md"];
export const MODE_FILES = {
  "design exploration": EXPLORATION,
  "functional frontend": [...EXPLORATION, "SCHEMA.md", "DATA.md", "data/", "data/schema.json"],
  "production template": TEMPLATE_FILES.map((a) => a[0]),
};
export function modeOf(raw) {
  if (!raw) return { mode: "production template", stated: false };
  const s = raw.toLowerCase();
  const mode = /explor/.test(s) ? "design exploration" : /frontend/.test(s) ? "functional frontend" : /production|template/.test(s) ? "production template" : null;
  return mode ? { mode, stated: true } : { mode: "production template", stated: true, invalid: raw };
}

function scopeTable(md) {
  const i = md.search(/^##\s+Scope\b/m); if (i < 0) return null;
  const body = md.slice(i).split("\n").slice(1); const end = body.findIndex((l) => /^##\s/.test(l)); const sec = (end < 0 ? body : body.slice(0, end)).join("\n");
  const admin = (/\*\*Admin panel:\*\*\s*([a-z]+)/i.exec(sec) || /Admin panel:\s*([a-z]+)/i.exec(sec) || [])[1] || null;
  const type = (/\*\*Site type:\*\*\s*([^\n]+)/i.exec(sec) || /Site type:\s*([^\n]+)/i.exec(sec) || [])[1]?.trim() || null;
  const mode = (/\*\*Delivery mode:\*\*\s*([^\n]+)/i.exec(sec) || /Delivery mode:\s*([^\n]+)/i.exec(sec) || [])[1]?.trim() || null;
  const rows = sec.split("\n").filter((l) => /^\s*\|/.test(l)).map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  const head = rows.findIndex((r) => r[0] && /^kind$/i.test(r[0]));
  const items = rows.slice(head + 1).filter((r) => r.length >= 3 && !/^-+$/.test(r[0].replace(/:/g, "")) && r[0] && !/^<.*>$/.test(r[1] || ""))
    .map((r) => ({ kind: r[0].toLowerCase().replace(/s$/, "").replace(/^edge case$|^edge-case$/, "edge"), item: r[1].replace(/^`|`$/g, ""), mark: r[2], evidence: (r[3] || "").replace(/^`|`$/g, "") }));
  return { admin, type, mode, items };
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
  const want = norm(item.split(/\s/)[0].replace(/\.html?$/, "").replace(/(^|\/)index$/, "")); if (routes.has(want)) return true; // /prices.html names the same route as /prices
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

// entries are items[] / item (templates/DATA.md); a file shaped otherwise has its top-level arrays of objects checked as
// entries, so an unlabelled record under another key (chapters, rows) is not missed
function demoLabelled(f) { try { const j = JSON.parse(readFileSync(f, "utf8")); if (Array.isArray(j)) return j.every((x) => x && (x.demo === true || x._demo === true)); if (j.demo !== true && j._demo !== true) return false;
  const arr = Array.isArray(j.items) ? j.items : j.item ? [j.item] : Object.values(j).filter((v) => Array.isArray(v) && v.length && v.every((x) => x && typeof x === "object" && !Array.isArray(x))).flat();
  return arr.every((x) => x && (x.demo === true || x._demo === true)); } catch { return false; } }
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

// MEDIA.md (craft/media.md): a usable inventory, honest placeholder / licence status, every placeholder documented.
// Deterministic text checks only; it never decides whether a licence is valid, it only refuses contradictions.
const yes = (v) => /^(yes|y|true)\b/i.test(v); const no = (v) => /^(no|n|false)\b/i.test(v);
// local media files: images, video and SVG files the project serves (build output, node_modules and favicon.ico excluded)
const MEDIA_EXT = /\.(jpe?g|png|webp|avif|gif|svg|mp4|webm|mov|m4v)$/i;
export function mediaFiles(root) { return walk(root).filter((p) => MEDIA_EXT.test(p) && !/[\\/](out|dist|build|\.next)[\\/]/.test(p) && !/(^|[\\/])favicon\./i.test(p)).map((p) => relative(root, p).split(sep).join("/")); }
// placeholder files and PLACEHOLDER comments that MEDIA.md (its text, or "" when absent) does not list
function undocumentedPlaceholders(root, md) {
  const problems = [];
  for (const p of walk(root).filter((x) => !/[\\/](out|dist|build|\.next)[\\/]/.test(x))) {
    const base = p.split(/[\\/]/).pop();
    if (/^placeholder-/i.test(base) && !md.includes(base)) problems.push(`placeholder ${relative(root, p)} is not listed in MEDIA.md`);
    if (/\.(html?|tsx|ts|jsx|js|mjs|css|astro|svelte|vue|mdx)$/.test(base)) {
      let t = ""; try { t = readFileSync(p, "utf8"); } catch {}
      for (const m of t.matchAll(/PLACEHOLDER:\s*([^;\s]+)/g)) if (!/^<.*>$/.test(m[1]) && !md.includes(m[1])) problems.push(`PLACEHOLDER ${m[1]} in ${relative(root, p)} is not listed in MEDIA.md`);
    }
  }
  return problems;
}
export function mediaChecks(root) {
  const f = join(root, "MEDIA.md"); if (!existsSync(f)) return { problems: [], unresolved: 0 }; // the file itself is a template row
  const md = readFileSync(f, "utf8"); const problems = []; let unresolved = 0;
  // the inventory is the table under the header row below, up to its first non-table line: a later table (fonts,
  // icon packages) has its own columns and is not read as inventory rows
  const cells = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const isHead = (r) => r.some((c) => /asset|file/i.test(c)) && r.some((c) => /source/i.test(c)) && r.some((c) => /licen[cs]e|usage/i.test(c)) && r.some((c) => /placeholder/i.test(c)) && r.some((c) => /replace/i.test(c));
  const lines = md.split("\n"); const start = lines.findIndex((l) => /^\s*\|/.test(l) && isHead(cells(l)));
  const rows = []; if (start >= 0) for (let i = start; i < lines.length && /^\s*\|/.test(lines[i]); i++) rows.push(cells(lines[i]));
  let listedAssets = [];
  const hi = rows.length ? 0 : -1;
  if (hi < 0) {
    if (!/no external media/i.test(md)) problems.push("MEDIA.md has no inventory table (File or asset | Source URL | License / usage status | Placeholder? | Replace before production?) and does not state that no external media assets were used");
  } else {
    const h = rows[hi]; const col = (re) => h.findIndex((c) => re.test(c));
    const cA = col(/asset|file/i), cS = col(/source/i), cL = col(/licen[cs]e|usage/i), cP = col(/placeholder/i), cR = col(/replace/i);
    for (const r of rows.slice(hi + 1).filter((r) => !r.every((c) => /^:?-+:?$/.test(c) || !c))) {
      const a = (r[cA] || "").replace(/`/g, ""), src = r[cS] || "", lic = r[cL] || "", ph = r[cP] || "", rp = r[cR] || "";
      if (!a || /^<.*>$/.test(a)) continue; // template example rows
      listedAssets.push(a.replace(/^\.?\//, ""));
      const name = `MEDIA.md "${a}"`;
      if (!src || /^<.*>$/.test(src)) problems.push(`${name}: no source (a URL, "custom", or "client-supplied")`);
      if (!lic || /^<.*>$/.test(lic)) problems.push(`${name}: no license / usage status (write "unknown" if unverified)`);
      if (!yes(ph) && !no(ph)) problems.push(`${name}: Placeholder? must be yes or no`);
      if (!yes(rp) && !no(rp)) problems.push(`${name}: Replace before production? must be yes or no`);
      if (yes(ph) && no(rp)) problems.push(`${name}: a placeholder marked as not needing replacement`);
      if (/placeholder-/i.test(a) && no(ph)) problems.push(`${name}: named placeholder-… but marked as not a placeholder`);
      if (/\b(unknown|unverified)\b/i.test(lic) && no(rp)) problems.push(`${name}: licence unknown or unverified, yet not marked for replacement before production`);
      if (yes(rp)) unresolved++;
    }
  }
  // every placeholder file and PLACEHOLDER comment in the project is listed in MEDIA.md
  problems.push(...undocumentedPlaceholders(root, md));
  // every local media file has a row: its path, its file name, or a folder row ending in "/" that contains it
  const folders = listedAssets.filter((a) => a.endsWith("/"));
  for (const m of mediaFiles(root)) { const base = m.split("/").pop(); if (!/^placeholder-/i.test(base) && !listedAssets.some((a) => a === m || a.split("/").pop() === base) && !folders.some((d) => m.startsWith(d))) problems.push(`media file ${m} has no row in MEDIA.md (new or renamed media is recorded with its source and licence status)`); }
  if (unresolved) { const rd = join(root, "README.md"); if (existsSync(rd) && !/MEDIA\.md/.test(readFileSync(rd, "utf8"))) problems.push(`README.md does not point to MEDIA.md, though ${unresolved} asset(s) must be replaced or cleared before production`); }
  return { problems, unresolved };
}

// Narrow maintenance (DESIGN.md without a Scope section, or no DESIGN.md): media only. With a MEDIA.md, the full media
// check (inventory, contradictions, every media file listed); without one, undocumented placeholders still fail, and
// media files with no inventory are a warning, since this check can't tell whether the change touched them.
// The baseline: media files (and MEDIA.md) changed since the last commit, from `git status`; null outside a git working
// tree or before the first commit, so the caller says it has no baseline instead of guessing.
export function changedSinceCommit(root) {
  const git = (...a) => spawnSync("git", ["-C", root, ...a], { encoding: "utf8" });
  const top = git("rev-parse", "--show-toplevel"); if (top.status !== 0 || git("rev-parse", "--verify", "-q", "HEAD").status !== 0) return null;
  const st = git("status", "--porcelain=v1", "--untracked-files=all", "--", "."); if (st.status !== 0) return null;
  const out = { added: [], replaced: [], removed: [], mediaDoc: false }; const media = new Set(mediaFiles(root));
  for (const line of st.stdout.split("\n").filter(Boolean)) {
    const code = line.slice(0, 2); const p = relative(root, join(top.stdout.trim(), line.slice(3).split(" -> ").pop().replace(/^"|"$/g, ""))).split(sep).join("/");
    if (p === "MEDIA.md") { out.mediaDoc = true; continue; }
    if (!MEDIA_EXT.test(p)) continue;
    if (code.includes("D")) out.removed.push(p); else if (!media.has(p)) continue; // build output, favicon.*
    else if (code === "??" || code.includes("A") || code.includes("R") || code.includes("C")) out.added.push(p); else if (code.includes("M")) out.replaced.push(p);
  }
  return out;
}
export function maintenanceMedia(root) {
  const has = existsSync(join(root, "MEDIA.md"));
  const r = has ? mediaChecks(root) : { problems: undocumentedPlaceholders(root, ""), unresolved: 0 };
  const files = mediaFiles(root); const warnings = []; const base = changedSinceCommit(root); const touched = base ? [...base.added, ...base.replaced] : [];
  const list = (xs) => xs.slice(0, 4).join(", ") + (xs.length > 4 ? ` and ${xs.length - 4} more` : "");
  if (!has && touched.length) r.problems.push(`this change adds or replaces media since the last commit (${list(touched)}) and the project has no MEDIA.md; create it (craft/media.md)`);
  else if (!has && files.length) warnings.push(base ? `media: ${files.length} media file(s) and no MEDIA.md; none added or replaced since the last commit (git), so none is required for this change` : `media: ${files.length} media file(s) and no MEDIA.md, and no baseline (not a git working tree with a commit): this check cannot tell which files this change touched; if it added, replaced or removed media, create MEDIA.md (craft/media.md)`);
  if (has && base && base.replaced.length && !base.mediaDoc) warnings.push(`media: ${list(base.replaced)} changed under the same name since the last commit and MEDIA.md did not; confirm each row (source, licence status) still holds`);
  if (has && !base && files.length) warnings.push("media: no baseline (not a git working tree with a commit): a file replaced under the same name is not detected; update its MEDIA.md row by hand");
  if (r.unresolved) warnings.push(`media: ${r.unresolved} asset(s) in MEDIA.md must be replaced or cleared before production; not production-ready until they are`);
  return { root, maintenance: true, hasMedia: has, mediaFiles: files.length, baseline: base ? "git (last commit)" : null, changed: base, problems: r.problems, warnings, pass: !r.problems.length };
}
export function maintenanceLines(r) {
  const L = [`  X — media (maintenance: no Scope section; ${r.hasMedia ? "MEDIA.md checked" : "no MEDIA.md"}; baseline: ${r.baseline || "none"})  ${r.pass ? "✓" : "✗"}`];
  for (const p of r.problems) L.push(`      ✗ ${p}`);
  for (const w of r.warnings) L.push(`      ⚠ ${w}  (warning)`);
  return L;
}

export function completeness(target) {
  const t = resolve(target); const designFile = existsSync(t) && statSync(t).isDirectory() ? join(t, "DESIGN.md") : t; const root = dirname(designFile);
  if (!existsSync(designFile)) return { error: `no DESIGN.md at ${designFile}` };
  const scope = scopeTable(readFileSync(designFile, "utf8")); if (!scope) return { error: `${designFile} has no "## Scope" section (thinking/sequence.md, Step 0.7)` };
  const routes = projectRoutes(root); const rows = []; const invalid = [];
  const dm = modeOf(scope.mode); if (dm.invalid) invalid.push(`delivery mode "${dm.invalid}" (use design exploration, functional frontend or production template)`);
  const needed = new Set(MODE_FILES[dm.mode]); let legacyNoMedia = false;
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
  for (const alts of TEMPLATE_FILES.filter((a) => needed.has(a[0]))) {
    const listed = rows.find((r) => r.kind === "template" && alts.some((a) => r.item.replace(/\/$/, "") === a.replace(/\/$/, "")));
    if (alts[0] === "MEDIA.md" && listed && !listed.counts) invalid.push("MEDIA.md cannot be excused: every website build ships it (craft/media.md); with no external media it says so");
    if (alts[0] !== "MEDIA.md" && listed) continue;
    const ok = alts.some((a) => existsSync(join(root, a)));
    if (alts[0] === "MEDIA.md" && !ok && !dm.stated) { legacyNoMedia = true; continue; }
    rows.push({ kind: "template", item: alts[0], mark: "required (skill)", counts: true, ok, why: ok ? "" : "not found" });
  }
  // template content checks (templates/TEMPLATE.md), each excusable by a template row naming it
  const excused = (name) => rows.some((r) => r.kind === "template" && r.item === name && !r.counts);
  const add = (item, ok, why) => { if (!excused(item)) rows.push({ kind: "template", item, mark: "required (skill)", counts: true, ok, why: ok ? "" : why }); };
  const readme = join(root, "README.md");
  if (existsSync(readme) && (dm.mode !== "design exploration" || existsSync(join(root, "data")))) add("README demo line", /All data in data\/ is demo\. Replace with real data before launch\./.test(readFileSync(readme, "utf8")), 'README.md lacks "All data in data/ is demo. Replace with real data before launch."');
  const dataFiles = walk(join(root, "data")).filter((f) => f.endsWith(".json") && !/schema\.json$/.test(f));
  if (existsSync(join(root, "data"))) { const bad = dataFiles.filter((f) => !demoLabelled(f)); add("demo labels", dataFiles.length > 0 && !bad.length, dataFiles.length ? `entries not labelled "demo": true in ${bad.slice(0, 4).map((f) => relative(root, f)).join(", ")}` : "data/ has no JSON files"); }
  const used = envVars(root); const envEx = join(root, ".env.example");
  if (used.length) { const listed = existsSync(envEx) ? readFileSync(envEx, "utf8") : ""; const miss = used.filter((v) => !new RegExp(`^\\s*#?\\s*${v}\\s*=`, "m").test(listed)); add(".env.example coverage", !miss.length, `.env.example lacks ${miss.slice(0, 6).join(", ")}`); }
  const pkg = join(root, "package.json");
  if (existsSync(pkg)) { let dev = false; try { dev = !!JSON.parse(readFileSync(pkg, "utf8")).scripts?.dev; } catch {} add("npm run dev", dev, 'package.json has no "dev" script (zero-configuration run)'); }
  // research for new design work (Step 0.5, craft/research.md): no delivery mode skips it
  const dtext = readFileSync(designFile, "utf8");
  for (const [item, re] of [["Type research", /^##\s+Type research\b/m], ["References", /^##\s+References\b/m]]) {
    const ok = re.test(dtext);
    if (dm.stated) rows.push({ kind: "template", item: `DESIGN.md ${item}`, mark: "required (skill)", counts: true, ok, why: ok ? "" : `DESIGN.md has no "## ${item}" section (Step 0.5, craft/research.md)` });
  }
  const media = mediaChecks(root);
  for (const p of media.problems) rows.push({ kind: "template", item: "MEDIA.md inventory", mark: "required (skill)", counts: true, ok: false, why: p });
  if (existsSync(join(root, "MEDIA.md")) && !media.problems.length) rows.push({ kind: "template", item: "MEDIA.md inventory", mark: "required (skill)", counts: true, ok: true, why: "" });
  // "production-ready" is a claim only a production template with nothing left in MEDIA.md to replace can make
  if (existsSync(readme)) { const claim = readFileSync(readme, "utf8").split("\n").find((l) => /\bproduction[- ]ready\b/i.test(l) && !/\bnot\b|\bn't\b|\bbefore\b|\buntil\b/i.test(l));
    if (claim && dm.mode !== "production template") rows.push({ kind: "template", item: "README readiness claim", mark: "required (skill)", counts: true, ok: false, why: `README.md calls a ${dm.mode} production-ready: "${claim.trim().slice(0, 80)}"` });
    else if (claim && media.unresolved) rows.push({ kind: "template", item: "README readiness claim", mark: "required (skill)", counts: true, ok: false, why: `README.md says production-ready while ${media.unresolved} asset(s) in MEDIA.md must be replaced or cleared` }); }
  const tally = Object.fromEntries(Object.keys(KINDS).map((k) => { const r = rows.filter((x) => x.kind === k && x.counts); return [k, { have: r.filter((x) => x.ok).length, need: r.length, excused: rows.filter((x) => x.kind === k && x.mark === "excused").length }]; }));
  const missing = rows.filter((r) => r.counts && !r.ok);
  const warn = warnings(root); if (media.unresolved) warn.push(`media: ${media.unresolved} asset(s) in MEDIA.md must be replaced or cleared before production; not production-ready until they are`);
  if (legacyNoMedia) warn.push("media: no MEDIA.md (craft/media.md); required for every build that states its delivery mode, add it when this build is next delivered");
  if (!dm.stated) warn.push("delivery mode: no \"**Delivery mode:**\" line in the Scope section; checked as production template");
  return { designFile, root, type: scope.type, admin: scope.admin, mode: dm.mode, routesFound: [...routes].sort(), rows, tally, missing, invalid, warnings: warn, pass: !missing.length && !invalid.length && scope.items.length > 0, empty: scope.items.length === 0 };
}

export function completenessLines(r) {
  const L = [`  X — completeness${r.type ? ` (${r.type}${r.admin ? `, admin panel: ${r.admin}` : ""})` : ""}${r.mode ? ` [${r.mode}]` : ""}  ${r.pass ? "✓" : "✗"}`];
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
  if (!target || args.includes("--help")) { console.log("Usage: node scripts/completeness.mjs <project-dir | DESIGN.md> [--json] | <project-dir> --maintenance [--json]"); process.exit(target ? 0 : 2); }
  if (args.includes("--maintenance")) { const t = resolve(target); const m = maintenanceMedia(existsSync(t) && statSync(t).isDirectory() ? t : dirname(t)); if (json) console.log(JSON.stringify(m, null, 2)); else for (const l of maintenanceLines(m)) console.log(l); process.exit(m.pass ? 0 : 1); }
  const r = completeness(target);
  if (r.error) { console.error(`completeness: ${r.error}`); process.exit(2); }
  if (json) console.log(JSON.stringify(r, null, 2)); else { console.log(relative(process.cwd(), r.designFile) || r.designFile); for (const l of completenessLines(r)) console.log(l); }
  process.exit(r.pass ? 0 : 1);
}
