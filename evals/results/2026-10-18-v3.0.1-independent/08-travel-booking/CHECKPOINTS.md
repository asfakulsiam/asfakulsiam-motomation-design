# Six checkpoints

Run policy: no human is present. Each question is recorded and explicitly self-approved as the benchmark instructs. The input skill is read-only.

## 1 · Stack
Shown: functional frontend using static HTML, CSS and vanilla JavaScript, with generated HTML per route and a Node 20 static server on port 4301. Native form controls, CSS feedback, localStorage booking persistence. No package installation or runtime framework. Alternative: Next.js adds a build/dependency step forbidden by this brief; React with Vite offers no necessary capability here.
Conflict: the skill's Next.js default yields to the explicit no-install/static delivery constraint.
Question: Checkpoint 1 of 6: approve, redirect, or ask for alternatives.
Answer: SELF-APPROVED. Continue.

## 2 · Product contract
Shown: DESIGN.md Product contract and Scope, before creating a concept. All requested pages and all three journeys retained; six individually comparable rooms; real date selection and validation; guest count, guest details, itemised review, local confirmation, experience addition and getting-there instructions.
Admin: not included because this is a guest-facing functional frontend. Payment and channel sync are deferred with visible interfaces on review and availability respectively. Fictional content, rates and policies will be clearly demo-labelled. No exact guesthouse address or phone number is invented.
Question: Checkpoint 2 of 6: approve, redirect, or ask for alternatives.
Answer: SELF-APPROVED. Continue to design research.

## 3 · Research and direction
Shown: DESIGN.md Research record, fetched public references, three compared directions, source limitations and decision trace. Chosen tea-garden field notes with booking-desk clarity. Gelasio/DM Sans, paper ground and dark tea green, small clay accent, no signature animation. Library shimmer button rejected as wrong for a quiet paper-like brand; native controls adopted.
Research changed the room index to include bed/access facts and made the external map opt-in for data savings. No competitor booking completion, hidden route or responsive behaviour is claimed.
Question: Checkpoint 3 of 6: approve, redirect, or ask for alternatives.
Answer: SELF-APPROVED. Continue.

## 4 · Build plan
Shown: DESIGN.md route-family section order/component decisions/mobile layout and MOTION.md. Static HTML routes will share accessible navigation and footer; booking steps share progress, error summary and stay summary. Native inputs plus inline calendar; local drafts and reservations persisted; optional experiences flow into itemised totals. Responsive stacked layouts at 375 and a two-column task layout at 1440. Only meaningful Tier 1 feedback.
Question: Checkpoint 4 of 6: approve, redirect, or ask for alternatives.
Answer: SELF-APPROVED. Begin implementation.

## 5 · Design review
Shown: local preview http://localhost:4301, all 13 core-journey state captures at 375, 768 and 1440 in screens/, plus mobile 404; DESIGN.md, MOTION.md, MEDIA.md, SCHEMA.md and DATA.md. QA output: `QA PASS: 9 core-journey completions; 24 route responses; 40 screenshots; 239 assertions; 0 uncaught browser errors.`
Review: full booking completes with itemised total and persisted local confirmation; experience selection and removal work; confirmation links to arrival. Inspected home, mobile selected calendar, mobile review/confirmation, desktop calendar and room index, tablet details. A stale consent error after checking the box was found and fixed before the final captures; long room picker text was shortened.
One-line summary: a quiet, complete guesthouse frontend with direct room comparison and an honest local booking flow.
Question: Checkpoint 5 of 6: approve, redirect, or ask for alternatives.
Answer: SELF-APPROVED for required checks. No full-gate or production-ready claim.

### 5 · Follow-up review after rule corrections
Shown: rule-only findings and revised preview. The first experience index image is eager, and the optional map is constructed with DOM methods rather than inserting a string. The second rule run reports zero copy, SEO, performance or security errors on all 24 routes, with the JSON-LD advisory retained. Temporary generated media now uses explicit placeholder-prefixed filenames; no image contents are lost or presented as real property evidence. Contact captures are scrolled to the top before full-page capture to avoid Chromium's fixed-element capture artifact.
Question: approve the revised preview for the final permitted checks?
Answer: SELF-APPROVED. Re-run the light journey evidence and required checks on these final paths.

## 6 · Gate and ship
Shown: GATE.md with every actual rule-only route verdict and verbatim completeness, realism, core QA and edge QA output; CRITIQUE.md separates measured evidence, self-attributed opinion and what remains unverified.
Actual final verdicts:
```
  X — completeness (travel-booking, Bangladesh, admin panel: no) [functional frontend]  ✓
  Content realism  ✓
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
RULES CHECK EXIT: 0
QA PASS: 9 core-journey completions; 24 route responses; 40 screenshots; 239 assertions; 0 uncaught browser errors.
EDGE QA PASS: 41 assertions, including blocked nights, long stays, overlap, removal, contact pending/error/success, storage denial and palette math.
```
The rule verdict is repeated for all 24 routes in GATE.md. Advisories remain: no JSON-LD; eleven generated media files need clearance/replacement for production. The full gate and --journey did not run, exactly as the benchmark requires; no all-axis pass or stamp is asserted.
Critique: keep room comparison, the quiet split opening and itemised booking desk. Before real use, replace illustrative room media, verify the property address/map pin and obtain full accessibility/performance evidence.
Handoff: /home/user/workspace/bench/runs/08-travel-booking/, with local git branch design/travel-booking. No remote handoff push: the user specified a folder-only benchmark, supplied no remote, and prohibited the full gate that normally precedes a shipping push. Supplementary private preview, if available, is recorded in RUN.md; the benchmark server is stopped after checks.
Question: Checkpoint 6 of 6: approve this honest functional-frontend handoff, or redirect?
Answer: SELF-APPROVED. Deliver the folder and measured verdicts; do not imply production readiness.

Supplementary preview outcome: the deployment tool rejected localStorage use in its iframe. No preview URL was created. Self-approved retaining the brief's required persistent booking rather than replacing it with nonpersistent state. The local folder remains the handoff.
