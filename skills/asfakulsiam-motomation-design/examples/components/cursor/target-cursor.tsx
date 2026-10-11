"use client";
// @motomation-component
// id: target-cursor
// name: Target Cursor
// family: cursor
// tier: 2
// deps: react
// what: A small crosshair follows the cursor; over anything clickable it snaps out into corner brackets that frame the target.
// use-when: Precision tools, cameras, games, architecture and engineering concepts.
// avoid-when: Content sites; together with another cursor effect; when it would hide the system cursor (it doesn't by default).
// reduced-motion: Brackets jump to targets without easing.
// touch: Not rendered.
// a11y: Decorative overlay (aria-hidden, pointer-events none); the system cursor stays visible unless hideCursor is set.
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer, lerp } from "../_lib/motion";

type Props = { selector?: string; color?: string; hideCursor?: boolean; className?: string; style?: CSSProperties };

export function TargetCursor({ selector = "a, button, [role=button], input, select, textarea, [data-target]", color = "var(--accent, #e0442b)", hideCursor = false, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    const el = ref.current; if (!el || !fine) return;
    const s = { x: 0, y: 0, w: 14, h: 14, tx: 0, ty: 0, tw: 14, th: 14 }; let raf = 0;
    const loop = () => { const k = reduce ? 1 : 0.25; s.x = lerp(s.x, s.tx, k); s.y = lerp(s.y, s.ty, k); s.w = lerp(s.w, s.tw, k); s.h = lerp(s.h, s.th, k);
      el.style.transform = `translate3d(${s.x - s.w / 2}px, ${s.y - s.h / 2}px, 0)`; el.style.width = `${s.w}px`; el.style.height = `${s.h}px`; raf = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.(selector);
      if (t) { const r = t.getBoundingClientRect(); s.tx = r.left + r.width / 2; s.ty = r.top + r.height / 2; s.tw = r.width + 12; s.th = r.height + 12; el.dataset.locked = "1"; }
      else { s.tx = e.clientX; s.ty = e.clientY; s.tw = 14; s.th = 14; delete el.dataset.locked; }
      el.style.opacity = "1";
    };
    const out = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", move); document.addEventListener("pointerleave", out); raf = requestAnimationFrame(loop);
    if (hideCursor) document.documentElement.style.cursor = "none";
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", out); cancelAnimationFrame(raf); if (hideCursor) document.documentElement.style.cursor = ""; };
  }, [fine, reduce, selector, hideCursor]);
  if (!fine) return null;
  const corner = (pos: CSSProperties): CSSProperties => ({ position: "absolute", width: 8, height: 8, borderColor: color, borderStyle: "solid", borderWidth: 0, ...pos });
  return (
    <div ref={ref} aria-hidden="true" className={className} style={{ position: "fixed", left: 0, top: 0, zIndex: 9999, pointerEvents: "none", opacity: 0, transition: "opacity 150ms linear", ...style }}>
      <span style={corner({ left: 0, top: 0, borderLeftWidth: 2, borderTopWidth: 2 })} />
      <span style={corner({ right: 0, top: 0, borderRightWidth: 2, borderTopWidth: 2 })} />
      <span style={corner({ left: 0, bottom: 0, borderLeftWidth: 2, borderBottomWidth: 2 })} />
      <span style={corner({ right: 0, bottom: 0, borderRightWidth: 2, borderBottomWidth: 2 })} />
    </div>
  );
}
