// Impact (signature, tier 4). Each .hit heading lands with a two-frame slam the first time it enters the view, and the
// room behind it flashes red once. Flash safety: at most one flash per 400 ms (under 3 per second), each 220 ms,
// never repeated for the same heading. Tier 4 drift: the giant word slides with scroll (transform only, rAF, passive).
// Reduced motion: nothing is armed, no flash, no drift.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("armed");
  const flash = document.querySelector(".flash"); let last = 0;
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("landed"); io.unobserve(e.target);
    const now = performance.now(); if (flash && now - last > 400 && e.target.tagName === "H2") { last = now; flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on"); } } }, { threshold: .35 });
  document.querySelectorAll(".hit").forEach((h) => io.observe(h));
  const g = document.querySelector(".door .giant"); if (!g) return; let tick = false;
  addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; const y = Math.min(scrollY, innerHeight); g.style.transform = "translateX(" + (-y * 0.18).toFixed(1) + "px)"; }); }, { passive: true });
})();
