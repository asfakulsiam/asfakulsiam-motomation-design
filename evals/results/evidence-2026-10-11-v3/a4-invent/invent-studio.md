# /invent — studio brief

## Prompt

```text
/invent

Brief: Kalo Ghor, a two-person motion and title-design studio in Dhaka that makes opening titles for Bangladeshi independent films. Portfolio site. Audience: film directors and festival programmers.
```

## Model

`{"requested": "claude_sonnet_5_5", "served": "claude_sonnet_5_5", "in": 4, "out": 1967, "reasoning": 2607, "secs": 37.2}`

## Output

# /invent: Kalo Ghor

Kalo Ghor means "black room", which is both a cinema hall and a darkroom. All three concepts start from that. Each card uses one draw from seed 2402 and bends it where the draw clashed with the brief.

---

## Concept A: "The Daily"

| | |
|---|---|
| **Tension** | A festival programmer skims hundreds of submissions in a sitting, but a title sequence is a few seconds of patient, deliberate type. |
| **Concept** | The portfolio is a festival-daily broadsheet where every line is a credit, so the visitor reads it the way they read a call sheet. |
| **Type mode** | HOUSE STYLE. It's a studio portfolio, the visitor came for an impression, and the studio's craft is type. Bangla is the hero script, set large. |
| **Archetype + mutation** | The Broadsheet (masthead, columns, folios), mutated by **one size only**. I swapped "one weight only" because it contradicts the seed move below. Hierarchy comes from weight, position and column, never from size. |
| **Collision** | Receipt printer → paper feeding line by line. Columns print in as you scroll, one credit per line, ending with a torn-edge footer. |
| **Signature** | Proximity Weight on the Bangla masthead. Letters near the cursor get heavier. |
| **Build note** | Never split Bangla by code point, because that breaks conjuncts and reordered vowel signs. Segment by grapheme cluster (`Intl.Segmenter`) and test with a variable Bangla face that has a real `wght` axis. If the face is static-weight only, the move degrades to whole-word weight steps. |
| **Fingerprint** | columns · Tier 2 · type signature |

---

## Concept B: "Now Showing"

| | |
|---|---|
| **Tension** | A title sequence has to hide the film while it reveals it. It needs to be read fast, yet it earns its place by being slow. |
| **Concept** | The studio's work is listed as a cinema's now-showing board, and scrolling too fast fogs the view like a rainy window, so the visitor has to slow down to see the work. |
| **Type mode** | SERVICE STYLE. Programmers scan and compare rows (year, runtime, director, format), so tabular figures and dense legible rows are the content. The title stills carry the visual weight, since the studio's own type work is the hero image. |
| **Archetype + mutation** | The Ledger (rows and columns), mutated by **wrong room**: it takes the structure of a cinema schedule board instead of an agency work list. |
| **Collision** | Monsoon window → rain streaks distorting the view. Stills streak and blur in proportion to scroll velocity, then clear when scrolling stops. |
| **Signature** | Rain on Glass, driven by scroll velocity. It means something: fast scrolling is skimming, and slowing down is how you see the work. |
| **Rejected** | **Sticker Scatter.** It's a playful logo burst, which clashes with an audience of directors and programmers, and it has no link to the rain concept. |
| **Kinetic bend kept** | A row's hairline bends on hover, like a streak on glass. |
| **Build note** | An SVG displacement filter driven by velocity keeps this at Tier 2. Only filter the stills in view, and make the reduced-motion path a plain, clear list. |
| **Fingerprint** | rows · Tier 2 · micro signature |

---

## Concept C: "Made Last, Seen First"

| | |
|---|---|
| **Tension** | Opening titles are among the last things made on a film and the very first thing an audience sees. |
| **Concept** | The page runs backwards, starting in the end credits and scrolling sideways back in time to the first frame, so the title card is the last thing you reach. |
| **Type mode** | HOUSE STYLE. It's a manifesto with one argument set large, read like a speech. The type is the page. |
| **Archetype + mutation** | The Manifesto (one argument, set large), mutated by **inverting the axis**: vertical becomes horizontal and time runs backwards. |
| **Collision** | Typewriter → carriage return and ink strike. Headlines strike in word by word (not letter by letter), and each carriage return is a section break that snaps the view to the next line of the argument. |
| **Signature** | Thread. One line draws through the whole page like a film leader, and its end is the playhead you are following back in time. |
| **Build note** | Horizontal pinned scroll is fragile on phones, so below a width breakpoint the page falls back to a normal vertical read in the same order. Reduced motion shows every line in its final state with no strike or thread draw. Strike timing counts Bangla grapheme clusters, not characters. |
| **Fingerprint** | statement · Tier 2 · scroll signature |

---

## Diversity (measured)

```
archetypes       : 3/3 unique  ✓
signature seeds  : 3/3 unique  ✓
mutations        : 3/3 unique  ✓
collision worlds : 3/3 unique  ✓
```

Copied from the `collide.mjs` output above (seed 2402). The three type-mode picks are two HOUSE STYLE and one SERVICE STYLE, and each has its own reason. Uniqueness here holds within this run only. I haven't compared against a project memory log, because none was shown.

## Next

Pick one concept. Then:

1. Run `node scripts/search.mjs fonts "bangla editorial"` to choose faces that cover Bangla with real weights.
2. Run `node scripts/memory.mjs check` against the project log.
3. Continue with `/build --review` to get the full preview block before any code.

If I had to choose, I'd take **C** for a first impression and **B** if the directors' main job is comparing the studio's past work.
