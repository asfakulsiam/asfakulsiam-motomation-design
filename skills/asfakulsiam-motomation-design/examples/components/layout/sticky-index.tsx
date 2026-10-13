"use client";
// @motomation-component
// id: sticky-index
// name: Sticky Index
// family: layout
// tier: 1
// deps: react
// what: A sticky side index lists the page's sections and highlights the one you are reading, with a marker that slides between entries.
// use-when: Long case studies, reports, documentation, annual reviews.
// avoid-when: Short pages; mobile (it collapses to a top select); landing pages.
// reduced-motion: The marker jumps instead of sliding.
// touch: Hidden below 900px; sections stay in normal flow.
// a11y: A nav of in-page links with aria-current on the active section.
import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion, useMedia, EASE } from "../_lib/motion";

type Props = { sections: { id: string; label: string }[]; label?: string; className?: string; style?: CSSProperties };

export function StickyIndex({ sections, label = "On this page", className, style }: Props) {
  const reduce = useReducedMotion();
  const wide = useMedia("(min-width: 900px)");
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement)); }, { rootMargin: "-40% 0px -55% 0px" });
    els.forEach((e) => io.observe(e)); return () => io.disconnect();
  }, [sections]);
  if (!wide) return null;
  return (
    <nav aria-label={label} className={className} style={{ position: "sticky", top: 96, alignSelf: "start", ...style }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px", opacity: 0.7 }}>{label}</p>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, paddingInlineStart: 14, position: "relative", borderInlineStart: "1px solid var(--line, rgba(0,0,0,.15))" }}>
        <span aria-hidden="true" style={{ position: "absolute", insetInlineStart: -1, top: 0, width: 2, height: 28, background: "var(--accent, #e0442b)", transform: `translateY(${active * 32 + 2}px)`, transition: reduce ? "none" : `transform 260ms ${EASE.out}` }} />
        {sections.map((s, i) => <li key={s.id} style={{ height: 32, display: "flex", alignItems: "center" }}>
          <a href={`#${s.id}`} aria-current={i === active ? "location" : undefined} style={{ color: "inherit", textDecoration: "none", fontWeight: i === active ? 600 : 400, opacity: i === active ? 1 : 0.7 }}>{s.label}</a></li>)}
      </ol>
    </nav>
  );
}
