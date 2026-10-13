// Why was it skipped? (diagnostic, not part of the gate; closeout of the Components CI failure, see docs/ci-status.md)
//   node tests/components/why-skipped.mjs <page.html> [more pages]      (VW=1440 for another width; default 375)
// The gate reports how many text elements it skipped per width, not why. For every text element the gate's contrast scan counts,
// record whether it was ever measurable and, if not, why. It uses the gate's own in-page helpers (PAGE_LIB,
// extracted from gate.mjs at run time) and the same conditions the gate's read() applies:
//   off-screen  → the element's box is never fully inside the viewport (c.x >= 0, c.x+w <= innerWidth, …)
//   occluded    → a painting layer that is not the element, a descendant or an ancestor sits on a sample point
//   moving      → position or opacity changes between two reads 250 ms apart (after infinite loops are held)
//   hidden      → opacity <= 0.05 wherever it is on screen
// It prints one JSON line per page: skipped/total, the count per reason, and every skipped element with its reason.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve as abs } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = join(HERE, "../..");
const resolve = (m) => { for (const b of [process.cwd(), ROOT, ...(process.env.NODE_PATH || "").split(":").filter(Boolean)]) { try { return createRequire(join(b, "noop.js"))(m); } catch {} } throw new Error(`${m} not found (set NODE_PATH)`); };
const { chromium } = resolve("playwright");
const GATE = readFileSync(join(ROOT, "skills/asfakulsiam-motomation-design/scripts/gate.mjs"), "utf8");
const LIB = eval(GATE.match(/const PAGE_LIB = (`[\s\S]*?`);/)[1]);
const files = process.argv.slice(2).map((f) => abs(f)); const VW = +(process.env.VW || 375), VH = VW < 800 ? 812 : 900, mobile = VW < 800;
if (!files.length) { console.error("usage: node tests/components/why-skipped.mjs <page.html> [more pages]"); process.exit(2); }
const browser = await chromium.launch();
for (const f of files) {
  const ctx = await browser.newContext({ bypassCSP: true, deviceScaleFactor: 1, viewport: { width: VW, height: VH }, hasTouch: mobile, isMobile: mobile });
  const page = await ctx.newPage();
  await page.goto("file://" + f, { waitUntil: "networkidle" }).catch(() => {});
  await page.addScriptTag({ content: LIB });
  // the gate's settle(): wait, scroll through in 500px steps, back to the top
  await page.waitForTimeout(800); { const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(h, 40000); y += 500) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(40); }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(700); }
  await page.evaluate(() => __g.textEls().forEach((e, i) => e.setAttribute("data-g-id", i)));
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const read = () => page.evaluate(() => { const pe = document.createElement("style"); pe.textContent = "*{pointer-events:auto!important}"; document.head.append(pe); try { return [...document.querySelectorAll("[data-g-id]")].filter((e) => !__g.decorative(e) && !__g.srOnly(e)).map((e) => {
    const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
    const paints = (n) => { if (__g.opacity(n) < 0.5) return false; const cs = getComputedStyle(n); if (cs.visibility === "hidden") return false;
      return ["IMG", "VIDEO", "CANVAS", "svg", "IFRAME"].includes(n.tagName) || (__g.rgba(cs.backgroundColor)?.a ?? 0) >= 0.5 || cs.backgroundImage !== "none"; };
    let occ = null;
    for (let a = 0; a < 6 && !occ; a++) for (let b = 0; b < 3 && !occ; b++) {
      const stack = document.elementsFromPoint(Math.min(innerWidth - 1, r.left + r.width * (a + 0.5) / 6), Math.min(innerHeight - 1, r.top + r.height * (b + 0.5) / 3));
      const top = stack.find((n) => n === e || e.contains(n) || n.contains(e) || paints(n));
      if (top && !(top === e || e.contains(top) || top.contains(e))) occ = __g.label(top);
    }
    const on = s.color && r.width > 0 && r.height > 0 && r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
    return { i: +e.dataset.gId, label: __g.label(e), text: e.textContent.trim().replace(/\s+/g, " ").slice(0, 40), x: r.left, y: r.top, w: r.width, h: r.height, op: __g.opacity(e), on, occ, fg: !!__g.rgba(s.color), color: s.color, size: parseFloat(s.fontSize) };
  }); } finally { pe.remove(); } });
  const seen = new Map(); // i → { label, text, measured, reasons:Set, occBy:Set, box }
  for (let y = 0; y <= Math.max(0, H - VH) + 1; y += Math.round(VH * 0.15)) {
    await page.evaluate((v) => scrollTo(0, v), y);
    // the gate's waits: finite animations finish (≤4 s), 350 ms, infinite loops held at frame 0, then re-read ≤12× until stable
    await page.waitForFunction(() => !document.getAnimations().some((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity), null, { timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(350);
    await page.evaluate(() => document.getAnimations().forEach((a) => { if (a.effect?.getComputedTiming().iterations === Infinity) { a.pause(); a.currentTime = 0; } }));
    // re-read ≤12× every 250 ms until every position and opacity holds; judge the final read against the one before it
    let prevR = await read(), lastR = prevR;
    for (let k = 0; k < 12; k++) { await page.waitForTimeout(250); lastR = await read(); const pm = new Map(prevR.map((c) => [c.i, c]));
      const allStable = lastR.every((c) => { const p = pm.get(c.i); return p && Math.abs(p.op - c.op) < 0.01 && Math.abs(p.y - c.y) < 1 && Math.abs(p.x - c.x) < 1; });
      if (allStable) break; if (k < 11) prevR = lastR; }
    const a = lastR, b = new Map(prevR.map((c) => [c.i, c]));
    for (const c of a) {
      const n = b.get(c.i); const st = seen.get(c.i) || { label: c.label, text: c.text, size: c.size, measured: false, reasons: new Set(), occBy: new Set(), box: null }; seen.set(c.i, st);
      const stable = n && Math.abs(n.op - c.op) < 0.01 && Math.abs(n.y - c.y) < 1 && Math.abs(n.x - c.x) < 1;
      if (!c.fg) { st.reasons.add("colour not rgba: " + c.color); continue; }
      if (!c.on) { st.reasons.add("off-screen"); st.box = `${Math.round(c.x)},${Math.round(c.y)} ${Math.round(c.w)}×${Math.round(c.h)}`; continue; }
      if (!stable) { st.reasons.add("moving"); continue; }
      if (c.occ) { st.reasons.add("occluded"); st.occBy.add(c.occ); continue; }
      if (c.op <= 0.05) { st.reasons.add("hidden"); continue; }
      st.measured = true;
    }
  }
  const all = [...seen.values()]; const sk = all.filter((s) => !s.measured);
  // the worst reason: the one that, in this order, kept the element from measurement at its best position
  const rank = ["occluded", "moving", "hidden", "off-screen"];
  const why = (s) => rank.find((r) => s.reasons.has(r)) || [...s.reasons][0] || "never seen";
  const count = {}; for (const s of sk) count[why(s)] = (count[why(s)] || 0) + 1;
  console.log(JSON.stringify({ file: f.split("/").pop(), VW, skipped: sk.length, total: all.length, pct: all.length ? Math.round(sk.length / all.length * 100) : 0, byReason: count,
    skippedEls: sk.map((s) => ({ el: s.label, text: s.text, size: s.size, why: why(s), occBy: [...s.occBy].slice(0, 3), box: s.box })) }));
  await ctx.close();
}
await browser.close();
