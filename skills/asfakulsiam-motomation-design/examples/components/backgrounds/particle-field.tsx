"use client";
// @motomation-component
// id: particle-field
// name: Particle Field
// family: backgrounds
// tier: 4
// deps: react
// what: Dust drifting through a beam of light: soft particles at three depths, the near ones larger and brighter, all moving slowly sideways and bobbing. WebGL points; a CSS poster of scattered motes stands in elsewhere.
// use-when: Cinema, projection, workshops, old rooms, archives, snowfall or pollen: a quiet atmosphere behind a dark hero.
// avoid-when: "Tech" or "data" decoration; as a starfield warp; behind text-heavy sections; on pages that already run WebGL. For a cursor-reactive grid use Dot Field.
// reduced-motion: A designed still: a star chart. The motes keep their density and depth, and a few are joined into constellations; no canvas is mounted.
// touch: 60% of the particles at two-thirds resolution.
// a11y: Decorative (aria-hidden). Capability probe (Save-Data, ≤ 2 cores, < 4 GB, no or software WebGL → poster); DPR ≤ 1.5; paused off screen and in hidden tabs; fills its absolute box, so no layout shift. Particles stay faint (alpha ≤ 0.9 on the nearest), so text contrast is checked against the ground.
import { useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";
import { useCapability, useGL, program, rgb } from "../_lib/ambient";

type Props = { count?: number; color?: string; ground?: string; speed?: number; className?: string; style?: CSSProperties };
const VS = `attribute vec3 s;uniform float t,ps;varying float va;
void main(){float z=s.z;float x=fract(s.x+t*.010*(.35+z))*2.2-1.1;float y=s.y*2.2-1.1+.035*sin(t*.33+s.x*31.);
va=mix(.2,.9,z*z)*(.7+.3*sin(t*.7+s.y*47.));gl_Position=vec4(x,y,0.,1.);gl_PointSize=ps*mix(1.,3.6,z*z);}`;
const FS = `precision mediump float;varying float va;uniform vec3 c;
void main(){float a=va*smoothstep(.5,.08,length(gl_PointCoord-.5));gl_FragColor=vec4(c*a,a);}`;

// Reduced motion: the drift stops and becomes a chart. Motes keep their density and depth (size, brightness), and a
// few are joined into constellations, so the still has a subject of its own instead of looking paused.
function FieldStill({ color, ground }: { color: string; ground: string }) {
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const motes = Array.from({ length: 140 }, () => { const z = rnd(); return [rnd() * 1600, rnd() * 1000, 0.8 + z * z * 3, 0.2 + z * 0.7]; });
  const figs = [[[230, 180], [330, 140], [420, 210], [520, 170], [600, 260]], [[1080, 120], [1170, 220], [1290, 190], [1360, 300], [1250, 360], [1170, 220]], [[1290, 690], [1380, 760], [1490, 720]]];
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
      <rect width="1600" height="1000" fill={ground} />
      <path d="M-100 1000L700 0H1000L200 1000Z" fill={color} fillOpacity=".05" />
      {motes.map(([x, y, r, o], i) => <circle key={i} cx={x} cy={y} r={r} fill={color} fillOpacity={o} />)}
      {figs.map((f, i) => <g key={i}><polyline points={f.join(" ")} fill="none" stroke={color} strokeOpacity=".35" strokeWidth="1" />{f.map(([x, y], j) => <circle key={j} cx={x} cy={y} r="3.4" fill={color} />)}</g>)}
    </svg>
  );
}

export function ParticleField({ count = 1400, color = "#f3e3c3", ground = "#120f0b", speed = 1, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion(), fine = useFinePointer();
  const cap = useCapability(true);
  const [failed, setFailed] = useState(false);
  const live = !!cap?.ok && !failed && !reduce;
  useGL(ref, live, { still: reduce, coarse: !fine, onFail: () => setFailed(true) }, (gl) => {
    const prog = program(gl, VS, FS); gl.useProgram(prog);
    const N = fine ? count : Math.round(count * 0.6), d = new Float32Array(N * 3);
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < N * 3; i++) d[i] = rnd();
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW);
    const S = gl.getAttribLocation(prog, "s"); gl.enableVertexAttribArray(S); gl.vertexAttribPointer(S, 3, gl.FLOAT, false, 0, 0);
    const U = (k: string) => gl.getUniformLocation(prog, k); gl.uniform3fv(U("c"), rgb(color));
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    return { resize: (_w, _h, dpr) => gl.uniform1f(U("ps"), 2.2 * dpr), draw: (t) => { gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(U("t"), t * speed); gl.drawArrays(gl.POINTS, 0, N); },
      dispose: () => { gl.deleteBuffer(buf); gl.deleteProgram(prog); } };
  });
  // poster: a few dozen motes as stacked radial gradients over the ground and a faint beam
  const motes = Array.from({ length: 28 }, (_, i) => { const x = (i * 37) % 100, y = (i * 61) % 100, r = 1 + (i % 4); return `radial-gradient(${r}px ${r}px at ${x}% ${y}%, ${color}${i % 3 ? "66" : "aa"}, transparent)`; }).join(", ");
  return (
    <span aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", background: `${live ? "" : motes + ", "}linear-gradient(115deg, transparent 20%, ${color}12 45%, transparent 70%), ${ground}`, ...style }}>
      {reduce ? <FieldStill color={color} ground={ground} /> : live && <canvas ref={ref} style={{ display: "block", width: "100%", height: "100%" }} />}
    </span>
  );
}
