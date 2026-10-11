"use client";
// @motomation-component
// id: glow-border
// name: Glow Border
// family: ui
// tier: 1
// deps: react
// what: The edge of a card lights up nearest the pointer, as if the pointer were a lamp held close to it; the light fades along the edge with distance. Only the border glows, never the surface.
// use-when: A row or grid of dark cards or inputs where the pointer's position should feel physical (a control panel, a studio's service list, pricing tiers).
// avoid-when: Light themes with low-contrast borders; single cards (no neighbours to compare); a page already using Spotlight Card on the same cards.
// reduced-motion: A steady, faint border.
// touch: A steady, faint border; the light follows a dragging finger.
// a11y: The glow layer is aria-hidden behind a solid inner surface, so content contrast never changes. It moves with transform under a 1-border-wide gap (no animated mask or gradient position). The listener only runs while the card is on screen.
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useInView, useReducedMotion } from "../_lib/motion";

type Props = { children: ReactNode; color?: string; base?: string; surface?: string; width?: number; radius?: number; reach?: number; className?: string; style?: CSSProperties };

export function GlowBorder({ children, color = "#ffcf7a", base = "rgba(255,255,255,.12)", surface = "#17140f", width = 1, radius = 14, reach = 220, className, style }: Props) {
  const frame = useRef<HTMLDivElement>(null), lamp = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const near = useInView(frame, { once: false, margin: "120px" });
  useEffect(() => {
    if (reduce || !near) return;
    let raf = 0, x = -9999, y = -9999;
    const paint = () => { raf = 0; const f = frame.current, l = lamp.current; if (!f || !l) return; const r = f.getBoundingClientRect();
      l.style.transform = `translate(${x - r.left - reach}px, ${y - r.top - reach}px)`; };
    const on = (e: globalThis.PointerEvent) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
    window.addEventListener("pointermove", on, { passive: true });
    return () => { window.removeEventListener("pointermove", on); cancelAnimationFrame(raf); };
  }, [reduce, near, reach]);
  return (
    <div ref={frame} className={className} style={{ position: "relative", padding: width, borderRadius: radius, background: base, overflow: "hidden", isolation: "isolate", ...style }}>
      <span ref={lamp} aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: reach * 2, height: reach * 2, borderRadius: "50%", zIndex: -1, pointerEvents: "none",
        transform: "translate(-9999px, -9999px)", background: `radial-gradient(closest-side, ${color}, transparent)` }} />
      <div style={{ position: "relative", borderRadius: Math.max(0, radius - width), background: surface, height: "100%" }}>{children}</div>
    </div>
  );
}
