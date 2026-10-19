# Validation of v3.0.1: v3.0.2 (2026-10-19)

v3.0.2 is a release-hardening pass on the findings of the independent v3.0.1 evaluation
([`evals/results/2026-10-18-v3.0.1-independent/`](../evals/results/2026-10-18-v3.0.1-independent/README.md)). It is not a
redesign: the v3 sequence, capability levels and gates are unchanged in shape. Every fix below has a regression fixture
or test that fails on the 3.0.1 code. No gate was loosened to make a build pass; where a check was wrong in a build's
favour (it passed something it should not have), it was tightened.

Evidence for this report: [`evals/results/2026-10-19-v3.0.2-validation/`](../evals/results/2026-10-19-v3.0.2-validation/README.md)
(text only). Builds and screenshots stay off `main`: the builds on branch
[`benchmarks/v3.0.1-runs`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs)
(unchanged), the independent evaluator's screenshots and raw evidence on branch
[`benchmarks/v3.0.2-scoring`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.2-scoring/independent-v3.0.2).

No new builds were generated for 3.0.2. Every before/after below re-runs the 3.0.1 and 3.0.2 checkers on the same four
v3.0.1 builds, so it shows what the checker now sees, not that the skill now produces better sites.

## Reported build defects: cause and layer

| Reported defect | Build | Verdict | Layer | What changed |
|---|---|---|---|---|
| Pages overflow 375px (a 481px layout) | 03-b2b | Confirmed. One cause: `div.header-cta` (nowrap CTAs), masked by `overflow-x: hidden` on the root, on 18 pages at 320 and 375px; plus `div.card` on `/docs` at 320px. | Application (generated code). Skill: the checker reported it as 12 unrelated failures, and the builder never ran J. | Layout sweep reports causes, not pages; handoff status enforcement. |
| `/contact` shows success without sending | 03-b2b | Confirmed. "Transmitting Inquiry…" on a timer, then "A specialist will contact you shortly"; no request, nothing stored, nothing disclosed. | Application. Skill: the product contract had no rule for operations that send nothing, and the checker gave a generic message. | Honest-state rule and check. |
| `/demo/confirmed` in sitemap, only reachable by a form | 03-b2b | A legitimate flow page, wrongly failed as an orphan. It is still indexable, which is an application note. | Checker limitation (skill). | Flow routes and declared deep links excused; orphans and 404 sitemap routes still fail. |
| Contact and subscription pages show success without a request | 12a, 12b | Not a defect. Contact says "Message checked locally. Nothing was sent."; subscription changes are saved in `localStorage` and survive a reload. | Checker defect (skill): every no-request form failed. | Forms read by what they did: browser-only, simulated, unavailable. |
| Checkout pending lasts ~121ms | 12a, 12b | Not a defect. `store.js` `pending()` waits 120ms with "Creating demo receipt…", the button disabled and `aria-busy`; the receipt says it is a locally saved demo. A labelled simulation; the delay adds nothing. | Generation choice. | `thinking/product-contract.md`: no artificial latency; a simulated step may complete at once. |
| Booking forms need manual journey validation | 08 | Done by keyboard (below) and by the 3.0.2 journey check. New finding: at 320px the check-out date field overflows by 11px on `/availability` and `/booking/dates`. | Application. 3.0.1 only laid out 375px and up. | 320px is now in the sweep. |

## Defects found during this validation

The independent evaluator and the before/after runs found more. Each is classified the same way.

| Finding | Build | Layer | Status |
|---|---|---|---|
| `GATE.md` claimed "All 3 core journeys connect without broken paths"; J never ran | 03-b2b | Skill: nothing tied the handoff note to what ran | Fixed: `handoff.mjs`; the real note is a rejected fixture |
| `/demo` confirms "Your Demonstration Request is Confirmed … a solutions engineer will contact you"; no request. My first 3.0.2 check called it "simulated (disclosed)" because the bare word "demo" counted as a disclosure on a site that sells demos. The evaluator caught it. | 03-b2b | Application defect; checker false negative (skill) | Fixed: a disclosure must say the operation is simulated ("demo only", "nothing was sent", "saved in this browser"); fixture `honest-ops/sales-demo.html` |
| "SOC 2 TYPE II AUDITED" in every footer; "2,400 refrigerated TEUs annually", "zero spoiled loads over 18 months" in an unlabelled case study | 03-b2b | Application; skill gap: `rules.md` forbade invented proof but nothing measured it | Fixed: `realism.mjs` fails unlabelled certifications and case-study statistics, once per claim |
| Links inside a closed `<details>` menu reported as a 422px layout cause | 08 | Checker false positive (skill), from the new 320px sweep | Fixed: unrendered content is skipped; fixture `layout-causes/a.html` |
| An external `target=_blank` attribution link read as "nothing changed after a tap" on the loaded 2-CPU machine (it passes alone) | 08 | Checker timing (skill) | Fixed: a real link gets up to 1.5s more to open a tab or navigate |
| Paired summary "PASS … 22 route(s) recomposed or partial" when 19 were partial; the strict every-axis test (rubric) fails at composition 0.44, imagery 0.40, typography 0.44 | 12a × 12b | Skill reporting; generation (shared header/footer slots, the same three-card product grid) | Reporting fixed: the summary counts partial routes apart and labels the pass structural only. The threshold logic is unchanged |
| At 200% zoom (720×450) five home-page navigation links are covered by the heading block | 12a | Application. Found only by the full gate, which the builder did not run | Not changed in the skill: the gate already measures it; this is the enforcement case |
| Body links at 4.10:1 contrast; malformed email accepted; "Download security overview" serves an SVG; skeleton shimmer never ends | 03-b2b | Application | Not changed in the skill: isolated build bugs, and the full gate's contrast axis already measures contrast. Listed so a rebuild can fix them |

The benchmark builds themselves were not edited: they are evidence, and the branch rules forbid rewriting it.

## Fixes and regression tests

| Fix | Files | Regression test |
|---|---|---|
| Handoff status from a gate record, never typed: VALIDATED, CONDITIONAL, NOT VALIDATED, REFERENCE; `--report` rejects overclaims | `scripts/handoff.mjs`, `scripts/gate.mjs`, `gates/handoff.md`, `gates/delivery-gate.md`, `templates/GATE.md` | `tests/gate/handoff.test.mjs`, `fixtures/handoff/` (no browser; in CI) |
| Honest operations: server-backed, browser-only, simulated, unavailable; `honest` and `duplicate` states | `scripts/journey.mjs`, `thinking/product-contract.md` | `fixtures/journey/honest-ops` in `tests/gate/journey.test.mjs` |
| Disclosure means a statement, not the word "demo" | `scripts/journey.mjs` | `honest-ops/sales-demo.html` |
| Layout causes at 320, 375, 768, 1440px; masked overflow found; scroll containers and unrendered content skipped | `scripts/journey.mjs` | `fixtures/journey/layout-causes`, `fixtures/journey/overflow` |
| Flow routes and `motomation:entry` deep links; orphans and 404 sitemap routes still fail | `scripts/journey.mjs` | `fixtures/journey/routes-entry` |
| New-tab links get time to open | `scripts/journey.mjs` | covered by the 08 re-run; no deterministic fixture (it is load-dependent) |
| Unsourced proof | `scripts/realism.mjs`, `gates/rules.md` | `tests/gate/completeness.test.mjs` (v3.0.2 realism block) |
| Pair summary honesty | `scripts/pair.mjs` | `tests/gate/pair.test.mjs` (pair summary checks) |
| Keyboard-only walker | `evals/keyboard-walk.mjs` | run on all four builds (below) |

## Final validation requirements

A build reaches **VALIDATED** only when the full gate (every axis including J) passed on the current files (hash
match) and J left nothing unverified. A J item it could not verify makes it **CONDITIONAL**, and the note must list each
exception. Development checks (`--journey`, `--rules`, `completeness.mjs`) never validate. On a constrained machine
the honest path is to run the development checks, then either run the full gate once at the end or hand off as NOT
VALIDATED with the reason (`gates/handoff.md`).

## Before and after on the v3.0.1 builds

Journey check (J), same builds, 3.0.1 scripts vs 3.0.2 scripts. Counts are failures per axis.

| Build | 3.0.1 | 3.0.2 | What remains is |
|---|---|---|---|
| 03-b2b | nav 1 · mobile 12 · forms 3 (16 missing) ([3.0.1](../evals/results/2026-10-19-v3.0.2-validation/journey/03-b2b-v3.0.1.txt)) | nav 0 · mobile 2 · forms 2 ([3.0.2](../evals/results/2026-10-19-v3.0.2-validation/journey/03-b2b-v3.0.2.txt)) | real: the header CTA and `/docs` card overflow, the `/contact` and `/demo` false confirmations |
| 08-travel-booking | pass (375px and up only; [v3.0.1 evaluation](../evals/results/2026-10-18-v3.0.1-independent/README.md)) | nav 0 · mobile 1 · forms 0; booking submit not verified by the check (the form rejects its filled dates) ([3.0.2](../evals/results/2026-10-19-v3.0.2-validation/journey/08-v3.0.2.txt)) | real: the 320px date field |
| 12a archival | forms 6, all false ([3.0.1](../evals/results/2026-10-19-v3.0.2-validation/journey/12a-v3.0.1.txt)) | pass; contact read as a labelled simulation, two subscription forms as browser-only saves ([3.0.2](../evals/results/2026-10-19-v3.0.2-validation/journey/12a-v3.0.2.txt)) | nothing; checkout not verified from a fresh browser (hidden behind an empty cart) |
| 12b poster | forms 6, all false ([v3.0.1 evaluation](../evals/results/2026-10-18-v3.0.1-independent/README.md)) | pass; same reading as 12a ([3.0.2](../evals/results/2026-10-19-v3.0.2-validation/journey/12b-v3.0.2.txt)) | same as 12a |

Handoff demonstration: full gate plus `handoff.mjs --report GATE.md`, run on copies of two builds (evidence untouched).

- **03-b2b:** the full gate fails ([output](../evals/results/2026-10-19-v3.0.2-validation/journey/03-b2b-full-gate-v3.0.2.txt)): 26 contrast failures below AA across widths,
  a 161px reflow at 320px, 19 targets under 24px, the two layout causes, both false confirmations, and the unsourced
  SOC 2 claim. `handoff: NOT VALIDATED`, and the builder's own `GATE.md` is **rejected** for its missing status line and
  for claiming "All 3 core journeys connect" ([handoff](../evals/results/2026-10-19-v3.0.2-validation/journey/03-b2b-handoff.txt)).
- **12a archival:** the full gate also fails, which the builder's rules-only run could not show
  ([output](../evals/results/2026-10-19-v3.0.2-validation/journey/12a-full-gate-v3.0.2.txt)): at 200% zoom (720×450) five navigation links on the home page are covered by
  the heading block (application-level, new finding). X also fails on five screenshots the v3.0.1 evaluator later added
  under `evaluator-walk/` without MEDIA.md rows: an artefact of the evidence folder, not of the build. J passes, with the
  checkout form not verified from a fresh browser. So even with zoom fixed the honest status would be CONDITIONAL, not
  VALIDATED. Its `GATE.md` is rejected for having no status line ([handoff](../evals/results/2026-10-19-v3.0.2-validation/journey/12a-handoff.txt)).


## Accessibility

- **Automated:** axe-core inside the gate's A axis (not re-run as a separate study here).
- **Keyboard-only (performed):** `evals/keyboard-walk.mjs` drove each build with Tab, Shift+Tab, Enter and Space (it does not type),
  never a pointer. All four: a skip link is the first stop, no focus traps, focus visible on every stop, no hidden
  focusable elements. Journey steps reached by keyboard (the tool's `✓` in this output meant reached, not completed; corrected in the final 3.0.2 tool, which needs `--expect`): 12a and 12b Shop → Sylhet Black → Add to cart → Cart → Checkout; 08 Check
  availability; 03-b2b Schedule Demo. The keyboard walk reaches each journey's form; the independent evaluator then
  completed the forms with Tab, Enter and Space only: the 08 booking, and the 12a/12b one-off and subscription checkouts.
  The B2B demo form needed ArrowDown for its native selects, so it does not meet a strict three-key completion test. Output: [`keyboard.txt`](../evals/results/2026-10-19-v3.0.2-validation/keyboard.txt).
- **Screen reader: not verified.** No NVDA, JAWS, VoiceOver or TalkBack was available. Nothing here claims a screen-reader
  result.

## Independent scoring

Evaluator: a separate agent (model gpt_6_1_sol) that did not write the skill or build the sites, scoring from rendered
pixels with [`evals/rubric.md`](../evals/rubric.md), plus its own form, overflow and keyboard probes.

| Build | Rubric | Notes |
|---|---|---|
| 03-b2b | not scored: all four gates fail | false confirmations, mobile overflow, invented proof, 4.10:1 links |
| 08-travel-booking | 70/100 | gates pass; 320px date-field overflow |
| 12a archival | 81/100 | gates pass; keyboard checkout completes |
| 12b poster | 84/100 | gates pass; designed reduced-motion fallback |
| 12a × 12b pair | strict difference test FAIL | composition 0.44, imagery 0.40, typography 0.44 (pass needs every axis under 0.40) |

Scores and reasons: [`SCORES.md`](../evals/results/2026-10-19-v3.0.2-validation/independent/SCORES.md). One evaluator, one
pass, four builds: not enough to claim a general improvement or regression, and these are 3.0.1 builds.

Provenance note: an earlier scoring pass in the session that produced this release (03-b2b 58, 08 79, 12a 80, 12b 83,
all gates passing) was made by an agent that could not view the screenshots, and its detailed sheet was lost before it
was committed. It is superseded by the scores above and not used anywhere.

## Checks run

Run on the final tree, Node 20, Playwright 1.59 Chromium, 2 CPUs.

| Check | Result |
|---|---|
| `scripts/check-repo.mjs` (links, versions, size: main 14.15 of 15 MB) | pass |
| `tests/gate/handoff.test.mjs` (17 checks, no browser) | pass |
| `tests/gate/journey.test.mjs` (42 checks: honest-ops, layout-causes, routes-entry, all earlier fixtures) | pass |
| `tests/gate/completeness.test.mjs` (incl. unsourced proof), `async-states`, `rulesets`, `node --test variety` | pass |
| `tests/gate/pair.test.mjs` (incl. summary wording), `originality`, `composition`, `richness`, `entrance-timing` | pass |
| `REQUIRE_BROWSER=1 scripts/check-fixtures.mjs`, `tests/components/rm-stills.test.mjs` | pass |
| `tests/repo/*` (size-guard, workflow-rules, memory), `tests/evals/*` (briefs-v6, turn-cap, run-meta, bench-cache, cost), `tests/templates/template-rules`, `tests/mcp/session` | pass |
| `scripts/build-dist.mjs`, `scripts/build-lite.mjs` (lite ~7,993 tokens, target 8,000) | rebuilt |
| Script smoke (collide, search, contrast, `node --check` on changed scripts) | pass |
| J on the four v3.0.1 builds, full gate + handoff on two, keyboard walk on four | results above |
| Not run here (unchanged areas, left to CI): React example type-check, gallery gate timeout, tall-page watchdog, component interaction suites, docs site build | skipped |

## Not verified, and next steps

- Screen readers, real phones and tablets, Safari and Firefox (Chromium only), real backends.
- No v3.0.2 builds: the next step is to regenerate the four v6 briefs with 3.0.2 and score them with a separate evaluator.
- The paired-direction threshold: decide whether a partial route should fail `pair.mjs`, now that the summary says it
  does not meet the rubric's test.
- The new-tab timing fix has no deterministic fixture.
- `realism.mjs` proof detection is pattern-based: it finds certifications and case-study statistics, not invented logos,
  awards or quotes.
