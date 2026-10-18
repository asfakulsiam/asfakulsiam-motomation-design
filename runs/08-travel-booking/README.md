# Srimangal Hills Guesthouse

A functional static frontend for a fictional six-room tea-garden guesthouse.

All data in data/ is demo. Replace with real data before launch.

## Run
No package install or configuration needed:
`node server.mjs`
Serves http://localhost:4301 only. Unknown paths serve 404.html with HTTP 404.
Rebuild route HTML after editing catalog or templates: `node build.mjs`.
Re-export imagery, using preinstalled sharp: `node prepare-media.mjs`.
Stop the static server with Ctrl+C.

## What works
24 static routes including the designed error page. Six room details, native date fields and an interactive demo availability calendar, guest selection, optional experiences, validated guest details, review with policy consent and disabled online-payment interface, local booking confirmation, offline text downloads and a town-orientation map loaded on demand.

Drafts, reservations and local contact messages persist in localStorage. Locally booked room nights are blocked in the calendar. Guest detail forms use a static JSON acknowledgement fixture for real pending and network/error feedback; this is not a booking backend. Clearing site data removes all saved records. The privacy page offers that control.

## What does not happen
No reservation reaches a property. No email or contact message is sent. No payment is processed. No live inventory or channel sync. No exact property address or real contact number is supplied or invented. No real travel should be based on this demonstration.

## Media and launch readiness
MEDIA.md inventories every image, generated original, derivative, font and QA capture. Replace generated room/view photographs with approved real property images; the generated pictures are illustrative. Confirm room capacities, rates, amenities, access, policies, a real address and contact details before launch. This build is not production-ready. OpenStreetMap loads only after explicit consent via its load button; the marker shows town, not a guesthouse.

Self-hosted Gelasio and DM Sans are under OFL 1.1, with the notices in assets/Gelasio-OFL.txt and assets/DM-Sans-OFL.txt, verified against the [Gelasio notice](https://raw.githubusercontent.com/google/fonts/main/ofl/gelasio/OFL.txt) and [DM Sans notice](https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt). No external application code is used.

## Files and handoff
DESIGN.md: product contract, scope, research, direction and plan.
MOTION.md: Tier 1 motion.
SCHEMA.md / DATA.md: route, entity, state and integration contracts.
CHECKPOINTS.md: all six benchmark self-approvals.
GATE.md / CRITIQUE.md: separated measured, judged and unverified results.
RUN.md: times, tools, exact check commands and final output lines.
screens/: journey evidence at 375, 768 and 1440.
checks/: verbatim logs and lightweight QA code.

Canonical, sitemap and social URLs intentionally use localhost:4301, the only real origin created by this benchmark. Replace with a verified deployment origin before public launch. Static host configuration should serve /route/index.html for /route and use 404.html for unknown paths. _headers documents static host headers; server.mjs sends those headers locally.
