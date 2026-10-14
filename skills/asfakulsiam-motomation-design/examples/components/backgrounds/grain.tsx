"use client";
// @motomation-component
// id: grain
// name: Grain
// family: backgrounds
// tier: 1
// deps: react
// what: A film-grain layer over a section or the whole page, static by default or gently flickering at a low frame rate.
// use-when: Analogue, photographic, warm or printed brands; to take the digital edge off flat colour.
// avoid-when: Over small text at high opacity; on clinical, technical brands; animated on low-end mobile.
// reduced-motion: Static grain.
// touch: Static grain (flicker is skipped on coarse pointers to save battery).
// a11y: Decorative (aria-hidden, pointer-events none); keep opacity low enough that contrast still passes.
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";

type Props = { opacity?: number; size?: number; fps?: number; animate?: boolean; className?: string; style?: CSSProperties };

export function Grain({ opacity = 0.08, size = 160, fps = 12, animate = false, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    c.width = size; c.height = size; const img = ctx.createImageData(size, size);
    const paint = () => { for (let i = 0; i < img.data.length; i += 4) { const v = (Math.random() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; } ctx.putImageData(img, 0, 0); };
    paint();
    if (!animate || reduce || !fine) return;
    const id = setInterval(() => { if (!document.hidden) paint(); }, 1000 / fps);
    return () => clearInterval(id);
  }, [size, fps, animate, reduce, fine]);
  return <canvas ref={ref} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, mixBlendMode: "overlay", pointerEvents: "none", imageRendering: "pixelated", ...style }} />;
}
