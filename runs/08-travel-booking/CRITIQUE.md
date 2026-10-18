# CRITIQUE · Srimangal Hills Guesthouse · 2026-10-18

## Measured

The final browser evidence is in `checks/qa.log` and `checks/edge-qa.log`; rule-only results for each route are pasted in GATE.md.

```
QA PASS: 9 core-journey completions; 24 route responses; 40 screenshots; 239 assertions; 0 uncaught browser errors.
EDGE QA PASS: 41 assertions, including blocked nights, long stays, overlap, removal, contact pending/error/success, storage denial and palette math.
```

The edge QA printed six palette contrast ratios and the final combined JavaScript gzip size; these are reproduced without alteration in GATE.md. This is not a rendered-pixel contrast audit or a performance trace. The completeness checker warns about eleven generated assets requiring replacement or clearance before production; all are now explicitly placeholder-prefixed.

## Judged

self (opinion) Verdict: the calm guesthouse identity survives the transition to a compact, readable booking desk without replacing the actual booking journey with a contact link.

self (opinion) Top 3 problems, most important first:

1. Illustrative room images cannot verify the proposed beds or room differences — where: `data/catalog.json` and MEDIA.md, especially Family veranda and Quiet corner — why it matters: a real guest could infer a wrong room layout from a photograph — evidence: by eye; generated sources explicitly documented in MEDIA.md. Fix before a real launch: obtain one approved, accurate photograph for each of the six rooms and replace every flagged image.
2. The map is intentionally only town orientation — where: `/getting-there`, `build.mjs` arrival section — why it matters: it cannot support the final leg of an actual guest arrival — evidence: by eye; no property address supplied in the brief. Fix before a real launch: obtain the verified address and property coordinates, then replace the town-only disclosure and pin; never guess them.
3. No independently measured full craft gate or assistive-technology signoff — where: GATE.md Not verified — why it matters: local Chromium assertions do not establish broad accessibility or production performance. Fix next: let the evaluator run the prohibited full scan, then test real mobile devices and screen-reader navigation.

self (opinion) AI-default scan: checks 1–25 reviewed by eye, not a tool score. No decorative gradient, glass panel, icon-feature row, testimonial wall, scroll reveal or custom cursor was needed. Familiar header navigation and grouped footer links (#5) are retained to expose the complete guest-facing IA. Generated tea-garden imagery (#12) is directly related to the brief and visibly disclosed. The only external customer-facing domain (#17) is the researched OpenStreetMap map/attribution provider. Do not confuse these reasoned choices with a measured originality pass.

self (opinion) Restraint Gate:
- Large home headline — Q1 hierarchy pass · Q2 calm family-run character pass → kept.
- Photographic split — Q1 place/storytelling pass · Q2 tea-garden setting pass → kept.
- Clay room numbers — Q1 sequence/wayfinding pass · Q2 printed room-folio feel pass → kept.
- Native date inputs beside calendar — Q1 reliable task input pass · Q2 no identity need → kept for the product.
- Explicit demo notices — Q1 capability clarity pass · Q2 honest fictional-client identity pass → kept despite their visual cost.
- Opt-in town map — Q1 arrival orientation pass · Q2 required map interface pass → kept, not a fabricated property pin.
- Animated shimmer, cinematic scrolling and decorative entrances — Q1 fail · Q2 fail → cut.

self (opinion) Motion: only short press feedback and state changes. No entrance hides content. Reduced-motion content was exercised by browser QA; Tier 3–5 choreography is not applicable.

self (opinion) Keyboard and focus: the skip link was exercised by the QA script; the calendar, radios, checkboxes and forms remain native keyboard controls. No issue was identified in the inspected focused/error screens. This is not an exhaustive keyboard audit.

judge (opinion) None. No independent judge model was invoked.

self (opinion) Keep: the flat comparable room index; the split tea-garden opening; itemised booking summaries and explicit local-only confirmation.

self (opinion) Next command: evaluator full gate, then replace illustrative media and verify the real arrival information before contemplating production.

## Not verified

No H/M/V/Q/A/S scores, C/R counts, full gate stamp, gate journey axis or originality score were generated. The benchmark explicitly prohibits the full scan and `--journey`; no substitute score is claimed.

No physical-device or Safari/Firefox run; no screen reader, 200% text zoom audit, exhaustive focus order, rendered-pixel contrast scan, Core Web Vitals, real map-tile availability or production load test. No real payment, email, inventory or channel integration exists or was tested. The generated photographs and proposed room/policy data are not approved real-property evidence.
