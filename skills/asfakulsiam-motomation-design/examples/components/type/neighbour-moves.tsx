"use client";
// @motomation-component
// id: neighbour-moves
// name: Neighbour Moves
// family: type
// tier: 2
// deps: react
// what: Each letter of a name has its own small move on hover (lift, tilt, stretch, spin, drop), so the word feels like a cast of characters.
// use-when: Personal names, studio names and light-hearted logotypes of 3–12 letters.
// avoid-when: Navigation, body text, or brands that must feel calm.
// reduced-motion: No hover moves.
// touch: A tap on a letter plays its move once.
// a11y: The word is the accessible name; letters are aria-hidden.
import { useState, type CSSProperties } from "react";
import { useReducedMotion, EASE, graphemes } from "../_lib/motion";

const MOVES = ["translateY(-0.18em)", "rotate(-12deg)", "scaleY(1.25)", "rotate(14deg) translateY(-0.06em)", "translateY(0.12em) scaleX(1.15)", "skewX(-14deg)", "scale(0.85)"];
type Props = { word: string; moves?: string[]; className?: string; style?: CSSProperties };

export function NeighbourMoves({ word, moves = MOVES, className, style }: Props) {
  const reduce = useReducedMotion();
  const [hot, setHot] = useState<number | null>(null);
  return (
    <span aria-label={word} dir="auto" className={className} style={{ display: "inline-flex", ...style }} onPointerLeave={() => setHot(null)}>
      {graphemes(word).map((c, i) => (
        <span key={i} aria-hidden="true" onPointerEnter={() => !reduce && setHot(i)} onPointerDown={() => !reduce && setHot(i)}
          style={{ display: "inline-block", transition: `transform 220ms ${EASE.out}`, transform: hot === i ? moves[i % moves.length] : "none" }}>{c === " " ? "\u00a0" : c}</span>
      ))}
    </span>
  );
}
