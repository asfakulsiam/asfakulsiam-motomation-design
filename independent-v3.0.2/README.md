# Independent rubric scoring of the v3.0.1 benchmark builds (for v3.0.2)

Evaluator: a separate subagent (model gpt_6_1_sol) that did not write the skill or build these sites.
Inputs: the four builds on `benchmarks/v3.0.1-runs` (`runs/03-b2b`, `runs/08-travel-booking`, `runs/12-paired/a-archival`, `runs/12-paired/b-poster`), scored with `evals/rubric.md` from rendered pixels (Playwright, 320/375/768/1440px) plus its own form, overflow and keyboard probes (`*.cjs` here).
Outputs: `SCORES.md` (rubric scores with reasons), `scores.json`, `pair-originality.*`, `*-evidence.json`, `shots/`.
Summary: 03-b2b not scored (all four rubric gates fail); 08 70/100; 12a 81/100; 12b 84/100; paired strict originality FAIL (composition 0.44, imagery 0.40, typography 0.44).
Limits: one evaluator, one run, headless Chromium only, no screen reader, no real devices. Report: `docs/VALIDATION-v3.0.2.md` on the PR branch `fix/v3.0.2-hardening`.
