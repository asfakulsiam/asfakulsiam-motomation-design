# DESIGN.md: Kheya Press

> How it looks. Written at /shape, read by every later step. Overrides the house defaults where it says so.

## Concept
- **Tension:** a press that sells only by hand, one title at a time ↔ a website open to everyone, all night, with no counter.
- **Concept sentence:** The site is the press's issue card: every book you open is stamped with today's date.
- **Archetype + mutation:** Lookbook (spreads, page by page), mutated by a self-imposed constraint: one weight only.
- **Collision:** stamp and postmark → an ink impression with a date (the visitor's real date).
- **Signature move:** The Issue Stamp: a vermilion date stamp lands once on the issue card of a book you open; the Books register keeps the stamp for titles you have opened.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 1 → Tier 1
- **Rejected:** cover photography (none exists), a cart and checkout (the press has none), reader quotes and "bestseller" labels (none supplied), a counter of copies sold.

## Typography
Type mode: HOUSE STYLE (typography-led) — because this is a publisher's brand site and the Bangla titles are the strongest image the press has.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Noto Serif Bengali / EB Garamond | 400 only | `--step-5` clamp(3.5rem, 13vw, 11rem) | Bangla titles set as the picture |
| Heading | EB Garamond | 400, italic | `--step-2/3` | italic carries emphasis, never bold |
| Body | EB Garamond | 400 | `--step-0` 1.1875rem / 1.55 | measure 62ch |
| Labels | EB Garamond | 400, small caps via `font-variant-caps: all-small-caps` | `--step--1` | folios, running heads |

## Colour
Palette: Paper & Vermilion (`data/palettes.csv`), checked with `scripts/contrast.mjs`.

| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | `#F3F0EA` | — | page |
| `--surface` | `#EAE6DE` | — | the issue card |
| `--ink` | `#151412` | 16.18:1 | text |
| `--muted` | `#5E5A53` | 6.02:1 (5.50:1 on surface) | folios, translators, rules |
| `--accent` | `#C8401C` | 4.38:1, large only | the stamp, set at 24px or larger; never body text |

## Layout
- Grid: each section is a spread: verso | gutter | recto, `minmax(0, 1fr) 1px minmax(0, 1fr)` with a fold rule; on phones the spread stacks, verso first.
- Margins / gutters: clamp(20px, 5vw, 88px).
- Section spacing: each spread is at least 88svh on desktop, content height on phones.
- Nav: a running head, like a book's: "Kheya Press · খেয়া" on the verso side, the three pages on the recto side, with folio numbers.
- Footer (sign-off): a colophon: typefaces, weight, place.

## Components
- Buttons: none. Every action is a link with an underline that thickens on hover and focus.
- Links: ink, 1px underline offset 0.2em; vermilion underline on hover/focus (the line is decoration, the text stays ink).
- Cards (only if needed): one, the issue card (ruled surface, the stamp's ground).
- Forms: none; ordering is by email.

## Imagery
- Source: none. Type is the image.
- Treatment: —
- `[NEEDS ASSET]` list: none.

## Restraint Gate record
- Concept survived: yes
- Cut: cover thumbnails drawn as coloured rectangles — fake covers would be invented artwork
- Cut: a second accent for prices — prices are facts, ink is enough
- Cut: "Open now" live badge on Visit — the hours are enough; a live badge would need the shop's real holidays, which the brief does not give
- Cut: a stamp on every page — the stamp means "you opened this book"; anywhere else it is decoration
- Rejected animation: page-turn transition between pages — tells the visitor nothing and delays every page
- Rejected animation: letters of the Bangla titles fading in one by one — breaks conjuncts in Bangla and delays the first read
