// @motomation-section
// id: contact-hotel-atlas
// kind: contact
// archetype: atlas
// components: CopyButton
// what: How to arrive, set as a survey sheet: the route from Dhaka in three legs, with the address and phone to copy for the driver.
// signature: The Atlas archetype answers the guest's real question (how do I get there in Dhaka traffic), and the copy buttons hand the details to a driver.
// mobile: Legs stack; the address and phone each keep their copy button.
// reduced-motion: Nothing here moves; the copy buttons confirm with text, not motion.
import { CopyButton } from "../components/micro/copy-button";
import { Section, cols, h, label, MONO, MUTED } from "./_shared";

const LEGS = [["1", "Dhaka → Mograpara", "27 km on the N1, 50–90 min"], ["2", "Mograpara → Panam", "4 km, turn at the museum sign"], ["3", "Panam Nagar gate", "Park outside; we walk your bags in"]];

export function ContactHotelAtlas() {
  return (
    <Section id="contact-hotel-atlas" title="Getting here">
      <div style={{ position: "relative" }}>
        <p style={label}>Sheet 2 of 2 · arrival</p>
        <h2 id="contact-hotel-atlas-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>From Dhaka, in three legs.</h2>
        <ol style={{ ...cols(220, 24), listStyle: "none", padding: 0, margin: "0 0 40px" }}>{LEGS.map(([n, a, b]) => <li key={n}><p style={{ fontFamily: MONO, fontSize: 12, color: MUTED, margin: 0 }}>Leg {n}</p><p style={h("1.5rem", { margin: "6px 0" })}>{a}</p><p style={{ margin: 0, color: MUTED }}>{b}</p></li>)}</ol>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
          <span>Haveli Panam, Panam Nagar Road, Sonargaon 1440</span><CopyButton text="Haveli Panam, Panam Nagar Road, Sonargaon 1440" label="Copy address" />
          <span>+880 1711 000 214</span><CopyButton text="+8801711000214" label="Copy phone" />
        </div>
      </div>
    </Section>
  );
}
