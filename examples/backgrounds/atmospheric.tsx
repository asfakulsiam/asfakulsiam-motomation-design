/**
 * Atmospheric Background (Quiet mood)
 * Tier: 2–4
 * Feel: Soft, living, non-distracting
 *
 * Notes:
 * - Supports the content, never competes
 * - Pause when off-screen
 * - Always provide a static fallback
 */

"use client";

import { useEffect, useRef } from "react";

export default function AtmosphericBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      canvas.style.background =
        "radial-gradient(ellipse at 30% 20%, #f3efe7 0%, #e7e0d5 100%)";
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      t += 0.003;
      const { width, height } = canvas;

      const g = ctx.createRadialGradient(
        width * (0.3 + Math.sin(t) * 0.05),
        height * (0.25 + Math.cos(t * 0.8) * 0.04),
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );

      g.addColorStop(0, "#f7f1e8");
      g.addColorStop(0.5, "#ebe3d6");
      g.addColorStop(1, "#e0d7c8");

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden
    />
  );
}