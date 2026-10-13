// RTL test page (tests/components/rtl.test.mjs): mounts any text, type or layout component into #stage with a given
// string, on a page whose direction the test sets (<html dir="rtl"> or "ltr"). The test then reads the layout.
import { createRoot, type Root } from "react-dom/client";
import type { ReactElement } from "react";
import { BlurFocus } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/blur-focus";
import { CurvedText } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/curved-text";
import { Decode } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/decode";
import { InkFill } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/ink-fill";
import { LetterRelay } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/letter-relay";
import { NeighbourMoves } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/neighbour-moves";
import { PressureType } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/pressure-type";
import { ScrollFloat } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/scroll-float";
import { SplitFlap } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/split-flap";
import { WidthSprint } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/width-sprint";
import { AsciiText } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/ascii-text";
import { Glitch } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/glitch";
import { RotatingWords } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/rotating-words";
import { ScrambleOnHover } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/scramble-on-hover";
import { ShinyText } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/shiny-text";
import { Typewriter } from "../../../skills/asfakulsiam-motomation-design/examples/components/text/typewriter";
import { BentoReveal } from "../../../skills/asfakulsiam-motomation-design/examples/components/layout/bento-reveal";
import { CurveCarousel } from "../../../skills/asfakulsiam-motomation-design/examples/components/layout/curve-carousel";
import { Dock } from "../../../skills/asfakulsiam-motomation-design/examples/components/layout/dock";
import { FlowingMenu } from "../../../skills/asfakulsiam-motomation-design/examples/components/layout/flowing-menu";
import { InfiniteCanvas } from "../../../skills/asfakulsiam-motomation-design/examples/components/layout/infinite-canvas";
import { StickyIndex } from "../../../skills/asfakulsiam-motomation-design/examples/components/layout/sticky-index";

const S = { fontSize: 40, lineHeight: 1.4, margin: 0 };
const card = (t: string, i: number) => <div data-card={i} style={{ height: 200, background: "#eee", display: "grid", placeItems: "center" }}>{t} {i + 1}</div>;
export const MOUNT: Record<string, (t: string) => ReactElement> = {
  "blur-focus": (t) => <BlurFocus text={t} style={S} />,
  "curved-text": (t) => <CurvedText text={t} spinSeconds={0} />,
  decode: (t) => <Decode text={t} replayOnHover={false} style={S} />,
  "ink-fill": (t) => <InkFill text={t} style={S} />,
  "letter-relay": (t) => <LetterRelay name={t} heroSize="64px" />,
  "neighbour-moves": (t) => <NeighbourMoves word={t} style={S} />,
  "pressure-type": (t) => <PressureType word={t} style={S} />,
  "scroll-float": (t) => <ScrollFloat text={t} as="p" style={S} />,
  "split-flap": (t) => <SplitFlap value={t} style={S} />,
  "width-sprint": (t) => <WidthSprint text={t} style={S} />,
  "ascii-text": (t) => <AsciiText text={t} cols={40} />,
  glitch: (t) => <Glitch text={t} style={S} />,
  "rotating-words": (t) => <RotatingWords before={t + " "} words={["אחת", "שתיים"]} style={S} />,
  "scramble-on-hover": (t) => <ScrambleOnHover text={t} style={S} />,
  "shiny-text": (t) => <ShinyText text={t} ink="#111" duration={1000} style={S} />,
  typewriter: (t) => <Typewriter text={t} speed={60} style={S} />,
  "bento-reveal": (t) => <BentoReveal tiles={[0, 1, 2, 3].map((i) => ({ content: card(t, i) }))} columns={4} />,
  "curve-carousel": (t) => <CurveCarousel label="Work" cardWidth={200} items={[0, 1, 2, 3].map((i) => card(t, i))} />,
  dock: (t) => <Dock items={[0, 1, 2].map((i) => ({ label: `${t} ${i + 1}`, icon: <span>{i + 1}</span>, href: "#" }))} />,
  "flowing-menu": (t) => <FlowingMenu items={[{ label: t, href: "#a", marquee: `${t} · ${t}` }, { label: t + " 2", href: "#b" }]} />,
  "infinite-canvas": (t) => <InfiniteCanvas tiles={[0, 1, 2, 3, 4, 5].map((i) => card(t, i))} cols={3} tile={120} style={{ height: 400 }} />,
  "sticky-index": (t) => <StickyIndex sections={[{ id: "a", label: t }, { id: "b", label: t + " 2" }, { id: "c", label: t + " 3" }]} />,
};

let root: Root | null = null;
declare global { interface Window { __mount: (id: string, text: string) => boolean; __clear: () => void; __ids: () => string[] } }
window.__mount = (id, text) => { const m = MOUNT[id]; const el = document.getElementById("stage"); if (!m || !el) return false; root?.unmount(); root = createRoot(el); root.render(m(text)); return true; };
window.__clear = () => { root?.unmount(); root = null; };
window.__ids = () => Object.keys(MOUNT);
