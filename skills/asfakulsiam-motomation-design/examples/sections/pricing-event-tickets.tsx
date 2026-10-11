// @motomation-section
// id: pricing-event-tickets
// kind: pricing
// archetype: poster
// components: TiltCard, ShinyText
// what: Three ticket tiers drawn as actual paper tickets (stub, perforation, seat block) that tilt toward the cursor like a ticket held to the light; the gallery tier's brass stamp catches the light once.
// signature: The tickets are the objects you'll hold at the door, with the real seat blocks; one brass stamp, not three badges.
// mobile: Tickets stack full width; no tilt; the stamp is still.
// reduced-motion: No tilt; solid stamp.
import { TiltCard } from "../components/cursor/tilt-card";
import { ShinyText } from "../components/text/shiny-text";
import { Section, cols, h, label, MONO } from "./_shared";

const TIERS = [["Stalls", "Rows F–R", "৳ 800"], ["Front stalls", "Rows A–E", "৳ 1,500"], ["Gallery", "Boxes 1–6", "৳ 2,500"]];

export function PricingEventTickets() {
  return (
    <Section id="pricing-event-tickets" title="Tickets">
      <p style={label}>Tickets · 1,100 seats</p>
      <h2 id="pricing-event-tickets-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>Pick a seat, not a package.</h2>
      <div style={cols(260, 22)}>
        {TIERS.map(([tier, seats, price], i) => (
          <TiltCard key={tier} max={7} style={{ borderRadius: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", background: "#f6ead2", color: "#2a2118", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "22px 20px", display: "grid", gap: 8 }}>
                <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", margin: 0 }}>MONSOON JAZZ NIGHT · 14 NOV</p>
                <h3 style={h("1.7rem")}>{tier}</h3>
                <p style={{ margin: 0, fontFamily: MONO, fontSize: 13 }}>{seats}</p>
                {i === 2 && <ShinyText as="p" text="WITH INTERVAL DRINKS" ink="#805d1d" shine="#fff1c7" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".16em", margin: 0 }} />}
              </div>
              <div style={{ borderLeft: "2px dashed rgba(42,33,24,.35)", padding: "22px 18px", display: "grid", placeItems: "center", writingMode: "vertical-rl" }}><span style={h("1.6rem")}>{price}</span></div>
            </div>
          </TiltCard>
        ))}
      </div>
    </Section>
  );
}
