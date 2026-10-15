/* Render-blocking (in <head>): must run before the first frame so the
   pagereveal listener is registered and the direction is set in time. */
(function () {
  var root = document.documentElement;
  var STEPS = ['intro', 'features', 'pricing', 'start'];

  function stepOf(url) {
    try {
      var m = new URL(url, location.href).pathname.match(/\/(features|pricing|start)(\/|\/index\.html|\.html)?$/);
      return m ? STEPS.indexOf(m[1]) : 0;
    } catch (e) { return -1; }
  }
  var here = stepOf(location.href);

  if (/Android/i.test(navigator.userAgent)) root.classList.add('is-android');
  root.classList.add('js');
  // Billing choice from Pricing (monthly | yearly), applied before first paint so nothing jumps.
  try { root.dataset.billing = sessionStorage.getItem('tally-billing') || 'monthly'; } catch (e) { root.dataset.billing = 'monthly'; }

  // Shared with tour.js: resolves when the incoming transition is done (or immediately).
  var resolveReady;
  window.__tourReady = new Promise(function (r) { resolveReady = r; });
  window.__tourArrived = false; // true when we came from another tour page

  function setDir(fromUrl) {
    var from = fromUrl ? stepOf(fromUrl) : -1;
    root.dataset.dir = from > here ? 'back' : 'forward';
    return from;
  }

  // Old page: tag the outgoing snapshot with the same direction.
  window.addEventListener('pageswap', function (e) {
    if (!e.viewTransition || !e.activation || !e.activation.entry) return;
    var to = stepOf(e.activation.entry.url);
    root.dataset.dir = to < here ? 'back' : 'forward';
    if (e.viewTransition.types) e.viewTransition.types.add(root.dataset.dir);
  });

  // New page: decide direction before the first rendered frame.
  window.addEventListener('pagereveal', function (e) {
    var act = window.navigation && navigation.activation;
    var fromUrl = act && act.from ? act.from.url : (document.referrer || '');
    var sameSite = fromUrl && fromUrl.indexOf(location.origin) === 0;
    var from = sameSite ? setDir(fromUrl) : -1;
    window.__tourArrived = from >= 0 && from !== here;
    if (e.viewTransition) {
      if (e.viewTransition.types) e.viewTransition.types.add(root.dataset.dir || 'forward');
      e.viewTransition.finished.finally(function () { resolveReady(true); });
    } else {
      resolveReady(false);
    }
  });

  // Browsers without pagereveal: ready on DOM load, direction from referrer.
  if (!('onpagereveal' in window)) {
    var ref = document.referrer;
    if (ref && ref.indexOf(location.origin) === 0) {
      var f = setDir(ref);
      window.__tourArrived = f >= 0 && f !== here;
    }
    document.addEventListener('DOMContentLoaded', function () { resolveReady(false); });
  }
})();
