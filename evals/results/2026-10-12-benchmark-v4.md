# Benchmark v4 (2026-10-12): extended matched-effort arm and motion briefs — builds only, not scored

**Status: incomplete. No scores, no verdicts, no p-values.** The 78 builds were generated and committed. The measurement step (Playwright + axe-core + `gate.mjs` → `checks.json`) was moved to GitHub Actions ([`bench-measure-v4.yml`](../../.github/workflows/bench-measure-v4.yml), on push to `bench-v4`). Its outputs were never committed: `main`, `bench-v4` (`855e3fa`) and `evals` (`9e9a940`) contain **0 `checks.json`, 0 judge files and no `summary.json`** for either v4 folder. Judging needs `checks.json` and screenshots, so it never ran either. This report publishes what the committed files support and says which sections cannot be computed. **The latest scored benchmark is still [v3](2026-10-12-benchmark-v3.md).**

**Commit tested (generation): `6f15d45b4754927549230debd36f86ebbbf86b66`**, as stated in the commit that added the builds, [`a443b99`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/commit/a443b99a13cee3ef464c9c3323495f0d60ceb0c9) ("bench-v4 (1/2): … generated at 6f15d45; measurement on Actions"). Part 2/2, the measurements, was never committed.

## What was planned

| | |
|---|---|
| Main briefs | studio, hotel, ecommerce, saas, public × seeds 1–6 × arms **skill** and **matched** (matched-effort baseline, turn budget = the paired skill run's turns) = 60 builds → 30 matched-vs-skill pairs |
| Motion briefs | portfolio, launch, festival × seeds 1–3 × arms **baseline** and **skill**, Tier 4 forced in every prompt = 18 builds → 9 baseline-vs-skill pairs |
| Generator | Claude Code 2.1.286 (`claude-code 2.1.286 (Claude Code)` in all 78 `run.json`) |
| Folders | [`2026-10-12-benchmark-v4/`](2026-10-12-benchmark-v4/) · [`2026-10-12-benchmark-v4-motion/`](2026-10-12-benchmark-v4-motion/) |

## Pair counts

| Comparison | Pairs built (both sides have `index.html`) | Pairs measured | Pairs judged |
|---|---|---|---|
| matched vs skill (5 briefs × 6 seeds) | **30** | 0 | 0 |
| baseline vs skill, Tier 4 motion (3 briefs × 3 seeds) | **9** | 0 | 0 |

## Mean gated scores per arm — cannot be published

Gated scores combine the judges' rubric scores with the measured hard gates (`checks.json`). Neither exists for v4, so there are none to report, for any arm or brief. Nothing here is estimated or carried over from v3.

## Sign test — cannot be published

A sign test needs a win, loss or tie per pair, and those come from judged, gated pairs. With 0 judged pairs there is no p-value. For scale only: with 30 pairs and no ties, a two-sided sign test reaches p < 0.05 at 21 or more wins out of 30; with 9 pairs it needs 8 or more wins out of 9.

## Per-brief breakdown (build data only)

Read from each build's `run.json`, its files, and the last `result` event in `transcript.jsonl.gz`. These numbers describe how the runs went, not page quality.

| Output | Brief | Arm | Builds | index.html | DESIGN.md | `exit 0` | last session result `success` | turns (median, range) | minutes (median) | tier in prompt |
|---|---|---|---|---|---|---|---|---|---|---|
| v4 | ecommerce | matched | 6 | 6 | 0 | 6 | 4 | 21.0 (18–32) | 2.6 | none forced |
| v4 | ecommerce | skill | 6 | 6 | 6 | 6 | 6 | 21.5 (17–35) | 15.2 | none forced |
| v4 | hotel | matched | 6 | 6 | 0 | 4 | 3 | 20.0 (18–21) | 2.1 | none forced |
| v4 | hotel | skill | 6 | 6 | 6 | 6 | 6 | 20.0 (17–21) | 12.2 | none forced |
| v4 | public | matched | 6 | 6 | 1 | 1 | 1 | 16.0 (14–23) | 2.6 | none forced |
| v4 | public | skill | 6 | 6 | 6 | 6 | 6 | 15.0 (13–22) | 7.0 | none forced |
| v4 | saas | matched | 6 | 6 | 0 | 6 | 3 | 23.0 (20–31) | 2.3 | none forced |
| v4 | saas | skill | 6 | 6 | 6 | 6 | 6 | 24.0 (19–31) | 13.5 | none forced |
| v4 | studio | matched | 6 | 6 | 0 | 2 | 2 | 20.5 (15–27) | 2.9 | none forced |
| v4 | studio | skill | 6 | 6 | 6 | 6 | 6 | 20.5 (14–27) | 8.1 | none forced |
| v4-motion | festival | baseline | 3 | 3 | 0 | 3 | 3 | 5 (3–12) | 0.7 | 4 |
| v4-motion | festival | skill | 3 | 3 | 3 | 3 | 3 | 32 (22–40) | 11.5 | 4 |
| v4-motion | launch | baseline | 3 | 3 | 0 | 3 | 3 | 6 (3–7) | 0.9 | 4 |
| v4-motion | launch | skill | 3 | 3 | 3 | 3 | 3 | 23 (19–24) | 29.1 | 4 |
| v4-motion | portfolio | baseline | 3 | 3 | 0 | 3 | 3 | 5 (5–6) | 0.8 | 4 |
| v4-motion | portfolio | skill | 3 | 3 | 3 | 3 | 3 | 17 (16–21) | 25.6 | 4 |

`exit` is Claude Code's exit code from `run.json`. "Last session result" is the `subtype` of the last `result` event in the transcript (`success` or `error_max_turns`). Turns are `run.json` `turns`. All 78 builds wrote `index.html`.

### Matched-effort enforcement (the point of v4)

v2.5.0 made the matched arm's budget a cap and a floor: budget = turns used by the paired skill run, floor = 90%, up to 4 "look, critique, revise" resumes. `run.json` records `effort.enforced = used >= floor && used <= budget`.

| Brief | Pairs (matched vs skill, same seed) | budget = skill turns (median) | matched used (median) | used within [floor, budget] (`enforced`) | over budget | under floor | resumes (total) |
|---|---|---|---|---|---|---|---|
| studio | 6 | 20.5 | 20.5 | 2/6 | 4 | 0 | 8 |
| hotel | 6 | 20.0 | 20.0 | 3/6 | 3 | 0 | 7 |
| ecommerce | 6 | 21.5 | 21.0 | 2/6 | 3 | 1 | 8 |
| saas | 6 | 24.0 | 23.0 | 3/6 | 3 | 0 | 8 |
| public | 6 | 15.0 | 16.0 | 0/6 | 6 | 0 | 0 |
| **all** | **30** | | | **10/30** | **19** | **1** | **31** |

## Failures, kept visible

- **11 of 30 matched builds exited non-zero**: hotel matched s4101 (error_max_turns), hotel matched s4103 (error_max_turns), public matched s5101 (error_max_turns), public matched s5103 (error_max_turns), public matched s5104 (error_max_turns), public matched s5105 (error_max_turns), public matched s5106 (error_max_turns), studio matched s7101 (error_max_turns), studio matched s7102 (error_max_turns), studio matched s7103 (error_max_turns), studio matched s7104 (error_max_turns).
- **6 more matched builds exited 0, but their last session ended on `error_max_turns`**: ecommerce matched s3103, ecommerce matched s3104, hotel matched s4106, saas matched s2102, saas matched s2103, saas matched s2106
. In total, 17 of 30 matched transcripts end on the turn cap. The cap is the enforcement mechanism, so this is expected behaviour, not a crash. It also means those builds stopped when the budget ran out, not when the agent said it was done.
- **Enforcement held in only 10 of 30 pairs.** 19 runs went over budget, 18 of them by one turn and one by two (for example `public` s5104 used 16 against a budget of 15), and 1 finished under the floor. The data does not show why the cap allows one extra turn. "Matched effort" was close (median used ≈ median budget per brief), but not exact.
- **Wall-clock time is not matched.** Matched runs took a median of about 2–3 minutes per build; skill runs took 7–29 minutes for the same turn count, because skill turns include reading the skill and running `gate.mjs`.
- **35 skill builds carry a self-written gate stamp in `index.html`.** That is the build's own claim, not a measurement in this benchmark, and it is not used anywhere above.
- **The measurement step's output is missing**, so no page in v4 has a measured hard gate, contrast, axe, or keyboard result.

## How to finish v4 (not done in this session)

1. Re-run the [`bench-measure-v4.yml`](../../.github/workflows/bench-measure-v4.yml) workflow (push to `bench-v4`) and **commit the downloaded `checks.json` files** (screenshots go to the `evals` branch, as for v3).
2. `node evals/run-agent-benchmark.mjs judge --out evals/results/2026-10-12-benchmark-v4 --n 6 --arms skill,matched --pairs matched:skill --judge-cmd …` (any adapter in [`evals/adapters/`](../adapters/), see [`evals/README.md`](../README.md)), then `score`. Do the same for `-v4-motion` with `--only portfolio,launch,festival --n 3 --tier 4`.
3. Replace the "cannot be published" sections with the runner's numbers.

Every table above comes only from the committed `run.json` files, the build folders' file lists and the last `result` event of each `transcript.jsonl.gz`.
