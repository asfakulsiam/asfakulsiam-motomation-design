// @motomation-section
// id: hero-org-manifesto
// kind: hero
// archetype: manifesto
// components: ScrollFloat, InkFill
// what: A rivers charity opens with its argument, not its logo: one large sentence floats up word by word, then the paragraph that follows inks in as you read it.
// signature: The Manifesto's speech rhythm: the visitor reads the whole case before seeing a donate button, which is why the button later converts.
// mobile: The statement wraps to four or five lines at a smaller size; the paragraph is full width.
// reduced-motion: Statement and paragraph appear fully set.
import { ScrollFloat } from "../components/type/scroll-float";
import { InkFill } from "../components/type/ink-fill";
import { Section, h, label } from "./_shared";

export function HeroOrgManifesto() {
  return (
    <Section id="hero-org-manifesto" title="River Commons">
      {/* the organisation is the page's h1 (small, as a label); the argument is the first h2, set large */}
      <h1 id="hero-org-manifesto-title" style={{ ...label, marginBottom: 32 }}>River Commons · a public trust for Bangladesh's rivers</h1>
      <ScrollFloat as="h2" text="A river is not a drain, a road, or a border. It is a neighbour, and it is owed a hearing." style={h("clamp(2.4rem, 6vw, 5.4rem)", { lineHeight: 1.04, maxWidth: "20ch" })} />
      <InkFill as="p" text="Bangladesh has more than seven hundred rivers. Around a hundred have died in living memory, filled, fenced or poisoned. Since 2019 the courts have recognised rivers as living entities. We exist to make that ruling mean something on the bank: we survey, we go to court, and we pay local people to watch their water." style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", lineHeight: 1.45, maxWidth: "46ch", marginTop: 48 }} />
    </Section>
  );
}
