// @motomation-section
// id: pricing-saas-switch
// kind: pricing
// archetype: workbench
// components: SquishSwitch, GlowBorder
// what: Two plans and a monthly/yearly switch that squishes as it flips; the prices change in place, and the plan cards' edges light toward the pointer.
// signature: Only two plans, priced in taka per shop per month, with the saving shown as months free (how shopkeepers count), not a percentage.
// mobile: Cards stack; the switch stays above them; the glow rests as a faint border.
// reduced-motion: The switch flips without squish; prices swap instantly.
import { useState } from "react";
import { SquishSwitch } from "../components/micro/squish-switch";
import { GlowBorder } from "../components/ui/glow-border";
import { Section, cols, h, label } from "./_shared";

const PLANS = [{ name: "Shop", m: 299, y: 2990, has: ["One shop, two phones", "Credit book and stock", "bKash and Nagad reconciled"] }, { name: "Chain", m: 899, y: 8990, has: ["Up to five shops", "NBR VAT export", "Accountant login"] }];

export function PricingSaasSwitch() {
  const [yearly, setYearly] = useState(false);
  return (
    <Section id="pricing-saas-switch" title="Pricing" dark>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 20, marginBottom: 36 }}>
        <div><p style={{ ...label, color: "inherit", opacity: 0.7 }}>Pricing</p><h2 id="pricing-saas-switch-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { marginTop: 12 })}>Two plans. Two months free yearly.</h2></div>
        <SquishSwitch label="Pay yearly" onChange={setYearly} />
      </div>
      <div style={cols(280, 14)}>
        {PLANS.map((p) => (
          <GlowBorder key={p.name}>
            <div style={{ padding: "30px 26px", color: "#f1e9da", display: "grid", gap: 16 }}>
              <h3 style={h("1.8rem")}>{p.name}</h3>
              <p style={{ margin: 0 }} aria-live="polite"><span style={h("3rem")}>৳ {(yearly ? p.y : p.m).toLocaleString("en-IN")}</span> <span style={{ color: "#c9bfae" }}>/ {yearly ? "year" : "month"}</span></p>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#d8cfbf", lineHeight: 1.7 }}>{p.has.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </GlowBorder>
        ))}
      </div>
    </Section>
  );
}
