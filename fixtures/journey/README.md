# Journey fixtures (gate axis J)

Two small multi-page sites for `scripts/journey.mjs`, run by `scripts/gate.mjs` (and alone with `--journey`).

- `complete/` must pass all six journey checks: a sitemap whose routes are all linked within 3 clicks, every control responds at 375px (tap, swipe on the job reel, long press on the call button), the booking form renders default, validation error, loading, success and server error, the opening hours show a skeleton while their request is pending, a designed `404.html`, and the session survives reload, back, forward and two tabs.
- `incomplete/` must fail all six checks: a sitemap route (`/prices`) that nothing links to and a broken link (`gallery.html`), a button that does nothing, a form with an unlabelled field, no validation, no loading state, no server error state, an async list with no skeleton, no 404 page, and a script that throws once the tab has visited the page before (reload, back, forward).

`node skills/asfakulsiam-motomation-design/scripts/gate.mjs --journey fixtures/journey/complete` → exit 0; `… fixtures/journey/incomplete` → exit 1.
