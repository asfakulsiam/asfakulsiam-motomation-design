// The live demo for every component, shared by the gallery (gallery.tsx) and the docs site (docs/site, scripts/build-docs-site.mjs).
// DEMOS[id]() returns the demo tree; COMPONENTS[id] is the component itself (the docs playground finds it in the tree).
import { useState, type CSSProperties, type ReactNode } from "react";

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
import { GlareCard } from "../components/ui/glare-card";
import { GlowBorder } from "../components/ui/glow-border";
import { RainbowBorder } from "../components/ui/rainbow-border";
import { ShimmerButton } from "../components/ui/shimmer-button";
import { SpotlightCard } from "../components/ui/spotlight-card";
import { Aurora } from "../components/backgrounds/aurora";
import { Beams } from "../components/backgrounds/beams";
import { Globe } from "../components/backgrounds/globe";
import { MeshGradient } from "../components/backgrounds/mesh-gradient";
import { Meteors } from "../components/backgrounds/meteors";
import { ParticleField } from "../components/backgrounds/particle-field";
import { AnimatedList } from "../components/ui/animated-list";
import { useConfetti } from "../components/ui/confetti";
import { DeviceMockup } from "../components/ui/device-mockup";
import { IconCloud } from "../components/ui/icon-cloud";
import { LoaderSkeleton } from "../components/ui/loader-skeleton";
import { LoaderSpinner } from "../components/ui/loader-spinner";
import { OrbitingCircles } from "../components/ui/orbiting-circles";
import { Terminal } from "../components/ui/terminal";
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

export const RAW = "https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main";

// Inline artwork, so the page needs no image URLs. Each is a small SVG scene.
const svg = (body: string, w = 800, h = 520) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`)}`;
const COURTYARD = svg(`<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d9a4"/><stop offset="1" stop-color="#e9b77a"/></linearGradient></defs><rect width="800" height="520" fill="url(#s)"/><circle cx="610" cy="120" r="54" fill="#fff4d6"/><rect x="0" y="300" width="800" height="220" fill="#8c3b22"/><rect x="120" y="190" width="560" height="240" fill="#a6472a"/><rect x="330" y="260" width="140" height="170" fill="#2a1a12"/><rect x="170" y="240" width="90" height="70" fill="#f6e7c8"/><rect x="540" y="240" width="90" height="70" fill="#f6e7c8"/><path d="M0 430h800v90H0z" fill="#5a2716"/>`);
const SKETCH = svg(`<rect width="800" height="520" fill="#f4f1ea"/><g fill="none" stroke="#1c1b19" stroke-width="2"><circle cx="610" cy="120" r="54" stroke-dasharray="6 6"/><rect x="120" y="190" width="560" height="240"/><rect x="330" y="260" width="140" height="170"/><rect x="170" y="240" width="90" height="70"/><rect x="540" y="240" width="90" height="70"/><path d="M0 430h800M60 470h680" stroke-dasharray="10 8"/></g><text x="40" y="60" font-family="monospace" font-size="20" fill="#1c1b19">PLAN · SOUTH ELEVATION</text>`);
const tile = (hue: number, label: string) => svg(`<rect width="400" height="400" fill="hsl(${hue} 45% 82%)"/><circle cx="${120 + (hue % 160)}" cy="${140 + (hue % 90)}" r="${70 + (hue % 50)}" fill="hsl(${hue} 55% 42%)"/><rect x="40" y="300" width="${120 + (hue % 200)}" height="20" fill="hsl(${hue} 40% 22%)"/><text x="40" y="370" font-family="monospace" font-size="24" fill="hsl(${hue} 40% 18%)">${label}</text>`, 400, 400);
const TILES = Array.from({ length: 15 }, (_, i) => tile((i * 47) % 360, `No. ${String(i + 1).padStart(2, "0")}`));

export const FAMILY_TITLES: Record<string, string> = { type: "Type", text: "Text effects", scroll: "Scroll", cursor: "Cursor", backgrounds: "Backgrounds", layout: "Layout and galleries", ui: "Buttons, cards and UI", micro: "Micro-interactions" };
function ConfettiDemo() {
  const fire = useConfetti();
  const [done, setDone] = useState(false);
  return (
    <div style={{ ...box, placeItems: "center", textAlign: "center" }}>
      <button type="button" className="demo-btn" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); fire({ x: r.left + r.width / 2, y: r.top }); setDone(true); }}
        style={{ padding: ".8em 1.4em", borderRadius: 999, border: 0, background: "var(--ink)", color: "var(--ground)", font: "inherit", fontWeight: 600, cursor: "pointer" }}>Send RSVP</button>
      <p className="hint" role="status">{done ? "You're on the list for 14 February. See you there." : "A real, one-time success: the confetti is extra, the sentence is the message."}</p>
    </div>
  );
}
const orbitBadge = (t: string) => <span style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: "50%", background: "var(--ground)", border: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{t}</span>;
const pageMock = <div style={{ fontFamily: "var(--font-display)", color: "#1d1a16" }}>{["Morning bake", "Khejur gur buns", "Sourdough, 900 g", "Opening hours", "Find us"].map((t, i) => <div key={t} style={{ padding: "22px 18px", borderBottom: "1px solid #eee", background: i % 2 ? "#faf6ee" : "#fff" }}><p style={{ margin: 0, fontSize: i ? 18 : 28 }}>{t}</p><p style={{ margin: ".3em 0 0", fontFamily: "system-ui", fontSize: 12, color: "#4f4a40" }}>7am to 2pm, closed Fridays.</p></div>)}</div>;
const TREES = ["Neem", "Shimul", "Krishnachura", "Kadam", "Bakul", "Hijal", "Arjun", "Jarul", "Chhatim", "Debdaru", "Nageshwar", "Palash", "Sonalu", "Kanchan", "Supari", "Tal", "Khejur", "Hogla"];
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

export const DEMOS: Record<string, () => ReactNode> = {
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
  "shimmer-button": () => <div style={{ ...box, background: "#2a241c", placeItems: "center" }}><ShimmerButton tone="#c9a15b" ink="#1d1a16" shine="rgba(255,255,255,.7)">Reserve a table</ShimmerButton><p className="hint" style={{ color: "#d8d0c2" }}>Point at it, focus it with Tab, or tap it.</p></div>,
  "rainbow-border": () => <div style={{ ...box, placeItems: "center" }}><RainbowBorder style={{ width: "min(100%, 340px)" }}><div style={{ padding: "22px 24px" }}><p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".12em" }}>NEW · 48 COLOURS</p><p style={{ ...display("1.6rem"), margin: ".3em 0 0" }}>Riso inks, spring set</p></div></RainbowBorder><p className="hint">Point at the card to turn the wheel.</p></div>,
  "spotlight-card": () => <div style={{ ...box, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, background: "#0d0b08" }}>{["Hall I · Drawings", "Hall II · Maps", "Hall III · Letters"].map((t) => <SpotlightCard key={t} style={{ padding: "28px 22px", minHeight: 150 }}><p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".12em", color: "#c9bfae" }}>OPEN TILL 21:00</p><p style={{ ...display("1.5rem"), margin: ".5em 0 0" }}>{t}</p></SpotlightCard>)}</div>,
  "glare-card": () => <div style={{ ...box, placeItems: "center", background: "#e9e2d4" }}><GlareCard style={{ width: "min(100%, 320px)", aspectRatio: "1.586", background: "linear-gradient(135deg, #24405c, #12202f)", color: "#f3efe6", boxShadow: "0 18px 40px rgba(0,0,0,.25)" }}><div style={{ position: "absolute", inset: 0, zIndex: 1, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}><p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".16em" }}>READER'S PASS · 2026</p><p style={{ ...display("1.5rem"), margin: 0 }}>Northbrook Library</p></div></GlareCard><p className="hint" style={{ color: "#4a463f" }}>Move the pointer across the card, or drag a finger.</p></div>,
  "glow-border": () => <div style={{ ...box, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, background: "#0d0b08" }}>{[["Mix", "from 4,000"], ["Master", "from 2,500"], ["Both", "from 6,000"]].map(([t, p]) => <GlowBorder key={t}><div style={{ padding: "24px 20px", color: "#f1e9da" }}><p style={{ ...display("1.5rem"), margin: 0 }}>{t}</p><p style={{ margin: ".4em 0 0", fontFamily: "var(--font-mono)", fontSize: 13, color: "#c9bfae" }}>BDT {p} / track</p></div></GlowBorder>)}</div>,
  "animated-list": () => <div style={box}><AnimatedList itemStyle={{ padding: "10px 14px", borderRadius: 10, background: "var(--ground)", border: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{["07:02 · 2 × sourdough · Gulshan", "07:05 · 6 × gur buns · Banani", "07:11 · 1 × sourdough · Dhanmondi", "07:14 · 12 × gur buns · office order"].map((t) => <span key={t}>{t}</span>)}</AnimatedList></div>,
  "orbiting-circles": () => <div style={box}><OrbitingCircles label="Tilottoma and its five suppliers" center={<span style={{ ...display("1.3rem"), display: "grid", placeItems: "center", width: 92, height: 92, borderRadius: "50%", background: "var(--ink)", color: "var(--ground)" }}><span>Bakery</span></span>}
    rings={[{ radius: 0.62, items: [{ label: "Flour mill, Bogura", node: orbitBadge("Mill") }, { label: "Date-palm tappers, Jashore", node: orbitBadge("Gur") }, { label: "Dairy, Sirajganj", node: orbitBadge("Milk") }] }, { radius: 0.95, reverse: true, items: [{ label: "Salt works, Cox's Bazar", node: orbitBadge("Salt") }, { label: "Firewood co-op", node: orbitBadge("Wood") }] }]} size={320} /></div>,
  // the turning ball is the picture, the list under it is the text (the component's use-when: "with the full list
  // available in text"). Its labels move and its far side is drawn faint and small, so it is aria-hidden and the
  // names a visitor reads, and a screen reader hears, are the real list below (v2.5.0 fix: Components CI)
  // Below 300px the component has no ball (it falls back to a wrapped list), so the picture and its drag hint give way
  // to the real list alone (gallery.css: .cloud-art, a container query on the stage)
  "icon-cloud": () => <div style={{ ...box, containerType: "inline-size" }}><div className="cloud-art" aria-hidden="true"><IconCloud size={320} items={TREES.map((t) => <span key={t} style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{t}</span>)} /></div><p className="hint cloud-art">Drag sideways to spin.</p>
    <ul className="cloud-list" aria-label="The trees in the cloud" style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", listStyle: "none", padding: 0, margin: "14px 0 0", color: "var(--ink)" }}>{TREES.map((t) => <li key={t}>{t}</li>)}</ul></div>,
  terminal: () => <div style={box}><Terminal title="~/projects" lines={[{ cmd: "npx skills add asfakulsiam/asfakulsiam-motomation-design", out: "✓ installed motomation-design (skills/asfakulsiam-motomation-design)" }, { cmd: "node skill/scripts/gate.mjs index.html", out: "Delivery Gate: PASS · 0 contrast failures · reduced motion ok" }]} /></div>,
  "device-mockup": () => <div style={{ ...box, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, alignItems: "center" }}><DeviceMockup kind="phone" label="Bakery site on a phone" tall>{pageMock}</DeviceMockup><DeviceMockup kind="browser" label="Bakery site in a browser" url="tilottoma.bd" tall>{pageMock}</DeviceMockup></div>,
  confetti: () => <ConfettiDemo />,
  "loader-spinner": () => <div style={{ ...box, gridAutoFlow: "column", justifyContent: "start", gap: 32, alignItems: "center" }}><LoaderSpinner /><LoaderSpinner size={40} showLabel label="Checking payment…" color="var(--accent)" /></div>,
  "loader-skeleton": () => <div style={{ ...box, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}><LoaderSkeleton /><LoaderSkeleton media avatar={false} lines={2} /></div>,
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
  aurora: () => <div style={{ ...box, minHeight: 320, alignContent: "end" }}><Aurora /><p style={{ ...display(), position: "relative", color: "#eef3f8" }}>Tromsø, 69° N.</p></div>,
  beams: () => <div style={{ ...box, minHeight: 320, alignContent: "end" }}><Beams /><p style={{ ...display(), position: "relative", color: "#f4ecdc" }}>The nave at noon.</p></div>,
  meteors: () => <div style={{ ...box, minHeight: 320, alignContent: "end" }}><Meteors /><p style={{ ...display(), position: "relative", color: "#eef0f6" }}>Perseids, 12 August.</p></div>,
  globe: () => <div style={{ ...box, minHeight: 360, alignContent: "end" }}><Globe markers={[{ lat: 23.8, lon: 90.4 }, { lat: 51.5, lon: -0.1 }, { lat: 25.2, lon: 55.3 }, { lat: 40.7, lon: -74 }]} /><p style={{ ...display("clamp(1.6rem, 4vw, 2.6rem)"), position: "relative", color: "#eef0f6" }}>Dhaka · London · Dubai · New York</p></div>,
  "particle-field": () => <div style={{ ...box, minHeight: 320, alignContent: "end" }}><ParticleField /><p style={{ ...display(), position: "relative", color: "#f3e9d6" }}>Reel two, 1958.</p></div>,
  "mesh-gradient": () => <div style={{ ...box, minHeight: 320, alignContent: "end" }}><MeshGradient /><p style={{ ...display(), position: "relative", color: "#2a2118" }}>Indigo &amp; madder.</p></div>,
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

// id → component, for the docs playground. useConfetti is a hook (no element to find).
export const COMPONENTS: Record<string, unknown> = {
  "blur-focus": BlurFocus,
  "curved-text": CurvedText,
  "decode": Decode,
  "ink-fill": InkFill,
  "letter-relay": LetterRelay,
  "neighbour-moves": NeighbourMoves,
  "pressure-type": PressureType,
  "scroll-float": ScrollFloat,
  "split-flap": SplitFlap,
  "width-sprint": WidthSprint,
  "ascii-text": AsciiText,
  "glitch": Glitch,
  "rotating-words": RotatingWords,
  "scramble-on-hover": ScrambleOnHover,
  "shiny-text": ShinyText,
  "typewriter": Typewriter,
  "glare-card": GlareCard,
  "glow-border": GlowBorder,
  "rainbow-border": RainbowBorder,
  "shimmer-button": ShimmerButton,
  "spotlight-card": SpotlightCard,
  "aurora": Aurora,
  "beams": Beams,
  "globe": Globe,
  "mesh-gradient": MeshGradient,
  "meteors": Meteors,
  "particle-field": ParticleField,
  "animated-list": AnimatedList,
  "confetti": useConfetti,
  "device-mockup": DeviceMockup,
  "icon-cloud": IconCloud,
  "loader-skeleton": LoaderSkeleton,
  "loader-spinner": LoaderSpinner,
  "orbiting-circles": OrbitingCircles,
  "terminal": Terminal,
  "aperture": Aperture,
  "darkroom-develop": DarkroomDevelop,
  "horizontal-reel": HorizontalReel,
  "reading-rail": ReadingRail,
  "stacked-deck": StackedDeck,
  "thread": Thread,
  "velocity-marquee": VelocityMarquee,
  "image-trail": ImageTrail,
  "lens": Lens,
  "pixel-wake": PixelWake,
  "seismograph-line": SeismographLine,
  "target-cursor": TargetCursor,
  "tilt-card": TiltCard,
  "contour-lines": ContourLines,
  "dot-field": DotField,
  "grain": Grain,
  "halftone": Halftone,
  "light-sweep": LightSweep,
  "liquid-field": LiquidField,
  "bento-reveal": BentoReveal,
  "curve-carousel": CurveCarousel,
  "dock": Dock,
  "flowing-menu": FlowingMenu,
  "infinite-canvas": InfiniteCanvas,
  "sticky-index": StickyIndex,
  "brand-selection": BrandSelection,
  "click-spark": ClickSpark,
  "copy-button": CopyButton,
  "count-up": CountUp,
  "hold-to-commit": HoldToCommit,
  "remembered-list": RememberedList,
  "squish-switch": SquishSwitch,
  "sticker-scatter": StickerScatter,
};
