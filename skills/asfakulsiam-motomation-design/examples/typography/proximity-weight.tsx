"use client";
// Proximity Weight: letters near the cursor get heavier. Needs a variable font with a wght axis.
// Fine pointer + motion allowed only; otherwise a static weight. Screen readers get the plain word.
// Letter positions are cached (page space) and re-measured on resize only, never on scroll.
import { useEffect, useRef } from "react";

type Props = { text: string; min?: number; max?: number; radius?: number; className?: string };

export function ProximityWeight({ text, min = 300, max = 900, radius = 180, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // Fine pointer + motion allowed only. Re-evaluated live: turning on reduced motion mid-session stops the effect.
    const ok = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-l]"));

    // Letter centres in page coordinates. Scrolling doesn't move them, so they are cached and re-measured only
    // when the layout can change: viewport resize and web-font load.
    let centres: { x: number; y: number }[] = [];
    const measure = () => {
      letters.forEach((el) => (el.style.fontVariationSettings = "")); // measure at the resting weight
      centres = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 + scrollX, y: r.top + r.height / 2 + scrollY };
      });
      if (px > -9999) paint();
    };
    let px = -9999, py = -9999, raf = 0, resizeRaf = 0, on = false;
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
    const onResize = () => { if (!resizeRaf) resizeRaf = requestAnimationFrame(() => { resizeRaf = 0; measure(); }); };

    const start = () => {
      if (on) return; on = true;
      measure();
      document.fonts?.ready.then(() => on && measure());
      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("resize", onResize);
    };
    const stop = () => {
      if (!on) return; on = false;
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf); cancelAnimationFrame(resizeRaf); raf = resizeRaf = 0;
      px = py = -9999;
      letters.forEach((el) => (el.style.fontVariationSettings = ""));
    };
    const onPreference = () => (ok.matches ? start() : stop());
    onPreference();
    ok.addEventListener("change", onPreference);
    return () => {
      ok.removeEventListener("change", onPreference);
      stop();
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
