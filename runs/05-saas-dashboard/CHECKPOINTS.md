# Ledgerly checkpoints

The benchmark explicitly treats the brief as approved checkpoint answers and instructs continuing without waiting. These are benchmark approvals, not claims of a human visual review.

## 1. Stack
Approved by benchmark instruction. Native HTML/CSS/JavaScript with Node static route server, no package installs. Chosen exception to Next default: strictly browser-only persistence, dependency budget, no backend or SSR benefit, locally served independent benchmark. The vanilla adapter was read. React+Vite would give reusable components at build/tooling cost; Next would give server architecture intentionally outside the contract. All routes ship static entry files with a shared renderer. Conflict: website skill's SQLite/storage restriction yields to explicit localStorage requirement; its deploy requirement yields to explicit no-deployment instruction.

## 2. Product contract
Approved before concept implementation. Preserve sign-in, dashboard, expense form/saved, invoice list/editor/preview/sent, transactions/filter/detail, customers, settings profile/business/notifications, empty/error/offline/404. Sort/filter/paginate transactions; persist every data mutation to localStorage. Authentication and bank sync deferred, interfaces retained and labelled. No admin, marketing, payments or legal-public-site scope; this is a local fictional signed-in app. Full scope is in DESIGN.md.

## 3. Research and direction
Approved by benchmark. A warm working ledger selected over a dark terminal and a guided task inbox. SERVICE STYLE, 16px reading text, tabular numerals, forest status and ochre/orange action accent. Calm conventional navigation wins over invention. No signature, scroll storytelling, hero or decorative media. Research record, alternatives, applicability and limitations in DESIGN.md and craft/research.md.

## 4. Build plan
Approved by benchmark. Shared app shell with desktop side rail and visible wrapping mobile nav; routes have title/actions followed by data or forms. Native inputs/select/date/dialog and semantic tables are adopted platform primitives; task panels, summary chart, filter controller and storage module are custom built. Reuse all across routes. CSS opacity/transform feedback only, <=140ms, instant under reduced motion. Mobile forms stack; tables become labelled compact record rows without losing fields or actions. MOTION.md records rationale.

## 5. Design review
Benchmark pre-approval applies to the local preview/review pack; no external user has reviewed it. Screenshots and browser findings are recorded in checks and screens. Review status and actual changes are appended after rendering.

## 6. Gate and ship
Benchmark pre-approval is not a passing gate. Actual computed handoff, failures, warnings and limitations will be appended after validation. No push or deployment per user restriction.

## Checkpoint 5 actual review record
Local preview at http://localhost:4305. The three core journeys were browser-tested and captured at 375, 768 and 1440px; 27 numbered full-page steps per width and matching viewport captures include additional edge states. A separate storage-write failure capture is included at 375px. Contact sheets and representative full-size views were read visually.

Changes from review: 12px caption floor; clearing corrected-field error treatment; skip-link clipping/offscreen positioning; allocation of extra mobile navigation width to Transactions; 320px wrapping; 44px avatar/period/summary targets and 28px data-management link; explicit forced-color table text; dedicated compact 404; History API navigation so local offline saves finish without a new document request. No animation was added to delay data entry.

Latest explicit journey browser run: checks/journeys-06.log, exit 0, 2026-10-19T05:42:08.925Z–05:42:24.998Z. Expanded tests: checks/extended-03.log, exit 0, 2026-10-19T05:42:02.238Z–05:42:08.847Z. These are development evidence, not a replacement for the full gate or a human approval.

## Checkpoint 6 progress
Full gate 01 actually returned exit 1; its output remains unchanged in checks/full-gate-01.log. Corrections are recorded above and in DESIGN.md. Full gate 02 was launched with all axes, including J, and --timeout 900. Its result is not assumed; final computed status and limitations are recorded in GATE.md and RUN.md after it finishes. A local-only source/evidence commit was created (0c509d3); nothing was pushed, deployed or externally submitted.

## Checkpoint 5 final refresh
The final source's three core journeys were rerun at 375/768/1440 in `checks/journeys-08.log` (exit 0, 2026-10-19T06:03:48.537Z–06:04:04.431Z). Extended checks in `checks/extended-04.log` also returned exit 0. Final contact sheets were regenerated in `checks/contact-sheets-final.log` (exit 0). Representative full-size captures and the review sheets were visually inspected; final amount ordering is based on the actual signed displayed value. This remains self-review under benchmark pre-approval, not human approval.

## Checkpoint 6 final measured handoff
Full gate 02 returned exit 1 because a closed disclosure's table cell remained measurable in forced colors; explicit closed-table layout hiding corrected it. Full gate 03 returned exit 0. After the final signed-sort/monogram/corrupt-sign-in integrity fixes, **full gate 04** was rerun from scratch, including J: exit 0, 2026-10-19T06:04:04.512Z–06:13:47.600Z, raw output `checks/full-gate-04.log`.

The real handoff command returned exit 0 and:

```text
handoff: VALIDATED · 16d0da5c7e61a36a · gate 2026-10-19 06:13 · journey: nav0 mobile0 forms0 loading- errors0 session0
```

The measured stamp was mechanically transcribed into both source and built CSS, not invented. `GATE.md` and `RUN.md` distinguish browser-only forms, sampling limits, warnings and everything not verified. The benchmark prohibits a handoff push: all output remains in this local folder, with no deployment, publishing or git push.

A subsequent actual `gate.mjs --verify` full re-scan, including J, returned exit 0 at 2026-10-19T06:23:37.223Z and printed `STAMP VERIFIED · critique and gate numbers match a fresh scan · gate PASS` (`checks/verify-stamp.log`). The actual `handoff.mjs --report GATE.md` check also returned exit 0 with `report OK` (`checks/handoff-report.log`). These are machine results, not an implied human sign-off.
