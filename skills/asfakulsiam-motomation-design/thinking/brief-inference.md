# Step 0: Read the Room (Brief Inference)

Before any design decision, turn the request into a brief. Most requests are one line. Infer the rest. Don't interrogate the user.

## Extract these eight things

| # | Question | If missing, infer from |
|---|---|---|
| 1 | **Who is it for?** One real person, not "users" | Category, product, wording |
| 2 | **What must they do or feel?** One primary job | The verb in the request ("sell", "book", "hire me") |
| 3 | **What is true and specific?** Real names, places, materials, numbers | Any detail the user gave; never invent numbers |
| 4 | **What is the mood?** Quiet, Editorial or Play | Category defaults in `categories/` |
| 5 | **What is the stack?** | Files in the repo; default Next.js App Router + Tailwind |
| 6 | **What tier can it afford?** | Audience devices, content weight, timeline |
| 7 | **What must not happen?** | Brand rules, accessibility needs, legal limits |
| 8 | **What would the lazy version look like?** | The AI-default list in `gates/delivery-gate.md` |

## Gaps

Mark anything that would change the design but can't be inferred:

```
[NEEDS CLARIFICATION: real product photos available? → affects hero archetype]
```

- **One or two gaps:** make a sensible assumption, state it in the preview block, and continue.
- **Three or more gaps that change the archetype:** ask **once**, in a single short message with options. Then build.

## Read the existing project

If there is code already:
1. Look for `.motomation/log.json` and any `/* motomation · ... */` stamps. These are previous decisions you must not repeat.
2. Look for `DESIGN.md` and `MOTION.md`. If they exist, they win over your defaults.
3. Note installed packages (`gsap`, `lenis`, `three`, `motion`, `@rive-app/*`, `lottie-web`) and use what is already there.
4. Note the font loading method, the CSS approach (Tailwind, CSS Modules, vanilla) and the router.

## The brief's own words win

If the user wrote "brutalist", "soft", "like a magazine" or named a reference site, that overrides the house defaults. The house style is the starting point, not a cage.
