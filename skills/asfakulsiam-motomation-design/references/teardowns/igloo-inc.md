# Teardown: Igloo Inc (abeto with Bureaux)

**Award:** Awwwards Site of the Year 2024 and Developer Site of the Year 2024 ([Awwwards announcement](https://www.linkedin.com/posts/awwwards_we-are-thrilled-to-announce-that-the-winners-activity-7307431367728861187-ED07); [Awwwards case study](https://www.awwwards.com/igloo-inc-case-study.html)).
**Relevant to:** `categories/portfolio.md` · `styles/glassmorphism.md` · archetype `gallery-wall`

## Structure
A three-section landing page for a parent company: an outdoor opening scene, its portfolio companies each frozen inside a block of ice, and a links section where particles form a different model for each external link ([case study](https://www.awwwards.com/igloo-inc-case-study.html)).

## Type
The interface itself is drawn in WebGL so that glitches and text scrambles are cheap; type behaves like the material around it.

## Motion beats
1. An intro gives the outdoor scene a "tech" turn.
2. Scrolling moves between ice blocks; each project's block has its own form.
3. Transitions use chromatic aberration on selected materials.
4. In the links section, particles swirl into shapes, change colour with speed and glow; music and sound effects follow the particles.

## What made it memorable
The name is the concept: an igloo company shows its companies in ice. Every visual decision follows from that one word.

## Principles to take
- **Take the concept from the name.** Before choosing a style, ask what the brand's name already is (`thinking/`, collision method in `invention/mad-artist.md`).
- **One material, many objects.** Ice for every project gives variety inside one system.
- **Sound follows motion, never leads it.** If you add audio, tie it to something the visitor caused, and keep it off until asked.
- **Performance is part of the brief.** The team designed for smooth scrolling on low-end devices from the start.

## What not to take
UI text rendered only in WebGL. In this skill, text stays in the DOM and passes the gate's contrast and forced-colors checks.
