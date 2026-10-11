// Shared frame for the page sections. Not a component: a <section> wrapper, type helpers and a tiny SVG artwork
// generator, so sections can show images without shipping image files. Sections read their palette and fonts from
// CSS variables set by the page (templates set them on <body>):
//   --ground --surface --ink --muted --line --accent   and   --font-display --font-text --font-mono
import type { CSSProperties, ReactNode } from "react";

export const v = (name: string, fallback: string) => `var(--${name}, ${fallback})`;
export const INK = v("ink", "#1d1a16"), GROUND = v("ground", "#f4efe6"), SURFACE = v("surface", "#fbf8f2"), MUTED = v("muted", "#6b6357"), LINE = v("line", "rgba(29,26,22,.14)"), ACCENT = v("accent", "#b5401f");
export const DISPLAY = v("font-display", "Georgia, serif"), TEXT = v("font-text", "system-ui, sans-serif"), MONO = v("font-mono", "ui-monospace, Menlo, monospace");

export const h = (size: string, extra: CSSProperties = {}): CSSProperties => ({ fontFamily: DISPLAY, fontSize: size, lineHeight: 1, letterSpacing: "-0.02em", margin: 0, fontWeight: 400, ...extra });
export const label: CSSProperties = { fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: MUTED, margin: 0 };
export const body: CSSProperties = { fontFamily: TEXT, fontSize: "clamp(1rem, 1.1vw, 1.125rem)", lineHeight: 1.55, color: INK, margin: 0, maxWidth: "62ch" };
/** Grid that becomes one column on narrow screens without a media query. */
export const cols = (min: number, gap = 24): CSSProperties => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`, gap });

type SectionProps = { id: string; title: string; hideTitle?: boolean; children: ReactNode; dark?: boolean; bleed?: boolean; style?: CSSProperties };
const SR: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

/** A page section: labelled by its title, padded with clamp() so it scales from 375px to wide screens. */
export function Section({ id, title, hideTitle, children, dark, bleed, style }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} style={{ position: "relative", padding: bleed ? 0 : "clamp(56px, 9vw, 128px) clamp(20px, 5vw, 72px)", background: dark ? INK : "transparent", color: dark ? GROUND : INK, overflow: "hidden", ...(dark ? { "--line": "rgba(244,239,230,.32)", "--muted": "#c9bfae" } as CSSProperties : null), ...style }}>
      {hideTitle ? <h2 id={`${id}-title`} style={SR}>{title}</h2> : null}
      <div style={{ maxWidth: bleed ? "none" : 1240, margin: "0 auto", position: "relative" }}>{children}</div>
    </section>
  );
}

/** Deterministic abstract artwork (as an SVG data URI) for image props: bands and a sun, in the given colours. */
export function art(seed: number, colors: [string, string, string], w = 800, h = 600): string {
  let s = seed; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const bands = Array.from({ length: 5 }, (_, i) => `<path d="M0 ${h * (0.45 + i * 0.12)} Q ${w * r()} ${h * (0.3 + i * 0.12 + r() * 0.1)} ${w} ${h * (0.5 + i * 0.11)} V ${h} H 0Z" fill="${colors[(i % 2) + 1]}" opacity="${0.35 + i * 0.12}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${colors[0]}"/><circle cx="${w * (0.2 + r() * 0.6)}" cy="${h * (0.2 + r() * 0.2)}" r="${h * (0.1 + r() * 0.08)}" fill="${colors[2]}" opacity=".9"/>${bands}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
