# Srimangal Hills: data and interface contract

## Data model
All entities are demo-labelled and held in data/catalog.json; data/schema.json describes their fields.

| Entity.field | Type | Required | Appears at |
|---|---|---|---|
| Room.slug | unique lowercase slug | yes | /rooms and /rooms/{slug} |
| Room.name | string | yes | room cards and booking summary |
| Room.price | integer BDT/night | yes | room detail and totals |
| Room.capacity | integer 1–4 | yes | guest step and room comparisons |
| Room.bed | string | yes | detail and list |
| Room.area | integer square metres, demo | yes | detail |
| Room.description | string | yes | room list and detail |
| Room.image | local image path | yes | card and detail |
| Room.access | string | yes | detail |
| Room.demo | true | yes | records |
| Experience.slug | unique lowercase slug | yes | /experiences/{slug} |
| Experience.name | string | yes | cards, detail, booking |
| Experience.price | integer BDT/person | yes | review total |
| Experience.duration | string | yes | detail |
| Experience.demo | true | yes | records |
| Draft.room | ref Room.slug | yes | entire booking |
| Draft.checkin / checkout | ISO date strings | yes before guests step | dates and summary |
| Draft.guests | integer 1–Room.capacity | yes | guests and pricing |
| Draft.experience | ref Experience.slug or empty | optional | add/remove experience |
| Draft.name / email / phone | bounded strings | required before review | guest details |
| Draft.notes | text, maximum 500 chars | optional | guest details |
| Booking.reference | generated local string | yes | confirmation |
| Booking.status | enum(local-demo) | yes | confirmation |
| Booking.createdAt | ISO datetime | yes | local data only |
| Booking.draft | copy of Draft | yes | confirmation |
| Booking.total | integer BDT | yes | confirmation |

Relations: one selected Room and optional Experience per Draft; one Booking is a snapshot of Draft. Bookings with the same room and overlapping dates make that room unavailable locally. Prices are always looked up from catalog; no client pricing is suitable for production trust.

## Data files
catalog.json: six Room and two Experience demo entries.
response.json: static demo response read by form interactions to expose pending, failure and success states. Not a booking API.
schema.json: JSON schema for catalog.

## Routes
Public static HTML: /, /rooms, /rooms/garden-veranda, /rooms/tea-view-double, /rooms/courtyard-twin, /rooms/hill-facing-double, /rooms/family-veranda, /rooms/quiet-corner, /availability, /booking/dates, /booking/guests, /booking/details, /booking/review, /booking/confirmation, /experiences, /experiences/tea-garden-walk, /experiences/tea-at-the-table, /getting-there, /house-rules, /cancellation-policy, /contact, /privacy, /terms, /404. Unknown route serves 404.html with HTTP 404. Every real page appears in sitemap.xml except 404.

## Section contract
| Route family and section | Reads | Empty | Loading | Error | Filled |
|---|---|---|---|---|---|
| All: header/footer | static navigation | never empty | static: n/a | native links still work | shared brand, navigation, legal |
| Home: hero, stay-search, rooms, experiences | catalog | never empty: bundled catalog | image background reserves space | alt and neutral fallback | editorial overview and booking entry |
| Rooms: room-list | catalog, capacity filter | explanatory reset action | bundled: n/a | image fallback | six comparable cards |
| Room details: room-detail | selected Room | unknown slug = 404 | image reserved | fallback image text | facts, access and availability CTA |
| Dates/availability: calendar, date-fields | Draft, local bookings | unselected dates explained | pending status on continue | invalid range or blocked night inline | selected dates, nights and total |
| Guests: guest-fields | Draft, Room.capacity | defaults to 2 | pending on continue | capacity error | chosen party size |
| Details: guest-form | Draft | empty fields | aria-busy and pending label | field validation or request/storage failure | saved guest details |
| Review: review-form | Draft and catalog | guard offers resume | aria-busy on confirm | network, collision or storage failure | local reservation saved |
| Confirmation: confirmation | latest local Booking | no reservation yet, start CTA | local: n/a | corrupt data is discarded with notice | reference, stay details, directions, download |
| Experiences: experience-list/detail | catalog | fixed catalog | image reserved | image fallback | add/remove with live feedback |
| Getting there: arrival, location-map | static | exact guesthouse pin not supplied | external embed lazy; explicit open-map control | offline text fallback | town orientation and safe arrival guidance |
| Contact: contact-form | bounded inputs | form default | aria-busy and pending label | validation/network failure | draft stored locally, explicitly not sent |
| Legal: policy | static demo policies | never empty | n/a | n/a | clear policies, scope and navigation |
| 404: not-found | none | n/a | n/a | styled HTTP 404 | rooms/home recovery |

## States
- Buttons: default, hover, focus-visible, active, disabled, pending via aria-busy.
- Date errors: missing inputs, checkout <= checkin, past checkin, over 14 nights, blocked room night, local existing reservation collision.
- Guest errors: party outside room capacity. Suggest larger rooms.
- Details errors: empty name, invalid email, missing phone, too-long notes. Inline messages and aria-invalid.
- Forms: default, validation error, pending, success and recoverable request error; fetch response status checked before saving.
- Storage failure: no confirmation claim; error offers browser storage retry. Corrupt JSON falls back to empty and warns.
- Empty room filter: explanatory message and reset button.
- Empty confirmation: no booking stored; start/resume CTA.
- Images: reserved size, onload loaded state, onerror fallback caption and neutral ground.
- Local-only availability: deterministic demo blocked days plus persisted bookings; channel sync labelled unavailable.
- Back/forward and reload: browser navigation; draft saved at each completed step and field change.
- Experience toggles: selected/unselected, persisted across routes and added to subsequent room booking.
- Contact: stores a message on this device only; no sending or email delivery claimed.

## API surface
None: static frontend. GET /data/response.json is a demo response fixture, not a mutation endpoint. Frontend checks response.ok and JSON acknowledgement; network errors render in the form. Future production must replace with transactional POST /bookings, server-side date, capacity and price validation, atomic inventory locks, email delivery and rate limiting. Card method remains disabled and labelled on review; no card fields are collected.

## Environment variables
None.

## Handoff notes
LocalStorage keys: srimangal-draft-v1, srimangal-bookings-v1, srimangal-messages-v1. Booking PII stays on the local device. Privacy route offers clearing local data. No authentication. JSON values are escaped before rendering; text never interpolates unsanitised user input. OpenStreetMap town embed is optional and external, with a title and a no-network text fallback. Replace demo rooms, rates, availability, generated imagery, legal policies, real address and contact details before launch. All routes are static and require no API or secret.
