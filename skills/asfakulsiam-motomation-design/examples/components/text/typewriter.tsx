"use client";
// @motomation-component
// id: typewriter
// name: Typewriter
// family: text
// tier: 1
// deps: react
// what: A line types itself out, character by character, when it scrolls into view, with a caret that fades once the line is complete.
// use-when: The concept is a terminal, a typed letter, a dispatch or a confession; one line, read once.
// avoid-when: Headlines the visitor needs at once; more than one per screen; long paragraphs; anything repeated on every visit.
// reduced-motion: The whole line is there from the start, with no caret.
// touch: Same as desktop (starts when in view).
// a11y: The full text is in the DOM for assistive tech from the first render; the typed copy is aria-hidden. Every character holds its final place, so the line never reflows (no layout shift).
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion, graphemes } from "../_lib/motion";

type Props = { text: string; speed?: number; delay?: number; caret?: boolean; as?: "p" | "h1" | "h2" | "h3" | "span"; className?: string; style?: CSSProperties };
const bar: CSSProperties = { position: "absolute", top: "0.1em", bottom: "0.05em", width: "0.08em", marginInlineStart: "0.03em", background: "currentColor" };
const SR: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

export function Typewriter({ text, speed = 38, delay = 200, caret = true, as: Tag = "p", className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref);
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const units = graphemes(text);
  useEffect(() => {
    if (reduce || !seen) return;
    let i = 0, timer = 0;
    // a small, seeded unevenness so it reads as typing, not a progress bar: spaces and punctuation take longer
    const next = () => { i++; setN(i); if (i < units.length) timer = window.setTimeout(next, speed * (/[\s,.;:!?]/.test(units[i - 1]) ? 2.6 : 0.7 + ((i * 7) % 5) / 8)); };
    timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [seen, reduce, text, speed, delay]);
  const shown = reduce ? units.length : n, done = shown >= units.length;
  return (
    <Tag ref={ref as never} className={className} style={{ position: "relative", ...style }}>
      <span style={SR}>{text}</span>
      <span aria-hidden="true">
        {caret && !reduce && shown === 0 && <span style={{ position: "relative" }}><span style={{ ...bar, insetInlineStart: 0 }} /></span>}
        {units.map((ch, i) => (
          <span key={i} style={{ opacity: i < shown ? 1 : 0, position: "relative" }}>
            {ch}
            {/* the caret rides on the last typed (visible) character as a zero-width absolute bar, so it moves without reflow */}
            {caret && !reduce && i === shown - 1 && <span style={{ ...bar, insetInlineStart: "100%", opacity: done ? 0 : 1, transition: "opacity 400ms 600ms" }} />}
          </span>
        ))}
      </span>
    </Tag>
  );
}
