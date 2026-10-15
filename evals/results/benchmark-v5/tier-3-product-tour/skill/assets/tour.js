// Tally tour · focus after each page change, and the one Lottie per page.
// The page-change motion itself is CSS (cross-document View Transitions in tour.css);
// the direction (forward / back) is set before the first frame by the small inline script in each page's <head>.
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var KEY = "tally-tour-arrive";

  // ── Focus: the new page's heading, after every in-tour page change ──
  function focusHeading() {
    var h = document.querySelector("h1");
    if (h) h.focus({ preventScroll: true });
  }
  var STEP = { "": 0, "index.html": 0, "features.html": 1, "pricing.html": 2, "start.html": 3 };
  function stepOf(u) {
    try { var p = new URL(u, location.href).pathname.split("/").pop(); return p in STEP ? STEP[p] : null; } catch (e) { return null; }
  }
  var arrived = doc.hasAttribute("data-arrived");
  var act = window.navigation && window.navigation.activation;
  if (!arrived && act && act.from && act.entry && act.navigationType !== "reload") {
    var f = stepOf(act.from.url), t = stepOf(act.entry.url);
    arrived = f !== null && t !== null && f !== t;
  }
  if (!arrived && !("navigation" in window)) {
    // browsers without the Navigation API: a flag set when a tour link was followed
    try { arrived = sessionStorage.getItem(KEY) === "1"; sessionStorage.removeItem(KEY); } catch (e) {}
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-tour]");
      if (a) { try { sessionStorage.setItem(KEY, "1"); } catch (err) {} }
    });
  }
  if (arrived) focusHeading();
  // restored from the back/forward cache: the heading again, and the animation at rest
  window.addEventListener("pageshow", function (e) { if (e.persisted) focusHeading(); });

  // ── Lottie: load after first paint, play once, rest on the final frame ──
  var win = document.querySelector(".window[data-lottie]");
  if (!win) return;

  function loadPlayer() {
    return new Promise(function (resolve, reject) {
      if (window.lottie) return resolve(window.lottie);
      var s = document.createElement("script");
      s.src = win.getAttribute("data-player");
      s.async = true;
      s.onload = function () { window.lottie ? resolve(window.lottie) : reject(new Error("no player")); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function start() {
    var settled = window.__tallyReveal || Promise.resolve();
    loadPlayer().then(function (lottie) {
      var box = document.createElement("div");
      box.className = "player";
      box.setAttribute("aria-hidden", "true");
      win.insertBefore(box, win.firstChild); // under the M/S and Free/Plus tags
      var anim = lottie.loadAnimation({
        container: box, renderer: "svg", loop: false, autoplay: false,
        path: win.getAttribute("data-lottie"),
        rendererSettings: { preserveAspectRatio: "xMidYMid meet", progressiveLoad: false }
      });
      anim.addEventListener("DOMLoaded", function () {
        var last = anim.totalFrames - 1;
        if (reduce.matches) {
          anim.goToAndStop(last, true);       // reduced motion: the final frame, still
          win.classList.add("is-live");
          return;
        }
        anim.goToAndStop(0, true);
        settled.then(function () {
          win.classList.add("is-live");
          anim.play();                         // plays once (loop: false), rests on the last frame
        });
      });
      anim.addEventListener("data_failed", function () { box.remove(); }); // the poster stays
      reduce.addEventListener && reduce.addEventListener("change", function (m) {
        if (m.matches) anim.goToAndStop(anim.totalFrames - 1, true);
      });
    }).catch(function () { /* the poster (final frame) stays in place */ });
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
