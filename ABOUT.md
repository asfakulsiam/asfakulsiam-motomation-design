# About Motomation Design

## What it is

Motomation Design is a set of instructions, data files and small scripts that a coding AI (Claude Code, Codex, Cursor and similar tools) reads before it designs a website. Without it, an AI asked for a website usually produces the same page every time: a centred headline, two buttons, three feature boxes, a purple gradient. With it, the AI is made to work out what this particular brief is about first, pick a page structure on purpose, choose fonts and colours from a curated list with a stated reason, keep animation to what the page needs, and then measure the finished page in a real browser before it hands it over. It is a working method, not a template pack: the output is written for each brief.

## Who it is for

- **People who build websites with an AI coding tool** and are tired of every result looking alike: freelancers, small studios, founders, developers without a designer.
- **Designers who use AI to produce first builds** and want those builds to start from an idea, not a layout.
- **Teams that need a quality bar they can check**, because the skill ends with a measured report (contrast, overflow on phones, text hidden under reduced motion) rather than a claim that it "looks good".

You don't need to be a designer to use it. You do need one of those AI coding tools, set up on a computer that can run small JavaScript programs (Node.js).

## The problem it solves

Most design skills for AI agents are one of two things: a list of rules ("don't use purple gradients"), or a box of parts (components to paste in). Rules alone don't produce ideas, and parts alone produce pages that look like the parts. Motomation does three things those don't:

1. **It forces a decision before any code.** A seven-step Thinking Sequence (below) has to produce a written plan: the conflict in the brief, the idea that resolves it, the page structure, one memorable interaction. The agent shows this plan before building.
2. **It adds randomness where AI has none.** A small program (`collide.mjs`) picks an unrelated source of inspiration from a list at random, such as a railway departure board or a tailor's tape. Left alone, an AI picks the most likely option every time; a random pick breaks that habit. The pick comes from a number (a "seed"), so the same number gives the same pick again if you want to repeat a result.
3. **It measures instead of trusting.** `gate.mjs` opens the page in an invisible browser at desktop and phone sizes, checks that text is dark or light enough against what is really behind it, finds text that overflows or wraps a single letter onto its own line, and finds content that disappears when the visitor has asked for reduced motion. The numbers it prints go into a stamp at the top of the code. If the browser isn't available, the stamp says "not verified" rather than inventing a score.

There is also a per-project memory (`.motomation/log.json`) so the next page in the same project avoids the structure and signature used last time.

## The philosophy in one paragraph

A good website has one idea and says it well. Type is chosen first and with a reason; on a portfolio or brand site it can be the main image, on a dashboard it leads by being clear rather than big. Motion is allowed only when it tells the visitor something, and there is always a designed version for people who turn motion off. Everything that doesn't serve the idea is removed: one signature move, not five. Accessibility, real content and performance are standards, not style, so no brief can switch them off.

## A typical session, start to finish

1. **You install it** in your project with one command (`npx skills add asfakulsiam/asfakulsiam-motomation-design`) and give your agent a brief, for example: "/build a site for a 12-room hotel in Sylhet that sells quiet."
2. **The agent reads the brief** and notes who it's for, what they need to do, the mood, and what's missing.
3. **It runs the Thinking Sequence** and shows you a short plan: tension, concept, page structure and how it's broken, the drawn collision, the signature move, the motion tier, the fonts and palette, and what it rejected. If you asked to review first (`--review`), it stops here.
4. **It writes two short files**, `DESIGN.md` (type, colour, layout) and `MOTION.md` (what moves and why), so later changes stay consistent.
5. **It builds the page**, using the skill's own component library for standard effects and designing the signature moment for your brief.
6. **It runs the gate** (`node scripts/gate.mjs index.html`), fixes what fails, and pastes the measured stamp into the code.
7. **It logs the choices** to the project memory and ends with what it chose, what it rejected, and one thing to try next.

For a small fix ("tighten the spacing on the pricing cards"), the agent uses a short route instead: no new concept, but the same accessibility, reduced-motion and restraint checks.

## What it does not do

- **It doesn't guarantee originality across the internet.** The memory only knows about your project. Two people with the same brief and seed can get similar plans.
- **It doesn't replace a designer's judgement.** It makes an AI's first build much less generic; it doesn't know your brand history, your users or your business.
- **It doesn't supply images, logos, testimonials or statistics.** It refuses to invent them. If the brief has none, the page says so or uses typography instead.
- **It doesn't add animation for its own sake.** Many briefs end up at the lowest motion tier, and that's the intended result.
- **It doesn't certify accessibility.** The gate catches common, measurable failures (contrast, overflow, hidden content, keyboard reach in the benchmark). It is not a formal accessibility audit (WCAG) and doesn't test with screen readers or other assistive tools.
- **It doesn't need a build system or a framework.** It works with a plain web page or with the common web frameworks (React, Next.js, Astro and others), but it won't set one up for you unless you ask.

Next: [the worked examples](skills/asfakulsiam-motomation-design/examples/prompts/README.md) show real prompts, real output and real gate results.
