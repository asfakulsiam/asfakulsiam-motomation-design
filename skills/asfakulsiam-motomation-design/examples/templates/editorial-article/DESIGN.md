# DESIGN.md: The river took the school — The Delta Review

> How it looks. Page template `editorial-article` in `examples/templates/`, composed from `examples/sections/` only.

## Concept
- **Tension:** A long-read about loss must not feel like a content page.
- **Concept sentence:** The article is set as a broadsheet front page, and only the pull quote moves.
- **Archetype + mutation:** broadsheet + print-rule
- **Collision:** newspaper front page × reading progress
- **Signature move:** remembered-list: the chapter rail ticks the chapters you have read on this device, so a long read put down is picked up at the right place (was decode: the wire dateline resolving from random glyphs, a text-reveal move in the same family as the SaaS page's ink-fill)
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2 (BlurFocus and InkFill are Tier 2 reveals; MOTION 1 would allow hover and focus only)
- **Rejected:** Full-bleed hero photo with the headline over it; sticky share bar.

## Typography
Type mode: HOUSE STYLE (typography-led), because the writing is the product

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Bodoni Moda | as shipped in `fonts/` | `clamp()` per section | headings h1–h3 |
| Heading | Bodoni Moda | — | `clamp()` per section | |
| Body | Instrument Sans | 400–600 | 17px base | Hind Siliguri for Bangla and ৳ |
| Mono / labels | JetBrains Mono | 400 | 11–13px | labels, numbers, codes |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #f5f1e8 | — | page background |
| `--ink` | #161616 | 16.05:1 | text |
| `--muted` | #55504a | 7.08:1 | secondary text, labels |
| `--accent` | #9b1c1c | 7.23:1 | the one moment (links, the active choice, the signature's line) |

## Layout
- Grid: each section's own (see its header); auto-fit columns collapse to one column at 375
- Margins / gutters: `clamp(20px, 5vw, 72px)` sides, sections `clamp(56px, 9vw, 128px)` tall padding
- Section spacing: by section padding only; no dividers beyond the sections' own rules
- Nav: none (single page, skip link to `#main`)
- Footer (sign-off): `footer-editorial-folio`

## Components
- Buttons: real `<button>`/`<a>`, native focus ring in `--accent`
- Links: underlined, inherit colour
- Cards (only if needed): only where the section is a set of comparable things (plans, rooms, tickets)
- Forms: only where the page asks for something (email, amount)

## Imagery
- Mode: none. The words are the product: a broadsheet front page is set from type, rules and the folio (principles/imagery.md §5)
- Subject: the article itself; the visual subject is the masthead, the columns and the one moving pull quote
- Direction: if the publication later adds a lead photograph, one documentary frame by the reporting photographer, available light, no grade beyond the paper's ground, captioned and credited like a newspaper plate
- Illustration style: editorial (§2), engraving-like line, only if an explanatory diagram is ever needed
- Texture: none (the paper colour is the ground; no grain under body text)
- Interplay: type never sits over an image; a future lead photograph sits above the fold in its own column, never behind the headline
- Template stand-in: none; the layout has no image slot, so nothing is faked
- `[NEEDS ASSET]`: none for this layout

## Restraint Gate record
- Concept survived: yes
- Cut: a share bar — the folio footer and the reading rail are the only chrome
- Cut: related-article cards — 'You've read' does the job without tracking
- Rejected animation: decoding the dateline, deck and byline from random glyphs — the dateline is set as filed; the headline's focus and the pull quote's ink are the page's only reveals
- Rejected animation: a parallax photograph — the story has no photograph at the top, on purpose
