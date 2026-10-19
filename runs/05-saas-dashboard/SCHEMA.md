# SCHEMA.md: Ledgerly

## Data model
All sample entities are fictional; source module src/data.js. One versioned workspace persisted under localStorage `ledgerly.workspace.v1`.

| Entity | Fields and validation | Relations / appears at |
|---|---|---|
| Workspace | version integer 1; demo boolean true; dashboardPeriod enum month/week; selectedTransaction, lastExpense, selectedInvoice, editingInvoice nullable id strings | Entire app; selections persist across direct entries and client-side route navigation. Transaction and invoice filters are transient view state, not financial data. |
| Profile | name required trimmed text max100; email required HTML email max200 | Sign-in, avatar, profile |
| Business | name required trimmed max100; email required HTML email max200; address multiline max500; currency USD | Sidebar, settings, invoice paper |
| Notifications | invoice boolean; weekly boolean | Settings; preferences only, never delivered |
| Transaction | id stable string; name required trimmed max100; date ISO date; category enum Inventory/Supplies/Rent/Shipping/Utilities/Marketing/Travel/Other/Sales; amount positive integer cents, input .01–9999999 USD; type income/expense; method Business card/Bank transfer/Cash/Cash register; note max1000; demo true | Overview, table, detail. Default date descending. Expense create adds row and updates all aggregates |
| Customer | id stable string; name required max100; email required max200; address max500; demo true | Invoice.customerId → Customer.id; customers, editor, invoice paper |
| Invoice | id stable string; number unique sequential INV-prefix; customerId required saved Customer; issued/due ISO dates with due >= issued; status draft/sent/paid; tax number0–100 step .01; note max1000; lines list<Line>; demo true | Invoice totals/list/editor/preview; overdue derived when sent and due before sample date |
| Line | description required trimmed max200; qty integer1–100000; price positive cents, input .01–9999999 USD | Invoice one-to-many lines. Totals rounded to minor units |

Sample reference date is 2026-10-19, printed in footer. No actual bank balance or growth statistic is invented. Totals derive from records. No authenticated session or credential is stored.

## Routes
Rendering: static entry files with client shared renderer. `/` is overview alias. Required paths:
`/sign-in`, `/dashboard`, `/transactions`, `/transactions/detail`, `/expenses/new`, `/expenses/saved`, `/invoices`, `/invoices/new`, `/invoices/preview`, `/invoices/sent`, `/customers`, `/settings`, `/empty`, `/error`, `/offline`, `/404`.
Unknown route returns styled 404 via server.mjs. Detail/preview select the chosen persisted entity; fallback first record when entered directly; clear empty state if no record exists. Flow entry meta on saved/detail/preview/sent. Sitemap is local benchmark origin, not a claimed public domain.

## Section contract and states
| Route / section | Reads | Empty | Loading | Error | Filled |
|---|---|---|---|---|---|
| Overview / metrics, cash-flow, recent | Transactions, invoices | Zero summaries, first-record prompt | n/a synchronous local reads | Storage recovery view | Derived totals, 7-day cash chart, records |
| Transactions / transaction-ledger | Transactions, filters, page/sort | No matches with clear filters | n/a synchronous | Invalid date range message | Sortable/filterable 8-row pages, labelled mobile records |
| Transaction detail | Selected transaction | Add-expense prompt | n/a | Unknown storage → recovery | Date/category/method/notes, delete confirmation |
| Expense new | Native form | Empty required fields | n/a, no fake request | Validation and retained-input storage failure | Save mutation and saved route |
| Expense saved | Last created expense | Add-first-expense guidance | n/a | Read recovery | Exact saved record with overview link |
| Invoice list | Invoice, Customer | Create invoice/status-filter empty | n/a | Read recovery | Status tabs and totals |
| Invoice editor | Invoice, Customer, lines | First blank line, customer requirement | n/a | Field, due-date, storage failure | Persist draft or preview |
| Invoice preview / invoice-paper | Invoice, Business, Customer | Create invoice prompt | n/a | Read recovery | Paper layout, edit, local mark-sent |
| Invoice sent | Selected invoice | Workspace ready | n/a | Read recovery | Local status, explicit no-email notice |
| Customers / customer-results | Customer, invoice counts | Add-customer prompt | n/a | Search no matches; dialog validation/write error | Search/edit/create |
| Settings / profile,business,notifications,bank,workspace | Settings | Defaults | n/a | Validation/write failure, destructive confirmations | Persisted preferences, exports, deferred bank interface |
| Sign-in | Profile display name | Required name | n/a | Validation/write failure | Opens local demo, not authentication |
| Empty/error/offline/404 | Local status and help | Designed route-specific guidance | n/a | Recovery action retained | Routes back into workspace |

## API surface
None: browser-only functional frontend. No form claims server submission, email delivery, bank connection or authentication. No async data surfaces, fetch or XHR in the app; loading skeletons/server request states are not applicable. Native `aria-busy` is not fabricated for instantaneous localStorage writes.

Deferred integration contract: future server must replace persistence behind read/persist, authenticate all tenant operations, schema-validate every mutation server-side, derive tenant and price server-side, implement HttpOnly Secure SameSite sessions, bank-provider authorization and email delivery with idempotency/rate limits. None is implemented or claimed in this build.

## Environment variables
Only server.mjs reads PORT, optional default 4305; no secrets. No external service keys.

## Handoff notes
Functional frontend, not production-ready. Data stored on one device is not backed up or access-controlled. Errors catch blocked/corrupt/full storage without silently overwriting it. Cross-tab changes refresh views; active forms are warned rather than replaced. Manual export supports a backup. Real deployment needs HTTPS, authenticated multi-user isolation, real server validation, financial security/privacy review, external integrations and real-device/screen-reader verification.
