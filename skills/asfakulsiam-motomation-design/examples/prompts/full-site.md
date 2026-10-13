# Worked example: a four-page site

A complete small site, four pages that share one stylesheet and one script, built with the skill end to end. Everything below is copied from the session: the prompt, every command and its output, the plan, the files and the gate's verdict for each page. Long outputs are shortened where marked `…`; the full outputs are linked.

| | |
|---|---|
| Agent | Perplexity Computer (orchestrator model Claude Opus 5.5), following the skill by hand: it read `SKILL.md`, ran every script in a terminal and wrote the files itself |
| Skill | v2.4.0-dev (commit `46f2aa0`), scripts run from `skills/asfakulsiam-motomation-design/` |
| Gate | `gate/2`, Playwright 1.59.0, Chromium 1217 |
| Output | [`docs/examples/full-site/`](../../../../docs/examples/full-site/): [home](../../../../docs/examples/full-site/index.html) · [books](../../../../docs/examples/full-site/books.html) · [book page](../../../../docs/examples/full-site/ekti-nodir-naam.html) · [visit](../../../../docs/examples/full-site/visit.html) · [`DESIGN.md`](../../../../docs/examples/full-site/DESIGN.md) · [memory log](../../../../docs/examples/full-site/log.json) · [all command output](../../../../docs/examples/full-site/commands.txt) · [all gate output](../../../../docs/examples/full-site/gate-results.txt) |

## The prompt

```text
Use the asfakulsiam-motomation-design skill: /build a four-page website as static HTML files (index.html, books.html, ekti-nodir-naam.html, visit.html) that share one stylesheet and one script. Use --seed 2410 for the collision engine.

Client: Kheya Press, a small independent publisher in Banglabazar, Old Dhaka. It publishes Bangla translations of world fiction, one title at a time, 500 copies per printing.
Facts you may use:
- Founded 2016. Six titles in print (below).
- No online checkout. Copies are sold at the shop, or ordered by email (orders@kheyapress.com.bd) and delivered inside Dhaka, cash on delivery.
- Shop: 38/2 Pyaridas Road, Banglabazar, Dhaka 1100. Open Saturday to Thursday, 11:00 to 19:00. Closed Friday.
- Every February the press has a stall at the Amar Ekushey Book Fair.
Titles (Bangla title · English title · translated from · translator · first printed · price):
1. শীতের ডাকঘর · The Winter Post Office · Norwegian · Shirin Akhter · 2016 · 450 ৳
… (six titles; full list in prompt.txt)
6. একটি নদীর নাম · The Name of a River · Portuguese · Rumana Haque · 2026 · 420 ৳ (newest; it gets its own page with this opening line: …)
Pages: Home (what the press is, the newest title, the way to the books), Books (all six with translator, language, year and price), the newest title's page (the opening line, price, how to order), Visit (address, hours, how to order, the book fair).
No photographs are available. Do not invent statistics, reviews, awards, prices or opening hours beyond the facts above.
```

Full text: [`prompt.txt`](../../../../docs/examples/full-site/prompt.txt). The press, its address, titles, authors and translators are invented for the example. Banglabazar (Old Dhaka's book district) and the Amar Ekushey Book Fair (every February) are real.

## Step 1: draw and check memory

```text
$ node scripts/collide.mjs --n 3 --spread --category ecommerce --seed 2410
COLLISION ENGINE · category: E-commerce · seed 2410

Draw 1
  Archetype  : The Lookbook (lookbook): full-bleed editorial spreads page by page
  If it can't serve the brief, take: The Catalogue (catalogue), not a favourite
  Mutation   : Self-imposed constraint: one colour, one size or one font weight only
  Collision  : stamp and postmark (post) → steal "ink impression with a date"
               e.g. a 'viewed' or 'booked' stamp with the real date
  Kinetic    : a line splits, driven by scroll velocity
  Seed move  : Neighbour Moves: each letter has its own hover move
  Fingerprint: layout=sequence · tier=2 · signature_type=type

Draw 2
  Archetype  : The Shelf (shelf): products as objects on shelves
  …
Draw 3
  Archetype  : The Poster (poster): one screen one image with layers beneath
  …
  Seed move  : Remembered List: the list marks what you already opened
  Fingerprint: layout=statement · tier=1 · signature_type=micro

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision worlds : 3/3 unique  ✓

$ node scripts/memory.mjs recent
No runs logged yet in this project (/home/user/workspace/runs/full-site/.motomation/log.json).
```

Draw 1 was kept whole: archetype, mutation (one font weight) and collision (a date stamp). Draw 3's seed move, Remembered List, was folded into the same signature rather than added as a second one. Draw 1's Neighbour Moves hover was dropped: it would be a second signature.

## Step 2: the Thinking Sequence

From [`thinking.md`](../../../../docs/examples/full-site/thinking.md), all seven steps as written before any code:

```text
1. Tension   : a press that sells only by hand, one title at a time, 500 copies each ↔ a website that is open to
               everyone, all night, with no counter and no shopkeeper.
2. Concept   : The site is the press's issue card: every book you open is stamped with today's date, so the site
               remembers your visit the way a library card remembers a reader.
3. Archetype : The Lookbook (spreads, page by page), mutated by a self-imposed constraint: one weight only. Every word
               is EB Garamond 400 or Noto Serif Bengali 400; hierarchy comes from size, italic and space.
               Broken rule: a lookbook leans on photography and weight contrast; this one has neither.
4. Collision : stamp and postmark → "ink impression with a date". The date is the visitor's own, never invented.
5. Signature : The Issue Stamp. On a book's page a vermilion date stamp lands once on its issue card with today's date;
               on the Books page any title you have opened keeps its small stamp. One signature, two places, one meaning.
6. Anti-Sameness: no earlier run in memory. AI-default scan: no hero → logos → features → testimonials, no centred
               headline with two buttons, no bento, the nav is a running head, one accent, one face. The obvious
               version (a grid of cover photos with "Add to cart") differs in structure, type, colour, motion,
               signature and imagery.
7. Restraint Gate: four cuts and two rejected animations (below). Concept survived: yes.

Dials     : ENERGY 1 · RHYTHM 2 · MOTION 1 → Tier 1 (the books are quiet and the press sells by hand; the one moment
            is the stamp, which CSS and 40 lines of script can carry)
Type mode : HOUSE STYLE (a publisher's brand site: the visitor came for an impression of the list, and the Bangla
            titles are the strongest image the press has)
```

## Step 3: type and colour from the data files

```text
$ node scripts/search.mjs fonts "bengali book editorial serif"
■ Noto Serif Bengali  (score 9.73)  bangla serif · bookish Bangla serif · pairs_with Noto Sans Bengali; Newsreader
■ EB Garamond  (score 4.76)         text serif · classic book face · use_for literary, academic, heritage
…
$ node scripts/search.mjs palettes "printed matter paper ink"
■ Paper & Vermilion  (score 8.10)  ground #F3F0EA · surface #EAE6DE · ink #151412 · muted #5E5A53 · accent #C8401C · accent_text large-only

$ node scripts/contrast.mjs "#151412" "#F3F0EA"   → 16.18:1  body PASS · large PASS · AAA PASS
$ node scripts/contrast.mjs "#5E5A53" "#F3F0EA"   → 6.02:1   body PASS · large PASS
$ node scripts/contrast.mjs "#C8401C" "#F3F0EA"   → 4.38:1   body FAIL · large PASS
$ node scripts/contrast.mjs "#5E5A53" "#EAE6DE"   → 5.50:1   body PASS · large PASS
```

The 4.38:1 result decided a rule before any CSS existed: vermilion is the stamp's ink only, always at 24px or larger, never body text or a link colour.

| Decision | Value | From |
|---|---|---|
| Archetype + mutation | Lookbook, one weight only | Draw 1 |
| Fonts | EB Garamond 400 + italic, Noto Serif Bengali 400 | `data/fonts.csv` (top 2 for the query) |
| Palette | Paper & Vermilion | `data/palettes.csv` |
| Motion tier | 1 (CSS + 40 lines of JS, 2 KB gzipped) | dials: ENERGY 1 · RHYTHM 2 · MOTION 1 |
| Type mode | HOUSE STYLE | Law 2 fork, brand site |
| Signature | The Issue Stamp | collision + Draw 3's seed move |

## Step 4: the signature move

The stamp is set with the visitor's real date before it is shown, saved so the register can remember it, and lands once when the card is 60% in view. Under reduced motion it is simply there. From [`kheya.js`](../../../../docs/examples/full-site/kheya.js) and [`kheya.css`](../../../../docs/examples/full-site/kheya.css):

```js
const now = new Date(), t = stamp.querySelector("time");
t.dateTime = now.toISOString().slice(0, 10); t.textContent = fmt(now);           // "11 OCT 2026"
const opened = read(); opened[stamp.dataset.book] = t.dateTime; write(opened);    // the register remembers
stamp.hidden = false;
if (reduce || !("IntersectionObserver" in window)) return;                        // reduced motion: already stamped
stamp.classList.add("pending");
const io = new IntersectionObserver((es) => { if (!es.some((e) => e.isIntersecting)) return; io.disconnect();
  setTimeout(() => { stamp.classList.remove("pending"); stamp.classList.add("landed"); card.classList.add("landed"); }, 260);
}, { threshold: 0.6 });
```

```css
@keyframes thump { 0% { opacity: 0; transform: rotate(-7deg) scale(1.55); } 62% { opacity: 1; transform: rotate(-7deg) scale(.97); } 100% { opacity: 1; transform: rotate(-7deg) scale(1); } }
@keyframes nudge { 0%, 55% { transform: none; } 70% { transform: translateY(2px); } 100% { transform: none; } }
@media (prefers-reduced-motion: reduce) { .js .stamp.pending { opacity: 1; transform: rotate(-7deg); } .stamp.landed, .card.landed { animation: none; } }
```

The date sits in a `<time>` element, so the gate's numbers check lists it as live rather than judging it.

![The issue card at 0, 120, 210 and 340 ms: empty, the stamp arriving large, the impact with the card nudged down 2px, the stamp at rest reading "Opened 11 OCT 2026"](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/stamp-frames.webp?raw=true)

## What the Restraint Gate rejected

From [`DESIGN.md`](../../../../docs/examples/full-site/DESIGN.md):

```markdown
- Concept survived: yes
- Cut: cover thumbnails drawn as coloured rectangles — fake covers would be invented artwork
- Cut: a second accent for prices — prices are facts, ink is enough
- Cut: "Open now" live badge on Visit — the hours are enough; a live badge would need the shop's real holidays, which the brief does not give
- Cut: a stamp on every page — the stamp means "you opened this book"; anywhere else it is decoration
- Rejected animation: page-turn transition between pages — tells the visitor nothing and delays every page
- Rejected animation: letters of the Bangla titles fading in one by one — breaks conjuncts in Bangla and delays the first read
```

## The build

Four HTML files, one stylesheet (8 KB) and one script (2 KB). Every section is a spread: verso, a fold rule, recto; on phones the spread stacks, verso first. The nav is a running head, the footer a colophon. One page changed after its first gate run: the home page's Bangla word was enlarged on phones (`clamp(6rem, 30vw, 15rem)`) because at 52px it no longer carried the screen, which HOUSE STYLE asks of it. That page was gated again.

## The gate, page by page

Run on each page, then the site was logged once (one site is one run in memory), each page was gated again, its stamp pasted, and `--verify` run:

```text
$ node scripts/memory.mjs log --archetype lookbook --mutation constraint --signature issue-stamp --fonts "EB Garamond/Noto Serif Bengali" --palette "Paper & Vermilion" --tier 1 --page "home,books,ekti-nodir-naam,visit"
Logged run #1 to /home/user/workspace/runs/full-site/.motomation/log.json
  fingerprint: layout=sequence · tier=1
```

| Page | Contrast (375/390/768/1440) | Overflow | Words | Reduced motion | Names | Numbers | Stamp id | `--verify` |
|---|---|---|---|---|---|---|---|---|
| `index.html` | 0 | 0 | 0 | 0 | 0 | 0 (7 checked) | `b21a18a440` | STAMP VERIFIED |
| `books.html` | 0 | 0 | 0 | 0 | 0 | 0 (21 checked) | `f78f599e8a` | STAMP VERIFIED |
| `ekti-nodir-naam.html` | 0 | 0 | 0 | 0 | 0 | 0 (6 checked, 1 live) | `b5fac3154a` | STAMP VERIFIED |
| `visit.html` | 0 | 0 | 0 | 0 | 0 | 0 (3 checked) | `d84cedcae5` | STAMP VERIFIED |

One page in full (the others are in [`gate-results.txt`](../../../../docs/examples/full-site/gate-results.txt)):

```text
DELIVERY GATE · ekti-nodir-naam.html
  contrast  ✓ 0 below AA across 375/390/768/1440px  (measured against rendered pixels at each width)
      375px  ✓ 0 below AA  (27 measured; 11 skipped; 0 not visible at scan time)
      …
  overflow  ✓ 0 at 375/390/768/1440px
  words     ✓ 0 display-text problems at 375px  (4 display elements checked)
  motion    ✓ 0 text elements hidden only under reduced motion; pixels changing on a still page: 0%  (38 compared)
  names     ✓ 0 missing alt / accessible names  (9 interactive elements checked)
  numbers   ✓ 0 values shown wrong before they settle  (6 numbers checked at scroll 0, scroll end and reduced motion; 1 live values skipped)
  hierarchy  h1×1, 0 skipped heading levels, 1 element(s) tied for largest on the first 375px screen
  structure  4 sections, entrances: static | static | static | static → 0 repeat(s); pins 0, WebGL canvases 0, JS 2KB gzipped
  critique → C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:4,anim:2] M5[t1:pins0/2,webgl0/1,js2/30KB,rm0] V5[entrance-repeats:0]
  PASS  stamp → critique: C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:4,anim:2] M5[t1:pins0/2,webgl0/1,js2/30KB,rm0] V5[entrance-repeats:0] · gate: c0 o0 w0 rm0 a0 n0 · gate/2 · b5fac3154a
$ node scripts/gate.mjs --verify ekti-nodir-naam.html
STAMP VERIFIED · critique and gate numbers match a fresh scan · gate PASS
```

## Screenshots

| Page | Desktop, 1440 | Phone, 375 |
|---|---|---|
| Home | ![Home at 1440: the Bangla word খেয়া set huge on the left page of a spread, the press described on the right](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/index-1440.webp?raw=true) | ![Home at 375: the spreads stacked, খেয়া across the first screen](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/index-375.webp?raw=true) |
| Books | ![Books at 1440: "Six books." on the left, a register of six titles with translator, year and price on the right](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/books-1440.webp?raw=true) | ![Books at 375: the register as a single column, prices on the title row](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/books-375.webp?raw=true) |
| Book | ![Book page at 1440: the Bangla title huge on the left, the issue card with the vermilion "Opened 11 OCT 2026" stamp on the right](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/ekti-nodir-naam-1440.webp?raw=true) | ![Book page at 375: title, then the issue card and stamp, then the first line](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/ekti-nodir-naam-375.webp?raw=true) |
| Visit | ![Visit at 1440: "Banglabazar." with the address on the left, hours and email ordering on the right](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/visit-1440.webp?raw=true) | ![Visit at 375: address, hours, ordering, book fair](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/visit-375.webp?raw=true) |

After opening the book page, the register keeps its stamp ([books, remembered](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/books-1440-remembered.webp?raw=true)). Under reduced motion the book page shows the stamp at rest from the first frame ([screenshot](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/full-site/screens/ekti-nodir-naam-1440-reduced.webp?raw=true)).

## Run it yourself

```bash
npx skills add asfakulsiam/asfakulsiam-motomation-design
# paste prompt.txt into your agent, or follow the steps above by hand
node .claude/skills/asfakulsiam-motomation-design/scripts/gate.mjs index.html      # then each page
node .claude/skills/asfakulsiam-motomation-design/scripts/memory.mjs log --archetype … --page "home,books,…"   # once per site
node .claude/skills/asfakulsiam-motomation-design/scripts/gate.mjs --verify index.html
```

With `--seed 2410` you get the same three draws. What should stay the same: one concept carried through every page, the signature only where it means something, one weight and one accent if you keep the mutation, no invented facts, a reduced-motion state that shows the end result, and a verified stamp on every page. The look can differ; that is the point of the draw.
