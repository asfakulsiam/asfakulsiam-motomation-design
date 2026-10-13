"use client";
// Motomation component helpers: the shared motion rules every component in examples/components follows.
// No dependencies beyond React. Each hook cleans up after itself and respects reduced motion.
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const query = (q: string) => (typeof window !== "undefined" && "matchMedia" in window ? window.matchMedia(q) : null);

/** Live media-query state, correct on the first client render: it reads the query while rendering (through
 *  useSyncExternalStore), so a reduced-motion user never gets one animated render before an effect corrects it.
 *  On the server there is no media query: it returns false there, and React re-renders with the real value on hydration. */
export function useMedia(q: string): boolean {
  return useSyncExternalStore(
    (onChange) => { const m = query(q); if (!m) return () => {}; m.addEventListener("change", onChange); return () => m.removeEventListener("change", onChange); },
    () => query(q)?.matches ?? false,
    () => false,
  );
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
/** Split text into the units a reader sees as one character (grapheme clusters), for per-letter effects.
 *  `"কালো".split("")` gives 4 code units and a lone vowel sign renders as a dotted circle (◌া); `graphemes("কালো")` gives
 *  ["কা", "লো"]. Emoji ZWJ sequences, flags and combining accents stay whole. Uses Intl.Segmenter, with Array.from (code
 *  points) as the fallback where Segmenter is missing. Cursive scripts (Arabic, Syriac, Thaana, N'Ko, Mongolian…) join each
 *  letter to the next, so a run of them is kept as one unit: split into spans they would lose their joined forms. */
const JOINING = /[\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0860-\u089F\u08A0-\u08FF\u1800-\u18AF\uFB50-\uFDFF\uFE70-\uFEFF\u200C\u200D]/;
type Seg = { segment(input: string): Iterable<{ segment: string }> };
let seg: Seg | null | undefined;
export function graphemes(text: string): string[] {
  if (seg === undefined) { const S = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: "grapheme" }) => Seg }).Segmenter; seg = S ? new S(undefined, { granularity: "grapheme" }) : null; }
  const units = seg ? Array.from(seg.segment(text), (x) => x.segment) : Array.from(text);
  const out: string[] = [];
  for (const u of units) { const prev = out[out.length - 1]; if (prev !== undefined && JOINING.test(u) && JOINING.test(prev.slice(-1))) out[out.length - 1] = prev + u; else out.push(u); }
  return out;
}

/** Writing direction. Components read it from the page (dir="rtl" on <html> or any ancestor, or CSS direction), never
 *  from a prop, so an Arabic, Hebrew or Urdu page needs no extra wiring. Layout uses logical properties
 *  (inset-inline-start, padding-inline-end…) and follows on its own; these are for what layout cannot do: pointer x to
 *  letter index, swipe and arrow-key meaning, the direction a sweep or marquee travels. */
export const isRtl = (el: Element | null | undefined) => !!el && typeof getComputedStyle !== "undefined" && getComputedStyle(el).direction === "rtl";
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
/** "rtl" or "ltr" for an element, read before the browser paints (so nothing is drawn the wrong way first). The server
 *  render and the hydration render say "ltr", so the markup always matches; the correction lands before first paint. */
export function useDirection<T extends Element>(ref: RefObject<T | null>): "ltr" | "rtl" {
  const [d, setD] = useState<"ltr" | "rtl">("ltr");
  useIsoLayoutEffect(() => { setD(isRtl(ref.current) ? "rtl" : "ltr"); });
  return d;
}

export const EASE = { out: "cubic-bezier(0.22, 1, 0.36, 1)", outStrong: "cubic-bezier(0.16, 1, 0.3, 1)", inOut: "cubic-bezier(0.65, 0, 0.35, 1)", drawer: "cubic-bezier(0.32, 0.72, 0, 1)" } as const;
export const DUR = { press: 120, ui: 180, reveal: 800, stagger: 80 } as const;
