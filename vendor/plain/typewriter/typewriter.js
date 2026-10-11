// @motomation-variant
// id: typewriter
// react: skills/asfakulsiam-motomation-design/examples/components/text/typewriter.tsx
// markup: <p data-mm="typewriter" [data-speed="38" data-delay="200" data-caret="true" data-caret-class]>Dear reader,</p>
// behaviour: types itself once when it enters the viewport, with a seeded unevenness (spaces and punctuation take
//   longer); a caret bar rides on the last typed character and fades 600 ms after the end. Every character holds its
//   final place from the start (opacity only), so the line never reflows. The full text is screen-reader text throughout.
// reduced-motion: The whole line is there from the start, with no caret.  touch: Same as desktop (starts when in view).
import { inView, reduced, srOnly, partClass, mountAll } from "../_lib/motion.js";

export function mount(el) {
  if (reduced()) return () => {};
  const d = el.dataset, text = el.textContent.trim(), speed = +(d.speed ?? 38), delay = +(d.delay ?? 200), caret = d.caret !== "false";
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  const typed = document.createElement("span"); typed.setAttribute("aria-hidden", "true");
  const chars = text.split("").map((ch) => { const s = document.createElement("span"); s.textContent = ch; s.style.opacity = "0"; s.style.position = "relative"; typed.append(s); return s; });
  const bar = document.createElement("span"); bar.className = partClass(el, "caret", "mm-typewriter__caret");
  el.textContent = ""; el.append(srOnly(text), typed);
  if (caret) { const lead = document.createElement("span"); lead.style.position = "relative"; lead.append(bar); typed.prepend(lead); bar.style.left = "0"; }
  let timer = 0, i = 0;
  const stop = inView(el, () => {
    const next = () => {
      i++; chars[i - 1].style.opacity = "1";
      if (caret) { chars[i - 1].append(bar); bar.style.left = "100%"; }
      if (i < text.length) timer = setTimeout(next, speed * (/[\s,.;:!?]/.test(text[i - 1]) ? 2.6 : 0.7 + ((i * 7) % 5) / 8));
      else if (caret) { bar.style.transition = "opacity 400ms 600ms"; requestAnimationFrame(() => (bar.style.opacity = "0")); }
    };
    timer = setTimeout(next, delay);
  });
  return () => { stop(); clearTimeout(timer); };
}
export const mountTypewriter = (root) => mountAll("typewriter", mount, root);
mountTypewriter();
