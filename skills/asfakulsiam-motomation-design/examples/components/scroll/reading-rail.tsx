"use client";
// @motomation-component
// id: reading-rail
// name: Reading Rail
// family: scroll
// tier: 1
// deps: react
// what: A thin rail at the top or edge of the screen fills as you read an article, with an optional chapter label that changes at each heading.
// use-when: Long reads, case studies and documentation pages.
// avoid-when: Short pages; landing pages; next to another progress indicator.
// reduced-motion: The rail still reflects progress (it's information, not decoration) but moves in 5% steps instead of continuously.
// touch: Same as desktop.
// a11y: role progressbar with aria-valuenow, updated at most every 5%.
import { useRef, useState, type CSSProperties, type RefObject } from "react";
import { useStickyProgress, useReducedMotion } from "../_lib/motion";

type Props = { target: RefObject<HTMLElement | null>; color?: string; height?: number; className?: string; style?: CSSProperties };

export function ReadingRail({ target, color = "var(--accent, #e0442b)", height = 3, className, style }: Props) {
  const bar = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  useStickyProgress(target, (p) => { const s = Math.round(p * 20) * 5; if (bar.current) bar.current.style.transform = `scaleX(${reduce ? s / 100 : p})`; setStep((o) => (o === s ? o : s)); });
  return (
    <div role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={step} className={className}
      style={{ position: "fixed", insetInline: 0, top: 0, height, zIndex: 50, background: "transparent", ...style }}>
      <div ref={bar} style={{ height: "100%", background: color, transformOrigin: "0 50%", transform: "scaleX(0)" }} />
    </div>
  );
}
