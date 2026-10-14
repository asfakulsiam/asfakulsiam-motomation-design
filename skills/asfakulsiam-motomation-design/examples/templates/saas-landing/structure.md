# Structure: Tally · bookkeeping in Bangla and English for small shops

> Design reference, not code. Build this in the stack Step 0 chose (`thinking/sequence.md`); do not copy a file layout from
> anywhere into a different stack. Screenshot: `og.jpg`. Decisions (concept, type, colour, imagery, restraint): `DESIGN.md`.

- **Kind:** SaaS landing
- **Archetype · mutation · signature:** workbench · ui-is-content · ink-fill
- **Tier:** 2
- **Type roles:** display Bricolage Grotesque · text Hanken Grotesk · mono JetBrains Mono
- **What it is:** A bookkeeping app for corner shops where the product is the page: the day's ledger, the four screens, the export line, one customer's evening, two plans.

## Sections, in order

### 1. hero (`hero-saas-workbench`)

A bookkeeping app for small shops opens on the app itself: the real ledger screen in a browser frame, with one sentence whose last words name who it's for.

- **Why it's memorable:** The product is the hero (Workbench): the visitor reads a real day's sales in the frame before any claim. The rotating words are the actual customer types, not adjectives.
- **Mobile:** The frame drops below the sentence at full width; the screen is a normal scroll area.
- **Reduced motion:** The first customer type, still; the screen doesn't glide.

### 2. features (`features-saas-bento`)

Four product facts as a bento of working parts of the app (a sale typed in Bangla, the credit book, the stock alert, the offline badge), each tile revealing as it's reached.

- **Why it's memorable:** Each tile is a piece of the real interface with real numbers, not an icon with a feature name; the bento layout mirrors the app's own home screen.
- **Mobile:** Tiles stack in reading order at full width.
- **Reduced motion:** Tiles are all shown; numbers show final values.

### 3. features (`features-saas-console`)

For the developer side of a bookkeeping app: the real CLI session that exports a month of sales, next to the list of what arrives in the accountant's inbox as it runs.

- **Why it's memorable:** The Console archetype shows the actual command and the actual result side by side, so the claim ("export in one line") is demonstrated, not stated.
- **Mobile:** Terminal first, then the list, both full width; long commands wrap.
- **Reduced motion:** The session and the list are shown complete.

### 4. testimonial (`testimonial-saas-ink`)

One shopkeeper's words, long enough to be specific, inking in as they're read, beside the one number that changed for her.

- **Why it's memorable:** One real testimonial with a measured result beats a carousel of five-star quotes; the number is the before/after of her evening.
- **Mobile:** The number sits above the quote; the quote wraps at full width.
- **Reduced motion:** The quote is fully inked; the number shows its final value.

### 5. pricing (`pricing-saas-switch`)

Two plans and a monthly/yearly switch that squishes as it flips; the prices change in place, and the plan cards' edges light toward the pointer.

- **Why it's memorable:** Only two plans, priced in taka per shop per month, with the saving shown as months free (how shopkeepers count), not a percentage.
- **Mobile:** Cards stack; the switch stays above them; the glow rests as a faint border.
- **Reduced motion:** The switch flips without squish; prices swap instantly.

### 6. cta (`cta-saas-trial`)

The closing ask as the app's own first-run screen: a prompt types out the first sale a new shop will enter, under one primary button.

- **Why it's memorable:** The CTA shows the first thing you'll do after clicking it, so the button's promise is concrete; only one action on the screen.
- **Mobile:** Prompt and button stack; the button is full width.
- **Reduced motion:** The prompt line is complete; the button has no glint.
