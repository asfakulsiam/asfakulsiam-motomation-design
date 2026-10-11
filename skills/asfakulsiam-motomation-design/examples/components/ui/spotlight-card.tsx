"use client";
// @motomation-component
// id: spotlight-card
// name: Spotlight Card
// family: ui
// tier: 1
// deps: react
// what: A dark card with a soft pool of light that follows the pointer across its surface, like a torch on a wall.
// use-when: Night, theatre, cinema, exhibition or archive concepts: a grid of a few dark cards the visitor explores.
// avoid-when: Light surfaces (the pool vanishes); a grid where every card already moves; content that must be read evenly lit.
// reduced-motion: A fixed, soft pool near the top of the card.
// touch: The pool rests near the top; dragging a finger moves it.
// a11y: The light is a decorative, aria-hidden layer below the content, and the text contrast is checked against the unlit surface, so it reads with the light anywhere. The pool moves with transform (no repainted gradient).
import { useRef, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { children: ReactNode; surface?: string; light?: string; size?: number; radius?: number; className?: string; style?: CSSProperties };

export function SpotlightCard({ children, surface = "#17140f", light = "rgba(255,226,170,.16)", size = 360, radius = 18, className, style }: Props) {
  const card = useRef<HTMLDivElement>(null), pool = useRef<HTMLSpanElement>(null), raf = useRef(0), pos = useRef({ x: 0.5, y: 0.15 });
  const reduce = useReducedMotion();
  const place = () => { raf.current = 0; const c = card.current, p = pool.current; if (!c || !p) return;
    p.style.transform = `translate(${pos.current.x * c.clientWidth - size / 2}px, ${pos.current.y * c.clientHeight - size / 2}px)`; };
  const move = (e: PointerEvent<HTMLDivElement>) => { if (reduce) return; const r = e.currentTarget.getBoundingClientRect();
    pos.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; if (!raf.current) raf.current = requestAnimationFrame(place); };
  return (
    <div ref={card} className={className} onPointerMove={move} onPointerEnter={() => pool.current && (pool.current.style.opacity = "1")}
      style={{ position: "relative", overflow: "hidden", borderRadius: radius, background: surface, color: "#f1e9da", isolation: "isolate", ...style }}>
      <span ref={(el) => { pool.current = el; if (el) requestAnimationFrame(place); }} aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: "50%", zIndex: -1, pointerEvents: "none",
          background: `radial-gradient(closest-side, ${light}, transparent)`, transition: reduce ? "none" : "opacity 300ms" }} />
      {children}
    </div>
  );
}
