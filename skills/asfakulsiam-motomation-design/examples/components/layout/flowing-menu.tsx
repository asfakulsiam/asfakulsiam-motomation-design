"use client";
// @motomation-component
// id: flowing-menu
// name: Flowing Menu
// family: layout
// tier: 2
// deps: react
// what: A big typographic list of links; hovering an item rolls a band over it from the edge the cursor entered, carrying a marquee of the item's words.
// use-when: Portfolio and studio navigation or project indexes with 3–8 entries.
// avoid-when: Primary site navigation on product sites; long lists; touch-first audiences.
// reduced-motion: Hover shows the band instantly with still text.
// touch: Plain links with a pressed state.
// a11y: A nav with a normal list of links; the band and marquee are aria-hidden. Keyboard focus rolls the band in, so focus is as visible as hover (the row clips an outline).
import { useRef, useState, type CSSProperties } from "react";
import { useDirection, useReducedMotion, useFinePointer, EASE } from "../_lib/motion";

type Item = { label: string; href: string; marquee?: string };
type Props = { items: Item[]; label?: string; className?: string; style?: CSSProperties };

export function FlowingMenu({ items, label = "Projects", className, style }: Props) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const nav = useRef<HTMLElement>(null); const rtl = useDirection(nav) === "rtl"; // the marquee runs toward the reading start
  const [hot, setHot] = useState<{ i: number; from: "top" | "bottom" } | null>(null);
  // the band loops by moving half its length, so each half must be at least as wide as the row: measured on the first
  // hover (one copy's width against the row's), never fewer than 3 copies a half
  const [reps, setReps] = useState<Record<number, number>>({});
  const fit = (i: number, li: HTMLElement) => { if (reps[i]) return; const one = li.querySelector<HTMLElement>("[data-copy]"); const w = one?.getBoundingClientRect().width || 0;
    if (w > 0) setReps((r) => ({ ...r, [i]: Math.max(3, Math.ceil(li.getBoundingClientRect().width / w) + 1) })); };
  return (
    <nav ref={nav} aria-label={label} className={className} style={style}>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((it, i) => {
          const on = hot?.i === i;
          return (
            <li key={i} style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--line, rgba(0,0,0,.15))" }}
              onPointerEnter={(e) => { if (!fine) return; fit(i, e.currentTarget); const r = e.currentTarget.getBoundingClientRect(); setHot({ i, from: e.clientY - r.top < r.height / 2 ? "top" : "bottom" }); }}
              onPointerLeave={() => setHot(null)}
              onFocus={(e) => { if ((e.target as HTMLElement).matches?.(":focus-visible")) { fit(i, e.currentTarget); setHot({ i, from: "top" }); } }} onBlur={() => setHot(null)}>
              <a href={it.href} style={{ display: "block", padding: "0.35em 0", fontSize: "clamp(2rem, 6vw, 4.5rem)", lineHeight: 1, color: "inherit", textDecoration: "none", position: "relative", zIndex: 1 }}>{it.label}</a>
              <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "var(--ink, #111)", color: "var(--ground, #f4f1ea)", display: "flex", alignItems: "center", overflow: "hidden",
                transform: on ? "translateY(0)" : `translateY(${hot?.from === "bottom" || (!on && hot?.i !== i) ? "101%" : "-101%"})`, transition: reduce ? "none" : `transform 260ms ${EASE.out}` }}>
                <span style={{ display: "inline-flex", whiteSpace: "nowrap", fontSize: "clamp(1.25rem, 3vw, 2.25rem)", animation: on && !reduce ? `${rtl ? "mm-flow-rtl" : "mm-flow"} 12s linear infinite` : "none" }}>
                  {Array.from({ length: 2 * (reps[i] || 3) }, (_, k) => <span key={k} data-copy={k === 0 ? "" : undefined} style={{ paddingInlineEnd: "1.5em", flex: "none" }}>{it.marquee || it.label}</span>)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <style>{`@keyframes mm-flow{to{transform:translateX(-50%)}}@keyframes mm-flow-rtl{to{transform:translateX(50%)}}`}</style>
    </nav>
  );
}
