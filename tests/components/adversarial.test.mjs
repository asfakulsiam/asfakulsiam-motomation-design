#!/usr/bin/env node
// Adversarial inputs for every text and type component (P2 T6). Each component renders each input below and the result
// is compared pixel by pixel with the same text unsplit in the same typography (fixtures/adversarial.fixture.tsx).
// More than 2% of the reference's ink differing fails: that is what a dotted circle (◌া), a broken emoji ZWJ sequence,
// a lost Arabic joined form, a slash or taka sign the component cannot draw, or a 200-character string that wraps
// mid-word looks like. The empty string has nothing to compare: it must render without an error and show no stray
// characters. Any page error or console error on any case fails.
//
//   NODE_PATH=<dir with esbuild react react-dom playwright>/node_modules node tests/components/adversarial.test.mjs [--out dir] [--only id,id]
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const FONTS = join(ROOT, "skills/asfakulsiam-motomation-design/examples/templates/fonts");
const resolve = (m) => { for (const b of [process.cwd(), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)]) { try { return createRequire(join(b, "noop.js"))(m); } catch {} } console.error(`adversarial.test: cannot find ${m}; install it and set NODE_PATH (see the header of this file)`); process.exit(2); };
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const OUT = arg("--out", "/tmp/adversarial-test"); mkdirSync(OUT, { recursive: true });
const ONLY = arg("--only", null)?.split(",");

// 200 characters of ordinary copy with punctuation, a date, a price and an accented word, so it wraps across lines
const LONG = (() => { const s = "Monsoon ledger, 14/11: the café by the ferry ghat takes ৳ 1,200 a table for the night of the première; rain or not, the lamps go up at six, the band at eight, and the last boat leaves at a quarter to midnight sharp. "; return [...s.repeat(2)].slice(0, 200).join(""); })();
export const INPUTS = { slash: "14/11", taka: "৳ 1,200", accent: "Café", "bangla-1": "কালো ঘর", "bangla-2": "নদীর ওপারে", "emoji-zwj": "👩🏽‍💻", arabic: "مرحبا", long: LONG, empty: "" };
const MOTION = new Set(["decode", "ascii-text", "split-flap"]); // the animated path, left to settle; the rest render their split markup under reduced motion
const SETTLE = { decode: 1600, "ascii-text": 2000, "split-flap": 2600 };
const LIMIT_PCT = 2;

const esbuild = resolve("esbuild"); const { chromium } = resolve("playwright");
const nodePaths = (process.env.NODE_PATH || "").split(":").filter(Boolean);
const b = await esbuild.build({ entryPoints: [join(HERE, "fixtures/adversarial.fixture.tsx")], bundle: true, write: false, format: "iife", jsx: "automatic", target: "es2020", nodePaths, define: { "process.env.NODE_ENV": '"development"' }, logLevel: "error" });
writeFileSync(join(OUT, "bundle.js"), b.outputFiles[0].text);
for (const w of ["400", "600"]) copyFileSync(join(FONTS, `HindSiliguri-${w}-normal-bengali.woff2`), join(OUT, `hind-${w}.woff2`));
writeFileSync(join(OUT, "index.html"), `<!doctype html><html lang="bn"><head><meta charset="utf-8"><title>adversarial</title><style>
@font-face{font-family:"Hind Siliguri";src:url(hind-400.woff2) format("woff2");font-weight:400}
@font-face{font-family:"Hind Siliguri";src:url(hind-600.woff2) format("woff2");font-weight:600 900}
body{margin:0;background:#fff;color:#111;font-family:"Hind Siliguri","Noto Sans Arabic","Noto Color Emoji",sans-serif}#stage{padding:40px}
</style></head><body><div id="stage"></div><script src="bundle.js"></script></body></html>`);
const PAGE = pathToFileURL(join(OUT, "index.html")).href;

// Drift-tolerant comparison (each 16px band of lines aligned on its own, since each line drifts by its own amount). Splitting into inline-block letters drops kerning pairs ("TA", "AV"), so glyphs late in a
// line sit a few pixels from where unsplit text puts them: the same glyphs, moved. A broken grapheme is different ink
// (a dotted circle, two halves of an emoji, an unjoined Arabic letter). So the reference is compared in 32px-wide
// columns, each at the horizontal offset (within ±3px of the previous column's, so drift may accumulate along a line
// but never jump) that matches best, with a 1px neighbourhood for anti-aliasing; ink that matches nowhere nearby
// counts. raw = the plain pixel-for-pixel share, reported alongside.
// Sizes: height within 2px; width within 2px or 1% (the accumulated drift of a 200-character line).
const compare = (page, a, z) => page.evaluate(async ({ a, z }) => {
  const load = async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); return i; };
  const [A, Z] = [await load(a), await load(z)];
  const W = Math.max(A.width, Z.width), H = Math.max(A.height, Z.height);
  // blur 0.8px before comparing: a stem moved half a pixel turns one black column into two grey ones, which no
  // threshold absorbs; softened, both read alike, while a lost or broken glyph still changes a glyph's worth of ink
  const px = (img, blur) => { const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); if (blur) g.filter = "blur(0.8px)"; g.drawImage(img, 0, 0); return g.getImageData(0, 0, W, H).data; };
  const [p, q] = [px(A, true), px(Z, true)], [p0, q0] = [px(A), px(Z)];
  // a pixel differs when nothing within 1px in the other image matches it (both ways, so extra ink counts as well as
  // missing ink): this absorbs anti-aliasing and sub-pixel placement, not a changed glyph
  const ch = (d, i) => [d[i], d[i + 1], d[i + 2]]; const near = (u, v) => Math.max(Math.abs(u[0] - v[0]), Math.abs(u[1] - v[1]), Math.abs(u[2] - v[2])) <= 64;
  const at = (d, x, y) => (x < 0 || y < 0 || x >= W || y >= H ? [255, 255, 255] : ch(d, (y * W + x) * 4));
  const matches = (d, x, y, v) => { for (let f = -1; f <= 1; f++) for (let e = -1; e <= 1; e++) if (near(at(d, x + e, y + f), v)) return true; return false; };
  const differs = (x, y, dx) => !matches(p, x + dx, y, at(q, x, y)) || !matches(q, x, y, at(p, x + dx, y));
  const differsRaw = (x, y) => !near(at(p0, x, y), at(q0, x, y));
  let ink = 0, raw = 0, diff = 0, off = 0; const COL = 32, STEP = 3, BAND = 16;
  for (let i = 0; i < q0.length; i += 4) if (Math.min(q0[i], q0[i + 1], q0[i + 2]) < 200) ink++;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (differsRaw(x, y)) raw++;
  let maxDrift = 0;
  for (let y0 = 0; y0 < H; y0 += BAND) {
    off = 0; const y1 = Math.min(H, y0 + BAND);
    for (let x0 = 0; x0 < W; x0 += COL) {
      let best = Infinity, bestDx = off;
      for (let dx = off - STEP; dx <= off + STEP; dx++) { let d = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < Math.min(W, x0 + COL); x++) if (differs(x, y, dx)) d++; if (d < best || (d === best && Math.abs(dx - off) < Math.abs(bestDx - off))) { best = d; bestDx = dx; } }
      diff += best; off = bestDx; maxDrift = Math.max(maxDrift, Math.abs(off));
    }
  }
  const pct = (n) => (ink ? +(100 * n / ink).toFixed(2) : n ? 100 : 0);
  return { size: [A.width, A.height, Z.width, Z.height], diff, ink, pct: pct(diff), raw: pct(raw), drift: maxDrift };
}, { a, z });

// grayscale text anti-aliasing: LCD subpixel fringes turn a sub-pixel move into coloured edge pixels that are not a glyph change
const browser = await chromium.launch({ args: ["--disable-lcd-text"] });
const probe = await (await browser.newContext()).newPage(); await probe.goto(PAGE);
const IDS = (await probe.evaluate(() => window.__ids())).filter((id) => !ONLY || ONLY.includes(id));
const rows = []; let failed = 0;
const open = async (id, mode) => {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: mode === "split" && MOTION.has(id) ? "no-preference" : "reduce" });
  const page = await ctx.newPage(); const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 200)}`); });
  await page.goto(PAGE); await page.evaluate(() => document.fonts.load('40px "Hind Siliguri"'));
  return { ctx, page, errors };
};
for (const id of IDS) {
  for (const [k, text] of Object.entries(INPUTS)) {
    const line = (ok, msg) => { if (!ok) failed++; rows.push({ id, input: k, ok, msg }); console.log(`${ok ? "✓" : "✗"} ${id.padEnd(18)} ${k.padEnd(10)} ${msg}`); };
    if (text === "") {
      const s = await open(id, "split");
      const sel = await s.page.evaluate(({ id }) => window.__render(id, "split", ""), { id });
      await s.page.waitForTimeout(SETTLE[id] ?? 700);
      const shown = await s.page.evaluate((sel) => { const el = document.querySelector(sel) || document.getElementById("stage"); return (el.innerText || "").replace(/\s+/g, ""); }, sel);
      await s.page.evaluate(() => window.__clear()); await s.page.waitForTimeout(100);
      line(!s.errors.length && shown === "", s.errors.length ? s.errors.join(" | ") : shown ? `shows ${JSON.stringify(shown)} for an empty string` : "renders and unmounts with no error, no stray characters");
      await s.ctx.close(); continue;
    }
    const shot = async (mode) => {
      const o = await open(id, mode);
      const sel = await o.page.evaluate(({ id, mode, text }) => window.__render(id, mode, text), { id, mode, text });
      await o.page.waitForTimeout(mode === "split" ? (SETTLE[id] ?? 700) : 700); await o.page.evaluate(() => document.fonts.ready);
      const png = (await o.page.locator(sel).first().screenshot({ animations: "disabled" })).toString("base64");
      writeFileSync(join(OUT, `${id}-${k}${mode === "split" ? "" : ".ref"}.png`), Buffer.from(png, "base64"));
      return { ...o, png };
    };
    let s, p;
    try { s = await shot("split"); p = await shot("plain"); } catch (e) { line(false, `did not render: ${e.message.split("\n")[0]}`); await s?.ctx.close(); await p?.ctx.close(); continue; }
    const r = await compare(p.page, s.png, p.png); const errs = [...s.errors, ...p.errors];
    await s.ctx.close(); await p.ctx.close();
    const sizeOk = Math.abs(r.size[0] - r.size[2]) <= Math.max(2, 0.01 * r.size[2]) && Math.abs(r.size[1] - r.size[3]) <= 2;
    line(sizeOk && r.pct <= LIMIT_PCT && !errs.length, `${String(r.pct).padStart(6)}% of ink differs (raw ${r.raw}%, drift ${r.drift}px)  (${r.size[0]}×${r.size[1]} vs unsplit ${r.size[2]}×${r.size[3]})${errs.length ? "  " + errs.join(" | ") : ""}`);
  }
}
// the negative control must fail where splitting breaks text, or the comparison is too lenient to trust
for (const k of ["bangla-1", "bangla-2", "emoji-zwj", "arabic"]) {
  const text = INPUTS[k]; const shots = [];
  for (const mode of ["split", "plain"]) { const o = await open("control", mode); const sel = await o.page.evaluate(({ mode, text }) => window.__render("control-naive-split", mode, text), { mode, text }); await o.page.waitForTimeout(500); shots.push({ ...o, png: (await o.page.locator(sel).first().screenshot()).toString("base64") }); }
  const r = await compare(shots[1].page, shots[0].png, shots[1].png); for (const s of shots) await s.ctx.close();
  const caught = r.pct > LIMIT_PCT; if (!caught) failed++;
  console.log(`${caught ? "✓" : "✗"} control: naive .split("") on ${k.padEnd(10)} ${caught ? `caught (${r.pct}% differs)` : `NOT caught (${r.pct}%): the comparison is too lenient`}`);
  rows.push({ id: "control-naive-split", input: k, ok: caught, pct: r.pct });
}
await browser.close();
writeFileSync(join(OUT, "report.json"), JSON.stringify(rows, null, 2));
console.log(failed ? `\n${failed} of ${rows.length} case(s) failed.` : `\nall ${rows.length} checks pass (${IDS.length * Object.keys(INPUTS).length} cases + 4 negative controls): ${IDS.length} components × ${Object.keys(INPUTS).length} inputs, each within ${LIMIT_PCT}% of the unsplit text, no errors.`);
process.exit(failed ? 1 : 0);
