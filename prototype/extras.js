/* Couche de version, chargee apres site.js. Drapeaux dans version.js : marks (B1, B3), code (B2, B4), skill (B3, B4). */
(function () {
  "use strict";
  var V = window.LV || {}, root = document.documentElement, page = document.body.getAttribute("data-page") || root.getAttribute("data-page") || "";
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var x = seed || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 10000) / 10000; }; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var here = location.pathname.split("/").pop() || "index.html";

  /* ======================= B1, B3 : emplacements des visuels ======================= */
  if (V.marks) {
    var SEQ = { signal: "signal", money: "argent", knot: "noeud", angles: "angles", target: "cible", dial: "cadran", page: "page", loop: "boucle", lost: "perdu", crowd: "foule" };
    var mark = function (host, what, file, alt) {
      if (getComputedStyle(host).position === "static") host.classList.add("vm-host");
      host.appendChild(el("div", "vmark", what + " <code>" + file + "</code><small>" + (alt || "Tant qu'il manque, cette version dessinée en code s'affiche.") + "</small>"));
    };
    document.querySelectorAll("[data-scene]:not([data-mini])").forEach(function (s) {
      var n = SEQ[s.getAttribute("data-scene")]; if (!n) return;
      mark(s, "Votre vidéo :", "sources/sequences/" + n + "/" + n + ".mp4");
    });
    var ADS = ["prix", "temps", "encadrement"];
    document.querySelectorAll(".ad .ad-vis").forEach(function (v, i) { mark(v, "Votre annonce :", "sources/images/annonces/" + ADS[i % 3] + "-1.png", "Trois variantes par angle : -1, -2, -3."); });
    document.querySelectorAll(".bio .arch").forEach(function (a, i) { mark(a, "Votre photo :", "sources/images/portraits/" + (i ? "nada" : "amira") + ".jpg", "Sinon, le monogramme reste."); });
    if (/^insight-/.test(here)) { var ah = document.querySelector(".a-meta"); if (ah) { var w = el("div", "vm-host"); w.style.cssText = "height:56px;margin-top:20px"; ah.after(w); mark(w, "Votre couverture :", "sources/images/insights/" + here.replace(/^insight-|\.html$/g, "") + ".png", " "); } }
    var pill = el("div", "mk-pill", "<span>Version " + (V.v || "").toUpperCase() + " : emplacements de vos visuels</span><button type=\"button\">Masquer les repères</button>");
    document.body.appendChild(pill);
    var b = pill.querySelector("button");
    b.onclick = function () { var off = root.classList.toggle("marks-off"); b.textContent = off ? "Afficher les repères" : "Masquer les repères"; };
  }

  /* ======================= B2, B4 : visuels en code ======================= */
  function coverSVG(slug, cat) {
    var r = rng(hash(slug)), W = 640, H = 360, s = '<svg class="cover" viewBox="0 0 640 360" role="img" aria-label="Illustration de l\'article" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="360" fill="#EEEAF5"/>';
    var g = "#9C97A8", v = "#7B61FF", d = "#301781";
    if (cat === "Stratégie") {
      for (var i = 0; i < 9; i++) { var y0 = 60 + r() * 240, c1 = r() * 360, c2 = r() * 360; s += '<path d="M40 ' + y0.toFixed(0) + ' C 200 ' + c1.toFixed(0) + ', 260 ' + c2.toFixed(0) + ', 380 180" fill="none" stroke="' + g + '" stroke-width="1.4" opacity=".55"/>'; }
      s += '<path d="M380 180 L600 180" stroke="' + v + '" stroke-width="3"/><circle cx="600" cy="180" r="8" fill="' + v + '"/><circle cx="380" cy="180" r="5" fill="' + d + '"/>';
    } else if (cat === "Acquisition") {
      s += '<path d="M70 180 L600 ' + (40 + r() * 40).toFixed(0) + ' L600 ' + (280 + r() * 40).toFixed(0) + ' Z" fill="#7B61FF" opacity=".1"/>';
      for (var j = 0; j < 70; j++) { var x = 150 + r() * 460, y = 30 + r() * 300, inb = Math.abs(y - 180) < (x - 70) * .22 && r() > .5; s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (inb ? 5 : 3.5) + '" fill="' + (inb ? v : g) + '" opacity="' + (inb ? 1 : .45) + '"/>'; }
      s += '<rect x="52" y="150" width="34" height="60" rx="6" fill="#14121A"/><rect x="57" y="156" width="24" height="48" rx="3" fill="#fff"/>';
    } else if (cat === "Création") {
      var win = Math.floor(r() * 3);
      for (var k = 0; k < 3; k++) { var a = (k - 1) * (8 + r() * 6), cx = 320 + (k - 1) * 150; s += '<g transform="rotate(' + a.toFixed(1) + ' ' + cx + ' 190)"><rect x="' + (cx - 62) + '" y="70" width="124" height="200" rx="10" fill="#fff" stroke="' + (k === win ? v : "#CFC9DA") + '" stroke-width="' + (k === win ? 3 : 1.4) + '"/><rect x="' + (cx - 50) + '" y="84" width="100" height="90" rx="4" fill="' + (k === win ? "#E4DEFF" : "#F1EEF6") + '"/><rect x="' + (cx - 50) + '" y="186" width="80" height="7" rx="3" fill="#DCD6E6"/><rect x="' + (cx - 50) + '" y="200" width="56" height="7" rx="3" fill="#DCD6E6"/><rect x="' + (cx - 50) + '" y="236" width="100" height="18" rx="3" fill="' + (k === win ? v : d) + '"/></g>'; }
    } else {
      var pts = [], n = 9; for (var q = 0; q < n; q++) pts.push([70 + q * 62, 290 - Math.pow(q / (n - 1), 1.6) * (170 + r() * 40) - r() * 18]);
      pts.forEach(function (p, q) { s += '<rect x="' + (p[0] - 12) + '" y="' + p[1] + '" width="24" height="' + (310 - p[1]) + '" fill="' + (q === n - 1 ? v : "#DCD6E6") + '" opacity="' + (q === n - 1 ? 1 : .8) + '"/>'; });
      s += '<path d="M' + pts.map(function (p) { return p[0] + " " + (p[1] - 14); }).join(" L") + '" fill="none" stroke="' + d + '" stroke-width="2.5"/>';
    }
    return s + "</svg>";
  }
  if (V.code) {
    root.classList.add("code");
    /* grain papier, calcule une fois */
    try { var gc = document.createElement("canvas"); gc.width = gc.height = 180; var gx = gc.getContext("2d"), im = gx.createImageData(180, 180), gr = rng(42); for (var i = 0; i < im.data.length; i += 4) { var vv = 120 + gr() * 135; im.data[i] = im.data[i + 1] = im.data[i + 2] = vv; im.data[i + 3] = 255; } gx.putImageData(im, 0, 0); root.style.setProperty("--grain", "url(" + gc.toDataURL("image/png") + ")"); } catch (e) {}
    /* couvertures des articles */
    document.querySelectorAll("a.art[data-cat]").forEach(function (a) { var slug = (a.getAttribute("href") || "").replace(/^insight-|\.html$/g, ""); var meta = a.querySelector(".meta"); if (meta) meta.insertAdjacentHTML("afterbegin", coverSVG(slug, a.getAttribute("data-cat"))); });
    if (/^insight-/.test(here)) { var cat = (document.querySelector(".a-meta span") || {}).textContent, grid = document.querySelector(".a-grid"); if (grid) { var cw = el("div", "wrap a-cover"); cw.innerHTML = coverSVG(here.replace(/^insight-|\.html$/g, ""), cat); grid.before(cw); } }
    /* pictogrammes des annonces de l'exemple salle de sport */
    /* illustrations des trois annonces de l'exemple salle de sport, dessinees en SVG */
    var person = function (x, y, s, shirt, skin) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><circle cx="0" cy="-58" r="13" fill="' + skin + '"/><path d="M-17 -40 h34 a8 8 0 0 1 8 8 v40 h-50 v-40 a8 8 0 0 1 8 -8z" fill="' + shirt + '"/><rect x="-15" y="8" width="12" height="44" rx="5" fill="#14121A"/><rect x="3" y="8" width="12" height="44" rx="5" fill="#14121A"/></g>'; };
    var ADV = [
      /* prix : la carte d'abonnement vaut une tasse de cafe */
      '<defs><linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22105E"/><stop offset="1" stop-color="#6A4FF0"/></linearGradient><linearGradient id="fp" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#14121A" stop-opacity="0"/><stop offset="1" stop-color="#14121A" stop-opacity=".6"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#gp)"/><circle cx="300" cy="70" r="120" fill="#fff" opacity=".06"/>' +
      '<g transform="translate(70 52) rotate(-9)"><rect width="150" height="94" rx="10" fill="#F4F1FF"/><rect y="20" width="150" height="16" fill="#301781"/><rect x="14" y="52" width="58" height="8" rx="4" fill="#B4A6FF"/><rect x="14" y="66" width="38" height="8" rx="4" fill="#DCD6E6"/><circle cx="122" cy="68" r="12" fill="none" stroke="#7B61FF" stroke-width="4"/><path d="M116 68 h12 M122 62 v12" stroke="#7B61FF" stroke-width="3"/></g>' +
      '<text x="238" y="112" font-family="Instrument Serif, Georgia, serif" font-size="44" fill="#fff" opacity=".9">=</text>' +
      '<g transform="translate(285 58)"><path class="st" d="M10 0 c-8 -12 8 -16 0 -30" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/><path class="st s2" d="M26 2 c-8 -12 8 -16 0 -30" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/><path d="M-12 8 h54 v26 a27 27 0 0 1 -54 0 z" fill="#FCFBF8"/><path d="M42 16 a11 11 0 0 1 0 22" fill="none" stroke="#FCFBF8" stroke-width="6"/><ellipse cx="15" cy="64" rx="40" ry="7" fill="#EEEAF5"/><ellipse cx="15" cy="11" rx="25" ry="4" fill="#6B3F1F"/></g>' +
      '<rect width="400" height="300" fill="url(#fp)"/>',
      /* temps : 45 minutes, a deux rues du bureau */
      '<defs><linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#244A3B"/><stop offset="1" stop-color="#7FA88C"/></linearGradient><linearGradient id="ft" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#10221A" stop-opacity="0"/><stop offset="1" stop-color="#10221A" stop-opacity=".6"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#gt)"/>' +
      '<g transform="translate(40 40)"><rect width="46" height="86" fill="#E8F0EA"/><g fill="#7FA88C">' + [0, 1, 2, 3].map(function (r) { return '<rect x="8" y="' + (10 + r * 18) + '" width="10" height="10"/><rect x="28" y="' + (10 + r * 18) + '" width="10" height="10"/>'; }).join("") + '</g></g>' +
      '<path d="M86 116 C 120 140, 150 92, 190 118" stroke="#fff" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" fill="none"/>' +
      '<g transform="translate(190 82)"><rect width="66" height="44" rx="4" fill="#E8F0EA"/><rect x="10" y="16" width="46" height="8" rx="4" fill="#244A3B"/><circle cx="10" cy="20" r="8" fill="#244A3B"/><circle cx="56" cy="20" r="8" fill="#244A3B"/></g>' +
      '<g transform="translate(320 92)"><circle r="54" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="10"/><circle class="arc" r="54" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-dasharray="254 340" transform="rotate(-90)"/><rect x="-6" y="-72" width="12" height="10" rx="2" fill="#fff"/><text y="10" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="34" fill="#fff">45</text></g>' +
      '<rect width="400" height="300" fill="url(#ft)"/>',
      /* encadrement : un coach a cote de chaque seance */
      '<defs><radialGradient id="ge" cx=".62" cy=".38" r=".7"><stop offset="0" stop-color="#4A4360"/><stop offset="1" stop-color="#14121A"/></radialGradient><linearGradient id="fe" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#0B0A10" stop-opacity="0"/><stop offset="1" stop-color="#0B0A10" stop-opacity=".65"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#ge)"/><ellipse cx="250" cy="182" rx="130" ry="20" fill="#000" opacity=".25"/>' +
      person(212, 176, 1, "#5B5668", "#C8A27C") +
      '<g transform="translate(212 150)"><rect x="-30" y="-6" width="60" height="7" rx="3" fill="#B9B3C8"/><rect x="-38" y="-12" width="10" height="20" rx="3" fill="#E8E5EE"/><rect x="28" y="-12" width="10" height="20" rx="3" fill="#E8E5EE"/></g>' +
      person(292, 176, 1.12, "#7B61FF", "#8D5E3C") +
      '<g transform="translate(316 118) rotate(8)"><rect width="26" height="34" rx="3" fill="#FCFBF8"/><rect x="5" y="8" width="16" height="3" fill="#B4A6FF"/><rect x="5" y="15" width="12" height="3" fill="#DCD6E6"/><rect x="5" y="22" width="14" height="3" fill="#DCD6E6"/></g>' +
      '<g class="pop" transform="translate(330 58)"><path d="M-26 -18 h52 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-30 l-12 12 v-12 h-10 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8z" fill="#FCFBF8"/><path d="M-10 0 l7 7 l14 -14" stroke="#7B61FF" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<rect width="400" height="300" fill="url(#fe)"/>'
    ];
    document.querySelectorAll(".ad .ad-vis").forEach(function (v, i) { v.classList.add("drawn"); v.insertAdjacentHTML("afterbegin", '<svg class="advis" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + ADV[i % 3] + "</svg>"); });
    if ("IntersectionObserver" in window) document.querySelectorAll(".ad-vis.drawn").forEach(function (v) { new IntersectionObserver(function (es) { if (es[0].isIntersecting) v.classList.add("in"); }, { threshold: .4 }).observe(v); });
    /* champs de points en haut des pages sans scene */
    var FIELD = { rea: "grid", cab: "two", ins: "lines" };
    var hero = document.querySelector(".phero"), kind = FIELD[page];
    if (hero && kind && !/^insight-/.test(here)) {
      var cv = el("canvas", "pfield"); cv.setAttribute("aria-hidden", "true"); hero.prepend(cv);
      var ctx = cv.getContext("2d"), P = [], rr = rng(hash(page)), N = 150, W = 0, H = 0, vis = true;
      for (var n = 0; n < N; n++) P.push({ x: rr(), y: rr(), ph: rr() * 6.28, k: n });
      var target = function (q, w, h) {
        if (kind === "grid") { var c = q.k % 8, row = Math.floor(c / 4), col = c % 4, cx = w * (.2 + col * .2), cy = h * (.32 + row * .32), a = q.k / N * 6.28 * 3, rad = 16 + (q.k % 5) * 3; return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, q.k % 8 === 3]; }
        if (kind === "two") { var t2 = (q.k % 75) / 74, side = q.k < 75 ? -1 : 1, x = w * (.1 + t2 * .8), y = h * .5 + side * Math.pow(1 - t2, 1.6) * h * .32; return [x, y, t2 > .7]; }
        var line = q.k % 10, t3 = Math.floor(q.k / 10) / 14; return [w * (.12 + t3 * (line % 3 === 2 ? .45 : .72)), h * (.14 + line * .075), line === 0];
      };
      var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }) : null; if (io) io.observe(cv);
      var t0 = performance.now();
      var draw = function (now) {
        if (vis) {
          var d = Math.min(window.devicePixelRatio || 1, 2), r = cv.getBoundingClientRect(); if (r.width !== W || r.height !== H) { W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
          ctx.clearRect(0, 0, W, H);
          var t = (now - t0) / 1000, k = RM ? 1 : Math.min(1, t / 3.2), e = k * k * (3 - 2 * k), C = window.LV_C || { sig: "#7B61FF", ink3: "#9C97A8" };
          P.forEach(function (q) { var tg = target(q, W, H), x = q.x * W + (tg[0] - q.x * W) * e + Math.sin(t * .8 + q.ph) * 2, y = q.y * H + (tg[1] - q.y * H) * e + Math.cos(t * .7 + q.ph) * 2; ctx.globalAlpha = tg[2] ? 1 : .55; ctx.fillStyle = tg[2] && e > .6 ? C.sig : C.ink3; ctx.beginPath(); ctx.arc(x, y, tg[2] ? 3 : 2.2, 0, 6.283); ctx.fill(); });
          ctx.globalAlpha = 1;
        }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    }
  }

  /* ======================= B3, B4 : exigences du skill ======================= */
  if (!V.skill) return;
  root.classList.add("skill");
  var LIGHT = {"ink": "#1E0F52", "ink2": "#5B5770", "ink3": "#9C97B5", "line": "#E2DDF2", "brand": "#301781", "sig": "#6B4EFF", "lav": "#B4A6FF", "paper": "#FBFAFD"};
  var DARK = {"ink": "#EEEAF8", "ink2": "#B7B0D4", "ink3": "#8A83A8", "line": "#2C2452", "brand": "#B4A6FF", "sig": "#9C87FF", "lav": "#6E5BD0", "paper": "#0F0A24"};
  var thBtn, srBtn;
  function setTheme(t) {
    if (t === "dark") root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
    try { localStorage.setItem("lv-theme", t); } catch (e) {}
    var C = window.LV_C, P = t === "dark" ? DARK : LIGHT; if (C) for (var k in P) C[k] = P[k];
    if (thBtn) { thBtn.setAttribute("aria-pressed", String(t === "dark")); thBtn.setAttribute("aria-label", t === "dark" ? "Passer en mode clair" : "Passer en mode sombre"); thBtn.innerHTML = t === "dark" ? SUN : MOON; }
  }
  var MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
  var SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var nav = document.querySelector(".hdr .nav");
  if (nav) {
    var box = el("div", "ux-btns");
    srBtn = el("button", "ux-btn", '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>'); srBtn.type = "button"; srBtn.setAttribute("aria-label", "Rechercher sur le site");
    thBtn = el("button", "ux-btn"); thBtn.type = "button";
    box.appendChild(srBtn); box.appendChild(thBtn);
    var cta = nav.querySelector(".btn"); nav.insertBefore(box, cta || nav.querySelector(".menu-btn"));
    thBtn.onclick = function () { setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"); };
  }
  setTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  /* recherche dans tout le site, index construit au build (search-index.js) */
  var IDX = window.LV_INDEX || [];
  var dlg = el("dialog", "srch"); dlg.setAttribute("aria-label", "Recherche");
  dlg.innerHTML = '<div class="srch-in"><div class="srch-top"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input type="search" placeholder="Rechercher : leads, Meta Ads, diagnostic, angle…" aria-label="Rechercher sur le site"><kbd>Échap</kbd></div><div class="srch-res" role="list"></div></div>';
  document.body.appendChild(dlg);
  var inp = dlg.querySelector("input"), res = dlg.querySelector(".srch-res");
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function hl(txt, words) { var out = txt.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); words.forEach(function (w) { if (w.length < 2) return; var re = new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"); out = out.replace(re, "<mark>$1</mark>"); }); return out; }
  function search() {
    var q = norm(inp.value.trim()), words = q.split(/\s+/).filter(Boolean);
    if (!words.length) { res.innerHTML = '<p class="srch-empty">Tapez un mot : par exemple « coût par lead », « angle » ou « site ».</p>'; return; }
    var hits = IDX.map(function (p) { var hay = norm(p.t + " " + p.h + " " + p.x), sc = 0; for (var i = 0; i < words.length; i++) { if (hay.indexOf(words[i]) < 0) return null; sc += (norm(p.t).indexOf(words[i]) > -1 ? 5 : 0) + (norm(p.h).indexOf(words[i]) > -1 ? 2 : 0) + 1; } return { p: p, s: sc }; }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).slice(0, 12);
    if (!hits.length) { res.innerHTML = '<p class="srch-empty">Aucun résultat pour « ' + hl(inp.value, []) + ' ». Essayez un mot plus court, ou <a class="tlink" href="diagnostic.html">posez-nous la question directement</a>.</p>'; return; }
    res.innerHTML = hits.map(function (hh) { var p = hh.p, i = norm(p.x).indexOf(words[0]), sn = i > -1 ? (i > 40 ? "…" : "") + p.x.slice(Math.max(0, i - 40), i + 110) + "…" : p.d; return '<a role="listitem" href="' + p.u + '"><b>' + hl(p.t, words) + "</b><span>" + hl(sn, words) + "</span></a>"; }).join("");
  }
  inp.addEventListener("input", search);
  inp.addEventListener("keydown", function (e) { var l = [].slice.call(res.querySelectorAll("a")); if (!l.length) return; var c = res.querySelector("a.cur"), i = l.indexOf(c); if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); i = e.key === "ArrowDown" ? Math.min(l.length - 1, i + 1) : Math.max(0, i - 1); l.forEach(function (x) { x.classList.remove("cur"); }); l[i].classList.add("cur"); l[i].scrollIntoView({ block: "nearest" }); } if (e.key === "Enter") { e.preventDefault(); (c || l[0]).click(); } });
  function openSearch() { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); inp.value = ""; search(); inp.focus(); }
  if (srBtn) srBtn.onclick = openSearch;
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "/" && !/input|textarea|select/i.test((document.activeElement || {}).tagName || "") && !dlg.open) { e.preventDefault(); openSearch(); } });

  /* retour en haut */
  var btt = el("button", "btt", '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>'); btt.type = "button"; btt.setAttribute("aria-label", "Revenir en haut de la page");
  document.body.appendChild(btt);
  btt.onclick = function () { if (window.__lenis) window.__lenis.scrollTo(0); else scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); var f = document.querySelector(".skip"); if (f) f.focus({ preventScroll: true }); };
  addEventListener("scroll", function () { btt.classList.toggle("on", scrollY > innerHeight * 2); }, { passive: true });

  /* bandeau cookies : refus par defaut, deux boutons de meme poids, personnalisation par categorie */
  var CK = "lv-consent";
  function getC() { try { return JSON.parse(localStorage.getItem(CK)); } catch (e) { return null; } }
  function setC(m, p) { try { localStorage.setItem(CK, JSON.stringify({ mesure: m, pub: p, at: Date.now() })); } catch (e) {} (window.dataLayer = window.dataLayer || []).push({ event: "consent_update", analytics_storage: m ? "granted" : "denied", ad_storage: p ? "granted" : "denied" }); closeCk(); }
  var ck = null;
  function closeCk() { if (ck) { ck.remove(); ck = null; } document.body.classList.remove("ck-open"); }
  function openCk(detail) {
    closeCk(); var cur = getC() || { mesure: false, pub: false };
    ck = el("section", "ck"); ck.setAttribute("aria-label", "Cookies");
    ck.innerHTML = '<p>Nous mesurons l\'audience et l\'efficacité de nos publicités seulement si vous l\'acceptez. <a class="tlink" href="cookies.html">En savoir plus</a></p>' +
      (detail ? '<fieldset><legend class="small" style="margin-bottom:6px">Choisissez ce que vous acceptez</legend><label><input type="checkbox" checked disabled>Nécessaires : vos choix et la protection du formulaire. Toujours actifs.</label><label><input type="checkbox" id="ck-m"' + (cur.mesure ? " checked" : "") + '>Mesure d\'audience (Google Analytics).</label><label><input type="checkbox" id="ck-p"' + (cur.pub ? " checked" : "") + '>Publicité (Meta, Google Ads, LinkedIn).</label></fieldset><div class="ck-acts"><button type="button" id="ck-s">Enregistrer mes choix</button></div>'
        : '<div class="ck-acts"><button type="button" id="ck-r">Refuser</button><button type="button" id="ck-a">Accepter</button><button type="button" class="ck-more" id="ck-d">Personnaliser</button></div>');
    document.body.appendChild(ck); document.body.classList.add("ck-open");
    var q = function (id) { return ck.querySelector(id); };
    if (detail) q("#ck-s").onclick = function () { setC(q("#ck-m").checked, q("#ck-p").checked); };
    else { q("#ck-r").onclick = function () { setC(false, false); }; q("#ck-a").onclick = function () { setC(true, true); }; q("#ck-d").onclick = function () { openCk(true); }; }
  }
  if (!getC() && !/admin/.test(page)) setTimeout(function () { openCk(false); }, 900);
  var legal = document.querySelector(".ftr .legal span:last-child");
  if (legal) { var g = el("a", null, "Gérer les cookies"); g.href = "#"; g.onclick = function (e) { e.preventDefault(); openCk(true); }; legal.appendChild(g); }
})();
