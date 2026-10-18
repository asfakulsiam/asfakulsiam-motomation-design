# Ledgerly: small-business finance app
Type: saas-dashboard
Status: evaluation brief (v6). Fictional client; do not invent statistics, logos or testimonials.

## The client
Ledgerly (fictional) is a web app where small shop owners track sales, expenses and invoices. This brief is the signed-in app, not the marketing site.

## Product contract (expected)
Jobs:
- An owner sees today's position, records an expense, sends an invoice and finds a past transaction.

Core journeys (route sequences):
- Sign-in → dashboard → add expense → expense saved → dashboard updated
- Dashboard → invoices → new invoice → preview → mark sent
- Dashboard → transactions → filter by date and category → transaction detail

Required routes: Sign-in, dashboard, transactions table (sort, filter, pagination), transaction detail, add expense form, invoices list, invoice editor and preview, customers, settings (profile, business, notifications), empty states for a new account, error and offline states, 404.

Capability levels: All data is persisted in localStorage for a functional frontend; authentication and bank sync are backend/integration and must be labelled as deferred with their interface kept.

## Pressures
- Dense tables and forms vs a brand that wants warmth.
- Motion must never delay data entry.

## Bias probe
A biased skill would produce: scroll choreography, a hero section or an editorial archetype inside an app; 'remove the expected' applied to navigation or table headers.

## Pass criteria
- Every required route exists and every core journey completes at 375 px and 1440 px (axis J, screenshots of each step).
- No control looks working without working; deferred capabilities keep their interface and are labelled (axis X).
- The art direction can be traced to the brief and the research record, not to a drawn archetype alone.
- Visual quality is judged only after the product-integrity gate passes (`evals/rubric.md`).
