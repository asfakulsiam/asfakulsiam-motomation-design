# DESIGN.md: Jol · Issue 07, "The Last Boatbuilders of Sadarghat"

> How it looks. Written at Thinking Sequence step 3 of `/build`; read by every later command. Overrides the house defaults where it differs.

## Stack
- **Stack:** plain HTML/CSS/JS (one `index.html`, one stylesheet, one script, self-hosted GSAP 3.13 + ScrollTrigger + SplitText + Lenis 1.3 in `vendor/`, self-hosted fonts in `fonts/`)
- **Source:** "you choose" (the brief names no stack)
- **Reason:** one article page with no routes, no data and no build step; the client's developer already drops GSAP, ScrollTrigger and Lenis into the magazine, so a static file they can host anywhere is the shortest path. Astro was the runner-up (content-first) and lost only because a single page gains nothing from a build.
- **Adapter:** `adapters/vanilla.md` (pinned versions, `class="js"` set inline, all motion inside `gsap.matchMedia()`)

## Read the room (brief inference)
1. **Who:** a reader on a 375 px phone, arriving from a newsletter or a social post, with twenty minutes to give if the piece earns them.
2. **Job:** read one 4,000-word feature from the first line to the author note without getting lost, then see what comes next (Issue 08) and subscribe.
3. **True and specific:** the Buriganga's south bank across from Sadarghat; a dozen families; keels of sal; Abdul Karim (62) sets ribs by sight; timber from Myanmar, price doubled since 2019 (client's figure); steel launches welded across the river; work stops in the monsoon; two apprentices left this year, Rubel (19) stayed; forty men push the boat in. Farhana Rahman (words), Tanvir Hossain (photographs), 18 minutes, Monsoon 2026.
4. **Feel, in the brief's words:** "paced, like a printed feature turned by hand"; "the issue looks like *Jol*, not like a blog template".
5. **Stack:** not named → asked → "you choose" → plain HTML (above).
6. **Tier:** forced Tier 2 (GSAP + ScrollTrigger + Lenis). No pins, no WebGL, no View Transitions, no Lottie/Rive.
7. **Must not happen:** motion that delays reading; text that leaves the column at 375; invented numbers or quotes; footnotes a thumb can't hit.
8. **Lazy version:** blog template: centred title over a hero photo, 700 px column, share buttons, "related posts" cards, every paragraph fading up.

Gaps: photographs come later (placeholders by agreement); routes for the magazine's home, archive and about pages are assumed as `/`, `/issues/`, `/about/` (owner to confirm).

## Concept
- **Tension:** a craft that survives by being slow (a boat built by eye, rib by rib, on a river that is leaving it for steel) ↔ a reader who arrives fast, on a phone, from a feed.
- **Concept sentence:** The issue is read like a hull's draft marks: the river rises up the margin as you read, from 01 Keel at the bottom to 07 Launch at the top, and each movement surfaces through its own waterline.
- **Archetype + mutation:** The Broadsheet as reference (a masthead, folios on every movement, column rules, a small-print notes column, a colophon) mutated by **swap the material** (collide.mjs draw, seed 9201): the paper's rules become *waterlines*. Type does not sit on a rule, it rises out from under it; and the broadsheet's contents column becomes the draft scale painted on a boat's hull, numbered from the keel up.
- **Collision:** receipt printer (seed 9201) → steal "paper feeding line by line": the standfirst and the two pull quotes feed out of their waterline one line at a time, at reading pace, so the eye is led line by line to what to read. Body text is never fed or faded.
- **Signature move:** **Draft Marks.** A hull's draft scale in the left margin (01 Keel at the bottom, 07 Launch at the top) fills with river as you read, and every movement's title surfaces through a hairline waterline as it arrives. Introduced on the cover (the masthead waterline draws, the headline surfaces), echoed at each of the seven openers, and turned once at 05 Monsoon, where the river has risen over the page and the whole movement is set on river water. On a phone the scale becomes a thin waterline across the top of the screen and an inline draft scale in the cover.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2 (forced by `--tier=2`; matches the dial)
- **Rejected:** the blog template above; a pinned, scrubbed photo chapter per movement (Tier 5 film, which the brief forbids and which would fight the text); a dark "documentary" theme for the whole page (the brief wants text comfortable for twenty minutes; dark is kept for the one turn, Monsoon).

### Anti-sameness check
- AI-default list (`gates/delivery-gate.md` Part 2): 0 matches. No centred hero with buttons, no bento, no gradients or blobs, no icon rows, one accent, one display family.
- Memory: `memory.mjs check --archetype broadsheet --signature draft-marks --tier 2 …` → archetype fresh, signature fresh, tier fresh, no logged run to compare (first run in this project). Memory only knows this project; novelty across other projects is not guaranteed.
- Against the obvious version, it differs in structure (broadsheet cover + draft-scale nav + full-bleed river turn), type (one newspaper family across optical sizes, a mono for folios), colour (silt paper and tar ink, one river accent), motion (waterline surfacing and line feed, no paragraph fades), signature (draft marks) and imagery (plates held to ratio with captions in the margin).

## Typography
Type mode: HOUSE STYLE (typography-led), because this is an editorial long read: the headline is the cover image while the photographs are still to come, and the body face must disappear for twenty minutes.

One family across its optical sizes, as a broadsheet sets its whole paper: **Newsreader** (opsz 6–72, wght 200–800, roman + italic). The display cut (opsz 72, light) has the sharp contrast of a newspaper headline; the text cut (opsz 16, regular) is a calm reading serif. Display and text contrast in one dimension only (optical size and weight). **IBM Plex Mono** carries folios, draft marks, plate labels and credits, like the small type of a paper's rule lines. **Tiro Bangla** is loaded as a two-glyph subset for জল only (it pairs with Newsreader in `data/fonts.csv` and handles the Bangla strokes properly). Newsreader was chosen over Libre Caslon Display (a heritage face with no reading cut) and Instrument Serif (an AI-default editorial pick).

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display (h1, sign-off) | Newsreader | opsz 72, wght 300 | `--step-4` clamp(3.1rem, 0.9rem + 8.6vw, 9.5rem) | tracking -0.03em, leading 0.92; "Boatbuilders" (12 ch × 0.5 × 49.6 px ≈ 298 px) fits 335 px at 375 |
| Heading (movement titles) | Newsreader italic | opsz 60, wght 350 | `--step-3` clamp(2.6rem, 1.6rem + 4.2vw, 5.5rem) | balance; surfaces from its waterline |
| Pull quote | Newsreader italic | opsz 48, wght 330 | `--step-2` clamp(1.75rem, 1.3rem + 1.9vw, 3rem) | hanging opening quote |
| Standfirst | Newsreader | opsz 24, wght 380 | `--step-1` clamp(1.3rem, 1.15rem + 0.6vw, 1.75rem) | |
| Body | Newsreader | opsz 16, wght 400 | `--step-0` clamp(1.125rem, 1.07rem + 0.24vw, 1.3rem) | 18 px at 375, ~20.5 px at 1440; leading 1.62; measure 36rem (≈ 64 ch) |
| Mono / labels | IBM Plex Mono | 400 / 500 | `--step--1` clamp(0.8125rem, 0.78rem + 0.12vw, 0.875rem) | uppercase +0.08em; ≥ 13 px everywhere |

Motif: the two-digit folio `01`–`07`, used on the draft scale, at each opener ("02 of 07") and on the plates.

## Colour
Silt paper and tar ink, one river accent. Pairs measured with `scripts/contrast.mjs`.

| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | `#EDE8DE` silt paper | — | page background |
| `--surface` | `#E2DCCF` | — | photo plates (placeholders) |
| `--ink` | `#1A1712` tar | 14.63:1 (13.08:1 on surface) | text |
| `--muted` | `#5C554A` | 6.02:1 (5.38:1 on surface) | captions, folios, rules |
| `--accent` | `#1F5D57` Buriganga | 6.22:1 | the water in the draft scale, the active mark, note markers, focus ring |
| `--river` | `#16201E` | — | 05 Monsoon ground (the one dark turn) |
| `--ink-on-river` | `#E9E6DD` | 13.36:1 on river | Monsoon text |
| `--muted-on-river` | `#A9B3AE` | 7.73:1 on river | Monsoon folio and rule |
| `--accent-on-river` | `#7FB5A9` | 7.21:1 on river | Monsoon marker links |

Accent footprint: a 2 px line and a few marks per screen, under 5 %.

## Layout
- Grid: one named grid used by every block: `full | margin | text (36rem) | wide (17rem) | margin | full`. The text column sits left of centre; the right "wide" column holds credits, the 4:5 plates and the hanging pull quotes. 3:2 plates span text + wide.
- Margins / gutters: 20 px at 375; `clamp(20px, 5vw, 96px)` above; the fixed draft scale lives in the left margin from 1200 px.
- Section spacing: 160 px between movements on desktop, 96 px on phones; the Monsoon band is a full-bleed punctuation with its own 160 px padding.
- Nav: masthead row (Jol জল wordmark left, issue and season right) above a full-width waterline; the draft scale is the contents (seven links). No hamburger, no sticky header.
- Footer (sign-off): the next issue set large ("Issue 08: Char Life", December 2026), the subscribe link, a colophon with credits, and a giant জল surfacing from the last waterline.

## Components
- Buttons: none. The subscribe link is a text link with a thick underline.
- Links: ink, 1px underline offset 0.18em; thickens on hover (150 ms). Note markers in accent, superscript, with padding so a thumb can hit them.
- Cards (only if needed): none.
- Forms: none (subscription lives at https://jol.example.com/subscribe).

## Imagery
- Source: six photographs by Tanvir Hossain, supplied later as files.
- Treatment: held as plates on `--surface` at their exact ratio (3:2 × 4, 4:5 × 2), with a mono plate label and the caption + credit beneath. Each plate surfaces from its bottom edge (clip) when it arrives.
- `[NEEDS ASSET]` list: Plate 01 Keel (3:2) · Plate 02 By Eye (4:5) · Plate 03 Teak and Tar (3:2) · Plate 04 The Steel Yards (3:2) · Plate 05 Apprentices (4:5) · Plate 06 Launch (3:2). Deliver as AVIF/WebP with `srcset`; plates 02–06 `loading="lazy"`.

## Restraint Gate record
<!-- Filled in at step 7 of the Thinking Sequence. scripts/gate.mjs derives the C and R critique scores from these lines, so keep the exact prefixes. -->
- Concept survived: yes
- Cut: share buttons and a "related posts" strip — fails Q1 and Q2 (no hierarchy or story; the brief asks for one piece and a pointer to the next issue)
- Cut: a percentage or minutes-left counter beside the draft scale — fails Q1 and Q2 (the scale already says where you are; a number would be noise and would need a figure the brief does not give)
- Cut: a sticky header on phones — fails Q1 and Q2 (costs reading height on a 375 px screen; the 3 px waterline does the job)
- Kept: the drop cap on the first paragraph of 01 Keel only — fails Q1, passes Q2: the brief wants it to feel "like a printed feature", and a printed feature opens with one
- Kept: hatched plate placeholders with mono labels — fails Q1, passes Q2: imagery is out of scope but "images take their space" is in the brief, so the space is held at the real ratio
- Rejected animation: fading or lifting body paragraphs on scroll — fails Q1 (seen hundreds of times in a twenty-minute read) and the brief's "never delays reading"
- Rejected animation: parallax on the photo plates — fails Q2 (tells the reader nothing) and would move content a reader is looking at
- Rejected animation: a scrubbed colour shift from paper to river into 05 Monsoon — fails Q4 (mid-transition the text sits on a half-dark ground below AA)
- Rejected animation: a pulse on note markers — fails Q1 (seen many times; feedback is the focus ring)

## Delivery (gate + handoff)
- Measured stamp (pasted from `scripts/gate.mjs`, confirmed by `--verify`: "STAMP VERIFIED · critique and gate numbers match a fresh scan · gate PASS"):
  `critique: C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:3,anim:4] M5[t2:pins0/2,webgl0/1,js58/80KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:24/24,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · a6424d4669 · skipped 3/156@375`
- Copy pass (`craft/copy.md`): padding tails, borrowed authority, hedge stacks, dash habit, synonym cycling, mirror sentences, generic closers, placeholder names: none found. Only the brief's two quotes are quoted; the only figures are the brief's (a dozen families, 62, 2019 and doubled, two apprentices, 19, forty men, four visits, March to June 2026, 18 minutes).
- Site-level: `robots.txt` and `sitemap.xml` shipped; `_headers` carries CSP, nosniff and Referrer-Policy (CSP and referrer are also in meta tags). Owner to do: Search Console, Lighthouse with real numbers (not measured here), confirm the routes `/`, `/issues/`, `/about/`, `/issues/08-char-life/`.

```
Chose     : Broadsheet mutated by swap-material (rules become waterlines; contents become a hull's draft scale), signature Draft Marks, Newsreader (opsz display + text) / IBM Plex Mono / Tiro Bangla for জল, silt #EDE8DE · tar #1A1712 · river #1F5D57 with one full-bleed river turn at 05 Monsoon, Tier 2
Rejected  : blog template (centred title over hero photo, share buttons, related cards, paragraph fade-ups); pinned photo chapters
Needs     : [NEEDS ASSET] six photographs by Tanvir Hossain (plates 01, 03, 04, 06 at 3:2; 02, 05 at 4:5) as AVIF/WebP with srcset, lazy below the fold
Measured  : see stamp above
Try next  : /critique on a real phone with the six photographs in place, then /polish the plate captions against the actual frames
```
