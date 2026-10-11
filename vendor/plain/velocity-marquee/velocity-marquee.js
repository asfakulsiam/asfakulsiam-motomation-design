// @motomation-variant
// id: velocity-marquee
// react: skills/asfakulsiam-motomation-design/examples/components/scroll/velocity-marquee.tsx
// markup: <div data-mm="velocity-marquee" data-items="A|B|C" [data-speed="40" data-max-skew="10" data-separator=" — "]>A — B — C</div>
// behaviour: one line of words drifts at `speed` px/s; scrolling adds the scroll velocity to the drift (and its
//   direction), and the line leans (skewX, up to max-skew) with scroll speed. Hovering or focusing pauses it; the frame
//   loop pauses off screen. The words are read once (the two moving copies are aria-hidden).
// reduced-motion: A static, wrapped row of the same words (the no-JS markup is this row too).  touch: Same as desktop.
import { reduced, frameLoop, scrollVelocity, clamp, srOnly, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const d = el.dataset, items = (d.items || el.textContent.trim()).split("|"), speed = +(d.speed ?? 40), maxSkew = +(d.maxSkew ?? 10), sep = d.separator ?? " — ";
  if (reduced()) { el.textContent = items.join(sep); el.style.display = "flex"; el.style.flexWrap = "wrap"; el.style.gap = "0 0.5em"; return () => {}; }
  const line = items.join(sep) + sep;
  el.style.overflow = "hidden"; el.style.whiteSpace = "nowrap";
  const track = document.createElement("div"); track.setAttribute("aria-hidden", "true"); track.style.cssText = "display:inline-flex;will-change:transform";
  for (let k = 0; k < 2; k++) { const s = document.createElement("span"); s.textContent = line; track.append(s); }
  const sr = srOnly(items.join(", ")); sr.style.whiteSpace = "";
  el.replaceChildren(sr, track);
  const s = { x: 0, v: 0, dir: 1, paused: false };
  const stopV = scrollVelocity((v) => { s.v = v; if (Math.abs(v) > 0.5) s.dir = Math.sign(v); });
  const stopF = frameLoop(el, (_t, dt) => { if (s.paused) return; const half = track.scrollWidth / 2; s.x -= (s.dir * speed * dt) / 1000 + s.v * 0.6; s.x = ((s.x % half) - half) % half;
    track.style.transform = `translate3d(${s.x}px,0,0) skewX(${clamp(-s.v, -maxSkew, maxSkew)}deg)`; });
  const pause = (v) => () => (s.paused = v); const evs = [["pointerenter", pause(true)], ["pointerleave", pause(false)], ["focusin", pause(true)], ["focusout", pause(false)]];
  evs.forEach(([e, f]) => el.addEventListener(e, f));
  return () => { stopV(); stopF(); evs.forEach(([e, f]) => el.removeEventListener(e, f)); };
}
export const mountVelocityMarquee = (root) => mountAll("velocity-marquee", mount, root);
mountVelocityMarquee();
