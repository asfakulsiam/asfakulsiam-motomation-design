# Ledgerly research record
Access: web searched and selected official/help/case-study pages fetched on 2026-10-19. Text evidence only; authenticated product screens, actual responsive layouts and animation were not observed.

## Questions
1. Which controls are essential when a shop owner retrieves an old transaction?
2. How should a financial dashboard prioritize an owner's attention without becoming a report builder?
3. How can dense financial records feel warm without losing familiar structure?
4. Which platform primitives provide accessible form and navigation behavior at low cost?

| Source and URL | Kind | Observed evidence | Intended use | Limitation |
|---|---|---|---|---|
| Wave, https://support.waveapps.com/hc/en-us/articles/25233855417492-Filter-and-sort-your-transactions | Official production help | Category/date filters, date sorting and description/amount search are documented; mobile offers fewer filters. | Changed plan from a single Filter popover to visible date/category controls. Keep full capability on mobile instead of inheriting Wave's limitation. | Documentation observed; live signed-in layout, animation and 375px behavior unverified. |
| Wave, https://support.waveapps.com/hc/en-us/articles/4416930325396-Find-an-invoice | Official production help, search excerpt | Invoice status tabs and customer/date filters with clear-all are documented. | Status tabs on invoice list; rows link to previews. | Search excerpt only; no live invoice interaction observed. |
| Wave, https://www.waveapps.com/blog/full-invoicing-cycle | Production article, search excerpt | Preview before sending is documented. | Separate saved editor, preview and mark-sent status. | Email integration cannot transfer to a local frontend. |
| Xero, https://www.xero.com/ae/accounting-software/dashboard/ | Production product page, search excerpt | Account balances, cash flow, outstanding invoices and expenses are dashboard priorities. | Lead with recorded sales, spend, net flow and outstanding invoices, linked to working lists. | Marketing description, not observed signed-in app; bank balance cannot be claimed without integration. |
| Carbon, https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines | Official design-system docs, fetched | Column sorting, toolbar for search/filter, consistent row rhythm, full-width main content, bottom pagination. | Changed pagination placement to a single attached footer and reserved header buttons for sorting. | Library behavior studied, not imported; exact mobile adaptation is custom. Fetched text limited to 7500 characters, sufficient for cited sections. |
| Namtech, https://namtech.sg/work/this-accounting-revolution/ | Accounting app case study, fetched | Reports a warm cream/terracotta system, key financial figures first and deeper machinery behind settings. | Warm neutral canvas rather than cold blue finance styling; exact palette intentionally different, action color darkened for AA, forest used for cash-in semantics. | Studio's account of its own work, not independent evidence of outcomes; screenshots/actual interaction not inspected. |
| Google Fonts CSS, https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap | Official font delivery, fetched | DM Sans font file URLs and font-display swap. | Self-host regular and bold; compact sans with tabular numerals; Georgia only for wordmark and calm sign-in text. | Font file requests are separate asset downloads. |
| DM Sans licence, https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt | Upstream licence, fetched | SIL OFL 1.1 permits embedding and redistribution with licence. | Include licence and fonts locally. | Licence evidence is not a font performance measurement. |

No code or protected layouts were copied. Original SVG interface icons and original share card were written for this build. Carbon's structural principles are implemented with native semantic HTML. Native select/date/dialog/validation are chosen over a dependency because the required behavior is already provided by the platform. No narrative or decorative animation is warranted; CSS press feedback is adequate.

## Type research
Wave and Xero are exact-type comparators for small-business bookkeeping/invoicing. Routes and capabilities above are observed in docs, not in their apps; admin, legal and authenticated errors are unverified. Namtech is a mobile accounting comparator with a broader reporting scope, not a route inventory to copy.

## Directions considered against the same contract
| Criterion | A Warm working ledger | B Dark register terminal | C Guided daily inbox |
|---|---|---|---|
| Structure | Stable sidebar; summary, chart, records; full table routes | Keyboard-first command strip; dense monochrome rows | Task inbox with one current action; lists remain separate |
| Type | Service sans, moderate weight contrast | Monospace service UI | Larger service labels and stacked cards |
| Motion | Press/selection only | Cursor feedback only | Step-to-step fade |
| All journeys | Visible one-click entry; explicit status pages | Possible but commands add learning burden | Possible but retrieval takes an extra context switch |
| Audience/trust | Familiar for a shop owner | Feels specialist and less warm | Friendly for novices, slower for repeated tasks |
| Access/responsive | Semantic rows, mobile records; low complexity | Contrast easy, mobile commands poor | Touch strong; desktop density weak |
| Distinction | Warm shell, restrained typography, chart/ledger balance | Strong character, wrong daily tone | Task-led, but risks hiding the tables |
| Technical/originality | Native platform, original system not reference clone | Platform possible, no product justification | More workflow logic, not needed |

Chosen A. Warmth stays in surfaces, spacing and brand, not oversized type or choreographed data. No archetype, mutation or signature; conventional app architecture is required by the brief. Collision tool rejected because a random structural metaphor risks replacing the product contract.
