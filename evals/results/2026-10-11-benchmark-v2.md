# Benchmark v2 — inside a real agent (2026-10-11)

The five benchmark briefs were run inside Claude Code (the CLI agent, not a single prompt), with and without the skill, three seeds per brief, and scored blind by two judges from other model families, using the unchanged rubric (`evals/rubric.md`) and briefs (`evals/briefs/`). Every run is published, including the failures.

## Setup

| | |
|---|---|
| Agent | Claude Code 2.1.286, `claude -p … --output-format stream-json`, `--max-turns 80`, explicit tool allowlist (file tools + `node`/`ls`/`cat`/`mkdir`/`wc`). No `--dangerously-skip-permissions`. |
| Generator model | Claude Code's requests answered by `claude_sonnet_5_5` (effort medium) through a local Anthropic-Messages-compatible bridge (`ANTHROPIC_BASE_URL`). Same model for both conditions. |
| Skill condition | skill (commit 8a76c06 + this run's runner) copied to `.claude/skills/` in a fresh folder; prompt: use the skill, `/build`, collision engine `--seed <seed>`, follow the Delivery Gate. |
| Baseline condition | same agent, tools, permissions, brief and output rules; prompt: expert web designer, "check your work before you finish". No skill. |
| Seeds | a different seed set per brief: studio 7101–7103, hotel 4101–4103, e-commerce 3101–3103, SaaS 2101–2103, public 5101–5103. The seed drives the skill's collision engine. For the baseline it only labels the replicate, because Claude Code exposes no sampling seed. |
| Judges | `gpt_5_4` and `gemini_3_1_pro`: two families, neither is Claude. Blind A/B per seed pair, order fixed by a hash of brief+seed. Each judge sees 8 screenshots (1440 fold, 1440 page, 375 page, 1440 reduced-motion, for each site), the measured checks, the brief and the rubric. |
| Score | rubric weights (Concept 20, Originality 20, Typography 15, Motion 15, Craft 15, Access 15), mean of both judges = raw. **Gated** = 0 if a measured hard gate fails: axe colour-contrast > 0, text hidden under reduced motion (gate.mjs), keyboard can't reach the primary action in 40 Tabs, or placeholder strings. Judge-claimed gates are listed, not applied. |
| Runner | `node evals/run-agent-benchmark.mjs generate / measure / judge / score` (this folder's `summary.json` is its output) |

## Result

**30 runs, 15 pairs, 15 skill wins, 0 losses, 0 ties.** Mean gated score: baseline 45.9, skill 92.4. Mean raw (no gates): baseline 67.1, skill 92.4. The skill wins every pair before the gates too. The gates only widen the margin (5 of 15 baseline pages fail contrast).

| Brief | Outcome | Seed | Baseline gated (raw) | Skill gated (raw) | Δ |
|---|---|---|---|---|---|
| 07 Architecture studio | consistent win | 7101 | 74.5 (74.5) | 96.5 (96.5) | +22.0 |
|  |  | 7102 | 76.0 (76.0) | 96.5 (96.5) | +20.5 |
|  |  | 7103 | 74.0 (74.0) | 95.0 (95.0) | +21.0 |
| 04 Boutique hotel | consistent win | 4101 | 0.0 (65.5) — contrast: 1 axe color-contrast node(s) | 90.0 (90.0) | +90.0 |
|  |  | 4102 | 0.0 (60.5) — contrast: 1 axe color-contrast node(s) | 98.5 (98.5) | +98.5 |
|  |  | 4103 | 0.0 (74.5) — contrast: 2 axe color-contrast node(s) | 86.5 (86.5) | +86.5 |
| 03 Ceramics shop (e-commerce) | consistent win | 3101 | 64.0 (64.0) | 91.0 (91.0) | +27.0 |
|  |  | 3102 | 78.0 (78.0) | 92.0 (92.0) | +14.0 |
|  |  | 3103 | 0.0 (60.0) — contrast: 3 axe color-contrast node(s) | 96.5 (96.5) | +96.5 |
| 02 Developer tool (SaaS) | consistent win | 2101 | 74.0 (74.0) | 94.0 (94.0) | +20.0 |
|  |  | 2102 | 0.0 (57.0) — contrast: 13 axe color-contrast node(s) | 93.5 (93.5) | +93.5 |
|  |  | 2103 | 46.0 (46.0) | 92.0 (92.0) | +46.0 |
| 05 Climate non-profit (public) | consistent win | 5101 | 72.5 (72.5) | 81.0 (81.0) | +8.5 |
|  |  | 5102 | 61.0 (61.0) | 84.5 (84.5) | +23.5 |
|  |  | 5103 | 68.5 (68.5) | 98.5 (98.5) | +30.0 |

**The distribution the task asked to demonstrate (at least one consistent win, one loss and one mixed brief) did not occur.** All five briefs are consistent wins. The briefs and rubric were not changed and no run was dropped or re-rolled to manufacture a loss. See "Fails" and "Why this may overstate the skill".

## Per brief

### 07 Architecture studio — consistent win (3/3)

| Run | Seed | Generator | Turns / time | Judge scores (gpt_5_4 · gemini_3_1_pro) | Gated | gate.mjs | Transcript |
|---|---|---|---|---|---|---|---|
| baseline | 7101 | claude-code → claude_sonnet_5_5 | 8 / 112s | 77 · 72 | 74.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/studio/baseline-s7101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/studio/baseline-s7101/transcript.jsonl.gz) |
| skill | 7101 | claude-code → claude_sonnet_5_5 | 37 / 506s | 93 · 100 | 96.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/studio/skill-s7101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/studio/skill-s7101/transcript.jsonl.gz) |
| baseline | 7102 | claude-code → claude_sonnet_5_5 | 6 / 108s | 80 · 72 | 76.0 | c0 o0 w5 rm0 a0 | [`2026-10-11-benchmark-v2/studio/baseline-s7102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/studio/baseline-s7102/transcript.jsonl.gz) |
| skill | 7102 | claude-code → claude_sonnet_5_5 | 20 / 308s | 93 · 100 | 96.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/studio/skill-s7102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/studio/skill-s7102/transcript.jsonl.gz) |
| baseline | 7103 | claude-code → claude_sonnet_5_5 | 6 / 69s | 86 · 62 | 74.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/studio/baseline-s7103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/studio/baseline-s7103/transcript.jsonl.gz) |
| skill | 7103 | claude-code → claude_sonnet_5_5 | 23 / 391s | 90 · 100 | 95.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/studio/skill-s7103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/studio/skill-s7103/transcript.jsonl.gz) |

### 04 Boutique hotel — consistent win (3/3)

| Run | Seed | Generator | Turns / time | Judge scores (gpt_5_4 · gemini_3_1_pro) | Gated | gate.mjs | Transcript |
|---|---|---|---|---|---|---|---|
| baseline | 4101 | claude-code → claude_sonnet_5_5 | 3 / 50s | 68 · 63 | 0.0 | c2 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/hotel/baseline-s4101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/hotel/baseline-s4101/transcript.jsonl.gz) |
| skill | 4101 | claude-code → claude_sonnet_5_5 | 25 / 285s | 90 · 90 | 90.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/hotel/skill-s4101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/hotel/skill-s4101/transcript.jsonl.gz) |
| baseline | 4102 | claude-code → claude_sonnet_5_5 | 3 / 54s | 64 · 57 | 0.0 | c1 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/hotel/baseline-s4102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/hotel/baseline-s4102/transcript.jsonl.gz) |
| skill | 4102 | claude-code → claude_sonnet_5_5 | 31 / 357s | 97 · 100 | 98.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/hotel/skill-s4102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/hotel/skill-s4102/transcript.jsonl.gz) |
| baseline | 4103 | claude-code → claude_sonnet_5_5 | 3 / 47s | 65 · 84 | 0.0 | c8 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/hotel/baseline-s4103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/hotel/baseline-s4103/transcript.jsonl.gz) |
| skill | 4103 | claude-code → claude_sonnet_5_5 | 43 / 494s | 97 · 76 | 86.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/hotel/skill-s4103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/hotel/skill-s4103/transcript.jsonl.gz) |

### 03 Ceramics shop (e-commerce) — consistent win (3/3)

| Run | Seed | Generator | Turns / time | Judge scores (gpt_5_4 · gemini_3_1_pro) | Gated | gate.mjs | Transcript |
|---|---|---|---|---|---|---|---|
| baseline | 3101 | claude-code → claude_sonnet_5_5 | 10 / 86s | 69 · 59 | 64.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/ecommerce/baseline-s3101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/ecommerce/baseline-s3101/transcript.jsonl.gz) |
| skill | 3101 | claude-code → claude_sonnet_5_5 | 47 / 531s | 89 · 93 | 91.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/ecommerce/skill-s3101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/ecommerce/skill-s3101/transcript.jsonl.gz) |
| baseline | 3102 | claude-code → claude_sonnet_5_5 | 12 / 109s | 80 · 76 | 78.0 | c0 o0 w3 rm0 a0 | [`2026-10-11-benchmark-v2/ecommerce/baseline-s3102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/ecommerce/baseline-s3102/transcript.jsonl.gz) |
| skill | 3102 | claude-code → claude_sonnet_5_5 | 31 / 295s | 90 · 94 | 92.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/ecommerce/skill-s3102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/ecommerce/skill-s3102/transcript.jsonl.gz) |
| baseline | 3103 | claude-code → claude_sonnet_5_5 | 5 / 65s | 57 · 63 | 0.0 | c3 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/ecommerce/baseline-s3103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/ecommerce/baseline-s3103/transcript.jsonl.gz) |
| skill | 3103 | claude-code → claude_sonnet_5_5 | 61 / 663s | 93 · 100 | 96.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/ecommerce/skill-s3103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/ecommerce/skill-s3103/transcript.jsonl.gz) |

### 02 Developer tool (SaaS) — consistent win (3/3)

| Run | Seed | Generator | Turns / time | Judge scores (gpt_5_4 · gemini_3_1_pro) | Gated | gate.mjs | Transcript |
|---|---|---|---|---|---|---|---|
| baseline | 2101 | claude-code → claude_sonnet_5_5 | 5 / 51s | 76 · 72 | 74.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/saas/baseline-s2101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/saas/baseline-s2101/transcript.jsonl.gz) |
| skill | 2101 | claude-code → claude_sonnet_5_5 | 24 / 281s | 94 · 94 | 94.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/saas/skill-s2101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/saas/skill-s2101/transcript.jsonl.gz) |
| baseline | 2102 | claude-code → claude_sonnet_5_5 | 6 / 58s | 64 · 50 | 0.0 | c14 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/saas/baseline-s2102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/saas/baseline-s2102/transcript.jsonl.gz) |
| skill | 2102 | claude-code → claude_sonnet_5_5 | 66 / 721s | 90 · 97 | 93.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/saas/skill-s2102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/saas/skill-s2102/transcript.jsonl.gz) |
| baseline | 2103 | claude-code → claude_sonnet_5_5 | 4 / 41s | 53 · 39 | 46.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/saas/baseline-s2103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/saas/baseline-s2103/transcript.jsonl.gz) |
| skill | 2103 | claude-code → claude_sonnet_5_5 | 25 / 239s | 93 · 91 | 92.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/saas/skill-s2103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/saas/skill-s2103/transcript.jsonl.gz) |

### 05 Climate non-profit (public) — consistent win (3/3)

| Run | Seed | Generator | Turns / time | Judge scores (gpt_5_4 · gemini_3_1_pro) | Gated | gate.mjs | Transcript |
|---|---|---|---|---|---|---|---|
| baseline | 5101 | claude-code → claude_sonnet_5_5 | 6 / 71s | 80 · 65 | 72.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/public/baseline-s5101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/public/baseline-s5101/transcript.jsonl.gz) |
| skill | 5101 | claude-code → claude_sonnet_5_5 | 26 / 312s | 91 · 71 | 81.0 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/public/skill-s5101/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/public/skill-s5101/transcript.jsonl.gz) |
| baseline | 5102 | claude-code → claude_sonnet_5_5 | 4 / 73s | 76 · 46 | 61.0 | c0 o0 w1 rm0 a0 | [`2026-10-11-benchmark-v2/public/baseline-s5102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/public/baseline-s5102/transcript.jsonl.gz) |
| skill | 5102 | claude-code → claude_sonnet_5_5 | 25 / 280s | 94 · 75 | 84.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/public/skill-s5102/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/public/skill-s5102/transcript.jsonl.gz) |
| baseline | 5103 | claude-code → claude_sonnet_5_5 | 4 / 94s | 72 · 65 | 68.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/public/baseline-s5103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/public/baseline-s5103/transcript.jsonl.gz) |
| skill | 5103 | claude-code → claude_sonnet_5_5 | 19 / 224s | 97 · 100 | 98.5 | c0 o0 w0 rm0 a0 | [`2026-10-11-benchmark-v2/public/skill-s5103/transcript.jsonl.gz`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-11-benchmark-v2/public/skill-s5103/transcript.jsonl.gz) |

Skill stamps (each measured by the agent itself with `scripts/gate.mjs` and pasted, per Task 4) are in each `skill-s*/index.html`. All 15 skill pages measured c0 o0 w0 rm0 a0. Every skill run chose tier 2.

## Fails

Kept, not hidden:

1. **Infrastructure: 6 runs died mid-run** (saas skill 2102, public baseline 5103, e-commerce skill 3103, public skill 5101/5102/5103) with `API Error: 500 upstream failed`. The bridge's upstream session token expired. Two produced no `index.html`. All six were re-run from scratch with the same seed and prompt after a bridge restart. The failed transcripts are kept at `/tmp/agent-browser/v220-t5-infra-failures/` (not committed: they are infrastructure failures, not design results).
2. **Baseline hard-gate failures (measured):** hotel 4101 (1 contrast node), 4102 (1), 4103 (2), e-commerce 3103 (3), SaaS 2102 (13). gate.mjs agrees (c2, c1, c8, c3, c14).
3. **Public skill 5102: a scrubbed counter shows wrong values.** Under normal motion `#count` is reset to 0 and counts up with scroll, so a screenshot or a reader stopping mid-section sees "0 hectares replanted since 2019" (GPT-5.4 flagged this as a factual failure). Reduced motion shows the correct 140 (checked in source: the reset only runs inside `prefers-reduced-motion: no-preference`). Gemini's claim that reduced motion freezes it at 0 is wrong. This is the same class as the v2.1.0 hotel price flip: a value that's later corrected. Not caught by gate.mjs, so it's handed to Tasks 6–7.
4. **Public skill 5101: judge claim not confirmed.** Gemini said the reduced-motion version hides the source citation, and scored Access 2. gate.mjs measured 0 text elements hidden under reduced motion, and the CSS reduced-motion block only removes transitions. Listed as an unconfirmed judge claim. The score stands as judged.
5. **Measurement false positive, fixed before scoring:** e-commerce skill 3102 named its cart "receipt", so "Add to receipt" missed the runner's keyboard pattern (`add to cart|bag|buy`), which would have zeroed it. The pattern was widened to any "Add…"/"buy" control and re-measured for all six e-commerce runs (both conditions).
6. **Two skill runs lost an H point to the skill's own gate** (e-commerce 3102 H4, public 5103 H4: two focal elements tied on the first 375 screen). Both stamped the measured H4 rather than claiming H5.

## Why this may overstate the skill

- **Effort is not matched.** Skill runs used 19–66 turns (mean 33.5) and 224–721s. Baseline runs used 3–12 turns and 41–112s. The baseline prompt asks it to check its work, but nothing makes it iterate. Part of the gap is the skill making the agent work longer, which is a real effect, but not the same as better guidance per step.
- **The judges saw the measured checks.** The skill runs gated themselves, so their checks are clean by construction. A judge given "0 violations" may score Access and Craft up.
- **Ceiling.** Gemini gave 100 to 6 of 15 skill pages. Scores near the top of a 1–5 scale compress real differences between skill runs.
- **Stills only.** Motion is judged from screenshots and reduced-motion stills. The full-page shots don't trigger scroll-driven reveals, so both conditions show blank bands where content animates in.
- **One generator model.** Same model for both conditions, as intended, but the result says nothing about other agents or models.

## Compared with v2.1.0

v2.1.0's single-prompt benchmark lost studio and hotel. Here, inside an agent that can read the skill's files and run its scripts, the skill wins both, on every seed. The v2.1.0 failures (studio caption contrast 4.45, hotel 375 overflow, hotel price flip) did not recur in these 6 skill pages: gate.mjs measured c0 o0 on all of them. The wrong-value-during-animation pattern did recur in a different form (public 5102).
