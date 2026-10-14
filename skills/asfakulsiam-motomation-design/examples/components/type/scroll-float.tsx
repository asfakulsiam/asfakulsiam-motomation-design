"use client";
// @motomation-component
// id: scroll-float
// name: Scroll Float
// family: type
// tier: 2
// deps: react
// what: Letters of a display line rise and settle into place one by one, driven by scroll position, so scrolling back reverses it.
// use-when: Light-hearted display lines that should feel buoyant; one line per section.
// avoid-when: Serious or institutional briefs; text that must be readable before it settles (prices, dates).
// reduced-motion: Letters sit in place; no scroll listener runs.
// touch: Same as desktop.
// a11y: The line is the accessible name; letter spans are aria-hidden.
import { Fragment, useRef, type CSSProperties } from "react";
import { useReducedMotion, useScrollProgress, clamp, graphemes } from "../_lib/motion";

type Props = { text: string; rise?: number; spread?: number; as?: "h2" | "h3" | "p"; className?: string; style?: CSSProperties };

export function ScrollFloat({ text, rise = 0.6, spread = 0.5, as: Tag = "h2", className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const chars = graphemes(text);
  useScrollProgress(ref, (p) => {
    const el = ref.current; if (!el) return;
    // settle between 10% and 45% of the element's trip through the viewport
    const k = clamp((p - 0.1) / 0.35);
    el.querySelectorAll<HTMLSpanElement>("[data-c]").forEach((c) => {
      const i = Number(c.dataset.i); const start = (i / chars.length) * spread; const t = clamp((k - start) / (1 - spread));
      c.style.transform = `translateY(${(1 - t) * rise}em) scaleY(${1 + (1 - t) * 0.35})`; c.style.opacity = String(0.2 + t * 0.8);
    });
  }, !reduce);
  return (
    <Tag ref={ref as never} aria-label={text} className={className} style={{ overflow: "hidden", ...style }}>
      {/* letters are grouped into no-wrap words with real spaces between, so lines only break between words; the
          dir="auto" run gives the split letters the text's own direction (they are bidi-neutral boxes otherwise) */}
      <span dir="auto">{text.split(" ").map((word, w, words) => {
        const offset = words.slice(0, w).reduce((n, x) => n + graphemes(x).length + 1, 0);
        return (
          <Fragment key={w}>
            <span aria-hidden="true" style={{ whiteSpace: "nowrap" }}>
              {graphemes(word).map((c, i) => <span key={i} data-c data-i={offset + i} style={{ display: "inline-block", transformOrigin: "50% 100%", willChange: reduce ? undefined : "transform" }}>{c}</span>)}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}</span>
    </Tag>
  );
}
