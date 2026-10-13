/* Le surligneur : un trait jaune passe derriere les derniers mots des titres de page et de fin de page. */
(function () {
  "use strict";
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function wrap(el) {
    if (!el || el.querySelector(".lv-hl")) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, last = null;
    while ((n = w.nextNode())) if (n.nodeValue.trim()) last = n;
    if (!last) return;
    var t = last.nodeValue, m = t.match(/(\S+)(\s*)$/);
    if (!m) return;
    var start = m.index;
    if (m[1].replace(/[^\wÀ-ÿ]/g, "").length < 5) { var m2 = t.slice(0, start).match(/(\S+\s+)$/); if (m2) start -= m2[1].length; }
    var after = last.splitText(start); after.splitText(after.nodeValue.replace(/\s+$/, "").length);
    var s = document.createElement("span"); s.className = "lv-hl"; after.parentNode.insertBefore(s, after); s.appendChild(after);
    if (RM || !("IntersectionObserver" in window)) { s.classList.add("on"); return; }
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); setTimeout(function () { s.classList.add("on"); }, 350); } }, { threshold: .5 });
    io.observe(s);
  }
  function run() { document.querySelectorAll(".phero h1, .violet h2, .ftr h2").forEach(wrap); }
  if (document.readyState === "complete") run(); else addEventListener("load", run);
})();
