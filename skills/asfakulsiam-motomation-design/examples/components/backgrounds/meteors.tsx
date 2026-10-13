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
// reduced-motion: A designed still: a long-exposure night, star trails wheeling round the pole and one bright meteor crossing them at the same angle, over a low horizon. The streak tracks are not rendered.
// touch: Same as desktop.
// a11y: Decorative (aria-hidden). Capability probe (Save-Data, ≤ 2 cores, < 4 GB → still poster). Streaks are short and sparse (one at a time on average, ≥ 4s gaps), so nothing flashes. Transform/opacity only via Web Animations that pause off screen and in hidden tabs; absolute box, so no layout shift. No canvas, so no DPR cost.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useCapability, useAmbientAnimations } from "../_lib/ambient";

type Props = { count?: number; angle?: number; color?: string; sky?: string; className?: string; style?: CSSProperties };
const stars = Array.from({ length: 40 }, (_, i) => `radial-gradient(1px 1px at ${(i * 53) % 100}% ${(i * 29) % 100}%, rgba(255,255,255,${0.25 + (i % 4) * 0.15}), transparent)`).join(", ");

// Reduced motion: the photograph an astronomer would take of this sky: an hour of star trails and the one meteor that
// crossed it. A composition of its own, so the still isn't the animation with the streaks frozen mid-flight.
function MeteorsStill({ angle, color, sky }: { angle: number; color: string; sky: string }) {
  // an hour of exposure: concentric arcs round the pole, brighter and longer near it, fainter toward the horizon
  const trails = Array.from({ length: 40 }, (_, i) => { const r = 40 + i * 22, a0 = (i * 0.83) % 6.28, a1 = a0 + 0.55 + (i % 5) * 0.11;
    return `M${360 + r * Math.cos(a0)} ${140 + r * Math.sin(a0)}A${r} ${r} 0 0 1 ${360 + r * Math.cos(a1)} ${140 + r * Math.sin(a1)}`; }).join("");
  const t = ((90 - angle) * Math.PI) / 180, x0 = 1180, y0 = 160, len = 520;
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
      <defs><linearGradient id="me-m" x1={x0} y1={y0} x2={x0 - Math.cos(t) * len} y2={y0 + Math.sin(t) * len} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={color} stopOpacity="0" /><stop offset="1" stopColor={color} /></linearGradient></defs>
      <rect width="1600" height="1000" fill={sky} />
      {/* sky glow over the horizon, the light pollution of the nearest town */}
      <defs><linearGradient id="me-g" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stopColor={color} stopOpacity="0" /><stop offset="1" stopColor={color} stopOpacity=".16" /></linearGradient></defs>
      <rect width="1600" height="1000" fill="url(#me-g)" />
      <path d={trails} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="360" cy="140" r="3" fill="#fff" />
      <line x1={x0} y1={y0} x2={x0 - Math.cos(t) * len} y2={y0 + Math.sin(t) * len} stroke="url(#me-m)" strokeWidth="3" strokeLinecap="round" />
      {/* the ridge the camera stood on: a hard silhouette, so the plate reads as a photograph, not a frozen frame */}
      <path d="M0 860L120 822L260 846L380 790L520 832L700 808L860 850L1040 796L1180 830L1340 812L1480 842L1600 820V1000H0Z" fill="#000" fillOpacity=".86" />
    </svg>
  );
}

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
      {reduce ? <MeteorsStill angle={angle} color={color} sky={sky} /> : Array.from({ length: count }, (_, i) => (
        // a tall, tilted track; the streak travels down it in units of its own height
        <span key={i} style={{ position: "absolute", left: `${8 + ((i * 41) % 90)}%`, top: "-40%", height: "160%", width: 2, transform: `rotate(${angle}deg)`, transformOrigin: "50% 0" }}>
          <span data-streak="" style={{ position: "absolute", left: 0, top: 0, width: 2, height: "11%", borderRadius: 2, background: `linear-gradient(to bottom, transparent, ${color})`,
            transform: !live && i < 2 ? `translateY(${200 + i * 260}%)` : "translateY(-120%)", opacity: !live && i >= 2 ? 0 : 1 }} />
        </span>
      ))}
    </span>
  );
}
