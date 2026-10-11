"use client";
// @motomation-component
// id: rainbow-border
// name: Rainbow Border
// family: ui
// tier: 1
// deps: react
// what: A thin border made of a turning colour wheel around a card or button. It turns while you point at or focus the element and rests otherwise.
// use-when: One element that is literally about colour (a paint, a print shop, a palette tool, a pride event), or the single "new" item in a list.
// avoid-when: As generic "AI glow"; on more than one element per screen; serious or quiet brands; around body text blocks.
// reduced-motion: The same colour border, still.
// touch: Turns while pressed; still otherwise.
// a11y: Decorative: the border layer is aria-hidden and the content sits on its own solid surface, so text contrast never depends on the colours. Turning uses transform: rotate on an oversized layer clipped by the frame (no animated gradient angle, which would repaint every frame). Pauses off screen.
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useFrameLoop, useReducedMotion } from "../_lib/motion";

type Props = { children: ReactNode; colors?: string[]; width?: number; radius?: number; surface?: string; speed?: number; always?: boolean; className?: string; style?: CSSProperties };

export function RainbowBorder({ children, colors = ["#e0442b", "#e0a92b", "#5aa64b", "#2b8fe0", "#7d4be0", "#e0442b"], width = 2, radius = 16, surface = "#fbf8f2", speed = 0.06, always = false, className, style }: Props) {
  const frame = useRef<HTMLDivElement>(null), wheel = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const angle = useRef(0);
  useFrameLoop(frame, (_t, dt) => { angle.current = (angle.current + dt * speed) % 360; if (wheel.current) wheel.current.style.transform = `translate(-50%, -50%) rotate(${angle.current}deg)`; }, !reduce && (on || always));
  return (
    <div ref={frame} className={className} onPointerEnter={() => setOn(true)} onPointerLeave={() => setOn(false)} onFocus={() => setOn(true)} onBlur={() => setOn(false)}
      style={{ position: "relative", padding: width, borderRadius: radius, overflow: "hidden", isolation: "isolate", ...style }}>
      <span ref={wheel} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "300%", aspectRatio: "1", transform: "translate(-50%, -50%)", zIndex: -1,
        background: `conic-gradient(${colors.join(", ")})`, pointerEvents: "none" }} />
      <div style={{ borderRadius: Math.max(0, radius - width), background: surface, height: "100%" }}>{children}</div>
    </div>
  );
}
