# Verification

## Measured

The following is saved stdout/stderr from checks actually run on the final frontend. These are rule-only results, not a full gate pass. All paths are from the benchmark folder; no package was installed.

### Completeness
`node /home/user/workspace/bench/skill-226085d/scripts/completeness.mjs /home/user/workspace/bench/runs/08-travel-booking 2>&1 | tee checks/completeness.log`

```text
DESIGN.md
  X — completeness (travel-booking, Bangladesh, admin panel: no) [functional frontend]  ✓
      Routes:      20/20 required present
      Journeys:    3/3 connected
      Functions:   3/3 present · 2 not required (reason given)
      States:      1/1 defined
      Legal:       4/4 present
      Edge cases:  1/1 handled
      Admin:       0/0 present · 1 not required (reason given)
      Skeletons:   1/1 present
      Template:    18/18 present · 2 not required (reason given)
      ⚠ media: 11 asset(s) in MEDIA.md must be replaced or cleared before production; not production-ready until they are  (warning)
```

### Content realism
`node /home/user/workspace/bench/skill-226085d/scripts/realism.mjs /home/user/workspace/bench/runs/08-travel-booking 2>&1 | tee checks/realism.log`

```text
  Content realism  ✓
```

### Rule sets, all 24 routes
`node checks/run-rules.mjs` executes exactly:

`node /home/user/workspace/bench/skill-226085d/scripts/gate.mjs http://localhost:4301/ http://localhost:4301/rooms http://localhost:4301/rooms/garden-veranda http://localhost:4301/rooms/tea-view-double http://localhost:4301/rooms/courtyard-twin http://localhost:4301/rooms/hill-facing-double http://localhost:4301/rooms/family-veranda http://localhost:4301/rooms/quiet-corner http://localhost:4301/availability http://localhost:4301/booking/dates http://localhost:4301/booking/guests http://localhost:4301/booking/details http://localhost:4301/booking/review http://localhost:4301/booking/confirmation http://localhost:4301/experiences http://localhost:4301/experiences/tea-garden-walk http://localhost:4301/experiences/tea-at-the-table http://localhost:4301/getting-there http://localhost:4301/house-rules http://localhost:4301/cancellation-policy http://localhost:4301/privacy http://localhost:4301/terms http://localhost:4301/contact http://localhost:4301/404 --rules --tier 1 --light`

```text
gate: constrained machine (2 CPUs); a failed scan is retried once in the light footprint

http://localhost:4301/
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/rooms
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/rooms/garden-veranda
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/rooms/tea-view-double
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/rooms/courtyard-twin
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/rooms/hill-facing-double
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/rooms/family-veranda
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/rooms/quiet-corner
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/availability
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/booking/dates
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/booking/guests
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/booking/details
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/booking/review
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/booking/confirmation
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/experiences
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/experiences/tea-garden-walk
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/experiences/tea-at-the-table
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/getting-there
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/house-rules
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/cancellation-policy
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/privacy
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/terms
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/contact
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

http://localhost:4301/404
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ seo-10  no JSON-LD; add Product, Article, FAQ, Event or Organization where the page is eligible  (warning)

RULES CHECK EXIT: 0
```

### Lightweight custom journey QA
`node checks/qa.mjs`

```text
JOURNEYS 375px: PASS room booking, experience addition, confirmation to arrival.
JOURNEYS 768px: PASS room booking, experience addition, confirmation to arrival.
JOURNEYS 1440px: PASS room booking, experience addition, confirmation to arrival.
QA PASS: 9 core-journey completions; 24 route responses; 40 screenshots; 239 assertions; 0 uncaught browser errors.
```

The custom QA performs real user input through every booking step, not storage-seeded core-journey signoff. Three journeys at three viewport widths produce nine completions. The 24 route responses include the designed HTTP 404. Its 40 captures comprise 13 core states at each width and one mobile 404.

### Supplementary negative-state and palette QA
`node checks/edge-qa.mjs`

```text
LINKS PASS: 23 unique rendered internal destinations respond 200.
PALETTE #203c32 on #f6f4ed: 10.88:1
PALETTE #59645b on #f6f4ed: 5.61:1
PALETTE #59645b on #e9ecdf: 5.16:1
PALETTE #fffefa on #203c32: 11.87:1
PALETTE #8b3f2d on #f6f4ed: 6.70:1
PALETTE #a12726 on #fff4f0: 6.86:1
JS GZIP: 11185 bytes for app.js + app-data.js (Tier 1 limit 30720 bytes).
EDGE QA PASS: 41 assertions, including blocked nights, long stays, overlap, removal, contact pending/error/success, storage denial and palette math.
```

The overlap/removal negative test alone stages a labelled local record. The primary booking journey does not. Palette math does not measure text antialiasing or all rendered pixels. Map iframe insertion is checked without claiming that third-party tiles rendered.

## Judged

self (opinion): the complete frontend matches the contract, with distinct discovery and booking density. Representative screenshots inspected: both home viewports; desktop room list; mobile room list; mobile and desktop room/calendar views; mobile guests; tablet details; mobile and desktop review and confirmation; desktop experience addition; mobile arrival and contact pending/error states.

self (opinion): retain the JSON-LD advisory rather than publish fictitious Hotel/Organization claims. Canonical/social/sitemap origins are the real local origin, not an invented public domain. Replace them only after obtaining a verified deployment origin.

self (opinion): eleven temporary generated media files must be replaced or cleared for a real launch. No claim of production readiness, WCAG certification, exceptional-design score or independent review is made.

## Not verified

The benchmark prohibits the full gate scan and its --journey mode; neither ran. No full gate stamp, layout/craft score, originality axis or all-axis pass is claimed.

Rule-only checks cold-open guarded booking routes, so some measurements see the honest missing-draft interface rather than a populated form. Populated forms and confirmation were separately exercised and captured by the custom QA.

No physical device, screen reader, Safari/Firefox, exhaustive keyboard order, text zoom, rendered-pixel contrast audit, CWV/LCP/CLS trace, production security audit, map tile/network reliability or load test. No reservation backend, live inventory, payment processing, messaging or channel sync exists.

The local server is stopped at handoff; rerun `node server.mjs` to inspect at port 4301. The supplementary deployment attempt was blocked because its iframe prohibits the localStorage persistence explicitly required by the brief; no preview artifact or URL was created. The benchmark's HTTP-status behavior is implemented and checked by server.mjs.
