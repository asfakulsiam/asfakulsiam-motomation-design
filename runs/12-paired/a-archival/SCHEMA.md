# Leaf & Ledger · frontend schema

## Entities
Tea: id string; slug string; name string; estate string; origin enum Bangladesh/India/Nepal; type enum Black/Green/White; caffeine enum Moderate/Low; notes string; price integer USD; weight 50g; brew temperature and minutes; demo true.
CartLine: id string; kind tea/subscription; quantity integer 1–10; teaId or plan id and teaIds. Prices resolved from catalogue, never trusted from stored price.
Plan: duo (2 × 50g, $24 monthly) or trio (3 × 50g, $34 monthly); exact distinct teas required; recurring monthly, no minimum.
Draft: plan and selected tea IDs persisted locally. Subscription: plan, tea IDs, status active/paused, skipped boolean; display next delivery relative to today. Receipt: local unique reference, lines, total, created timestamp; demo true; no personal address/email stored.
Contact form data: name, email, message, never transmitted or persisted.

## Routes
/, /shop, /tea/sylhet-black, /tea/assam-gold, /tea/ilam-green, /tea/darjeeling-first, /tea/nepal-white, /tea/bangladesh-green, /subscriptions, /subscriptions/build, /cart, /checkout, /confirmation, /account, /account/subscription, /estates, /brewing-guide, /shipping, /returns, /privacy, /terms, /contact, /404

## States
Cart empty / filled; no-match filters; builder incomplete / ready / pending / saved / storage error; checkout invalid / pending / demo confirmation / storage error; management active / paused / skipped / pending / saved / storage error; contact default / validation error / pending / local acknowledgement. Products are already rendered HTML, so no artificial list loading. Images reserve intrinsic size and use on-error illustration text fallback. Buttons have hover/focus/active/disabled/pending states.
Storage unavailable: alert explains changes cannot be saved, operation stays retryable. Malformed stored records are discarded with a recovery message. No server-error pretence: no backend exists. Error states describe local failures.

## Persistence and validation
localStorage keys ll-cart-v1, ll-draft-v1, ll-subscription-v1, ll-receipt-v1. Validate schema on every read; malformed data defaults safely. No auth token or PII stored. Plan selections exact; quantity integer clamped 1–10; all required form fields checked using native validity with visible error region.

## API and handoff
No API. Before real launch implement GET /teas, POST /checkout, signed payment confirmation, authenticated GET/PATCH /subscription, POST /contact with server validation and rate limits. Replace all fictional records, policies and prices. Payment card fields are disabled and labelled; demo order button never charges.
