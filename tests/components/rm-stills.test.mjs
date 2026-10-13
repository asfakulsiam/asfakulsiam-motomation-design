// Tier 4 reduced-motion stills: under prefers-reduced-motion every Tier 4 background, the Tier 4 template and the
// Tier 5 film must show their own still composition: no <canvas> mounted, nothing changing, and visibly different
// from the full-motion frame (not "the animation stopped"). Writes full-motion | reduced-motion pairs to
// docs/rm-stills/<id>.webp and the numbers to docs/rm-stills/results.json.
//   node tests/components/rm-stills.test.mjs          (needs playwright; run from the repo root)
import { createRequire } from "node:module"; import { mkdirSync, writeFileSync } from "node:fs"; import { join, dirname } from "node:path"; import { fileURLToPath, pathToFileURL } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../.."); const req = createRequire(join(ROOT, "noop.js"));
let pw; try { pw = req("playwright"); } catch { console.log("not verified — no playwright"); process.exit(process.env.REQUIRE_BROWSER === "1" ? 1 : 0); }
const SK = join(ROOT, "skills/asfakulsiam-motomation-design");
const cases = [
  ...["aurora", "beams", "globe", "liquid-field", "mesh-gradient", "meteors", "particle-field"].map((id) => ({ id, kind: "Tier 4 background", file: join(ROOT, "docs/site/c", id + ".html"), at: () => 0 })),
  { id: "event", kind: "Tier 4 template", file: join(SK, "examples/templates/event.html"), at: () => 0 },
  // the film: full motion mid-chapter (pinned, canvas); reduced motion at the same chapter, now a storyboard
  { id: "motomation-film", kind: "Tier 5 film", file: join(SK, "examples/html/motomation-film.html"), at: (rm) => `(() => { const s = document.querySelector(${rm ? '"#scene-2"' : '".film"'}); const r = s.getBoundingClientRect(); return r.top + scrollY + ${rm ? "-80" : "r.height * 0.35"}; })()` },
];
const OUT = join(ROOT, "docs/rm-stills"); mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch();
async function shot(c, rm) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm ? "reduce" : "no-preference" }); const p = await ctx.newPage();
  await p.goto(pathToFileURL(c.file).href, { waitUntil: "load" }); await p.waitForTimeout(1500);
  const y = c.at(rm); if (y) { await p.evaluate(`scrollTo(0, ${y})`); await p.waitForTimeout(1800); }
  // docs pages: judge the demo frame (.stage) only, not the page chrome around it
  const box = await p.evaluate(() => { const s = document.querySelector(".stage"); if (!s) return null; const r = s.getBoundingClientRect(); return { x: r.left, y: Math.max(0, r.top), width: r.width, height: Math.min(r.height, innerHeight - Math.max(0, r.top)) }; });
  const o = box && box.width > 50 && box.height > 50 ? { clip: box } : {};
  const a = await p.screenshot(o); await p.waitForTimeout(1000); const b = await p.screenshot(o);
  const canvases = await p.evaluate(() => [...document.querySelectorAll("canvas")].filter((cv) => cv.isConnected && cv.getClientRects().length && getComputedStyle(cv).display !== "none").length);
  await ctx.close(); return { a, b, canvases };
}
const diff = async (x, y) => { const ctx = await browser.newContext(); const p = await ctx.newPage(); const r = await p.evaluate(async ([x, y]) => {
  const load = async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); const c = document.createElement("canvas"); c.width = 360; c.height = Math.round(i.height * 360 / i.width); const g = c.getContext("2d"); g.drawImage(i, 0, 0, c.width, c.height); return g.getImageData(0, 0, c.width, c.height).data; };
  const [p, q] = [await load(x), await load(y)]; let n = 0; for (let i = 0; i < p.length; i += 4) if (Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]) > 24) n++; return +(n / (p.length / 4) * 100).toFixed(1); }, [x.toString("base64"), y.toString("base64")]); await ctx.close(); return r; };
// side by side, labelled, 720px per half, WebP
const pair = async (x, y) => { const ctx = await browser.newContext(); const p = await ctx.newPage(); const url = await p.evaluate(async ([x, y]) => {
  const load = async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); return i; };
  const [a, b] = [await load(x), await load(y)]; const k = 720 / a.width, h = Math.round(Math.max(a.height, b.height) * k);
  const c = document.createElement("canvas"); c.width = 1460; c.height = h + 44; const g = c.getContext("2d"); g.fillStyle = "#f3efe6"; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#111"; g.font = "bold 20px sans-serif"; g.fillText("Full motion", 0, 28); g.fillText("prefers-reduced-motion: reduce", 740, 28);
  g.drawImage(a, 0, 44, 720, a.height * k); g.drawImage(b, 740, 44, 720, b.height * k); return c.toDataURL("image/webp", 0.82); }, [x.toString("base64"), y.toString("base64")]);
  await ctx.close(); return Buffer.from(url.split(",")[1], "base64"); };
let fails = 0; const rows = [];
for (const c of cases) {
  const full = await shot(c, false), rm = await shot(c, true);
  const still = await diff(rm.a, rm.b), distinct = await diff(full.a, rm.a);
  const ok = rm.canvases === 0 && still <= 0.5 && distinct >= 5; if (!ok) fails++;
  writeFileSync(join(OUT, `${c.id}.webp`), await pair(full.a, rm.a));
  rows.push({ id: c.id, kind: c.kind, canvasesFull: full.canvases, canvasesRM: rm.canvases, rmChangesPct: still, differsFromFullPct: distinct, ok });
  console.log(`${ok ? "ok  " : "FAIL"} ${c.id.padEnd(16)} ${c.kind.padEnd(18)} canvas full ${full.canvases} → reduced ${rm.canvases} · reduced-motion still changes ${still}% in 1s · differs from full motion by ${distinct}%`);
}
await browser.close(); writeFileSync(join(OUT, "results.json"), JSON.stringify(rows, null, 1));
console.log(fails ? `\n${fails} case(s) fail` : `\nall ${cases.length}: reduced motion is its own still composition (no canvas, no change, ≥ 5% different from full motion)`);
process.exit(fails ? 1 : 0);
