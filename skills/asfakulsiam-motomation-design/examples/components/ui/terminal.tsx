"use client";
// @motomation-component
// id: terminal
// name: Terminal
// family: ui
// tier: 1
// deps: react
// what: A terminal window replays a short session when it scrolls into view: each command types itself after the prompt, its output appears at once, then the next command starts.
// use-when: The product really is used from a command line (a CLI, a dev tool, an install step), and the session shown is real and copy-pasteable.
// avoid-when: As "techy" decoration for a product with no CLI; sessions longer than about 8 lines; fake output.
// reduced-motion: The whole session is shown at once.
// touch: Same as desktop (plays when in view).
// a11y: The full session is in the DOM from the first render (hidden lines are opacity 0, which screen readers still read) inside a <pre> with an accessible label, and every line holds its final slot (no layout shift). Commands can be copied from the first frame. Plays once.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "../_lib/motion";

type Line = { cmd?: string; out?: string };
const caret: CSSProperties = { position: "absolute", left: 0, top: "0.15em", width: "0.55em", height: "1.1em", background: "#e9e2d2", opacity: 0.8 };
type Props = { lines: Line[]; title?: string; prompt?: string; speed?: number; className?: string; style?: CSSProperties };

export function Terminal({ lines, title = "zsh", prompt = "$", speed = 34, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const reduce = useReducedMotion();
  // progress = [line index, characters typed in that line's command]
  const [at, setAt] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    if (reduce || !seen) return;
    const [li, ch] = at; if (li >= lines.length) return;
    const cmd = lines[li].cmd ?? "";
    const t = window.setTimeout(() => setAt(ch < cmd.length ? [li, ch + 1] : [li + 1, 0]), ch === 0 ? 420 : ch < cmd.length ? speed : 260);
    return () => window.clearTimeout(t);
  }, [at, seen, reduce, lines, speed]);
  const [li, ch] = reduce ? [lines.length, 0] : at;
  return (
    <div ref={ref} className={className} style={{ borderRadius: 12, overflow: "hidden", background: "#16140f", color: "#e9e2d2", boxShadow: "0 20px 50px rgba(0,0,0,.25)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "#211e18" }}>
        {["#e0665a", "#e0b25a", "#7cc07a"].map((c) => <span key={c} aria-hidden="true" style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
        <span style={{ marginLeft: 8, fontSize: 12, color: "#a59d8f", fontFamily: "ui-monospace, Menlo, monospace" }}>{title}</span>
      </div>
      <pre aria-label={`Terminal session: ${title}`} style={{ margin: 0, padding: "16px 18px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13.5, lineHeight: 1.6, whiteSpace: "pre-wrap", overflowX: "auto" }}>
        {lines.map((l, i) => {
          const typed = i < li ? (l.cmd ?? "").length : i === li ? ch : 0, active = i === li && !reduce;
          return (
            <span key={i} style={{ display: "block" }}>
              {l.cmd !== undefined && (
                <span style={{ display: "block", opacity: i <= li ? 1 : 0 }}>
                  <span style={{ color: "#c9a15b" }}>{prompt} </span>
                  {/* the caret rides on the last typed (visible) character, or on a zero-width anchor before the first */}
                  {active && typed === 0 && <span style={{ position: "relative" }}><span aria-hidden="true" style={caret} /></span>}
                  {(l.cmd ?? "").split("").map((c, k) => (
                    <span key={k} style={{ position: "relative", opacity: k < typed ? 1 : 0 }}>
                      {c}
                      {active && k === typed - 1 && <span aria-hidden="true" style={{ ...caret, left: "100%" }} />}
                    </span>
                  ))}
                </span>
              )}
              {l.out !== undefined && <span style={{ display: "block", color: "#a8b7a0", opacity: i < li ? 1 : 0 }}>{l.out}</span>}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
