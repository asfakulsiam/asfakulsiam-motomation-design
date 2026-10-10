# Adapter: Astro

- Content-first and zero-JS by default, so it's great for editorial sites and SEO.
- Put motion in a `<script>` inside the component (bundled and deduplicated), or in a framework island (`client:visible`) for React components.
- Cross-document View Transitions: `@view-transition { navigation: auto; }` in global CSS, or Astro's `<ClientRouter />`. With the client router, re-initialise GSAP on `astro:page-load` and kill triggers on `astro:before-swap`.
- Fonts with Astro's font API or `@fontsource-variable/*`.
