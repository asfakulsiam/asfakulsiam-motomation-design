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
// reduced-motion: The shafts, still, at their resting angles (this is also the poster).
// touch: Same as desktop (no pointer input).
// a11y: Decorative (aria-hidden). Capability probe (Save-Data, ≤ 2 cores, < 4 GB → still poster); only transform animates (composite-only), via Web Animations that pause off screen and in hidden tabs; absolute box, so no layout shift. Shafts are faint (≤ 0.36 alpha) and their soft edges are a static mask on a transformed layer (not animated), so text contrast is checked on the ground. No canvas, so no DPR cost.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useCapability, useAmbientAnimations } from "../_lib/ambient";

type Props = { count?: number; light?: string; ground?: string; angle?: number; className?: string; style?: CSSProperties };

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
      {Array.from({ length: count }, (_, i) => (
        // one shaft per window, spaced across the top edge (and one window's width past the left edge, since the light leans right-to-left)
        <span key={i} data-beam="" style={{ position: "absolute", left: `${-6 + (i + 0.5) * (112 / count)}%`, top: "-8%", width: `${(52 / count) * (0.8 + (i % 2) * 0.4)}%`, height: "140%", transformOrigin: "50% 0",
          transform: `rotate(${angle}deg)`, background: `linear-gradient(to bottom, rgba(${light}, ${0.26 + (i % 3) * 0.05}), rgba(${light}, .08) 55%, transparent 85%)`, borderRadius: 2,
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 25%, #000 75%, transparent)", maskImage: "linear-gradient(to right, transparent, #000 25%, #000 75%, transparent)" }} />
      ))}
    </span>
  );
}
