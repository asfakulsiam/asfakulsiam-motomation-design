"use client";
// @motomation-component
// id: light-sweep
// name: Light Sweep
// family: backgrounds
// tier: 1
// deps: react
// what: A slow band of light crosses a surface every few seconds, like sun moving through a window or a scanner pass.
// use-when: Architecture, light, time-of-day and hospitality concepts; behind one hero or one card.
// avoid-when: Behind text where the band would drop contrast; as a "shimmer" on buttons; more than one per screen.
// reduced-motion: No sweep.
// touch: Same as desktop.
// a11y: Decorative (aria-hidden, pointer-events none). CSS only.
import type { CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { seconds?: number; angle?: number; strength?: number; className?: string; style?: CSSProperties };

export function LightSweep({ seconds = 9, angle = 110, strength = 0.18, className, style }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <span aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}>
      <span style={{ position: "absolute", inset: "-50%", background: `linear-gradient(${angle}deg, transparent 42%, rgba(255,250,235,${strength}) 50%, transparent 58%)`, animation: `mm-sweep ${seconds}s cubic-bezier(.65,0,.35,1) infinite` }} />
      <style>{`@keyframes mm-sweep{0%{transform:translateX(-60%)}60%,100%{transform:translateX(60%)}}`}</style>
    </span>
  );
}
