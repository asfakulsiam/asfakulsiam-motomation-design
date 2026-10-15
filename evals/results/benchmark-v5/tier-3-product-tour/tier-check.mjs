// Tier 3 check + screenshots for both arms. Usage: node tier-check.mjs <workdir>
import { chromium } from "playwright"; import http from "http"; import fs from "fs"; import path from "path";
const W = path.resolve(process.argv[2]);
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json" };
const srv = http.createServer((q, r) => { let f = path.join(W, decodeURIComponent(q.url.split("?")[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html"); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": T[path.extname(f)] || "" }); r.end(fs.readFileSync(f)); }).listen(8734);
const B = "http://localhost:8734";
const PAGES = { baseline: ["/baseline/", "/baseline/features/", "/baseline/pricing/", "/baseline/start/"], skill: ["/skill/index.html", "/skill/features.html", "/skill/pricing.html", "/skill/start.html"] };
fs.mkdirSync(`${W}/shots`, { recursive: true });
const b = await chromium.launch(); const out = {};
const probe = (pg) => pg.evaluate(() => {
  const css = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r => r.cssText) } catch { return [] } }).join("\n");
  const names = [...document.querySelectorAll("*")].map(e => getComputedStyle(e).viewTransitionName).filter(n => n && n !== "none");
  const h = [...document.querySelectorAll("h1,h2,h3,p,li,a,button")]; const hidden = h.filter(e => { const s = getComputedStyle(e); return e.offsetParent !== null && (s.opacity === "0" || s.visibility === "hidden") }).length;
  return { atViewTransition: /@view-transition/.test(css), vtMeta: !!document.querySelector('meta[name="view-transition"]'), sharedNames: [...new Set(names)], lottie: typeof window.lottie !== "undefined" || typeof window.bodymovin !== "undefined", rive: typeof window.rive !== "undefined", lottieSvgs: document.querySelectorAll("svg").length, canvas: document.querySelectorAll("canvas").length, three: typeof window.THREE !== "undefined", stepText: (document.body.innerText.match(/Step \d of 4/) || [null])[0], focused: document.activeElement && (document.activeElement.tagName + (document.activeElement.id ? "#" + document.activeElement.id : "")), hiddenText: hidden, title: document.title };
});
for (const arm of ["baseline", "skill"]) {
  const r = out[arm] = { pages: [], nav: [], reduced: [] };
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const pg = await ctx.newPage();
  const errs = []; pg.on("pageerror", e => errs.push(String(e))); pg.on("requestfailed", q => errs.push("reqfail " + q.url()));
  for (const [i, u] of PAGES[arm].entries()) { await pg.goto(B + u, { waitUntil: "networkidle" }); await pg.waitForTimeout(2200); r.pages.push({ url: u, ...(await probe(pg)) }); await pg.screenshot({ path: `${W}/shots/${arm}-1440-p${i + 1}.png` }); }
  // forward navigation: click a link to next page, capture mid-transition, then focus
  await pg.goto(B + PAGES[arm][0], { waitUntil: "networkidle" }); await pg.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) {
    const next = PAGES[arm][i + 1]; const file = next.split("/").filter(Boolean).pop();
    const link = pg.locator(`a[href$="${file}"], a[href$="${file}/"], a[href="../${file}/"], a[href="${file}/"]`).last();
    await Promise.all([pg.waitForURL(B + next).catch(() => { }), link.click()]);
    await pg.waitForTimeout(220); await pg.screenshot({ path: `${W}/shots/${arm}-fwd-${i + 1}to${i + 2}-mid.png` });
    await pg.waitForTimeout(1800); const p = await probe(pg); r.nav.push({ dir: "fwd", to: pg.url().replace(B, ""), focused: p.focused, step: p.stepText });
  }
  for (let i = 3; i > 0; i--) { await pg.goBack(); await pg.waitForTimeout(220); await pg.screenshot({ path: `${W}/shots/${arm}-back-${i + 1}to${i}-mid.png` }); await pg.waitForTimeout(1800); const p = await probe(pg); r.nav.push({ dir: "back", to: pg.url().replace(B, ""), focused: p.focused, step: p.stepText, dataDir: await pg.evaluate(() => document.documentElement.getAttribute("data-dir")) }); }
  r.errors = errs; await ctx.close();
  const m = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true }); const mp = await m.newPage();
  for (const [i, u] of PAGES[arm].entries()) { await mp.goto(B + u, { waitUntil: "networkidle" }); await mp.waitForTimeout(2000); await mp.screenshot({ path: `${W}/shots/${arm}-375-p${i + 1}.png`, fullPage: true }); }
  await m.close();
  const rm = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }); const rp = await rm.newPage();
  for (const [i, u] of PAGES[arm].entries()) { await rp.goto(B + u, { waitUntil: "networkidle" }); await rp.waitForTimeout(400);
    const p = await probe(rp); const lot = await rp.evaluate(() => { const L = window.lottie; if (!L || !L.getRegisteredAnimations) return null; return L.getRegisteredAnimations().map(a => ({ cur: Math.round(a.currentFrame), total: Math.round(a.totalFrames), paused: a.isPaused })); });
    r.reduced.push({ url: u, sharedNames: p.sharedNames, hiddenText: p.hiddenText, lottie: lot }); await rp.screenshot({ path: `${W}/shots/${arm}-reduced-p${i + 1}.png` }); }
  await rm.close();
}
fs.writeFileSync(`${W}/tier-check.json`, JSON.stringify(out, null, 1)); await b.close(); srv.close();
console.log(JSON.stringify(out, null, 1));
