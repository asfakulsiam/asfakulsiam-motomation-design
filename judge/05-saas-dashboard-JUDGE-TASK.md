# Independent judge task

You are an independent evaluator. You did not write the skill and did not build the site. Your job is to verify the builder's claims and judge the result. Be adversarial: try to find defects; do not trust the builder's reports.

## Inputs (read-only, do not edit anything in them)
- Build: /home/user/workspace/bench/runs/05-saas-dashboard/ (final app in dist/, served by `node server.mjs` or as described in its README.md/RUN.md; use a port other than 4305, e.g. 4410, if 4305 is busy)
- Builder's claims: RUN.md, GATE.md, CHECKPOINTS.md, DESIGN.md in that folder
- Brief: /home/user/workspace/bench/05-saas-dashboard.md
- Skill used (v3.0.2, commit 52255c0): /home/user/workspace/bench/skill-52255c0/ (its scripts/ hold the checkers)
- Rubric: /home/user/workspace/asfakulsiam-motomation-design/evals/rubric.md (read only; do not edit the repository)
- Keyboard walk tool: /home/user/workspace/asfakulsiam-motomation-design/evals/keyboard-walk.mjs (read only; run it, do not edit)

## Output
Write only under /home/user/workspace/bench/judge/05-saas-dashboard/. No pushes, deployments, purchases or external submissions.

## Do
1. Serve the build yourself and re-run, with raw output saved: the skill's `scripts/gate.mjs --journey` (journey axis J; slow machine, use --timeout 900, run in the foreground), `scripts/completeness.mjs`, and `evals/keyboard-walk.mjs` (read its header for usage) on the core journeys.
2. Walk the three core journeys from the brief yourself in a real Chromium (Playwright is resolvable from /home/user/node_modules) at 1440px and 375px, including invalid input, empty states for a new account, the offline/error states and 404. Save your own screenshots to screens/.
3. Check the brief's bias probe (no hero, no scroll choreography, no editorial archetype inside the app) and content truth (no invented statistics, logos, testimonials).
4. Apply the rubric: the four gates first (Product integrity, Usability, Accessibility, Content truth: PASS/FAIL each, with evidence), then the six axes 1–5 with the weighted total only if all gates pass.
5. Also give 1–5 with one-line evidence on: journey completeness, information architecture, responsive usability, motion quality and restraint, content realism, technical reliability.

## Report
Write SCORES.md with: your model identity if exposed (else "not exposed"); the commands you ran with exit codes; each gate verdict with evidence paths; axis scores; every disagreement between your findings and the builder's claims; defects found; what you could NOT verify and why. Also write scores.json with the gate verdicts and axis scores. Never invent a result. If a check failed to run, say so.

Reply with the four gate verdicts, the weighted total (or "not scored"), the top 3 defects, and the path to SCORES.md.
