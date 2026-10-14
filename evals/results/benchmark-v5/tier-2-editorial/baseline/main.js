/* Jol · Issue 07 — motion (Tier 2: GSAP + ScrollTrigger + Lenis)
   Principles: motion marks structure, never gates reading.
   - Body paragraphs are never animated.
   - Entrances are short (≤ 0.9s), fire early (before the element reaches mid-screen), and play once.
   - No pinning. Scrubbed effects are decorative only (progress, parallax, rising water, endmark).
   - prefers-reduced-motion: no Lenis, no entrances, native scrolling; everything visible in order. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lenis = null;

  // Failsafe: if the libraries fail to load, never leave the cover hidden.
  function revealAll() { root.classList.remove('motion'); }
  if (!window.gsap || !window.ScrollTrigger) { revealAll(); setupFootnotes(); setupReadbar(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scrolling (motion only) ---------- */
  function startLenis() {
    if (lenis || !window.Lenis) return;
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);
  }
  function lenisRaf(time) { if (lenis) lenis.raf(time * 1000); }
  function stopLenis() {
    if (!lenis) return;
    gsap.ticker.remove(lenisRaf);
    lenis.destroy();
    lenis = null;
  }

  /* ---------- Word splitting (keeps text nodes readable to AT) ---------- */
  function splitWords(el) {
    if (el.dataset.split) return el.querySelectorAll('.w');
    el.dataset.split = '1';
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parts = node.nodeValue.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var span = document.createElement('span');
        span.className = 'w';
        span.textContent = part;
        frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return el.querySelectorAll('.w');
  }

  /* ---------- Motion set-up, scoped so it reverts cleanly ---------- */
  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    root.classList.add('motion');
    startLenis();

    // Cover: one short opening sequence (total ≈ 1.3s); content readable by ~0.8s.
    var headlineWords = splitWords(document.getElementById('headline'));
    gsap.set('.cover [data-cover]', { opacity: 1 });
    var cover = gsap.timeline({ defaults: { ease: 'power3.out' } });
    cover
      .from('.masthead', { y: -16, opacity: 0, duration: 0.6 })
      .from('.cover__kicker', { y: 12, opacity: 0, duration: 0.5 }, '-=0.35')
      .from(headlineWords, { yPercent: 60, opacity: 0, duration: 0.7, stagger: 0.05 }, '-=0.3')
      .from('.standfirst', { y: 16, opacity: 0, duration: 0.6 }, '-=0.45')
      .from('.credits > div', { y: 10, opacity: 0, duration: 0.45, stagger: 0.06 }, '-=0.4')
      .from('.contents', { opacity: 0, duration: 0.5 }, '-=0.3');

    var wave = document.querySelector('.waterline path');
    if (wave) {
      var len = wave.getTotalLength();
      gsap.set(wave, { strokeDasharray: len, strokeDashoffset: len });
      cover.to(wave, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.35);
      // The water keeps moving gently as the cover scrolls away.
      gsap.to('.waterline', {
        xPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.cover', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    // Headline drifts up a touch as the cover leaves (no pin).
    gsap.to('.cover__body', {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.cover', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Section openers: numeral, label + heading, then the rule draws across.
    gsap.utils.toArray('.movement').forEach(function (section) {
      var head = section.querySelector('.mv-head');
      var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: head, start: 'top 88%', once: true }
      });
      tl.from(head.querySelector('.mv-num'), { xPercent: -14, opacity: 0, duration: 0.8 })
        .from(head.querySelectorAll('.mv-label, h2'), { y: 26, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.6')
        .from(head.querySelector('.mv-rule'), { scaleX: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.55');
    });

    // Pull quotes land: mark drops in, words settle, attribution follows.
    gsap.utils.toArray('.pull').forEach(function (pull) {
      var words = splitWords(pull.querySelector('blockquote p'));
      var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: pull, start: 'top 80%', once: true }
      });
      tl.from(pull.querySelector('.pull__mark'), { y: -20, opacity: 0, duration: 0.5 })
        .from(words, { y: '0.45em', opacity: 0, duration: 0.55, stagger: 0.035 }, '-=0.25')
        .from(pull.querySelector('figcaption'), { opacity: 0, x: -10, duration: 0.45 }, '-=0.2');
    });

    // Images take their space: frame opens from a slight inset; the fill drifts (parallax).
    gsap.utils.toArray('.figure').forEach(function (fig) {
      var ph = fig.querySelector('.ph');
      var fill = fig.querySelector('.ph__fill');
      gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 88%', once: true } })
        .from(ph, { clipPath: 'inset(10% 6% 10% 6%)', duration: 0.9, ease: 'power3.out' })
        .from(fig.querySelector('figcaption'), { opacity: 0, y: 8, duration: 0.5, ease: 'power2.out' }, '-=0.45');
      gsap.fromTo(fill, { yPercent: -5 }, {
        yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // The turn of the story: in "Monsoon" the river rises into the page.
    var water = document.querySelector('.monsoon-rise__water');
    if (water) {
      gsap.fromTo(water, { scaleY: 0.08 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.monsoon-rise', start: 'top 95%', end: 'bottom 35%', scrub: 0.6 }
      });
    }

    // Endmark: the hull draws, then meets the water.
    var hull = document.querySelector('.endmark__hull');
    var line = document.querySelector('.endmark__water');
    if (hull && line) {
      [hull, line].forEach(function (p) {
        var l = p.getTotalLength();
        gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
      });
      gsap.timeline({ scrollTrigger: { trigger: '.endmark', start: 'top 92%', once: true } })
        .to(line, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' })
        .to(hull, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.4')
        .from('.endmark', { x: -18, duration: 1.1, ease: 'power2.out' }, 0);
    }

    // End matter: a quiet fade, nothing more.
    gsap.utils.toArray('.notes, .author, .next').forEach(function (el) {
      gsap.from(el, { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // Reading progress (scrubbed, decorative).
    gsap.to('.readbar__progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.feature', start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });

    return function cleanup() { stopLenis(); };
  });

  mm.add('(prefers-reduced-motion: reduce)', function () {
    revealAll();
    stopLenis();
    // Static progress without animation.
    var bar = document.querySelector('.readbar__progress');
    var st = ScrollTrigger.create({
      trigger: '.feature', start: 'top top', end: 'bottom bottom',
      onUpdate: function (self) { bar.style.transform = 'scaleX(' + self.progress.toFixed(3) + ')'; }
    });
    return function () { st.kill(); };
  });

  setupReadbar();
  setupFootnotes();

  // Fonts change line lengths; refresh trigger positions once they're in.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });

  /* ---------- Reading bar: which movement am I in? ---------- */
  function setupReadbar() {
    var bar = document.querySelector('.readbar');
    var num = bar.querySelector('.readbar__num');
    var title = bar.querySelector('.readbar__title');
    var sections = Array.prototype.slice.call(document.querySelectorAll('.movement'));
    var cover = document.querySelector('.cover');
    var footer = document.querySelector('.issue-footer');

    function update() {
      var y = window.innerHeight * 0.35;
      var coverBottom = cover.getBoundingClientRect().bottom;
      var footerTop = footer.getBoundingClientRect().top;
      bar.classList.toggle('is-visible', coverBottom < 0 && footerTop > window.innerHeight * 0.5);
      var current = null;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top < y) current = s; });
      var notes = document.querySelector('.notes');
      if (notes && notes.getBoundingClientRect().top < y) { num.textContent = '·'; title.textContent = 'Notes'; return; }
      if (current) { num.textContent = current.dataset.num; title.textContent = current.dataset.title; }
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    update();
  }

  /* ---------- Footnotes & in-page links: both directions, focus follows ---------- */
  function setupFootnotes() {
    var lastTarget = null;
    function mark(el) {
      if (lastTarget) lastTarget.classList.remove('is-target');
      el.classList.add('is-target');
      lastTarget = el;
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      var target = id === 'top' ? document.body : document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      // The thing that should receive focus: the note itself, or the marker link we came from.
      var focusEl = target;
      if (target.tagName !== 'A' && !target.hasAttribute('tabindex') && target !== document.body) target.setAttribute('tabindex', '-1');
      if (/^fn-|^fnref-/.test(id)) mark(target);

      var offset = -(document.querySelector('.readbar').offsetHeight + 32);
      if (/^fnref-/.test(id)) offset = -window.innerHeight * 0.35; // land the marker mid-screen, sentence in view

      if (focusEl.focus) focusEl.focus({ preventScroll: true });
      if (lenis) {
        lenis.scrollTo(id === 'top' ? 0 : target, { offset: offset, duration: 0.9 });
      } else {
        var top = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: top, behavior: 'auto' });
      }
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });
  }
})();
