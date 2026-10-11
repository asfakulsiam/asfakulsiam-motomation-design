// @motomation-section
// id: gallery-shop-carousel
// kind: gallery
// archetype: shelf
// components: CurveCarousel
// what: The rest of the firing on a curved shelf: plates and bowls stand in an arc you drag or arrow through, each with its object number and price.
// signature: The Shelf archetype puts the products in a physical arrangement; the curve is the kiln shelf they came off.
// mobile: The arc stays; you swipe or use the arrow buttons; square cards keep the caption inside the shelf height.
// reduced-motion: No arc motion; a flat, scrollable row.
import { CurveCarousel } from "../components/layout/curve-carousel";
import { Section, art, h, label, MONO, MUTED, SURFACE } from "./_shared";

const PIECES = [["14-01", "Dinner plate", "৳ 3,400"], ["14-03", "Rice bowl", "৳ 1,900"], ["14-05", "Serving dish", "৳ 5,200"], ["14-08", "Tea cup", "৳ 1,100"], ["14-10", "Pitcher", "৳ 4,600"], ["14-12", "Side plate", "৳ 2,200"]];

export function GalleryShopCarousel() {
  return (
    <Section id="gallery-shop-carousel" title="The rest of batch 14">
      <p style={label}>Batch 14 · fired 2 October</p>
      <h2 id="gallery-shop-carousel-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>The rest of the shelf.</h2>
      <CurveCarousel label="Pieces from batch 14" cardWidth={260} spread={0.95} items={PIECES.map(([no, name, price], i) => (
        <figure key={no} style={{ margin: 0, padding: 10, background: SURFACE, borderRadius: 14, boxShadow: "0 10px 24px rgba(0,0,0,.08)" }}>
          <img src={art(200 + i * 11, ["#ddd6c8", i % 2 ? "#a8643a" : "#7f9a8a", "#f1ece2"], 520, 470)} alt={`${name}, No. ${no}`} width={520} height={470} style={{ display: "block", width: "100%", height: "auto", borderRadius: 10 }} />
          <figcaption style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}><span><span style={{ fontFamily: MONO, fontSize: 12, color: MUTED }}>{no}</span> {name}</span><span>{price}</span></figcaption>
        </figure>
      ))} />
    </Section>
  );
}
