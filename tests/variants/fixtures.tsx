// React side of the variant comparison: the same demo content as vendor/plain/<id>/plain.html, built from the React
// components. Bundled by compare.mjs (esbuild from the local toolchain; never a repo dependency). ?c=<id> picks one.
import { createRoot } from "react-dom/client";
import type { ReactNode } from "react";
import { CountUp } from "../../skills/asfakulsiam-motomation-design/examples/components/micro/count-up";
import { SplitFlap } from "../../skills/asfakulsiam-motomation-design/examples/components/type/split-flap";
import { CopyButton } from "../../skills/asfakulsiam-motomation-design/examples/components/micro/copy-button";
import { InkFill } from "../../skills/asfakulsiam-motomation-design/examples/components/type/ink-fill";
import { Typewriter } from "../../skills/asfakulsiam-motomation-design/examples/components/text/typewriter";
import { AnimatedList } from "../../skills/asfakulsiam-motomation-design/examples/components/ui/animated-list";
import { ContourLines } from "../../skills/asfakulsiam-motomation-design/examples/components/backgrounds/contour-lines";
import { GlowBorder } from "../../skills/asfakulsiam-motomation-design/examples/components/ui/glow-border";
import { RotatingWords } from "../../skills/asfakulsiam-motomation-design/examples/components/text/rotating-words";
import { SquishSwitch } from "../../skills/asfakulsiam-motomation-design/examples/components/micro/squish-switch";
import { TiltCard } from "../../skills/asfakulsiam-motomation-design/examples/components/cursor/tilt-card";
import { VelocityMarquee } from "../../skills/asfakulsiam-motomation-design/examples/components/scroll/velocity-marquee";
import { FlowingMenu } from "../../skills/asfakulsiam-motomation-design/examples/components/layout/flowing-menu";
import { Grain } from "../../skills/asfakulsiam-motomation-design/examples/components/backgrounds/grain";
import { ScrambleOnHover } from "../../skills/asfakulsiam-motomation-design/examples/components/text/scramble-on-hover";
import { ShimmerButton } from "../../skills/asfakulsiam-motomation-design/examples/components/ui/shimmer-button";
import { Aperture } from "../../skills/asfakulsiam-motomation-design/examples/components/scroll/aperture";
import { Beams } from "../../skills/asfakulsiam-motomation-design/examples/components/backgrounds/beams";
import { BentoReveal } from "../../skills/asfakulsiam-motomation-design/examples/components/layout/bento-reveal";
import { BlurFocus } from "../../skills/asfakulsiam-motomation-design/examples/components/type/blur-focus";
import { useState } from "react";

const Label = ({ children }: { children: ReactNode }) => <p className="demo-label">{children}</p>;
const Spacer = () => <div className="demo-spacer" />;
const LONG = "We exist to make that ruling mean something on the bank: we survey, we go to court, and we pay local people to watch their water.";
const IMG = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23e9d8bd%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%22140%22 fill=%22%23f2c879%22/%3E%3Cpath d=%22M0 620 Q400 520 800 600 T1600 580 V900 H0Z%22 fill=%22%23a8643a%22/%3E%3C/svg%3E';

function Flap() {
  const [v, setV] = useState("JAN 2027");
  return (<><Label>Next free start</Label><p className="demo-big"><SplitFlap value={v} /></p>
    <button type="button" className="demo-button" onClick={() => setV(v === "JAN 2027" ? "MAR 2027" : "JAN 2027")}>Change the date</button></>);
}
const tile = (label: string, body: ReactNode) => <><p className="demo-label">{label}</p>{body}</>;

const DEMOS: Record<string, () => ReactNode> = {
  "count-up": () => <><Label>Audited, 2025</Label><p className="demo-big"><CountUp value={1260} /></p><p>people paid to watch their own river, monthly.</p></>,
  "split-flap": () => <Flap />,
  "copy-button": () => <><p className="demo-big">work@hawa.studio</p><CopyButton text="work@hawa.studio" label="Copy email" style={{ justifySelf: "start" }} /></>,
  "ink-fill": () => <><Spacer /><InkFill className="demo-big" text={LONG} /><Spacer /></>,
  typewriter: () => <Typewriter className="demo-big" text="Dear reader, this month is about the binders." />,
  "animated-list": () => <><Label>Replies to No. 36</Label><AnimatedList itemStyle={{}}>{["“My grandfather was a binder in Banglabazar.”", "“Printed it and gave it to my mother.”", "“Please do the umbrella repairers next.”"].map((r) => <div key={r} className="demo-card">{r}</div>)}</AnimatedList></>,
  "contour-lines": () => <div className="demo-panel" style={{ color: "#8a4b2a" }}><ContourLines lines={18} seed={9} /><h2 className="demo-big" style={{ position: "relative", color: "var(--ink)" }}>Above sea level.</h2></div>,
  "glow-border": () => <div className="demo-dark"><GlowBorder><div style={{ padding: 32 }}><h3 style={{ margin: "0 0 8px" }}>Shop</h3><p style={{ margin: 0 }}>৳ 299 a month. One shop, two phones.</p></div></GlowBorder></div>,
  "rotating-words": () => <RotatingWords className="demo-big" before="The day's accounts, closed in a minute, for " words={["grocers", "pharmacies", "tea stalls"]} after="." wordStyle={{ fontStyle: "italic" }} />,
  "squish-switch": () => <SquishSwitch label="Pay yearly" style={{ justifySelf: "start" }} />,
  "tilt-card": () => <TiltCard style={{ maxWidth: 340, padding: 28, borderRadius: 12, background: "#f6ead2", border: "1px solid var(--line)" }}><Label>Monsoon Jazz Night · 14 Nov</Label><h3 className="demo-big" style={{ fontSize: "2rem" }}>Front stalls</h3><p style={{ margin: 0 }}>Rows A–E · ৳ 1,500</p></TiltCard>,
  "velocity-marquee": () => <><VelocityMarquee className="demo-big" items={["Bangladesh Bank Museum", "Sonargaon Archive", "Ministry of Water", "Old Dhaka Trust"]} /><Spacer /><Spacer /></>,
  "flowing-menu": () => <FlowingMenu label="Running order" items={[{ href: "#t1", label: "19:30 · Rafa Quartet", marquee: "piano · double bass · drums · tenor sax" }, { href: "#t2", label: "20:20 · Sumi Akand", marquee: "voice · harmonium · tabla" }, { href: "#t3", label: "21:30 · Armeen Musa", marquee: "voice · guitar · cello" }]} />,
  grain: () => <div className="demo-card" style={{ position: "relative", overflow: "hidden", padding: 48, background: "#f7efdf" }}><Grain /><p className="demo-big" style={{ position: "relative", fontStyle: "italic", fontSize: "2rem" }}>We came for one night and stayed four.</p></div>,
  "scramble-on-hover": () => <ul className="demo-card" style={{ listStyle: "none", margin: 0, display: "grid", gap: 12 }}>{["Ayesha Siddiqua", "Tanvir Hasan", "Mithila Das"].map((n) => <li key={n}><ScrambleOnHover text={n} style={{ fontSize: "1.6rem" }} /></li>)}</ul>,
  "shimmer-button": () => <ShimmerButton href="#signup" style={{ justifySelf: "start" }}>Start a free month</ShimmerButton>,
  aperture: () => <><Spacer /><Aperture shape="door" style={{ aspectRatio: "16/9" }}><img src={IMG} alt="The courtyard in the late afternoon" width={1600} height={900} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} /></Aperture><Spacer /><Spacer /></>,
  beams: () => <section style={{ position: "relative", minHeight: "70vh", display: "grid", alignItems: "end", padding: 40, color: "#f4efe6", borderRadius: 12, overflow: "hidden" }}><Beams /><h2 className="demo-big" style={{ position: "relative", fontSize: "clamp(3rem,10vw,7rem)", lineHeight: 0.9 }}>MONSOON<br />JAZZ NIGHT</h2></section>,
  "bento-reveal": () => <BentoReveal tiles={[
    { col: 2, row: 2, content: tile("Type it as you say it", <p className="demo-big" style={{ fontSize: "1.8rem" }}>Rice, 5 kg, ৳ 420</p>) },
    { col: 2, content: tile("Credit book", <p>14 customers owe ৳ 18,450</p>) },
    { content: tile("Stock alert", <p>Mustard oil: 3 left</p>) },
    { content: tile("Offline", <p>Syncs when the network returns</p>) }]} />,
  "blur-focus": () => <BlurFocus as="h2" className="demo-big" text="The river took the school. The village rebuilt it on stilts." />,
};

const id = new URLSearchParams(location.search).get("c") || "count-up";
const Demo = DEMOS[id];
createRoot(document.getElementById("root")!).render(<main className="demo">{Demo ? <Demo /> : <p>unknown {id}</p>}</main>);
