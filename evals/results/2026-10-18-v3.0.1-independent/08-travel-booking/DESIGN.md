# Srimangal Hills Guesthouse

## Stack
- Stack: plain HTML/CSS/vanilla JS; static generated route files; Node 20 static server on port 4301.
- Source: user delivery constraints, no installs and low rural bandwidth.
- Adapter: adapters/vanilla.md read.
- Conflict: the default Next.js route yields to the explicit static/no-install brief. No runtime dependencies.
- Native date inputs are adopted rather than recreating an inaccessible popup; each route is addressable without client routing.

## Dependencies
No application packages. Node built-ins generate files and serve them. Preinstalled Playwright and Chromium are test-only tools.

## Product contract
- Product: a direct-booking website for a fictional family-run six-room guesthouse among tea gardens in Srimangal, Bangladesh.
- Audience: couples, solo visitors and families planning a short stay, often on a mobile phone with unreliable data. Guests need clear prices, accessibility information and fast forms.
- Jobs: check dates, compare rooms and capacities, reserve a room, add an experience, understand policies, find the way there.
- Business model: direct room reservations avoiding platform fees; prominent dates and room inventory, transparent totals.
- Core journeys: `/ → /rooms → /rooms/garden-veranda → /booking/dates → /booking/guests → /booking/details → /booking/review → /booking/confirmation`; `/ → /experiences → /experiences/tea-garden-walk → /booking/dates`; `/booking/confirmation → /getting-there`.
- Information architecture: shared public navigation (rooms, experiences, getting there, check availability), deeper room detail and task-first booking steps, footer support/legal navigation.
- Content and density: home is calm and moderately sparse; room list gives six comparable records; details carry capacity, bed, access and rate; booking is compact and information-led with a running summary.
- Essential interactions and states: date availability calendar with month changes and blocked nights, guest capacity validation, room selection, experience add/remove, guest-form validation, pending state, recoverable network/storage errors, empty confirmation, local reservation success and reload survival.
- Responsive expectations: desktop two-column booking with sidebar summary; mobile stacked fields and summary, fully visible navigation via disclosure, full-width actions, dates remain one tap away. No cinematic scroll dependency.
- Constraints: no packages, no backend, no real payment, all writes within output directory, one lightweight browser, static server only port 4301.
- Explicit exclusions: server booking, email delivery, payment processing, channel sync, guest authentication and staff dashboard are outside this frontend benchmark; their boundaries remain visible where relevant.
- Success criteria: every specified route and all three journeys work at 375 and 1440; confirmation persists locally; unknown routes return styled HTTP 404.
- Assumptions: English, BDT, one room per stay, maximum 14 nights, 1–4 guests according to capacity, fictional demo policies and inventory. No exact property address is supplied, so location map shows Srimangal town only and says it is not the guesthouse.
- Approval: Checkpoint 2 self-approved under benchmark policy before concept work.

## Scope
**Site type:** travel-booking, Bangladesh
**Admin panel:** no
**Delivery mode:** functional frontend

| Kind | Item | Mark | Evidence | Level |
|---|---|---|---|---|
| route | / | requested | | interaction |
| route | /rooms | requested | | interaction |
| route | /rooms/garden-veranda | requested | | interaction |
| route | /rooms/tea-view-double | required | | interaction |
| route | /rooms/courtyard-twin | required | | interaction |
| route | /rooms/hill-facing-double | required | | interaction |
| route | /rooms/family-veranda | required | | interaction |
| route | /rooms/quiet-corner | required | | interaction |
| route | /availability | requested | | interaction |
| route | /booking/dates | requested | | persisted |
| route | /booking/guests | requested | | persisted |
| route | /booking/details | requested | | persisted |
| route | /booking/review | requested | | persisted |
| route | /booking/confirmation | requested | | persisted |
| route | /experiences | requested | | interaction |
| route | /experiences/tea-garden-walk | requested | | interaction |
| route | /experiences/tea-at-the-table | required | | interaction |
| route | /getting-there | requested | | interaction |
| legal | /house-rules | requested | | interface |
| legal | /cancellation-policy | requested | | interface |
| route | /contact | requested | | interaction |
| legal | /privacy | requested | | interface |
| legal | /terms | requested | | interface |
| route | /404 | requested | | interface |
| journey | Reserve a room | requested | / → /rooms → /rooms/garden-veranda → /booking/dates → /booking/guests → /booking/details → /booking/review → /booking/confirmation | persisted |
| journey | Add an experience | requested | / → /experiences → /experiences/tea-garden-walk → /booking/dates | persisted |
| journey | Find the way | requested | /booking/confirmation → /getting-there | interaction |
| function | Calendar and capacity validation | requested | app.js#validateDates | interaction |
| function | Save reservation locally | requested | app.js#localStorage | persisted |
| function | Experience selection | requested | app.js#experience | persisted |
| function | Payment integration | not required for this brief, reason: no payment service supplied; interface: /booking/review | | integration |
| function | Channel sync backend | not required for this brief, reason: frontend demo inventory only; interface: /availability | | backend |
| state | Booking empty, pending, error and success | required | SCHEMA.md#States | interface |
| edge | Invalid date range, capacity, blocked night and storage failure | required | SCHEMA.md#States | interaction |
| admin | Staff dashboard | not required for this brief, reason: guest-facing frontend only | | |
| skeleton | Async form request | required | app.js#aria-busy | interaction |
| template | .env.example | not required for this brief, reason: no environment variables read | | |
| template | middleware.ts | not required for this brief, reason: static frontend; server.mjs sends security headers | | |

## Type research
The following are public text observations, not a claim to have tested competitor booking flows or responsive layouts.

| Site | Type | Routes | Functionality | States | Admin | Legal | Notes |
|---|---|---|---|---|---|---|---|
| [Niruddesh](https://niruddesh.com/) | Srimangal eco stay | Observed homepage accommodation and booking sections | Observed named rooms, distinct rate and terrace information, guest/room selection and directions | Coming-soon accommodation observed; booking completion unverified | Unverified | Cancellation statement observed, legal routes unverified | Pair atmosphere with immediately comparable inventory |
| [Novem](https://novemecoresort.com/) | Srimangal eco resort | Observed accommodation and inquiry sections | Observed bed/capacity/area/rates, dates, guest details and booking request | Required-field markers observed; submitted states unverified | Unverified | Unverified | State what price includes before committing; avoid mixing sales prose into booking |
| [Banabithi](https://banabithiecoresort.com/) | Srimangal eco resort | Observed room, experiences, location and FAQ sections | Observed room capacities, AC differences, rate, direct-booking CTA and check-in times | Unverified live availability | Unverified | Unverified | Put practical arrival and check-in information close to booking |

Gaps: no competitor backend, authenticated admin, real availability or mobile interactions verified. Brief controls all required routes. No competitor statistic, review or photo is reused.

## Research record
**Access:** web searched and public pages fetched 2026-10-18.

Questions:
1. How can a six-room rural stay make room comparison possible without becoming a marketplace?
2. How can atmosphere hand off to a booking flow without hiding dates?
3. What does a mobile date interface need to remain usable on unreliable data?
4. How can an arrival map avoid implying an invented property location?

| Source (name, URL) | Kind | Observation | Intended use | Limitation |
|---|---|---|---|---|
| [Niruddesh](https://niruddesh.com/) | Production | Named dwellings pair materials and terraces with exact room information | Changed decision: room identity and access facts sit together rather than in separate atmospheric stories | Text only; no motion/responsive behaviour claimed |
| [Novem](https://novemecoresort.com/) | Production | Comparison includes capacity, beds and rates; booking request asks dates and party size | Put capacity and rates before detail CTA; separate guest count from personal details | No submitted booking or availability verified |
| [Banabithi](https://banabithiecoresort.com/) | Production | Dedicated experiences, location and practical check-in FAQ | Keep arrival and optional activity accessible without interrupting room selection | Several marketing claims not independently verified; none copied |
| [Awwwards hotel gallery](https://www.awwwards.com/websites/hotel-restaurant/) | Gallery | Category selection is observable in fetched content | Considered as direction discovery, not product evidence | Cached page lists older 2025 entries; no screenshots or motion observed; not treated as a current visual reference |
| [Vita Travels nomination](https://www.awwwards.com/sites/vita-travels) | Gallery | Search result describes wellness/boutique travel, but fetch failed | Rejected as evidence, no layout borrowed | Robots failure; no claim that page was opened successfully |
| [MDN date input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date) | Official docs | Native date values normalise to ISO and support minimum/maximum validation | Adopt native inputs, with an inline visual calendar as an optional availability shortcut; no custom modal picker | Browser appearances differ; phone testing required |
| [OpenStreetMap copyright](https://www.openstreetmap.org/copyright) | Official docs | Attribution and ODbL conditions are stated | Town map, attribution preserved, click-to-load to protect bandwidth | Exact guesthouse location not supplied |
| [Gelasio licence](https://fonts.google.com/specimen/Gelasio/license) | Font source | OFL and attribution observed | Heritage-like readable serif; self-hosted | Not a Bangla typeface; English-only assumption |
| [DM Sans licence](https://fonts.google.com/specimen/DM+Sans/license) | Font source | OFL, intended smaller text use observed | Compact readable booking UI; self-hosted | Latin subset, BDT displayed as text rather than missing currency glyph |

Techniques: native date fields adopted from documented platform APIs; CSS transform-only press feedback; no smooth-scroll library, no copied external code. The library shimmer button was read and rejected because the glint conflicts with a paper-like calm brand. Copy-confirm pattern read; its status-feedback principle adapted to download/reset actions without React.

Research changed the design: direct comparisons in the six-room index now include access and bed configuration, not just photographs; arrival map is opt-in to save rural bandwidth.

## Directions
| Criterion | A · Tea garden field notes | B · Immersive veranda | C · Booking desk |
|---|---|---|---|
| Idea | A small guesthouse reads like a clear, quietly personal visitor guide | Full-screen atmosphere with floating booking overlay | Date-first inventory dashboard |
| Structure | Split editorial home, flat room index, conventional compact booking | Scroll chapters on discovery, booking at persistent CTA | Calendar above rooms on home; minimal story |
| Type mode | HOUSE home; SERVICE booking and comparison | HOUSE discovery, SERVICE booking | SERVICE everywhere |
| Motion | Short press and state feedback | Image movement and reveal choreography | Instant filter and form feedback |
| Product suitability | All routes discoverable; no story gate | Routes retained but overlay increases focus/contrast risk | Fast but underplays calm family-run character |
| Audience and accessibility | Quiet, direct, native controls and conventional reading order | Heavy media conflicts with rural connections | Highly clear; less sense of place |
| Distinction and originality | Numbered room folios, photographic edge-to-edge panels, typographic brand | Familiar luxury-hotel cinematic convention | Familiar booking marketplace |
| Responsive and technical | Straight stacked reading; platform-first implementation | Cropping, motion and overlay complexity | Very feasible but too utilitarian |
| Journey survival | All three directly supported | All possible, less obvious on entry | All three supported |

Chosen: A, with C's explicit date and running-total discipline. This balances the specific tension: six rooms among quiet tea gardens, but a visitor on intermittent mobile data needs to reserve without waiting for a story.

## Concept
- Concept sentence: a guesthouse visitor guide that places a clear booking desk beside the tea-garden view.
- Structure: contract-derived route families; editorial opening only on home.
- Signature: none; identity from numbered room folios, the broad tea-green photo, paper ground and calm serif/sans contrast.
- Dials: ENERGY 1, RHYTHM 2, MOTION 1; Tier 1 throughout.
- Archetypes/collision: not used, because a metaphor must not displace booking IA.
- Rejected: cinematic full-screen video, forced scroll reveals, made-up reviews, award badges, fake live availability, decorative loading delays.

## Divergence
memory.mjs similar reported: No log yet (/home/user/.motomation/log.json): first build, no divergence required.
The obvious template would put a centred slogan over a darkened hero and hide inventory behind a booking widget. This design instead pairs open type and an unshaded landscape, then a flat booking shelf. No previous build was available for axis O. The memory command is read-only; no user-level log is written under the benchmark output restriction.

## Decision trace
| Decision | Traces to |
|---|---|
| Every booking step gets a route | Explicit brief |
| Six-room comparable index | Six rooms in brief; Novem comparison observation |
| Named rooms and access facts | Niruddesh material identity principle; avoid image-only choice |
| Cream ground and tea green | Tea-garden context and calm slow-brand pressure |
| Gelasio serif / DM Sans | Guesthouse warmth versus fast readable task UI; font sources above |
| No decorative motion | Rural mobile-data constraint and speed pressure |
| Persisted local booking | Explicit capability requirement |
| Opt-in town map | Low-bandwidth pressure, missing exact address and OSM attribution guidance |
| No brand logo invented | Typographic name sufficient; fictional client supplied no identity asset |

## Typography
HOUSE STYLE on home headline; SERVICE STYLE on rooms and booking. Gelasio because its readable serif stroke contrast adds quiet personal character; DM Sans stays unobtrusive at controls and prices.
Display: 48–76px home, 32–48px discovery titles, 32px booking titles; body 16px, labels 12–14px. Home headline is an intentional exception to the general web-app scale because it is a hospitality brand discovery surface, not the booking UI. Tabular figures for totals. Longest 375px headline word stays within 327px content box.

## Colour
| Token | Value | Use |
|---|---|---|
| ground | #f6f4ed | Warm off-white paper |
| ink | #203c32 | Dark tea green |
| muted | #59645b | Secondary copy, AA on paper |
| line | #cbd0c4 | Separators, not text |
| accent | #8b3f2d | Small room index, selected details |
| light | #fffefa | Form surfaces |
All descriptive text sits on solid backgrounds. No type over uncontrolled image pixels.

## Layout
Desktop max content 1280px, gutters 5vw capped at 80px. Home image/text ratio 55/45. Section spacing 64–96px. Booking main/sidebar ratio 2/1, mobile stacked. Header is ordinary flow, not a large sticky obstruction. Footer is compact and structured. Mobile public nav uses native details/summary.

## Components and build plan
| Family | Section order | Decision | Mobile |
|---|---|---|---|
| Home | nav, location line, type/photo hero, date shelf, room preview, experience split, practical stay strip, footer | Build original editorial composition; no templates copied | Headline, photo, compact fields, single column previews |
| Rooms | breadcrumb, title/count, capacity filter, six room cards, policies | Build flat cards from catalog | Stacked image/facts, full-width detail link |
| Room detail | breadcrumb, title, photo, facts/access, rate/booking, policies | Build shared template | Photo then facts then CTA |
| Dates / availability | progress, title/demo label, native date fields, inline month calendar, selected summary, continue | Adopt native date controls; custom availability day buttons supplement them | One calendar, stacked fields, no modal |
| Guests / details | progress, form, summary, back/next | Native select, input and textarea; inline errors | Single column, summary below |
| Review / confirmation | recap, edit links, payment boundary, policy consent, confirmation; then reference, download and directions | Build local booking transaction with async fixture error handling | Stacked summary, large CTA |
| Experiences | list then detail with duration, inclusion and add/remove | Build from catalog; persisted experience selection | Image then facts and button |
| Arrival | address limitation, directions, map opt-in, offline notes | Adopt OSM embed, preserve attribution | Text first; external map not essential |
| Support / legal / 404 | clear heading, bounded readable content, recovery actions | Build static content; contact form saves local draft only | Comfortable 16px body and visible recovery links |

## Imagery
Generated concept images, not property evidence. GPT Image 2.5 Flare; landscape tea-garden hero 16:9, warm modest guestroom 4:3. Every crop and original listed in MEDIA.md. Visible disclosure says imagery is illustrative. Self-host compressed WebP, no remote media runtime dependency except optional map. Assets require replacement with actual property imagery before launch.

## Restraint Gate record
- Concept survived: yes.
- Cut: looping background video; fails hierarchy and bandwidth needs.
- Cut: testimonial carousel; no testimonials supplied.
- Cut: ornamental leaf marks; neither needed to navigate nor supplied as branding.
- Kept: landscape image; hierarchy and sense of place support the tea-garden brief.
- Kept: room folio numbers; make six rooms scannable and memorable.
- Rejected animation: scroll parallax; no task benefit and motion/bandwidth cost.
