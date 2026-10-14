# Step 0 (Stack): two traces

Hand traces of `thinking/sequence.md` Step 0 (v2.6.0), each rule cited by `file:line`. Written by following the
skill text against two briefs in an empty folder (no `package.json`, no `--stack` flag). They are not model
runs: they show what the text requires, so a reviewer can check an agent's first reply against it.

## Trace A: the brief names no stack

Brief: `/build a site for a ceramics studio in Dhaka that sells small batches online`

| Step | Rule | What the agent does |
|---|---|---|
| Read the brief | `thinking/sequence.md:11` | No stack named. No `--stack` flag. No project files to read. |
| Ask | `thinking/sequence.md:12-13` | Stops before Step 1 (Tension) and asks one question. |
| Gaps | `thinking/brief-inference.md` ("The stack is never a gap to assume past") | The stack is not filled by assumption, even though other one-or-two gaps would be. |

Agent's first reply (complete):

```
Before I design anything: which stack should I build this in: Next.js, Astro, React + Vite,
or plain HTML/CSS/JS? If you have no preference, say "you choose".
```

No tension, concept, archetype or code is produced until the answer arrives.
**Gate:** a silent brief produces a question. ✓

If the user then answers `you choose`, `thinking/sequence.md:14-21` applies: the agent picks from the four-row set and
writes the reason, e.g. `Stack : "you choose" → Next.js (a shop with a cart, product routes and server data) →
adapters/next.md`, and records the same three fields in `DESIGN.md` (`templates/DESIGN.md`, section `Stack`).

## Trace B: the brief says "Next.js"

Brief: `/build a Next.js landing page for a log-search developer tool`

| Step | Rule | What the agent does |
|---|---|---|
| Read the brief | `thinking/sequence.md:11` | "Next.js" is named. Use it. No question. |
| Record | `thinking/sequence.md:23` | `DESIGN.md` → `Stack: Next.js (App Router)` · `Source: named in the brief` · `Adapter: adapters/next.md` |
| Load adapter | `thinking/sequence.md:24`, `SKILL.md` router row "Framework specifics" | Loads `adapters/next.md` now, before Step 1. |
| Build | `SKILL.md` default flow step 6 | Builds in the Step 0 stack and adapter: App Router pages, client components for motion, `next/font`. |

Preview block, first line:

```
Stack       : Next.js (named in brief) → adapters/next.md
```

**Gate:** a named stack produces that stack. ✓
