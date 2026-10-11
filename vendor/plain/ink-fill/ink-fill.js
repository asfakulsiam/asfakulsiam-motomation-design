// @motomation-variant
// id: ink-fill
// react: skills/asfakulsiam-motomation-design/examples/components/type/ink-fill.tsx
// markup: <p data-mm="ink-fill" [data-ink="var(--ink, #111)" data-muted="var(--muted, #6b6b6b)"]>The statement…</p>
// behaviour: words ink in one by one as the element scrolls from 25% to 65% of its trip through the viewport, and
//   un-ink when scrolled back (colour only, 150 ms linear per word). No-JS: the whole statement is in ink.
// reduced-motion: The whole statement is in ink from the start.  touch: Same as desktop.
import { reduced, scrollProgress, clamp, mountAll } from "../_lib/motion.js";

export function mount(el) {
  if (reduced()) return () => {};
  const ink = el.dataset.ink || "var(--ink, #111)", muted = el.dataset.muted || "var(--muted, #6b6b6b)";
  const words = el.textContent.trim().split(/\s+/); el.textContent = "";
  const spans = words.map((w, i) => { const s = document.createElement("span"); s.textContent = w + (i < words.length - 1 ? " " : ""); s.style.transition = "color 150ms linear"; s.style.color = muted; el.append(s); return s; });
  return scrollProgress(el, (p) => { const lit = Math.round(clamp((p - 0.25) / 0.4) * words.length); spans.forEach((s, i) => (s.style.color = i < lit ? ink : muted)); });
}
export const mountInkFill = (root) => mountAll("ink-fill", mount, root);
mountInkFill();
