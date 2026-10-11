"use client";
// @motomation-component
// id: seismograph-line
// name: Seismograph Line
// family: cursor
// tier: 2
// deps: react
// what: A hairline divider bends toward the cursor as it passes and springs back with a small wobble, like a needle on a seismograph.
// use-when: Dividers on calm editorial pages where one living detail is enough; sound, measurement and science brands.
// avoid-when: Every divider; busy pages; pages that already have a cursor effect.
// reduced-motion: A straight line.
// touch: A straight line (no hover).
// a11y: Decorative: role presentation, aria-hidden.
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer, clamp } from "../_lib/motion";

type Props = { height?: number; reach?: number; stiffness?: number; damping?: number; color?: string; className?: string; style?: CSSProperties };

export function SeismographLine({ height = 80, reach = 36, stiffness = 0.12, damping = 0.82, color = "var(--line, rgba(0,0,0,.35))", className, style }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    const el = box.current, p = path.current; if (!el || !p || reduce || !fine) return;
    let x = 0.5, y = 0, v = 0, target = 0, raf = 0;
    const draw = () => { const w = el.clientWidth; p.setAttribute("d", `M0 ${height / 2} Q ${x * w} ${height / 2 + y} ${w} ${height / 2}`); };
    const loop = () => { v = (v + (target - y) * stiffness) * damping; y += v; draw(); raf = Math.abs(v) + Math.abs(target - y) > 0.05 ? requestAnimationFrame(loop) : 0; };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x = clamp((e.clientX - r.left) / r.width); target = clamp(e.clientY - (r.top + height / 2), -reach, reach); kick(); };
    const leave = () => { target = 0; kick(); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave); draw();
    const ro = new ResizeObserver(draw); ro.observe(el);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [reduce, fine, height, reach, stiffness, damping]);
  return (
    <div ref={box} role="presentation" aria-hidden="true" className={className} style={{ height, width: "100%", ...style }}>
      <svg width="100%" height={height} style={{ display: "block", overflow: "visible" }}><path ref={path} d={`M0 ${height / 2} L 10000 ${height / 2}`} fill="none" stroke={color} strokeWidth={1} vectorEffect="non-scaling-stroke" /></svg>
    </div>
  );
}
