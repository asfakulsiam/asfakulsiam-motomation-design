// @motomation-section
// id: features-shop-specs
// kind: features
// archetype: catalogue
// components: StackedDeck
// what: The making of a plate as a stack of spec cards that pile up as you scroll: clay, throwing, glaze, firing, each card one step with its numbers.
// signature: The Catalogue's spec sheet becomes the process: each card is one line of the object's record, and the pile is the plate's history.
// mobile: Cards stack at full width with a smaller offset.
// reduced-motion: Cards are laid out in a plain column.
import { StackedDeck } from "../components/scroll/stacked-deck";
import { Section, body, h, label, MONO, MUTED } from "./_shared";

const step = (n: string, text: string) => <div style={{ display: "grid", gap: 10 }}><p style={{ fontFamily: MONO, fontSize: 13, color: MUTED, margin: 0 }}>{n}</p><p style={{ ...body, maxWidth: "48ch" }}>{text}</p></div>;

export function FeaturesShopSpecs() {
  return (
    <Section id="features-shop-specs" title="How each plate is made">
      <p style={label}>The record of No. 14-07</p>
      <h2 id="features-shop-specs-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>Four steps, five weeks.</h2>
      <StackedDeck cardStyle={{ background: "var(--surface, #fbf8f2)", border: "1px solid var(--line, rgba(0,0,0,.12))" }} cards={[
        { title: "Clay", body: step("Week 1 · Bijoypur, Netrokona", "White clay dug from one hillside, washed twice and left to age in the shade for a week.") },
        { title: "Throwing", body: step("Week 2 · 22 plates a day", "Thrown by Rina Hajong on a kick wheel, trimmed when leather-hard, signed on the foot.") },
        { title: "Glaze", body: step("Week 3 · ash from our own kiln", "Wood ash and feldspar, sieved to 80 mesh; the green comes from iron in the ash.") },
        { title: "Firing", body: step("Week 5 · 30 hours, 1,280 °C", "Jackfruit wood, fed every seven minutes. About one plate in eight doesn't survive.") },
      ]} />
    </Section>
  );
}
