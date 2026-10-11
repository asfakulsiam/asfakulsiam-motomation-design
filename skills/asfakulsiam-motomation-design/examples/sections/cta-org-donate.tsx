// @motomation-section
// id: cta-org-donate
// kind: cta
// archetype: manifesto
// components: ClickSpark, useConfetti
// what: The donation ask states what each amount pays for (a watcher's month, a survey day, a court filing); choosing an amount sparks, and a completed gift gets one burst of confetti and a sentence naming what it bought.
// signature: Amounts are tied to real costs from the audited budget; the celebration happens once, for the real success, and the sentence carries it.
// mobile: Amounts are a two-column grid of large buttons.
// reduced-motion: No sparks or confetti; the confirmation sentence is the same.
import { useState } from "react";
import { ClickSpark } from "../components/micro/click-spark";
import { useConfetti } from "../components/ui/confetti";
import { Section, body, cols, h, label, ACCENT, INK, LINE } from "./_shared";

const AMOUNTS = [[1500, "pays a river watcher for a month"], [4000, "covers a survey day on the Turag"], [12000, "files one case in the High Court"]] as const;

export function CtaOrgDonate() {
  const [pick, setPick] = useState(0), [done, setDone] = useState(false);
  const fire = useConfetti();
  return (
    <Section id="cta-org-donate" title="Give">
      <p style={label}>Give · 92% goes to the bank, not the office</p>
      <h2 id="cta-org-donate-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 28px" })}>Pay for a hearing.</h2>
      <div role="radiogroup" aria-label="Amount" style={cols(200, 12)}>
        {AMOUNTS.map(([amt, what], i) => (
          <ClickSpark key={amt} color={ACCENT}>
            <button type="button" role="radio" aria-checked={pick === i} onClick={() => setPick(i)} style={{ width: "100%", textAlign: "left", padding: "18px 20px", borderRadius: 10, border: `1.5px solid ${pick === i ? INK : LINE}`, background: pick === i ? "rgba(181,64,31,.08)" : "transparent", font: "inherit", color: "inherit", cursor: "pointer" }}>
              <span style={h("1.8rem")}>৳ {amt.toLocaleString("en-IN")}</span><span style={{ display: "block", marginTop: 6 }}>{what}</span>
            </button>
          </ClickSpark>
        ))}
      </div>
      <button type="button" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setDone(true); fire({ x: r.left + r.width / 2, y: r.top }); }} style={{ marginTop: 24, padding: "16px 28px", borderRadius: 999, border: 0, background: INK, color: "var(--ground, #f4efe6)", font: "inherit", fontWeight: 600, cursor: "pointer" }}>Give ৳ {AMOUNTS[pick][0].toLocaleString("en-IN")} with bKash</button>
      <p role="status" style={{ ...body, marginTop: 16, minHeight: "1.6em" }}>{done ? `Thank you. Your ৳ ${AMOUNTS[pick][0].toLocaleString("en-IN")} ${AMOUNTS[pick][1]}. A receipt is on its way.` : ""}</p>
    </Section>
  );
}
