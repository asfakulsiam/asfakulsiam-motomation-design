"use client";
// @motomation-component
// id: click-spark
// name: Click Spark
// family: micro
// tier: 1
// deps: react
// what: A tiny burst of lines radiates from the click point inside a wrapped area, then disappears.
// use-when: Playful brands, games, and one celebratory action (a like, a ticket added).
// avoid-when: Every click on the page; serious briefs; forms.
// reduced-motion: No spark.
// touch: Works on tap.
// a11y: Decorative SVG lines (aria-hidden, pointer-events none); children keep their roles.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { children: ReactNode; color?: string; count?: number; length?: number; className?: string; style?: CSSProperties };

export function ClickSpark({ children, color = "var(--accent, #e0442b)", count = 8, length = 14, className, style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const spark = (e: React.PointerEvent) => {
    const h = host.current; if (!h || reduce) return; const r = h.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    const ns = "http://www.w3.org/2000/svg"; const svg = document.createElementNS(ns, "svg"); svg.setAttribute("aria-hidden", "true");
    Object.assign(svg.style, { position: "absolute", left: `${x - 40}px`, top: `${y - 40}px`, width: "80px", height: "80px", pointerEvents: "none", overflow: "visible" });
    for (let i = 0; i < count; i++) { const a = (i / count) * Math.PI * 2; const l = document.createElementNS(ns, "line");
      l.setAttribute("x1", String(40 + Math.cos(a) * 8)); l.setAttribute("y1", String(40 + Math.sin(a) * 8)); l.setAttribute("x2", String(40 + Math.cos(a) * (8 + length))); l.setAttribute("y2", String(40 + Math.sin(a) * (8 + length)));
      l.setAttribute("stroke", color); l.setAttribute("stroke-width", "2"); l.setAttribute("stroke-linecap", "round"); l.style.strokeDasharray = `${length}`; l.style.strokeDashoffset = "0";
      l.style.transition = "stroke-dashoffset 380ms cubic-bezier(.22,1,.36,1), transform 380ms cubic-bezier(.22,1,.36,1)"; l.style.transformOrigin = "40px 40px"; svg.appendChild(l); }
    h.appendChild(svg); requestAnimationFrame(() => svg.querySelectorAll("line").forEach((l) => { l.style.strokeDashoffset = `${-length}`; l.style.transform = "scale(1.4)"; }));
    setTimeout(() => svg.remove(), 420);
  };
  return <div ref={host} onPointerDown={spark} className={className} style={{ position: "relative", ...style }}>{children}</div>;
}
