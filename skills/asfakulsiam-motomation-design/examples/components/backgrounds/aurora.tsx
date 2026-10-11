"use client";
// @motomation-component
// id: aurora
// name: Aurora
// family: backgrounds
// tier: 4
// deps: react
// what: Curtains of northern light hang across a night sky: a sharp lower hem, fading upward in vertical rays, folding slowly. A small WebGL shader draws it; a CSS poster stands in everywhere else.
// use-when: The subject is the far north, night, cold, observation, polar travel or a planetarium: behind a hero or a single quiet section.
// avoid-when: As a generic "AI glow" background; behind body copy; light themes; pages that already run WebGL.
// reduced-motion: One still frame of the curtains (WebGL), or the poster.
// touch: Renders at two-thirds resolution on coarse pointers.
// a11y: Decorative (aria-hidden). Capability probe first (Save-Data, ≤ 2 cores, < 4 GB, no or software WebGL → poster only); DPR ≤ 1.5; paused off screen and in hidden tabs; poster and canvas fill the same absolute box, so no layout shift. Keep `sky` dark: text on top is checked against the sky, and the curtains stay in the upper half.
import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";
import { useCapability, useGL, program, rgb } from "../_lib/ambient";

type Props = { sky?: string; low?: string; high?: string; speed?: number; className?: string; style?: CSSProperties };
const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision mediump float;uniform vec2 r;uniform float t;uniform vec3 a,b,sky;
float h(float x){return fract(sin(x*127.1)*43758.5453);}
float n(float x){float i=floor(x),f=fract(x);return mix(h(i),h(i+1.),f*f*(3.-2.*f));}
void main(){vec2 uv=gl_FragCoord.xy/r;float x=uv.x*r.x/r.y;vec3 col=sky*(1.-uv.y*.35);
for(int i=0;i<3;i++){float fi=float(i);
float hem=.48+.13*fi+.07*sin(x*1.1+t*.17+fi*2.1)+.05*n(x*2.6+t*.25+fi*9.);
float d=uv.y-hem;float c=smoothstep(-.015,.0,d)*exp(-d*(5.+fi*2.))*(.55+.45*n(x*14.+t*.6+fi*5.));
c*=.65+.35*sin(x*70.+n(x*3.+t*.4)*8.);
col+=mix(a,b,clamp(d*2.6,0.,1.))*c*(.6-.15*fi);}
gl_FragColor=vec4(col,1.);}`;

export function Aurora({ sky = "#050a16", low = "#3fd18f", high = "#7a5cff", speed = 1, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion(), fine = useFinePointer();
  const cap = useCapability(true);
  const [failed, setFailed] = useState(false);
  const live = !!cap?.ok && !failed;
  useGL(ref, live, { still: reduce, coarse: !fine, onFail: () => setFailed(true) }, (gl) => {
    const prog = program(gl, VS, FS); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (k: string) => gl.getUniformLocation(prog, k);
    gl.uniform3fv(U("a"), rgb(low)); gl.uniform3fv(U("b"), rgb(high)); gl.uniform3fv(U("sky"), rgb(sky));
    return { resize: (w, h) => gl.uniform2f(U("r"), w, h), draw: (t) => { gl.uniform1f(U("t"), t * speed); gl.drawArrays(gl.TRIANGLES, 0, 3); }, dispose: () => { gl.deleteBuffer(buf); gl.deleteProgram(prog); } };
  });
  // poster: the same sky with two soft curtains, painted once by CSS
  const poster = `radial-gradient(120% 38% at 30% 52%, ${low}55, transparent 70%), radial-gradient(90% 30% at 72% 40%, ${high}44, transparent 70%), linear-gradient(to top, ${sky}, ${sky} 40%, #0b1428)`;
  return (
    <span aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: poster, ...style }}>
      {live && <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} />}
    </span>
  );
}
