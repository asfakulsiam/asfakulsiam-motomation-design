# DESIGN.md: Two-day independent music festival, Chattogram

## Concept
- **Tension:** eighteen artists and two stages to show, but no names, photos or venue supplied. The page must feel like a live night without inventing any of it.
- **Concept sentence:** The page is dark until the stage lights find you: two beams sweep the lineup and whatever they cross is lit.
- **Archetype + mutation:** Film Reel (scroll as a timeline of scenes), mutated by "remove the expected: no hero image, no image anywhere"; light is the only imagery.
- **Collision:** lighthouse (navigation) → "a rotating beam in the dark". Two beams = two stages.
- **Signature move:** Two-beam lineup. One WebGL canvas draws two swaying stage beams; the DOM reads the same beam math and lights the lineup slots each beam crosses.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 3 → Tier 4 (forced by --tier=4)
- **Rejected:** a crowd/photo hero (no assets, generic); rain-streak shader (February in Chattogram is not the monsoon); count-up numbers (the facts are fixed, no reason to animate them); invented artist names and venue.

## Typography
Type mode: HOUSE STYLE (typography-led), because a festival is a poster: the dates are the image.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Anton | 400 | clamp(7rem, 34vw, 26rem) | condensed gig-poster face, fits "14–15" at 375; chosen over Big Shoulders because the project log already holds a Big Shoulders festival run |
| Heading | Anton | 400 | clamp(2.4rem, 7vw, 5.2rem) | |
| Body | Hanken Grotesk | 400/600 | 1.0625rem | disappears |
| Labels | Hanken Grotesk | 600, caps, tracked | 0.8125rem | taka sign falls to Noto Sans Bengali |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0B0A10 | — | page background |
| `--ink` | #F2EDE3 | 16.9:1 | text |
| `--muted` | #B9B3A8 | >9:1 | secondary text |
| `--accent` | #FFB020 | 10.8:1 | lit state, beam A, price |

Beam B is the ink colour (cool-white) so there is still one accent. Beam light is capped so text stays above AA on lit pixels.

## Layout
- Grid: 12 columns, lineup 3 columns (2 at phone width)
- Margins / gutters: clamp(1.25rem, 4vw, 3.5rem)
- Section spacing: 18vh
- Nav: one line, descriptive wordmark left, three anchors right
- Footer (sign-off): dates, city, one line

## Components
- Buttons: outlined rectangle, fills accent on hover/focus (150ms)
- Links: underline on hover
- Cards: none; lineup slots are ruled rows
- Forms: none (no booking endpoint was supplied)

## Imagery
- Source: none. Light only.
- `[NEEDS ASSET]`: festival name/logo, venue, artist names and photos, booking link.

## Restraint Gate record
- Concept survived: yes
- Cut: stages section — stage names and the split of artists were not supplied, so it would be invention
- Cut: hero image and gallery — no assets, light is the imagery
- Cut: smooth-scroll library — native scroll stays; nothing needs it
- Rejected animation: counters rolling up to 18 and ৳1,500 — fails "what does this tell the user?"; facts are fixed
- Rejected animation: parallax on headings — fails "what does this tell the user?"
