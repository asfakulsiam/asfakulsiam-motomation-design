# Motomation Design v3.0.1: independent benchmark runs (full artifacts)

This orphan branch only holds the full sites and screenshots from the v3.0.1 validation benchmarks. The text
evidence, the evaluator outputs and the validation report live on the main line of work:
`evals/results/2026-10-18-v3.0.1-independent/` and `docs/VALIDATION-v3.0.1.md` (branch `overhaul/research-first-v3`, PR #5).

| Folder | Brief | Builder | Skill copy it followed |
|---|---|---|---|
| `runs/03-b2b/` | v6 03-b2b (freight visibility SaaS) | gemini_3_8_flash | v3.0.0 (226085d) |
| `runs/08-travel-booking/` | v6 08-travel-booking (Sylhet tea-garden lodge) | gpt_6_1_sol | v3.0.0 (226085d) |
| `runs/12-paired/a-archival/`, `runs/12-paired/b-poster/` | v6 12a / 12b (one tea-shop contract, two directions) | gpt_6_1_sol | v3.0.1 working tree |

Each run folder has the site, `DESIGN.md`, `CHECKPOINTS.md`, `RUN.md` (the builder's own record) and `screens/`.
Serve a folder with any static server (most include their own `serve.js` / `server.mjs`). The briefs used are in `briefs-used/`.

## Evaluator additions (2026-10-18)

- `runs/12-paired/compare/`: the two paired directions side by side at 1440px (home, shop, tea detail, cart, checkout), left `a-archival`, right `b-poster`. Visual check behind the `pair.mjs` "partial" verdicts.
- `runs/12-paired/a-archival/evaluator-walk/`, `runs/12-paired/b-poster/evaluator-walk/`: the checkout walk at 375px (empty cart, added, validation, pending, confirmation), from `evals/results/2026-10-18-v3.0.1-independent/12-paired/checkout-walk.mjs`. Both walks pass 9/9 steps.

Results and verdicts: [`evals/results/2026-10-18-v3.0.1-independent/README.md`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/main/evals/results/2026-10-18-v3.0.1-independent/README.md) on `main`.
