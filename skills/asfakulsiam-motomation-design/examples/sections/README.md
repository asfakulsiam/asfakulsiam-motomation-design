# Page sections

38 sections composed from the library in `examples/components/`, as references: a new build composes, extends, or invents its own sections and effects, and is not limited to these. Each is tied to one of the 20 archetypes (`structures/archetypes.md`), and its header records what it is, which components it uses, why it earns its place (signature), its mobile layout and its reduced-motion behaviour. `node scripts/build-sections.mjs` (run from the repository root) checks every header and that each listed component exists and is imported, and writes this file.

By kind: heroes 9 · features 7 · galleries 1 · pricing 4 · testimonials 4 · team 3 · calls to action 4 · contact 3 · footers 3. Archetypes used: 14 of 20 (atlas, broadsheet, catalogue, console, field-guide, index, ledger, letter, manifesto, poster, room, shelf, stage, workbench).

**Theme.** Sections read colours and fonts from CSS variables, so a page restyles all of them at once: `--ground --surface --ink --muted --line --accent` and `--font-display --font-text --font-mono` (see `_shared.tsx` for the fallbacks). Each page template sets them once for its brand.

**Use one.** Copy the section file and `_shared.tsx`, plus the components it imports (and their `_lib` helpers). Replace the copy: every section ships with a specific, believable brand, which is the point; don't ship the sample words.

## Heroes

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`hero-editorial-broadsheet`](hero-editorial-broadsheet.tsx) | broadsheet | BlurFocus | It reads as journalism before a word is read: masthead, folio and columns are the structure, and the wire dateline marks the piece as filed, not published by a template. | Columns collapse to one; the masthead rules stay; the headline wraps at a smaller size. | The headline appears complete and sharp. |
| [`hero-event-poster`](hero-event-poster.tsx) | poster | Beams, SplitFlap | One screen holds everything a poster would (what, when, where, price); the stage light is the venue's real clerestory, and the flap board is the date, not a countdown gimmick. | Title stacks on three lines; the date board wraps under it; the light is the still poster on low-end phones. | Still light, final date, the same title. |
| [`hero-hotel-room`](hero-hotel-room.tsx) | room | DarkroomDevelop, Grain | The courtyard appears the way an old photograph does in the tray, pale first, then tone; it is the only motion on the page, so it's remembered, and it says the house is old before any copy does. | The photograph comes first at full width (4:5), the stacked name below it; the develop still runs on scroll. | The photograph is fully developed from the start; nothing else on the page moves. |
| [`hero-org-manifesto`](hero-org-manifesto.tsx) | manifesto | ScrollFloat, InkFill | The Manifesto's speech rhythm: the visitor reads the whole case before seeing a donate button, which is why the button later converts. | The statement wraps to four or five lines at a smaller size; the paragraph is full width. | Statement and paragraph appear fully set. |
| [`hero-personal-letter`](hero-personal-letter.tsx) | letter | Typewriter, Thread | The Letter archetype is the promise of the newsletter itself (one letter a month), so the homepage is the first letter; the thread is the pen moving down the page. | The page is full width with a narrower measure; the thread runs in the left margin. | Salutation complete; the line is drawn in full. |
| [`hero-portfolio-index`](hero-portfolio-index.tsx) | index | FlowingMenu, ImageTrail | The list is the hero, so the first thing a visitor does is choose a project; the image trail shows the work without a thumbnail grid. | Rows stack at full width at a smaller size; the trail is off on touch (Image Trail is fine-pointer only) and rows open on tap. | Rows invert without the marquee; no trail. |
| [`hero-saas-workbench`](hero-saas-workbench.tsx) | workbench | DeviceMockup, RotatingWords, ShimmerButton | The product is the hero (Workbench): the visitor reads a real day's sales in the frame before any claim. The rotating words are the actual customer types, not adjectives. | The frame drops below the sentence at full width; the screen is a normal scroll area. | The first customer type, still; the screen doesn't glide. |
| [`hero-shop-catalogue`](hero-shop-catalogue.tsx) | catalogue | TiltCard, SplitFlap | Each piece is numbered and specified like a museum object, because every glaze firing is different; the batch counter is the real stock. | The spec sheet drops under the object; the card doesn't tilt on touch. | No tilt; the counter shows the current stock. |
| [`hero-studio-ledger`](hero-studio-ledger.tsx) | ledger | SplitFlap, ScrambleOnHover | The studio shows its work as entries with numbers, which is how its clients (archives, banks, ministries) think; the counter is a real figure, not decoration. | The ledger drops its hours and discipline columns below 640px (they move under the client name); the counter stays on one line. | The counter shows its final value; names don't scramble. |

## Features

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`feature-editorial-pullquote`](feature-editorial-pullquote.tsx) | broadsheet | InkFill, ReadingRail | Broadsheet devices doing their real jobs: the pull quote slows the reader at the article's turn, and the rail answers "how long is left" without a timer. | One column; the quote is full width at a smaller size; the rail stays at the top. | The quote is fully inked; the rail still tracks position (it moves only when the reader scrolls). |
| [`features-hotel-rooms`](features-hotel-rooms.tsx) | room | Grain | The arch mask is the house's own doorway shape; nothing moves here, so the courtyard developing above stays the page's only motion. | One column; the large arch first, the others at full width below it. | Nothing here moves. |
| [`features-org-impact`](features-org-impact.tsx) | manifesto | CountUp, ContourLines | The Manifesto backs its argument with evidence at the same scale as the words; the contour lines are the survey work itself. | Numbers stack, still large; contour lines stay behind at low contrast. | Lines are still; numbers show final values. |
| [`features-saas-bento`](features-saas-bento.tsx) | workbench | BentoReveal, CountUp | Each tile is a piece of the real interface with real numbers, not an icon with a feature name; the bento layout mirrors the app's own home screen. | Tiles stack in reading order at full width. | Tiles are all shown; numbers show final values. |
| [`features-saas-console`](features-saas-console.tsx) | console | Terminal, AnimatedList | The Console archetype shows the actual command and the actual result side by side, so the claim ("export in one line") is demonstrated, not stated. | Terminal first, then the list, both full width; long commands wrap. | The session and the list are shown complete. |
| [`features-shop-specs`](features-shop-specs.tsx) | catalogue | Grain | The Catalogue's spec sheet becomes the process: each column is one line of the object's record, ruled like an auction-house lot card on grained paper. | The four columns become four ruled rows. | Identical; the record has no motion. |
| [`features-studio-services`](features-studio-services.tsx) | ledger | GlowBorder, CountUp | Services are priced and staffed like entries, not described with adjectives; the lit edge makes the row feel like a panel of switches you choose between. | Cards stack; the glow rests as a faint border. | Faint static border; numbers show their final value. |

## Galleries

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`gallery-shop-carousel`](gallery-shop-carousel.tsx) | shelf | CurveCarousel | The Shelf archetype puts the products in a physical arrangement; the curve is the kiln shelf they came off. | The arc stays; you swipe or use the arrow buttons; square cards keep the caption inside the shelf height. | No arc motion; a flat, scrollable row. |

## Pricing

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`pricing-event-tickets`](pricing-event-tickets.tsx) | poster | TiltCard | The tickets are the objects you'll hold at the door, with the real seat blocks; one brass stamp, not three badges. | Tickets stack full width; no tilt; the stamp is still. | No tilt; solid stamp. |
| [`pricing-hotel-seasons`](pricing-hotel-seasons.tsx) | room | SpotlightCard | Seasons are the hotel's real price structure, and each card sells the room at that time of year; the lamplight is the courtyard at night. | Cards stack; the light rests at the top of each. | Fixed soft light at the top of each card. |
| [`pricing-saas-switch`](pricing-saas-switch.tsx) | workbench | SquishSwitch, GlowBorder | Only two plans, priced in taka per shop per month, with the saving shown as months free (how shopkeepers count), not a percentage. | Cards stack; the switch stays above them; the glow rests as a faint border. | The switch flips without squish; prices swap instantly. |
| [`pricing-shop-glazes`](pricing-shop-glazes.tsx) | catalogue | RainbowBorder | The border colours are the actual glazes in each set, so the only colourful motion on the page is information about the product. | Lots stack; borders still (they turn while pressed). | Static glaze-coloured borders. |

## Testimonials

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`testimonial-hotel-guestbook`](testimonial-hotel-guestbook.tsx) | letter | Typewriter, Grain | The hotel's real guest book replaces review stars; the typing is the guest writing, and it plays once. | The page is full width with a narrower measure. | The entry is complete; the grain is still. |
| [`testimonial-personal-replies`](testimonial-personal-replies.tsx) | letter | CurvedText | A newsletter's proof is that people write back; the postmark dates the replies, and nothing animates in, because letters don't arrive on scroll. | The postmark sits above the replies; replies are full-width cards. | Nothing here moves. |
| [`testimonial-saas-ink`](testimonial-saas-ink.tsx) | workbench | InkFill, CountUp | One real testimonial with a measured result beats a carousel of five-star quotes; the number is the before/after of her evening. | The number sits above the quote; the quote wraps at full width. | The quote is fully inked; the number shows its final value. |
| [`testimonial-shop-notes`](testimonial-shop-notes.tsx) | catalogue | StickerScatter | These are the actual notes customers mail back, each tied to an object number; the stamps are the studio's real kiln marks. | Notes stack in one column; tapping scatters stamps. | No scatter; notes are plain. |

## Team

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`team-event-lineup`](team-event-lineup.tsx) | stage | WidthSprint, FlowingMenu | The running order is the information concert-goers want (who, when); the headline stretching with your scroll speed is the night's one loud gesture, set in the poster's own variable face. | The headline stays inside the screen at its widest; sets are full-width rows that open on tap. | The headline stays at its base width; rows invert without the flowing text. |
| [`team-org-field-guide`](team-org-field-guide.tsx) | field-guide | Halftone | The people who do the work, catalogued the way the trust catalogues rivers; the one halftone ties the page to the survey prints, and it shows the water, not the people. | The survey print sits above the entries; entries stack one per row. | The print is drawn at full size at once; nothing moves. |
| [`team-studio-rows`](team-studio-rows.tsx) | ledger | Lens, ScrambleOnHover | A team page with no headshot grid: the people are entries in the book and in the room, and the lens connects the two. | The lens becomes a toggle button (Lens's touch path); rows stack name over role. | The lens is a toggle; names don't scramble. |

## Calls to action

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`cta-org-donate`](cta-org-donate.tsx) | manifesto | ClickSpark, useConfetti | Amounts are tied to real costs from the audited budget; the celebration happens once, for the real success, and the sentence carries it. | Amounts are a two-column grid of large buttons. | No sparks or confetti; the confirmation sentence is the same. |
| [`cta-personal-subscribe`](cta-personal-subscribe.tsx) | letter | RotatingWords | The ask is written as a postscript in the letter's voice; the topics rotating are the real next three letters. | The edition choices wrap; field and button stack full width. | The first topic, still. |
| [`cta-saas-trial`](cta-saas-trial.tsx) | console | Typewriter, ShimmerButton | The CTA shows the first thing you'll do after clicking it, so the button's promise is concrete; only one action on the screen. | Prompt and button stack; the button is full width. | The prompt line is complete; the button has no glint. |
| [`cta-shop-hold`](cta-shop-hold.tsx) | catalogue | HoldToCommit | The hold matches the stakes (a unique object, held for 48 hours), and the confirmation names the object number. | The hold button is full width with a large target. | Hold still works; the fill is linear with no flourish. |

## Contact

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`contact-event-venue`](contact-event-venue.tsx) | stage | Dock, CopyButton | A dock of real next actions instead of a contact form, at a fixed size: the magnification was cut (it enlarged four already 48px targets under a mouse only, and gave no reason to move). | The dock is a static row of large buttons. | Nothing here moves; the copy button's label change is the only feedback. |
| [`contact-hotel-atlas`](contact-hotel-atlas.tsx) | atlas | CopyButton | The Atlas archetype answers the guest's real question (how do I get there in Dhaka traffic), and the copy buttons hand the details to a driver. | Legs stack; the address and phone each keep their copy button. | Nothing here moves; the copy buttons confirm with text, not motion. |
| [`contact-studio-copy`](contact-studio-copy.tsx) | ledger | CopyButton, SplitFlap | The wait time is the real answer to "can you take us on", and copying the email is the action people actually take (no form). | Columns stack; the copy button sits under the email. | The board shows the final value; copy confirms in text. |

## Footers

| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |
|---|---|---|---|---|---|
| [`footer-editorial-folio`](footer-editorial-folio.tsx) | broadsheet | RememberedList | Recently-read is genuinely useful for a long-read magazine and costs nothing (local storage, no tracking); the folio closes the print metaphor. | Columns stack; the list is full width. | Nothing animates; the list is static. |
| [`footer-org-seismograph`](footer-org-seismograph.tsx) | manifesto | SeismographLine | The gauge line is the trust's instrument, and its only motion responds to the visitor; the registration numbers are what a careful donor checks last. | The line rests flat (no pointer); columns stack. | The line is flat and still. |
| [`footer-studio-marquee`](footer-studio-marquee.tsx) | ledger | VelocityMarquee | Every client the studio has worked for, as the books' closing line, not a logo wall; the totals line ends the ledger metaphor. | Marquee keeps its base speed; columns stack. | The client list is a static wrapped line. |
