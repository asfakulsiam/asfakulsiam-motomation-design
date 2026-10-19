# v3.0.2 independent run: 05-saas-dashboard (2026-10-19)

The first independent build made with 3.0.2 itself. One build, one judge: a data point, not a benchmark. Full build, raw
logs and screenshots are on the evidence branch [`benchmarks/v3.0.2-runs`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.2-runs) (commit `8a5d122`); nothing from it
is on `main`.

| | |
|---|---|
| Skill | v3.0.2, commit `52255c0`, skill tree `a2b4c4f13d9e025bceeef39bece2423be4a2c705` (frozen read-only copy) |
| Brief | [`evals/briefs/v6/05-saas-dashboard.md`](../../briefs/v6/05-saas-dashboard.md), Ledgerly, signed-in finance app |
| Builder | Perplexity Computer subagent, requested model `gpt_6_1_sol`; identity not exposed to the agent. Did not write the skill. |
| Judge | Perplexity Computer subagent, requested model `grok_4_7`; did not build the site or write the skill. |
| How | builder and judge followed the written tasks on the evidence branch (`runs/05-saas-dashboard-TASK.md`, `judge/05-saas-dashboard-JUDGE-TASK.md`) and [`docs/evaluation-protocol.md`](../../../docs/evaluation-protocol.md) |

## Measured (automated, by the builder; re-run by the judge where marked)

| Check | Builder | Judge re-run |
|---|---|---|
| `completeness.mjs` | pass | pass: routes 16/16, journeys 3/3, functions 4/4, states 4/4 |
| `realism.mjs` | pass | pass |
| `gate.mjs` full (c o w rm a n q k, critique stamp) | pass | not re-run |
| `gate.mjs --journey` (J) | `nav0 mobile0 forms0 loading- errors0 session0` | same line, PASS |
| `handoff.mjs` | **VALIDATED** (`16d0da5c7e61a36a`) | not re-run (judge used `--no-record`) |
| `evals/keyboard-walk.mjs` | not run | run on 16 routes: skip link first, no trap, focus visible; its journey `ok` was wrong (below) |

Stack chosen by the builder: native HTML, CSS and JavaScript with a Node static server (not the Next.js default), with
its reason in `DESIGN.md`.

## Judged (opinion, by the independent judge)

Gates: Product integrity **PASS**, Usability **PASS**, Accessibility **PASS** (not a certification), Content truth **PASS**.
Axes: Concept 4, Originality 3, Typography 4, Motion 4, Craft 4, Access & performance 4 → **76/100**.
Also: journey completeness 5, information architecture 4, responsive usability 4, motion restraint 5, content realism 4,
technical reliability 4. Scores: [`SCORES.md`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.2-runs/judge/05-saas-dashboard/SCORES.md).

Defects the judge found and the builder did not report:

1. At 375px the sign-in copy loses its line break and runs two sentences together ("invoices.A clear place").
2. A new, empty account's transactions page shows the filter-miss message ("No matching transactions") instead of an empty state.
3. The sign-in route is an editorial hero (48px serif headline, sample sales card), against the brief's bias probe and the builder's own cut list; `DESIGN.md`'s "no hero" holds only inside the signed-in shell.

Three minor ones (Leave demo hidden on mobile, a 42px desktop target, recovery state instead of 404 when storage is unreadable) are in `SCORES.md`.

## Found in the skill's tooling

`evals/keyboard-walk.mjs` reported the add-expense journey `ok` though it ended on `/expenses/new`: the walk does not type,
so the required fields stopped the form. It also ignored `<label for>` names. Fixed in 3.0.2 (`reached` vs `outcome`,
`--expect`), regression `tests/evals/keyboard-walk.test.mjs`.

## Not verified

Screen readers, real devices, forced colours and the full pixel gate by the judge, cold-offline start, human judgement.
No paired build. Product types still without a 3.0.2 build: see [`docs/evaluation-protocol.md`](../../../docs/evaluation-protocol.md).
