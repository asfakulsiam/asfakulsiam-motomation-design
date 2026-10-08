# Tier 4 — Max (WebGL / Three.js / Shaders)

The browser becomes a real-time graphics engine. Use for true Awwwards-level experiences that require 3D, particles, or custom visual effects.

## Core tools

- Three.js (or React Three Fiber)
- Custom GLSL shaders
- Particle systems
- Post-processing when justified
- Optional: Cannon / Rapier for physics, custom render targets

## Rules

- Dispose of geometries, materials, textures, and renderers properly. Memory leaks destroy the experience.
- Target 60 fps on mid-range devices. Always provide a lower-quality fallback path.
- Prefer instancing for large numbers of similar objects.
- Keep the DOM lightweight; the canvas should be the main visual surface when WebGL is active.
- Respect prefers-reduced-motion: either disable the WebGL scene or replace it with a static image / simple CSS version.
- Progressive enhancement: the site must remain usable and meaningful if WebGL fails to initialise.

## Typical patterns

- Interactive 3D product viewers
- Scroll-linked camera moves through a 3D scene
- Particle fields that react to cursor or scroll
- Custom shader backgrounds (noise, fluid, distortion)
- Distortion effects on images or text via shaders
- Full-screen generative visuals

## Performance discipline

- Use powerPreference: "high-performance" only when needed.
- Cap pixel ratio on high-DPI displays if necessary.
- Avoid per-frame garbage collection.
- Profile with browser tools and Spector.js when shaders misbehave.

## When to use tier 5 instead

If the primary experience is a long, narrative, scroll-scrubbed sequence that feels like a video (image sequences, long camera paths, progressive storytelling), prefer the motomation approach in tier 5. Tier 4 is for real-time interactive 3D; tier 5 is for cinematic scroll direction.