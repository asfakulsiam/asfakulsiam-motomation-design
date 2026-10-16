# TEMPLATE.md: the shape of every build

> Every build ships as a complete, runnable template a designer can sell, not a folder of pages. This file is the shape. `scripts/completeness.mjs` (gate axis X, "Template" line) checks it; any item that truly doesn't apply is excused in the `DESIGN.md` Scope table with "not required for this brief, reason: …".

## Zero configuration

The template runs with **zero configuration** after:

```bash
npm install && npm run dev
```

- Mock data is committed in `data/`. No database, API key, CMS or external service is needed to run it.
- Every environment variable has a placeholder in `.env.example`, and the code runs when it is unset (falls back to `data/`, or disables the feature with a visible notice).
- `package.json` has `dev`, `build` and `start` scripts (a static single page with no build step excuses this, with the reason).

## The files

| File | What it holds | Written |
|---|---|---|
| `README.md` | what it is, what is real, what is demo, how to run, how to deploy (skeleton below) | with the build |
| `DESIGN.md` | rationale, tokens, references, divergence, scope, decision trace (`templates/DESIGN.md`) | before the build |
| `MOTION.md` | motion spec per section (`templates/MOTION.md`) | before the build |
| `SCHEMA.md` | every entity, route, state, the API surface and handoff notes (`templates/SCHEMA.md`) | with `DESIGN.md` |
| `DATA.md` | the shape of the `data/` folder (`templates/DATA.md`) | with `SCHEMA.md` |
| `CRITIQUE.md` | the `/critique` output, pasted, never typed, in three sections: Measured, Judged, Not verified (`templates/CRITIQUE.md`) | after the gate |
| `GATE.md` | the gate output per page (`node scripts/gate.mjs …`), pasted, never typed, including the X and J lines, in three sections: Measured, Judged, Not verified (`templates/GATE.md`) | after the gate |
| `LICENSE` | MIT by default (the brief can name another) | with the build |
| `CHANGELOG.md` | starts at `## [0.1.0] - <date>` | with the build |
| `.env.example` | every environment variable the code reads, each with a placeholder and a comment | with the build |
| `data/` | mock JSON, typed by the `schema.json` in `data/`, every entry labelled demo | with `SCHEMA.md` |
| `middleware.ts` | auth gate, locale routing, redirects, rate limiting, security headers | with the build |
| source files | a comment at the top of every non-trivial file (what it does, what it reads); component headers (tier, use-when, avoid-when, reduced-motion, touch) | with the build |

## README.md skeleton

```markdown
# <Project name>

<One sentence: what this template is and who it is for.>

> All data in data/ is demo. Replace with real data before launch.

## What is real, what is demo
| Part | Status |
|---|---|
| Pages, components, motion | real, production code |
| Content in `data/` | demo (every entry has `"demo": true`) |
| <payments, email, auth, search> | <real integration behind ENV_VAR | demo stub until ENV_VAR is set> |

## Run
npm install && npm run dev   # no configuration needed; opens http://localhost:3000

## Configure
Copy `.env.example` to `.env.local` and fill in the values. Every variable is optional for local runs.

## Deploy
<host>: <the exact steps or button>. Set the variables from `.env.example`. <Anything the host needs.>

## Files
DESIGN.md, MOTION.md, SCHEMA.md, DATA.md, CRITIQUE.md, GATE.md, CHANGELOG.md, LICENSE

## Licence
MIT (see LICENSE).
```

The line **"All data in data/ is demo. Replace with real data before launch."** appears in every README, word for word.

## Test

Does `node scripts/completeness.mjs <project>` show `Template: n/n present`, with any excused item carrying its reason? Does `npm install && npm run dev` start with no `.env` file? If not, the build isn't a template yet.
