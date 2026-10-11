"use client";
// @motomation-component
// id: ink-fill
// name: Ink Fill
// family: type
// tier: 2
// deps: react
// what: A statement starts in the muted colour and fills with ink word by word as the reader scrolls through it.
// use-when: Manifestos, about statements, a single paragraph that is the page's idea.
// avoid-when: More than one per page; text the reader needs before scrolling (it must stay readable when muted).
// reduced-motion: The whole statement is in ink from the start.
// touch: Same as desktop.
// a11y: Plain text; only colour changes, and the muted colour must still pass 4.5:1 for body text or 3:1 for large text.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion, useScrollProgress, clamp } from "../_lib/motion";

type Props = { text: string; ink?: string; muted?: string; as?: "p" | "h2" | "blockquote"; className?: string; style?: CSSProperties };

export function InkFill({ text, ink = "var(--ink, #111)", muted = "var(--muted, #6b6b6b)", as: Tag = "p", className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");
  useScrollProgress(ref, (p) => {
    const lit = Math.round(clamp((p - 0.25) / 0.4) * words.length);
    ref.current?.querySelectorAll<HTMLSpanElement>("[data-w]").forEach((w, i) => (w.style.color = i < lit ? ink : muted));
  }, !reduce);
  return (
    <Tag ref={ref as never} className={className} style={{ color: reduce ? ink : muted, ...style }}>
      {words.map((w, i) => <span key={i} data-w style={{ transition: "color 150ms linear", color: reduce ? ink : undefined }}>{w}{i < words.length - 1 ? " " : ""}</span>)}
    </Tag>
  );
}
