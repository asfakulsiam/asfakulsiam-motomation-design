"use client";
// Proximity Weight: letters near the cursor get heavier. Needs a variable font with a wght axis.
// Fine pointer + motion allowed only; otherwise a static weight. Screen readers get the plain word.
import { useEffect, useRef } from "react";

type Props = { text: string; min?: number; max?: number; radius?: number; className?: string };

export function ProximityWeight({ text, min = 300, max = 900, radius = 180, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ok = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!ok.matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-l]"));
    let centres: { x: number; y: number }[] = [];
    const measure = () => {
      centres = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 + scrollX, y: r.top + r.height / 2 + scrollY };
      });
    };
    let px = -9999, py = -9999, raf = 0;
    const paint = () => {
      raf = 0;
      letters.forEach((el, i) => {
        const d = Math.hypot(px - centres[i].x, py - centres[i].y);
        const t = Math.max(0, 1 - d / radius);
        el.style.fontVariationSettings = `"wght" ${Math.round(min + (max - min) * t * t)}`;
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.pageX; py = e.pageY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    measure();
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", measure);
      cancelAnimationFrame(raf);
      letters.forEach((el) => (el.style.fontVariationSettings = ""));
    };
  }, [min, max, radius]);

  return (
    <span ref={ref} className={className} style={{ fontVariationSettings: `"wght" ${min}` }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span key={i} data-l className="inline-block">
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
