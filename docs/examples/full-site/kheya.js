// Kheya Press · the Issue Stamp. One signature: a book you open is stamped with today's date, and the
// register remembers it. No dependencies. Reduced motion: the stamp is already there, no thump.
(() => {
  document.documentElement.classList.add("js");
  const KEY = "kheya:opened";
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } };
  const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode: no memory, page still works */ } };
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Book page: stamp the issue card with today's date, once, when the card is in view.
  const stamp = document.querySelector(".stamp[data-book]");
  if (stamp) {
    const now = new Date(), t = stamp.querySelector("time");
    t.dateTime = now.toISOString().slice(0, 10); t.textContent = fmt(now);
    const opened = read(); opened[stamp.dataset.book] = t.dateTime; write(opened);
    stamp.hidden = false;
    const card = stamp.closest(".card");
    if (reduce || !("IntersectionObserver" in window)) return;
    stamp.classList.add("pending");
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setTimeout(() => { stamp.classList.remove("pending"); stamp.classList.add("landed"); card.classList.add("landed"); }, 260);
    }, { threshold: 0.6 });
    io.observe(card);
  }

  // Register: titles you have opened keep a small stamp.
  const opened = read();
  document.querySelectorAll(".register [data-book]").forEach((li) => {
    const iso = opened[li.dataset.book]; if (!iso) return;
    const m = li.querySelector(".mark"); const d = new Date(iso + "T12:00:00");
    m.innerHTML = `<span class="mini">opened <time datetime="${iso}">${fmt(d)}</time></span>`; m.hidden = false;
  });

  // Visit: underline today's row in the hours (no live "open now" claim).
  const day = new Date().getDay();
  document.querySelectorAll(".hours [data-day]").forEach((el) => { if (el.dataset.day.split(",").map(Number).includes(day)) el.classList.add("today"); });
})();
