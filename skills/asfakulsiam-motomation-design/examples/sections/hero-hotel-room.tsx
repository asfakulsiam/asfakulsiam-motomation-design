// @motomation-section
// id: hero-hotel-room
// kind: hero
// archetype: room
// components: Aperture, Grain
// what: A small heritage hotel's first screen is a doorway: as you scroll, the arched door opens onto the courtyard, and the name sits on the threshold.
// signature: You arrive the way guests do, through the door; the Room archetype's threshold is the only motion on the page, so it's remembered.
// mobile: The doorway keeps its 16:9 opening at full width with the name below it; the scroll-driven opening still runs.
// reduced-motion: The doorway is fully open from the start.
import { Aperture } from "../components/scroll/aperture";
import { Grain } from "../components/backgrounds/grain";
import { Section, h, label } from "./_shared";
import { haveli } from "./_imagery";

export function HeroHotelRoom() {
  return (
    <Section id="hero-hotel-room" title="Haveli Panam" bleed>
      <div style={{ position: "relative", minHeight: "100svh", display: "grid", justifyItems: "center", alignContent: "center", gap: "4vh", padding: "8vh 20px" }}>
        <Aperture shape="door" style={{ width: "min(92vw, 1100px)", aspectRatio: "16 / 9", maxHeight: "62svh", borderRadius: 4 }}>
          <img src={haveli("courtyard", 31, { wall: "#e9d8bd", ink: "#5a3220", light: "#f2c879" }, 1600, 1000)} alt="The courtyard at Haveli Panam in the late afternoon, with the well and the neem tree" width={1600} height={1000} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
        </Aperture>
        <div style={{ position: "relative", textAlign: "center" }}>
          <p style={label}>Sonargaon · seven rooms · since 1898</p>
          <h1 id="hero-hotel-room-title" style={h("clamp(2.6rem, 7vw, 6rem)", { marginTop: 10 })}>Haveli Panam</h1>
        </div>
        <Grain opacity={0.06} animate={false} />
      </div>
    </Section>
  );
}
