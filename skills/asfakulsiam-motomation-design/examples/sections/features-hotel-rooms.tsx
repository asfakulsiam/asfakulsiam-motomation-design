// @motomation-section
// id: features-hotel-rooms
// kind: features
// archetype: room
// components: HorizontalReel
// what: The seven rooms as a horizontal walk along the gallery: vertical scroll moves you sideways from door to door, each frame a room with its one detail.
// signature: Walking past the rooms in order, the way the upstairs gallery runs, is the Room archetype's corridor; each frame names one thing only that room has.
// mobile: Frames are 85% of the screen wide; the reel becomes a horizontal swipe.
// reduced-motion: Frames become a normal horizontal scroller (no scroll-jacking).
import { HorizontalReel } from "../components/scroll/horizontal-reel";
import { Section, art, h, label, MUTED } from "./_shared";

const ROOMS = [["1", "Neem Room", "The tree comes to the window at breakfast."], ["2", "Well Room", "Looks straight down into the courtyard well."], ["3", "Merchant's Room", "The original iron safe, now the wardrobe."], ["4", "Pigeon Room", "Under the dovecote; the quietest in the house."], ["5", "Tank Room", "A bath carved from one block of Chunar stone."]];

export function FeaturesHotelRooms() {
  return (
    <Section id="features-hotel-rooms" title="The rooms" bleed>
      <div style={{ padding: "clamp(56px, 9vw, 120px) clamp(20px, 5vw, 72px) 24px" }}>
        <p style={label}>Upstairs gallery · seven rooms</p>
        <h2 id="features-hotel-rooms-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { marginTop: 12 })}>Walk the gallery.</h2>
      </div>
      <HorizontalReel frameWidth="min(85vw, 560px)" frames={ROOMS.map(([n, name, line], i) => (
        <figure key={n} style={{ margin: 0, display: "grid", gap: 12 }}>
          <img src={art(40 + i * 7, ["#ead9bf", "#8a4b2a", "#e9b45f"], 1120, 800)} alt={`${name} at Haveli Panam`} width={1120} height={800} style={{ width: "100%", height: "auto", display: "block", borderRadius: 4 }} />
          <figcaption><span style={{ ...label, color: MUTED }}>Room {n}</span><p style={h("1.6rem", { margin: "6px 0" })}>{name}</p><p style={{ margin: 0, color: MUTED }}>{line}</p></figcaption>
        </figure>
      ))} />
    </Section>
  );
}
