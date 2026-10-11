"use client";
// @motomation-component
// id: darkroom-develop
// name: Darkroom Develop
// family: scroll
// tier: 2
// deps: react
// what: A photograph develops from blank paper as it scrolls in: pale and flat first, then contrast, then tone, like a print in the tray.
// use-when: Photography, archives, memory, analogue brands; one image per screen.
// avoid-when: Product shots the buyer must inspect; galleries of many small images.
// reduced-motion: The photo is fully developed from the start.
// touch: Same as desktop.
// a11y: A normal img with alt; only CSS filters change.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion, useScrollProgress, clamp } from "../_lib/motion";

type Props = { src: string; alt: string; width?: number; height?: number; className?: string; style?: CSSProperties };

export function DarkroomDevelop({ src, alt, width, height, className, style }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();
  useScrollProgress(ref, (p) => {
    const k = clamp((p - 0.1) / 0.45); const el = ref.current; if (!el) return;
    el.style.filter = `brightness(${1.9 - 0.9 * k}) contrast(${0.35 + 0.65 * k}) sepia(${(1 - k) * 0.5}) grayscale(${1 - k})`;
  }, !reduce);
  return <img ref={ref} src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className={className}
    style={{ display: "block", maxWidth: "100%", height: "auto", filter: reduce ? "none" : "brightness(1.9) contrast(.35) sepia(.5) grayscale(1)", ...style }} />;
}
