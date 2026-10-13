"use client";
// @motomation-component
// id: orbiting-circles
// name: Orbiting Circles
// family: ui
// tier: 2
// deps: react
// what: Small badges travel on one or two thin circular orbits around a centre, staying upright as they go; the outer ring turns the other way, more slowly. Pointing at it stops the orbits.
// use-when: A real centre with real satellites: a cooperative and its member farms, a studio and its long-term clients, a hub airport and its routes.
// avoid-when: The generic "integrations around our logo" picture; more than about 10 satellites; anything the visitor must read while it moves (list them in text too).
// reduced-motion: The same arrangement, still.
// touch: Still while touched; turns otherwise.
// a11y: The centre and satellites are a labelled list for assistive tech (role="list"); the orbit art is presentational. Transform-only Web Animations that pause off screen, in hidden tabs, and on hover or focus.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useCapability, useAmbientAnimations } from "../_lib/ambient";

type Ring = { items: { label: string; node: ReactNode }[]; radius: number; seconds?: number; reverse?: boolean };
type Props = { center: ReactNode; rings: Ring[]; label: string; size?: number; line?: string; className?: string; style?: CSSProperties };

export function OrbitingCircles({ center, rings, label, size = 360, line = "rgba(0,0,0,.12)", className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const cap = useCapability(false);
  useAmbientAnimations(ref, !!cap?.ok && !reduce, (root) => Array.from(root.querySelectorAll<HTMLElement>("[data-ring]")).flatMap((ring, r) => {
    const sec = (rings[r].seconds ?? 40 + r * 20) * 1000, dir = rings[r].reverse ? -1 : 1;
    const spin = ring.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${360 * dir}deg)` }], { duration: sec, iterations: Infinity });
    // each badge turns back by the same amount, so it stays upright
    const upright = Array.from(ring.querySelectorAll<HTMLElement>("[data-upright]")).map((b) => b.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${-360 * dir}deg)` }], { duration: sec, iterations: Infinity }));
    return [spin, ...upright];
  }));
  const hold = (on: boolean) => ref.current?.getAnimations({ subtree: true }).forEach((a) => (on ? a.pause() : a.play()));
  return (
    <div ref={ref} role="list" aria-label={label} className={className} onPointerEnter={() => hold(true)} onPointerLeave={() => hold(false)} onFocus={() => hold(true)} onBlur={() => hold(false)}
      style={{ position: "relative", width: "100%", maxWidth: size, aspectRatio: "1", margin: "0 auto", ...style }}>
      <div role="listitem" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 1 }}>{center}</div>
      {rings.map((ring, r) => (
        <div key={r} data-ring="" style={{ position: "absolute", inset: `${50 - ring.radius * 50}%`, borderRadius: "50%", border: `1px solid ${line}` }}>
          {ring.items.map((it, i) => {
            // rounded: a raw float (24.99999999999998%) is normalised by the browser to 25%, which React reports as a hydration mismatch
            const a = (i / ring.items.length) * Math.PI * 2;
            return (
              <div key={i} role="listitem" aria-label={it.label} style={{ position: "absolute", left: `${+(50 + 50 * Math.cos(a)).toFixed(3)}%`, top: `${+(50 + 50 * Math.sin(a)).toFixed(3)}%`, transform: "translate(-50%, -50%)" }}>
                <div data-upright="">{it.node}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
