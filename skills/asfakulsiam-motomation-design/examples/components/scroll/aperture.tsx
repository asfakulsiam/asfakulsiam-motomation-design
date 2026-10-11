"use client";
// @motomation-component
// id: aperture
// name: Aperture
// family: scroll
// tier: 2
// deps: react
// what: The next section opens through a growing circle (an iris) as you scroll into it, from a small porthole to full bleed.
// use-when: A chapter change that is a real threshold: entering a room, a lens, a window, a reveal of the product.
// avoid-when: Every section; content that must be readable at the edges before the iris opens.
// reduced-motion: The section is fully open from the start.
// touch: Same as desktop.
// a11y: Content is always in the DOM and readable by assistive tech; only clip-path animates.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useScrollProgress, clamp } from "../_lib/motion";

type Props = { children: ReactNode; shape?: "circle" | "door"; from?: number; className?: string; style?: CSSProperties };

export function Aperture({ children, shape = "circle", from = 6, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useScrollProgress(ref, (p) => {
    const el = ref.current; if (!el) return; const k = clamp((p - 0.05) / 0.4);
    el.style.clipPath = shape === "circle" ? `circle(${from + (75 - from) * k}% at 50% 50%)` : `inset(0 ${(1 - k) * 42}% round ${(1 - k) * 999}px ${(1 - k) * 999}px 0 0)`;
  }, !reduce);
  return <div ref={ref} className={className} style={{ clipPath: reduce ? "none" : shape === "circle" ? `circle(${from}% at 50% 50%)` : "inset(0 42% round 999px 999px 0 0)", ...style }}>{children}</div>;
}
