// @motomation-section
// id: features-shop-specs
// kind: features
// archetype: catalogue
// components: Grain
// what: The making of a plate as the lot's record card: clay, throwing, glaze, firing in four ruled columns, each step with its week and its numbers. Nothing pins: on a Tier 2 product page the page budget allows 2 pinned sections, and the object's record reads best at a glance.
// signature: The Catalogue's spec sheet becomes the process: each column is one line of the object's record, ruled like an auction-house lot card on grained paper.
// mobile: The four columns become four ruled rows.
// reduced-motion: Identical; the record has no motion.
import { Grain } from "../components/backgrounds/grain";
import { Section, body, h, label, MONO, MUTED } from "./_shared";

const step = (n: string, text: string) => <div style={{ display: "grid", gap: 10 }}><p style={{ fontFamily: MONO, fontSize: 13, color: MUTED, margin: 0 }}>{n}</p><p style={{ ...body, maxWidth: "48ch" }}>{text}</p></div>;

export function FeaturesShopSpecs() {
  return (
    <Section id="features-shop-specs" title="How each plate is made">
      <p style={label}>The record of No. 14-07</p>
      <h2 id="features-shop-specs-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>Four steps, five weeks.</h2>
      <div style={{ position: "relative" }}>
      <ol style={{ position: "relative", listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", borderTop: "1px solid var(--ink, #2a221b)" }}>
        {[
          ["Clay", "Week 1 · Bijoypur, Netrokona", "White clay dug from one hillside, washed twice and left to age in the shade for a week."],
          ["Throwing", "Week 2 · 22 plates a day", "Thrown by Rina Hajong on a kick wheel, trimmed when leather-hard, signed on the foot."],
          ["Glaze", "Week 3 · ash from our own kiln", "Wood ash and feldspar, sieved to 80 mesh; the green comes from iron in the ash."],
          ["Firing", "Week 5 · 30 hours, 1,280 °C", "Jackfruit wood, fed every seven minutes. About one plate in eight doesn't survive."],
        ].map(([t, n, text], i) => (
          <li key={t} style={{ padding: "22px 20px 26px 0", borderBottom: "1px solid var(--line, rgba(0,0,0,.16))", display: "grid", gap: 12, alignContent: "start" }}>
            <h3 style={{ margin: 0, fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", fontWeight: 400 }}><span style={{ fontFamily: MONO, fontSize: 13, color: MUTED, marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>{" "}{t}</h3>
            {step(n, text)}
          </li>
        ))}
      </ol>
      {/* the lot card's paper: a static grain, the only texture on the page */}
      <Grain opacity={0.05} animate={false} />
      </div>
    </Section>
  );
}
