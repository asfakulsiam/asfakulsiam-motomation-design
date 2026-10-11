"use client";
// @motomation-component
// id: mesh-gradient
// name: Mesh Gradient
// family: backgrounds
// tier: 4
// deps: react
// what: Four soft pools of colour drift very slowly over a ground colour and blend where they meet, like a dyed silk or a weather map. CSS only: each pool is a radial gradient moved with transform; no blur filter, no WebGL.
// use-when: The palette itself is the brand (a paint, a cosmetics line, a dye house, a weather service), and a calmer, cheaper option than Liquid Field is right.
// avoid-when: As the default "modern" hero background; behind body copy; with more than one other effect on the page; with clashing colours (the overlaps make new ones).
// reduced-motion: The pools, still, in their resting places (this is also the poster).
// touch: Same as desktop.
// a11y: Decorative (aria-hidden). Capability probe (Save-Data, ≤ 2 cores, < 4 GB → still poster); transform-only Web Animations, paused off screen and in hidden tabs; absolute box, so no layout shift. Pick pool colours with the same lightness as the ground so text contrast holds everywhere. No canvas, so no DPR cost.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useCapability, useAmbientAnimations } from "../_lib/ambient";

type Props = { ground?: string; colors?: [string, string, string, string]; duration?: number; className?: string; style?: CSSProperties };
const SPOTS = [[-10, -15], [55, -20], [-15, 45], [50, 40]] as const;

export function MeshGradient({ ground = "#efe3d0", colors = ["#e8a87c", "#c9b6e4", "#9fd3c7", "#f3d27a"], duration = 24000, className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const cap = useCapability(false);
  useAmbientAnimations(ref, !!cap?.ok && !reduce, (root) => Array.from(root.querySelectorAll<HTMLElement>("[data-pool]")).map((el, i) => {
    const dx = (i % 2 ? -1 : 1) * (14 + i * 3), dy = (i < 2 ? 1 : -1) * (10 + i * 2);
    return el.animate([{ transform: "translate(0, 0) scale(1)" }, { transform: `translate(${dx}%, ${dy}%) scale(${1.1 - i * 0.04})` }],
      { duration: duration + i * 3100, direction: "alternate", iterations: Infinity, easing: "cubic-bezier(0.45, 0, 0.55, 1)", delay: -i * 4000 });
  }));
  return (
    <span ref={ref} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: ground, ...style }}>
      {colors.map((c, i) => (
        <span key={i} data-pool="" style={{ position: "absolute", left: `${SPOTS[i][0]}%`, top: `${SPOTS[i][1]}%`, width: "75%", aspectRatio: "1", borderRadius: "50%",
          background: `radial-gradient(closest-side, ${c}, ${c}00)`, opacity: 0.85 }} />
      ))}
    </span>
  );
}
