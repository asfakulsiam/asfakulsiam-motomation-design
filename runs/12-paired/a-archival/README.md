# Leaf & Ledger · Quiet archival

Functional static frontend for a fictional single-estate tea store.

All data in data/ is demo. Replace with real data before launch.

## Run
`node server.mjs` serves http://localhost:4311 with a real HTTP 404 for unknown routes. No package install or build is required. Stop with Ctrl+C.

## Real and demo
All routes, filters, cart, plan builder, client validation, local receipt, and subscription changes work in the browser. localStorage persists cart, builder and subscription. Payments, shipping, authentication and email are not integrated. Account is explicitly a demo; contact only acknowledges locally. Do not enter real payment or personal details.

## Files
DESIGN.md contains contract, scope, research and direction. MOTION.md, SCHEMA.md, DATA.md, MEDIA.md, CHECKPOINTS.md, GATE.md, CRITIQUE.md, RUN.md and qa/ hold the handoff and evidence. screens/ contains journey screenshots.

## Media and readiness
See MEDIA.md for original illustrations and font licences. No external image rights are assumed. This is not production-ready: fictional catalogue, policies and estate stories require replacement and review; real payments, authentication and fulfillment must be implemented.

## Deployment
Serve the folder with a static host that supports extensionless HTML routes and a 404.html error response; apply _headers. Canonicals currently reference the required localhost preview origin; replace them and sitemap.xml with the production origin before launch.
