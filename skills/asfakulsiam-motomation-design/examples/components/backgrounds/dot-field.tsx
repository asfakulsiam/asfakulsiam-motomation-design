"use client";
// @motomation-component
// id: dot-field
// name: Dot Field
// family: backgrounds
// tier: 2
// deps: react
// what: A grid of dots that swell and push away from the cursor, then ease back, like a pin-art board.
// use-when: Technical, structural, data or grid-led concepts; behind a hero with little text.
// avoid-when: Behind body text; organic or luxury briefs; together with a cursor signature.
// reduced-motion: A still dot grid.
// touch: A still dot grid.
// a11y: Decorative canvas (aria-hidden, pointer-events none); paused off screen and in hidden tabs.
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer, useFrameLoop, clamp } from "../_lib/motion";

type Props = { gap?: number; dot?: number; radius?: number; push?: number; color?: string; className?: string; style?: CSSProperties };

export function DotField({ gap = 26, dot = 1.6, radius = 140, push = 14, color = "currentColor", className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const st = useRef({ mx: -1e4, my: -1e4, w: 0, h: 0, dpr: 1, ink: "#000" });
  const draw = () => {
    const c = ref.current; const ctx = c?.getContext("2d"); if (!c || !ctx) return; const s = st.current;
    ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0); ctx.clearRect(0, 0, s.w, s.h); ctx.fillStyle = s.ink;
    for (let y = gap / 2; y < s.h; y += gap) for (let x = gap / 2; x < s.w; x += gap) {
      const dx = x - s.mx, dy = y - s.my, d = Math.hypot(dx, dy), t = 1 - clamp(d / radius);
      const ox = d ? (dx / d) * t * push : 0, oy = d ? (dy / d) * t * push : 0;
      ctx.beginPath(); ctx.arc(x + ox, y + oy, dot + t * dot * 1.5, 0, Math.PI * 2); ctx.fill();
    }
  };
  useEffect(() => {
    const c = ref.current; if (!c) return; const host = c.parentElement!; const s = st.current;
    const size = () => { s.dpr = Math.min(2, devicePixelRatio || 1); s.w = host.clientWidth; s.h = host.clientHeight; c.width = s.w * s.dpr; c.height = s.h * s.dpr; s.ink = getComputedStyle(c).color; draw(); };
    const move = (e: PointerEvent) => { const r = host.getBoundingClientRect(); s.mx = e.clientX - r.left; s.my = e.clientY - r.top; };
    const leave = () => { s.mx = s.my = -1e4; };
    size(); const ro = new ResizeObserver(size); ro.observe(host);
    if (fine && !reduce) { host.addEventListener("pointermove", move); host.addEventListener("pointerleave", leave); }
    return () => { ro.disconnect(); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); };
  }, [fine, reduce, gap, dot]); // eslint-disable-line react-hooks/exhaustive-deps
  useFrameLoop(ref, draw, fine && !reduce);
  return <canvas ref={ref} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", color, opacity: 0.5, ...style }} />;
}
