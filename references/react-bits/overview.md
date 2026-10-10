# React Bits — Integration Reference

**Source:** [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) (≈49k stars)  
**Official site:** https://reactbits.dev

React Bits is the largest open-source library of animated React/Next.js components (200+ components).  
It is an excellent **inspiration and reference library** for creative text animations, backgrounds, micro-interactions, and UI effects.

---

## How this skill uses React Bits

We do **not** copy components blindly.  
We use React Bits as a high-quality idea bank while obeying our core rules:

1. **Restraint Gate** still applies — every effect must serve hierarchy, feedback, or storytelling.
2. **Originality** is mandatory — adapt ideas, do not paste generic versions.
3. Prefer the lightest effective technique.
4. Always provide reduced-motion fallbacks.
5. Keep essential content in semantic HTML.

---

## Main Categories in React Bits

### 1. Text Animations
Examples of ideas available:
- Split text / character / word reveals
- BlurText, GradientText, ShinyText
- Typewriter / scramble / glitch text
- Scroll-triggered text reveals
- Staggered line and word animations

**When to use in our skill:**  
Strong candidate for Hero statements, section titles, and manifesto text — especially in Quiet and Editorial moods. Use with restraint.

### 2. Backgrounds
- Animated gradients
- Particle fields
- Noise / grain overlays
- Geometric and generative patterns
- Mesh / aurora / spotlight effects

**When to use:**  
Excellent reference for living backgrounds (especially Quiet atmospheric and Play kinetic). Prefer WebGL/canvas versions only when they add real value (Tier 4–5).

### 3. Micro Interactions
- Button hover effects
- Magnetic buttons
- Cursor followers
- Hover reveals
- Click feedback

**When to use:**  
Tier 1 material. Keep them purposeful and consistent with the overall motion language.

### 4. UI Components & Effects
- Cards with reveal effects
- Image unmasks and parallax
- Marquees
- Floating elements
- Scroll progress indicators

**When to use:**  
Good inspiration for Work section previews, process steps, and decorative accents — always subordinated to content.

### 5. Creative / Experimental
- 3D-ish card tilts
- Liquid / morph effects
- Complex hover states
- Interactive canvases

**When to use:**  
Only when the Signature Move or art direction genuinely requires it. Apply the Restraint Gate strictly.

---

## Recommended Usage Pattern for Agents

When the user asks for creative text, background, or micro-interaction ideas:

1. Check whether a React Bits style effect would serve the story.
2. Prefer adapting the *idea* rather than copying the exact implementation.
3. Match the effect to the current mood:
   - **Quiet** → soft, elegant, slow, atmospheric
   - **Editorial** → precise, structured, clean
   - **Play** → more kinetic, expressive, reactive
4. Always implement a reduced-motion version.
5. Keep performance in mind (especially on mobile).

---

## Rules

- Never treat React Bits as a component dump.
- Never use a flashy effect just because it exists in the library.
- The Signature Move of a site should still be original to that project.
- When in doubt, choose the quieter, more intentional solution.

---

## Related files in this skill
- `motion/tier-1-basic.md` → micro-interactions
- `motion/tier-5-motomation.md` → scroll-driven storytelling
- `principles/restraint.md`
- `anti-patterns/common-mistakes.md`