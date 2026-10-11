// @motomation-variant
// id: scramble-on-hover
// react: skills/asfakulsiam-motomation-design/examples/components/text/scramble-on-hover.tsx
// markup: <span data-mm="scramble-on-hover" [data-glyphs="!<>-_\/[]{}=+*^?#" data-radius="2"]>Ayesha Siddiqua</span>
// behaviour: letters near a fine pointer scramble (heat falls off over `radius` letters and cools 0.06 per frame); tap
//   or keyboard focus scrambles the whole word once, settling left to right. Each letter keeps a fixed slot (0.62em,
//   spaces 0.3em) so the word never reflows; the word itself is screen-reader text.
// reduced-motion: Plain text; nothing scrambles.  touch: Tap scrambles the whole word once, settling left to right.
import { reduced, finePointer, srOnly, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const text = el.textContent.trim(), glyphs = el.dataset.glyphs || "!<>-_\\/[]{}=+*^?#", radius = +(el.dataset.radius ?? 2);
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  if (getComputedStyle(el).display === "inline") el.style.display = "inline-block";
  el.style.fontVariantNumeric = "tabular-nums";
  const vis = document.createElement("span"); vis.setAttribute("aria-hidden", "true"); vis.style.display = "inline-flex";
  const slots = text.split("").map((c) => { const s = document.createElement("span"); s.style.cssText = `display:inline-block;width:${c === " " ? "0.3em" : "0.62em"};text-align:center`; s.textContent = c; vis.append(s); return s; });
  el.replaceChildren(srOnly(text), vis);
  let heat = slots.map(() => 0), raf = 0, pointer = null;
  const tick = () => { let live = false;
    for (let i = 0; i < heat.length; i++) { const target = pointer === null ? 0 : Math.max(0, 1 - Math.abs(i - pointer) / (radius + 0.5)); heat[i] = Math.max(target, heat[i] - 0.06); if (heat[i] > 0.02) live = true; }
    slots.forEach((s, i) => (s.textContent = text[i] === " " || heat[i] < 0.25 ? text[i] : glyphs[(Math.random() * glyphs.length) | 0]));
    raf = live || pointer !== null ? requestAnimationFrame(tick) : 0; };
  const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const move = (e) => { if (reduced() || !finePointer()) return; const r = el.getBoundingClientRect(); pointer = ((e.clientX - r.left) / r.width) * text.length - 0.5; start(); };
  const leave = () => { pointer = null; };
  const sweep = () => { if (reduced()) return; heat = heat.map((_, i) => 1 + i * 0.06); pointer = null; start(); };
  const down = (e) => { if (e.pointerType !== "mouse") sweep(); };
  const evs = [["pointermove", move], ["pointerleave", leave], ["pointerdown", down], ["focus", sweep]]; evs.forEach(([e, f]) => el.addEventListener(e, f));
  return () => { cancelAnimationFrame(raf); evs.forEach(([e, f]) => el.removeEventListener(e, f)); };
}
export const mountScrambleOnHover = (root) => mountAll("scramble-on-hover", mount, root);
mountScrambleOnHover();
