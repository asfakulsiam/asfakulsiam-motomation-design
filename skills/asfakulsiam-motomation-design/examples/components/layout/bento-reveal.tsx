"use client";
// @motomation-component
// id: bento-reveal
// name: Bento Reveal
// family: layout
// tier: 1
// deps: react
// what: A modular grid of mixed-size tiles that enter in reading order with a short stagger the first time the grid scrolls in.
// use-when: Content that truly has mixed weights (one big feature, several small facts).
// avoid-when: Equal-weight content (use a list); as the default landing layout (it's overused); more than one per page.
// reduced-motion: Tiles are visible from the start.
// touch: Collapses to one column below 640px.
// a11y: A normal list; order in the DOM matches visual order.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView, useReducedMotion, useMedia, EASE } from "../_lib/motion";

type Tile = { content: ReactNode; col?: number; row?: number };
type Props = { tiles: Tile[]; columns?: number; className?: string; style?: CSSProperties };

export function BentoReveal({ tiles, columns = 4, className, style }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref);
  const reduce = useReducedMotion();
  const narrow = useMedia("(max-width: 639px)");
  const on = seen || reduce;
  return (
    <ul ref={ref} className={className} style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: narrow ? "1fr" : `repeat(${columns}, 1fr)`, gridAutoRows: "minmax(160px, auto)", gap: 16, ...style }}>
      {tiles.map((t, i) => (
        <li key={i} style={{ gridColumn: narrow ? "auto" : `span ${t.col || 1}`, gridRow: narrow ? "auto" : `span ${t.row || 1}`, padding: 24, borderRadius: 16, background: "var(--surface, #fff)", border: "1px solid var(--line, rgba(0,0,0,.12))",
          opacity: on ? 1 : 0, transform: on ? "none" : "translateY(16px)", transition: reduce ? "none" : `opacity 500ms ${EASE.out} ${i * 70}ms, transform 700ms ${EASE.outStrong} ${i * 70}ms` }}>{t.content}</li>
      ))}
    </ul>
  );
}
