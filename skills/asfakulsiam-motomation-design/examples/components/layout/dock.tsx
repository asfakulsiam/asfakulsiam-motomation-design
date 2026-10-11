"use client";
// @motomation-component
// id: dock
// name: Dock
// family: layout
// tier: 2
// deps: react
// what: A row of icon buttons that magnify smoothly as the cursor passes along them, neighbours growing a little less.
// use-when: App-like tool collections, launchers and playful personal sites with 4–8 actions.
// avoid-when: Primary navigation that needs labels; touch-first sites; more than 8 items.
// reduced-motion: No magnification.
// touch: No magnification; normal-size buttons.
// a11y: Real buttons or links with visible tooltips on focus and hover, and accessible names.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useFinePointer, clamp } from "../_lib/motion";

type Item = { label: string; icon: ReactNode; href?: string; onClick?: () => void };
type Props = { items: Item[]; size?: number; magnify?: number; reach?: number; className?: string; style?: CSSProperties };

export function Dock({ items, size = 48, magnify = 1.7, reach = 140, className, style }: Props) {
  const bar = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const move = (e: React.PointerEvent) => {
    if (reduce || !fine) return;
    bar.current?.querySelectorAll<HTMLElement>("[data-dock]").forEach((el) => { const r = el.getBoundingClientRect(); const d = Math.abs(e.clientX - (r.left + r.width / 2)); const s = 1 + (magnify - 1) * (1 - clamp(d / reach)) ** 2; el.style.width = el.style.height = `${size * s}px`; });
  };
  const leave = () => bar.current?.querySelectorAll<HTMLElement>("[data-dock]").forEach((el) => (el.style.width = el.style.height = `${size}px`));
  return (
    <div ref={bar} role="toolbar" aria-label="Dock" onPointerMove={move} onPointerLeave={leave} className={className}
      style={{ display: "inline-flex", alignItems: "flex-end", gap: 10, padding: 10, borderRadius: 20, background: "var(--surface, rgba(255,255,255,.7))", border: "1px solid var(--line, rgba(0,0,0,.12))", backdropFilter: "blur(10px)", ...style }}>
      {items.map((it, i) => {
        const common = { "data-dock": true, "aria-label": it.label, title: it.label, style: { width: size, height: size, display: "grid", placeItems: "center", borderRadius: 14, background: "var(--ground, #fff)", color: "inherit", border: "1px solid var(--line, rgba(0,0,0,.12))", transition: "width 120ms ease-out, height 120ms ease-out", cursor: "pointer", textDecoration: "none" } as CSSProperties };
        return it.href ? <a key={i} href={it.href} {...common}>{it.icon}</a> : <button key={i} type="button" onClick={it.onClick} {...common}>{it.icon}</button>;
      })}
    </div>
  );
}
