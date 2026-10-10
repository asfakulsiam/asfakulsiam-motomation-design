# Tier 4: Max (WebGL, Shaders, WebGPU)

Use Tier 4 **only** when the concept is spatial, material or lit: light through glass, liquid, a real 3D object, image distortion that means something. Never as a background because it looks cool.

## Choose the engine

| Need | Use |
|---|---|
| Full 3D scenes, models, lights | Three.js (`three`), React Three Fiber in React projects |
| 2D shader effects on images or planes, small bundle | OGL or a raw WebGL2 fragment shader |
| Modern pipeline, compute effects | `three/webgpu` (`WebGPURenderer` falls back to WebGL2) with TSL node materials |

## Scroll-linked shader plane (pattern)

```js
// uniforms driven by scroll; one canvas fixed behind the content
const uniforms = { uTime: { value: 0 }, uProgress: { value: 0 }, uTexture: { value: texture } };
ScrollTrigger.create({ trigger: ".chapter", start: "top top", end: "bottom bottom",
  onUpdate: (self) => { uniforms.uProgress.value = self.progress; } });
```

```glsl
// fragment: a reveal that ripples in along the progress
uniform sampler2D uTexture; uniform float uProgress; varying vec2 vUv;
void main() {
  float edge = smoothstep(uProgress - 0.1, uProgress + 0.1, vUv.y + sin(vUv.x * 12.0) * 0.02);
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = vec4(color.rgb, color.a * (1.0 - edge));
}
```

## Performance budget (hard limits)

- One WebGL canvas per page. Share it across sections (DOM-synced planes) rather than creating many.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`; on mobile cap at 1.5.
- Pause rendering when the canvas is off-screen (`IntersectionObserver`) or the tab is hidden.
- Compressed textures (KTX2/Basis) or AVIF/WebP. Draco or Meshopt for models; models under 2MB.
- Target 60fps on a mid-range laptop and 30fps or better on a mid-range phone. Otherwise drop to the fallback.

## Fallbacks (required)

1. **No WebGL / low power:** a static image or CSS version of the same idea.
2. **Reduced motion:** render one still frame, no time-based animation, no scroll distortion.
3. **Mobile:** simpler shader, fewer particles, or the static version (see `craft/mobile-motion-matrix.md`).

```js
const canGL = (() => { try { const c = document.createElement("canvas"); return !!c.getContext("webgl2"); } catch { return false; } })();
```

## Taste rules

- The 3D must express the concept: a hotel's key turning, a ceramic glaze flowing, a product you can rotate.
- Text stays in the DOM, crisp and selectable. Don't render body text in WebGL.
- Grain, noise and chromatic shifts stay subtle. If you notice the effect before the content, it's too strong.
