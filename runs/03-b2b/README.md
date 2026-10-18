# Cargoline: Freight Visibility Software

Cargoline provides multi-modal container tracking, predictive delay alerts, and automated landed cost calculations for mid-size ocean, air, and intermodal freight importers.

> All data in data/ is demo. Replace with real data before launch.

## What is real, what is demo

| Part | Status |
|---|---|
| Pages, navigation, responsive layouts, CSS design system | real, production code |
| Interactive controls (filters, billing toggle, validation, modal flows) | real, client-side interaction |
| Content in `data/` (shipments, integrations, plans, stories) | demo (every entry has `"demo": true`) |
| Live AIS satellite radar feed and real-time carrier EDI gateways | demo simulation (deterministic data from `data/shipments.json`) |
| Salesforce / HubSpot CRM lead capture | demo stub with client-side validation (interface: `/demo` and `/contact`) |

## Run

```bash
# Serve with built-in zero-dependency Node static server on port 4302
node serve.js
```
Opens http://localhost:4302 with complete route handling, HTTP security headers, and custom 404 responses.

## Configure

No external configuration, database setup, or third-party API keys are required to explore or evaluate the frontend.
In production, configure carrier webhooks and ERP endpoint URLs via your application environment variables.

## Deploy

Deploy directly to Cloudflare Pages, Vercel, Netlify, or any standard HTTP web server:
- Include all static HTML files and the `assets/` directory.
- Ensure the server redirects unknown routes to `404.html` with an HTTP 404 status header.
- Headers are declared in `_headers` for Cloudflare Pages / Netlify compatibility.

## Media

Every visual asset and its licence status is catalogued in `MEDIA.md`.
All assets used in Cargoline are custom vector illustrations and diagrams licensed under the MIT project licence. No unverified third-party assets require replacement before production.

## Files

- `DESIGN.md`: Art direction, product contract, derived scope, type and colour design system.
- `MOTION.md`: Motion principles, tier definitions, tokens, and reduced-motion fallbacks.
- `MEDIA.md`: Inventory of all visual assets and licence verifications.
- `SCHEMA.md`: Data contracts, entity definitions, route maps, section contracts, and states.
- `DATA.md`: Documentation of mock data files and schema relationships.
- `CHECKPOINTS.md`: Step-by-step log of the six design skill checkpoints.
- `CRITIQUE.md`: Design review critique and measured heuristics.
- `GATE.md`: Full gate evaluation output across completeness, realism, and rule sets.
- `RUN.md`: Benchmark execution log, timestamps, environment specifications, and check results.

## Licence

MIT License. See LICENSE for details.
