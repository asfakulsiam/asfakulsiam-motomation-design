// @motomation-section
// id: cta-personal-subscribe
// kind: cta
// archetype: letter
// components: RotatingWords
// what: The sign-up at the foot of the letter: which edition (English, Bangla or both), one email field, and a line whose last words name what the next letters are about.
// signature: The ask is written as a postscript in the letter's voice; the topics rotating are the real next three letters.
// mobile: The edition choices wrap; field and button stack full width.
// reduced-motion: The first topic, still.
import { useState } from "react";
import { RotatingWords } from "../components/text/rotating-words";
import { Section, h, label, INK, LINE } from "./_shared";

export function CtaPersonalSubscribe() {
  const [sent, setSent] = useState(false), [edition, setEdition] = useState("English");
  return (
    <Section id="cta-personal-subscribe" title="Subscribe to the letters" hideTitle>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 20 }}>
        <p style={label}>P.S.</p>
        <RotatingWords as="h2" before="Next: " words={["umbrella repairers", "a sign painter", "the harp maker"]} after="." style={h("clamp(1.6rem, 3.6vw, 2.6rem)", { lineHeight: 1.15, margin: 0 })} wordStyle={{ fontStyle: "italic" }} />
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <fieldset style={{ flex: "1 1 100%", display: "flex", flexWrap: "wrap", gap: "4px 20px", margin: 0, padding: 0, border: 0 }}><legend style={{ ...label, marginBottom: 6 }}>Which edition</legend>
            {["English", "Bangla", "Both"].map((x) => <label key={x} style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, cursor: "pointer" }}><input type="radio" name="edition" value={x} checked={edition === x} onChange={() => setEdition(x)} style={{ width: 24, height: 24, accentColor: INK }} />{x}</label>)}
          </fieldset>
          <label style={{ flex: "1 1 240px", minWidth: 0, display: "grid", gap: 6 }}><span style={label}>Your email</span><input type="email" required autoComplete="email" style={{ padding: "14px 16px", borderRadius: 8, border: `1.5px solid ${LINE}`, font: "inherit", background: "transparent", color: "inherit", width: "100%", minWidth: 0 }} /></label>
          <button type="submit" style={{ alignSelf: "end", padding: "14px 22px", borderRadius: 8, border: 0, background: INK, color: "var(--ground, #f4efe6)", font: "inherit", fontWeight: 600, cursor: "pointer" }}>Send me the letters</button>
        </form>
        <p role="status" style={{ margin: 0, minHeight: "1.6em" }}>{sent ? `Thank you. No. 38 arrives on 1 November${edition === "Both" ? ", in both languages" : edition === "Bangla" ? ", in Bangla" : ""}.` : ""}</p>
      </div>
    </Section>
  );
}
