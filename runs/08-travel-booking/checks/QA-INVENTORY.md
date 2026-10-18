# Lightweight QA inventory

## Claims to verify
- All 24 routes return their correct content, one h1 and working internal navigation; unknown routes return styled HTTP 404.
- Six rooms can be compared and filtered by party size, with reset.
- Room detail selects the correct room and opens dates.
- Dates support native fields, month previous/next, day selection, blocked days, invalid date ranges and continued valid dates.
- Guest step enforces capacity; optional experience updates totals and can be removed.
- Details require name, email and phone; reload preserves draft; errors are designed.
- Review needs consent, shows disabled payment boundary, and saves a local reservation.
- Confirmation survives reload, matches total, downloads a text summary and links to arrival.
- Experience add/remove persists into booking.
- Arrival offers download, loads an explicitly town-only OSM map on demand, and has no invented property address.
- Contact form validates, shows actual network pending/error, and stores a local message with no delivery claim.
- Privacy clearing is a two-activation destructive action.
- Mobile navigation opens, navigates and remains in viewport.

## Visual evidence
Core journey screens at 375, 768 and 1440: home; rooms; room detail; date selection; guest count; guest details; review; confirmation; experiences; experience detail; experience added; getting there.
Viewport fit and image load checks on all public routes, plus 320 and 720 CSS pixel reflow spot checks. Inspect hero, selected calendar, dense review and confirmation in screenshots.

## Off-happy-path tests
Missing details, reversed dates, demo blocked night, overcapacity, no policy consent, intercepted response 500, delayed response pending, empty confirmation, reload, back/forward, second tab, booking overlap, local record removal and cleared data.

## Limits
No full scripts/gate.mjs scan, no --journey. No physical device, assistive technology, performance/CWV or real payment/email/channel checks.
