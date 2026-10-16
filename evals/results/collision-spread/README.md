# Collision pool and layout spread (Fix 2)

## Why 4 of 5 diversity draws gave layout=sequence
- `layout` is not drawn: it is the archetype's family (`scripts/lib.mjs` LAYOUT_FAMILY). The no-repeat drawer spread archetype **ids**, never layout families, and four archetypes share `sequence` (film-reel, timeline, room, lookbook).
- 60% of draws come from the category's archetype list; organisation, event, hotel and education all list `timeline` (sequence).
- The five diversity draws were five separate `--n 1` calls, so no spreading across calls happened at all.

## Pool per dimension (after)
- archetypes: 23 rows
- collisions: 40 rows
- mutations: 12 rows
- signatures: 22 rows
- kinetics: 10 rows
- palettes: 40 rows
- layout families (archetypes per family): rows 4, columns 2, sequence 4, statement 4, canvas 2, stage 2, split 2, product 3
- before: 20 archetypes; columns, stage and split had one archetype each. Added almanac (columns), vitrine (stage), fold (split).

## Change (`scripts/collide.mjs`)
Each draw prefers an archetype from the least-used layout family among undrawn archetypes; the category list only chooses within those. With `--exclude-recent`, the families of the last 3 logged runs count as already used. Seeded draws therefore differ from the ones recorded before this change (`evals/results/diversity/draws.txt` stays as the historic record).

Sweep: 60 seeds × 6 category settings (none, organisation, event, hotel, education, product-launch) of `--n 10 --spread --json` → worst layout repeat 2, runs over 2: 0 (first attempt, with the category picking its own least-used family, had 11/360 over 2; fixed).

## Output
```
$ node scripts/collide.mjs --n 10 --spread
COLLISION ENGINE

Draw 1
  Archetype  : The Lookbook (lookbook): full-bleed editorial spreads page by page
  If it can't serve the brief, take: The Vitrine (vitrine), not a favourite
  Mutation   : Wrong room: use another category's structure
  Collision  : metronome (music) → steal "steady tick and swing"
               e.g. a stagger rhythm locked to a visible beat
  Kinetic    : the whole page travels, driven by the visitor's local time
  Seed move  : Remembered List: the list marks what you already opened
  Fingerprint: layout=sequence · tier=1 · signature_type=micro  (closest logged run: 91% ⚠ rebuilds a recent page)

Draw 2
  Archetype  : The Atlas (atlas): a map or diagram you move through
  If it can't serve the brief, take: The Index (index), not a favourite
  Mutation   : Shift the tempo: one section moves at film speed while others stay still
  Collision  : museum label (culture) → steal "small precise caption next to the work"
               e.g. margin captions for every image
  Kinetic    : the background flips, driven by hover
  Seed move  : Neighbour Moves: each letter has its own hover move
  Fingerprint: layout=canvas · tier=2 · signature_type=type  (closest logged run: 37%)

Draw 3
  Archetype  : The Stage (stage): one fixed stage where content enters and leaves
  If it can't serve the brief, take: The Specimen (specimen), not a favourite
  Mutation   : Second person: the visitor becomes a character in the layout
  Collision  : tailor's measuring tape (craft) → steal "a numbered ruler with tension"
               e.g. a scroll progress bar that stretches
  Kinetic    : a line counts, driven by scroll position
  Seed move  : Letter Relay: the hero name travels letter by letter into the header
  Fingerprint: layout=stage · tier=2 · signature_type=type  (closest logged run: 91% ⚠ rebuilds a recent page)

Draw 4
  Archetype  : The Broadsheet (broadsheet): newspaper masthead columns and folios
  If it can't serve the brief, take: The Index (index), not a favourite
  Mutation   : Self-imposed constraint: one colour, one size or one font weight only
  Collision  : library card catalogue (archives) → steal "index cards with tabs"
               e.g. case studies as pull-out cards
  Kinetic    : a mask travels, driven by hover
  Seed move  : Line Curtain: headlines rise line by line from masks
  Fingerprint: layout=columns · tier=2 · signature_type=type  (closest logged run: 37%)

Draw 5
  Archetype  : The Poster (poster): one screen one image with layers beneath
  If it can't serve the brief, take: The Timeline (timeline), not a favourite
  Mutation   : Invert the axis: vertical becomes horizontal or time runs backwards
  Collision  : traffic light (city) → steal "three states in strict order"
               e.g. a three-step process with one state lit
  Kinetic    : the background counts, driven by hover
  Seed move  : Width Sprint: variable width stretches with scroll speed
  Fingerprint: layout=statement · tier=2 · signature_type=type  (closest logged run: 37%)

Draw 6
  Archetype  : The Workbench (workbench): the product UI is the page
  If it can't serve the brief, take: The Timeline (timeline), not a favourite
  Mutation   : Abuse the scale: one element 10x bigger or smaller than expected
  Collision  : darkroom tray (photography) → steal "images appear slowly under red light"
               e.g. photos that develop as they enter
  Kinetic    : the whole page wipes, driven by time on page
  Seed move  : Brand Selection: text selection uses the brand accent
  Fingerprint: layout=product · tier=1 · signature_type=micro  (closest logged run: 37%)

Draw 7
  Archetype  : The Catalogue (catalogue): numbered objects with spec sheets
  If it can't serve the brief, take: The Film Reel (film-reel), not a favourite
  Mutation   : Remove the expected: no nav, no hero image or no grid
  Collision  : ticket stub (events) → steal "a numbered admission stub"
               e.g. a numbered progress counter for a launch
  Kinetic    : a number flips, driven by page exit
  Seed move  : Velocity Skew Marquee: a marquee that leans with scroll speed
  Fingerprint: layout=rows · tier=2 · signature_type=scroll  (closest logged run: 37%)

Draw 8
  Archetype  : The Fold (fold): one sheet folded in two: each half answers the other when opened
  If it can't serve the brief, take: The Room (room), not a favourite
  Mutation   : Make the UI the content: the scrollbar is the timeline; the cursor is the product
  Collision  : rickshaw art (Dhaka street culture) → steal "bold painted panels and borders"
               e.g. a loud painted frame system for a Bangladeshi brand
  Kinetic    : a word travels, driven by scroll position
  Seed move  : Hold to Commit: important actions fill while held
  Fingerprint: layout=split · tier=2 · signature_type=micro  (closest logged run: 37%)

Draw 9
  Archetype  : The Manifesto (manifesto): one argument set large like a speech
  If it can't serve the brief, take: The Diptych (diptych), not a favourite
  Mutation   : Single object: the whole site orbits one object
  Collision  : chess clock (games) → steal "two timers pressing in turn"
               e.g. a diptych where scroll hands time from one side to the other
  Kinetic    : a line counts, driven by page exit
  Seed move  : Timecode Rail: a running timecode shows chapter progress
  Fingerprint: layout=statement · tier=5 · signature_type=scroll  (closest logged run: 28%)

Draw 10
  Archetype  : The Gallery Wall (gallery-wall): free-placed images on a wall to roam
  If it can't serve the brief, take: The Shelf (shelf), not a favourite
  Mutation   : Borrow a print rule: marginalia, footnotes, folios or a colophon
  Collision  : scoreboard (sport) → steal "big flip digits and periods"
               e.g. stats that flip to real values
  Kinetic    : the cursor wipes, driven by a section entering
  Seed move  : Sticker Scatter: the logo bursts into on-brand stickers
  Fingerprint: layout=canvas · tier=2 · signature_type=micro  (closest logged run: 37%)

Diversity (measured)
  archetypes       : 10/10 unique  ✓
  layout families  : 8 distinct over 10 draw(s), at most 2 of any one  ✓
  signature seeds  : 10/10 unique  ✓
  mutations        : 10/10 unique  ✓
  collision worlds : 10/10 unique  ✓

Treat these as constraints, not answers. Combine, bend or reject them, but start from them.
Next: write Tension → Concept with one draw, then run the Thinking Sequence (thinking/sequence.md).

$ node scripts/collide.mjs --n 10 --spread --category organisation | tail -12
  Seed move  : Stacked Deck: sticky cards stack into a table of contents
  Fingerprint: layout=sequence · tier=2 · signature_type=scroll  (closest logged run: 100% ⚠ rebuilds a recent page)

Diversity (measured)
  archetypes       : 10/10 unique  ✓
  layout families  : 8 distinct over 10 draw(s), at most 2 of any one  ✓
  signature seeds  : 10/10 unique  ✓
  mutations        : 10/10 unique  ✓
  collision worlds : 10/10 unique  ✓

Treat these as constraints, not answers. Combine, bend or reject them, but start from them.
Next: write Tension → Concept with one draw, then run the Thinking Sequence (thinking/sequence.md).
```
