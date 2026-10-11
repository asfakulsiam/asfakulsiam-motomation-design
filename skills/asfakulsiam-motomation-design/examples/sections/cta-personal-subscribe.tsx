// @motomation-section
// id: cta-personal-subscribe
// kind: cta
// archetype: letter
// components: RotatingWords, SquishSwitch
// what: The sign-up at the foot of the letter: one email field, a switch for the Bangla edition, and a line whose last words name what the next letters are about.
// signature: The ask is written as a postscript in the letter's voice; the topics rotating are the real next three letters.
// mobile: Field and button stack full width; the switch sits under them.
// reduced-motion: The first topic, still; the switch flips without squish.
import { useState } from "react";
import { RotatingWords } from "../components/text/rotating-words";
import { SquishSwitch } from "../components/micro/squish-switch";
import { Section, h, label, INK, LINE } from "./_shared";

export function CtaPersonalSubscribe() {
  const [sent, setSent] = useState(false), [bangla, setBangla] = useState(false);
  return (
    <Section id="cta-personal-subscribe" title="Subscribe to the letters" hideTitle>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 20 }}>
        <p style={label}>P.S.</p>
        <RotatingWords as="h2" before="Next: " words={["umbrella repairers", "a sign painter", "the harp maker"]} after="." style={h("clamp(1.6rem, 3.6vw, 2.6rem)", { lineHeight: 1.15, margin: 0 })} wordStyle={{ fontStyle: "italic" }} />
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <label style={{ flex: "1 1 240px", minWidth: 0, display: "grid", gap: 6 }}><span style={label}>Your email</span><input type="email" required autoComplete="email" style={{ padding: "14px 16px", borderRadius: 8, border: `1.5px solid ${LINE}`, font: "inherit", background: "transparent", color: "inherit", width: "100%", minWidth: 0 }} /></label>
          <button type="submit" style={{ alignSelf: "end", padding: "14px 22px", borderRadius: 8, border: 0, background: INK, color: "var(--ground, #f4efe6)", font: "inherit", fontWeight: 600, cursor: "pointer" }}>Send me the letters</button>
        </form>
        <SquishSwitch label="Bangla edition too" onChange={setBangla} />
        <p role="status" style={{ margin: 0, minHeight: "1.6em" }}>{sent ? `Thank you. No. 38 arrives on 1 November${bangla ? ", in both languages" : ""}.` : ""}</p>
      </div>
    </Section>
  );
}
