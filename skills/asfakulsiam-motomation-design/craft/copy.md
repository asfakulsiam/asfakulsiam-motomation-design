# Copy and Microcopy

Generic copy is the fastest way to make a beautiful page feel AI-made. Words are design material.

Loaded on every build and redesign (SKILL.md). The twenty rules below come first; the older sections after them
(banned phrases, headlines, the copy pass, microcopy) go into more detail on the same ground. Rules marked **C** are
measured by `scripts/gate.mjs` (axis C); the rest are checked by reading, in `gates/delivery-gate.md` "Copy".

## The twenty rules

| ID | Rule (what) | Why | Good | Bad | Check |
|---|---|---|---|---|---|
| copy-01 | Headlines are specific | A generic line fits any company, so it sticks to none of them | "Deploys in 90 seconds, on a third of the servers" | "Take your business to the next level" | read |
| copy-02 | Write for someone in a hurry | People skim. Most words on a page are never read | Short sentences that start with a verb: "Book a room. Pay at the desk." | A sentence with three clauses and two asides before its point | read |
| copy-03 | Sell above the fold | Many visitors never scroll, so the first screen carries the offer | The first screen says what it is, who it's for and the next step | The offer first appears three screens down, after a brand film | read |
| copy-04 | No em dashes in visible copy | They have become a tell of generated text. A full stop or a comma reads cleaner | "Fast. Simple. Reliable." | "Fast — simple — reliable" | **C** |
| copy-05 | Benefit first, then the feature | The feature says what it is; the benefit says why it matters to the reader | "Ship in minutes (one command deploys it)" | "One-command deploy" | read |
| copy-06 | Break up blocks of text | A wall of text looks like work, so it gets skipped | Paragraphs of 2 to 4 lines | A 12-line paragraph on a landing page | **C** (paragraph length, advisory) |
| copy-07 | Cut padding | Every extra word thins out the ones that matter | "We build fast sites." | "We are a company that builds websites that are fast." | read |
| copy-08 | Make it scannable | Eyes jump between headings, bold words and list items | A heading, three bullets, one short paragraph | The whole section in running prose | read |
| copy-09 | No aphorism formulas | "It's not X, it's Y" is a cliché; readers spot the shape and stop reading | State the point: "Pages that load before the tap lands" | "It's not a website, it's an experience" | **C** |
| copy-10 | The body backs the headline | A headline the body doesn't support reads as a bait-and-switch | Headline "Own your data", body explains self-hosting and export | Headline "Own your data", body is about pricing tiers | read |
| copy-11 | No warm-up openers | The first line is the most-read line; spend it on the claim | Start with the claim: "Invoices that chase themselves" | "In today's fast-paced world, businesses need…" | **C** (opener list) |
| copy-12 | Remove what doesn't move the reader | Each sentence costs attention that the next one needs | Only what helps the visitor decide or act | Company history, caveats and tangents on the landing page | read |
| copy-13 | Answer objections before the CTA | Unanswered doubt stops the click at the last step | "No card needed. Cancel in one click." right above the button | Objections answered only on a separate FAQ page | read |
| copy-14 | One to three key points per section | Past three, none of them lands | Three features, one clearly first | Eight bullets with equal weight | read |
| copy-15 | No two-beat antithesis | "Not just X, but Y" is overused and reads as filler | "Design and engineering from one person" | "Not just a designer, but an engineer" | **C** |
| copy-16 | No claims you can't prove | Numbers and logos without a source cost more trust than they win when found out | "1,240 shops on the platform (dashboard, 1 Oct 2026)" | "Trusted by 10,000+ teams", no source | read (fixed list flagged by **C**) |
| copy-17 | CTAs: a clear verb and its outcome | The reader should know what happens after the click | "Start a free trial", "Book a table for tonight" | "Learn more", "Submit", "Click here" | **C** (vague-label list) |
| copy-18 | Talk to one buyer | Copy written for everyone persuades no one in particular | "For founders shipping their first product" | "For businesses of all sizes" | read |
| copy-19 | One idea per section | A section that answers two questions answers neither well | A section that answers "How much does it cost?" | A section that mixes pricing with the team's story | read |
| copy-20 | Proof sits next to the claim | Proof one page away might as well not exist | A customer quote right under the feature it vouches for | All testimonials in one carousel at the bottom | read |

A rule marked **C** fails the gate when it finds a violation in visible text (body copy, headings, buttons, `alt`,
`<title>` and the meta description). Code, `<pre>`, `<code>` and `[NEEDS COPY: …]` markers are skipped.

## Rules
1. **Specific beats impressive.** "Twelve rooms on a 200-year-old lane in Puran Dhaka", not "An oasis of luxury".
2. **Use the brief's facts.** Names, places, materials, dates, real numbers. If a fact is missing, write `[NEEDS COPY: …]`. Never invent it.
3. **Headlines say one thing.** Under 8 words for a hook. No two-part "X. Y." formula on every section.
4. **Write like a person talks.** Contractions, short sentences, active verbs.
5. **Buttons say what happens.** "Book a room", "See the work", "Start free". Not "Learn more" or "Submit".

## Banned phrases (AI tells)
"Unlock", "elevate", "seamless", "revolutionise", "empower", "cutting-edge", "next-level", "in today's fast-paced world", "we're passionate about", "crafting digital experiences", "your journey", "game-changer", "delve", "harness the power", "look no further", "take it to the next level", "transform the way you…".

## Patterns to avoid
- Three adjectives in a row ("fast, simple and powerful").
- Rhetorical questions as headlines ("Ready to grow?").
- "It's not just X, it's Y."
- Every section ending with a CTA.
- Fake specificity ("Trusted by 10,000+ teams" with no source).
- Emoji as bullet points.

## Headlines

A headline is a design element with one job: say the page's idea in words the reader would use.

1. **Name the thing.** A noun the visitor knows ("Twelve rooms", "A terminal for invoices") beats an abstraction ("Hospitality, reimagined").
2. **One claim per headline.** If it needs "and", it's two headlines, or one of them is a subhead.
3. **No inflated stakes.** Cut words that make the subject sound historic or profound ("a testament to", "redefining", "the future of", "more than ever"). If the fact is remarkable, the fact does the work.
4. **Vary the shape across sections.** If three section heads share a pattern (all questions, all "The X of Y", all two-beat fragments), rewrite two of them.
5. **Sentence case**, unless the brand's type system says otherwise. Title Case On Every Word reads as a template.
6. **Read it at 375px.** A headline that breaks into a dangling one-word last line gets rewritten, not just re-sized.

## The copy pass (run before the Delivery Gate)

Read every visible string once, top to bottom, and fix these AI tells. They are patterns of rhythm and filler, not banned words, so they slip past a phrase list.

| Tell | Looks like | Fix |
|---|---|---|
| Padding tails | a sentence ending in an "-ing" clause that adds a vague benefit ("…, ensuring a smooth stay") | Delete the tail, or make it a concrete second sentence |
| Borrowed authority | "experts agree", "studies show", "many believe" with no source | Name the source, or cut the claim |
| Hedge stacks | "may potentially help", "can often sometimes" | One verb, stated plainly |
| Dash habit | an em dash anywhere in visible copy | Use a full stop, a comma or brackets. Visible copy has no em dashes (rule copy-04 below, gate axis C) |
| Synonym cycling | the same thing called a "space", then a "venue", then a "destination" | Pick the brief's word and keep it |
| Mirror sentences | "Not just a hotel. A home." on several sections | Keep at most one on the page |
| Generic closers | every section ends with an invitation ("Discover more", "Start your journey") | One clear action per screen, and only where the visitor can act |
| Placeholder-sounding names | "Acme", "Jane Doe", "Lorem" left in labels, alt text or meta tags | Use the brief's names or a `[NEEDS COPY]` marker |

The pass is done when every row is "none found" or fixed. Record leftovers as `[NEEDS COPY: …]` for the user.

## Microcopy
- Empty states explain what to do next.
- Errors say what happened and how to fix it, in plain words, next to the field.
- Loading states say what is loading when it takes longer than 1 second.
- Confirmations are specific: "Room booked for 12–14 March", not "Success!".
