#!/usr/bin/env node
// Originality: do different briefs produce different designs? Measured in a real browser, never typed.
//
//   node scripts/originality.mjs <a> <b> [c …] [--json] [--out report.json] [--threshold 0.4] [--labels a,b,c]
//     each target: a built page (file.html), a project folder (its index.html, else out/ dist/ build/ …) or a URL
//
// The Delivery Gate checks rules on one page. It cannot see that two unrelated briefs came out as the same shape. This
// script opens every build at 1440×900, extracts six feature sets, and scores every pair 0–1 per axis
// (0 = nothing shared, 1 = the same):
//
//   structure    DOM hierarchy (weighted Jaccard of 3-deep tag-path shingles, single-child wrappers collapsed, so
//                implementation noise does not count) and section order (edit distance over the content blocks
//                between the header and the footer, each typed by what it holds: form, grid, media, list, text,
//                statement, and its height in screens). Header, nav and footer are excluded from the order: every site
//                has them.
//   composition  placement (each of the first 8 screens as a 12×8 cell grid, each cell empty, text or media; similarity
//                is matching non-empty cells over cells non-empty in either), columns and alignment per screen, density
//                (share of each screen covered by content, in four bins).
//   image        image treatment: every img, picture, video, canvas, large svg and background-image ≥ 48px, as three
//                token bags: aspect ratio × size class, crop (object-fit vs natural ratio) × mask (radius, clip-path,
//                mask-image), filter × blend × rotation. Both pages without imagery score 1 (the same treatment: none).
//   typography   families (display and body), scale (font-size steps relative to body, quarter-octave bins, weighted by
//                text length), rhythm (line-height, tracking, case, weight, italic per role), hierarchy (h1/h2/h3 size
//                relative to body).
//   interaction  hover (each :hover rule as the set of property groups it changes), click (disclosures, dialogs, tabs,
//                toggles, forms, carousels, anchors), scroll (sticky, fixed, snap, scroll-driven animation libraries,
//                and the properties that actually change while scrolling, measured), pointer (custom cursor, pointer
//                listeners).
//   signature    the one memorable thing: the element that changes most (area × changed properties) under time, pointer
//                and scroll, described by trigger, properties, element kind and size; plus the declared signature (the
//                stamp's `signature:` field or `data-signature`) when both pages declare one (same id 1, same family in
//                data/signatures.csv 0.5, else 0).
//   overall      the mean of the six axes.
//
// Every axis is a similarity, so lower is more original. Two builds for unrelated briefs must score below the threshold
// (default 0.4) on every axis; a pair at or above it is reported as a repeat (✗) on that axis.
// Exit codes: 0 every pair below the threshold on every axis · 1 at least one axis at or above it · 2 usage ·
// 3 not verified (no browser). Without Playwright it prints "not verified — no browser" and exits 3; it never prints
// a score it did not measure.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { cli, load } from "./lib.mjs";

export const AXES = ["structure", "composition", "image", "typography", "interaction", "signature"];
export const THRESHOLD = 0.4;
const USAGE = "Usage: node scripts/originality.mjs <a> <b> [c …] [--json] [--out report.json] [--threshold 0.4] [--labels a,b,…]";

// ── pure similarity helpers (exported for tests) ───────────────────────────────
/** weighted Jaccard of two bags {token: weight}: Σ min / Σ max. Two empty bags are the same (1). */
export function wjaccard(a = {}, b = {}) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]); let lo = 0, hi = 0;
  for (const k of keys) { const x = a[k] || 0, y = b[k] || 0; lo += Math.min(x, y); hi += Math.max(x, y); }
  return hi === 0 ? 1 : lo / hi;
}
/** 1 − normalised Levenshtein distance between two token sequences. Two empty sequences are the same (1). */
export function seqSim(a = [], b = []) {
  if (!a.length && !b.length) return 1; const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return 1 - prev[n] / Math.max(m, n);
}
/** cell grids (arrays of "" | "t" | "m"): matching non-empty cells over cells non-empty in either */
export function gridSim(a = [], b = []) {
  let same = 0, any = 0; for (let i = 0; i < Math.max(a.length, b.length); i++) { const x = a[i] || "", y = b[i] || ""; if (x || y) { any++; if (x === y) same++; } }
  return any === 0 ? 1 : same / any;
}
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / (xs.length || 1);
const r2 = (x) => Math.round(x * 100) / 100;

// The six axes from two feature sets (the output of FEATURES below). Each part is kept so a report can show why.
export function compare(A, B, sigFamily = {}) {
  const parts = {};
  parts.structure = { shingles: wjaccard(A.structure.shingles, B.structure.shingles), order: seqSim(A.structure.order, B.structure.order) };
  const screens = Math.max(A.composition.grids.length, B.composition.grids.length);
  const gs = []; for (let i = 0; i < screens; i++) gs.push(A.composition.grids[i] && B.composition.grids[i] ? gridSim(A.composition.grids[i], B.composition.grids[i]) : 0);
  // density per screen in four bins (sparse < .25 ≤ light < .5 ≤ full < .75 ≤ packed); a screen one page lacks is a mismatch
  const bin = (d) => (d === undefined ? -1 : d < 0.25 ? 0 : d < 0.5 ? 1 : d < 0.75 ? 2 : 3);
  const dens = []; for (let i = 0; i < screens; i++) dens.push(bin(A.composition.density[i]) === bin(B.composition.density[i]) ? 1 : 0);
  parts.composition = { placement: mean(gs), columns: wjaccard(A.composition.columns, B.composition.columns), density: mean(dens) };
  const noImg = !A.image.count && !B.image.count, oneImg = !A.image.count !== !B.image.count;
  parts.image = noImg ? { none: 1 } : oneImg ? { one_side_only: 0 } : { ratio_size: wjaccard(A.image.ratioSize, B.image.ratioSize), crop_mask: wjaccard(A.image.cropMask, B.image.cropMask), effects: wjaccard(A.image.effects, B.image.effects) };
  const famSame = (x, y) => (x && y && x === y ? 1 : 0);
  const hDiff = ["h1", "h2", "h3"].map((h) => (A.typography.hier[h] && B.typography.hier[h] ? Math.abs(Math.log2(A.typography.hier[h] / B.typography.hier[h])) : A.typography.hier[h] || B.typography.hier[h] ? 1 : 0));
  parts.typography = { families: (famSame(A.typography.display, B.typography.display) + famSame(A.typography.body, B.typography.body)) / 2, scale: wjaccard(A.typography.scale, B.typography.scale), rhythm: wjaccard(A.typography.rhythm, B.typography.rhythm), hierarchy: Math.max(0, 1 - mean(hDiff)) };
  parts.interaction = { hover: wjaccard(A.interaction.hover, B.interaction.hover), click: wjaccard(A.interaction.click, B.interaction.click), scroll: wjaccard(A.interaction.scroll, B.interaction.scroll), pointer: wjaccard(A.interaction.pointer, B.interaction.pointer) };
  const measured = wjaccard(A.signature.tokens, B.signature.tokens);
  const da = A.signature.declared, db = B.signature.declared;
  parts.signature = da && db ? { declared: da === db ? 1 : sigFamily[da] && sigFamily[da] === sigFamily[db] ? 0.5 : 0, measured } : { measured };
  const W = { structure: { shingles: 0.5, order: 0.5 }, composition: { placement: 0.6, columns: 0.2, density: 0.2 }, typography: { families: 0.25, scale: 0.3, rhythm: 0.25, hierarchy: 0.2 } };
  const score = {};
  for (const ax of AXES) { const p = parts[ax]; const w = W[ax]; const ks = Object.keys(p); score[ax] = r2(w ? ks.reduce((s, k) => s + p[k] * w[k], 0) : mean(ks.map((k) => p[k]))); for (const k of ks) p[k] = r2(p[k]); }
  score.overall = r2(mean(AXES.map((a) => score[a])));
  return { score, parts };
}

// ── in-page feature extraction (serialised into the page) ──────────────────────
// Everything is read from what the browser rendered: boxes, computed styles, the page's own stylesheets and scripts.
const FEATURES = async () => {
  const vw = innerWidth, vh = innerHeight, H = document.documentElement.scrollHeight;
  const cs = (e) => getComputedStyle(e);
  const visible = (e) => { const s = cs(e); if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity) === 0) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const box = (e) => { const r = e.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; };
  const bump = (bag, k, w = 1) => { bag[k] = (bag[k] || 0) + w; };
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "LINK", "META", "BR", "WBR", "TITLE"]);
  const INLINE = new Set(["SPAN", "B", "I", "EM", "STRONG", "SMALL", "SUP", "SUB", "MARK", "ABBR", "CODE", "KBD", "S", "U", "TIME", "Q", "CITE", "DFN", "VAR", "SAMP", "DATA"]);
  const kids = (e) => [...e.children].filter((c) => !SKIP.has(c.tagName) && visible(c));
  const ownText = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").replace(/\s+/g, " ").trim();
  // collapse wrappers: an element with exactly one element child and no text of its own is the same node as its child
  const unwrap = (e) => { let n = e; while (n && kids(n).length === 1 && !ownText(n) && !["IMG", "VIDEO", "CANVAS", "svg", "PICTURE", "FORM", "UL", "OL"].includes(n.tagName)) n = kids(n)[0]; return n; };
  const token = (e) => { const t = e.tagName.toLowerCase(); const d = cs(e).display; if (/^h[1-6]$/.test(t)) return t; if (t === "div" || t === "section" || t === "article" || t === "main" || t === "aside") return t + (d.includes("grid") ? "#g" : d.includes("flex") ? "#f" : ""); return t; };

  // ── structure: tag-path shingles + section order
  const shingles = {};
  const walk = (e, path) => {
    for (const c0 of kids(e)) {
      if (INLINE.has(c0.tagName)) continue; const c = unwrap(c0); if (INLINE.has(c.tagName)) continue;
      const p = [...path, token(c)].slice(-3); if (p.length === 3) bump(shingles, p.join(">"));
      if (path.length < 14 && !["svg", "SVG"].includes(c.tagName)) walk(c, [...path, token(c)]);
    }
  };
  walk(document.body, ["body"]);
  const isChrome = (e) => e.matches("header, nav, footer, [role=banner], [role=navigation], [role=contentinfo]") || (e.closest("header, footer") && e.closest("header, footer") !== document.body);
  let root = document.querySelector("main") || document.body; root = unwrap(root);
  const blocks = [];
  const collect = (e, depth) => {
    for (const c0 of kids(e)) {
      const c = c0; if (isChrome(c)) continue; const b = box(c);
      if (b.h < 120 || b.w < vw * 0.5) { if (b.h >= 120 && depth < 3) collect(c, depth + 1); continue; }
      // a block that is just a container of several big blocks is not one block
      const big = kids(c).filter((k) => { const r = box(k); return r.h >= 0.6 * vh && r.w >= vw * 0.5 && !isChrome(k); });
      if (big.length >= 2 && depth < 3) { collect(c, depth + 1); continue; }
      blocks.push(c);
    }
  };
  collect(root, 0);
  const media = (e) => [...e.querySelectorAll("img, video, canvas, picture, svg")].filter((m) => { const r = m.getBoundingClientRect(); return r.width >= 48 && r.height >= 48 && visible(m); });
  const order = blocks.map((b) => {
    const r = box(b), area = r.w * r.h, mArea = media(b).reduce((s, m) => { const x = m.getBoundingClientRect(); return s + x.width * x.height; }, 0);
    const text = (b.innerText || "").replace(/\s+/g, " ").trim();
    const siblings = (() => { let best = 0; for (const el of [b, ...b.querySelectorAll("*")]) { const k = kids(el); if (k.length >= 3) { const sizes = k.map((x) => Math.round(x.getBoundingClientRect().width / 20)); const same = sizes.filter((s) => s === sizes[0]).length; if (same >= 3 && k.every((x) => x.tagName === k[0].tagName)) best = Math.max(best, same); } } return best; })();
    const kind = b.querySelector("form, input:not([type=hidden]), textarea, select") ? "form" : siblings >= 3 && b.querySelector("img, picture, a, h3, h4") ? "grid" : mArea > 0.4 * area ? "media" : b.querySelectorAll("li").length >= 3 ? "list" : text.length > 300 ? "text" : "statement";
    const hs = r.h / vh; return `${kind}:${hs < 0.6 ? "s" : hs < 1.2 ? "m" : hs < 2.5 ? "l" : "xl"}`;
  });

  // ── composition: 12×8 grids per screen, columns × alignment, density
  const leaves = [...document.body.querySelectorAll("*")].filter((e) => !SKIP.has(e.tagName) && visible(e) && !e.closest("svg"));
  // text is painted as the box of its block-level container (a paragraph, a heading), not line by line: a 16px line
  // never covers a 112px cell, so line boxes would read as empty space
  const blockOf = (e) => { let n = e; while (n && n !== document.body && /^inline/.test(cs(n).display) && n.parentElement) n = n.parentElement; return n; };
  const textEls = [...new Set(leaves.filter((e) => ownText(e).length >= 2).map(blockOf))].filter((e) => e && e !== document.body);
  const textBoxes = textEls.map((e) => ({ ...box(e), el: e })).filter((b) => b.w > 0 && b.h > 0 && b.h < vh * 3);
  const mediaBoxes = leaves.filter((e) => ["IMG", "VIDEO", "CANVAS", "svg"].includes(e.tagName) || (cs(e).backgroundImage.includes("url(") )).map(box).filter((b) => b.w >= 48 && b.h >= 48);
  const SCREENS = Math.min(8, Math.ceil(H / vh)); const grids = [], density = [], columns = {};
  for (let s = 0; s < SCREENS; s++) {
    const y0 = s * vh, cells = Array(96).fill("");
    const paint = (b, v) => { for (let cy = 0; cy < 8; cy++) for (let cx = 0; cx < 12; cx++) { const x1 = (cx * vw) / 12, x2 = ((cx + 1) * vw) / 12, ya = y0 + (cy * vh) / 8, yb = y0 + ((cy + 1) * vh) / 8; const ox = Math.min(x2, b.x + b.w) - Math.max(x1, b.x), oy = Math.min(yb, b.y + b.h) - Math.max(ya, b.y); if (ox > 0 && oy > 0 && ((ox * oy) / ((vw / 12) * (vh / 8)) >= 0.25 || (ox * oy) / Math.max(1, b.w * b.h) >= 0.5)) { if (v === "t" || !cells[cy * 12 + cx]) cells[cy * 12 + cx] = v; } } };
    for (const b of mediaBoxes) paint(b, "m"); for (const b of textBoxes) paint(b, "t");
    grids.push(cells); density.push(cells.filter(Boolean).length / 96);
    const inScreen = textBoxes.filter((b) => b.y >= y0 && b.y < y0 + vh && b.w > 40);
    const starts = []; for (const b of inScreen) { const x = Math.round(b.x / (vw / 24)); if (!starts.includes(x)) starts.push(x); }
    const cols = Math.min(starts.length, 6); const centre = inScreen.filter((b) => Math.abs(b.x + b.w / 2 - vw / 2) < vw * 0.04).length;
    const align = !inScreen.length ? "empty" : centre / inScreen.length > 0.6 ? "centre" : inScreen.filter((b) => b.x < vw * 0.2).length / inScreen.length > 0.6 ? "left" : "spread";
    bump(columns, `c${cols}:${align}`);
  }

  // ── image treatment
  const ratioBin = (r) => { const bins = [[1 / 3, "1:3"], [9 / 16, "9:16"], [2 / 3, "2:3"], [3 / 4, "3:4"], [1, "1:1"], [4 / 3, "4:3"], [3 / 2, "3:2"], [16 / 9, "16:9"], [21 / 9, "21:9"], [4, "wide"]]; let best = bins[0]; for (const b of bins) if (Math.abs(Math.log(r / b[0])) < Math.abs(Math.log(r / best[0]))) best = b; return best[1]; };
  const imgEls = leaves.filter((e) => ["IMG", "VIDEO", "CANVAS", "svg"].includes(e.tagName) || cs(e).backgroundImage.includes("url(")).filter((e) => { const r = e.getBoundingClientRect(); return r.width >= 48 && r.height >= 48; });
  const ratioSize = {}, cropMask = {}, effects = {};
  for (const e of imgEls) {
    const r = e.getBoundingClientRect(), s = cs(e); const kind = e.tagName === "IMG" ? "img" : e.tagName === "VIDEO" ? "video" : e.tagName === "CANVAS" ? "canvas" : e.tagName === "svg" ? "svg" : "bg";
    const size = r.width >= vw * 0.9 ? "bleed" : r.width >= vw * 0.45 ? "half" : r.width >= vw * 0.25 ? "third" : "thumb";
    bump(ratioSize, `${kind}:${ratioBin(r.width / r.height)}:${size}`);
    const nat = e.naturalWidth && e.naturalHeight ? e.naturalWidth / e.naturalHeight : e.videoWidth ? e.videoWidth / e.videoHeight : null;
    const fit = kind === "bg" ? s.backgroundSize : s.objectFit; const cropped = nat && fit === "cover" && Math.abs(Math.log(nat / (r.width / r.height))) > 0.05 ? "crop" : fit === "contain" ? "contain" : "full";
    const anc = (p) => { for (let n = e, i = 0; n && n.nodeType === 1 && i < 4; n = n.parentElement, i++) { const v = p(cs(n)); if (v) return v; } return null; };
    const radius = anc((x) => { const v = parseFloat(x.borderTopLeftRadius); return v > 0 ? (v >= Math.min(r.width, r.height) / 2 - 1 || x.borderTopLeftRadius.includes("%") ? "round" : v > 12 ? "soft" : "slight") : null; }) || "square";
    const clip = anc((x) => (x.clipPath && x.clipPath !== "none" ? x.clipPath.split("(")[0] : null)) || anc((x) => (x.maskImage && x.maskImage !== "none" ? "mask" : x.webkitMaskImage && x.webkitMaskImage !== "none" ? "mask" : null)) || "none";
    bump(cropMask, `${cropped}:${radius}:${clip}`);
    const filt = anc((x) => (x.filter && x.filter !== "none" ? x.filter.split("(")[0] : null)) || "none";
    const blend = anc((x) => (x.mixBlendMode && x.mixBlendMode !== "normal" ? x.mixBlendMode : null)) || "normal";
    const rot = /matrix\(([^)]+)\)/.test(s.transform) && Math.abs(parseFloat(s.transform.match(/matrix\(([^)]+)\)/)[1].split(",")[1])) > 0.01 ? "rotated" : "flat";
    bump(effects, `${filt}:${blend}:${rot}`);
  }

  // ── typography
  const runs = leaves.filter((e) => ownText(e).length >= 2).map((el) => ({ el })).map((b) => { const s = cs(b.el); return { el: b.el, size: parseFloat(s.fontSize), fam: s.fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase(), chars: ownText(b.el).length, lh: s.lineHeight === "normal" ? 1.2 : parseFloat(s.lineHeight) / parseFloat(s.fontSize), ls: s.letterSpacing === "normal" ? 0 : parseFloat(s.letterSpacing) / parseFloat(s.fontSize), upper: s.textTransform === "uppercase" || (ownText(b.el).length > 3 && ownText(b.el) === ownText(b.el).toUpperCase() && /[A-Z]/.test(ownText(b.el))), weight: +s.fontWeight || 400, italic: s.fontStyle === "italic" }; });
  const bySize = {}; for (const r of runs) bySize[r.size] = (bySize[r.size] || 0) + r.chars;
  const body = +(Object.entries(bySize).filter(([sz]) => +sz <= 22).sort((a, b) => b[1] - a[1])[0] || Object.entries(bySize).sort((a, b) => b[1] - a[1])[0] || [16])[0];
  const famBy = (pred) => { const f = {}; for (const r of runs.filter(pred)) f[r.fam] = (f[r.fam] || 0) + r.chars * r.size; return Object.entries(f).sort((a, b) => b[1] - a[1])[0]?.[0] || null; };
  const display = famBy((r) => r.size >= Math.max(28, body * 1.75)), bodyFam = famBy((r) => Math.abs(r.size - body) < 1);
  const scale = {}, rhythm = {};
  for (const r of runs) {
    bump(scale, String(Math.round(Math.log2(r.size / body) * 4)), Math.sqrt(r.chars));
    const role = r.size >= body * 2 ? "display" : r.size >= body * 1.25 ? "head" : r.size >= body * 0.9 ? "body" : "small";
    bump(rhythm, `${role}:lh${Math.round(r.lh * 10) / 10}`, Math.sqrt(r.chars)); bump(rhythm, `${role}:ls${r.ls < -0.015 ? "tight" : r.ls > 0.04 ? "wide" : r.ls > 0.01 ? "open" : "none"}`, Math.sqrt(r.chars));
    bump(rhythm, `${role}:${r.upper ? "caps" : "mixed"}:w${Math.round(r.weight / 100)}${r.italic ? ":it" : ""}`, Math.sqrt(r.chars));
  }
  const hier = {}; for (const h of ["h1", "h2", "h3"]) { const el = [...document.querySelectorAll(h)].find(visible); if (el) hier[h] = parseFloat(cs(el).fontSize) / body; }

  // ── interaction: hover rules, click widgets, scroll and pointer behaviour
  const GROUP = (p) => /^(color|-webkit-text-fill-color|fill|stroke)$/.test(p) ? "colour" : /^background/.test(p) ? "bg" : /^border|^outline/.test(p) ? "border" : /^text-decoration|^text-underline/.test(p) ? "underline" : /^(transform|translate|scale|rotate)$/.test(p) ? "transform" : p === "opacity" ? "opacity" : /shadow/.test(p) ? "shadow" : /^(filter|backdrop-filter)$/.test(p) ? "filter" : /^clip|^mask/.test(p) ? "clip" : /^(width|height|padding|margin|inset|top|left|right|bottom|gap)/.test(p) ? "size" : /^(letter-spacing|font)/.test(p) ? "type" : /cursor/.test(p) ? "cursor" : "other";
  const hover = {}, rules = []; const walkR = (rs) => { for (const r of rs) { if (r.selectorText) rules.push(r); if (r.cssRules) walkR(r.cssRules); } };
  for (const sh of document.styleSheets) { try { walkR(sh.cssRules); } catch {} }
  // only rules that apply to something on this page: a shared stylesheet's unused hover rules are not this page's pattern
  const applies = (sel) => sel.split(",").some((one) => { if (!/:hover/.test(one)) return false; const base = one.replace(/:hover/g, "").replace(/::?[a-z-]+(\([^)]*\))?/gi, (m) => (/^:(not|is|where|has)\(/i.test(m) ? m : "")).trim() || "*"; try { return !!document.querySelector(base); } catch { return false; } });
  for (const r of rules) if (/:hover/.test(r.selectorText) && applies(r.selectorText)) { const g = [...new Set([...r.style].map(GROUP))].filter((x) => x !== "other").sort(); if (g.length) bump(hover, g.join("+")); }
  let js = [...document.querySelectorAll("script:not([src])")].map((x) => x.textContent).join("\n");
  for (const sc of document.querySelectorAll("script[src]")) { try { const u = new URL(sc.src, location.href); if (u.origin === location.origin) js += "\n" + (await (await fetch(u)).text()); else js += "\n//src " + u.pathname; } catch {} }
  const click = {}; const has = (sel, k) => { const n = document.querySelectorAll(sel).length; if (n) bump(click, k, Math.min(3, n)); };
  has("details", "disclosure"); has("dialog, [role=dialog]", "dialog"); has("[role=tab]", "tabs"); has("[aria-expanded]", "expander"); has("[aria-pressed], [role=switch], input[type=checkbox]", "toggle");
  has("form", "form"); has("input[type=range]", "slider"); has("select", "select"); has("[popover]", "popover"); has('a[href^="#"]:not([href="#"])', "anchor"); has('a[href^="mailto:"], a[href^="tel:"]', "contact-link");
  if ([...document.querySelectorAll("*")].some((e) => /x|both/.test(cs(e).scrollSnapType) || (cs(e).overflowX === "auto" || cs(e).overflowX === "scroll") && e.scrollWidth > e.clientWidth + 40)) bump(click, "carousel");
  if (/addEventListener\(\s*["'](click|pointerdown|mousedown)["']|onclick=|\.onclick\s*=/.test(js + document.body.innerHTML)) bump(click, "scripted-click");
  const scroll = {}, pointer = {}; const all = [...document.body.querySelectorAll("*")];
  const sticky = all.filter((e) => cs(e).position === "sticky").length, fixed = all.filter((e) => cs(e).position === "fixed" && visible(e)).length;
  if (sticky) bump(scroll, `sticky:${sticky > 3 ? "many" : sticky}`); if (fixed) bump(scroll, `fixed:${fixed > 3 ? "many" : fixed}`);
  if (all.some((e) => /y|both|block/.test(cs(e).scrollSnapType))) bump(scroll, "snap-y");
  if (/ScrollTrigger/.test(js)) bump(scroll, "lib:scrolltrigger"); if (/Lenis|lenis/.test(js)) bump(scroll, "lib:smooth-scroll"); if (/IntersectionObserver/.test(js)) bump(scroll, "observer"); if (/addEventListener\(\s*["']scroll["']|onscroll/.test(js)) bump(scroll, "scroll-listener");
  if (rules.some((r) => /animation-timeline|view-timeline|scroll-timeline/.test(r.cssText))) bump(scroll, "css-scroll-timeline");
  if (/mousemove|pointermove/.test(js)) bump(pointer, "pointer-listener"); if (all.some((e) => cs(e).cursor === "none") || rules.some((r) => /cursor:\s*none/.test(r.cssText))) bump(pointer, "custom-cursor");
  if (/deviceorientation|gyro/i.test(js)) bump(pointer, "tilt"); if (/getContext\(\s*["']webgl|THREE\.|WebGLRenderer/.test(js)) bump(pointer, "webgl");
  return { H, vh, structure: { shingles, order }, composition: { grids, density, columns }, image: { count: imgEls.length, ratioSize, cropMask, effects }, typography: { display, body: bodyFam, bodyPx: body, scale, rhythm, hier }, interaction: { hover, click, scroll, pointer } };
};

// The signature move, measured: snapshot candidate elements' animatable styles under time, pointer and scroll, and
// keep the element whose change covers the most (area × properties changed). Then describe it as tokens.
const SNAP_SETUP = () => {
  const vw = innerWidth, vh = innerHeight; const els = [...document.body.querySelectorAll("*")].filter((e) => { if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(e.tagName)) return false; const r = e.getBoundingClientRect(); return r.width * r.height >= vw * vh * 0.004; });
  window.__orig = els.slice(0, 1500); return window.__orig.length;
};
const SNAP = () => { const P = ["transform", "opacity", "clipPath", "filter", "fontVariationSettings", "letterSpacing", "backgroundPosition", "color", "backgroundColor", "strokeDashoffset", "maskPosition", "width"]; return window.__orig.map((e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return { p: P.map((k) => s[k] || ""), t: r.width > innerWidth * 1.5 ? "strip" : r.height > innerHeight * 1.5 ? "column" : e.tagName === "CANVAS" ? "canvas" : e.tagName === "svg" || e.closest("svg") ? "svg" : ["IMG", "VIDEO", "PICTURE"].includes(e.tagName) ? "media" : (e.innerText || "").trim().length > 0 && e.children.length < 8 ? "text" : "block", a: Math.min(r.width, innerWidth) * Math.min(r.height, innerHeight), y: r.top, txt: e.tagName === "CANVAS" ? "" : (e.textContent || "").slice(0, 40) }; }); };
const PROPS = ["transform", "opacity", "clip", "filter", "font-axes", "tracking", "bg-position", "colour", "bg-colour", "stroke", "mask", "width"];
export function signatureOf(snaps, vw, vh) {
  // snaps: { base, time, pointer, scroll: [ ... ] } each an array aligned to the same elements
  const n = snaps.base.length; let best = null;
  for (let i = 0; i < n; i++) {
    const trig = new Set(), props = new Set();
    const diff = (a, b, t) => { if (!a || !b) return; a.p.forEach((v, k) => { if (v !== b.p[k]) { trig.add(t); props.add(PROPS[k]); } }); if (a.txt !== b.txt && a.t === "text") { trig.add(t); props.add("text-content"); } };
    diff(snaps.base[i], snaps.time[i], "time"); diff(snaps.base[i], snaps.pointer[i], "pointer");
    for (let s = 1; s < snaps.scroll.length; s++) diff(snaps.scroll[s - 1][i], snaps.scroll[s][i], "scroll");
    if (!props.size) continue;
    const el = snaps.base[i]; const area = Math.min(el.a, vw * vh * 2); const score = area * props.size * trig.size;
    if (!best || score > best.score) best = { score, trig: [...trig].sort(), props: [...props].sort(), kind: el.t, area: el.a };
  }
  if (!best) return { tokens: { static: 1 }, found: null };
  const size = best.area >= vw * vh * 0.6 ? "screen" : best.area >= vw * vh * 0.2 ? "large" : best.area >= vw * vh * 0.05 ? "medium" : "small";
  const tokens = {}; for (const t of best.trig) tokens[`trigger:${t}`] = 1; for (const p of best.props) tokens[`prop:${p}`] = 1; tokens[`el:${best.kind}`] = 1; tokens[`size:${size}`] = 1; tokens[`mech:${best.trig.join("+")}>${best.props.slice(0, 3).join("+")}`] = 1;
  return { tokens, found: { trigger: best.trig, props: best.props, kind: best.kind, size } };
}

// ── serving and loading ───────────────────────────────────────────────────────
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".json": "application/json", ".mp4": "video/mp4" };
const BUILD_DIRS = ["out", "dist", "build", ".output/public", "_site", "public"];
export function locate(target) {
  if (/^https?:\/\//.test(target)) return { url: target };
  const abs = resolve(target); if (!existsSync(abs)) throw new Error(`not found: ${target}`);
  if (!statSync(abs).isDirectory()) return { root: dirname(abs), file: basename(abs), html: abs };
  if (existsSync(join(abs, "index.html"))) return { root: abs, file: "index.html", html: join(abs, "index.html") };
  const d = BUILD_DIRS.find((x) => existsSync(join(abs, x, "index.html"))); if (d) return { root: join(abs, d), file: "index.html", html: join(abs, d, "index.html") };
  throw new Error(`no index.html in ${target} and no build output (${BUILD_DIRS.join(", ")})`);
}
function serve(root) {
  return new Promise((ok) => { const srv = createServer((req, res) => { let f = join(root, decodeURIComponent(new URL(req.url, "http://x").pathname)); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html"); if (!f.startsWith(root) || !existsSync(f)) { res.writeHead(404); return res.end(); } res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f)); }).listen(0, "127.0.0.1", () => ok(srv)); });
}
async function loadPlaywright() {
  for (const base of [process.cwd(), dirname(fileURLToPath(import.meta.url))]) { const req = createRequire(join(base, "noop.js")); for (const n of ["playwright", "playwright-core"]) { try { const m = await import(req.resolve(n)); const pw = m.chromium ? m : m.default; if (pw?.chromium) return pw; } catch {} } }
  return null;
}
function declaredSignature(html) {
  const m = html.match(/motomation ·[^*>]*?signature:\s*([a-z0-9-]+)/i) || html.match(/data-signature=["']([a-z0-9-]+)["']/i); return m ? m[1].toLowerCase() : null;
}
export async function features(browser, target) {
  const loc = locate(target); const srv = loc.url ? null : await serve(loc.root); const url = loc.url || `http://127.0.0.1:${srv.address().port}/${encodeURIComponent(loc.file)}`;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, bypassCSP: true }); const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.waitForTimeout(3000));
    await page.waitForTimeout(800);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(h, 30000); y += 600) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(30); }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(700);
    const f = await page.evaluate(FEATURES);
    // signature: base, +1.2s idle (loops), pointer sweep, then 5 scroll positions
    await page.mouse.move(5, 5); await page.evaluate(SNAP_SETUP); const base = await page.evaluate(SNAP);
    await page.waitForTimeout(1200); const time = await page.evaluate(SNAP);
    for (const [x, y] of [[720, 450], [300, 300], [1100, 600], [720, 450]]) { await page.mouse.move(x, y, { steps: 6 }); await page.waitForTimeout(60); }
    const pointer = await page.evaluate(SNAP);
    const max = Math.max(0, h - 900); const scrollSnaps = [];
    for (const t of [0, 0.25, 0.5, 0.75, 1]) { const y = Math.round(max * t); await page.mouse.wheel(0, 0); await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(500); scrollSnaps.push(await page.evaluate(SNAP)); }
    const sig = signatureOf({ base, time, pointer, scroll: scrollSnaps }, 1440, 900);
    // measured scroll behaviour feeds the interaction axis: which properties change while scrolling, anywhere on the page
    const changing = new Set(); for (let s = 1; s < scrollSnaps.length; s++) scrollSnaps[s].forEach((e, i) => e.p.forEach((v, k) => { if (v !== scrollSnaps[s - 1][i].p[k]) changing.add(PROPS[k]); }));
    for (const p of changing) f.interaction.scroll[`scroll-changes:${p}`] = 1;
    const html = loc.html ? readFileSync(loc.html, "utf8") : await (await fetch(url)).text();
    f.signature = { tokens: sig.tokens, found: sig.found, declared: declaredSignature(html) };
    return f;
  } finally { await ctx.close(); srv?.close(); }
}

export function matrixReport(labels, feats, threshold = THRESHOLD) {
  const fam = Object.fromEntries(load("signatures").map((s) => [s.id, s.family]));
  const pairs = [];
  for (let i = 0; i < feats.length; i++) for (let j = i + 1; j < feats.length; j++) { const c = compare(feats[i], feats[j], fam); pairs.push({ a: labels[i], b: labels[j], ...c, over: AXES.filter((ax) => c.score[ax] >= threshold) }); }
  return { threshold, labels, pairs, pass: pairs.every((p) => !p.over.length), max: Object.fromEntries([...AXES, "overall"].map((ax) => [ax, pairs.length ? Math.max(...pairs.map((p) => p.score[ax])) : null])) };
}
export function printReport(rep, feats) {
  const L = (s = "") => console.log(s); const { labels, pairs, threshold } = rep;
  L(`ORIGINALITY · ${labels.length} build(s) · ${pairs.length} pair(s) · threshold < ${threshold} on every axis (lower = more different)`);
  feats.forEach((f, i) => L(`  ${labels[i]}: ${f.structure.order.length} content blocks [${f.structure.order.join(" ")}] · ${f.image.count} image(s) · type ${f.typography.display || "–"} / ${f.typography.body || "–"} (body ${f.typography.bodyPx}px) · signature ${f.signature.declared ? `declared ${f.signature.declared}, ` : ""}measured ${f.signature.found ? `${f.signature.found.trigger.join("+")} → ${f.signature.found.props.join("+")} on ${f.signature.found.kind} (${f.signature.found.size})` : "none (static)"}`));
  L("");
  L(`| Pair | ${[...AXES, "overall"].join(" | ")} | Verdict |`); L(`|---|${[...AXES, "overall"].map(() => "---:").join("|")}|---|`);
  for (const p of pairs) L(`| ${p.a} × ${p.b} | ${[...AXES, "overall"].map((ax) => `${p.score[ax].toFixed(2)}${AXES.includes(ax) && p.score[ax] >= threshold ? " ✗" : ""}`).join(" | ")} | ${p.over.length ? `repeat on ${p.over.join(", ")}` : "different on every axis"} |`);
  if (labels.length > 2) for (const ax of [...AXES, "overall"]) {
    L(""); L(`${ax}`); L(`| | ${labels.join(" | ")} |`); L(`|---|${labels.map(() => "---:").join("|")}|`);
    for (const a of labels) L(`| ${a} | ${labels.map((b) => (a === b ? "—" : pairs.find((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a)).score[ax].toFixed(2))).join(" | ")} |`);
  }
  L(""); L("parts (why each axis scored what it did):");
  for (const p of pairs) L(`  ${p.a} × ${p.b}: ${AXES.map((ax) => `${ax} ${Object.entries(p.parts[ax]).map(([k, v]) => `${k}=${v}`).join(",")}`).join(" · ")}`);
  L(""); L(rep.pass ? `PASS  every pair below ${threshold} on every axis` : `FAIL  ${pairs.filter((p) => p.over.length).length} of ${pairs.length} pair(s) at or above ${threshold} on at least one axis`);
}

async function main() {
  const a = cli("originality", USAGE, { json: "bool", out: "value", threshold: "value", labels: "value" }, null, { pos: [2, Infinity] });
  const threshold = a.threshold !== undefined ? +a.threshold : THRESHOLD; if (!(threshold > 0 && threshold <= 1)) { console.error(`originality: --threshold must be in (0, 1]\n${USAGE}`); process.exit(2); }
  for (const t of a._) { try { locate(t); } catch (e) { console.error(`originality: ${e.message}\n${USAGE}`); process.exit(2); } }
  const labels = a.labels ? String(a.labels).split(",") : a._.map((t) => (/^https?:/.test(t) ? t : basename(resolve(t)).replace(/\.html?$/, "") === "index" ? basename(dirname(resolve(t))) : basename(resolve(t)).replace(/\.html?$/, "")));
  if (labels.length !== a._.length) { console.error(`originality: --labels has ${labels.length} name(s) for ${a._.length} target(s)\n${USAGE}`); process.exit(2); }
  const pw = await loadPlaywright(); if (!pw) { console.log("not verified — no browser (install Playwright: npm i -D playwright && npx playwright install chromium)"); process.exit(3); }
  const browser = await pw.chromium.launch(); const feats = [];
  try { for (const t of a._) feats.push(await features(browser, t)); } catch (e) { console.log(`not verified — the browser failed (${String(e.message || e).split("\n")[0]})`); process.exit(3); } finally { await browser.close().catch(() => {}); }
  const rep = matrixReport(labels, feats, threshold); rep.targets = a._;
  rep.features = feats.map((f, i) => ({ label: labels[i], blocks: f.structure.order, images: f.image.count, display: f.typography.display, body: f.typography.body, signature: f.signature }));
  if (a.out) writeFileSync(String(a.out), JSON.stringify(rep, null, 2));
  if (a.json) console.log(JSON.stringify(rep, null, 2)); else printReport(rep, feats);
  process.exit(rep.pass ? 0 : 1);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.log(`not verified — ${String(e.message || e).split("\n")[0]}`); process.exit(3); });
