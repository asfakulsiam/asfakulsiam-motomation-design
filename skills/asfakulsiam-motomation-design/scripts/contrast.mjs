#!/usr/bin/env node
// WCAG 2.x contrast checker.
// Usage: node scripts/contrast.mjs "#151412" "#F3F0EA"   |   node scripts/contrast.mjs --palettes
// Ratios are shown floor-rounded (4.497 prints as 4.49, never as 4.50), so a printed number never looks like a pass
// it is not.
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load, args, cli } from "./lib.mjs";

const hex = (h) => {
  let s = String(h).trim().replace(/^#/, "");
  if (s.length === 3) s = [...s].map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(s)) throw new Error(`Not a hex colour: ${h}`);
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
};
const lum = (h) => { const [r, g, b] = hex(h).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
/** Floor-round to `d` decimals, for display. Comparisons always use the raw ratio. */
export const floorTo = (r, d = 2) => (Math.floor(r * 10 ** d + 1e-9) / 10 ** d).toFixed(d);
const verdict = (r) => `${floorTo(r)}:1  body ${r >= 4.5 ? "PASS" : "FAIL"} · large ${r >= 3 ? "PASS" : "FAIL"} · AAA ${r >= 7 ? "PASS" : "—"}`;

/** accent_text in data/palettes.csv: "body" = the accent may set text of any size on the ground (≥ 4.5:1);
 *  "large-only" = only text ≥ 24px (or ≥ 18.66px bold) and UI marks (≥ 3:1). */
export const accentTextClass = (p) => (ratio(p.accent, p.ground) >= 4.5 ? "body" : "large-only");

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const a = cli("contrast", 'Usage: node scripts/contrast.mjs "<foreground>" "<background>"  |  --palettes', { palettes: "bool" }, null, { pos: [0, 2] });
  if (a.palettes) {
    let bad = 0;
    for (const p of load("palettes")) {
      const checks = [["ink/ground", p.ink, p.ground, 7], ["ink/surface", p.ink, p.surface, 4.5], ["muted/ground", p.muted, p.ground, 4.5], ["accent-ink/accent", p.accent_ink, p.accent, 4.5], ["accent/ground (UI)", p.accent, p.ground, 3]];
      const fails = checks.filter(([, f, b, min]) => ratio(f, b) < min).map(([n]) => n);
      // accent as text: 4.5:1 on the ground. A palette below it must be marked large-only, and the mark must be true.
      const asText = ratio(p.accent, p.ground), need = accentTextClass(p);
      if (!p.accent_text) fails.push("accent_text column missing");
      else if (p.accent_text !== need) fails.push(`accent_text is "${p.accent_text}" but accent/ground is ${floorTo(asText)}:1 → "${need}"`);
      bad += fails.length;
      const mark = need === "body" ? "body ✓" : "large-only";
      console.log(`${fails.length ? "✗" : "✓"} ${p.name.padEnd(24)} ${checks.map(([n, f, b]) => `${n} ${floorTo(ratio(f, b))}`).join(" · ")} · accent-as-text ${floorTo(asText)} (${mark})${fails.length ? "  ← " + fails.join("; ") : ""}`);
    }
    process.exit(bad ? 1 : 0);
  }
  const [fg, bg] = a._;
  const USAGE = 'Usage: node scripts/contrast.mjs "<foreground>" "<background>"  |  --palettes';
  if (!fg || !bg) { console.error(`contrast: ${fg ? "missing the background colour" : "missing both colours"}\n${USAGE}`); process.exit(2); }
  let r; try { r = ratio(fg, bg); } catch (e) { console.error(`contrast: ${e.message} (use #rgb or #rrggbb)\n${USAGE}`); process.exit(2); }
  console.log(`${fg} on ${bg}: ${verdict(r)}`);
  process.exit(r >= 4.5 ? 0 : 1);
}
