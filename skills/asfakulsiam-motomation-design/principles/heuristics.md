# Heuristics: the skill's opinions, with their reasons

Every opinion in Motomation lives here, at authority level 6 (`principles/authority.md`). Each one names the problem it solves, where it applies, what it costs and when to ignore it. Other files point here instead of restating an opinion as a rule.

**How to use them.** Read the problem first. If the project has that problem, the heuristic is a good default; apply it or adapt it. If the project doesn't have that problem, skip it. Ignoring a heuristic needs a one-line reason in `DESIGN.md` under `Decision trace`; it never needs permission and is never a gate failure on its own.

A heuristic never overrides the product contract (level 4), research evidence (level 5) or anything above them.

## Composition and hierarchy

| ID | Heuristic | Problem it solves | Applies when | Trade-off | Ignore or adapt when |
|---|---|---|---|---|---|
| H-focal | One focal point per screen | pages where everything shouts and nothing is read first | marketing, editorial and storytelling screens | can starve dense screens of scannability | dashboards, catalogues, comparison tables, search results: there the hierarchy is a reading order (title → filters → results), not one focal point |
| H-grid-break | A deliberate grid break on a screen | a page that reads as a template because every block sits in the same columns | editorial, brand and portfolio pages with room to breathe | breaks cost scanning speed and responsive effort | task flows (checkout, forms, settings, data tables), where alignment is the usability |
| H-rhythm | Vary section compositions (RHYTHM dial) | long pages that repeat one block pattern | long scrolling narratives | variety for its own sake makes a product page feel incoherent | product listings, docs, dashboards: repeated structure is how users learn the page |
| H-centred-hero | Avoid the centred hero + subtitle + two buttons + screenshot | the most common AI template | when the concept has a better opening | a centred hero is sometimes the clearest answer | the product needs an immediate primary action (search box, booking widget, sign-up) and centring serves it; say why |
| H-bento | Avoid the bento grid and the three-icon feature row | generic SaaS sameness | when the content isn't actually a set of equal features | some content really is a set of equal items | the items are equal and comparable (pricing tiers, plan features, category tiles in a store) |

## Navigation and information architecture

| ID | Heuristic | Problem it solves | Applies when | Trade-off | Ignore or adapt when |
|---|---|---|---|---|---|
| H-nav-minimal | Minimal navigation (wordmark plus a few links) | portfolio and brand sites where the nav competes with the work | small sites, under ~8 destinations, low return-visit frequency | hides breadth; costs findability | marketplaces, publications, B2B catalogues, institutions, dashboards: the nav must expose the IA the product contract defines (categories, search, account, cart, mega-menu or sidebar). Restraint then applies to how the nav looks, not what it contains |
| H-nav-conventional | The "logo left, links centre, button right" nav reads as a template | default chrome on a brand site | brand, portfolio, campaign sites | the convention exists because people find things in it | any product where speed of wayfinding matters more than identity (commerce, SaaS app, booking, docs). Familiar is correct there; make it excellent instead of different |
| H-remove-expected | "Remove the expected" mutation (no nav, no hero image, no grid) | predictable structure | experimental and campaign pages | removing nav removes wayfinding | anything with more than one task, any product route, any mobile flow: never remove the nav, search, cart, account or primary action the contract requires |

## Type and colour

| ID | Heuristic | Problem it solves | Applies when | Trade-off | Ignore or adapt when |
|---|---|---|---|---|---|
| H-type-hero | Type as the image, display at 8–28vw (HOUSE STYLE) | weak, timid typographic identity | brand, editorial, portfolio, campaign | huge type pushes content below the fold; wraps badly at 375px | SERVICE STYLE products, imagery-led commerce, data products; mixed sites use it only on storytelling surfaces |
| H-one-display | One display face (two for a stated contrast concept) | type soup | almost always | limits expressive systems | a brand system that already defines more; a publication with distinct section voices |
| H-banned-display | <!--rule:banned_display_fonts-->Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Arial, Helvetica or the system UI stack<!--/rule--> are not new display faces | the AI-default look | when choosing a new display face | these faces are excellent text and UI faces | SERVICE STYLE product UI where there is no display role; an existing brand that uses one (level 1/3 wins) |
| H-caution-fonts | <!--rule:caution_fonts-->Playfair Display and Space Grotesk<!--/rule--> need a stated reason | they became AI defaults | new type choices | none, it only asks for a reason | a reason exists |
| H-one-accent | Monochrome base, one accent, ≤ 5% of a screen | colour noise and AI gradients | HOUSE STYLE brand and editorial work | can make vibrant brands feel corporate | colour carries information (status, categories, lines, series) or the brand is colour-rich (kids, food, festivals, grocery). Data and brand colour are not "accent"; contrast still holds |
| H-no-purple-gradient | Avoid purple-to-blue gradients, glowing blobs, unmotivated glass | the AI-default look | always as a default | none | the brand's own system uses them; the concept needs light or material and says why |

## Signature, motion, invention

| ID | Heuristic | Problem it solves | Applies when | Trade-off | Ignore or adapt when |
|---|---|---|---|---|---|
| H-signature | At most one signature move, introduced early and echoed | five competing gimmicks; forgettable sites | brand, launch, portfolio, campaign, storytelling | a signature can slow tasks and cost performance | a product whose identity comes from its system (a calm dashboard, a fast store, a reference publication). "No signature; identity from <system>" is a valid answer. The budget is a ceiling, not a quota |
| H-entrance-variety | Don't give every section the same entrance animation | autopilot motion | long narrative pages | variety for its own sake is noise | product, docs and listing pages: consistent, quiet entrances (or none) are correct. The gate's V axis measures repetition; a repeat with a reason is fine |
| H-tier5-chapter | A Tier 5 scroll-film chapter "when the brief allows it" | flat, static brand pages | immersive brand and launch stories with media to scrub | weight, battery, accessibility risk, scroll fatigue | task-led products, mobile-first or low-bandwidth audiences, accessibility-constrained briefs. Choose the lowest tier that delivers the concept (`motion/selection.md`) |
| H-lenis | Smooth scroll (Lenis) with Tier 2+ | jittery scroll-linked motion | scrubbed timelines that need sync | changes native scroll feel; can fight accessibility tools and in-page find | native scroll is enough; long reading or task pages; the user dislikes it. Never required |
| H-cursor | A cursor that reacts | static, unresponsive brand pages | desktop-first brand work | invisible on touch; distracting on task screens | touch-first audiences, forms, data tools |
| H-collision | Steal one property from an unrelated world | concepts that collapse to the category average | when exploration stalls or the brief invites invention | a forced metaphor can bury the product | the product contract already implies a strong system; research found a better direction. Optional, never mandatory |
| H-mutation | Break one rule of the chosen structure | structures that read as their archetype | when an archetype is used at all | breaking the wrong rule breaks usability | the rule protects a journey, the nav, a required state or accessibility |

## Process and stack

| ID | Heuristic | Problem it solves | Applies when | Trade-off | Ignore or adapt when |
|---|---|---|---|---|---|
| H-diverge | Diverge from similar earlier builds (memory log) | the same site shipped twice with new colours | the log shows a similar brief | divergence for its own sake can pick a worse fit | the brief justifies the similarity (same type mode for two dashboards). Diverge on what isn't justified, say what is |
| H-stack-rotate | "Never pick the stack you used last" (removed in v3: it chose stacks for variety, not fit) | — | — | — | always: pick the stack for the project (`craft/stack.md`) |
| H-no-em-dash | No em dash in customer copy | an AI-copy tell | new copy | style preference | the brand's editorial style uses it |

## Adding or removing a heuristic

A new opinion enters this file with all six columns filled, or it doesn't enter. An opinion that turns out to override products more often than it helps is rewritten or removed, and the change goes in `CHANGELOG.md`.
