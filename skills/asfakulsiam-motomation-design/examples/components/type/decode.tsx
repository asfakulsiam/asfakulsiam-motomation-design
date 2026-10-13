"use client";
// @motomation-component
// id: decode
// name: Decode
// family: type
// tier: 2
// deps: react
// what: A short label resolves from random glyphs, left to right, when it enters the screen or on hover.
// use-when: Technical, secret or data-led brands; labels of 1–4 words.
// avoid-when: Body text, headlines longer than a line, or more than one per screen.
// reduced-motion: Shows the final text at once; no glyph cycling.
// touch: Runs on enter; hover replay is mouse-only.
// a11y: The real text is the accessible name; the cycling glyphs are aria-hidden.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion, useFinePointer, graphemes } from "../_lib/motion";

type Props = { text: string; glyphs?: string; duration?: number; replayOnHover?: boolean; as?: "span" | "p" | "h2" | "h3"; className?: string; style?: CSSProperties };

export function Decode({ text, glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>", duration = 900, replayOnHover = true, as: Tag = "span", className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const [shown, setShown] = useState(text);
  const run = useRef(0);

  const play = () => {
    if (reduce) { setShown(text); return; }
    const id = ++run.current; const t0 = performance.now();
    const step = (t: number) => {
      if (id !== run.current) return;
      const p = Math.min(1, (t - t0) / duration); const g = graphemes(text); const fixed = Math.floor(p * g.length);
      setShown(g.map((c, i) => (i < fixed || c === " " ? c : glyphs[(Math.random() * glyphs.length) | 0])).join(""));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  useEffect(() => { if (inView) play(); return () => { run.current++; }; }, [inView, reduce, text]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Tag ref={ref as never} aria-label={text} className={className} onPointerEnter={fine && replayOnHover ? play : undefined}
      style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "pre", ...style }}>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  );
}
