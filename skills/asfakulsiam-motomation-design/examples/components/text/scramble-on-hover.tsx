"use client";
// @motomation-component
// id: scramble-on-hover
// name: Scramble on Hover
// family: text
// tier: 2
// deps: react
// what: Letters near the pointer scramble into other glyphs, like a magnet passing over iron filings, and settle back as it moves on. Unlike Decode, it reacts locally, where the cursor is.
// use-when: A short label the visitor plays with (a name, a nav word, a project title) on a code, cipher or signal concept.
// avoid-when: Words the visitor must read while pointing at them (buttons with actions); long text; for a one-time reveal (use Decode).
// reduced-motion: Plain text; nothing scrambles.
// touch: Tap scrambles the whole word once, settling left to right.
// a11y: The word is plain text for assistive tech (the scrambled letters are an aria-hidden copy). Each letter keeps a fixed width (monospaced slot), so the word never reflows. Keyboard focus plays the tap version.
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";

type Props = { text: string; glyphs?: string; radius?: number; as?: "span" | "a" | "p" | "h3"; href?: string; className?: string; style?: CSSProperties };
const SR: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

export function ScrambleOnHover({ text, glyphs = "!<>-_\\/[]{}=+*^?#", radius = 2, as: Tag = "span", href, className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion(), fine = useFinePointer();
  const [chars, setChars] = useState(text.split(""));
  const heat = useRef<number[]>(text.split("").map(() => 0)), raf = useRef(0), pointer = useRef<number | null>(null);
  useEffect(() => { setChars(text.split("")); heat.current = text.split("").map(() => 0); }, [text]);
  const tick = () => {
    const h = heat.current; let live = false;
    for (let i = 0; i < h.length; i++) {
      const target = pointer.current === null ? 0 : Math.max(0, 1 - Math.abs(i - pointer.current) / (radius + 0.5));
      h[i] = Math.max(target, h[i] - 0.06); if (h[i] > 0.02) live = true;
    }
    setChars(text.split("").map((c, i) => (c === " " || h[i] < 0.25 ? c : glyphs[(Math.random() * glyphs.length) | 0])));
    raf.current = live || pointer.current !== null ? requestAnimationFrame(tick) : 0;
  };
  const start = () => { if (!raf.current) raf.current = requestAnimationFrame(tick); };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const move = (e: PointerEvent) => { if (reduce || !fine || !ref.current) return; const r = ref.current.getBoundingClientRect(); pointer.current = ((e.clientX - r.left) / r.width) * text.length - 0.5; start(); };
  const leave = () => { pointer.current = null; };
  // tap / focus: the whole word scrambles, settling left to right
  const sweep = () => { if (reduce) return; heat.current = heat.current.map((_, i) => 1 + i * 0.06); pointer.current = null; start(); };
  return (
    <Tag ref={ref as never} href={href} className={className} onPointerMove={move} onPointerLeave={leave} onPointerDown={(e) => { if (e.pointerType !== "mouse") sweep(); }} onFocus={sweep}
      style={{ position: "relative", display: "inline-block", fontVariantNumeric: "tabular-nums", ...style }}>
      <span style={SR}>{text}</span>
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {chars.map((c, i) => <span key={i} style={{ display: "inline-block", width: text[i] === " " ? "0.3em" : "0.62em", textAlign: "center" }}>{c}</span>)}
      </span>
    </Tag>
  );
}
