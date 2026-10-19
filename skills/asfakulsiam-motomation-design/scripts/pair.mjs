#!/usr/bin/env node
// Paired directions: two builds of ONE product contract in two art directions (a paired brief, or "show me two
// directions"). Measured route by route, in a real browser and from the files, never typed.
//
//   node scripts/pair.mjs <dirA> <dirB> [--json] [--out report.json] [--threshold 0.4] [--max 10]
//        [--routes /,/shop,/checkout] [--viewport 1440x900,375x812] [--labels a,b]
//     each dir: a static site, or a project with built output (out/ dist/ build/ .output/public _site public)
//
// originality.mjs compares one page per side and cannot tell required sameness (the same checkout fields) from visual
// repetition (the same page in another theme). This script separates the two:
//
//   route parity      every route of either build exists in the other (from the files: scripts/completeness.mjs
//                     projectRoutes). A route only one direction has is a product difference → FAIL.
//   function parity   per shared route, forms (field types, validation, live regions, submit kind) and navigation
//                     landmarks, compared as similarities. Required to be HIGH: < 0.5 on a route with a form is reported
//                     as functional drift (one direction dropped a field, a label, validation). Never counted as repetition.
//   visual difference per shared route, originality.mjs's six axes with --same-product (forms and navigation left out),
//                     worst of the viewports. Each route is classified:
//                       recomposed     structure and composition both below the threshold
//                       cosmetic-only  structure and composition both at or above it, while typography or imagery
//                                      differ: the same page restyled (a reskin) → FAIL
//                       repeat         overall at or above it → FAIL
//                       partial        one of structure/composition at or above it → reported, not failed
//   shared markup     from the rendered HTML, per route: the body's element skeleton with form internals collapsed to one
//                     token (forms are parity) and attributes dropped, compared as 1 − edit distance. ≥ 0.8 on a route
//                     is a shared template → FAIL. Plus byte-identical source files in both projects: presentation files
//                     (html, css, components, page files) shared → FAIL; logic and data (js/ts outside components, json,
//                     lib/ store/ data/ hooks/) shared is expected and listed as shared logic.
//   coherence         per direction, across its compared routes: the share of routes using that direction's most common
//                     display and body faces. < 0.75 is reported (the direction does not hold together), not failed.
//
// What it cannot establish: whether either direction is good, fits the brief, or is accessible (run gate.mjs on each);
// whether the journeys complete (gate.mjs --journey on each); whether differences are meaningful rather than arbitrary;
// motion quality; routes beyond --max (listed as not compared).
// Exit: 0 pass · 1 fail · 2 usage · 3 not verified (no browser). Without Playwright it prints "not verified — no browser".
import { createServer } from "node:http";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, resolve, sep } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { cli } from "./lib.mjs";
import { AXES, THRESHOLD, SAME_PRODUCT, features, compare, parseViewports, seqSim, wjaccard } from "./originality.mjs";
import { projectRoutes, contractRoutes } from "./completeness.mjs";

const USAGE = "Usage: node scripts/pair.mjs <dirA> <dirB> [--json] [--out report.json] [--threshold 0.4] [--max 10] [--routes /,/shop] [--viewport 1440x900,375x812] [--labels a,b]";
export const MARKUP_MAX = 0.8, PARITY_MIN = 0.5, COHERENCE_MIN = 0.75;
const BUILD_DIRS = ["out", "dist", "build", ".output/public", "_site", "public"];
const SKIP = new Set(["node_modules", ".git", ".next", ".motomation", "screens", "screenshots", ".turbo", ".vercel"]);

/** The folder a build is served from: the dir itself when it has index.html, else its build output. */
export function siteRoot(dir) {
  const abs = resolve(dir); if (existsSync(join(abs, "index.html"))) return abs;
  const d = BUILD_DIRS.find((x) => existsSync(join(abs, x, "index.html"))); if (d) return join(abs, d);
  throw new Error(`no index.html in ${dir} and no build output (${BUILD_DIRS.join(", ")})`);
}
function walk(dir, out = [], depth = 0) {
  if (depth > 10 || !existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) { if (SKIP.has(e.name) || e.name.startsWith(".")) continue; const p = join(dir, e.name); if (e.isDirectory()) walk(p, out, depth + 1); else out.push(p); }
  return out;
}
const DYN = /\[|\]|:/;
/** Concrete routes a build serves (dynamic segments are not visitable and are left out). */
export function routesOf(dir) { const root = siteRoot(dir); return [...new Set([...projectRoutes(root)].filter((r) => !DYN.test(r) && !/^\/404$|^\/500$/.test(r)))].sort(); }
/** The file a route is served from in a static root. */
export function fileFor(root, route) {
  const r = route === "/" ? "" : route.replace(/^\//, "");
  for (const c of [join(root, r, "index.html"), join(root, r + ".html"), join(root, r + ".htm")]) if (existsSync(c) && statSync(c).isFile()) return c;
  return null;
}
/** Element skeleton of a body: tag names in document order, attributes dropped, script/style/svg/template contents and
 *  form internals collapsed (forms are required parity, not markup sharing). Pure, exported for tests. */
export function skeleton(html) {
  let b = String(html); const i = b.search(/<body[\s>]/i); if (i >= 0) b = b.slice(i);
  b = b.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, "").replace(/<svg\b[\s\S]*?<\/svg>/gi, "<svg>").replace(/<form\b[\s\S]*?<\/form>/gi, "<form>");
  const IGNORE = new Set(["body", "br", "wbr", "span", "b", "i", "em", "strong", "small", "abbr", "source", "option", "html", "head"]);
  return [...b.matchAll(/<([a-z][a-z0-9-]*)\b/gi)].map((m) => m[1].toLowerCase()).filter((t) => !IGNORE.has(t)).slice(0, 600);
}
/** Byte-identical files in both projects, split into presentation (shared → a reskin) and logic/data (shared → fine). */
export function sharedFiles(dirA, dirB) {
  const hashes = (d) => { const m = new Map(); for (const f of walk(resolve(d))) { if (statSync(f).size > 2_000_000 || statSync(f).size < 64) continue; m.set(createHash("sha1").update(readFileSync(f)).digest("hex"), relative(resolve(d), f).split(sep).join("/")); } return m; };
  const A = hashes(dirA), B = hashes(dirB); const presentation = [], logic = [];
  for (const [h, f] of A) { if (!B.has(h)) continue; const g = B.get(h); const ext = extname(f).toLowerCase();
    if (/\.(png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp4|webm|mp3)$/.test(ext)) continue; // shared media and fonts: an asset choice, judged by image/typography
    const isLogicPath = /(^|\/)(lib|store|stores|data|hooks|utils|api|types|services|state)(\/|$)/i.test(f) || /(store|cart|validation|schema|format|data|api|state|utils?)\.[jt]sx?$/i.test(basename(f));
    const pres = /\.(html?|css|scss|sass|less|vue|svelte|astro)$/.test(ext) || (/\.(tsx|jsx)$/.test(ext) && !isLogicPath) || /(^|\/)(components|app|pages|layouts|templates|sections)\//.test(f) && !isLogicPath && !/\.json$/.test(ext);
    (pres ? presentation : logic).push(f === g ? f : `${f} = ${g}`); }
  return { presentation: presentation.sort(), logic: logic.sort() };
}
/** Per-route classification from the six axis scores (pure). */
export function classify(score, threshold = THRESHOLD) {
  const at = (ax) => score[ax] !== null && score[ax] !== undefined && score[ax] >= threshold;
  if (at("structure") && at("composition")) return (!at("typography") || (score.image !== null && !at("image"))) ? "cosmetic-only" : "repeat";
  if (score.overall !== null && score.overall >= threshold) return "repeat";
  if (at("structure") || at("composition")) return "partial";
  return "recomposed";
}
/** Share of routes using the direction's most common display/body pair (pure). */
export function coherence(faces) {
  const xs = faces.filter((f) => f.display || f.body); if (!xs.length) return { share: null, faces: null };
  const c = {}; for (const f of xs) { const k = `${f.display || "–"} / ${f.body || "–"}`; c[k] = (c[k] || 0) + 1; }
  const [top, n] = Object.entries(c).sort((a, b) => b[1] - a[1])[0]; return { share: Math.round((n / xs.length) * 100) / 100, faces: top, variants: Object.keys(c).length };
}
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };
function serve(root) {
  return new Promise((ok) => { const srv = createServer((req, res) => { const p = decodeURIComponent(new URL(req.url, "http://x").pathname); let f = join(root, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!existsSync(f) && existsSync(f + ".html")) f += ".html";
    if (!f.startsWith(root) || !existsSync(f)) { const nf = join(root, "404.html"); res.writeHead(404, { "content-type": "text/html" }); return res.end(existsSync(nf) ? readFileSync(nf) : "not found"); }
    res.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream" }); res.end(readFileSync(f)); }).listen(0, "127.0.0.1", () => ok(srv)); });
}
async function loadPlaywright() {
  for (const base of [process.cwd(), fileURLToPath(new URL(".", import.meta.url))]) { const req = createRequire(join(base, "noop.js")); for (const n of ["playwright", "playwright-core"]) { try { const m = await import(req.resolve(n)); const pw = m.chromium ? m : m.default; if (pw?.chromium) return pw; } catch {} } }
  return null;
}
async function rendered(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  try { await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {}); return await page.evaluate(() => document.body ? document.body.outerHTML : ""); } finally { await ctx.close(); }
}
/** Pick the routes to compare: home, then the Scope table's routes (A's DESIGN.md), then the rest, up to max. */
export function pickRoutes(shared, contract = [], max = 10) {
  const order = [...new Set(["/", ...contract.filter((r) => shared.includes(r)), ...shared])].filter((r) => shared.includes(r));
  return { compared: order.slice(0, max), skipped: order.slice(max) };
}

export async function pair(dirA, dirB, { threshold = THRESHOLD, max = 10, routes = null, viewports = [[1440, 900], [375, 812]], browser } = {}) {
  const rootA = siteRoot(dirA), rootB = siteRoot(dirB);
  const rA = routesOf(dirA), rB = routesOf(dirB);
  const onlyA = rA.filter((r) => !rB.includes(r)), onlyB = rB.filter((r) => !rA.includes(r)), shared = rA.filter((r) => rB.includes(r));
  const contract = [...contractRoutes(resolve(dirA)), ...contractRoutes(resolve(dirB))].map((r) => r.replace(/\.html?$/, "").toLowerCase());
  const pick = routes ? { compared: routes.filter((r) => shared.includes(r)), skipped: shared.filter((r) => !routes.includes(r)), missing: routes.filter((r) => !shared.includes(r)) } : pickRoutes(shared, contract, max);
  const files = sharedFiles(dirA, dirB);
  const sA = await serve(rootA), sB = await serve(rootB); const uA = `http://127.0.0.1:${sA.address().port}`, uB = `http://127.0.0.1:${sB.address().port}`;
  const per = []; const facesA = [], facesB = [];
  SAME_PRODUCT.on = false; // function parity needs forms and navigation; --same-product is applied per comparison below
  try {
    for (const route of pick.compared) {
      const path = route; const vps = {};
      for (const vp of viewports) {
        const fa = await features(browser, uA + path, vp), fb = await features(browser, uB + path, vp);
        if (vp === viewports[0]) { facesA.push({ route, display: fa.typography.display, body: fa.typography.body }); facesB.push({ route, display: fb.typography.display, body: fb.typography.body }); }
        SAME_PRODUCT.on = true; const vis = compare(fa, fb); SAME_PRODUCT.on = false;
        const fn = {}; for (const k of ["forms", "navigation"]) { const x = fa.interaction[k], y = fb.interaction[k]; if (Object.keys(x || {}).length || Object.keys(y || {}).length) fn[k] = Math.round(wjaccard(x, y) * 100) / 100; }
        vps[`${vp[0]}x${vp[1]}`] = { score: vis.score, parts: vis.parts, fn };
      }
      // worst viewport per axis (a pair repeats on an axis if it repeats at any size); function parity: the lowest
      const score = {}; for (const ax of [...AXES, "overall"]) { const vs = Object.values(vps).map((v) => v.score[ax]).filter((x) => x !== null && x !== undefined); score[ax] = vs.length ? Math.max(...vs) : null; }
      const fn = {}; for (const v of Object.values(vps)) for (const [k, x] of Object.entries(v.fn)) fn[k] = fn[k] === undefined ? x : Math.min(fn[k], x);
      const markup = Math.round(seqSim(skeleton(await rendered(browser, uA + path)), skeleton(await rendered(browser, uB + path))) * 100) / 100;
      const cls = classify(score, threshold);
      per.push({ route, class: cls, score, fn, markup, drift: fn.forms !== undefined && fn.forms < PARITY_MIN, sharedMarkup: markup >= MARKUP_MAX, viewports: vps });
    }
  } finally { sA.close(); sB.close(); }
  const cohA = coherence(facesA), cohB = coherence(facesB);
  const fails = [];
  if (onlyA.length || onlyB.length) fails.push(`route parity: ${onlyA.length ? `only in A: ${onlyA.join(", ")}` : ""}${onlyA.length && onlyB.length ? "; " : ""}${onlyB.length ? `only in B: ${onlyB.join(", ")}` : ""}`);
  for (const p of per) {
    if (p.class === "cosmetic-only") fails.push(`${p.route}: cosmetic-only (structure ${p.score.structure}, composition ${p.score.composition} ≥ ${threshold}; the same page restyled)`);
    if (p.class === "repeat") fails.push(`${p.route}: repeat (overall ${p.score.overall} ≥ ${threshold})`);
    if (p.sharedMarkup) fails.push(`${p.route}: shared markup (element skeleton ${p.markup} ≥ ${MARKUP_MAX}; one template, two themes)`);
    if (p.drift) fails.push(`${p.route}: functional drift (forms parity ${p.fn.forms} < ${PARITY_MIN}: fields, labels or validation differ between the directions)`);
  }
  if (files.presentation.length) fails.push(`shared presentation files (${files.presentation.length}): ${files.presentation.slice(0, 5).join(", ")}${files.presentation.length > 5 ? " …" : ""}`);
  const notes = [];
  for (const [k, c] of [["A", cohA], ["B", cohB]]) if (c.share !== null && c.share < COHERENCE_MIN) notes.push(`direction ${k} coherence ${c.share} < ${COHERENCE_MIN}: ${c.variants} display/body pairings across ${per.length} route(s)`);
  for (const p of per) if (p.class === "partial") notes.push(`${p.route}: partial (${p.score.structure >= threshold ? "structure" : "composition"} at or above ${threshold}); check the screenshots`);
  if (pick.skipped.length) notes.push(`not compared (beyond --max ${max}): ${pick.skipped.join(", ")}`);
  if (pick.missing?.length) notes.push(`--routes not in both builds: ${pick.missing.join(", ")}`);
  return { pass: fails.length === 0, threshold, a: resolve(dirA), b: resolve(dirB), routes: { a: rA.length, b: rB.length, shared: shared.length, onlyA, onlyB, compared: pick.compared, skipped: pick.skipped },
    per, sharedFiles: files, coherence: { a: cohA, b: cohB }, fails, notes, viewports: viewports.map(([w, h]) => `${w}x${h}`),
    limits: "does not judge quality, brief fit, accessibility, journeys or motion: run gate.mjs (and --journey) on each direction" };
}

export function pairLines(r, [la, lb] = ["A", "B"]) {
  const L = []; const f2 = (x) => (x === null || x === undefined ? "n/a" : x.toFixed(2));
  L.push(`PAIR · ${la} × ${lb} · ${r.routes.compared.length} of ${r.routes.shared} shared route(s) compared at ${r.viewports.join(", ")} · threshold ${r.threshold} (lower = more different)`);
  L.push(`  route parity     ${r.routes.onlyA.length || r.routes.onlyB.length ? "✗" : "✓"} ${r.routes.a} / ${r.routes.b} route(s)${r.routes.onlyA.length ? ` · only in ${la}: ${r.routes.onlyA.join(", ")}` : ""}${r.routes.onlyB.length ? ` · only in ${lb}: ${r.routes.onlyB.join(", ")}` : ""}`);
  L.push(`  coherence        ${la} ${r.coherence.a.share ?? "n/a"} (${r.coherence.a.faces || "–"}) · ${lb} ${r.coherence.b.share ?? "n/a"} (${r.coherence.b.faces || "–"})`);
  L.push(`  shared files     presentation ${r.sharedFiles.presentation.length}${r.sharedFiles.presentation.length ? ` ✗ (${r.sharedFiles.presentation.slice(0, 4).join(", ")})` : ""} · logic/data ${r.sharedFiles.logic.length}${r.sharedFiles.logic.length ? ` (${r.sharedFiles.logic.slice(0, 4).join(", ")}): expected` : ""}`);
  L.push("");
  L.push(`| Route | class | ${AXES.join(" | ")} | overall | markup | forms parity | nav parity |`);
  L.push(`|---|---|${AXES.map(() => "---:").join("|")}|---:|---:|---:|---:|`);
  for (const p of r.per) L.push(`| ${p.route} | ${p.class}${["cosmetic-only", "repeat"].includes(p.class) ? " ✗" : ""} | ${AXES.map((ax) => f2(p.score[ax])).join(" | ")} | ${f2(p.score.overall)} | ${f2(p.markup)}${p.sharedMarkup ? " ✗" : ""} | ${f2(p.fn.forms)}${p.drift ? " ✗" : ""} | ${f2(p.fn.navigation)} |`);
  L.push(""); L.push("  visual axes: similarity with forms and navigation left out (--same-product), worst viewport · markup: element skeleton, form internals collapsed · parity: required to be high");
  for (const n of r.notes) L.push(`  · ${n}`);
  L.push(`  limits: ${r.limits}`);
  L.push(""); // v3.0.2: the counts are split. "22 route(s) recomposed or partial" hid 19 partial routes; evals/rubric.md's paired test
  // (originality.mjs, every axis under the threshold) is stricter than this structural pass, and a partial route fails it
  const nPart = r.per.filter((p) => p.class === "partial").length, nRe = r.per.filter((p) => p.class === "recomposed").length;
  L.push(r.pass ? `PASS  one product, ${nRe} route(s) recomposed${nPart ? `, ${nPart} partial` : ""}, no shared presentation, routes and functions at parity${nPart ? `\n      structural pass only: ${nPart} partial route(s) have an axis at or above ${r.threshold}, so the pair does not meet the strict every-axis test (evals/rubric.md); report it as partial, not as fully different` : ""}` : `FAIL  ${r.fails.length} problem(s):`);
  for (const f of r.fails) L.push(`  ✗ ${f}`);
  return L;
}

async function main() {
  const a = cli("pair", USAGE, { json: "bool", out: "value", threshold: "value", max: "value", routes: "value", viewport: "value", labels: "value" }, null, { pos: [2, 2] });
  const [A, B] = a._; for (const d of [A, B]) { try { siteRoot(d); } catch (e) { console.error(`pair: ${e.message}\n${USAGE}`); process.exit(2); } }
  const threshold = a.threshold !== undefined ? +a.threshold : THRESHOLD; if (!(threshold > 0 && threshold <= 1)) { console.error(`pair: --threshold must be in (0, 1]\n${USAGE}`); process.exit(2); }
  const vps = parseViewports(a.viewport); if (!vps) { console.error(`pair: --viewport takes WxH[,WxH…]\n${USAGE}`); process.exit(2); }
  const routes = a.routes ? String(a.routes).split(",").map((x) => x.trim()).filter(Boolean) : null;
  const labels = a.labels ? String(a.labels).split(",") : [basename(resolve(A)), basename(resolve(B))];
  const pw = await loadPlaywright(); if (!pw) { console.log("not verified — no browser (install Playwright: npm i -D playwright && npx playwright install chromium)"); process.exit(3); }
  const browser = await pw.chromium.launch(); let r;
  try { r = await pair(A, B, { threshold, max: a.max ? +a.max : 10, routes, viewports: vps, browser }); }
  catch (e) { console.log(`not verified — ${String(e.message || e).split("\n")[0]}`); process.exit(3); }
  finally { await browser.close().catch(() => {}); }
  if (a.out) writeFileSync(String(a.out), JSON.stringify(r, null, 2));
  if (a.json) console.log(JSON.stringify(r, null, 2)); else for (const l of pairLines(r, labels)) console.log(l);
  process.exit(r.pass ? 0 : 1);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.log(`not verified — ${String(e.message || e).split("\n")[0]}`); process.exit(3); });
