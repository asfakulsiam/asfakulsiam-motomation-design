# Builder task (independent benchmark run)

You are an independent builder in a benchmark of an agent design skill. You did not write the skill. Follow it as an ordinary user's coding agent would.

## Inputs (read-only, do not edit)
- Skill: /home/user/workspace/bench/skill-52255c0/  (Motomation Design v3.0.2, commit 52255c0, skill tree a2b4c4f13d9e025bceeef39bece2423be4a2c705). Start with SKILL.md and follow it.
- Brief: /home/user/workspace/bench/05-saas-dashboard.md

## Output
Everything you write goes under /home/user/workspace/bench/runs/05-saas-dashboard/ only. Never touch /home/user/workspace/asfakulsiam-motomation-design (the skill's repository) or any other folder. No git push, no deployment, no publishing, no purchases, no external form submissions. Prefer no package installs: Node 20, Playwright and Chromium are preinstalled and resolvable from /home/user/node_modules.

## Task
Build the signed-in Ledgerly app described in the brief as a functional frontend (localStorage persistence; auth and bank sync labelled as deferred with their interface kept), following the skill's full route. The brief's product contract counts as the approved checkpoint answers: where the skill asks the user to approve a checkpoint, record your answer in CHECKPOINTS.md and continue without waiting. Do research as the skill instructs (web search is available) and record sources with URLs.

## Validation
Run the skill's own validation commands for real against your build (serve it on a local port, e.g. 4305): scripts/completeness.mjs, scripts/gate.mjs (full gate including the journey axis J; slow on this 2-CPU machine, use generous timeouts such as --timeout 900 and run long commands in the foreground), and scripts/handoff.mjs. Fix what fails within reason (time budget about 90 minutes total). Save every command's raw output under checks/.

## Report
Write RUN.md with: model identity if your runtime exposes it (otherwise "not exposed"; do not guess); start and end times; the exact commands run with their real exit codes and output excerpts; the handoff status computed by handoff.mjs; known defects; everything NOT VERIFIED and why. Keep DESIGN.md, MOTION.md, MEDIA.md and CHECKPOINTS.md as the skill requires. Take 1440px and 375px screenshots of each core journey step into screens/. Never claim a check passed unless its output shows it. An independent judge will verify your claims later.

When done, reply with the handoff status, the path to RUN.md, and a 5-line summary.
