# DESIGN.md: Daftari

> Demo build for v2.7.0 (`templates/SCHEMA.md`). Written with `SCHEMA.md`, before the page.

Rules : gates/rules.md read; designing within it.

## Stack
- **Stack:** plain HTML/CSS/JS
- **Source:** named in the brief
- **Reason:** one page on a static host; the only server piece is one form function
- **Adapter:** `adapters/vanilla.md`

## References
- **Access:** web (searched 2026-10-15)
- **1. LPAS (Awwwards Site of the Day, 2026, [x.com/awwwards](https://x.com/awwwards)):** took "the process is the structure": a studio that sells process shows the steps as the page's spine, not as a feature row.
- **2. Uncommon Studio (Awwwards Site of the Day + FWA, Jul 2026, [hontran.dev](https://www.hontran.dev/blog/best-award-winning-websites-2026)):** took "a confident grid that breaks once": a strict ticket grid, broken only by the hero line.
- **3. Mat Voyce (Awwwards Site of the Day, 2026, [hontran.dev](https://www.hontran.dev/blog/best-award-winning-websites-2026)):** took "type earns its motion": here, at Tier 1, type carries the page with no motion at all.
- **Avoiding:** the craft-shop default: a full-bleed moody workshop photo with a script logo and a three-icon "Quality · Care · Tradition" row.

## Concept
- **Tension:** slow handwork vs. a quick online request
- **Concept sentence:** every book on the bench gets a docket; the page is the docket.
- **Archetype + mutation:** single-page ledger, mutated so services are printed as job tickets
- **Collision:** a bindery job docket (numbered slip, monospace number, ruled lines)
- **Signature move:** the docket number: shown in the hero, returned by the form as the visitor's own docket
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 1 → Tier 1
- **Rejected:** a page-turn animation (decoration, fails Q1 and Q2)

## Typography
Type mode: SERVICE STYLE (information-led) — because visitors come to price a repair and send it.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Iowan Old Style → Palatino → Georgia | 400 | clamp(2rem, 5.5vw, 4.25rem) | book face, local only (CSP `self`) |
| Body | same stack | 400 | 1.0625rem | |
| Mono / labels | ui-monospace | 600 | .875rem | docket numbers only |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #F4EFE6 | — | page |
| `--ink` | #1D1A16 | 15.1:1 | text |
| `--muted` | #5B544B | 6.5:1 | secondary text |
| `--accent` | #8A2B1A | 7.5:1 | docket numbers, focus |

## Restraint Gate record
- Concept survived: yes
- Cut: page-turn animation — fails Q1 and Q2 (no hierarchy, feedback or story; the brief doesn't need it)
- Kept: the docket number — fails Q1, passes Q2: the brief is about requests becoming jobs
- Rejected animation: page-turn — fails "what does it explain?"
