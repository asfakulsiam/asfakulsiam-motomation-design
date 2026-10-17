# CRITIQUE.md · Tannery Row Coffee

## Measured

- gate.mjs (final run, `GATE.md`): C4[restraint:changed1] H5[375:0] S5[last5:none,self-excluded] R3[cuts:1,anim:1] M5[t1:pins0/2,webgl0/1,js16/30KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:24/24,tgt:0f11w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · journey: nav0 mobile0 forms0 loading- errors0 session0 → PASS
- contrast.mjs: 0 failures (ink 14.47:1, ink-2 5.80:1, red 6.13:1 on paper; 5.11:1 and 5.40:1 on paper-2)
- performance: 16 KB gzipped JS beyond the framework, 101 KB Next.js runtime (gate structure line); photos 31 to 142 KB WebP
- originality.mjs: not run (no earlier build to compare with)

## Judged

- self (opinion): C 4 · R 3 (counted from my own Restraint Gate record)
- self (opinion): Verdict: a credible, distinctive small café site; the broadsheet and the cup cross-section carry the identity, and the facts the brief asks for are in the first screen on every width.
- self (opinion): Top 3 problems:
  1. Front page photo (by eye): a home kitchen counter with cookbook spines, not a café; it weakens "the room". Fix: the shop's own counter photo (`MEDIA.md`).
  2. The focal check warns on screen 2 at 375 (see Measured, gate advisory: 1.01×): the "Find us" block and the photo compete. Fix: let the hours table lead that screen and push the photo below the first column.
  3. The cup for a filter coffee is a single brown block (by eye): the signature says least where the brew bar is the point. Fix: show the bloom and the drawdown as two stages, or the ratio as a scale beside the glass.
- self (opinion): AI-default scan by eye, motion and keyboard by hand: tab order follows the masthead, page, footer; drink buttons are toggles with `aria-pressed`; reduced motion removes the rule draw and the pour.
- judge (opinion): none
- self (opinion): Keep: the open-now folio line · the counter-as-menu layout · the credited placeholder captions. Next command: /polish on the front page's second screen.

## Not verified

- No human approved checkpoints 1 to 6 live (see `DESIGN.md` → Checkpoint log)
- No independent judge
- Real devices, screen readers and Lighthouse: not run
