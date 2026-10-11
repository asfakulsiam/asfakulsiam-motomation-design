# C6 short prompt

Prompt:

```text
Use the asfakulsiam-motomation-design skill. On this hotel page the small brass labels (.eyebrow and the numbers in .walks) are too light to read on the cream background. Fix just that. Here is the page:

<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Haveli 1893 — A 12-room boutique hotel in Puran Dhaka</title>
<meta name="description" content="Haveli 1893 is a 12-room boutique hotel in a restored 1890s merchant house in Shankhari Bazar, Old Dhaka. Breakfast included.">
<link rel="preconnect" href="htt…
```

Model: claude_sonnet_5_5 (raw API, SKILL.md as system prompt), usage: {"requested": "claude_sonnet_5_5", "served": "claude_sonnet_5_5", "in": 12408, "cached": 0, "out": 765, "reasoning": 1120, "secs": 15.3}

## Reply

**Route: short.** This is a contrast fix on an existing page, with no new structure, signature or concept. The Thinking Sequence isn't run, and the type, palette, layout and motion stay as they are.

**Cause.** `.eyebrow` and `.walks li span` use `--brass` (#a77b35) at 13px on `--plaster` (#efe6d6). By my hand calculation that is about **3.1:1**, and WCAG AA needs 4.5:1 for text this small. I can't run tools here, so please confirm with `node scripts/contrast.mjs "#7f5a1f" "#efe6d6"`.

**Fix.** I added one text-only token, `--brass-text`, which is the page's own brass darkened until it passes. It comes out at about **5.0:1** on plaster. `--brass` itself is unchanged, so the focus ring, the door knobs and the large `.time` numerals (120px, where 3:1 is enough) keep the original colour. The `.dark .eyebrow` colour (#d7b26d on dark green) is already light enough and is untouched.

Three edits:

```css
/* 1. in :root, add one token */
--brass-text:#7f5a1f;

/* 2. replace the existing .eyebrow rule */
.eyebrow{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass-text);font-weight:600}

/* 3. replace the existing .walks li span rule */
.walks li span{font:600 13px var(--sans);letter-spacing:.1em;color:var(--brass-text);padding-top:8px}
```

**Before and after (hand-computed):**

| Element | Before | After |
|---|---|---|
| `.eyebrow` on plaster | ~3.1:1 (fail) | ~5.0:1 (pass) |
| `.walks li span` on plaster | ~3.1:1 (fail) | ~5.0:1 (pass) |

**Not added.** I didn't change the font size or weight, add a new colour family, or touch any motion. Reduced-motion behaviour is unchanged.

The delivery gate and stamp weren't run, because I can't execute scripts here and the page had no stamp. Run `node scripts/gate.mjs` on the page before and after to confirm the numbers.