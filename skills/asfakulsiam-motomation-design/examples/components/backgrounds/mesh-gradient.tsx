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
// reduced-motion: A designed still: a colour study. The four colours laid out as soft horizontal fields (horizon, body, ground) with a fine grain; not the drift stopped.
// touch: Same as desktop.
// a11y: Decorative (aria-hidden). Capability probe (Save-Data, ≤ 2 cores, < 4 GB → still poster); transform-only Web Animations, paused off screen and in hidden tabs; absolute box, so no layout shift. Pick pool colours with the same lightness as the ground so text contrast holds everywhere. No canvas, so no DPR cost.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useCapability, useAmbientAnimations } from "../_lib/ambient";

type Props = { ground?: string; colors?: [string, string, string, string]; duration?: number; className?: string; style?: CSSProperties };
const SPOTS = [[-10, -15], [55, -20], [-15, 45], [50, 40]] as const;

// Reduced motion: a colour study. The drifting pools are laid out as three soft horizontal fields (a horizon, a body, a
// ground) with a fine grain, so the still is a composed print in the same palette rather than the drift stopped.
function MeshStill({ ground, colors }: { ground: string; colors: string[] }) {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
      <defs>
        <filter id="mg-b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="60" /></filter>
        <filter id="mg-g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0" /></filter>
      </defs>
      <rect width="1600" height="1000" fill={ground} />
      <g filter="url(#mg-b)" opacity=".85">
        <rect x="120" y="90" width="1360" height="230" rx="110" fill={colors[0]} />
        <rect x="60" y="390" width="980" height="300" rx="140" fill={colors[1]} />
        <rect x="820" y="420" width="700" height="260" rx="130" fill={colors[2]} />
        <rect x="200" y="760" width="1200" height="180" rx="90" fill={colors[3]} />
      </g>
      <rect width="1600" height="1000" filter="url(#mg-g)" opacity=".18" />
    </svg>
  );
}

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
      {reduce ? <MeshStill ground={ground} colors={colors} /> : colors.map((c, i) => (
        <span key={i} data-pool="" style={{ position: "absolute", left: `${SPOTS[i][0]}%`, top: `${SPOTS[i][1]}%`, width: "75%", aspectRatio: "1", borderRadius: "50%",
          background: `radial-gradient(closest-side, ${c}, ${c}00)`, opacity: 0.85 }} />
      ))}
    </span>
  );
}
