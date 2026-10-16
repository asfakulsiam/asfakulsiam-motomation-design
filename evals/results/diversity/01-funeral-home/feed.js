// Paper feed (signature, tier 2): each .line rises into place once, in reading order, as it enters the view, like a slip
// feeding out of a printer. Reduced motion: nothing is hidden (the CSS rule is off). No scroll hijack.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const lines = [...document.querySelectorAll(".line")]; document.documentElement.classList.add("feed");
  let queue = [], busy = false;
  const pump = () => { if (!queue.length) { busy = false; return; } busy = true; queue.shift().classList.add("fed"); setTimeout(pump, 110); };
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { io.unobserve(e.target); queue.push(e.target); } queue.sort((a, b) => lines.indexOf(a) - lines.indexOf(b)); if (!busy) pump(); }, { rootMargin: "0px 0px -8% 0px" });
  lines.forEach((l) => io.observe(l));
})();
