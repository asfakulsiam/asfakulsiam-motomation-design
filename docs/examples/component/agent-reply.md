I replaced the `confirm()` dialog with the **Hold to Commit** component. `npm run build` and `npx tsc -p .` both pass with no errors, and the gate passes.

**Gate result** (`node scripts/gate.mjs dist/index.html`):
```
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
The `?` axes only mean the project has no DESIGN.md, memory log or stamp for the gate to read. I didn't write those because you asked for a component swap, not a redesign.

**What I changed**
- I wrote `src/components/hold-to-commit.tsx` and its one import, `src/components/_lib/motion.ts`, into the project. They're copies of the skill's files. The `cp` command was blocked, so I recreated them with the Write tool from the skill's contents.
- `src/App.tsx` now renders `<HoldToCommit>` in place of the button and `window.confirm`. It has a 1.5 s hold, the label "Hold to delete workspace", and the done label "Deleting…". The "scheduled for deletion" status message is unchanged.
- I added a one-line hint under the button: "Press and hold for 1.5 seconds. Release early to cancel. Keyboard: hold Space or Enter."
- `src/styles.css` gets three small rules: the page's red border and 6px radius on the button, a light-red fill (so the dark label stays readable as it fills), and a visible focus ring. The rest of the page is untouched.

**Why Hold to Commit**
- The fill happens in the button itself, so there's no modal and no second click. You have to keep pressing for 1.5 s, and letting go early drains the fill back and cancels.
- The skill lists it for irreversible actions like delete. This action wipes every ledger, invoice and attachment for all members.
- It's a real button and Space or Enter held works like a press, so keyboard users can still delete. Touch long-press works, and under reduced motion the fill still shows progress but drains linearly.

**Rejected**
I only looked at the top five results of the skill's component search for "hold to confirm delete press", so this is not a review of all 43 components.
- **Copy Confirm**: it's a copy-to-clipboard confirmation, not a guard for a destructive action.
- **Squish Switch**: I judged it a toggle rather than a one-way action, going by its name. I didn't open the file.
- **Click Spark**, **Brand Selection** and **Remembered List**: they add feedback or decoration. None of them slows the user down before an irreversible action. I judged these by name only.
- **Tilt Card**, **Lens** and **Pressure Type**: cursor or type effects that have nothing to do with confirmation.

Two caveats:
- **Gate coverage:** the gate checks the static page. It doesn't exercise the hold interaction, so I haven't tested the hold in a browser.
- **Hold-to-commit only:** this is the only guard now. The skill's own `avoid_when` warns against making it the only way to confirm. It's still your decision, since the task asked for no modal. One thing to try next is an undo toast after "Deleting…", so a successful hold is still reversible.
