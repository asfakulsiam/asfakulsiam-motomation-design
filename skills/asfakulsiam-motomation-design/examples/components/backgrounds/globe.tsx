"use client";
// @motomation-component
// id: globe
// name: Globe
// family: backgrounds
// tier: 4
// deps: react
// what: A sphere of evenly spaced dots turns slowly, the far side faint, with a few brighter markers for real places (lat/lon). WebGL points; a CSS dotted disc stands in everywhere else.
// use-when: The business is genuinely about places on Earth (shipping, a diaspora, offices in named cities, a travel route), and the markers are real.
// avoid-when: As a generic "global" or "scale" signal; with invented markers; on pages that already run WebGL; at small sizes (the dots turn to noise).
// reduced-motion: The globe, still, facing the first marker.
// touch: Same, at two-thirds resolution.
// a11y: Decorative (aria-hidden): list the places in text nearby too. Capability probe (Save-Data, ≤ 2 cores, < 4 GB, no or software WebGL → poster); DPR ≤ 1.5; paused off screen and in hidden tabs; fills its absolute box, so no layout shift.
import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";
import { useCapability, useGL, program, rgb } from "../_lib/ambient";

type Marker = { lat: number; lon: number };
type Props = { markers?: Marker[]; dots?: number; dot?: string; mark?: string; ground?: string; speed?: number; className?: string; style?: CSSProperties };
const VS = `attribute vec3 p;attribute float m;uniform float t,tilt,ps;uniform vec2 sc;varying float vz,vm;
void main(){float c=cos(t),s=sin(t);vec3 q=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);float ct=cos(tilt),st=sin(tilt);q=vec3(q.x,ct*q.y-st*q.z,st*q.y+ct*q.z);
vz=q.z;vm=m;gl_Position=vec4(q.x*sc.x,q.y*sc.y,-q.z*.5,1.);gl_PointSize=ps*(m>.5?3.4:1.)*(q.z>0.?1.:.75);}`;
const FS = `precision mediump float;varying float vz,vm;uniform vec3 dc,mc;
void main(){vec2 d=gl_PointCoord-.5;if(dot(d,d)>.25)discard;float f=smoothstep(-.25,.35,vz);
vec3 col=vm>.5?mc:dc;float a=vm>.5?mix(.35,1.,f):mix(.12,.85,f);gl_FragColor=vec4(col*a,a);}`;
const xyz = (lat: number, lon: number) => { const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180; return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]; };

export function Globe({ markers = [], dots = 1800, dot = "#cfd8e6", mark = "#ffb547", ground = "#0a1020", speed = 0.08, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion(), fine = useFinePointer();
  const cap = useCapability(true);
  const [failed, setFailed] = useState(false);
  const live = !!cap?.ok && !failed;
  const face = markers[0] ? -(markers[0].lon * Math.PI) / 180 : 0;
  useGL(ref, live, { still: reduce, coarse: !fine, onFail: () => setFailed(true) }, (gl) => {
    const prog = program(gl, VS, FS); gl.useProgram(prog);
    const N = fine ? dots : Math.round(dots * 0.6), data: number[] = [];
    for (let i = 0; i < N; i++) { const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), f = i * 2.399963; data.push(Math.cos(f) * r, y, Math.sin(f) * r, 0); }
    for (const m of markers) data.push(...xyz(m.lat, m.lon), 1);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    const P = gl.getAttribLocation(prog, "p"), M = gl.getAttribLocation(prog, "m");
    gl.enableVertexAttribArray(P); gl.vertexAttribPointer(P, 3, gl.FLOAT, false, 16, 0); gl.enableVertexAttribArray(M); gl.vertexAttribPointer(M, 1, gl.FLOAT, false, 16, 12);
    const U = (k: string) => gl.getUniformLocation(prog, k);
    gl.uniform3fv(U("dc"), rgb(dot)); gl.uniform3fv(U("mc"), rgb(mark)); gl.uniform1f(U("tilt"), 0.38);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    const count = data.length / 4;
    return {
      resize: (w, h, dpr) => { const asp = w / h; gl.uniform2f(U("sc"), 0.84 * Math.min(1, 1 / asp), 0.84 * Math.min(1, asp)); gl.uniform1f(U("ps"), Math.max(1.5, Math.min(w, h) / 260) * (dpr > 1 ? 1.2 : 1)); },
      draw: (t) => { gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(U("t"), face + (reduce ? 0 : (t - 8) * speed)); gl.drawArrays(gl.POINTS, 0, count); },
      dispose: () => { gl.deleteBuffer(buf); gl.deleteProgram(prog); },
    };
  });
  return (
    <span aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: ground, display: "grid", placeItems: "center", ...style }}>
      {live ? <canvas ref={ref} style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%" }} />
        : <span style={{ height: "84%", maxWidth: "84%", aspectRatio: "1", borderRadius: "50%", opacity: 0.8,
            background: `radial-gradient(circle at 38% 34%, transparent 0 40%, ${ground} 92%), radial-gradient(${dot} 1px, transparent 1.6px) 0 0 / 11px 11px` }} />}
    </span>
  );
}
