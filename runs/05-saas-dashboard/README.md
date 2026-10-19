# Ledgerly local finance workspace
Functional frontend for the independent signed-in SaaS dashboard benchmark. This is not a secure, production-ready financial service.

## Run
Node 20 is sufficient; no package installation.
```sh
npm run build
npm run dev
```
Open http://localhost:4305/sign-in for the demo entry, or http://localhost:4305/dashboard for the overview. `PORT=4305` is the default.

All data in data/ is demo. Replace with real data before launch.

## Local runtime limits
The route entry files work on direct navigation. Once loaded, same-origin workspace links use the History API and shared renderer, retaining transaction filters and allowing local saves/navigation without network access. Opening or reloading still needs the local server; there is no service worker or offline installation. Use Back/Forward normally.

This is not a secure accounting service: no authentication, encryption, reconciliation, bank connection, email delivery, remote backup, payment processing or multi-user locking. Keep exports as backups and do not enter sensitive information. Changes in another tab disable active form submissions until reload to avoid silently replacing newer records.

Final serving output is `dist/`; `site/` is a retained intermediate from the first build, not the deliverable. Start with `npm run build && npm run dev` and open `http://localhost:4305/sign-in` or `/dashboard`. Validation details and the machine-computed handoff are in `RUN.md` and `GATE.md`.
The browser seed is src/data.js; build.mjs produces matching data/ JSON snapshots. Only use real data after implementing secure backend persistence and access control.

## Included
- Expense create/save, overview update, transaction detail/delete.
- Transaction date/category/search filters, sort, eight-record pagination and CSV export.
- Invoice editor with customer selection, editable line items/tax, draft persistence, preview and local mark-sent status.
- Customer create/edit/search.
- Profile, business and notification preferences, backup download, confirmed empty/reset actions.
- Empty/new-account guidance, storage recovery, offline local use and a styled 404.

All finance/settings records persist in localStorage `ledgerly.workspace.v1`. No credentials, bank connection, emails or notifications are processed. Authentication and bank sync keep explicitly deferred interfaces; invoice marking records status, not delivery.

## Architecture
`src/app.js`: shared original browser UI and persistence.
`src/data.js`: marked fictional seed.
`src/styles.css`: warm compact SERVICE STYLE.
`build.mjs`: static route entrypoints.
`server.mjs`: safe local static hosting with headers and 404.
`dist/`: runnable build. `site/` is an earlier retained intermediate build, not the final server target.

DESIGN.md, MOTION.md, SCHEMA.md and DATA.md explain the contract. MEDIA.md documents fonts and original graphics; font licence is bundled in assets/OFL.txt. Research and source URLs are in craft/research.md. No copied proprietary layout/assets. No package dependencies.

## Verification
Actual commands, exit codes, raw logs, handoff computation, known defects and NOT VERIFIED areas are in RUN.md and checks/. Screenshots in screens/ are evidence, not a claim of real-device testing. Do not infer a passing gate from this README; only the actual handoff record is authoritative.
