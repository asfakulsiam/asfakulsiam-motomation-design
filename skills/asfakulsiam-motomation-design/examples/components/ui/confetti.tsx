"use client";
// @motomation-component
// id: confetti
// name: Confetti
// family: ui
// tier: 2
// deps: react
// what: Paper pieces burst from a point, tumble and flutter down under gravity and air drag, and are gone in under two seconds. Fired by you, from code, at a real moment.
// use-when: A genuine, rare success the visitor caused: an order placed, a donation made, a course finished, a wedding RSVP. Once.
// avoid-when: Page load; every button; form validation; serious contexts (payments for bills, health, legal); repeated triggers. For small click feedback use Click Spark.
// reduced-motion: No particles at all; your success message carries the moment.
// touch: Same as desktop (fire it from the tap's coordinates).
// a11y: Purely decorative: a temporary, aria-hidden, pointer-events-none canvas that is removed after the burst. Pair it with a visible text confirmation. DPR ≤ 1.5; at most 120 pieces; runs only while pieces are on screen.
import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "../_lib/motion";
import { MAX_DPR } from "../_lib/ambient";

type Burst = { x?: number; y?: number; count?: number; colors?: string[]; spread?: number };

/** Returns fire({ x, y }) in viewport pixels (defaults to the centre). Does nothing under reduced motion. */
export function useConfetti() {
  const reduce = useReducedMotion();
  const live = useRef<Set<() => void>>(new Set());
  useEffect(() => () => live.current.forEach((stop) => stop()), []);
  return useCallback(({ x = innerWidth / 2, y = innerHeight / 2, count = 90, colors = ["#e0442b", "#e0a92b", "#2b8fe0", "#5aa64b", "#f3efe6"], spread = 70 }: Burst = {}) => {
    if (reduce || typeof document === "undefined") return;
    const n = Math.min(120, count), dpr = Math.min(MAX_DPR, devicePixelRatio || 1);
    const c = document.createElement("canvas"); c.setAttribute("aria-hidden", "true");
    Object.assign(c.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "2147483000" });
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; document.body.appendChild(c);
    const g = c.getContext("2d"); if (!g) { c.remove(); return; } g.scale(dpr, dpr);
    const P = Array.from({ length: n }, (_, i) => { const a = (-90 + (Math.random() - 0.5) * spread * 2) * (Math.PI / 180), v = 7 + Math.random() * 7;
      return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 6 + Math.random() * 6, h: 3 + Math.random() * 4, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.35, f: Math.random() * 6.28, col: colors[i % colors.length] }; });
    let raf = 0, last = performance.now();
    const stop = () => { cancelAnimationFrame(raf); c.remove(); live.current.delete(stop); };
    const tick = (t: number) => { const k = Math.min(2, (t - last) / 16.7); last = t; g.clearRect(0, 0, innerWidth, innerHeight); let alive = 0;
      for (const p of P) { p.vy += 0.32 * k; p.vx *= 0.985 ** k; p.vy *= 0.985 ** k; p.f += 0.18 * k; p.x += (p.vx + Math.sin(p.f) * 0.8) * k; p.y += p.vy * k; p.r += p.vr * k;
        if (p.y < innerHeight + 20) { alive++; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(1, Math.abs(Math.cos(p.f))); g.fillStyle = p.col; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore(); } }
      if (alive) raf = requestAnimationFrame(tick); else stop(); };
    live.current.add(stop); raf = requestAnimationFrame(tick);
    window.setTimeout(stop, 2600); // hard stop: never longer than this
  }, [reduce]);
}
