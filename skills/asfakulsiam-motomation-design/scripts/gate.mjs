#!/usr/bin/env node
// Delivery Gate, measured. Scans a built page in a real browser and prints numbers, not opinions.
//
//   node scripts/gate.mjs <url | file.html | dir/> [more targets] [--json] [--out report.json]
//   node scripts/gate.mjs --verify <file.html> [--url http://…]   check the stamp written in the file against a fresh scan
//
// Checks (all bounded: each one is only as strong as what it measures, and says what it skipped):
//   contrast   at 375, 390, 768 and 1440: every visible text element vs the pixels actually behind it (text hidden,
//              viewport screenshotted, sampled; judged by the 10th-percentile sample; warns when > 30% of text elements
//              could not be measured). Reported per viewport, so a mobile-only crop, overlay or background is caught.
//              → fails below 4.5:1 (body) or 3:1 (large: ≥24px, or ≥18.66px bold)
//              Scroll sequences (v2.5.0): every element is measured at every sampled scroll position (every 0.7 viewport,
//              every 0.15 viewport inside pinned/sticky zones, plus 0/25/50/75/100% of the page and of each zone). An
//              element that settles at several opacities is a sequence step: its active (most visible) state and every
//              inactive state it rests in (seen at ≥2 positions) must meet AA. A dimmed inactive step fails.
//   overflow   at 375, 390, 768, 1440: page scroll width, and elements escaping the viewport or pushing text out of
//              their parent by >1px with no clipping ancestor
//   words      at 375: display text (h1–h3 or ≥32px) that overflows its box, leaves the viewport, or breaks a word
//              across lines or across split spans (e.g. "Have li")
//   motion     with prefers-reduced-motion: text visible normally but hidden under reduced motion, and pixels still
//              changing on a still page
//   names      img without alt, interactive elements without an accessible name
//   numbers    numbers (counters, prices, progress values) read at scroll 0, at scroll end and under reduced motion, then
//              compared with the value each one settles on in view; any element that shows a value that is later
//              corrected ("0 hectares" before a count-up runs, a price that flips after load) fails. Values that keep
//              changing on their own (clocks, live tickers) are listed as live and not judged.
//
//   --timeout <s>  give up on a target after s seconds (default 600) and print "not verified — timed out"; exit 3.
//                  Very tall pages (the 36,000px gallery) would otherwise run for a very long time.
//   --timeout-ms <ms>  the same budget in milliseconds (wins over --timeout).
//   --light        start in the light footprint (see below) instead of trying the standard browser first.
//
// Constrained sandboxes (v2.5.0): Codex CLI, CI containers, 2-CPU or low-memory machines. The gate probes the machine
// first (CPUs, load, free memory, cgroup memory limit, /dev/shm, MOTOMATION_SANDBOX / CODEX_* variables) and prints
// what it found. If the browser fails to start, crashes or times out on an operation, it retries the target once in a
// light footprint: one renderer process (--renderer-process-limit=1 --no-zygote), no GPU
// (--disable-gpu), no /dev/shm (--disable-dev-shm-usage), a capped JS heap, and every operation timeout ×3. The checks
// are the same in both footprints; only the browser is lighter and more patient. If the retry also fails it prints
//   not verified — sandbox too constrained: <reason>  (attempt 1 …; attempt 2 …; machine …)
// and exits 3. Every exit path prints one verdict line: PASS, FAIL, STAMP …, or "not verified — <reason>". A kill
// signal (SIGTERM/SIGINT from an agent's tool timeout) prints "not verified — interrupted" before exiting.
//
// Needs Playwright (npm i -D playwright && npx playwright install chromium). Without a browser it prints
// "not verified — no browser" and exits 3. It never prints a pass it didn't measure.
// Exit codes: 0 pass · 1 fail · 2 stamp rejected · 3 not verified.
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname, basename, extname, join } from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import os from "node:os";
import { statfsSync } from "node:fs";
import { projectRoot } from "./memory.mjs";

export const WIDTHS = [375, 390, 768, 1440];
export const GATE_VERSION = "gate/3"; // gate/2: contrast measured per viewport; numbers check (n). gate/3: Q motion axis (progression, smoothness, reduced-motion distinctness; count q) and A accessibility axis (focus-visible, target size, 200% zoom, 320px reflow, forced colors, keyboard trap; count k)

// ── constrained sandboxes (v2.5.0) ────────────────────────────────────────────
// T(ms): every Playwright operation timeout goes through this, so the light footprint can be more patient (×3)
// without touching what is measured.
let OPS_SCALE = 1; const T = (ms) => Math.round(ms * OPS_SCALE);
// --single-process is not used: on Chromium 147 it kills the browser at Playwright's second context (tested, v2.5.0);
// --renderer-process-limit=1 gives the same one-renderer footprint without that crash.
export const LIGHT_ARGS = ["--no-zygote", "--renderer-process-limit=1", "--disable-gpu", "--disable-dev-shm-usage", "--disable-extensions", "--disable-background-networking", "--js-flags=--max-old-space-size=768"];
export function sandboxProbe(env = process.env) {
  const cpus = os.availableParallelism ? os.availableParallelism() : os.cpus().length, load = os.loadavg()[0], freeMB = Math.round(os.freemem() / 1048576);
  let cgroupMB = null; for (const f of ["/sys/fs/cgroup/memory.max", "/sys/fs/cgroup/memory/memory.limit_in_bytes"]) { try { const v = readFileSync(f, "utf8").trim(); if (/^\d+$/.test(v) && +v < 2 ** 50) { cgroupMB = Math.round(+v / 1048576); break; } } catch {} }
  let shmMB = null; try { const st = statfsSync("/dev/shm"); shmMB = Math.round((st.bavail * st.bsize) / 1048576); } catch {}
  let asMB = null; try { const m = readFileSync("/proc/self/limits", "utf8").match(/Max address space\s+(\d+)/); if (m) asMB = Math.round(+m[1] / 1048576); } catch {}
  const agent = env.MOTOMATION_SANDBOX || (env.CODEX_SANDBOX ? `codex (${env.CODEX_SANDBOX})` : env.CODEX_SANDBOX_NETWORK_DISABLED ? "codex (network disabled)" : null);
  const why = [];
  if (cpus <= 2) why.push(`${cpus} CPU${cpus > 1 ? "s" : ""}`);
  if (load > cpus * 1.5) why.push(`load ${load.toFixed(1)} on ${cpus} CPU${cpus > 1 ? "s" : ""}`);
  if (freeMB < 1500) why.push(`${freeMB} MB free memory`);
  if (cgroupMB !== null && cgroupMB < 2048) why.push(`cgroup memory limit ${cgroupMB} MB`);
  if (shmMB !== null && shmMB < 128) why.push(`/dev/shm ${shmMB} MB`);
  if (asMB !== null && asMB < 8192) why.push(`address space capped at ${asMB} MB (ulimit -v)`);
  if (agent) why.push(`sandbox: ${agent}`);
  return { cpus, load: +load.toFixed(2), freeMB, cgroupMB, shmMB, asMB, agent, constrained: why.length > 0, why };
}
const machineLine = (p) => `${p.cpus} CPU, load ${p.load}, ${p.freeMB} MB free${p.cgroupMB !== null ? `, cgroup ${p.cgroupMB} MB` : ""}${p.shmMB !== null ? `, /dev/shm ${p.shmMB} MB` : ""}${p.asMB !== null ? `, address space ${p.asMB} MB` : ""}${p.agent ? `, ${p.agent}` : ""}`;
const firstLine = (e) => String(e?.message || e).split("\n")[0].replace(/\s+/g, " ").slice(0, 160);
// failures that say something about the machine, not the page: the browser died, an operation ran out of time, or the
// sandbox refused a process. These earn a retry in the light footprint.
const browserTrouble = (e) => /Target (page, context or browser )?(has been )?closed|browser has been closed|Browser closed|crash|Timeout|timed out|ECONNRESET|EPIPE|ENOMEM|out of memory|Failed to launch|spawn|zygote|sandbox|SIGKILL|SIGTRAP|Protocol error|Navigation failed because page crashed|Target crashed|disconnected/i.test(String(e?.stack || e?.message || e));

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
  await page.goto(url, { waitUntil: "networkidle", timeout: T(60000) }).catch(() => page.waitForTimeout(3000));
  await page.addScriptTag({ content: PAGE_LIB }); await settle(page);
  return { ctx, page, errors };
}

// ── checks ───────────────────────────────────────────────────────────────────
const SKIP_WARN_PCT = 30; // warn when more than this share of text elements could not be measured
const STATE_TOL = 0.03; // two readings of one element within this opacity are the same state (scroll-sequence check)
async function contrast(browser, url, VW = 1440) {
  // Measure each text element in the scroll position where a visitor sees it: scroll a viewport at a time, hide all
  // text, screenshot the viewport, and sample the pixels behind every element that is fully on screen.
  // Run once per width: mobile layouts crop images differently, stack text over photos and swap backgrounds.
  const VH = VW < 800 ? 812 : 900; const mobile = VW < 800;
  const { ctx, page } = await open(browser, url, { viewport: { width: VW, height: VH }, hasTouch: mobile, isMobile: mobile });
  await page.evaluate(() => __g.textEls().forEach((e, i) => e.setAttribute("data-g-id", i)));
  const H = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), 40000);
  const done = new Map(); const seenHidden = new Set(); const states = new Map(); // states: element → [{ op, at:Set<scrollY>, best }]
  const HIDE = "*,*::before,*::after{color:transparent!important;text-shadow:none!important;-webkit-text-stroke:0!important;caret-color:transparent!important;text-decoration-color:transparent!important;border-color:transparent!important;outline-color:transparent!important}"; // borders and outlines are never the background behind text: a badge outline inside a heading must not be sampled as its ground
  // pinned / sticky sequences change while the page "stands still": sample them every 0.15 viewport, the rest every 0.7
  const zones = await page.evaluate(() => [...document.querySelectorAll(".pin-spacer, *")].filter((e) => e.classList.contains("pin-spacer") || getComputedStyle(e).position === "sticky")
    .map((e) => { const z = e.classList.contains("pin-spacer") ? e : e.parentElement; const r = z.getBoundingClientRect(); return [r.top + scrollY, r.top + scrollY + r.height - innerHeight]; }).filter(([a, b]) => b > a));
  const steps = new Set(); for (let y = 0; y <= Math.max(0, H - VH) + 1; y += Math.round(VH * 0.7)) steps.add(y);
  for (const [a, b] of zones.slice(0, 12)) for (let y = Math.max(0, a); y <= b; y += Math.round(VH * 0.15)) steps.add(Math.round(y));
  // fixed checkpoints (v2.5.0): scroll 0, 25/50/75 % and the end of the page, and the same five points inside every
  // pinned or sticky zone, so a sequence is always seen at its start, middle and end whatever its length
  const QS = [0, 0.25, 0.5, 0.75, 1]; for (const q of QS) steps.add(Math.round(Math.max(0, H - VH) * q));
  for (const [a, b] of zones.slice(0, 12)) for (const q of QS) steps.add(Math.round(Math.max(0, a) + (b - Math.max(0, a)) * q));
  for (const y of [...steps].sort((p, q) => p - q)) {
    await page.evaluate((v) => scrollTo(0, v), y);
    // let entrances finish: wait for CSS/WAAPI animations, then only measure elements whose opacity and position are stable
    await page.waitForFunction(() => !document.getAnimations().some((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity), null, { timeout: T(4000) }).catch(() => {});
    await page.waitForTimeout(350);
    const read = () => page.evaluate(() => { const pe = document.createElement("style"); pe.textContent = "*{pointer-events:auto!important}"; document.head.append(pe); try { return [...document.querySelectorAll("[data-g-id]")].filter((e) => !__g.decorative(e) && !__g.srOnly(e)).map((e) => {
      const s = getComputedStyle(e); const r = e.getBoundingClientRect();
      // occluded? the topmost element at the text's centre must be the element itself, a descendant, or an ancestor
      // only layers that actually paint over the text count (an invisible closed backdrop or a faint grain overlay doesn't)
      const paints = (n) => { if (__g.opacity(n) < 0.5) return false; const cs = getComputedStyle(n); if (cs.visibility === "hidden") return false;
        return ["IMG", "VIDEO", "CANVAS", "svg", "IFRAME"].includes(n.tagName) || (__g.rgba(cs.backgroundColor)?.a ?? 0) >= 0.5 || cs.backgroundImage !== "none"; };
      // test every point the sampler below reads (6 columns × 3 rows). Testing fewer points let text whose bottom row
      // sat under a fixed booking bar through, and its "background" was the bar (v2.4.0 fix; found on a real hotel page)
      const pts = []; for (let a = 0; a < 6; a++) for (let b = 0; b < 3; b++) pts.push([(a + 0.5) / 6, (b + 0.5) / 3]);
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
    // every visible, settled, unoccluded element is measured at every scroll position (v2.5.0). Before v2.5.0 an element
    // was re-measured only when it became more visible, so it was judged at its most visible state only, and a scroll
    // sequence that dims its inactive steps (opacity .4 → 2.1:1) passed while the step was unreadable for most of the scroll.
    for (const c of cands) if (c.op <= 0.05) seenHidden.add(c.i);
    const vis = cands.filter((c) => c.op > 0.05); if (!vis.length) continue;
    const atY = await page.evaluate(() => Math.round(scrollY));
    const snap = async () => { const st = await page.addStyleTag({ content: HIDE }); await page.waitForTimeout(60);
      const shot = (await page.screenshot({ animations: "disabled", timeout: T(120000) })).toString("base64"); await st.evaluate((n) => n.remove()); return shot; };
    const sampleShot = (shot, vis) => page.evaluate(async ({ shot, vis }) => {
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
    let res = await sampleShot(await snap(), vis);
    // a real contrast failure is in every frame; a frame caught mid-reflow or before the hiding style applied is not.
    // Re-take the screenshot for anything that failed and keep the better reading.
    const failing = res.filter((r) => r.ratio < ((r.size >= 24 || (r.size >= 18.66 && r.weight >= 700)) ? 3 : 4.5));
    if (failing.length) { await page.waitForTimeout(400); const again = new Map((await sampleShot(await snap(), failing)).map((r) => [r.i, r]));
      res = res.map((r) => (again.get(r.i)?.ratio ?? -1) > r.ratio ? again.get(r.i) : r); }
    // resting or passing through? nudge the scroll by 40px and read the opacities again. A step dimmed by a class
    // (.step:not(.on)) keeps its opacity; a scrubbed crossfade caught halfway changes with the scroll.
    const ids = res.map((r) => r.i);
    await page.evaluate((v) => scrollTo(0, v), atY + 40); await page.waitForTimeout(350);
    const nudged = await page.evaluate((ids) => Object.fromEntries(ids.map((i) => { const e = document.querySelector(`[data-g-id="${i}"]`); return [i, e ? __g.opacity(e) : -1]; })), ids);
    for (const r of res) {
      const resting = Math.abs((nudged[r.i] ?? -1) - r.op) <= 0.01;
      if (!done.has(r.i) || r.op > done.get(r.i).op + 0.01 || (Math.abs(r.op - done.get(r.i).op) <= 0.01 && r.ratio > done.get(r.i).ratio)) done.set(r.i, r);
      // states: one bucket per opacity level the element settles at; each bucket keeps its best reading (a real failure
      // is in every frame) and the scroll positions where it was seen
      const list = states.get(r.i) || []; let b = list.find((x) => Math.abs(x.op - r.op) <= STATE_TOL);
      if (!b) { b = { op: r.op, at: new Set(), rest: 0, best: r }; list.push(b); states.set(r.i, list); }
      b.at.add(atY); if (resting) b.rest++; if (r.ratio > b.best.ratio) b.best = r;
    }
  }
  // total = every text element counted at the end of the scan, plus any measured or seen earlier: a scrubbed sequence can
  // hide its credits (visibility:hidden) by the last frame, and counting only the end left "measured" above "total" (v2.4.0 fix)
  const endIds = await page.evaluate(() => [...document.querySelectorAll("[data-g-id]")].filter((e) => !__g.decorative(e) && !__g.srOnly(e)).map((e) => +e.dataset.gId));
  const total = new Set([...endIds, ...done.keys(), ...seenHidden]).size;
  await ctx.close();
  const measured = [...done.values()];
  const large = (r) => r.size >= 24 || (r.size >= 18.66 && r.weight >= 700);
  const need = (r) => (large(r) ? 3 : 4.5);
  const fails = measured.filter((r) => r.ratio < need(r)).map((r) => ({ width: VW, el: r.label, text: r.text, ratio: r.ratio, need: need(r), fg: r.fgHex, bg: r.bgHex, size: r.size, state: "active", op: +r.op.toFixed(2) }));
  // Scroll-sequence steps (v2.5.0): an element that settles at more than one opacity is a step in a sequence (a pinned
  // chapter, a scrubbed timeline, a list whose current item is lit). Its most visible state is the "active" one, judged
  // above as before. Every other state it rests in (its opacity holds when the scroll is nudged 40px, or it was seen
  // at two or more positions) is an "inactive" state a visitor reads while another step is lit, and it must meet AA
  // too. A state that moves with the scroll and was seen once is a scrubbed crossfade caught halfway: reported, not judged.
  const sequence = [];
  for (const [i, list] of states) {
    if (list.length < 2) continue;
    const top = list.reduce((a, b) => (b.op > a.op ? b : a));
    const st = list.sort((a, b) => b.op - a.op).map((b) => ({ state: b === top ? "active" : b.rest > 0 || b.at.size >= 2 ? "inactive" : "transition", op: +b.op.toFixed(2), ratio: b.best.ratio, need: need(b.best), fg: b.best.fgHex, bg: b.best.bgHex, at: [...b.at].sort((p, q) => p - q).slice(0, 6) }));
    const r0 = top.best; sequence.push({ el: r0.label, text: r0.text, size: r0.size, states: st });
    if (fails.some((f) => f.el === r0.label && f.text === r0.text)) continue; // already failing in its active state: one failure per element
    const worst = st.filter((x) => x.state === "inactive" && x.ratio < x.need).sort((a, b) => a.ratio - b.ratio)[0];
    if (worst) fails.push({ width: VW, el: r0.label, text: r0.text, ratio: worst.ratio, need: worst.need, fg: worst.fg, bg: worst.bg, size: r0.size, state: "inactive", op: worst.op, at: worst.at });
  }
  const skipped = total - measured.length, skippedPct = total ? Math.round((skipped / total) * 100) : 0;
  return { width: VW, measured: measured.length, skipped, total, skippedPct, lowCoverage: skippedPct > SKIP_WARN_PCT, notVisibleAtScan: [...seenHidden].filter((i) => !done.has(i)).length, sequence, fails };
}
async function contrastAll(browser, url) {
  const byWidth = []; for (const w of WIDTHS) byWidth.push(await contrast(browser, url, w));
  const sum = (k) => byWidth.reduce((n, x) => n + x[k], 0);
  return { byWidth, measured: sum("measured"), skipped: sum("skipped"), total: sum("total"), notVisibleAtScan: sum("notVisibleAtScan"),
    skippedPct: sum("total") ? Math.round((sum("skipped") / sum("total")) * 100) : 0, lowCoverage: byWidth.some((x) => x.lowCoverage), fails: byWidth.flatMap((x) => x.fails),
    sequenceSteps: byWidth.reduce((n, x) => n + x.sequence.length, 0), inactiveFails: byWidth.reduce((n, x) => n + x.fails.filter((f) => f.state === "inactive").length, 0) };
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
      const a = (await page.screenshot({ timeout: T(120000) })).toString("base64"); await page.waitForTimeout(900); const b = (await page.screenshot({ timeout: T(120000) })).toString("base64");
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

async function numbers(browser, url) {
  // Wrong value during animation: a number that is visible with one value and later corrected to another.
  // Samples: normal motion at scroll 0 (straight after load), normal motion after jumping to the end (anchor links,
  // fast flicks), and reduced motion at scroll 0 and at the end. Truth: each element scrolled into view and left to
  // settle (read twice, 1.5 s apart; a value that changes between the two reads is live and is skipped, and so is anything that
  // reads as a clock or sits in <time>, role=timer/status/log or aria-live, because a minute can tick between samples).
  const READ = () => {
    const nums = (t) => (t.match(/[-+−]?\d[\d,.\u00a0\u202f]*\d|\d/g) || []).map((x) => x.replace(/[,\u00a0\u202f]/g, "").replace("−", "-"));
    const out = {};
    for (const e of document.body.querySelectorAll("*")) {
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "TITLE"].includes(e.tagName) || __g.srOnly(e) || __g.decorative(e)) continue;
      const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ");
      let vals = nums(own);
      if (e.tagName === "PROGRESS" || e.tagName === "METER") vals = [String(e.value)];
      const vn = e.getAttribute("aria-valuenow"); if (vn !== null && /progressbar|meter|slider/.test(e.getAttribute("role") || "")) vals = [vn];
      if (!vals.length) continue;
      const s = getComputedStyle(e); const r = e.getBoundingClientRect();
      const shown = s.display !== "none" && s.visibility !== "hidden" && __g.opacity(e) > 0.05 && r.width > 0 && r.height > 0;
      // clocks and timers change on their own (a minute can tick between two samples): treat them as live
      const clock = /\b\d{1,2}:\d{2}\b/.test(own) || !!e.closest("time, [role=timer], [aria-live], [role=status], [role=log]");
      out[__g.key(e)] = { v: vals.join(" "), shown, clock, label: __g.label(e), text: (own.trim() || e.textContent.trim()).replace(/\s+/g, " ").slice(0, 40) };
    }
    return out;
  };
  const sample = async (reduced) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "load", timeout: T(60000) }).catch(() => {});
    await page.addScriptTag({ content: PAGE_LIB }).catch(() => {}); await page.waitForTimeout(700);
    const top = await page.evaluate(READ).catch(() => ({}));
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(900);
    const end = await page.evaluate(READ).catch(() => ({}));
    let truth = null, live = null;
    if (!reduced) {
      // settle every number in view, one at a time, in page order (count-ups usually start on entering the screen)
      const keys = Object.keys({ ...top, ...end });
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < Math.min(H, 40000); y += 450) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(120); }
      for (const k of keys.slice(0, 200)) await page.evaluate((k) => { const parts = k.split(">"); let n = document.body; for (const p of parts.slice(1)) { const [t, i] = p.split(":"); n = [...(n?.children || [])].filter((c) => c.tagName.toLowerCase() === t)[+i - 1]; } n?.scrollIntoView?.({ block: "center" }); }, k).then(() => page.waitForTimeout(60));
      await page.waitForTimeout(2600); const a = await page.evaluate(READ).catch(() => ({}));
      await page.waitForTimeout(1500); const b = await page.evaluate(READ).catch(() => ({}));
      truth = a; live = new Set(Object.keys(a).filter((k) => a[k].clock || (b[k] && b[k].v !== a[k].v)));
    }
    await ctx.close(); return { top, end, truth, live };
  };
  const N = await sample(false); const R = await sample(true);
  const fails = []; let checked = 0;
  for (const [k, t] of Object.entries(N.truth || {})) {
    if (N.live.has(k)) continue; checked++;
    for (const [when, snap] of [["at scroll 0", N.top], ["after jumping to the end", N.end], ["under reduced motion", R.top], ["under reduced motion, at the end", R.end]]) {
      const x = snap[k]; if (!x || !x.shown || x.v === t.v) continue;
      fails.push({ el: t.label, shown: x.text, truth: t.text, when }); break;
    }
  }
  return { checked, live: N.live.size, fails };
}

async function structure(browser, url) {
  // entrance pattern per top-level section, and the measurable motion budget (pins, WebGL canvases, JS weight)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: T(60000) }).catch(() => {});
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
  // this run, already logged: same archetype and signature, and the same tier (or no tier logged; `memory.mjs log` without
  // --tier used to make --verify score the page against itself, S1, after the agent logged it)
  if (last && last.archetype === stamp.archetype && last.signature === stamp.signature && (last.tier === undefined || last.tier === null || last.tier === "" || String(last.tier) === String(stamp.tier))) runs = runs.slice(0, -1);
  const prev = runs.slice(-5); if (!prev.length) return { s: 5, trace: logFile && existsSync(logFile) ? "last5:none" : "last5:no-log" };
  const sigs = load("signatures"); const mine = fingerprint({ archetype: stamp.archetype, signature: stamp.signature, tier: stamp.tier, sections: sectionIds }, sigs);
  const fp = (r) => r.fingerprint || fingerprint({ archetype: r.archetype, signature: r.signature, tier: r.tier, sections: r.sections }, sigs);
  const worst = Math.max(0, ...prev.map((r) => similarity(mine, fp(r)).score));
  const reusedA = prev.some((r) => r.archetype === stamp.archetype), reusedS = prev.some((r) => r.signature === stamp.signature);
  const pct = Math.round(worst * 100);
  const sc = worst >= 0.999 ? 1 : reusedA && reusedS ? 2 : reusedA || reusedS || worst >= 0.7 ? 3 : worst >= 0.5 ? 4 : 5;
  return { s: sc, trace: `last5:${reusedA ? "archetype-reused" : "archetype-new"},${reusedS ? "signature-reused" : "signature-new"},fp${pct}` };
}
// ── motion quality (gate/3): progression in pinned zones, smoothness, reduced-motion distinctness → Q axis, count q ──
const PROG_MIN_PCT = 0.5;   // a zone "moves" between two scroll samples when more than this % of its pixels changes
const PROG_SAMPLES = 8;     // scroll positions sampled across each zone
const MAX_ZONES = 6;
export const SMOOTH_P95_MS = { desktop: 20, mobile: 25 }; // p95 rAF interval while scrolling: 1440 unthrottled, 375 at CPU ×4
// zones that hold the screen while the page scrolls: GSAP pin spacers, position: sticky inside a parent ≥ 1.5 screens
// tall, and elements driven by a CSS scroll/view timeline
const ZONES = () => {
  const z = [];
  for (const s of document.querySelectorAll(".pin-spacer")) { const r = s.getBoundingClientRect(); z.push({ kind: "pin", label: __g.label(s.firstElementChild || s), top: Math.round(r.top + scrollY), len: Math.round(r.height - innerHeight) }); }
  for (const e of document.body.querySelectorAll("*")) {
    const cs = getComputedStyle(e); if (cs.display === "none") continue;
    if (cs.position === "sticky" && e.parentElement) { const p = e.parentElement.getBoundingClientRect(); if (p.height >= innerHeight * 1.5) z.push({ kind: "sticky", label: __g.label(e), top: Math.round(p.top + scrollY), len: Math.round(p.height - innerHeight) }); }
    const tl = cs.animationTimeline || ""; if (/scroll\(|view\(|^--/.test(tl)) { const r = e.getBoundingClientRect(); z.push({ kind: "scroll-timeline", label: __g.label(e), top: Math.max(0, Math.round(r.top + scrollY - innerHeight)), len: Math.round(r.height + innerHeight) }); }
  }
  return z.filter((a, i) => a.len > 40 && !z.slice(0, i).some((b) => Math.abs(b.top - a.top) < 4 && Math.abs(b.len - a.len) < 4));
};
// % of pixels that change between consecutive images (downscaled to 360px wide; channel sum difference > 24)
async function pixelDiffs(browser, shots) {
  if (shots.length < 2) return [];
  const ctx = await browser.newContext(); const p = await ctx.newPage();
  const out = await p.evaluate(async (shots) => {
    const load = async (s) => { const i = new Image(); i.src = "data:image/jpeg;base64," + s; await i.decode(); const w = Math.min(360, i.width), h = Math.max(1, Math.round(i.height * w / i.width)); const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.drawImage(i, 0, 0, w, h); return x.getImageData(0, 0, w, h).data; };
    const res = []; let prev = null;
    for (const s of shots) { const d = await load(s); if (prev && prev.length === d.length) { let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - prev[i]) + Math.abs(d[i + 1] - prev[i + 1]) + Math.abs(d[i + 2] - prev[i + 2]) > 24) n++; res.push(+(n / (d.length / 4) * 100).toFixed(2)); } prev = d; }
    return res;
  }, shots);
  await ctx.close(); return out;
}
const pctl = (a, q) => { const s = [...a].sort((x, y) => x - y); return s.length ? +s[Math.min(s.length - 1, Math.floor(q * s.length))].toFixed(1) : null; };
async function frameTimes(page, from, len) {
  await page.evaluate((y) => scrollTo(0, y), Math.max(0, from - 200)); await page.waitForTimeout(400);
  await page.evaluate(() => { window.__ft = []; window.__ftStop = false; let last = performance.now(); const tick = (t) => { window.__ft.push(t - last); last = t; if (!window.__ftStop) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  const steps = 120; for (let i = 0; i < steps; i++) { await page.evaluate((d) => scrollBy(0, d), (len + 400) / steps); await page.waitForTimeout(1000 / 30); }
  await page.waitForTimeout(300); const ft = await page.evaluate(() => { window.__ftStop = true; return window.__ft.slice(2); });
  return { frames: ft.length, p50: pctl(ft, 0.5), p95: pctl(ft, 0.95), max: ft.length ? +Math.max(...ft).toFixed(1) : null };
}
async function motionQuality(browser, url) {
  // 1. progression: sample each zone at PROG_SAMPLES scroll positions; a zone whose median change is under PROG_MIN_PCT
  //    holds the screen without showing anything happen
  const { ctx, page } = await open(browser, url, { viewport: { width: 1440, height: 900 } });
  const zones = (await page.evaluate(ZONES)).slice(0, MAX_ZONES); const texts = await page.evaluate(() => __g.textEls().filter((e) => !__g.decorative(e) && !__g.srOnly(e)).map((e) => e.textContent.replace(/\s+/g, " ").trim()).filter((t) => t.length > 1));
  const prog = [];
  for (const z of zones) {
    const shots = [];
    for (let i = 0; i < PROG_SAMPLES; i++) { await page.evaluate((y) => scrollTo(0, y), z.top + Math.round((z.len * i) / (PROG_SAMPLES - 1))); await page.waitForTimeout(T(800)); shots.push((await page.screenshot({ type: "jpeg", quality: 70, timeout: T(60000) })).toString("base64")); }
    const d = await pixelDiffs(browser, shots); const med = pctl(d, 0.5) ?? 0;
    prog.push({ ...z, diffs: d, medianPct: med, moving: d.filter((x) => x > PROG_MIN_PCT).length, ok: med > PROG_MIN_PCT });
  }
  // 2. smoothness: p95 frame interval while scrolling through the first zone (or the first 3 screens), 1440 unthrottled
  //    and 375 touch at CPU ×4. On a constrained machine (docs/adapters/sandbox.md) it is reported, never judged.
  const span = zones[0] ? { from: zones[0].top, len: zones[0].len } : { from: 0, len: 2700 };
  const smooth = { judged: !PROBE.constrained, why: PROBE.constrained ? "sandbox: " + PROBE.why.join(", ") : null, desktop: null, mobile: null };
  if (zones.length) {
    smooth.desktop = await frameTimes(page, span.from, span.len);
    const m = await open(browser, url, { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
    const cdp = await m.ctx.newCDPSession(m.page); await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const mz = (await m.page.evaluate(ZONES))[0]; smooth.mobile = await frameTimes(m.page, mz ? mz.top : 0, mz ? mz.len : 2400); await m.ctx.close();
    smooth.desktop.ok = smooth.desktop.p95 <= SMOOTH_P95_MS.desktop; smooth.mobile.ok = smooth.mobile.p95 <= SMOOTH_P95_MS.mobile;
  }
  await ctx.close();
  // 3. reduced-motion distinctness: where the page pins, reduced motion must be normal flow (no pin, no sticky film,
  //    no scroll timeline) with every text still in the document; a pinned "same frames" fallback fails
  let rm = null;
  if (zones.length) {
    const r = await open(browser, url, { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const got = await r.page.evaluate(ZONES); const body = await r.page.evaluate(() => document.body.textContent.replace(/\s+/g, " "));
    const canvases = await r.page.evaluate(() => [...document.querySelectorAll("canvas")].filter((c) => { const b = c.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(c).display !== "none" && getComputedStyle(c).visibility !== "hidden"; }).length);
    const missing = texts.filter((t) => !body.includes(t.slice(0, 60)));
    rm = { pinned: got.map((z) => `${z.kind} ${z.label}`), missing: missing.slice(0, 10), missingCount: missing.length, canvases, ok: got.length === 0 && missing.length === 0 };
    await r.ctx.close();
  }
  const fails = prog.filter((z) => !z.ok).length + (rm && !rm.ok ? 1 : 0) + (smooth.judged && zones.length ? (smooth.desktop.ok ? 0 : 1) + (smooth.mobile.ok ? 0 : 1) : 0);
  return { zones: prog, smooth, rm, fails };
}
export function qAxis(q) {
  if (!q) return "Q?[not-measured]";
  const cats = (q.zones.some((z) => !z.ok) ? 1 : 0) + (q.rm && !q.rm.ok ? 1 : 0) + (q.smooth.judged && q.smooth.desktop && !(q.smooth.desktop.ok && q.smooth.mobile.ok) ? 1 : 0);
  // Δ: the least-moving zone's median change between samples, in % of pixels. Raw frame times stay out of the stamp
  // (they vary run to run); the stamp records only whether smoothness was judged and met
  const prog = q.zones.length ? `Δ${Math.min(...q.zones.map((z) => z.medianPct))}%` : "n/a";
  const sm = !q.smooth.desktop ? "n/a" : !q.smooth.judged ? "sandbox" : q.smooth.desktop.ok && q.smooth.mobile.ok ? "ok" : "slow";
  const rm = !q.rm ? "n/a" : q.rm.ok ? "flow" : q.rm.pinned.length ? "pinned" : "text-missing";
  return `Q${Math.max(1, 5 - 2 * cats)}[prog:${prog},smooth:${sm},rm:${rm}]`;
}

// ── accessibility axes (gate/3): focus-visible, target size, 200% zoom, 320px reflow, forced colors, keyboard trap → A, count k ──
const FOCUS_MAX = 40;        // focusable elements checked for a visible focus indicator (in Tab order)
const TARGET_MIN = 24, TARGET_TOUCH = 44; // WCAG 2.2 2.5.8 (AA) minimum; 2.5.5 (AAA) size, a warning on touch
const TABBABLE = 'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
async function a11y(browser, url) {
  const out = { focus: { checked: 0, fails: [] }, target: { checked: 0, fails: [], warns: [] }, zoom: { fails: [] }, reflow: { px: 0 }, forced: { checked: 0, fails: [] }, trap: null };
  // focus-visible: Tab to each element, then compare the pixels around it focused and blurred
  {
    const { ctx, page } = await open(browser, url, { viewport: { width: 1440, height: 900 } });
    const total = await page.evaluate((sel) => [...document.querySelectorAll(sel)].filter((e) => !__g.decorative(e) && getComputedStyle(e).visibility !== "hidden" && e.getClientRects().length).length, TABBABLE);
    const seen = new Set(); const pairs = [];
    for (let i = 0; i < Math.min(total + 2, FOCUS_MAX + 10) && pairs.length < FOCUS_MAX; i++) {
      await page.keyboard.press("Tab"); await page.waitForTimeout(260);
      const info = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const r = e.getBoundingClientRect(); return { key: __g.key(e), label: __g.label(e), text: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 30), r: { x: r.left, y: r.top, w: r.width, h: r.height }, vw: innerWidth, vh: innerHeight }; });
      if (!info || seen.has(info.key)) { if (info) break; continue; } seen.add(info.key);
      const pad = 6; const x = Math.max(0, info.r.x - pad), y = Math.max(0, info.r.y - pad); const w = Math.min(info.vw - x, info.r.w + 2 * pad), h = Math.min(info.vh - y, info.r.h + 2 * pad);
      if (w < 2 || h < 2) continue; const clip = { x, y, width: w, height: h };
      const on = (await page.screenshot({ type: "jpeg", quality: 90, clip })).toString("base64");
      await page.evaluate(() => document.activeElement.blur()); await page.waitForTimeout(260);
      const off = (await page.screenshot({ type: "jpeg", quality: 90, clip })).toString("base64");
      // put focus back so the next Tab continues from here
      await page.evaluate((k) => { const e = [...document.querySelectorAll("*")].find((n) => __g.key(n) === k); e?.focus({ preventScroll: true }); }, info.key);
      pairs.push({ info, shots: [on, off], area: w * h });
    }
    for (const p of pairs) { const [d] = await pixelDiffs(browser, p.shots); out.focus.checked++; if (!(d >= 1.0)) out.focus.fails.push({ el: p.info.label, text: p.info.text, changedPct: d }); }
    out.focus.tabbables = total; await ctx.close();
  }
  // keyboard trap: Tab twice round the page; focus that keeps cycling inside one region while other controls are never reached is a trap
  {
    const { ctx, page } = await open(browser, url, { viewport: { width: 1440, height: 900 } });
    const all = await page.evaluate((sel) => [...document.querySelectorAll(sel)].filter((e) => !__g.decorative(e) && getComputedStyle(e).visibility !== "hidden" && e.getClientRects().length).map((e) => __g.key(e)), TABBABLE);
    const seq = []; const n = Math.min(160, all.length * 2 + 6);
    for (let i = 0; i < n; i++) { await page.keyboard.press("Tab"); seq.push(await page.evaluate(() => (document.activeElement && document.activeElement !== document.body ? __g.key(document.activeElement) : "body"))); }
    const visited = new Set(seq.filter((k) => k !== "body")); const tail = seq.slice(-Math.min(20, Math.floor(n / 2))); const cycle = new Set(tail);
    const unreached = all.filter((k) => !visited.has(k));
    const trapped = all.length > 2 && unreached.length > 0 && cycle.size <= Math.max(2, Math.floor(all.length / 2)) && !cycle.has("body") && [...cycle].every((k) => !k.startsWith("html:1>body:1>a:")) && unreached.length >= all.length - visited.size;
    let region = null; if (trapped) region = await page.evaluate((ks) => { const els = ks.map((k) => [...document.querySelectorAll("*")].find((n) => __g.key(n) === k)).filter(Boolean); let a = els[0]?.parentElement; while (a && !els.every((e) => a.contains(e))) a = a.parentElement; return a ? __g.label(a) : "?"; }, [...cycle]);
    out.trap = { tabbables: all.length, presses: n, visited: visited.size, unreached: unreached.length, trapped, region };
    await ctx.close();
  }
  // target size at 375 on touch: < 24px fails (inline links inside a sentence are exempt, as in WCAG 2.5.8); < 44px warns
  {
    const { ctx, page } = await open(browser, url, { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
    const r = await page.evaluate(({ sel, min, touch }) => {
      const res = { checked: 0, fails: [], warns: [] };
      for (const e of document.querySelectorAll(sel + ', [role="button"], [role="link"], [role="tab"], [role="switch"]')) {
        if (__g.decorative(e) || __g.srOnly(e)) continue; const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) continue;
        const b = e.getBoundingClientRect(); if (b.width === 0 || b.height === 0) continue;
        const inline = e.tagName === "A" && cs.display === "inline" && [...(e.parentElement?.childNodes || [])].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
        if (inline) continue; res.checked++;
        const s = { el: __g.label(e), text: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 30), w: Math.round(b.width), h: Math.round(b.height) };
        if (b.width < min - 0.5 || b.height < min - 0.5) res.fails.push(s); else if (b.width < touch - 0.5 || b.height < touch - 0.5) res.warns.push(s);
      }
      return res;
    }, { sel: TABBABLE, min: TARGET_MIN, touch: TARGET_TOUCH });
    out.target = r; await ctx.close();
  }
  // 200% zoom: 1440×900 at 200% is a 720×450 CSS viewport. Anything readable or usable at 1440 must still be at 720:
  // text not cut off by an overflow: hidden/clip box (its own or an ancestor's), every control on screen after
  // scrolling to it and not covered. Only losses at 720 that don't already exist at 1440 count.
  {
    const lost = (sel) => {
      const f = [];
      const clipper = (e) => { for (let a = e; a && a !== document.body; a = a.parentElement) { const cs = getComputedStyle(a); if (/hidden|clip/.test(cs.overflowY + cs.overflowX) && a.clientHeight > 0) { const r = a.getBoundingClientRect(), b = e.getBoundingClientRect(); if (b.bottom > r.bottom + 2 || b.right > r.right + 2 || (a === e && (e.scrollHeight > e.clientHeight + 2 && cs.webkitLineClamp === "none" && cs.textOverflow !== "ellipsis"))) return a; } } return null; };
      for (const e of __g.textEls()) { if (__g.decorative(e) || __g.srOnly(e)) continue; const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || !e.getClientRects().length) continue; const c = clipper(e); if (c) f.push({ key: __g.key(e), kind: "text clipped", el: __g.label(e), text: e.textContent.trim().slice(0, 30), by: __g.label(c) }); }
      for (const e of document.querySelectorAll(sel)) { if (__g.decorative(e) || __g.srOnly(e)) continue; const cs = getComputedStyle(e); if (cs.visibility === "hidden" || !e.getClientRects().length) continue;
        e.scrollIntoView({ block: "center", inline: "center", behavior: "instant" }); const b = e.getBoundingClientRect(); if (b.width < 1 || b.height < 1) continue;
        const cx = Math.min(innerWidth - 1, Math.max(0, b.left + b.width / 2)), cy = Math.min(innerHeight - 1, Math.max(0, b.top + b.height / 2));
        const top = document.elementFromPoint(cx, cy); const off = b.right < 0 || b.left > innerWidth || b.bottom < 0 || b.top > innerHeight;
        if (off || (top && top !== e && !e.contains(top) && !top.contains(e))) f.push({ key: __g.key(e), kind: off ? "control off screen" : "control covered", el: __g.label(e), text: (e.textContent || "").trim().slice(0, 30), by: top ? __g.label(top) : null }); }
      scrollTo(0, 0); return f;
    };
    const { ctx, page } = await open(browser, url, { viewport: { width: 1440, height: 900 } });
    const at100 = new Set((await page.evaluate(lost, TABBABLE)).map((x) => x.key + x.kind));
    await page.setViewportSize({ width: 720, height: 450 }); await page.waitForTimeout(T(900)); await settle(page);
    out.zoom.fails = (await page.evaluate(lost, TABBABLE)).filter((x) => !at100.has(x.key + x.kind)).map(({ key, ...r }) => r);
    await ctx.close();
  }
  // 320px reflow (WCAG 1.4.10): no horizontal scrolling at a 320 CSS px viewport
  { // a 320px window (1280px at 400%), not mobile emulation: a mobile layout viewport grows to fit wide content and hides the scroll
    const { ctx, page } = await open(browser, url, { viewport: { width: 320, height: 640 } });
    out.reflow.px = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - innerWidth)); await ctx.close(); }
  // forced colors (Windows High Contrast), judged on rendered pixels: computed styles under forced colors still report
  // author values for some properties (-webkit-text-fill-color), so each text box is screenshotted and its ink is
  // measured against the box's dominant colour. Invisible text (a transparent fill that survives) reads as 1:1.
  {
    const { ctx, page } = await open(browser, url, { viewport: { width: 1440, height: 900 }, forcedColors: "active" });
    const items = await page.evaluate(() => __g.textEls().filter((e) => !__g.decorative(e) && !__g.srOnly(e) && e.getClientRects().length && getComputedStyle(e).visibility !== "hidden" && __g.opacity(e) > 0.05 /* a resting, faded-out caption is not on screen to read */).slice(0, 80).map((e) => ({ key: __g.key(e), el: __g.label(e), text: e.textContent.trim().slice(0, 30), adjust: getComputedStyle(e).forcedColorAdjust })));
    const shots = [];
    for (const it of items) {
      const box = await page.evaluate((k) => { const e = [...document.querySelectorAll("*")].find((n) => __g.key(n) === k); if (!e) return null; e.scrollIntoView({ block: "center", behavior: "instant" }); const r = e.getClientRects()[0]; return r && r.width >= 4 && r.height >= 4 && r.top >= 0 && r.bottom <= innerHeight ? { x: Math.max(0, r.left), y: r.top, width: Math.min(innerWidth - Math.max(0, r.left), r.width), height: r.height } : null; }, it.key);
      if (!box || box.width < 4) continue; await page.waitForTimeout(60);
      shots.push({ it, img: (await page.screenshot({ type: "png", clip: box })).toString("base64") });
    }
    await ctx.close();
    const c2 = await browser.newContext(); const p2 = await c2.newPage();
    const ratios = await p2.evaluate(async (imgs) => {
      const lum = ([r, g, b]) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const out = [];
      for (const s of imgs) { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; const x = c.getContext("2d"); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data;
        const hist = new Map(); for (let k = 0; k < d.length; k += 4) { const q = (d[k] >> 3) << 10 | (d[k + 1] >> 3) << 5 | (d[k + 2] >> 3); hist.set(q, (hist.get(q) || 0) + 1); }
        const bgq = [...hist.entries()].sort((a, b) => b[1] - a[1])[0][0]; const bg = [(bgq >> 10 & 31) * 8 + 4, (bgq >> 5 & 31) * 8 + 4, (bgq & 31) * 8 + 4];
        // ink: the pixel farthest in luminance from the background among those clearly different from it (≥ 0.3% of the box)
        const L = lum(bg); const far = []; for (let k = 0; k < d.length; k += 4) { const px = [d[k], d[k + 1], d[k + 2]]; if (Math.abs(px[0] - bg[0]) + Math.abs(px[1] - bg[1]) + Math.abs(px[2] - bg[2]) > 60) far.push(lum(px)); }
        if (far.length < (d.length / 4) * 0.003) { out.push(1); continue; }
        far.sort((a, b) => Math.abs(b - L) - Math.abs(a - L)); const ink = far[Math.floor(far.length * 0.1)];
        out.push(+((Math.max(ink, L) + 0.05) / (Math.min(ink, L) + 0.05)).toFixed(2)); }
      return out;
    }, shots.map((x) => x.img));
    await c2.close();
    out.forced = { checked: shots.length, fails: shots.map((x, n) => ({ ...x.it, ratio: ratios[n] })).filter((x) => x.ratio < 3).map(({ key, ...r }) => r) };
  }
  const cat = { focus: out.focus.fails.length, target: out.target.fails.length, zoom: out.zoom.fails.length, reflow: out.reflow.px > 1 ? 1 : 0, forced: out.forced.fails.length, trap: out.trap.trapped ? 1 : 0 };
  out.fails = Object.values(cat).reduce((a, b) => a + b, 0); out.cat = cat;
  return out;
}
export function aAxis(a) {
  if (!a) return "A?[not-measured]";
  const failing = Object.values(a.cat).filter((v) => v > 0).length;
  return `A${Math.max(1, 5 - failing)}[focus:${a.focus.checked - a.focus.fails.length}/${a.focus.checked},tgt:${a.target.fails.length}f${a.target.warns.length}w,zoom:${a.zoom.fails.length},reflow:${a.reflow.px},fc:${a.forced.fails.length},trap:${a.trap.trapped ? 1 : 0}]`;
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
    const c = await contrastAll(browser, url);
    const o = []; for (const w of WIDTHS) o.push(await overflowAt(browser, url, w));
    const w = await words(browser, url); const m = await motion(browser, url); const n = await names(browser, url); const nu = await numbers(browser, url); const st = await structure(browser, url);
    const mq = await motionQuality(browser, url); const ax = await a11y(browser, url);
    // fingerprint of the served HTML with stamp comments removed: same page → same id, any other page → a different id
    const html = await fetch(url).then((r) => r.text()).catch(() => "");
    const pageHash = createHash("sha256").update(html.replace(/<!--[^>]*?motomation ·[\s\S]*?-->|\/\*[^*]*?motomation ·[\s\S]*?\*\//g, "")).digest("hex").slice(0, 16);
    const overflowFails = o.flatMap((x) => [...(x.pageScroll > 1 ? [{ width: x.width, el: "page", kind: "horizontal scroll", px: x.pageScroll }] : []), ...x.items.map((i) => ({ width: x.width, ...i }))]);
    const counts = { contrast: c.fails.length, overflow: overflowFails.length, words: w.fails.length, motion: m.hiddenUnderReducedMotion.length + (m.pixelsChangingWhenStillPct > 0.5 ? 1 : 0), names: n.fails.length, numbers: nu.fails.length, quality: mq.fails, access: ax.fails };
    const id = createHash("sha256").update(JSON.stringify({ v: GATE_VERSION, counts, sizes: [w.checked, m.compared, n.checked, nu.checked], page: pageHash, c: c.fails.map((x) => x.width + x.el + x.ratio), nu: nu.fails.map((x) => x.el + x.when + x.truth) /* not the shown value: a mid-count frame is timing-dependent */, o: overflowFails.map((x) => x.width + x.el + x.px), w: w.fails.map((x) => x.el + x.problem), m: m.hiddenUnderReducedMotion.map((x) => x.el), n: n.fails.map((x) => x.el) })).digest("hex").slice(0, 10);
    const pass = Object.values(counts).every((v) => v === 0);
    // the critique axes, each derived from a named check (gates/delivery-gate.md, Part 1)
    const local = !/^https?:/.test(target) ? (statSync(resolve(target)).isDirectory() ? resolve(target) : dirname(resolve(target))) : process.cwd();
    const pageStamp = !/^https?:/.test(target) ? readStamp(readFileSync(statSync(resolve(target)).isDirectory() ? join(resolve(target), "index.html") : resolve(target), "utf8"))?.fields : null;
    const meta = { ...(pageStamp || {}), ...(opts.archetype ? { archetype: opts.archetype } : {}), ...(opts.signature ? { signature: opts.signature } : {}), ...(opts.tier !== undefined ? { tier: opts.tier } : {}) };
    // records next to the page, then in the page's own <id>/ folder (examples/templates/hotel.html → examples/templates/hotel/),
    // so a shipped page's DESIGN.md and log.json are found in a fresh clone without flags
    const own = !/^https?:/.test(target) && !statSync(resolve(target)).isDirectory() ? join(local, basename(resolve(target)).replace(/\.html?$/, "")) : null;
    const designFile = opts.design || [join(local, "DESIGN.md"), ...(own ? [join(own, "DESIGN.md")] : []), join(process.cwd(), "DESIGN.md")].find((f) => existsSync(f));
    const logFile = opts.log || [join(local, ".motomation/log.json"), join(local, "log.json"), ...(own ? [join(own, "log.json"), join(own, ".motomation/log.json")] : []), join(projectRoot(local), ".motomation/log.json"), join(projectRoot(), ".motomation/log.json")].find((f) => existsSync(f));
    const record = readRecord(designFile); const mem = await memoryAxis(logFile, meta, st.sectionIds);
    const critique = critiqueOf({ hier: w.hier, words375: w.fails.length, overflow375: overflowFails.filter((x) => x.width === 375).length, motionFails: counts.motion, st, tier: meta.tier, record, mem }); const critique6 = critique; const critiqueFull = `${critique6} ${qAxis(mq)} ${aAxis(ax)}`;
    // coverage: the worst width decides; more than SKIP_WARN_PCT skipped at any width means the page was not measured, not passed
    const worstW = c.byWidth.reduce((a, x) => (x.skippedPct > a.skippedPct ? x : a), c.byWidth[0]);
    const coverage = { ok: !c.lowCoverage, skipped: worstW.skipped, total: worstW.total, pct: worstW.skippedPct, width: worstW.width, low: c.byWidth.filter((x) => x.lowCoverage).map((x) => x.width) };
    return { target, url, version: GATE_VERSION, pass, verified: coverage.ok, coverage, counts, id, stamp: stampOf(counts, id, coverage), critique: critiqueFull, sources: { design: designFile || null, log: logFile || null, meta }, structure: st, contrast: c, overflow: { widths: WIDTHS, fails: overflowFails }, words: w, motion: m, names: n, numbers: nu, quality: mq, access: ax };
  } finally { close(); }
}
export const stampOf = (k, id, cov) => `gate: c${k.contrast} o${k.overflow} w${k.words} rm${k.motion} a${k.names} n${k.numbers ?? 0}${k.quality !== undefined ? ` q${k.quality} k${k.access}` : ""} · ${GATE_VERSION} · ${id}${cov ? ` · skipped ${cov.skipped}/${cov.total}@${cov.width}` : ""}`;
export function readStamp(html) {
  // a page may carry the stamp in an HTML comment and in the stylesheet; every stamp that carries a gate segment must hold up
  const all = [...html.matchAll(/<!--[^>]*?motomation ·[\s\S]*?-->|\/\*[^*]*?motomation ·[\s\S]*?\*\//g)].map((m) => m[0]);
  if (!all.length) return null;
  const parse = (raw) => { const g = raw.match(/gate: c(\d+) o(\d+) w(\d+) rm(\d+) a(\d+)(?: n(\d+))?(?: q(\d+) k(\d+))? · (gate\/\d+) · ([0-9a-f]{10})(?: · skipped (\d+)\/(\d+)@(\d+))?/); return g ? { counts: { contrast: +g[1], overflow: +g[2], words: +g[3], motion: +g[4], names: +g[5], ...(g[6] !== undefined ? { numbers: +g[6] } : {}), ...(g[7] !== undefined ? { quality: +g[7], access: +g[8] } : {}) }, version: g[9], id: g[10], ...(g[11] !== undefined ? { skipped: { skipped: +g[11], total: +g[12], width: +g[13] } } : {}) } : null; };
  const fieldsOf = (raw) => { const f = {}; for (const k of ["archetype", "mutation", "signature", "tier"]) { const m = raw.match(new RegExp(k + ":\\s*([^·*\\n]+?)\\s*(?:·|\\*/|-->)")); if (m) f[k] = m[1].trim(); } return f; };
  const critOf = (raw) => raw.match(/critique:\s*(.+?)\s*(?:·\s*gate:|\*\/|-->)/)?.[1].trim() || null;
  const withGate = all.map((raw) => ({ raw, gate: parse(raw), critique: critOf(raw) })).filter((x) => x.gate);
  const best = withGate[0] || { raw: all[0], gate: null, critique: critOf(all[0]) };
  return { raw: best.raw, gate: best.gate, critique: best.critique, fields: fieldsOf(best.raw), others: withGate.slice(1), unmeasured: all.length - withGate.length };
}

function print(r) {
  const L = (s = "") => console.log(s);
  L(`DELIVERY GATE · ${r.target}`);
  L(`  contrast  ${r.counts.contrast === 0 ? "✓" : "✗"} ${r.counts.contrast} below AA across ${WIDTHS.join("/")}px  (measured against rendered pixels at each width)`);
  for (const x of r.contrast.byWidth) {
    L(`     ${String(x.width).padStart(4)}px  ${x.fails.length === 0 ? "✓" : "✗"} ${x.fails.length} below AA  (${x.measured} measured; ${x.skipped} skipped; ${x.notVisibleAtScan} not visible at scan time)`);
    if (x.lowCoverage) L(`     ⚠ ${x.width}px coverage: ${x.skipped} of ${x.total} text elements (${x.skippedPct}%) were skipped (moving, occluded or never fully on screen) — more than ${SKIP_WARN_PCT}%, so this width is not a full measurement. Check the skipped text by hand or make it measurable.`);
    for (const f of x.fails.slice(0, 8)) L(`        ${f.ratio}:1 < ${f.need}:1  ${f.fg} on ${f.bg}  ${f.size}px  ${f.el}  "${f.text}"${f.state === "inactive" ? `  (inactive scroll step, opacity ${f.op}, at scroll ${f.at.join("/")}px)` : ""}`);
    if (x.sequence.length) {
      L(`            scroll-sequence steps: ${x.sequence.length} element(s) settle at more than one opacity; every inactive state judged`);
      for (const q of x.sequence.slice(0, 10)) L(`              ${q.el}  "${q.text.slice(0, 32)}"  ` + q.states.map((t) => `${t.state} op ${t.op}: ${t.ratio}:1${t.state === "transition" ? "" : t.ratio < t.need ? " ✗" : " ✓"}`).join(" · "));
    }
  }
  L(`  overflow  ${r.counts.overflow === 0 ? "✓" : "✗"} ${r.counts.overflow} at ${WIDTHS.join("/")}px`);
  for (const f of r.overflow.fails.slice(0, 12)) L(`     ${f.width}px  ${f.kind} by ${f.px}px  ${f.el}${f.text ? `  "${f.text}"` : ""}`);
  L(`  words     ${r.counts.words === 0 ? "✓" : "✗"} ${r.counts.words} display-text problems at 375px  (${r.words.checked} display elements checked)`);
  for (const f of r.words.fails.slice(0, 12)) L(`     ${f.el}  ${f.problem}  "${f.text}"`);
  L(`  motion    ${r.counts.motion === 0 ? "✓" : "✗"} ${r.motion.hiddenUnderReducedMotion.length} text elements hidden only under reduced motion; pixels changing on a still page: ${r.motion.pixelsChangingWhenStillPct}%  (${r.motion.compared} compared)`);
  for (const f of r.motion.hiddenUnderReducedMotion.slice(0, 12)) L(`     hidden  ${f.el}  "${f.text}"`);
  L(`  names     ${r.counts.names === 0 ? "✓" : "✗"} ${r.counts.names} missing alt / accessible names  (${r.names.checked} interactive elements checked)`);
  for (const f of r.names.fails.slice(0, 12)) L(`     ${f.problem}  ${f.el}  ${f.html || f.src || ""}`);
  L(`  numbers   ${r.counts.numbers === 0 ? "✓" : "✗"} ${r.counts.numbers} values shown wrong before they settle  (${r.numbers.checked} numbers checked at scroll 0, scroll end and reduced motion; ${r.numbers.live} live values skipped)`);
  for (const f of r.numbers.fails.slice(0, 12)) L(`     ${f.el}  shows "${f.shown}" ${f.when}, settles on "${f.truth}"`);
  const q = r.quality, a = r.access;
  L(`  progress  ${q.zones.every((z) => z.ok) ? "✓" : "✗"} ${q.zones.filter((z) => !z.ok).length} of ${q.zones.length} pinned/scrubbed zone(s) static (median change between ${PROG_SAMPLES} scroll samples ≤ ${PROG_MIN_PCT}% of pixels)`);
  for (const z of q.zones) L(`     ${z.ok ? "✓" : "✗"} ${z.kind} ${z.label}  ${z.len}px  Δ median ${z.medianPct}% · ${z.moving}/${z.diffs.length} transitions change  [${z.diffs.join(" ")}]`);
  L(`  smooth    ${!q.smooth.desktop ? "– no pinned zone, not measured" : !q.smooth.judged ? `– not verified — sandbox (${q.smooth.why}); measured p95 ${q.smooth.desktop.p95}ms @1440, ${q.smooth.mobile.p95}ms @375 CPU×4 (budgets ${SMOOTH_P95_MS.desktop}/${SMOOTH_P95_MS.mobile}ms) — see docs/adapters/sandbox.md` : `${q.smooth.desktop.ok && q.smooth.mobile.ok ? "✓" : "✗"} p95 ${q.smooth.desktop.p95}ms @1440 (≤ ${SMOOTH_P95_MS.desktop}) · ${q.smooth.mobile.p95}ms @375 CPU×4 (≤ ${SMOOTH_P95_MS.mobile})`}`);
  L(`  rm-flow   ${!q.rm ? "– no pinned zone" : q.rm.ok ? "✓ reduced motion is normal flow, all text present" : `✗ under reduced motion: ${q.rm.pinned.length} zone(s) still pinned${q.rm.pinned.length ? ` (${q.rm.pinned.slice(0, 3).join("; ")})` : ""}, ${q.rm.missingCount} text(s) missing${q.rm.missing.length ? ` ("${q.rm.missing.slice(0, 2).join('", "').slice(0, 80)}")` : ""}`}${q.rm ? ` · ${q.rm.canvases} visible canvas(es)` : ""}`);
  L(`  focus     ${a.focus.fails.length === 0 ? "✓" : "✗"} ${a.focus.fails.length} of ${a.focus.checked} focused elements show no visible focus indicator  (${a.focus.tabbables} tabbable)`);
  for (const f of a.focus.fails.slice(0, 8)) L(`     no ring  ${f.el}  "${f.text}"  (${f.changedPct}% of pixels change on focus)`);
  L(`  targets   ${a.target.fails.length === 0 ? "✓" : "✗"} ${a.target.fails.length} under ${TARGET_MIN}px, ${a.target.warns.length} under ${TARGET_TOUCH}px (warning) at 375 touch  (${a.target.checked} checked; inline links exempt)`);
  for (const f of [...a.target.fails, ...a.target.warns.slice(0, 4)].slice(0, 10)) L(`     ${f.w}×${f.h}  ${f.el}  "${f.text}"`);
  L(`  zoom200   ${a.zoom.fails.length === 0 ? "✓" : "✗"} ${a.zoom.fails.length} lost at 200% (1440×900 → 720×450): text clipped or controls unreachable that were fine at 100%`);
  for (const f of a.zoom.fails.slice(0, 8)) L(`     ${f.kind}  ${f.el}  "${f.text}"${f.by ? `  by ${f.by}` : ""}`);
  L(`  reflow    ${a.reflow.px > 1 ? "✗" : "✓"} ${a.reflow.px}px horizontal scroll at 320px`);
  L(`  forced    ${a.forced.fails.length === 0 ? "✓" : "✗"} ${a.forced.fails.length} of ${a.forced.checked} texts illegible in forced colors (rendered ink under 3:1 against its box, or no ink)`);
  for (const f of a.forced.fails.slice(0, 8)) L(`     ${f.ratio}:1  ${f.el}  "${f.text}"  forced-color-adjust: ${f.adjust}`);
  L(`  kbd-trap  ${a.trap.trapped ? `✗ focus cycles inside ${a.trap.region}; ${a.trap.unreached} of ${a.trap.tabbables} tabbable never reached in ${a.trap.presses} Tabs` : `✓ ${a.trap.visited} of ${a.trap.tabbables} tabbable reached in ${a.trap.presses} Tabs, no cycle`}`);
  const st = r.structure;
  L(`  hierarchy  h1×${r.words.hier.h1}, ${r.words.hier.skips} skipped heading levels, ${r.words.hier.focalTies} element(s) tied for largest on the first 375px screen`);
  L(`  structure  ${st.sections} sections, entrances: ${st.patterns.join(" | ")} → ${st.repeats} repeat(s); pins ${st.pins}, WebGL canvases ${st.webgl}, JS ${st.jsKB}KB gzipped${st.jsUnknown ? ` (+${st.jsUnknown} script(s) not fetched)` : ""}`);
  L(`  records    DESIGN.md: ${r.sources.design || "none"} · memory log: ${r.sources.log || "none"} · stamp fields: ${JSON.stringify(r.sources.meta)}`);
  L(`  critique → ${r.critique}${/\?/.test(r.critique) ? "   (axes marked ? have no record to derive from)" : ""}`);
  L(`  coverage   ${r.coverage.ok ? "✓" : "✗"} worst width ${r.coverage.width}px: ${r.coverage.skipped} of ${r.coverage.total} text elements skipped (${r.coverage.pct}%; limit ${SKIP_WARN_PCT}% at every width)${r.coverage.low.length ? ` · over the limit at ${r.coverage.low.join("/")}px` : ""}`);
  L(`  ${!r.coverage.ok ? "NOT VERIFIED (coverage)" : r.pass ? "PASS" : "FAIL"}  stamp → critique: ${r.critique} · ${r.stamp}`);
  L("");
}


// ── optional motion report (--report): scroll-frame strips, not part of the gate's numbers ──
async function frameStrip(browser, url, viewport, reducedMotion, steps = 8) {
  const ctx = await browser.newContext({ viewport, reducedMotion }); const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "load", timeout: T(30000) }).catch(() => {}); await page.waitForTimeout(800);
    const max = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
    const frames = []; let at = 0;
    for (let i = 0; i < steps; i++) {
      const target = Math.round((max * i) / (steps - 1));
      // wheel in small steps so scroll-linked code sees real scroll events, then settle
      while (at < target) { const d = Math.min(240, target - at); await page.mouse.wheel(0, d); at += d; await page.waitForTimeout(16); }
      await page.waitForTimeout(450);
      const y = await page.evaluate(() => Math.round(scrollY));
      const img = await page.screenshot({ type: "jpeg", quality: 55, timeout: T(120000) });
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

// ── run: budget, retry in the light footprint, one verdict line on every exit path ──
// a scan that runs past its budget is not a measurement: say so and exit 3, like a missing browser
const TIMEOUT_MS = flags["timeout-ms"] !== undefined ? +flags["timeout-ms"] : flags.timeout !== undefined ? +flags.timeout * 1000 : 600000;
const PROBE = sandboxProbe();
const T0 = Date.now();
let verdictPrinted = false;
const verdict = (line, code) => { if (!verdictPrinted) { verdictPrinted = true; console.log(line); } process.exit(code); };
const notVerified = (why, extra) => {
  if (flags.out) { try { writeFileSync(String(flags.out), JSON.stringify({ verified: false, reason: why, ...extra, machine: PROBE }, null, 2)); } catch {} }
  if (flags.json) console.log(JSON.stringify({ verified: false, reason: why, ...extra, machine: PROBE }, null, 2));
  verdict(`not verified — ${why}`, 3);
};
for (const sig of ["SIGTERM", "SIGINT", "SIGHUP"]) process.on(sig, () => notVerified(`interrupted (${sig} after ${Math.round((Date.now() - T0) / 1000)}s; machine: ${machineLine(PROBE)}). The agent's tool timeout is probably shorter than the scan: run the gate with a longer tool timeout, or --timeout-ms below it`));
process.on("unhandledRejection", (e) => notVerified(`the browser failed during the scan (${firstLine(e)}); machine: ${machineLine(PROBE)}`));

function budget(p, ms, target) {
  if (!(ms > 0)) return p;
  let t; const timer = new Promise((_, no) => { t = setTimeout(() => no(Object.assign(new Error(`timed out after ${Math.round(ms / 1000)}s scanning ${target}`), { gateTimeout: true })), ms); });
  return Promise.race([p, timer]).finally(() => clearTimeout(t));
}
async function launch(pw, light) {
  const args = light ? LIGHT_ARGS : PROBE.shmMB !== null && PROBE.shmMB < 128 ? ["--disable-dev-shm-usage"] : [];
  return pw.chromium.launch({ args, timeout: light ? 180000 : 60000 });
}
// run(browser) once in the standard footprint and, if the browser (not the page) fails, once more in the light one.
// Resolves { value, browser, footprint, attempts } with the browser still open; throws { gateVerdict } when both fail.
async function withRetry(pw, target, run) {
  const plan = flags.light ? ["light"] : ["standard", "light"]; const attempts = [];
  for (const fp of plan) {
    const light = fp === "light"; OPS_SCALE = light ? 3 : 1;
    const label = light ? "light footprint (one renderer, no GPU, no /dev/shm, timeouts ×3)" : "standard footprint";
    let browser; try { browser = await launch(pw, light); } catch (e) { attempts.push(`${label}: browser did not start (${firstLine(e)})`); continue; }
    let gone = false; browser.on("disconnected", () => { gone = true; });
    try {
      const value = await budget(run(browser), TIMEOUT_MS, target);
      return { value, browser, footprint: fp, attempts };
    } catch (e) {
      await browser.close().catch(() => {});
      const why = e.gateTimeout ? e.message : gone ? `the browser process exited mid-scan (${firstLine(e)})` : firstLine(e);
      attempts.push(`${label}: ${why}`);
      // a long page on a healthy machine is the page, not the sandbox: a bigger browser won't help, report the timeout
      if (e.gateTimeout && !PROBE.constrained && !light) throw Object.assign(new Error(why), { gateVerdict: `${why} (raise --timeout, or gate a shorter page)` });
      if (!e.gateTimeout && !browserTrouble(e)) throw e; // a usage error (missing file, bad URL): not a sandbox problem
      if (!light) console.error(`gate: ${label} failed (${why}); retrying in the light footprint · machine: ${machineLine(PROBE)}`);
    }
  }
  const head = PROBE.constrained ? `sandbox too constrained: ${PROBE.why.join(", ")}` : "the browser failed in both footprints";
  throw Object.assign(new Error(head), { gateVerdict: `${head} (${attempts.map((a, i) => `attempt ${i + 1}, ${a}`).join("; ")}; machine: ${machineLine(PROBE)})` });
}

async function main() {
  if (typeof flags.report === "string" && !targets.length) { targets.push(flags.report); flags.report = true; } // `--report file.html` alone: the file is the target
  if (flags.help || (!targets.length && !flags.verify)) { console.log("Usage: node scripts/gate.mjs <url|file|dir> … [--json] [--out file] [--design DESIGN.md] [--log .motomation/log.json] [--tier n --archetype x --signature y] [--report [out.html]] [--timeout s | --timeout-ms ms] [--light]   |   --report <file.html>   |   --verify <file.html> [--url u]"); process.exit(targets.length ? 0 : 1); }
  const pw = await loadPlaywright();
  if (!pw) notVerified("no browser (install Playwright: npm i -D playwright && npx playwright install chromium)");
  if (PROBE.constrained) console.error(`gate: constrained machine (${PROBE.why.join(", ")}); a failed scan is retried once in the light footprint`);
  if (PROBE.constrained && TIMEOUT_MS < 240000) console.error(`gate: warning: a ${Math.round(TIMEOUT_MS / 1000)}s budget is shorter than a scan usually takes on a machine like this (2–5 min per page at 4 widths); a timeout here says nothing about the page. Prefer the default (600s) and a tool timeout above it.`);
  const opts = { design: flags.design ? resolve(String(flags.design)) : undefined, log: flags.log ? resolve(String(flags.log)) : undefined, tier: flags.tier !== undefined ? String(flags.tier) : undefined, archetype: flags.archetype, signature: flags.signature };
  const note = (x) => { if (x.attempts.length) console.error(`gate: measured in the ${x.footprint} footprint after: ${x.attempts.join("; ")}`); };
  try {
    if (flags.verify) {
      const file = String(flags.verify); const st = readStamp(readFileSync(file, "utf8"));
      if (!st) verdict(`STAMP REJECTED · ${file}: no motomation stamp comment found`, 2);
      if (!st.gate) verdict(`STAMP REJECTED · ${file}: the stamp has no measured gate values (a hand-written or copied stamp). Run node scripts/gate.mjs and paste its stamp.\n  found: ${st.raw.slice(0, 160)}`, 2);
      if (!st.critique) verdict(`STAMP REJECTED · ${file}: no critique segment. Paste the full "critique: … · gate: …" line gate.mjs printed.`, 2);
      if (st.gate.version !== GATE_VERSION) verdict(`STAMP REJECTED · ${file}: stamp is ${st.gate.version}; this gate is ${GATE_VERSION} (adds the Q motion and A accessibility axes, counts q and k). Re-gate the page and paste the new line.`, 2);
      if (!/^C\d\[[^\]]+\] H\d\[[^\]]+\] S\d\[[^\]]+\] R\d\[[^\]]+\] M\d\[[^\]]+\] V\d\[[^\]]+\] Q\d\[[^\]]+\] A\d\[[^\]]+\]$/.test(st.critique)) verdict(`STAMP REJECTED · ${file}: critique "${st.critique}" is not traced. Every axis needs its number and the check it came from, e.g. H4[375:1]. Unmeasured scores are rejected.`, 2);
      const x = await withRetry(pw, file, (b) => scan(flags.url ? String(flags.url) : file, b, opts)); note(x); const r = x.value; await x.browser.close().catch(() => {}); print(r);
      console.log(`  stamp skips: ${st.gate.skipped ? `${st.gate.skipped.skipped}/${st.gate.skipped.total}@${st.gate.skipped.width}` : "not recorded (stamp predates the coverage field)"} · fresh scan: ${r.coverage.skipped}/${r.coverage.total}@${r.coverage.width} (${r.coverage.pct}%)`);
      if (!r.coverage.ok) notVerified(`coverage: ${r.coverage.skipped} of ${r.coverage.total} text elements (${r.coverage.pct}%) skipped at ${r.coverage.width}px; more than ${SKIP_WARN_PCT}% at ${r.coverage.low.join("/")}px, so the stamp cannot be checked`);
      // the progression Δ is a pixel measurement that varies slightly between scans; it must agree on pass/fail
      // (the Q score), not to the decimal
      const norm = (c) => c.replace(/prog:Δ[\d.]+%/, "prog:Δ");
      if (norm(st.critique) !== norm(r.critique)) verdict(`STAMP REJECTED · critique says "${st.critique}" but the checks give "${r.critique}"`, 2);
      for (const g of [st.gate, ...st.others.map((o) => o.gate)]) {
        const same = JSON.stringify(g.counts) === JSON.stringify(r.counts) && g.id === r.id && g.version === r.version;
        if (!same) verdict(`STAMP REJECTED · stamp says "${stampOf(g.counts, g.id)}" but a fresh scan measures "${r.stamp}"`, 2);
      }
      verdict(`STAMP VERIFIED · critique and gate numbers match a fresh scan${r.pass ? " · gate PASS" : " · but the gate FAILS (the stamp honestly records failures)"}`, r.pass ? 0 : 1);
    }
    const all = [];
    for (const t of targets) {
      // the motion report (--report) runs inside the same attempt, so a retry re-takes it in the light footprint too
      const x = await withRetry(pw, t, async (b) => {
        const r = await scan(t, b, opts);
        if (flags.report) {
          const out = typeof flags.report === "string" ? resolve(flags.report) : join(/^https?:/.test(t) ? process.cwd() : (statSync(resolve(t)).isDirectory() ? resolve(t) : dirname(resolve(t))), `${/^https?:/.test(t) ? "page" : basename(resolve(t)).replace(/\.html?$/, "")}.motion-report.html`);
          const rep = await motionReport(t, b, r, out); console.error(`motion report → ${rep.outFile} (${rep.frames} frames, ${(rep.bytes / 1024).toFixed(0)} KB)`);
        }
        return r;
      });
      note(x); await x.browser.close().catch(() => {});
      x.value.footprint = x.footprint; if (x.attempts.length) x.value.retried = x.attempts;
      all.push(x.value); if (!flags.json) print(x.value);
    }
    const thin = all.filter((r) => !r.coverage.ok);
    if (thin.length) notVerified(`coverage: ${thin.map((r) => `${r.target}: ${r.coverage.skipped} of ${r.coverage.total} text elements (${r.coverage.pct}%) skipped at ${r.coverage.width}px`).join("; ")} — more than ${SKIP_WARN_PCT}% at any width is not a measurement`, { result: all.length === 1 ? all[0] : all });
    if (flags.json) console.log(JSON.stringify(all.length === 1 ? all[0] : all, null, 2));
    if (flags.out) writeFileSync(String(flags.out), JSON.stringify(all.length === 1 ? all[0] : all, null, 2));
    verdictPrinted = true; process.exit(all.every((r) => r.pass) ? 0 : 1);
  } catch (e) {
    if (e?.gateVerdict) notVerified(e.gateVerdict);
    throw e;
  }
}
// any other crash is not a verdict on the page: exit 3, not verified, with the reason
main().catch((e) => { console.error(e); notVerified(`the browser failed during the scan (${firstLine(e)}); machine: ${machineLine(PROBE)}; run again`); });
