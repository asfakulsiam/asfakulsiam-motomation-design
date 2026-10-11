// @motomation-section
// id: pricing-hotel-seasons
// kind: pricing
// archetype: room
// components: SpotlightCard
// what: Rates by season as three dark cards lit by a pool of lamplight under the pointer, each with what the house is like then (not just the price).
// signature: Seasons are the hotel's real price structure, and each card sells the room at that time of year; the lamplight is the courtyard at night.
// mobile: Cards stack; the light rests at the top of each.
// reduced-motion: Fixed soft light at the top of each card.
import { SpotlightCard } from "../components/ui/spotlight-card";
import { Section, cols, h, label } from "./_shared";

const SEASONS = [["Winter", "Nov – Feb", "৳ 14,500", "Fires in the courtyard, fog on the Meghna at seven."], ["Spring", "Mar – May", "৳ 11,000", "Mango blossom; the long lunches move outside."], ["Monsoon", "Jun – Oct", "৳ 8,500", "Rain on the tank, boats to Panam Nagar."]];

export function PricingHotelSeasons() {
  return (
    <Section id="pricing-hotel-seasons" title="Rates" dark>
      <p style={{ ...label, color: "inherit", opacity: 0.7 }}>Rates per room per night, breakfast and dinner included</p>
      <h2 id="pricing-hotel-seasons-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>Three seasons, three houses.</h2>
      <div style={cols(240, 14)}>
        {SEASONS.map(([s, months, rate, line]) => (
          <SpotlightCard key={s} style={{ padding: "30px 24px", minHeight: 220, display: "grid", alignContent: "space-between", gap: 20 }}>
            <div><p style={{ margin: 0, fontFamily: "var(--font-mono, monospace)", fontSize: 12, letterSpacing: ".12em", color: "#c9bfae" }}>{months.toUpperCase()}</p><h3 style={h("1.9rem", { marginTop: 8 })}>{s}</h3></div>
            <p style={{ margin: 0, color: "#d8cfbf", lineHeight: 1.5 }}>{line}</p>
            <p style={h("2.2rem")}>{rate}</p>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
