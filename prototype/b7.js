/* B7 : scenes de la page Acquisition. Une annonce suivie du brief au client, puis le plan qui s'assemble. */
(function () {
  "use strict";
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function hh() { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-h")) || 72; }
  function prog(el) { var r = el.getBoundingClientRect(), h = hh(), span = r.height - (innerHeight - h); return Math.min(1, Math.max(0, (h - r.top) / Math.max(1, span))); }

  var ad = $("#lv-ad"), plan = $("#lv-plan");
  if (!ad && !plan) return;

  var stage = ad && $(".lv-stage", ad), panes = ad ? $$(".lv-obj > div", ad) : [], steps = ad ? $$(".lv-steps li", ad) : [], cur = -1;
  function setAd(s) {
    if (s === cur) return; cur = s; stage.setAttribute("data-s", s);
    panes.forEach(function (d, i) { d.classList.toggle("lv-on", i === s); });
    steps.forEach(function (li, i) { li.classList.toggle("lv-on", i <= s); li.classList.toggle("lv-cur", i === s); });
  }

  var blks = plan ? $$(".blk", plan) : [], stamp = plan && $(".stamp", plan);
  var SC = [[-260, -120, -9], [180, -200, 7], [320, 60, -6], [-340, 140, 8], [240, 220, -11], [-60, 260, 5]];
  function ez(t) { return 1 - Math.pow(1 - t, 3); }
  function setPlan(p) {
    var m = innerWidth < 900 ? .45 : 1;
    blks.forEach(function (b, i) {
      var t = RM ? 1 : ez(Math.min(1, Math.max(0, (p * 1.5 - i * .1) / .55))), k = 1 - t, s = SC[i % SC.length];
      b.style.transform = k > .001 ? "translate(" + (s[0] * k * m).toFixed(1) + "px," + (s[1] * k * m).toFixed(1) + "px) rotate(" + (s[2] * k).toFixed(2) + "deg)" : "";
      b.style.opacity = (.35 + .65 * t).toFixed(2);
    });
    stamp.classList.toggle("lv-on", RM || p > .8);
  }

  if (RM) { if (ad) setAd(5); if (ad) steps.forEach(function (li) { li.classList.add("lv-on"); }); if (plan) setPlan(1); return; }

  var ticking = false;
  function upd() {
    ticking = false;
    if (ad) setAd(Math.min(5, Math.floor(prog(ad) * 6.3)));
    if (plan) setPlan(prog(plan));
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
  addEventListener("scroll", req, { passive: true }); addEventListener("resize", req);
  if (window.__lenis && window.__lenis.on) window.__lenis.on("scroll", req);
  upd();
})();
