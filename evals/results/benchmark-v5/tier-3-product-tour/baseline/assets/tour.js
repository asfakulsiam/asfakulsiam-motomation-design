/* Tally tour — page behaviour (deferred). */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ready = window.__tourReady || Promise.resolve(false);

  /* ---------- focus: move to the new page's heading after each transition ---------- */
  ready.then(function () {
    if (!window.__tourArrived) return;          // first visit / shared link: leave focus alone
    var h = document.getElementById('tour-title');
    if (h) h.focus({ preventScroll: true });
  });

  /* ---------- keyboard: ← / → walk the tour ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t.closest && t.closest('input, textarea, select, [role="group"], [contenteditable]')) return;
    var link = e.key === 'ArrowRight' ? document.querySelector('a.nav-next:not([aria-hidden])')
             : e.key === 'ArrowLeft' ? document.querySelector('a.nav-back:not([aria-hidden])') : null;
    if (link) { e.preventDefault(); link.click(); }
  });

  /* ---------- Lottie slots ----------
     Each .anim has data-src (Lottie JSON). Until it loads the static poster
     (the final frame) is shown; if it never loads the poster stays. Reduced
     motion: jump straight to the final frame. */
  var players = {};
  function mount(slot) {
    if (!window.lottie) return;
    var holder = slot.querySelector('.anim-player');
    var anim = window.lottie.loadAnimation({
      container: holder, renderer: 'svg', loop: false, autoplay: false,
      path: slot.dataset.src,
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false }
    });
    players[slot.dataset.name] = anim;
    anim.addEventListener('DOMLoaded', function () {
      var last = anim.totalFrames - 1;
      var mode = slot.dataset.mode; // "toggle" = driven by the billing control
      if (mode === 'toggle') {
        var yearly = slot.dataset.state === 'yearly';
        anim.goToAndStop(yearly ? last : 0, true);
        slot.classList.add('is-live');
        return;
      }
      if (reduce.matches) {
        anim.goToAndStop(last, true);
        slot.classList.add('is-live');
        return;
      }
      ready.then(function () {
        anim.goToAndStop(0, true);
        slot.classList.add('is-live');
        anim.play();
      });
    });
    anim.addEventListener('data_failed', function () { slot.classList.remove('is-live'); });
  }
  function boot() { document.querySelectorAll('.anim[data-src]').forEach(mount); }
  if (window.lottie) boot(); else window.addEventListener('load', boot);

  /* ---------- Pricing: billing toggle ---------- */
  var KEY = 'tally-billing';
  function getBilling() { try { return sessionStorage.getItem(KEY) || 'monthly'; } catch (e) { return 'monthly'; } }
  function setBilling(v) { try { sessionStorage.setItem(KEY, v); } catch (e) {} }

  var group = document.querySelector('.billing');
  if (group) {
    var slot = document.querySelector('.anim[data-name="toggle"]');
    var apply = function (v, animate) {
      group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.value === v)); });
      document.documentElement.dataset.billing = v;
      document.querySelectorAll('.toggle-labels [data-for]').forEach(function (el) { el.dataset.on = String(el.dataset.for === v); });
      if (slot) slot.dataset.state = v;
      var a = players.toggle;
      if (a && a.isLoaded) {
        var last = a.totalFrames - 1;
        if (!animate || reduce.matches) a.goToAndStop(v === 'yearly' ? last : 0, true);
        else a.playSegments(v === 'yearly' ? [0, last] : [last, 0], true);
      }
      setBilling(v);
    };
    group.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) apply(b.value, true);
    });
    group.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var v = e.key === 'ArrowRight' ? 'yearly' : 'monthly';
      apply(v, true);
      group.querySelector('button[value="' + v + '"]').focus();
    });
    apply(getBilling(), false);
  }

})();
