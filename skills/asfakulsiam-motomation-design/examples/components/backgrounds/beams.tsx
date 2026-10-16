"use client";
// @motomation-component
// id: beams
// name: Beams
// family: backgrounds
// tier: 4
// deps: react
// what: Parallel shafts of sunlight fall through a row of high windows (a clerestory, a mill, a stage rig) at one shared angle and sway slightly in depth. CSS 3D only: soft gradient shafts rotated in a perspective space; no WebGL, because transforms are enough here.
// use-when: Churches, mills, warehouses, galleries, theatres, anything lit through high windows: behind one dark hero.
// avoid-when: Bright themes; as "spotlight on our product" decoration; together with other moving backgrounds.
// reduced-motion: A designed still with its own composition: one follow-spot (a single cone from the rig onto an empty stage, a sharp oval pool, dust only in the light), not the five shafts stopped.
// touch: Same as desktop (no pointer input).
// a11y: Decorative (aria-hidden). Capability probe (Save-Data, ≤ 2 cores, < 4 GB → still poster); only transform animates (composite-only), via Web Animations that pause off screen and in hidden tabs; absolute box, so no layout shift. Shafts are faint (≤ 0.36 alpha) and their soft edges are a static mask on a transformed layer (not animated), so text contrast is checked on the ground. No canvas, so no DPR cost.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useCapability, useAmbientAnimations } from "../_lib/ambient";

type Props = { count?: number; light?: string; ground?: string; angle?: number; className?: string; style?: CSSProperties };

// Reduced motion: noon, held. The swaying shafts become hard-edged light falling through the windows and landing as
// bright pools on the floor, with dust caught in them: the same light and ground, composed as a room, not a paused sway.
// The reduced-motion still is its own picture, not the shafts stopped: one follow-spot. The rig across the top, a single
// cone of light dropping from one lamp onto an empty stage, and the sharp oval pool where it lands; dust only inside
// the cone, the rest of the hall dark. Five moving shafts say "light passing"; one fixed cone says "the stage is set".
function BeamsStill({ light, ground }: { light: string; ground: string }) {
  const L = `rgb(${light})`, x = 1000;
  const motes = [[-40, 260], [22, 330], [-8, 430], [55, 520], [-70, 600], [30, 680], [90, 740], [-110, 760]];
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="be-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={L} stopOpacity=".34" /><stop offset="1" stopColor={L} stopOpacity=".1" /></linearGradient>
        <radialGradient id="be-p" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor={L} stopOpacity=".55" /><stop offset=".75" stopColor={L} stopOpacity=".3" /><stop offset="1" stopColor={L} stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1600" height="1000" fill={ground} />
      <rect y="40" width="1600" height="5" fill={L} fillOpacity=".14" />
      <rect x={x - 22} y="45" width="44" height="26" rx="4" fill={L} fillOpacity=".3" />
      <rect y="830" width="1600" height="170" fill={L} fillOpacity=".035" />
      <rect y="830" width="1600" height="2" fill={L} fillOpacity=".12" />
      <path d={`M${x - 16} 71H${x + 16}L${x + 230} 836H${x - 230}Z`} fill="url(#be-c)" />
      <ellipse cx={x} cy="838" rx="300" ry="52" fill="url(#be-p)" />
      {motes.map(([dx, y], i) => <circle key={i} cx={x + dx * (y / 760)} cy={y} r="1.8" fill={L} fillOpacity=".75" />)}
    </svg>
  );
}

export function Beams({ count = 5, light = "255, 236, 200", ground = "#0e0c0a", angle = 18, className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const cap = useCapability(false);
  useAmbientAnimations(ref, !!cap?.ok && !reduce, (root) => Array.from(root.querySelectorAll<HTMLElement>("[data-beam]")).map((el, i) => {
    const sway = 1.5 + (i % 3) * 0.8;
    return el.animate([{ transform: `rotate(${angle - sway}deg) rotateY(-14deg)` }, { transform: `rotate(${angle + sway}deg) rotateY(14deg)` }],
      { duration: 9000 + i * 1700, direction: "alternate", iterations: Infinity, easing: "cubic-bezier(0.45, 0, 0.55, 1)", delay: -i * 2300 });
  }));
  return (
    <span ref={ref} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: `linear-gradient(to bottom, rgba(${light}, .06), transparent 50%), ${ground}`, perspective: 900, ...style }}>
      {reduce ? <BeamsStill light={light} ground={ground} /> : Array.from({ length: count }, (_, i) => (
        // one shaft per window, spaced across the top edge (and one window's width past the left edge, since the light leans right-to-left)
        <span key={i} data-beam="" style={{ position: "absolute", left: `${-6 + (i + 0.5) * (112 / count)}%`, top: "-8%", width: `${(52 / count) * (0.8 + (i % 2) * 0.4)}%`, height: "140%", transformOrigin: "50% 0",
          transform: `rotate(${angle}deg)`, background: `linear-gradient(to bottom, rgba(${light}, ${0.26 + (i % 3) * 0.05}), rgba(${light}, .08) 55%, transparent 85%)`, borderRadius: 2,
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 25%, #000 75%, transparent)", maskImage: "linear-gradient(to right, transparent, #000 25%, #000 75%, transparent)" }} />
      ))}
    </span>
  );
}
