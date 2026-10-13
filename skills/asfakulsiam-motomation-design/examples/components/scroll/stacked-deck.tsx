"use client";
// @motomation-component
// id: stacked-deck
// name: Stacked Deck
// family: scroll
// tier: 2
// deps: react
// what: Cards stick one after another and stack like a deck; covered cards step back and dim, leaving their titles as a table of contents.
// use-when: Sequences, case studies, steps and services with 3–6 items.
// avoid-when: More than 6 cards; cards taller than the viewport; content that must be compared side by side.
// reduced-motion: A plain ordered list in normal flow: no sticky, no scale, no dim; every card is a full, readable block.
// touch: Same as desktop; on short screens the offset per card shrinks.
// a11y: A normal ordered list; every card is reachable and readable.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useStickyProgress } from "../_lib/motion";

type Card = { title: string; body: ReactNode };
type Props = { cards: Card[]; offset?: number; top?: number; className?: string; style?: CSSProperties; cardStyle?: CSSProperties };

export function StackedDeck({ cards, offset = 56, top = 80, className, style, cardStyle }: Props) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  useStickyProgress(ref, (p) => {
    const items = ref.current?.querySelectorAll<HTMLElement>("[data-card]"); if (!items) return;
    const at = p * (items.length - 1);
    items.forEach((c, i) => { const depth = Math.max(0, at - i); c.style.transform = `scale(${1 - Math.min(depth, 3) * 0.04})`; c.style.filter = `brightness(${1 - Math.min(depth, 3) * 0.08})`; });
  }, !reduce);
  return (
    <ol ref={ref} className={className} style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 24, ...style }}>
      {cards.map((c, i) => (
        <li key={i} data-card style={{ position: reduce ? "static" : "sticky", top: reduce ? undefined : top + i * offset, minHeight: reduce ? undefined : "min(70svh, 560px)", padding: "28px 32px", borderRadius: 18, background: "var(--surface, #fff)", color: "var(--ink, #111)", border: "1px solid var(--line, rgba(0,0,0,.12))", transformOrigin: "50% 0", ...cardStyle }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}><span style={{ opacity: 0.75 }}>{String(i + 1).padStart(2, "0")}</span>{" "}{c.title}</h3>
          <div>{c.body}</div>
        </li>
      ))}
    </ol>
  );
}
