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
// a11y: A real button; Space or Enter held works like a press; the label says "Hold to …"; aria-live announces completion.
import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { label: string; doneLabel?: string; holdMs?: number; onCommit: () => void; className?: string; style?: CSSProperties };

export function HoldToCommit({ label, doneLabel = "Done", holdMs = 1200, onCommit, className, style }: Props) {
  const fill = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const st = useRef({ p: 0, raf: 0, holding: false, last: 0 });
  const loop = (t: number) => {
    const s = st.current; const dt = s.last ? t - s.last : 16; s.last = t;
    s.p = Math.max(0, Math.min(1, s.p + (s.holding ? dt / holdMs : -dt / (reduce ? holdMs : 300))));
    if (fill.current) fill.current.style.transform = `scaleX(${s.p})`;
    if (s.p >= 1 && s.holding) { s.holding = false; setDone(true); onCommit(); s.raf = 0; return; }
    s.raf = s.p > 0 || s.holding ? requestAnimationFrame(loop) : 0;
  };
  const start = () => { if (done) return; const s = st.current; s.holding = true; s.last = 0; if (!s.raf) s.raf = requestAnimationFrame(loop); };
  const stop = () => { const s = st.current; s.holding = false; s.last = 0; if (!s.raf && s.p > 0) s.raf = requestAnimationFrame(loop); };
  return (
    <button type="button" className={className} disabled={done}
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } }} onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") stop(); }}
      style={{ position: "relative", overflow: "hidden", font: "inherit", padding: "14px 26px", borderRadius: 999, border: "1px solid var(--ink, #111)", background: "var(--ground, #fff)", color: "var(--ink, #111)", cursor: "pointer", userSelect: "none", WebkitTouchCallout: "none", ...style }}>
      <span ref={fill} aria-hidden="true" style={{ position: "absolute", inset: 0, background: "var(--accent, #e0442b)", transformOrigin: "0 50%", transform: "scaleX(0)" }} />
      <span style={{ position: "relative" }}>{done ? doneLabel : label}</span>
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{done ? doneLabel : ""}</span>
    </button>
  );
}
