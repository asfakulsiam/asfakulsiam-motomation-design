// @motomation-section
// id: cta-saas-trial
// kind: cta
// archetype: console
// components: Typewriter, ShimmerButton
// what: The closing ask as the app's own first-run screen: a prompt types out the first sale a new shop will enter, under one primary button.
// signature: The CTA shows the first thing you'll do after clicking it, so the button's promise is concrete; only one action on the screen.
// mobile: Prompt and button stack; the button is full width.
// reduced-motion: The prompt line is complete; the button has no glint.
import { Typewriter } from "../components/text/typewriter";
import { ShimmerButton } from "../components/ui/shimmer-button";
import { Section, h, label, MONO } from "./_shared";

export function CtaSaasTrial() {
  return (
    <Section id="cta-saas-trial" title="Start" dark>
      <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 28, textAlign: "center", justifyItems: "center" }}>
        <p style={{ ...label, color: "inherit", opacity: 0.7 }}>Your first sale, tomorrow morning</p>
        <Typewriter as="p" text="› চা ২ কাপ ৩০  → Tea, 2 cups, ৳ 30 · saved" style={{ fontFamily: MONO, fontSize: "clamp(1rem, 2.4vw, 1.5rem)", margin: 0 }} />
        <h2 id="cta-saas-trial-title" style={h("clamp(2.2rem, 5vw, 4rem)")}>A free month. No card.</h2>
        <ShimmerButton href="#signup" tone="#f4efe6" ink="#1d1a16" shine="rgba(181,64,31,.35)">Open my shop's ledger</ShimmerButton>
      </div>
    </Section>
  );
}
