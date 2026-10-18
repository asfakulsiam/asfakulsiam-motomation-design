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
export const MAX_PAGES = 60;   // pages nav loads; routes found beyond it are reported as not loaded
export const SAMPLE = 12;      // pages the mobile and loading checks sample (home and form pages first)
export const MAX_FORM_PAGES = 30, MAX_FORMS_PER_PAGE = 5; // the forms check covers every form page up to these caps; the rest is reported
const FORM_COUNT = () => [...document.forms].filter((f) => [...f.querySelectorAll("input, textarea, select")].some((x) => !["hidden", "submit", "button", "reset"].includes(x.type))).length;
/** Page order for sampling: home, then pages with forms (in link order), then the rest. Pure, exported for tests. */
export function samplePages(pages, formPages = {}, home = pages[0]) {
  const key = (u) => { try { return norm(new URL(u).pathname); } catch { return u; } };
  const rest = pages.filter((u) => u !== home); const withForms = rest.filter((u) => formPages[key(u)]);
  return [home, ...withForms, ...rest.filter((u) => !formPages[key(u)])].filter(Boolean);
}

async function ctxPage(browser, opts = {}) {
  const ctx = await browser.newContext({ bypassCSP: true, deviceScaleFactor: 1, viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage(); const errors = []; page.on("pageerror", (e) => errors.push(firstLine(e)));
  // a native alert/confirm/prompt is dismissed (the check never accepts a destructive confirm) and counted: a tap that
  // opens one responded (v3.0.1: a "Reset demo data" button guarded by confirm() read as "nothing changed")
  page.__dialogs = 0; page.on("dialog", (d) => { page.__dialogs++; d.dismiss().catch(() => {}); });
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
export async function navAxis(browser, home, T, contract = []) {
  const origin = new URL(home).origin, homePath = norm(new URL(home).pathname);
  let sitemap = null, sitemapNote = null;
  try { const r = await fetch(origin + "/sitemap.xml"); if (r.ok) { const x = await r.text(); const locs = [...x.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]); sitemap = [...new Set(locs.map((l) => { try { return norm(new URL(l, origin).pathname); } catch { return null; } }).filter(Boolean))]; sitemapNote = `sitemap.xml: ${sitemap.length} route(s)`; } } catch {}
  const { ctx, page, errors } = await ctxPage(browser); const depth = new Map([[homePath, 0]]), status = new Map(), broken = [], from = new Map(), urlFor = new Map([[homePath, home]]), formPages = new Map();
  try {
    const queue = [{ url: home, d: 0 }]; let visited = 0;
    while (queue.length && visited < MAX_PAGES) {
      const { url, d } = queue.shift(); visited++;
      const res = await go(page, url, T); const st = res ? res.status() : await statusOf(url); status.set(norm(new URL(url).pathname), st);
      if (!res || st >= 400) { broken.push({ route: norm(new URL(url).pathname), status: st || "no response", from: from.get(norm(new URL(url).pathname)) || "(home)" }); continue; }
      // forms on this page (fields beyond hidden/submit): the forms axis checks every page that has one, wherever it sits in link order
      const nf = await page.evaluate(FORM_COUNT).catch(() => 0); if (nf) formPages.set(norm(new URL(url).pathname), nf);
      if (d >= MAX_CLICKS) continue;
      const links = await page.evaluate(LINKS).catch(() => []);
      for (const h of links) { let u; try { u = new URL(h); } catch { continue; } if (u.origin !== origin || !/^https?:/.test(u.protocol)) continue; if (/\.(pdf|zip|png|jpe?g|webp|svg|mp4|xml|json|txt|ics|vcf)$/i.test(u.pathname)) continue; const p = norm(u.pathname); if (!depth.has(p)) { depth.set(p, d + 1); from.set(p, norm(new URL(url).pathname)); urlFor.set(p, stripHash(u.href)); queue.push({ url: stripHash(u.href), d: d + 1 }); } }
    }
    const need = sitemap && sitemap.length ? sitemap : [...depth.keys()];
    // concrete routes the Scope table names (completeness.mjs contractRoutes). Reported when no link reaches them, not
    // failed: a checkout reached by a button or a form submit is legitimately absent from the link graph
    const contractUnreached = [...new Set(contract.map(norm))].filter((r) => !depth.has(r) || depth.get(r) > MAX_CLICKS);
    const fails = [];
    // v3.0.2: a sitemap route no link reaches may be a flow's page (a confirmation reached by submitting a form) or a deep
    // link shared outside the site. It is excused when the page says so (<meta name="motomation:entry" content="flow"> or
    // "deep-link") or when a form's flow is seen to reach it (journey() below); an undeclared one still fails, and a route
    // that answers 404 always does. Before, a B2B build's /demo/confirmed read as a navigation failure.
    const excused = [], noindexed = new Set();
    for (const r of need) { const d = depth.get(r); if (d === undefined) { let html = "", code = 0; try { const rr = await fetch(origin + r); code = rr.status; html = await rr.text(); } catch {}
        const entry = (html.match(/<meta[^>]+name=["']motomation:entry["'][^>]*>/i)?.[0].match(/content=["']([^"']+)/i) || [])[1]; const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
        if (code >= 400 || !code) fails.push({ route: r, why: `listed in sitemap.xml but answers HTTP ${code || "no response"}` });
        else if (/^(flow|deep-link)$/i.test(entry || "")) excused.push({ route: r, entry: entry.toLowerCase(), noindex });
        else { fails.push({ route: r, why: `not reachable from home in ≤ ${MAX_CLICKS} clicks` }); if (noindex) noindexed.add(r); } } else if (d > MAX_CLICKS) fails.push({ route: r, why: `${d} clicks from home (more than ${MAX_CLICKS})` }); }
    for (const b of broken) fails.push({ route: b.route, why: `broken link: HTTP ${b.status} (linked from ${b.from})` });
    const reached = need.filter((r) => depth.has(r) && depth.get(r) <= MAX_CLICKS && !broken.some((b) => b.route === r));
    const pages = [home, ...[...depth.keys()].filter((r) => r !== homePath && !broken.some((b) => b.route === r) && (status.get(r) || 0) < 400 && status.has(r)).map((r) => urlFor.get(r)).filter(Boolean)];
    const unloaded = [...depth.keys()].filter((r) => !status.has(r));
    if (excused.length) reached.push(...excused.map((e) => e.route));
    return { ok: fails.length === 0, have: reached.length, need: need.length, fails, excused, noindexed: [...noindexed], pages, formPages: Object.fromEntries(formPages), unloaded, contractUnreached, depths: Object.fromEntries([...depth].filter(([r]) => need.includes(r))), routes: need, notes: [sitemapNote || "no sitemap.xml: the routes are the ones found by following links from home", contract.length ? `${contract.length} concrete route(s) from the Scope table` : null, excused.length ? `reached outside the link graph, declared: ${excused.map((e) => `${e.route} (${e.entry}${e.entry === "flow" && !e.noindex ? "; a flow page in sitemap.xml is indexed: noindex it or drop it from the sitemap" : ""})`).join(", ")}` : null, `${visited} page(s) loaded`, unloaded.length ? `${unloaded.length} route(s) found but not loaded (cap ${MAX_PAGES}): ${unloaded.slice(0, 6).join(", ")}${unloaded.length > 6 ? " …" : ""}` : null].filter(Boolean), errors: errors.slice(0, 3) };
  } finally { await ctx.close(); }
}

// ── mobile ────────────────────────────────────────────────────────────────────
const KEY = `(e) => { const p = []; for (let n = e; n && n.nodeType === 1 && n !== document.documentElement; n = n.parentElement) { let i = 1, s = n; while ((s = s.previousElementSibling)) if (s.tagName === n.tagName) i++; p.unshift(n.tagName.toLowerCase() + ":" + i); } return p.join(">"); }`;
const FIND = `(k) => { let n = document.documentElement; for (const part of k.split(">")) { const [t, i] = part.split(":"); let c = 0, hit = null; for (const ch of n.children) if (ch.tagName.toLowerCase() === t && ++c === +i) { hit = ch; break; } if (!hit) return null; n = hit; } return n; }`;
const INTERACTIVE = `a[href], button, [role=button], [role=link], [role=tab], [role=switch], [role=checkbox], [role=menuitem], input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"]), [onclick]`;
// v3.0.2: layout fit across widths, by cause. Every loaded page (up to LAYOUT_PAGES) is laid out at a narrow phone, a
// standard phone, a tablet and a desktop. An overflow is traced to its outermost element (the one whose parent still fits)
// and grouped: one cause shared by every page (a header that does not wrap) is one failure listing its pages and widths,
// not one per page (the v3.0.1 B2B build: div.header-cta read as 12 separate mobile failures). Overflow masked by
// overflow-x: hidden on html or body still cuts content off: it is found by the element, not by the scroll width.
export const LAYOUT_WIDTHS = [320, 375, 768, 1440], LAYOUT_PAGES = 30;
const OVF = `(() => { const de = document.documentElement, cw = de.clientWidth, sw = Math.max(de.scrollWidth, document.body ? document.body.scrollWidth : 0);
  const clipX = (e) => { const s = getComputedStyle(e); return /hidden|clip/.test(s.overflowX) ? s.overflowX : null; }; const masked = clipX(de) || (document.body && clipX(document.body));
  const sel = (e) => e.tagName.toLowerCase() + (e.id ? "#" + e.id : e.classList[0] ? "." + e.classList[0] : "");
  const own = (e) => { for (let n = e.parentElement; n && n !== document.body && n !== de; n = n.parentElement) { const s = getComputedStyle(n); if (/auto|scroll|hidden|clip/.test(s.overflowX)) return true; } return false; };
  const out = []; if (sw <= cw + 1 && !masked) return { cw, sw, causes: out };
  for (const e of document.querySelectorAll("body *")) { const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; if (!(r.right > cw + 1 || r.left < -1)) continue; const cs = getComputedStyle(e); if (cs.position === "fixed" || cs.visibility === "hidden") continue;
    if (e.closest("[aria-hidden=true], [inert], [hidden]") || own(e)) continue; if (e.checkVisibility && !e.checkVisibility({ contentVisibilityAuto: true })) continue; // v3.0.2: inside a closed <details> (a mobile menu) or content-visibility: hidden: not rendered, widens nothing
    const p = e.parentElement; if (p && p !== document.body) { const pr = p.getBoundingClientRect(); if (pr.right > cw + 1 || pr.left < -1) continue; }
    if (out.length < 6) out.push({ sel: sel(e), right: Math.round(r.right), left: Math.round(r.left), text: !!(e.innerText || "").trim() || !!e.querySelector("a, button, input, select, textarea, img, svg") , ws: cs.whiteSpace, minw: cs.minWidth, w: cs.width }); }
  return { cw, sw, rootClip: masked || null, causes: masked ? out.filter((c) => c.text) : out }; })()`;
export async function layoutSweep(browser, pages, T) {
  const byCause = new Map(), widthsOk = {}; let checked = 0;
  for (const w of LAYOUT_WIDTHS) { const phone = w < 600; const { ctx, page } = await ctxPage(browser, { viewport: { width: w, height: phone ? 812 : 900 }, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 2 : 1 }); widthsOk[w] = true;
    try { for (const pg of pages.slice(0, LAYOUT_PAGES)) { try { await page.goto(pg, { waitUntil: "load", timeout: T(15000) }); await page.waitForTimeout(T(150)); } catch { continue; } if (w === LAYOUT_WIDTHS[0]) checked++;
      const o = await page.evaluate(OVF).catch(() => null); if (!o || !o.causes.length) continue; widthsOk[w] = false; const path = norm(new URL(pg).pathname);
      for (const c of o.causes) { const k = c.sel; const g = byCause.get(k) || { sel: k, widths: new Set(), pages: new Set(), reach: 0, masked: false, hint: "" }; g.widths.add(w); g.pages.add(path); g.reach = Math.max(g.reach, c.right > o.cw ? c.right : o.cw - c.left); g.masked ||= !!o.rootClip; if (!g.hint) g.hint = /nowrap/.test(c.ws) ? "white-space: nowrap" : c.minw && c.minw !== "auto" && c.minw !== "0px" ? `min-width: ${c.minw}` : /px$/.test(c.w) && parseFloat(c.w) > o.cw ? `width: ${c.w}` : ""; byCause.set(k, g); } } } finally { await ctx.close(); } }
  // a parent cause already lists the page: an inner element reported on the same pages adds nothing
  const causes = [...byCause.values()].sort((a, b) => b.pages.size - a.pages.size || b.widths.size - a.widths.size);
  return { widths: LAYOUT_WIDTHS, widthsOk, pagesChecked: checked, causes: causes.map((g) => ({ sel: g.sel, widths: [...g.widths].sort((a, b) => a - b), pages: [...g.pages], reach: g.reach, masked: g.masked, hint: g.hint })) };
}
export async function mobileAxis(browser, home, T, pages = [home]) {
  const all = { have: 0, need: 0, tap: { have: 0, need: 0 }, swipe: { have: 0, need: 0 }, longpress: { have: 0, need: 0 }, fails: [], notes: [], errors: [] }; const seen = new Set(); let parked = 0, protocolN = 0, disabledN = 0;
  for (const pg of pages.slice(0, SAMPLE)) {
    const r = await mobileOne(browser, pg, T, seen, pages.length > 1);
    for (const k of ["have", "need"]) all[k] += r[k]; for (const g of ["tap", "swipe", "longpress"]) { all[g].have += r[g].have; all[g].need += r[g].need; }
    if (r.overflow) { all.overflowPages = (all.overflowPages || 0) + 1; all.errors.push(...r.errors); continue; } // its cause is reported once by layoutSweep
    all.fails.push(...r.fails); all.errors.push(...r.errors); parked += r.parked; protocolN += r.protocol; disabledN += r.disabled || 0;
  }
  // v3.0.2: layout causes, once each (a page that overflows at 375px is not tapped; its cause is reported here, not per page)
  const lay = await layoutSweep(browser, pages, T).catch((e) => ({ error: firstLine(e), causes: [], widthsOk: {}, pagesChecked: 0 })); all.layout = lay;
  for (const c of lay.causes) { all.need++; all.fails.push({ gesture: "layout", el: c.sel, why: `${c.masked ? "cut off: content runs past the viewport and overflow-x on html/body hides it (masked, not fixed)" : "wider than the viewport"} at ${c.widths.join(", ")}px on ${c.pages.length} page(s) (${c.pages.slice(0, 5).join(" ")}${c.pages.length > 5 ? " …" : ""}): reaches ${c.reach}px${c.hint ? `; ${c.hint}` : ""}; one cause: fix it once` }); }
  const wl = Object.entries(lay.widthsOk || {}); all.layoutLine = lay.error ? `layout not measured: ${lay.error}` : `layout ${wl.filter(([, v]) => v).length}/${wl.length} width(s) fit (${wl.map(([w, v]) => `${w}${v ? "✓" : "✗"}`).join(" ")}) on ${lay.pagesChecked} page(s)${lay.causes.length ? ` · ${lay.causes.length} cause(s)` : ""}`;
  if (all.overflowPages) all.notes.push(`${all.overflowPages} page(s) wider than the phone at 375px: taps there are not measured until the layout cause above is fixed`);
  all.ok = all.need === 0 ? null : all.have === all.need;
  all.notes = [all.layoutLine, ...(all.notes || []), pages.length > 1 ? `${Math.min(SAMPLE, pages.length)} page(s); an element shared by several pages (header, footer) is tapped once` : null, protocolN ? `${protocolN} mailto/tel link(s) are handed to the OS and counted as responding` : null, disabledN ? `${disabledN} control(s) disabled by an earlier tap (a selection limit reached) are skipped: a disabled control does nothing by specification` : null, parked ? `${parked} element(s) parked off-canvas (skip links, closed drawers) are keyboard-only by design and not tapped` : null, !all.longpress.need ? "no element declares a long press" : null].filter(Boolean);
  if (all.need === 0) all.notes.unshift("no interactive element at 375px");
  return all;
}
async function mobileOne(browser, home, T, seen, multi) {
  const where = multi ? ` (${new URL(home).pathname})` : "";
  const { ctx, page, errors } = await ctxPage(browser, { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const navs = []; let popups = 0, tapping = false; ctx.on("page", (p) => { popups++; p.close().catch(() => {}); });
  // a navigation during a tap is the response; it is recorded and stopped. A link to the page itself (a logo on the home
  // page) reloads it: that is a response too (before v3.0.1 the reload went through and the tap read as "nothing changed")
  await page.route("**/*", (route) => { const rq = route.request(); if (rq.isNavigationRequest() && rq.frame() === page.mainFrame() && (tapping || stripHash(rq.url()) !== stripHash(home))) { navs.push(rq.url()); return route.fulfill({ status: 204, body: "" }); } return route.continue(); });
  await page.addInitScript(() => {
    window.__jm = { n: 0, targets: new Set(), invalid: 0 };
    const start = () => new MutationObserver((ms) => { for (const m of ms) { if (m.type === "attributes" && /^data-j/.test(m.attributeName || "")) continue; window.__jm.n++; window.__jm.targets.add(m.target); } }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
    addEventListener("invalid", () => window.__jm.invalid++, true);
  });
  const cdp = await ctx.newCDPSession(page);
  const tapFails = [], swipeFails = [], pressFails = [], protocol = []; let tapped = 0, swiped = 0, pressed = 0, uncovered = 0, disabledNow = 0;
  try {
    await go(page, home, T);
    // v3.0.1: a page wider than the phone makes the browser lay it out wider and zoom to fit; tap coordinates then miss
    // their targets and every tap read as "nothing changed" (a B2B benchmark build: 58 such fails, one real cause). The
    // overflow is reported once, with the widest elements, and taps on that page are not measured until it is fixed.
    const ovf = await page.evaluate(() => { const cw = document.documentElement.clientWidth, w = Math.max(innerWidth, document.documentElement.scrollWidth); if (w <= cw + 1) return null;
      const wide = [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > cw + 1 && getComputedStyle(e).position !== "fixed" && !e.closest("[style*=overflow], .table-wrap, .scroll")).filter((e, i, a) => !a.some((o) => o !== e && o.contains(e))).slice(0, 3)
        .map((e) => `${e.tagName.toLowerCase()}${e.classList[0] ? "." + e.classList[0] : ""} → ${Math.round(e.getBoundingClientRect().right)}px`); return { w, cw, wide }; }).catch(() => null);
    if (ovf) { tapFails.push({ el: `page ${new URL(home).pathname}`, why: `wider than the phone: lays out at ${ovf.w}px in a ${ovf.cw}px viewport (${ovf.wide.join(", ") || "no single element"}); the browser zooms out, so taps on this page are not measured until it fits` }); return { have: 0, need: 1, parked: 0, protocol: 0, overflow: ovf, tap: { have: 0, need: 1 }, swipe: { have: 0, need: 0 }, longpress: { have: 0, need: 0 }, fails: tapFails.map((f) => ({ gesture: "layout", el: f.el, why: f.why })), errors: errors.slice(0, 3) }; }
    const els0 = await page.evaluate(`(() => { const key = ${KEY}; const out = []; for (const e of document.querySelectorAll(${JSON.stringify(INTERACTIVE)})) { if (!e.checkVisibility || !e.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue; if (e.closest("[aria-hidden=true], [inert]")) continue; if (e.matches(":disabled")) continue; if (out.some((o) => o.el.contains(e))) continue; const href = e.getAttribute("href") || ""; const fixedAnc = (() => { for (let n = e; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === "fixed" || p === "sticky") return true; } return false; })(); const doc = { top: r.top + scrollY, left: r.left + scrollX }; const parked = doc.left + r.width <= 0 || doc.left >= document.documentElement.scrollWidth || doc.top + r.height <= 0 || (fixedAnc && (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth)); out.push({ el: e, key: key(e), label: (e.getAttribute("aria-label") || e.innerText || e.value || e.getAttribute("name") || e.tagName).replace(/\\s+/g, " ").trim().slice(0, 40), tag: e.tagName.toLowerCase(), href, longpress: e.hasAttribute("data-long-press") || e.hasAttribute("data-longpress") || e.hasAttribute("data-hold"), parked, editable: e.isContentEditable, sig: e.tagName + "|" + href + "|" + (e.getAttribute("aria-label") || e.innerText || "").trim().slice(0, 40) + "|" + fixedAnc + "|" + !!e.closest("header, footer, nav") }); if (out.length >= 60) break; } return out.map(({ el, ...x }) => x); })()`);
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
      const pos = await page.evaluate(`(() => { const e = (${FIND})(${JSON.stringify(e.key)}); if (!e) return null; if (e.matches(":disabled")) return { disabled: true }; e.scrollIntoView({ block: "center", inline: "center" }); const rs = e.getClientRects(); const r = rs.length > 1 ? rs[0] : e.getBoundingClientRect(); const x = r.left + Math.min(r.width / 2, Math.max(4, r.width - 4)), y = r.top + r.height / 2; const hit = document.elementFromPoint(x, y); return { x, y, covered: !!hit && !e.contains(hit) && !hit.contains(e) ? (hit.tagName.toLowerCase() + (hit.id ? "#" + hit.id : "")) : null }; })()`).catch(() => null);
      if (!pos) { tapFails.push({ el: e.label, why: "element gone before the tap" }); continue; }
      // v3.0.1: an earlier tap can disable it (a plan of 2 teas disables the other checkboxes once 2 are picked, and the
      // choice is saved, so it holds after the reload); a disabled control does nothing by specification and is skipped
      if (pos.disabled) { disabledNow++; continue; }
      await page.waitForTimeout(T(120)); const idle = await idleTargets(); const before = await state(); const n0 = navs.length, p0 = popups, d0 = page.__dialogs;
      await page.evaluate(() => window.__jm.targets.clear());
      tapping = true; await page.touchscreen.tap(pos.x, pos.y).catch(() => {}); await page.waitForTimeout(T(450));
      // v3.0.2: a link that opens a new tab (an external attribution link, target=_blank) can open it after the 450ms
      // window on a loaded machine; a real link gets up to 1.5s more to open a tab or navigate before it is judged
      if (e.tag === "a" && e.href && !e.href.startsWith("#")) for (let i = 0; i < 10 && popups === p0 && navs.length === n0; i++) await page.waitForTimeout(T(150));
      tapping = false;
      const after = await state().catch(() => null); const changed = await page.evaluate(() => window.__jm.targets.size).catch(() => 0);
      // focus alone is a response only for fields (focusing is what a tap on a field does); a button or link that only takes
      // focus did nothing
      const field = /^(input|select|textarea)$/.test(e.tag) || e.editable;
      const responded = !after ? true : navs.length > n0 || popups > p0 || page.__dialogs > d0 || after.href !== before.href || (field && after.active !== before.active) || Math.abs(after.sy - before.sy) > 2 || Math.abs(after.sx - before.sx) > 2 || after.invalid > before.invalid || after.dialogs !== before.dialogs || changed > idle;
      if (responded) { tapped++; if (changed > idle || after?.dialogs !== before.dialogs) dirty = true; }
      else tapFails.push({ el: `${e.tag} "${e.label}"`, why: pos.covered ? `covered by ${pos.covered} at 375px: the tap lands on it` : "nothing changed after a tap (no DOM change, scroll, navigation, dialog, or focus moving into a field)" });
      // v3.0.1: a navigation stopped by the route above used to be aborted, which leaves Chromium's error page in place;
      // every later tap then landed on that blank page and read as "nothing changed". It is now answered 204 (the browser
      // stays on the page) and the page is reloaded after any tap that navigated, or when it is no longer the site.
      if (navs.length > n0 || !after || /^chrome-error:/.test(page.url()) || (after.href !== before.href && stripHash(after.href) !== stripHash(before.href))) dirty = true;
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
    const need = els.length - disabledNow + scrollers.length + pressN, have = tapped + swiped + pressed;
    return { have, need, parked, protocol: protocol.length, disabled: disabledNow, tap: { have: tapped, need: els.length - disabledNow }, swipe: { have: swiped, need: scrollers.length }, longpress: { have: pressed, need: pressN }, fails: [...tapFails.map((f) => ({ gesture: "tap", el: f.el + where, why: f.why })), ...swipeFails.map((f) => ({ gesture: "swipe", el: f.el + where, why: f.why })), ...pressFails.map((f) => ({ gesture: "long-press", el: f.el + where, why: f.why }))], errors: errors.slice(0, 3) };
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
// v3.0.2: what a success message claims happened, and what an honest prototype says instead. A form that sends nothing
// may still be right (a browser-only save, a labelled simulation, an unavailable feature), but it never says it sent,
// booked, charged or registered something (the v3.0.1 B2B contact form showed "Transmitting Inquiry…" on a timer, then
// "An enterprise solutions specialist will contact you shortly", with no request made).
export const CLAIM_RX = /\b(sent|send(ing)?|transmit\w*|received|submitted|registered|delivered|booked|booking (is )?confirmed|reserv(ed|ation confirmed)|order (is )?(placed|confirmed)|payment (processed|received|successful|complete)|charged|subscribed|we.?ll (be in touch|contact|call|email|reply|get back)|will (contact|call|email|reach out to|get back to) you|(specialist|team|someone) will|check your (inbox|email)|confirmation (email|e-mail))\b/i;
// v3.0.2: a disclosure is a statement that the operation is simulated, not the word "demo" anywhere near the form (a B2B
// site that books sales demos says "Schedule Demo" in its nav and "your demo instance" by its form: that read as disclosed)
export const DISCLOSE_RX = /\b(this is (a |an |only a )?(demo|demonstration|prototype|sample|simulation|test)\b|(demo|demonstration|prototype|sample|practice|preview|test)[- ](only|mode|site|store|shop|build|version|data|order|orders|receipt|account|checkout|content|environment|purposes|payment|purchase|cart)|for (demo|demonstration|testing|illustration) purposes|prototype|simulat\w*|sample data|fictional|not (actually |really )?(sent|processed|charged|booked|submitted|delivered|connected)|nothing (was|is|has been|will be) (sent|charged|processed|booked|submitted|stored)|no (real )?(payment|charge|request|message|email|data) (was |is )?(sent|taken|made|stored)?|(saved|stored|kept) (only )?(on|in) (this|your) (device|browser)|locally|offline)\b/i;
export const UNAVAIL_RX = /\b(unavailable|not (yet )?available|coming soon|not (yet )?(open|enabled|live)|disabled|closed|paused|offline)\b/i;
// a claim is not one when it is denied ("nothing was sent", "not booked", "wasn't charged")
export const claimIn = (t) => { const rx = new RegExp(CLAIM_RX.source, "gi"); let m; while ((m = rx.exec(t))) { const pre = t.slice(Math.max(0, m.index - 28), m.index); if (!/\b(not|nothing|never|no|without|n.t)\b[^.!?]*$/i.test(pre)) return m[0]; } return null; };
const STORE = `(async () => { const o = {}; for (const [p, s] of [["local:", localStorage], ["session:", sessionStorage]]) for (let i = 0; i < s.length; i++) { const k = s.key(i); o[p + k] = s.getItem(k); } o["cookie:"] = document.cookie; try { o["indexedDB:"] = JSON.stringify((await indexedDB.databases()).map((d) => d.name).sort()); } catch {} return o; })()`;
// v3.0.2: a valid submit that made no request is read by what it did. Declared on the form (or an ancestor) with the
// product contract's capability levels (thinking/product-contract.md): data-capability="persisted" (saved in the browser),
// "interaction" (simulated, said so), "interface" (unavailable, said so); otherwise read from behaviour (a storage write
// is persisted, a disclosure is interaction). Returns the operation's own states in place of loading/success/serverError.
export function operationStates({ cap, before = [], shown = [], dest = "", changed = [], kept = null, moved = null }) {
  const said = [...shown, dest].join(" \n "), around = [...before, ...shown, dest].join(" \n ");
  const claims = [...shown, ...(dest ? [dest] : [])].map(claimIn).filter(Boolean);
  const disclosed = DISCLOSE_RX.test(around);
  const kind = cap && ["persisted", "interaction", "interface"].includes(cap) ? cap : changed.length ? "persisted" : disclosed ? "interaction" : UNAVAIL_RX.test(around) && !claims.length ? "interface" : "undeclared";
  const st = {}, why = {};
  const okSaid = OK_RX.test(said.replace(new RegExp(CLAIM_RX.source, "gi"), (w, ...a) => claims.includes(w) ? w : ""));
  if (kind === "interface") { st.honest = !okSaid && !claims.length && UNAVAIL_RX.test(around); if (!st.honest) why.honest = claims.length || okSaid ? `declared unavailable, yet a submit reads as success ("${(claims[0] || said).slice(0, 60)}")` : "declared unavailable, but nothing near the form says so (\"not available yet\", a disabled control with its reason)"; return { kind, st, why }; }
  st.feedback = shown.length > 0 || !!moved; if (!st.feedback) why.feedback = "a valid submit shows nothing: no request, no message, no next step";
  if (kind === "persisted") { st.persisted = changed.length > 0 && kept !== false; if (!st.persisted) why.persisted = !changed.length ? "declared persisted, but nothing was written to localStorage, sessionStorage, cookies or IndexedDB" : `the saved value (${changed[0]}) is gone after a reload`; }
  // a browser save may say "saved"; it may not say it was sent or booked unless it also says that only happened here
  st.honest = !claims.length || disclosed; if (!st.honest) why.honest = `says "${claims[0]}" but no request was made${kind === "persisted" ? " (it was only saved in this browser)" : " and nothing was saved"}: send the request, or say what really happened (a labelled demo: data-capability="interaction"; a browser save: "persisted"; not built: "interface")`;
  if (kind === "undeclared" && st.feedback && st.honest && !disclosed && okSaid) { st.honest = false; why.honest = `a success message ("${said.slice(0, 50)}") with no request and nothing saved: nothing happened; say so, or send the request`; }
  return { kind, st, why };
}
const newTexts = (a, b) => b.texts.filter((t) => !a.texts.includes(t)).concat(b.live.filter((t) => !a.live.includes(t)));
// formPages (from nav): route → number of forms. Known: every page with a form is checked (up to MAX_FORM_PAGES), whatever
// its position in link order (before v3.0.1 only the first 12 pages were, so a checkout or contact page linked late was
// never checked and the axis read n/a). Unknown (a single page): the page itself.
export async function formsAxis(browser, home, T, pages = [home], formPages = null) {
  const all = { have: 0, need: 0, forms: [], fails: [], notes: [], uncovered: [], live: [] };
  const key = (u) => norm(new URL(u).pathname);
  const targets = formPages ? pages.filter((u) => formPages[key(u)]) : pages.slice(0, SAMPLE);
  for (const pg of targets.slice(0, MAX_FORM_PAGES)) { const r = await formsOne(browser, pg, T, pages.length > 1); all.have += r.have; all.need += r.need; all.forms.push(...r.forms); all.fails.push(...r.fails); all.uncovered.push(...(r.uncovered || [])); all.live.push(...(r.live || [])); }
  for (const pg of targets.slice(MAX_FORM_PAGES)) all.uncovered.push(`${key(pg)}: ${formPages[key(pg)]} form(s), page beyond the ${MAX_FORM_PAGES}-page cap`);
  all.ok = all.need === 0 ? null : all.have === all.need;
  if (!all.need) all.notes.push(formPages ? `no form with fields on any of ${pages.length} loaded page(s)` : pages.length > 1 ? `no form with fields on any of ${Math.min(SAMPLE, pages.length)} page(s)` : "no form with fields on this page");
  else if (formPages) all.notes.push(`${Math.min(targets.length, MAX_FORM_PAGES)} page(s) with forms checked: ${targets.slice(0, 8).map(key).join(", ")}${targets.length > 8 ? " …" : ""}`);
  if (all.live.length) all.notes.push(`live control(s), no submit (applied on change, states not required): ${all.live.slice(0, 4).join("; ")}${all.live.length > 4 ? ` … ${all.live.length - 4} more` : ""}`);
  const ops = all.forms.filter((r) => r.notes?.length).map((r) => `${r.form}: ${r.notes.join("; ")}`); if (ops.length) all.notes.push(`no request on submit, read by what it did (v3.0.2): ${ops.slice(0, 4).join(" · ")}${ops.length > 4 ? ` … ${ops.length - 4} more` : ""}`);
  all.prototype = all.forms.filter((r) => ["persisted", "interaction", "interface"].includes(r.operation)).map((r) => `${r.form}: ${r.operation === "persisted" ? "saved in this browser only" : r.operation === "interaction" ? "simulated, labelled" : "unavailable, labelled"}`);
  if (all.uncovered.length) all.notes.push(`not checked (reported, not passed): ${all.uncovered.slice(0, 4).join("; ")}${all.uncovered.length > 4 ? ` … ${all.uncovered.length - 4} more` : ""}`);
  return all;
}
async function formsOne(browser, home, T, multi) {
  const probe = await ctxPage(browser); let forms = [];
  try { await go(probe.page, home, T); forms = await probe.page.evaluate(`(() => [...document.forms].map((f, i) => ({ i, id: f.id || null, action: f.getAttribute("action") || "", method: (f.getAttribute("method") || "get").toLowerCase(), fields: [...f.querySelectorAll("input, textarea, select")].filter((x) => !["hidden", "submit", "button", "reset"].includes(x.type)).length, cap: (f.closest("[data-capability]")?.getAttribute("data-capability") || "").toLowerCase() || null, label: (f.getAttribute("aria-label") || f.querySelector("h1,h2,h3,legend,label")?.innerText || f.id || "form " + (i + 1)).trim().slice(0, 40), live: !(f.querySelector("button[type=submit], input[type=submit], input[type=image], button:not([type])") || (f.id && document.querySelector('button[form="' + CSS.escape(f.id) + '"]'))) && ![...f.querySelectorAll("input, textarea")].some((x) => !["hidden", "checkbox", "radio", "range", "color", "file", "submit", "button", "reset"].includes(x.type)) })).filter((f) => f.fields > 0))()`); } finally { await probe.ctx.close(); }
  // v3.0.1: a form with no submit control and no typed field (selects, checkboxes, radios only) is a live control, a
  // catalogue filter applied on change: it is never submitted, so validation and request states do not apply. Before,
  // a shop's "Refine" filter read as 4 missing states ("native form submit") in a paired ecommerce benchmark.
  const live = forms.filter((f) => f.live).map((f) => `${String(f.label || "form").replace(/\s+/g, " ").trim().slice(0, 40)}${multi ? ` (${new URL(home).pathname})` : ""}`); forms = forms.filter((f) => !f.live);
  if (!forms.length && live.length) return { ok: null, have: 0, need: 0, fails: [], forms: [], live, notes: [] };
  if (!forms.length) return { ok: null, have: 0, need: 0, fails: [], forms: [], notes: ["no form with fields on this page"] };
  const uncovered = forms.slice(MAX_FORMS_PER_PAGE).map((f) => `${new URL(home).pathname}: form "${String(f.label || "form").replace(/\s+/g, " ").trim().slice(0, 60)}" (beyond ${MAX_FORMS_PER_PAGE} per page)`); forms = forms.slice(0, MAX_FORMS_PER_PAGE);
  const results = [];
  for (const f of forms) {
    const st = { default: false, validation: false, loading: false, success: false, serverError: false }; const why = {}; const unverified = []; const notes = []; let opKind = null; const sel = `document.forms[${f.i}]`;
    const run = async (mode) => {
      const { ctx, page, errors } = await ctxPage(browser); let requests = 0, api = 0, nativeNav = false, scriptNav = null; const held = [];
      // what a native submit of this form would load: its action (or the page itself) by its method
      const target = stripHash(new URL(f.action || home, home).href).split("?")[0];
      await page.route("**/*", async (route) => { const rq = route.request(); const isDoc = rq.isNavigationRequest() && rq.frame() === page.mainFrame(); const isApi = ["fetch", "xhr"].includes(rq.resourceType()) && rq.method() !== "GET" || (["fetch", "xhr"].includes(rq.resourceType()) && mode.armed);
        if (mode.armed && (isApi || (isDoc && stripHash(rq.url()) !== stripHash(home)))) { requests++; if (!isDoc) api++;
          // v3.0.1: only a load of the form's own target is a native submit; a script that saves in the browser and then moves
          // to another route (location.assign("/checkout")) is the next step of a flow, not the server's page
          if (isDoc) { if (rq.method() !== "GET" || stripHash(rq.url()).split("?")[0] === target) nativeNav = true; else { if (!scriptNav) scriptNav = new URL(rq.url()).pathname; return route.continue().catch(() => {}); } } // v3.0.2: the flow's real next page loads, so what it says can be read
          await new Promise((r) => setTimeout(r, mode.delay)); const code = mode.code; return route.fulfill({ status: code, contentType: isDoc ? "text/html" : "application/json", body: isDoc ? `<!doctype html><title>${code}</title><p>${code}</p>` : JSON.stringify(code < 400 ? { ok: true, message: "ok" } : { ok: false, error: "Server error" }) }).catch(() => {}); }
        return route.continue().catch(() => {}); });
      try {
        await go(page, home, T);
        await page.evaluate(`(() => { window.__jf = ${sel}; window.__jfRegion = ${sel}?.parentElement || null; })()`);
        const fh = await page.evaluateHandle(`${sel}`); await page.evaluate((form) => form.scrollIntoView({ block: "center" }), fh).catch(() => {});
        const s0 = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`);
        return await mode.fn({ page, fh, s0, errors, store: () => page.evaluate(STORE).catch(() => ({})), requests: () => requests, api: () => api, nativeNav: () => nativeNav, scriptNav: () => scriptNav, arm: () => { mode.armed = true; } });
      } finally { await ctx.close(); }
    };
    const submit = async (page) => { await page.evaluate(`(() => { const f = ${sel}; const b = f.querySelector("button[type=submit], input[type=submit], button:not([type])") || document.querySelector('button[form="' + f.id + '"]'); if (b) b.click(); else if (f.requestSubmit) f.requestSubmit(); else f.submit(); })()`).catch(() => {}); };
    // 1 default + 2 validation (submit empty)
    await run({ code: 200, delay: 0, fn: async ({ page, s0 }) => {
      const lab = await page.evaluate(`(() => { const f = ${sel}; const miss = []; for (const x of f.querySelectorAll("input, textarea, select")) { if (["hidden", "submit", "button", "reset"].includes(x.type)) continue; const named = x.getAttribute("aria-label") || x.getAttribute("aria-labelledby") || x.closest("label") || (x.id && document.querySelector('label[for="' + CSS.escape(x.id) + '"]')) || x.title; if (!named) miss.push(x.name || x.type); } return miss; })()`);
      // v3.0.1: a form hidden when the page loads sits behind a state a fresh browser cannot reach (a checkout behind an empty
      // cart, an account form behind sign-in): none of its states can be seen, so all five are not verified, never passed.
      // They are listed under "not checked" for the journey walk. Before, an ecommerce checkout read as 2 fails.
      if (!s0.formVisible) { unverified.push("default", "validation", "loading", "success", "serverError"); why.default = why.validation = why.loading = why.success = why.serverError = "not verified: the form is hidden when the page loads (behind a state a fresh browser does not have, such as an empty cart or a signed-out account); walk it by hand"; return; }
      st.default = !lab.length; if (lab.length) why.default = `field(s) without a label: ${lab.join(", ")}`;
      await page.evaluate(`(${CLEAR})(${sel})`);
      // v3.0.1: a submit control the form keeps disabled while it is incomplete cannot be used empty: the empty submit cannot
      // happen, so the validation state is not verified (not failed); the guidance it shows meanwhile is reported
      const locked = await page.evaluate(`(() => { const f = ${sel}; const b = f.querySelector("button[type=submit], input[type=submit], button:not([type])") || (f.id && document.querySelector('button[form="' + f.id + '"]')); return !!b && (b.disabled || b.getAttribute("aria-disabled") === "true"); })()`).catch(() => false);
      if (locked) { unverified.push("validation"); why.validation = "not verified: the submit control is disabled while the form is incomplete, so an empty submit cannot happen"; return; }
      await submit(page); await page.waitForTimeout(T(700));
      const s1 = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null);
      if (!s1) { why.validation = "the page navigated away on an empty submit (no validation)"; return; }
      const fresh = newTexts(s0, s1); const styled = s1.fields.some((x, k) => x !== s0.fields[k]);
      st.validation = fresh.some((t) => ERR_RX.test(t)) || styled || s1.live.some((t) => ERR_RX.test(t));
      if (!st.validation) why.validation = "an empty submit shows no designed error (no message, no field style change; a browser bubble alone does not count)";
    } });
    // 3 loading + 4 success: the request is held 2 s, then answered 200
    if (!unverified.includes("loading")) await run({ code: 200, delay: 2000, fn: async ({ page, s0, requests, api, nativeNav, scriptNav, arm, store }) => {
      await page.evaluate(`(${FILL})(${sel})`); const sf = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => s0); const sto0 = await store(); arm(); await submit(page);
      // v3.0.1: sampled from the submit on (every 100 ms for 500 ms), against the filled form: a flow that saves in the browser
      // and moves on within 500 ms showed its pending state only before the snapshot; and filling alone (a submit button
      // enabled once the form is complete) is not a loading state
      const INV = `(() => { const f = ${sel} || window.__jf; return f ? f.querySelectorAll("[aria-invalid=true], :invalid").length : 0; })()`;
      let mid = null, hit = null, inv0 = null; for (let k = 0; k < 5; k++) { await page.waitForTimeout(T(100)); if (k === 0) inv0 = await page.evaluate(INV).catch(() => 0); const m = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null); if (m) mid = m; if (m && !hit && (m.btn !== sf.btn || m.busy)) hit = m; } if (hit) mid = hit;
      // v3.0.1: the check's filled values were rejected by the form's own validation (a calendar that only takes available
      // dates, a pattern the filler cannot guess): the submit was not valid, so the request states are not verified, not
      // failed. Before, this read "no request was made on a valid submit" (a booking benchmark build, 6 false fails).
      if (!requests() && mid) { const said = newTexts(s0, mid).filter((t) => ERR_RX.test(t) && !OK_RX.test(t)); // read right after the submit: a form that resets itself after a fake success would read as invalid later
        const inv = inv0 ?? 0;
        if (said.length || inv) { unverified.push(...["loading", "success", "serverError"]); why.loading = why.success = why.serverError = `not verified: the form rejected the check's filled values${said.length ? ` ("${said[0].slice(0, 70)}")` : ` (${inv} invalid field(s))`}; fill it by hand or add a fixture value`; return; } }
      // v3.0.2: no request on a valid submit. A declared backend form fails as before; any other form is read by what it did
      // (operationStates): the request states do not apply to it, its own do
      const asOp = async (moved) => { if (moved) await page.waitForLoadState("load", { timeout: T(4000) }).catch(() => {}); else await page.waitForTimeout(T(1200));
        const end = moved ? null : await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null);
        const shown = [...new Set([...(mid ? newTexts(s0, mid) : []), ...(end ? newTexts(s0, end) : [])])];
        const dest = moved ? String(await page.evaluate("(document.querySelector('main') || document.body)?.innerText || ''").catch(() => "")).replace(/\s+/g, " ").slice(0, 1500) : "";
        const sto1 = await store(); const changed = Object.keys({ ...sto0, ...sto1 }).filter((k) => sto1[k] !== sto0[k]);
        let kept = null; if (changed.length) { await page.reload({ waitUntil: "load", timeout: T(8000) }).catch(() => {}); const sto2 = await store(); kept = changed.every((k) => sto2[k] === sto1[k]); }
        const op = operationStates({ cap: f.cap, before: s0.texts, shown, dest, changed, kept, moved });
        opKind = op.kind; delete st.loading; delete st.success; delete st.serverError; if (moved) { st.loading = loadingSeen; if (!st.loading) why.loading = "nothing changed between the submit and the next page"; }
        Object.assign(st, op.st); Object.assign(why, op.why); notes.push(`${op.kind === "undeclared" ? "no request, nothing saved, nothing disclosed" : op.kind === "persisted" ? (changed.length ? `browser-only (persisted: ${changed.slice(0, 2).join(", ")})` : "declared persisted, nothing saved") : op.kind === "interaction" ? "simulated (disclosed)" : "unavailable (disclosed)"}${moved ? `, then moves to ${moved}` : ""}`); };
      if (!requests() && !["backend", "integration"].includes(f.cap)) { await asOp(null); return; }
      if (!requests()) { why.loading = "declared backend (data-capability), but no request was made on a valid submit"; why.success = "declared backend, but no request was made: success cannot follow a server answer"; why.serverError = "declared backend, but no request was made"; if (mid && newTexts(s0, mid).some((t) => OK_RX.test(t))) why.success += " (a success message appears without any request)"; return; }
      if (nativeNav()) { why.loading = "native form submit: the page navigates; no in-page loading state"; why.success = "native form submit: success is whatever page the server returns, not a designed state"; why.serverError = "native form submit: a server error shows the server's page, not a designed state"; return; }
      const loadingSeen = !!mid && (mid.btn !== sf.btn || mid.busy || newTexts(sf, mid).some((t) => /send|sending|submitting|saving|loading|wait|…|\.\.\./i.test(t)));
      // v3.0.2: a script that saves in the browser and moves to the next page is a browser-only step: read like any other
      // no-request operation, including what the next page claims (before: success passed, server error "not verified")
      if (scriptNav() && !api() && !["backend", "integration"].includes(f.cap)) { await asOp(scriptNav()); return; }
      st.loading = loadingSeen;
      if (!st.loading) why.loading = "nothing changed while the request was pending (button, aria-busy, progress, text)";
      if (scriptNav() && !api()) { st.success = true; unverified.push("serverError"); why.serverError = `not verified: declared backend, but the form only moves to ${scriptNav()} with no request`; return; }
      // v3.0.2: a second submit while the first request is pending must not send a second one (a double order, a double charge)
      if (api() && !nativeNav()) { const n0 = requests(); await submit(page); await page.waitForTimeout(T(300)); st.duplicate = requests() === n0; if (!st.duplicate) why.duplicate = "a second submit while the first request was pending sent another request (no guard against double submission: disable the control or ignore repeats)"; }
      await page.waitForTimeout(T(2600)); const end = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null);
      const shown = end ? newTexts(s0, end) : [];
      st.success = !!end && (shown.some((t) => OK_RX.test(t)) || (!end.formVisible && shown.length > 0));
      if (!st.success) why.success = shown.length ? `after a 200 the new text does not read as success: "${shown[0].slice(0, 50)}"` : "after a 200 nothing new is shown";
    } });
    // 5 server error: the request answered 500
    if (!opKind && !why.serverError && !unverified.includes("serverError") && "serverError" in st) await run({ code: 500, delay: 600, fn: async ({ page, s0, requests, arm }) => {
      await page.evaluate(`(${FILL})(${sel})`); arm(); await submit(page); await page.waitForTimeout(T(2200));
      if (!requests()) { why.serverError = "no request was made, so a server error cannot happen or be shown"; return; }
      const end = await page.evaluate(`(${SNAPF})(${sel} || window.__jf)`).catch(() => null); const shown = end ? newTexts(s0, end) : [];
      st.serverError = shown.some((t) => ERR_RX.test(t) && !OK_RX.test(t));
      if (!st.serverError) why.serverError = shown.some((t) => OK_RX.test(t)) ? "after a 500 the form shows success" : "after a 500 no error is shown";
    } });
    results.push({ form: String(f.label || "form").replace(/\s+/g, " ").trim().slice(0, 60) + (multi ? ` (${new URL(home).pathname})` : ""), method: f.method, action: f.action, capability: f.cap, operation: opKind || (f.cap || "request"), notes, states: Object.fromEntries(Object.entries(st).filter(([k]) => !unverified.includes(k))), unverified, why });
  }
  const need = results.reduce((n, r) => n + Object.keys(r.states).length, 0), have = results.reduce((n, r) => n + Object.values(r.states).filter(Boolean).length, 0);
  const notVerified = results.filter((r) => r.unverified?.length).map((r) => `${r.form}: ${r.unverified.join(", ")} not verified (${[...new Set(r.unverified.map((k) => r.why[k]))].join("; ")})`);
  return { ok: have === need, have, need, forms: results, live, uncovered: [...uncovered, ...notVerified], fails: results.flatMap((r) => Object.entries(r.states).filter(([, v]) => !v).map(([k]) => ({ form: r.form, state: k, why: r.why[k] || "missing" }))), notes: [] };
}

// ── loading ───────────────────────────────────────────────────────────────────
export async function loadingAxis(browser, home, T, pages = [home]) {
  const all = { have: 0, need: 0, fails: [], surfaces: [], notes: [] }; let req = 0;
  for (const pg of pages.slice(0, SAMPLE)) { const r = await loadingOne(browser, pg, T); all.have += r.have; all.need += r.need; req += r.requests || 0; const where = pages.length > 1 ? ` (${new URL(pg).pathname})` : ""; all.fails.push(...r.fails.map((f) => ({ ...f, surface: f.surface + where }))); all.surfaces.push(...(r.surfaces || []).map((s) => ({ ...s, page: new URL(pg).pathname }))); }
  all.ok = all.need === 0 ? null : all.have === all.need;
  all.notes.push(all.need ? `${req} request(s) held 2.5 s before release${pages.length > 1 ? `, across ${Math.min(SAMPLE, pages.length)} page(s)` : ""}` : req ? `${req} request(s) after load, but nothing on the page changed when they returned: no async surface` : "no fetch or XHR request after load: no async surface");
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
  await guard("nav", () => navAxis(browser, home, T, opts.contractRoutes || []));
  const pages = out.nav?.pages?.length ? samplePages(out.nav.pages, out.nav.formPages || {}, home) : [home];
  await guard("mobile", () => mobileAxis(browser, home, T, pages));
  await guard("forms", () => formsAxis(browser, home, T, pages, out.nav?.formPages || null));
  await guard("loading", () => loadingAxis(browser, home, T, pages));
  await guard("errors", () => errorsAxis(browser, home, T));
  await guard("session", () => sessionAxis(browser, home, T, (out.nav?.pages || []).map((u) => norm(new URL(u).pathname))));
  // v3.0.2: a sitemap route reached by submitting a form (the flow moved there) is a flow page, not a missing link
  const flowTo = new Map((out.forms?.forms || []).flatMap((f) => (f.notes || []).map((n) => [n.match(/moves to (\S+)$/)?.[1], f.form])).filter(([r]) => r).map(([r, f]) => [norm(r), f]));
  if (out.nav?.fails?.length && flowTo.size) { const kept = []; for (const f of out.nav.fails) { if (f.route && flowTo.has(f.route) && /not reachable/.test(f.why)) { out.nav.have++; const ni = (out.nav.noindexed || []).includes(f.route); out.nav.excused = [...(out.nav.excused || []), { route: f.route, entry: "flow", via: flowTo.get(f.route), noindex: ni }]; out.nav.notes.push(`${f.route}: reached by submitting "${flowTo.get(f.route)}" (a flow page, not a missing link)${ni ? "" : "; it is in sitemap.xml and indexable: noindex it or drop it from the sitemap"}`); } else kept.push(f); } out.nav.fails = kept; out.nav.ok = kept.length === 0; }
  // coverage: what this run did and did not reach, stated so a pass is never read as "every page was checked"
  const pk = (u) => norm(new URL(u).pathname); const fp = out.nav?.formPages || {};
  out.coverage = { routes: out.nav?.routes?.length || 0, loaded: out.nav?.pages?.length || 0, notLoaded: out.nav?.unloaded || [], contractUnreached: out.nav?.contractUnreached || [], unreached: (out.nav?.fails || []).filter((f) => f.route && !/^broken/.test(f.why)).map((f) => f.route),
    sampled: pages.slice(0, SAMPLE).map(pk), notSampled: pages.slice(SAMPLE).map(pk), formPages: Object.keys(fp), formsChecked: (out.forms?.forms || []).length, formsUncovered: out.forms?.uncovered || [] };
  const counts = Object.fromEntries(JOURNEY_AXES.map((k) => [k, out[k].ok === false ? Math.max(1, out[k].fails.length) : 0]));
  return { ...out, counts, fails: Object.values(counts).reduce((a, b) => a + b, 0), pass: Object.values(counts).every((n) => n === 0), segment: `journey: ${JOURNEY_AXES.map((k) => `${k}${out[k].ok === null ? "-" : counts[k]}`).join(" ")}` };
}
const SUM = { nav: (r) => `${r.have}/${r.need} route(s) reachable from home in ≤ ${MAX_CLICKS} clicks${r.depths ? ` (${Object.entries(r.depths).map(([p, d]) => `${p}:${d}`).slice(0, 8).join(" ")}${Object.keys(r.depths).length > 8 ? " …" : ""})` : ""}`,
  mobile: (r) => `${r.have}/${r.need} interactive element(s) respond at 375px · tap ${r.tap?.have}/${r.tap?.need} · swipe ${r.swipe?.need ? `${r.swipe.have}/${r.swipe.need}` : "n/a"} · long-press ${r.longpress?.need ? `${r.longpress.have}/${r.longpress.need}` : "n/a"}`,
  forms: (r) => `${r.have}/${r.need} form state(s) rendered${r.forms?.length ? ` · ${r.forms.map((f) => `${f.form}: ${Object.entries(f.states).map(([k, v]) => `${k}${v ? "✓" : "✗"}`).join(" ")}${f.unverified?.length ? " " + f.unverified.map((k) => `${k}?`).join(" ") : ""}`).join(" · ")}` : ""}`,
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
  const c = j.coverage; if (c) {
    L.push(`    coverage ${c.loaded} page(s) loaded of ${c.routes} required route(s) · forms checked on every page that has one (${c.formPages.length} page(s), ${c.formsChecked} form(s)) · tap and loading sampled on ${c.sampled.length} page(s)`);
    for (const [k, xs] of [["not reached", c.unreached], ["Scope routes no link reaches (check them in the journey walk)", c.contractUnreached], ["found, not loaded", c.notLoaded], ["not sampled for tap/loading", c.notSampled], ["forms not checked", c.formsUncovered]]) if (xs.length) L.push(`               · ${k}: ${xs.slice(0, 6).join(", ")}${xs.length > 6 ? ` … ${xs.length - 6} more` : ""}`);
  }
  L.push(`    ${j.segment} → ${j.pass ? "PASS" : `FAIL (${j.fails} missing)`}`);
  return L;
}
