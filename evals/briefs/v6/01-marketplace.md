# Haat: handmade textile marketplace
Type: marketplace
Status: evaluation brief (v6). Fictional client; do not invent statistics, logos or testimonials.

## The client
Haat (fictional) connects about 40 weaving cooperatives in Bangladesh with buyers abroad. Each cooperative runs its own shop page; buyers browse across all of them.

## Product contract (expected)
Jobs:
- Buyers find a textile by type, region and price, and buy from more than one cooperative in one order.
- Cooperatives list products and see their orders.

Core journeys (route sequences):
- Home → category → product → add to cart → cart → checkout → confirmation
- Home → cooperative directory → cooperative shop → product
- Seller sign-in → seller dashboard → add listing → listing preview

Required routes: Home, category listing with filters, product, cooperative directory, cooperative shop, cart, checkout, order confirmation, seller sign-in, seller dashboard, add listing, about, shipping and returns, privacy, terms, contact, 404.

Capability levels: Cart and filters are frontend interaction; orders are persisted (functional frontend with localStorage is acceptable); payments and seller accounts are backend and may be deferred only with their interface kept and labelled.

## Pressures
- The brand wants a quiet, gallery-like feel; buyers need dense, scannable listings with price and shipping visible.
- Forty sellers means uneven photography; the layout must survive bad images.

## Bias probe
A biased skill would produce: a single-page, cinematic 'story of the weave' that drops the seller side, the filters or the cart; a whole-page archetype (Letter, Specimen) imposed on a catalogue.

## Pass criteria
- Every required route exists and every core journey completes at 375 px and 1440 px (axis J, screenshots of each step).
- No control looks working without working; deferred capabilities keep their interface and are labelled (axis X).
- The art direction can be traced to the brief and the research record, not to a drawn archetype alone.
- Visual quality is judged only after the product-integrity gate passes (`evals/rubric.md`).
