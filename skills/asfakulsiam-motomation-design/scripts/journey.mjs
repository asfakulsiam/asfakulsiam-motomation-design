// Axis J (v2.11): the whole site as a journey, measured in a real browser. Run by scripts/gate.mjs on every target.
// The rest of the gate checks the page it was given; these six checks walk the site from that page:
//
//   nav      multi-route navigation: every route in the sitemap (sitemap.xml at the site root; else every route found by
//            following links) is reached from the home page in ≤ 3 clicks, and no internal link is broken
//   mobile   mobile interactions at 375×812 with touch: every interactive element responds to a tap (the DOM changes,
//            focus moves, the page scrolls, a navigation or a popup starts, a validation event fires); every horizontal
//            scroller responds to a swipe; every element that declares a long press (a contextmenu listener,
//            data-long-press, data-hold) responds to one
//   forms    real form states: every form renders its default state (visible, every field labelled), a designed
//            validation error (an error message or a changed field style; the browser's own bubble alone does not count),
//            a submit loading state, a success state and a server error state (the request is held, then answered
//            200, or answered 500)
//   loading  loading states: every async surface (an element the page fills after a fetch or XHR) shows a skeleton while
//            the request is pending (aria-busy, role=progressbar, or a skeleton / shimmer / placeholder / loading
//            marker); requests are held 2.5 s to see it
//   errors   error states: an unknown route answers with a designed not-found view (status 404, or a soft 404 that says
//            so), with not-found wording, a way home, and the site's own styles
//   session  session survival: the page works (renders text, throws no uncaught error) after a full reload, the back
//            button, the forward button, and with two tabs open on the same site
//
// Each check returns { ok: true | false | null (n/a: nothing of that kind on the site), have, need, fails[], notes[] }.
// A missing state is a failure; nothing is inferred from source text where the browser can show it.
const firstLine = (e) => String(e?.message || e).split("\n")[0].replace(/\s+/g, " ").slice(0, 160);
const norm = (p) => { let x = decodeURI(p).replace(/\/index\.html?$/i, "/").replace(/\.html?$/i, ""); x = x.replace(/\/+$/, ""); return x || "/"; };
const stripHash = (u) => String(u).split("#")[0];
export const JOURNEY_AXES = ["nav", "mobile", "forms", "loading", "errors", "session"];
export const MAX_CLICKS = 3;

async function ctxPage(browser, opts = {}) {
  const ctx = await browser.newContext({ bypassCSP: true, deviceScaleFactor: 1, viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage(); const errors = []; page.on("pageerror", (e) => errors.push(firstLine(e)));
  page.on("dialog", (d) => d.dismiss().catch(() => {}));
  return { ctx, page, errors };
}
// Chromium throws (net::ERR_HTTP_RESPONSE_CODE_FAILURE) on an error status with an empty body; the status still matters
export const statusOf = async (url) => { try { const r = await fetch(url, { redirect: "follow" }); return r.status; } catch { return 0; } };
const go = async (page, url, T) => { const res = await page.goto(url, { waitUntil: "load", timeout: T(30000) }).catch(() => null); await page.waitForLoadState("networkidle", { timeout: T(4000) }).catch(() => {}); await page.waitForTimeout(T(300)); return res; };
// does the page work? it renders text and threw nothing since `since` errors
const works = async (page, errors, since = 0) => {
  const u = page.url(); if (/^chrome-error:|^about:blank/.test(u)) return { ok: false, why: `no page (${u})` };
  const r = await page.evaluate(() => ({ text: (document.body?.innerText || "").replace(/\s+/g, " ").trim().length, h1: !!document.querySelector("h1, main, [role=main]") })).catch((e) => ({ text: 0, err: firstLine(e) }));
  const errs = errors.slice(since);
  if (r.err) return { ok: false, why: r.err };
  if (r.text < 40 && !r.h1) return { ok: false, why: `blank page (${r.text} characters of text)` };
  if (errs.length) return { ok: false, why: `uncaught error: ${errs[0]}` };
  return { ok: true };
};
const LINKS = () => [...document.querySelectorAll("a[href]")].filter((a) => a.checkVisibility?.({ visibilityProperty: true }) || a.closest("nav, header, [role=navigation], dialog, details, [aria-hidden=false], [hidden]")).map((a) => a.href);

// ── nav ───────────────────────────────────────────────────────────────────────
export async function navAxis(browser, home, T) {
  const origin = new URL(home).origin, homePath = norm(new URL(home).pathname);
  let sitemap = null, sitemapNote = null;
  try { const r = await fetch(origin + "/sitemap.xml"); if (r.ok) { const x = await r.text(); const locs = [...x.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]); sitemap = [...new Set(locs.map((l) => { try { return norm(new URL(l, origin).pathname); } catch { return null; } }).filter(Boolean))]; sitemapNote = `sitemap.xml: ${sitemap.length} route(s)`; } } catch {}
  const { ctx, page, errors } = await ctxPage(browser); const depth = new Map([[homePath, 0]]), status = new Map(), broken = [], from = new Map(), urlFor = new Map([[homePath, home]]);
  try {
    const queue = [{ url: home, d: 0 }]; let visited = 0;
    while (queue.length && visited < 40) {
      const { url, d } = queue.shift(); visited++;
      const res = await go(page, url, T); const st = res ? res.status() : await statusOf(url); status.set(norm(new URL(url).pathname), st);
      if (!res || st >= 400) { broken.push({ route: norm(new URL(url).pathname), status: st || "no response", from: from.get(norm(new URL(url).pathname)) || "(home)" }); continue; }
      if (d >= MAX_CLICKS) continue;
      const links = await page.evaluate(LINKS).catch(() => []);
      for (const h of links) { let u; try { u = new URL(h); } catch { continue; } if (u.origin !== origin || !/^https?:/.test(u.protocol)) continue; if (/\.(pdf|zip|png|jpe?g|webp|svg|mp4|xml|json|txt|ics|vcf)$/i.test(u.pathname)) continue; const p = norm(u.pathname); if (!depth.has(p)) { depth.set(p, d + 1); from.set(p, norm(new URL(url).pathname)); urlFor.set(p, stripHash(u.href)); queue.push({ url: stripHash(u.href), d: d + 1 }); } }
    }
    const need = sitemap && sitemap.length ? sitemap : [...depth.keys()];
    const fails = [];
    for (const r of need) { const d = depth.get(r); if (d === undefined) fails.push({ route: r, why: `not reachable from home in ≤ ${MAX_CLICKS} clicks` }); else if (d > MAX_CLICKS) fails.push({ route: r, why: `${d} clicks from home (more than ${MAX_CLICKS})` }); }
    for (const b of broken) fails.push({ route: b.route, why: `broken link: HTTP ${b.status} (linked from ${b.from})` });
    const reached = need.filter((r) => depth.has(r) && depth.get(r) <= MAX_CLICKS && !broken.some((b) => b.route === r));
    const pages = [home, ...[...depth.keys()].filter((r) => r !== homePath && !broken.some((b) => b.route === r) && (status.get(r) || 0) < 400 && status.has(r)).map((r) => urlFor.get(r)).filter(Boolean)];
    return { ok: fails.length === 0, have: reached.length, need: need.length, fails, pages, depths: Object.fromEntries([...depth].filter(([r]) => need.includes(r))), routes: need, notes: [sitemapNote || "no sitemap.xml: the routes are the ones found by following links from home", `${visited} page(s) loaded`], errors: errors.slice(0, 3) };
  } finally { await ctx.close(); }
}

// ── mobile ────────────────────────────────────────────────────────────────────
const KEY = `(e) => { const p = []; for (let n = e; n && n.nodeType === 1 && n !== document.documentElement; n = n.parentElement) { let i = 1, s = n; while ((s = s.previousElementSibling)) if (s.tagName === n.tagName) i++; p.unshift(n.tagName.toLowerCase() + ":" + i); } return p.join(">"); }`;
const FIND = `(k) => { let n = document.documentElement; for (const part of k.split(">")) { const [t, i] = part.split(":"); let c = 0, hit = null; for (const ch of n.children) if (ch.tagName.toLowerCase() === t && ++c === +i) { hit = ch; break; } if (!hit) return null; n = hit; } return n; }`;
const INTERACTIVE = `a[href], button, [role=button], [role=link], [role=tab], [role=switch], [role=checkbox], [role=menuitem], input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"]), [onclick]`;
export async function mobileAxis(browser, home, T, pages = [home]) {
  const all = { have: 0, need: 0, tap: { have: 0, need: 0 }, swipe: { have: 0, need: 0 }, longpress: { have: 0, need: 0 }, fails: [], notes: [], errors: [] }; const seen = new Set(); let parked = 0, protocolN = 0;
  for (const pg of pages.slice(0, 12)) {
    const r = await mobileOne(browser, pg, T, seen, pages.length > 1);
    for (const k of ["have", "need"]) all[k] += r[k]; for (const g of ["tap", "swipe", "longpress"]) { all[g].have += r[g].have; all[g].need += r[g].need; }
    all.fails.push(...r.fails); all.errors.push(...r.errors); parked += r.parked; protocolN += r.protocol;
  }
  all.ok = all.need === 0 ? null : all.have === all.need;
  all.notes = [pages.length > 1 ? `${Math.min(12, pages.length)} page(s); an element shared by several pages (header, footer) is tapped once` : null, protocolN ? `${protocolN} mailto/tel link(s) are handed to the OS and counted as responding` : null, parked ? `${parked} element(s) parked off-canvas (skip links, closed drawers) are keyboard-only by design and not tapped` : null, !all.longpress.need ? "no element declares a long press" : null].filter(Boolean);
  if (all.need === 0) all.notes.unshift("no interactive element at 375px");
  return all;
}
async function mobileOne(browser, home, T, seen, multi) {
  const where = multi ? ` (${new URL(home).pathname})` : "";
  const { ctx, page, errors } = await ctxPage(browser, { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const navs = []; let popups = 0; ctx.on("page", (p) => { popups++; p.close().catch(() => {}); });
  await page.route("**/*", (route) => { const rq = route.request(); if (rq.isNavigationRequest() && rq.frame() === page.mainFrame() && stripHash(rq.url()) !== stripHash(home)) { navs.push(rq.url()); return route.abort(); } return route.continue(); });
  await page.addInitScript(() => {
    window.__jm = { n: 0, targets: new Set(), invalid: 0 };
    const start = () => new MutationObserver((ms) => { for (const m of ms) { if (m.type === "attributes" && /^data-j/.test(m.attributeName || "")) continue; window.__jm.n++; window.__jm.targets.add(m.target); } }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
    addEventListener("invalid", () => window.__jm.invalid++, true);
  });
  const cdp = await ctx.newCDPSession(page);
  const tapFails = [], swipeFails = [], pressFails = [], protocol = []; let tapped = 0, swiped = 0, pressed = 0, uncovered = 0;
  try {
    await go(page, home, T);
    const els0 = await page.evaluate(`(() => { const key = ${KEY}; const out = []; for (const e of document.querySelectorAll(${JSON.stringify(INTERACTIVE)})) { if (!e.checkVisibility || !e.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; if (e.closest("[aria-hidden=true], [inert]")) continue; if (out.some((o) => o.el.contains(e))) continue; const href = e.getAttribute("href") || ""; const fixedAnc = (() => { for (let n = e; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === "fixed" || p === "sticky") return true; } return false; })(); const doc = { top: r.top + scrollY, left: r.left + scrollX }; const parked = doc.left + r.width <= 0 || doc.left >= document.documentElement.scrollWidth || doc.top + r.height <= 0 || (fixedAnc && (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth)); out.push({ el: e, key: key(e), label: (e.getAttribute("aria-label") || e.innerText || e.value || e.getAttribute("name") || e.tagName).replace(/\\s+/g, " ").trim().slice(0, 40), tag: e.tagName.toLowerCase(), href, longpress: e.hasAttribute("data-long-press") || e.hasAttribute("data-longpress") || e.hasAttribute("data-hold"), parked, editable: e.isContentEditable, sig: e.tagName + "|" + href + "|" + (e.getAttribute("aria-label") || e.innerText || "").trim().slice(0, 40) + "|" + fixedAnc + "|" + !!e.closest("header, footer, nav") }); if (out.length >= 60) break; } return out.map(({ el, ...x }) => x); })()`);
    let parked = 0; const els = [];
    for (const e of els0) { if (e.parked) { parked++; continue; } const shared = /\|true$/.test(e.sig); if (shared && seen.has(e.sig)) continue; if (shared) seen.add(e.sig); if (els.length < 30) els.push(e); }
    // long-press candidates: elements with a contextmenu listener on themselves (DOMDebugger sees real listeners)
    for (const e of els) {
      if (e.longpress) continue;
      try { const { result } = await cdp.send("Runtime.evaluate", { expression: `(${FIND})(${JSON.stringify(e.key)})` }); if (result.objectId) { const { listeners } = await cdp.send("DOMDebugger.getEventListeners", { objectId: result.objectId }); if (listeners.some((l) => l.type === "contextmenu")) e.longpress = true; } } catch {}
    }
    const scrollers = await page.evaluate(`(() => { const key = ${KEY}; return [...document.querySelectorAll("body *")].filter((e) => { const s = getComputedStyle(e); return /auto|scroll/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 20 && e.clientHeight > 40 && e.checkVisibility?.(); }).slice(0, 8).map((e) => ({ key: key(e), label: e.getAttribute("aria-label") || e.className?.toString().slice(0, 30) || e.tagName })); })()`);
    let dirty = false;
    const state = () => page.evaluate(`(() => ({ n: window.__jm.n, invalid: window.__jm.invalid, sx: scrollX, sy: scrollY, href: location.href, active: (${KEY})(document.activeElement || document.body), dialogs: document.querySelectorAll("dialog[open], [role=dialog]:not([hidden])").length }))()`);
    const idleTargets = async () => { await page.evaluate(() => window.__jm.targets.clear()); await page.waitForTimeout(T(300)); return page.evaluate(() => window.__jm.targets.size); };
    for (const e of els) {
      if (/^(mailto|tel|sms):/i.test(e.href)) { protocol.push(e.label); tapped++; continue; } // handed to the OS; a browser shows nothing to observe
      if (dirty) { await go(page, home, T); dirty = false; }
      // a link wrapped over two lines is tapped on its first line box: its bounding box centre can fall between the lines
      const pos = await page.evaluate(`(() => { const e = (${FIND})(${JSON.stringify(e.key)}); if (!e) return null; e.scrollIntoView({ block: "center", inline: "center" }); const rs = e.getClientRects(); const r = rs.length > 1 ? rs[0] : e.getBoundingClientRect(); const x = r.left + Math.min(r.width / 2, Math.max(4, r.width - 4)), y = r.top + r.height / 2; const hit = document.elementFromPoint(x, y); return { x, y, covered: !!hit && !e.contains(hit) && !hit.contains(e) ? (hit.tagName.toLowerCase() + (hit.id ? "#" + hit.id : "")) : null }; })()`).catch(() => null);
      if (!pos) { tapFails.push({ el: e.label, why: "element gone before the tap" }); continue; }
      await page.waitForTimeout(T(120)); const idle = await idleTargets(); const before = await state(); const n0 = navs.length, p0 = popups;
      await page.evaluate(() => window.__jm.targets.clear());
      await page.touchscreen.tap(pos.x, pos.y).catch(() => {}); await page.waitForTimeout(T(450));
      const after = await state().catch(() => null); const changed = await page.evaluate(() => window.__jm.targets.size).catch(() => 0);
      // focus alone is a response only for fields (focusing is what a tap on a field does); a button or link that only takes
      // focus did nothing
      const field = /^(input|select|textarea)$/.test(e.tag) || e.editable;
      const responded = !after ? true : navs.length > n0 || popups > p0 || after.href !== before.href || (field && after.active !== before.active) || Math.abs(after.sy - before.sy) > 2 || Math.abs(after.sx - before.sx) > 2 || after.invalid > before.invalid || after.dialogs !== before.dialogs || changed > idle;
      if (responded) { tapped++; if (changed > idle || after?.dialogs !== before.dialogs) dirty = true; }
      else tapFails.push({ el: `${e.tag} "${e.label}"`, why: pos.covered ? `covered by ${pos.covered} at 375px: the tap lands on it` : "nothing changed after a tap (no DOM change, scroll, navigation, dialog, or focus moving into a field)" });
      if (after && after.href !== before.href && stripHash(after.href) !== stripHash(before.href)) dirty = true;
      if (!pos.covered) uncovered++;
    }
    for (const e of els.filter((x) => x.longpress)) {
      await go(page, home, T);
      const pos = await page.evaluate(`(() => { const e = (${FIND})(${JSON.stringify(e.key)}); if (!e) return null; e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      if (!pos) { pressFails.push({ el: e.label, why: "element gone" }); continue; }
      const idle = await idleTargets(); await page.evaluate(() => window.__jm.targets.clear());
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: pos.x, y: pos.y }] }); await page.waitForTimeout(T(900)); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await page.waitForTimeout(T(300));
      const changed = await page.evaluate(() => window.__jm.targets.size);
      if (changed > idle) pressed++; else pressFails.push({ el: `${e.tag} "${e.label}"`, why: "declares a long press but nothing changed after a 900 ms press" });
    }
    if (scrollers.length) await go(page, home, T);
    for (const s of scrollers) {
      const pos = await page.evaluate(`(() => { const e = (${FIND})(${JSON.stringify(s.key)}); if (!e) return null; e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return { x: Math.min(r.right - 10, r.left + r.width * 0.75), y: r.top + r.height / 2, left: e.scrollLeft }; })()`);
      if (!pos) { swipeFails.push({ el: s.label, why: "element gone" }); continue; }
      // a real touch swipe through the input pipeline (synthesized scroll gestures do not move overflow containers)
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: pos.x, y: pos.y }] });
      for (let i = 1; i <= 10; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: Math.max(2, pos.x - i * 20), y: pos.y }] }); await page.waitForTimeout(16); }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await page.waitForTimeout(T(700));
      const left = await page.evaluate(`(() => { const e = (${FIND})(${JSON.stringify(s.key)}); return e ? e.scrollLeft : null; })()`);
      if (left !== null && Math.abs(left - pos.left) > 4) swiped++; else swipeFails.push({ el: s.label, why: "horizontal scroller did not move on a touch swipe" });
    }
    const pressN = els.filter((x) => x.longpress).length;
    const need = els.length + scrollers.length + pressN, have = tapped + swiped + pressed;
    return { have, need, parked, protocol: protocol.length, tap: { have: tapped, need: els.length }, swipe: { have: swiped, need: scrollers.length }, longpress: { have: pressed, need: pressN }, fails: [...tapFails.map((f) => ({ gesture: "tap", el: f.el + where, why: f.why })), ...swipeFails.map((f) => ({ gesture: "swipe", el: f.el + where, why: f.why })), ...pressFails.map((f) => ({ gesture: "long-press", el: f.el + where, why: f.why }))], errors: errors.slice(0, 3) };
  } finally { await ctx.close(); }
}

// ── forms ─────────────────────────────────────────────────────────────────────
const FILL = `(form) => { for (const f of form.querySelectorAll("input, textarea, select")) { if (f.disabled || f.type === "hidden" || f.type === "submit" || f.type === "button" || f.type === "reset" || f.readOnly) continue;
  const set = (v) => { const proto = f.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : f.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, "value").set.call(f, v); f.dispatchEvent(new Event("input", { bubbles: true })); f.dispatchEvent(new Event("change", { bubbles: true })); };
  if (f.tagName === "SELECT") { const o = [...f.options].find((o) => o.value && !o.disabled); if (o) set(o.value); continue; }
  if (f.type === "checkbox" || f.type === "radio") { if (f.type === "checkbox" ? f.required || !f.checked : !form.querySelector('input[type=radio][name="' + f.name + '"]:checked')) { f.checked = true; f.dispatchEvent(new Event("change", { bubbles: true })); } continue; }
  const t = f.type; const v = t === "email" ? "test@example.com" : t === "tel" ? "+8801700000000" : t === "url" ? "https://example.com" : t === "number" || t === "range" ? String(f.min || 1) : t === "date" ? "2026-10-20" : t === "time" ? "10:30" : t === "month" ? "2026-10" : f.tagName === "TEXTAREA" ? "A test message for this form." : f.pattern ? "" : "Test Name";
  if (v) set(v); } }`;
const CLEAR = `(form) => { for (const f of form.querySelectorAll("input, textarea, select")) { if (f.type === "hidden" || f.type === "submit" || f.type === "button") continue; if (f.type === "checkbox" || f.type === "radio") { f.checked = false; continue; } if (f.tagName === "SELECT") { f.selectedIndex = 0; continue; } f.value = ""; f.dispatchEvent(new Event("input", { bubbles: true })); } }`;
// visible text inside the form's region (the form and its parent), and each field's look, to diff before/after
// a form replaced by its success message is gone from document.forms: the snapshot falls back to the element and the region
// remembered when the page loaded (window.__jf, window.__jfRegion), so "the form disappeared and a message appeared" is seen
const SNAPF = `(form) => { const region = form.isConnected ? form.parentElement || form : window.__jfRegion?.isConnected ? window.__jfRegion : document.body; const vis = (e) => e.checkVisibility?.({ visibilityProperty: true, opacityProperty: true });
  const texts = [...region.querySelectorAll("*")].filter((e) => vis(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)).map((e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim());
  const live = [...document.querySelectorAll("[role=alert], [role=status], [aria-live]:not([aria-live=off]), output")].filter(vis).map((e) => e.innerText.trim()).filter(Boolean);
  const fields = [...form.querySelectorAll("input, textarea, select")].filter((f) => f.type !== "hidden").map((f) => { const s = getComputedStyle(f); return [s.borderColor, s.outlineColor + s.outlineStyle, s.backgroundColor, s.boxShadow, f.getAttribute("aria-invalid")].join("|"); });
  const btn = form.querySelector("button[type=submit], input[type=submit], button:not([type])") || document.querySelector('button[form="' + form.id + '"]');
  const b = btn ? [btn.disabled, btn.getAttribute("aria-busy"), btn.getAttribute("aria-disabled"), (btn.innerText || btn.value || "").trim(), getComputedStyle(btn).opacity, btn.className].join("|") : "";
  return { texts, live, fields, btn: b, busy: !!document.querySelector("[aria-busy=true], [role=progressbar]") , formVisible: vis(form) }; }`;
const ERR_RX = /error|invalid|required|please|must|enter a|isn.?t valid|not valid|missing|fail|wrong|try again|couldn|could not|problem|sorry|unable|ভুল|প্রয়োজন/i;
const OK_RX = /thank|thanks|sent|received|success|done|subscribed|confirmed|booked|we.?ll be in touch|got it|ধন্যবাদ/i;
const newTexts = (a, b) => b.texts.filter((t) => !a.texts.includes(t)).concat(b.live.filter((t) => !a.live.includes(t)));
export async function formsAxis(browser, home, T, pages = [home]) {
  const all = { have: 0, need: 0, forms: [], fails: [], notes: [] };
  for (const pg of pages.slice(0, 12)) { const r = await formsOne(browser, pg, T, pages.length > 1); all.have += r.have; all.need += r.need; all.forms.push(...r.forms); all.fails.push(...r.fails); }
  all.ok = all.need === 0 ? null : all.have === all.need; if (!all.need) all.notes.push(pages.length > 1 ? `no form with fields on any of ${Math.min(12, pages.length)} page(s)` : "no form with fields on this page");
  return all;
}
async function formsOne(browser, home, T, multi) {
  const probe = await ctxPage(browser); let forms = [];
  try { await go(probe.page, home, T); forms = await probe.page.evaluate(`(() => [...document.forms].slice(0, 5).map((f, i) => ({ i, id: f.id || null, action: f.getAttribute("action") || "", method: (f.getAttribute("method") || "get").toLowerCase(), fields: [...f.querySelectorAll("input, textarea, select")].filter((x) => !["hidden", "submit", "button", "reset"].includes(x.type)).length, label: (f.getAttribute("aria-label") || f.querySelector("h1,h2,h3,legend,label")?.innerText || f.id || "form " + (i + 1)).trim().slice(0, 40) })).filter((f) => f.fields > 0))()`); } finally { await probe.ctx.close(); }
  if (!forms.length) return { ok: null, have: 0, need: 0, fails: [], forms: [], notes: ["no form with fields on this page"] };
  const results = [];
  for (const f of forms) {
    const st = { default: false, validation: false, loading: false, success: false, serverError: false }; const why = {}; const sel = `document.forms[${f.i}]`;
    const run = async (mode) => {
      const { ctx, page, errors } = await ctxPage(browser); let requests = 0, nativeNav = false; const held = [];
      await page.route("**/*", async (route) => { const rq = route.request(); const isDoc = rq.isNavigationRequest() && rq.frame() === page.mainFrame(); const isApi = ["fetch", "xhr"].includes(rq.resourceType()) && rq.method() !== "GET" || (["fetch", "xhr"].includes(rq.resourceType()) && mode.armed);
        if (mode.armed && (isApi || (isDoc && stripHash(rq.url()) !== stripHash(home)))) { requests++; if (isDoc) nativeNav = true;
          await new Promise((r) => setTimeout(r, mode.delay)); const code = mode.code; return route.fulfill({ status: code, contentType: isDoc ? "text/html" : "application/json", body: isDoc ? `<!doctype html><title>${code}</title><p>${code}</p>` : JSON.stringify(code < 400 ? { ok: true, message: "ok" } : { ok: false, error: "Server error" }) }).catch(() => {}); }
        return route.continue().catch(() => {}); });
      try {
        await go(page, home, T);
        await page.evaluate(`(() => { window.__jf = ${sel}; window.__jfRegion = ${sel}?.parentElement || null; })()`);
        const fh = await page.evaluateHandle(`${sel}`); await page.evaluate((form) => form.scrollIntoView({ block: "center" }), fh).catch(() => {});
        const s0 = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`);
        return await mode.fn({ page, fh, s0, errors, requests: () => requests, nativeNav: () => nativeNav, arm: () => { mode.armed = true; } });
      } finally { await ctx.close(); }
    };
    const submit = async (page) => { await page.evaluate(`(() => { const f = ${sel}; const b = f.querySelector("button[type=submit], input[type=submit], button:not([type])") || document.querySelector('button[form="' + f.id + '"]'); if (b) b.click(); else if (f.requestSubmit) f.requestSubmit(); else f.submit(); })()`).catch(() => {}); };
    // 1 default + 2 validation (submit empty)
    await run({ code: 200, delay: 0, fn: async ({ page, s0 }) => {
      const lab = await page.evaluate(`(() => { const f = ${sel}; const miss = []; for (const x of f.querySelectorAll("input, textarea, select")) { if (["hidden", "submit", "button", "reset"].includes(x.type)) continue; const named = x.getAttribute("aria-label") || x.getAttribute("aria-labelledby") || x.closest("label") || (x.id && document.querySelector('label[for="' + CSS.escape(x.id) + '"]')) || x.title; if (!named) miss.push(x.name || x.type); } return miss; })()`);
      st.default = s0.formVisible && !lab.length; if (!s0.formVisible) why.default = "form not visible when the page loads"; else if (lab.length) why.default = `field(s) without a label: ${lab.join(", ")}`;
      await page.evaluate(`(${CLEAR})(${sel})`); await submit(page); await page.waitForTimeout(T(700));
      const s1 = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null);
      if (!s1) { why.validation = "the page navigated away on an empty submit (no validation)"; return; }
      const fresh = newTexts(s0, s1); const styled = s1.fields.some((x, k) => x !== s0.fields[k]);
      st.validation = fresh.some((t) => ERR_RX.test(t)) || styled || s1.live.some((t) => ERR_RX.test(t));
      if (!st.validation) why.validation = "an empty submit shows no designed error (no message, no field style change; a browser bubble alone does not count)";
    } });
    // 3 loading + 4 success: the request is held 2 s, then answered 200
    await run({ code: 200, delay: 2000, fn: async ({ page, s0, requests, nativeNav, arm }) => {
      await page.evaluate(`(${FILL})(${sel})`); arm(); await submit(page); await page.waitForTimeout(T(500));
      const mid = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null);
      if (!requests()) { why.loading = "no request was made on a valid submit, so there is no pending state to show"; why.success = "no request was made: success cannot follow a server answer"; if (mid && newTexts(s0, mid).some((t) => OK_RX.test(t))) why.success += " (a success message appears without any request)"; return; }
      if (nativeNav()) { why.loading = "native form submit: the page navigates; no in-page loading state"; why.success = "native form submit: success is whatever page the server returns, not a designed state"; why.serverError = "native form submit: a server error shows the server's page, not a designed state"; return; }
      st.loading = !!mid && (mid.btn !== s0.btn || mid.busy || newTexts(s0, mid).some((t) => /send|sending|submitting|loading|wait|…|\.\.\./i.test(t)));
      if (!st.loading) why.loading = "nothing changed while the request was pending (button, aria-busy, progress, text)";
      await page.waitForTimeout(T(2600)); const end = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null);
      const shown = end ? newTexts(s0, end) : [];
      st.success = !!end && (shown.some((t) => OK_RX.test(t)) || (!end.formVisible && shown.length > 0));
      if (!st.success) why.success = shown.length ? `after a 200 the new text does not read as success: "${shown[0].slice(0, 50)}"` : "after a 200 nothing new is shown";
    } });
    // 5 server error: the request answered 500
    if (!why.serverError) await run({ code: 500, delay: 600, fn: async ({ page, s0, requests, arm }) => {
      await page.evaluate(`(${FILL})(${sel})`); arm(); await submit(page); await page.waitForTimeout(T(2200));
      if (!requests()) { why.serverError = "no request was made, so a server error cannot happen or be shown"; return; }
      const end = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null); const shown = end ? newTexts(s0, end) : [];
      st.serverError = shown.some((t) => ERR_RX.test(t) && !OK_RX.test(t));
      if (!st.serverError) why.serverError = shown.some((t) => OK_RX.test(t)) ? "after a 500 the form shows success" : "after a 500 no error is shown";
    } });
    results.push({ form: f.label + (multi ? ` (${new URL(home).pathname})` : ""), method: f.method, action: f.action, states: st, why });
  }
  const need = results.length * 5, have = results.reduce((n, r) => n + Object.values(r.states).filter(Boolean).length, 0);
  return { ok: have === need, have, need, forms: results, fails: results.flatMap((r) => Object.entries(r.states).filter(([, v]) => !v).map(([k]) => ({ form: r.form, state: k, why: r.why[k] || "missing" }))), notes: [] };
}

// ── loading ───────────────────────────────────────────────────────────────────
export async function loadingAxis(browser, home, T, pages = [home]) {
  const all = { have: 0, need: 0, fails: [], surfaces: [], notes: [] }; let req = 0;
  for (const pg of pages.slice(0, 12)) { const r = await loadingOne(browser, pg, T); all.have += r.have; all.need += r.need; req += r.requests || 0; const where = pages.length > 1 ? ` (${new URL(pg).pathname})` : ""; all.fails.push(...r.fails.map((f) => ({ ...f, surface: f.surface + where }))); all.surfaces.push(...(r.surfaces || []).map((s) => ({ ...s, page: new URL(pg).pathname }))); }
  all.ok = all.need === 0 ? null : all.have === all.need;
  all.notes.push(all.need ? `${req} request(s) held 2.5 s before release${pages.length > 1 ? `, across ${Math.min(12, pages.length)} page(s)` : ""}` : req ? `${req} request(s) after load, but nothing on the page changed when they returned: no async surface` : "no fetch or XHR request after load: no async surface");
  return all;
}
async function loadingOne(browser, home, T) {
  const { ctx, page, errors } = await ctxPage(browser); const held = []; let release = false, seen = 0;
  await page.route("**/*", (route) => { const rq = route.request(); if (["fetch", "xhr"].includes(rq.resourceType()) && !release) { seen++; held.push(route); return; } return route.continue().catch(() => {}); });
  await page.addInitScript(() => { window.__jl = { after: new Set(), released: false }; const start = () => new MutationObserver((ms) => { if (!window.__jl.released) return; for (const m of ms) window.__jl.after.add(m.target.nodeType === 1 ? m.target : m.target.parentElement); }).observe(document, { subtree: true, childList: true, characterData: true }); if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start(); });
  try {
    await page.goto(home, { waitUntil: "load", timeout: T(30000) }).catch(() => {}); await page.waitForTimeout(T(1200));
    if (!seen) { release = true; return { have: 0, need: 0, fails: [], requests: 0 }; }
    // while held: mark every element that is (or holds) a skeleton
    await page.evaluate(() => { const SK = "[aria-busy=true], [role=progressbar], [data-skeleton], [data-loading], [class*=skeleton i], [class*=shimmer i], [class*=placeholder i], [class*=loading i]"; window.__jl.had = new WeakMap(); for (const e of document.querySelectorAll("body *")) { const vis = e.checkVisibility?.({ visibilityProperty: true }); const sk = vis && (e.matches(SK) || !!e.querySelector(SK) || /^\s*(loading|লোড)/i.test(e.innerText || "")); window.__jl.had.set(e, sk); } window.__jl.released = true; });
    release = true; for (const r of held) await r.continue().catch(() => {}); await page.waitForLoadState("networkidle", { timeout: T(6000) }).catch(() => {}); await page.waitForTimeout(T(900));
    const r = await page.evaluate(() => { const surf = new Map(); for (let e of window.__jl.after) { if (!e || !e.isConnected) continue; while (e && e !== document.body && !window.__jl.had.has(e)) e = e.parentElement; if (!e || e === document.body) continue; let s = e; for (let i = 0; i < 4 && s.parentElement && s.parentElement !== document.body; i++) { const r = s.getBoundingClientRect(); if (r.width >= 40 && r.height >= 20) break; s = s.parentElement; } const label = s.tagName.toLowerCase() + (s.id ? "#" + s.id : s.classList[0] ? "." + s.classList[0] : ""); let sk = false; for (let n = s, i = 0; n && i < 5; n = n.parentElement, i++) if (window.__jl.had.get(n)) { sk = true; break; } if (!surf.has(s)) surf.set(s, { label, skeleton: sk }); else if (sk) surf.get(s).skeleton = true; }
      const list = [...surf.entries()].filter(([s]) => ![...surf.keys()].some((o) => o !== s && o.contains(s))).map(([, v]) => v); return list; });
    if (!r.length) return { have: 0, need: 0, fails: [], requests: seen };
    const fails = r.filter((s) => !s.skeleton).map((s) => ({ surface: s.label, why: "filled after a request, but showed no skeleton while it was pending" }));
    return { have: r.length - fails.length, need: r.length, fails, surfaces: r, requests: seen };
  } finally { release = true; for (const r of held) await r.continue().catch(() => {}); await ctx.close(); }
}

// ── errors ────────────────────────────────────────────────────────────────────
export async function errorsAxis(browser, home, T) {
  const origin = new URL(home).origin; const missing = `${origin}/__motomation-missing-${Date.now().toString(36)}/`;
  const { ctx, page } = await ctxPage(browser);
  try {
    const homeStyle = await (async () => { await go(page, home, T); return page.evaluate(() => getComputedStyle(document.body).fontFamily); })();
    const res = await go(page, missing, T); const status = res ? res.status() : await statusOf(missing);
    // no response (an empty error body) leaves Chromium's own error page on screen: that is not the site's view
    const v = !res || /^chrome-error:/.test(page.url()) ? { text: "", len: 0, home: false, sheets: 0, font: "" } : await page.evaluate(() => { const t = (document.body?.innerText || "").replace(/\s+/g, " ").trim(); const home = [...document.querySelectorAll("a[href]")].some((a) => { try { const u = new URL(a.href); return u.origin === location.origin && /^\/?(index\.html?)?$/.test(u.pathname.replace(/^\//, "")) ; } catch { return false; } }); return { text: t.slice(0, 200), len: t.length, home, sheets: document.styleSheets.length, font: getComputedStyle(document.body).fontFamily }; }).catch(() => ({ text: "", len: 0, home: false, sheets: 0, font: "" }));
    const says = /404|not found|page (isn.?t|is not|does not|doesn.?t) exist|can.?t (find|be found)|no longer|moved|missing|wrong turn|lost|পাওয়া যায়নি/i.test(v.text);
    const fails = [];
    if (status !== 404 && !says) fails.push({ why: status === 200 ? "unknown route answers 200 with no not-found view (a soft 404)" : `unknown route answers ${status || "nothing"} with no designed view` });
    else {
      if (!says) fails.push({ why: `HTTP ${status} but the page does not say the page was not found${v.len ? ` ("${v.text.slice(0, 60)}")` : " (empty body)"}` });
      if (!v.home) fails.push({ why: "the not-found view has no link back to the home page" });
      if (!v.sheets || (v.font !== homeStyle && /^"?Times New Roman"?|^serif$/i.test(v.font))) fails.push({ why: "the not-found view is unstyled (browser defaults, not the site's styles)" });
    }
    return { ok: !fails.length, have: fails.length ? 0 : 1, need: 1, status, soft404: status === 200 && says, fails, notes: [`probed ${new URL(missing).pathname}`, status === 200 && says ? "soft 404: status 200 with a not-found view" : null].filter(Boolean) };
  } finally { await ctx.close(); }
}

// ── session ───────────────────────────────────────────────────────────────────
export async function sessionAxis(browser, home, T, routes = []) {
  const { ctx, page, errors } = await ctxPage(browser); const checks = []; const add = (step, r) => checks.push({ step, ok: r.ok, why: r.why });
  try {
    await go(page, home, T); add("load", await works(page, errors));
    // a second destination: another route found by nav, else an in-page anchor
    const origin = new URL(home).origin; const homeN = norm(new URL(home).pathname);
    const other = routes.find((r) => r !== homeN); let target = other ? origin + (other === "/" ? "/" : other) : null, kind = "route";
    if (target) { const html = await page.evaluate((p) => [...document.querySelectorAll("a[href]")].map((a) => a.href).find((h) => { try { const u = new URL(h); return u.origin === location.origin && (u.pathname.replace(/\/index\.html?$/, "/").replace(/\.html?$/, "").replace(/\/+$/, "") || "/") === p; } catch { return false; } }), other); if (html) target = html; }
    if (!target) { const a = await page.evaluate(() => { const a = [...document.querySelectorAll('a[href^="#"]')].find((x) => x.getAttribute("href").length > 1 && document.getElementById(decodeURIComponent(x.getAttribute("href").slice(1)))); return a ? a.href : null; }); if (a) { target = a; kind = "anchor"; } }
    let mark = errors.length;
    if (!target) { kind = "blank"; await page.goto("about:blank"); await go(page, home, T); target = home; }
    else { const clicked = await page.evaluate((h) => { const a = [...document.querySelectorAll("a[href]")].find((x) => x.href === h); if (!a) return false; a.click(); return true; }, target).catch(() => false); if (!clicked) await go(page, target, T); await page.waitForLoadState("load").catch(() => {}); await page.waitForTimeout(T(700)); }
    add(`open ${kind === "anchor" ? "an in-page anchor" : kind === "blank" ? "the page from a blank tab" : "a second route"}`, await works(page, errors, mark));
    const second = page.url();
    mark = errors.length; await page.goBack({ waitUntil: "load", timeout: T(15000) }).catch(() => {}); await page.waitForTimeout(T(600));
    const backOk = kind === "blank" ? page.url() === "about:blank" : stripHash(page.url()) === stripHash(home) && (kind !== "anchor" || page.url() !== second);
    add("back button", backOk ? (kind === "blank" ? { ok: true } : await works(page, errors, mark)) : { ok: false, why: `back went to ${page.url()}, not the previous page` });
    mark = errors.length; await page.goForward({ waitUntil: "load", timeout: T(15000) }).catch(() => {}); await page.waitForTimeout(T(600));
    add("forward button", page.url() === second ? await works(page, errors, mark) : { ok: false, why: `forward went to ${page.url()}, not ${second}` });
    mark = errors.length; await page.reload({ waitUntil: "load", timeout: T(30000) }).catch(() => {}); await page.waitForTimeout(T(800));
    add("full reload", page.url() === second ? await works(page, errors, mark) : { ok: false, why: `reload landed on ${page.url()}` });
    // two tabs on the same site, same storage: both load, then each is used while the other is open
    const p2 = await ctx.newPage(); const e2 = []; p2.on("pageerror", (e) => e2.push(firstLine(e)));
    mark = errors.length; await go(page, home, T); await go(p2, kind === "route" ? second : home, T);
    await page.mouse.wheel(0, 900); await page.waitForTimeout(T(300)); await page.reload({ waitUntil: "load" }).catch(() => {}); await page.waitForTimeout(T(500));
    await p2.mouse.wheel(0, 900); await p2.waitForTimeout(T(300));
    const t1 = await works(page, errors, mark), t2 = await works(p2, e2, 0);
    add("two tabs", t1.ok && t2.ok ? { ok: true } : { ok: false, why: `${!t1.ok ? `tab 1: ${t1.why}` : ""}${!t1.ok && !t2.ok ? "; " : ""}${!t2.ok ? `tab 2: ${t2.why}` : ""}` });
    await p2.close();
    const fails = checks.filter((c) => !c.ok).map((c) => ({ step: c.step, why: c.why }));
    return { ok: !fails.length, have: checks.length - fails.length, need: checks.length, checks, fails, notes: [kind === "route" ? `second page: ${new URL(second).pathname}` : kind === "anchor" ? "single page: back and forward measured over an in-page anchor" : "single page with no links: back and forward measured from a blank tab"] };
  } finally { await ctx.close(); }
}

// ── all six ───────────────────────────────────────────────────────────────────
export async function journey(browser, home, opts = {}) {
  const T = opts.T || ((ms) => ms); const out = {};
  const guard = async (k, fn) => { try { out[k] = await fn(); } catch (e) { out[k] = { ok: false, have: 0, need: 1, fails: [{ why: `not measured: ${firstLine(e)}` }], notes: [], error: firstLine(e) }; } };
  await guard("nav", () => navAxis(browser, home, T));
  const pages = out.nav?.pages?.length ? out.nav.pages : [home];
  await guard("mobile", () => mobileAxis(browser, home, T, pages));
  await guard("forms", () => formsAxis(browser, home, T, pages));
  await guard("loading", () => loadingAxis(browser, home, T, pages));
  await guard("errors", () => errorsAxis(browser, home, T));
  await guard("session", () => sessionAxis(browser, home, T, (out.nav?.pages || []).map((u) => norm(new URL(u).pathname))));
  const counts = Object.fromEntries(JOURNEY_AXES.map((k) => [k, out[k].ok === false ? Math.max(1, out[k].fails.length) : 0]));
  return { ...out, counts, fails: Object.values(counts).reduce((a, b) => a + b, 0), pass: Object.values(counts).every((n) => n === 0), segment: `journey: ${JOURNEY_AXES.map((k) => `${k}${out[k].ok === null ? "-" : counts[k]}`).join(" ")}` };
}
const SUM = { nav: (r) => `${r.have}/${r.need} route(s) reachable from home in ≤ ${MAX_CLICKS} clicks${r.depths ? ` (${Object.entries(r.depths).map(([p, d]) => `${p}:${d}`).slice(0, 8).join(" ")}${Object.keys(r.depths).length > 8 ? " …" : ""})` : ""}`,
  mobile: (r) => `${r.have}/${r.need} interactive element(s) respond at 375px · tap ${r.tap?.have}/${r.tap?.need} · swipe ${r.swipe?.need ? `${r.swipe.have}/${r.swipe.need}` : "n/a"} · long-press ${r.longpress?.need ? `${r.longpress.have}/${r.longpress.need}` : "n/a"}`,
  forms: (r) => `${r.have}/${r.need} form state(s) rendered${r.forms?.length ? ` · ${r.forms.map((f) => `${f.form}: ${Object.entries(f.states).map(([k, v]) => `${k}${v ? "✓" : "✗"}`).join(" ")}`).join(" · ")}` : ""}`,
  loading: (r) => `${r.have}/${r.need} async surface(s) show a skeleton while pending`,
  errors: (r) => `${r.have}/${r.need} designed not-found view (unknown route → HTTP ${r.status ?? "?"}${r.soft404 ? ", soft 404" : ""})`,
  session: (r) => `${r.have}/${r.need} · ${(r.checks || []).map((c) => `${c.step} ${c.ok ? "✓" : "✗"}`).join(" · ")}` };
export function journeyLines(j) {
  const L = [`  J — journey (whole site, real browser; any missing state fails the page; not in the stamp or its id)`];
  for (const k of JOURNEY_AXES) { const r = j[k]; if (!r) continue; const mark = r.ok === null ? "–" : r.ok ? "✓" : "✗";
    L.push(`    ${k.padEnd(8)} ${mark} ${r.ok === null ? `n/a: ${(r.notes || [])[0] || "nothing to check"}` : SUM[k](r)}`);
    for (const f of (r.fails || []).slice(0, 8)) L.push(`               ✗ ${Object.entries(f).filter(([key, v]) => key !== "why" && v !== undefined && v !== null && v !== "").map(([, v]) => v).join(" ")}${f.why ? `${Object.keys(f).length > 1 ? ": " : ""}${f.why}` : ""}`);
    if ((r.fails || []).length > 8) L.push(`               … ${r.fails.length - 8} more`);
    for (const n of r.ok === null ? (r.notes || []).slice(1) : r.notes || []) L.push(`               · ${n}`);
  }
  L.push(`    ${j.segment} → ${j.pass ? "PASS" : `FAIL (${j.fails} missing)`}`);
  return L;
}
