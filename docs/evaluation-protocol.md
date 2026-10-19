# Independent evaluation protocol (v3.0.2)

How to run an evaluation whose result can be trusted and compared. It reuses the v6 briefs (`evals/briefs/v6/`), the
gate and journey scripts, `evals/keyboard-walk.mjs` and `evals/rubric.md`; it adds no new harness.

## Rules

1. **One skill version per comparison.** Record the exact commit (`git rev-parse HEAD`) and the skill tree
   (`git rev-parse HEAD:skills/asfakulsiam-motomation-design`). A build made with an older version is labelled with that
   version and never pooled with newer results.
2. **The builder did not write the skill; the judge did not build the site.** Name both models and versions.
3. **Measured, judged and not verified stay apart** (`gates/delivery-gate.md`, Handoff). A gate PASS is a measurement,
   not a quality verdict; a judge score is an opinion with its evidence; anything not run is NOT VERIFIED with a reason.
4. **No duplicate briefs** to raise the count. Coverage comes from different product types (table below).
5. **Evidence off `main`.** Sites, screenshots, transcripts and raw output go on a `benchmarks/<version>-*` branch;
   `main` gets a text summary in `evals/results/<date>-<version>-<name>/` that links to it. Never merge a benchmark
   branch into `main` (`check-repo.mjs` enforces the size budget and keeps evidence out of the skill folder).

## Record per build (`evals/results/<run>/<brief>/README.md`)

| Field | Content |
|---|---|
| Skill | version, commit SHA, skill tree hash |
| Builder | agent, model and version, turn cap, date |
| Brief | `evals/briefs/v6/<id>.md` |
| Product contract | the approved contract as written by the builder (link) |
| Research | sources with URLs, each marked observed / inferred / unverified |
| Direction | the chosen direction, the rejected ones, and why |
| Routes and journeys | Scope routes built vs required; each core journey and whether it was walked |
| Commands run | every validation command with its exit code (gate, completeness, journey, handoff, keyboard walk) |
| Screenshots | 1440 and 375 of each core route (on the benchmark branch) |
| Automated outcome | the handoff status computed by `handoff.mjs`, with the gate record |
| Known defects | confirmed defects, with the evidence |
| Not verified | each check that did not run and why |
| Independent judgement | judge model, rubric axes below, scores with evidence links, disagreements with the automated result |

Judge axes: product integrity, journey completeness, information architecture, originality and fit of the art
direction, responsive usability, motion quality and restraint, content realism, accessibility, technical reliability.
Report each axis; do not collapse them into one number without also showing the axes.

## Paired builds (same product, different direction)

Both builds start from the same approved contract (`12a`/`12b` pattern) and must keep the same routes and journeys.
Compare the complex functional pages (cart, checkout, forms, dashboards), not only the home page, with
`scripts/pair.mjs`. Shared components and layouts may be reused where the product needs them; colour or font changes
alone are not evidence of a different direction.

## Coverage of the v6 briefs (as of v3.0.2)

| Brief | Product type | Independent build | Independent judgement | Skill version tested |
|---|---|---|---|---|
| 03-b2b | B2B | yes ([v3.0.1 runs](../evals/results/2026-10-18-v3.0.1-independent/README.md)) | yes ([scores](../evals/results/2026-10-19-v3.0.2-validation/independent/SCORES.md)) | v3.0.0 (`226085d`) |
| 08-travel-booking | booking | yes | yes | v3.0.0 (`226085d`) |
| 12a / 12b | boutique commerce, paired | yes | yes | v3.0.1 working tree |
| 01 marketplace, 02 luxury, 04 editorial, 05 SaaS dashboard, 06 portfolio, 07 education, 09 community directory, 10 data-heavy, 11 mobile accessibility | | no | no | NOT VERIFIED |

No v6 brief has been built with 3.0.2. Highest-value next runs, in order: `05-saas-dashboard` (signed-in app, states),
`01-marketplace` (two-sided commerce), `04-editorial` (density, bilingual type), each with a judge from another model
family. Running them needs builder and judge model credentials (`evals/run-agent-benchmark.mjs`, `claude` or `codex`
CLI) and is a manual, paid step; it is never part of routine CI.
