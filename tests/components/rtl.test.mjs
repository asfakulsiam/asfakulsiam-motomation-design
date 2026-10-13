#!/usr/bin/env node
// RTL (P2 T7). Every text, type and layout component on a right-to-left page (<html dir="rtl" lang="he">):
//   1. mounts and unmounts with no page or console error, with motion and with reduced motion
//   2. text and type components start at the inline-start (right) edge of their container
//   3. split text keeps its own order: a Hebrew word's letters run right to left, a Latin word inside the RTL page
//      still reads left to right (letters split into inline-blocks or flex items are bidi-neutral objects, so without
//      dir="auto" on their wrapper the page direction reverses them: "SIGNAL" would show as "LANGIS")
//   4. behaviour that layout cannot mirror: the typewriter caret sits on the inline-end side of the last letter, the
//      pointer scrambles the letter under it, the ASCII drawing is not mirrored, the shine crosses in reading
//      direction, the carousel's next card is on the left with ← and a rightward swipe going forward, the menu
//      marquee never shows a gap, the index rail is on the right, the bento's first tile is on the right, and
//      LetterRelay's letters keep their order on the way to the header
// Each check runs on an LTR page too, as the control.
//
//   NODE_PATH=<dir with esbuild react react-dom playwright>/node_modules node tests/components/rtl.test.mjs [--out dir]
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const resolve = (m) => { for (const b of [process.cwd(), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)]) { try { return createRequire(join(b, "noop.js"))(m); } catch {} } console.error(`rtl.test: cannot find ${m}; install it and set NODE_PATH (see the header of this file)`); process.exit(2); };
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const OUT = arg("--out", "/tmp/rtl-test"); mkdirSync(OUT, { recursive: true });
const esbuild = resolve("esbuild"); const { chromium } = resolve("playwright");
const nodePaths = (process.env.NODE_PATH || "").split(":").filter(Boolean);
const b = await esbuild.build({ entryPoints: [join(HERE, "fixtures/rtl.fixture.tsx")], bundle: true, write: false, format: "iife", jsx: "automatic", target: "es2020", nodePaths, define: { "process.env.NODE_ENV": '"development"' }, logLevel: "error" });
writeFileSync(join(OUT, "bundle.js"), b.outputFiles[0].text);
writeFileSync(join(OUT, "index.html"), `<!doctype html><html><head><meta charset="utf-8"><title>rtl</title><style>body{margin:0;background:#fff;color:#111;font-family:sans-serif}#stage{padding:40px;width:1000px}</style></head><body><div id="stage"></div><div style="height:3000px"></div><script src="bundle.js"></script></body></html>`);
const PAGE = pathToFileURL(join(OUT, "index.html")).href;

const HE = "שלום עולם", LATIN = "SIGNAL NOISE";
const TEXT_TYPE = ["blur-focus", "curved-text", "decode", "ink-fill", "letter-relay", "neighbour-moves", "pressure-type", "scroll-float", "split-flap", "width-sprint", "ascii-text", "glitch", "rotating-words", "scramble-on-hover", "shiny-text", "typewriter"];
const SPLIT = ["blur-focus", "decode", "ink-fill", "neighbour-moves", "pressure-type", "scroll-float", "split-flap", "scramble-on-hover", "typewriter"];
const START_EDGE_SKIP = new Set(["letter-relay", "ascii-text"]); // full-width blocks: their box spans the container either way

const browser = await chromium.launch();
let failed = 0; const rows = [];
const check = (ok, name, detail = "") => { if (!ok) failed++; rows.push({ ok, name, detail }); console.log(`${ok ? "✓" : "✗"} ${name}${detail ? "  " + detail : ""}`); };
async function open(dir, { motion = false, w = 1200, h = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: motion ? "no-preference" : "reduce" });
  const page = await ctx.newPage(); const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 160)}`); });
  await page.goto(PAGE); await page.evaluate((d) => { document.documentElement.dir = d; document.documentElement.lang = d === "rtl" ? "he" : "en"; }, dir);
  return { ctx, page, errors };
}
const mount = (page, id, text) => page.evaluate(({ id, text }) => window.__mount(id, text), { id, text });
// visible text units of a split component, in DOM order, with their x position (leaf elements, screen-reader copies skipped)
const units = (page) => page.evaluate(() => {
  const sr = (el) => { for (let e = el; e && e.id !== "stage"; e = e.parentElement) { const s = getComputedStyle(e); if (s.clip === "rect(0px, 0px, 0px, 0px)" || (s.position === "absolute" && parseFloat(s.width) <= 1)) return true; } return false; };
  return [...document.querySelectorAll("#stage *")].filter((e) => !e.children.length && e.textContent.trim() && !sr(e) && !["STYLE", "SCRIPT"].includes(e.tagName))
    .map((e) => { const r = e.getBoundingClientRect(); return { t: e.textContent, x: r.left + r.width / 2 }; });
});
const ordered = (u, rtl) => u.every((v, i) => i === 0 || (rtl ? v.x < u[i - 1].x : v.x > u[i - 1].x));

// 1 + 2: every component mounts on an RTL page (both motion modes) with no error; text/type start at the right edge
const IDS = await (async () => { const o = await open("ltr"); const ids = await o.page.evaluate(() => window.__ids()); await o.ctx.close(); return ids; })();
for (const id of IDS) for (const motion of [false, true]) {
  const o = await open("rtl", { motion });
  await mount(o.page, id, id === "ascii-text" ? "AB12" : HE); await o.page.waitForTimeout(motion ? 900 : 300);
  let edge = "";
  if (!motion && TEXT_TYPE.includes(id) && !START_EDGE_SKIP.has(id)) {
    const g = await o.page.evaluate(() => { const s = document.getElementById("stage"), r = s.getBoundingClientRect(), pr = parseFloat(getComputedStyle(s).paddingRight); const el = s.firstElementChild.getBoundingClientRect(); return { right: Math.round(el.right), start: Math.round(r.right - pr), left: Math.round(el.left), startL: Math.round(r.left + parseFloat(getComputedStyle(s).paddingLeft)) }; });
    if (Math.abs(g.right - g.start) > 2) edge = ` · starts at x=${g.left}…${g.right}, inline-start edge is ${g.start}`;
  }
  await o.page.evaluate(() => window.__clear()); await o.page.waitForTimeout(100);
  check(!o.errors.length && !edge, `${id} on an RTL page (${motion ? "motion" : "reduced motion"}): mounts, unmounts${TEXT_TYPE.includes(id) && !motion && !START_EDGE_SKIP.has(id) ? ", starts at the right edge" : ""}`, o.errors.join(" | ") + edge);
  await o.ctx.close();
}

// 3: split text keeps its own order on an RTL page (and on the LTR control)
for (const id of SPLIT) for (const [dir, text, rtlText] of [["rtl", HE, true], ["rtl", LATIN, false], ["ltr", LATIN, false], ["ltr", HE, true]]) {
  const o = await open(dir); await mount(o.page, id, text); await o.page.waitForTimeout(id === "split-flap" ? 2600 : 400);
  const u = (await units(o.page)).filter((v) => v.t.trim());
  // one unit = the component renders the string as one text run, which the browser's bidi orders itself
  const ok = u.length === 1 ? u[0].t.replace(/\s+/g, " ").trim() === text : ordered(u, rtlText);
  check(ok, `${id}: ${rtlText ? "Hebrew" : "Latin"} on an ${dir.toUpperCase()} page reads ${rtlText ? "right to left" : "left to right"}${u.length === 1 ? " (one text run)" : ` (${u.length} units)`}`, ok ? "" : `units on screen, left to right: ${JSON.stringify([...u].sort((a, b) => a.x - b.x).map((v) => v.t).join("|"))}`);
  await o.ctx.close();
}

// 4a: the typewriter caret sits after the last typed letter in reading order
for (const dir of ["rtl", "ltr"]) {
  const o = await open(dir, { motion: true }); await mount(o.page, "typewriter", dir === "rtl" ? HE : "Hello world"); await o.page.waitForTimeout(420);
  const g = await o.page.evaluate(() => { const spans = [...document.querySelectorAll("#stage p > span[aria-hidden] > span")]; const typed = spans.filter((s) => getComputedStyle(s).opacity === "1"); const last = typed[typed.length - 1]; const bar = last?.querySelector("span"); if (!last || !bar) return null; const a = last.getBoundingClientRect(), c = bar.getBoundingClientRect(); return { l: a.left, r: a.right, cl: c.left, cr: c.right, n: typed.length }; });
  const ok = !!g && (dir === "rtl" ? g.cr <= g.l + 1.5 : g.cl >= g.r - 1.5);
  check(ok && !o.errors.length, `typewriter caret on an ${dir.toUpperCase()} page is on the ${dir === "rtl" ? "left" : "right"} of the last typed letter`, g ? `letter ${g.l.toFixed(0)}…${g.r.toFixed(0)}, caret ${g.cl.toFixed(0)}…${g.cr.toFixed(0)}` : "no caret found");
  await o.ctx.close();
}

// 4b: the pointer scrambles the letter under it (Hebrew: letter 0 is on the right)
for (const [dir, text] of [["rtl", "שלוםשלום"], ["ltr", "SIGNALSS"]]) {
  const o = await open(dir, { motion: true }); await mount(o.page, "scramble-on-hover", text); await o.page.waitForTimeout(200);
  const box = await o.page.locator("#stage > span").first().boundingBox();
  const cells = () => o.page.evaluate(() => [...document.querySelectorAll("#stage > span > span[aria-hidden] > span")].map((s) => s.textContent));
  const before = await cells();
  await o.page.mouse.move(box.x + box.width - 4, box.y + box.height / 2); await o.page.mouse.move(box.x + box.width - 3, box.y + box.height / 2);
  let changed = new Set(); for (let k = 0; k < 12; k++) { const now = await cells(); now.forEach((c, i) => { if (c !== before[i]) changed.add(i); }); await o.page.waitForTimeout(16); }
  const near = dir === "rtl" ? 0 : before.length - 1, far = dir === "rtl" ? before.length - 1 : 0;
  const ok = changed.has(near) && !changed.has(far);
  check(ok, `scramble-on-hover on an ${dir.toUpperCase()} page: the pointer at the right edge scrambles letter ${near} (the one under it), not letter ${far}`, `scrambled: [${[...changed].sort((a, b) => a - b).join(",")}]`);
  await o.ctx.close();
}

// 4c: the ASCII drawing is a picture: the same rows on an RTL page as on an LTR page, laid out left to right
{
  const rowsOf = async (dir) => { const o = await open(dir); await mount(o.page, "ascii-text", "AB12"); await o.page.waitForTimeout(400); const r = await o.page.evaluate(() => { const p = document.querySelector("#stage pre"); return { text: p.textContent, dir: getComputedStyle(p).direction }; }); const png = await o.page.locator("#stage pre").screenshot(); await o.ctx.close(); return { ...r, png }; };
  const [l, r] = [await rowsOf("ltr"), await rowsOf("rtl")];
  check(l.text === r.text && r.dir === "ltr" && Buffer.compare(l.png, r.png) === 0, "ascii-text on an RTL page draws the same picture as on an LTR page (not mirrored)", `pre direction ${r.dir}, rows ${l.text === r.text ? "equal" : "differ"}, pixels ${Buffer.compare(l.png, r.png) === 0 ? "identical" : "differ"}`);
}

// 4d: the shine crosses in reading direction (brightest column at 45% vs 55% of the pass)
for (const dir of ["rtl", "ltr"]) {
  const o = await open(dir, { motion: true }); await mount(o.page, "shiny-text", "שלום עולם שלום"); await o.page.waitForTimeout(200);
  await o.page.evaluate(() => { const el = document.querySelector("#stage > span"); el.style.color = "#000"; });
  await o.page.locator("#stage > span").first().hover(); await o.page.waitForTimeout(30);
  const at = async (f) => { await o.page.evaluate((f) => { for (const a of document.querySelector("#stage > span").getAnimations()) { a.pause(); a.currentTime = f * 1000; } }, f);
    return o.page.evaluate(async () => { const el = document.querySelector("#stage > span"); const r = el.getBoundingClientRect(); const bg = getComputedStyle(el).backgroundPosition; return { bg, w: r.width }; }); };
  const shot = async (f) => { await at(f); const png = (await o.page.locator("#stage > span").first().screenshot()).toString("base64");
    return o.page.evaluate(async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; const g = c.getContext("2d"); g.drawImage(i, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; let best = -1, bx = 0;
      for (let x = 0; x < c.width; x++) { let sum = 0; for (let y = 0; y < c.height; y++) { const k = (y * c.width + x) * 4; sum += Math.max(0, d[k] - d[k + 2]); } if (sum > best) { best = sum; bx = x; } } return bx / c.width; }, png); };
  // the shine (#fff6d8) is warm, the ink and its grey anti-aliasing are neutral: the column with the most red-over-blue is the band
  const a = await shot(0.45), z = await shot(0.55); // the eased band is over the text around mid-pass
  const ok = dir === "rtl" ? z < a : z > a;
  check(ok && !o.errors.length, `shiny-text on an ${dir.toUpperCase()} page: the shine moves ${dir === "rtl" ? "right to left" : "left to right"}`, `brightest column at 45% of the pass: ${(a * 100).toFixed(0)}% of the width, at 55%: ${(z * 100).toFixed(0)}%`);
  await o.ctx.close();
}

// 4e: carousel: next card on the left in RTL; ← and a rightward swipe go forward; the arrows mirror
for (const dir of ["rtl", "ltr"]) {
  const o = await open(dir, { motion: false }); await mount(o.page, "curve-carousel", "כרטיס"); await o.page.waitForTimeout(300);
  const cx = (i) => o.page.evaluate((i) => { const c = document.querySelector(`[data-card="${i}"]`).getBoundingClientRect(); return c.left + c.width / 2; }, i);
  const count = () => o.page.evaluate(() => document.querySelector("#stage [aria-live]").textContent);
  const nextGlyph = await o.page.evaluate(() => document.querySelector('#stage button[aria-label="Next"]').textContent);
  const [c0, c1] = [await cx(0), await cx(1)];
  await o.page.locator('#stage button[aria-label="Next"]').focus(); await o.page.keyboard.press(dir === "rtl" ? "ArrowLeft" : "ArrowRight"); await o.page.waitForTimeout(100); const k1 = await count();
  const area = await o.page.locator("#stage section > div").first().boundingBox(); const y = area.y + area.height / 2;
  const [x0, x1] = dir === "rtl" ? [area.x + 100, area.x + 300] : [area.x + 300, area.x + 100];
  await o.page.mouse.move(x0, y); await o.page.mouse.down(); await o.page.mouse.move(x1, y, { steps: 5 }); await o.page.mouse.up(); await o.page.waitForTimeout(100); const k2 = await count();
  const ok = (dir === "rtl" ? c1 < c0 && nextGlyph === "←" : c1 > c0 && nextGlyph === "→") && /^2 /.test(k1) && /^3 /.test(k2);
  check(ok && !o.errors.length, `curve-carousel on an ${dir.toUpperCase()} page: next card on the ${dir === "rtl" ? "left" : "right"}, ${dir === "rtl" ? "← and a swipe to the right" : "→ and a swipe to the left"} go forward, Next shows ${dir === "rtl" ? "←" : "→"}`, `card 1 at x=${c1.toFixed(0)} vs card 0 at ${c0.toFixed(0)}; after the key "${k1}", after the swipe "${k2}"; Next "${nextGlyph}"`);
  await o.ctx.close();
}

// 4f: the menu marquee keeps the band covered all the way through its loop
for (const dir of ["rtl", "ltr"]) {
  const o = await open(dir, { motion: true }); await mount(o.page, "flowing-menu", "תפריט"); await o.page.waitForTimeout(200);
  await o.page.locator("#stage li").first().hover(); await o.page.waitForTimeout(400);
  const gaps = [];
  for (const f of [0.1, 0.5, 0.95]) {
    const g = await o.page.evaluate((f) => { const li = document.querySelector("#stage li"); const track = li.querySelector("span[aria-hidden] > span"); for (const a of track.getAnimations()) { a.pause(); a.currentTime = f * 12000; } const L = li.getBoundingClientRect(), T = track.getBoundingClientRect(); return { gap: Math.max(0, T.left - L.left) + Math.max(0, L.right - T.right), anim: track.getAnimations().map((a) => a.animationName).join(",") }; }, f);
    gaps.push(g);
  }
  const ok = gaps.every((g) => g.gap < 1) && gaps[0].anim === (dir === "rtl" ? "mm-flow-rtl" : "mm-flow");
  check(ok && !o.errors.length, `flowing-menu on an ${dir.toUpperCase()} page: the marquee covers the row through its loop`, `uncovered px at 10/50/95%: ${gaps.map((g) => g.gap.toFixed(0)).join("/")}, animation ${gaps[0].anim}`);
  await o.ctx.close();
}

// 4g: sticky index rail and marker on the inline-start edge; bento's first tile on the inline-start side
for (const dir of ["rtl", "ltr"]) {
  const o = await open(dir); await mount(o.page, "sticky-index", "פרק"); await o.page.waitForTimeout(200);
  const g = await o.page.evaluate(() => { const ol = document.querySelector("#stage ol"); const m = ol.querySelector(":scope > span[aria-hidden]"); const a = ol.getBoundingClientRect(), b = m.getBoundingClientRect(); const s = getComputedStyle(ol); return { olL: a.left, olR: a.right, mL: b.left, mR: b.right, bl: s.borderLeftWidth, br: s.borderRightWidth }; });
  const ok = dir === "rtl" ? Math.abs(g.mR - g.olR) <= 2 && g.br === "1px" && g.bl === "0px" : Math.abs(g.mL - g.olL) <= 2 && g.bl === "1px";
  check(ok && !o.errors.length, `sticky-index on an ${dir.toUpperCase()} page: rail and marker on the ${dir === "rtl" ? "right" : "left"}`, `marker ${g.mL.toFixed(0)}…${g.mR.toFixed(0)} in list ${g.olL.toFixed(0)}…${g.olR.toFixed(0)}, border L ${g.bl} R ${g.br}`);
  await o.ctx.close();
  const p = await open(dir); await mount(p.page, "bento-reveal", "אריח"); await p.page.waitForTimeout(300);
  const [b0, b1] = await p.page.evaluate(() => [0, 1].map((i) => document.querySelector(`[data-card="${i}"]`).getBoundingClientRect().left));
  check((dir === "rtl" ? b0 > b1 : b0 < b1) && !p.errors.length, `bento-reveal on an ${dir.toUpperCase()} page: the first tile is on the ${dir === "rtl" ? "right" : "left"}`, `tile 0 x=${b0.toFixed(0)}, tile 1 x=${b1.toFixed(0)}`);
  await p.ctx.close();
}

// 4h: LetterRelay: on the way to the header the letters keep their reading order (no crossing)
for (const dir of ["rtl", "ltr"]) {
  const o = await open(dir, { motion: true, h: 700 }); await mount(o.page, "letter-relay", dir === "rtl" ? "אבגדה" : "ABCDE"); await o.page.waitForTimeout(200);
  const res = [];
  for (const y of [300, 450, 600]) { await o.page.evaluate((y) => window.scrollTo(0, y), y); await o.page.waitForTimeout(250); res.push(await o.page.evaluate(() => [...document.querySelectorAll("#stage [data-l]")].map((l) => { const r = l.getBoundingClientRect(); return r.left + r.width / 2; }))); }
  const ok = res.every((xs) => ordered(xs.map((x) => ({ x })), dir === "rtl"));
  check(ok && !o.errors.length, `letter-relay on an ${dir.toUpperCase()} page: letters keep their order while they travel`, res.map((xs) => xs.map((x) => x.toFixed(0)).join(" ")).join(" | "));
  await o.ctx.close();
}

await browser.close();
writeFileSync(join(OUT, "report.json"), JSON.stringify(rows, null, 2));
console.log(failed ? `\n${failed} of ${rows.length} RTL check(s) failed.` : `\nall ${rows.length} RTL checks pass (${IDS.length} components).`);
process.exit(failed ? 1 : 0);
