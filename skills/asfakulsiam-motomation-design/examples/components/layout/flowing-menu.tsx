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
// a11y: A nav with a normal list of links; the band and marquee are aria-hidden.
import { useState, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer, EASE } from "../_lib/motion";

type Item = { label: string; href: string; marquee?: string };
type Props = { items: Item[]; label?: string; className?: string; style?: CSSProperties };

export function FlowingMenu({ items, label = "Projects", className, style }: Props) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const [hot, setHot] = useState<{ i: number; from: "top" | "bottom" } | null>(null);
  return (
    <nav aria-label={label} className={className} style={style}>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((it, i) => {
          const on = hot?.i === i;
          return (
            <li key={i} style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--line, rgba(0,0,0,.15))" }}
              onPointerEnter={(e) => { if (!fine) return; const r = e.currentTarget.getBoundingClientRect(); setHot({ i, from: e.clientY - r.top < r.height / 2 ? "top" : "bottom" }); }}
              onPointerLeave={() => setHot(null)}>
              <a href={it.href} style={{ display: "block", padding: "0.35em 0", fontSize: "clamp(2rem, 6vw, 4.5rem)", lineHeight: 1, color: "inherit", textDecoration: "none", position: "relative", zIndex: 1 }}>{it.label}</a>
              <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "var(--ink, #111)", color: "var(--ground, #f4f1ea)", display: "flex", alignItems: "center", overflow: "hidden",
                transform: on ? "translateY(0)" : `translateY(${hot?.from === "bottom" || (!on && hot?.i !== i) ? "101%" : "-101%"})`, transition: reduce ? "none" : `transform 260ms ${EASE.out}` }}>
                <span style={{ display: "inline-flex", whiteSpace: "nowrap", fontSize: "clamp(1.25rem, 3vw, 2.25rem)", animation: on && !reduce ? "mm-flow 12s linear infinite" : "none" }}>
                  {Array.from({ length: 6 }, (_, k) => <span key={k} style={{ paddingRight: "1.5em" }}>{it.marquee || it.label}</span>)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <style>{`@keyframes mm-flow{to{transform:translateX(-50%)}}`}</style>
    </nav>
  );
}
