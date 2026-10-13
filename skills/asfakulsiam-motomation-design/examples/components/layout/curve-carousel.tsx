"use client";
// @motomation-component
// id: curve-carousel
// name: Curve Carousel
// family: layout
// tier: 2
// deps: react
// what: Cards sit on a shallow arc; the focused card is upright and in front, its neighbours tilt and recede. Arrow keys, buttons, drag and swipe move it.
// use-when: 3–9 case studies or products where one at a time is the point.
// avoid-when: Content people need to compare; more than 9 items; as autoplaying decoration.
// reduced-motion: Cards change position without easing.
// touch: Swipe left or right.
// a11y: A labelled region with previous/next buttons, aria-live status ("2 of 5"), and arrow-key support; hidden cards are inert.
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useDirection, useReducedMotion, EASE } from "../_lib/motion";

type Props = { items: ReactNode[]; label: string; spread?: number; tilt?: number; cardWidth?: number; className?: string; style?: CSSProperties };

export function CurveCarousel({ items, label, spread = 0.62, tilt = 12, cardWidth = 340, className, style }: Props) {
  const [at, setAt] = useState(0);
  const reduce = useReducedMotion();
  const drag = useRef<{ x: number } | null>(null);
  // on an RTL page the next card is to the left: ← is forward, a swipe to the right is forward, the arrows mirror
  const root = useRef<HTMLElement>(null); const s = useDirection(root) === "rtl" ? -1 : 1;
  const go = (d: number) => setAt((i) => Math.max(0, Math.min(items.length - 1, i + d)));
  return (
    <section ref={root} aria-roledescription="carousel" aria-label={label} className={className} style={{ display: "grid", gap: 16, ...style }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(s); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-s); } }}>
      <div style={{ position: "relative", height: cardWidth * 1.15, perspective: 1400, touchAction: "pan-y" }}
        onPointerDown={(e) => (drag.current = { x: e.clientX })} onPointerUp={(e) => { if (drag.current) { const dx = e.clientX - drag.current.x; if (Math.abs(dx) > 40) go(dx < 0 ? s : -s); } drag.current = null; }}>
        {items.map((it, i) => {
          const o = i - at, a = Math.abs(o);
          return (
            <div key={i} aria-hidden={o !== 0} inert={o !== 0 ? true : undefined} style={{ position: "absolute", left: "50%", top: 0, width: cardWidth, marginLeft: -cardWidth / 2,
              transform: `translateX(${s * o * cardWidth * spread}px) translateY(${a * a * 14}px) rotate(${s * o * tilt * 0.4}deg) rotateY(${-s * o * tilt}deg) scale(${1 - Math.min(a, 3) * 0.08})`,
              opacity: a > 2 ? 0 : 1 - a * 0.25, zIndex: 100 - a, transition: reduce ? "none" : `transform 520ms ${EASE.outStrong}, opacity 300ms linear`, pointerEvents: a > 2 ? "none" : undefined }}
              onClick={() => o !== 0 && setAt(i)}>{it}</div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center" }}>
        <button type="button" onClick={() => go(-1)} disabled={at === 0} aria-label="Previous" style={btn}>{s < 0 ? "→" : "←"}</button>
        <span aria-live="polite" style={{ fontVariantNumeric: "tabular-nums", fontSize: 14 }}>{at + 1} of {items.length}</span>
        <button type="button" onClick={() => go(1)} disabled={at === items.length - 1} aria-label="Next" style={btn}>{s < 0 ? "←" : "→"}</button>
      </div>
    </section>
  );
}
const btn: CSSProperties = { font: "inherit", width: 44, height: 44, borderRadius: 999, border: "1px solid currentColor", background: "transparent", color: "inherit", cursor: "pointer" };
