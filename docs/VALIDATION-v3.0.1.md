# Validation of v3.0.0: v3.0.1 (2026-10-18)

v3.0.0 (`docs/AUDIT-v3.md`) listed what it had not verified and what to do next. v3.0.1 does those items: fixes for
the defects they confirmed, each with a regression test that fails on the previous code, and builds by agents that
did not write the skill. Evidence: [`evals/results/2026-10-18-v3.0.1-independent/`](../evals/results/2026-10-18-v3.0.1-independent/README.md).
Full sites and screenshots: branch [`benchmarks/v3.0.1-runs`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs)
(snapshot [`9b12f0e`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/9b12f0e24109676f74bc30476e947f70c01249a5)).

## v3.0.0 open items, and what v3.0.1 found

| v3.0.0 item | v3.0.1 result |
|---|---|
| Independent runs of the v6 briefs by other models | Done for 03-b2b (gemini_3_8_flash), 08-travel-booking and the 12a/12b pair (gpt_6_1_sol). Not scored with the rubric by a separate judge; the verdicts below are the scripts' and the evaluator's walk. |
| Paired builds shared markup | Rebuilt from one contract by one builder: `pair.mjs` PASS, 0 shared presentation files, 22/22 route parity, 3 routes recomposed, 19 partial. Side-by-side screenshots show two distinct directions; the partial scores come from shared header/footer slots and the same three-card product grid. |
| Memory fingerprint for `archetype: none` | Fixed (see CHANGELOG 3.0.1). |
| Journey form sampling (first 12 pages only) | Fixed; fixture `many-pages`. |
| V axis entrance timing | Fixed; `tests/gate/entrance-timing.test.mjs`. |
| Screen reader pass | Not verified. Still open. |

## Checker defects the benchmarks exposed (all fixed, each with a fixture)

| Defect | Seen in | Effect before | Fixture |
|---|---|---|---|
| A page wider than the phone read as unrelated tap fails | 03-b2b | 58 "nothing changed" fails instead of one layout cause | `journey/overflow` |
| A form that rejects the auto-filled values read as failed | 08-travel-booking | 6 fails on the booking calendar | `journey/strict-form` |
| Static server ignored clean URLs (`/shop` → `shop.html`) | 12-paired | 19 of 22 routes "unreachable" | `journey/clean-urls` |
| Control disabled by an earlier tap was tapped | 12-paired | 3 tap fails | `journey/live-and-locked` |
| `confirm()` dialog not counted as a response | 12-paired | 1 tap fail | same |
| Live filter (no submit control) checked as a submit flow | 12-paired | 4 state fails | same |
| Disabled-until-complete submit, save-then-next-route read as native submit | 12-paired builder, 03-b2b /demo | 4 state fails (builder), 3 (/demo) | same |
| Checkout hidden behind an empty cart | 12-paired | 2 fails instead of "walk it by hand" | same |
| Invalid fields counted after a form reset itself | 12-paired | a local fake success read as "rejected the fill" (masked a real finding) | covered by the final runs |
| `pair.mjs` header "of undefined" | 12-paired | display only | none |

Each fixture was run on the previous code and failed (`live-and-locked`: 11 missing; `clean-urls`: nav 1/3), and
passes now. `tests/gate/journey.test.mjs`: all 33 checks pass. The other gate tests (composition, richness,
entrance-timing, originality, pair, completeness, async-states, rulesets, variety) and `scripts/check-repo.mjs`
pass on the same tree.

## Build defects the benchmarks found (real, reported, not fixed: they belong to the builds)

- 03-b2b: every page lays out at 481px in a 375px viewport; /contact shows "Inquiry Received" without sending
  anything; /demo/confirmed is in the sitemap but only reachable through the form.
- 12-paired (both directions): /contact and /account/subscription show success with no request. The contact form
  says so honestly; it is still not a working contact flow. The checkout's pending state lasts 121 ms.
- 08-travel-booking: none found; the booking forms need a hand walk (the builder's QA, re-run by the evaluator, passes).

## Why defects reached handoff

Builders were told not to run the full gate or `--journey` (2 shared CPUs). The skill's workflow runs `--journey`
before handoff; with it, 03-b2b's overflow and the paired contact flows would have been caught by the builders.

## Not verified

- Screen reader and keyboard-only walks.
- Rubric scores by an independent judge.
- In-place, browser-only state changes (a subscription pause saved in `localStorage`) are still read as "no request";
  the checker accepts browser-only flows only when they move to another page. Whether that should change is open.
