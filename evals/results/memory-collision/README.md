# Memory records the collision source (Fix 7)

```
### Before (HEAD 12fcc2f)
$ memory.mjs log --archetype ledger --signature sanded-in --tier 2 --collision "railway departure board"
memory: unknown flag --collision
Usage: node scripts/memory.mjs <log|recent|similar|check|fingerprint> [--brief "…"] [--category c] [--motion m] [--archetype x] [--signature y] [--fonts a/b] [--palette p] [--tier n] [--page p] [--sections a,b,c] [--type-scale 1.333] [--layout family] [--threshold 0.7] [--project <dir>]
$ memory.mjs recent
$ memory.mjs check --archetype almanac --signature tide-rule --collision "railway departure board"
memory: unknown flag --collision
Usage: node scripts/memory.mjs <log|recent|similar|check|fingerprint> [--brief "…"] [--category c] [--motion m] [--archetype x] [--signature y] [--fonts a/b] [--palette p] [--tier n] [--page p] [--sections a,b,c] [--type-scale 1.333] [--layout family] [--threshold 0.7] [--project <dir>]
$ collide.mjs --n 10 --seed 3 --exclude-recent --json → collision sources
chess clock; tide chart; typewriter; railway departure board; vinyl record; herbarium; newspaper press; film leader; sewing pattern; darkroom enlarger
railway departure board drawn: true

### After
$ memory.mjs log --archetype ledger --signature sanded-in --tier 2 --collision "railway departure board"
Logged run #1 to log.json
$ memory.mjs recent
1. 2026-10-16 · project: repo · archetype: ledger · signature: sanded-in · collision: railway departure board · tier: 2 · palette family: ?
$ memory.mjs check --archetype almanac --signature tide-rule --collision "railway departure board"
IDs
✓ archetype "almanac" is fresh
✓ signature "tide-rule" is fresh
⚠ collision source "railway departure board" was drawn in 1 of the last 1 builds (run #1) → warning: draw again (collide.mjs --exclude-recent) or state in DESIGN.md why the same source fits
$ collide.mjs --n 10 --seed 3 --exclude-recent --json → collision sources
chess clock; tide chart; typewriter; tailor's measuring tape; film contact sheet; herbarium; newspaper press; film leader; sewing pattern; weather radar
railway departure board drawn: false
```
