"use client";
// @motomation-component
// id: loader-skeleton
// name: Loader Skeleton
// family: ui
// tier: 1
// deps: react
// what: Grey placeholder shapes in the exact layout of the content that's coming (an avatar, a title, a few lines), with a faint light passing over them, so the page doesn't jump when the content lands.
// use-when: Content whose layout you know is loading (a card, a list row, a profile, an article), for waits over about 300ms.
// avoid-when: Waits you can't predict the shape of (use Loader Spinner); placeholders that don't match the real layout (they cause the jump they're meant to prevent); whole pages of skeletons.
// reduced-motion: The same shapes, with no passing light.
// touch: Same as desktop.
// a11y: The wrapper is aria-busy with a visually hidden "Loading" label; the shapes are aria-hidden. Size the skeleton like the real content so swapping it causes no layout shift. The light pass is a transform-only overlay, paused off screen.
import { useRef, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";
import { useAmbientAnimations } from "../_lib/ambient";

type Props = { avatar?: boolean; title?: boolean; lines?: number; media?: boolean; tone?: string; light?: string; label?: string; className?: string; style?: CSSProperties };
const SR: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

export function LoaderSkeleton({ avatar = true, title = true, lines = 3, media = false, tone = "rgba(120,110,95,.16)", light = "rgba(255,255,255,.45)", label = "Loading", className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useAmbientAnimations(ref, !reduce, (root) => { const s = root.querySelector<HTMLElement>("[data-sheen]");
    return s ? [s.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(100%)" }], { duration: 1600, iterations: Infinity, easing: "cubic-bezier(0.4, 0, 0.6, 1)" })] : []; });
  const block = (w: string, h: number, r = 6): CSSProperties => ({ width: w, height: h, borderRadius: r, background: tone });
  return (
    <div ref={ref} aria-busy="true" className={className} style={{ position: "relative", overflow: "hidden", display: "grid", gap: 12, ...style }}>
      <span style={SR}>{label}</span>
      <div aria-hidden="true" style={{ display: "grid", gap: 12 }}>
        {media && <div style={{ ...block("100%", 0, 10), height: "auto", aspectRatio: "16 / 9" }} />}
        {(avatar || title) && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {avatar && <div style={block("44px", 44, 22)} />}
            {title && <div style={{ display: "grid", gap: 8, flex: 1 }}><div style={block("55%", 14)} /><div style={block("30%", 10)} /></div>}
          </div>
        )}
        {Array.from({ length: lines }, (_, i) => <div key={i} style={block(i === lines - 1 ? "62%" : "100%", 11)} />)}
      </div>
      <span data-sheen="" aria-hidden="true" style={{ position: "absolute", inset: 0, transform: "translateX(-100%)", pointerEvents: "none", background: `linear-gradient(90deg, transparent, ${light}, transparent)` }} />
    </div>
  );
}
