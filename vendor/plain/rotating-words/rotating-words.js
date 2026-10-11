// @motomation-variant
// id: rotating-words
// react: skills/asfakulsiam-motomation-design/examples/components/text/rotating-words.tsx
// markup: <p data-mm="rotating-words" data-words="grocers|pharmacies|tea stalls" [data-before="… for " data-after="." data-interval="2200" data-cycles="2" data-word-class]>… for grocers.</p>
// behaviour: the last word turns through `words` every `interval` in a one-line slot (each word slides up 110% and
//   fades), stops by itself after `cycles` rounds, pauses on hover and focus, and pauses off screen (WCAG 2.2.2).
//   Screen readers get the sentence once with every word as a plain list ("grocers, pharmacies and tea stalls").
// reduced-motion: The first word, still.  touch: Same as desktop; it pauses while touched.
import { inView, reduced, srOnly, partClass, EASE, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const d = el.dataset, words = (d.words || "").split("|"), before = d.before ?? "", after = d.after ?? "", interval = +(d.interval ?? 2200), cycles = +(d.cycles ?? 2), still = reduced();
  const list = words.length > 1 ? `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}` : words[0];
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  const vis = document.createElement("span"); vis.setAttribute("aria-hidden", "true"); vis.append(before);
  const slot = document.createElement("span"); slot.style.cssText = "display:inline-grid;vertical-align:bottom;overflow:hidden;height:1.2em;line-height:1.2";
  const spans = words.map((w) => { const s = document.createElement("span"); s.style.cssText = `grid-area:1/1;white-space:nowrap;transition:${still ? "none" : `transform 600ms ${EASE.outStrong}, opacity 300ms`}`; const ws = document.createElement("span"); ws.className = partClass(el, "word", "mm-rotating-words__word"); ws.textContent = w; s.append(ws, after); slot.append(s); return s; });
  vis.append(slot); el.replaceChildren(srOnly(`${before}${list}${after}`), vis);
  let i = 0, steps = 0, t = 0, on = false, held = false;
  const place = () => spans.forEach((s, k) => { s.style.transform = `translateY(${(k - i) * 110}%)`; s.style.opacity = k === i ? "1" : "0"; });
  const plan = () => { clearTimeout(t); if (still || !on || held || words.length < 2 || steps >= words.length * cycles) return; t = setTimeout(() => { steps++; i = (i + 1) % words.length; place(); plan(); }, interval); };
  place();
  const hold = (v) => () => { held = v; plan(); };
  const evs = [["pointerenter", hold(true)], ["pointerleave", hold(false)], ["focusin", hold(true)], ["focusout", hold(false)]]; evs.forEach(([e, f]) => el.addEventListener(e, f));
  const stop = inView(el, (v) => { on = v; plan(); }, { once: false });
  return () => { stop(); clearTimeout(t); evs.forEach(([e, f]) => el.removeEventListener(e, f)); };
}
export const mountRotatingWords = (root) => mountAll("rotating-words", mount, root);
mountRotatingWords();
