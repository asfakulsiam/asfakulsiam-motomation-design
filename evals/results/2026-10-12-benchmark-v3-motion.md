# Benchmark v3 (2026-10-12): motion briefs, Tier 4, judged from frame strips

Briefs 01 (motion-designer portfolio), 06 (product launch) and 08 (music festival), three seeds each, baseline vs skill, both told to build at **motion Tier 4** (`--tier 4`: signature scroll motion, pinned or scrubbed sections, with a reduced-motion version that keeps all content). 18 builds. Same generator, measurement and judges as the [main report](2026-10-12-benchmark-v3.md). The first time Tier 4–5 has benchmark data.

**Commit tested: `6f2724f5299a19cd55cb94cbad886c1c6af38fd6`** (skill folder tree `adf3ab499119d70059f2a1ac0d3cbc5c061a6fef`).

Motion is judged twice, never from a single still:
1. **Motion-only judging from `gate.mjs --report` strips** (`evals/judge-motion-strips.py`): for every build, `scripts/gate.mjs <site> --tier 4 --report motion-report.html` wheel-scrolls the page and captures 8 frames at even scroll steps, three times: 1440 full motion, 375 full motion and 1440 reduced motion. The judges get only those six strips (three per site), the brief, and a motion-only rubric: Motion concept, Choreography, Mobile motion, Reduced-motion fallback, Motion craft. No stills, no checks, no arm names; A/B order from a hash.
2. **The full rubric** (the main benchmark's judging), where each judge also gets the runner's 1440 scroll strip (8 frames, same wheel method) and is told to score Motion mainly from it.

## Result

| | Baseline | Skill |
|---|---|---|
| Motion-only (strips) mean, 0–100 | 77.3 | **64.4** |
| Motion-only verdicts (of 9 seeds) | 6 | **3** (ties 0) |
| Full rubric: pairs won (of 9) | 2 | **7** (ties 0) |
| Full rubric: mean gated | 53.1 | 83.4 |
| Full rubric: mean raw | 74.8 | 83.4 |
| Full rubric: Motion axis (1–5, all judges) | 3.72 | 4.06 |
| Pages failing a hard gate | 3 of 9 | 0 of 9 |
| Median turns · mean time | 6 · 0.9 min | 30 · 21.6 min |

**Mixed, and on motion itself the skill lost.** With the full rubric (stills plus the runner's 1440 strip) the skill won 7 of 9 pairs (gated 53.1 vs 83.4, raw 74.8 vs 83.4; p≈0.18 with 9 pairs), helped by the gates: 3 baseline pages fail axe contrast (scored 0), no skill page does, and all 9 skill pages pass `gate.mjs --tier 4` while 6 of 9 baseline pages fail it (contrast on 3, display words on 3, wrong numbers on 3, overflow on 1). On that rubric the Motion axis also went to the skill (4.06 vs 3.72 of 5), but those judges also had the stills and the checks. But when the judges scored **motion only, from the gate's three frame strips** (1440, 375, reduced), the baseline won 6 of 9 seeds (mean 77.3 vs 64.4). The biggest gap is the reduced-motion fallback (baseline 4.39, skill 2.50 of 5): judges read the skill's reduced strips as looking almost the same as full motion (the WebGL hero stays pinned while text scrolls), even though `gate.mjs` measured no text hidden under reduced motion on any skill page. Choreography (3.89 vs 3.22) and mobile motion (3.50 vs 3.33) also went to the baseline. Every skill page used WebGL at tier 4; no baseline page did; the baselines built GSAP ScrollTrigger sequences with visible state changes between frames. The judges disagreed a lot (portfolio s1103: Gemini 36 vs 100, GPT 80 vs 64), so per-seed motion verdicts are noisy, but the direction is consistent: **at Tier 4 the skill's motion is not better than a capable baseline's when motion is judged on its own.** This is the weakest result in v3 and it points at the motion rules, not the gate.

### Motion-only scores per seed (mean of the two judges, 0–100)

| Brief | Seed | Baseline | Skill | Motion verdict | Per judge (baseline vs skill, judge's pick) |
|---|---|---|---|---|---|
| 01 Motion-designer portfolio | 1101 | 88.0 | 58.0 | baseline | gpt_5_4: 76 vs 80 (skill) · gemini_3_1_pro: 100 vs 36 (baseline) |
| 01 Motion-designer portfolio | 1102 | 78.0 | 50.0 | baseline | gpt_5_4: 72 vs 64 (baseline) · gemini_3_1_pro: 84 vs 36 (baseline) |
| 01 Motion-designer portfolio | 1103 | 58.0 | 82.0 | skill | gpt_5_4: 80 vs 64 (baseline) · gemini_3_1_pro: 36 vs 100 (skill) |
| 06 Product launch | 6101 | 82.0 | 58.0 | baseline | gpt_5_4: 88 vs 64 (baseline) · gemini_3_1_pro: 76 vs 52 (baseline) |
| 06 Product launch | 6102 | 96.0 | 40.0 | baseline | gpt_5_4: 92 vs 52 (baseline) · gemini_3_1_pro: 100 vs 28 (baseline) |
| 06 Product launch | 6103 | 62.0 | 82.0 | skill | gpt_5_4: 84 vs 80 (skill) · gemini_3_1_pro: 40 vs 84 (skill) |
| 08 Music festival | 8101 | 82.0 | 60.0 | baseline | gpt_5_4: 80 vs 76 (baseline) · gemini_3_1_pro: 84 vs 44 (baseline) |
| 08 Music festival | 8102 | 64.0 | 94.0 | skill | gpt_5_4: 68 vs 92 (skill) · gemini_3_1_pro: 60 vs 96 (skill) |
| 08 Music festival | 8103 | 86.0 | 56.0 | baseline | gpt_5_4: 72 vs 64 (baseline) · gemini_3_1_pro: 100 vs 48 (baseline) |

### Motion axes (mean over both judges and all seeds)

| Axis (1–5) | Baseline | Skill |
|---|---|---|
| Motion concept | 4.11 | 3.78 |
| Choreography | 3.89 | 3.22 |
| Mobile motion | 3.50 | 3.33 |
| Reduced-motion fallback | 4.39 | 2.50 |
| Motion craft | 3.44 | 3.28 |

### Full rubric per seed

| Brief | Outcome | Seed | Baseline (no skill) gated (raw) | Skill gated (raw) | Δ gated | Judges (baseline: gpt · gemini / skill: gpt · gemini) |
|---|---|---|---|---|---|---|
| 01 Motion-designer portfolio | consistent win (3W 0L 0T) | 1101 | 76.0 (76.0) | 95.0 (95.0) | +19.0 | 77 · 75 / 90 · 100 |
|  |  | 1102 | 0.0 (63.0) — contrast: 6 axe color-contrast node(s) | 75.0 (75.0) | +75.0 | 55 · 71 / 85 · 65 |
|  |  | 1103 | 77.0 (77.0) | 91.5 (91.5) | +14.5 | 94 · 60 / 83 · 100 |
| 06 Product launch | mixed (2W 1L 0T) | 6101 | 68.0 (68.0) | 93.0 (93.0) | +25.0 | 73 · 63 / 90 · 96 |
|  |  | 6102 | 96.5 (96.5) | 62.0 (62.0) | -34.5 | 93 · 100 / 70 · 54 |
|  |  | 6103 | 66.5 (66.5) | 93.5 (93.5) | +27.0 | 66 · 67 / 91 · 96 |
| 08 Music festival | mixed (2W 1L 0T) | 8101 | 94.0 (94.0) | 76.0 (76.0) | -18.0 | 88 · 100 / 73 · 79 |
|  |  | 8102 | 0.0 (70.0) — contrast: 1 axe color-contrast node(s) | 87.0 (87.0) | +87.0 | 60 · 80 / 80 · 94 |
|  |  | 8103 | 0.0 (62.5) — contrast: 12 axe color-contrast node(s) | 78.0 (78.0) | +78.0 | 68 · 57 / 78 · 78 |

## Fails (kept visible)

**Pages that failed a measured hard gate:**
- **festival baseline s8102**: contrast: 1 axe color-contrast node(s)
- **festival baseline s8103**: contrast: 12 axe color-contrast node(s)
- **portfolio baseline s1102**: contrast: 6 axe color-contrast node(s)

**Pairs the skill lost (full rubric):**
- 06 Product launch s6102: skill lost to Baseline (no skill) (96.5 vs 62.0)
- 08 Music festival s8101: skill lost to Baseline (no skill) (94.0 vs 76.0)

**Motion-only (strips) seeds the skill lost:** see the motion-only table (6 of 9). One judgment shows the judges' noise: on launch s6103, GPT-5.4 scored the baseline 84 and the skill 80 but picked the skill as its winner; verdicts here use the scores, not the pick.

## Frame strips (evidence)

`motion-report.html` is the gate's report (three 8-frame strips + the gate verdict), `shot-1440-strip.png` the runner's strip the full-rubric judges saw; the tiled strip images each motion judge saw are in `<brief>/judge-motion/strips/` on the `evals` branch. Paths are relative to `evals/results/`; the HTML reports and PNGs are on the [`evals` branch](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/evals/evals/results/2026-10-12-benchmark-v3-motion) (the main branch keeps the judgments, `motion-strips.json` and each `gate-report.txt`).

| Brief | Seed | Arm | gate.mjs --report | Runner strip | Gate at tier 4 |
|---|---|---|---|---|---|
| 01 Motion-designer portfolio | 1101 | baseline | [`2026-10-12-benchmark-v3-motion/portfolio/baseline-s1101/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/portfolio/baseline-s1101/motion-report.html) | `2026-10-12-benchmark-v3-motion/portfolio/baseline-s1101/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 01 Motion-designer portfolio | 1101 | skill | [`2026-10-12-benchmark-v3-motion/portfolio/skill-s1101/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1101/motion-report.html) | `2026-10-12-benchmark-v3-motion/portfolio/skill-s1101/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 01 Motion-designer portfolio | 1102 | baseline | [`2026-10-12-benchmark-v3-motion/portfolio/baseline-s1102/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/portfolio/baseline-s1102/motion-report.html) | `2026-10-12-benchmark-v3-motion/portfolio/baseline-s1102/shot-1440-strip.png` | FAIL (c0 o0 w1 rm0 a0 n0) |
| 01 Motion-designer portfolio | 1102 | skill | [`2026-10-12-benchmark-v3-motion/portfolio/skill-s1102/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1102/motion-report.html) | `2026-10-12-benchmark-v3-motion/portfolio/skill-s1102/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 01 Motion-designer portfolio | 1103 | baseline | [`2026-10-12-benchmark-v3-motion/portfolio/baseline-s1103/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/portfolio/baseline-s1103/motion-report.html) | `2026-10-12-benchmark-v3-motion/portfolio/baseline-s1103/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 01 Motion-designer portfolio | 1103 | skill | [`2026-10-12-benchmark-v3-motion/portfolio/skill-s1103/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1103/motion-report.html) | `2026-10-12-benchmark-v3-motion/portfolio/skill-s1103/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 06 Product launch | 6101 | baseline | [`2026-10-12-benchmark-v3-motion/launch/baseline-s6101/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/launch/baseline-s6101/motion-report.html) | `2026-10-12-benchmark-v3-motion/launch/baseline-s6101/shot-1440-strip.png` | FAIL (c0 o12 w0 rm0 a0 n0) |
| 06 Product launch | 6101 | skill | [`2026-10-12-benchmark-v3-motion/launch/skill-s6101/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6101/motion-report.html) | `2026-10-12-benchmark-v3-motion/launch/skill-s6101/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 06 Product launch | 6102 | baseline | [`2026-10-12-benchmark-v3-motion/launch/baseline-s6102/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/launch/baseline-s6102/motion-report.html) | `2026-10-12-benchmark-v3-motion/launch/baseline-s6102/shot-1440-strip.png` | FAIL (c2 o0 w0 rm0 a0 n0) |
| 06 Product launch | 6102 | skill | [`2026-10-12-benchmark-v3-motion/launch/skill-s6102/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6102/motion-report.html) | `2026-10-12-benchmark-v3-motion/launch/skill-s6102/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 06 Product launch | 6103 | baseline | [`2026-10-12-benchmark-v3-motion/launch/baseline-s6103/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/launch/baseline-s6103/motion-report.html) | `2026-10-12-benchmark-v3-motion/launch/baseline-s6103/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 06 Product launch | 6103 | skill | [`2026-10-12-benchmark-v3-motion/launch/skill-s6103/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6103/motion-report.html) | `2026-10-12-benchmark-v3-motion/launch/skill-s6103/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 08 Music festival | 8101 | baseline | [`2026-10-12-benchmark-v3-motion/festival/baseline-s8101/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8101/motion-report.html) | `2026-10-12-benchmark-v3-motion/festival/baseline-s8101/shot-1440-strip.png` | FAIL (c2 o0 w1 rm0 a0 n1) |
| 08 Music festival | 8101 | skill | [`2026-10-12-benchmark-v3-motion/festival/skill-s8101/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8101/motion-report.html) | `2026-10-12-benchmark-v3-motion/festival/skill-s8101/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 08 Music festival | 8102 | baseline | [`2026-10-12-benchmark-v3-motion/festival/baseline-s8102/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8102/motion-report.html) | `2026-10-12-benchmark-v3-motion/festival/baseline-s8102/shot-1440-strip.png` | FAIL (c0 o0 w0 rm0 a0 n1) |
| 08 Music festival | 8102 | skill | [`2026-10-12-benchmark-v3-motion/festival/skill-s8102/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8102/motion-report.html) | `2026-10-12-benchmark-v3-motion/festival/skill-s8102/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |
| 08 Music festival | 8103 | baseline | [`2026-10-12-benchmark-v3-motion/festival/baseline-s8103/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8103/motion-report.html) | `2026-10-12-benchmark-v3-motion/festival/baseline-s8103/shot-1440-strip.png` | FAIL (c5 o0 w2 rm0 a0 n2) |
| 08 Music festival | 8103 | skill | [`2026-10-12-benchmark-v3-motion/festival/skill-s8103/motion-report.html`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8103/motion-report.html) | `2026-10-12-benchmark-v3-motion/festival/skill-s8103/shot-1440-strip.png` | PASS (c0 o0 w0 rm0 a0 n0) |

## Every run

| Brief | Arm | Seed | Turns | Time | gate.mjs counts (c o w rm a n) | Measured hard gates | Prompt sha256 |
|---|---|---|---|---|---|---|---|
| 01 Motion-designer portfolio | baseline | 1101 | 6 | 68s | 0 0 0 0 0 0 | none | `9e8c515ee552` |
| 01 Motion-designer portfolio | baseline | 1102 | 9 | 58s | 0 0 1 0 0 0 | contrast: 6 axe color-contrast node(s) | `9e8c515ee552` |
| 01 Motion-designer portfolio | baseline | 1103 | 4 | 45s | 0 0 0 0 0 0 | none | `9e8c515ee552` |
| 01 Motion-designer portfolio | skill | 1101 | 18 | 482s | 0 0 0 0 0 0 | none | `3658a7e826bb` |
| 01 Motion-designer portfolio | skill | 1102 | 19 | 677s | 0 0 0 0 0 0 | none | `b6c2fbc6cca2` |
| 01 Motion-designer portfolio | skill | 1103 | 30 | 860s | 0 0 0 0 0 0 | none | `8e47b602cd47` |
| 06 Product launch | baseline | 6101 | 3 | 48s | 0 12 0 0 0 0 | none | `3d06d33dd66a` |
| 06 Product launch | baseline | 6102 | 6 | 58s | 1 0 0 0 0 0 | none | `3d06d33dd66a` |
| 06 Product launch | baseline | 6103 | 8 | 72s | 0 0 0 0 0 0 | none | `3d06d33dd66a` |
| 06 Product launch | skill | 6101 | 38 | 2014s | 0 0 0 0 0 0 | none | `b8f55bd8cdbd` |
| 06 Product launch | skill | 6102 | 51 | 2587s | 0 0 0 0 0 0 | none | `15673bac5fbc` |
| 06 Product launch | skill | 6103 | 33 | 1516s | 0 0 0 0 0 0 | none | `13a7b9096691` |
| 08 Music festival | baseline | 8101 | 3 | 39s | 2 0 1 0 0 1 | none | `4d18e9a774fb` |
| 08 Music festival | baseline | 8102 | 6 | 54s | 0 0 0 0 0 1 | contrast: 1 axe color-contrast node(s) | `4d18e9a774fb` |
| 08 Music festival | baseline | 8103 | 6 | 59s | 5 0 2 0 0 2 | contrast: 12 axe color-contrast node(s) | `4d18e9a774fb` |
| 08 Music festival | skill | 8101 | 39 | 1449s | 0 0 0 0 0 0 | none | `93b99a76a9c5` |
| 08 Music festival | skill | 8102 | 27 | 845s | 0 0 0 0 0 0 | none | `f061a9141f64` |
| 08 Music festival | skill | 8103 | 27 | 1237s | 0 0 0 0 0 0 | none | `bf08ffb66f31` |

## Reproduce

```bash
OUT=evals/results/2026-10-12-benchmark-v3-motion
node evals/run-agent-benchmark.mjs generate --out $OUT --n 3 --only portfolio,launch,festival --tier 4 --arms baseline,skill --parallel 5
node evals/run-agent-benchmark.mjs measure  --out $OUT --n 3 --only portfolio,launch,festival --arms baseline,skill --parallel 1
for d in $OUT/*/*-s*; do node skills/asfakulsiam-motomation-design/scripts/gate.mjs $d/index.html --tier 4 --report $d/motion-report.html > $d/gate-report.txt; done
python3 evals/judge-motion-strips.py $OUT --pair baseline:skill
node evals/run-agent-benchmark.mjs judge    --out $OUT --n 3 --only portfolio,launch,festival --pairs baseline:skill --judge-cmd "python3 evals/adapters/pplx-llm.py {model} {prompt} {images}"
node evals/run-agent-benchmark.mjs score    --out $OUT --n 3 --only portfolio,launch,festival --pairs baseline:skill
```
