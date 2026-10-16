# Follow-up: subpage failures found while gating every page (Fix 15)

The first run gated each build's home page only. Gating all 25 pages for the stamps found:

- Metal band album, merch, shows, 404: 1 text each illegible in forced colours. Cause: the gate scrolls a text into view, which lands that room's heading; the slam animation starts at 118% scale, and in forced colours the scaled heading's opaque text backplate covered the text just below it. Fix: no slam in forced colours (`.armed .hit.landed { animation: none }` in the forced-colors block), and `.door > p` lifted above the giant title (the 404 link sat under it). Same family as Fix 11.
- Water authority: DESIGN.md still required the edge state to say "Call 16162" after Fix 14 changed the number on the site (a Fix 14 regression; completeness failed). d5.py now requires "Call 0721-000000". The current nav item was a link to the page itself ("Bills" on /bills.html); it is now a marked span, as in Fixes 10 and 12.
- Funeral home, what-happens-next: heading level skipped, h1 → h3 (rule seo-08). The step list uses h2 on that page. The water-quality page had the same skip; it now has an h2 "Readings" above its three gauges.
- Every 404 page fails seo-04 (no canonical tag). Not changed: a 404 page should not declare a canonical URL; the rule, not the pages, is what needs an exception (listed as remaining).
