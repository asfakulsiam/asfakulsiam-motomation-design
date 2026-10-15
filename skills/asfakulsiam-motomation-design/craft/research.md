# Current design research (Step 0.5)

The data files and the collision engine hold what the skill knew when it was written. What designers are building this month is not in any CSV. Before Step 1, go and look. This step is required for every build or redesign.

## Where to look

| Source | What it shows | How to search |
|---|---|---|
| [Awwwards](https://www.awwwards.com/websites/) | Site of the Day / Month, filterable by category | `awwwards <category> site of the day <year>` |
| [The FWA](https://thefwa.com/) | interaction and motion-led work | `FWA of the day <category>` |
| [CSS Design Awards](https://www.cssdesignawards.com/) | WOTD, judged on UI, UX and innovation | `cssda website of the day <category>` |
| [Godly](https://godly.website/) | curated current web design, tagged by type | browse by tag nearest the brief |
| [Land-book](https://land-book.com/) | landing pages and product sites | filter by category |
| [SiteInspire](https://www.siteinspire.com/) | editorial, institutional, cultural sites | filter by subject and style |
| X, Dribbble, Behance | what designers are posting now | search the category + "website", "landing", "motion" |
| Recent design publications | trend pieces, case studies, studio write-ups | `<category> web design <current year>` |

Window: the last 6 months. Older references are allowed only when the brief is about heritage, and they are labelled as older.

Search the brief's category, not "best websites". A bakery brief searches bakeries, food, hospitality; a SaaS brief searches the product's domain, not "SaaS landing page" alone (that returns the pattern you are about to avoid).

## What to look for

Look at each reference for one transferable decision, not its look:

- **Structure**: how the page is ordered, where the first proof lands, what the scroll is for.
- **Type**: the role type plays (headline as image, type as navigation, type as data).
- **Motion**: what moves, what triggers it, what it explains. Note the timing feel, not the library.
- **Interaction**: the one thing a visitor would describe to someone else.
- **Restraint**: what the site chose not to do.
- **Content**: how real product, people or numbers are shown.

Also note what repeats across the category. The pattern on five of the first ten results is the overused one.

## Reference into principle, not a copy

A reference is translated before it is used. Never copy a layout, a palette, a typeface pairing, copy, or an effect as built.

1. **Name the decision.** "The menu is the hero: dishes listed as a timetable" — not "big serif and a beige background".
2. **Say why it works there.** What problem in that brief does the decision solve?
3. **State it as a principle.** "Lead with the inventory, not the atmosphere." A principle has no colour, font or brand in it.
4. **Test it against this brief.** Does this brief have the same problem? If not, drop the reference.
5. **Hand it to the sequence.** The principle feeds Step 1 (Tension), Step 2 (Concept) or Step 4 (Collision). It is input, not the concept.

If the build would still be recognisable as the reference with the logo swapped, it is a copy. Go back to step 3.

## The overused pattern

Name the one pattern every site in the category uses (the centred hero with a gradient blob, the three-icon feature row, the full-bleed food photo with a script logo, the dashboard screenshot tilted in 3D). Say it in one line. It joins the Anti-Sameness Check in Step 6: if the build uses it, mutate.

## How to record it

Write it in `DESIGN.md` under `## References` (from `templates/DESIGN.md`) while doing the research, before Step 1:

```markdown
## References
- **Access:** web (searched <date>) | no web access: working from training data
- **1. <Site or reference> (<source>, <month year>, <URL>):** took <the principle, one line>
- **2. <Site or reference> (<source>, <month year>, <URL>):** took <the principle, one line>
- **3. <Site or reference> (<source>, <month year>, <URL>):** took <the principle, one line>
- **Avoiding:** <the overused pattern in this category, one line>
```

Three references, one line each, each with what was taken from it. The `Avoiding` line is required.

## No web access

If the tool cannot reach the web, say so in one line before Step 1 and set `Access: no web access: working from training data` in `DESIGN.md`. Still name three references (from what you know) and the overused pattern, and mark each reference with the year you last knew it. Don't present remembered sites as current, and don't invent URLs.

## Test

Can you name three references, what you took from each as a principle, and the pattern you are avoiding? Is it in `DESIGN.md` under `References`? If not, Step 1 doesn't start.
