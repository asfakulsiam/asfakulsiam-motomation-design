# DATA.md: Tannery Row Coffee

All data in data/ is demo. Replace with real data before launch.

| File | What it holds | Replace with |
|---|---|---|
| data/shop.json | fictional shop: name, address in a fictional town, time zone, email on the reserved `.example` domain, directions, access, hours | the shop's real details; check the access line with the shop |
| data/menu.json | twelve sample items with plausible UK prices (GBP), specs and allergens; one pastry marked sold out to show the state | the real menu and prices; allergens confirmed by the kitchen |
| data/schema.json | JSON Schema for both files | keep; extend if fields are added |

Every record carries `"demo": true`. `SITE_URL` (see `.env.example`) sets the canonical origin; unset, the build uses `https://tannery-row.example`.
