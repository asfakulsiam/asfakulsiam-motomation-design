"use client";
// @motomation-component
// id: icon-cloud
// name: Icon Cloud
// family: ui
// tier: 2
// deps: react
// what: Labels or small icons sit on the surface of an invisible ball that turns slowly; dragging spins it and it coasts to a stop. The near side is large and sharp, the far side small and faint.
// use-when: A collection the visitor browses for the pleasure of it (a herbarium's species, a type foundry's glyphs, a band's setlist history), with the full list available in text.
// avoid-when: A logo wall of "technologies we use"; as navigation; more than about 40 items; small screens where a plain list reads better (below 300px wide it falls back to a wrapped list).
// reduced-motion: The ball, still, at a fixed angle; dragging still turns it (the visitor's own motion).
// touch: Drag sideways to spin; vertical swipes scroll the page.
// a11y: The items are a real list in reading order; the 3D placement is visual only. It turns with transform (one rAF loop), pauses off screen and in hidden tabs, and stops auto-turning while the pointer is over it.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { useFrameLoop, useReducedMotion } from "../_lib/motion";

type Props = { items: ReactNode[]; size?: number; speed?: number; className?: string; style?: CSSProperties };

export function IconCloud({ items, size = 340, speed = 0.12, className, style }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const pts = useMemo(() => items.map((_, i) => { const n = items.length, y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), f = i * 2.399963; return [Math.cos(f) * r, y, Math.sin(f) * r]; }), [items]);
  const rot = useRef({ ax: 0.35, ay: 0, vy: 0, vx: 0, drag: false, lx: 0, ly: 0, over: false });
  useEffect(() => { const el = ref.current; if (!el) return; const ro = new ResizeObserver(() => setNarrow((el.parentElement?.clientWidth ?? el.clientWidth) < 300)); ro.observe(el); return () => ro.disconnect(); }, [size]);
  const place = () => {
    const el = ref.current; if (!el || narrow) return; const R = Math.min(size, el.clientWidth) * 0.46, s = rot.current;
    const cy = Math.cos(s.ay), sy = Math.sin(s.ay), cx = Math.cos(s.ax), sx = Math.sin(s.ax);
    Array.from(el.children).forEach((li, i) => { const [x, y, z] = pts[i]; const x1 = cy * x + sy * z, z1 = -sy * x + cy * z, y1 = cx * y - sx * z1, z2 = sx * y + cx * z1;
      const k = (z2 + 1.6) / 2.6; (li as HTMLElement).style.transform = `translate(-50%, -50%) translate(${x1 * R}px, ${y1 * R}px) scale(${0.55 + 0.45 * k})`;
      (li as HTMLElement).style.opacity = String(0.25 + 0.75 * k); (li as HTMLElement).style.zIndex = String(Math.round(k * 100)); });
  };
  useEffect(place); // first layout and on every render (items, size)
  useEffect(() => { if (narrow) Array.from(ref.current?.children ?? []).forEach((li) => { const st = (li as HTMLElement).style; st.transform = st.opacity = st.zIndex = ""; }); }, [narrow]);
  useFrameLoop(ref, (_t, dt) => { const s = rot.current; if (!s.drag) { s.ay += s.vy; s.ax += s.vx; s.vy *= 0.95; s.vx *= 0.95; if (!reduce && !s.over) s.ay += (dt / 1000) * speed; } place(); }, !narrow);
  const down = (e: PointerEvent) => { const s = rot.current; s.drag = true; s.lx = e.clientX; s.ly = e.clientY; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => { const s = rot.current; if (!s.drag) return; const dx = e.clientX - s.lx, dy = e.clientY - s.ly; s.lx = e.clientX; s.ly = e.clientY;
    s.vy = dx * 0.006; s.vx = e.pointerType === "mouse" ? -dy * 0.006 : 0; s.ay += s.vy; s.ax = Math.max(-1.2, Math.min(1.2, s.ax + s.vx)); };
  const up = () => { rot.current.drag = false; };
  return (
    <ul ref={ref} className={className} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      onPointerEnter={() => (rot.current.over = true)} onPointerLeave={() => { rot.current.over = false; up(); }}
      style={narrow ? { display: "flex", flexWrap: "wrap", gap: 8, listStyle: "none", padding: 0, margin: 0, ...style }
        : { position: "relative", width: "100%", maxWidth: size, aspectRatio: "1", margin: "0 auto", padding: 0, listStyle: "none", touchAction: "pan-y", cursor: "grab", userSelect: "none", ...style }}>
      {items.map((it, i) => <li key={i} style={narrow ? {} : { position: "absolute", left: "50%", top: "50%", whiteSpace: "nowrap", willChange: "transform" }}>{it}</li>)}
    </ul>
  );
}
