// @motomation-section
// id: features-studio-services
// kind: features
// archetype: ledger
// components: GlowBorder, CountUp
// what: A studio's three services as dark ledger cards whose edges light up toward the pointer, each with the one number that describes it (weeks, rounds, people).
// signature: Services are priced and staffed like entries, not described with adjectives; the lit edge makes the row feel like a panel of switches you choose between.
// mobile: Cards stack; the glow rests as a faint border.
// reduced-motion: Faint static border; numbers show their final value.
import { GlowBorder } from "../components/ui/glow-border";
import { CountUp } from "../components/micro/count-up";
import { Section, cols, h, label } from "./_shared";

const SERVICES = [
  { name: "Identity", n: 10, unit: "weeks", note: "Research, two directions, one system, a handbook your printer can follow." },
  { name: "Exhibition", n: 3, unit: "designers", note: "Wayfinding, panels and the catalogue, from the curator's draft to the opening." },
  { name: "Data design", n: 2, unit: "review rounds", note: "Annual reports and dashboards for ministries, in Bangla and English." },
];

export function FeaturesStudioServices() {
  return (
    <Section id="features-studio-services" title="Services" dark>
      <p style={{ ...label, color: "inherit", opacity: 0.7 }}>Services</p>
      <h2 id="features-studio-services-title" style={h("clamp(2rem, 4.4vw, 3.6rem)", { margin: "12px 0 40px" })}>Three kinds of work, each with a fixed shape.</h2>
      <div style={cols(260, 14)}>
        {SERVICES.map((s) => (
          <GlowBorder key={s.name}>
            <div style={{ padding: "28px 24px", display: "grid", gap: 14, color: "#f1e9da" }}>
              <h3 style={h("1.7rem")}>{s.name}</h3>
              <p style={{ margin: 0, fontFamily: "var(--font-mono, monospace)", fontSize: 14 }}><CountUp value={s.n} style={{ fontSize: 40, fontFamily: "var(--font-display, serif)" }} /> {s.unit}</p>
              <p style={{ margin: 0, color: "#c9bfae", lineHeight: 1.5 }}>{s.note}</p>
            </div>
          </GlowBorder>
        ))}
      </div>
    </Section>
  );
}
