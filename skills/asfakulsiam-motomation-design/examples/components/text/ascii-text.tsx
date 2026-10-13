"use client";
// @motomation-component
// id: ascii-text
// name: ASCII Text
// family: text
// tier: 2
// deps: react
// what: A word drawn as a grid of characters, sampled from the word's own letterforms; it settles out of character noise when it enters the screen.
// use-when: The concept is code, print terminals, telegrams, early computing or textile grids; one short word at display size.
// avoid-when: Anything longer than about 12 characters; small sizes (it becomes noise); as the only copy of important text.
// reduced-motion: The finished character drawing, with no noise.
// touch: Same as desktop (settles when in view).
// a11y: The element has the word as its accessible name (role="img" + aria-label); the character grid is aria-hidden. The grid is sized from its container width, so it never overflows.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useDirection, useInView, useReducedMotion, graphemes } from "../_lib/motion";

type Props = { text: string; cols?: number; ramp?: string; fontFamily?: string; fontWeight?: number; className?: string; style?: CSSProperties };

/** Sample the word into rows of characters. Each character cell is 0.6 wide by 1 tall, so the word is drawn on a canvas
 *  of cols×6 by rows×10 pixels and every 6×10 block is averaged into one cell: darker blocks take denser characters. */
function sample(text: string, cols: number, ramp: string, family: string, weight: number, rtl = false): string[] {
  if (typeof document === "undefined") return [];
  const c = document.createElement("canvas"), g = c.getContext("2d", { willReadFrequently: true }); if (!g) return [];
  g.direction = rtl ? "rtl" : "ltr"; g.font = `${weight} 100px ${family}`; const w100 = Math.max(1, g.measureText(text).width);
  const W = cols * 6, size = (W * 0.94) / (w100 / 100), rows = Math.max(3, Math.ceil((size * 1.2) / 10)), H = rows * 10;
  c.width = W; c.height = H; g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); g.fillStyle = "#000"; g.font = `${weight} ${size}px ${family}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, W / 2, H / 2);
  const d = g.getImageData(0, 0, W, H).data, out: string[] = [], R = graphemes(ramp);
  for (let y = 0; y < rows; y++) { let r = ""; for (let x = 0; x < cols; x++) { let sum = 0;
      for (let yy = 0; yy < 10; yy++) for (let xx = 0; xx < 6; xx++) sum += d[((y * 10 + yy) * W + x * 6 + xx) * 4];
      const ink = 1 - sum / (60 * 255); r += R[Math.min(R.length - 1, Math.floor(ink * R.length))]; } out.push(r); }
  // drop empty rows at the top and bottom so the drawing sits tight in its box
  while (out.length && !out[0].trim()) out.shift(); while (out.length && !out[out.length - 1].trim()) out.pop();
  return out;
}

export function AsciiText({ text, cols = 90, ramp = " .:-=+*#%@", fontFamily = "'Arial Black', 'Helvetica Neue', Arial, sans-serif", fontWeight = 900, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const dir = useDirection(ref);
  const rows = useMemo(() => (ready ? sample(text, cols, ramp, fontFamily, fontWeight, dir === "rtl") : []), [ready, text, cols, ramp, fontFamily, fontWeight, dir]);
  const [k, setK] = useState(0); // 0 = noise, 1 = settled
  useEffect(() => {
    if (reduce || !seen || !rows.length) return;
    let raf = 0; const t0 = performance.now();
    const f = (t: number) => { const p = Math.min(1, (t - t0) / 1100); setK(p); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
  }, [seen, reduce, rows]);
  const p = reduce ? 1 : k;
  const rampG = graphemes(ramp);
  // noise: each cell holds its final glyph once a row-skewed front passes it, from the reading start (right on RTL)
  const out = p >= 1 ? rows : rows.map((r, y) => graphemes(r).map((ch, x) => (((dir === "rtl" ? cols - 1 - x : x) / cols) + (y % 3) * 0.04 < p * 1.15 ? ch : ch === " " ? " " : rampG[(x * 7 + y * 13 + Math.floor(p * 40)) % rampG.length])).join(""));
  return (
    <div ref={ref} role="img" aria-label={text} className={className} style={{ containerType: "inline-size", width: "100%", ...style }}>
      <pre aria-hidden="true" dir="ltr" style={{ margin: 0, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: `calc(100cqw / ${cols} / 0.6)`, lineHeight: 1, letterSpacing: 0, whiteSpace: "pre", overflow: "hidden" }}>
        {out.join("\n") || text}
      </pre>
    </div>
  );
}
