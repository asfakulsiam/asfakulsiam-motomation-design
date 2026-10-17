// The four rule sets as page checks: copy (C), SEO (S), performance (P), security (K). gate/4 axes.
// Pure functions over facts the gate collects from the page (visible text, head tags, images, scripts, response
// headers, raw HTML), so tests can feed them plain objects (tests/gate/rulesets.test.mjs). Each returns
//   { fails: [{ id, why, at }], warns: [{ id, why, at }], checked }
// and the axis count is the number of distinct failing rule IDs (one per rule, however many places it fails), so the
// same page gives the same count. Rule IDs and the reasoning are in craft/copy.md, craft/seo.md, craft/performance.md
// and craft/security.md.

const uniq = (xs) => [...new Set(xs)];
export const countOf = (r) => uniq(r.fails.map((f) => f.id)).length;
const clip = (s, n = 60) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const SKIP = /\[NEEDS COPY/;

// ── C · copy ────────────────────────────────────────────────────────────────
export const EM_DASH = /\u2014/;
// "It's not X, it's Y" and its family (copy-09)
export const APHORISM = [
  /\b(?:it|this|that)(?:'s|’s| is) not (?:just |only |merely |simply |about )?[^,.;:!?\u2014]{1,40}[,;.:\u2014]\s*(?:it|this|that)(?:'s|’s| is)\b/i,
  /\b(?:isn't|isn’t|aren't|aren’t|is not|are not) (?:just |about |only )?[^,.;:!?\u2014]{1,40}[,;.:\u2014]\s*(?:it|they|this)(?:'s|’s|'re|’re| is| are)\b/i,
];
// "Not just X, but Y" / "Not just a hotel. A home." / "more than just a …" (copy-15)
export const ANTITHESIS = [
  /\bnot (?:just|only|merely|simply) (?:a |an |the )?[^,.;:!?\u2014]{1,40}?,?\s+but\b/i,
  /\b[Nn]ot (?:just|only|merely) (?:a |an |the )?[\w'’ -]{1,30}[.!]\s+(?:[Aa] |[Aa]n |[Tt]he )?[A-Z]/,
  /\bmore than (?:just )?(?:a|an) [\w'’-]+(?:[ -][\w'’-]+)?[.!,]/i,
];
// warm-up openers at the start of a block (copy-11)
export const OPENER = /^(?:in today['’]s\b|in a world where\b|in an era\b|in this day and age\b|now more than ever\b|imagine a world\b|welcome to (?:the|our)\b|are you (?:tired|looking|ready)\b|have you ever\b|let['’]s face it\b|picture this\b|ever wondered\b)/i;
// labels that don't say what happens (copy-17)
export const VAGUE_CTA = /^(?:learn more|read more|click here|here|submit|more|see more|find out more|discover more|explore|details|go)$/i;
export const UNSOURCED = /\b(?:trusted by|loved by|used by|join) (?:over |more than )?[\d][\d,.]*\s?(?:k|m)?\+?\s/i;

export function copyRules({ blocks = [], ctas = [], extras = [] } = {}) {
  // blocks: [{ tag, text }] visible text per block element (p, h1–h6, li, blockquote, figcaption, td, dd, span…)
  // ctas:   [{ tag, text }] visible link and button labels
  // extras: [{ where, text }] alt text, <title>, meta description: copy the reader sees outside the body flow
  const fails = [], warns = [];
  const all = [...blocks.map((b) => ({ at: b.tag, text: b.text })), ...ctas.map((c) => ({ at: c.tag, text: c.text })), ...extras.map((e) => ({ at: e.where, text: e.text }))].filter((x) => x.text && !SKIP.test(x.text));
  for (const x of all) {
    if (EM_DASH.test(x.text)) fails.push({ id: "copy-04", why: "em dash in visible copy", at: `${x.at} "${clip(x.text)}"` });
    if (APHORISM.some((r) => r.test(x.text))) fails.push({ id: "copy-09", why: "aphorism formula (it's not X, it's Y)", at: `${x.at} "${clip(x.text)}"` });
    if (ANTITHESIS.some((r) => r.test(x.text))) fails.push({ id: "copy-15", why: "two-beat antithesis (not just X, but Y)", at: `${x.at} "${clip(x.text)}"` });
    if (UNSOURCED.test(x.text)) warns.push({ id: "copy-16", why: "a usage claim with a number; is it sourced?", at: `${x.at} "${clip(x.text)}"` });
  }
  for (const b of blocks) {
    if (!b.text || SKIP.test(b.text)) continue;
    if (OPENER.test(b.text.trim())) fails.push({ id: "copy-11", why: "warm-up opener", at: `${b.tag} "${clip(b.text)}"` });
    if (b.tag === "p" && b.text.split(/\s+/).length > 90) warns.push({ id: "copy-06", why: `${b.text.split(/\s+/).length}-word paragraph; break it up (2–4 lines)`, at: `p "${clip(b.text, 40)}"` });
  }
  for (const c of ctas) if (VAGUE_CTA.test((c.text || "").trim())) fails.push({ id: "copy-17", why: "label doesn't say what happens", at: `${c.tag} "${c.text.trim()}"` });
  return { fails, warns, checked: all.length };
}

// ── S · SEO ─────────────────────────────────────────────────────────────────
export const TITLE_MAX = 60, DESC_MAX = 160, MIN_INTERNAL_LINKS = 3;
// Error pages (404, 500, any error view) have no canonical URL: a canonical names the one address search engines should
// index for this content, and an error view is not content at any address (it is served at whatever URL failed). A
// canonical on a 404 would point every broken URL at one indexable page, the "soft 404" search engines penalise. So
// seo-04 is not required on them; a canonical that is present anyway is a warning. An error page is a response with
// status ≥ 400 (an unknown route served by the site) or a file/route named for one (404.html, 500.html, error.html,
// not-found, _error), which a static host serves with 200 when the file is opened directly.
export const ERROR_PAGE_PATH = /(?:^|\/)(?:40[0-9]|50[0-9]|error|not-found|_error)(?:\.html?)?\/?$/i;
export const isErrorPage = (pageUrl, status = null) => (Number.isFinite(status) && status >= 400) || ERROR_PAGE_PATH.test(new URL(pageUrl).pathname);
// the distinct pages a sitemap.xml lists other than pageUrl (its own path, index.html and a trailing slash ignored);
// null when the text has no <loc>, so a site without a sitemap keeps the full seo-11 minimum
export function sitemapPages(xml, pageUrl) {
  const locs = [...String(xml || "").matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]); if (!locs.length) return null;
  const path = (h) => { try { return new URL(h, pageUrl).pathname.replace(/\/index\.html?$/i, "/").replace(/\.html?$/i, "").replace(/\/+$/, "") || "/"; } catch { return null; } };
  const self = path(pageUrl); return uniq(locs.map(path).filter((p) => p && p !== self)).length;
}
export function seoRules({ pageUrl, title = null, description = null, robots = [], canonicals = [], headings = [], links = [], jsonld = [], ogImage = null, ogWidth = null, ogHeight = null, subresources = [], status = null, sitePages = null } = {}) {
  const fails = [], warns = [], f = (id, why, at = "") => fails.push({ id, why, at }), w = (id, why, at = "") => warns.push({ id, why, at });
  const page = new URL(pageUrl); const local = /^(127\.0\.0\.1|localhost|\[::1\])$/.test(page.hostname) || page.protocol === "file:";
  if (robots.some((r) => /noindex/i.test(r))) f("seo-03", "robots meta says noindex");
  if (isErrorPage(pageUrl, status)) { if (canonicals.length) w("seo-04", "error page has a canonical tag; an error page has no canonical URL (remove it)"); }
  else if (canonicals.length !== 1) f("seo-04", canonicals.length ? `${canonicals.length} canonical tags` : "no canonical tag");
  else if (!/^https?:\/\//.test(canonicals[0])) (local ? w : f)("seo-04", `canonical "${canonicals[0]}" is not absolute${local ? " (accepted for a local file)" : ""}`);
  if (!title) f("seo-05", "no <title>"); else if (title.length > TITLE_MAX) f("seo-05", `title is ${title.length} characters (≤ ${TITLE_MAX})`, `"${clip(title)}"`);
  if (!description) f("seo-06", "no meta description"); else if (description.length > DESC_MAX) f("seo-06", `meta description is ${description.length} characters (≤ ${DESC_MAX})`);
  const h1 = headings.filter((l) => l === 1).length; if (h1 !== 1) f("seo-07", `${h1} h1 elements (exactly 1)`);
  let prev = 0; for (const l of headings) { if (prev && l > prev + 1) { f("seo-08", `heading level skipped: h${prev} → h${l}`); break; } prev = l; }
  for (const j of jsonld) { try { JSON.parse(j); } catch { f("seo-10", "a JSON-LD block does not parse"); break; } }
  if (!jsonld.length) w("seo-10", "no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible");
  const internal = []; const badSlugs = [];
  for (const href of links) {
    let u; try { u = new URL(href, pageUrl); } catch { continue; }
    if (!/^https?:$/.test(u.protocol) || u.origin !== page.origin) continue;
    if (u.pathname === page.pathname && u.search === page.search) continue; // a #fragment on this page is not another page
    internal.push(u.href);
    const slug = decodeURIComponent(u.pathname);
    if (/[A-Z_]/.test(slug) || u.search || /\/\d{3,}(?:\/|$|\.)/.test(slug) || /\/[0-9a-f]{16,}(?:\/|$)/i.test(slug)) badSlugs.push(u.pathname + u.search);
  }
  // the minimum is 3, or every other page when the site's sitemap lists fewer than 3 (a one-page site needs none)
  const minLinks = Number.isFinite(sitePages) ? Math.min(MIN_INTERNAL_LINKS, sitePages) : MIN_INTERNAL_LINKS;
  if (uniq(internal).length < minLinks) f("seo-11", `${uniq(internal).length} internal link(s) to other pages (≥ ${minLinks}${minLinks < MIN_INTERNAL_LINKS ? `: sitemap.xml lists ${sitePages} other page(s)` : ""})`);
  if (canonicals[0]) { try { const c = new URL(canonicals[0], pageUrl); if (/[A-Z_]/.test(c.pathname) || c.search) badSlugs.push(c.pathname + c.search); } catch {} }
  if (badSlugs.length) f("seo-17", "URL slugs need lowercase, hyphens, no IDs, no parameters", badSlugs.slice(0, 3).join(" "));
  const mixed = subresources.filter((s) => /^http:\/\//i.test(s) && !/^http:\/\/(127\.0\.0\.1|localhost)(:|\/)/i.test(s));
  if (mixed.length) f("seo-16", `${mixed.length} subresource(s) over plain http`, mixed.slice(0, 2).join(" "));
  if (!ogImage) f("seo-18", "no og:image");
  else if (ogWidth !== null || ogHeight !== null) { if (+ogWidth !== 1200 || +ogHeight !== 630) f("seo-18", `og:image is ${ogWidth}×${ogHeight} (1200×630)`); }
  else w("seo-18", "og:image size not stated (add og:image:width 1200 and og:image:height 630)");
  return { fails, warns, checked: 14 };
}

// ── P · performance ────────────────────────────────────────────────────────
export function perfRules({ images = [], scripts = [], jsKB = 0, budgetKB = 250, foldPx = 900 } = {}) {
  // images:  [{ src, top, area, loading, inPictureModern }]  measured at 1440×900 before any scroll
  // scripts: [{ src, inline, inHead, defer, async, type, text }]  text: inline code, or the fetched same-origin file
  const fails = [], warns = [], f = (id, why, at = "") => fails.push({ id, why, at });
  const vis = images.filter((i) => i.area > 0);
  for (const i of vis) if (/\.(jpe?g|png|gif)(\?|#|$)|^data:image\/(jpe?g|png|gif)/i.test(i.src || "") && !i.inPictureModern) f("perf-01", "raster image with no AVIF/WebP source", clip(i.src || "", 50));
  // a data: URI is already in the document, so lazy-loading it saves no request; perf-02 is about network images
  for (const i of vis) if (i.top >= foldPx && i.loading !== "lazy" && !/^data:/i.test(i.src || "")) f("perf-02", `below-the-fold image (top ${Math.round(i.top)}px) without loading="lazy"`, clip(i.src || "", 50));
  const lcp = vis.filter((i) => i.top < foldPx).sort((a, b) => b.area - a.area)[0];
  if (lcp && lcp.loading === "lazy") f("perf-03", "the largest first-screen image is lazy-loaded", clip(lcp.src || "", 50));
  if (jsKB > budgetKB) f("perf-04", `${jsKB} KB of JS gzipped (budget ${budgetKB} KB)`);
  const JS = (t) => !t || /^(text|application)\/(java|ecma)script$|^module$/i.test(t);
  for (const s of scripts) {
    if (s.inline && JS(s.type) && !(s.text || "").replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|<!--|-->/g, "").trim()) f("perf-11", "inline script with no code (empty or comments only)");
    // a nomodule script (Next.js polyfills) is never fetched or run by a browser that supports modules, so it blocks nothing
    if (!s.inline && s.inHead && !s.noModule && (!s.type || /javascript/i.test(s.type)) && !s.defer && !s.async) f("perf-12", "render-blocking script in <head> (add defer or async)", clip(s.src || "", 50));
    const t = s.text || ""; if (t.length > 2048) { const lines = t.split("\n"); const comments = (t.match(/^\s*\/\*[\s\S]*?\*\/|^\s*\/\/[^\n]*/gm) || []).join("").length; // comments that start a line (a "//" inside a URL string is not one)
      if (comments / t.length > 0.25 || (lines.length > 80 && t.length / lines.length < 40)) warns.push({ id: "perf-07", why: "a script over 2 KB that looks unminified", at: s.src ? clip(s.src, 50) : "inline" }); }
  }
  return { fails, warns, checked: vis.length + scripts.length };
}

// ── K · security ─────────────────────────────────────────────────────────────
export const SECRETS = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["AWS access key id", /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ["Stripe live secret key", /\b(?:sk|rk)_live_[0-9a-zA-Z]{16,}\b/],
  ["GitHub token", /\b(?:ghp|gho|ghu|ghs|ghr)_[0-9A-Za-z]{30,}\b|\bgithub_pat_[0-9A-Za-z_]{40,}\b/],
  ["Slack token", /\bxox[abprs]-[0-9A-Za-z-]{10,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["model API key", /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{32,}\b/],
  ["secret assignment", /\b(?:secret|token|passw(?:or)?d|api[_-]?key|client[_-]?secret)["']?\s*[:=]\s*["'][A-Za-z0-9_\-+/=]{20,}["']/i],
];
export const mask = (s) => (s.length <= 10 ? "…" : `${s.slice(0, 4)}…${s.slice(-4)}`);
export const DOM_XSS = [
  /\.(?:innerHTML|outerHTML)\s*\+?=\s*[^;\n]*\b(?:location|document\.URL|document\.referrer|URLSearchParams|searchParams|window\.name)\b/,
  /\bdocument\.write(?:ln)?\s*\([^)]*\b(?:location|document\.URL|document\.referrer|searchParams)\b/,
  /\binsertAdjacentHTML\s*\([^)]*\b(?:location|searchParams|document\.URL)\b/,
];
// heuristic patterns (warnings, never counted): craft/security.md sec-06, sec-09
export const STORAGE_TOKEN = [
  /\b(?:localStorage|sessionStorage)\s*\.\s*setItem\s*\(\s*["'`][^"'`]*(?:token|jwt|auth|session|bearer|access|refresh|credential)[^"'`]*["'`]/i,
  /\b(?:localStorage|sessionStorage)\s*(?:\.\s*[A-Za-z_$]*(?:token|jwt|auth|session|bearer)[A-Za-z_$]*|\[\s*["'`][^"'`]*(?:token|jwt|auth|session|bearer)[^"'`]*["'`]\s*\])\s*=(?!=)/i,
];
export const LOG_SENSITIVE = [
  /\bconsole\.(?:log|info|debug|warn|error|trace|dir)\s*\([^)]*\b(?:token|jwt|passw(?:or)?d|secret|api[_-]?key|authorization|bearer|session[_-]?id|e-?mail)\b/i,
  /\bconsole\.(?:log|info|debug|warn|error|trace|dir)\s*\([^)]*["'`][^"'`]*[\w.+-]+@[\w-]+\.[a-z]{2,}[^"'`]*["'`]/i,
];
export function secRules({ pageUrl, html = "", scriptTexts = [], headers = {}, cookies = [], metaCsp = null, metaReferrer = null, envIgnored = null, remote = true } = {}) {
  // headers: lower-cased response headers of the page; cookies: every Set-Cookie value on that response
  const fails = [], warns = [], f = (id, why, at = "") => fails.push({ id, why, at });
  const https = /^https:/.test(pageUrl);
  for (const c of cookies) { const miss = ["HttpOnly", "Secure", "SameSite"].filter((a) => !new RegExp(`;\\s*${a}\\b`, "i").test(c)); if (miss.length) f("sec-06", `cookie without ${miss.join(", ")}`, c.split("=")[0]); }
  const hay = [html, ...scriptTexts].join("\n");
  for (const [name, re] of SECRETS) { const m = hay.match(re); if (m) { f("sec-07", `${name} in the client`, mask(m[0])); } }
  for (const t of [html, ...scriptTexts]) if (DOM_XSS.some((r) => r.test(t))) { f("sec-12", "URL-controlled value written as HTML (innerHTML / document.write)"); break; }
  if ((headers["access-control-allow-origin"] || "").trim() === "*") f("sec-16", "Access-Control-Allow-Origin: * on the page");
  if (/react(?:-dom)?\.development(?:\.min)?\.js/.test(hay) || (https && /\/[/*]# sourceMappingURL=/.test(hay))) warns.push({ id: "sec-17", why: "development build or source map on the page" });
  for (const t of [html, ...scriptTexts]) { const m = STORAGE_TOKEN.map((r) => t.match(r)).find(Boolean); if (m) { warns.push({ id: "sec-06", why: "auth token written to localStorage/sessionStorage (use an HttpOnly, Secure, SameSite cookie)", at: m[0].slice(0, 60) }); break; } }
  for (const t of [html, ...scriptTexts]) { const m = LOG_SENSITIVE.map((r) => t.match(r)).find(Boolean); if (m) { warns.push({ id: "sec-09", why: "console call that prints a token, key, password or email", at: m[0].slice(0, 60) }); break; } }
  if (envIgnored && envIgnored.ignored === false) warns.push({ id: "sec-08", why: `.env is not ignored by git${envIgnored.why ? ` (${envIgnored.why})` : ""}`, at: envIgnored.root || "" });
  if (remote && /^https?:/.test(pageUrl) && !(headers["content-security-policy"] || "").trim() && (metaCsp || "").trim()) warns.push({ id: "sec-h1", why: "CSP sent only as a <meta> tag; served over HTTP it should be a response header (meta cannot set frame-ancestors or reporting)" });
  if (!(headers["content-security-policy"] || "").trim() && !(metaCsp || "").trim()) f("sec-h1", "no Content-Security-Policy (header or meta)");
  if (!/nosniff/i.test(headers["x-content-type-options"] || "")) f("sec-h2", "no X-Content-Type-Options: nosniff header");
  if (!(headers["referrer-policy"] || "").trim() && !(metaReferrer || "").trim()) f("sec-h3", "no Referrer-Policy (header or meta referrer)");
  return { fails, warns, checked: 12 };
}

// `_headers` (Netlify / Cloudflare Pages format) for local files: a path line, then indented "Name: value" lines
export function parseHeadersFile(text, path) {
  const out = {}; let active = false;
  for (const line of String(text || "").split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) { const pat = line.trim(); const re = new RegExp("^" + pat.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"); active = re.test(path); continue; }
    if (!active) continue; const m = line.trim().match(/^([A-Za-z0-9-]+):\s*(.*)$/); if (m) out[m[1].toLowerCase()] = m[2];
  }
  return out;
}

export function rulesAxes(r) {
  const n = { copy: countOf(r.copy), seo: countOf(r.seo), perf: countOf(r.perf), sec: countOf(r.sec) };
  return { counts: n, segment: `rules: C${n.copy} S${n.seo} P${n.perf} K${n.sec}` };
}
