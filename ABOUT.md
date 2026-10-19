# About Motomation Design

## What it is

Motomation Design is a set of instructions, data files and small scripts that a coding AI (Claude Code, Codex, Cursor and similar tools) reads before it designs a website. Without it, an AI asked for a website usually produces the same page every time: a centred headline, two buttons, three feature boxes, a purple gradient. With it, the AI is made to work out what this particular brief is about first, pick a page structure on purpose, choose fonts and colours from a curated list with a stated reason, keep animation to what the page needs, and then measure the finished page in a real browser before it hands it over. It is a working method, not a template pack: the output is written for each brief.

## Who it is for

- **People who build websites with an AI coding tool** and are tired of every result looking alike: freelancers, small studios, founders, developers without a designer.
- **Designers who use AI to produce first builds** and want those builds to start from an idea, not a layout.
- **Teams that need a quality bar they can check**, because the skill ends with a measured report (contrast, overflow on phones, text hidden under reduced motion) rather than a claim that it "looks good".

You don't need to be a designer to use it. You do need one of those AI coding tools, set up on a computer that can run small JavaScript programs (Node.js).

## The problem it solves

Most design skills for AI agents are one of two things: a list of rules ("don't use purple gradients"), or a box of parts (components to paste in). Rules alone don't produce ideas, and parts alone produce pages that look like the parts. Motomation does four things those don't:

1. **It settles the product before the look.** Before any art direction, the agent writes a product contract: who the site is for, the jobs they come to do, the journeys as sequences of routes, the information architecture, the states each page needs (empty, loading, error, success), and what is deliberately excluded. You approve it at a checkpoint. A later visual idea can change how the product is presented; it cannot remove a journey or a required page (`principles/authority.md`).
2. **It researches before it designs.** The agent looks at real sites of the exact type and at design references chosen for what they can prove, and records each finding as observed, inferred or unverified, with links. Without web access it says so instead of inventing references.
3. **It explores directions on purpose.** It sketches two or three different directions, compares them against the contract, and chooses or merges one. Archetypes, the random collision draw (`collide.mjs`), mutations, signature moves, category recipes and styles are optional tools for getting away from the most likely answer; each is used, adapted or rejected with a reason. A build with no signature move is a valid result.
4. **It measures instead of trusting.** `gate.mjs` opens the site in a real (headless) browser at desktop and phone sizes and checks contrast against what is really behind the text, overflow, content hidden under reduced motion, accessibility names, whether every scoped route and journey is reachable and whether forms behave (completeness and journey checks). `handoff.mjs` then computes the handoff status from what actually ran: VALIDATED, CONDITIONAL (with the unverified items listed) or NOT VALIDATED. If the browser isn't available, the result is "not verified", never a pass.

There is also a memory of earlier builds (`memory.mjs`), so a new site doesn't silently repeat the archetype, structure, palette or motion tier of earlier ones unless the brief justifies it.

## The philosophy in one paragraph

The product comes first, then evidence, then taste. Requirements, accessibility and the product contract outrank every aesthetic opinion; the skill's own house style (strong type, restraint, one accent, motion with weight) is a set of heuristics with stated reasons and stated exceptions (`principles/heuristics.md`), not a style every site must wear. Motion is chosen for a purpose (feedback, hierarchy, storytelling), at the lowest tier that delivers it, and always with a designed reduced-motion version. Accessibility, real content and honest claims are standards, not style, so no brief can switch them off.

## A typical session, start to finish

1. **You install it** in your project with one command (`npx skills add asfakulsiam/asfakulsiam-motomation-design`) and give your agent a brief, for example: "/build a site for a 12-room hotel in Sylhet that sells quiet."
2. **Checkpoint 1, stack.** The agent uses your project's existing stack, or proposes one with its reasons, trade-offs and alternatives (`craft/stack.md`).
3. **Checkpoint 2, product contract and scope.** Jobs, journeys, routes, states and exclusions, with a Scope table of what is required, optional or deferred.
4. **Checkpoint 3, research and direction.** The research record, two or three directions compared against the contract, the chosen concept, fonts, palette, motion tier, and what it decided not to do.
5. **Checkpoint 4, page plan.** Sections, components and motion per route, and the mobile layouts.
6. **Checkpoint 5, build and preview.** It builds the site (reusing the component library where it fits), writes `DESIGN.md`, `MOTION.md` and `MEDIA.md`, and shows a preview with screenshots of each core journey for your review.
7. **Checkpoint 6, gate and handoff.** It runs the full gate on the approved design, fixes what fails, and reports the handoff status computed from the gate record, with anything not verified listed by name.

Each checkpoint waits for you unless the brief already answers it. For a small fix ("tighten the spacing on the pricing cards"), the agent uses a light route instead: no new direction, but the same accessibility, reduced-motion and gate checks.

## What it does not do

- **It doesn't guarantee originality or award-level quality.** The memory only knows about earlier builds on your machine, and a passing gate means the measured checks passed, not that the design is good; that still needs human judgement. Two people with the same brief and seed can get similar plans.
- **It doesn't replace a designer's judgement.** It makes an AI's first build much less generic; it doesn't know your brand history, your users or your business.
- **It doesn't supply images, logos, testimonials or statistics.** It refuses to invent them. If the brief has none, the page says so or uses typography instead.
- **It doesn't add animation for its own sake.** Many briefs end up at the lowest motion tier, and that's the intended result.
- **It doesn't certify accessibility.** The gate catches common, measurable failures (contrast, overflow, hidden content, accessibility names, focus and target checks). It is not a formal accessibility audit (WCAG) and doesn't test with screen readers or other assistive tools.
- **It doesn't need a build system or a framework.** It works with a plain web page or with the common web frameworks (Next.js, Astro, React + Vite and others); in an existing project it uses the stack that is already there.

Next: [the worked examples](skills/asfakulsiam-motomation-design/examples/prompts/README.md) show real prompts, real output and real gate results.
