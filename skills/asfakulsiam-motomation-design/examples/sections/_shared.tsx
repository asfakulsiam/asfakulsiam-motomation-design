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
    <section id={id} aria-labelledby={`${id}-title`} style={{ position: "relative", padding: bleed ? 0 : "clamp(56px, 9vw, 128px) clamp(20px, 5vw, 72px)", background: dark ? INK : "transparent", color: dark ? GROUND : INK, overflow: "clip", /* clip, not hidden: hidden makes the section a scroll container and breaks position: sticky inside it */ ...(dark ? { "--line": "rgba(244,239,230,.32)", "--muted": "#c9bfae" } as CSSProperties : null), ...style }}>
      {hideTitle ? <h2 id={`${id}-title`} style={SR}>{title}</h2> : null}
      <div style={{ maxWidth: bleed ? "none" : 1240, margin: "0 auto", position: "relative" }}>{children}</div>
    </section>
  );
}

