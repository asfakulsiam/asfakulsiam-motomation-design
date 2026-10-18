# House Style: asfakulsiam

This is the default look when the brief doesn't override it. These are defaults, not standards: the universal standards are listed in `principles/restraint.md` and always apply. It is a point of view, not a template: minimal, modern, typography-led, with motion as the signature. It sits at authority level 6 (`principles/authority.md`): the product contract and research outrank it, and each default has its reasoning and exceptions in `principles/heuristics.md`. It is where HOUSE STYLE starts, not where every project ends.

## The DNA

| Trait | In practice |
|---|---|
| **Type as image** | The display face is set at 8–28vw for the hook. Headlines carry the composition; photos support them. (HOUSE STYLE briefs. SERVICE STYLE briefs use the compact scale in `principles/typography.md` §3.) |
| **Warm-neutral canvas** | Off-white or near-black grounds with a hint of warmth or coolness, never pure `#FFFFFF` + `#000000` unless the concept is stark. |
| **One accent** | A single signal colour, used at the moment that matters (the CTA, the active state, the signature). |
| **Folio grid** | 12 columns with visible logic: index numbers, folios, hairline rules, captions in the margin. A deliberate break where the composition has room for it (H-grid-break), never in task flows. |
| **Motion with weight** | Strong ease-out curves, staggered reveals by line rather than by word soup, pinned chapters for the story. |
| **Noticing details** | Something reacts to the visitor: a letter under the cursor, a name that travels into the header, a list that remembers what you opened. |
| **Honest content** | Real names, real copy, real constraints. Nothing invented. |

## Typography defaults

- **Display:** a face with character: a condensed grotesk, a sharp high-contrast serif or a variable face with a width or weight axis. Search: `node scripts/search.mjs fonts "display"`.
- **Text:** a calm grotesk or a book serif at 16–19px, line-height 1.5–1.65, measure 60–75 characters.
- **Mono:** for captions, index numbers, timecodes and metadata.
- **Scale:** dramatic jumps, never a timid 1.25 ratio for display. Use `clamp()` so the scale is fluid.
- **Tracking:** tight on large display (-0.02em to -0.05em), slightly open on small caps and mono labels (+0.04em to +0.12em).

## Colour defaults

Start monochrome. Add the accent last. Example grounds:
- Paper `#F3F0EA` / Ink `#141311`
- Bone `#ECE8E1` / Graphite `#1C1C1A`
- Night `#0D0D0F` / Chalk `#EDEBE6`

## Layout defaults

- Generous outer margins (5–8vw desktop), tight internal gutters.
- Asymmetric compositions: content on 7 columns, air on 5.
- Vertical rhythm from an 8px base; section spacing in big steps (96 / 160 / 240px).
- Navigation on small brand sites: a wordmark plus a few links, or a menu behind one clear trigger (H-nav-minimal). Products with real IA (catalogues, publications, institutions, apps) expose that IA instead: categories, search, account, cart; restraint applies to how it looks.

## Motion defaults

- The lowest tier that delivers the concept, chosen per surface (`motion/selection.md`). A Tier 5 chapter is an option for immersive stories with media to scrub (H-tier5-chapter), never a quota.
- Entrance ease `cubic-bezier(0.16, 1, 0.3, 1)`, 600–900ms for editorial reveals; UI feedback stays at or under <!--rule:ui_feedback_max_ms-->250ms<!--/rule-->.
- Reveal text by **lines** with masks. Never fade a whole paragraph in from 0.
- Smooth scroll (Lenis) only when a scrubbed timeline needs it (H-lenis); native scroll is the default.

## When to depart from the house style

- The brief names a different style ("brutalist", "playful", "luxury maximal"). Load the matching file in `styles/`.
- The category demands it (government, healthcare, children's products). Follow `categories/`.
- The concept is stronger in a different language. The concept always wins over the house style.
- The product contract or research points elsewhere: a dense product, a colour-coded system, a familiar convention users rely on. The product always wins over the house style.
