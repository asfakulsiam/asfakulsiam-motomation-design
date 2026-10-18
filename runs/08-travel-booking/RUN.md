# Benchmark run · travel booking

## Identity and bounds
- Model ID: not exposed by this subagent runtime; unavailable, not guessed.
- First recorded execution UTC: 2026-10-18T10:41:18.286Z, from the first tool-output file timestamp. Exact invocation start was not exposed.
- Final report generation UTC: 2026-10-18T11:20:41.783Z. Final stop/end receipt appears below after shutdown.
- Route: full Thinking Sequence. Delivery: functional frontend.
- Input skill: /home/user/workspace/bench/skill-226085d/ (read-only).
- Input brief: /home/user/workspace/bench/08-travel-booking.md (read-only).
- All authored files, generated/downloaded media, captures, git history and report outputs remain under /home/user/workspace/bench/runs/08-travel-booking/. No edits to /home/user/workspace/repo.
- Local server: Node 20 static server, port 4301 only; no framework and no package installation.

## Tools available and used
Available: bash, read, apply_patch, load_skill, search_web, fetch_url, exec/exec_wait, share_file; deferred image-generation, deployment and cloud-browser tools; preinstalled Node, git, sharp, Playwright and Chromium. Local user browser unavailable.

Used: bash for build/server/check commands and downloads; read for the input skill, brief, reports and rendered screenshots; apply_patch for manual edits; search_web and fetch_url for public design/product/official sources recorded in DESIGN.md and MEDIA.md; load_skill for platform website/search/media/browser guidance; exec to discover tools and generate imagery. Three GPT Image 2.5 Flare generations supplied the illustrative landscape, double and twin interior sources. Playwright/Chromium were used through local Node scripts, sequentially, never two browsers at once. sharp produced WebP derivatives. git records local milestones. Deployment use, if completed, is recorded in the preview receipt below.

Not used: npm/package installs, a real browser login, external forms, payment services, contact messaging, permanent publication or a remote repository push. No browser purchase or external booking was made.

## Exact verification commands and actual output
Commands below ran from `/home/user/workspace/bench/runs/08-travel-booking`. No full scripts/gate.mjs scan or --journey call ran. Output blocks are read from saved final logs, not reconstructed verdicts.

### Media naming and build
`node checks/name-temporary-media.mjs | tee checks/media-naming.log`

```text
MEDIA NAMING PASS: 11 temporary generated files retain their contents under placeholder-prefixed names.
```

This mechanical migration moved all eleven temporary generated binaries to placeholder-prefixed names without removing their contents, and updated references. Original generation output basenames are recoverable by removing the prefix.

`node build.mjs | tee checks/build.log`

```text
BUILD PASS: 24 routes generated, including designed 404.
```

`node --check app.js && node --check build.mjs && node --check server.mjs`

Observed: exit 0, no output. This is syntax checking only.

### Core journey QA
`node checks/qa.mjs`

```text
JOURNEYS 375px: PASS room booking, experience addition, confirmation to arrival.
JOURNEYS 768px: PASS room booking, experience addition, confirmation to arrival.
JOURNEYS 1440px: PASS room booking, experience addition, confirmation to arrival.
QA PASS: 9 core-journey completions; 24 route responses; 40 screenshots; 239 assertions; 0 uncaught browser errors.
```

### Additional negative-state QA
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

### Required completeness
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

### Required realism
`node /home/user/workspace/bench/skill-226085d/scripts/realism.mjs /home/user/workspace/bench/runs/08-travel-booking 2>&1 | tee checks/realism.log`

```text
  Content realism  ✓
```

### Required rule-only gate
Wrapper: `node checks/run-rules.mjs`

Expanded exact command:
`node /home/user/workspace/bench/skill-226085d/scripts/gate.mjs http://localhost:4301/ http://localhost:4301/rooms http://localhost:4301/rooms/garden-veranda http://localhost:4301/rooms/tea-view-double http://localhost:4301/rooms/courtyard-twin http://localhost:4301/rooms/hill-facing-double http://localhost:4301/rooms/family-veranda http://localhost:4301/rooms/quiet-corner http://localhost:4301/availability http://localhost:4301/booking/dates http://localhost:4301/booking/guests http://localhost:4301/booking/details http://localhost:4301/booking/review http://localhost:4301/booking/confirmation http://localhost:4301/experiences http://localhost:4301/experiences/tea-garden-walk http://localhost:4301/experiences/tea-at-the-table http://localhost:4301/getting-there http://localhost:4301/house-rules http://localhost:4301/cancellation-policy http://localhost:4301/privacy http://localhost:4301/terms http://localhost:4301/contact http://localhost:4301/404 --rules --tier 1 --light`

The per-route output is pasted verbatim in GATE.md and retained in checks/rules.log. Final verdict lines:

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

### Earlier diagnostic checks and fixes
`node checks/qa.mjs --smoke` — initial two-viewport smoke test; no full journey claim from that run.
`node checks/diagnose.mjs` — saved diagnostics of selected calendar date and visible inputs.

Early custom QA attempts stopped on test-selector assumptions: a selected calendar day no longer matched its available-day accessible name; a hidden room image at tablet width was not scrollable; and tablet navigation required the menu. Selectors were corrected to reflect the actual UI. A stale consent error after ticking the checkbox was a real UI defect and was repaired; long room option text was shortened.

First rule run (checks/rules-initial.log) flagged literal HTML map insertion under sec-12 and the first experience image being lazy under perf-03. The map now uses DOM methods; the first image is eager. Revised preview was self-approved, then rules and core/edge QA were re-run on the final frontend.

## Evidence and scope
24 routes including a designed 404; 23 sitemap destinations. The custom QA records 3 core journeys at 375, 768 and 1440 pixels. The screens folder contains the 40 main journey/error captures, 8 supplemental state/viewport captures and one retained diagnostic image. All six checkpoints and the rule-correction follow-up are in CHECKPOINTS.md.

Source record: DESIGN.md identifies actual opened sources, observations and limitations; MEDIA.md records generated sources, temporary status, self-hosted fonts and actual license URLs. No competitor photo or application code was copied. No fabricated testimonial, award, property contact number or address was added.

## Known defects and launch blockers
- No known unresolved functional failure in the exercised Chromium journeys; this does not imply exhaustive correctness.
- Eleven generated media files are temporary and require replacement/approval before production. Family/single-room illustrations do not verify actual bed layouts.
- JSON-LD advisory remains on each route; no fictitious Hotel/Organization data was published.
- The property is fictional, so no real address or property map pin is invented. Arrival notes explicitly say not to travel to this demo.
- Booking and messages save locally only. No live inventory, payment, email, channel sync or multi-user concurrency backend exists. These are declared delivery boundaries, not hidden integrations.
- Localhost metadata is intentional for the benchmark and must change before public launch.

## Not verified
Full gate scan and --journey: not run, explicitly prohibited. No full stamp or H/M/V/Q/A/S scores; no originality comparison score or independent judge. Cold-open rule checks on guarded booking pages see their missing-draft interface, while custom QA covers their populated state.

No real map-tile rendering claim, physical mobile device, Safari/Firefox, screen reader, full keyboard audit, 200% zoom, exhaustive pixel contrast, Core Web Vitals, real email/payment/inventory/security/load test or production hosting configuration. The optional map's iframe insertion and local download event were verified, not third-party network reliability.

Token use, API cost and exact model identifier are not exposed. Any cost-script zeroes resulting from absent runner transcript/run.json must not be interpreted as actual usage or a failed frontend.

## Cost and isolated design-memory receipts
`node /home/user/workspace/bench/skill-226085d/scripts/cost.mjs record /home/user/workspace/bench/runs/08-travel-booking --out checks/cost.json 2>&1 | tee checks/cost.log`

Actual output:
```
08-travel-booking · NOT completed (no run.json) · route not stated
  tokens   in 0 · out 0
  time     not recorded wall clock
  tools    0 call(s): none
  retries  0
```
The runner's raw-API transcript and run.json are unavailable to this script. These are missing-telemetry defaults, not real usage or completion measurements. The website build and QA results are recorded above independently.

`node /home/user/workspace/bench/skill-226085d/scripts/memory.mjs log --project /home/user/workspace/bench/runs/08-travel-booking --brief "Six-room Srimangal tea garden guesthouse direct booking" --category travel-booking --archetype none --palette "Tea-green ink on warm paper" --fonts "Gelasio/DM Sans" --motion "Tier 1 press feedback; instant booking states" --signature none --tier 1 --layout "split editorial discovery; two-column booking desk" 2>&1 | tee checks/memory.log`

Actual output:
```
Logged run #1 to /home/user/workspace/bench/runs/08-travel-booking/.motomation/log.json
  fingerprint: layout=split editorial discovery; two-column booking desk · tier=1
```
The skill's project-local memory option is used because the benchmark prohibits writing to user-level memory outside the output folder.

## Supplementary preview receipt
Called the available deployment tool after committing the completed site:
```
deploy_website({
  project_path: "/home/user/workspace/bench/runs/08-travel-booking",
  site_name: "Srimangal Hills Guesthouse",
  entry_point: "index.html"
})
```
Actual response (also saved as checks/deploy-receipt.json):
```
status: blocked
error: Deployment blocked — forbidden browser APIs detected in: build.mjs, privacy/index.html, checks/edge-qa.mjs, app.js. localStorage, sessionStorage, indexedDB, Pointer Lock, and Fullscreen APIs are unavailable in the preview iframe. Remove these usages — use in-memory variables for transient state, or the backend server for persistent storage.
```
No preview URL or app artifact was created. The brief explicitly requires localStorage-persisted booking, so the frontend was not weakened to satisfy a supplementary iframe restriction. The complete local static site and its Node server remain the authoritative deliverable. No deployment retry or permanent publication was attempted.

## Version-control receipt
Local branch: design/travel-booking. Completed frontend/evidence commit: 499b315. Initial scaffold commit: 5e86331.
The first unqualified final commit attempt stopped because git had no default author identity. It was retried successfully with repository-command-scoped, clearly synthetic author metadata:
`git -c user.name='Benchmark Runner' -c user.email='benchmark@localhost' commit -m "Complete responsive booking journeys, media and verification handoff"`.
No global git configuration was written and nothing was pushed remotely.

## Final artifact inventory and shutdown
Exact command: `node checks/finish.mjs`.
It checks required documents, the 24 route HTML files and the actual PNG widths, verifies PID 14313 is this run's `node server.mjs`, sends SIGTERM and probes port 4301 for ECONNREFUSED.

Actual final output:
```text
ARTIFACT INVENTORY PASS: 24 route HTML files; 13 core-journey states at each of 375, 768 and 1440px; 49 screenshots total.
SERVER STOP PASS: port 4301 refuses connections after SIGTERM to this run’s node server.mjs.
END UTC: 2026-10-18T11:23:34.888Z
```
The end UTC above records completion of verification and server shutdown. The final local commit only adds these receipts; no frontend code changed after the passing browser/rule checks.
