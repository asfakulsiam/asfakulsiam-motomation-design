// @motomation-section
// id: team-event-lineup
// kind: team
// archetype: stage
// components: WidthSprint, FlowingMenu
// what: The night's lineup: a billboard headline that stretches wider the faster you scroll (the font's width axis), every musician's name in one line, then the four sets in running order, each row flooding with the players' instruments on hover.
// signature: The running order is the information concert-goers want (who, when); the headline stretching with your scroll speed is the night's one loud gesture, set in the poster's own variable face.
// mobile: The headline stays inside the screen at its widest; sets are full-width rows that open on tap.
// reduced-motion: The headline stays at its base width; rows invert without the flowing text.
import { WidthSprint } from "../components/type/width-sprint";
import { FlowingMenu } from "../components/layout/flowing-menu";
import { Section, h, label, MUTED } from "./_shared";

export function TeamEventLineup() {
  return (
    <Section id="team-event-lineup" title="Lineup">
      <p style={{ ...label, margin: "0 0 12px" }}>Running order</p>
      <WidthSprint id="team-event-lineup-title" text="Four sets" base={72} max={112} style={h("clamp(2.4rem, 9vw, 7rem)", { marginBottom: 14 })} />
      <p style={{ margin: "0 0 24px", maxWidth: "60ch", color: MUTED }}>Shayan Chowdhury Arnob · Armeen Musa · Rafa Quartet · Bunty Bhai · Sumi Akand · Dhaka Big Band. One interval, 21:00 to 21:30.</p>
      <FlowingMenu label="Running order" items={[{ label: "19:30 · Rafa Quartet", href: "#tickets", marquee: "piano · double bass · drums · tenor sax" }, { label: "20:20 · Sumi Akand", href: "#tickets", marquee: "voice · harmonium · tabla" }, { label: "21:30 · Armeen Musa & guests", href: "#tickets", marquee: "voice · guitar · cello" }, { label: "22:20 · Dhaka Big Band", href: "#tickets", marquee: "seventeen players" }]} />
    </Section>
  );
}
