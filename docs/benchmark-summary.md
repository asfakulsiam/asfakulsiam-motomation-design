# Benchmark summary

Current report: <!-- current-report -->[`evals/results/2026-10-12-benchmark-v4.md`](../evals/results/2026-10-12-benchmark-v4.md)<!-- /current-report --> (benchmark v4, 2026-10-12): **builds only, not scored**, because its measurements were never committed. **The latest scored result is v3**, below. v2 and v1 are kept below as history, failures included. `scripts/check-repo.mjs` fails if the current report named here is not the newest main report in `evals/results/`.

## v4 (extended matched effort + Tier 4 motion, 2026-10-12) — not scored

Full report: [`evals/results/2026-10-12-benchmark-v4.md`](../evals/results/2026-10-12-benchmark-v4.md). 78 builds were generated in Claude Code 2.1.286 at `6f15d45`: 30 matched-vs-skill pairs over 5 briefs × 6 seeds, and 9 baseline-vs-skill Tier 4 motion pairs. The measurement step ran on GitHub Actions, but its `checks.json` files were never committed, so **0 pairs are measured or judged**. No gated scores, no wins or losses and no sign test exist for v4. What the build data does show: matched-effort enforcement held in 10 of 30 pairs (19 runs went 1–2 turns over budget, 1 finished under the floor), and 17 of 30 matched transcripts end on the turn cap.

## v3 (inside Claude Code, 2026-10-12) — latest scored result

Full report: [`evals/results/2026-10-12-benchmark-v3.md`](../evals/results/2026-10-12-benchmark-v3.md). Runner output: [`evals/results/2026-10-12-benchmark-v3/summary.json`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/2026-10-12-benchmark-v3/summary.json) (on the evals branch). Companion reports: [motion briefs](../evals/results/2026-10-12-benchmark-v3-motion.md) · [competitor skills](../evals/results/2026-10-12-benchmark-v3-competitors.md) · [Codex](../evals/results/2026-10-12-benchmark-v3-codex.md). Commit tested: `6f2724f`.

### What was compared
Five briefs × three seeds × four arms = 60 builds in Claude Code, one generator model (`claude_sonnet_5_5`), judged blind in pairs by GPT-5.4 and Gemini 3.1 Pro against `evals/rubric.md`. Arms: baseline (no skill), baseline + `gate.mjs` only, matched-effort baseline (told to refine for about the skill's median turn count), skill. Measurement (Playwright Chromium + axe-core + `gate.mjs`) ran on GitHub Actions.

### Scores (gated, /100; raw in brackets)

| Pair (A vs B) | B wins–losses–ties (of 15) | Mean gated A → B | Mean raw A → B | Sign test |
|---|---|---|---|---|
| Baseline vs Skill | 12–2–1 | 43.4 → 83.7 | 62.8 → 88.9 | p≈0.013 |
| Baseline + gate vs Skill | 14–1–0 | 65.5 → 86.4 | 65.5 → 91.4 | p≈0.001 |
| Matched effort vs Skill | 10–5–0 | 63.7 → 80.4 | 77.3 → 85.5 | p≈0.30 (not significant) |
| Baseline vs Baseline + gate | 9–6–0 | 46.4 → 68.3 | 73.0 → 68.3 | — |
| Baseline vs Matched effort | 12–0–3 | 43.1 → 70.6 | 66.0 → 86.3 | p≈0.0005 |

Companion results: competitor skills lost to the skill 14–1 (taste-skill), 14–1 (ui-ux-pro-max) and 11–3–1 (frontend-design). On Codex (5 briefs × 1 seed) the skill won 3–2 but the means were level (gated 77.0 baseline vs 76.2 skill).

### What it means
- The skill wins against a plain baseline and against the gate alone; the gate is about half the win (it removes hard-gate failures but doesn't improve design).
- Against a baseline told to work longer, the skill still leads (10–5) but the result is **not significant** with 15 pairs.
- **On motion judged alone, the skill lost.** In the Tier 4 motion briefs, judges scoring only the gate's frame strips preferred the baseline in 6 of 9 seeds (77.3 vs 64.4); the reduced-motion fallback scored 2.50 vs 4.39.
- On Codex the skill shows no measurable gain (n=5).

### Failures kept
- Pairs the skill lost: architecture s7101 and s7103 (to baseline); ceramics s3103 (to gated, the skill page fails contrast on dimmed scroll steps); architecture s7101, hotel s4103 and all three ceramics seeds (to matched effort).
- 10 pages failed a measured hard gate (6 baseline, 1 skill, 3 matched), all on axe contrast.
- `gate.mjs` passed the ceramics s3103 skill page that axe failed (dimmed inactive scroll steps); fixed in v2.5.0 by inactive-step sampling.
- Shared memory log across skill runs (run folders inside the repo walked up to the repo's `.motomation/`).

### Why this may overstate the skill
Small samples (15 pairs); judges saw a short summary of measured checks, which can favour arms that ran the gate; the matched arm under-used its budget (median 11 of about 19 turns); one agent and one generator model for the main arms; judges are models, not human designers; the model adapters used for the run (`evals/adapters/pplx-llm.py`, `anthropic-bridge.py`, `responses-bridge.py`) need a private SDK, so generation and judging can't be rerun outside that environment (re-scoring from the committed judgments can: `node evals/run-agent-benchmark.mjs score`).


## v2 (inside Claude Code, 2026-10-11) — history

Full report: [`evals/results/2026-10-11-benchmark-v2.md`](../evals/results/2026-10-11-benchmark-v2.md). Runner output: `evals/results/2026-10-11-benchmark-v2/summary.json`.

### What was compared
Five briefs (02, 03, 04, 05, 07) × three seeds × two conditions = 30 runs, all built inside Claude Code by the same model (`claude_sonnet_5_5`).
- **Skill condition:** the skill was installed in `.claude/skills/`, and the prompt asked the agent to `/build` with the collision engine and to follow the Delivery Gate.
- **Baseline condition:** the same agent and tools, with the prompt "expert web designer, check your work".
- **Judging:** two blind judges from other model families (GPT-5.4, Gemini 3.1 Pro) scored each pair against `evals/rubric.md`.
- **Gates:** measured hard gates come from Playwright + axe-core and `gate.mjs`.

### Scores (gated, /100, mean of two judges, mean of three seeds)

| Brief | Without | With | Δ |
|---|---|---|---|
| 07 Architecture studio | 74.8 | 96.0 | +21.2 |
| 04 Boutique hotel | 0.0 | 91.7 | +91.7 |
| 03 Ceramics shop | 47.3 | 93.2 | +45.8 |
| 02 Developer tool (SaaS) | 40.0 | 93.2 | +53.2 |
| 05 Climate non-profit | 67.3 | 88.0 | +20.7 |
| **Mean** | **45.9** | **92.4** | **+46.5** |

Without gates (raw), the means are 67.1 vs 92.4. The skill won 15 of 15 pairs on both measures. Five baseline pages failed the measured contrast gate (hotel ×3, ceramics 3103, SaaS 2102). No skill page did.

### What it means
- Inside an agent that can read its files and run its scripts, the skill won every pair. It also won the two briefs it lost in v1, on every seed.
- The v1 craft failures (caption contrast, 375 overflow) didn't recur: `gate.mjs` measured c0 o0 on all six studio and hotel skill pages.
- The "wrong value during animation" class did recur, in a new form: public 5102 shows a scrubbed counter at 0 mid-scroll. `gate.mjs` doesn't catch this.

### Why this may overstate the skill
- **Effort isn't matched.** Skill runs used a mean of 33.5 turns; baseline runs used 3–12.
- **The judges saw the measured checks.**
- **Ceiling effect.** Gemini gave 100 to 6 of the 15 skill pages.
- **Motion judged from stills.** The full-page shots don't trigger scroll reveals.
- **One agent, one model.**

### Failures kept
- Six runs died on an upstream API error and were re-run from scratch with the same seed.
- The public 5102 counter (above).
- An unconfirmed judge claim on public 5101.
- A keyboard-pattern false positive, fixed for both conditions before scoring.
- Two skill pages stamped H4 from their own measured focal tie.

## v1 (single prompt, 2026-10-11)

Full report with every screenshot, score and measurement: [`evals/results/2026-10-11-benchmark.md`](../evals/results/2026-10-11-benchmark.md).

### What was compared
The same model (`claude_sonnet_5_5`, same settings) built five briefs twice. The baseline got the brief alone. The skill run got the brief plus the Motomation skill and its `/invent` output. Two blind judges from other model families (GPT-5.4, Gemini 3.1 Pro) scored each pair with `evals/rubric.md`. Hard gates were applied from Playwright + axe-core measurements.

### Scores (gated, /100, mean of two judges)

| Brief | Without | With | Δ |
|---|---|---|---|
| Studio portfolio (07) | 81.5 | 0.0 | -81.5 |
| Boutique hotel (04) | 88.5 | 54.5 | -34.0 |
| E-commerce product (03) | 0.0 | 88.0 | +88.0 |
| SaaS product (02) | 44.5 | 95.5 | +51.0 |
| Public-interest (05) | 60.0 | 92.5 | +32.5 |
| **Mean** | 54.9 | 66.1 | +11.2 |

Mean axis scores over the five briefs (1–5, before gates):

| Axis | Without | With |
|---|---|---|
| Concept | 3.5 | 4.5 |
| Originality | 2.9 | 4.7 |
| Typography | 3.5 | 4.4 |
| Motion | 3.1 | 3.9 |
| Craft | 3.6 | 3.9 |
| Access & performance | 3.8 | 2.9 |

### Before and after

![SaaS](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/saas-before-after.webp?raw=true)
SaaS: a generic template that overflows on a phone, vs the Console archetype, where the terminal session is the page.

![Public-interest](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/public-before-after.webp?raw=true)
Public-interest: a conventional layout vs a bilingual manifesto that keeps the single real figure with its source.

![Hotel](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/hotel-before-after.webp?raw=true)
Hotel, where the skill lost: the door-split hero breaks the name into "Have li", the page overflows the phone by 105px, and room prices flip through wrong digits.

### What it means
- The skill reliably moved structure, originality and typography. On Originality it scored higher on 4 of 5 briefs.
- It did not reliably improve craft. In 2 of 5 briefs it shipped defects that its own delivery gate lists (contrast, mobile overflow, motion that misstates content). Without a browser in the loop, the model stamps the gate as passed anyway.
- The release gate ("higher on every brief, no hard-gate failures") is **not met**.

### Failures (not fixed)
1. Release gate not met: the skill lost hotel (54.5 vs 88.5) and, after gates, studio (0 vs 81.5).
2. Self-critique stamps were identical across all five outputs (`C5 H4 S5 R4 M4 V5`, copied from the example) and don't track quality.
3. Signature IDs in stamps were invented, not taken from `data/signatures.csv`.
4. A measurement bug (closed cart drawer counted as "hidden under reduced motion") affected both e-commerce pages; it's disclosed and not used as a gate.
5. The same `/invent` seed was used for every brief, so mutations repeated across briefs (an artifact of the benchmark, not of a single run).

### Not verified
n = 1 per cell; one generator model; raw API calls, not an agent running the skill's scripts; motion judged from stills; the variety test was not run; the skill prompt is ~45k tokens longer than the baseline's.

## Before and after, with losses (moved from the README in v3.0.2)

The README keeps a short summary; the paired screenshots live here.

### v3

**Public interest (brief 05), s5102: won, 0 vs 98.5.** The baseline fails axe contrast; the skill sets the Bangla line as the headline.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-public-5102.webp?raw=true" alt="Public-interest brief, v3 seed 5102: without the skill a two-colour hero that fails contrast (gated 0, raw 47.0); with the skill a large Bangla headline on cream with a mangrove-root drawing (98.5)" width="100%">

**Ceramics shop (brief 03), s3102: lost to the matched-effort baseline, 89.5 vs 77.5.** A baseline told to keep refining built a clearer product page.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-ecommerce-3102-matched.webp?raw=true" alt="Ceramics brief, v3 seed 3102: the matched-effort baseline with a large serif headline and a cup card (89.5); the skill with a product-sheet layout (77.5)" width="100%">

**Studio (brief 07), s7101: lost to Anthropic's frontend-design skill, 89.0 vs 65.0.**
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-studio-7101-frontend-design.webp?raw=true" alt="Studio brief, v3 seed 7101: the frontend-design skill's page (89.0) and the Motomation skill's page (65.0)" width="100%">

**Festival (brief 08), s8102, Tier 4 runner strip: won on the full rubric (0 vs 87.0) and on motion alone (64 vs 94).**
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-festival-8102-strip.webp?raw=true" alt="Festival brief, v3 seed 8102: eight scroll frames for each site at Tier 4" width="100%">

**Launch (brief 06), s6102, Tier 4 runner strip: lost on both (96.5 vs 62.0; motion only 96 vs 40).** The skill's frames overlap mid-transition, and its reduced-motion strip barely differs from full motion.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-launch-6102-strip.webp?raw=true" alt="Launch brief, v3 seed 6102: eight scroll frames for each site at Tier 4; the baseline's ring changes colour per section, the skill's pinned lamp stays while text overlaps" width="100%">

### v1 and v2

Same brief, same model, same seed: without the skill on the left, with it on the right. Losses are included.

**Hotel (brief 04), v2: won.** Without the skill the page fails contrast (gated 0); with it, a full-height door with the name set large (98.5).
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v2-hotel-4102.webp?raw=true" alt="Hotel brief, seed 4102: without the skill a conventional page that fails contrast (gated 0); with the skill a full-height door with the name set large (98.5)" width="100%">

**Hotel (brief 04), v1: lost, 54.5 vs 88.5.** The door-split hero breaks the name into "Have li", the page overflows a phone by 105px, and room prices flip through wrong digits. The gate that now catches all three (`words`, `overflow`, `numbers`) was built because of this page.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/hotel-before-after.webp?raw=true" alt="Hotel brief, v1: without the skill a clean cream page with a small door (88.5); with the skill a dark riveted door filling the screen with the name split as 'Have li' (54.5)" width="100%">

**SaaS (brief 02), v2: won every pair, lost on variety.** Three seeds, three wins (94, 93.5, 92), and three versions of the same page: a big serif headline on the left, a log panel on the right. The cause (the evaluator's note leaking into the prompt) is fixed in v2.4.0; see the [variety report](../evals/results/2026-10-11-variety.md).
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v2-saas-sameness.webp?raw=true" alt="SaaS brief, v2: the three skill pages for seeds 2101, 2102 and 2103 side by side, each a large headline left and a log panel right" width="100%">

**SaaS (brief 02), v1: won, 95.5 vs 44.5.** A generic dark template that overflows a phone, against a page where the log stream is the hero.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/saas-before-after.webp?raw=true" alt="SaaS brief, v1: without the skill a generic dark landing page (44.5); with the skill a serif headline over a scrolling log stream (95.5)" width="100%">

**Studio (brief 07), v2: won, 74.5 vs 96.5.**
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v2-studio-7101.webp?raw=true" alt="Studio brief, seed 7101: without the skill 74.5, with the skill 96.5" width="100%">

**Public interest (brief 05), v1: won.** A conventional layout against a bilingual manifesto that keeps the one real figure with its source.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/public-before-after.webp?raw=true" alt="Public-interest brief, v1: a conventional layout without the skill; a bilingual manifesto with the skill" width="100%">

### What v3 found, including where the skill lost

- **The gate is about half the win.** A baseline that only runs `gate.mjs` has no hard-gate failures (0 of 15, against 6 for the plain baseline) but isn't better designed (raw 73.0 → 68.3 against the plain baseline), and the skill still beats it 14–1.
- **Effort explains part of v2's 15–0.** A baseline told to work about as long as the skill beats the plain baseline 12–0–3 and takes 5 of 15 pairs from the skill, including all three ceramics-shop seeds. 10–5 is not significant with 15 pairs (sign test p≈0.30).
- **On motion alone the skill lost.** At Tier 4, judged only from the gate's scroll-frame strips, the baseline won 6 of 9 seeds. The weakest axis was the reduced-motion fallback (2.50 vs 4.39 of 5). Every skill page reached for WebGL.
- **In Codex the gate often couldn't run** (the headless browser crashed or timed out in a loaded sandbox). 3 of 5 skill runs shipped without a verified pass, and the SaaS page broke.
- **One skill page failed a hard gate** (ceramics s3103: dimmed scroll-sequence steps at 2.1:1 that `gate.mjs` measured only in their active state).
