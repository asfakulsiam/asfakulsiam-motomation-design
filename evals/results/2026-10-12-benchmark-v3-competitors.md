# Benchmark v3 (2026-10-12): competitor skills

Three other design skills, installed the same way as ours, on the same five briefs and three seeds, with the same generator, browser and judges as the [main report](2026-10-12-benchmark-v3.md). **45 competitor builds**, each paired blind with the skill's build for the same brief and seed (the skill arm's 15 builds are the ones in the main report).

**Commit tested: `6f2724f5299a19cd55cb94cbad886c1c6af38fd6`** (skill folder tree `adf3ab499119d70059f2a1ac0d3cbc5c061a6fef`).

## Result

| Pair (A vs B) | B wins–losses–ties (of 15) | Mean gated A → B | Mean raw A → B | Raw-score wins–losses for B | Pages failing a hard gate A / B |
|---|---|---|---|---|---|
| taste-skill (design-taste-frontend) vs Skill | 14–1–0 | 47.2 → 87.2 | 56.1 → 92.2 | 15–0 | 3 / 1 |
| ui-ux-pro-max vs Skill | 14–1–0 | 66.1 → 86.2 | 66.1 → 90.8 | 14–1 | 0 / 1 |
| frontend-design (Anthropic) vs Skill | 11–3–1 | 55.5 → 81.6 | 72.4 → 87.0 | 12–3 | 4 / 1 |

Wins, losses and ties per brief (skill's record against that competitor, three seeds each):

| Competitor | 07 Architecture studio | 04 Boutique hotel | 03 Ceramics shop (e-commerce) | 02 Developer tool (SaaS) | 05 Climate non-profit (public) | Total (skill W–L–T) |
|---|---|---|---|---|---|---|
| taste-skill (design-taste-frontend) | skill wins (3–0–0) | skill wins (3–0–0) | skill wins (2–1–0) | skill wins (3–0–0) | skill wins (3–0–0) | 14–1–0 |
| ui-ux-pro-max | skill wins (3–0–0) | skill wins (3–0–0) | skill wins (2–1–0) | skill wins (3–0–0) | skill wins (3–0–0) | 14–1–0 |
| frontend-design (Anthropic) | skill wins (2–1–0) | skill wins (3–0–0) | tie (1–1–1) | skill wins (3–0–0) | skill wins (2–1–0) | 11–3–1 |

**The skill won most pairs against every competitor, and lost some to each.** Against taste-skill and ui-ux-pro-max it won 14 of 15 (sign test p≈0.001 each); against Anthropic's frontend-design it won 11, lost 3 and tied 1 (p≈0.057, not significant at 0.05). ui-ux-pro-max was the only arm besides the gated baseline with no hard-gate failures (0 of 15), and in its pairs the gap is pure judgment: raw 66.1 vs 90.8. frontend-design came closest on judgment (raw 72.4 vs 87.0) and beat the skill outright on studio s7101 (89.0 vs 65.0, the skill's weakest brief in this run), ceramics s3102 (86.0 vs 78.0) and public s5103 (85.0 vs 71.5). The skill's one hard-gate failure (ceramics s3103, axe contrast) cost it the pair against taste-skill and ui-ux-pro-max and a tie against frontend-design (whose s3103 page also failed contrast; on raw score the skill led 80.5 vs 65.5). Every competitor used far less effort (median 5–6 turns, 1–2 minutes) than the skill (19 turns, 8.4 minutes), and none had a matched-effort control, so this comparison can't separate "better skill" from "more work"; the main report's matched arm suggests effort explains part of it.

## Competitors

| Skill | Repository | Commit | Installed from | Licence |
|---|---|---|---|---|
| taste-skill (design-taste-frontend) | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `d237dd399d57524945c0c81327da5da19f7a468d` | `skills/taste-skill (name design-taste-frontend)` | MIT |
| ui-ux-pro-max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `026b6e172c47fa09246b89b6e1d414b8e15f1057` | `.claude/skills/ui-ux-pro-max` | MIT |
| frontend-design (Anthropic) | [anthropics/skills](https://github.com/anthropics/skills) | `dbd4588f9e1033efb41dad4bef2f7947c8993d44` | `skills/frontend-design` | Apache-2.0 |

Each was cloned outside this repository, copied into the run folder at `.claude/skills/<name>` before the run (exactly as ours is), and removed from the run folder afterwards; nothing from them is committed here. Prompt for every competitor arm: `Use the <name> skill to build this website.` + the same task and brief the other arms get (`promptFor()` in the runner, competitor branch). ui-ux-pro-max's search script needs Python, which the sandbox had. All three installed and ran; none is marked "not verified".

## Blind scoring method

1. **Same evidence for both sites.** Each build was rendered by the same measurement job (GitHub Actions, Chromium 147.0.7727.15, one page at a time): 1440 first screen, 1440 page (up to six screens), 375 page, 1440 under reduced motion, and an 8-frame scroll strip when both sites have one. Plus a short summary of measured checks (axe, overflow, keyboard, `gate.mjs` counts).
2. **No names.** Sites are "Site A" and "Site B". Which arm is A is fixed by a hash of brief + seed + pair (`judgePair()` in the runner), so it's not always the skill, and the judges never see arm names, prompts, transcripts or file paths.
3. **Two judges from other model families**, `gpt_5_4` and `gemini_3_1_pro`, each scoring both sites 1–5 on the six axes of [`evals/rubric.md`](../rubric.md) (Concept, Originality, Typography, Motion, Craft, Access & performance), weighted to 0–100.
4. **Hard gates after judging.** A page that fails a measured hard gate (placeholders, axe contrast, text hidden only under reduced motion, keyboard can't reach the primary action, no output) gets gated score 0, whatever the judges said. Raw scores are reported too.
5. **Verdict** per seed: higher gated score wins; equal is a tie. Per brief: consistent win / consistent loss / mixed.

## Pairs the skill lost or tied

- **taste-skill (design-taste-frontend)**, 03 Ceramics shop (e-commerce) s3103: taste-skill (design-taste-frontend) 72.5 (72.5 raw) vs skill 0.0 (75.0 raw) — skill page fails: contrast: 4 axe color-contrast node(s)
- **ui-ux-pro-max**, 03 Ceramics shop (e-commerce) s3103: ui-ux-pro-max 84.5 (84.5 raw) vs skill 0.0 (69.5 raw) — skill page fails: contrast: 4 axe color-contrast node(s)
- **frontend-design (Anthropic)**, 07 Architecture studio s7101: frontend-design (Anthropic) 89.0 (89.0 raw) vs skill 65.0 (65.0 raw)
- **frontend-design (Anthropic)**, 03 Ceramics shop (e-commerce) s3102: frontend-design (Anthropic) 86.0 (86.0 raw) vs skill 78.0 (78.0 raw)
- **frontend-design (Anthropic)**, 03 Ceramics shop (e-commerce) s3103: frontend-design (Anthropic) 0.0 (65.5 raw) vs skill 0.0 (80.5 raw) — skill page fails: contrast: 4 axe color-contrast node(s) — competitor page fails: contrast: 2 axe color-contrast node(s)
- **frontend-design (Anthropic)**, 05 Climate non-profit (public) s5103: frontend-design (Anthropic) 85.0 (85.0 raw) vs skill 71.5 (71.5 raw)

## Effort

| Arm | Runs | Turns min / median / mean / max | Mean time | Pages gate.mjs-clean (all six counts 0) | Pages failing a hard gate |
|---|---|---|---|---|---|
| Skill | 15 | 10 / 19 / 18.9 / 32 | 8.4 min | 15 of 15 | 1 of 15 |
| taste-skill (design-taste-frontend) | 15 | 5 / 6 / 6.1 / 9 | 1.7 min | 3 of 15 | 3 of 15 |
| ui-ux-pro-max | 15 | 5 / 6 / 6.6 / 14 | 1.3 min | 6 of 15 | 0 of 15 |
| frontend-design (Anthropic) | 15 | 4 / 5 / 4.7 / 6 | 1.1 min | 4 of 15 | 4 of 15 |

The skill used about three to four times the turns and five to eight times the wall time of any competitor; the competitors didn't run a measuring tool before finishing. The [matched-effort arm](2026-10-12-benchmark-v3.md#b3--matched-effort-does-the-skill-only-win-because-it-works-longer) is the control for that, and no competitor got one here. That's a limit of this comparison.

## Per brief and seed

### Skill vs taste-skill (design-taste-frontend)
| Brief | Outcome | Seed | taste-skill (design-taste-frontend) gated (raw) | Skill gated (raw) | Δ gated | Judges (c-taste: gpt · gemini / skill: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | consistent win (3W 0L 0T) | 7101 | 59.0 (59.0) | 92.0 (92.0) | +33.0 | 59 · 59 / 91 · 93 |
|  |  | 7102 | 43.0 (43.0) | 95.5 (95.5) | +52.5 | 50 · 36 / 91 · 100 |
|  |  | 7103 | 68.5 (68.5) | 90.5 (90.5) | +22.0 | 69 · 68 / 87 · 94 |
| 04 Boutique hotel | consistent win (3W 0L 0T) | 4101 | 71.5 (71.5) | 98.5 (98.5) | +27.0 | 77 · 66 / 97 · 100 |
|  |  | 4102 | 67.5 (67.5) | 95.5 (95.5) | +28.0 | 66 · 69 / 91 · 100 |
|  |  | 4103 | 66.5 (66.5) | 94.0 (94.0) | +27.5 | 70 · 63 / 88 · 100 |
| 03 Ceramics shop (e-commerce) | mixed (2W 1L 0T) | 3101 | 64.0 (64.0) | 94.0 (94.0) | +30.0 | 63 · 65 / 94 · 94 |
|  |  | 3102 | 61.0 (61.0) | 90.0 (90.0) | +29.0 | 63 · 59 / 90 · 90 |
|  |  | 3103 | 72.5 (72.5) | 0.0 (75.0) — contrast: 4 axe color-contrast node(s) | -72.5 | 76 · 69 / 72 · 78 |
| 02 Developer tool (SaaS) | consistent win (3W 0L 0T) | 2101 | 0.0 (45.0) — contrast: 12 axe color-contrast node(s) | 98.5 (98.5) | +98.5 | 44 · 46 / 97 · 100 |
|  |  | 2102 | 46.5 (46.5) | 91.5 (91.5) | +45.0 | 50 · 43 / 90 · 93 |
|  |  | 2103 | 0.0 (43.5) — contrast: 1 axe color-contrast node(s) | 94.5 (94.5) | +94.5 | 47 · 40 / 93 · 96 |
| 05 Climate non-profit (public) | consistent win (3W 0L 0T) | 5101 | 26.5 (26.5) | 97.0 (97.0) | +70.5 | 0 · 53 / 94 · 100 |
|  |  | 5102 | 0.0 (44.5) — contrast: 1 axe color-contrast node(s) | 98.5 (98.5) | +98.5 | 43 · 46 / 97 · 100 |
|  |  | 5103 | 61.5 (61.5) | 78.5 (78.5) | +17.0 | 57 · 66 / 77 · 80 |

### Skill vs ui-ux-pro-max
| Brief | Outcome | Seed | ui-ux-pro-max gated (raw) | Skill gated (raw) | Δ gated | Judges (c-uiux: gpt · gemini / skill: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | consistent win (3W 0L 0T) | 7101 | 73.0 (73.0) | 84.5 (84.5) | +11.5 | 81 · 65 / 73 · 96 |
|  |  | 7102 | 59.5 (59.5) | 95.5 (95.5) | +36.0 | 60 · 59 / 94 · 97 |
|  |  | 7103 | 64.5 (64.5) | 89.0 (89.0) | +24.5 | 70 · 59 / 84 · 94 |
| 04 Boutique hotel | consistent win (3W 0L 0T) | 4101 | 71.5 (71.5) | 90.0 (90.0) | +18.5 | 74 · 69 / 83 · 97 |
|  |  | 4102 | 71.0 (71.0) | 97.0 (97.0) | +26.0 | 73 · 69 / 94 · 100 |
|  |  | 4103 | 69.0 (69.0) | 97.0 (97.0) | +28.0 | 80 · 58 / 94 · 100 |
| 03 Ceramics shop (e-commerce) | mixed (2W 1L 0T) | 3101 | 71.0 (71.0) | 92.5 (92.5) | +21.5 | 71 · 71 / 94 · 91 |
|  |  | 3102 | 76.5 (76.5) | 88.5 (88.5) | +12.0 | 70 · 83 / 83 · 94 |
|  |  | 3103 | 84.5 (84.5) | 0.0 (69.5) — contrast: 4 axe color-contrast node(s) | -84.5 | 83 · 86 / 68 · 71 |
| 02 Developer tool (SaaS) | consistent win (3W 0L 0T) | 2101 | 44.5 (44.5) | 95.5 (95.5) | +51.0 | 53 · 36 / 94 · 97 |
|  |  | 2102 | 56.5 (56.5) | 86.5 (86.5) | +30.0 | 50 · 63 / 86 · 87 |
|  |  | 2103 | 55.5 (55.5) | 87.5 (87.5) | +32.0 | 57 · 54 / 88 · 87 |
| 05 Climate non-profit (public) | consistent win (3W 0L 0T) | 5101 | 72.5 (72.5) | 98.5 (98.5) | +26.0 | 73 · 72 / 97 · 100 |
|  |  | 5102 | 51.0 (51.0) | 98.5 (98.5) | +47.5 | 46 · 56 / 97 · 100 |
|  |  | 5103 | 71.0 (71.0) | 92.5 (92.5) | +21.5 | 73 · 69 / 91 · 94 |

### Skill vs frontend-design (Anthropic)
| Brief | Outcome | Seed | frontend-design (Anthropic) gated (raw) | Skill gated (raw) | Δ gated | Judges (c-fdesign: gpt · gemini / skill: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | mixed (2W 1L 0T) | 7101 | 89.0 (89.0) | 65.0 (65.0) | -24.0 | 81 · 97 / 71 · 59 |
|  |  | 7102 | 73.0 (73.0) | 92.0 (92.0) | +19.0 | 77 · 69 / 87 · 97 |
|  |  | 7103 | 71.0 (71.0) | 91.0 (91.0) | +20.0 | 70 · 72 / 85 · 97 |
| 04 Boutique hotel | consistent win (3W 0L 0T) | 4101 | 73.0 (73.0) | 98.5 (98.5) | +25.5 | 80 · 66 / 97 · 100 |
|  |  | 4102 | 66.0 (66.0) | 95.5 (95.5) | +29.5 | 73 · 59 / 94 · 97 |
|  |  | 4103 | 0.0 (68.5) — contrast: 1 axe color-contrast node(s) | 98.5 (98.5) | +98.5 | 71 · 66 / 97 · 100 |
| 03 Ceramics shop (e-commerce) | mixed (1W 1L 1T) | 3101 | 71.0 (71.0) | 92.5 (92.5) | +21.5 | 66 · 76 / 88 · 97 |
|  |  | 3102 | 86.0 (86.0) | 78.0 (78.0) | -8.0 | 91 · 81 / 87 · 69 |
|  |  | 3103 | 0.0 (65.5) — contrast: 2 axe color-contrast node(s) | 0.0 (80.5) — contrast: 4 axe color-contrast node(s) | +0.0 | 68 · 63 / 70 · 91 |
| 02 Developer tool (SaaS) | consistent win (3W 0L 0T) | 2101 | 0.0 (51.5) — contrast: 20 axe color-contrast node(s) | 88.0 (88.0) | +88.0 | 53 · 50 / 93 · 83 |
|  |  | 2102 | 0.0 (68.5) — contrast: 1 axe color-contrast node(s) | 86.0 (86.0) | +86.0 | 74 · 63 / 79 · 93 |
|  |  | 2103 | 77.0 (77.0) | 79.5 (79.5) | +2.5 | 81 · 73 / 73 · 86 |
| 05 Climate non-profit (public) | mixed (2W 1L 0T) | 5101 | 63.0 (63.0) | 95.0 (95.0) | +32.0 | 63 · 63 / 90 · 100 |
|  |  | 5102 | 78.0 (78.0) | 93.0 (93.0) | +15.0 | 73 · 83 / 90 · 96 |
|  |  | 5103 | 85.0 (85.0) | 71.5 (71.5) | -13.5 | 87 · 83 / 80 · 63 |


## Every competitor run

| Brief | Arm | Seed | Turns | Time | gate.mjs counts (c o w rm a n) | Measured hard gates | Prompt sha256 |
|---|---|---|---|---|---|---|---|
| 07 Architecture studio | c-taste | 7101 | 7 | 140s | 0 0 0 0 0 0 | none | `bb606e4c82b6` |
| 07 Architecture studio | c-taste | 7102 | 6 | 137s | 2 8 3 0 0 0 | none | `bb606e4c82b6` |
| 07 Architecture studio | c-taste | 7103 | 6 | 128s | 0 0 0 0 0 0 | none | `bb606e4c82b6` |
| 07 Architecture studio | c-uiux | 7101 | 6 | 126s | 0 0 0 0 0 0 | none | `20f3fbd29288` |
| 07 Architecture studio | c-uiux | 7102 | 7 | 91s | 0 0 0 0 0 0 | none | `20f3fbd29288` |
| 07 Architecture studio | c-uiux | 7103 | 6 | 97s | 21 0 0 0 0 0 | none | `20f3fbd29288` |
| 07 Architecture studio | c-fdesign | 7101 | 6 | 76s | 0 0 0 0 0 0 | none | `9959995c2f05` |
| 07 Architecture studio | c-fdesign | 7102 | 4 | 74s | 0 0 0 0 0 0 | none | `9959995c2f05` |
| 07 Architecture studio | c-fdesign | 7103 | 4 | 63s | 0 0 0 0 0 0 | none | `9959995c2f05` |
| 04 Boutique hotel | c-taste | 4101 | 5 | 79s | 10 0 0 0 0 0 | none | `3dfe0511e2c8` |
| 04 Boutique hotel | c-taste | 4102 | 6 | 86s | 4 0 0 0 1 0 | none | `3dfe0511e2c8` |
| 04 Boutique hotel | c-taste | 4103 | 7 | 83s | 1 0 0 0 0 0 | none | `3dfe0511e2c8` |
| 04 Boutique hotel | c-uiux | 4101 | 5 | 59s | 0 0 0 0 0 0 | none | `f06cb04dc82e` |
| 04 Boutique hotel | c-uiux | 4102 | 7 | 66s | 0 0 0 0 0 0 | none | `f06cb04dc82e` |
| 04 Boutique hotel | c-uiux | 4103 | 6 | 95s | 0 0 0 0 0 0 | none | `f06cb04dc82e` |
| 04 Boutique hotel | c-fdesign | 4101 | 4 | 47s | 4 0 0 0 0 0 | none | `ed64fb782fb5` |
| 04 Boutique hotel | c-fdesign | 4102 | 5 | 64s | 15 0 0 0 0 0 | none | `ed64fb782fb5` |
| 04 Boutique hotel | c-fdesign | 4103 | 5 | 60s | 11 0 0 0 0 0 | contrast: 1 axe color-contrast node(s) | `ed64fb782fb5` |
| 03 Ceramics shop (e-commerce) | c-taste | 3101 | 5 | 111s | 3 0 3 0 0 0 | none | `7824bd21bb59` |
| 03 Ceramics shop (e-commerce) | c-taste | 3102 | 5 | 96s | 4 0 0 0 0 0 | none | `7824bd21bb59` |
| 03 Ceramics shop (e-commerce) | c-taste | 3103 | 6 | 143s | 0 0 0 0 0 0 | none | `7824bd21bb59` |
| 03 Ceramics shop (e-commerce) | c-uiux | 3101 | 8 | 84s | 0 0 0 0 0 0 | none | `b3bd91fc91fb` |
| 03 Ceramics shop (e-commerce) | c-uiux | 3102 | 6 | 79s | 4 0 0 0 1 0 | none | `b3bd91fc91fb` |
| 03 Ceramics shop (e-commerce) | c-uiux | 3103 | 14 | 98s | 4 0 0 0 0 0 | none | `b3bd91fc91fb` |
| 03 Ceramics shop (e-commerce) | c-fdesign | 3101 | 4 | 72s | 8 0 0 0 0 0 | none | `608c66885f5b` |
| 03 Ceramics shop (e-commerce) | c-fdesign | 3102 | 5 | 76s | 3 0 1 0 0 0 | none | `608c66885f5b` |
| 03 Ceramics shop (e-commerce) | c-fdesign | 3103 | 5 | 70s | 8 0 0 0 0 0 | contrast: 2 axe color-contrast node(s) | `608c66885f5b` |
| 02 Developer tool (SaaS) | c-taste | 2101 | 5 | 72s | 41 35 1 0 0 0 | contrast: 12 axe color-contrast node(s) | `0ae240947b6f` |
| 02 Developer tool (SaaS) | c-taste | 2102 | 5 | 69s | 0 2 1 0 0 0 | none | `0ae240947b6f` |
| 02 Developer tool (SaaS) | c-taste | 2103 | 7 | 74s | 26 32 1 0 0 0 | contrast: 1 axe color-contrast node(s) | `0ae240947b6f` |
| 02 Developer tool (SaaS) | c-uiux | 2101 | 6 | 59s | 6 2 0 0 0 0 | none | `3a63a7e1b778` |
| 02 Developer tool (SaaS) | c-uiux | 2102 | 6 | 53s | 5 2 0 0 0 0 | none | `3a63a7e1b778` |
| 02 Developer tool (SaaS) | c-uiux | 2103 | 5 | 63s | 3 2 0 0 0 0 | none | `3a63a7e1b778` |
| 02 Developer tool (SaaS) | c-fdesign | 2101 | 4 | 65s | 5 0 0 0 0 0 | contrast: 20 axe color-contrast node(s) | `7380069542d2` |
| 02 Developer tool (SaaS) | c-fdesign | 2102 | 5 | 73s | 4 0 0 0 0 0 | contrast: 1 axe color-contrast node(s) | `7380069542d2` |
| 02 Developer tool (SaaS) | c-fdesign | 2103 | 5 | 54s | 3 0 0 0 0 0 | none | `7380069542d2` |
| 05 Climate non-profit (public) | c-taste | 5101 | 7 | 98s | 0 0 3 0 0 0 | none | `7ab7cdde39dd` |
| 05 Climate non-profit (public) | c-taste | 5102 | 9 | 106s | 4 0 0 0 0 0 | contrast: 1 axe color-contrast node(s) | `7ab7cdde39dd` |
| 05 Climate non-profit (public) | c-taste | 5103 | 5 | 120s | 0 0 0 0 0 1 | none | `7ab7cdde39dd` |
| 05 Climate non-profit (public) | c-uiux | 5101 | 5 | 70s | 5 0 0 0 0 0 | none | `b895791e12ce` |
| 05 Climate non-profit (public) | c-uiux | 5102 | 6 | 68s | 4 0 0 0 0 1 | none | `b895791e12ce` |
| 05 Climate non-profit (public) | c-uiux | 5103 | 6 | 72s | 12 0 0 0 0 1 | none | `b895791e12ce` |
| 05 Climate non-profit (public) | c-fdesign | 5101 | 5 | 66s | 18 0 0 0 0 0 | none | `f33daf409229` |
| 05 Climate non-profit (public) | c-fdesign | 5102 | 5 | 75s | 0 0 0 0 0 0 | none | `f33daf409229` |
| 05 Climate non-profit (public) | c-fdesign | 5103 | 5 | 79s | 2 0 0 0 0 0 | none | `f33daf409229` |

## Reproduce

```bash
C=~/competitors   # git clone the three repositories at the commits above
COMP="taste=$C/taste-skill/skills/taste-skill:design-taste-frontend,uiux=$C/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max:ui-ux-pro-max,fdesign=$C/skills/skills/frontend-design:frontend-design"
node evals/run-agent-benchmark.mjs generate --out evals/results/2026-10-12-benchmark-v3 --n 3 --arms c-taste,c-uiux,c-fdesign --competitors "$COMP" --parallel 5
node evals/run-agent-benchmark.mjs measure  --out evals/results/2026-10-12-benchmark-v3 --n 3 --arms c-taste,c-uiux,c-fdesign --competitors "$COMP" --parallel 1
node evals/run-agent-benchmark.mjs judge    --out evals/results/2026-10-12-benchmark-v3 --n 3 --pairs c-taste:skill,c-uiux:skill,c-fdesign:skill --competitors "$COMP" --judge-cmd "python3 evals/adapters/pplx-llm.py {model} {prompt} {images}"
node evals/run-agent-benchmark.mjs score    --out evals/results/2026-10-12-benchmark-v3 --n 3 --pairs c-taste:skill,c-uiux:skill,c-fdesign:skill --competitors "$COMP"
```
