"use client";
// @motomation-component
// id: blur-focus
// name: Blur Focus
// family: type
// tier: 2
// deps: react
// what: Words sharpen from a soft blur into focus, one after another, as the line enters the screen.
// use-when: The concept is about clarity, focus, eyesight, photography or waking up.
// avoid-when: Every heading on the page; long paragraphs; low-end devices with many instances.
// reduced-motion: Text is sharp and visible from the start.
// touch: Same as desktop (scroll-triggered).
// a11y: Plain text in the DOM; only filter and opacity animate.
import { useRef, type CSSProperties } from "react";
import { useInView, useReducedMotion, EASE } from "../_lib/motion";

type Props = { text: string; stagger?: number; duration?: number; blur?: number; as?: "p" | "h1" | "h2" | "h3"; className?: string; style?: CSSProperties };

export function BlurFocus({ text, stagger = 70, duration = 800, blur = 12, as: Tag = "p", className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref);
  const reduce = useReducedMotion();
  const on = seen || reduce;
  return (
    <Tag ref={ref as never} className={className} style={style}>
      {/* dir="auto": the words are inline-blocks (bidi-neutral boxes), so they take the text's own direction from here */}
      <span dir="auto">{text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", filter: on ? "none" : `blur(${blur}px)`, opacity: on ? 1 : 0.15,
          transition: reduce ? "none" : `filter ${duration}ms ${EASE.outStrong} ${i * stagger}ms, opacity ${duration}ms ${EASE.outStrong} ${i * stagger}ms` }}>
          {w}{i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}</span>
    </Tag>
  );
}
