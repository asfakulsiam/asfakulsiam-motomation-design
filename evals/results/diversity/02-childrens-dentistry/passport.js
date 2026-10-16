// Tooth passport (signature, tier 3): one tooth per passport page (.pp) in a pill fixed to the bottom edge; when a page
// is half in view it is stamped (ink strike), and its tooth in the pill fills. The pill is the page's scroll progress.
// Reduced motion: the CSS turns animation off; stamping still happens, instantly, so the state still reads.
(() => {
  const pages = [...document.querySelectorAll(".pp")], pill = document.querySelector(".passport"); if (!pages.length || !pill) return;
  const svg = document.querySelector(".logo svg").outerHTML;
  const dots = pages.map((p) => { const li = document.createElement("li"); li.innerHTML = svg; li.title = p.dataset.stamp; pill.append(li); return li; });
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { const i = pages.indexOf(e.target); e.target.classList.add("stamped"); dots[i].classList.add("on"); io.unobserve(e.target); } }, { threshold: .5 });
  pages.forEach((p) => io.observe(p));
})();
