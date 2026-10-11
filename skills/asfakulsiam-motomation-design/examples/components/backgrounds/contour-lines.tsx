"use client";
// @motomation-component
// id: contour-lines
// name: Contour Lines
// family: backgrounds
// tier: 2
// deps: react
// what: Topographic contour lines drawn as SVG that slowly drift, like a map breathing; deterministic from a seed.
// use-when: Landscape, outdoors, climate, geography, agriculture and mapping concepts.
// avoid-when: Urban or tech brands without a land story; behind dense text.
// reduced-motion: Still lines.
// touch: Same as desktop.
// a11y: Decorative SVG (aria-hidden). Each drift is a CSS transform, so it costs no JS per frame.
import { useMemo, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { lines?: number; seed?: number; color?: string; seconds?: number; className?: string; style?: CSSProperties };
const rand = (s: number) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

export function ContourLines({ lines = 14, seed = 7, color = "currentColor", seconds = 30, className, style }: Props) {
  const reduce = useReducedMotion();
  const paths = useMemo(() => {
    const r = rand(seed); const cx = 300 + r() * 400, cy = 200 + r() * 200;
    return Array.from({ length: lines }, (_, i) => {
      const base = 30 + i * 28; const pts = Array.from({ length: 24 }, (_, k) => { const a = (k / 24) * Math.PI * 2; const rr = base * (1 + 0.18 * Math.sin(a * 3 + i * 0.6) + 0.1 * (r() - 0.5)); return [cx + Math.cos(a) * rr * 1.4, cy + Math.sin(a) * rr]; });
      // smooth closed curve: start at the midpoint of the last edge, then one quadratic per point (point = control, next midpoint = end)
      const mid = (p: number[], q: number[]) => `${((p[0] + q[0]) / 2).toFixed(1)},${((p[1] + q[1]) / 2).toFixed(1)}`;
      return `M${mid(pts[pts.length - 1], pts[0])} ` + pts.map((p, k) => `Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${mid(p, pts[(k + 1) % pts.length])}`).join(" ") + "Z";
    });
  }, [lines, seed]);
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", color, opacity: 0.35, ...style }}>
      {paths.map((d, i) => <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke"
        style={{ transformOrigin: "50% 50%", animation: reduce ? "none" : `mm-contour ${seconds + i}s ease-in-out ${-i * 1.3}s infinite alternate` }} />)}
      <style>{`@keyframes mm-contour{from{transform:translate(-6px,-3px) scale(.99)}to{transform:translate(6px,3px) scale(1.01)}}`}</style>
    </svg>
  );
}
