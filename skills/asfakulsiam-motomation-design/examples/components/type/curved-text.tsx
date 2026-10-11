"use client";
// @motomation-component
// id: curved-text
// name: Curved Text
// family: type
// tier: 1
// deps: react
// what: Text set around a circle like a stamp or seal, with an optional slow turn.
// use-when: Badges, stamps, seals, "since" marks and a single rotating label beside a primary action.
// avoid-when: Anything the reader must read quickly; as a loading spinner; more than one per screen.
// reduced-motion: The ring is still.
// touch: Same as desktop.
// a11y: The SVG has role img and the text as its label.
import { useId, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { text: string; size?: number; spinSeconds?: number; className?: string; style?: CSSProperties; children?: ReactNode };

export function CurvedText({ text, size = 160, spinSeconds = 24, className, style, children }: Props) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const r = size / 2 - 14;
  return (
    <span className={className} style={{ position: "relative", display: "inline-grid", placeItems: "center", width: size, height: size, ...style }}>
      <svg role="img" aria-label={text} viewBox={`0 0 ${size} ${size}`} width={size} height={size}
        style={{ position: "absolute", inset: 0, animation: reduce || !spinSeconds ? "none" : `mm-curved-spin ${spinSeconds}s linear infinite` }}>
        <defs><path id={`c${id}`} d={`M ${size / 2},${size / 2} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`} /></defs>
        <text style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fill: "currentColor" }}>
          <textPath href={`#c${id}`} textLength={2 * Math.PI * r - 6}>{text}</textPath>
        </text>
      </svg>
      <style>{`@keyframes mm-curved-spin{to{transform:rotate(360deg)}}`}</style>
      {children}
    </span>
  );
}
