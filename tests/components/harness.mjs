#!/usr/bin/env node
// Component harness: for every component in the gallery (or --only a,b,c), take a screenshot of its card at 1440 and 375,
// with and without reduced motion, and record console errors, layout shift inside the card, and the source size.
// Usage: node tests/components/harness.mjs [--only id,id] [--out dir] [--json report.json] [--query "?ambient=force"]
// Needs playwright (NODE_PATH). Fails (exit 1) on any console error, CLS > 0.02, or a source file over the size budget.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const out = arg("--out", "/tmp/component-harness"); mkdirSync(out, { recursive: true });
const only = arg("--only", "") ? arg("--only").split(",") : null;
const BUDGET = Number(arg("--budget-kb", "12")) * 1024; // per-component source budget

const csv = readFileSync(join(SKILL, "data/components.csv"), "utf8").trim().split("\n");
const head = csv[0].split(",");
const parse = (line) => { const r = []; let cur = "", q = false; for (const ch of line) { if (ch === '"') q = !q; else if (ch === "," && !q) { r.push(cur); cur = ""; } else cur += ch; } r.push(cur); return r; };
const rows = csv.slice(1).map((l) => Object.fromEntries(parse(l).map((v, i) => [head[i], v])));
const list = rows.filter((r) => !only || only.includes(r.id));

const dir = join(SKILL, "examples/gallery");
const srv = createServer((q, s) => { const f = join(dir, decodeURIComponent(q.url.split("?")[0]) === "/" ? "index.html" : decodeURIComponent(q.url.split("?")[0])); if (!existsSync(f)) { s.writeHead(404); return s.end(); } s.writeHead(200, { "content-type": extname(f) === ".html" ? "text/html; charset=utf-8" : "application/octet-stream" }); s.end(readFileSync(f)); }).listen(0);
const url = `http://127.0.0.1:${srv.address().port}/index.html${arg("--query", "")}`;
const b = await chromium.launch();
const report = []; let failed = 0;
for (const [w, h] of [[1440, 900], [375, 812]]) for (const rm of [false, true]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: rm ? "reduce" : "no-preference", hasTouch: w < 500 });
  const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e))); pg.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await pg.goto(url, { waitUntil: "networkidle" });
  // hide the gallery's own fixed/sticky chrome (header, rail, index) so it never covers a card in the screenshots
  await pg.evaluate(() => { for (const el of document.querySelectorAll("body *")) { if (el.closest("article.card")) continue; const p = getComputedStyle(el).position; if (p === "fixed" || p === "sticky") el.style.visibility = "hidden"; } });
  for (const c of list) {
    const before = errs.length;
    const card = pg.locator(`article#${CSS_escape(c.id)}`);
    if (!(await card.count())) { report.push({ id: c.id, w, rm, error: "no card in gallery" }); failed++; continue; }
    await card.scrollIntoViewIfNeeded();
    // layout shift inside this card while its demo starts
    const cls = await pg.evaluate(async (id) => {
      const el = document.getElementById(id); let v = 0;
      const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput && e.sources?.some((s) => s.node && el.contains(s.node))) v += e.value; });
      po.observe({ type: "layout-shift", buffered: false }); await new Promise((r) => setTimeout(r, 1800)); po.disconnect(); return v;
    }, c.id);
    // interact: sweep the pointer across the demo stage (desktop) or tap its centre (mobile), so hover and press paths run too
    const stage = card.locator(".stage"); const bb = await stage.boundingBox();
    if (bb) {
      if (w >= 500) { await pg.mouse.move(bb.x + 4, bb.y + bb.height * 0.5); for (let k = 1; k <= 8; k++) { await pg.mouse.move(bb.x + bb.width * (0.08 * k), bb.y + bb.height * (0.3 + 0.03 * k)); await pg.waitForTimeout(40); } }
      else await pg.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2);
      await pg.waitForTimeout(250);
    }
    // which path rendered: a live canvas, running Web Animations, or the static poster
    const mode = await card.evaluate((el) => (el.querySelector(".stage canvas") ? "canvas" : el.querySelector(".stage")?.getAnimations({ subtree: true }).some((a) => a.playState === "running") ? "animating" : "static"));
    const shot = join(out, `${c.id}-${w}${rm ? "-reduced" : ""}${arg("--query", "") ? "-q" : ""}.png`);
    await card.screenshot({ path: shot });
    const size = statSync(join(SKILL, c.file)).size;
    const e = errs.slice(before);
    const ok = !e.length && cls <= 0.02 && size <= BUDGET;
    if (!ok) failed++;
    report.push({ id: c.id, w, reduced: rm, mode, cls: +cls.toFixed(4), bytes: size, errors: e, ok, shot });
    console.log(`${ok ? "ok  " : "FAIL"} ${c.id.padEnd(22)} ${w}${rm ? " reduced" : "        "} ${mode.padEnd(9)} cls ${cls.toFixed(3)} · ${(size / 1024).toFixed(1)} KB · ${e.length ? "errors: " + e.join(" | ") : "no console errors"}`);
  }
  await ctx.close();
}
function CSS_escape(s) { return s.replace(/[^a-zA-Z0-9_-]/g, (ch) => "\\" + ch); }
await b.close(); srv.close();
const j = arg("--json"); if (j) writeFileSync(j, JSON.stringify(report, null, 2));
console.log(`\n${list.length} components × 4 views: ${failed ? failed + " failed" : "all passed"}`);
process.exit(failed ? 1 : 0);
