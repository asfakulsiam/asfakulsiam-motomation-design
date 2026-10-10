# Scroll Signatures

## 1. Timecode Rail
**Idea:** a thin rail with a running timecode (`00:12:04`) shows progress through a Motomation chapter, like a video editor's playhead.
**Why it works:** tells the visitor "this is a film, and here's how long it is". Builds trust in long pinned sections.
**Build:** inside the chapter's ScrollTrigger, `onUpdate: (s) => { rail.style.transform = \`scaleX(${s.progress})\`; code.textContent = toTimecode(s.progress * seconds); }` with `font-variant-numeric: tabular-nums`.
**The detail that matters:** use tabular numbers so the digits don't wobble, and hide the rail when the chapter is unpinned.
**Off-switch:** hidden (no chapter to track).
**Prompt:** "Add a fixed 1px progress rail and a mono tabular timecode (mm:ss:ff) bound to the pinned chapter's ScrollTrigger progress, mapped to a 24-second 'film'. Show it only while the chapter is pinned."

## 2. Aperture
**Idea:** the next section opens out of the current one through an iris or shape (a circle, a door, a letter-shaped mask).
**Why it works:** transitions become meaningful: a lens for a photographer, a doorway for a hotel, a key letter for a brand.
**Build:** `gsap.fromTo(".next", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "none", scrollTrigger: { trigger: ".next", start: "top bottom", end: "top top", scrub: true } })`.
**The detail that matters:** set the clip origin to where the eye already is (the signature element or the cursor's last position), not always the centre.
**Off-switch:** a normal section boundary.
**Prompt:** "Reveal the next section through a circular clip-path that grows from 0% to 75% as it scrolls from entering to the top of the viewport, origin at the centre of the previous section's focal element. Reduced motion: no clip."

## 3. Velocity Skew Marquee
**Idea:** an endless line of type that speeds up and leans with your scroll speed, then relaxes.
**Why it works:** gives a page physical momentum. Good for client lists, services and event line-ups.
**Build:** a looping `xPercent` tween (`repeat: -1, ease: "none"`) whose `timeScale` follows `ScrollTrigger` velocity, plus `skewX` clamped to ±8°.
**The detail that matters:** duplicate the content once for a seamless loop, and pause the loop when it's off-screen.
**Off-switch:** a static line (or a wrapped list) with no loop.
**Prompt:** "Build an infinite horizontal marquee of the client names (content duplicated for a seamless loop). Map scroll velocity to timeScale (1–4) and skewX (clamped ±8°), easing back over 0.4s. Pause off-screen. Reduced motion: static list."

## 4. Darkroom Develop
**Idea:** photographs develop from blank paper into the image as they enter the view, like prints in a developer tray.
**Why it works:** perfect for photographers, heritage brands and anything about memory or slowness.
**Build:** scrub a CSS filter and an overlay: `filter: contrast(0.2) brightness(1.6) sepia(0.4)` → `none`, plus a paper-coloured overlay from opacity 1 → 0, over `start: "top 85%"` to `end: "center 60%"`.
**The detail that matters:** the image must reach its final state **before** its centre passes the middle of the viewport, so people see the finished photo while looking at it.
**Off-switch:** images shown normally.
**Prompt:** "As each photo scrolls from top 85% to its centre at 60% of the viewport, scrub it from a washed-out state (contrast 0.2, brightness 1.6, sepia 0.4, with a paper overlay at full opacity) to normal. Reduced motion: no effect."

## 5. Stacked Deck
**Idea:** pinned cards stack on top of each other as you scroll, each slightly smaller and darker behind the new one.
**Why it works:** shows a sequence (process steps, case studies, rooms) without a long page.
**Build:** each card `position: sticky; top: calc(10vh + i * 2rem)`, and the previous card scrubs `scale: 1 → 0.92` and `filter: brightness(0.7)` as the next one arrives.
**The detail that matters:** keep the stack to 3–6 cards, and leave the card titles visible in the stack so it doubles as a table of contents.
**Off-switch:** cards in a normal vertical list.
**Prompt:** "Make the case-study cards sticky with a stacked top offset (10vh + 2rem per card). As each new card arrives, scrub the previous one to scale 0.92 and brightness 0.7, keeping its title visible. Max 6 cards. Reduced motion: normal list."

## 6. Horizontal Reel
**Idea:** vertical scroll drives a horizontal strip of work, like pulling film through a projector.
**Why it works:** the strongest "film" metaphor for portfolios and galleries.
**Build:** pin the section, then `gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: "none", scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => "+=" + (track.scrollWidth - innerWidth), invalidateOnRefresh: true } })`.
**The detail that matters:** use `containerAnimation` for any animations inside the strip, and make the strip keyboard-scrollable with focusable items.
**Off-switch:** a native horizontal scroller (`overflow-x: auto; scroll-snap-type: x mandatory`) or a vertical grid.
**Prompt:** "Pin the work section and translate the horizontal track by its overflow width as the page scrolls (scrub 1, invalidateOnRefresh). Animate items inside with containerAnimation. Reduced motion and touch: native horizontal scroll with snap."

## 7. Thread
**Idea:** one continuous line draws itself through the whole page, linking sections like a thread or a route.
**Why it works:** gives a story continuity: a journey, a process, a timeline.
**Build:** an absolutely positioned SVG path the height of the page; scrub `DrawSVGPlugin` `drawSVG: "0%" → "100%"` across the full page scroll.
**The detail that matters:** route the line *around* text, never through it, and let it pause (hold) at each section's key element.
**Off-switch:** fully drawn line, static.
**Prompt:** "Draw a single SVG path that winds down the page between sections, avoiding text, and scrub its stroke from 0% to 100% with DrawSVGPlugin over the full page scroll. Reduced motion: show it fully drawn."
