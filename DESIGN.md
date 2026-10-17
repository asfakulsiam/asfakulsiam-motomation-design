# DESIGN.md: Tannery Row Coffee

> How it looks. Written for a maintenance integration check of the Motomation Design skill (repository
> `asfakulsiam/asfakulsiam-motomation-design`, main at 96b1b51 plus working-tree fixes). The shop is fictional; every business fact is
> demo data in `data/`.

## Brief
"Design a distinctive, responsive specialty coffee shop website. It should communicate the shop's identity, showcase its
menu and atmosphere, make location and opening hours easy to find, and provide a clear path to contact or visit the shop."

## Checkpoint log
The brief came from the maintainer with a standing instruction to carry the workflow through, so no human answered each
checkpoint live. Each one is recorded here with what was shown. Research, concept, scope and build plan were settled before
any UI code was written, but this file was written up after the first build, not before it.

| Checkpoint | Shown | Outcome |
|---|---|---|
| 1 Stack | Next.js (static export) · plain HTML (one page; the brief needs menu, visit and contact routes) · Astro (also fits; no Astro in the repo's verified templates) | Next.js, maintainer's standing instruction |
| 2 Research and concept | Type research, References, Concept, Divergence below | approved as written |
| 3 Scope | Scope table below; admin panel: no; delivery mode: functional frontend | approved as written |
| 4 Build plan | Section order, components and motion in `MOTION.md` and below | approved as written |
| 5 Design review | Screenshots at 375, 768 and 1440 of the real build (local static server) | reviewed by the agent only; layout fixes listed in `CRITIQUE.md` |
| 6 Gate and ship | `GATE.md`, `CRITIQUE.md` | handoff to branch `design/tannery-row-coffee` only if the gate passes |

## Stack
- **Stack:** Next.js 15 (App Router, TypeScript), `output: "export"`
- **Source:** "you choose" (the brief names none)
- **Reason:** five routes and JSON data; static export because nothing needs a server, so `public/_headers` carries the security headers
- **Adapter:** `adapters/next.md`. Tailwind is left out: the design system is one stylesheet of tokens and broadsheet rules, so a utility framework would add a dependency without adding anything

## Dependencies
| Package | Why (what the platform can't do) | 1 active (last release) | 2 deprecated | 3 licence |
|---|---|---|---|---|
| next 15.5.28 | routing, static export, font self-hosting | active (same pin as `templates/verify-nextjs`) | no | MIT |
| react, react-dom 19.3.1 | Next's runtime | active | no | MIT |
| typescript, @types/* (dev) | type checking | active | no | Apache-2.0 / MIT |

## Scope
**Site type:** independent specialty coffee bar, single site (UK-style content; fictional town)
**Admin panel:** no (menu and hours change rarely; a CMS was explicitly out of scope for this check)
**Delivery mode:** functional frontend

| Kind | Item | Mark | Evidence |
|---|---|---|---|
| route | / | requested | |
| route | /menu/ | requested | |
| route | /visit/ | requested | |
| route | /contact/ | requested | |
| legal | /privacy/ | required | |
| function | /: today's address and hours in the first viewport | requested | app/page.tsx#Find us |
| function | every page: open or closed now, computed in the shop's time zone | required | lib/hours.ts#openStatus |
| function | /menu/: choose a drink to see its cup cross-section | required | components/Station.tsx#aria-pressed |
| function | /menu/#drink-id preselects a drink (links from the front page) | required | components/Station.tsx#hashchange |
| function | /contact/: form with validation, pending, success and error | requested | components/ContactForm.tsx#aria-invalid |
| state | contact form: error when the message service is missing (404) or unreachable | required | components/ContactForm.tsx#isn't connected |
| state | menu: a pastry sold out today | required | data/menu.json#soldOut |
| state | images: loading tint and a fallback when an image fails | required | components/Photo.tsx#photo__fallback |
| state | opening status before hydration or without JavaScript: links to the hours table | required | components/EditionLine.tsx#See today |
| edge | visitor in another time zone sees the shop's open status, not their own | required | lib/hours.ts#timeZone |
| edge | unknown route: designed not-found page | required | app/not-found.tsx#Page not found |
| template | data/ with schema.json, demo-labelled | required | data/schema.json |
| template | .env.example | required, the code reads SITE_URL | .env.example#SITE_URL |
| template | middleware.ts | not required for this brief, reason: static export; headers are set in public/_headers |  |
| template | LICENSE, CHANGELOG.md | not required for this brief, reason: functional frontend, not a production template |  |
| function | online ordering, gift cards, webshop | not required for this brief, reason: the brief asks for visit and contact, not commerce |  |

**Deferred:** a real message endpoint for `/api/contact`, an embedded map (would need a third-party origin in the CSP and a consent decision), bank-holiday hours.

## Type research
Visited 2026-10-17 in a real browser (desktop and a 390 px mobile viewport). O = observed, I = inferred, U = unverified.

| Site | Type | Routes | Functionality | States | Admin | Legal | Notes |
|---|---|---|---|---|---|---|---|
| [Prufrock Coffee](https://www.prufrockcoffee.com/), London | single specialty café + roastery webshop | / , /about-us, /menu, /shop, /webshop, /contact (O) | home shows the address, three rows of hours and an email (O); /menu is one page of food and drink headings with no prices in the text (O) | mobile: "Open Menu" hamburger toggle, no horizontal overflow at 390 px (O) | unverified | none linked from home (O) | Squarespace (I). Hours and address on the home page itself (O) |
| [Kaffeine](https://kaffeine.co.uk/), London | two-site café / espresso bar | / , /location/66-great-titchfield-street/ and /location/15-eastcastle-street/ with `?show-menu=true`, /courses, /catering, /blog (O) | per-location hours on the home page, weekly menu per location (O); contact form with contactType, first/last name, email, message (O) | a full-screen splash ("Take me to your latte") before the content unless `no-splash=true` (O) | unverified | footer "© 2017 Kaffeine" only (O) | Hours are findable but sit behind a splash on first load (O) |
| [Monmouth Coffee](https://www.monmouthcoffee.co.uk/), London | three shops + roastery + webshop | / , /our-shops, /faqs, /shipping-returns, /terms-and-conditions, /privacy-policy (O) | /our-shops lists each shop with address and hours (O); online coffee shop dominates the home page (O) | mobile: "Main menu button" toggle, a slider with previous/next buttons (O) | unverified | terms and privacy linked (O) | The shops, not the webshop, are what a first-time visitor needs; here they are one level down (I) |
| [Coffee Collective](https://coffeecollective.dk/), Copenhagen | roastery with several coffee shops | / , /pages/coffee-shops, /pages/coffee-shop/trianglen (O) | each shop page: weekday and weekend hours, address, a paragraph about the room and its materials (O) | no map embed on the shop page (O) | unverified | a link to the food authority's hygiene report (O) | The shop page describes the room (wood, stone, the park outside) as part of the visit (O) |

**Gaps:** none of these is a menu with drink recipes; "show what is in the cup" is this concept's, not the category's. Admin and back-office behaviour was not observable on any site and is not assumed. Mobile was checked at one width (390 px) only.

**Taken from research:** hours and address on the front page, not one click away (Prufrock, Kaffeine); one page per shop with the room described (Coffee Collective); no splash before the facts (Kaffeine's splash is the pattern avoided); a short contact form with a topic (Kaffeine).

## References
**Access:** web (searched 2026-10-17)

**References looked at:**
1. [Café Binocle](https://gymnaseweb.com/en/cafe-binocle/) (Awwwards honourable mention, 21 April 2026; build by Gymnase, design by Studio Polygraphe) — a specialty coffee site with a "playful, colorful interface" and interactive animations built around the "intuitive presentation of coffees" — principle: let the interaction present the coffee itself. Not taken: its high energy; this brief puts the facts first
2. [Stumptown Coffee Roasters](https://ecomm.design/site/stumptown-coffee-roasters/) (ecomm.design teardown, September 2026) — serif display headlines with a mono face "in small labels such as flavor notes" on a brown-black and cream palette — principle: coffee numbers and notes get their own mono voice. Avoided: the brown-black and cream palette itself, so this site uses newsprint and one red
3. The Broadsheet archetype (`structures/archetypes.md`: "masthead, columns, headlines, folios"), drawn by `scripts/collide.mjs` — masthead, folio line, column rules — principle: a daily "edition" fits a place whose menu and hours are about today

**Techniques considered:**
- Scroll-driven chapters (Motomation film): not used. The brief's priorities are facts and a menu; a film would delay them.
- Cross-section diagram from data (x-ray collision): used as the signature.
- Live open/closed line computed from data: used. Every reference shows hours; none says whether the shop is open now.

**Pattern being avoided:** the café site that opens on a full-bleed latte photo with the hours in the footer — it makes the most common question (are you open, where are you) the hardest to answer.

## Divergence
- **Prior similar build:** none recorded (`node scripts/memory.mjs similar --brief "specialty coffee shop…" --category restaurant`: no prior coffee build)
- **Diverging from → chose:** archetype hero-photo café → broadsheet · palette brown-black and cream → newsprint with one proof red · type grotesk + script → newspaper serif + Plex · motion parallax → one drawn rule and a pour · signature hover zoom → cup cross-section

## Decision trace
| Decision | Traces to |
|---|---|
| Archetype | collide.mjs draw (Broadsheet, "a list becomes a map"); brief: "make location and opening hours easy to find" |
| Palette | reference 3 (newsprint) and the one-accent rule; red as the editor's pencil |
| Type pairing | reference 3 (Newsreader, a news face) and reference 2 (mono for coffee numbers) |
| Motion language | brief priorities (facts first) → Tier 1 |
| Signature move | collide.mjs collision (x-ray, structure) and reference 1 (an object from the counter) |

## Concept
- **Tension:** a specialty bar wants you to slow down and notice the detail; most visitors arrive with one fast question (open now? where?).
- **Concept sentence:** today's edition of the bar: the front page answers whether it's open and where it is, and the menu reads like the counter, station by station, cup by cup.
- **Archetype + mutation:** Broadsheet (masthead, folio, column rules) + "a list becomes a map": the menu is laid out as the counter, espresso bar left, brew bar middle, pastry case by the door.
- **Collision:** x-ray: seeing through to structure. Each drink is shown as a cross-section of its cup.
- **Signature move:** the cup cross-section: choosing a drink pours its layers (espresso, milk, foam, water, filter, ice) into a glass outline, each in proportion to its volume, with the recipe in mono.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 1 → Tier 1
- **Rejected:** a chalkboard menu (category cliché); a scroll film of a pour (delays the facts); an interactive floor plan (more than the brief needs).

## Typography
Type mode: HOUSE STYLE (typography-led) — because identity is the first thing the brief asks for, and the broadsheet is carried by type; the facts sit in plain tables inside it.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Newsreader (Production Type, OFL) | 500, opsz 72, italic for "Coffee" | clamp(2.75rem, 7.4vw, 6.5rem) | the only preloaded font file |
| Heading | Newsreader | 500 | clamp(1.5rem, 3vw, 2.5rem) | |
| Body | IBM Plex Sans (OFL) | 400, 600 | 1.0625rem / 1.6 | |
| Mono / labels | IBM Plex Mono (OFL) | 400 | 0.8125rem | prices, specs, folio, credits |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--paper` | #F1EADF | — | page background (newsprint) |
| `--ink` | #1E1A16 | 14.47:1 | text, rules |
| `--ink-2` | #62584E | 5.80:1 (5.11:1 on `--paper-2`) | secondary text |
| `--red` | #A3271B | 6.13:1 (5.40:1 on `--paper-2`) | the one accent: open status, today, current page, errors |
| `--paper-2` | #E6DCCB | — | footer, image loading tint |

Checked with `scripts/contrast.mjs`.

## Layout
- Grid: 12 columns, 1240 px max; one column under 960 px
- Margins / gutters: 24 px page margin, 32 px column gap
- Section spacing: 48 to 64 px, sections separated by ink rules instead of cards
- Nav: masthead with folio line (town, date, open status), name, three links; no hamburger (three links fit at 375 px)
- Footer (sign-off): address, hours link, email, links incl. privacy, the demo notice

## Components
- Buttons: ink block, red on hover; one primary per view
- Links: underlined, red on hover; nav uses a drawn underline
- Cards (only if needed): none; columns and rules instead
- Forms: labelled fields, inline errors tied with `aria-describedby`, focus moves to the first error

## Imagery
- Source: Wikimedia Commons (CC BY / CC BY-SA), all placeholders, none of this shop; see `MEDIA.md`
- Treatment: full colour, cropped to the column; credit line under every photo
- `[NEEDS ASSET]` list: the shop's own photos of the counter, the room and the pastry case

## Restraint Gate record
- Concept survived: yes, after 1 change (the cup moved above each drink list, so the signature is seen before the list)
- Cut: a parallax hero photo — fails Q1 and Q2 (no hierarchy, feedback or story; the brief doesn't need it)
- Kept: the open-now line in the masthead — fails Q1, passes Q2: the brief asks for hours to be easy to find
- Rejected animation: section fade-ins on scroll — it delays the hours and menu the brief puts first
