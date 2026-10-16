# Structure: Monsoon Jazz Night · National Theatre Hall, 14 November

> Design reference, not code. Build this in the stack Step 0 chose (`thinking/sequence.md`); do not copy a file layout from
> anywhere into a different stack. Screenshot: `og.jpg`. Decisions (concept, type, colour, imagery, restraint): `DESIGN.md`.

- **Kind:** event landing
- **Archetype · mutation · signature:** poster · scale-abuse · width-sprint
- **Tier:** 4
- **Type roles:** display Anybody · text Anybody · mono JetBrains Mono
- **What it is:** A one-night jazz concert as a lit poster on a dark street: the name, tickets drawn as tickets, the running order, and how to get to the hall.

## Sections, in order

### 1. hero (`hero-event-poster`)

A one-night jazz concert's page is a poster: stage light falling through a high window, the title as heavy condensed type, and the date on a split-flap board.

- **Why it's memorable:** One screen holds everything a poster would (what, when, where, price); the stage light is the venue's real clerestory, and the flap board is the date, not a countdown gimmick.
- **Mobile:** Title stacks on three lines; the date board wraps under it; the light is the still poster on low-end phones.
- **Reduced motion:** Still light, final date, the same title.

### 2. pricing (`pricing-event-tickets`)

Three ticket tiers drawn as actual paper tickets (stub, perforation, seat block) that tilt toward the cursor like a ticket held to the light; the gallery tier carries a brass stamp, printed, not shining.

- **Why it's memorable:** The tickets are the objects you'll hold at the door, with the real seat blocks; one brass stamp, not three badges.
- **Mobile:** Tickets stack full width; no tilt; the stamp is still.
- **Reduced motion:** No tilt; solid stamp.

### 3. team (`team-event-lineup`)

The night's lineup: a billboard headline that stretches wider the faster you scroll (the font's width axis), every musician's name in one line, then the four sets in running order, each row flooding with the players' instruments on hover.

- **Why it's memorable:** The running order is the information concert-goers want (who, when); the headline stretching with your scroll speed is the night's one loud gesture, set in the poster's own variable face.
- **Mobile:** The headline stays inside the screen at its widest; sets are full-width rows that open on tap.
- **Reduced motion:** The headline stays at its base width; rows invert without the flowing text.

### 4. contact (`contact-event-venue`)

The night's practical details (venue, doors, getting there) with a small dock of the four things people do next: add to calendar, open the map, share, and call the box office.

- **Why it's memorable:** A dock of real next actions instead of a contact form, at a fixed size: the magnification was cut (it enlarged four already 48px targets under a mouse only, and gave no reason to move).
- **Mobile:** The dock is a static row of large buttons.
- **Reduced motion:** Nothing here moves; the copy button's label change is the only feedback.
