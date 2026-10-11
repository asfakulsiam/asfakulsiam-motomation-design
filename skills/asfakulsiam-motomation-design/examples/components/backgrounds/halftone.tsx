"use client";
// @motomation-component
// id: halftone
// name: Halftone
// family: backgrounds
// tier: 2
// deps: react
// what: Renders an image as print dots on a canvas, sized by brightness, like a newspaper photo; dots can grow in as it enters the screen.
// use-when: Print, newspaper, zine, poster, protest and retro concepts.
// avoid-when: Product photos people must inspect; portraits where likeness matters; many on one page.
// reduced-motion: Dots render at full size immediately.
// touch: Same as desktop.
// a11y: The canvas has role img and the alt text; the source image needs CORS headers if it's on another origin.
import { useEffect, useRef, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "../_lib/motion";

type Props = { src: string; alt: string; cell?: number; ink?: string; paper?: string; width?: number; height?: number; className?: string; style?: CSSProperties };

export function Halftone({ src, alt, cell = 8, ink = "#111", paper = "#f4f1ea", width = 800, height = 500, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const seen = useInView(ref);
  const reduce = useReducedMotion();
  useEffect(() => {
    const c = ref.current; if (!c || !seen) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = src; let raf = 0;
    img.onload = () => {
      const off = document.createElement("canvas"); const cols = Math.ceil(width / cell), rows = Math.ceil(height / cell); off.width = cols; off.height = rows;
      const o = off.getContext("2d")!; o.drawImage(img, 0, 0, cols, rows); const px = o.getImageData(0, 0, cols, rows).data;
      const draw = (k: number) => { ctx.fillStyle = paper; ctx.fillRect(0, 0, width, height); ctx.fillStyle = ink;
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const i = (y * cols + x) * 4; const lum = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255;
          const r = (1 - lum) * cell * 0.62 * k; if (r > 0.2) { ctx.beginPath(); ctx.arc(x * cell + cell / 2, y * cell + cell / 2, r, 0, Math.PI * 2); ctx.fill(); } } };
      if (reduce) { draw(1); return; }
      const t0 = performance.now(); const step = (t: number) => { const k = Math.min(1, (t - t0) / 900); draw(1 - Math.pow(1 - k, 3)); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step);
    };
    return () => cancelAnimationFrame(raf);
  }, [seen, src, cell, ink, paper, width, height, reduce]);
  return <canvas ref={ref} role="img" aria-label={alt} width={width} height={height} className={className} style={{ display: "block", maxWidth: "100%", height: "auto", background: paper, ...style }} />;
}
