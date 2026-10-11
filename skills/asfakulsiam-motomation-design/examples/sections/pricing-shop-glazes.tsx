// @motomation-section
// id: pricing-shop-glazes
// kind: pricing
// archetype: catalogue
// components: RainbowBorder
// what: Three glaze sets priced as catalogue lots; the set a visitor points at gets a turning border in that set's own glaze colours.
// signature: The border colours are the actual glazes in each set, so the only colourful motion on the page is information about the product.
// mobile: Lots stack; borders still (they turn while pressed).
// reduced-motion: Static glaze-coloured borders.
import { RainbowBorder } from "../components/ui/rainbow-border";
import { Section, cols, h, label, MONO, MUTED } from "./_shared";

const SETS = [
  { lot: "Lot A", name: "River set", pieces: "4 plates · 4 bowls", price: "৳ 22,000", glaze: ["#7f9a8a", "#a9bdb0", "#5f7a6c", "#7f9a8a"] },
  { lot: "Lot B", name: "Clay set", pieces: "4 plates · 2 serving bowls", price: "৳ 18,500", glaze: ["#a8643a", "#d19a6a", "#7a4426", "#a8643a"] },
  { lot: "Lot C", name: "Night set", pieces: "6 cups · 1 pot", price: "৳ 12,800", glaze: ["#2b3a4a", "#55677a", "#1b2633", "#2b3a4a"] },
];

export function PricingShopGlazes() {
  return (
    <Section id="pricing-shop-glazes" title="Sets">
      <p style={label}>Sets from batch 14</p>
      <h2 id="pricing-shop-glazes-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>Three lots, priced by the set.</h2>
      <div style={cols(260, 18)}>
        {SETS.map((s) => (
          <RainbowBorder key={s.lot} colors={s.glaze} width={3} surface="var(--surface, #fbf8f2)">
            <div style={{ padding: "26px 22px", display: "grid", gap: 10 }}>
              <p style={{ fontFamily: MONO, fontSize: 12, color: MUTED, margin: 0 }}>{s.lot}</p>
              <h3 style={h("1.7rem")}>{s.name}</h3>
              <p style={{ margin: 0, color: MUTED }}>{s.pieces}</p>
              <p style={h("2rem", { marginTop: 8 })}>{s.price}</p>
            </div>
          </RainbowBorder>
        ))}
      </div>
    </Section>
  );
}
