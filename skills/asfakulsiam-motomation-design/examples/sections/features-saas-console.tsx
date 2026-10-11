// @motomation-section
// id: features-saas-console
// kind: features
// archetype: console
// components: Terminal, AnimatedList
// what: For the developer side of a bookkeeping app: the real CLI session that exports a month of sales, next to the list of what arrives in the accountant's inbox as it runs.
// signature: The Console archetype shows the actual command and the actual result side by side, so the claim ("export in one line") is demonstrated, not stated.
// mobile: Terminal first, then the list, both full width; long commands wrap.
// reduced-motion: The session and the list are shown complete.
import { Terminal } from "../components/ui/terminal";
import { AnimatedList } from "../components/ui/animated-list";
import { Section, body, cols, h, label, LINE, MONO, SURFACE } from "./_shared";

export function FeaturesSaasConsole() {
  return (
    <Section id="features-saas-console" title="Export for your accountant">
      <p style={label}>For developers and accountants</p>
      <h2 id="features-saas-console-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 16px" })}>A month of sales, exported in one line.</h2>
      <p style={{ ...body, marginBottom: 36 }}>Tally's CLI writes VAT-ready files the NBR portal accepts, and mails your accountant a summary.</p>
      <div style={{ ...cols(320, 24), alignItems: "start" }}>
        <Terminal title="karim-store" lines={[{ cmd: "tally export --month 2026-09 --format nbr", out: "✓ 1,284 sales · ৳ 4,12,880 · VAT ৳ 61,932 → sep-2026-nbr.xml" }, { cmd: "tally send --to accountant", out: "✓ sent to m.hossain@hisab.bd" }]} />
        <AnimatedList itemStyle={{ padding: "12px 16px", borderRadius: 10, background: SURFACE, border: `1px solid ${LINE}`, fontFamily: MONO, fontSize: 13 }}>
          <span>sep-2026-nbr.xml · 212 KB</span><span>sales-by-day.csv · 30 rows</span><span>credit-book.pdf · 14 customers</span><span>summary: ৳ 4,12,880 net</span>
        </AnimatedList>
      </div>
    </Section>
  );
}
