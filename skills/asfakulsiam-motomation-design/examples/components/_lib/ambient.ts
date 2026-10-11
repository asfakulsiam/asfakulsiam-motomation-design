"use client";
// Ambient helpers for the heavy backgrounds (Tier 4–5): one capability probe, one WebGL runner, one CSS-animation runner.
// Every heavy background renders its static poster first (same box, so no layout shift), then upgrades only if the
// probe passes and motion is allowed. Both runners pause when the element is off screen or the tab is hidden.
import { useEffect, useState, type RefObject } from "react";

export const MAX_DPR = 1.5;
export type Capability = { ok: boolean; webgl: boolean; reason: string };
let cached: Capability | null = null;

/** Can this device afford a continuously animated background? Cached for the page.
 *  Says no to: Save-Data, ≤ 2 CPU cores, < 4 GB device memory, no WebGL (when needed), and software WebGL renderers
 *  (SwiftShader, llvmpipe), which draw shaders on the CPU. `?ambient=force` in the URL overrides it (testing only). */
export function probeCapability(needWebGL: boolean): Capability {
  if (typeof window === "undefined") return { ok: false, webgl: false, reason: "server" };
  if (/[?&]ambient=force\b/.test(location.search)) return { ok: true, webgl: true, reason: "forced by ?ambient=force" };
  if (!cached) {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    let webgl = false, soft = false;
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      if (gl) { webgl = true; const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
        soft = /swiftshader|llvmpipe|software|basic render/i.test(name); gl.getExtension("WEBGL_lose_context")?.loseContext(); }
    } catch { webgl = false; }
    const reason = nav.connection?.saveData ? "save-data" : (nav.hardwareConcurrency || 4) <= 2 ? "2 or fewer CPU cores" : (nav.deviceMemory ?? 8) < 4 ? "under 4 GB memory" : "";
    cached = { ok: !reason, webgl: webgl && !soft, reason: reason || (soft ? "software WebGL" : webgl ? "" : "no WebGL") };
  }
  const c = cached;
  return needWebGL && !c.webgl ? { ok: false, webgl: false, reason: c.reason || "no WebGL" } : c;
}

/** null on the server and first render (poster shows), then the probe result. */
export function useCapability(needWebGL: boolean): Capability | null {
  const [cap, setCap] = useState<Capability | null>(null);
  useEffect(() => setCap(probeCapability(needWebGL)), [needWebGL]);
  return cap;
}

/** Runs while the element is on screen and the tab is visible; calls start() and the cleanup it returns on each change. */
export function useWhileVisible<T extends Element>(ref: RefObject<T | null>, enabled: boolean, start: () => () => void) {
  useEffect(() => {
    const el = ref.current; if (!enabled || !el) return;
    let stop: (() => void) | null = null, onScreen = false;
    const sync = () => { const run = onScreen && !document.hidden; if (run && !stop) stop = start(); else if (!run && stop) { stop(); stop = null; } };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { rootMargin: "100px" }); io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); stop?.(); };
  }, [ref, enabled]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** CSS-side runner: Web Animations that play while visible and pause (keeping their place) otherwise. */
export function useAmbientAnimations<T extends HTMLElement>(ref: RefObject<T | null>, enabled: boolean, make: (root: T) => Animation[]) {
  useEffect(() => {
    const root = ref.current; if (!enabled || !root) return;
    const anims = make(root); anims.forEach((a) => a.pause());
    let onScreen = false;
    const sync = () => anims.forEach((a) => (onScreen && !document.hidden ? a.play() : a.pause()));
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { rootMargin: "100px" }); io.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); anims.forEach((a) => a.cancel()); };
  }, [ref, enabled]); // eslint-disable-line react-hooks/exhaustive-deps
}

export type GLScene = { draw: (t: number) => void; resize?: (w: number, h: number, dpr: number) => void; dispose: () => void };
/** WebGL runner: DPR clamped to MAX_DPR (half on coarse pointers), resizes with the box, pauses off screen / hidden,
 *  draws one still frame under reduced motion, and calls onFail on context loss or a scene that throws. */
export function useGL(ref: RefObject<HTMLCanvasElement | null>, enabled: boolean, opts: { still: boolean; coarse: boolean; onFail: (why: string) => void },
  setup: (gl: WebGLRenderingContext) => GLScene) {
  useEffect(() => {
    const c = ref.current; if (!enabled || !c) return;
    const gl = c.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true }); if (!gl) { opts.onFail("no context"); return; }
    let scene: GLScene; try { scene = setup(gl); } catch (e) { opts.onFail(String(e)); return; }
    const lost = (e: Event) => { e.preventDefault(); opts.onFail("context lost"); }; c.addEventListener("webglcontextlost", lost);
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1) * (opts.coarse ? 0.66 : 1);
    const size = () => { c.width = Math.max(1, Math.round(c.clientWidth * dpr)); c.height = Math.max(1, Math.round(c.clientHeight * dpr)); gl.viewport(0, 0, c.width, c.height); scene.resize?.(c.width, c.height, dpr); if (opts.still) scene.draw(8); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    let raf = 0, onScreen = false; const t0 = performance.now();
    const frame = (t: number) => { scene.draw((t - t0) / 1000 + 8); raf = onScreen && !document.hidden ? requestAnimationFrame(frame) : 0; };
    const sync = () => { if (opts.still) return; if (onScreen && !document.hidden && !raf) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }); io.observe(c);
    document.addEventListener("visibilitychange", sync);
    scene.draw(8);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", sync); c.removeEventListener("webglcontextlost", lost); scene.dispose(); };
  }, [ref, enabled, opts.still, opts.coarse]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Compile + link a program, throwing with the info log on failure. */
export function program(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader"); return s; };
  const p = gl.createProgram()!; gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link"); return p;
}
export const rgb = (h: string): [number, number, number] => { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
