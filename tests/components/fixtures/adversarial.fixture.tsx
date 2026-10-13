// Adversarial-input test page (tests/components/adversarial.test.mjs): every text and type component in
// data/components.csv, each with an unsplit reference in the same typography. The nine per-letter cases come from the
// grapheme fixture; the other seven (which split by word, layer copies, or set text on a path) are added here, each
// reference copying the component's own wrapper styles so that only splitting, garbling or lost glyphs show up as
// differing pixels.
import { createRoot, type Root } from "react-dom/client";
import type { CSSProperties, ReactElement } from "react";
import { CASES as LETTER_CASES } from "./graphemes.fixture";
import { BlurFocus } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/blur-focus";
import { CurvedText } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/curved-text";
import { InkFill } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/ink-fill";
import { WidthSprint } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/width-sprint";
import { Glitch } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/glitch";
import { RotatingWords } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/rotating-words";
import { ShinyText } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/shiny-text";

const F = "'Hind Siliguri', 'Noto Sans Arabic', 'Noto Color Emoji', sans-serif";
const T: CSSProperties = { fontFamily: F, fontSize: 40, lineHeight: 1.6, fontWeight: 400, margin: 0 };
type Case = { split: (t: string) => ReactElement; plain: (t: string) => ReactElement; sel: string };

export const CASES: Record<string, Case> = {
  ...LETTER_CASES,
  // words are inline-block spans (white-space: pre) so they blur one by one; the reference is the same paragraph unsplit
  "blur-focus": { sel: "#stage > p", split: (t) => <BlurFocus text={t} style={T} />, plain: (t) => <p style={T}>{t}</p> },
  // text on a circle: the reference is the same path with the same string; only lost or reordered glyphs differ
  "curved-text": { sel: "#stage svg", split: (t) => <CurvedText text={t} spinSeconds={0} style={{ fontFamily: F }} />,
    plain: (t) => <span style={{ position: "relative", display: "inline-grid", placeItems: "center", width: 160, height: 160, fontFamily: F }}>
      <svg role="img" aria-label={t} viewBox="0 0 160 160" width={160} height={160} style={{ position: "absolute", inset: 0 }}>
        <defs><path id="ref-c" d="M 80,80 m -66,0 a 66,66 0 1,1 132,0 a 66,66 0 1,1 -132,0" /></defs>
        <text style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", fill: "currentColor" }}><textPath href="#ref-c" textLength={2 * Math.PI * 66 - 6}>{t}</textPath></text>
      </svg></span> },
  // words are spans that take the ink colour as the reader passes; under reduced motion all words are ink
  "ink-fill": { sel: "#stage > p", split: (t) => <InkFill text={t} ink="#111" muted="#111" style={T} />, plain: (t) => <p style={{ ...T, color: "#111" }}>{t}</p> },
  // never split: the width axis moves with scroll speed; at rest it is the base width
  "width-sprint": { sel: "#stage > h2", split: (t) => <WidthSprint text={t} style={T} />, plain: (t) => <h2 style={{ fontVariationSettings: `"wdth" 90`, whiteSpace: "nowrap", maxWidth: "100%", ...T }}>{t}</h2> },
  // two aria-hidden colour copies sit over the text and are invisible at rest
  glitch: { sel: "#stage > span", split: (t) => <Glitch text={t} style={T} />, plain: (t) => <span style={{ position: "relative", display: "inline-block", ...T }}>{t}</span> },
  // one word in the rotating slot (the slot clips at 1.2em and does not wrap): the reference is the same slot
  "rotating-words": { sel: "#stage > p > span[aria-hidden]", split: (t) => <RotatingWords words={[t]} style={T} />,
    plain: (t) => <p style={{ position: "relative", ...T }}><span aria-hidden="true"><span style={{ display: "inline-grid", verticalAlign: "bottom", overflow: "hidden", height: "1.2em", lineHeight: 1.2 }}>
      <span style={{ gridArea: "1 / 1", whiteSpace: "nowrap" }}><span>{t}</span></span></span></span></p> },
  // a gradient passes once over the text on demand; at rest it is plain ink
  "shiny-text": { sel: "#stage > span", split: (t) => <ShinyText text={t} ink="#111" style={T} />, plain: (t) => <span style={{ color: "#111", ...T }}>{t}</span> },
};

// Negative control (not a component): the naive per-letter split P0 removed, .split("") into inline-block spans. The test
// requires this to FAIL on Bangla, emoji and Arabic, so a comparison that has gone too lenient fails the run.
export const CONTROL: Case = { sel: "#stage > span", split: (t) => <span style={{ ...T, display: "inline-flex", whiteSpace: "pre" }}>{t.split("").map((c, i) => <span key={i} style={{ display: "inline-block" }}>{c}</span>)}</span>,
  plain: (t) => <span style={{ ...T, display: "inline-flex", whiteSpace: "pre" }}>{t}</span> };

let root: Root | null = null;
declare global { interface Window { __render: (id: string, mode: "split" | "plain", text: string) => string | null; __clear: () => void; __ids: () => string[] } }
window.__render = (id, mode, text) => {
  const c = id === "control-naive-split" ? CONTROL : CASES[id]; const el = document.getElementById("stage"); if (!c || !el) return null;
  root?.unmount(); root = createRoot(el); root.render(c[mode](text)); return c.sel;
};
window.__clear = () => { root?.unmount(); root = null; };
window.__ids = () => Object.keys(CASES);
