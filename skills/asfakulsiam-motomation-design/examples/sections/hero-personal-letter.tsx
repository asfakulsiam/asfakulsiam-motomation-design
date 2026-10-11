// @motomation-section
// id: hero-personal-letter
// kind: hero
// archetype: letter
// components: Typewriter, Thread
// what: A writer's personal site opens as a letter: the salutation types itself, the body is set like a page, and a single ink line draws down the margin to the signature as you read.
// signature: The Letter archetype is the promise of the newsletter itself (one letter a month), so the homepage is the first letter; the thread is the pen moving down the page.
// mobile: The page is full width with a narrower measure; the thread runs in the left margin.
// reduced-motion: Salutation complete; the line is drawn in full.
import { Typewriter } from "../components/text/typewriter";
import { Thread } from "../components/scroll/thread";
import { Section, body, h, label, ACCENT, DISPLAY } from "./_shared";

const MARGIN = "M50 0 C 80 140, 20 260, 50 400 S 80 640, 50 760 S 30 930, 50 1000";

export function HeroPersonalLetter() {
  return (
    <Section id="hero-personal-letter" title="Letters from Nusrat">
      <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(20px, 5vw, 48px) 1fr", gap: "clamp(12px, 3vw, 28px)" }}>
      {/* the pen line has its own margin column, so it never crosses the text */}
      <Thread color={ACCENT} strokeWidth={1.5} path={MARGIN} style={{ height: "100%" }}><span /></Thread>
      <div>
        <p style={{ ...label, marginBottom: 32 }}>Letters from Nusrat · No. 37 · October</p>
        <Typewriter as="h1" text="Dear reader," style={h("clamp(2rem, 4.6vw, 3.4rem)", { fontStyle: "italic" })} />
        <div style={{ display: "grid", gap: "1em", marginTop: 28 }}>
          <p style={body}>I've written to you once a month for three years now, mostly about the people who make things by hand in this city and what they told me while they worked.</p>
          <p style={body}>This month: a bookbinder in Banglabazar who has bound every edition of one poet since 1974, and won't read any of them.</p>
          <p style={body}>If you'd like the next letter, there's a box at the bottom of this one.</p>
        </div>
        <p style={{ fontFamily: DISPLAY, fontSize: "2rem", fontStyle: "italic", marginTop: 36 }}>— Nusrat</p>
      </div>
      </div>
    </Section>
  );
}
