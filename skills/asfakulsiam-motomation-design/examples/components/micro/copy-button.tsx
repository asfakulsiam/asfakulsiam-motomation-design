"use client";
// @motomation-component
// id: copy-button
// name: Copy Confirm
// family: micro
// tier: 1
// deps: react
// what: A copy button whose icon morphs to a tick and whose label says "Copied" for two seconds, then returns.
// use-when: Install commands, email addresses, codes and coupon strings.
// avoid-when: Content the user should read rather than paste.
// reduced-motion: The tick swaps in without the morph.
// touch: Same as desktop.
// a11y: A real button; aria-live announces "Copied"; falls back to selecting the text when the clipboard API is unavailable.
import { useState, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";

type Props = { text: string; label?: string; className?: string; style?: CSSProperties };

export function CopyButton({ text, label = "Copy", className, style }: Props) {
  const reduce = useReducedMotion();
  const [ok, setOk] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand?.("copy"); t.remove(); } setOk(true); setTimeout(() => setOk(false), 2000); };
  return (
    <button type="button" onClick={copy} className={className} style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "inherit", padding: "8px 14px", borderRadius: 8, border: "1px solid currentColor", background: "transparent", color: "inherit", cursor: "pointer", ...style }}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={ok ? "M3 8.5l3 3 7-7" : "M5 5h8v8H5zM3 11V3h8"} style={{ transition: reduce ? "none" : "d 200ms ease-out" }} />
      </svg>
      <span>{ok ? "Copied" : label}</span>
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{ok ? "Copied" : ""}</span>
    </button>
  );
}
