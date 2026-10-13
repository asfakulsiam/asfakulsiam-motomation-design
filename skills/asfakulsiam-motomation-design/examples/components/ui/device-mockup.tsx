"use client";
// @motomation-component
// id: device-mockup
// name: Device Mockup
// family: ui
// tier: 1
// deps: react
// what: A phone, browser or laptop frame drawn in CSS around real content (a screenshot or live markup). For a tall screenshot, pointing at the screen scrolls it slowly to the bottom, like someone reading.
// use-when: Showing the actual product screen (an app, a site you built) where the device tells the visitor where it runs.
// avoid-when: Stock "phone with a gradient" decoration; floating several devices at angles; screens with fake data; when the screen alone, unframed, reads better.
// reduced-motion: A tall screen shows its whole page, still; any other screen can be scrolled with the wheel or keyboard.
// touch: A tall screen shows its whole page (there is no hover to glide it); any other screen is a normal scroll area (swipe inside it).
// a11y: The frame is decoration; the screen is a labelled region, focusable (tabindex 0) whenever it scrolls, so keyboard users can scroll it; a tall screen without the hover glide (touch, reduced motion) shows its whole page. The hover glide scrolls the screen (so the wheel, keyboard and zoom still reach every line), stops when the visitor scrolls it themselves, and returns when the pointer leaves. Sizes come from aspect-ratio, so no layout shift.
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";

const EASE_OUT = (k: number) => 1 - (1 - k) ** 3;

type Props = { kind?: "phone" | "browser" | "laptop"; children: ReactNode; label: string; url?: string; tall?: boolean; frame?: string; className?: string; style?: CSSProperties };
const RATIO = { phone: "9 / 19.5", browser: "16 / 10", laptop: "16 / 10" } as const;

export function DeviceMockup({ kind = "browser", children, label, url, tall = false, frame = "#1d1b18", className, style }: Props) {
  const screen = useRef<HTMLDivElement>(null), anim = useRef(0);
  const reduce = useReducedMotion(), fine = useFinePointer();
  // the glide scrolls the screen itself (scrollTop, one rAF loop), so wheel, keyboard and 200% zoom reach every line.
  // Before, it moved the content with transform inside an overflow: hidden screen, which nothing else could scroll.
  const stop = () => { cancelAnimationFrame(anim.current); anim.current = 0; };
  const glide = (down: boolean) => { const s = screen.current; if (!tall || reduce || !fine || !s) return; stop();
    const from = s.scrollTop, to = down ? Math.max(0, s.scrollHeight - s.clientHeight) : 0, dur = down ? Math.min(9000, 1500 + (to - from) * 6) : 900, t0 = performance.now();
    const step = (t: number) => { const k = Math.min(1, (t - t0) / dur); s.scrollTop = from + (to - from) * (down ? k : EASE_OUT(k)); anim.current = k < 1 ? requestAnimationFrame(step) : 0; };
    anim.current = requestAnimationFrame(step); };
  useEffect(() => stop, []);
  // a tall screen glides on hover with a fine pointer; with touch or reduced motion there is no glide, so it shows the
  // whole page instead of an inner scroll area (overflow: clip keeps the corners and lets aspect-ratio grow to the
  // content). Before, a tall browser frame on a phone hid most of its page below the frame's fold.
  const glides = tall && fine && !reduce, full = tall && !glides;
  const screenEl = (
    <div ref={screen} role="region" aria-label={label} tabIndex={full ? undefined : 0} onPointerEnter={() => glide(true)} onPointerLeave={() => glide(false)} onWheel={stop} onTouchStart={stop}
      style={{ position: "relative", aspectRatio: RATIO[kind], overflow: full ? "clip" : "auto", background: "#fff", borderRadius: kind === "phone" ? 30 : kind === "browser" ? "0 0 10px 10px" : 4,
        // the phone's notch covers the top of the screen: content starts below it, as on a real phone (a safe area)
        paddingTop: kind === "phone" ? 34 : undefined, boxSizing: "border-box" }}>
      <div>{children}</div>
    </div>
  );
  if (kind === "phone") return (
    <div className={className} style={{ width: "100%", maxWidth: 300, margin: "0 auto", padding: 10, borderRadius: 42, background: frame, boxShadow: "0 30px 60px rgba(0,0,0,.22), inset 0 0 0 1.5px rgba(255,255,255,.08)", position: "relative", ...style }}>
      <span aria-hidden="true" style={{ position: "absolute", top: 18, left: "50%", width: "28%", height: 22, marginLeft: "-14%", borderRadius: 12, background: frame, zIndex: 2 }} />
      {screenEl}
    </div>
  );
  if (kind === "laptop") return (
    <div className={className} style={{ width: "100%", maxWidth: 760, margin: "0 auto", ...style }}>
      <div style={{ margin: "0 7%", padding: "14px 14px 18px", borderRadius: "16px 16px 0 0", background: frame, boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.08)" }}>{screenEl}</div>
      <div aria-hidden="true" style={{ height: 14, borderRadius: "0 0 14px 14px", background: `linear-gradient(${frame}, #3a3732)`, boxShadow: "0 18px 30px rgba(0,0,0,.2)" }}>
        <span style={{ display: "block", width: "16%", height: 5, margin: "0 auto", borderRadius: "0 0 6px 6px", background: "rgba(0,0,0,.35)" }} /></div>
    </div>
  );
  return (
    <div className={className} style={{ width: "100%", maxWidth: 820, margin: "0 auto", borderRadius: 10, background: frame, boxShadow: "0 24px 50px rgba(0,0,0,.18)", ...style }}>
      <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 12px" }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,.22)" }} />)}
        {url && <span style={{ flex: 1, maxWidth: 360, margin: "0 auto", padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.7)", fontSize: 12, fontFamily: "ui-monospace, Menlo, monospace", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>}
      </div>
      {screenEl}
    </div>
  );
}
