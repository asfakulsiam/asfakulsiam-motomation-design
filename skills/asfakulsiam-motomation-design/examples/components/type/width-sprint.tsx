"use client";
// @motomation-component
// id: width-sprint
// name: Width Sprint
// family: type
// tier: 2
// deps: react
// what: A display word stretches wider the faster you scroll and relaxes back when you stop, using the font's width axis.
// use-when: Sport, speed, events and launches with a variable font that has a wdth axis.
// avoid-when: Fonts without wdth; more than one element; layouts where the word could overflow at its widest.
// reduced-motion: The word stays at its base width.
// touch: Same as desktop (scroll-driven).
// a11y: Plain text; only font-variation-settings changes.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion, useScrollVelocity, clamp } from "../_lib/motion";

type Props = { text: string; base?: number; max?: number; sensitivity?: number; as?: "h1" | "h2" | "span"; className?: string; style?: CSSProperties };

export function WidthSprint({ text, base = 90, max = 125, sensitivity = 40, as: Tag = "h2", className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  useScrollVelocity((v) => { const el = ref.current; if (el) el.style.fontVariationSettings = `"wdth" ${base + (max - base) * clamp(Math.abs(v) / sensitivity)}`; }, !reduce);
  return <Tag ref={ref as never} className={className} style={{ fontVariationSettings: `"wdth" ${base}`, whiteSpace: "nowrap", maxWidth: "100%", ...style }}>{text}</Tag>;
}
