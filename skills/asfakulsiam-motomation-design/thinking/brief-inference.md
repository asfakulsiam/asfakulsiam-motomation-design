# Read the Room (Brief Inference)

Before any design decision, turn the request into a brief. Most requests are one line. Infer the rest. Don't interrogate the user.

## Extract these eight things

| # | Question | If missing, infer from |
|---|---|---|
| 1 | **Who is it for?** One real person, not "users" | Category, product, wording |
| 2 | **What must they do or feel?** One primary job | The verb in the request ("sell", "book", "hire me") |
| 3 | **What is true and specific?** Real names, places, materials, numbers | Any detail the user gave; never invent numbers |
| 4 | **How should it feel?** In the brief's own words ("calm", "loud", "like a magazine") | The brief's wording and the category's job; `styles/` as reference, never a fixed set |
| 5 | **What is the stack?** | Files in the repo (`package.json`, framework config). Not inferable otherwise: choose per Step 0 in `thinking/sequence.md` and show it in the plan. Never silent |
| 6 | **What tier can it afford?** | Audience devices, content weight, timeline |
| 7 | **What must not happen?** | Brand rules, accessibility needs, legal limits |
| 8 | **What would the lazy version look like?** | The AI-default list in `gates/delivery-gate.md` |

## Gaps

Mark anything that would change the design but can't be inferred:

```
[NEEDS CLARIFICATION: real product photos available? → affects hero archetype]
```

- **Gaps are not questions.** Each gap becomes a stated default in the plan, with its reason. The user sees them all at the one confirmation ("Proceed?", `thinking/sequence.md`) and can change any of them in their answer. Then build without asking again.
- **Only critical ambiguity earns its own question:** a payment provider, a legal region, a locale priority, or a costly lock-in the plan can't default (framework, hosting). Even then, it goes in the same single message as "Proceed?".
- **The stack is never silently assumed.** If neither the brief nor the project names it, the chosen stack and its reason are in the plan (Step 0 in `thinking/sequence.md`).

## Read the existing project

If there is code already:
1. Run `node scripts/memory.mjs similar --brief "<brief>" --category <c>` (the user-level log, every project) and look for any `/* motomation · ... */` stamps. These are previous decisions you must not repeat.
2. Look for `DESIGN.md` and `MOTION.md`. If they exist, they win over your defaults.
3. Note installed packages (`gsap`, `lenis`, `three`, `motion`, `@rive-app/*`, `lottie-web`) and use what is already there.
4. Note the font loading method, the CSS approach (Tailwind, CSS Modules, vanilla) and the router.

## The brief's own words win

If the user wrote "brutalist", "soft", "like a magazine" or named a reference site, that overrides the house defaults. The house style is the starting point, not a cage.
