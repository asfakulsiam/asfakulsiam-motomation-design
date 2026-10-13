#!/usr/bin/env node
// Per-component checks (v2.4.0, C1). Every component in data/components.csv gets its own demo page (its gallery demo,
// alone) and these checks, each of which fails the run:
//   1. screenshot comparison at 1440 and 375: the demo's stage, under reduced motion (a deterministic frame), reduced to a
//      48×32 luminance fingerprint and compared with tests/components/baselines.json: size within 12px, mean cell
//      difference within --tolerance (default 6/255), and no more than 1% of cells (min 4) off by more than 48/255.
//      A blank, collapsed, recoloured, relaid-out or hidden-text demo fails; font anti-aliasing between machines does not.
//   2. quality check: scripts/gate.mjs on the demo page (contrast, overflow, words, reduced motion, names, numbers).
//   3. size budget: the component source, gzipped, at or under --budget-kb (default 4 KB).
//   4. reduced-motion path: with prefers-reduced-motion, the stage is still after it settles (two fingerprints 800 ms
//      apart differ by ≤ 2/255 on average) unless the component's reduced-motion note says motion continues.
//   5. mount and unmount: no console errors or page errors on mount, interaction or unmount, and no animation frames
//      still pending 400 ms after unmount.
// The gallery harness (gallery-harness.mjs) stays: it checks layout shift and every demo together on one page.
//
//   NODE_PATH=<dir with esbuild react react-dom playwright>/node_modules node tests/components/per-component.mjs
//     [--only id,id] [--family micro] [--out dir] [--json report.json] [--update] [--no-gate] [--budget-kb 4]
//   --update rewrites the baselines for the components it ran (do it on purpose, in the commit that changes the look).
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const BASE = join(HERE, "baselines.json");
const resolve = (m) => { for (const b of [process.cwd(), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)]) { try { return createRequire(join(b, "noop.js"))(m); } catch {} } throw new Error(`${m} not found (set NODE_PATH)`); };
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes(k);
const OUT = arg("--out", "/tmp/per-component"); mkdirSync(join(OUT, "pages"), { recursive: true });
const BUDGET = Number(arg("--budget-kb", "4")) * 1024;
const TOL = Number(arg("--tolerance", "6"));
const GRID = [48, 32];

// catalogue
const parse = (line) => { const r = []; let cur = "", q = false; for (let i = 0; i < line.length; i++) { const ch = line[i]; if (ch === '"') { if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q; } else if (ch === "," && !q) { r.push(cur); cur = ""; } else cur += ch; } r.push(cur); return r; };
const lines = readFileSync(join(SKILL, "data/components.csv"), "utf8").trim().split("\n"); const head = parse(lines[0]);
let list = lines.slice(1).map((l) => Object.fromEntries(parse(l).map((v, i) => [head[i], v])));
if (arg("--only")) list = list.filter((c) => arg("--only").split(",").includes(c.id));
if (arg("--family")) list = list.filter((c) => arg("--family").split(",").includes(c.family));
if (!list.length) { console.error("no components selected"); process.exit(1); }
// "reduced-motion" notes that keep some motion on purpose (progress, a slowed loop): the stillness check is reported, not enforced
const keepsMotion = (c) => /\b(still (shows|moves|runs|turns|spins|cycles|types|plays)|slow(er|ed)?\b|keeps (moving|turning|spinning)|continues)/i.test(c.reduced_motion);

// one bundle, a page per component
const esbuild = resolve("esbuild"); const { chromium } = resolve("playwright");
const nodePaths = [join(process.cwd(), "node_modules"), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)];
const b = await esbuild.build({ entryPoints: [join(HERE, "fixtures/per-component.fixture.tsx")], bundle: true, write: false, format: "iife", jsx: "automatic", target: "es2020", minify: true, nodePaths, define: { "process.env.NODE_ENV": '"production"' }, logLevel: "silent" });
writeFileSync(join(OUT, "pages/bundle.js"), b.outputFiles[0].text);
const css = readFileSync(join(SKILL, "examples/gallery/gallery.css"), "utf8");
writeFileSync(join(OUT, "pages/page.css"), css + "\nmain{max-width:1240px;margin:0 auto;padding:24px}#stage{margin:24px 0}\n");
// rAF bookkeeping so the harness can see frames left pending after unmount
const RAF = `(()=>{const p=new Set(),r=window.requestAnimationFrame.bind(window),c=window.cancelAnimationFrame.bind(window);window.requestAnimationFrame=(f)=>{const id=r((t)=>{p.delete(id);f(t)});p.add(id);return id};window.cancelAnimationFrame=(id)=>{p.delete(id);c(id)};window.__pendingRaf=()=>p.size})();`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
for (const c of list) writeFileSync(join(OUT, "pages", `${c.id}.html`), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.name)} · Motomation component test</title><link rel="icon" href="data:,"><link rel="stylesheet" href="page.css">
<script>${RAF}window.__MM_ID=${JSON.stringify(c.id)};</script></head>
<body><main><h1>${esc(c.name)}</h1><p class="what">${esc(c.what)}</p><div id="stage" class="stage"></div></main>
<script src="bundle.js"></script></body></html>
`);

const baselines = existsSync(BASE) ? JSON.parse(readFileSync(BASE, "utf8")) : {};
const browser = await chromium.launch();
// fingerprint: the stage screenshot drawn into a GRID canvas inside the page, luminance per cell
async function fingerprint(page) {
  const el = page.locator("#stage"); const box = await el.boundingBox(); if (!box || box.width < 2 || box.height < 2) return { w: Math.round(box?.width || 0), h: Math.round(box?.height || 0), cells: [] };
  const png = (await el.screenshot({ animations: "allow" })).toString("base64");
  const cells = await page.evaluate(async ([src, gw, gh]) => { const img = new Image(); img.src = src; await img.decode(); const cv = document.createElement("canvas"); cv.width = gw; cv.height = gh;
    const x = cv.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(img, 0, 0, gw, gh); const d = x.getImageData(0, 0, gw, gh).data; const o = [];
    for (let i = 0; i < d.length; i += 4) o.push(Math.round(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2])); return o; }, [`data:image/png;base64,${png}`, ...GRID]);
  return { w: Math.round(box.width), h: Math.round(box.height), cells, png };
}
const changedCells = (a, b) => (a.length === b.length ? a.filter((v, i) => Math.abs(v - b[i]) > 48).length : a.length);
const meanDiff = (a, b) => (a.length && a.length === b.length ? a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length : 255);

const report = []; let failed = 0;
const PAGE = (id) => `file://${join(OUT, "pages", `${id}.html`)}`;
for (const c of list) {
  const r = { id: c.id, family: c.family, fails: [], notes: [] };
  // 3. size budget
  const src = readFileSync(join(SKILL, c.file)); r.gzipBytes = gzipSync(src, { level: 9 }).length;
  if (r.gzipBytes > BUDGET) r.fails.push(`size: ${(r.gzipBytes / 1024).toFixed(2)} KB gzipped > ${BUDGET / 1024} KB`);
  r.views = {};
  for (const w of [1440, 375]) {
    // 1 + 4: reduced-motion context: the comparison frame, then stillness
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 812 : 900 }, deviceScaleFactor: 1, reducedMotion: "reduce", hasTouch: w < 500 });
    const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await p.goto(PAGE(c.id), { waitUntil: "load" }); await p.evaluate(() => document.fonts?.ready); await p.waitForTimeout(1200);
    const f1 = await fingerprint(p); await p.waitForTimeout(800); const f2 = await fingerprint(p);
    const still = meanDiff(f1.cells, f2.cells);
    if (f1.png) writeFileSync(join(OUT, `${c.id}-${w}-reduced.png`), Buffer.from(f1.png, "base64"));
    const key = `${c.id}@${w}`; const base = baselines[key];
    const v = { w: f1.w, h: f1.h, stillDiff: +still.toFixed(2) };
    if (has("--update")) baselines[key] = { w: f1.w, h: f1.h, cells: Buffer.from(f1.cells).toString("base64") };
    else if (!base) r.fails.push(`screenshot ${w}: no baseline (run with --update)`);
    else { const bc = [...Buffer.from(base.cells, "base64")]; v.diff = +meanDiff(f1.cells, bc).toFixed(2); v.changed = changedCells(f1.cells, bc); const maxChanged = Math.max(4, Math.round(0.01 * bc.length));
      if (Math.abs(base.w - f1.w) > 12 || Math.abs(base.h - f1.h) > 12) r.fails.push(`screenshot ${w}: stage ${f1.w}×${f1.h}, baseline ${base.w}×${base.h}`);
      else if (v.diff > TOL || v.changed > maxChanged) r.fails.push(`screenshot ${w}: differs from baseline (mean ${v.diff}/255, tolerance ${TOL}; ${v.changed} cells off by >48, allowed ${maxChanged})`); }
    if (!f1.cells.length) r.fails.push(`screenshot ${w}: the demo rendered nothing (${f1.w}×${f1.h})`);
    if (still > 2) (keepsMotion(c) ? r.notes : r.fails).push(`reduced motion ${w}: stage still changing (${still.toFixed(1)}/255 between frames)${keepsMotion(c) ? " — allowed, its note says motion continues" : ""}`);
    // 5: interaction + unmount in the same context, then a full-motion mount/unmount
    const bb = await p.locator("#stage").boundingBox();
    if (bb && bb.height > 2) { if (w >= 500) { for (let k = 1; k <= 6; k++) { await p.mouse.move(bb.x + bb.width * (0.12 * k), bb.y + bb.height * 0.5); await p.waitForTimeout(30); } } else await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + Math.min(bb.height / 2, 300)); await p.waitForTimeout(200); }
    await p.evaluate(() => window.__unmount()); await p.waitForTimeout(400); const pendR = await p.evaluate(() => window.__pendingRaf());
    await ctx.close();
    const ctx2 = await browser.newContext({ viewport: { width: w, height: w < 500 ? 812 : 900 }, deviceScaleFactor: 1, reducedMotion: "no-preference", hasTouch: w < 500 });
    const p2 = await ctx2.newPage(); p2.on("pageerror", (e) => errs.push(String(e))); p2.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await p2.goto(PAGE(c.id), { waitUntil: "load" }); await p2.waitForTimeout(1500);
    const bb2 = await p2.locator("#stage").boundingBox();
    if (bb2 && bb2.height > 2 && w >= 500) { for (let k = 1; k <= 6; k++) { await p2.mouse.move(bb2.x + bb2.width * (0.12 * k), bb2.y + bb2.height * 0.5); await p2.waitForTimeout(30); } }
    await p2.evaluate(() => window.__unmount()); await p2.waitForTimeout(400); const pendM = await p2.evaluate(() => window.__pendingRaf());
    await ctx2.close();
    v.pendingRafAfterUnmount = { reduced: pendR, motion: pendM };
    if (pendR || pendM) r.fails.push(`unmount ${w}: ${Math.max(pendR, pendM)} animation frame(s) still pending 400 ms after unmount`);
    const real = errs.filter((e) => !/fonts\.(googleapis|gstatic)|net::ERR_/.test(e));
    if (real.length) r.fails.push(`console ${w}: ${real.slice(0, 3).join(" | ")}`);
    r.views[w] = v;
  }
  report.push(r);
}
await browser.close();

// 2. quality check: the measured gate on every demo page
if (!has("--no-gate")) {
  // in chunks of 6 pages (one gate process each) so a slow page shows progress and a crash costs one chunk
  const results = []; let last = "";
  for (let i = 0; i < list.length; i += 6) {
    const chunk = list.slice(i, i + 6);
    const g = spawnSync(process.execPath, [join(SKILL, "scripts/gate.mjs"), ...chunk.map((c) => join(OUT, "pages", `${c.id}.html`)), "--json", "--timeout", "300"], { encoding: "utf8", maxBuffer: 256 << 20, cwd: process.cwd(), env: process.env });
    let parsed = null; try { parsed = JSON.parse(g.stdout); } catch {}
    results.push(...(parsed ? (Array.isArray(parsed) ? parsed : parsed.results || [parsed]) : []));
    if (!parsed) last = `exit ${g.status} ${(g.stderr || g.stdout || "").slice(0, 160)}`;
    console.error(`gate ${Math.min(i + 6, list.length)}/${list.length}`);
  }
  for (const r of report) {
    const hit = results.find((x) => String(x.target || x.file || x.url || "").includes(`/${r.id}.html`));
    if (!hit) { r.fails.push(`gate: no result (${last})`); continue; }
    // a component demo page is not a delivered page: it is judged on the core counts (c o w rm a n q k), not on the
    // gate/4 rule sets (copy, SEO, performance, security), which belong to whole pages
    const core = hit.counts && Object.fromEntries(Object.entries(hit.counts).filter(([k]) => !["copy", "seo", "perf", "sec"].includes(k)));
    r.gate = { pass: core ? Object.values(core).every((n) => !n) : (hit.pass ?? hit.ok), counts: hit.counts };
    if (!r.gate.pass) r.fails.push(`gate: ${JSON.stringify(hit.counts)}`);
  }
}

if (has("--update")) { const sorted = Object.fromEntries(Object.entries(baselines).sort(([a], [b]) => a.localeCompare(b))); writeFileSync(BASE, JSON.stringify(sorted, null, 0).replace(/},"/g, '},\n"') + "\n"); }
for (const r of report) {
  const ok = !r.fails.length; if (!ok) failed++;
  const v = (w) => r.views[w] ? `${w}: Δ${r.views[w].diff ?? "-"}/${r.views[w].changed ?? "-"} still${r.views[w].stillDiff}` : "";
  console.log(`${ok ? "ok  " : "FAIL"} ${r.id.padEnd(22)} ${(r.gzipBytes / 1024).toFixed(2)} KB gz · ${v(1440)} · ${v(375)} · gate ${r.gate ? (r.gate.pass ? "pass" : "FAIL") : "skipped"}${r.fails.length ? "\n       " + r.fails.join("\n       ") : ""}${r.notes.length ? "\n       note: " + r.notes.join("; ") : ""}`);
}
if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify(report, null, 1));
console.log(`\n${report.length} components: ${failed ? `${failed} failed` : "all passed"}${has("--update") ? " (baselines updated)" : ""}`);
process.exit(failed && !has("--update") ? 1 : 0);
