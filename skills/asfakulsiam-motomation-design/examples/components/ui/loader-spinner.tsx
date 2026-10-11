"use client";
// @motomation-component
// id: loader-spinner
// name: Loader Spinner
// family: ui
// tier: 1
// deps: react
// what: A thin ring whose arc stretches and shortens as it turns, for waits of unknown length. It only appears after a short delay, so fast loads never flash a spinner.
// use-when: A wait you can't measure (a search, a payment check) inside a button, a panel or a page area.
// avoid-when: Waits you can measure (show progress instead); content loading where the layout is known (use Loader Skeleton); whole-page splash screens.
// reduced-motion: The ring holds still at three-quarters and the label is shown; nothing turns.
// touch: Same as desktop.
// a11y: role="status" with a text label ("Loading" by default), visually hidden unless showLabel; appears after `delay` ms (default 300). The ring turns with transform; the arc length change is a small SVG stroke repaint, cheap at this size.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { size?: number; stroke?: number; color?: string; track?: string; label?: string; showLabel?: boolean; delay?: number; className?: string; style?: CSSProperties };
const SR: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

export function LoaderSpinner({ size = 28, stroke = 2.5, color = "currentColor", track = "rgba(127,127,127,.22)", label = "Loading", showLabel = false, delay = 300, className, style }: Props) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(delay <= 0);
  const ring = useRef<SVGSVGElement>(null), arc = useRef<SVGCircleElement>(null);
  useEffect(() => { if (delay <= 0) return; const t = window.setTimeout(() => setVisible(true), delay); return () => window.clearTimeout(t); }, [delay]);
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  useEffect(() => {
    if (!visible || reduce || !ring.current || !arc.current) return;
    const spin = ring.current.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 1100, iterations: Infinity, easing: "linear" });
    const breathe = arc.current.animate([{ strokeDasharray: `${C * 0.08} ${C}`, strokeDashoffset: 0 }, { strokeDasharray: `${C * 0.7} ${C}`, strokeDashoffset: -C * 0.15 }, { strokeDasharray: `${C * 0.08} ${C}`, strokeDashoffset: -C * 0.92 }],
      { duration: 1500, iterations: Infinity, easing: "cubic-bezier(0.45, 0, 0.55, 1)" });
    return () => { spin.cancel(); breathe.cancel(); };
  }, [visible, reduce, C]);
  return (
    <span role="status" className={className} style={{ display: "inline-flex", alignItems: "center", gap: 10, minHeight: size, ...style }}>
      {visible && (
        <svg ref={ring} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ flex: "none" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
          <circle ref={arc} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${C * 0.75} ${C}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        </svg>
      )}
      <span style={showLabel || reduce ? { fontSize: 14 } : SR}>{label}</span>
    </span>
  );
}
