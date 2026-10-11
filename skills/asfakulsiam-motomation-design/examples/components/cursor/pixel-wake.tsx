"use client";
// @motomation-component
// id: pixel-wake
// name: Pixel Wake
// family: cursor
// tier: 2
// deps: react
// what: The cursor leaves a trail of square pixels on a grid that fade out behind it, like a wake on a low-resolution screen.
// use-when: Digital, pixel, retro, game and screen-themed concepts; usually only over the hero.
// avoid-when: Over body text; on calm or luxury briefs; together with another cursor effect.
// reduced-motion: No trail.
// touch: No trail.
// a11y: A decorative canvas (aria-hidden) that never blocks clicks (pointer-events none).
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";

type Props = { cell?: number; fadeMs?: number; color?: string; className?: string; style?: CSSProperties };

export function PixelWake({ cell = 18, fadeMs = 700, color = "#e0442b", className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    const c = ref.current; if (!c || reduce || !fine) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const host = c.parentElement!; const cells = new Map<string, number>(); let raf = 0; const dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { c.width = host.clientWidth * dpr; c.height = host.clientHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = () => {
      const now = performance.now(); ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = color;
      for (const [k, t] of cells) { const a = 1 - (now - t) / fadeMs; if (a <= 0) { cells.delete(k); continue; } const [x, y] = k.split(",").map(Number); ctx.globalAlpha = a; ctx.fillRect(x * cell, y * cell, cell - 1, cell - 1); }
      ctx.globalAlpha = 1; raf = cells.size ? requestAnimationFrame(draw) : 0;
    };
    const move = (e: PointerEvent) => { const r = host.getBoundingClientRect(); const x = Math.floor((e.clientX - r.left) / cell), y = Math.floor((e.clientY - r.top) / cell); if (x < 0 || y < 0) return; cells.set(`${x},${y}`, performance.now()); if (!raf) raf = requestAnimationFrame(draw); };
    size(); const ro = new ResizeObserver(size); ro.observe(host); host.addEventListener("pointermove", move);
    return () => { ro.disconnect(); host.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [reduce, fine, cell, fadeMs, color]);
  return <canvas ref={ref} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", ...style }} />;
}
