# Worked example: one component in an existing React app

The skill used as a component library, not as a page designer. A settings screen in an existing React + TypeScript project deletes a workspace behind a browser `confirm()` box. The agent was asked to swap that for a Motomation component. Everything below is copied from the session.

| | |
|---|---|
| Agent | Claude Code 2.1.286, headless, model `claude_sonnet_5_5`, medium reasoning |
| Skill | v2.3.0 (commit `f6c7627`) |
| Session | 27 turns, 3 min 14 s |
| Project | React 19.1, TypeScript 5.9, esbuild 0.25 (a small settings page, `src/App.tsx`) |
| Output | [`App.tsx` after](../../../../docs/examples/component/src/App.tsx) · [before](../../../../docs/examples/component/src/App.before.tsx) · [`styles.css`](../../../../docs/examples/component/src/styles.css) · [the agent's full reply](../../../../docs/examples/component/agent-reply.md) |

## The prompt

```text
Use the asfakulsiam-motomation-design skill. In this React project (src/App.tsx), the "Delete workspace" button uses a browser confirm() dialog. Replace that with a component from the Motomation component library that makes deleting feel deliberate without opening a modal. Copy the component (and anything it imports) from the skill into src/components/, integrate it, keep the rest of the page as it is, run `npm run build` and `npx tsc -p .`, then run the skill's scripts/gate.mjs on dist/index.html and paste the result. Say which component you picked and why, and which ones you rejected.
```

## How it chose

It searched the component index rather than browsing files:

```text
$ node scripts/search.mjs components "hold to confirm delete press"
components: top 5 for "hold to confirm delete press"

■ hold-to-commit  (score 19.83)
  name           Hold to Commit
  family         micro
  tier           2
  file           examples/components/micro/hold-to-commit.tsx
  export         HoldToCommit
  what           An important action fills while you press and hold, and only confirms when the fill completes; letting go early drains it back.
  use_when       Irreversible or weighty actions: delete, publish, donate, sign.
  avoid_when     Everyday actions; anything time-critical; as the only way to confirm (keyboard users get Enter-to-hold too).
…
```

From its reply:

> **Why Hold to Commit.** The fill happens in the button itself, so there's no modal and no second click. You have to keep pressing for 1.5 s, and letting go early drains the fill back and cancels. The skill lists it for irreversible actions like delete. … It's a real button and Space or Enter held works like a press, so keyboard users can still delete.
>
> **Rejected.** I only looked at the top five results … so this is not a review of the whole component library.
> - **Copy Confirm**: a copy-to-clipboard confirmation, not a guard for a destructive action.
> - **Squish Switch**: a toggle rather than a one-way action. I didn't open the file.
> - **Click Spark**, **Brand Selection** and **Remembered List**: they add feedback or decoration. None of them slows the user down before an irreversible action.
> - **Tilt Card**, **Lens** and **Pressure Type**: cursor or type effects that have nothing to do with confirmation.

## What changed

Two files copied from the skill: `micro/hold-to-commit.tsx` (one import path changed, `../_lib/motion` → `./_lib/motion`) and `_lib/motion.ts` (unchanged). Then `App.tsx`:

```diff
+import { HoldToCommit } from "./components/hold-to-commit";
 …
-  const onDelete = () => {
-    if (window.confirm("Are you sure you want to delete this workspace? This cannot be undone.")) setDeleted(true);
-  };
 …
-        {deleted ? <p role="status">Workspace scheduled for deletion.</p> : <button className="btn btn-danger" onClick={onDelete}>Delete workspace</button>}
+        {deleted ? <p role="status">Workspace scheduled for deletion.</p> : (
+          <>
+            <HoldToCommit label="Hold to delete workspace" doneLabel="Deleting…" holdMs={1500} onCommit={() => setDeleted(true)} className="hold-danger" />
+            <p className="hint">Press and hold for 1.5 seconds. Release early to cancel. Keyboard: hold Space or Enter.</p>
+          </>
+        )}
```

and three CSS rules so the button matches the page's red danger style. Nothing else on the page moved.

| Before | After, at rest | After, 0.7 s into a hold |
|---|---|---|
| ![Settings page with a solid red Delete workspace button](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/component/before.png?raw=true) | ![The same page; the button now reads Hold to delete workspace, with a hint line under it](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/component/after-rest.png?raw=true) | ![The button half filled with light red from the left](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/component/after-mid-hold.png?raw=true) |

## Build, types and gate

```text
$ npm run build
> build
> node build.mjs
built dist/

$ npx tsc -p .
(no output: 0 errors)

$ node scripts/gate.mjs dist/index.html
DELIVERY GATE · /home/user/workspace/runs/component/dist/index.html
  contrast  ✓ 0 below AA  (11 text elements measured against rendered pixels; 0 skipped; 0 not visible at scan time)
  overflow  ✓ 0 at 375/390/768/1440px
  words     ✓ 0 display-text problems at 375px  (4 display elements checked)
  motion    ✓ 0 text elements hidden only under reduced motion; pixels changing on a still page: 0%  (11 compared)
  names     ✓ 0 missing alt / accessible names  (3 interactive elements checked)
  hierarchy  h1×1, 0 skipped heading levels, 1 element(s) tied for largest on the first 375px screen
  structure  4 sections, entrances: static | static | static | static → 0 repeat(s); pins 0, WebGL canvases 0, JS 60KB gzipped
  records    DESIGN.md: none · memory log: none · stamp fields: {}
  critique → C?[no-record] H5[375:0] S?[no-archetype-in-stamp] R?[no-record] M?[no-tier] V5[entrance-repeats:0]   (axes marked ? have no record to derive from)
  PASS  stamp → critique: C?[no-record] H5[375:0] S?[no-archetype-in-stamp] R?[no-record] M?[no-tier] V5[entrance-repeats:0] · gate: c0 o0 w0 rm0 a0 · gate/1 · 648c7368a8
```

The `?` axes are expected. A component swap has no DESIGN.md, archetype or tier for the critique to read, and the agent said so instead of inventing them.

## Testing the hold, not just the page

The agent was honest that the gate "checks the static page. It doesn't exercise the hold interaction, so I haven't tested the hold in a browser." So we did, with [a short Playwright script](../../../../docs/examples/component/interaction-test.mjs) against the built page:

```text
pointer released at 700 ms → status: (none)
pointer held 2 s → status: Workspace scheduled for deletion.
keyboard Space held 2 s → status: Workspace scheduled for deletion.
keyboard Space released at 600 ms → status: (none)
```

Releasing early cancels. Holding past 1.5 s deletes, by pointer and by keyboard.

## The caveat the agent raised

> The skill's own `avoid_when` warns against making it the only way to confirm. It's still your decision, since the task asked for no modal. One thing to try next is an undo toast after "Deleting…", so a successful hold is still reversible.

That's the behaviour to expect. The component's header says when not to use it, and the agent passes that on rather than burying it.

## Run it yourself

```bash
npx skills add asfakulsiam/asfakulsiam-motomation-design
# or install the single component with shadcn:
npx shadcn@latest add https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main/registry/hold-to-commit.json
```
