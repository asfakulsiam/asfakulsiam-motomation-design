"use client";
// @motomation-component
// id: pressure-type
// name: Pressure Type
// family: type
// tier: 2
// deps: react
// what: Each letter of one display word stretches wider and heavier as the cursor nears it, like pressing into rubber.
// use-when: Playful, elastic or physical brands with a variable font that has wdth and wght axes.
// avoid-when: Fonts without variable axes; more than one word; any body copy.
// reduced-motion: Letters stay at the base width and weight.
// touch: Static on touch screens (no hover).
// a11y: The word is the accessible name; letter spans are aria-hidden.
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer, clamp, graphemes } from "../_lib/motion";

type Props = { word: string; radius?: number; wdth?: [number, number]; wght?: [number, number]; className?: string; style?: CSSProperties };

export function PressureType({ word, radius = 220, wdth = [75, 125], wght = [300, 900], className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    const el = ref.current; if (!el || reduce || !fine) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-l]"));
    let centres: number[][] = []; let raf = 0; let mx = -1e4, my = -1e4;
    const measure = () => { centres = letters.map((l) => { const r = l.getBoundingClientRect(); return [r.left + r.width / 2 + scrollX, r.top + r.height / 2 + scrollY]; }); };
    const paint = () => { raf = 0; letters.forEach((l, i) => { const [cx, cy] = centres[i]; const d = Math.hypot(mx + scrollX - cx, my + scrollY - cy); const t = 1 - clamp(d / radius);
      l.style.fontVariationSettings = `"wdth" ${wdth[0] + (wdth[1] - wdth[0]) * t}, "wght" ${wght[0] + (wght[1] - wght[0]) * t}`; }); };
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
    measure(); paint();
    window.addEventListener("pointermove", move); window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("resize", measure); ro.disconnect(); cancelAnimationFrame(raf); letters.forEach((l) => (l.style.fontVariationSettings = "")); };
  }, [reduce, fine, radius, wdth, wght, word]);
  return (
    <span ref={ref} aria-label={word} dir="auto" className={className} style={{ display: "inline-flex", fontVariationSettings: `"wdth" ${wdth[0]}, "wght" ${wght[0]}`, ...style }}>
      {graphemes(word).map((c, i) => <span key={i} data-l aria-hidden="true" style={{ display: "inline-block", fontVariationSettings: `"wdth" ${wdth[0]}, "wght" ${wght[0]}` }}>{c === " " ? "\u00a0" : c}</span>)}
    </span>
  );
}
