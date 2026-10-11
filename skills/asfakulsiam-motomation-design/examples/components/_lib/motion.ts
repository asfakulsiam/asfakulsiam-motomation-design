"use client";
// Motomation component helpers: the shared motion rules every component in examples/components follows.
// No dependencies beyond React. Each hook cleans up after itself and respects reduced motion.
import { useEffect, useRef, useState, type RefObject } from "react";

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const query = (q: string) => (typeof window !== "undefined" && "matchMedia" in window ? window.matchMedia(q) : null);

/** Live media-query state. Starts false on the server and on first render, so markup is static until hydrated. */
export function useMedia(q: string): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const m = query(q); if (!m) return;
    const sync = () => setOn(m.matches); sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, [q]);
  return on;
}
/** True when the user asked for reduced motion. Components show their final state instead of animating. */
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
/** True for a mouse or trackpad. Hover and cursor effects run only then. */
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
/** Motion is allowed: no reduced-motion preference. */
export const useMotionOK = () => !useReducedMotion();

/** Visibility of an element. With once, it stays true after the first time it enters. */
export function useInView<T extends Element>(ref: RefObject<T | null>, { once = true, margin = "0px 0px -10% 0px", threshold = 0 } = {}): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); if (once) io.disconnect(); } else if (!once) setSeen(false); }, { rootMargin: margin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, margin, threshold]);
  return seen;
}

/**
 * Calls onProgress(0..1) as an element travels through the viewport (0 = its top meets the viewport bottom,
 * 1 = its bottom meets the viewport top). One rAF per frame at most, no React re-renders.
 * Pass enabled=false (for example under reduced motion) to stop listening.
 */
export function useScrollProgress<T extends HTMLElement>(ref: RefObject<T | null>, onProgress: (p: number) => void, enabled = true) {
  const cb = useRef(onProgress); cb.current = onProgress;
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const tick = () => {
      raf = 0; const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight;
      cb.current(clamp((vh - r.top) / (r.height + vh)));
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", ask, { passive: true }); window.addEventListener("resize", ask);
    return () => { window.removeEventListener("scroll", ask); window.removeEventListener("resize", ask); cancelAnimationFrame(raf); };
  }, [ref, enabled]);
}

/** Like useScrollProgress for a tall sticky wrapper: 0 when its top reaches the viewport top, 1 when its bottom reaches the viewport bottom. */
export function useStickyProgress<T extends HTMLElement>(ref: RefObject<T | null>, onProgress: (p: number) => void, enabled = true) {
  const cb = useRef(onProgress); cb.current = onProgress;
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const tick = () => { raf = 0; const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); const run = r.height - window.innerHeight; cb.current(run > 0 ? clamp(-r.top / run) : 0); };
    const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", ask, { passive: true }); window.addEventListener("resize", ask);
    return () => { window.removeEventListener("scroll", ask); window.removeEventListener("resize", ask); cancelAnimationFrame(raf); };
  }, [ref, enabled]);
}

/** Smoothed scroll velocity in px per frame, delivered every frame while it settles back to 0. */
export function useScrollVelocity(onVelocity: (v: number) => void, enabled = true) {
  const cb = useRef(onVelocity); cb.current = onVelocity;
  useEffect(() => {
    if (!enabled) return;
    let last = window.scrollY, v = 0, raf = 0;
    const loop = () => {
      const y = window.scrollY; v = lerp(v, y - last, 0.2); last = y; cb.current(v);
      raf = Math.abs(v) > 0.05 ? requestAnimationFrame(loop) : 0; if (!raf) cb.current(0);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    window.addEventListener("scroll", kick, { passive: true });
    return () => { window.removeEventListener("scroll", kick); cancelAnimationFrame(raf); };
  }, [enabled]);
}

/** A frame loop that pauses when the element is off screen or the tab is hidden. */
export function useFrameLoop<T extends Element>(ref: RefObject<T | null>, frame: (t: number, dt: number) => void, enabled = true) {
  const cb = useRef(frame); cb.current = frame;
  useEffect(() => {
    if (!enabled) return;
    let raf = 0, visible = true, prev = 0;
    const run = (t: number) => { const dt = prev ? Math.min(64, t - prev) : 16; prev = t; cb.current(t, dt); raf = requestAnimationFrame(run); };
    const start = () => { if (!raf && visible && !document.hidden) { prev = 0; raf = requestAnimationFrame(run); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const el = ref.current;
    const io = el && typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); }) : null;
    if (el && io) io.observe(el);
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", vis); start();
    return () => { stop(); io?.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, [ref, enabled]);
}

/** Shared timing tokens (motion/tokens.md). UI feedback stays at or under 250ms. */
export const EASE = { out: "cubic-bezier(0.22, 1, 0.36, 1)", outStrong: "cubic-bezier(0.16, 1, 0.3, 1)", inOut: "cubic-bezier(0.65, 0, 0.35, 1)", drawer: "cubic-bezier(0.32, 0.72, 0, 1)" } as const;
export const DUR = { press: 120, ui: 180, reveal: 800, stagger: 80 } as const;
