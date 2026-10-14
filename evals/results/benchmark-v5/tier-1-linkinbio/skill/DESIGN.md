# DESIGN.md: Rumana Akter · Photographs (link page)

> How it looks. Written from the Thinking Sequence before any code. Tier 1 build: no MOTION.md (the motion is the
> component states recorded under "Components" below).

## Stack
- **Stack:** plain HTML/CSS (one `index.html`, inline CSS, zero JavaScript)
- **Source:** "you choose" (client's answer to "which stack?")
- **Reason:** one page, four links, and a "under 1 second on Slow 3G, no JavaScript needed to show or use the links" constraint: a single static file with inline CSS is the smallest thing that can paint (one HTML request, about 3 KB of font, one small image) and any framework would add a runtime or a build step the page has no use for.
- **Adapter:** `adapters/vanilla.md` (its GSAP/Lenis lines don't apply at Tier 1; no `class="js"` switch is needed because nothing depends on JS)

## Read the room (brief inference)
1. **Who:** a stranger who just tapped the link in @rumana.akter's Instagram or Threads profile, on a phone, on a weak signal.
2. **Job:** choose one of four doors (portfolio, prints, workshops, contact) in one tap.
3. **True and specific:** Chattogram; the ship-breaking yards, Fishery Ghat, the hill tracts; signed prints in editions of 20; monthly street photography workshops; the bio line as written.
4. **Feel, in the brief's words:** "quiet, exact, nothing wasted"; "considered and alive when touched"; "nothing moves on its own".
5. **Stack:** not named, client said "you choose" (above).
6. **Tier:** forced to Tier 1 (CSS hover, focus and press only).
7. **Must not happen:** blocking web font, JS needed for the links, anything moving by itself, targets under 44 px, a generic link-in-bio look.
8. **Lazy version:** centred round avatar, name, a stack of four identical pill buttons with drop shadows, a row of social icons, a "Made with …" footer.

Gaps: one. `[ASSUMPTION: the page is served at the root of rumana-akter.example.com]`, so the three web links are written as
same-site paths (`/work`, `/prints`, `/workshops`) that resolve to exactly the URLs in the brief. If the page is hosted
on another domain (a link-in-bio host), change those three `href`s to the absolute URLs. Contact stays `mailto:`.

## Concept
- **Tension:** work made slowly, on foot, in yards and markets where nothing is wasted ↔ a visitor on a weak signal who gives the page two seconds and one thumb.
- **Concept sentence:** The page is one printed tally slip, the kind clerks tear off at the yard gate: her portrait and line at the top, four numbered lines below, and the line you touch prints black under your thumb.
- **Archetype + mutation:** Seeded draw (`collide.mjs --category portfolio --seed 9101`) gave The Timeline; it can't serve the brief (there are no dates or history in the brief and inventing them is banned), so I took the draw's printed fallback, **The Ledger**, as reference: numbered line items, one row per entry, a rule between rows. **Mutation, from the same draw: "single object, the whole site orbits one object".** The Ledger's rule "a page of rows" is broken: there is no page, no header, no nav, no footer; the ledger is cut down to one torn slip lying on a dark steel ground, and every element, portrait included, is printed on that slip.
- **Collision:** receipt printer (from the seed 9101 draw) → steal "paper feeding line by line". Behaviour, not picture: rows are printed lines with index numbers and a dashed tear rule; the slip has sawtooth tear edges top and bottom; pressing a line advances it like the paper feed; the heat of the print head turns the line black.
- **Signature move (`thermal-feed`):** hover, focus or press a line and the print head passes over it left to right (a `clip-path` wipe, 200 ms): the whole row prints in reverse, paper-coloured type on black, and on press the line feeds up 2 px. Repeated with variation: the fourth line, Contact, is the end of the roll and prints on the red end-of-roll stripe instead of black. That is the page's one accent moment.
- **Dials:** ENERGY 1 · RHYTHM 1 · MOTION 1 → **Tier 1** (forced by the brief; also what the dials give: four doors, no story)
- **Rejected:** the stack of rounded pill buttons under a round avatar (the link-in-bio service look the brief says it must not read as); a full-width portrait hero (pushes three of the four links below the first 375 px screen); a dark "photographer" gallery page (there are no images to show yet, and the job is to send people elsewhere).

### Anti-sameness
- AI-default scan: 0 of 29 match (no centred hero + two buttons, no bento, no icon row, no gradient, no glass, no stat, no fade-up).
- Project memory: `memory.mjs check --archetype ledger --signature thermal-feed --tier 1 --sections hook,links,colophon` → no logged runs in this project; archetype, signature and tier fresh.
- Versus the template: differs in structure (one slip, no nav/footer), type (a narrow-set mono display, not a sans), colour (paper on steel with an end-of-roll red), motion (print-head wipe instead of shadow lift), signature and imagery (4:5 print in the corner, not a round avatar). Six of six.
- Memory only knows this project; novelty across other projects is not checked.

## Typography
Type mode: **SERVICE STYLE (information-led)** because the visitor came to do one task, pick one of four doors in a glance on a phone, so the four labels must read instantly; character comes from the face, the single weight and the ledger rhythm of numbered rows, not from a hero-scale word.

**Display: Martian Mono, one static instance (wght 400, wdth 87.5), subset to the 26 glyphs the name, the four labels and the index numbers use (3.3 KB woff2, self-hosted, preloaded, `font-display: swap`)** because a slightly narrowed mono is the voice of a printed tally line, exact and even, and set at row size it stays legible on a 320 px phone. **Text: the platform serif stack (Charter, Iowan Old Style, Source Serif, Georgia)** for the one-line bio, because it costs zero bytes on 3G and a serif against the mono contrasts in one dimension only. **Labels: the platform mono stack (ui-monospace, SF Mono, Menlo, Consolas)** for details and the handle, zero bytes. Text never waits for the font: the fallback mono paints first.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display (name, `h1`) | Martian Mono subset | 400 / wdth 87.5 | `--ui-name` clamp(1.875rem, 1.4rem + 2vw, 3.25rem) | the largest text on every screen; -0.02em |
| Heading (link labels) | Martian Mono subset | 400 / wdth 87.5 | `--ui-row` clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem) | one per row |
| Body (bio) | Charter / Georgia stack | 400 | `--ui-1` clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem) | line-height 1.45, `text-wrap: pretty` |
| Mono / labels | ui-monospace stack | 400 | `--ui-0` 0.8125rem (13 px) | details, handle; +0.02em; ≥ 4.7:1 |
| Index numbers | Martian Mono subset | 400 | `--ui-0` | `01`–`04`, tabular by nature |

Long words at 375: "Workshops", 9 characters × 24 px × ~0.57 ≈ 123 px in a ~250 px column; "Rumana", 6 × 30 × 0.57 ≈ 103 px in a ~200 px column. Both fit.

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--table` | `#1F2120` | — | the steel ground the slip lies on (no text sits on it) |
| `--paper` | `#F2EEE5` | — | the slip: page ground for all text |
| `--ink` | `#191A18` | 15.08:1 on paper | name, labels, bio; also the printed (heat) band |
| `--muted` | `#5A5850` | 6.15:1 on paper | index numbers, details, handle, rules. Paper only, never on a band |
| `--accent` | `#A8361C` | paper on accent 5.65:1 | end-of-roll stripe: the Contact line's printed state only |
| `--rule` | `#8E8A80` | decorative | dashed tear rules between lines (not text) |

Text on the printed band is always `--paper` (15.08:1 on ink, 5.65:1 on accent). The focus ring is a 2 px `--paper` line inset in the band (15.08:1 / 5.65:1). No text is dimmed by opacity.

## Layout
- Grid: one object. The slip is `min(100%, 34rem)` wide, centred on the steel ground at every width: a single slip on a table, which is the mutation, not a centred hero.
- Inside the slip: head row = portrait column (6.25 rem phone, 9 rem from 640 px) + name and line; then four full-bleed rows (index column 2.5 rem, label, arrow; detail on a second line).
- Margins / gutters: page padding `clamp(10px, 4vw, 72px)`; slip padding 20 px phone, 32 px desktop; rows bleed to the slip's edges so the printed band crosses the full paper width.
- Section spacing: n/a (one slip); internal steps 8 / 12 / 16 / 24.
- Grid break: the printed band ignores the slip's inner padding and runs edge to edge.
- Nav: the four lines are the navigation (`<nav aria-label="Links">`, ordered list). No header bar.
- Footer (sign-off): the slip's own foot: a dashed rule, then the handle once, small: "Instagram and Threads @rumana.akter". Sawtooth tear edge under it.
- 1440: the slip stays receipt-width on a large steel field; the field is the "air". Intended, not stretched.

## Components
- Buttons: none.
- Links (the four lines): real `<a href>`; each row ≥ 72 px tall (above the 44 px floor); whole row is the target.
  - Rest: ink on paper, index and detail in muted.
  - Hover (`hover: hover` and `pointer: fine`) and `:focus-visible`: the print-head wipe, `clip-path: inset(0 100% 0 0)` → `inset(0)`, 200 ms `--ease-out`, revealing an `aria-hidden` printed copy of the same row (paper on ink; paper on accent for Contact). Focus adds the inset 2 px paper ring.
  - Press (`:active`): printed state at 120 ms plus a 2 px feed (`translateY(-2px)`), 100 ms.
  - Reduced motion: no wipe, no feed; the printed state appears instantly.
  - Forced colors: the printed copy is removed; system `Highlight` outline on focus.
- Cards: none. Forms: none.

## Imagery
- Source: client supplies `portrait.jpg` (4:5, about 1200 × 1500). Placeholder files ship in its place: `portrait.jpg`, `portrait.webp` and `portrait-400.webp` (flat dark tone) so the frame looks finished before the photo arrives; `og-image.jpg` 1200 × 630.
- Treatment: 4:5 print in the head of the slip, no radius, no border; `width`/`height` set, `fetchpriority="high"` (it is the LCP image), `srcset` 400w / 1200w.
- `[NEEDS ASSET]`: `portrait.jpg` from the client, then export `portrait.webp` (1200 w) and `portrait-400.webp` (400 w) from it; a designed `og-image.jpg` 1200 × 630.

## Restraint Gate record
- Concept survived: yes
- Cut: row of social icons — fails Q1 and Q2 (the brief gives no other profile URLs and asks for the handle once, as text)
- Cut: full-width portrait hero — fails Q1 and Q2 (it pushes three of the four links below the first phone screen; the brief needs the portrait "next to" her line, not above it)
- Cut: header bar and a footer link list — fails Q1 and Q2 (one page, four doors: the lines are the navigation and the slip's foot is the sign-off)
- Kept: sawtooth tear edges on the slip — fails Q1, passes Q2: the concept sentence is "one printed tally slip", and the torn edge is what makes it a slip and not a card
- Rejected animation: lines printing in one by one on load — fails question 1 (seen on every visit, delays the first tap) and the brief says nothing moves on its own
- Rejected animation: slip feeding up as the page scrolls — fails question 3 (scroll-driven, outside Tier 1) and question 2 (tells the visitor nothing on a one-screen page)
- Rejected animation: drop-shadow lift on hover — fails question 2 (says "button", not "printed line") and question 3 (paints a shadow where a clip does the job)

## Delivery notes
- Files: `index.html`, `fonts/martian-mono-400.woff2` (loaded), `fonts/martian-mono-subset.woff2` (variable source subset, kept for re-instancing, not loaded), `portrait*.{jpg,webp}`, `og-image.jpg`, `_headers`, `robots.txt`, `sitemap.xml`, `llms.txt`.
- Touch press: `:active` styles fire on Android Chrome; iOS Safari may skip `:active` on a page with no touch listener, so the default tap highlight is kept (tinted ink) as the press feedback there. No JS is added to force it.

## Gate (pasted from scripts/gate.mjs, `--verify` passed)
`critique: C5[restraint:kept] H5[375:0] S5[last5:no-log] R5[cuts:3,anim:3] M5[t1:pins0/2,webgl0/1,js2/30KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:5/5,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · c430ba2f26`

Advisory warnings left on purpose: scale 1:3.9 and focal 1.01× (SERVICE STYLE: the four lines are meant to weigh about the same as the head), fold 2 sections at 1440 (one slip on purpose). Weight before the first paint: HTML 3.8 KB gzipped + 3.3 KB font + 0.7 KB portrait placeholder. Lighthouse Slow 3G: not measured.
