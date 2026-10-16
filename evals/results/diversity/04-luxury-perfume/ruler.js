// Seven-year ruler (signature, tier 3; mutation: time runs backwards). A fixed ruler counts the years the reader has
// walked back through: the numeral steps 7, 6 … 0 as each scene crosses the middle of the screen, the amber hairline
// stretches with progress, and the oil in the bottle thins from tea-dark (today) to pale (the grove). Transform and
// fill only; passive scroll listener with rAF. Reduced motion: the numeral and fill still update (state), no transitions
// (CSS), and the bottle is not sticky.
(() => {
  const scenes = [...document.querySelectorAll(".scene")], yr = document.querySelector(".ruler-year"), fill = document.querySelector(".ruler-fill"), liq = document.querySelector(".liquid");
  if (!scenes.length || !yr) { document.querySelector(".ruler")?.remove(); return; }
  const shades = ["#d9b274", "#d3a45f", "#cc964d", "#c9893b", "#b67830", "#a06726", "#87531d", "#6c4115"];
  let tick = false, cur = -1;
  const draw = () => { tick = false; const mid = innerHeight / 2; let y = +scenes[0].dataset.year;
    for (const s of scenes) if (s.getBoundingClientRect().top < mid) y = +s.dataset.year;
    const first = scenes[0].getBoundingClientRect().top, last = scenes[scenes.length - 1].getBoundingClientRect().bottom;
    document.documentElement.classList.toggle("in-stage", first < mid && last > mid);
    const p = Math.max(0, Math.min(1, (mid - first) / (last - first))); fill.style.transform = "scaleY(" + p.toFixed(3) + ")";
    if (y !== cur) { cur = y; yr.textContent = String(y); if (liq) { liq.style.fill = shades[y]; liq.style.transform = "scaleY(" + (0.55 + y * 0.065).toFixed(3) + ")"; } } };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(draw); } }, { passive: true }); draw();
})();
