# SCHEMA.md: Tannery Row Coffee

Data contract for a functional frontend. The site is a static export: data is read from `data/*.json` at build time,
validated in shape by `data/schema.json`. One endpoint is assumed and not provided.

## Entities
| Entity | File | Fields | Notes |
|---|---|---|---|
| Shop | data/shop.json (`item`) | name, street, town, postcode, timeZone, email, directions[], access, hours[] | `timeZone` is IANA; the open/closed line uses it, not the visitor's zone |
| Hours | inside Shop | day (0 = Sunday), label, open "HH:MM", close "HH:MM" | one row per day; a missing day means closed |
| Menu item | data/menu.json (`items[]`) | id, station (espresso, brew, pastry), name, price, spec?, notes?, allergens?, soldOut?, layers[]? | `layers` draws the cup; volumes in ml |

## Endpoint (assumed, not implemented)
`POST /api/contact` with JSON `{ name, email, topic, message }`.

| Response | The form shows |
|---|---|
| 2xx | success: "Thanks, <name>. Your message reached the bar." |
| 404, 405 or 501 | error: the message service isn't connected in this demo build; nothing was sent; email instead |
| other status | error with the status; the message stays in the form for a retry |
| network failure | error: couldn't reach the server; the message stays |

## States
| Surface | empty | loading | error | filled |
|---|---|---|---|---|
| Contact form | blank fields; submitting blank shows an inline error per field and focuses the first | "Sending…", fields and button disabled, `aria-busy` | `role="alert"` message above the form | success panel, `role="status"` |
| Open status | before hydration or without JS: "See today's hours" link | n/a (computed locally) | n/a | "Open now, until 17:00" / "Closed, opens tomorrow at 07:30" |
| Photo | n/a | `--paper-2` tint in the reserved frame | "Photo didn't load: <alt>" | the image |
| Pastry | n/a | n/a | n/a | price, or "Sold out today" when `soldOut` |
