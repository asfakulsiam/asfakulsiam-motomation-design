#!/usr/bin/env node
// Delivery Gate, measured. Scans a built page in a real browser and prints numbers, not opinions.
//
//   node scripts/gate.mjs <url | file.html | dir/> [more targets] [--json] [--out report.json]
//   node scripts/gate.mjs --verify <file.html> [--url http://…]   check the stamp written in the file against a fresh scan
//
// Checks (all bounded: each one is only as strong as what it measures, and says what it skipped):
//   contrast   every visible text element vs the pixels actually behind it (text hidden, page screenshotted, sampled;
//              judged by the 10th-percentile sample; warns when > 30% of text elements could not be measured)
//              → fails below 4.5:1 (body) or 3:1 (large: ≥24px, or ≥18.66px bold)
//   overflow   at 375, 390, 768, 1440: page scroll width, and elements escaping the viewport or pushing text out of
//              their parent by >1px with no clipping ancestor
//   words      at 375: display text (h1–h3 or ≥32px) that overflows its box, leaves the viewport, or breaks a word
//              across lines or across split spans (e.g. "Have li")
//   motion     with prefers-reduced-motion: text visible normally but hidden under reduced motion, and pixels still
//              changing on a still page
//   names      img without alt, interactive elements without an accessible name
//
// Needs Playwright (npm i -D playwright && npx playwright install chromium). Without a browser it prints
// "not verified — no browser" and exits 3. It never prints a pass it didn't measure.
// Exit codes: 0 pass · 1 fail · 2 stamp rejected · 3 not verified.
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname, basename, extname, join } from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { projectRoot } from "./memory.mjs";

export const WIDTHS = [375, 390, 768, 1440];
export const GATE_VERSION = "gate/1";

// ── args ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flags = {}; const targets = [];
for (let i = 0; i < argv.length; i++) {
  const t = argv[i];
  if (t.startsWith("--")) { const k = t.slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true; flags[k] = v; }
  else targets.push(t);
}

// ── browser (optional dependency) ─────────────────────────────────────────────
async function loadPlaywright() {
  const tries = [() => import("playwright"), () => import("playwright-core")];
  for (const base of [process.cwd(), dirname(new URL(import.meta.url).pathname)]) {
    const req = createRequire(join(base, "noop.js"));
    for (const name of ["playwright", "playwright-core"]) tries.push(() => import(req.resolve(name)));
  }
  for (const t of tries) { try { const m = await t(); const pw = m.chromium ? m : m.default; if (pw?.chromium) return pw; } catch {} }
  return null;
}

// ── static server for files and folders ───────────────────────────────────────
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".json": "application/json", ".mp4": "video/mp4" };
function serve(root) {
  return new Promise((ok) => {
    const srv = createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let f = join(root, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
      if (!f.startsWith(root) || !existsSync(f)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f));
    }).listen(0, "127.0.0.1", () => ok({ srv, port: srv.address().port }));
  });
}
async function toUrl(target) {
  if (/^https?:\/\//.test(target)) return { url: target, close: () => {} };
  const abs = resolve(target); if (!existsSync(abs)) throw new Error(`not found: ${target}`);
  const isDir = statSync(abs).isDirectory(); const root = isDir ? abs : dirname(abs);
  const { srv, port } = await serve(root);
  return { url: `http://127.0.0.1:${port}/${isDir ? "" : basename(abs)}`, close: () => srv.close() };
}

// ── in-page helpers (serialised into the page) ────────────────────────────────
const PAGE_LIB = `
window.__g = {
  key(e) { const p = []; for (let n = e; n && n.nodeType === 1 && n !== document.documentElement; n = n.parentElement) { let i = 1, s = n; while ((s = s.previousElementSibling)) if (s.tagName === n.tagName) i++; p.unshift(n.tagName.toLowerCase() + ":" + i); } return p.join(">"); },
  label(e) { const id = e.id ? "#" + e.id : ""; const c = (e.getAttribute("class") || "").trim().split(/\\s+/).filter(Boolean).slice(0, 2).map((x) => "." + x).join(""); return e.tagName.toLowerCase() + id + c; },
  decorative(e) { for (let n = e; n; n = n.parentElement) { if (n.nodeType !== 1) continue; if (n.getAttribute("aria-hidden") === "true" || n.hasAttribute("hidden") || n.hasAttribute("inert") || (n.tagName === "DIALOG" && !n.open)) return true; } return false; },
  srOnly(e) { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width <= 2 || r.height <= 2 || s.clipPath === "inset(50%)" || s.clip === "rect(0px, 0px, 0px, 0px)" || s.clip === "rect(1px, 1px, 1px, 1px)"; },
  opacity(e) { let o = 1; for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const s = getComputedStyle(n); o *= parseFloat(s.opacity); if (s.visibility === "hidden" && n === e) return 0; } return o; },
  hasText(e) { for (const n of e.childNodes) if (n.nodeType === 3 && n.textContent.trim().length > 0) return true; return false; },
  textEls() { return [...document.body.querySelectorAll("*")].filter((e) => !["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG", "TITLE"].includes(e.tagName) && __g.hasText(e)); },
  rgba(c) { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; },
  lum({ r, g, b }) { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); },
  ratio(a, b) { const [x, y] = [__g.lum(a), __g.lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); },
  name(e) {
    const t = (s) => (s || "").replace(/\\s+/g, " ").trim();
    const lb = e.getAttribute("aria-labelledby"); if (lb) { const s = t(lb.split(/\\s+/).map((id) => document.getElementById(id)?.textContent).join(" ")); if (s) return s; }
    if (t(e.getAttribute("aria-label"))) return t(e.getAttribute("aria-label"));
    if (e.id && (e.tagName === "INPUT" || e.tagName === "SELECT" || e.tagName === "TEXTAREA")) { const l = document.querySelector('label[for="' + CSS.escape(e.id) + '"]'); if (l && t(l.textContent)) return t(l.textContent); }
    const wrap = e.closest("label"); if (wrap && t(wrap.textContent)) return t(wrap.textContent);
    if (e.tagName === "INPUT" && ["submit", "button", "reset"].includes(e.type) && t(e.value)) return t(e.value);
    if (e.tagName === "INPUT" && e.type === "image" && t(e.alt)) return t(e.alt);
    const inner = t(e.innerText) || t(e.textContent); if (inner) return inner;
    const alts = [...e.querySelectorAll("img[alt], svg title, [aria-label]")].map((x) => x.getAttribute("alt") || x.getAttribute("aria-label") || x.textContent).map(t).filter(Boolean).join(" "); if (alts) return alts;
    if (t(e.getAttribute("title"))) return t(e.getAttribute("title"));
    if (t(e.getAttribute("placeholder"))) return t(e.getAttribute("placeholder"));
    return "";
  },
};`;

async function settle(page) {
  await page.waitForTimeout(800);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < Math.min(h, 40000); y += 500) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(40); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(700);
}
async function open(browser, url, opts) {
  const ctx = await browser.newContext({ deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage(); const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.waitForTimeout(3000));
  await page.addScriptTag({ content: PAGE_LIB }); await settle(page);
  return { ctx, page, errors };
}

// ── checks ───────────────────────────────────────────────────────────────────
const SKIP_WARN_PCT = 30; // warn when more than this share of text elements could not be measured
async function contrast(browser, url) {
  // Measure each text element in the scroll position where a visitor sees it: scroll a viewport at a time, hide all
  // text, screenshot the viewport, and sample the pixels behind every element that is fully on screen.
  const VW = 1440, VH = 900;
  const { ctx, page } = await open(browser, url, { viewport: { width: VW, height: VH } });
  await page.evaluate(() => __g.textEls().forEach((e, i) => e.setAttribute("data-g-id", i)));
  const H = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), 40000);
  const done = new Map(); const seenHidden = new Set();
  const HIDE = "*,*::before,*::after{color:transparent!important;text-shadow:none!important;-webkit-text-stroke:0!important;caret-color:transparent!important;text-decoration-color:transparent!important}";
  // pinned / sticky sequences change while the page "stands still": sample them every 0.15 viewport, the rest every 0.7
  const zones = await page.evaluate(() => [...document.querySelectorAll(".pin-spacer, *")].filter((e) => e.classList.contains("pin-spacer") || getComputedStyle(e).position === "sticky")
    .map((e) => { const z = e.classList.contains("pin-spacer") ? e : e.parentElement; const r = z.getBoundingClientRect(); return [r.top + scrollY, r.top + scrollY + r.height - innerHeight]; }).filter(([a, b]) => b > a));
  const steps = new Set(); for (let y = 0; y <= Math.max(0, H - VH) + 1; y += Math.round(VH * 0.7)) steps.add(y);
  for (const [a, b] of zones.slice(0, 12)) for (let y = Math.max(0, a); y <= b; y += Math.round(VH * 0.15)) steps.add(Math.round(y));
  for (const y of [...steps].sort((p, q) => p - q)) {
    await page.evaluate((v) => scrollTo(0, v), y);
    // let entrances finish: wait for CSS/WAAPI animations, then only measure elements whose opacity and position are stable
    await page.waitForFunction(() => !document.getAnimations().some((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity), null, { timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(350);
    const read = () => page.evaluate(() => { const pe = document.createElement("style"); pe.textContent = "*{pointer-events:auto!important}"; document.head.append(pe); try { return [...document.querySelectorAll("[data-g-id]")].filter((e) => !__g.decorative(e) && !__g.srOnly(e)).map((e) => {
      const s = getComputedStyle(e); const r = e.getBoundingClientRect();
      // occluded? the topmost element at the text's centre must be the element itself, a descendant, or an ancestor
      // only layers that actually paint over the text count (an invisible closed backdrop or a faint grain overlay doesn't)
      const paints = (n) => { if (__g.opacity(n) < 0.5) return false; const cs = getComputedStyle(n); if (cs.visibility === "hidden") return false;
        return ["IMG", "VIDEO", "CANVAS", "svg", "IFRAME"].includes(n.tagName) || (__g.rgba(cs.backgroundColor)?.a ?? 0) >= 0.5 || cs.backgroundImage !== "none"; };
      const pts = [[0.5, 0.5], [0.15, 0.3], [0.85, 0.3], [0.15, 0.7], [0.85, 0.7]];
      const occluded = pts.some(([fx, fy]) => {
        const stack = document.elementsFromPoint(Math.min(innerWidth - 1, r.left + r.width * fx), Math.min(innerHeight - 1, r.top + r.height * fy));
        const top = stack.find((n) => n === e || e.contains(n) || n.contains(e) || paints(n));
        return top && !(top === e || e.contains(top) || top.contains(e));
      });
      return { i: +e.dataset.gId, label: __g.label(e), text: e.textContent.trim().replace(/\s+/g, " ").slice(0, 50), fg: __g.rgba(s.color), op: __g.opacity(e), size: parseFloat(s.fontSize), weight: parseInt(s.fontWeight) || 400, x: r.left, y: r.top, w: r.width, h: r.height, occluded };
    }).filter((c) => c.fg && c.w > 0 && c.h > 0 && c.x >= 0 && c.y >= 0 && c.x + c.w <= innerWidth && c.y + c.h <= innerHeight); } finally { pe.remove(); } });
    // smooth-scroll libraries and scrubbed entrances keep moving after scrollTo: re-read until positions settle (≤3 s)
    let prevRead = await read(), cands = [];
    for (let k = 0; k < 12; k++) {
      await page.waitForTimeout(250); const now = await read(); const prev = new Map(prevRead.map((c) => [c.i, c]));
      const stable = (c) => { const p = prev.get(c.i); return p && Math.abs(p.op - c.op) < 0.01 && Math.abs(p.y - c.y) < 1 && Math.abs(p.x - c.x) < 1; };
      cands = now.filter((c) => stable(c) && !c.occluded); prevRead = now;
      if (process.env.GATE_DEBUG) console.error("y", y, "k", k, "now", now.length, "stable", now.filter(stable).length, "occluded", now.filter((c) => c.occluded).length);
      if (now.every(stable)) break;
    }
    // re-measure an element whenever it is more visible than before: scrubbed sequences dim inactive beats on purpose,
    // so each element is judged at its most visible state across the scroll, not at whatever frame it was first seen
    const todo = cands.filter((c) => !done.has(c.i) || c.op > done.get(c.i).op + 0.01);
    for (const c of todo) if (c.op <= 0.05) seenHidden.add(c.i);
    const vis = todo.filter((c) => c.op > 0.05); if (!vis.length) continue;
    const st = await page.addStyleTag({ content: HIDE }); await page.waitForTimeout(60);
    const shot = (await page.screenshot({ animations: "disabled" })).toString("base64");
    await st.evaluate((n) => n.remove());
    const res = await page.evaluate(async ({ shot, vis }) => {
      const img = new Image(); img.src = "data:image/png;base64," + shot; await img.decode();
      const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height; const cx = cv.getContext("2d", { willReadFrequently: true }); cx.drawImage(img, 0, 0);
      const hex = (o) => "#" + [o.r, o.g, o.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
      return vis.map((c) => {
        const samples = [];
        for (let a = 0; a < 6; a++) for (let b = 0; b < 3; b++) {
          const px = Math.min(img.width - 1, Math.round(c.x + c.w * (a + 0.5) / 6)), py = Math.min(img.height - 1, Math.round(c.y + c.h * (b + 0.5) / 3));
          const d = cx.getImageData(px, py, 1, 1).data; samples.push({ r: d[0], g: d[1], b: d[2] });
        }
        const fa = c.fg.a * c.op;
        const pairs = samples.map((bg) => ({ bg, r: __g.ratio({ r: c.fg.r * fa + bg.r * (1 - fa), g: c.fg.g * fa + bg.g * (1 - fa), b: c.fg.b * fa + bg.b * (1 - fa) }, bg) })).sort((p, q) => p.r - q.r);
        const ratios = pairs.map((x) => x.r);
        const bgMed = pairs[Math.floor((pairs.length - 1) * 0.1)].bg; // the background behind the judged (10th-percentile) sample
        // judge by the 10th-percentile sample, not the median: text that sits half on a light image must not pass
        // on the strength of its dark half. One stray sample (a hairline, a grain dot) still can't fail it alone.
        const p10 = ratios[Math.floor((ratios.length - 1) * 0.1)];
        return { ...c, ratio: +p10.toFixed(2), median: +ratios[Math.floor(ratios.length / 2)].toFixed(2), min: +ratios[0].toFixed(2), fgHex: hex(c.fg), bgHex: hex(bgMed) };
      });
    }, { shot, vis });
    for (const r of res) done.set(r.i, r);
  }
  const total = await page.evaluate(() => [...document.querySelectorAll("[data-g-id]")].filter((e) => !__g.decorative(e) && !__g.srOnly(e)).length);
  await ctx.close();
  const measured = [...done.values()];
  const large = (r) => r.size >= 24 || (r.size >= 18.66 && r.weight >= 700);
  const fails = measured.filter((r) => r.ratio < (large(r) ? 3 : 4.5)).map((r) => ({ el: r.label, text: r.text, ratio: r.ratio, need: large(r) ? 3 : 4.5, fg: r.fgHex, bg: r.bgHex, size: r.size }));
  const skipped = total - measured.length, skippedPct = total ? Math.round((skipped / total) * 100) : 0;
  return { measured: measured.length, skipped, total, skippedPct, lowCoverage: skippedPct > SKIP_WARN_PCT, notVisibleAtScan: [...seenHidden].filter((i) => !done.has(i)).length, fails };
}

async function overflowAt(browser, url, width) {
  const { ctx, page } = await open(browser, url, { viewport: { width, height: width < 800 ? 812 : 900 }, hasTouch: width < 800, isMobile: width < 800 });
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth; const out = [];
    const clips = (n) => { const s = getComputedStyle(n); return ["hidden", "clip", "auto", "scroll"].includes(s.overflowX); };
    for (const e of document.body.querySelectorAll("*")) {
      if (__g.decorative(e) && !__g.hasText(e)) continue;
      const s = getComputedStyle(e); if (s.display === "none" || s.visibility === "hidden" || s.position === "fixed") continue;
      const rc = e.getBoundingClientRect(); if (rc.width === 0 || rc.height === 0) continue;
      if (rc.right <= 0 || rc.left >= vw) continue; // parked entirely off-canvas (skip link, closed drawer); real scroll still shows in page scroll width
      let clipped = false; for (let n = e.parentElement; n && n !== document.documentElement; n = n.parentElement) if (clips(n)) { const pr = n.getBoundingClientRect(); if (rc.right > pr.right + 1 || rc.left < pr.left - 1) { clipped = true; break; } }
      if (clipped) continue;
      const esc = Math.max(rc.right - vw, -rc.left);
      if (esc > 1) { out.push({ el: __g.label(e), kind: "escapes viewport", px: Math.round(esc), text: __g.hasText(e) ? e.textContent.trim().slice(0, 40) : "" }); continue; }
      const p = e.parentElement; if (!p || !__g.hasText(e)) continue;
      const pr = p.getBoundingClientRect(); const ps = getComputedStyle(p);
      const pad = { l: parseFloat(ps.paddingLeft) || 0, r: parseFloat(ps.paddingRight) || 0 };
      const over = Math.max(rc.right - (pr.right - pad.r * 0), (pr.left) - rc.left);
      if (over > 1 && s.position !== "absolute") out.push({ el: __g.label(e), kind: "text overflows parent", px: Math.round(over), text: e.textContent.trim().slice(0, 40) });
    }
    // keep the outermost offender per chain (children of an escaping element are the same problem)
    return { scroll: document.documentElement.scrollWidth - vw, items: out };
  });
  await ctx.close();
  const seen = new Set(); const items = r.items.filter((x) => { const k = x.kind + x.px + x.text; if (seen.has(k)) return false; seen.add(k); return true; });
  return { width, pageScroll: r.scroll, items };
}

async function words(browser, url) {
  const { ctx, page } = await open(browser, url, { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth; const out = []; let checked = 0;
    // visual check: decorative (aria-hidden) display text still counts, because sighted visitors read it
    const gone = (e) => { for (let n = e; n; n = n.parentElement) if (n.hasAttribute?.("hidden") || (n.tagName === "DIALOG" && !n.open)) return true; return false; };
    const els = [...document.body.querySelectorAll("h1,h2,h3,[role=heading],*")].filter((e, i, a) => a.indexOf(e) === i && !gone(e) && (/^H[1-3]$/.test(e.tagName) || (__g.hasText(e) && parseFloat(getComputedStyle(e).fontSize) >= 32)));
    const top = els.filter((e) => !els.some((o) => o !== e && o.contains(e)));
    for (const e of top) {
      const rc = e.getBoundingClientRect(); if (rc.width === 0 || getComputedStyle(e).display === "none") continue;
      if (rc.right <= 0 || rc.left >= vw) continue; // parked off-canvas (closed drawer, skip link)
      checked++;
      const text = e.textContent.replace(/\s+/g, " ").trim(); const lab = { el: __g.label(e), text: text.slice(0, 48) };
      if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX === "visible") out.push({ ...lab, problem: `text wider than its box by ${e.scrollWidth - e.clientWidth}px` });
      // a marquee track: decorative (aria-hidden) text that a clipping ancestor cuts off on purpose; its readable copy lives elsewhere
      const clippedTrack = (() => { let hid = false; for (let q = e; q && q !== document.body; q = q.parentElement) { if (q.getAttribute?.("aria-hidden") === "true") hid = true; const ox = getComputedStyle(q).overflowX; if (hid && q !== e && (ox === "hidden" || ox === "clip")) return true; } return false; })();
      if ((rc.right > vw + 1 || rc.left < -1) && !clippedTrack) out.push({ ...lab, problem: `leaves the viewport by ${Math.round(Math.max(rc.right - vw, -rc.left))}px` });
      // map characters to text nodes, then measure each word's rendered boxes
      const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); const chars = []; let n;
      // a word never continues across a <br> or into a different block box
      const blockOf = (t) => { for (let q = t.parentElement; q; q = q.parentElement) { const d = getComputedStyle(q).display; if (q === e || !d.startsWith("inline") || d === "inline-block" || d === "inline-flex") return q; } return e; };
      const brs = [...e.querySelectorAll("br")]; let prevN = null;
      while ((n = walker.nextNode())) {
        if (prevN && (blockOf(prevN) !== blockOf(n) || brs.some((b) => prevN.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING && n.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING))) chars.push([null, 0, " "]);
        for (let i = 0; i < n.textContent.length; i++) chars.push([n, i, n.textContent[i]]); prevN = n;
      }
      let w = []; const words = [];
      for (const c of chars.concat([[null, 0, " "]])) { if (/\s/.test(c[2])) { if (w.length > 1) words.push(w); w = []; } else w.push(c); }
      for (const word of words) {
        const str = word.map((c) => c[2]).join(""); if (str.length < 3) continue;
        const rg = document.createRange(); rg.setStart(word[0][0], word[0][1]); rg.setEnd(word[word.length - 1][0], word[word.length - 1][1] + 1);
        const rects = [...rg.getClientRects()].filter((q) => q.width > 0.5);
        if (rects.length < 2) continue;
        const fs = parseFloat(getComputedStyle(word[0][0].parentElement).fontSize);
        const lines = new Set(rects.map((q) => Math.round(q.top / (fs * 0.5)))).size;
        let gap = 0; const sorted = rects.slice().sort((a, b) => a.left - b.left); for (let i = 1; i < sorted.length; i++) gap = Math.max(gap, sorted[i].left - sorted[i - 1].right);
        if (lines > 1) { if (!/[-\u00AD\u2010-\u2014/]/.test(str)) out.push({ ...lab, problem: `word "${str}" breaks across lines` }); }
        else if (gap > fs * 0.35) out.push({ ...lab, problem: `word "${str}" is split by a ${Math.round(gap)}px gap` });
      }
    }
    // one word built from several display elements (e.g. "Have" + "li" on two door leaves): fragments on one line, same
    // size, no spaces, and the joined word appears as a whole word elsewhere on the page
    const page = (document.title + " " + document.body.innerText).toLowerCase();
    const frags = top.filter((e) => { const t = e.textContent.trim(); return t && !/\s/.test(t) && getComputedStyle(e).display !== "none" && e.getBoundingClientRect().width > 0; })
      .map((e) => { const rg = document.createRange(); rg.selectNodeContents(e); return { e, t: e.textContent.trim(), r: rg.getBoundingClientRect(), fs: parseFloat(getComputedStyle(e).fontSize) }; }).sort((a, b) => a.r.left - b.r.left);
    for (let i = 0; i < frags.length; i++) for (let j = 0; j < frags.length; j++) {
      const a = frags[i], b = frags[j]; if (a === b || Math.abs(a.fs - b.fs) > 1 || Math.abs(a.r.top - b.r.top) > a.fs * 0.3 || b.r.left < a.r.right - 1) continue;
      // only neighbours: a fragment sitting between them on the same line means a and b are not one word ("a" and "t" in E·l·a·s·t·i·c)
      if (frags.some((c) => c !== a && c !== b && Math.abs(c.r.top - a.r.top) <= a.fs * 0.3 && c.r.left >= a.r.right - 1 && c.r.right <= b.r.left + 1)) continue;
      const gap = b.r.left - a.r.right; const word = (a.t + b.t).toLowerCase();
      if (gap > a.fs * 0.12 && gap < a.fs * 4 && new RegExp("(^|[^\\p{L}])" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^\\p{L}])", "u").test(page))
        out.push({ el: __g.label(a.e) + " + " + __g.label(b.e), text: a.t + "|" + b.t, problem: `word "${a.t + b.t}" is split across two elements with a ${Math.round(gap)}px gap` });
    }
    // hierarchy at 375: one h1, no skipped heading levels, one focal point on the first screen (a single largest text)
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter((h) => !gone(h) && getComputedStyle(h).display !== "none");
    let skips = 0; let prevL = 0; for (const h of hs) { const L = +h.tagName[1]; if (prevL && L > prevL + 1) skips++; prevL = L; }
    const first = [...document.body.querySelectorAll("*")].filter((e) => __g.hasText(e) && !gone(e)).map((e) => ({ e, r: e.getBoundingClientRect(), fs: parseFloat(getComputedStyle(e).fontSize) })).filter((x) => x.r.width > 0 && x.r.top < innerHeight && x.r.bottom > 0 && x.r.right > 0 && x.r.left < vw);
    const max = Math.max(0, ...first.map((x) => x.fs)); const big = first.filter((x) => x.fs >= max * 0.95);
    // an <em> inside the h1, or an outline layer stacked on the fill, is the same focal point
    const overlap = (a, b) => { const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return w > 0 && h > 0 && (w * h) / Math.min(a.width * a.height, b.width * b.height) > 0.5; };
    // letters of one split word (one span per letter, same parent) are one focal point, not one per letter
    const uniq = []; for (const x of big) if (!big.some((o) => o !== x && o.e.contains(x.e)) && !uniq.some((u) => overlap(u.r, x.r) || (u.e.parentElement === x.e.parentElement && u.e.textContent.trim().length <= 2 && x.e.textContent.trim().length <= 2))) uniq.push(x);
    const ties = uniq.length;
    return { checked, out, hier: { h1: hs.filter((h) => h.tagName === "H1").length, skips, focalTies: ties, largest: max } };
  });
  await ctx.close();
  return { checked: r.checked, fails: r.out, hier: r.hier };
}

async function motion(browser, url) {
  const visible = async (reduced) => {
    const { ctx, page } = await open(browser, url, { viewport: { width: 1440, height: 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
    const vis = await page.evaluate(() => Object.fromEntries(__g.textEls().filter((e) => !__g.srOnly(e) && !__g.decorative(e)).map((e) => {
      const r = e.getBoundingClientRect(); const off = r.right < 0 || r.left > innerWidth * 3; // pushed off-canvas by a transform
      return [__g.key(e), { v: __g.opacity(e) > 0.05 && !off, label: __g.label(e), text: e.textContent.trim().slice(0, 40) }];
    })));
    let still = null;
    if (reduced) { // a still page under reduced motion should not keep changing
      const a = (await page.screenshot()).toString("base64"); await page.waitForTimeout(900); const b = (await page.screenshot()).toString("base64");
      still = a === b ? 0 : await page.evaluate(async ({ a, b }) => {
        const load = async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; const x = c.getContext("2d"); x.drawImage(i, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
        const [p, q] = [await load(a), await load(b)]; let d = 0; for (let i = 0; i < p.length; i += 16) if (Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]) > 24) d++;
        return +(d / (p.length / 16) * 100).toFixed(2);
      }, { a, b });
    }
    await ctx.close(); return { vis, still };
  };
  const normal = await visible(false); const reduced = await visible(true);
  const hidden = Object.entries(normal.vis).filter(([k, v]) => v.v && reduced.vis[k] && !reduced.vis[k].v).map(([, v]) => ({ el: v.label, text: v.text }));
  return { compared: Object.keys(normal.vis).length, hiddenUnderReducedMotion: hidden, pixelsChangingWhenStillPct: reduced.still };
}

async function names(browser, url) {
  const { ctx, page } = await open(browser, url, { viewport: { width: 1440, height: 900 } });
  const r = await page.evaluate(() => {
    const out = [];
    for (const i of document.querySelectorAll("img")) if (!i.hasAttribute("alt") && !__g.decorative(i)) out.push({ el: __g.label(i), problem: "img without alt", src: (i.getAttribute("src") || "").slice(0, 60) });
    for (const s of document.querySelectorAll('svg[role="img"]')) if (!__g.name(s) && !s.querySelector("title")) out.push({ el: __g.label(s), problem: "svg role=img without a name" });
    const sel = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=checkbox],[role=switch],[role=tab],[role=menuitem],[role=slider],[tabindex]:not([tabindex="-1"])';
    let checked = 0;
    for (const e of document.querySelectorAll(sel)) {
      const s = getComputedStyle(e); if (s.display === "none" || __g.decorative(e) || e.getClientRects().length === 0 || s.visibility === "hidden") continue; checked++; // not rendered = not reachable
      if (!__g.name(e)) out.push({ el: __g.label(e), problem: "interactive element without an accessible name", html: e.outerHTML.slice(0, 80) });
    }
    return { checked, out };
  });
  await ctx.close(); return { checked: r.checked, fails: r.out };
}

async function structure(browser, url) {
  // entrance pattern per top-level section, and the measurable motion budget (pins, WebGL canvases, JS weight)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  await page.addScriptTag({ content: PAGE_LIB }).catch(() => {});
  const SNAP = () => { window.__secs = window.__secs || [...document.querySelectorAll("section, main > *, body > header, body > footer")].filter((e, i, a) => !a.some((o) => o !== e && o.contains(e)) && e.getBoundingClientRect().height > 40);
    return __secs.map((sec) => [...sec.querySelectorAll("*")].filter((e) => __g.hasText(e) || ["IMG", "svg", "CANVAS", "VIDEO", "FIGURE", "PICTURE"].includes(e.tagName)).slice(0, 10).map((e) => {
      const cs = getComputedStyle(e); const m = new DOMMatrix(cs.transform === "none" ? undefined : cs.transform);
      return { o: __g.opacity(e), x: m.m41, y: m.m42, sc: Math.hypot(m.a, m.b), clip: cs.clipPath, f: cs.filter };
    })); };
  await page.waitForTimeout(60);
  const pre = await page.evaluate(SNAP).catch(() => []);
  await page.waitForTimeout(1200);
  const n = await page.evaluate(() => (window.__secs || []).length).catch(() => 0); const post = [];
  for (let i = 0; i < n; i++) { await page.evaluate((k) => __secs[k].scrollIntoView({ block: "start" }), i); await page.waitForTimeout(1000); post.push((await page.evaluate(SNAP))[i]); }
  const patterns = pre.map((els, i) => { const counts = {};
    (els || []).forEach((a, j) => { const b = post[i]?.[j]; if (!b) return; const k = [];
      if (Math.abs(a.o - b.o) > 0.05) k.push("fade"); if (Math.abs(a.x - b.x) > 4) k.push("x"); if (Math.abs(a.y - b.y) > 4) k.push("y");
      if (Math.abs(a.sc - b.sc) > 0.02) k.push("scale"); if (a.clip !== b.clip) k.push("clip"); if (a.f !== b.f) k.push("filter");
      if (k.length) counts[k.join("+")] = (counts[k.join("+")] || 0) + 1; });
    const top = Object.entries(counts).sort((p, q) => q[1] - p[1])[0]; return top ? top[0] : "static"; });
  const seen = {}; for (const p of patterns) if (p !== "static") seen[p] = (seen[p] || 0) + 1;
  const repeats = Object.values(seen).reduce((a, c) => a + c - 1, 0);
  const bud = await page.evaluate(() => {
    const pins = document.querySelectorAll(".pin-spacer").length + [...document.querySelectorAll("*")].filter((e) => getComputedStyle(e).position === "sticky" && e.parentElement && e.parentElement.getBoundingClientRect().height >= innerHeight * 1.5).length;
    const webgl = [...document.querySelectorAll("canvas")].filter((c) => { try { return c.getContext("2d") === null; } catch { return true; } }).length;
    const scripts = [...document.scripts].map((s) => (s.src ? { src: s.src } : { inline: s.textContent }));
    const ids = (window.__secs || []).map((s) => s.id || s.getAttribute("aria-label") || s.tagName.toLowerCase()).filter(Boolean);
    return { pins, webgl, scripts, ids };
  });
  await ctx.close();
  const { gzipSync } = await import("node:zlib"); let js = 0, unknown = 0;
  for (const sc of bud.scripts) {
    if (sc.inline !== undefined) { js += gzipSync(sc.inline).length; continue; }
    try { const r = await fetch(sc.src); js += gzipSync(Buffer.from(await r.arrayBuffer())).length; } catch { unknown++; }
  }
  return { sections: patterns.length, patterns, repeats, pins: bud.pins, webgl: bud.webgl, jsKB: Math.round(js / 1024), jsUnknown: unknown, sectionIds: bud.ids };
}

// Tier budgets: craft/performance.md (JS, gzipped) and principles/restraint.md (pins, WebGL)
export const JS_BUDGET_KB = { 0: 30, 1: 30, 2: 80, 3: 140, 4: 250, 5: 250 };
function readRecord(file) {
  // the "Restraint Gate record" section of DESIGN.md (templates/DESIGN.md)
  if (!file || !existsSync(file)) return null;
  const t = readFileSync(file, "utf8"); const i = t.search(/^##\s+Restraint Gate record/im); if (i < 0) return null;
  const sec = t.slice(i).split(/\n##\s/)[0];
  const sv = sec.match(/Concept survived:\s*([^\n]+)/i); if (!sv) return null;
  const v = sv[1].trim().toLowerCase(); if (v.includes("<")) return null; // still the template placeholder
  const changes = +(v.match(/after\s+(\d+)/)?.[1] || 0);
  const lines = (re) => sec.split("\n").filter((l) => re.test(l) && l.replace(re, "").replace(/[-—:\s]/g, "").length > 2 && !/<[^>]+>/.test(l)).length;
  return { survived: v.startsWith("yes") ? (changes ? "changed" : "kept") : "replaced", changes, cuts: lines(/^\s*-\s*Cut:/i), anim: lines(/^\s*-\s*Rejected animation:/i) };
}
async function memoryAxis(logFile, stamp, sectionIds) {
  if (!stamp?.archetype || !stamp?.signature) return null;
  const { fingerprint, similarity, load } = await import("./lib.mjs");
  let runs = []; if (logFile && existsSync(logFile)) { try { runs = JSON.parse(readFileSync(logFile, "utf8")).runs || []; } catch {} }
  const last = runs[runs.length - 1];
  if (last && last.archetype === stamp.archetype && last.signature === stamp.signature && String(last.tier) === String(stamp.tier)) runs = runs.slice(0, -1); // this run, already logged
  const prev = runs.slice(-5); if (!prev.length) return { s: 5, trace: logFile && existsSync(logFile) ? "last5:none" : "last5:no-log" };
  const sigs = load("signatures"); const mine = fingerprint({ archetype: stamp.archetype, signature: stamp.signature, tier: stamp.tier, sections: sectionIds }, sigs);
  const fp = (r) => r.fingerprint || fingerprint({ archetype: r.archetype, signature: r.signature, tier: r.tier, sections: r.sections }, sigs);
  const worst = Math.max(0, ...prev.map((r) => similarity(mine, fp(r)).score));
  const reusedA = prev.some((r) => r.archetype === stamp.archetype), reusedS = prev.some((r) => r.signature === stamp.signature);
  const pct = Math.round(worst * 100);
  const sc = worst >= 0.999 ? 1 : reusedA && reusedS ? 2 : reusedA || reusedS || worst >= 0.7 ? 3 : worst >= 0.5 ? 4 : 5;
  return { s: sc, trace: `last5:${reusedA ? "archetype-reused" : "archetype-new"},${reusedS ? "signature-reused" : "signature-new"},fp${pct}` };
}
export function critiqueOf({ hier, words375, overflow375, motionFails, st, tier, record, mem }) {
  const issues = words375 + (overflow375 ? 1 : 0) + (hier.h1 === 1 ? 0 : 1) + hier.skips + (hier.focalTies > 1 ? 1 : 0);
  const H = `H${Math.max(1, 5 - issues)}[375:${issues}]`;
  let M = "M?[no-tier]";
  if (tier !== undefined && tier !== null && tier !== "") { const t = +tier; const over = (st.pins > 2 ? 1 : 0) + (st.webgl > 1 ? 1 : 0) + (st.jsKB > JS_BUDGET_KB[t] ? 1 : 0);
    let m = Math.max(1, 5 - over); if (motionFails) m = Math.min(m, 2);
    M = `M${m}[t${t}:pins${st.pins}/2,webgl${st.webgl}/1,js${st.jsKB}/${JS_BUDGET_KB[t]}KB,rm${motionFails}]`; }
  const V = `V${Math.max(1, 5 - st.repeats)}[entrance-repeats:${st.repeats}]`;
  const C = record ? `C${record.survived === "kept" ? 5 : record.survived === "changed" ? Math.max(2, 5 - record.changes) : 1}[restraint:${record.survived}${record.changes ? record.changes : ""}]` : "C?[no-record]";
  const R = record ? `R${Math.min(5, 1 + record.cuts + record.anim)}[cuts:${record.cuts},anim:${record.anim}]` : "R?[no-record]";
  const S = mem ? `S${mem.s}[${mem.trace}]` : "S?[no-archetype-in-stamp]";
  return `${C} ${H} ${S} ${R} ${M} ${V}`;
}

// ── run ──────────────────────────────────────────────────────────────────────
export async function scan(target, browser, opts = {}) {
  const { url, close } = await toUrl(target);
  try {
    const c = await contrast(browser, url);
    const o = []; for (const w of WIDTHS) o.push(await overflowAt(browser, url, w));
    const w = await words(browser, url); const m = await motion(browser, url); const n = await names(browser, url); const st = await structure(browser, url);
    // fingerprint of the served HTML with stamp comments removed: same page → same id, any other page → a different id
    const html = await fetch(url).then((r) => r.text()).catch(() => "");
    const pageHash = createHash("sha256").update(html.replace(/<!--[^>]*?motomation ·[\s\S]*?-->|\/\*[^*]*?motomation ·[\s\S]*?\*\//g, "")).digest("hex").slice(0, 16);
    const overflowFails = o.flatMap((x) => [...(x.pageScroll > 1 ? [{ width: x.width, el: "page", kind: "horizontal scroll", px: x.pageScroll }] : []), ...x.items.map((i) => ({ width: x.width, ...i }))]);
    const counts = { contrast: c.fails.length, overflow: overflowFails.length, words: w.fails.length, motion: m.hiddenUnderReducedMotion.length + (m.pixelsChangingWhenStillPct > 0.5 ? 1 : 0), names: n.fails.length };
    const id = createHash("sha256").update(JSON.stringify({ v: GATE_VERSION, counts, sizes: [w.checked, m.compared, n.checked], page: pageHash, c: c.fails.map((x) => x.el + x.ratio), o: overflowFails.map((x) => x.width + x.el + x.px), w: w.fails.map((x) => x.el + x.problem), m: m.hiddenUnderReducedMotion.map((x) => x.el), n: n.fails.map((x) => x.el) })).digest("hex").slice(0, 10);
    const pass = Object.values(counts).every((v) => v === 0);
    // the critique axes, each derived from a named check (gates/delivery-gate.md, Part 1)
    const local = !/^https?:/.test(target) ? (statSync(resolve(target)).isDirectory() ? resolve(target) : dirname(resolve(target))) : process.cwd();
    const pageStamp = !/^https?:/.test(target) ? readStamp(readFileSync(statSync(resolve(target)).isDirectory() ? join(resolve(target), "index.html") : resolve(target), "utf8"))?.fields : null;
    const meta = { ...(pageStamp || {}), ...(opts.archetype ? { archetype: opts.archetype } : {}), ...(opts.signature ? { signature: opts.signature } : {}), ...(opts.tier !== undefined ? { tier: opts.tier } : {}) };
    const designFile = opts.design || [join(local, "DESIGN.md"), join(process.cwd(), "DESIGN.md")].find((f) => existsSync(f));
    const logFile = opts.log || [join(local, ".motomation/log.json"), join(projectRoot(local), ".motomation/log.json"), join(projectRoot(), ".motomation/log.json")].find((f) => existsSync(f));
    const record = readRecord(designFile); const mem = await memoryAxis(logFile, meta, st.sectionIds);
    const critique = critiqueOf({ hier: w.hier, words375: w.fails.length, overflow375: overflowFails.filter((x) => x.width === 375).length, motionFails: counts.motion, st, tier: meta.tier, record, mem });
    return { target, url, version: GATE_VERSION, pass, counts, id, stamp: stampOf(counts, id), critique, sources: { design: designFile || null, log: logFile || null, meta }, structure: st, contrast: c, overflow: { widths: WIDTHS, fails: overflowFails }, words: w, motion: m, names: n };
  } finally { close(); }
}
export const stampOf = (k, id) => `gate: c${k.contrast} o${k.overflow} w${k.words} rm${k.motion} a${k.names} · ${GATE_VERSION} · ${id}`;
export function readStamp(html) {
  // a page may carry the stamp in an HTML comment and in the stylesheet; every stamp that carries a gate segment must hold up
  const all = [...html.matchAll(/<!--[^>]*?motomation ·[\s\S]*?-->|\/\*[^*]*?motomation ·[\s\S]*?\*\//g)].map((m) => m[0]);
  if (!all.length) return null;
  const parse = (raw) => { const g = raw.match(/gate: c(\d+) o(\d+) w(\d+) rm(\d+) a(\d+) · (gate\/\d+) · ([0-9a-f]{10})/); return g ? { counts: { contrast: +g[1], overflow: +g[2], words: +g[3], motion: +g[4], names: +g[5] }, version: g[6], id: g[7] } : null; };
  const fieldsOf = (raw) => { const f = {}; for (const k of ["archetype", "mutation", "signature", "tier"]) { const m = raw.match(new RegExp(k + ":\\s*([^·*\\n]+?)\\s*(?:·|\\*/|-->)")); if (m) f[k] = m[1].trim(); } return f; };
  const critOf = (raw) => raw.match(/critique:\s*(.+?)\s*(?:·\s*gate:|\*\/|-->)/)?.[1].trim() || null;
  const withGate = all.map((raw) => ({ raw, gate: parse(raw), critique: critOf(raw) })).filter((x) => x.gate);
  const best = withGate[0] || { raw: all[0], gate: null, critique: critOf(all[0]) };
  return { raw: best.raw, gate: best.gate, critique: best.critique, fields: fieldsOf(best.raw), others: withGate.slice(1), unmeasured: all.length - withGate.length };
}

function print(r) {
  const L = (s = "") => console.log(s);
  L(`DELIVERY GATE · ${r.target}`);
  L(`  contrast  ${r.counts.contrast === 0 ? "✓" : "✗"} ${r.counts.contrast} below AA  (${r.contrast.measured} text elements measured against rendered pixels; ${r.contrast.skipped} skipped; ${r.contrast.notVisibleAtScan} not visible at scan time)`);
  if (r.contrast.lowCoverage) L(`  ⚠ contrast coverage: ${r.contrast.skipped} of ${r.contrast.total} text elements (${r.contrast.skippedPct}%) were skipped (moving, occluded or never fully on screen) — more than ${SKIP_WARN_PCT}%, so c${r.counts.contrast} is not a full measurement. Check the skipped text by hand or make it measurable.`);
  for (const f of r.contrast.fails.slice(0, 12)) L(`     ${f.ratio}:1 < ${f.need}:1  ${f.fg} on ${f.bg}  ${f.size}px  ${f.el}  "${f.text}"`);
  L(`  overflow  ${r.counts.overflow === 0 ? "✓" : "✗"} ${r.counts.overflow} at ${WIDTHS.join("/")}px`);
  for (const f of r.overflow.fails.slice(0, 12)) L(`     ${f.width}px  ${f.kind} by ${f.px}px  ${f.el}${f.text ? `  "${f.text}"` : ""}`);
  L(`  words     ${r.counts.words === 0 ? "✓" : "✗"} ${r.counts.words} display-text problems at 375px  (${r.words.checked} display elements checked)`);
  for (const f of r.words.fails.slice(0, 12)) L(`     ${f.el}  ${f.problem}  "${f.text}"`);
  L(`  motion    ${r.counts.motion === 0 ? "✓" : "✗"} ${r.motion.hiddenUnderReducedMotion.length} text elements hidden only under reduced motion; pixels changing on a still page: ${r.motion.pixelsChangingWhenStillPct}%  (${r.motion.compared} compared)`);
  for (const f of r.motion.hiddenUnderReducedMotion.slice(0, 12)) L(`     hidden  ${f.el}  "${f.text}"`);
  L(`  names     ${r.counts.names === 0 ? "✓" : "✗"} ${r.counts.names} missing alt / accessible names  (${r.names.checked} interactive elements checked)`);
  for (const f of r.names.fails.slice(0, 12)) L(`     ${f.problem}  ${f.el}  ${f.html || f.src || ""}`);
  const st = r.structure;
  L(`  hierarchy  h1×${r.words.hier.h1}, ${r.words.hier.skips} skipped heading levels, ${r.words.hier.focalTies} element(s) tied for largest on the first 375px screen`);
  L(`  structure  ${st.sections} sections, entrances: ${st.patterns.join(" | ")} → ${st.repeats} repeat(s); pins ${st.pins}, WebGL canvases ${st.webgl}, JS ${st.jsKB}KB gzipped${st.jsUnknown ? ` (+${st.jsUnknown} script(s) not fetched)` : ""}`);
  L(`  records    DESIGN.md: ${r.sources.design || "none"} · memory log: ${r.sources.log || "none"} · stamp fields: ${JSON.stringify(r.sources.meta)}`);
  L(`  critique → ${r.critique}${/\?/.test(r.critique) ? "   (axes marked ? have no record to derive from)" : ""}`);
  L(`  ${r.pass ? "PASS" : "FAIL"}  stamp → critique: ${r.critique} · ${r.stamp}`);
  L("");
}


// ── optional motion report (--report): scroll-frame strips, not part of the gate's numbers ──
async function frameStrip(browser, url, viewport, reducedMotion, steps = 8) {
  const ctx = await browser.newContext({ viewport, reducedMotion }); const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 }).catch(() => {}); await page.waitForTimeout(800);
    const max = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
    const frames = []; let at = 0;
    for (let i = 0; i < steps; i++) {
      const target = Math.round((max * i) / (steps - 1));
      // wheel in small steps so scroll-linked code sees real scroll events, then settle
      while (at < target) { const d = Math.min(240, target - at); await page.mouse.wheel(0, d); at += d; await page.waitForTimeout(16); }
      await page.waitForTimeout(450);
      const y = await page.evaluate(() => Math.round(scrollY));
      const img = await page.screenshot({ type: "jpeg", quality: 55 });
      frames.push({ y, pct: max ? Math.round((y / max) * 100) : 0, src: `data:image/jpeg;base64,${img.toString("base64")}` });
    }
    return { viewport, reducedMotion, max, frames };
  } finally { await ctx.close(); }
}
export async function motionReport(target, browser, r, outFile) {
  const { url, close } = await toUrl(target);
  try {
    const strips = [await frameStrip(browser, url, { width: 1440, height: 900 }, "no-preference"), await frameStrip(browser, url, { width: 375, height: 812 }, "no-preference"), await frameStrip(browser, url, { width: 1440, height: 900 }, "reduce")];
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    const strip = (s) => `<section><h2>${s.viewport.width}px · ${s.reducedMotion === "reduce" ? "reduced motion" : "full motion"} · ${s.frames.length} frames over ${s.max}px of scroll</h2><div class="strip">${s.frames.map((f) => `<figure><img src="${f.src}" width="${s.viewport.width === 375 ? 150 : 300}" alt="frame at ${f.y}px"><figcaption>${f.y}px · ${f.pct}%</figcaption></figure>`).join("")}</div></section>`;
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Motion report · ${esc(target)}</title>
<style>body{margin:0;padding:32px;background:#111214;color:#e9e9ec;font:15px/1.5 ui-monospace,Menlo,Consolas,monospace}h1{font-size:20px;margin:0 0 4px}h2{font-size:14px;color:#b7b7bf;margin:28px 0 10px}p{margin:4px 0;color:#c9c9d1}.strip{display:flex;gap:10px;overflow-x:auto;padding-bottom:8px}figure{margin:0;flex:none}img{display:block;border:1px solid #2c2d33;height:auto}figcaption{font-size:12px;color:#9a9aa3;margin-top:4px}.pass{color:#7ee2a8}.fail{color:#ff8f8f}</style>
<h1>Motion report · ${esc(target)}</h1>
<p class="${r.pass ? "pass" : "fail"}">${r.pass ? "PASS" : "FAIL"} · critique: ${esc(r.critique)} · ${esc(r.stamp)}</p>
<p>Frames are taken after wheel-scrolling to each position and waiting 450ms. This report is for reviewing motion by eye and for judges; it adds nothing to the gate's numbers.</p>
${strips.map(strip).join("\n")}
</html>`;
    writeFileSync(outFile, html);
    return { outFile, frames: strips.reduce((n, s) => n + s.frames.length, 0), bytes: Buffer.byteLength(html) };
  } finally { await close?.(); }
}

async function main() {
  if (typeof flags.report === "string" && !targets.length) { targets.push(flags.report); flags.report = true; } // `--report file.html` alone: the file is the target
  if (flags.help || (!targets.length && !flags.verify)) { console.log("Usage: node scripts/gate.mjs <url|file|dir> … [--json] [--out file] [--design DESIGN.md] [--log .motomation/log.json] [--tier n --archetype x --signature y] [--report [out.html]]   |   --report <file.html>   |   --verify <file.html> [--url u]"); process.exit(targets.length ? 0 : 1); }
  const pw = await loadPlaywright();
  if (!pw) { console.log("not verified — no browser (install Playwright: npm i -D playwright && npx playwright install chromium)"); process.exit(3); }
  let browser; try { browser = await pw.chromium.launch(); } catch (e) { console.log(`not verified — no browser (${String(e.message).split("\n")[0]})`); process.exit(3); }
  const opts = { design: flags.design ? resolve(String(flags.design)) : undefined, log: flags.log ? resolve(String(flags.log)) : undefined, tier: flags.tier !== undefined ? String(flags.tier) : undefined, archetype: flags.archetype, signature: flags.signature };
  try {
    if (flags.verify) {
      const file = String(flags.verify); const st = readStamp(readFileSync(file, "utf8"));
      if (!st) { console.log(`STAMP REJECTED · ${file}: no motomation stamp comment found`); process.exit(2); }
      if (!st.gate) { console.log(`STAMP REJECTED · ${file}: the stamp has no measured gate values (a hand-written or copied stamp). Run node scripts/gate.mjs and paste its stamp.\n  found: ${st.raw.slice(0, 160)}`); process.exit(2); }
      if (!st.critique) { console.log(`STAMP REJECTED · ${file}: no critique segment. Paste the full "critique: … · gate: …" line gate.mjs printed.`); process.exit(2); }
      if (!/^C\d\[[^\]]+\] H\d\[[^\]]+\] S\d\[[^\]]+\] R\d\[[^\]]+\] M\d\[[^\]]+\] V\d\[[^\]]+\]$/.test(st.critique)) { console.log(`STAMP REJECTED · ${file}: critique "${st.critique}" is not traced. Every axis needs its number and the check it came from, e.g. H4[375:1]. Unmeasured scores are rejected.`); process.exit(2); }
      const r = await scan(flags.url ? String(flags.url) : file, browser, opts); print(r);
      if (st.critique !== r.critique) { console.log(`STAMP REJECTED · critique says "${st.critique}" but the checks give "${r.critique}"`); process.exit(2); }
      for (const g of [st.gate, ...st.others.map((o) => o.gate)]) {
        const same = JSON.stringify(g.counts) === JSON.stringify(r.counts) && g.id === r.id && g.version === r.version;
        if (!same) { console.log(`STAMP REJECTED · stamp says "${stampOf(g.counts, g.id)}" but a fresh scan measures "${r.stamp}"`); process.exit(2); }
      }
      console.log(`STAMP VERIFIED · critique and gate numbers match a fresh scan${r.pass ? " · gate PASS" : " · but the gate FAILS (the stamp honestly records failures)"}`); process.exit(r.pass ? 0 : 1);
    }
    const all = []; for (const t of targets) { const r = await scan(t, browser, opts); all.push(r); if (!flags.json) print(r); }
    if (flags.report) for (const [i, t] of targets.entries()) {
      const out = typeof flags.report === "string" ? resolve(flags.report) : join(/^https?:/.test(t) ? process.cwd() : (statSync(resolve(t)).isDirectory() ? resolve(t) : dirname(resolve(t))), `${/^https?:/.test(t) ? "page" : basename(resolve(t)).replace(/\.html?$/, "")}.motion-report.html`);
      const rep = await motionReport(t, browser, all[i], out); console.error(`motion report → ${rep.outFile} (${rep.frames} frames, ${(rep.bytes / 1024).toFixed(0)} KB)`);
    }
    if (flags.json) console.log(JSON.stringify(all.length === 1 ? all[0] : all, null, 2));
    if (flags.out) writeFileSync(String(flags.out), JSON.stringify(all.length === 1 ? all[0] : all, null, 2));
    process.exit(all.every((r) => r.pass) ? 0 : 1);
  } finally { await browser.close(); }
}
main().catch((e) => { console.error(e); process.exit(1); });
