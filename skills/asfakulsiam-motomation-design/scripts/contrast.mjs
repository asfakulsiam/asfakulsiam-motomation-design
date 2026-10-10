#!/usr/bin/env node
// WCAG 2.x contrast checker.
// Usage: node scripts/contrast.mjs "#151412" "#F3F0EA"   |   node scripts/contrast.mjs --palettes
import { load, args } from "./lib.mjs";

const hex = (h) => {
  let s = String(h).trim().replace(/^#/, "");
  if (s.length === 3) s = [...s].map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(s)) throw new Error(`Not a hex colour: ${h}`);
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
};
const lum = (h) => { const [r, g, b] = hex(h).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const verdict = (r) => `${r.toFixed(2)}:1  body ${r >= 4.5 ? "PASS" : "FAIL"} · large ${r >= 3 ? "PASS" : "FAIL"} · AAA ${r >= 7 ? "PASS" : "—"}`;

const a = args();
if (a.palettes) {
  let bad = 0;
  for (const p of load("palettes")) {
    const checks = [["ink/ground", p.ink, p.ground, 7], ["ink/surface", p.ink, p.surface, 4.5], ["muted/ground", p.muted, p.ground, 4.5], ["accent-ink/accent", p.accent_ink, p.accent, 4.5], ["accent/ground (UI)", p.accent, p.ground, 3]];
    const fails = checks.filter(([, f, b, min]) => ratio(f, b) < min);
    bad += fails.length;
    console.log(`${fails.length ? "✗" : "✓"} ${p.name.padEnd(24)} ${checks.map(([n, f, b]) => `${n} ${ratio(f, b).toFixed(1)}`).join(" · ")}`);
  }
  process.exit(bad ? 1 : 0);
}
const [fg, bg] = a._;
if (!fg || !bg) { console.log('Usage: node scripts/contrast.mjs "<foreground>" "<background>"  |  --palettes'); process.exit(1); }
const r = ratio(fg, bg);
console.log(`${fg} on ${bg}: ${verdict(r)}`);
process.exit(r >= 4.5 ? 0 : 1);
