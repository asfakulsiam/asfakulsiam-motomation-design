"use client";
// @motomation-component
// id: shimmer-button
// name: Shimmer Button
// family: ui
// tier: 1
// deps: react
// what: A button that a narrow band of light crosses once when you point at it or focus it, and that presses down slightly when clicked.
// use-when: The one primary action on a dark or metallic surface (book, reserve, buy) where a little glint suits the material.
// avoid-when: More than one per screen; secondary actions; a page already using Light Sweep; light, paper-like brands (the glint reads as plastic).
// reduced-motion: No band; the press still darkens the button (colour, not movement).
// touch: The band crosses on press; no hover needed.
// a11y: A real <button> (or <a> with href). Focus ring is the browser's own, never removed. The band moves with transform only and runs once per trigger. Press feedback 120ms (UI feedback ≤ 250ms).
import { useRef, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { useReducedMotion, EASE, DUR } from "../_lib/motion";

type Props = { children: ReactNode; href?: string; onClick?: () => void; type?: "button" | "submit"; tone?: string; ink?: string; shine?: string; className?: string; style?: CSSProperties };

export function ShimmerButton({ children, href, onClick, type = "button", tone = "#1d1a16", ink = "#f4ecdc", shine = "rgba(255,240,205,.55)", className, style }: Props) {
  const band = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const sweep = () => { if (reduce || !band.current) return;
    band.current.animate([{ transform: "translateX(-120%) skewX(-20deg)" }, { transform: "translateX(320%) skewX(-20deg)" }], { duration: 760, easing: EASE.inOut }); };
  const css: CSSProperties = { position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", gap: ".5em", padding: ".85em 1.5em", border: 0, borderRadius: 999,
    background: tone, color: ink, font: "inherit", fontWeight: 600, letterSpacing: ".01em", textDecoration: "none", cursor: "pointer", isolation: "isolate",
    transition: `transform ${DUR.press}ms ${EASE.out}, filter ${DUR.press}ms`, ...style };
  const inner = (
    <>
      <span ref={band} aria-hidden="true" style={{ position: "absolute", inset: "-20% auto -20% 0", width: "32%", transform: "translateX(-120%) skewX(-20deg)", zIndex: -1,
        background: `linear-gradient(90deg, transparent, ${shine}, transparent)`, pointerEvents: "none" }} />
      {children}
    </>
  );
  const handlers = {
    onPointerEnter: (e: PointerEvent) => { if (e.pointerType === "mouse") sweep(); },
    onFocus: sweep,
    onPointerDown: (e: PointerEvent<HTMLElement>) => { if (e.pointerType !== "mouse") sweep(); e.currentTarget.style.transform = reduce ? "" : "scale(.97)"; e.currentTarget.style.filter = "brightness(.88)"; },
    onPointerUp: (e: PointerEvent<HTMLElement>) => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = ""; },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = ""; },
  };
  return href
    ? <a href={href} className={className} style={css} {...handlers}>{inner}</a>
    : <button type={type} onClick={onClick} className={className} style={css} {...handlers}>{inner}</button>;
}
