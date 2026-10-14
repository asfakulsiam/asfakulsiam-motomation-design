"use client";
// @motomation-component
// id: squish-switch
// name: Squish Switch
// family: micro
// tier: 1
// deps: react
// what: A toggle whose knob stretches while pressed and squashes as it lands on the other side, like a soft rubber key.
// use-when: Light-hearted products and settings panels where a little character is welcome.
// avoid-when: Serious financial or medical settings; dense settings tables.
// reduced-motion: The knob moves without stretching.
// touch: Same as desktop.
// a11y: A real button with role switch and aria-checked; the label is visible text.
import { useState, type CSSProperties } from "react";
import { useReducedMotion, EASE } from "../_lib/motion";

type Props = { label: string; defaultOn?: boolean; onChange?: (on: boolean) => void; className?: string; style?: CSSProperties };

export function SquishSwitch({ label, defaultOn = false, onChange, className, style }: Props) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(defaultOn);
  const [press, setPress] = useState(false);
  return (
    <label className={className} style={{ display: "inline-flex", alignItems: "center", gap: 12, cursor: "pointer", ...style }}>
      <button type="button" role="switch" aria-checked={on} onClick={() => { setOn(!on); onChange?.(!on); }}
        onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
        style={{ position: "relative", width: 52, height: 30, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", background: on ? "var(--accent, #e0442b)" : "var(--line, #bdbdbd)", transition: "background 180ms ease-out" }}>
        <span aria-hidden="true" style={{ position: "absolute", top: 3, left: 3, height: 24, width: press && !reduce ? 32 : 24, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.25)",
          transform: `translateX(${on ? (press && !reduce ? 14 : 22) : 0}px)`, transition: reduce ? "transform 120ms linear" : `transform 220ms ${EASE.out}, width 140ms ${EASE.out}` }} />
      </button>
      <span>{label}</span>
    </label>
  );
}
