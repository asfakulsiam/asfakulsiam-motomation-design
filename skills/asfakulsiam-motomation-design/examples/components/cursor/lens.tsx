"use client";
// @motomation-component
// id: lens
// name: Lens
// family: cursor
// tier: 2
// deps: react
// what: A circle follows the cursor and reveals a second layer underneath: sketch under final, night under day, before under after.
// use-when: The two layers are the story (process, transformation, hidden detail).
// avoid-when: The second layer is decoration; text-heavy layers; more than one per page.
// reduced-motion: The lens jumps to the cursor without easing; a "Show the other layer" toggle shows the second layer at full size.
// touch: Press and drag to move the lens; the toggle works everywhere.
// a11y: Both layers are in the DOM; the toggle is a real button with aria-pressed; give images alt text.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, lerp } from "../_lib/motion";

type Props = { base: ReactNode; reveal: ReactNode; radius?: number; toggleLabel?: string; className?: string; style?: CSSProperties };

export function Lens({ base, reveal, radius = 120, toggleLabel = "Show the other layer", className, style }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [full, setFull] = useState(false);
  const pos = useRef({ x: -999, y: -999, tx: -999, ty: -999, raf: 0, r: 0, tr: 0 });
  const paint = () => {
    const s = pos.current; const k = reduce ? 1 : 0.22;
    s.x = lerp(s.x, s.tx, k); s.y = lerp(s.y, s.ty, k); s.r = lerp(s.r, s.tr, k);
    if (top.current) top.current.style.clipPath = `circle(${s.r}px at ${s.x}px ${s.y}px)`;
    s.raf = Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) + Math.abs(s.tr - s.r) > 0.5 ? requestAnimationFrame(paint) : 0;
  };
  useEffect(() => () => { cancelAnimationFrame(pos.current.raf); pos.current.raf = 0; }, []);
  const kick = () => { if (!pos.current.raf) pos.current.raf = requestAnimationFrame(paint); };
  const move = (e: React.PointerEvent) => { const r = box.current!.getBoundingClientRect(); const s = pos.current; s.tx = e.clientX - r.left; s.ty = e.clientY - r.top; if (s.x < -900) { s.x = s.tx; s.y = s.ty; } s.tr = radius; kick(); };
  const leave = () => { pos.current.tr = 0; kick(); };
  return (
    <div className={className} style={{ display: "grid", gap: 12, ...style }}>
      <div ref={box} onPointerMove={move} onPointerDown={move} onPointerLeave={leave} style={{ position: "relative", overflow: "hidden", touchAction: "pan-y", cursor: "crosshair" }}>
        <div>{base}</div>
        <div ref={top} style={{ position: "absolute", inset: 0, clipPath: full ? "none" : "circle(0px at -999px -999px)" }}>{reveal}</div>
      </div>
      <button type="button" aria-pressed={full} onClick={() => setFull((f) => !f)} style={{ justifySelf: "start", font: "inherit", fontSize: 14, padding: "8px 14px", borderRadius: 999, border: "1px solid currentColor", background: "transparent", color: "inherit", cursor: "pointer" }}>{toggleLabel}</button>
    </div>
  );
}
