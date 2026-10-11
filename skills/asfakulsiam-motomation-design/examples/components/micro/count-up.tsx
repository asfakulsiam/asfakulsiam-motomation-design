"use client";
// @motomation-component
// id: count-up
// name: Count Up
// family: micro
// tier: 2
// deps: react
// what: A number counts from a start value to its real value once, when it first enters the screen, with tabular figures so it doesn't jitter.
// use-when: Real, sourced figures that are the point of a section (one to three per page).
// avoid-when: Invented or rounded-up stats; prices; anything a screenshot mid-count would misreport (see the v2 benchmark note).
// reduced-motion: Shows the final value at once.
// touch: Same as desktop.
// a11y: The final value is in the accessible name from the start; the counting digits are aria-hidden. Before it counts, the visible value is the final value (no-JS and screenshots never show 0).
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "../_lib/motion";

type Props = { value: number; from?: number; duration?: number; decimals?: number; locale?: string; prefix?: string; suffix?: string; className?: string; style?: CSSProperties };

export function CountUp({ value, from = 0, duration = 1400, decimals = 0, locale, prefix = "", suffix = "", className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const fmt = (n: number) => prefix + n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  const [shown, setShown] = useState(fmt(value));
  const played = useRef(false);
  useEffect(() => {
    if (!seen || reduce || played.current) return; played.current = true;
    const t0 = performance.now(); let raf = 0;
    const step = (t: number) => { const k = Math.min(1, (t - t0) / duration); const e = 1 - Math.pow(1 - k, 4); setShown(fmt(from + (value - from) * e)); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [seen, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} aria-label={fmt(value)} className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }}><span aria-hidden="true">{shown}</span></span>;
}
