#!/usr/bin/env node
// Template performance: node tests/templates/perf.mjs [ids…] [--json out.json] [--shots dir]
// Serves examples/templates/ and, per page, in two profiles:
//   desktop  1440×900, no throttling
//   mobile   375×812, touch, DPR 2, CPU throttled 4× (Lighthouse's mid-range-phone setting)
// records console errors (incl. hydration), FCP, LCP, CLS, long tasks, then scrolls the whole page at a constant
// 900 px/s with rAF-driven scrollBy while sampling frame intervals: average fps, p95 frame time, % of frames over
// 25 ms ("dropped"). A page counts as 60fps when average ≥ 58, p95 ≤ 20 ms and dropped ≤ 2%.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DIR = join(ROOT, "skills/asfakulsiam-motomation-design/examples/templates");
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const ids = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && !all[i - 1]?.startsWith("--"));
const pages = ids.length ? ids : ["studio-portfolio", "saas-landing", "shop-product", "editorial-article", "hotel", "org", "event", "personal"];
const shots = arg("--shots"); if (shots) mkdirSync(shots, { recursive: true });
const MIME = { ".html": "text/html; charset=utf-8", ".woff2": "font/woff2" };
const srv = createServer((q, s) => { const f = join(DIR, decodeURIComponent(q.url.split("?")[0])); if (!f.startsWith(DIR) || !existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); s.end(readFileSync(f)); }).listen(0);
const base = `http://127.0.0.1:${srv.address().port}`;
const b = await chromium.launch(); const rows = []; let bad = 0;
for (const id of pages) for (const prof of ["desktop", "mobile"]) {
  const m = prof === "mobile";
  const ctx = await b.newContext({ viewport: m ? { width: 375, height: 812 } : { width: 1440, height: 900 }, deviceScaleFactor: m ? 2 : 1, hasTouch: m, isMobile: m });
  const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e).slice(0, 200))); pg.on("console", (x) => x.type() === "error" && errs.push(x.text().slice(0, 200)));
  const cdp = await ctx.newCDPSession(pg); if (m) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await pg.addInitScript(() => {
    window.__p = { lcp: 0, cls: 0, long: 0, longMs: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__p.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__p.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__p.long++; window.__p.longMs += e.duration - 50; } }).observe({ type: "longtask", buffered: true });
  });
  await pg.goto(`${base}/${id}.html`, { waitUntil: "load" }); await pg.waitForTimeout(1500);
  const load = await pg.evaluate(() => ({ fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0, lcp: __p.lcp, clsLoad: __p.cls, longTasks: __p.long, tbt: __p.longMs, height: document.documentElement.scrollHeight }));
  const fr = await pg.evaluate(async () => {
    const H = document.documentElement.scrollHeight - innerHeight; const v = 900; const ts = []; let last = performance.now(), y = 0;
    const secs = [...document.querySelectorAll("section[id]")].map((e) => ({ id: e.id, top: e.getBoundingClientRect().top + scrollY, bottom: e.getBoundingClientRect().bottom + scrollY })); const slow = {};
    await new Promise((done) => { const step = (t) => { const dt = t - last; last = t; ts.push(dt); if (dt > 25) { const mid = y + innerHeight / 2; const s = secs.find((s) => mid >= s.top && mid < s.bottom); if (s) slow[s.id] = (slow[s.id] || 0) + 1; } y = Math.min(H, y + v * dt / 1000); scrollTo(0, y); if (y < H) requestAnimationFrame(step); else done(); }; requestAnimationFrame((t) => { last = t; requestAnimationFrame(step); }); });
    const f = ts.slice(2).sort((a, b) => a - b); const avg = f.reduce((a, c) => a + c, 0) / f.length;
    return { frames: f.length, fps: 1000 / avg, p95: f[Math.floor(f.length * 0.95)], dropped: f.filter((x) => x > 25).length / f.length * 100, cls: __p.cls, slowBySection: slow };
  });
  if (shots) { await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(400); await pg.screenshot({ path: join(shots, `${id}-${m ? 375 : 1440}.png`), fullPage: true, timeout: 60000 }).catch((e) => errs.push("screenshot: " + String(e).slice(0, 80))); }
  const ok = !errs.length && fr.fps >= 58 && fr.p95 <= 20 && fr.dropped <= 2 && fr.cls <= 0.1;
  if (!ok) bad++;
  const r = { id, profile: prof, ...load, ...fr, errors: errs, sixty: fr.fps >= 58 && fr.p95 <= 20 && fr.dropped <= 2, ok };
  rows.push(r);
  console.log(`${ok ? "ok  " : "FAIL"} ${id.padEnd(18)} ${prof.padEnd(7)} fcp ${Math.round(r.fcp)}ms · lcp ${Math.round(r.lcp)}ms · tbt ${Math.round(r.tbt)}ms · cls ${r.cls.toFixed(3)} · scroll ${r.frames} frames ${r.fps.toFixed(1)} fps, p95 ${r.p95.toFixed(1)} ms, dropped ${r.dropped.toFixed(1)}%${Object.keys(r.slowBySection).length ? " (slow frames in " + Object.entries(r.slowBySection).map(([k, v]) => k + " " + v).join(", ") + ")" : ""} · ${errs.length ? "errors: " + errs.join(" | ") : "no console errors"}`);
  await ctx.close();
}
await b.close(); srv.close();
if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify(rows, null, 2));
console.log(`\n${pages.length} templates × 2 profiles: ${bad ? bad + " failed" : "all passed"}`);
process.exit(bad ? 1 : 0);
