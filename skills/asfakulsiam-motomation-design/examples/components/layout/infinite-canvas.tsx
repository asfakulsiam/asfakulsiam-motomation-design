"use client";
// @motomation-component
// id: infinite-canvas
// name: Infinite Canvas
// family: layout
// tier: 2
// deps: react
// what: Drag (or use arrow keys) to pan an endless wall of tiles that repeats in every direction, with a little momentum when you let go.
// use-when: The Gallery Wall archetype: archives, pin boards, studios with lots of visual work.
// avoid-when: Fewer than ~12 tiles; content that needs order; as the only way to reach the work (also provide a list).
// reduced-motion: No momentum; panning still works.
// touch: One-finger drag pans; the page doesn't scroll while dragging inside.
// a11y: A focusable region with arrow-key panning and an instruction label; provide a plain list of the same work elsewhere on the page.
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { tiles: ReactNode[]; cols?: number; tile?: number; gap?: number; label?: string; className?: string; style?: CSSProperties };

export function InfiniteCanvas({ tiles, cols = 5, tile = 220, gap = 20, label = "Work wall. Drag or use the arrow keys to move.", className, style }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rows = Math.ceil(tiles.length / cols); const W = cols * (tile + gap), H = rows * (tile + gap);
  const s = useRef({ x: 0, y: 0, vx: 0, vy: 0, down: false, lx: 0, ly: 0, raf: 0 });
  const paint = () => { const p = plane.current; if (!p) return; const st = s.current; const x = ((st.x % W) + W) % W, y = ((st.y % H) + H) % H; p.style.transform = `translate3d(${x - W}px, ${y - H}px, 0)`; };
  useEffect(() => {
    const el = box.current; if (!el) return; const st = s.current;
    const coast = () => { st.vx *= 0.92; st.vy *= 0.92; st.x += st.vx; st.y += st.vy; paint(); st.raf = Math.hypot(st.vx, st.vy) > 0.2 ? requestAnimationFrame(coast) : 0; };
    const down = (e: PointerEvent) => { st.down = true; st.lx = e.clientX; st.ly = e.clientY; st.vx = st.vy = 0; cancelAnimationFrame(st.raf); el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!st.down) return; st.vx = e.clientX - st.lx; st.vy = e.clientY - st.ly; st.x += st.vx; st.y += st.vy; st.lx = e.clientX; st.ly = e.clientY; paint(); };
    const up = () => { st.down = false; if (!reduce) st.raf = requestAnimationFrame(coast); };
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up); paint();
    return () => { el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); cancelAnimationFrame(st.raf); };
  }, [reduce, W, H]); // eslint-disable-line react-hooks/exhaustive-deps
  const key = (e: React.KeyboardEvent) => { const d = { ArrowLeft: [tile, 0], ArrowRight: [-tile, 0], ArrowUp: [0, tile], ArrowDown: [0, -tile] }[e.key]; if (!d) return; e.preventDefault(); s.current.x += d[0]; s.current.y += d[1]; paint(); };
  const grid = (k: number) => <div key={k} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${tile}px)`, gap, padding: gap / 2 }}>{tiles.map((t, i) => <div key={i} style={{ width: tile, height: tile }}>{t}</div>)}</div>;
  return (
    <div ref={box} role="region" aria-label={label} tabIndex={0} onKeyDown={key} className={className} style={{ position: "relative", overflow: "hidden", touchAction: "none", cursor: "grab", height: "80svh", ...style }}>
      <div ref={plane} style={{ position: "absolute", left: 0, top: 0, display: "grid", gridTemplateColumns: `repeat(3, ${W}px)`, willChange: "transform" }}>
        {Array.from({ length: 9 }, (_, k) => <div key={k} aria-hidden={k !== 4} inert={k !== 4 ? true : undefined}>{grid(k)}</div>)}
      </div>
    </div>
  );
}
