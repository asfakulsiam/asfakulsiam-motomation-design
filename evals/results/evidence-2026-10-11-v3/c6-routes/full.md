# C6 full prompt

Prompt:

```text
Use the asfakulsiam-motomation-design skill. Design a landing page for Tilottoma, a small Dhaka bakery that sells sourdough and date-palm-jaggery (khejur gur) buns, open 7am–2pm, closed Fridays, orders by WhatsApp. Start with your route and your plan; don't write the full page yet.
```

Model: claude_sonnet_5_5 (raw API, SKILL.md as system prompt), usage: {"requested": "claude_sonnet_5_5", "served": "claude_sonnet_5_5", "in": 6204, "cached": 0, "out": 1636, "reasoning": 1552, "secs": 31.6}

## Reply

**Route: full.** This is a new landing page, so it gets the whole Thinking Sequence and the Delivery Gate.

I can't run the scripts here, so `collide.mjs`, `search.mjs` and `memory.mjs check` were not run. I picked the collision, fonts and palette by hand. There's no project log to compare against, so the repetition check is not done. I haven't loaded `structures/archetypes.md`, so the archetype below is described in plain words and I'll map it to a named one before building.

```
MOTOMATION PLAN
Tension     : Slow food (long-fermented dough, winter-harvested khejur gur) vs. a bakery that
              is only reachable 7am–2pm, six days a week, through a chat app.
Concept     : "The bakery runs on a clock, and so does the page." The page always tells you
              honestly where the bakery is in its day.
Archetype   : A single-column daily ledger (one tall editorial column with hairline
              rules and index numbers), mutated so the page's spine is the 7→2 day
              rather than a list of sections. Map to a named archetype after loading the file.
Collision   : Sundial → a hairline that moves along a 7am–2pm rule like a shadow.
              It lends the design one property: time shown as position, not as a number alone.
Signature   : The Day Rule. A thin horizontal rule is marked 7 to 2. A marker sits on it at
              the current Dhaka time (Asia/Dhaka, not the visitor's timezone).
              - Open: "Open now · until 2pm". The marker sits on the rule.
              - Before 7am, after 2pm and all day Friday: the marker rests at the end
                and the line reads "Closed · opens Saturday 7am" (or tomorrow).
              The "Order on WhatsApp" link sits at the end of the rule.
Dials       : ENERGY 2 · RHYTHM 2 · MOTION 1 → Tier 1
              (CSS transitions plus about 20 lines of JS to read the time. Nothing here
              needs GSAP; Tier 5 would be decoration.)
Type mode   : HOUSE STYLE. It's a small brand with a story, and the name does the work.
              One compact info strip (hours, closed day, WhatsApp) keeps it usable.
Type        : Display: Fraunces for Latin, paired with Noto Serif Bengali for তিলোত্তমা and
              Bangla lines, sized together so the two scripts look matched.
              Text: Hind Siliguri (Bengali and Latin in one face).
              Why: the brand name is Bangla, so Bangla is not a fallback. Bangla gets
              line-height around 1.6–1.7 and a larger size floor than Latin.
              Fonts are chosen by hand: verify glyph coverage and conjuncts in the build.
Palette     : Bone #F3EBDD ground, crust #2A1D14 text, one accent: jaggery amber, about #9A4F12.
              The accent marks the Day Rule marker and the WhatsApp action only.
              The amber is proposed, not tested: run contrast.mjs before use. If it fails
              4.5:1 as text, it stays for non-text marks only.
Not doing   : The centred hero with a stock bun photo and "Order Now" buttons.
              Also a cart or order form (WhatsApp is the order channel), fake reviews,
              invented prices, and "baked fresh daily" filler.
```

**Page order (draft):**
1. Name set huge in Bangla and Latin, with the Day Rule directly under it.
2. Two products, sourdough and khejur gur bun, one short paragraph each.
3. How to order: a `wa.me` link with a prefilled message (for example "Assalamu alaikum, I'd like to order…"), plus the hours.
4. Find us and a footer.

**Motion and fallbacks:**
- The marker eases in once on load (transform only, under 250ms for feedback).
- With `prefers-reduced-motion`, or with JS off, the marker appears in place and the hours stay as plain text.
- The link works at all hours, and the status line tells people when a reply is likely.

**What I need from you (I won't invent these):**
- The WhatsApp number.
- The address or area in Dhaka.
- Real product names, and prices if you want them shown.
- Photos. Without them I'll build the layout around type and mark image slots clearly, not use stock.
- Bangla copy: should the page be bilingual or Bangla-first, and who writes the Bangla?
- Is Friday closed all day, and does the bakery sell out before 2pm? If it does, I can add an honest "when it's gone, it's gone" line, but only if you confirm it.

**Next to try:** once you confirm the gaps, I'll build in the stack you prefer (vanilla, Astro or Next) and run the Delivery Gate with before and after contrast numbers.