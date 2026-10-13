# DESIGN.md: Hawa Studio — design for public institutions, Dhaka

> How it looks. Page template `studio-portfolio` in `examples/templates/`, composed from `examples/sections/` only.

## Concept
- **Tension:** A design studio for ministries and museums has to look careful, not fashionable.
- **Concept sentence:** The studio's site is its account book: every project an entry, every partner a line, the wait time on a flap board.
- **Archetype + mutation:** ledger + swap-material
- **Collision:** ledger × departure board
- **Signature move:** lens
- **Dials:** ENERGY 2 · RHYTHM 3 · MOTION 2 → Tier 2
- **Rejected:** A work grid of thumbnails (every studio has one); a showreel hero.

## Typography
Type mode: SERVICE STYLE (information-led), because clients come to check scope, people and availability

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Young Serif | as shipped in `fonts/` | `clamp()` per section | headings h1–h3 |
| Heading | Young Serif | — | `clamp()` per section | |
| Body | Hanken Grotesk | 400–600 | 17px base | Hind Siliguri for Bangla and ৳ |
| Mono / labels | JetBrains Mono | 400 | 11–13px | labels, numbers, codes |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #f2ede3 | — | page background |
| `--ink` | #1b1a17 | 14.91:1 | text |
| `--muted` | #5a554c | 6.34:1 | secondary text, labels |
| `--accent` | #a33a1c | 5.66:1 | the one moment (links, the active choice, the signature's line) |

## Layout
- Grid: each section's own (see its header); auto-fit columns collapse to one column at 375
- Margins / gutters: `clamp(20px, 5vw, 72px)` sides, sections `clamp(56px, 9vw, 128px)` tall padding
- Section spacing: by section padding only; no dividers beyond the sections' own rules
- Nav: none (single page, skip link to `#main`)
- Footer (sign-off): `footer-studio-marquee`

## Components
- Buttons: real `<button>`/`<a>`, native focus ring in `--accent`
- Links: underlined, inherit colour
- Cards (only if needed): only where the section is a set of comparable things (plans, rooms, tickets)
- Forms: only where the page asks for something (email, amount)

## Imagery
- Mode: photography for one image (illustration as the template stand-in); the rest of the page is type
- Subject: the studio at its long table, the four partners mid-work under the pendant lamps
- Direction: overhead pendants as the only light, windows behind falling to soft white; camera at seated eye height, 35 mm, the table's long edge level across the frame; nobody looking at the lens; graded neutral (the page's greys), with the brand colours appearing only when the Lens shows the labelled version
- Illustration style: flat (§2) for the stand-in: four figures, table, lamps and papers in flat shapes, three colours
- Texture: none
- Interplay: the image runs full width under the partner rows; the Lens reveals the labelled version over it; no other type on the image
- Template stand-in: `longTable(palette)` in `examples/sections/_imagery.tsx` (neutral and labelled palettes)
- `[NEEDS ASSET]`: one photograph, 2:1, alt "The studio at its long table, four people at work", and the same frame with the partners' names placed for the Lens

## Restraint Gate record
- Concept survived: yes
- Cut: a client-logo wall — the marquee in the footer lists every client by name, which is the ledger's closing line
- Cut: a contact form — copying the email is what people do; the form would be a second path to the same inbox
- Rejected animation: scrambling the project table on load — it would make the first read of the entries wrong (only hover scrambles)
- Rejected animation: a parallax studio photo — the lens already makes the photo interactive; a second motion on one image fails "does it have a job"
