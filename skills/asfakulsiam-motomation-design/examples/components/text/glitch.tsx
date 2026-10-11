"use client";
// @motomation-component
// id: glitch
// name: Glitch
// family: text
// tier: 2
// deps: react
// what: On hover, focus or tap, the word tears for a moment: two offset colour copies slip sideways in thin bands, then it settles. Never loops.
// use-when: The concept is a broken signal, a corrupted file, a jump cut or an error that matters; one word or a short label.
// avoid-when: Body text; anything that must be read during the effect; brands that want calm; more than one per page.
// reduced-motion: Plain text; nothing tears.
// touch: Tap plays the tear once (no hover needed). Focus on anything inside it (a link it wraps) plays it too.
// a11y: The word is plain text; the colour copies are aria-hidden. One burst lasts 320ms and can't repeat more than once a second, so it never flashes three times in a second (WCAG 2.3.1). Bands move with transform and clip-path on the copies only.
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { text: string; colors?: [string, string]; as?: "span" | "h1" | "h2" | "h3" | "p"; className?: string; style?: CSSProperties };
const layer: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none", opacity: 0, mixBlendMode: "normal" };

export function Glitch({ text, colors = ["#e0442b", "#2bb5e0"], as: Tag = "span", className, style }: Props) {
  const ref = useRef<HTMLElement>(null), a = useRef<HTMLSpanElement>(null), b = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const last = useRef(0), raf = useRef(0);
  const burst = () => {
    if (reduce || !a.current || !b.current) return;
    const now = performance.now(); if (now - last.current < 1000) return; last.current = now;
    const t0 = now, A = a.current, B = b.current; let seed = (now | 0) % 997;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const frame = (t: number) => {
      const k = (t - t0) / 320;
      if (k >= 1) { A.style.opacity = B.style.opacity = "0"; A.style.transform = B.style.transform = "none"; raf.current = 0; return; }
      const top = rnd() * 80, h = 6 + rnd() * 18, dx = (1 - k) * (4 + rnd() * 8);
      A.style.opacity = B.style.opacity = "1";
      A.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`; A.style.transform = `translateX(${-dx}px)`;
      B.style.clipPath = `inset(${(top + 37) % 85}% 0 ${Math.max(0, 100 - ((top + 37) % 85) - h)}% 0)`; B.style.transform = `translateX(${dx}px)`;
      raf.current = requestAnimationFrame(frame);
    };
    cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(frame);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (
    <Tag ref={ref as never} className={className} onPointerEnter={burst} onPointerDown={burst} onFocus={burst}
      style={{ position: "relative", display: "inline-block", ...style }}>
      {text}
      <span ref={a} aria-hidden="true" style={{ ...layer, color: colors[0] }}>{text}</span>
      <span ref={b} aria-hidden="true" style={{ ...layer, color: colors[1] }}>{text}</span>
    </Tag>
  );
}
