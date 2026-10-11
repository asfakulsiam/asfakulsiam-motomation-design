"use client";
// @motomation-component
// id: meteors
// name: Meteors
// family: backgrounds
// tier: 4
// deps: react
// what: Now and then a thin streak of light crosses a night sky at one shared angle and burns out; long quiet gaps between them. CSS only: each streak is a gradient line moved with transform.
// use-when: Night skies, observatories, wishes, launches that are literal (a rocket club), New Year: behind one dark hero.
// avoid-when: As "speed" or "innovation" decoration; light themes; more than one sky per page; busy sections where a flicker at the edge distracts from reading.
// reduced-motion: A still sky with two frozen streaks (this is also the poster).
// touch: Same as desktop.
// a11y: Decorative (aria-hidden). Capability probe (Save-Data, ≤ 2 cores, < 4 GB → still poster). Streaks are short and sparse (one at a time on average, ≥ 4s gaps), so nothing flashes. Transform/opacity only via Web Animations that pause off screen and in hidden tabs; absolute box, so no layout shift. No canvas, so no DPR cost.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useCapability, useAmbientAnimations } from "../_lib/ambient";

type Props = { count?: number; angle?: number; color?: string; sky?: string; className?: string; style?: CSSProperties };
const stars = Array.from({ length: 40 }, (_, i) => `radial-gradient(1px 1px at ${(i * 53) % 100}% ${(i * 29) % 100}%, rgba(255,255,255,${0.25 + (i % 4) * 0.15}), transparent)`).join(", ");

export function Meteors({ count = 6, angle = 32, color = "#fff4e0", sky = "#070912", className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const cap = useCapability(false);
  const live = !!cap?.ok && !reduce;
  useAmbientAnimations(ref, live, (root) => Array.from(root.querySelectorAll<HTMLElement>("[data-streak]")).map((el, i) => {
    const period = 6500 + ((i * 2741) % 5200); // each streak flies for ~1.2s, then waits
    return el.animate([{ transform: "translateY(-120%)", opacity: 0, offset: 0 }, { opacity: 1, offset: 0.03 }, { opacity: 1, offset: 0.15 }, { transform: "translateY(900%)", opacity: 0, offset: 0.19 }, { transform: "translateY(900%)", opacity: 0, offset: 1 }],
      { duration: period, iterations: Infinity, delay: -((i * 1913) % period), easing: "linear" });
  }));
  return (
    <span ref={ref} aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: `${stars}, ${sky}`, ...style }}>
      {Array.from({ length: count }, (_, i) => (
        // a tall, tilted track; the streak travels down it in units of its own height
        <span key={i} style={{ position: "absolute", left: `${8 + ((i * 41) % 90)}%`, top: "-40%", height: "160%", width: 2, transform: `rotate(${angle}deg)`, transformOrigin: "50% 0" }}>
          <span data-streak="" style={{ position: "absolute", left: 0, top: 0, width: 2, height: "11%", borderRadius: 2, background: `linear-gradient(to bottom, transparent, ${color})`,
            transform: !live && i < 2 ? `translateY(${200 + i * 260}%)` : "translateY(-120%)", opacity: !live && i >= 2 ? 0 : 1 }} />
        </span>
      ))}
    </span>
  );
}
