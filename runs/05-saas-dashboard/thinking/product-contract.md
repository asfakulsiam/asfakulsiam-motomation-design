# Product contract, settled before concepts
Ledgerly is a fictional small-shop owner's daily finance workspace, not a marketing site. Jobs: understand today's position; record expenses; prepare and mark invoices sent; retrieve historical transactions. Business value is bookkeeping clarity, not a specified subscription/payment business.

Journeys: /sign-in → /dashboard → /expenses/new → /expenses/saved → /dashboard; /dashboard → /invoices → /invoices/new → /invoices/preview → /invoices/sent; /dashboard → /transactions → /transactions/detail, with visible date/category filtering in /transactions.

High-density tables and medium-density forms. Desktop persistent sidebar; mobile top navigation in a wrapping grid, stacked data records, one-column fields, no horizontal page scroll at 320px. Save states are local and explicitly labelled; storage failures retain input and show recovery. Cross-tab storage events refresh data.

All required route families and empty/error/offline/404 are included. Profile/business/notification settings persist. Customers support add/edit/search. Authentication, email delivery and bank sync are not integrations; their interfaces clearly say unavailable/deferred. Invoice "mark sent" records a local status, not an email claim. No real credentials, bank details, external requests, tax filing, admin or public marketing/legal pages.
