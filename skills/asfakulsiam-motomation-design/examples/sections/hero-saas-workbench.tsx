// @motomation-section
// id: hero-saas-workbench
// kind: hero
// archetype: workbench
// components: DeviceMockup, RotatingWords, ShimmerButton
// what: A bookkeeping app for small shops opens on the app itself: the real ledger screen in a browser frame, with one sentence whose last words name who it's for.
// signature: The product is the hero (Workbench): the visitor reads a real day's sales in the frame before any claim. The rotating words are the actual customer types, not adjectives.
// mobile: The frame drops below the sentence at full width; the screen is a normal scroll area.
// reduced-motion: The first customer type, still; the screen doesn't glide.
import { DeviceMockup } from "../components/ui/device-mockup";
import { RotatingWords } from "../components/text/rotating-words";
import { ShimmerButton } from "../components/ui/shimmer-button";
import { Section, body, cols, h, label, ACCENT, LINE, MONO } from "./_shared";

const SALES = [["09:10", "Rice, 5 kg", "৳ 420"], ["09:42", "Mustard oil, 1 L", "৳ 210"], ["10:05", "Lentils, 2 kg", "৳ 290"], ["10:31", "Tea, 400 g", "৳ 185"], ["11:02", "Sugar, 1 kg", "৳ 135"], ["11:48", "Credit: Rahim (paid)", "৳ 1,200"]];

export function HeroSaasWorkbench() {
  return (
    <Section id="hero-saas-workbench" title="Tally">
      <div style={{ ...cols(340, 48), alignItems: "center" }}>
        <div style={{ display: "grid", gap: 22 }}>
          <p style={label}>Tally · bookkeeping in Bangla and English</p>
          <RotatingWords as="h1" before="The day's accounts, closed in a minute, for " words={["grocers", "pharmacies", "tea stalls", "tailors"]} after="." style={h("clamp(2.2rem, 5vw, 4.2rem)", { lineHeight: 1.05 })} wordStyle={{ color: ACCENT, fontStyle: "italic" }} />
          <p style={body}>Type a sale as you'd say it. Tally keeps the credit book, the stock and the bKash payments in one ledger, offline first.</p>
          <div><ShimmerButton href="#pricing-saas-switch">Start a free month</ShimmerButton></div>
        </div>
        <DeviceMockup kind="browser" url="tally.app/today" label="Today's ledger in Tally" tall>
          <div style={{ padding: 18, fontFamily: MONO, fontSize: 13, color: "#1d1a16" }}>
            <p style={{ margin: "0 0 12px", fontWeight: 700 }}>Today · Karim Store</p>
            {[...SALES, ...SALES].map(([t, item, amt], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderTop: `1px solid ${LINE}` }}><span>{t}</span><span style={{ flex: 1 }}>{item}</span><span>{amt}</span></div>)}
          </div>
        </DeviceMockup>
      </div>
    </Section>
  );
}
