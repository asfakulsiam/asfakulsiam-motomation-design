#!/usr/bin/env node
// Interaction (P2 T9), for every component in the cursor, layout, micro and ui families (its gallery demo), with motion on:
//   pointer   moves across the demo in a zigzag, presses and releases at its centre
//   keyboard  Tab through it: every focusable control is reachable and shows a focus indicator (outline or box-shadow);
//             arrows, Space and Escape are pressed on each
//   touch     a phone context (hasTouch): tap the centre, then a horizontal swipe with real touch events
//   unmount mid-animation  unmount while the pointer is moving / a key was just pressed / mid-swipe; 500 ms later no
//             animation frame is pending, no frame callback has run since, and window/document hold no more listeners
//             than before the mount
//   errors    no page error and no console error at any point
// Link clicks are kept on the page (default prevented in capture before the demo sees them, so navigation is the only
// thing suppressed).
//
//   NODE_PATH=<dir with esbuild react react-dom playwright>/node_modules node tests/components/interaction.test.mjs [--out dir] [--only id,id]
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const resolve = (m) => { for (const b of [process.cwd(), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)]) { try { return createRequire(join(b, "noop.js"))(m); } catch {} } console.error(`interaction.test: cannot find ${m}; install it and set NODE_PATH (see the header of this file)`); process.exit(2); };
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const OUT = arg("--out", "/tmp/interaction-test"); mkdirSync(OUT, { recursive: true });
const ONLY = arg("--only", null)?.split(",");
const FAMILIES = ["cursor", "layout", "micro", "ui"];
const esbuild = resolve("esbuild"); const { chromium } = resolve("playwright");
const nodePaths = (process.env.NODE_PATH || "").split(":").filter(Boolean);
const b = await esbuild.build({ entryPoints: [join(HERE, "fixtures/interaction.fixture.tsx")], bundle: true, write: false, format: "iife", jsx: "automatic", target: "es2020", nodePaths, define: { "process.env.NODE_ENV": '"development"' }, logLevel: "error" });
writeFileSync(join(OUT, "bundle.js"), b.outputFiles[0].text);
// bookkeeping, installed before the bundle: pending frames, frame callbacks run, listeners held by window and document
// (only those added from the demo bundle — component and React code — not Playwright's own input hooks)
const PROBE = `(()=>{const p=new Set();let ran=0;const r=window.requestAnimationFrame.bind(window),c=window.cancelAnimationFrame.bind(window);
window.requestAnimationFrame=(f)=>{const id=r((t)=>{p.delete(id);ran++;f(t)});p.add(id);return id};window.cancelAnimationFrame=(id)=>{p.delete(id);c(id)};
const held=new Map();for(const T of [window,document]){const a=T.addEventListener.bind(T),d=T.removeEventListener.bind(T);const k=T===window?"w":"d";
T.addEventListener=(t,f,o)=>{if(f&&String(new Error().stack).includes("bundle.js")){const key=k+":"+t;const s=held.get(key)||new Set();const cap=typeof o==="boolean"?o:!!(o&&o.capture);s.add(f.toString().length+":"+cap+":"+(f.__id||(f.__id=Math.random())));held.set(key,s)}return a(t,f,o)};
T.removeEventListener=(t,f,o)=>{if(f){const s=held.get(k+":"+t);const cap=typeof o==="boolean"?o:!!(o&&o.capture);if(s)s.delete(f.toString().length+":"+cap+":"+f.__id)}return d(t,f,o)}}
window.__probe=()=>({pending:p.size,ran,listeners:[...held].reduce((n,[,s])=>n+s.size,0),byType:Object.fromEntries([...held].filter(([,s])=>s.size).map(([k,s])=>[k,s.size]))})})();
document.addEventListener("click",(e)=>{const a=e.target.closest&&e.target.closest("a[href]");if(a)e.preventDefault()},true);`;
writeFileSync(join(OUT, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>interaction</title><style>html,body{overscroll-behavior:none}body{margin:0;font-family:sans-serif}#stage{padding:40px;min-height:500px}</style><script>${PROBE}</script></head><body><div id="stage"></div><script src="bundle.js"></script></body></html>`);
const PAGE = pathToFileURL(join(OUT, "index.html")).href;

const csv = readFileSync(join(ROOT, "skills/asfakulsiam-motomation-design/data/components.csv"), "utf8").trim().split("\n").slice(1).map((l) => l.split(","));
const ids = csv.filter((c) => FAMILIES.includes(c[2])).map((c) => c[0]).filter((id) => !ONLY || ONLY.includes(id));
// a horizontal swipe the page does not consume is the browser's back gesture (history navigation), not the component's
const browser = await chromium.launch({ args: ["--disable-features=OverscrollHistoryNavigation"] });
let failed = 0; const rows = [];
const report = (id, aspect, problems, ok_msg) => { const ok = !problems.length; if (!ok) failed++; rows.push({ id, aspect, ok, problems }); console.log(`${ok ? "✓" : "✗"} ${id.padEnd(20)} ${aspect.padEnd(9)} ${ok ? ok_msg : problems.join(" | ")}`); };
async function open({ touch = false } = {}) {
  const ctx = await browser.newContext(touch ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "no-preference" } : { viewport: { width: 1280, height: 900 }, reducedMotion: "no-preference" });
  const page = await ctx.newPage(); const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.split("\n")[0]}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text().split("\n")[0].slice(0, 180)}`); });
  page.on("framenavigated", (f) => { if (f === page.mainFrame() && !f.url().startsWith(PAGE)) errors.push(`navigated away to ${f.url().slice(0, 80)}`); });
  await page.goto(PAGE);
  // warm-up before the baseline: React's one-time document listeners, and the input hooks Playwright's mouse, keyboard
  // and touch install on first use, so only what the component adds is counted
  await page.evaluate(() => window.__warm()); await page.waitForTimeout(50);
  if (touch) await page.touchscreen.tap(2, 2); else { await page.mouse.move(2, 2); await page.mouse.down(); await page.mouse.up(); await page.keyboard.press("Shift"); }
  await page.waitForTimeout(50);
  return { ctx, page, errors };
}
const box = (page) => page.locator("#stage [data-demo]").boundingBox();
// after unmount: nothing pending, no frame run since, listeners back to the count before mount
async function leftovers(page, base) {
  await page.waitForTimeout(200); const probe = () => page.evaluate(() => (typeof window.__probe === "function" ? window.__probe() : null));
  const a = await probe(); await page.waitForTimeout(300); const z = await probe();
  if (!a || !z) return ["the page navigated away during the test"];
  const p = [];
  if (z.pending) p.push(`${z.pending} animation frame(s) pending 500 ms after unmount`);
  if (z.ran > a.ran) p.push(`${z.ran - a.ran} frame callback(s) ran 200–500 ms after unmount (a loop kept going)`);
  if (z.listeners > base.listeners) p.push(`window/document hold ${z.listeners - base.listeners} more listener(s) than before mount (${JSON.stringify(z.byType)} vs ${JSON.stringify(base.byType)})`);
  return p;
}
const zigzag = async (page, bb, n = 10) => { for (let k = 0; k <= n; k++) await page.mouse.move(bb.x + (bb.width * k) / n, bb.y + bb.height * (k % 2 ? 0.3 : 0.7), { steps: 2 }); };
async function swipe(cdp, x0, x1, y, steps = 8, beforeEnd) {
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y }] });
  for (let k = 1; k <= steps; k++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + ((x1 - x0) * k) / steps, y }] }); if (beforeEnd && k === Math.floor(steps / 2)) await beforeEnd(); }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

for (const id of ids) {
  // pointer + unmount while the pointer is moving
  { const o = await open(); const base = await o.page.evaluate(() => window.__probe()); await o.page.evaluate((id) => window.__mount(id), id); await o.page.waitForTimeout(600);
    const bb = await box(o.page); const p = [];
    if (!bb || bb.height < 2) p.push("demo has no box");
    else { await zigzag(o.page, bb); await o.page.mouse.move(bb.x + bb.width / 2, bb.y + Math.min(bb.height / 2, 400)); await o.page.mouse.down(); await o.page.waitForTimeout(60); await o.page.mouse.up(); await o.page.waitForTimeout(150);
      await zigzag(o.page, bb, 4); await o.page.evaluate(() => window.__unmount()); p.push(...(await leftovers(o.page, base))); }
    report(id, "pointer", [...p, ...o.errors], "zigzag, press, release; unmounted mid-move, nothing left behind"); await o.ctx.close(); }
  // keyboard + unmount right after a key
  { const o = await open(); const base = await o.page.evaluate(() => window.__probe()); await o.page.evaluate((id) => window.__mount(id), id); await o.page.waitForTimeout(600);
    const want = await o.page.evaluate(() => [...document.querySelectorAll('#stage a[href], #stage button:not([disabled]), #stage input:not([disabled]), #stage select, #stage textarea, #stage [tabindex]:not([tabindex="-1"])')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.closest("[inert]") && !e.closest('[aria-hidden="true"]'); }).length);
    const seen = new Set(), noRing = []; const p = [];
    await o.page.evaluate(() => document.body.focus());
    for (let k = 0; k < Math.min(want + 2, 14); k++) {
      await o.page.keyboard.press("Tab"); await o.page.waitForTimeout(60);
      const f = await o.page.evaluate(() => { const e = document.activeElement; if (!e || !e.closest("#stage")) return null; if (!e.dataset.k) e.dataset.k = String(Math.random()).slice(2, 8); const s = getComputedStyle(e);
        const ring = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== "none");
        return { k: e.dataset.k, tag: e.tagName.toLowerCase() + (e.getAttribute("aria-label") ? `[${e.getAttribute("aria-label")}]` : ""), ring }; });
      if (!f) break; if (seen.has(f.k)) continue; seen.add(f.k); if (!f.ring) noRing.push(f.tag);
      for (const key of ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Space", "Escape"]) { await o.page.keyboard.press(key); await o.page.waitForTimeout(20); }
    }
    if (want && !seen.size) p.push(`${want} focusable control(s), none reached with Tab`);
    else if (seen.size < want) p.push(`Tab reached ${seen.size} of ${want} focusable controls`);
    if (noRing.length) p.push(`no visible focus indicator on: ${noRing.join(", ")}`);
    await o.page.keyboard.press("Enter").catch(() => {}); await o.page.evaluate(() => window.__unmount()); p.push(...(await leftovers(o.page, base)));
    report(id, "keyboard", [...p, ...o.errors], want ? `${seen.size}/${want} controls reached by Tab, each with a focus ring; arrows/Space/Escape; unmounted after a key` : "nothing focusable (decorative); keys pressed; unmounted, nothing left behind"); await o.ctx.close(); }
  // touch: tap, swipe, unmount mid-swipe
  { const o = await open({ touch: true }); const base = await o.page.evaluate(() => window.__probe()); await o.page.evaluate((id) => window.__mount(id), id); await o.page.waitForTimeout(600);
    const bb = await box(o.page); const p = [];
    if (!bb || bb.height < 2) p.push("demo has no box");
    else { const cdp = await o.ctx.newCDPSession(o.page); const y = bb.y + Math.min(bb.height / 2, 300), cx = bb.x + bb.width / 2;
      await o.page.touchscreen.tap(cx, y); await o.page.waitForTimeout(150);
      await swipe(cdp, bb.x + bb.width * 0.8, bb.x + bb.width * 0.2, y); await o.page.waitForTimeout(150);
      await swipe(cdp, bb.x + bb.width * 0.2, bb.x + bb.width * 0.8, y, 8, () => o.page.evaluate(() => window.__unmount()));
      p.push(...(await leftovers(o.page, base))); }
    report(id, "touch", [...p, ...o.errors], "tap, swipe both ways; unmounted mid-swipe, nothing left behind"); await o.ctx.close(); }
}
// the negative control must be caught: a leaked listener, a frame loop still running, a button with no focus ring
{ const o = await open(); const base = await o.page.evaluate(() => window.__probe()); await o.page.evaluate(() => window.__mount("__control-leak")); await o.page.waitForTimeout(300);
  await o.page.evaluate(() => document.body.focus()); await o.page.keyboard.press("Tab"); const ring = await o.page.evaluate(() => { const s = getComputedStyle(document.activeElement); return (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none"; });
  await o.page.evaluate(() => window.__unmount()); const p = await leftovers(o.page, base);
  const caught = p.some((m) => /listener/.test(m)) && p.some((m) => /frame/.test(m)) && !ring; if (!caught) failed++;
  console.log(`${caught ? "✓" : "✗"} control: leaked listener + running frame loop + no focus ring ${caught ? "caught" : "NOT caught: the checks are blind"} (${p.join("; ")})`); await o.ctx.close(); }
await browser.close();
writeFileSync(join(OUT, "report.json"), JSON.stringify(rows, null, 2));
console.log(failed ? `\n${failed} of ${rows.length} check(s) failed.` : `\nall ${rows.length} checks pass (${ids.length} components × pointer, keyboard, touch); the leak control is caught.`);
process.exit(failed ? 1 : 0);
