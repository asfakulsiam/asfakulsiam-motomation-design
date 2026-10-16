// @motomation-section
// id: features-hotel-rooms
// kind: features
// archetype: room
// components: Grain
// what: The rooms as the upstairs gallery's row of arched doors, held still: one large arch for the room most guests ask for, four smaller arches beside it, each photograph cut to the arch and captioned with the one thing only that room has.
// signature: The arch mask is the house's own doorway shape; nothing moves here, so the courtyard developing above stays the page's only motion.
// mobile: One column; the large arch first, the others at full width below it.
// reduced-motion: Nothing here moves.
import { Grain } from "../components/backgrounds/grain";
import { Section, h, label, MUTED } from "./_shared";
import { haveli } from "./_imagery";

const ROOMS = [["1", "Neem Room", "The tree comes to the window at breakfast."], ["2", "Well Room", "Looks straight down into the courtyard well."], ["3", "Merchant's Room", "The original iron safe, now the wardrobe."], ["4", "Pigeon Room", "Under the dovecote; the quietest in the house."], ["5", "Tank Room", "A bath carved from one block of Chunar stone."]];

// each room drawn with what the caption names (principles/imagery.md §6), its own wall tone and window position
const ROOM_SUBJECT = ["neem", "well", "safe", "dovecote", "bath"] as const;
const WALLS = ["#ead9bf", "#e6d3c4", "#dfd2bd", "#ecdcc6", "#e2d8cc"];
const ARCH = "999px 999px 3px 3px";

export function FeaturesHotelRooms() {
  return (
    <Section id="features-hotel-rooms" title="The rooms">
      <p style={label}>Upstairs gallery · five of the seven rooms</p>
      <h2 id="features-hotel-rooms-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 32px" })}>Along the gallery.</h2>
      <div className="rooms-arches" style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) repeat(2, minmax(0, 1fr))", gap: "clamp(16px, 2.4vw, 32px)", alignItems: "start" }}>
        {ROOMS.map(([n, name, line], i) => (
          <figure key={n} style={{ margin: 0, display: "grid", gap: 12, gridRow: i === 0 ? "span 2" : undefined }}>
            <img src={haveli("room", 40 + i * 7, { wall: WALLS[i], ink: "#5a3220", light: "#f2c879" }, 800, i === 0 ? 1180 : 900, ROOM_SUBJECT[i])} alt={`${name} at Haveli Panam`} width={800} height={i === 0 ? 1180 : 900} loading="lazy" style={{ width: "100%", height: "auto", display: "block", borderRadius: ARCH }} />
            <figcaption><span style={{ ...label, color: MUTED }}>Room {n}</span><p style={h(i === 0 ? "2rem" : "1.4rem", { margin: "6px 0" })}>{name}</p><p style={{ margin: 0, color: MUTED }}>{line}</p></figcaption>
          </figure>
        ))}
        <Grain opacity={0.05} animate={false} />
      </div>
    </Section>
  );
}
