"use client";
// @motomation-component
// id: liquid-field
// name: Liquid Field
// family: backgrounds
// tier: 4
// deps: react
// what: Slow flowing colour like ink in water or silk in wind, drawn by a tiny WebGL fragment shader with a CSS gradient fallback.
// use-when: The material really is liquid, fabric, light or weather; behind a hero with one line of type.
// avoid-when: As generic "AI gradient" decoration; behind body text; on pages that already use WebGL.
// reduced-motion: A designed still: a marbled sheet. Combed bands of the same three colours, like marbled paper keeping the trace of moving ink; no canvas is mounted.
// touch: Runs at half resolution on coarse pointers.
// a11y: Decorative canvas (aria-hidden); paused off screen and in hidden tabs; falls back to a CSS gradient when WebGL is unavailable, loses its context, or renders wrong colours (it reads back one pixel to check). Keep all three colours dark (or all light) so text on top keeps its contrast everywhere.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";

type Props = { colors?: [string, string, string]; speed?: number; className?: string; style?: CSSProperties };
const hex = (h: string) => { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
const FRAG = `precision mediump float;uniform vec2 r;uniform float t;uniform vec3 a,b,c;
float n(vec2 p){return sin(p.x*1.7+t*.6)*sin(p.y*1.3-t*.4)+.5*sin((p.x+p.y)*2.3+t*.8);}
void main(){vec2 p=gl_FragCoord.xy/r.y*2.;for(int i=0;i<4;i++){p+=.35*vec2(n(p.yx+float(i)),n(p+float(i)*1.7));}
float k=.5+.5*sin(p.x+p.y);vec3 col=mix(mix(a,b,k),c,.5+.5*sin(p.y*.7-t*.3));gl_FragColor=vec4(col,1.);}`;

// Reduced motion: a marbled sheet. The flow is set down as combed bands of the same three colours, the way marbled
// paper keeps the trace of moving ink: a still with its own pattern, not the shader stopped on one frame.
function LiquidStill({ colors }: { colors: string[] }) {
  const band = (y: number, a: number, p: number) => { let d = `M0 ${y}`; for (let x = 0; x <= 1600; x += 100) d += `L${x} ${(y + a * Math.sin(x / 260 + p) + a * 0.4 * Math.sin(x / 90 + p * 2)).toFixed(1)}`; return d + "V1000H0Z"; };
  const combs = Array.from({ length: 18 }, (_, i) => band(60 + i * 52, 34, i * 0.4).replace(/V1000H0Z$/, "")).join("");
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
      <rect width="1600" height="1000" fill={colors[0]} />
      {[[180, 70, 0.3, 1], [360, 90, 1.7, 2], [560, 80, 3.1, 1], [740, 60, 4.4, 2], [880, 50, 5.6, 0]].map(([y, a, p, c], i) => <path key={i} d={band(y, a, p)} fill={colors[c]} opacity=".9" />)}
      <path d={combs} fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth="1.2" />
    </svg>
  );
}

export function LiquidField({ colors = ["#0f1a2e", "#7a2416", "#24405e"], speed = 0.25, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const c = ref.current; if (!c || failed || reduce) return; const gl = c.getContext("webgl", { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true }); if (!gl) { setFailed(true); return; }
    const lost = (e: Event) => { e.preventDefault(); setFailed(true); }; c.addEventListener("webglcontextlost", lost);
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const vs = sh(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!; gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFailed(true); return; } gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n); (["a", "b", "c"] as const).forEach((k, i) => gl.uniform3fv(U(k), hex(colors[i])));
    const scale = (fine ? 1 : 0.5) * Math.min(1.5, devicePixelRatio || 1);
    const size = () => { c.width = c.clientWidth * scale; c.height = c.clientHeight * scale; gl.viewport(0, 0, c.width, c.height); gl.uniform2f(U("r"), c.width, c.height); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    let raf = 0, visible = true; const t0 = performance.now();
    const frame = (t: number) => { gl.uniform1f(U("t"), ((t - t0) / 1000) * speed * 4); gl.drawArrays(gl.TRIANGLES, 0, 3); raf = !reduce && visible && !document.hidden ? requestAnimationFrame(frame) : 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !reduce) raf = requestAnimationFrame(frame); }); io.observe(c);
    const vis = () => { if (!document.hidden && visible && !raf && !reduce) raf = requestAnimationFrame(frame); }; document.addEventListener("visibilitychange", vis);
    frame(t0 + 4000);
    // sanity check: the centre pixel must be no lighter than the lightest colour given (software GL can render pure white)
    const px = new Uint8Array(4); gl.readPixels(c.width >> 1, c.height >> 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const maxL = Math.max(...colors.map((h) => { const [r, g, b] = hex(h); return lum(r, g, b); }));
    if (px[3] < 250 || lum(px[0] / 255, px[1] / 255, px[2] / 255) > maxL + 0.12) setFailed(true);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", vis); c.removeEventListener("webglcontextlost", lost);
      // free this run's resources but keep the context: the effect re-runs on prop changes and getContext returns the same one
      gl.deleteBuffer(buf); gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs); };
  }, [colors, speed, reduce, fine, failed]);
  return (
    <span aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]} 55%, ${colors[2]})`, ...style }}>
      {reduce ? <LiquidStill colors={colors} /> : !failed && <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} />}
    </span>
  );
}
