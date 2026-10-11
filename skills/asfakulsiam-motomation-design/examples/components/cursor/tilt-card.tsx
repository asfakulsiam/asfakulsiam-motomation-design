"use client";
// @motomation-component
// id: tilt-card
// name: Tilt Card
// family: cursor
// tier: 2
// deps: react
// what: A card rotates in 3D toward the cursor with a soft moving highlight, like holding a physical card to the light.
// use-when: Physical objects: tickets, cards, passes, packaging, a single product.
// avoid-when: Grids of many cards; text-heavy cards; cards that are links to long content (the motion distracts).
// reduced-motion: Flat card, no rotation or highlight.
// touch: Flat card.
// a11y: Children render normally; the highlight is aria-hidden.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useFinePointer, EASE } from "../_lib/motion";

type Props = { children: ReactNode; max?: number; glare?: boolean; className?: string; style?: CSSProperties };

export function TiltCard({ children, max = 10, glare = true, className, style }: Props) {
  const card = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const live = fine && !reduce;
  const move = (e: React.PointerEvent) => {
    const el = card.current; if (!el || !live) return; const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
    if (shine.current) shine.current.style.background = `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,.35), transparent 55%)`;
  };
  const leave = () => { if (card.current) card.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; if (shine.current) shine.current.style.background = "transparent"; };
  return (
    <div ref={card} onPointerMove={move} onPointerLeave={leave} className={className}
      style={{ position: "relative", transformStyle: "preserve-3d", transition: `transform 200ms ${EASE.out}`, willChange: live ? "transform" : undefined, ...style }}>
      {children}
      {glare && live && <span ref={shine} aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", mixBlendMode: "soft-light" }} />}
    </div>
  );
}
