"use client";
// @motomation-component
// id: letter-relay
// name: Letter Relay
// family: type
// tier: 2
// deps: react
// what: A large hero name shrinks and travels into a fixed header slot letter by letter as you scroll the first screen, so the name hands itself to the navigation.
// use-when: Portfolios and personal brands where the name is the identity.
// avoid-when: Long names (over ~16 characters); pages without a fixed header; product pages.
// reduced-motion: The hero name and the header name are both static; no scroll listener runs.
// touch: Same as desktop.
// a11y: The h1 keeps the real text; the travelling letters are aria-hidden; the header name is a normal link.
import { useRef, type CSSProperties } from "react";
import { isRtl, useReducedMotion, useScrollProgress, clamp, lerp, graphemes } from "../_lib/motion";

type Props = { name: string; heroSize?: string; headerSize?: number; href?: string; className?: string; style?: CSSProperties };

export function LetterRelay({ name, heroSize = "clamp(3rem, 14vw, 12rem)", headerSize = 18, href = "/", className, style }: Props) {
  const hero = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const slot = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  useScrollProgress(hero, (p) => {
    const w = word.current, s = slot.current; if (!w || !s) return;
    const k = clamp((p - 0.5) / 0.35); // the hero's second half of the trip
    const letters = Array.from(w.querySelectorAll<HTMLSpanElement>("[data-l]"));
    const sr = s.getBoundingClientRect();
    // batch: reset, read every rect, then write, so the frame has one layout pass
    letters.forEach((l) => (l.style.transform = "none"));
    const rects = letters.map((l) => l.getBoundingClientRect());
    const fs = parseFloat(getComputedStyle(w).fontSize) || 1; const rtl = isRtl(w);
    letters.forEach((l, i) => {
      const t = clamp(k * 1.35 - (i / letters.length) * 0.35); const r = rects[i]; // small stagger: the word stays legible while it travels
      const scale = lerp(1, headerSize / fs, t);
      const tx = lerp(0, sr.left + (rtl ? 1 - (i + 1) / letters.length : i / letters.length) * sr.width - r.left, t), ty = lerp(0, sr.top - r.top, t);
      l.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; l.style.opacity = t >= 1 ? "0" : "1";
    });
    s.style.opacity = k >= 1 ? "1" : "0";
  }, !reduce);
  return (
    <div className={className} style={style}>
      <header style={{ position: "fixed", insetInline: 0, top: 0, padding: "18px 24px", zIndex: 10, pointerEvents: "none", background: "var(--ground, #fff)" }}>
        <a ref={slot} href={href} style={{ pointerEvents: "auto", fontSize: headerSize, fontWeight: 600, color: "inherit", textDecoration: "none", opacity: reduce ? 1 : 0, transition: "opacity 150ms linear" }}>{name}</a>
      </header>
      <div ref={hero} style={{ minHeight: "100svh", display: "grid", alignContent: "end", padding: "0 24px 8vh" }}>
        <h1 aria-label={name} style={{ fontSize: heroSize, lineHeight: 0.9, margin: 0 }}>
          <span ref={word} aria-hidden="true" dir="auto" style={{ display: "inline-block", whiteSpace: "nowrap", position: "relative", zIndex: 11 }}>
            {graphemes(name).map((c, i) => <span key={i} data-l style={{ display: "inline-block", transformOrigin: "0 0", willChange: reduce ? undefined : "transform" }}>{c === " " ? "\u00a0" : c}</span>)}
          </span>
        </h1>
      </div>
    </div>
  );
}
