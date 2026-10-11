"use client";
// @motomation-component
// id: glare-card
// name: Glare Card
// family: ui
// tier: 2
// deps: react
// what: A flat, laminated card with a foil sheen: a soft band of colour and a sharp white glint slide across it as the pointer moves, the way a hologram on an ID card or a trading card catches light. The card itself never tilts (for tilt, use Tilt Card).
// use-when: Passes, tickets, membership cards, collectibles, certificates: one small card that is a physical object.
// avoid-when: Large surfaces (the blend is paint-heavy: its cost grows with area); photos of people; grids of many cards; anything that must look sober.
// reduced-motion: A still, faint sheen at one angle; no glint movement.
// touch: Dragging a finger moves the sheen; it rests at an angle otherwise.
// a11y: The sheen layers are aria-hidden and sit above the artwork at low opacity, never over text that needs full contrast (keep text in the card's lower band or check contrast with the sheen at its brightest). Paint-heavy (blend mode), so it only updates while the pointer moves and is limited to the card (motion/tokens.md "What to animate").
import { useRef, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { children: ReactNode; radius?: number; strength?: number; className?: string; style?: CSSProperties };

export function GlareCard({ children, radius = 16, strength = 0.55, className, style }: Props) {
  const foil = useRef<HTMLSpanElement>(null), glint = useRef<HTMLSpanElement>(null), raf = useRef(0), p = useRef({ x: 0.3, y: 0.3 });
  const reduce = useReducedMotion();
  const paint = () => { raf.current = 0; const { x, y } = p.current;
    // the foil band slides against the pointer (like light on a laminate), the glint follows it
    if (foil.current) foil.current.style.transform = `translate(${(0.5 - x) * 40}%, ${(0.5 - y) * 40}%) rotate(${(x - 0.5) * 30}deg)`;
    if (glint.current) glint.current.style.transform = `translate(${x * 100 - 50}%, ${y * 100 - 50}%)`; };
  const move = (e: PointerEvent<HTMLDivElement>) => { if (reduce) return; const r = e.currentTarget.getBoundingClientRect();
    p.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; if (!raf.current) raf.current = requestAnimationFrame(paint); };
  return (
    <div className={className} onPointerMove={move} style={{ position: "relative", overflow: "hidden", borderRadius: radius, isolation: "isolate", touchAction: "pan-y", ...style }}>
      {children}
      <span ref={foil} aria-hidden="true" style={{ position: "absolute", inset: "-50%", pointerEvents: "none", mixBlendMode: "color-dodge", opacity: strength * 0.6, transform: "translate(8%, 8%) rotate(-6deg)",
        background: "repeating-linear-gradient(115deg, rgba(255,120,120,.0) 0%, rgba(255,140,120,.55) 6%, rgba(255,230,120,.55) 10%, rgba(120,255,190,.55) 14%, rgba(120,170,255,.55) 18%, rgba(220,130,255,.0) 24%)" }} />
      <span ref={glint} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "overlay", opacity: reduce ? strength * 0.4 : strength, transform: "translate(-20%, -20%)",
        background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,.9) 0%, rgba(255,255,255,.25) 12%, transparent 30%)" }} />
    </div>
  );
}
