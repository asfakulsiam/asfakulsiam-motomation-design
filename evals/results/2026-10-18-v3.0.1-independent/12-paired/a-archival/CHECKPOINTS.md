# Leaf & Ledger · Quiet archival · checkpoints

Benchmark instruction authorizes self-approval; no human reviewer is present.

## Checkpoint 1 of 6: Stack
MOTOMATION PLAN
Rules: gates/rules.md read; designing within it.
Stack: static HTML/CSS/vanilla JS, Node 20 static server, named by brief → adapters/vanilla.md.
Alternatives: Next.js default rejected because user forbids installs; a client-only SPA rejected because real static routes simplify 404 and route discovery.
Would ask: approve, redirect, or ask for alternatives?
Self-approved 2026-10-18 before product contract.

## Checkpoint 2 of 6: Product contract
Would show: DESIGN.md Product contract and Scope, all 23 routes, three core journeys, persistent cart, builder and pause/skip. No admin.
Deferred: payments with /checkout interface; auth with /account demo; mail with /contact local acknowledgement.
Would ask: approve scope, routes, assumptions and explicit backend deferrals?
Self-approved 2026-10-18 before concept. No contract items removed.

## Checkpoint 3 of 6: Research and direction
Would show: DESIGN.md research record, three product references, case-study and botanical references, limitations, comparison of three directions.
Tension: rich provenance versus immediate purchase.
Concept: A living tea ledger.
Direction: A, mandated archive with specimen folio.
Dials: 1 / 2 / 1, Tier 1.
Type mode: HOUSE on marketing, SERVICE on operations; Fraunces / DM Sans.
Would ask: approve synthesis, or redirect within the given direction?
Self-approved 2026-10-18. C rejected because it loses brand specificity; other mandated direction delivered separately.

## Checkpoint 4 of 6: Build plan
Would show: MOTION.md; static routes; shared state/validation but separately authored HTML/CSS.
Home: opening folio, botanical plate, tea ledger, subscription note.
Shop: left filter rail and specimen grid; mobile stacked controls before results.
Detail: specimen, tea notes and purchase docket.
Plans: two ruled plan columns → builder with visible count and summary.
Cart/checkout/confirmation: compact docket and right summary; mobile form follows total with no obscured controls.
Account/management: account ledger and ruled change form; pause/skip use explicit save.
Stories/legal/contact/404: complete content and navigation in each direction.
Motion: Tier 1 ink/focus/press feedback; reduced-motion still retains complete interface.
Would ask: approve route-by-route build and mobile treatment?
Self-approved 2026-10-18 before implementation.

## Checkpoint 5 of 6: Design review
Would show: local preview http://localhost:4311, every core-journey step at 375, 768 and 1440 in screens/, plus DESIGN.md, MOTION.md, MEDIA.md, SCHEMA.md and DATA.md.
Summary: an airy botanical ledger with direct Shop, Cart and Account access, a filter rail and a compact purchase docket.
Reviewed actual home, builder and checkout captures at desktop/mobile. Both buying journeys and pause/resume/skip were clicked through with saved-state reload assertions.
Changes made: static folder/index route resolution for Account and Subscriptions; cart quantity now updates in place to avoid blur-triggered rerender recursion; disabled tea choice text remains legible.
Would ask: approve this design for the limited gate?
Self-approved 2026-10-18. The initial pair comparison reported four repeated-route scores, so feedback languages were differentiated: archival ink response versus poster physical movement. Final comparison must still be executed and recorded.

## Checkpoint 6 of 6: Gate and ship
Would show: GATE.md (raw outputs), CRITIQUE.md (measured / judged / not verified), final screenshots and SCREENS.md.
Actual permitted verdicts:
```text
bench/runs/12-paired/a-archival/DESIGN.md
Content realism  ✓
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
PASS  one product, 22 route(s) recomposed or partial, no shared presentation, routes and functions at parity
PASS lightweight frontend QA: all three journeys complete at 375, 768 and 1440; pause/skip persist; HTTP 404 verified.
```

Would ask: approve this local frontend handoff with its explicit unverified checks and deferred services?
Self-approved 2026-10-18T12:47:22.393Z. Only the benchmark's permitted checks are asserted. No full-gate stamp or production-readiness claim. The handoff remains in this benchmark output folder, not a remote branch: no remote push was requested, and no repository outside the output folders was touched. Local Git history records the completed benchmark handoff.
