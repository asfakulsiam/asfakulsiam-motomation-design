"use client";
// @motomation-component
// id: horizontal-reel
// name: Horizontal Reel
// family: scroll
// tier: 2
// deps: react
// what: A section pins and vertical scroll pulls a strip of frames sideways, like film through a gate; a frame counter follows.
// use-when: Film, gallery, timeline and process concepts with 4–10 frames.
// avoid-when: Content people need to scan quickly; more than one per page; frames that need reading time.
// reduced-motion: The frames become a normal horizontally scrollable row with snap points.
// touch: Below 768px wide, or under 560px tall (200% zoom), the strip becomes a swipeable row with snap points (no pinning).
// a11y: A normal list; the counter is aria-hidden; every frame is reachable by keyboard in the fallback.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useMedia, useStickyProgress } from "../_lib/motion";

type Props = { frames: ReactNode[]; frameWidth?: string; className?: string; style?: CSSProperties };

export function HorizontalReel({ frames, frameWidth = "min(70vw, 720px)", className, style }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const tall = useMedia("(min-height: 560px)"); // a short view (200% zoom, a landscape phone) gets the scroller, not a cramped pin
  const pinned = desktop && tall && !reduce;
  useStickyProgress(wrap, (p) => {
    const s = strip.current; if (!s) return; const run = Math.max(0, s.scrollWidth - (s.parentElement?.clientWidth ?? s.clientWidth)); // the strip is a grid item that grows to its content, so measure against the frame it moves in
    s.style.transform = `translate3d(${-run * p}px,0,0)`;
    if (counter.current) counter.current.textContent = `${String(Math.min(frames.length, Math.floor(p * frames.length) + 1)).padStart(2, "0")} / ${String(frames.length).padStart(2, "0")}`;
  }, pinned);
  const list = (
    <ul ref={strip} style={{ listStyle: "none", margin: 0, padding: "0 24px", display: "flex", gap: 24, willChange: pinned ? "transform" : undefined, overflowX: pinned ? "visible" : "auto", scrollSnapType: pinned ? undefined : "x mandatory" }}>
      {frames.map((f, i) => <li key={i} style={{ flex: `0 0 ${frameWidth}`, scrollSnapAlign: "start" }}>{f}</li>)}
    </ul>
  );
  if (!pinned) return <div className={className} style={style}>{list}</div>;
  return (
    <div ref={wrap} className={className} style={{ height: `${frames.length * 80}svh`, ...style }}>
      <div style={{ position: "sticky", top: 0, height: "100svh", display: "grid", alignContent: "center", overflow: "hidden" }}>
        {list}
        <span ref={counter} aria-hidden="true" style={{ position: "absolute", right: 24, bottom: 24, fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: 12, letterSpacing: "0.1em" }}>01 / {String(frames.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
