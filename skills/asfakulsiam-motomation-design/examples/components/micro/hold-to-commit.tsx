"use client";
// @motomation-component
// id: hold-to-commit
// name: Hold to Commit
// family: micro
// tier: 2
// deps: react
// what: An important action fills while you press and hold, and only confirms when the fill completes; letting go early drains it back.
// use-when: Irreversible or weighty actions: delete, publish, donate, sign.
// avoid-when: Everyday actions; anything time-critical; as the only way to confirm (keyboard users get Enter-to-hold too).
// reduced-motion: The fill still shows progress (it's information) but with a linear, unanimated drain.
// touch: Press and hold works with touch; long-press callouts are suppressed.
// a11y: A real button; Space or Enter held works like a press; the label says "Hold to …"; aria-live announces completion. A click that was not a hold (screen readers, voice control and switch access synthesize these) arms a confirmation instead: the label becomes "Press again to confirm", it is announced, and a second activation within 6 s commits; double-clicks don't count. Pending frames are cancelled on unmount, and a hold stops if the window loses focus or the tab is hidden.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { label: string; doneLabel?: string; confirmLabel?: string; holdMs?: number; onCommit: () => void; className?: string; style?: CSSProperties };

const ARM_MS = 6000; // how long an armed confirmation stays open
const GAP_MS = 400; // a confirming click must come at least this long after the arming one (not a double-click)
const TAP_MS = 250; // a press shorter than this is a tap, not a hold

export function HoldToCommit({ label, doneLabel = "Done", confirmLabel = "Press again to confirm", holdMs = 1200, onCommit, className, style }: Props) {
  const fill = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [armed, setArmed] = useState(false);
  // engaged: a pointer or key hold began for this activation, so the click that follows it is not an assistive-tech click
  const st = useRef({ p: 0, raf: 0, holding: false, last: 0, engaged: false, downAt: 0, armedAt: 0, timer: 0 });
  const loop = (t: number) => {
    const s = st.current; const dt = s.last ? t - s.last : 16; s.last = t;
    s.p = Math.max(0, Math.min(1, s.p + (s.holding ? dt / holdMs : -dt / (reduce ? holdMs : 300))));
    if (fill.current) fill.current.style.transform = `scaleX(${s.p})`;
    if (s.p >= 1 && s.holding) { s.holding = false; setDone(true); onCommit(); s.raf = 0; return; }
    s.raf = s.p > 0 || s.holding ? requestAnimationFrame(loop) : 0;
  };
  const start = () => { if (done) return; const s = st.current; s.engaged = true; s.downAt = performance.now(); s.holding = true; s.last = 0; if (!s.raf) s.raf = requestAnimationFrame(loop); };
  const stop = () => { const s = st.current; s.holding = false; s.last = 0; if (!s.raf && s.p > 0) s.raf = requestAnimationFrame(loop); };
  const disarm = () => { const s = st.current; clearTimeout(s.timer); s.armedAt = 0; setArmed(false); };
  // Assistive tech activates with a bare click (no pointerdown/keydown hold first). First click arms, second commits.
  const click = (e: { detail: number }) => {
    const s = st.current; if (done) return;
    const now = performance.now();
    // the click that ends a real hold is not an activation; a tap shorter than TAP_MS (VoiceOver's double-tap, a quick click) is
    if (s.engaged) { s.engaged = false; if (now - s.downAt >= TAP_MS) return; }
    if (e.detail > 1) return; // the second half of a double-click is never a confirmation
    if (s.armedAt && now - s.armedAt >= GAP_MS) { disarm(); s.p = 1; if (fill.current) fill.current.style.transform = "scaleX(1)"; setDone(true); onCommit(); return; }
    if (!s.armedAt) { s.armedAt = now; setArmed(true); clearTimeout(s.timer); s.timer = window.setTimeout(disarm, ARM_MS); }
  };
  const stopRef = useRef(stop); stopRef.current = stop; // the listeners below always call the latest stop()
  useEffect(() => {
    const s = st.current;
    const away = () => { if (s.holding) stopRef.current(); };
    const hidden = () => { if (document.hidden) away(); };
    window.addEventListener("blur", away); document.addEventListener("visibilitychange", hidden);
    return () => { cancelAnimationFrame(s.raf); s.raf = 0; s.holding = false; clearTimeout(s.timer);
      window.removeEventListener("blur", away); document.removeEventListener("visibilitychange", hidden); };
  }, []);
  return (
    <button type="button" className={className} disabled={done}
      onClick={click} onPointerDown={start} onPointerUp={stop} onPointerLeave={() => { stop(); st.current.engaged = false; }} onPointerCancel={() => { stop(); st.current.engaged = false; }} onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } }} onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); stop(); st.current.engaged = false; } }}
      style={{ position: "relative", overflow: "hidden", font: "inherit", padding: "14px 26px", borderRadius: 999, border: "1px solid var(--ink, #111)", background: "var(--ground, #fff)", color: "var(--ink, #111)", cursor: "pointer", userSelect: "none", WebkitTouchCallout: "none", ...style }}>
      <span ref={fill} aria-hidden="true" style={{ position: "absolute", inset: 0, background: "var(--accent, #e0442b)", transformOrigin: "0 50%", transform: "scaleX(0)" }} />
      <span style={{ position: "relative" }}>{done ? doneLabel : armed ? confirmLabel : label}</span>
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{done ? doneLabel : armed ? confirmLabel : ""}</span>
    </button>
  );
}
