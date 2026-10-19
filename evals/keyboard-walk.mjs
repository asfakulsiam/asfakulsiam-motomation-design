#!/usr/bin/env node
// keyboard-walk.mjs — keyboard-only walk of a static build (evaluator tool, v3.0.2; needs Playwright).
//
//   node evals/keyboard-walk.mjs <site folder> [--routes /,/shop,/contact] [--journey "Shop teas>Sylhet Black>Add to cart>Cart>Checkout"] [--expect /checkout] [--json]
//   (several journeys: separate with |, in --journey and --expect alike)
//
// Only the keyboard: Tab, Shift+Tab, Enter and Space (no typing). Never a mouse event, never element.click().
// Per route: Tab through the page (up to 120 presses) and record every stop: whether focus is visible (outline,
// box-shadow, or a changed border/background against the unfocused element), focus traps (Tab stops moving), a skip
// link as the first stop, and focusable elements hidden from view. A journey is a list of accessible names: each step
// Tabs to the first element whose name matches, presses Enter (Space for checkboxes, radios and buttons that ignore
// Enter), and waits for the page to settle. It records whether every step was reached by keyboard alone (`reached`).
// It does not type into fields. A journey is `completed` only when --expect gives its end route and the walk ended
// there; without --expect it is `not-verified`, never a pass. Names come from aria-label, aria-labelledby, <label>,
// then text.
// This is automated keyboard input, not a person at a keyboard, and says nothing about screen readers.
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, resolve } from "node:path";
let chromium; try { ({ chromium } = await import("playwright")); } catch { console.error("keyboard-walk: not verified — Playwright is not installed"); process.exit(3); }
const argv = process.argv.slice(2); const flags = {}; const pos = [];
for (let i = 0; i < argv.length; i++) { const t = argv[i]; if (t.startsWith("--")) { const k = t.slice(2); flags[k] = k === "json" ? true : argv[++i]; } else pos.push(t); }
const ROOT = resolve(pos[0] || ".");
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".avif": "image/avif" };
const srv = createServer((q, s) => { let u = decodeURIComponent(q.url.split("?")[0].split("#")[0]); let f = join(ROOT, u); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!existsSync(f) && existsSync(f + ".html")) f += ".html"; let code = 200; if (!existsSync(f)) { code = 404; f = join(ROOT, "404.html"); } s.writeHead(code, { "content-type": TYPES[extname(f)] || "application/octet-stream" }); s.end(existsSync(f) ? readFileSync(f) : ""); });
await new Promise((r) => srv.listen(0, "127.0.0.1", r)); const ORIGIN = `http://127.0.0.1:${srv.address().port}`;
const routes = String(flags.routes || "/").split(",").map((r) => r.trim()).filter(Boolean);
const STOP = `(() => { const e = document.activeElement; if (!e || e === document.body || e === document.documentElement) return null;
  const lb = (e.getAttribute("aria-labelledby") || "").split(/\\s+/).map((id) => document.getElementById(id)?.innerText || "").join(" ").trim();
  const lab = e.labels && e.labels.length ? [...e.labels].map((l) => l.innerText).join(" ") : "";
  const name = (e.getAttribute("aria-label") || lb || lab || (e.tagName === "SELECT" ? "" : e.innerText) || e.value || e.getAttribute("title") || e.getAttribute("alt") || e.getAttribute("placeholder") || e.name || "").replace(/\\s+/g, " ").trim().slice(0, 60);
  const r = e.getBoundingClientRect(); const s = getComputedStyle(e); const vis = r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.opacity !== "0";
  const ring = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== "none");
  return { tag: e.tagName.toLowerCase(), type: e.type || null, role: e.getAttribute("role"), name, href: e.getAttribute("href"), vis, ring, key: e.tagName + "|" + name + "|" + Math.round(r.x) + "," + Math.round(r.y), style: [s.outlineStyle, s.outlineWidth, s.boxShadow, s.borderColor, s.backgroundColor, s.textDecorationLine, s.color].join(";") }; })()`;
// focus visible: a ring, or any visual property that differs from the same element unfocused
const UNFOCUSED = `(() => { const e = document.activeElement; if (!e) return null; const s = getComputedStyle(e); const keep = [s.outlineStyle, s.outlineWidth, s.boxShadow, s.borderColor, s.backgroundColor, s.textDecorationLine, s.color].join(";"); return keep; })()`;
const browser = await chromium.launch(); const out = { site: ROOT, routes: [], journeys: [] };
for (const r of routes) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" }); const page = await ctx.newPage();
  await page.goto(ORIGIN + r, { waitUntil: "load" }); await page.waitForTimeout(300);
  const stops = []; let same = 0, last = null, trap = null;
  for (let i = 0; i < 120; i++) { await page.keyboard.press("Tab"); await page.waitForTimeout(40); const st = await page.evaluate(STOP).catch(() => null); if (!st) continue;
    if (new URL(page.url()).pathname !== new URL(ORIGIN + r).pathname) break;
    // a date or time input takes one Tab per segment (month, day, year) in Chromium: that is not a trap
    if (st.key === last) { if (++same >= (/^(date|time|datetime-local|month|week)$/.test(st.type || "") ? 6 : 3)) { trap = st; break; } continue; } else same = 0; last = st.key;
    if (stops.length && stops[0].key === st.key) break; // wrapped around: every stop seen
    // compare against the element blurred
    const before = st.style; const after = await page.evaluate(`(() => { const e = document.activeElement; e.blur(); const s = getComputedStyle(e); const v = [s.outlineStyle, s.outlineWidth, s.boxShadow, s.borderColor, s.backgroundColor, s.textDecorationLine, s.color].join(";"); e.focus({ focusVisible: true }); return v; })()`).catch(() => before);
    stops.push({ ...st, visible: st.ring || before !== after }); }
  const noRing = stops.filter((s) => !s.visible), hidden = stops.filter((s) => !s.vis);
  out.routes.push({ route: r, stops: stops.length, firstStop: stops[0] ? `${stops[0].tag} "${stops[0].name}"` : null, skipLink: !!stops[0] && /skip/i.test(stops[0].name), trap: trap ? `${trap.tag} "${trap.name}"` : null,
    focusNotVisible: noRing.map((s) => `${s.tag} "${s.name}"`), hiddenFocusable: hidden.map((s) => `${s.tag} "${s.name}"`) });
  await ctx.close();
}
for (const j of (flags.journey ? String(flags.journey).split("|") : [])) {
  const steps = j.split(">").map((s) => s.trim()); const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" }); const page = await ctx.newPage();
  await page.goto(ORIGIN + (flags.start || "/"), { waitUntil: "load" }); const log = []; let ok = true;
  for (const step of steps) { const rx = new RegExp(step, "i"); let hit = null;
    for (let i = 0; i < 150; i++) { await page.keyboard.press("Tab"); const st = await page.evaluate(STOP).catch(() => null); if (st && st.vis && rx.test(st.name)) { hit = st; break; } }
    if (!hit) { log.push(`✗ "${step}": not reached by Tab on ${new URL(page.url()).pathname}`); ok = false; break; }
    const u0 = page.url(); const key = hit.type === "checkbox" || hit.type === "radio" ? "Space" : "Enter"; await page.keyboard.press(key); await page.waitForTimeout(600); await page.waitForLoadState("load").catch(() => {});
    log.push(`✓ "${step}" → ${hit.tag} "${hit.name}" (${key})${page.url() !== u0 ? ` → ${new URL(page.url()).pathname}` : ""}`); }
  // v3.0.2 (found by the independent judge): "ok" meant every step was reached, and read as a completed journey even
  // when a required field (the walk does not type) kept the form on its page. "reached" is that; "outcome" is
  // completed only when --expect names the route the journey must end on and it did, else not-verified.
  const endedOn = new URL(page.url()).pathname; const expect = flags.expect ? String(flags.expect).split("|")[out.journeys.length] : null;
  const outcome = !ok ? "failed" : expect ? (endedOn === expect ? "completed" : "failed") : "not-verified";
  if (ok && expect && endedOn !== expect) log.push(`✗ ended on ${endedOn}, expected ${expect} (the walk does not type into fields; a required field stops a form here)`);
  out.journeys.push({ journey: j, reached: ok, outcome, expected: expect || null, steps: log, endedOn }); await ctx.close();
}
await browser.close(); srv.close();
if (flags.json) console.log(JSON.stringify(out, null, 2));
else { console.log(`keyboard walk · ${ROOT}`); for (const r of out.routes) console.log(`  ${r.route}: ${r.stops} stop(s); first ${r.firstStop}${r.skipLink ? " (skip link)" : ""}; trap ${r.trap || "none"}; focus not visible on ${r.focusNotVisible.length}${r.focusNotVisible.length ? ": " + r.focusNotVisible.slice(0, 5).join(", ") : ""}; hidden but focusable ${r.hiddenFocusable.length}`);
  for (const j of out.journeys) { console.log(`  journey ${j.outcome === "completed" ? "✓ completed" : j.outcome === "failed" ? "✗ failed" : "? NOT VERIFIED (steps reached; pass --expect <route> to check the end)"} · ${j.journey}`); for (const s of j.steps) console.log(`    ${s}`); } }
