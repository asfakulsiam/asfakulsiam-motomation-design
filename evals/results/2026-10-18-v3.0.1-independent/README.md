# v3.0.1 independent benchmark runs (2026-10-18)

Builds by agents that did not write the skill, following a frozen copy of it. This folder holds the text evidence.
The full sites and screenshots are on the orphan branch [`benchmarks/v3.0.1-runs`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs)
(snapshot [`9b12f0e`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/9b12f0e24109676f74bc30476e947f70c01249a5)), kept off the main line for the size budget.
Evaluator outputs (`*.txt`) were produced afterwards by the v3.0.1 scripts, not by the builders. Report: [`docs/VALIDATION-v3.0.1.md`](../../../docs/VALIDATION-v3.0.1.md).

## Assets (benchmark branch)

| Run | Site | Screenshots | Evaluator extras |
|---|---|---|---|
| 03-b2b | [runs/03-b2b](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/03-b2b) | [screens](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/03-b2b/screens) | none |
| 08-travel-booking | [runs/08-travel-booking](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/08-travel-booking) | [screens](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/08-travel-booking/screens) | none (builder QA re-run, text only) |
| 12-paired a-archival | [runs/12-paired/a-archival](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/a-archival) | [screens](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/a-archival/screens) | [checkout walk](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/a-archival/evaluator-walk) |
| 12-paired b-poster | [runs/12-paired/b-poster](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/b-poster) | [screens](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/b-poster/screens) | [checkout walk](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/b-poster/evaluator-walk) |
| 12-paired a vs b | | [side by side at 1440px](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/compare) | |

## Results

| Run | Brief | Builder model | Skill version | Completeness X | Realism | Journey J (final scripts) | Other |
|---|---|---|---|---|---|---|---|
| 03-b2b | `evals/briefs/v6/03-b2b.md` | gemini_3_8_flash | 226085d (v3.0.0) | ✓ 17/17 routes | ✓ | ✗ 16 missing ([journey-final.txt](03-b2b/journey-final.txt)) | |
| 08-travel-booking | `evals/briefs/v6/08-travel-booking.md` | gpt_6_1_sol | 226085d (v3.0.0) | ✓ ([completeness.txt](08-travel-booking/completeness.txt)) | ✓ | ✓ PASS ([journey.txt](08-travel-booking/journey.txt)) | builder QA re-run ✓ 239 assertions ([qa-rerun-by-evaluator.txt](08-travel-booking/qa-rerun-by-evaluator.txt)) |
| 12-paired a-archival | `evals/briefs/v6/12a` | gpt_6_1_sol | v3.0.1 working tree | ✓ 19/19 | ✓ | ✗ 6 missing ([journey.txt](12-paired/a-archival/journey.txt)) | checkout walk ✓ 9/9 ([checkout-walk.txt](12-paired/a-archival/checkout-walk.txt)) |
| 12-paired b-poster | `evals/briefs/v6/12b` | gpt_6_1_sol | v3.0.1 working tree | ✓ 19/19 | ✓ | ✗ 6 missing ([journey.txt](12-paired/b-poster/journey.txt)) | checkout walk ✓ 9/9 ([checkout-walk.txt](12-paired/b-poster/checkout-walk.txt)) |
| 12-paired a × b | | | | | | | `pair.mjs --max 30` ✓ PASS ([pair.txt](12-paired/pair.txt), [pair.json](12-paired/pair.json); raw output, its "of undefined" header is the display bug fixed afterwards) |

Builders were told not to run the full gate or `--journey` (2 shared CPUs); the evaluator ran them afterwards. That
condition is why journey defects reached handoff: the skill's own workflow runs `--journey` before handoff.

## 03-b2b, evaluator findings

- completeness X ✓ (17/17 routes, 3/3 journeys), content realism ✓ (`completeness.txt`).
- journey J ✗ (`journey-final.txt` = final v3.0.1 scripts; `journey.txt` = v3.0.1 scripts before the overflow fix; `journey-old.txt` = v3.0.0 scripts):
  - every page lays out at 481px in a 375px viewport (`div.header-cta`, and an 818px table on /pricing). Before the
    v3.0.1 overflow fix the check reported this as 58 unrelated "nothing changed after a tap" fails.
  - forms: /contact shows "Inquiry Received" without any request (loading, success, server error ✗). /demo was read as
    a native submit by earlier scripts; it is a script that shows "Scheduling Evaluation..." and moves to
    /demo/confirmed, now read as loading ✓ and success ✓, server error not verified (no request is made).
  - /demo/confirmed is listed in sitemap.xml but only reachable by submitting the form.

## 08-travel-booking, evaluator findings

- completeness X ✓, content realism ✓, journey J ✓ PASS with the final scripts (nav, mobile, forms, errors, session all 0 missing).
- The two booking forms (/availability, /booking/dates) reject the check's auto-filled dates ("Check-out must be after
  check-in."), so their loading, success and server error states are "not verified", not passed. The builder's own
  journey test covers them by hand: the evaluator re-ran `checks/qa.mjs` against the site's own server and it passed
  (room booking, experience addition, confirmation to arrival at 375, 768 and 1440px; 239 assertions; 0 browser errors).
- `journey-before-form-fix.txt`: the same site under v3.0.0 scripts, where the rejected fill read as 6 fails.

## 12-paired (Leaf & Ledger, one contract, two directions), evaluator findings

- Completeness ✓ and realism ✓ for both directions (19/19 routes, 3/3 journeys, 4/4 functions, 4/4 legal).
- Pair: `pair.mjs --max 30` PASS. One product, 22 shared routes, 0 shared presentation files, routes and functions
  at parity. 3 routes fully recomposed, 19 "partial" (composition at or above 0.4). The [side-by-side
  screenshots](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/compare)
  show clearly different directions (botanical ledger vs. bold poster); the partial scores come from the shared
  structure: the same header/footer slots and the same three-card product grid on home and shop.
- Journey, three passes on each direction (all kept):
  1. `journey-1-before-clean-url-fix.txt`: 19 of 22 routes unreachable. The sites link `/shop` for `shop.html`; the
     gate's own static server did not answer clean URLs (its `pair.mjs` sibling did). Checker defect, fixed.
  2. `journey-2-before-hidden-form-fix.txt`: nav ✓ 22/22. Remaining fails were checker false positives, fixed with
     fixture `fixtures/journey/live-and-locked`: tea checkboxes disabled once the plan is full (tapped anyway), a
     "Reset demo data" button guarded by `confirm()` (dialog not counted), a live shop filter with no submit button
     (checked as a submit flow), a builder whose submit stays disabled until complete and which saves in the browser
     then moves to /checkout (read as a native submit), and a checkout hidden behind an empty cart (failed instead of
     "walk it by hand").
  3. `journey.txt` (final): nav ✓, mobile ✓ (80/80 and 78/78 taps), errors ✓, session ✓; forms ✗ 6 missing, a real
     finding: /contact and /account/subscription show success without any request. The contact form says so
     ("Message checked locally. Nothing was sent. Email delivery is not connected in this demonstration."); the
     subscription change is saved only in the browser. A demo with no backend, honestly labelled, but not a working
     contact flow. (An intermediate run read these as "rejected the filled values" because the form resets itself
     after its local success; the final scripts count invalid fields right after the submit.)
- Checkout walk ([checkout-walk.mjs](12-paired/checkout-walk.mjs), 375px, fresh browser), both directions 9/9: empty-cart
  state hides the form; add a tea; empty submit shows a designed error and marks 6 fields; a valid submit shows
  "Creating demo receipt…" with `aria-busy` (for only 121 ms, then the next page); /confirmation shows a receipt
  reference; the cart empties; the receipt survives a reload; no uncaught errors.
