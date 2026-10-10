# Page Archetypes

The page's overall structure is the biggest fingerprint. AI output looks the same mostly because the **structure** is the same (hero → logos → 3 features → testimonial → pricing → CTA), not because of colours. Choose a structure **first**, before any visual decision.

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

## Rules

1. **Choose by concept, not by category.** A SaaS can be a Letter; a hotel can be a Ledger.
2. **Mutate it** (Thinking Sequence step 3). An unmutated archetype is still a template.
3. **Don't repeat.** Check `node scripts/memory.mjs check --archetype <id>`. Don't reuse an archetype from the last 5 runs in the same project unless the user asks.
4. **Nav and footer count as structure.** Vary them too: side rail, folio corner, masthead, hidden-behind-a-key, inline-at-end, giant footer wordmark.

## Section purposes

Inside any archetype, every section must have exactly one job:

| Job | What it must achieve | Typical length |
|---|---|---|
| **Hook** | Make the concept felt in 5 seconds | 1 screen |
| **Proof** | Show it's real (work, product, place, numbers that exist) | 1–3 screens |
| **Story** | Explain why it matters, in sequence | 2–6 screens (Motomation lives here) |
| **Detail** | Answer the practical questions | as needed |
| **Ask** | One clear action | half a screen |
| **Sign-off** | Leave a final impression (footer as an artwork, not a sitemap dump) | 1 screen |

A section with no job gets cut. Two sections with the same job get merged.
