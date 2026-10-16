# Axis J (journey) evidence

Measured by `skills/asfakulsiam-motomation-design/scripts/gate.mjs` with `scripts/journey.mjs`, Chromium 147, on a 2-CPU sandbox. Not a benchmark run.

- `hotel-full-gate.txt`: the full gate on an existing build, `examples/templates/hotel.html` (5 min 29 s). The one-page axes still pass with the same stamp as before (`gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0`), but the page now **fails**: the journey finds two broken links (`/` and `gallery`), a newsletter form on a linked template (`personal.html`) with no request behind it (so no loading, success-after-server or server-error state), and no designed 404 view. Mobile (22/22 controls, 1 swipe) and session (6/6) pass; there are no async surfaces.
- `fixture-complete.txt`: `fixtures/journey/complete/`, all six checks pass (exit 0).
- `fixture-incomplete.txt`: `fixtures/journey/incomplete/`, all six checks fail (exit 1), each with the missing state named.
