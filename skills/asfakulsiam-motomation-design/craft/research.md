# Research protocol (Step 0.5, mandatory)

The skill's own components, data sets, archetypes and collision engine are one source. Used alone they make every build look like the skill made it. Step 0.5 sends the agent outside the skill before anything is designed. It is required for every build or redesign, and nothing in Step 1 onward may come from "the skill's defaults" alone: **every design decision traces to the brief or to a named reference.**

## The rule

- Look **outside the skill** first: the live award sources, then the repositories in `references/sources/`. The skill's `examples/`, `data/` and `signatures/` come after, as one more reference.
- Look **wide**: at least two of the six source files below, plus the live sources for the brief's category.
- Take **principles, never code**. Nothing is copied from any repository: no components, shaders, markup, styles or assets. Concepts only. Nothing at all from CreativeAgencyStyle (reported as malware).
- **Record it** in `DESIGN.md` before Step 1, in the format below.

## Where to look

| File | Holds | Look here when |
|---|---|---|
| `references/sources/inspiration.md` | award sites and live sources (Awwwards, FWA, CSSDA, Godly, Land-book, SiteInspire, Dribbble, Behance, Codrops, showcases, platform design systems), curated lists, interaction experiments | always: start here for the brief's category |
| `references/sources/skills.md` | other agent skills and design methods (taste, anti-slop, motion principles, spec-first) | always: to question this skill's own process |
| `references/sources/components.md` | component libraries and design systems | the brief needs UI anatomy, states or accessibility behaviour |
| `references/sources/motion.md` | animation engines and motion references | Tier 2 and up, or any signature move that moves |
| `references/sources/3d.md` | 3D, shaders, WebGL, WebGPU | Tier 4–5, or a concept that needs depth or light |
| `references/sources/foundation.md` | frameworks, tokens, colour, fonts, measurement, testing | every build that ships code |
| `references/sources/future.md` | AI in the browser | the brief has an AI, camera or on-device feature |

Live search, last 6 months, by the brief's category (a bakery searches bakeries, food and hospitality; a SaaS brief searches the product's domain, not "SaaS landing page"). Older references only for heritage briefs, labelled as older. Search queries that work: `awwwards <category> site of the day <year>`, `<category> website <year> godly`, `codrops <technique>`.

## What to look for

For each reference, one transferable decision, not its look:

- **Structure**: order of the page, where proof lands, what the scroll is for.
- **Type**: the role type plays (image, navigation, data).
- **Motion**: what moves, what triggers it, what it explains.
- **Interaction**: the one thing a visitor would describe to someone else.
- **States**: how it handles empty, loading, error and success.
- **Restraint**: what it chose not to do.

Also note what repeats across the category. The pattern on five of the first ten results is the overused one.

## Reference into principle, not a copy

1. **Name the decision.** "The menu is the hero: dishes listed as a timetable", not "big serif on beige".
2. **Say why it works there.** What problem in that brief does it solve?
3. **State it as a principle.** "Lead with the inventory, not the atmosphere." A principle has no colour, font, brand or code in it.
4. **Test it against this brief.** Same problem here? If not, drop it.
5. **Hand it to the sequence.** It feeds Step 1 (Tension), 2 (Concept), 4 (Collision) or 5 (Signature). Input, not the concept.

If the build would still be recognisable as the reference with the logo swapped, it is a copy. Go back to 3.

## Techniques

Name three specific techniques considered for this brief, each with its source: a repository from `references/sources/`, a Codrops article, a showcase entry, or a live site. "Scroll-scrubbed text split by line (GSAP SplitText, `motion.md`)", not "nice animations". Say which one is used and why the others were not. A technique is a method; the code is written for this build.

## How to record it

In `DESIGN.md` (from `templates/DESIGN.md`), before Step 1:

```markdown
## References
**Access:** web (searched YYYY-MM-DD) | no web access: working from training data (limitation: references may be out of date; nothing was checked live)

**References looked at:**
1. <name> — <what it is> — <what I took from it, as a principle>
2. <name> — <what it is> — <what I took from it>
3. <name> — <what it is> — <what I took from it>

**Techniques considered:**
- <technique> (<source>): <used | not used, why>
- <technique> (<source>): <used | not used, why>
- <technique> (<source>): <used | not used, why>

**Pattern being avoided:** <the overused pattern in this category> — <why it fails this brief>

## Decision trace
| Decision | Traces to |
|---|---|
| <archetype, palette, type, motion language, signature, layout> | <brief: "quote" | reference 1–3 | technique> |
```

At least three references, at least one from outside the brief's category, at least one from the live sources. Every row of the decision trace names the brief or a reference; "skill default" is not an allowed answer.

## No web access

If the tool cannot reach the web, say so in one line before Step 1, set `Access: no web access: working from training data` and state the limitation. Still name three references, three techniques and the pattern being avoided, from what you know, each with the year you last knew it. Don't present remembered sites as current, and don't invent URLs.

## Test

Before Step 1: does `DESIGN.md` have `References looked at` (3), `Techniques considered` (3, sources named), `Pattern being avoided` (with why), the access line, and a decision trace where nothing traces to "the skill's defaults"? If not, Step 1 doesn't start.
