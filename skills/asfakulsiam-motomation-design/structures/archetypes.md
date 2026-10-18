# Page Archetypes

The page's overall structure is the biggest fingerprint. AI output looks the same mostly because the **structure** is the same (hero → logos → 3 features → testimonial → pricing → CTA), not because of colours.

**These are optional structural metaphors (authority level 7), not a menu and not the first decision.** The product contract (Step 1) decides the information architecture: routes, navigation and journeys. An archetype can then shape the whole site (a portfolio that is a Film Reel), one route family (product detail as a Vitrine), one storytelling surface (an About page as a Letter), or nothing at all. Marketplaces, dashboards, B2B catalogues, publications and booking flows usually take their structure from the contract and use an archetype, if at all, for a narrative surface. Research may find a structure that is in no table here; that is the point of researching.

Each row in `data/archetypes.csv` has a `fails_when` column: read it before choosing.

Every archetype below has a searchable row in `data/archetypes.csv` (`node scripts/search.mjs archetypes "<words>"`).

| ID | Archetype | Shape | Best for | Signature potential |
|---|---|---|---|---|
| `specimen` | **The Specimen** | The page is a type specimen: one face, many sizes, the content set as samples | Portfolios, type-led brands, studios | Weight or width axis reacting to the cursor |
| `ledger` | **The Ledger** | Rows and columns like an account book; every item is a line with numbers | Studios, agencies, archives, finance | Rows expand into case studies |
| `film-reel` | **The Film Reel** | Scroll is a timeline; sections are scenes in sequence | Motomation, product launches, storytelling | Scroll-scrubbed scenes with a timecode |
| `index` | **The Index** | A huge typographic list as the whole homepage | Portfolios, publications, directories | Hover previews that follow the cursor |
| `manifesto` | **The Manifesto** | One argument, set large, read like a speech | Non-profits, founders, movements | Words that weight-shift as they're read |
| `gallery-wall` | **The Gallery Wall** | Free-placed images on a wall; the visitor roams | Photographers, art, fashion | Drag-to-pan canvas with inertia |
| `workbench` | **The Workbench** | The product UI itself is the page; you use it as you scroll | SaaS, dev tools | Live demo that reacts to scroll |
| `letter` | **The Letter** | Personal letter format: salutation, body, signature | Founders, small brands, invitations | Handwritten signature drawn on scroll |
| `atlas` | **The Atlas** | A map or diagram you move through | Hotels, travel, real estate, logistics | Camera moves across a map per section |
| `timeline` | **The Timeline** | History along one axis, years as navigation | Heritage brands, organisations, events | Year counter that scrubs |
| `catalogue` | **The Catalogue** | Numbered objects with spec sheets | E-commerce, furniture, fashion | Spec lines draw in as you read |
| `stage` | **The Stage** | One fixed stage; content enters and leaves like actors | Product launches, music, events | Pinned stage with scene changes |
| `diptych` | **The Diptych** | Two halves in permanent dialogue (before/after, us/them, day/night) | Comparisons, dual brands, hotels | The split line moves with scroll |
| `broadsheet` | **The Broadsheet** | Newspaper: masthead, columns, headlines, folios | Media, journalism, opinion | Columns that reflow as the reader moves |
| `console` | **The Console** | A terminal or command line as the interface | Dev tools, technical products | Typed commands that build the page |
| `room` | **The Room** | Each section is a room you walk into | Hotels, galleries, architecture | Doors and thresholds as transitions |
| `shelf` | **The Shelf** | Products as objects on shelves in physical space | Retail, books, ceramics | Pick up an object to inspect it |
| `lookbook` | **The Lookbook** | Full-bleed editorial spreads, page by page | Fashion, beauty, photography | Page-turn or crop-shift between spreads |
| `poster` | **The Poster** | One screen, one image; everything else is hidden in layers | Events, launches, campaigns | Poster tears or peels into the details |
| `field-guide` | **The Field Guide** | Entries with illustrations, notes and classifications | Education, nature, products with many variants | Annotations that point and label |
| `almanac` | **The Almanac** | A reference year in columns: dated entries side by side | Utilities, public services, schedules, education | The current column fills as its date arrives |
| `vitrine` | **The Vitrine** | One object in a lit case; details are labels pinned around it | Luxury, craft, museums, single products | Labels draw their leader lines to the object |
| `fold` | **The Fold** | One sheet folded in two; each half answers the other when opened | Services, before/after, two audiences | The crease opens with scroll |

## Rules

1. **Contract first, then fit.** An archetype is considered only after the IA is set, and only where it serves the journeys. A SaaS can be a Letter; a hotel can be a Ledger; a marketplace is usually neither.
2. **Check `fails_when`.** If the project matches it, adapt the archetype to one surface or don't use it.
3. **Mutate when you use one** (`principles/heuristics.md` → H-mutation). Never break a rule that protects a journey, the nav, a required state or accessibility.
4. **Don't repeat without a reason.** `node scripts/memory.mjs check --archetype <id>` flags recent reuse; a reuse justified by the brief is stated, not forbidden.
5. **Nav and footer count as structure.** For small brand sites, vary them (side rail, folio corner, masthead, giant footer wordmark). For products with real IA, the nav exposes the IA the contract defines; make it excellent, not unusual (`principles/heuristics.md` → H-nav-minimal).
6. **"None" is a valid answer.** `Structure : from the contract; no archetype` is a complete plan line.

## Section purposes

Inside any page, a section usually has one job (on product routes the jobs are the contract's tasks instead: browse, compare, configure, pay):

| Job | What it must achieve | Typical length |
|---|---|---|
| **Hook** | Make the concept (or the primary task) clear in the first seconds | 1 screen or less |
| **Proof** | Show it's real (work, product, place, numbers that exist) | 1–3 screens |
| **Story** | Explain why it matters, in sequence | 2–6 screens (Motomation lives here) |
| **Detail** | Answer the practical questions | as needed |
| **Ask** | One clear action | half a screen |
| **Sign-off** | Leave a final impression (footer as an artwork, not a sitemap dump) | 1 screen |

A section with no job gets cut. Two sections with the same job get merged.
