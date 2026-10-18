# Worked examples

Each example is a real session: the prompt, the commands that ran, their output, screenshots and the gate's verdict. Pick by what you're about to do.

| Example | Use it when you want to… | Route | Agent | Tier | Gate result |
|---|---|---|---|---|---|
| [Flagship: one prompt, the whole skill](showcase.md) | See every step of the full route once, including an Anti-Sameness Check that fails and a stamp traced field by field | Full | Perplexity Computer (Claude Opus 5.5), by hand | 2 | PASS, stamp verified (`93085a8d44`) |
| [Tier 5 showcase: one film page, every step](showcase-tier5.md) | Follow a scroll-as-film page through storyboard, timing sheet, frames, gate (Q and A axes), stamp and verification | Full (Tier 5 pipeline) | Perplexity Computer (Claude Opus 5.5), commands run in a 2-CPU sandbox | 5 | PASS, stamp verified (`99f3f9d14b`); smoothness not verified in the sandbox |
| [Hero section](hero.md) | Build one viewport: a hero for a real craft | Full | Claude Code 2.1.286, `claude_sonnet_5_5` | 1 | PASS, stamp verified |
| [Four-page site](full-site.md) | Build a small multi-page site with one signature across pages and a memory log per site | Full | Perplexity Computer (Claude Opus 5.5), by hand | 1 | 4 pages PASS, 4 stamps verified |
| [Fix an existing page](fix-existing.md) | Fix something small on a page that exists, without redesigning it | Short | Perplexity Computer (Claude Opus 5.5), by hand | — (unchanged) | before FAIL (32 contrast), after PASS |
| [Component swap](component.md) | Drop one Motomation component into an existing React app | Short (component) | Claude Code 2.1.286, `claude_sonnet_5_5` | — | typecheck, gate and interaction test pass |

**Brief to concept only:** ten shorter examples, one per category, that stop at the concept (real collision draw, tension, rejected first idea, concept stamp): `examples/concepts/README.md`.

## Which route

- **Full route** (the Thinking Sequence: product contract, research, directions; optional exploration tools): new pages, sites, sections or redesigns. Start with the [flagship](showcase.md).
- **Short route** (name the cause, change only what it needs, gate before and after): fixes and swaps on something that exists. Start with [fix-existing](fix-existing.md). The rules are in `SKILL.md` under "When to use the short route".

## What every example records

The exact prompt · the agent and model · the skill version · the commands with their real output (long output shortened and marked `…`) · screenshots at 1440px and 375px · the Delivery Gate output · for full-route pages, the stamp and `--verify` result.

## Re-verify a published stamp

The memory log that a stamp's `S` axis was measured against is published next to each page as `log.json` (the live `.motomation/` folder is gitignored). Point the verifier at it:

```bash
node skills/asfakulsiam-motomation-design/scripts/gate.mjs --verify docs/examples/showcase/index.html --log docs/examples/showcase/log.json
# STAMP VERIFIED · critique and gate numbers match a fresh scan · gate PASS
```

Without `--log` the gate finds no log from the repo root, reads `S5[last5:no-log]` instead of `S5[last5:none]`, and rejects the stamp. That rejection is correct: the stamp was measured against a log, and the verifier refuses to guess.

If an example and the skill disagree, the skill wins and the example is out of date: open an issue.
