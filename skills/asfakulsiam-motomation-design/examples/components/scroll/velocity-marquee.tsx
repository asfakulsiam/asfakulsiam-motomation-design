"use client";
// @motomation-component
// id: velocity-marquee
// name: Velocity Marquee
// family: scroll
// tier: 2
// deps: react
// what: A looping marquee that drifts on its own, speeds up with scroll speed, follows scroll direction and leans (skews) while you scroll fast.
// use-when: Sport, launches, events and a single line of brand words between sections.
// avoid-when: Content the reader needs (prices, dates); more than one marquee per page.
// reduced-motion: A static, wrapped row of the same words.
// touch: Same as desktop.
// a11y: The words are read once (the duplicated copies are aria-hidden); hovering or focusing pauses the drift.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion, useFrameLoop, useScrollVelocity, clamp } from "../_lib/motion";

type Props = { items: string[]; speed?: number; maxSkew?: number; separator?: string; className?: string; style?: CSSProperties };

export function VelocityMarquee({ items, speed = 40, maxSkew = 10, separator = " — ", className, style }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const state = useRef({ x: 0, v: 0, dir: 1, paused: false });
  useScrollVelocity((v) => { state.current.v = v; if (Math.abs(v) > 0.5) state.current.dir = Math.sign(v); }, !reduce);
  useFrameLoop(wrap, (_t, dt) => {
    const s = state.current; const el = track.current; if (!el || s.paused) return;
    const half = el.scrollWidth / 2; s.x -= (s.dir * speed * dt) / 1000 + s.v * 0.6; s.x = ((s.x % half) - half) % half;
    el.style.transform = `translate3d(${s.x}px,0,0) skewX(${clamp(-s.v, -maxSkew, maxSkew)}deg)`;
  }, !reduce);
  const line = items.join(separator) + separator;
  if (reduce) return <p className={className} style={{ display: "flex", flexWrap: "wrap", gap: "0 0.5em", ...style }}>{items.join(separator)}</p>;
  return (
    <div ref={wrap} className={className} style={{ overflow: "hidden", whiteSpace: "nowrap", ...style }}
      onPointerEnter={() => (state.current.paused = true)} onPointerLeave={() => (state.current.paused = false)} onFocus={() => (state.current.paused = true)} onBlur={() => (state.current.paused = false)}>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{items.join(", ")}</span>
      <div ref={track} aria-hidden="true" style={{ display: "inline-flex", willChange: "transform" }}><span>{line}</span><span>{line}</span></div>
    </div>
  );
}
