"use client";
// @motomation-component
// id: thread
// name: Thread
// family: scroll
// tier: 2
// deps: react
// what: One line draws itself down the page as you scroll, linking sections like a seam, a route or a timeline.
// use-when: Journeys, timelines, craft (stitching, drawing), routes and process pages.
// avoid-when: As decoration on a page without a journey; together with another scroll signature.
// reduced-motion: The line is fully drawn and still.
// touch: Same as desktop.
// a11y: The SVG is decorative (aria-hidden); the content sits above it in normal flow.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useScrollProgress, clamp } from "../_lib/motion";

type Props = { children: ReactNode; path?: string; strokeWidth?: number; color?: string; className?: string; style?: CSSProperties };
const WAVE = "M50 0 C 90 120, 10 220, 50 340 S 90 560, 50 680 S 10 900, 50 1000";

export function Thread({ children, path = WAVE, strokeWidth = 2, color = "var(--accent, #e0442b)", className, style }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  useScrollProgress(wrap, (p) => {
    const l = line.current; if (!l) return; const len = l.getTotalLength();
    l.style.strokeDasharray = `${len}`; l.style.strokeDashoffset = `${len * (1 - clamp((p - 0.1) / 0.75))}`;
  }, !reduce);
  return (
    <div ref={wrap} className={className} style={{ position: "relative", ...style }}>
      <svg aria-hidden="true" viewBox="0 0 100 1000" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
        <path ref={line} d={path} fill="none" stroke={color} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      </svg>
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
