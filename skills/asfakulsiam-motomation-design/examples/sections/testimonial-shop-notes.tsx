// @motomation-section
// id: testimonial-shop-notes
// kind: testimonial
// archetype: catalogue
// components: StickerScatter
// what: Buyers' notes, pinned like the cards that come back in the post, with the plate they're about; clicking a note scatters a few small kiln stamps around it.
// signature: These are the actual notes customers mail back, each tied to an object number; the stamps are the studio's real kiln marks.
// mobile: Notes stack in one column; tapping scatters stamps.
// reduced-motion: No scatter; notes are plain.
import { StickerScatter } from "../components/micro/sticker-scatter";
import { Section, cols, h, label, MONO, MUTED } from "./_shared";

const NOTES = [["No. 12-03", "We eat off it every day and it's still the first thing guests pick up.", "Anika, Chattogram"], ["No. 13-11", "The bowl arrived with a tiny ash spot. It's my favourite part.", "Sami, Sylhet"], ["No. 14-02", "Bought one plate in 2024; came back for the set.", "Rehana, Dhaka"]];

export function TestimonialShopNotes() {
  return (
    <Section id="testimonial-shop-notes" title="Notes from buyers">
      <p style={label}>Notes sent back</p>
      <h2 id="testimonial-shop-notes-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>What arrives in the post after a plate does.</h2>
      <div style={cols(240, 22)}>
        {NOTES.map(([no, text, who], i) => (
          <StickerScatter key={no} stickers={["◉", "✳", "◈"]} count={5}>
            <figure style={{ margin: 0, padding: "24px 22px", background: "#fffdf7", boxShadow: "0 8px 22px rgba(0,0,0,.08)", transform: `rotate(${(i - 1) * 1.4}deg)`, borderRadius: 3 }}>
              <p style={{ fontFamily: MONO, fontSize: 12, color: MUTED, margin: 0 }}>{no}</p>
              <blockquote style={{ margin: "12px 0", fontFamily: "var(--font-display, serif)", fontSize: "1.35rem", lineHeight: 1.3 }}>{text}</blockquote>
              <figcaption style={{ color: MUTED }}>{who}</figcaption>
            </figure>
          </StickerScatter>
        ))}
      </div>
    </Section>
  );
}
