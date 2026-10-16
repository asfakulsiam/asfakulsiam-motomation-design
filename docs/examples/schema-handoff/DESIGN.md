# DESIGN.md: Daftari

> Demo build for v2.7.0 (`templates/SCHEMA.md`). Written with `SCHEMA.md`, before the page.

Rules : gates/rules.md read; designing within it.

## Stack
- **Stack:** plain HTML/CSS/JS
- **Source:** named in the brief
- **Reason:** one page on a static host; the only server piece is one form function
- **Adapter:** `adapters/vanilla.md`

## References
**Access:** web (searched 2026-10-15)

**References looked at:**
1. LPAS — process-driven architecture studio, Awwwards Site of the Day 2026 ([x.com/awwwards](https://x.com/awwwards)) — the process is the structure: the steps are the page's spine, not a feature row.
2. Uncommon Studio — studio site, Awwwards SOTD and FWA, Jul 2026 ([hontran.dev](https://www.hontran.dev/blog/best-award-winning-websites-2026)) — a confident grid that breaks once: a strict ticket grid broken only by the hero line.
3. Mat Voyce — portfolio, Awwwards SOTD 2026 ([hontran.dev](https://www.hontran.dev/blog/best-award-winning-websites-2026)) — type earns its motion: here, at Tier 1, type carries the page with none.

**Techniques considered:**
- Scroll-scrubbed step reveal (GSAP ScrollTrigger, `references/sources/motion.md`): not used; Tier 1, the steps must be readable at once.
- List add/remove transitions (formkit/auto-animate, `motion.md`): not used; the lists don't change on the page.
- Form state machine with a live region (React Aria patterns, `references/sources/components.md`): used, written by hand in `request.js`.

**Pattern being avoided:** the craft-shop default, a full-bleed moody workshop photo with a script logo and a three-icon "Quality · Care · Tradition" row — it sells atmosphere, and this brief sells a price and a request.

## Decision trace
| Decision | Traces to |
|---|---|
| Archetype: single-page ledger | brief: "see the three services … send a request"; reference 1 |
| Palette: paper and ink, one red | brief: a bindery; restraint from reference 2 |
| Type: one book face | reference 3 (type carries the page) |
| Motion language: none (Tier 1) | brief: price and request; technique notes above |
| Signature move: the docket number | brief: requests become jobs |

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
