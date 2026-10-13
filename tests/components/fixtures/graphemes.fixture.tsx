// Grapheme test page (tests/components/graphemes.test.mjs): renders one per-letter component, or the same text unsplit
// with the same typography, into #stage, so the test can screenshot both and compare pixels.
import { createRoot, type Root } from "react-dom/client";
import type { CSSProperties, ReactElement } from "react";
import { Decode } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/decode";
import { LetterRelay } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/letter-relay";
import { NeighbourMoves } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/neighbour-moves";
import { PressureType } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/pressure-type";
import { ScrollFloat } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/scroll-float";
import { SplitFlap } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/split-flap";
import { AsciiText } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/ascii-text";
import { ScrambleOnHover } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/scramble-on-hover";
import { Typewriter } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/typewriter";

const F = "'Hind Siliguri', 'Noto Sans Arabic', 'Noto Color Emoji', sans-serif";
const T: CSSProperties = { fontFamily: F, fontSize: 40, lineHeight: 1.6, fontWeight: 400 };
const VAR = `"wdth" 75, "wght" 300`;
// each case: the component (target selector = the element whose pixels are the text) and the unsplit reference
type Case = { split: (t: string) => ReactElement; plain: (t: string) => ReactElement; sel: string };
export const CASES: Record<string, Case> = {
  decode: { sel: "#stage > span", split: (t) => <Decode text={t} replayOnHover={false} style={T} />, plain: (t) => <span style={{ ...T, whiteSpace: "pre" }}>{t}</span> },
  "letter-relay": { sel: "#stage h1 > span", split: (t) => <LetterRelay name={t} heroSize="40px" />,
    plain: (t) => <div><div style={{ minHeight: "100svh", display: "grid", alignContent: "end", padding: "0 24px 8vh" }}><h1 style={{ fontSize: "40px", lineHeight: 0.9, margin: 0 }}><span style={{ display: "inline-block", whiteSpace: "nowrap" }}>{t}</span></h1></div></div> },
  "neighbour-moves": { sel: "#stage > span", split: (t) => <NeighbourMoves word={t} style={T} />, plain: (t) => <span style={{ ...T, display: "inline-flex", whiteSpace: "pre" }}>{t}</span> },
  "pressure-type": { sel: "#stage > span", split: (t) => <PressureType word={t} style={T} />, plain: (t) => <span style={{ ...T, display: "inline-flex", whiteSpace: "pre", fontVariationSettings: VAR }}>{t}</span> },
  "scroll-float": { sel: "#stage > p", split: (t) => <ScrollFloat text={t} as="p" style={{ ...T, margin: 0 }} />, plain: (t) => <p style={{ ...T, margin: 0, overflow: "hidden" }}>{t}</p> },
  "split-flap": { sel: "#stage > span", split: (t) => <SplitFlap value={t} style={{ ...T, gap: 0, fontFamily: F }} cellStyle={{ background: "transparent", color: "inherit", boxShadow: "none", padding: 0, minWidth: 0, borderRadius: 0 }} />,
    plain: (t) => <span style={{ ...T, display: "inline-flex", whiteSpace: "pre" }}>{t.toUpperCase()}</span> },
  // AsciiText draws the whole word on a canvas (never split); its per-cell noise pass must settle to that same drawing
  "ascii-text": { sel: "#stage pre", split: (t) => <AsciiText text={t} cols={60} fontFamily={F} />, plain: (t) => <AsciiText key="ref" text={t} cols={60} fontFamily={F} /> },
  "scramble-on-hover": { sel: "#stage > span > span[aria-hidden]", split: (t) => <ScrambleOnHover text={t} style={T} />, plain: (t) => <span style={{ ...T, position: "relative", display: "inline-block" }}><span aria-hidden="true" style={{ display: "inline-flex", whiteSpace: "pre" }}>{t}</span></span> },
  typewriter: { sel: "#stage > p > span[aria-hidden]", split: (t) => <Typewriter text={t} caret={false} style={{ ...T, margin: 0 }} />, plain: (t) => <p style={{ ...T, margin: 0, position: "relative" }}><span aria-hidden="true">{t}</span></p> },
};

let root: Root | null = null;
declare global { interface Window { __render: (id: string, mode: "split" | "plain", text: string) => string | null; __clear: () => void; __flap: (from: string, to: string) => void } }
window.__render = (id, mode, text) => {
  const c = CASES[id]; const el = document.getElementById("stage"); if (!c || !el) return null;
  root?.unmount(); root = createRoot(el); root.render(c[mode](text)); return c.sel;
};
window.__clear = () => { root?.unmount(); root = null; };
// split-flap settle check: mount with `from`, then change the value to `to`
window.__flap = (from, to) => {
  const el = document.getElementById("stage"); if (!el) return;
  root?.unmount(); root = createRoot(el); root.render(<SplitFlap value={from} />);
  setTimeout(() => root?.render(<SplitFlap value={to} />), 100);
};
