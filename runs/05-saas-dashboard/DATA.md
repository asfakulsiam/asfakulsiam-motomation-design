# DATA.md: Ledgerly
All seed records in src/data.js are demo. Replace with validated real sources only after secure backend work; do not put sensitive data into this local prototype.

| Entity | Source | Initial entries | Coverage |
|---|---|---|---|
| Workspace/settings | src/data.js | One versioned workspace | Profile, business, both notification booleans |
| Customer | src/data.js customers | 4 | Unique fictional organizations and example.com subdomain email addresses |
| Transaction | src/data.js transactions | 18 | Income/expenses, varied dates/amounts/categories/methods; 3 pages of 8 |
| Invoice | src/data.js invoices | 4 | Draft, sent, derived overdue, paid; one invoice with multiple line items |

Loader: read() in src/app.js uses structuredClone seed when no storage exists; otherwise parses and validates version/entity arrays. persist(next,form) writes the entire workspace and catches storage failure before changing in-memory data. All form mutations persist. Draft editing and current record selections persist. UI-only transaction filters/sort/page reset on a full reload; financial data does not.

Explicit new-account case: settings → Start empty workspace → confirmation removes transactions/invoices/customers while retaining profile/business. Restore demo records is separately confirmed and replaces the workspace. A filter with no result gives another empty state without deleting data.

Sample totals are computed by the application; no sample financial figure is represented as a real client's business statistic. Fixed demo reference date avoids an inconsistent overdue chart when benchmark is replayed. CSV export escapes quotes and formula prefixes; JSON export is a local download. Export does not upload anything.

Same-tab History API navigation reuses the current state; direct entries/reloads validate the stored workspace. Storage events refresh read-only views; active forms show a conflict warning and disable submit until reload. This is not a transactional multi-user database or a guarantee against simultaneous writes. Export is supported; importing/reconciling an export is not implemented. Offline saves and in-app navigation require the workspace to have already loaded. There is no service worker for cold offline starts.
