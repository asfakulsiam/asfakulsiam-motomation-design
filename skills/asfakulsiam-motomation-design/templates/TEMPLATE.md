# TEMPLATE.md: the shape of every build

> A **production template** build ships as a complete, runnable template a designer can sell, not a folder of pages. This file is its shape, and the lighter shape of the other two delivery modes. `scripts/completeness.mjs` (gate axis X, "Template" line) checks the files of the mode named in `DESIGN.md` (`**Delivery mode:**` under `Scope`; production template when the line is missing); any item that truly doesn't apply is excused in the `DESIGN.md` Scope table with "not required for this brief, reason: …". `MEDIA.md` is never excused.

## Delivery modes

Chosen from the user's request (`thinking/sequence.md` → Required output). The mode changes the deliverable, never the design bar: research for new design work, the concept, accessibility, responsiveness, reduced motion, originality and the gate apply to all three.

| Mode | Required files | Not required |
|---|---|---|
| Design exploration | `README.md`, `DESIGN.md`, `MOTION.md`, `MEDIA.md`, `CRITIQUE.md`, `GATE.md` | backend, auth, payments, `SCHEMA.md`, `DATA.md`, `data/`, `LICENSE`, `CHANGELOG.md`, `.env.example`, `middleware.ts`, zero-config run |
| Functional frontend | the above + `SCHEMA.md`, `DATA.md`, `data/` and its `schema.json` (demo-labelled; README demo line) | real backend or integrations, `LICENSE`, `CHANGELOG.md`, `middleware.ts`; `.env.example` only if the code reads env vars |
| Production template | every file below | nothing by default; excuse with a reason |

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
| `MEDIA.md` | every image, video, icon, illustration and external visual asset: source, licence / usage status, placeholder?, replace before production? (`craft/media.md`); says so when no external media is used | with the build |
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

## Media
Every asset and its licence status is in MEDIA.md. <Before launch: replace or clear these temporary or unverified assets: … | No asset needs replacing.>

## Files
DESIGN.md, MOTION.md, MEDIA.md, SCHEMA.md, DATA.md, CRITIQUE.md, GATE.md, CHANGELOG.md, LICENSE

## Licence
MIT (see LICENSE).
```

The line **"All data in data/ is demo. Replace with real data before launch."** appears in every README, word for word.

## Test

Does `node scripts/completeness.mjs <project>` show `Template: n/n present` for the delivery mode, with any excused item carrying its reason? For a production template, does `npm install && npm run dev` start with no `.env` file? If not, the build isn't finished.
