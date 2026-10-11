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
// reduced-motion: The screen stays at the top; it can still be scrolled with the wheel or keyboard.
// touch: The screen is a normal scroll area (swipe inside it).
// a11y: The frame is decoration; the screen is a focusable, labelled scroll region (tabindex 0), so keyboard users can scroll it. The hover scroll moves the content with transform and returns when the pointer leaves. Sizes come from aspect-ratio, so no layout shift.
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useFinePointer, EASE } from "../_lib/motion";

type Props = { kind?: "phone" | "browser" | "laptop"; children: ReactNode; label: string; url?: string; tall?: boolean; frame?: string; className?: string; style?: CSSProperties };
const RATIO = { phone: "9 / 19.5", browser: "16 / 10", laptop: "16 / 10" } as const;

export function DeviceMockup({ kind = "browser", children, label, url, tall = false, frame = "#1d1b18", className, style }: Props) {
  const inner = useRef<HTMLDivElement>(null), screen = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion(), fine = useFinePointer();
  const glide = (down: boolean) => { const s = screen.current, i = inner.current; if (!tall || reduce || !fine || !s || !i) return;
    const dist = Math.max(0, i.scrollHeight - s.clientHeight);
    i.style.transition = `transform ${down ? Math.min(9000, 1500 + dist * 6) : 900}ms ${down ? "linear" : EASE.out}`; i.style.transform = down ? `translateY(${-dist}px)` : "none"; };
  const screenEl = (
    <div ref={screen} role="region" aria-label={label} tabIndex={0} onPointerEnter={() => glide(true)} onPointerLeave={() => glide(false)}
      style={{ position: "relative", aspectRatio: RATIO[kind], overflow: tall && fine && !reduce ? "hidden" : "auto", background: "#fff", borderRadius: kind === "phone" ? 30 : kind === "browser" ? "0 0 10px 10px" : 4 }}>
      <div ref={inner}>{children}</div>
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
