# DESIGN.md: River Commons — a public trust for Bangladesh's rivers

> How it looks. Page template `org` in `examples/templates/`, composed from `examples/sections/` only.

## Concept
- **Tension:** A legal trust for rivers sounds abstract; its work is court filings and people on the bank.
- **Concept sentence:** The page is the case: the claim, the evidence, the witnesses, the cost of the next hearing.
- **Archetype + mutation:** manifesto + constraint
- **Collision:** manifesto × field guide
- **Signature move:** seismograph-line
- **Dials:** ENERGY 2 · RHYTHM 3 · MOTION 2 → Tier 2
- **Rejected:** Drone footage of a river; a donation thermometer.

## Typography
Type mode: SERVICE STYLE (information-led), because donors check what money buys

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Gloock | as shipped in `fonts/` | `clamp()` per section | headings h1–h3 |
| Heading | Gloock | — | `clamp()` per section | |
| Body | Schibsted Grotesk | 400–600 | 17px base | Hind Siliguri for Bangla and ৳ |
| Mono / labels | JetBrains Mono | 400 | 11–13px | labels, numbers, codes |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #eef0ea | — | page background |
| `--ink` | #142023 | 14.51:1 | text |
| `--muted` | #4a5658 | 6.62:1 | secondary text, labels |
| `--accent` | #1d5a73 | 6.62:1 | the one moment (links, the active choice, the signature's line) |

## Layout
- Grid: each section's own (see its header); auto-fit columns collapse to one column at 375
- Margins / gutters: `clamp(20px, 5vw, 72px)` sides, sections `clamp(56px, 9vw, 128px)` tall padding
- Section spacing: by section padding only; no dividers beyond the sections' own rules
- Nav: none (single page, skip link to `#main`)
- Footer (sign-off): `footer-org-seismograph`

## Components
- Buttons: real `<button>`/`<a>`, native focus ring in `--accent`
- Links: underlined, inherit colour
- Cards (only if needed): only where the section is a set of comparable things (plans, rooms, tickets)
- Forms: only where the page asks for something (email, amount)

## Imagery
- Mode: illustration (a survey plate, screened by Halftone)
- Subject: the three river reaches the watchers cover (Turag, Buriganga, Karatoya), as a survey print
- Direction: no photography of people in distress and no stock river shots; if portraits of the watchers are added, each at their own bank, in daylight, looking at the river, not the lens, shot the same way all three
- Illustration style: editorial (§2): survey-plate line, channels and contours in two inks, screened by Halftone like a printed field guide
- Texture: the halftone screen only, on the survey plate, never behind the entries' text
- Interplay: the plate sits beside the entries, its caption below it ("Survey print · three reaches, 2025"); no type over the plate
- Template stand-in: `survey({ paper, water, land })` in `examples/sections/_imagery.tsx`, screened by Halftone in team-org-field-guide
- `[NEEDS ASSET]`: the organisation's own survey of the three reaches (vector or a scan of the print), same 3:2 crop; optional: three portraits as above

## Restraint Gate record
- Concept survived: yes, after 1 change
- Cut: a donation progress bar — amounts tied to real costs replace it
- Cut: partner logos — the registration and audit lines carry the trust signal
- Rejected animation: growing halftone dots frame by frame on touch screens — it dropped frames on the throttled phone profile; touch now prints rows at full size
- Rejected animation: confetti on choosing an amount — confetti is kept for the completed gift only
