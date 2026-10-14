"use client";
// @motomation-component
// id: sticker-scatter
// name: Sticker Scatter
// family: micro
// tier: 2
// deps: react
// what: Clicking the logo or name bursts a handful of on-brand stickers (emoji or short glyphs) that fly out, spin, land and fade, like emptying a pocket of stickers.
// use-when: Light-hearted personal sites, festivals, kids' brands and events; the logo only.
// avoid-when: Serious or institutional briefs; buttons that do something else; repeated clicks on every page element.
// reduced-motion: Stickers appear around the logo and fade without flying or spinning.
// touch: Works on tap.
// a11y: The trigger keeps its normal role and name; stickers are aria-hidden and never block clicks.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { children: ReactNode; stickers: string[]; count?: number; spread?: number; className?: string; style?: CSSProperties };

export function StickerScatter({ children, stickers, count = 8, spread = 180, className, style }: Props) {
  const host = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const burst = () => {
    const h = host.current; if (!h) return;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span"); s.setAttribute("aria-hidden", "true");
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.6, d = spread * (0.5 + Math.random() * 0.5), rot = (Math.random() - 0.5) * 540;
      Object.assign(s.style, { position: "absolute", left: "50%", top: "50%", pointerEvents: "none", fontSize: "1.6em", transform: "translate(-50%,-50%) scale(.3)", opacity: "1", transition: reduce ? "opacity 600ms linear 400ms" : "transform 700ms cubic-bezier(.16,1,.3,1), opacity 400ms linear 900ms", zIndex: "5" });
      s.textContent = stickers[i % stickers.length]; h.appendChild(s);
      requestAnimationFrame(() => { s.style.transform = reduce ? `translate(calc(-50% + ${Math.cos(a) * d * 0.4}px), calc(-50% + ${Math.sin(a) * d * 0.4}px)) scale(1)` : `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) rotate(${rot}deg) scale(1)`; s.style.opacity = "0"; });
      setTimeout(() => s.remove(), 1500);
    }
  };
  return <span ref={host} onClick={burst} className={className} style={{ position: "relative", display: "inline-block", ...style }}>{children}</span>;
}
