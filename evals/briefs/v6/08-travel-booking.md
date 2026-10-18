# Srimangal Hills Guesthouse: rooms and tea-garden stays
Type: travel-booking
Status: evaluation brief (v6). Fictional client; do not invent statistics, logos or testimonials.

## The client
A family-run guesthouse (fictional) with six rooms among tea gardens. Guests book directly to avoid platform fees.

## Product contract (expected)
Jobs:
- A guest checks availability for dates, compares rooms, books, and gets directions.

Core journeys (route sequences):
- Home → rooms → room detail → choose dates → guest details → confirm → confirmation
- Home → experiences → experience detail → add to stay
- Confirmation → getting there

Required routes: Home, rooms list, room detail, availability calendar, booking flow (dates, guests, details, review, confirmation), experiences, getting there with map embed, house rules, cancellation policy, contact, privacy, terms, 404.

Capability levels: Availability and booking are frontend interaction with persisted booking in localStorage; payment and channel sync are backend/integration and may be deferred with their interface kept.

## Pressures
- A calm, slow brand vs a booking flow that must be fast and unambiguous.
- Unreliable rural mobile data.

## Bias probe
A biased skill would produce: a cinematic scroll story with the booking reduced to a 'contact us' link; a date picker that is decorative.

## Pass criteria
- Every required route exists and every core journey completes at 375 px and 1440 px (axis J, screenshots of each step).
- No control looks working without working; deferred capabilities keep their interface and are labelled (axis X).
- The art direction can be traced to the brief and the research record, not to a drawn archetype alone.
- Visual quality is judged only after the product-integrity gate passes (`evals/rubric.md`).
