/* Jol · Issue 07 · motion (Tier 2: GSAP core + ScrollTrigger + SplitText, Lenis)
   Section entrances and scroll choreography only. No pins, no scrubbed film, no WebGL.
   Final states live in the CSS; everything here animates FROM them, and only when motion is allowed. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reveal = function () { root.classList.add("ready"); };

  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove("motion"); return; }
  window.__jolReady = true;
  var hasSplit = !!window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(SplitText);

  var movements = Array.prototype.slice.call(document.querySelectorAll(".movement"));
  var marks = Array.prototype.slice.call(document.querySelectorAll(".draft-list a"));
  var N = movements.length;

  /* where am I: the current movement is marked on the draft scale in every mode (an instant change, not motion) */
  var current = -1;
  function setCurrent(i) {
    if (i === current) return;
    current = i;
    marks.forEach(function (m, k) { if (k === i) m.setAttribute("aria-current", "location"); else m.removeAttribute("aria-current"); });
  }
  movements.forEach(function (sec, i) {
    ScrollTrigger.create({
      trigger: sec, start: "top 55%", end: "bottom 55%",
      onEnter: function () { setCurrent(i); }, onEnterBack: function () { setCurrent(i); },
      onLeave: function () { setCurrent(i); }, onLeaveBack: function () { setCurrent(i - 1); }
    });
  });

  var mm = gsap.matchMedia();
  var start = function () { mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 1200px)" }, function (ctx) {
    var c = ctx.conditions;
    if (!c.motion) { reveal(); return; }

    /* smooth scroll on the GSAP ticker; touch keeps native scrolling */
    var lenis = new Lenis({ autoRaf: false, lerp: 0.1, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    var tick = function (t) { lenis.raf(t * 1000); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    var EXPO = "expo.out", OUT = "power3.out";
    var splits = [];
    function lines(el, opts) {
      if (!hasSplit) return null;
      var s = SplitText.create(el, Object.assign({ type: "lines", mask: "lines", linesClass: "ln" }, opts || {}));
      splits.push(s);
      return s;
    }
    /* once a split has played, put the text back as plain text so it rewraps on rotate or resize */
    function unsplit(s) { return function () { if (s && s.isSplit) s.revert(); }; }

    /* cover: the masthead waterline draws, the headline surfaces, the standfirst feeds out line by line */
    var cover = gsap.timeline({ defaults: { ease: EXPO } });
    cover.from(".masthead-rule", { scaleX: 0, duration: 0.9 }, 0);
    var h1 = lines(".headline");
    if (h1) cover.from(h1.lines, { yPercent: 105, duration: 1.1, stagger: 0.1, onComplete: unsplit(h1) }, 0.15);
    var sf = lines(".standfirst");
    if (sf) cover.from(sf.lines, { yPercent: 102, duration: 0.6, stagger: 0.12, ease: OUT, onComplete: unsplit(sf) }, 0.55);
    cover.from(".kicker, .credits, .draft", { opacity: 0, duration: 0.5, ease: OUT }, 0.9);

    /* each movement surfaces through its own waterline */
    movements.forEach(function (sec) {
      var op = sec.querySelector(".opener");
      var title = lines(op.querySelector(".title"));
      var tl = gsap.timeline({ defaults: { ease: EXPO }, scrollTrigger: { trigger: op, start: "top 85%", once: true } });
      tl.from(op.querySelector(".waterline"), { scaleX: 0, duration: 0.8 }, 0)
        .from(op.querySelector(".folio"), { opacity: 0, duration: 0.4, ease: OUT }, 0);
      if (title) tl.from(title.lines, { yPercent: 105, duration: 0.9, stagger: 0.08, onComplete: unsplit(title) }, 0.1);
    });

    /* a plate takes its space: it opens upward from its bottom edge, like something lifted out of the water */
    gsap.utils.toArray(".plate").forEach(function (fig) {
      var frame = fig.querySelector(".plate-frame"), cap = fig.querySelector("figcaption");
      gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 88%", once: true } })
        .from(frame, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.0, ease: EXPO, clearProps: "clipPath" }, 0)
        .from(cap, { opacity: 0, duration: 0.4, ease: OUT }, 0.3);
    });

    /* a pull quote lands: fed out of its rule one line at a time (receipt-printer collision) */
    gsap.utils.toArray(".pull").forEach(function (q) {
      var s = lines(q.querySelector("blockquote p"));
      var tl = gsap.timeline({ scrollTrigger: { trigger: q, start: "top 80%", once: true } });
      if (s) tl.from(s.lines, { yPercent: 100, duration: 0.7, stagger: 0.14, ease: OUT, onComplete: unsplit(s) }, 0);
      tl.from(q.querySelector("figcaption"), { opacity: 0, duration: 0.4, ease: OUT }, ">-0.1");
    });

    /* sign-off: জল surfaces from the last waterline */
    gsap.timeline({ scrollTrigger: { trigger: ".signoff-mark", start: "top 92%", once: true } })
      .from(".signoff-rule", { scaleX: 0, duration: 0.9, ease: EXPO }, 0)
      .from(".signoff-word", { yPercent: 35, opacity: 0, duration: 1.2, ease: EXPO }, 0.1);

    /* Draft Marks: the river rises from 01 Keel to 07 Launch as you read */
    var water = c.wide ? document.querySelector(".draft-water") : document.querySelector(".tidebar-water");
    var prop = c.wide ? "scaleY" : "scaleX";
    var level = gsap.quickTo(water, prop, { duration: 0.4, ease: OUT });
    movements.forEach(function (sec, i) {
      ScrollTrigger.create({
        trigger: sec, start: "top 55%", end: "bottom 55%",
        onUpdate: function (self) { level((i + self.progress) / N); },
        onLeaveBack: function () { if (i === 0) level(0); }
      });
    });

    reveal();
    var refresh = function () { ScrollTrigger.refresh(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    return function () {
      gsap.ticker.remove(tick);
      lenis.destroy();
      splits.forEach(function (s) { s.revert(); });
      gsap.set(water, { clearProps: "transform" });
    };
  }); };

  /* split lines only once the faces are in, so the breaks are the real ones (local fonts: this is quick) */
  var fontsIn = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsIn, new Promise(function (r) { setTimeout(r, 1200); })]).then(start);
})();
