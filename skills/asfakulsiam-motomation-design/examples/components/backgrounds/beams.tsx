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
// reduced-motion: A designed still: noon held. Hard-edged shafts fall through the windows and land as bright pools on the floor, dust caught in the light; not the sway stopped.
// touch: Same as desktop (no pointer input).
// a11y: Decorative (aria-hidden). Capability probe (Save-Data, ≤ 2 cores, < 4 GB → still poster); only transform animates (composite-only), via Web Animations that pause off screen and in hidden tabs; absolute box, so no layout shift. Shafts are faint (≤ 0.36 alpha) and their soft edges are a static mask on a transformed layer (not animated), so text contrast is checked on the ground. No canvas, so no DPR cost.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useCapability, useAmbientAnimations } from "../_lib/ambient";

type Props = { count?: number; light?: string; ground?: string; angle?: number; className?: string; style?: CSSProperties };

// Reduced motion: noon, held. The swaying shafts become hard-edged light falling through the windows and landing as
// bright pools on the floor, with dust caught in them: the same light and ground, composed as a room, not a paused sway.
function BeamsStill({ count, light, ground, angle }: { count: number; light: string; ground: string; angle: number }) {
  const k = Math.tan((angle * Math.PI) / 180) * 760, w = 900 / count;
  const shafts = Array.from({ length: count }, (_, i) => { const x = 220 + i * (1360 / count); return { x, d: `M${x} 0H${x + w * 0.55}L${x + w * 0.55 - k} 760H${x - k}Z` }; });
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
      <defs><linearGradient id="be-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`rgb(${light})`} stopOpacity=".3" /><stop offset="1" stopColor={`rgb(${light})`} stopOpacity=".08" /></linearGradient></defs>
      <rect width="1600" height="1000" fill={ground} />
      <rect y="760" width="1600" height="240" fill={`rgb(${light})`} fillOpacity=".04" />
      {shafts.map(({ x, d }, i) => <g key={i}><path d={d} fill="url(#be-s)" />
        <path d={`M${x - k} 760H${x + w * 0.55 - k}L${x + w * 0.75 - k * 1.25} 900H${x - k * 1.25 - w * 0.2}Z`} fill={`rgb(${light})`} fillOpacity=".22" />
        {[0.2, 0.45, 0.7].map((f, j) => <circle key={j} cx={x + w * 0.3 - k * f} cy={760 * f} r="1.6" fill={`rgb(${light})`} fillOpacity=".7" />)}</g>)}
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
      {reduce ? <BeamsStill count={count} light={light} ground={ground} angle={angle} /> : Array.from({ length: count }, (_, i) => (
        // one shaft per window, spaced across the top edge (and one window's width past the left edge, since the light leans right-to-left)
        <span key={i} data-beam="" style={{ position: "absolute", left: `${-6 + (i + 0.5) * (112 / count)}%`, top: "-8%", width: `${(52 / count) * (0.8 + (i % 2) * 0.4)}%`, height: "140%", transformOrigin: "50% 0",
          transform: `rotate(${angle}deg)`, background: `linear-gradient(to bottom, rgba(${light}, ${0.26 + (i % 3) * 0.05}), rgba(${light}, .08) 55%, transparent 85%)`, borderRadius: 2,
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 25%, #000 75%, transparent)", maskImage: "linear-gradient(to right, transparent, #000 25%, #000 75%, transparent)" }} />
      ))}
    </span>
  );
}
