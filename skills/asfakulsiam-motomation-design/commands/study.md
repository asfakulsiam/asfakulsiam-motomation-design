# `/study [url | screenshot]`

**What:** reads an existing page (a URL the agent opens, or a screenshot the user attaches) and writes its **design direction** into `DESIGN.md`, in five sections: type, palette, layout, motion, signature. It studies how the page makes its decisions so a new design can learn from it. It doesn't clone the page.

**When:**
- The client says "like this site".
- You inherit a page and need its system written down before `/redesign`.
- A reference needs to be checked against the anti-sameness rules before you borrow from it.

## Input

- **URL:** the agent opens it with whatever browsing or browser tool it has. `/study` itself fetches nothing and runs no script against the URL. If the agent can't open pages, ask for a screenshot.
- **Screenshot:** one or more images. Desktop and 375px views give the best read. Without a 375px view, mark the responsive part as `not observed`.
- **Optional:** `--section <name>` to study one part only (hero, nav, a pinned chapter).

## Output

A `DESIGN.md` built from `templates/DESIGN.md`, with a **Studied direction** block at the top:

```markdown
## Studied direction
- Source: <url or "screenshot, <date>">, studied <YYYY-MM-DD>
- Read by: <how: live page with computed styles | screenshot only>

### Type
Families (display / text / mono) and how you know (computed style, or "looks like" for screenshots), scale ratio, weights, tracking, case, the one typographic decision that carries the page.

### Palette
Ground, surface, ink, muted, accent as hex values (sampled, not guessed). Contrast of ink/ground and accent/ground, from `scripts/contrast.mjs` where a shell exists. Where the accent is used and where it isn't.

### Layout
Grid and margins, section rhythm, nav pattern, the closest archetype from `structures/archetypes.md`, and what breaks the grid on purpose.

### Motion
Motion tier (1–5) and the evidence for it (transitions, scroll-linked effects, pinning, WebGL), the easing and duration feel, and what happens under reduced motion (`not observed` if you couldn't test it).

### Signature
The one moment people remember, described as a concept in this skill's vocabulary (`references/effects-vocabulary.md`). Say whether it serves the page's idea or decorates it.

### What to take / what to leave
Two short lists. "Take" holds decisions, never assets. "Leave" names what would make a new design read as a copy.
```

## Rules

1. **Direction, not assets.** Don't copy logos, photographs, illustrations, copy, code or font files. Fonts are named, not downloaded. Commercial faces get an alternative from `data/fonts.csv`.
2. **Measure what you can, label what you can't.** Live page: read computed styles and sample colours. Screenshot: say "looks like" for fonts, sample hex values from the pixels, and mark motion as `not observed`.
3. **Every section is filled.** Write `not observed` when evidence is missing. Never guess silently.
4. **Study, then diverge.** A studied direction is a starting point. Before `/build`, run the Thinking Sequence's anti-sameness step against it, so the new page shares at most two of: layout family, type pairing, palette, signature.
5. **Credit the source** in the Studied direction block.
6. **No automatic fetching.** `/study` is agent-driven: the agent decides to open the page and records what it saw. No script in this skill requests the URL.
