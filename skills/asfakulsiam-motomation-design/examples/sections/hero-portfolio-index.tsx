// @motomation-section
// id: hero-portfolio-index
// kind: hero
// archetype: index
// components: FlowingMenu, ImageTrail
// what: An individual's portfolio opens straight onto the index of work: the project list is the hero, set huge; each row floods with its own marquee on hover, and the cursor leaves a short trail of the work behind it.
// signature: The list is the hero, so the first thing a visitor does is choose a project; the image trail shows the work without a thumbnail grid.
// mobile: Rows stack at full width at a smaller size; the trail is off on touch (Image Trail is fine-pointer only) and rows open on tap.
// reduced-motion: Rows invert without the marquee; no trail.
import { FlowingMenu } from "../components/layout/flowing-menu";
import { ImageTrail } from "../components/cursor/image-trail";
import { Section, h, label, MUTED } from "./_shared";
import { cover } from "./_imagery";

const WORK = [
  { label: "Kantha Archive", href: "#kantha", marquee: "Identity · 2026 · Dhaka" },
  { label: "Rickshaw Signal", href: "#rickshaw", marquee: "Wayfinding · 2025" },
  { label: "Salt & Monsoon", href: "#salt", marquee: "Book design · 2025" },
  { label: "Night Market", href: "#night", marquee: "Motion · 2024" },
];
const trail = [1, 2, 3, 4, 5].map((i) => ({ src: cover(i, ["#e9dcc6", "#b5401f", "#1d3b4a"]), alt: "" }));

export function HeroPortfolioIndex() {
  return (
    <Section id="hero-portfolio-index" title="Selected work">
      <ImageTrail images={trail} size={180}>
        <p style={{ ...label, marginBottom: 18 }}>Farhana Rahman · designer · selected work 2024–2026</p>
        <h1 id="hero-portfolio-index-title" style={{ ...h("clamp(1rem, 1.4vw, 1.2rem)"), color: MUTED, marginBottom: 24 }}>Four projects, newest first.</h1>
        <FlowingMenu items={WORK} label="Projects" />
      </ImageTrail>
    </Section>
  );
}
