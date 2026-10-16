// @motomation-section
// id: hero-event-poster
// kind: hero
// archetype: poster
// components: Beams, SplitFlap
// what: A one-night jazz concert's page is a poster: stage light falling through a high window, the title as heavy condensed type, and the date on a split-flap board.
// signature: One screen holds everything a poster would (what, when, where, price); the stage light is the venue's real clerestory, and the flap board is the date, not a countdown gimmick.
// mobile: Title stacks on three lines; the date board wraps under it; the light is the still poster on low-end phones.
// reduced-motion: Still light, final date, the same title.
import { Beams } from "../components/backgrounds/beams";
import { SplitFlap } from "../components/type/split-flap";
import { Section, label, DISPLAY } from "./_shared";

// the poster keeps its own night colours whatever the page theme is: paper-white type under stage light
const POSTER = "#f6eedd";

export function HeroEventPoster() {
  return (
    <Section id="hero-event-poster" title="Monsoon Jazz Night" bleed style={{ background: "#07060c", color: POSTER }}>
      <div style={{ position: "relative", minHeight: "92svh", display: "grid", alignContent: "end", gap: 28, padding: "clamp(28px, 6vw, 80px)" }}>
        <Beams />
        <p style={{ ...label, color: POSTER, position: "relative" }}>Shilpakala Academy, National Theatre Hall · doors 19:00 · ৳ 800–2,500</p>
        <h1 id="hero-event-poster-title" style={{ position: "relative", margin: 0, color: POSTER, fontFamily: DISPLAY, fontWeight: 800, fontStretch: "75%", fontSize: "clamp(3rem, 12vw, 10rem)", lineHeight: 0.86 }}>MONSOON<br />JAZZ NIGHT</h1>
        <div style={{ position: "relative" }}><SplitFlap value="SAT 14 NOV" cellStyle={{ fontSize: "clamp(1.4rem, 3.4vw, 2.4rem)" }} /></div>
      </div>
    </Section>
  );
}
