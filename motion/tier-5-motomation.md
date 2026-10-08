# Tier 5 — Motomation (Scroll-Scrubbed Cinematic Experience)

The signature capability of this skill. The entire page becomes a high-end video that the user directs with the scroll wheel or touch. It should feel like watching a carefully directed After Effects sequence, except the user controls the timeline.

## Core techniques

- Scroll-scrubbed image sequences (canvas or WebGL texture updates)
- Pinned sections with long scrub timelines
- ScrollTrigger or equivalent controlling progress of complex timelines
- Optional: WebGL scenes whose camera, materials, or morph targets are driven by scroll progress
- Careful orchestration of multiple layers (background, mid-ground, foreground, UI)

## Philosophy

- The scroll is the playhead.
- Every frame should advance the story, emotion, or product understanding.
- Silence and stillness are as important as motion. Not every pixel needs to move all the time.
- The experience must still work (and look intentional) under prefers-reduced-motion — usually by jumping to key static frames or a simplified narrative.

## Implementation principles

1. **Progress is king**  
   Map scroll progress (0 → 1) to animation progress. Use scrub so the user can scrub forward and backward.

2. **Pin with purpose**  
   Pin a section only while the cinematic sequence needs the full viewport. Release the pin when the sequence ends.

3. **Asset strategy**  
   - Image sequences: highly compressed, progressive loading, or video frames extracted and served as images.
   - Prefer WebP / AVIF where possible.
   - For 3D: prefer morph targets, camera paths, and material changes over heavy geometry animation.
   - Preload critical frames; lazy-load the rest.

4. **Layering**  
   Keep UI (navigation, captions, CTAs) in the DOM above the canvas/WebGL layer so text remains sharp and selectable.

5. **Performance**  
   - Cap frame updates.
   - Use requestAnimationFrame responsibly.
   - Provide a low-power mode or static fallback on low-end devices.
   - Always test on mobile; touch scroll must feel responsive.

## Typical narrative structures

- Product reveal: object rotates / transforms as the user scrolls, details appear at key progress points.
- Story chapters: each pinned section tells one part of a larger narrative.
- Spatial journey: camera flies through a space; content appears at specific locations.
- Emotional arc: visual intensity, color, and motion density change across the scroll journey.

## Restraint still applies

Even at tier 5, every sequence must earn its place. Spectacle without narrative or emotional purpose fails the restraint gate. The best motomation experiences feel inevitable, not overloaded.

## Reduced-motion fallback

Provide a complete alternative experience: static key frames, short autoplay video (with controls), or a traditional long-scroll page that still communicates the same story. Never leave reduced-motion users with a broken or empty page.

## Signature test

If the user can put down the mouse and the page still feels like a finished film, the motomation is working. If it feels like a collection of effects, go back to the thinking sequence and strengthen the concept.