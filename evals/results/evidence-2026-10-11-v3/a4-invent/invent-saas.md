# /invent — saas brief

## Prompt

```text
/invent

Brief: Tallyhouse, a SaaS dashboard for small Bangladeshi garment factories to track daily line output, defects per 100 pieces and overtime hours across 6–20 sewing lines. Users are floor supervisors on shared desktop screens and owners on phones. No marketing site; this is the product UI home screen.
```

## Model

`{"requested": "claude_sonnet_5_5", "served": "claude_sonnet_5_5", "in": 4, "out": 1858, "reasoning": 1638, "secs": 29.3}`

## Output

# /invent: Tallyhouse

**Type mode for all three: SERVICE STYLE.** Supervisors scan 6–20 lines for what's off, and owners check a verdict on a phone. The numbers are the content, so there is no hero-scale display word. Each card uses the compact scale, tabular figures, a 12px label floor and 16px body. Bangla and Latin numerals need a font check before build (`node scripts/search.mjs fonts "bengali ui tabular"`). I have named fonts only as candidates.

---

## Concept 1: "The Shift Page"

- **Tension:** Supervisors need a glance from across the floor, while owners need the same truth in one thumb-scroll.
- **Concept:** Every sewing line gets one printed page, with output as the headline and supervisor notes in the margin.
- **Archetype + mutation:** Lookbook, mutated by print marginalia. The "full-bleed spread" becomes a full-width line card, and footnotes carry overtime reasons and defect notes. The folio is the line number and the shift time.
- **Collision:** Scoreboard (sport) lends flip digits. A figure flips only when a real new count arrives, never on page load.
- **Signature:** The flip. One output figure per line flips on a real update. The `prefers-reduced-motion` path swaps the digits instantly.
- **Type:** A Bengali-capable humanist sans for text (candidates: Hind Siliguri or Noto Sans Bengali, to confirm) and tabular figures for every count. No display face is needed.
- **Rejected from the draw:** Splitting letters on idle and Ink Fill. Neither tells a supervisor anything, and a shared screen is always running.
- **Weak spot:** The Lookbook fits a dashboard least well, so the cards must stay dense.

## Concept 2: "The Exceptions Catalogue"

- **Tension:** Everything on the floor feels important, but only deviations need a person.
- **Concept:** All lines start fully visible as numbered spec sheets, then the lines on target recede so only the ones needing attention remain.
- **Archetype + mutation:** Catalogue, mutated by reversing the reveal. The page starts complete and subtracts. The trigger is the supervisor's "show exceptions" toggle, not scroll. Phones default to exceptions only.
- **Collision:** Stamp and postmark (post) lends an ink impression with a date. Closing the day stamps the sheet with the real date and shift, then locks the numbers.
- **Signature:** The day-close stamp. It is the only expressive moment, and everything else is Tier 1 feedback.
- **Type:** Compact scale, a mono or tabular face for spec rows, and a Bengali-capable sans for labels (to confirm via search).
- **Rejected from the draw:** The pixel-trail cursor. It is decoration, and owners on phones have no cursor.
- **Weak spot:** Receded lines must stay reachable by keyboard and screen reader, and "on target" must never be shown by colour alone.

## Concept 3: "The Defect Herbarium"

- **Tension:** Owners want a one-line verdict on their phones, while supervisors need to know which defect, on which line, and why.
- **Concept:** Output is the verdict, and defects are pressed specimens, each labelled by type with its count per 100 pieces.
- **Archetype + mutation:** Console, mutated to a single object. The page orbits one "Line" record. Instead of a terminal, a command-style search (`line 7`, `defects`, `overtime`) jumps between views. It is keyboard-first on shared desktops and a plain tap list on phones.
- **Collision:** Herbarium (botany) lends pressed specimens with labels, so each defect type is a pinned label with its count and the lines it appears on.
- **Signature:** The specimen label. Tapping a defect type lifts its label and highlights the affected lines.
- **Type:** Compact scale with a label style in small caps or mono, and a Bengali-capable sans for text (to confirm).
- **Rejected from the draw:** Width Sprint (width stretching with scroll speed). Reflow while reading data hurts scanning.
- **Weak spot:** The Console is the riskiest fit for phone owners, so the tap list must be the primary path there.

---

## Diversity (measured)
```
archetypes       : 3/3 unique  ✓
signature seeds  : 3/3 unique  ✓
mutations        : 3/3 unique  ✓
collision worlds : 3/3 unique  ✓
```
The three concepts are unique within this draw. `memory.mjs check` has not been run against `.motomation/log.json`, so repetition against past runs in this project is not yet checked.

## Constraints that apply whichever you pick
- **Sample data:** The `/build` code must not invent factory statistics. Use clearly labelled sample data or an empty state, with real fields only.
- **Shared screens:** Add a "floor view" size step for supervisors. It raises sizes above the floors and never lowers them.
- **Language:** Offer a Bangla and English toggle, with Bangla numerals as an option. Test conjuncts and tabular alignment in the chosen font.
- **Shared-screen motion:** Keep motion to Tier 1–2 and cap it, since the screen is on all day.

**My recommendation:** Concept 2 fits both audiences best, because exceptions-first helps the shared screen and the phone equally. Pick one and continue with `/build` (add `--review` to stop at the preview block).
