"use client";
// A slow drifting light behind content. DPR-aware, paused off-screen and in hidden tabs,
// static under reduced motion. Use only when the concept is about light or atmosphere.
import { useEffect, useRef } from "react";

type Props = { from?: string; to?: string; className?: string };

export function Atmospheric({ from = "#C9A15B", to = "#0D0D0F", className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5); // a soft gradient doesn't need retina resolution
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };
    const draw = (t: number) => {
      const x = w * (0.5 + Math.sin(t / 9000) * 0.25);
      const y = h * (0.4 + Math.cos(t / 11000) * 0.15);
      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 0.75);
      g.addColorStop(0, from); g.addColorStop(1, to);
      ctx.globalAlpha = 1; ctx.fillStyle = to; ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.35; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    };
    const loop = (now: number) => { draw(now - t0); raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0; };
    const start = () => { if (!raf && !still && visible && !document.hidden) raf = requestAnimationFrame(loop); };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize(); start();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [from, to]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
