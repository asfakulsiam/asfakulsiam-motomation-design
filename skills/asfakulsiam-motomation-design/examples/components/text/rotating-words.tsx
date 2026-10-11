"use client";
// @motomation-component
// id: rotating-words
// name: Rotating Words
// family: text
// tier: 1
// deps: react
// what: One word in a sentence turns over to the next, like a rolling counter, a few times, then rests. The slot is as wide as the longest word (with the sentence's ending attached), so nothing around it moves.
// use-when: The sentence really has several true endings (who you serve, what you make), and the rest of the line stays still.
// avoid-when: More than one per page; endings that are adjectives about yourself ("innovative", "bold"); the hero's only message.
// reduced-motion: The first word, still; all the words are listed for assistive tech.
// touch: Same as desktop; it pauses while touched.
// a11y: Screen readers get every word once, as a plain list in the sentence; the turning slot is aria-hidden. It stops by itself after `cycles` rounds (default 2), pauses on hover and focus, and pauses off screen (WCAG 2.2.2).
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion, EASE } from "../_lib/motion";

type Props = { before?: string; words: string[]; after?: string; interval?: number; cycles?: number; as?: "p" | "h1" | "h2" | "h3"; className?: string; style?: CSSProperties; wordStyle?: CSSProperties };
const SR: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

export function RotatingWords({ before = "", words, after = "", interval = 2200, cycles = 2, as: Tag = "p", className, style, wordStyle }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0), [held, setHeld] = useState(false);
  const steps = useRef(0);
  useEffect(() => {
    if (reduce || !inView || held || words.length < 2 || steps.current >= words.length * cycles) return;
    const t = window.setTimeout(() => { steps.current++; setI((v) => (v + 1) % words.length); }, interval);
    return () => window.clearTimeout(t);
  }, [i, inView, held, reduce, words.length, cycles, interval]);
  const list = words.length > 1 ? `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}` : words[0];
  return (
    <Tag ref={ref as never} className={className} style={{ position: "relative", ...style }} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
      <span style={SR}>{`${before}${list}${after}`}</span>
      <span aria-hidden="true">
        {before}
        <span style={{ display: "inline-grid", verticalAlign: "bottom", overflow: "hidden", height: "1.2em", lineHeight: 1.2 }}>
          {words.map((w, k) => (
            <span key={k} style={{ gridArea: "1 / 1", whiteSpace: "nowrap", transform: `translateY(${(k - i) * 110}%)`, opacity: k === i ? 1 : 0,
              transition: reduce ? "none" : `transform 600ms ${EASE.outStrong}, opacity 300ms` }}><span style={wordStyle}>{w}</span>{after}</span>
          ))}
        </span>
      </span>
    </Tag>
  );
}
