Imagery is out of scope for this benchmark. Placeholders are expected and will not be judged. Focus on structure, typography, layout, and motion.

# Rumana Akter · Photographs
Tier: 1 — Basic
Why this tier: there is no narrative to tell, only four doors to open, so micro-interactions (hover, focus, press) are the whole motion story; anything scroll-driven or cinematic would slow a page whose only job is to be tapped.

## The client
Rumana Akter is a documentary photographer in Chattogram who shoots the ship-breaking yards, the fish market at Fishery Ghat and the hill tracts. Most of her audience reaches her from one link in her Instagram and Threads profiles, on a phone, often on a slow mobile connection. She wants that one link to feel like her work: quiet, exact, nothing wasted.

## What they need
- Send each visitor to the right place in one tap: portfolio, prints, workshops or contact.
- Say who she is in one line, next to her portrait, so a stranger knows whose links these are.
- Feel considered and alive when touched (hover, focus, press), without making anyone wait.
- Load before the visitor gives up: under 1 second on 3G.

## Pages
- One page. Nothing else.

## Content
- Name: Rumana Akter.
- Bio (one line, use as written): "Documentary photographer. Ships, rivers and the people who work them, from Chattogram."
- Portrait: one photograph, supplied by the client later as `portrait.jpg` (4:5, about 1200 × 1500). The site must hold its place with correct aspect ratio and alt text ("Rumana Akter, portrait") and still look finished before the file arrives.
- Four links, in this order:
  1. Portfolio → https://rumana-akter.example.com/work
  2. Prints → https://rumana-akter.example.com/prints ("Signed prints, editions of 20")
  3. Workshops → https://rumana-akter.example.com/workshops ("Street photography, Chattogram, monthly")
  4. Contact → mailto:hello@rumana-akter.example.com
- Handle shown once, small: @rumana.akter

## Constraints
- Loads in under 1 second on 3G (Lighthouse "Slow 3G" or equivalent): keep the page and everything it needs to first paint very small; no web font that blocks text, no JavaScript needed to show or use the links.
- Motion is CSS only: hover, focus and click/press feedback. It must respect `prefers-reduced-motion`.
- Fully usable by keyboard and screen reader; visible focus on every link; every link at least 44 × 44 px on touch.
- Works at 320–430 px wide first (it is opened from a phone), and still looks intended at 1440 px.
- English only.
- Stack: not specified by the client. Chosen at Step 0.

## Success
- A visitor on a phone with a weak signal sees her name, her line and four clearly different links almost instantly, and taps the right one without thinking.
- Touching a link feels crafted (a press, a shift, a reveal), and nothing moves on its own.
- It reads as hers, not as a generic link-in-bio service page.
