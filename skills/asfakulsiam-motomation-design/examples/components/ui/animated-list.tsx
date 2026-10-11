"use client";
// @motomation-component
// id: animated-list
// name: Animated List
// family: ui
// tier: 1
// deps: react
// what: Entries arrive one at a time, like orders coming into a kitchen or messages into a log: each slides up into its slot and settles. It plays once, then the list is simply a list.
// use-when: The content really arrives over time (orders, sign-ups, sensor readings, a changelog), and showing the arrival explains the product.
// avoid-when: Fake "live activity" or social proof; long lists (over about 8 entries); content the visitor needs to scan at once.
// reduced-motion: Every entry is there from the start.
// touch: Same as desktop (plays when in view).
// a11y: All entries are in the DOM from the first render (the hidden ones are opacity 0, which screen readers still read), so nothing is announced late and nothing is missed; slots are laid out from the start, so the list never pushes the page (no layout shift). It pauses off screen.
import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView, useReducedMotion, EASE } from "../_lib/motion";

type Props = { children: ReactNode; interval?: number; gap?: number; as?: "ul" | "ol"; className?: string; style?: CSSProperties; itemStyle?: CSSProperties };

export function AnimatedList({ children, interval = 900, gap = 10, as: Tag = "ul", className, style, itemStyle }: Props) {
  const ref = useRef<HTMLElement>(null);
  const items = Children.toArray(children);
  const onScreen = useInView(ref, { once: false });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (reduce || !onScreen || shown >= items.length) return;
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 250 : interval);
    return () => window.clearTimeout(t);
  }, [shown, onScreen, reduce, items.length, interval]);
  const n = reduce ? items.length : shown;
  return (
    <Tag ref={ref as never} className={className} style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap, ...style }}>
      {items.map((it, i) => (
        <li key={i} style={{ opacity: i < n ? 1 : 0, transform: i < n ? "none" : "translateY(14px) scale(.98)",
          transition: reduce ? "none" : `opacity 360ms ${EASE.out}, transform 520ms ${EASE.outStrong}`, ...itemStyle }}>{it}</li>
      ))}
    </Tag>
  );
}
