# Evaluation briefs v6 (product-first)

Purpose: test whether the skill keeps the product intact while varying the art direction, across product types the v5 set never covered. The v5 briefs were single-page and some carried an expected style; they stay as history.

| Brief | Type | What it probes |
|---|---|---|
| 01-marketplace | marketplace | two-sided product (buyers and sellers), dense listings, multi-seller cart |
| 02-luxury | luxury | restraint vs clear specifications; a booking form that must survive "minimal" |
| 03-b2b | b2b | conventional nav, pricing and comparison expected; no invented logos or metrics |
| 04-editorial | editorial | front-page density, search, bilingual type |
| 05-saas-dashboard | saas-dashboard | signed-in app: tables, forms, empty/error/offline states, no marketing patterns |
| 06-portfolio | portfolio | the work leads; the site must not compete with it |
| 07-education | education | short mobile sessions, progress persisted, clinical clarity |
| 08-travel-booking | travel-booking | a real availability and booking flow inside a slow, calm brand |
| 09-community-directory | community-directory | search, filters, map/list, submissions, long Bangla words at 375 px |
| 10-data-heavy | data-heavy | charts with table alternatives, accessible colour scales, downloads |
| 11-mobile-accessibility | mobile-accessibility | older, low-vision users on slow phones; motion near zero; save and resume |
| 12a / 12b | paired | identical product contract, two contrasting given art directions |

Every brief has the same sections: the client, the expected product contract (jobs, core journeys as route sequences, required routes, capability levels), pressures that conflict, a bias probe (the failure a biased skill would produce) and pass criteria. Score with `evals/rubric.md`: the product-integrity gate first, then the visual axes.

The paired briefs test the core promise of v3: preserve the product, vary the expression. A pair passes when both builds keep every route, journey and state of the shared contract and the two builds differ measurably (`scripts/originality.mjs` across the pair).

`tests/evals/briefs-v6.test.mjs` checks the structure of this set (coverage of types, required sections, identical contracts in the pair). It does not run any build.

These briefs have not been run as a benchmark in v3.0.0. Running them needs an agent runtime and credentials (`evals/run-agent-benchmark.mjs`); until then, no result is claimed.
