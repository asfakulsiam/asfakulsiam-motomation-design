// @motomation-section
// id: team-event-lineup
// kind: team
// archetype: stage
// components: VelocityMarquee, FlowingMenu
// what: The night's lineup: a marquee of every musician's name that leans with scroll speed, then the four sets in running order, each row flooding with the players' instruments on hover.
// signature: The running order is the information concert-goers want (who, when), and the marquee is the house's billboard; the people, not a "lineup" graphic.
// mobile: The marquee keeps running at its base speed; sets are full-width rows that open on tap.
// reduced-motion: The marquee is a static line of names; rows invert without the flowing text.
import { VelocityMarquee } from "../components/scroll/velocity-marquee";
import { FlowingMenu } from "../components/layout/flowing-menu";
import { Section, h, label } from "./_shared";

export function TeamEventLineup() {
  return (
    <Section id="team-event-lineup" title="Lineup">
      <VelocityMarquee separator=" · " items={["Shayan Chowdhury Arnob", "Armeen Musa", "Rafa Quartet", "Bunty Bhai", "Sumi Akand", "Dhaka Big Band"]} style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2rem, 6vw, 4.6rem)" }} />
      <p style={{ ...label, margin: "48px 0 12px" }}>Running order</p>
      <h2 id="team-event-lineup-title" style={h("clamp(1.8rem, 4vw, 3rem)", { marginBottom: 20 })}>Four sets, one interval.</h2>
      <FlowingMenu label="Running order" items={[{ label: "19:30 · Rafa Quartet", href: "#tickets", marquee: "piano · double bass · drums · tenor sax" }, { label: "20:20 · Sumi Akand", href: "#tickets", marquee: "voice · harmonium · tabla" }, { label: "21:30 · Armeen Musa & guests", href: "#tickets", marquee: "voice · guitar · cello" }, { label: "22:20 · Dhaka Big Band", href: "#tickets", marquee: "seventeen players" }]} />
    </Section>
  );
}
