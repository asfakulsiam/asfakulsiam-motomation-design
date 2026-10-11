// @motomation-section
// id: features-saas-bento
// kind: features
// archetype: workbench
// components: BentoReveal, CountUp
// what: Four product facts as a bento of working parts of the app (a sale typed in Bangla, the credit book, the stock alert, the offline badge), each tile revealing as it's reached.
// signature: Each tile is a piece of the real interface with real numbers, not an icon with a feature name; the bento layout mirrors the app's own home screen.
// mobile: Tiles stack in reading order at full width.
// reduced-motion: Tiles are all shown; numbers show final values.
import { BentoReveal } from "../components/layout/bento-reveal";
import { CountUp } from "../components/micro/count-up";
import type { ReactNode } from "react";
import { Section, h, label, MONO, MUTED, SURFACE, LINE } from "./_shared";

const tile = (children: ReactNode) => <div style={{ height: "100%", padding: 22, borderRadius: 16, background: SURFACE, border: `1px solid ${LINE}`, display: "grid", alignContent: "space-between", gap: 18 }}>{children}</div>;

export function FeaturesSaasBento() {
  return (
    <Section id="features-saas-bento" title="What Tally does">
      <p style={label}>Inside the app</p>
      <h2 id="features-saas-bento-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>The four screens a shop uses every day.</h2>
      <BentoReveal columns={4} tiles={[
        { col: 2, row: 2, content: tile(<><p style={{ fontFamily: MONO, fontSize: 13, color: MUTED, margin: 0 }}>Type it as you say it</p><p style={h("clamp(1.6rem, 3vw, 2.4rem)")}>“চাল ৫ কেজি ৪২০” → Rice, 5 kg, ৳ 420</p></>) },
        { col: 2, content: tile(<><p style={{ fontFamily: MONO, fontSize: 13, color: MUTED, margin: 0 }}>Credit book</p><p style={h("2rem")}><CountUp value={14} /> customers owe ৳ <CountUp value={18450} locale="en-IN" /></p></>) },
        { content: tile(<><p style={{ fontFamily: MONO, fontSize: 13, color: MUTED, margin: 0 }}>Stock alert</p><p style={h("1.4rem")}>Mustard oil: 3 left</p></>) },
        { content: tile(<><p style={{ fontFamily: MONO, fontSize: 13, color: MUTED, margin: 0 }}>Offline</p><p style={h("1.4rem")}>Syncs when the network returns</p></>) },
      ]} />
    </Section>
  );
}
