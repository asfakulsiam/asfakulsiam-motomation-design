# Journey fixtures (gate axis J)

Two small multi-page sites for `scripts/journey.mjs`, run by `scripts/gate.mjs` (and alone with `--journey`).

- `complete/` must pass all six journey checks: a sitemap whose routes are all linked within 3 clicks, every control responds at 375px (tap, swipe on the job reel, long press on the call button; a natively disabled button is skipped, since by specification it does nothing), the booking form renders default, validation error, loading, success and server error, the opening hours show a skeleton while their request is pending, a designed `404.html`, and the session survives reload, back, forward and two tabs.
- `incomplete/` must fail all six checks: a sitemap route (`/prices`) that nothing links to and a broken link (`gallery.html`), a button that does nothing, a form with an unlabelled field, no validation, no loading state, no server error state, an async list with no skeleton, no 404 page, and a script that throws once the tab has visited the page before (reload, back, forward).

- `clean-urls/` links every page without `.html` (`/services` answers `services.html`), as Netlify, Cloudflare Pages, Vercel `cleanUrls` and GitHub Pages serve them; nav must pass.
- `live-and-locked/` has a catalogue filter with no submit control (a live control, not a submit flow), a "choose two" checkbox group whose other boxes are disabled once two are picked (skipped, not failed), a submit button disabled until the pick is complete (validation not verified), a save-in-the-browser-then-next-page flow (loading and success seen, server error not verified) and a reset guarded by `confirm()` (the dialog is a response). It must pass.
- `strict-form/` has a booking form that rejects the auto-filled values; its loading, success and server-error states must read "not verified", not fail.
- `overflow/` has a header wider than a 375px phone; it must be one layout failure naming the widest element.
- `many-pages/` puts forms on pages linked after the first 12; both must be checked.

- `form-replaced/` is one page whose form is replaced by its success message on a 200, as a React or Vue app does; its forms check (all five states) and a link that wraps over two lines at 375px (it must respond to a tap) are asserted.

`node skills/asfakulsiam-motomation-design/scripts/gate.mjs --journey fixtures/journey/complete` → exit 0; `… fixtures/journey/incomplete` → exit 1.
