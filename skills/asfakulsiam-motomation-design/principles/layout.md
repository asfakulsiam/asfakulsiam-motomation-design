# Layout and Space

## Grid

- 12 columns on desktop, 6 on tablet, 4 on mobile. Outer margin `clamp(20px, 5vw, 96px)`, gutter `clamp(12px, 1.6vw, 24px)`.
- Make the grid **visible in the logic, not in lines**: align captions, numbers and edges so the eye feels the structure.
- Break the grid **once per screen**, on purpose: a word that bleeds off the edge, an image that crosses the gutter, a number hanging in the margin.

## Composition patterns that avoid the template

- **Asymmetric split:** content on columns 1–7, a single detail on 10–12, air between them.
- **Margin notes:** captions and index numbers in a narrow side column, as in a book.
- **Edge anchoring:** headline pinned to the bottom-left of the viewport, details at the top-right.
- **Full-bleed punctuation:** one full-width image or word between dense sections.
- **Stacked index:** a huge list where each row is a link; previews appear on hover.
- **Overlap with purpose:** type over image only where contrast is guaranteed (a scrim, or a solid area of the photo).

## Spacing scale

8px base. Section spacing in large steps: `96px / 160px / 240px` desktop, roughly 60% of that on mobile. Inside components: `4 / 8 / 12 / 16 / 24 / 32`.

## Hero rules

- The hero states the concept, not the company description.
- Don't default to: a centred headline, a subtitle and two buttons. Choose from: edge-anchored type, type-as-image, a pinned stage, an index, a letter, a single object.
- The first screen must hold **one** focal point.

## Navigation and footer

Vary them as part of the structure (see `structures/archetypes.md`). The footer is the sign-off: a giant wordmark, a colophon, a last signature moment. Not a link dump.

## Containers and cards

- Prefer open layouts over boxes. Use a card only when the content is a discrete object (a product, a room, a post).
- No shadow + border + radius + gradient all at once. Pick one way to separate.
- Radius scale with intent: 0 for editorial or brutalist, 2–6px for precise UIs, 16px+ only for soft or playful moods.
