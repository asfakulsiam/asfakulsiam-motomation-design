#!/usr/bin/env node
// Grapheme-safe split text (P0 T8). Every per-letter component renders each test string, and the result is compared
// pixel by pixel with the same text rendered unsplit in the same typography. Splitting with .split("") cuts a Bangla
// vowel sign or an emoji ZWJ sequence away from its base, and an inline-block span around a lone mark renders a dotted
// circle (◌া) or a broken emoji; splitting an Arabic word into spans drops its joined letter forms. Each would show here
// as a pixel difference against the unsplit text.
// Also checks SplitFlap: a value with glyphs outside its alphabet ("14/11", Bangla, emoji) must settle, under 3 s, on
// exactly that value.
//
//   NODE_PATH=<dir with esbuild react react-dom playwright>/node_modules node tests/components/graphemes.test.mjs [--out dir]
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const FONTS = join(ROOT, "skills/asfakulsiam-motomation-design/examples/templates/fonts");
const resolve = (m) => { for (const b of [process.cwd(), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)]) { try { return createRequire(join(b, "noop.js"))(m); } catch {} } throw new Error(`${m} not found (set NODE_PATH)`); };
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const OUT = arg("--out", "/tmp/graphemes-test"); mkdirSync(OUT, { recursive: true });

export const TEXTS = { "bangla-1": "কালো ঘর", "bangla-2": "নদীর ওপারে", "emoji-zwj": "👩🏽‍💻👨‍👩‍👧", arabic: "مرحبا" };
const IDS = ["decode", "letter-relay", "neighbour-moves", "pressure-type", "scroll-float", "split-flap", "ascii-text", "scramble-on-hover", "typewriter"];
const MOTION = new Set(["decode", "ascii-text", "split-flap"]); // run the animated path and let it settle; the rest render their split markup under reduced motion
const SETTLE = { decode: 1600, "ascii-text": 2000 };

const esbuild = resolve("esbuild"); const { chromium } = resolve("playwright");
const nodePaths = (process.env.NODE_PATH || "").split(":").filter(Boolean);
const b = await esbuild.build({ entryPoints: [join(HERE, "fixtures/graphemes.fixture.tsx")], bundle: true, write: false, format: "iife", jsx: "automatic", target: "es2020", nodePaths, define: { "process.env.NODE_ENV": '"production"' }, logLevel: "error" });
writeFileSync(join(OUT, "bundle.js"), b.outputFiles[0].text);
for (const w of ["400", "600"]) copyFileSync(join(FONTS, `HindSiliguri-${w}-normal-bengali.woff2`), join(OUT, `hind-${w}.woff2`));
writeFileSync(join(OUT, "index.html"), `<!doctype html><html lang="bn"><head><meta charset="utf-8"><title>graphemes</title><style>
@font-face{font-family:"Hind Siliguri";src:url(hind-400.woff2) format("woff2");font-weight:400}
@font-face{font-family:"Hind Siliguri";src:url(hind-600.woff2) format("woff2");font-weight:600 900}
body{margin:0;background:#fff;color:#111;font-family:"Hind Siliguri","Noto Sans Arabic","Noto Color Emoji",sans-serif}#stage{padding:40px}
</style></head><body><div id="stage"></div><script src="bundle.js"></script></body></html>`);
const PAGE = pathToFileURL(join(OUT, "index.html")).href;

// compare two PNG screenshots in the page: sizes within 2px, and the share of differing pixels (any channel > 64/255)
const compare = (page, a, z) => page.evaluate(async ({ a, z }) => {
  const load = async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); return i; };
  const [A, Z] = [await load(a), await load(z)];
  const w = Math.min(A.width, Z.width), h = Math.min(A.height, Z.height);
  const px = (img) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); g.drawImage(img, 0, 0); return g.getImageData(0, 0, w, h).data; };
  const [p, q] = [px(A), px(Z)]; let diff = 0, ink = 0;
  for (let i = 0; i < p.length; i += 4) { const d = Math.max(Math.abs(p[i] - q[i]), Math.abs(p[i + 1] - q[i + 1]), Math.abs(p[i + 2] - q[i + 2])); if (d > 64) diff++; if (Math.min(q[i], q[i + 1], q[i + 2]) < 200) ink++; }
  return { size: [A.width, A.height, Z.width, Z.height], diff, ink, pct: ink ? +(100 * diff / ink).toFixed(2) : 0 };
}, { a, z });

const browser = await chromium.launch();
const rows = []; let failed = 0;
const LIMIT_PCT = 2; // differing pixels as a share of the reference's ink; a dotted circle or a lost joined form is far above this
for (const id of IDS) {
  for (const [tk, text] of Object.entries(TEXTS)) {
    const shot = async (mode) => {
      const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: mode === "split" && MOTION.has(id) ? "no-preference" : "reduce" });
      const page = await ctx.newPage(); await page.goto(PAGE); await page.evaluate(() => document.fonts.load('40px "Hind Siliguri"'));
      const sel = await page.evaluate(({ id, mode, text }) => window.__render(id, mode, text), { id, mode, text });
      await page.waitForTimeout(mode === "split" ? (SETTLE[id] ?? 700) : 700); await page.evaluate(() => document.fonts.ready);
      const el = page.locator(sel).first(); const png = (await el.screenshot({ animations: "disabled" })).toString("base64");
      if (mode === "split") writeFileSync(join(OUT, `${id}-${tk}.png`), Buffer.from(png, "base64"));
      return { png, page, ctx };
    };
    const s = await shot("split"), p = await shot("plain");
    const r = await compare(p.page, s.png, p.png); await s.ctx.close(); await p.ctx.close();
    const sizeOk = Math.abs(r.size[0] - r.size[2]) <= 2 && Math.abs(r.size[1] - r.size[3]) <= 2;
    const ok = sizeOk && r.pct <= LIMIT_PCT; if (!ok) failed++;
    rows.push({ id, text: tk, ok, pct: r.pct, size: `${r.size[0]}×${r.size[1]} vs ${r.size[2]}×${r.size[3]}` });
    console.log(`${ok ? "✓" : "✗"} ${id.padEnd(18)} ${tk.padEnd(10)} ${String(r.pct).padStart(6)}% of ink differs  (${r.size[0]}×${r.size[1]} vs unsplit ${r.size[2]}×${r.size[3]})`);
  }
}

// SplitFlap settles on values outside its alphabet
const flap = [["00:00", "14/11"], ["JAN 2027", "কালো ঘর"], ["00:00", "👩🏽‍💻 12"], ["00:00", "مرحبا"], ["00:00", "10:45"]];
for (const [from, to] of flap) {
  const ctx = await browser.newContext({ viewport: { width: 800, height: 400 }, reducedMotion: "no-preference" }); const page = await ctx.newPage(); await page.goto(PAGE);
  await page.evaluate(({ from, to }) => window.__flap(from, to), { from, to });
  const t0 = Date.now(); let shown = "", settledMs = null; const want = to.toUpperCase();
  while (Date.now() - t0 < 3100) {
    shown = await page.evaluate(() => [...document.querySelectorAll("#stage > span > span[aria-hidden]")].map((c) => c.textContent.replace(/\u00a0/g, " ")).join(""));
    if (shown === want && settledMs === null) settledMs = Date.now() - t0; if (shown !== want) settledMs = null;
    if (settledMs !== null && Date.now() - t0 - settledMs > 300) break; await page.waitForTimeout(40);
  }
  const ok = settledMs !== null && settledMs < 3000; if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} split-flap ${JSON.stringify(from)} → ${JSON.stringify(to)}: ${ok ? `settled on ${JSON.stringify(shown)} in ${settledMs} ms` : `after 3 s shows ${JSON.stringify(shown)} (not settled)`}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(OUT, "report.json"), JSON.stringify(rows, null, 2));
console.log(failed ? `\n${failed} check(s) failed.` : `\nall ${rows.length} renders match the unsplit text; split-flap settles on every value.`);
process.exit(failed ? 1 : 0);
