// @motomation-variant
// id: _lib/motion
// react: skills/asfakulsiam-motomation-design/examples/components/_lib/motion.ts (+ _lib/ambient.ts for probeCapability)
// what: The same motion rules as the React helpers, for plain HTML: reduced motion, fine pointer, in-view, scroll
//   progress, scroll velocity, a frame loop that pauses off screen, the ambient capability probe, timing tokens.
// deps: none (ES module, no build step)
export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const EASE = { out: "cubic-bezier(0.22, 1, 0.36, 1)", outStrong: "cubic-bezier(0.16, 1, 0.3, 1)", inOut: "cubic-bezier(0.65, 0, 0.35, 1)", drawer: "cubic-bezier(0.32, 0.72, 0, 1)" };
export const DUR = { press: 120, ui: 180, reveal: 800, stagger: 80 };

const mq = (q) => (typeof matchMedia === "function" ? matchMedia(q) : { matches: false, addEventListener() {}, removeEventListener() {} });
/** Live media query: returns { matches, on(cb) → off } */
export function media(q) { const m = mq(q); return { get matches() { return m.matches; }, on(cb) { m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); } }; }
export const reduced = () => mq("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => mq("(hover: hover) and (pointer: fine)").matches;

/** Calls cb(true) when el enters the viewport (and cb(false) when it leaves, unless once). Returns stop(). */
export function inView(el, cb, { once = true, margin = "0px 0px -10% 0px", threshold = 0 } = {}) {
  if (typeof IntersectionObserver === "undefined") { cb(true); return () => {}; }
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { cb(true); if (once) io.disconnect(); } else if (!once) cb(false); }, { rootMargin: margin, threshold });
  io.observe(el); return () => io.disconnect();
}
/** cb(0..1) as el travels through the viewport (0: its top meets the viewport bottom, 1: its bottom meets the top). */
export function scrollProgress(el, cb) {
  let raf = 0;
  const tick = () => { raf = 0; const r = el.getBoundingClientRect(), vh = innerHeight; cb(clamp((vh - r.top) / (r.height + vh))); };
  const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
  tick(); addEventListener("scroll", ask, { passive: true }); addEventListener("resize", ask);
  return () => { removeEventListener("scroll", ask); removeEventListener("resize", ask); cancelAnimationFrame(raf); };
}
/** Smoothed scroll velocity (px per frame), every frame while it settles to 0. */
export function scrollVelocity(cb) {
  let last = scrollY, v = 0, raf = 0;
  const loop = () => { const y = scrollY; v = lerp(v, y - last, 0.2); last = y; cb(v); raf = Math.abs(v) > 0.05 ? requestAnimationFrame(loop) : 0; if (!raf) cb(0); };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  addEventListener("scroll", kick, { passive: true });
  return () => { removeEventListener("scroll", kick); cancelAnimationFrame(raf); };
}
/** A frame loop cb(t, dt) that pauses when el is off screen or the tab is hidden. */
export function frameLoop(el, cb) {
  let raf = 0, visible = true, prev = 0;
  const run = (t) => { const dt = prev ? Math.min(64, t - prev) : 16; prev = t; cb(t, dt); raf = requestAnimationFrame(run); };
  const start = () => { if (!raf && visible && !document.hidden) { prev = 0; raf = requestAnimationFrame(run); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }) : null;
  io?.observe(el); const vis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", vis); start();
  return () => { stop(); io?.disconnect(); document.removeEventListener("visibilitychange", vis); };
}
let cached = null;
/** Can this device afford a continuously animated background? Same rules as _lib/ambient.ts. */
export function probeCapability(needWebGL = false) {
  if (/[?&]ambient=force\b/.test(location.search)) return { ok: true, webgl: true, reason: "forced by ?ambient=force" };
  if (!cached) {
    const nav = navigator; let webgl = false, soft = false;
    try { const gl = document.createElement("canvas").getContext("webgl");
      if (gl) { webgl = true; const ext = gl.getExtension("WEBGL_debug_renderer_info"); const name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
        soft = /swiftshader|llvmpipe|software|basic render/i.test(name); gl.getExtension("WEBGL_lose_context")?.loseContext(); } } catch { webgl = false; }
    const reason = nav.connection?.saveData ? "save-data" : (nav.hardwareConcurrency || 4) <= 2 ? "2 or fewer CPU cores" : (nav.deviceMemory ?? 8) < 4 ? "under 4 GB memory" : "";
    cached = { ok: !reason, webgl: webgl && !soft, reason: reason || (soft ? "software WebGL" : webgl ? "" : "no WebGL") };
  }
  return needWebGL && !cached.webgl ? { ok: false, webgl: false, reason: cached.reason || "no WebGL" } : cached;
}
/** Web Animations that play while root is on screen and the tab is visible, and pause (keeping their place) otherwise. */
export function ambientAnimations(root, make) {
  const anims = make(root); let onScreen = false;
  const sync = () => anims.forEach((a) => (onScreen && !document.hidden ? a.play() : a.pause()));
  anims.forEach((a) => a.pause());
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { rootMargin: "100px" }); io.observe(root);
  document.addEventListener("visibilitychange", sync);
  return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); anims.forEach((a) => a.cancel()); };
}
/** Screen-reader-only text node (same technique as the React components). */
export function srOnly(text) { const s = document.createElement("span"); s.textContent = text; s.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap"; return s; }
/** Mount every [data-mm="id"] under root once; returns the destroy functions. */
export function mountAll(id, mount, root = document) {
  return [...root.querySelectorAll(`[data-mm="${id}"]`)].filter((el) => !el.__mm).map((el) => { el.__mm = true; return mount(el); });
}
/** class for a generated part: the Tailwind variant passes utilities in data-<part>-class; the plain variant uses BEM. */
export const partClass = (el, part, fallback) => el.dataset[`${part}Class`] ?? fallback;
