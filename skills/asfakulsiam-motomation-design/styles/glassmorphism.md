# Style: Glass

**Essence:** translucent layers over a rich background, depth through blur and light.
**Use when:** the concept is about layers, light or transparency (a weather app, a lens, a translucent product, an OS-like interface).
**Avoid when:** you only want it because it looks "modern". Glass without a reason is the most common AI tell.

- **Type:** a clean grotesk with good small-size legibility. Text sits on solid enough tint to keep contrast.
- **Colour:** a real image or a meaningful gradient behind the glass; glass tint 8–20% with `backdrop-filter: blur(16–28px) saturate(140%)`.
- **Layout:** few panels, clear depth order, a 1px inner highlight border.
- **Motion:** Tier 2–3. Panels move in parallax relative to the background; light sweeps across on hover.
- **Signature ideas:** a lens (Cursor Signatures #2) that sharpens the blurred layer, a glass panel that follows the scroll like a viewfinder.
- **Pitfall:** contrast failure on busy backgrounds. Test every text-on-glass pair at the worst point of the background.
