// Motomation component gallery: every component in examples/components, live, on one page.
// Built into a single self-contained index.html by scripts/build-gallery.mjs (esbuild). Open index.html directly.
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

import { BlurFocus } from "../components/type/blur-focus";
import { CurvedText } from "../components/type/curved-text";
import { Decode } from "../components/type/decode";
import { InkFill } from "../components/type/ink-fill";
import { LetterRelay } from "../components/type/letter-relay";
import { NeighbourMoves } from "../components/type/neighbour-moves";
import { PressureType } from "../components/type/pressure-type";
import { ScrollFloat } from "../components/type/scroll-float";
import { SplitFlap } from "../components/type/split-flap";
import { WidthSprint } from "../components/type/width-sprint";
import { AsciiText } from "../components/text/ascii-text";
import { Glitch } from "../components/text/glitch";
import { RotatingWords } from "../components/text/rotating-words";
import { ScrambleOnHover } from "../components/text/scramble-on-hover";
import { ShinyText } from "../components/text/shiny-text";
import { Typewriter } from "../components/text/typewriter";
import { Aperture } from "../components/scroll/aperture";
import { DarkroomDevelop } from "../components/scroll/darkroom-develop";
import { HorizontalReel } from "../components/scroll/horizontal-reel";
import { ReadingRail } from "../components/scroll/reading-rail";
import { StackedDeck } from "../components/scroll/stacked-deck";
import { Thread } from "../components/scroll/thread";
import { VelocityMarquee } from "../components/scroll/velocity-marquee";
import { ImageTrail } from "../components/cursor/image-trail";
import { Lens } from "../components/cursor/lens";
import { PixelWake } from "../components/cursor/pixel-wake";
import { SeismographLine } from "../components/cursor/seismograph-line";
import { TargetCursor } from "../components/cursor/target-cursor";
import { TiltCard } from "../components/cursor/tilt-card";
import { ContourLines } from "../components/backgrounds/contour-lines";
import { DotField } from "../components/backgrounds/dot-field";
import { Grain } from "../components/backgrounds/grain";
import { Halftone } from "../components/backgrounds/halftone";
import { LightSweep } from "../components/backgrounds/light-sweep";
import { LiquidField } from "../components/backgrounds/liquid-field";
import { BentoReveal } from "../components/layout/bento-reveal";
import { CurveCarousel } from "../components/layout/curve-carousel";
import { Dock } from "../components/layout/dock";
import { FlowingMenu } from "../components/layout/flowing-menu";
import { InfiniteCanvas } from "../components/layout/infinite-canvas";
import { StickyIndex } from "../components/layout/sticky-index";
import { BrandSelection } from "../components/micro/brand-selection";
import { ClickSpark } from "../components/micro/click-spark";
import { CopyButton } from "../components/micro/copy-button";
import { CountUp } from "../components/micro/count-up";
import { HoldToCommit } from "../components/micro/hold-to-commit";
import { RememberedList } from "../components/micro/remembered-list";
import { SquishSwitch } from "../components/micro/squish-switch";
import { StickerScatter } from "../components/micro/sticker-scatter";

declare const CATALOGUE: { id: string; name: string; family: string; tier: string; what: string; use_when: string; avoid_when: string; reduced_motion: string; file: string }[];
const RAW = "https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main";

// Inline artwork, so the page needs no image URLs. Each is a small SVG scene.
const svg = (body: string, w = 800, h = 520) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`)}`;
const COURTYARD = svg(`<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d9a4"/><stop offset="1" stop-color="#e9b77a"/></linearGradient></defs><rect width="800" height="520" fill="url(#s)"/><circle cx="610" cy="120" r="54" fill="#fff4d6"/><rect x="0" y="300" width="800" height="220" fill="#8c3b22"/><rect x="120" y="190" width="560" height="240" fill="#a6472a"/><rect x="330" y="260" width="140" height="170" fill="#2a1a12"/><rect x="170" y="240" width="90" height="70" fill="#f6e7c8"/><rect x="540" y="240" width="90" height="70" fill="#f6e7c8"/><path d="M0 430h800v90H0z" fill="#5a2716"/>`);
const SKETCH = svg(`<rect width="800" height="520" fill="#f4f1ea"/><g fill="none" stroke="#1c1b19" stroke-width="2"><circle cx="610" cy="120" r="54" stroke-dasharray="6 6"/><rect x="120" y="190" width="560" height="240"/><rect x="330" y="260" width="140" height="170"/><rect x="170" y="240" width="90" height="70"/><rect x="540" y="240" width="90" height="70"/><path d="M0 430h800M60 470h680" stroke-dasharray="10 8"/></g><text x="40" y="60" font-family="monospace" font-size="20" fill="#1c1b19">PLAN · SOUTH ELEVATION</text>`);
const tile = (hue: number, label: string) => svg(`<rect width="400" height="400" fill="hsl(${hue} 45% 82%)"/><circle cx="${120 + (hue % 160)}" cy="${140 + (hue % 90)}" r="${70 + (hue % 50)}" fill="hsl(${hue} 55% 42%)"/><rect x="40" y="300" width="${120 + (hue % 200)}" height="20" fill="hsl(${hue} 40% 22%)"/><text x="40" y="370" font-family="monospace" font-size="24" fill="hsl(${hue} 40% 18%)">${label}</text>`, 400, 400);
const TILES = Array.from({ length: 15 }, (_, i) => tile((i * 47) % 360, `No. ${String(i + 1).padStart(2, "0")}`));

const FAMILY_TITLES: Record<string, string> = { type: "Type", text: "Text effects", scroll: "Scroll", cursor: "Cursor", backgrounds: "Backgrounds", layout: "Layout and galleries", ui: "Buttons, cards and UI", micro: "Micro-interactions" };
const box: CSSProperties = { position: "relative", minHeight: 260, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)", padding: 28, overflow: "hidden", display: "grid", alignContent: "center" };
const display = (size = "clamp(2.4rem, 6vw, 5rem)"): CSSProperties => ({ fontFamily: "var(--font-display)", fontSize: size, lineHeight: 0.95, margin: 0, letterSpacing: "-0.02em" });

function TargetDemo() {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <SquishSwitch label="Turn on the target cursor for this page" onChange={setOn} />
      {on && <TargetCursor />}
      <button type="button" className="pill">A button to aim at</button>
      <a href="#target-cursor" className="pill">A link to aim at</a>
    </div>
  );
}
function SplitFlapDemo() {
  const times = ["DHAKA 06:40", "SYLHET 07:15", "CHATTOGRAM 08:05"]; const [i, setI] = useState(0);
  return <div style={{ display: "grid", gap: 18, justifyItems: "start" }}><SplitFlap value={times[i]} style={{ fontSize: "clamp(1rem, 3vw, 1.75rem)" }} /><button type="button" className="pill" onClick={() => setI((i + 1) % times.length)}>Next departure</button></div>;
}
function HoldDemo() {
  const [n, setN] = useState(0);
  return <div style={{ display: "grid", gap: 12, justifyItems: "start" }}><HoldToCommit label="Hold to publish" doneLabel="Published" onCommit={() => setN(n + 1)} /><p className="hint">Press and hold (mouse, touch, Space or Enter).</p></div>;
}

const DEMOS: Record<string, () => ReactNode> = {
  "blur-focus": () => <div style={box}><BlurFocus as="h3" text="Clarity arrives one word at a time." style={display("clamp(1.8rem, 4.5vw, 3.4rem)")} /></div>,
  "curved-text": () => <div style={{ ...box, placeItems: "center" }}><CurvedText text="Hand thrown in Dhaka · since 2011 · " size={180}><span style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>✶</span></CurvedText></div>,
  decode: () => <div style={box}><p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "clamp(1.1rem, 3vw, 2rem)" }}><Decode text="ACCESS GRANTED" /></p><p className="hint">Hover to replay.</p></div>,
  "ink-fill": () => <div style={box}><InkFill as="p" text="We build fewer houses, slower, with brick from the river and light from the courtyard, and we stay until the family moves in." style={{ ...display("clamp(1.5rem, 3.4vw, 2.6rem)"), lineHeight: 1.15 }} /></div>,
  "letter-relay": () => <div style={box}><p style={{ margin: 0 }}>Live at the top of this page: the gallery's title travels into the header as you scroll the first screen.</p></div>,
  "neighbour-moves": () => <div style={box}><p style={{ ...display(), margin: 0 }}><NeighbourMoves word="Rafiq" /></p><p className="hint">Hover or tap each letter.</p></div>,
  "pressure-type": () => <div style={box}><p style={{ ...display("clamp(3rem, 10vw, 7rem)"), fontFamily: "var(--font-flex)" }}><PressureType word="Elastic" /></p><p className="hint">Move the cursor across the word.</p></div>,
  "scroll-float": () => <div style={box}><ScrollFloat text="Float up, settle down." style={display()} /></div>,
  "split-flap": () => <div style={box}><SplitFlapDemo /></div>,
  "width-sprint": () => <div style={box}><WidthSprint text="Faster" style={{ ...display("clamp(3rem, 12vw, 8rem)"), fontFamily: "var(--font-flex)" }} /><p className="hint">Scroll quickly past this card.</p></div>,
  typewriter: () => <div style={box}><Typewriter as="p" text="Dear Rumana, the river was higher than we thought." style={{ ...display("clamp(1.4rem, 3.4vw, 2.4rem)"), fontFamily: "var(--font-mono)", lineHeight: 1.2 }} /></div>,
  glitch: () => <div style={box}><p style={{ ...display("clamp(2.6rem, 9vw, 6rem)"), margin: 0 }}><Glitch text="NO SIGNAL" /></p><p className="hint">Hover or tap the words.</p></div>,
  "ascii-text": () => <div style={box}><AsciiText text="TELEX" cols={88} /></div>,
  "rotating-words": () => <div style={box}><RotatingWords as="p" before="We build houses for " words={["grandparents", "monsoons", "slow mornings"]} after="." style={{ ...display("clamp(1.6rem, 4vw, 3rem)"), lineHeight: 1.2 }} wordStyle={{ fontStyle: "italic", color: "var(--accent)" }} /></div>,
  "shiny-text": () => <div style={{ ...box, background: "#1d1a16", placeItems: "center" }}><ShinyText as="p" text="ESTD 1893 · BRASS & IRON" ink="#c9a15b" shine="#fff3cf" style={{ fontFamily: "var(--font-mono)", letterSpacing: ".18em", fontSize: 18, margin: 0 }} /><p className="hint" style={{ color: "#c9c3b8" }}>Hover or tap to catch the light again.</p></div>,
  "scramble-on-hover": () => <div style={box}><p style={{ ...display("clamp(2rem, 7vw, 4.6rem)"), fontFamily: "var(--font-mono)", margin: 0 }}><ScrambleOnHover text="CIPHER ROOM" /></p><p className="hint">Run the cursor along the words, or tap them.</p></div>,
  aperture: () => <div style={{ display: "grid", gap: 14 }}><p style={{ ...display("clamp(1.6rem, 4vw, 3rem)") }}>Step inside.</p><Aperture style={{ borderRadius: 14, overflow: "hidden" }}><img src={COURTYARD} alt="Courtyard house seen through an opening" style={{ width: "100%", display: "block" }} /></Aperture></div>,
  "darkroom-develop": () => <div style={{ ...box, padding: 0 }}><DarkroomDevelop src={COURTYARD} alt="Illustration of a brick courtyard house under a low sun" width={800} height={520} style={{ width: "100%" }} /></div>,
  "horizontal-reel": () => <HorizontalReel frames={TILES.slice(0, 6).map((t, i) => <figure key={i} style={{ margin: 0 }}><img src={t} alt={`Frame ${i + 1}, abstract study`} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 10, display: "block" }} /><figcaption className="hint">Frame {i + 1}</figcaption></figure>)} frameWidth="min(62vw, 560px)" />,
  "reading-rail": () => <div style={box}><p style={{ margin: 0 }}>Live at the very top edge of this page: the rail fills as you read the gallery.</p></div>,
  "stacked-deck": () => <StackedDeck top={90} cards={[{ title: "Site visit", body: <p>We stand where the house will stand, at three times of day.</p> }, { title: "Sketch", body: <p>One page, one idea, drawn by hand before any software opens.</p> }, { title: "Brick sample", body: <p>Five bricks from five kilns, left in the rain for a week.</p> }, { title: "Build", body: <p>We stay on site until the family moves in.</p> }]} />,
  thread: () => <Thread style={{ ...box, minHeight: 520, alignContent: "space-around" }}>{["Morning: the site", "Noon: the sketch", "Evening: the first wall"].map((t, i) => <p key={i} style={{ margin: 0, paddingLeft: i % 2 ? "55%" : 0, fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 3vw, 2rem)" }}>{t}</p>)}</Thread>,
  "velocity-marquee": () => <div style={{ ...box, minHeight: 160 }}><VelocityMarquee items={["14–15 February", "Chattogram", "18 artists", "Two stages", "৳1,500 a day"]} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 6vw, 4rem)" }} /><p className="hint">Scroll fast, then scroll up.</p></div>,
  "image-trail": () => <ImageTrail images={TILES.slice(0, 8).map((src, i) => ({ src, alt: `Study ${i + 1}` }))} size={150} style={{ ...box, minHeight: 340 }}><p style={{ ...display("clamp(1.6rem, 4vw, 3rem)"), pointerEvents: "none" }}>Move through the archive.</p></ImageTrail>,
  lens: () => <Lens base={<img src={COURTYARD} alt="Finished courtyard house" style={{ width: "100%", display: "block" }} />} reveal={<img src={SKETCH} alt="The same house as a line drawing" style={{ width: "100%", display: "block" }} />} toggleLabel="Show the drawing" />,
  "pixel-wake": () => <div style={{ ...box, minHeight: 300, background: "#101114", color: "#f4f1ea" }}><PixelWake cell={20} /><p style={{ ...display(), color: "#f4f1ea", position: "relative" }}>Insert coin.</p></div>,
  "seismograph-line": () => <div style={box}><p style={{ margin: 0 }}>Above the line</p><SeismographLine /><p style={{ margin: 0 }}>Below the line. Run the cursor across it.</p></div>,
  "target-cursor": () => <div style={box}><TargetDemo /></div>,
  "tilt-card": () => <div style={{ ...box, placeItems: "center" }}><TiltCard style={{ width: "min(320px, 100%)", aspectRatio: "1.6", borderRadius: 16, background: "linear-gradient(135deg, #1c2a4a, #e0442b)", color: "#fff", padding: 22, display: "grid", alignContent: "space-between" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".12em" }}>DAY PASS · 14 FEB</span><span style={{ fontFamily: "var(--font-display)", fontSize: 30 }}>Chattogram Sound</span></TiltCard></div>,
  "contour-lines": () => <div style={{ ...box, minHeight: 300 }}><ContourLines seed={11} /><p style={{ ...display(), position: "relative" }}>Above sea level.</p></div>,
  "dot-field": () => <div style={{ ...box, minHeight: 300 }}><DotField /><p style={{ ...display(), position: "relative", pointerEvents: "none" }}>Structure.</p></div>,
  grain: () => <div style={{ ...box, minHeight: 260, background: "#c9b48f" }}><Grain opacity={0.12} animate /><p style={{ ...display(), position: "relative", color: "#1c1b19" }}>Printed matter.</p></div>,
  halftone: () => <div style={{ ...box, padding: 0 }}><Halftone src={COURTYARD} alt="Courtyard house printed as halftone dots" cell={7} style={{ width: "100%" }} /></div>,
  "light-sweep": () => <div style={{ ...box, minHeight: 260, background: "#2a1a12", color: "#f6e7c8" }}><LightSweep /><p style={{ ...display(), position: "relative", color: "#f6e7c8" }}>Afternoon.</p></div>,
  "liquid-field": () => <div style={{ ...box, minHeight: 320 }}><LiquidField /><p style={{ ...display(), position: "relative", color: "#f4f1ea" }}>Silk, moving.</p></div>,
  "bento-reveal": () => <BentoReveal tiles={[{ content: <><p className="eyebrow">Founded</p><p style={display()}>2011</p></>, col: 2, row: 2 }, { content: <p>Three partners</p> }, { content: <p>Five houses</p> }, { content: <p>Brick and courtyards, Dhaka</p>, col: 2 }]} />,
  "curve-carousel": () => <div style={{ ...box, padding: "28px 0" }}><CurveCarousel label="Projects" cardWidth={260} items={TILES.slice(0, 6).map((t, i) => <figure key={i} style={{ margin: 0, background: "var(--ground)", borderRadius: 14, padding: 10, boxShadow: "0 12px 40px rgba(0,0,0,.14)" }}><img src={t} alt={`Project ${i + 1}`} style={{ width: "100%", borderRadius: 8, display: "block" }} /><figcaption style={{ padding: "8px 2px 0" }}>Project {i + 1}</figcaption></figure>)} /></div>,
  dock: () => <div style={{ ...box, placeItems: "center" }}><Dock items={["◐", "✎", "♫", "⌘", "☼", "✉"].map((g, i) => ({ label: ["Theme", "Notes", "Music", "Commands", "Light", "Mail"][i], icon: <span style={{ fontSize: 20 }}>{g}</span>, onClick: () => {} }))} /></div>,
  "flowing-menu": () => <FlowingMenu label="Projects" items={[{ label: "Monsoon Idents", href: "#flowing-menu", marquee: "Channel rebrand · 2024" }, { label: "Bhoot", href: "#flowing-menu", marquee: "Title sequence · 2023" }, { label: "Koi", href: "#flowing-menu", marquee: "Launch film · 2025" }]} />,
  "infinite-canvas": () => <InfiniteCanvas tiles={TILES.map((t, i) => <img key={i} src={t} alt="" draggable={false} style={{ width: "100%", height: "100%", borderRadius: 8, display: "block" }} />)} style={{ height: 420, borderRadius: 14, border: "1px solid var(--line)" }} />,
  "sticky-index": () => <div style={box}><p style={{ margin: 0 }}>Live in the left column of this page on wide screens: the index follows the family you are reading.</p></div>,
  "brand-selection": () => <BrandSelection><div style={box}><p style={{ margin: 0, fontSize: 20 }}>Select this sentence: the highlight uses the page's accent and ground instead of the browser blue.</p></div></BrandSelection>,
  "click-spark": () => <ClickSpark><div style={{ ...box, placeItems: "center", cursor: "pointer" }}><p style={{ margin: 0 }}>Click anywhere in this card.</p></div></ClickSpark>,
  "copy-button": () => <div style={box}><div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}><code style={{ fontFamily: "var(--font-mono)" }}>npx skills add asfakulsiam/asfakulsiam-motomation-design</code><CopyButton text="npx skills add asfakulsiam/asfakulsiam-motomation-design" /></div></div>,
  "count-up": () => <div style={box}><p style={{ ...display("clamp(3rem, 10vw, 6.5rem)") }}><CountUp value={1500} prefix="৳" /></p><p className="hint">Ticket price per day, from the festival brief.</p></div>,
  "hold-to-commit": () => <div style={box}><HoldDemo /></div>,
  "remembered-list": () => <div style={box}><RememberedList storageKey="mm-gallery-remembered" items={["Courtyard House", "Jali House", "River Room"].map((l, i) => ({ id: `p${i}`, label: l, href: "#remembered-list" }))} /><p className="hint">Click an item, then reload the page.</p></div>,
  "squish-switch": () => <div style={box}><SquishSwitch label="Night mode" /></div>,
  "sticker-scatter": () => <div style={{ ...box, placeItems: "center" }}><StickerScatter stickers={["✶", "☻", "♥", "★", "✿", "☀"]}><button type="button" className="pill" style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>Chattogram Sound</button></StickerScatter><p className="hint">Click the logo.</p></div>,
};

function App() {
  const main = useRef<HTMLElement>(null);
  const families = Object.keys(FAMILY_TITLES).filter((f) => CATALOGUE.some((c) => c.family === f));
  return (
    <>
      <a href="#library" className="skip">Skip to the components</a>
      <ReadingRail target={main} />
      <LetterRelay name="Motomation" heroSize="clamp(3.4rem, 17vw, 13rem)" href="#top" />
      <p className="lede"><strong className="lede-head">Components.</strong> {CATALOGUE.length} motion components for the Motomation Design skill, written from scratch. Each one has props with defaults, a reduced-motion path and a touch behaviour. Turn on reduced motion in your system settings and reload to see every fallback.</p>
      <div className="layout">
        <StickyIndex label="Families" sections={families.map((f) => ({ id: `family-${f}`, label: FAMILY_TITLES[f] }))} />
        <main id="library" ref={main}>
          {families.map((f) => (
            <section key={f} id={`family-${f}`} aria-labelledby={`h-${f}`}>
              <h2 id={`h-${f}`} className="family">{FAMILY_TITLES[f]}</h2>
              {CATALOGUE.filter((c) => c.family === f).map((c) => (
                <article key={c.id} id={c.id} className="card" aria-labelledby={`t-${c.id}`}>
                  <header className="card-head">
                    <h3 id={`t-${c.id}`}>{c.name}</h3>
                    <span className="tier">Tier {c.tier}</span>
                  </header>
                  <p className="what">{c.what}</p>
                  <div className="stage">{DEMOS[c.id] ? DEMOS[c.id]() : <p>No demo.</p>}</div>
                  <dl className="notes">
                    <div><dt>Use when</dt><dd>{c.use_when}</dd></div>
                    <div><dt>Avoid when</dt><dd>{c.avoid_when}</dd></div>
                    <div><dt>Reduced motion</dt><dd>{c.reduced_motion}</dd></div>
                  </dl>
                  <p className="file"><code>{c.file}</code> <CopyButton label="Copy install command" text={`npx shadcn@latest add ${RAW}/registry/${c.id}.json`} style={{ fontSize: 13, padding: "4px 10px" }} /></p>
                </article>
              ))}
            </section>
          ))}
        </main>
      </div>
      <footer className="foot"><p>Motomation Design by asfakulsiam · MIT · <a href="https://github.com/asfakulsiam/asfakulsiam-motomation-design">github.com/asfakulsiam/asfakulsiam-motomation-design</a></p></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
