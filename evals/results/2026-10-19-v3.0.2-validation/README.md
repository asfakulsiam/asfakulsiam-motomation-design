# v3.0.2 validation evidence (2026-10-19)

Text evidence for [`docs/VALIDATION-v3.0.2.md`](../../../docs/VALIDATION-v3.0.2.md). The builds are the four v3.0.1
benchmark builds on branch [`benchmarks/v3.0.1-runs`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs)
(not changed). Screenshots and the evaluator's raw evidence are on branch
[`benchmarks/v3.0.2-scoring`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.2-scoring/independent-v3.0.2),
kept off `main`.

| File | What it is |
|---|---|
| `journey/*-v3.0.1.txt` | J on 03-b2b and 12a with the 3.0.1 scripts (the baseline) |
| `journey/*-v3.0.2.txt` | J on all four builds with the 3.0.2 scripts (`gate.mjs --journey --no-record`) |
| `journey/*-full-gate-v3.0.2.txt`, `journey/*-handoff.txt` | the full gate and `handoff.mjs --report GATE.md` on copies of 03-b2b and 12a |
| `keyboard.txt` | `evals/keyboard-walk.mjs` on all four builds (keyboard only, never a pointer) |
| `independent/SCORES.md`, `independent/scores.json` | rubric scores by a separate evaluator (gpt_6_1_sol), from rendered pixels |
| `independent/pair-originality.*` | the evaluator's strict paired-difference measurement for 12a × 12b |

Machine: 2 CPUs, headless Chromium (Playwright 1.59). Paths are relative to the benchmark branch (`runs/…`).
