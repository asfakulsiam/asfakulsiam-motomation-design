// @motomation-variant
// id: contour-lines
// react: skills/asfakulsiam-motomation-design/examples/components/backgrounds/contour-lines.tsx
// markup: <div data-mm="contour-lines" aria-hidden="true" [data-lines="14" data-seed="7" data-seconds="30"]></div> (inside a positioned parent)
// behaviour: draws `lines` closed contour curves, deterministic from `seed` (same seed → the same drawing as the React
//   version), split across three SVG layers that drift slowly (±6 px, ±1% scale) at three tempos as composited transforms.
// reduced-motion: Still lines.  touch: Same as desktop.
import { reduced, mountAll } from "../_lib/motion.js";
const rand = (s) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
const NS = "http://www.w3.org/2000/svg";

export function paths(lines = 14, seed = 7) {
  const r = rand(seed); const cx = 300 + r() * 400, cy = 200 + r() * 200;
  return Array.from({ length: lines }, (_, i) => {
    const base = 30 + i * 28; const pts = Array.from({ length: 24 }, (_, k) => { const a = (k / 24) * Math.PI * 2; const rr = base * (1 + 0.18 * Math.sin(a * 3 + i * 0.6) + 0.1 * (r() - 0.5)); return [cx + Math.cos(a) * rr * 1.4, cy + Math.sin(a) * rr]; });
    const mid = (p, q) => `${((p[0] + q[0]) / 2).toFixed(1)},${((p[1] + q[1]) / 2).toFixed(1)}`;
    return `M${mid(pts[pts.length - 1], pts[0])} ` + pts.map((p, k) => `Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${mid(p, pts[(k + 1) % pts.length])}`).join(" ") + "Z";
  });
}
export function mount(el) {
  const d = el.dataset, all = paths(+(d.lines ?? 14), +(d.seed ?? 7)), seconds = +(d.seconds ?? 30), still = reduced();
  const anims = [0, 1, 2].map((g) => {
    const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", "0 0 1000 600"); svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%" + (still ? "" : ";will-change:transform");
    for (const p of all.filter((_, i) => i % 3 === g)) { const path = document.createElementNS(NS, "path"); path.setAttribute("d", p); path.setAttribute("fill", "none"); path.setAttribute("stroke", "currentColor"); path.setAttribute("stroke-width", "1"); path.setAttribute("vector-effect", "non-scaling-stroke"); svg.append(path); }
    el.append(svg);
    return still ? null : svg.animate([{ transform: "translate(-6px,-3px) scale(.99)" }, { transform: "translate(6px,3px) scale(1.01)" }], { duration: (seconds + g * 7) * 1000, delay: -g * 4000, easing: "ease-in-out", iterations: Infinity, direction: g === 1 ? "alternate-reverse" : "alternate" });
  });
  return () => { anims.forEach((a) => a?.cancel()); el.replaceChildren(); };
}
export const mountContourLines = (root) => mountAll("contour-lines", mount, root);
mountContourLines();
