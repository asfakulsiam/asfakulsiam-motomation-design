// @motomation-section
// id: hero-shop-catalogue
// kind: hero
// archetype: catalogue
// components: TiltCard, SplitFlap
// what: A ceramics shop's product hero as a catalogue entry: object number, the piece held like a card you can tilt to the light, and a spec sheet with the kiln batch counting down.
// signature: Each piece is numbered and specified like a museum object, because every glaze firing is different; the batch counter is the real stock.
// mobile: The spec sheet drops under the object; the card doesn't tilt on touch.
// reduced-motion: No tilt; the counter shows the current stock.
import { TiltCard } from "../components/cursor/tilt-card";
import { SplitFlap } from "../components/type/split-flap";
import { Section, art, body, cols, h, label, LINE, MONO, MUTED } from "./_shared";

const SPEC = [["Clay", "Bijoypur white, wood-fired"], ["Glaze", "Ash celadon, batch 14"], ["Size", "Ø 21 cm · 4.5 cm deep"], ["Price", "৳ 3,400"]];

export function HeroShopCatalogue() {
  return (
    <Section id="hero-shop-catalogue" title="Mati ceramics">
      <div style={{ ...cols(320, 56), alignItems: "center" }}>
        <TiltCard max={8} style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.18)" }}>
          <img src={art(14, ["#d9d3c4", "#7f9a8a", "#efe9dc"], 800, 800)} alt="Ash celadon plate, batch 14, on linen" width={800} height={800} style={{ display: "block", width: "100%", height: "auto" }} />
        </TiltCard>
        <div style={{ display: "grid", gap: 20 }}>
          <p style={label}>No. 14-07 · Plates</p>
          <h1 id="hero-shop-catalogue-title" style={h("clamp(2.4rem, 5.5vw, 4.6rem)")}>Ash celadon plate</h1>
          <p style={body}>Thrown in Bijoypur and fired for thirty hours with jackfruit wood. The ash settles differently on every plate.</p>
          <dl style={{ margin: 0, display: "grid", gap: 0 }}>{SPEC.map(([k, val]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0", borderTop: `1px solid ${LINE}` }}><dt style={{ fontFamily: MONO, fontSize: 12, color: MUTED }}>{k}</dt><dd style={{ margin: 0 }}>{val}</dd></div>)}</dl>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><SplitFlap value="09" cellStyle={{ fontSize: 28 }} /><span style={{ ...label, letterSpacing: ".08em" }}>left from this firing</span></div>
        </div>
      </div>
    </Section>
  );
}
