// @motomation-section
// id: hero-hotel-room
// kind: hero
// archetype: room
// components: DarkroomDevelop, Grain
// what: A small heritage hotel's first screen is split like a register page and a print: the name stacked at the top left, the house's line at the foot, and the courtyard photograph on the right developing from blank paper as you scroll.
// signature: The courtyard appears the way an old photograph does in the tray, pale first, then tone; it is the only motion on the page, so it's remembered, and it says the house is old before any copy does.
// mobile: The photograph comes first at full width (4:5), the stacked name below it; the develop still runs on scroll.
// reduced-motion: The photograph is fully developed from the start; nothing else on the page moves.
import { DarkroomDevelop } from "../components/scroll/darkroom-develop";
import { Grain } from "../components/backgrounds/grain";
import { Section, h, label, MUTED } from "./_shared";
import { haveli } from "./_imagery";

export function HeroHotelRoom() {
  return (
    <Section id="hero-hotel-room" title="Haveli Panam" bleed>
      <div className="hotel-split" style={{ position: "relative", minHeight: "100svh", display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)", alignItems: "stretch" }}>
        <div style={{ position: "relative", display: "grid", alignContent: "space-between", gap: 18, padding: "8vh clamp(20px, 4vw, 64px) 8vh" }}>
          <div style={{ display: "grid", gap: 18 }}><p style={label}>Sonargaon · seven rooms · since 1898</p>
          <h1 id="hero-hotel-room-title" style={h("clamp(3.2rem, 8.4vw, 8rem)", { display: "grid" })}><span>Haveli</span><span>Panam</span></h1></div>
          <p style={{ margin: 0, maxWidth: "30ch", color: MUTED }}>A merchant's house on Panam Nagar Road, kept as seven rooms around one courtyard, a well and a neem tree.</p>
        </div>
        <div style={{ position: "relative", minHeight: "70svh" }}>
          <DarkroomDevelop src={haveli("courtyard", 31, { wall: "#e9d8bd", ink: "#5a3220", light: "#f2c879" }, 1200, 1500)} alt="The courtyard at Haveli Panam in the late afternoon, with the well and the neem tree" width={1200} height={1500} loading="eager" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <Grain opacity={0.06} animate={false} />
      </div>
    </Section>
  );
}
