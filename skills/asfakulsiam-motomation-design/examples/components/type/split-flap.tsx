"use client";
// @motomation-component
// id: split-flap
// name: Split Flap
// family: type
// tier: 2
// deps: react
// what: Each character flips through the alphabet to its value like a departure board, settling left to right; changing the value flips again.
// use-when: Schedules, line-ups, menus, travel, times and short codes.
// avoid-when: Long text; values the reader must trust mid-animation (the final value is announced, not the flips).
// reduced-motion: Shows the new value at once.
// touch: Same as desktop.
// a11y: aria-live announces the final value only; flipping glyphs are aria-hidden.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, graphemes } from "../_lib/motion";

type Props = { value: string; alphabet?: string; stepMs?: number; className?: string; style?: CSSProperties; cellStyle?: CSSProperties };
const ABC = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-";

export function SplitFlap({ value, alphabet = ABC, stepMs = 45, className, style, cellStyle }: Props) {
  const reduce = useReducedMotion();
  const target = value.toUpperCase();
  const [cells, setCells] = useState(target);
  const want = graphemes(target), abc = graphemes(alphabet);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (reduce) { setCells(target); return; }
    // cells are graphemes, so a Bangla cluster, an emoji or an Arabic word is one cell, never a dotted circle
    const have = graphemes(cells); let cur = want.map((_, i) => have[i] ?? " "); let tick = 0;
    timer.current = setInterval(() => {
      tick++; let done = true;
      cur = cur.map((c, i) => {
        if (c === want[i] || tick < i * 2) { if (c !== want[i]) done = false; return c; }
        // a glyph the alphabet can't reach ("/", "ক", an emoji) lands directly; so does a cell starting from one
        const at = abc.indexOf(c); if (at < 0 || !abc.includes(want[i])) return want[i];
        done = false; return abc[(at + 1) % abc.length];
      });
      setCells(cur.join("")); if (done && timer.current) clearInterval(timer.current);
    }, stepMs);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [target, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span dir="auto" className={className} style={{ display: "inline-flex", gap: "0.08em", fontFamily: "var(--font-mono, ui-monospace, monospace)", ...style }}>
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{value}</span>
      {graphemes(cells).map((c, i) => (
        <span key={i} aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", minWidth: "0.9em", padding: "0.12em 0.06em", background: "var(--ink, #111)", color: "var(--ground, #f4f1ea)", borderRadius: 3, boxShadow: "inset 0 -1px 0 rgba(255,255,255,.08), inset 0 50% 0 rgba(0,0,0,.18)", ...cellStyle }}>{c === " " ? "\u00a0" : c}</span>
      ))}
    </span>
  );
}
