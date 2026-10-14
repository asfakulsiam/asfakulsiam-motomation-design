// Shared helpers for the motomation scripts. Zero dependencies, Node 18+.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto"; // explicit import: globalThis.crypto is not exposed in Node 18 ES modules

export const SKILL_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const DATA = join(SKILL_ROOT, "data");

/** Parse RFC 4180 CSV (quotes, escaped quotes, commas and newlines in fields). */
export function parseCSV(text) {
  // leading "# …" lines are notes for the reader ("Fuel, not a menu."), not rows
  text = text.replace(/^(?:#[^\n]*\n)+/, "");
  const rows = []; let row = []; let field = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

export function load(name) {
  const file = join(DATA, `${name}.csv`);
  if (!existsSync(file)) throw new Error(`Unknown data set "${name}". Look in ${DATA}`);
  return parseCSV(readFileSync(file, "utf8"));
}

/** Parse --flag value / --flag=value / --bool arguments. */
export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("="); // split at the first "=" only, so values may contain "="
      const k = eq < 0 ? a.slice(2) : a.slice(2, eq), v = eq < 0 ? undefined : a.slice(eq + 1);
      if (v !== undefined) out[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith("--")) out[k] = argv[++i];
      else out[k] = true;
    } else out._.push(a);
  }
  return out;
}

/** Friendly CLI errors (v2.5.0, C9): one line saying what is wrong, then the usage line, on stderr, exit 2; never a
 *  stack trace. `known` maps each flag to "bool" (takes no value: a word after it is a positional again), "value"
 *  (needs one) or "optional" (may take one). `--help` / `-h` print the usage and exit 0. `pos` = [min, max] positionals.
 *  Returns the args object, with bool flags normalised to true.  cli("search", USAGE, { n: "value", json: "bool" }, args()) */
export function cliDie(name, usage, msg) { console.error(`${name}: ${msg}\n${usage}`); process.exit(2); }
export function cli(name, usage, known, _ignored = null, { pos = [0, Infinity], argv = process.argv.slice(2) } = {}) {
  if (argv.includes("--help") || argv.includes("-h")) { console.log(usage); process.exit(0); }
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "--") { out._.push(...argv.slice(i + 1)); break; }
    if (/^-[^-\d]/.test(x)) cliDie(name, usage, `unknown flag ${x} (flags start with --)`);
    if (!x.startsWith("--")) { out._.push(x); continue; }
    const eq = x.indexOf("="); const k = eq < 0 ? x.slice(2) : x.slice(2, eq); const kind = known[k];
    if (!kind) cliDie(name, usage, `unknown flag --${k}`);
    if (eq >= 0) { out[k] = kind === "bool" ? !/^(false|0|no)$/i.test(x.slice(eq + 1)) : x.slice(eq + 1); continue; }
    if (kind === "bool") { out[k] = true; continue; }
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith("--")) { out[k] = next; i++; }
    else if (kind === "value") cliDie(name, usage, `--${k} needs a value`);
    else out[k] = true;
  }
  if (out._.length < pos[0]) cliDie(name, usage, pos[0] === 1 ? "missing argument" : `needs ${pos[0]} argument(s), got ${out._.length}`);
  if (out._.length > pos[1]) cliDie(name, usage, `unexpected argument "${out._[pos[1]]}"`);
  return out;
}

/** Seeded PRNG (mulberry32). Without a seed, uses crypto-strength randomness. */
export function rng(seed) {
  if (seed === undefined || seed === true) {
    const buf = new Uint32Array(1);
    return () => (webcrypto.getRandomValues(buf), buf[0] / 2 ** 32);
  }
  let s = typeof seed === "number" ? seed : [...String(seed)].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 2654435761), 1);
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = (arr, r) => arr[Math.floor(r() * arr.length)];

// ── Structural fingerprints (deterministic, offline) ─────────────────────────
// Two designs can use different IDs and still look like the same page. A fingerprint records the
// structural choices instead: layout family, type scale, section order, motion tier, signature type.
export const LAYOUT_FAMILY = {
  ledger: "rows", index: "rows", catalogue: "rows", "field-guide": "rows", broadsheet: "columns",
  "film-reel": "sequence", timeline: "sequence", room: "sequence", lookbook: "sequence",
  manifesto: "statement", poster: "statement", specimen: "statement", letter: "statement",
  "gallery-wall": "canvas", atlas: "canvas", stage: "stage", diptych: "split", // diptych: two halves in dialogue, its own family (was grouped with stage)
  workbench: "product", console: "product", shelf: "product",
};
const SECTION_ALIASES = {
  hero: ["hero", "intro", "landing", "opening", "cover", "masthead"], work: ["work", "projects", "portfolio", "cases", "case-studies", "selected-work"],
  about: ["about", "studio", "story", "team", "house", "mission"], contact: ["contact", "enquiries", "enquiry", "cta", "get-in-touch"],
  features: ["features", "how", "how-it-works", "process", "steps"], pricing: ["pricing", "plans", "rates", "rooms"],
  proof: ["proof", "testimonials", "quotes", "press", "logos"], products: ["products", "shop", "collection", "catalogue"],
  faq: ["faq", "questions"], footer: ["footer", "colophon"],
};
const canonSection = (s) => { const k = s.trim().toLowerCase().replace(/\s+/g, "-"); for (const [c, al] of Object.entries(SECTION_ALIASES)) if (al.includes(k)) return c; return k; };
const scaleBucket = (v) => { if (v == null || v === "") return undefined; const n = Number(v); if (Number.isNaN(n)) return String(v).toLowerCase(); return n < 1.2 ? "compact" : n <= 1.34 ? "moderate" : "dramatic"; };

// Build a fingerprint from whatever is known; unknown dimensions stay undefined and are skipped when comparing.
export function fingerprint({ archetype, layout, type_scale, sections, tier, signature, signature_type } = {}, signatures = []) {
  const sig = signatures.find((s) => s.id === signature);
  const fp = {
    layout: layout || LAYOUT_FAMILY[archetype] || undefined,
    type_scale: scaleBucket(type_scale),
    sections: sections ? (Array.isArray(sections) ? sections : String(sections).split(",")).map(canonSection).filter(Boolean) : undefined,
    tier: tier != null && tier !== "" ? Number(tier) : undefined,
    signature_type: signature_type || sig?.family || undefined,
  };
  Object.keys(fp).forEach((k) => fp[k] === undefined && delete fp[k]);
  return fp;
}

const lcs = (a, b) => { const d = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
  return d[a.length][b.length]; };
export const FP_WEIGHTS = { layout: 0.25, sections: 0.25, signature_type: 0.2, type_scale: 0.15, tier: 0.15 };

// Similarity 0..1 over the dimensions both fingerprints have. Returns per-dimension scores too.
export function similarity(a, b) {
  let num = 0, den = 0; const dims = {};
  for (const [k, w] of Object.entries(FP_WEIGHTS)) {
    if (a[k] === undefined || b[k] === undefined) continue;
    let s;
    if (k === "sections") s = lcs(a.sections, b.sections) / Math.max(a.sections.length, b.sections.length, 1); // same order = 1
    else if (k === "tier") s = 1 - Math.abs(a.tier - b.tier) / 4;
    else s = a[k] === b[k] ? 1 : 0;
    dims[k] = Math.round(s * 100) / 100; num += s * w; den += w;
  }
  return { score: den ? Math.round((num / den) * 100) / 100 : 0, dims, compared: Object.keys(dims).length };
}

// Which mutation breaks the overlap: the heaviest overlapping dimension decides.
export const DIMENSION_MUTATIONS = { layout: ["invert-axis", "wrong-room"], sections: ["remove-expected", "reverse-reveal"], signature_type: ["swap-material", "ui-is-content"], type_scale: ["scale-abuse"], tier: ["tempo-shift"] };
export function mutationFor(dims, used = []) {
  const order = Object.entries(dims).filter(([, s]) => s >= 0.75).sort((x, y) => FP_WEIGHTS[y[0]] * y[1] - FP_WEIGHTS[x[0]] * x[1]);
  for (const [k] of order) for (const m of DIMENSION_MUTATIONS[k]) if (!used.includes(m)) return { dimension: k, mutation: m };
  return null;
}
export const fpText = (fp) => Object.entries(fp).map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(">") : v}`).join(" · ") || "(empty)";
