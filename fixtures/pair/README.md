# Paired-direction fixtures (scripts/pair.mjs)

One fictional product (Leaf & Ledger, three routes: /, /shop, /subscribe with one form), three builds:

- `archival/`: direction A.
- `reskin/`: direction A's markup, unchanged, with a loud stylesheet. The defect: two "directions" that are one composition
  in two themes. `pair.mjs archival reskin` must fail (cosmetic-only routes, shared markup).
- `poster/`: the same routes, the same form fields and the same `order.js`, with every page recomposed. `pair.mjs archival
  poster` must pass: the shared form and logic are required parity, not repetition.
