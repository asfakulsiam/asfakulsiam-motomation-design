#!/usr/bin/env node
// Section harness: build the sections preview first (node scripts/build-sections.mjs --preview <dir>), then
//   node tests/sections/harness.mjs <dir> [--out shots/] [--only id,id]
// For every section at 1440 and 375, with and without reduced motion: scroll through it, record console errors,
// layout shift, and horizontal overflow (anything wider than the viewport at 375), and take a screenshot.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const dir = process.argv[2]; const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const out = arg("--out", "/tmp/section-shots"); mkdirSync(out, { recursive: true }); const only = arg("--only", "") ? arg("--only").split(",") : null;
const types = { ".html": "text/html; charset=utf-8", ".woff2": "font/woff2" };
const srv = createServer((q, s) => { const f = join(dir, decodeURIComponent(q.url.split("?")[0]) === "/" ? "index.html" : decodeURIComponent(q.url.split("?")[0])); if (!existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, { "content-type": types[extname(f)] || "application/octet-stream" }); s.end(readFileSync(f)); }).listen(0);
const b = await chromium.launch(); const report = []; let failed = 0;
for (const [w, h] of [[1440, 900], [375, 812]]) for (const rm of [false, true]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: rm ? "reduce" : "no-preference", hasTouch: w < 500 });
  const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e))); pg.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html${arg("--query", "")}`, { waitUntil: "networkidle" });
  const ids = await pg.$$eval("[data-section]", (els) => els.map((e) => e.getAttribute("data-section")));
  for (const id of ids.filter((i) => !only || only.includes(i))) {
    const before = errs.length;
    const r = await pg.evaluate(async (id) => {
      const el = document.querySelector(`[data-section="${id}"]`); let cls = 0;
      const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput && e.sources?.some((s) => s.node && el.contains(s.node))) cls += e.value; });
      po.observe({ type: "layout-shift" });
      const top = el.getBoundingClientRect().top + scrollY, end = top + el.offsetHeight;
      for (let y = top - innerHeight; y <= end; y += Math.max(200, innerHeight / 3)) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
      scrollTo(0, top); await new Promise((r) => setTimeout(r, 1400)); po.disconnect();
      // horizontal overflow: any element inside the section wider than the viewport (ignoring clipped scrollers)
      const wide = [...el.querySelectorAll("*")].filter((n) => { const b = n.getBoundingClientRect(); if (b.right <= innerWidth + 1 && b.left >= -1) return false; let p = n.parentElement; while (p && p !== el.parentElement) { const o = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(o.overflowX)) return false; p = p.parentElement; } return true; }).length;
      return { cls, wide, height: el.offsetHeight, docWide: document.documentElement.scrollWidth > innerWidth + 1 };
    }, id);
    const shot = join(out, `${id}-${w}${rm ? "-reduced" : ""}.png`);
    await pg.locator(`[data-section="${id}"]`).screenshot({ path: shot, timeout: 20000 }).catch(() => {});
    const e = errs.slice(before), ok = !e.length && r.cls <= 0.05 && !r.wide;
    if (!ok) failed++;
    report.push({ id, w, reduced: rm, ...r, errors: e, ok, shot });
    console.log(`${ok ? "ok  " : "FAIL"} ${id.padEnd(30)} ${w}${rm ? " reduced" : "        "} cls ${r.cls.toFixed(3)} · overflow ${r.wide} · ${r.height}px · ${e.length ? "errors: " + e.join(" | ").slice(0, 200) : "no console errors"}`);
  }
  await ctx.close();
}
await b.close(); srv.close();
const j = arg("--json"); if (j) writeFileSync(j, JSON.stringify(report, null, 2));
console.log(`\n${new Set(report.map((r) => r.id)).size} sections × 4 views: ${failed ? failed + " failed" : "all passed"}`);
process.exit(failed ? 1 : 0);
