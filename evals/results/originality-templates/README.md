# Originality calibration: the shipped templates

Measured by `skills/asfakulsiam-motomation-design/scripts/originality.mjs` (axis O of `gates/delivery-gate.md`) in Chromium 147 at 1440×900. Not a benchmark run: no agent, no generation; the inputs are the pages already in `examples/templates/`.

- `two-builds.txt` / `.json`: two unrelated briefs, the climate nonprofit (`org.html`) and the product-launch film (`product-launch/index.html`). Every axis below 0.4: PASS.
- `ten-templates.txt` / `.json`: all ten templates, 45 pairs. 11 pairs are below 0.4 on every axis; 34 repeat on at least one axis. Most repeats are on **interaction**: the eight section-library templates have no `:hover` rules and share the same IntersectionObserver + scroll listener + pointer listener stack, so their interaction patterns score 0.54–0.90 against each other. The two Tier 5 film templates (`launch`, `motionpf`) do not share that stack and score 0.10–0.33 against the rest.
- A page compared with itself scores 1.00 on every axis (sanity check).

Re-run: `node scripts/originality.mjs examples/templates/hotel.html examples/templates/event.html … --labels …` from the skill folder.
