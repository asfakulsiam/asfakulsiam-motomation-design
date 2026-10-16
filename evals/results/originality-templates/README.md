# Originality calibration: the shipped templates

Measured by `skills/asfakulsiam-motomation-design/scripts/originality.mjs` (axis O of `gates/delivery-gate.md`) in Chromium 147 at 1440×900. Not a benchmark run: no agent, no generation; the inputs are the pages already in `examples/templates/`.

- `two-builds.txt` / `.json`: two unrelated briefs, the climate nonprofit (`org.html`) and the product-launch film (`product-launch/index.html`). Every axis below 0.4: PASS.
- `ten-templates.txt` / `.json`: all ten templates, 45 pairs. 12 pairs are below 0.4 on every axis; 33 repeat on at least one axis (interaction 29, typography 7, image 5, signature 5, composition 2). Most repeats are on **interaction**: the eight section-library templates have no `:hover` rules and share the same IntersectionObserver + scroll listener + pointer listener stack, so their interaction patterns score 0.54–0.90 against each other. The two Tier 5 film templates (`launch`, `motionpf`) do not share that stack and score 0.10–0.33 against the rest.
- A page compared with itself scores 1.00 on every axis (sanity check).

Re-run: `node scripts/originality.mjs examples/templates/hotel.html examples/templates/event.html … --labels …` from the skill folder.

## Revision (Task 5, diversity arm)

The diversity arm (`evals/results/diversity/REPORT.md`) found two measurement bugs in `originality.mjs`, both fixed, and these files were re-measured:

1. Inline `<svg>` roots were dropped from the image and composition axes (`e.closest("svg")` matches the element itself), so a page whose only imagery is inline SVG read as "no imagery". Painted `role="img"` boxes are now counted too.
2. Content blocks had to be half the viewport wide, so a narrow single-column page had zero blocks. They now have to be half the width of `<main>`.

Effect here: two builds, overall 0.19 → 0.14 (image 0.33 → 0.07, composition 0.14 → 0.11), still PASS; ten templates, 11 → 12 pairs below 0.4 on every axis.

## After Fixes 4, 5 and 8 (re-measured 2026-10-16)

Same ten templates, same command, with the redefined axes (interaction = feedback, forms, navigation; image n/a when both pages have none; typography grades families). Result in `ten-templates-after-fixes.json`.

| | Before | After |
|---|---|---|
| Pairs below 0.4 on every axis | 12/45 | 4/45 |
| interaction repeats | 29 | 35 |
| typography repeats | 7 | 10 |
| image repeats | 5 | 2 (3 pairs n/a) |
| composition / signature / structure | 2 / 5 / 0 | 2 / 5 / 0 |

The stricter axes find more sameness among the shipped templates, not less: they share one navigation and feedback pattern, and several share type classes. The templates were not changed in this session.
