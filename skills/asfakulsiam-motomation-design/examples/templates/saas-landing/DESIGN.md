# DESIGN.md: Tally — bookkeeping in Bangla and English for small shops

> How it looks. Page template `saas-landing` in `examples/templates/`, composed from `examples/sections/` only.

## Concept
- **Tension:** Shopkeepers distrust software; they trust their khata.
- **Concept sentence:** The product is the page: the first screen is today's ledger, and every later screen is one the shop will use.
- **Archetype + mutation:** workbench + ui-is-content
- **Collision:** ledger book × command line
- **Signature move:** ink-fill
- **Dials:** ENERGY 3 · RHYTHM 3 · MOTION 2 → Tier 2
- **Rejected:** Abstract gradient hero with floating cards; feature icons in a 3×3 grid.

## Typography
Type mode: SERVICE STYLE (information-led), because the reader is deciding whether it fits their shop

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Bricolage Grotesque | as shipped in `fonts/` | `clamp()` per section | headings h1–h3 |
| Heading | Bricolage Grotesque | — | `clamp()` per section | |
| Body | Hanken Grotesk | 400–600 | 17px base | Hind Siliguri for Bangla and ৳ |
| Mono / labels | JetBrains Mono | 400 | 11–13px | labels, numbers, codes |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #f3f1ea | — | page background |
| `--ink` | #15201b | 14.81:1 | text |
| `--muted` | #4c5751 | 6.66:1 | secondary text, labels |
| `--accent` | #1f6b4f | 5.67:1 | the one moment (links, the active choice, the signature's line) |

## Layout
- Grid: each section's own (see its header); auto-fit columns collapse to one column at 375
- Margins / gutters: `clamp(20px, 5vw, 72px)` sides, sections `clamp(56px, 9vw, 128px)` tall padding
- Section spacing: by section padding only; no dividers beyond the sections' own rules
- Nav: none (single page, skip link to `#main`)
- Footer (sign-off): the last section is the sign-off (no footer)

## Components
- Buttons: real `<button>`/`<a>`, native focus ring in `--accent`
- Links: underlined, inherit colour
- Cards (only if needed): only where the section is a set of comparable things (plans, rooms, tickets)
- Forms: only where the page asks for something (email, amount)

## Imagery
- Mode: none (the UI is the image). The product is shown as its own coded interface in DeviceMockup, the console and the bento, never as a stock photo of someone at a laptop (principles/imagery.md §5)
- Subject: today's ledger, the command line, the numbers the shop will use
- Direction: when the product exists, real screenshots at 2× of the same screens, same data, same theme as the page, no browser chrome beyond the mockup's
- Illustration style: swiss (§2) if a diagram is needed: geometric, uniform line, the palette's colours
- Texture: none (glow borders are UI, not texture)
- Interplay: the mockup sits beside the headline at 1440 and below it at 375; type never overlaps the screen
- Template stand-in: the coded mockup contents (they are the real UI's layout)
- `[NEEDS ASSET]`: screenshots of the ledger, console and pricing screens, 2×, matching the mockups' aspect

## Restraint Gate record
- Concept survived: yes
- Cut: a footer — the trial CTA is the sign-off; a footer would add links that pull away from the one ask
- Cut: a logo bar of payment partners — bKash and Nagad are named in the plan where they matter
- Rejected animation: counting the prices up when the plans appear — a price must never be shown wrong first
- Rejected animation: tilting the device mockup with the cursor — the screen content is the point and should stay still to read
