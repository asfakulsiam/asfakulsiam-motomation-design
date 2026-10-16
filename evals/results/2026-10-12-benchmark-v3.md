# Benchmark v3 (2026-10-12): skill vs baseline, gated baseline and matched effort

Five briefs × three seeds × four arms = **60 builds in Claude Code**, measured in a real browser, then judged blind in pairs by two models from other families. Same generator model for every arm. Every number below is read from the files in [`2026-10-12-benchmark-v3/`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/evals/evals/results/2026-10-12-benchmark-v3) (on the evals branch since 2026-10-16) (`summary.json`, each run's `run.json` / `checks.json` / `prompt.txt` / `transcript.jsonl.gz`, each judgment in `<brief>/judge/`); screenshots are on the [`evals` branch](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/evals/evals/results/2026-10-12-benchmark-v3). Companion reports: [motion briefs](2026-10-12-benchmark-v3-motion.md) · [competitor skills](2026-10-12-benchmark-v3-competitors.md) · [Codex multi-agent](2026-10-12-benchmark-v3-codex.md).

**Commit tested: `6f2724f5299a19cd55cb94cbad886c1c6af38fd6`** (skill folder tree `adf3ab499119d70059f2a1ac0d3cbc5c061a6fef`).

## Headline

| | Baseline (no skill) | Skill |
|---|---|---|
| Pairs won (of 15) | 2 | **12** (ties 1) |
| Mean gated score | 43.4 | **83.7** |
| Mean raw score (no gates) | 62.8 | 88.9 |
| Pages failing a measured hard gate | 6 of 15 | 1 of 15 |

| Pair (A vs B) | B wins–losses–ties (of 15) | Mean gated A → B | Mean raw A → B | Raw-score wins–losses for B | Pages failing a hard gate A / B |
|---|---|---|---|---|---|
| Baseline (no skill) vs Skill | 12–2–1 | 43.4 → 83.7 | 62.8 → 88.9 | 13–2 | 6 / 1 |
| Baseline + gate vs Skill | 14–1–0 | 65.5 → 86.4 | 65.5 → 91.4 | 14–1 | 0 / 1 |
| Baseline (no skill) vs Baseline + gate | 9–6–0 | 46.4 → 68.3 | 73.0 → 68.3 | 6–8 | 6 / 0 |
| Matched-effort baseline vs Skill | 10–5–0 | 63.7 → 80.4 | 77.3 → 85.5 | 9–6 | 3 / 1 |
| Baseline (no skill) vs Matched-effort baseline | 12–0–3 | 43.1 → 70.6 | 66.0 → 86.3 | 15–0 | 6 / 3 |

Scores are relative to the pair: the judges score both sites side by side, so the same page can score differently in two pairs. Compare arms through their pair, not across pairs.

## What was tested

| | |
|---|---|
| Skill commit tested | `6f2724f5299a19cd55cb94cbad886c1c6af38fd6` (`git rev-parse HEAD` when generation started); skill folder tree `adf3ab499119d70059f2a1ac0d3cbc5c061a6fef` — identical at `c91235c`, the HEAD while the competitor and motion arms ran (that commit only added tests and CI) |
| Generator | Claude Code 2.1.286 (`claude -p`, `--max-turns 80`, 50 min timeout) through `evals/adapters/anthropic-bridge.py`; every request served by **`claude_sonnet_5_5`** (reasoning `medium`), checked in the bridge log: 1187 requests, all `claude_sonnet_5_5` |
| Judges | `gpt_5_4` and `gemini_3_1_pro` via `evals/adapters/pplx-llm.py` (served model names checked in this run), blind A/B with order from a hash of brief+seed+pair; rubric `evals/rubric.md` |
| Browser (measurement) | Chromium 147.0.7727.15 (Chrome for Testing, Playwright 1.59.0) on GitHub Actions `ubuntu-latest`, workflow `bench-measure.yml` on branch `bench-v3` (run [38223525685](https://github.com/asfakulsiam/asfakulsiam-motomation-design/actions/runs/38223525685)), one page at a time, same image for every arm |
| Dependencies | Node 20 (actions/setup-node) (measurement) / 20.20.2 (generation, judging); Playwright 1.59.0; axe-core 4.14.0; `gate.mjs` gate/2 from the tested skill folder |
| Prompt hashes | baseline: `d984e66fcb8904b2` · gated: `e09d8c7d97a3cdc5` · skill: `2ce5f92962dc8743` · matched: `ca6616eb269533a3` — sha256 (first 16) of the arm's 15 `prompt.txt` files in brief/seed order; per-run hashes in the run table |
| Seeds | studio 7101–7103 · hotel 4101–4103 · ecommerce 3101–3103 · saas 2101–2103 · public 5101–5103 |

### Arms

| Arm | What the agent got |
|---|---|
| Baseline | The brief and the task (`TASK` in the runner) under an expert-web-designer instruction. No skill, no tools beyond Claude Code's own. |
| Baseline + gate (`gated`) | The baseline prompt plus `gate/gate.mjs` copied into the run folder and an instruction to run it on `index.html` and fix what it reports before finishing. No skill text. |
| Skill | The skill installed at `.claude/skills/asfakulsiam-motomation-design` and `/build` with the seed for the collision engine. |
| Matched-effort baseline (`matched`) | The baseline prompt plus an instruction to keep refining for about **19** turns (the skill arm's median, measured from its 15 runs before this arm started), the same `--max-turns 80` cap. |

Hard gates (from `evals/run-agent-benchmark.mjs` `hardGates()`; any one sets that page's gated score to 0):
1. **Placeholders**: any lorem / TODO / placeholder text in the source (`placeholders > 0`).
2. **Contrast**: any axe-core `color-contrast` violation at 1440px.
3. **Reduced motion**: any text element `gate.mjs` finds hidden only under `prefers-reduced-motion: reduce`.
4. **Keyboard**: the brief's primary action is not reached within 40 Tab presses at 1440px.
5. **No output**: the agent produced no `index.html`.

Gated score = mean of the two judges' totals (0–100, `evals/rubric.md` weights), or 0 if a hard gate fails. A pair is a win for the arm with the higher gated score; equal is a tie.

## B2 · Gated baseline: how much of the win is the gate?

The gated arm isolates the Delivery Gate from the rest of the skill (the Thinking Sequence, the collision engine, the craft and motion rules).

| | Baseline | Baseline + gate | Skill |
|---|---|---|---|
| Pages failing a hard gate (of 15) | 6 | 0 | 1 |
| Pages gate.mjs-clean (all six counts 0) | 2 | 15 | 15 |
| Median turns | 3 | 8 | 19 |

| Pair | Wins–losses–ties | Mean gated | Mean raw |
|---|---|---|---|
| Baseline + gate vs baseline | gate arm 9–6–0 | 46.4 → 68.3 | 73.0 → 68.3 |
| Skill vs baseline + gate | skill 14–1–0 | 65.5 → 86.4 | 65.5 → 91.4 |
| Skill vs baseline | skill 12–2–1 | 43.4 → 83.7 | 62.8 → 88.9 |

**Finding.** The gate alone removes every measured hard-gate failure: 6 of 15 baseline pages fail one (all contrast), 0 of 15 gated pages do, and all 15 gated pages are `gate.mjs`-clean. In its pair that lifts the mean gated score from 46.4 to 68.3, about 22 of the roughly 40 points the full skill gains over the baseline in its own pair (the two numbers come from different pairs, so the split is approximate). But the gate doesn't make pages better designed: before gates, the judges scored the gated pages *lower* than the plain baseline (raw 73.0 vs 68.3; the gated arm wins only 6 of 15 on raw score, sign test p≈0.61 on gated verdicts 9–6). This run doesn't measure why; the per-pair judge notes are in `<brief>/judge/s<seed>-baseline-vs-gated-*.json` and `s<seed>-gated-vs-skill-*.json`. Against the full skill the gated baseline loses 14 of 15 (gated 65.5 vs 86.4, raw 65.5 vs 91.4, p≈0.001). Read together: **the gate accounts for the accessibility half of the win; the design half (a raw-score gap of about 26 points against a gate-clean baseline) comes from the rest of the skill.**

## B3 · Matched effort: does the skill only win because it works longer?

Target: about 19 turns. Actual turns, matched arm: 5–27 (median 11, mean 14.2); skill arm: 10–32 (median 19, mean 18.9). Mean time: matched 1.9 min, skill 8.4 min.

| Pair | Wins–losses–ties | Mean gated | Mean raw | Hard-gate fails |
|---|---|---|---|---|
| Skill vs matched-effort baseline | skill 10–5–0 | 63.7 → 80.4 | 77.3 → 85.5 | matched 3, skill 1 |
| Matched-effort vs plain baseline | matched 12–0–3 | 43.1 → 70.6 | 66.0 → 86.3 | baseline 6, matched 3 |

**Finding.** **The gap held, but it is smaller and no longer clean.** Told to work for about 19 turns, the matched arm used a median of 11 (5–27) and 1.9 minutes against the skill's 19 turns and 8.4 minutes, so effort is closer but still not equal. Extra effort alone helps a lot: the matched arm beats the plain baseline 12–0–3 (raw 66.0 → 86.3, every pair higher on raw score, p≈0.0005). Against the skill it wins 5 of 15: skill 10–5 (gated 63.7 vs 80.4, raw 77.3 vs 85.5, raw-score wins 9–6, sign test p≈0.30 — not significant with 15 pairs). The losses: all three ceramics-shop seeds (92.0 vs 91.0, 89.5 vs 77.5, and s3103 where the skill page fails the axe contrast gate), studio s7101 (88.5 vs 67.5) and hotel s4103 (97.0 vs 80.0). So part of v2's 15–0 was effort: a baseline that is told to plan, look, critique and revise closes about two-thirds of the raw-score gap (66.0 → 86.3 against the skill's 85.5–88.9). This is a finding, not a footnote.

## Effort and measured quality per arm

| Arm | Runs | Turns min / median / mean / max | Mean time | Pages gate.mjs-clean (all six counts 0) | Pages failing a hard gate |
|---|---|---|---|---|---|
| Baseline (no skill) | 15 | 2 / 3 / 4.1 / 8 | 1.1 min | 2 of 15 | 6 of 15 |
| Baseline + gate | 15 | 5 / 8 / 7.3 / 11 | 4.0 min | 15 of 15 | 0 of 15 |
| Skill | 15 | 10 / 19 / 18.9 / 32 | 8.4 min | 15 of 15 | 1 of 15 |
| Matched-effort baseline | 15 | 5 / 11 / 14.2 / 27 | 1.9 min | 3 of 15 | 3 of 15 |

## Per brief and seed

Each cell: gated score (raw score) and the hard gates that failed. Judges column: each judge's total for that page, GPT-5.4 first.

### Skill vs baseline
| Brief | Outcome | Seed | Baseline (no skill) gated (raw) | Skill gated (raw) | Δ gated | Judges (baseline: gpt · gemini / skill: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | mixed (1W 2L 0T) | 7101 | 83.0 (83.0) | 64.0 (64.0) | -19.0 | 76 · 90 / 71 · 57 |
|  |  | 7102 | 83.0 (83.0) | 90.0 (90.0) | +7.0 | 87 · 79 / 80 · 100 |
|  |  | 7103 | 85.5 (85.5) | 82.0 (82.0) | -3.5 | 71 · 100 / 81 · 83 |
| 04 Boutique hotel | consistent win (3W 0L 0T) | 4101 | 0.0 (56.5) — contrast: 2 axe color-contrast node(s) | 96.5 (96.5) | +96.5 | 59 · 54 / 97 · 96 |
|  |  | 4102 | 69.0 (69.0) | 98.5 (98.5) | +29.5 | 64 · 74 / 97 · 100 |
|  |  | 4103 | 78.0 (78.0) | 94.0 (94.0) | +16.0 | 73 · 83 / 91 · 97 |
| 03 Ceramics shop (e-commerce) | mixed (2W 0L 1T) | 3101 | 76.0 (76.0) | 88.0 (88.0) | +12.0 | 74 · 78 / 88 · 88 |
|  |  | 3102 | 72.5 (72.5) | 96.5 (96.5) | +24.0 | 76 · 69 / 100 · 93 |
|  |  | 3103 | 0.0 (60.5) — contrast: 4 axe color-contrast node(s) | 0.0 (77.5) — contrast: 4 axe color-contrast node(s) | +0.0 | 58 · 63 / 71 · 84 |
| 02 Developer tool (SaaS) | consistent win (3W 0L 0T) | 2101 | 52.5 (52.5) | 97.0 (97.0) | +44.5 | 53 · 52 / 94 · 100 |
|  |  | 2102 | 51.5 (51.5) | 86.0 (86.0) | +34.5 | 53 · 50 / 90 · 82 |
|  |  | 2103 | 0.0 (45.5) — contrast: 4 axe color-contrast node(s) | 88.0 (88.0) | +88.0 | 47 · 44 / 83 · 93 |
| 05 Climate non-profit (public) | consistent win (3W 0L 0T) | 5101 | 0.0 (56.0) — contrast: 2 axe color-contrast node(s) | 94.5 (94.5) | +94.5 | 59 · 53 / 93 · 96 |
|  |  | 5102 | 0.0 (47.0) — contrast: 2 axe color-contrast node(s) | 98.5 (98.5) | +98.5 | 51 · 43 / 97 · 100 |
|  |  | 5103 | 0.0 (25.5) — contrast: 1 axe color-contrast node(s) | 82.0 (82.0) | +82.0 | 0 · 51 / 84 · 80 |

### Skill vs baseline + gate
| Brief | Outcome | Seed | Baseline + gate gated (raw) | Skill gated (raw) | Δ gated | Judges (gated: gpt · gemini / skill: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | consistent win (3W 0L 0T) | 7101 | 65.5 (65.5) | 82.0 (82.0) | +16.5 | 73 · 58 / 77 · 87 |
|  |  | 7102 | 62.5 (62.5) | 97.0 (97.0) | +34.5 | 70 · 55 / 94 · 100 |
|  |  | 7103 | 73.0 (73.0) | 93.5 (93.5) | +20.5 | 70 · 76 / 93 · 94 |
| 04 Boutique hotel | consistent win (3W 0L 0T) | 4101 | 72.5 (72.5) | 97.0 (97.0) | +24.5 | 76 · 69 / 94 · 100 |
|  |  | 4102 | 69.5 (69.5) | 92.5 (92.5) | +23.0 | 73 · 66 / 88 · 97 |
|  |  | 4103 | 77.5 (77.5) | 97.0 (97.0) | +19.5 | 72 · 83 / 94 · 100 |
| 03 Ceramics shop (e-commerce) | mixed (2W 1L 0T) | 3101 | 55.5 (55.5) | 91.0 (91.0) | +35.5 | 56 · 55 / 88 · 94 |
|  |  | 3102 | 71.0 (71.0) | 93.5 (93.5) | +22.5 | 73 · 69 / 87 · 100 |
|  |  | 3103 | 76.5 (76.5) | 0.0 (76.0) — contrast: 4 axe color-contrast node(s) | -76.5 | 77 · 76 / 71 · 81 |
| 02 Developer tool (SaaS) | consistent win (3W 0L 0T) | 2101 | 50.5 (50.5) | 94.0 (94.0) | +43.5 | 59 · 42 / 88 · 100 |
|  |  | 2102 | 60.5 (60.5) | 95.5 (95.5) | +35.0 | 59 · 62 / 91 · 100 |
|  |  | 2103 | 61.5 (61.5) | 88.5 (88.5) | +27.0 | 59 · 64 / 83 · 94 |
| 05 Climate non-profit (public) | consistent win (3W 0L 0T) | 5101 | 60.5 (60.5) | 96.5 (96.5) | +36.0 | 65 · 56 / 93 · 100 |
|  |  | 5102 | 65.5 (65.5) | 98.5 (98.5) | +33.0 | 69 · 62 / 97 · 100 |
|  |  | 5103 | 60.5 (60.5) | 79.0 (79.0) | +18.5 | 72 · 49 / 78 · 80 |

### Baseline + gate vs baseline
| Brief | Outcome | Seed | Baseline (no skill) gated (raw) | Baseline + gate gated (raw) | Δ gated | Judges (baseline: gpt · gemini / gated: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | mixed (1W 2L 0T) | 7101 | 77.0 (77.0) | 80.0 (80.0) | +3.0 | 74 · 80 / 84 · 76 |
|  |  | 7102 | 86.0 (86.0) | 62.5 (62.5) | -23.5 | 81 · 91 / 73 · 52 |
|  |  | 7103 | 91.0 (91.0) | 61.5 (61.5) | -29.5 | 85 · 97 / 73 · 50 |
| 04 Boutique hotel | mixed (2W 1L 0T) | 4101 | 0.0 (65.0) — contrast: 2 axe color-contrast node(s) | 76.0 (76.0) | +76.0 | 62 · 68 / 83 · 69 |
|  |  | 4102 | 68.5 (68.5) | 76.0 (76.0) | +7.5 | 72 · 65 / 76 · 76 |
|  |  | 4103 | 87.5 (87.5) | 61.5 (61.5) | -26.0 | 78 · 97 / 80 · 43 |
| 03 Ceramics shop (e-commerce) | mixed (1W 2L 0T) | 3101 | 84.5 (84.5) | 57.0 (57.0) | -27.5 | 80 · 89 / 62 · 52 |
|  |  | 3102 | 76.0 (76.0) | 73.0 (73.0) | -3.0 | 72 · 80 / 77 · 69 |
|  |  | 3103 | 0.0 (78.0) — contrast: 4 axe color-contrast node(s) | 68.0 (68.0) | +68.0 | 62 · 94 / 80 · 56 |
| 02 Developer tool (SaaS) | mixed (2W 1L 0T) | 2101 | 75.0 (75.0) | 60.5 (60.5) | -14.5 | 70 · 80 / 62 · 59 |
|  |  | 2102 | 50.5 (50.5) | 70.0 (70.0) | +19.5 | 54 · 47 / 70 · 70 |
|  |  | 2103 | 0.0 (54.0) — contrast: 4 axe color-contrast node(s) | 73.0 (73.0) | +73.0 | 47 · 61 / 73 · 73 |
| 05 Climate non-profit (public) | consistent win (3W 0L 0T) | 5101 | 0.0 (66.0) — contrast: 2 axe color-contrast node(s) | 66.0 (66.0) | +66.0 | 61 · 71 / 73 · 59 |
|  |  | 5102 | 0.0 (78.5) — contrast: 2 axe color-contrast node(s) | 64.0 (64.0) | +64.0 | 73 · 84 / 73 · 55 |
|  |  | 5103 | 0.0 (58.0) — contrast: 1 axe color-contrast node(s) | 75.0 (75.0) | +75.0 | 59 · 57 / 73 · 77 |

### Skill vs matched-effort baseline
| Brief | Outcome | Seed | Matched-effort baseline gated (raw) | Skill gated (raw) | Δ gated | Judges (matched: gpt · gemini / skill: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | mixed (2W 1L 0T) | 7101 | 88.5 (88.5) | 67.5 (67.5) | -21.0 | 87 · 90 / 67 · 68 |
|  |  | 7102 | 81.5 (81.5) | 94.5 (94.5) | +13.0 | 94 · 69 / 89 · 100 |
|  |  | 7103 | 84.0 (84.0) | 90.0 (90.0) | +6.0 | 91 · 77 / 80 · 100 |
| 04 Boutique hotel | mixed (2W 1L 0T) | 4101 | 0.0 (85.0) — contrast: 3 axe color-contrast node(s) | 76.0 (76.0) | +76.0 | 79 · 91 / 83 · 69 |
|  |  | 4102 | 64.5 (64.5) | 90.5 (90.5) | +26.0 | 66 · 63 / 94 · 87 |
|  |  | 4103 | 97.0 (97.0) | 80.0 (80.0) | -17.0 | 94 · 100 / 84 · 76 |
| 03 Ceramics shop (e-commerce) | consistent loss (0W 3L 0T) | 3101 | 92.0 (92.0) | 91.0 (91.0) | -1.0 | 84 · 100 / 88 · 94 |
|  |  | 3102 | 89.5 (89.5) | 77.5 (77.5) | -12.0 | 82 · 97 / 86 · 69 |
|  |  | 3103 | 76.5 (76.5) | 0.0 (76.0) — contrast: 4 axe color-contrast node(s) | -76.5 | 77 · 76 / 74 · 78 |
| 02 Developer tool (SaaS) | consistent win (3W 0L 0T) | 2101 | 74.5 (74.5) | 95.5 (95.5) | +21.0 | 70 · 79 / 94 · 97 |
|  |  | 2102 | 60.0 (60.0) | 88.5 (88.5) | +28.5 | 64 · 56 / 87 · 90 |
|  |  | 2103 | 0.0 (55.0) — contrast: 10 axe color-contrast node(s) | 91.5 (91.5) | +91.5 | 62 · 48 / 90 · 93 |
| 05 Climate non-profit (public) | consistent win (3W 0L 0T) | 5101 | 73.0 (73.0) | 91.5 (91.5) | +18.5 | 77 · 69 / 93 · 90 |
|  |  | 5102 | 74.0 (74.0) | 93.5 (93.5) | +19.5 | 69 · 79 / 94 · 93 |
|  |  | 5103 | 0.0 (64.0) — contrast: 6 axe color-contrast node(s) | 78.5 (78.5) | +78.5 | 71 · 57 / 70 · 87 |

### Matched-effort vs baseline
| Brief | Outcome | Seed | Baseline (no skill) gated (raw) | Matched-effort baseline gated (raw) | Δ gated | Judges (baseline: gpt · gemini / matched: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | consistent win (3W 0L 0T) | 7101 | 73.0 (73.0) | 88.5 (88.5) | +15.5 | 73 · 73 / 84 · 93 |
|  |  | 7102 | 76.0 (76.0) | 95.5 (95.5) | +19.5 | 80 · 72 / 91 · 100 |
|  |  | 7103 | 74.5 (74.5) | 98.5 (98.5) | +24.0 | 77 · 72 / 97 · 100 |
| 04 Boutique hotel | mixed (2W 0L 1T) | 4101 | 0.0 (54.0) — contrast: 2 axe color-contrast node(s) | 0.0 (86.5) — contrast: 3 axe color-contrast node(s) | +0.0 | 58 · 50 / 79 · 94 |
|  |  | 4102 | 76.0 (76.0) | 83.0 (83.0) | +7.0 | 84 · 68 / 90 · 76 |
|  |  | 4103 | 68.0 (68.0) | 98.5 (98.5) | +30.5 | 67 · 69 / 97 · 100 |
| 03 Ceramics shop (e-commerce) | consistent win (3W 0L 0T) | 3101 | 77.5 (77.5) | 87.0 (87.0) | +9.5 | 76 · 79 / 88 · 86 |
|  |  | 3102 | 74.5 (74.5) | 82.0 (82.0) | +7.5 | 73 · 76 / 71 · 93 |
|  |  | 3103 | 0.0 (61.0) — contrast: 4 axe color-contrast node(s) | 83.0 (83.0) | +83.0 | 65 · 57 / 76 · 90 |
| 02 Developer tool (SaaS) | mixed (2W 0L 1T) | 2101 | 70.5 (70.5) | 85.0 (85.0) | +14.5 | 76 · 65 / 77 · 93 |
|  |  | 2102 | 56.0 (56.0) | 85.5 (85.5) | +29.5 | 60 · 52 / 84 · 87 |
|  |  | 2103 | 0.0 (60.5) — contrast: 4 axe color-contrast node(s) | 0.0 (66.5) — contrast: 10 axe color-contrast node(s) | +0.0 | 47 · 74 / 69 · 64 |
| 05 Climate non-profit (public) | mixed (2W 0L 1T) | 5101 | 0.0 (49.0) — contrast: 2 axe color-contrast node(s) | 84.5 (84.5) | +84.5 | 41 · 57 / 83 · 86 |
|  |  | 5102 | 0.0 (62.0) — contrast: 2 axe color-contrast node(s) | 88.0 (88.0) | +88.0 | 67 · 57 / 88 · 88 |
|  |  | 5103 | 0.0 (57.0) — contrast: 1 axe color-contrast node(s) | 0.0 (82.5) — contrast: 6 axe color-contrast node(s) | +0.0 | 54 · 60 / 78 · 87 |

## Fails (kept visible)

**Pages that failed a measured hard gate:**
- **ecommerce baseline s3103**: contrast: 4 axe color-contrast node(s)
- **hotel baseline s4101**: contrast: 2 axe color-contrast node(s)
- **public baseline s5101**: contrast: 2 axe color-contrast node(s)
- **public baseline s5102**: contrast: 2 axe color-contrast node(s)
- **public baseline s5103**: contrast: 1 axe color-contrast node(s)
- **saas baseline s2103**: contrast: 4 axe color-contrast node(s)
- **ecommerce skill s3103**: contrast: 4 axe color-contrast node(s)
- **hotel matched s4101**: contrast: 3 axe color-contrast node(s)
- **public matched s5103**: contrast: 6 axe color-contrast node(s)
- **saas matched s2103**: contrast: 10 axe color-contrast node(s)

**Pairs the skill lost:**
- 07 Architecture studio s7101: skill lost to Baseline (no skill) (83.0 vs 64.0)
- 07 Architecture studio s7103: skill lost to Baseline (no skill) (85.5 vs 82.0)
- 03 Ceramics shop (e-commerce) s3103: skill lost to Baseline + gate (76.5 vs 0.0) — skill page fails: contrast: 4 axe color-contrast node(s)
- 07 Architecture studio s7101: skill lost to Matched-effort baseline (88.5 vs 67.5)
- 04 Boutique hotel s4103: skill lost to Matched-effort baseline (97.0 vs 80.0)
- 03 Ceramics shop (e-commerce) s3101: skill lost to Matched-effort baseline (92.0 vs 91.0)
- 03 Ceramics shop (e-commerce) s3102: skill lost to Matched-effort baseline (89.5 vs 77.5)
- 03 Ceramics shop (e-commerce) s3103: skill lost to Matched-effort baseline (76.5 vs 0.0) — skill page fails: contrast: 4 axe color-contrast node(s)

**Run and pipeline problems:**
- **Measurement moved to GitHub Actions.** The generation sandbox had 2 CPUs; measuring one site took about 4.5 minutes, so measurement ran on GitHub's runners (`bench-measure.yml`, branch `bench-v3`). First attempt ([run 38222645987](https://github.com/asfakulsiam/asfakulsiam-motomation-design/actions/runs/38222645987)): 6 of the first 10 shards died on a 90-second full-page `page.screenshot` timeout with two pages open at once; cancelled and rerun with one page at a time ([run 38223525685](https://github.com/asfakulsiam/asfakulsiam-motomation-design/actions/runs/38223525685)): 41 of 41 shards passed. The 10 sites measured locally before the move were measured again in CI (`--force`), so every arm shares one environment.
- **The runner's judge step ignored `--parallel`** (it called the judge with `spawnSync`, so judgments ran one at a time). This run used 43 independent judge processes instead (one per brief × pair); the runner now uses an async spawn. A page whose measurement throws used to end the whole measure pool; it is now logged as `MEASURE FAILED` and left unscored.
- **Shared memory log across skill runs.** The run folders live inside this repository, so a skill run whose own `.motomation/` didn't exist yet walked up to the repository root and wrote `.motomation/log.json` there (5 entries, 06:03–07:38 UTC). Later skill runs could read those through `memory.mjs check` and steer away from archetypes and signatures earlier runs used. That affects variety, not quality gates, and it's the kind of cross-run memory a real project has, but it means skill runs were not fully independent. Next run: generate outside the repository.
- **`gate.mjs` and axe-core disagreed on one page** (ceramics shop, skill, s3103): the gate measured c0 (it measures each element after scrolling it into view), axe flagged 4 nodes at load. The nodes are the not-yet-active steps of a scroll sequence, dimmed to 2.1:1 (`#6e4230` on `#1c1714`, 13px labels) and 3.37:1 (`#706b66`, 20px body). axe is right that the dimmed state is unreadable; the gate only saw the active state. Logged as a gate gap.
- No run crashed, timed out or produced no `index.html`: all 60 builds exited 0 with an `index.html` (and all 45 competitor builds). No judgment failed to parse: 150 of 150 main-pair judgments written on the first attempt.

## Why this may overstate or understate the skill

- **Small samples.** 15 pairs per comparison. Sign tests on the gated verdicts: skill vs baseline 12–2 p≈0.013; skill vs gated 14–1 p≈0.001; skill vs matched 10–5 p≈0.30 (not significant); matched vs baseline 12–0 p≈0.0005.
- **The judges saw the measured checks** (a short summary of axe, overflow, keyboard and `gate.mjs` counts) as in v2. That can favour the arms that ran the gate (gated, skill).
- **Effort still isn't equal**: the matched arm under-used its budget (median 11 of about 19 turns), which understates what a longer baseline can do; the skill also gets the gate, which the matched arm doesn't.
- **One agent and one generator model** for the main arms (Claude Code + `claude_sonnet_5_5`). The [Codex report](2026-10-12-benchmark-v3-codex.md) is a one-seed portability check, not a replication.
- **Judges score within a pair**, so the same page gets different scores in different pairs; across-pair numbers (like the gate's share of the win) are approximate.
- **Judges saw the brief's `Expect:` line** (the evaluator's note); generators never did (the runner strips it from the generator prompt since v2.4.0; why is in the [variety report](2026-10-11-variety.md)).
- **Hard gates are binary.** One page with four dimmed labels scores 0, same as a page that is unreadable throughout. Raw scores are reported next to every gated score for that reason.

## Every run

| Brief | Arm | Seed | Turns | Time | gate.mjs counts (c o w rm a n) | Measured hard gates | Prompt sha256 |
|---|---|---|---|---|---|---|---|
| 07 Architecture studio | baseline | 7101 | 3 | 56s | 0 0 0 0 0 0 | none | `5e177e5fb5c9` |
| 07 Architecture studio | baseline | 7102 | 2 | 74s | 42 12 0 0 0 0 | none | `5e177e5fb5c9` |
| 07 Architecture studio | baseline | 7103 | 5 | 70s | 16 0 0 0 0 0 | none | `5e177e5fb5c9` |
| 07 Architecture studio | gated | 7101 | 5 | 168s | 0 0 0 0 0 0 | none | `1de3a274c557` |
| 07 Architecture studio | gated | 7102 | 5 | 150s | 0 0 0 0 0 0 | none | `1de3a274c557` |
| 07 Architecture studio | gated | 7103 | 8 | 187s | 0 0 0 0 0 0 | none | `1de3a274c557` |
| 07 Architecture studio | skill | 7101 | 20 | 832s | 0 0 0 0 0 0 | none | `69fb556cad7c` |
| 07 Architecture studio | skill | 7102 | 15 | 392s | 0 0 0 0 0 0 | none | `ff8d82e33408` |
| 07 Architecture studio | skill | 7103 | 18 | 379s | 0 0 0 0 0 0 | none | `6a64750ac8f6` |
| 07 Architecture studio | matched | 7101 | 7 | 87s | 20 0 0 0 0 0 | none | `a9ba37108cbf` |
| 07 Architecture studio | matched | 7102 | 22 | 141s | 36 0 0 0 0 0 | none | `a9ba37108cbf` |
| 07 Architecture studio | matched | 7103 | 17 | 190s | 2 0 0 0 0 0 | none | `a9ba37108cbf` |
| 04 Boutique hotel | baseline | 4101 | 7 | 57s | 30 0 0 0 0 0 | contrast: 2 axe color-contrast node(s) | `48961f16c100` |
| 04 Boutique hotel | baseline | 4102 | 6 | 75s | 40 0 0 0 0 0 | none | `48961f16c100` |
| 04 Boutique hotel | baseline | 4103 | 7 | 67s | 13 0 0 0 0 0 | none | `48961f16c100` |
| 04 Boutique hotel | gated | 4101 | 6 | 158s | 0 0 0 0 0 0 | none | `935da5982cdf` |
| 04 Boutique hotel | gated | 4102 | 8 | 308s | 0 0 0 0 0 0 | none | `935da5982cdf` |
| 04 Boutique hotel | gated | 4103 | 6 | 158s | 0 0 0 0 0 0 | none | `935da5982cdf` |
| 04 Boutique hotel | skill | 4101 | 19 | 572s | 0 0 0 0 0 0 | none | `4540b52368f8` |
| 04 Boutique hotel | skill | 4102 | 32 | 604s | 0 0 0 0 0 0 | none | `f9bb15aa41fa` |
| 04 Boutique hotel | skill | 4103 | 10 | 218s | 0 0 0 0 0 0 | none | `1881b8d0fe1a` |
| 04 Boutique hotel | matched | 4101 | 9 | 88s | 22 0 0 0 0 0 | contrast: 3 axe color-contrast node(s) | `caf9693b68b5` |
| 04 Boutique hotel | matched | 4102 | 26 | 151s | 0 0 0 0 0 0 | none | `caf9693b68b5` |
| 04 Boutique hotel | matched | 4103 | 16 | 108s | 62 0 1 0 0 0 | none | `caf9693b68b5` |
| 03 Ceramics shop (e-commerce) | baseline | 3101 | 3 | 69s | 8 0 0 0 0 0 | none | `2143b90adf60` |
| 03 Ceramics shop (e-commerce) | baseline | 3102 | 8 | 90s | 8 0 3 0 0 0 | none | `2143b90adf60` |
| 03 Ceramics shop (e-commerce) | baseline | 3103 | 3 | 84s | 16 0 3 0 0 0 | contrast: 4 axe color-contrast node(s) | `2143b90adf60` |
| 03 Ceramics shop (e-commerce) | gated | 3101 | 7 | 232s | 0 0 0 0 0 0 | none | `f78aede85be7` |
| 03 Ceramics shop (e-commerce) | gated | 3102 | 10 | 546s | 0 0 0 0 0 0 | none | `f78aede85be7` |
| 03 Ceramics shop (e-commerce) | gated | 3103 | 8 | 465s | 0 0 0 0 0 0 | none | `f78aede85be7` |
| 03 Ceramics shop (e-commerce) | skill | 3101 | 26 | 807s | 0 0 0 0 0 0 | none | `e94efd71f13f` |
| 03 Ceramics shop (e-commerce) | skill | 3102 | 20 | 591s | 0 0 0 0 0 0 | none | `17b4151585a9` |
| 03 Ceramics shop (e-commerce) | skill | 3103 | 19 | 403s | 0 0 0 0 0 0 | contrast: 4 axe color-contrast node(s) | `40d63dfb8ef0` |
| 03 Ceramics shop (e-commerce) | matched | 3101 | 5 | 93s | 4 0 0 0 0 0 | none | `2a450b62fd0b` |
| 03 Ceramics shop (e-commerce) | matched | 3102 | 9 | 104s | 4 0 0 0 0 0 | none | `2a450b62fd0b` |
| 03 Ceramics shop (e-commerce) | matched | 3103 | 9 | 88s | 0 0 0 0 0 0 | none | `2a450b62fd0b` |
| 02 Developer tool (SaaS) | baseline | 2101 | 3 | 46s | 0 0 0 0 0 0 | none | `df9b38c7bd29` |
| 02 Developer tool (SaaS) | baseline | 2102 | 2 | 42s | 0 10 0 0 0 0 | none | `df9b38c7bd29` |
| 02 Developer tool (SaaS) | baseline | 2103 | 3 | 49s | 16 10 0 0 0 0 | contrast: 4 axe color-contrast node(s) | `df9b38c7bd29` |
| 02 Developer tool (SaaS) | gated | 2101 | 11 | 188s | 0 0 0 0 0 0 | none | `d0ebefbcb4c6` |
| 02 Developer tool (SaaS) | gated | 2102 | 8 | 221s | 0 0 0 0 0 0 | none | `d0ebefbcb4c6` |
| 02 Developer tool (SaaS) | gated | 2103 | 5 | 109s | 0 0 0 0 0 0 | none | `d0ebefbcb4c6` |
| 02 Developer tool (SaaS) | skill | 2101 | 17 | 375s | 0 0 0 0 0 0 | none | `6a6e0787c65a` |
| 02 Developer tool (SaaS) | skill | 2102 | 19 | 450s | 0 0 0 0 0 0 | none | `88736a7b3791` |
| 02 Developer tool (SaaS) | skill | 2103 | 17 | 597s | 0 0 0 0 0 0 | none | `25024c17f78b` |
| 02 Developer tool (SaaS) | matched | 2101 | 21 | 138s | 3 0 0 0 0 0 | none | `f7a91d8a5bf3` |
| 02 Developer tool (SaaS) | matched | 2102 | 8 | 72s | 4 109 2 0 0 0 | none | `f7a91d8a5bf3` |
| 02 Developer tool (SaaS) | matched | 2103 | 18 | 122s | 1 2 1 0 0 0 | contrast: 10 axe color-contrast node(s) | `f7a91d8a5bf3` |
| 05 Climate non-profit (public) | baseline | 5101 | 4 | 72s | 28 0 0 0 0 1 | contrast: 2 axe color-contrast node(s) | `823bf876fc47` |
| 05 Climate non-profit (public) | baseline | 5102 | 3 | 75s | 31 0 0 0 0 1 | contrast: 2 axe color-contrast node(s) | `823bf876fc47` |
| 05 Climate non-profit (public) | baseline | 5103 | 2 | 71s | 16 0 0 0 0 1 | contrast: 1 axe color-contrast node(s) | `823bf876fc47` |
| 05 Climate non-profit (public) | gated | 5101 | 10 | 308s | 0 0 0 0 0 0 | none | `d1f5136d0220` |
| 05 Climate non-profit (public) | gated | 5102 | 8 | 239s | 0 0 0 0 0 0 | none | `d1f5136d0220` |
| 05 Climate non-profit (public) | gated | 5103 | 5 | 203s | 0 0 0 0 0 0 | none | `d1f5136d0220` |
| 05 Climate non-profit (public) | skill | 5101 | 15 | 335s | 0 0 0 0 0 0 | none | `05abe90ebc1c` |
| 05 Climate non-profit (public) | skill | 5102 | 17 | 644s | 0 0 0 0 0 0 | none | `460ed52ff3b4` |
| 05 Climate non-profit (public) | skill | 5103 | 19 | 390s | 0 0 0 0 0 0 | none | `77282e58449b` |
| 05 Climate non-profit (public) | matched | 5101 | 11 | 106s | 0 0 0 0 0 0 | none | `8d1b35528d98` |
| 05 Climate non-profit (public) | matched | 5102 | 8 | 101s | 4 0 0 0 0 0 | none | `8d1b35528d98` |
| 05 Climate non-profit (public) | matched | 5103 | 27 | 166s | 6 0 0 0 0 0 | contrast: 6 axe color-contrast node(s) | `8d1b35528d98` |

## Reproduce

```bash
python3 evals/adapters/anthropic-bridge.py --port 8787 --model claude_sonnet_5_5 --reasoning medium &   # or a real Anthropic key
export ANTHROPIC_BASE_URL=http://127.0.0.1:8787 ANTHROPIC_API_KEY=bridge
OUT=evals/results/2026-10-12-benchmark-v3
node evals/run-agent-benchmark.mjs generate --out $OUT --n 3 --arms baseline,gated,skill --parallel 5
node evals/run-agent-benchmark.mjs generate --out $OUT --n 3 --arms matched --match-turns 19 --parallel 5
node evals/run-agent-benchmark.mjs measure  --out $OUT --n 3 --arms baseline,gated,skill,matched --parallel 1    # needs playwright + axe-core
node evals/run-agent-benchmark.mjs judge    --out $OUT --n 3 --pairs baseline:skill,gated:skill,baseline:gated,matched:skill,baseline:matched \
  --judge-cmd "python3 evals/adapters/pplx-llm.py {model} {prompt} {images}" --parallel 8
node evals/run-agent-benchmark.mjs score    --out $OUT --n 3 --pairs baseline:skill,gated:skill,baseline:gated,matched:skill,baseline:matched
```
