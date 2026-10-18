# Schema handoff demo (v2.7.0)

A small build made with the v2.7.0 skill to show the `SCHEMA.md` every build now ships (`templates/SCHEMA.md`).

| File | What |
|---|---|
| [`brief.md`](brief.md) | the brief |
| [`DESIGN.md`](DESIGN.md) | rules acknowledgement, Steps 1–2 References, concept, type, colour, restraint record |
| [`SCHEMA.md`](SCHEMA.md) | data model, routes, section contract, API surface, handoff notes |
| [`index.html`](index.html), [`style.css`](style.css), [`request.js`](request.js), [`_headers`](_headers) | the page |

Every `<section id>` in `index.html` (`#top`, `#services`, `#process`, `#request`, `#hours`) has a row in the section contract.

`node skills/asfakulsiam-motomation-design/scripts/gate.mjs docs/examples/schema-handoff/index.html --rules --tier 1` prints
`rules: C0 S2 P0 K0`: seo-11 (a one-page brief has no other pages to link, and inventing them is what `gates/rules.md`
forbids) and seo-18 (no og:image asset in the brief). The full gate and stamp were not run for this demo.
