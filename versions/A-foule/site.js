/* Leadvice prototype : en-tete, pied de page, fil de signal, scenes animees, effets au defilement. */
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var page = document.body.getAttribute("data-page") || document.documentElement.getAttribute("data-page") || "";
  var C = { ink: "#14121A", ink2: "#5B5668", ink3: "#9C97A8", line: "#DCD6E6", brand: "#301781", sig: "#7B61FF", lav: "#B4A6FF", paper: "#F6F4EF" };

  /* ---------- en-tete, menu, pied de page ---------- */
  var NAV = [["expertises.html", "Expertises", "exp"], ["realisations.html", "Réalisations", "rea"], ["cabinet.html", "Le cabinet", "cab"], ["insights.html", "Insights", "ins"]];
  var navLinks = NAV.map(function (n) {
    var cur = page.indexOf(n[2]) === 0 ? ' aria-current="page"' : "";
    return '<a class="nl" href="' + n[0] + '"' + cur + ">" + n[1] + "</a>";
  }).join("");
  var hdr = document.createElement("header");
  hdr.className = "hdr";
  hdr.innerHTML = '<div class="hdr-in"><a class="logo" href="index.html" aria-label="Leadvice, accueil"><i>L</i>LEADVICE</a><nav class="nav" aria-label="Navigation principale">' + navLinks +
    '<a class="btn btn-main" href="diagnostic.html">Demander un diagnostic</a><button class="menu-btn" type="button" aria-expanded="false" aria-controls="mnav">Menu</button></nav></div><div class="progress" aria-hidden="true"></div>';
  document.body.insertBefore(hdr, document.body.firstChild);
  var skip = document.createElement("a");
  skip.className = "skip"; skip.href = "#main"; skip.textContent = "Aller au contenu";
  document.body.insertBefore(skip, document.body.firstChild);

  var mnav = document.createElement("div");
  mnav.className = "mnav"; mnav.id = "mnav"; mnav.hidden = true;
  mnav.setAttribute("role", "dialog"); mnav.setAttribute("aria-label", "Menu");
  mnav.innerHTML = '<button class="menu-btn mnav-close" type="button" style="display:block">Fermer</button><a href="index.html">Accueil</a>' +
    NAV.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + "</a>"; }).join("") + '<a class="btn btn-main" href="diagnostic.html">Demander un diagnostic</a>';
  document.body.appendChild(mnav);
  var mb = hdr.querySelector(".menu-btn");
  mb.addEventListener("click", function () { mnav.hidden = false; mb.setAttribute("aria-expanded", "true"); mnav.querySelector("a").focus(); });
  mnav.querySelector(".mnav-close").addEventListener("click", function () { mnav.hidden = true; mb.setAttribute("aria-expanded", "false"); mb.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mnav.hidden) { mnav.querySelector(".mnav-close").click(); } });

  var ftr = document.createElement("footer");
  ftr.className = "ftr";
  ftr.innerHTML = '<canvas aria-hidden="true"></canvas><div class="ftr-in"><h2>Le bon client est déjà quelque part. Allons le chercher.</h2>' +
    '<div style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;margin-top:40px"><a class="btn btn-light" href="diagnostic.html">Demander un diagnostic</a><span style="color:#9B8EC4;font-size:.9rem">20 minutes, offert. Réponse sous un jour ouvré.</span></div>' +
    '<div class="cols"><div><span>Le cabinet</span><a href="expertises.html">Expertises</a><a href="realisations.html">Réalisations</a><a href="cabinet.html">Le cabinet</a><a href="insights.html">Insights</a></div>' +
    '<div><span>Expertises</span><a href="strategie.html">Stratégie</a><a href="creation.html">Création</a><a href="acquisition.html">Acquisition</a><a href="pilotage.html">Pilotage</a></div>' +
    '<div><span>Parlons-en</span><a href="diagnostic.html">Demander un diagnostic</a><span style="color:#EDEAF4;user-select:all">contact@leadvice.org</span><a href="https://www.instagram.com/theleadvice/">Instagram</a></div>' +
    '<div><span>Informations</span><a href="cabinet.html">Mentions légales</a><a href="cabinet.html">Confidentialité</a><a href="cabinet.html">Cookies</a></div></div>' +
    '<div class="legal"><span style="max-width:84ch">Leadvice SARL au capital de 100 000 DH. RC 527921, ICE 002978060000045, IF 51669892. Hay Laayoune, angle rue Ait Yaflmane, Fida n° 341, 2ᵉ étage, Casablanca. © 2026 Leadvice SARL.</span><span style="display:flex;gap:24px"><a href="admin.html">Disponibilités (démo admin)</a><a href="index.html#top">Revoir l\'ouverture</a></span></div></div>';
  document.body.appendChild(ftr);

  var fab = document.createElement("a");
  fab.className = "fab"; fab.href = "diagnostic.html"; fab.setAttribute("aria-label", "Nous écrire");
  fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
  if (page !== "diag") document.body.appendChild(fab);

  var bkS = document.createElement("script"); bkS.src = "booking.js"; document.body.appendChild(bkS);

  /* ---------- outils ---------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ss(a, b, v) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rnd(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
  function fitCanvas(cv) {
    var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    var ctx = cv.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0);
    return { ctx: ctx, w: r.width, h: r.height };
  }
  function glow(ctx, on) { ctx.shadowColor = on ? "rgba(123,97,255,.85)" : "transparent"; ctx.shadowBlur = on ? 14 : 0; }
  function label(ctx, txt, x, y, a, align, size, col) {
    ctx.globalAlpha = a; ctx.fillStyle = col || C.ink2; ctx.font = (size || 13) + 'px Geist, system-ui, sans-serif';
    ctx.textAlign = align || "center"; ctx.fillText(txt, x, y); ctx.globalAlpha = 1;
  }

  /* ---------- scenes ---------- */
  var SCENES = {};

  /* Accueil : le bruit devient signal */
  SCENES.noise = (function () {
    var P = null, NP = 0;
    function init(w) {
      NP = w < 700 ? 260 : 620; P = [];
      var r = rnd(7);
      for (var i = 0; i < NP; i++) {
        var u = r(), col = u < .5 ? 0 : u < .75 ? 1 : u < .88 ? 2 : u < .96 ? 3 : 4;
        P.push({ x: r(), y: r(), s: 1 + r() * 2.2, ph: r() * 6.28, sp: .3 + r() * .8, col: col, ly: r(), fin: false, k: r() });
      }
      var fins = 0;
      for (var j = 0; j < NP && fins < 5; j++) { if (P[j].col === 4) { P[j].fin = true; P[j].fi = fins++; } }
    }
    var names = ["Audience", "Intention", "Lead", "Opportunité", "Client"];
    return function (ctx, w, h, p, t, mini) {
      if (!P) init(w);
      var a = ss(.18, .48, p), b = ss(.55, .78, p), c = ss(.8, .97, p);
      var top = h * .3, bot = h * .82;
      for (var i = 0; i < NP; i++) {
        var q = P[i];
        var cx = q.x * w + Math.sin(t * q.sp + q.ph) * 22, cy = q.y * h + Math.cos(t * q.sp * .8 + q.ph) * 18;
        var colX = w * (.14 + q.col * .18) + Math.sin(t * .6 + q.ph) * 6;
        var spread = (bot - top) * (1 - q.col * .19);
        var mid = (top + bot) / 2;
        var lx = colX + (q.k - .5) * 30, ly = mid + (q.ly - .5) * spread;
        var x = lerp(cx, lx, a), y = lerp(cy, ly, a);
        var alpha = .5, rad = q.s, sig = false;
        if (q.fin) {
          var fx = w * .5 + (q.fi - 2) * 26, fy = h * .55;
          x = lerp(x, fx, b); y = lerp(y, fy, b);
          x = lerp(x, w * .5 + (q.fi - 2) * 26 + c * w * .08, c);
          rad = lerp(q.s, 6, b); alpha = 1; sig = b > .05;
        } else {
          alpha = lerp(.5, .1, b);
          y += b * (40 + q.k * 60);
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = sig ? C.sig : (a > .5 && q.col >= 3 ? C.ink2 : C.ink3);
        glow(ctx, sig);
        ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.283); ctx.fill();
      }
      glow(ctx, false); ctx.globalAlpha = 1;
      var la = ss(.3, .45, p) * (1 - ss(.6, .7, p));
      if (la > 0) for (var k = 0; k < 5; k++) label(ctx, names[k], w * (.14 + k * .18), bot + 34, la, "center", 14, k === 4 ? C.brand : C.ink2);
      if (c > 0) {
        var x0 = w * .5 + 2 * 26 + c * w * .08 + 10;
        ctx.strokeStyle = C.sig; ctx.lineWidth = 1.6; glow(ctx, true);
        ctx.beginPath(); ctx.moveTo(x0, h * .55); ctx.lineTo(lerp(x0, w + 10, c), h * .55); ctx.stroke(); glow(ctx, false);
      }
    };
  })();

  /* Accueil : ouverture animee (le bruit se range en foule), puis la foule qui se resserre jusqu'aux clients */
  SCENES.crowd = (function () {
    var cache = { N: 0 }, rnd2 = rnd(77), noise = [];
    for (var z = 0; z < 600; z++) noise.push({ x: rnd2(), y: rnd2(), a: rnd2() * 6.28, r: .25 + rnd2() * .9, s: .4 + rnd2() });
    function hsh(n) { var x = Math.sin(n * 91.7 + 13.1) * 43758.5453; return x - Math.floor(x); }
    function person(ctx, x, y, s) { ctx.beginPath(); ctx.arc(x, y - s * .42, s * .3, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + s * .38, s * .5, s * .4, 0, 3.1416, 6.283); ctx.fill(); }
    function rel(el, sel, edge, sec) { var e = el.querySelector(sel); if (!e) return null; var r = e.getBoundingClientRect(); return r[edge] - sec.top; }
    return function (ctx, w, h, p, t, mini, el) {
      if (el._t0 == null) el._t0 = t;
      var intro = RM ? 1 : clamp((t - el._t0) / 3.2, 0, 1);
      var sec = el.getBoundingClientRect();
      var cols = w < 520 ? 12 : w < 900 ? 18 : 26;
      /* boite de la foule : sous le titre a l'ouverture, entre la phrase et le rail ensuite */
      var heroBottom = rel(el, ".hero-layer", "bottom", sec) || h * .5, headBottom = rel(el, ".story-head", "bottom", sec) || h * .25, railTop = rel(el, ".story-rail", "top", sec) || h * .9;
      var bx = { y0: Math.min(h * .82, heroBottom + 28), y1: h - 64 }, sx = { y0: headBottom + 14, y1: railTop - 14 };
      var rows = Math.max(5, Math.min(11, Math.floor((sx.y1 - sx.y0) / (w / cols) * .95)));
      var bm = ss(0, .11, p), y0 = lerp(bx.y0, sx.y0, bm), y1 = lerp(bx.y1, sx.y1, bm);
      var cell = Math.min(w * .92 / cols, (y1 - y0) / rows), gx = (w - cell * cols) / 2, gy = y0 + ((y1 - y0) - cell * rows) / 2, N = cols * rows;
      if (cache.N !== N) { var order = []; for (var o = 0; o < N; o++) order.push(o); order.sort(function (A, B2) { return hsh(A) - hsh(B2); }); cache.pos = []; for (var o2 = 0; o2 < N; o2++) cache.pos[order[o2]] = o2; cache.N = N; }
      var pos = cache.pos, CNT = [N, Math.round(N * .45), Math.round(N * .16), Math.round(N * .07), Math.max(4, Math.min(7, Math.round(N * .03)))];
      var q = clamp((p - .12) / .88, 0, 1), sweepW = .14, mouse = el._mouse;
      /* 1. le bruit : des centaines de points qui tourbillonnent avant de se ranger */
      if (intro < 1) {
        var fadeN = 1 - ss(.45, 1, intro);
        for (var z = 0; z < noise.length; z++) {
          var nn = noise[z], tt0 = t - el._t0, ang = nn.a + tt0 * 1.4 * nn.s, ang0 = ang - .09 * nn.s, rr = (.12 + nn.r * .55) * Math.min(w, h) * (.6 + .4 * ss(0, .4, intro)) * (1 - ss(.5, 1, intro) * .5);
          var ax = w / h > 1 ? 1.7 : 1, cyy = h * .62;
          var nx = w / 2 + Math.cos(ang) * rr * ax, ny = cyy + Math.sin(ang * 1.3) * rr * .55, px0 = w / 2 + Math.cos(ang0) * rr * ax, py0 = cyy + Math.sin(ang0 * 1.3) * rr * .55;
          var vio = z % 17 === 0; ctx.globalAlpha = (vio ? .9 : .55) * fadeN; ctx.strokeStyle = vio ? C.sig : C.ink3; ctx.lineWidth = vio ? 2.2 : 1.6; ctx.lineCap = "round";
          if (vio) glow(ctx, true); ctx.beginPath(); ctx.moveTo(px0, py0); ctx.lineTo(nx, ny); ctx.stroke(); if (vio) glow(ctx, false);
        }
        ctx.globalAlpha = 1;
      }
      /* faisceau d'ouverture qui range la foule */
      var beamX = gx + ss(.38, .88, intro) * cols * cell;
      var clientsIdx = [];
      for (var i = 0; i < N; i++) {
        var c = i % cols, r = Math.floor(i / cols), xf = (c + .5) / cols;
        var x = gx + (c + .5) * cell, y = gy + (r + .5) * cell, L = 0;
        for (var k = 1; k < 5; k++) if (pos[i] < CNT[k]) L = k;
        /* apparition : chaque personne arrive du tourbillon quand le faisceau passe sur sa colonne */
        var arrive = intro >= 1 ? 1 : ss(0, 1, clamp((beamX - x) / (cell * 3), 0, 1));
        if (arrive <= 0) continue;
        if (arrive < 1) { var ang2 = hsh(i + 3) * 6.28 + t * .5; x = lerp(w / 2 + Math.cos(ang2) * w * .3, x, arrive); y = lerp(h * .55 + Math.sin(ang2) * h * .2, y, arrive); }
        var e = 0; for (var k2 = 1; k2 < 5; k2++) { var start = k2 / 5 - sweepW / 2; if (q > start + sweepW * xf && p > .12) e = k2; }
        var alive = L >= e, size = cell * .62 * (arrive < 1 ? .4 + .6 * arrive : 1), a = .5, col = C.ink3;
        if (!alive) { a = .09; size *= .8; }
        else if (e >= 4) { clientsIdx.push([x, y]); continue; }
        else if (e === 3) { col = C.ink; a = .95; size *= 1.08; }
        else if (e === 2) { col = C.ink2; a = .85; }
        else if (e === 1) { col = C.ink2; a = .6; }
        /* ambiance : quelques personnes s'allument en violet, comme des signaux, avant le filtrage */
        var glowNow = false;
        if (p < .12 && intro >= 1 && L >= 3) { var ph = (t * .35 + hsh(i + 9) * 7) % 7; if (ph < .9) { glowNow = true; } }
        if (mouse && p < .12) { var dx = x - mouse.x, dy = y - mouse.y, d2 = Math.sqrt(dx * dx + dy * dy); if (d2 < cell * 3) { var k3 = 1 - d2 / (cell * 3); size *= 1 + .45 * k3; a = Math.max(a, .5 + .5 * k3); if (L >= 2) { col = C.sig; glowNow = glowNow || k3 > .4; } else col = C.ink2; } }
        if (glowNow) { col = C.sig; a = 1; glow(ctx, true); }
        size *= 1 + Math.sin(t * 1.6 + i) * .03;
        ctx.globalAlpha = a; ctx.fillStyle = col; person(ctx, x, y, size); if (glowNow) glow(ctx, false);
      }
      ctx.globalAlpha = 1;
      if (intro < 1 && intro > .36 && intro < .92) {
        var g0 = ctx.createLinearGradient(beamX - 80, 0, beamX + 8, 0); g0.addColorStop(0, "rgba(123,97,255,0)"); g0.addColorStop(.85, "rgba(123,97,255,.2)"); g0.addColorStop(1, "rgba(123,97,255,0)");
        ctx.fillStyle = g0; ctx.fillRect(beamX - 80, gy - 12, 88, rows * cell + 24);
        ctx.strokeStyle = C.sig; ctx.lineWidth = 2; glow(ctx, true); ctx.beginPath(); ctx.moveTo(beamX, gy - 12); ctx.lineTo(beamX, gy + rows * cell + 12); ctx.stroke(); glow(ctx, false);
      }
      /* les clients sortent de la foule et s'alignent */
      var g = ss(.86, .97, q), n = clientsIdx.length, rowY = gy + rows * cell * .5;
      clientsIdx.forEach(function (qq, j) {
        var tx = w / 2 + (j - (n - 1) / 2) * cell * 2.4, x = lerp(qq[0], tx, g), y = lerp(qq[1], rowY, g), sz = cell * .62 * lerp(1.25, 1.9, g);
        if (g > 0) { ctx.globalAlpha = .5 * g; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(x, y, sz * .9, 0, 6.283); ctx.fill(); }
        ctx.globalAlpha = 1; ctx.fillStyle = C.sig; glow(ctx, true); person(ctx, x, y, sz); glow(ctx, false);
      });
      if (g > .6 && n > 1) { var x0 = w / 2 - (n - 1) / 2 * cell * 2.4, x1 = w / 2 + (n - 1) / 2 * cell * 2.4; ctx.strokeStyle = C.sig; ctx.lineWidth = 1.6; glow(ctx, true); ctx.globalAlpha = ss(.6, 1, g); ctx.beginPath(); ctx.moveTo(x0, rowY + cell * 1.4); ctx.lineTo(lerp(x0, x1, ss(.6, 1, g)), rowY + cell * 1.4); ctx.stroke(); glow(ctx, false); ctx.globalAlpha = 1; }
      /* le filtre : une barre de lumiere balaie la foule a chaque etape */
      for (var k4 = 1; k4 < 5; k4++) {
        var st2 = k4 / 5 - sweepW / 2, f = (q - st2) / sweepW;
        if (p > .12 && f > 0 && f < 1) {
          var bxx = gx + f * cols * cell, grd = ctx.createLinearGradient(bxx - 60, 0, bxx + 8, 0);
          grd.addColorStop(0, "rgba(123,97,255,0)"); grd.addColorStop(.85, "rgba(123,97,255,.16)"); grd.addColorStop(1, "rgba(123,97,255,0)");
          ctx.fillStyle = grd; ctx.fillRect(bxx - 60, gy - 8, 68, rows * cell + 16);
          ctx.strokeStyle = C.sig; ctx.lineWidth = 2; glow(ctx, true); ctx.beginPath(); ctx.moveTo(bxx, gy - 8); ctx.lineTo(bxx, gy + rows * cell + 8); ctx.stroke(); glow(ctx, false);
        }
      }
    };
  })();

  /* Strategie : le noeud se resout */
  SCENES.knot = (function () {
    var curves = null;
    function init() {
      var r = rnd(11); curves = [];
      for (var i = 0; i < 14; i++) {
        var pts = [];
        for (var j = 0; j < 4; j++) pts.push([.25 + r() * .5, .2 + r() * .6]);
        curves.push({ pts: pts, f: .05 + r() * .4 });
      }
    }
    return function (ctx, w, h, p, t, mini) {
      if (!curves) init();
      var A = [w * .08, h * .62], B = [w * .9, h * .38];
      var s = ss(.35, .8, p);
      ctx.lineCap = "round";
      for (var i = 0; i < curves.length; i++) {
        var cv = curves[i], chosen = i === 0;
        var fade = chosen ? 1 : 1 - ss(cv.f + .2, cv.f + .45, p);
        if (fade <= 0) continue;
        var q = cv.pts.map(function (pt, k) {
          var wob = Math.sin(t * .7 + i + k) * 8 * (1 - s);
          var x = pt[0] * w + wob, y = pt[1] * h + wob;
          if (chosen) { var tx = lerp(A[0], B[0], (k + 1) / 5), ty = lerp(A[1], B[1], (k + 1) / 5) + Math.sin((k + 1) / 5 * 3.14) * -h * .08; x = lerp(x, tx, s); y = lerp(y, ty, s); }
          return [x, y];
        });
        ctx.globalAlpha = chosen ? 1 : .55 * fade;
        ctx.strokeStyle = chosen && p > .3 ? C.sig : C.ink3;
        ctx.lineWidth = chosen ? lerp(1.2, 2.4, s) : 1.1;
        glow(ctx, chosen && p > .3);
        ctx.beginPath(); ctx.moveTo(A[0], A[1]);
        ctx.bezierCurveTo(q[0][0], q[0][1], q[1][0], q[1][1], (q[1][0] + q[2][0]) / 2, (q[1][1] + q[2][1]) / 2);
        ctx.bezierCurveTo(q[2][0], q[2][1], q[3][0], q[3][1], B[0], B[1]);
        ctx.stroke(); glow(ctx, false);
      }
      ctx.globalAlpha = 1;
      var d = ss(.75, .95, p), dw = mini ? 10 : 34, dh = mini ? 16 : 54;
      ctx.fillStyle = d > 0 ? "rgba(123,97,255," + (.15 + d * .85) + ")" : C.line;
      glow(ctx, d > .1);
      ctx.beginPath(); ctx.moveTo(B[0] - dw / 2, B[1] + dh / 2); ctx.lineTo(B[0] - dw / 2, B[1] - dh / 2 + dw / 2);
      ctx.arc(B[0], B[1] - dh / 2 + dw / 2, dw / 2, 3.14159, 0); ctx.lineTo(B[0] + dw / 2, B[1] + dh / 2); ctx.closePath(); ctx.fill(); glow(ctx, false);
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(A[0], A[1], mini ? 2.5 : 5, 0, 6.283); ctx.fill();
    };
  })();

  /* Creation : le prisme */
  SCENES.prism = function (ctx, w, h, p, t, mini) {
    var cx = w * .45, cy = h * .5, R = Math.min(w, h) * (mini ? .26 : .17);
    var rot = (-90 + p * 30 + Math.sin(t * .5) * 2) * Math.PI / 180;
    var sp = ss(.42, .85, p);
    ctx.lineCap = "round";
    ctx.strokeStyle = C.ink2; ctx.lineWidth = mini ? 1.4 : 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(cx - R * .5, cy); ctx.stroke();
    var cols = [C.brand, C.sig, C.lav], names = ["Prix", "Temps", "Encadrement"];
    for (var i = 0; i < 3; i++) {
      var ang = (i - 1) * .32 * sp;
      var len = w;
      ctx.strokeStyle = sp > 0 ? cols[i] : C.ink2; ctx.globalAlpha = sp > 0 ? 1 : (i === 1 ? 1 : 0);
      glow(ctx, sp > 0 && i === 1); ctx.lineWidth = mini ? 1.6 : 2.4;
      ctx.beginPath(); ctx.moveTo(cx + R * .3, cy); ctx.lineTo(cx + R * .3 + Math.cos(ang) * len, cy + Math.sin(ang) * len); ctx.stroke();
      glow(ctx, false);
      if (!mini && sp > .4) { ctx.font = "18px Geist, system-ui, sans-serif"; var tw2 = ctx.measureText(names[i]).width, lxx = Math.min(cx + R * .3 + Math.cos(ang) * w * .4, w - tw2 - 14); label(ctx, names[i], lxx, cy + Math.sin(ang) * w * .4 + (i - 1) * 24 - 12, ss(.6, .85, p), "left", 18, C.ink); }
    }
    ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    var g = ctx.createLinearGradient(-R, -R, R, R); g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(1, "rgba(228,222,255,.9)");
    ctx.fillStyle = g; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (var k = 0; k < 3; k++) { var a = k * 2.094; ctx[k ? "lineTo" : "moveTo"](Math.cos(a) * R, Math.sin(a) * R); }
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  };

  /* Acquisition : le phare */
  SCENES.beacon = (function () {
    var dots = null;
    function init() { var r = rnd(23); dots = []; for (var i = 0; i < 26; i++) dots.push({ x: .42 + r() * .52, y: .22 + r() * .62, s: r() }); dots[3].ch = dots[9].ch = dots[15].ch = true; dots[3].x = .7; dots[3].y = .4; dots[9].x = .78; dots[9].y = .47; dots[15].x = .86; dots[15].y = .36; }
    return function (ctx, w, h, p, t, mini) {
      if (!dots) init();
      var base = h * .8, lx = w * .14, ly = Math.max(h * .42, base - w * .5);
      var on = ss(.08, .25, p);
      var target = Math.atan2(h * .42 - ly, w * .78 - lx);
      var sweep = lerp(-.9, target, ss(.2, .7, p)) + (1 - ss(.65, .8, p)) * Math.sin(t * .8) * .25 * on;
      var width = lerp(.32, .12, ss(.55, .85, p));
      if (on > 0) {
        var L = w * 1.1;
        var g = ctx.createRadialGradient(lx, ly, 0, lx, ly, L);
        g.addColorStop(0, "rgba(123,97,255," + (.42 * on) + ")"); g.addColorStop(1, "rgba(123,97,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(lx, ly);
        ctx.arc(lx, ly, L, sweep - width, sweep + width); ctx.closePath(); ctx.fill();
      }
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i], x = d.x * w, y = d.y * h + Math.sin(t + i) * 3;
        var ang = Math.atan2(y - ly, x - lx), inB = Math.abs(ang - sweep) < width && on > .5;
        var lit = d.ch ? ss(.7, .9, p) : 0;
        ctx.fillStyle = lit > 0 || (inB && p < .7) ? C.sig : C.ink3;
        ctx.globalAlpha = d.ch ? lerp(.55, 1, lit) : lerp(.55, .3, ss(.75, .9, p));
        glow(ctx, lit > .2);
        var r = (mini ? 1.6 : 4) * (1 + lit * .6);
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); glow(ctx, false);
      }
      ctx.globalAlpha = 1;
      var tw = mini ? 6 : 22;
      ctx.fillStyle = C.ink;
      ctx.beginPath(); ctx.moveTo(lx - tw * .7, base); ctx.lineTo(lx - tw * .45, ly + tw * .6); ctx.lineTo(lx + tw * .45, ly + tw * .6); ctx.lineTo(lx + tw * .7, base); ctx.closePath(); ctx.fill();
      ctx.fillStyle = on > .2 ? C.sig : C.ink2; glow(ctx, on > .2);
      ctx.beginPath(); ctx.arc(lx, ly, tw * .42, 0, 6.283); ctx.fill(); glow(ctx, false);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(w, base); ctx.stroke();
    };
  })();

  /* Pilotage : le cadran */
  SCENES.dial = function (ctx, w, h, p, t, mini) {
    var cx = w * (mini ? .5 : .5), cy = h * (mini ? .72 : .66), R = Math.min(w * .42, h * (mini ? .6 : .48));
    var a0 = Math.PI, a1 = 2 * Math.PI;
    ctx.lineCap = "butt";
    for (var i = 0; i <= 40; i++) {
      var a = lerp(a0, a1, i / 40), long = i % 5 === 0;
      ctx.strokeStyle = i >= 30 && i <= 37 ? C.sig : C.ink3; ctx.lineWidth = long ? 2 : 1;
      glow(ctx, i >= 30 && i <= 37 && p > .8);
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.lineTo(cx + Math.cos(a) * (R - (long ? R * .12 : R * .07)), cy + Math.sin(a) * (R - (long ? R * .12 : R * .07))); ctx.stroke();
    }
    glow(ctx, false);
    var v;
    if (p < .3) v = lerp(.15, .62, p / .3);
    else if (p < .45) v = lerp(.62, .48, (p - .3) / .15);
    else if (p < .65) v = lerp(.48, .9, ss(.45, .65, p));
    else v = lerp(.9, .84, ss(.65, .85, p));
    v += Math.sin(t * 3) * .006 * (1 - ss(.8, 1, p));
    var na = lerp(a0, a1, v);
    ctx.strokeStyle = v > .74 && v < .93 ? C.brand : C.ink; ctx.lineWidth = mini ? 1.6 : 2.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(na) * R * .82, cy + Math.sin(na) * R * .82); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, mini ? 3 : 7, 0, 6.283); ctx.fill();
    if (!mini) {
      var labs = [["Mesurer", .25], ["Comprendre", .5], ["Ajuster", .75]];
      labs.forEach(function (l, k) { label(ctx, l[0], cx + (k - 1) * R * .7, cy + 56, p >= l[1] - .08 ? 1 : .35, "center", 16, p >= l[1] - .08 ? C.ink : C.ink3); });
    }
  };

  /* Expertises : la boucle */
  SCENES.loop = function (ctx, w, h, p, t, mini) {
    var cx = w / 2, cy = h * .5, R = Math.min(w * .24, h * .3), fs = Math.round(Math.min(26, Math.max(16, w / 22)));
    var names = ["Stratégie", "Création", "Acquisition", "Données"];
    var drawn = ss(.05, .85, p) * 6.283;
    ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
    ctx.strokeStyle = C.sig; ctx.lineWidth = 2; glow(ctx, true);
    ctx.beginPath(); ctx.arc(cx, cy, R, -1.5708, -1.5708 + drawn); ctx.stroke(); glow(ctx, false);
    var dotA = -1.5708 + drawn + (p > .85 ? (t * .8) % 6.283 : 0);
    ctx.fillStyle = C.sig; glow(ctx, true); ctx.beginPath(); ctx.arc(cx + Math.cos(dotA) * R, cy + Math.sin(dotA) * R, 6, 0, 6.283); ctx.fill(); glow(ctx, false);
    for (var i = 0; i < 4; i++) {
      var a = -1.5708 + i * 1.5708, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, reached = drawn >= i * 1.5708 - .01;
      ctx.fillStyle = reached ? C.brand : C.paper; ctx.strokeStyle = reached ? C.brand : C.ink3; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.283); ctx.fill(); ctx.stroke();
      var ox = Math.cos(a) * 22, oy = Math.sin(a) * 30 + 7;
      ctx.globalAlpha = reached ? 1 : .4; ctx.fillStyle = C.ink; ctx.font = fs + "px 'Instrument Serif', Georgia, serif"; ctx.textAlign = i === 1 ? "left" : i === 3 ? "right" : "center";
      ctx.fillText(names[i], x + ox, y + oy); ctx.globalAlpha = 1;
    }
  };


  /* Le chemin d'un dirham : des billets entrent dans la publicité, deviennent des personnes, les bonnes deviennent clientes, les clients font tomber des pièces, et plus de billets reviennent */
  SCENES.money = (function () {
    var GOLD = ["#FBEFC4", "#E2C066", "#B8892F", "#8F6A22"], NOTE = ["#EEF4EA", "#D3E3CF", "#5E8A69"];
    function hash(n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
    function note(ctx, x, y, rot, sc, a, glowOn) {
      var w = 64 * sc, h = 32 * sc; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot);
      if (glowOn) { ctx.shadowColor = "rgba(123,97,255,.55)"; ctx.shadowBlur = 14; } else { ctx.shadowColor = "rgba(20,18,26,.18)"; ctx.shadowBlur = 6 * sc; ctx.shadowOffsetY = 2 * sc; }
      var g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, NOTE[0]); g.addColorStop(1, NOTE[1]);
      ctx.fillStyle = g; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-w / 2, -h / 2, w, h, 3 * sc); else ctx.rect(-w / 2, -h / 2, w, h); ctx.fill();
      ctx.shadowColor = "transparent"; ctx.strokeStyle = NOTE[2]; ctx.lineWidth = Math.max(.6, .9 * sc);
      ctx.strokeRect(-w / 2 + 3 * sc, -h / 2 + 3 * sc, w - 6 * sc, h - 6 * sc);
      ctx.beginPath(); ctx.arc(-w * .26, 0, h * .26, 0, 6.283); ctx.stroke();
      ctx.fillStyle = NOTE[2]; ctx.font = "600 " + Math.max(6, 9 * sc) + "px Geist, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText("MAD", w / 2 - 6 * sc, 1);
      ctx.restore();
    }
    function coin(ctx, x, y, sc, a, tilt, shine) {
      var r = 11 * sc, ry = r * tilt; ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = GOLD[3]; ctx.beginPath(); ctx.ellipse(x, y + 2.2 * sc * tilt, r, ry, 0, 0, 6.283); ctx.fill();
      var g = ctx.createRadialGradient(x - r * .35, y - ry * .4, r * .1, x, y, r); g.addColorStop(0, GOLD[0]); g.addColorStop(.55, GOLD[1]); g.addColorStop(1, GOLD[2]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r, ry, 0, 0, 6.283); ctx.fill();
      ctx.strokeStyle = "rgba(143,106,34,.75)"; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(x, y, r * .72, ry * .72, 0, 0, 6.283); ctx.stroke();
      if (shine > 0) { ctx.globalAlpha = a * shine; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(x - r * .3, y - ry * .35, r * .22, ry * .12, -.5, 0, 6.283); ctx.fill(); }
      ctx.restore();
    }
    function person(ctx, x, y, sc, col, a, gl) {
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; if (gl) { ctx.shadowColor = "rgba(123,97,255,.85)"; ctx.shadowBlur = 12; }
      ctx.beginPath(); ctx.arc(x, y - 5 * sc, 3.6 * sc, 0, 6.283); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, y + 4 * sc, 6 * sc, 4.6 * sc, 0, 3.1416, 6.283); ctx.fill(); ctx.restore();
    }
    function bez(a, c, b, t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; }
    return function (ctx, w, h, p, t, mini, el) {
      if (el && el.hasAttribute("data-loop")) { var cyc = (t % 10) / 8.6; p = cyc > 1 ? 1 : cyc; }
      var f = (el && el._flow) || { lead: .45, client: .14, ret: 3.2 };
      var portrait = h > w * .9, sc = Math.max(.62, Math.min(1.25, Math.min(w / 1100, h / 640))) * (mini ? .7 : 1);
      function P(u, v) { return portrait ? [w * .5 + v * w * .32, lerp(h * .26, h * .72, u)] : [lerp(w * .07, w * .93, u), h * .56 + v * h * .2]; }
      var U = [0, .3, .62, .92], LB = (el && el._labels) || ["Budget investi", "Publicité", "Clients", "Chiffre d'affaires"];
      var NN = 12, PER = 6, TOT = NN * PER, NS = Math.max(3, Math.min(24, Math.round(TOT * Math.max(.04, Math.min(.5, f.client * (f.lead / .45)))))), NR = Math.max(6, Math.min(34, Math.round(NN * f.ret / 2))), NC = Math.max(10, Math.min(72, Math.round(NR * 2.2)));
      /* rail discret */
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.setLineDash([3, 6]); ctx.beginPath(); var a0 = P(0, 0), a1 = P(1, 0); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke(); ctx.setLineDash([]);
      /* telephone (la publicite) */
      var ph = P(U[1], 0), pw = 66 * sc, phh = 120 * sc, recv = ss(.04, .08, p) * (1 - ss(.3, .36, p));
      ctx.save(); ctx.translate(ph[0], ph[1] + Math.sin(t * 1.4) * 2);
      if (recv > 0) { ctx.shadowColor = "rgba(123,97,255,.7)"; ctx.shadowBlur = 30 * recv; }
      ctx.fillStyle = C.ink; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-pw / 2, -phh / 2, pw, phh, 12 * sc); else ctx.rect(-pw / 2, -phh / 2, pw, phh); ctx.fill(); ctx.shadowColor = "transparent";
      ctx.fillStyle = "#F1EEF8"; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-pw / 2 + 4 * sc, -phh / 2 + 10 * sc, pw - 8 * sc, phh - 20 * sc, 6 * sc); else ctx.rect(-pw / 2 + 4 * sc, -phh / 2 + 10 * sc, pw - 8 * sc, phh - 20 * sc); ctx.fill();
      for (var k = 0; k < 3; k++) { var yy = -phh / 2 + 18 * sc + k * 32 * sc, on = (Math.floor(t * 2) % 3) === k && p > .05 && p < .4; ctx.fillStyle = on ? C.sig : "#DCD6E6"; ctx.fillRect(-pw / 2 + 10 * sc, yy, pw - 20 * sc, 22 * sc); }
      ctx.restore();
      /* billets qui partent du budget */
      var bud = P(U[0], 0);
      for (var i = NN - 1; i >= 0; i--) {
        var ti = .03 + i * .015, fl = clamp((p - ti) / .1, 0, 1);
        var st = [bud[0], bud[1] - i * 3.2 * sc];
        if (fl <= 0) { note(ctx, st[0], st[1], -.04 + hash(i) * .08, sc, 1, false); continue; }
        if (fl >= 1) continue;
        var ctrl = portrait ? [w * .5 + w * .36, (st[1] + ph[1]) / 2] : [(st[0] + ph[0]) / 2, Math.min(st[1], ph[1]) - h * .22];
        var q = bez(st, ctrl, ph, ss(0, 1, fl)); note(ctx, q[0], q[1], fl * 6.3 * (hash(i + 3) > .5 ? 1 : -1), sc * (1 - fl * .55), 1 - ss(.85, 1, fl), false);
      }
      /* personnes qui sortent de la publicite */
      var clientPos = P(U[2], 0), sIdx = 0;
      for (var n = 0; n < TOT; n++) {
        var ni = Math.floor(n / PER), m = n % PER, s0 = .03 + ni * .015 + .1 + m * .006, g = clamp((p - s0) / .24, 0, 1);
        if (g <= 0) continue;
        var surv = hash(n + 11) < NS / TOT, vStart = (hash(n + 5) - .5) * 1.8, uu = lerp(U[1] + .03, U[2], ss(0, 1, g));
        var vv = lerp(vStart, vStart * .25, g), pos = P(uu, vv), a = 1, col = C.ink3, gl = false;
        if (!surv && g > .55) { var fall = (g - .55) / .45; a = 1 - fall; if (portrait) pos[0] += fall * fall * 70 * (vStart > 0 ? 1 : -1); else pos[1] += fall * fall * 90; }
        if (surv) {
          var idx = sIdx++, cols = Math.ceil(NS / 3), cx2 = idx % cols, cy2 = Math.floor(idx / cols), slot = portrait ? [clientPos[0] + (cx2 - (cols - 1) / 2) * 20 * sc, clientPos[1] + (cy2 - 1) * 22 * sc] : [clientPos[0] + (cy2 - 1) * 22 * sc, clientPos[1] + (cx2 - (cols - 1) / 2) * 20 * sc];
          var gg = ss(.75, 1, g); pos = [lerp(pos[0], slot[0], gg), lerp(pos[1], slot[1], gg)]; col = g > .6 ? C.sig : C.ink2; gl = g > .8;
          person(ctx, pos[0], pos[1], sc * 1.15, col, 1, gl); continue;
        }
        if (a > 0) person(ctx, pos[0], pos[1], sc, col, a * .85, false);
      }
      /* pieces qui tombent des clients vers la pile */
      var pile = P(U[3], 0), colsP = portrait ? 5 : 4, landed = 0;
      for (var c = 0; c < NC; c++) {
        var c0 = .56 + c * (.22 / NC), cf = clamp((p - c0) / .09, 0, 1); if (cf <= 0) continue;
        var colI = c % colsP, row = Math.floor(c / colsP), dest = [pile[0] + (colI - (colsP - 1) / 2) * 24 * sc, pile[1] + 30 * sc - row * 5.5 * sc];
        var srcIdx = c % NS, src = [clientPos[0] + (hash(srcIdx) - .5) * 40 * sc, clientPos[1] + (hash(srcIdx + 9) - .5) * 40 * sc];
        if (cf < 1) { var ctl = portrait ? [src[0] + w * .25, (src[1] + dest[1]) / 2] : [(src[0] + dest[0]) / 2, Math.min(src[1], dest[1]) - h * .25]; var cp = bez(src, ctl, dest, ss(0, 1, cf)); coin(ctx, cp[0], cp[1], sc, 1, .35 + .65 * Math.abs(Math.cos(cf * 9 + c)), .8); }
        else { landed++; coin(ctx, dest[0], dest[1], sc, 1, .42, .4 + .4 * Math.sin(t * 3 + c)); if (p - c0 - .09 < .03) { ctx.fillStyle = C.sig; glow(ctx, true); ctx.globalAlpha = 1 - (p - c0 - .09) / .03; ctx.beginPath(); ctx.arc(dest[0] + 10 * sc, dest[1] - 10 * sc, 2.4 * sc, 0, 6.283); ctx.fill(); glow(ctx, false); ctx.globalAlpha = 1; } }
      }
      /* les billets reviennent, plus nombreux */
      var topPile = [pile[0], pile[1] + 30 * sc - Math.ceil(NC / colsP) * 5.5 * sc];
      for (var r = 0; r < NR; r++) {
        var r0 = .8 + r * (.14 / NR), rf = clamp((p - r0) / .1, 0, 1); if (rf <= 0) continue;
        var dst = [bud[0] + (portrait ? 0 : 0), bud[1] - r * 3.2 * sc];
        if (rf < 1) { var ctl2 = portrait ? [w * .08, (topPile[1] + dst[1]) / 2] : [(topPile[0] + dst[0]) / 2, Math.min(topPile[1], dst[1]) - h * .42]; var rp = bez(topPile, ctl2, dst, ss(0, 1, rf)); note(ctx, rp[0], rp[1], Math.sin(rf * 6 + r) * .6, sc * .9, 1, true); }
        else note(ctx, dst[0] + (hash(r) - .5) * 3, dst[1], -.04 + hash(r + 7) * .08, sc, 1, r === NR - 1 && p < .999);
      }
      if (p > .8) { ctx.strokeStyle = "rgba(123,97,255," + (.35 * ss(.8, .9, p)) + ")"; ctx.lineWidth = 1.5; ctx.setLineDash([2, 10]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); var ctl3 = portrait ? [w * .08, (topPile[1] + bud[1]) / 2] : [(topPile[0] + bud[0]) / 2, Math.min(topPile[1], bud[1]) - h * .42]; ctx.moveTo(topPile[0], topPile[1]); ctx.quadraticCurveTo(ctl3[0], ctl3[1], bud[0], bud[1] - NR * 3.2 * sc); ctx.stroke(); ctx.setLineDash([]); }
      if (!mini) {
        var vis = [1, ss(.04, .1, p), ss(.3, .4, p), ss(.56, .62, p)];
        for (var L = 0; L < 4; L++) { var lp = P(U[L], 1.05); if (portrait) label(ctx, LB[L], 16, P(U[L], 0)[1] - 46 * sc, Math.max(.3, vis[L]), "left", 13, L === 3 ? "#8F6A22" : L === 2 ? C.brand : C.ink2); else label(ctx, LB[L], lp[0], lp[1] + 40 * sc, Math.max(.3, vis[L]), "center", 15, L === 3 ? "#8F6A22" : L === 2 ? C.brand : C.ink2); }
      }
    };
  })();

  /* ---------- moteur de scenes ---------- */
  var live = [];
  function makeScene(el) {
    var cv = el.querySelector("canvas"), fn = SCENES[el.getAttribute("data-scene")];
    if (!cv || !fn) return;
    var stat = el.hasAttribute("data-static");
    var st = { el: el, cv: cv, fn: fn, p: (RM || stat) ? 1 : 0, vis: true, mini: el.hasAttribute("data-mini"), auto: el.hasAttribute("data-auto"), stat: stat };
    live.push(st);
    return st;
  }
  function frame(now) {
    var t = now / 1000;
    for (var i = 0; i < live.length; i++) {
      var s = live[i], rb = s.el.getBoundingClientRect(); s.vis = rb.bottom > -100 && rb.top < innerHeight + 100 && rb.height > 0; if (!s.vis) continue;
      var f = fitCanvas(s.cv);
      f.ctx.clearRect(0, 0, f.w, f.h);
      var p = s.auto ? (RM ? 1 : (Math.sin(t * .7 + i) * .5 + .5)) : s.p;
      s.fn(f.ctx, f.w, f.h, p, RM ? 0 : t, s.mini, s.el);
    }
    requestAnimationFrame(frame);
  }
  document.querySelectorAll("[data-scene]").forEach(makeScene);
  requestAnimationFrame(frame);

  /* ---------- texte qui s'allume, titres ---------- */
  document.querySelectorAll("[data-light]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + w + "</span>"; }).join(" ");
  });
  document.querySelectorAll("[data-rise]").forEach(function (el) {
    var html = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = html.map(function (l) { return '<span class="mask-line"><span>' + l.trim() + "</span></span>"; }).join("");
  });

  /* ---------- filtres ---------- */
  document.querySelectorAll("[data-filters]").forEach(function (bar) {
    var scope = document.querySelector(bar.getAttribute("data-filters"));
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      var f = b.getAttribute("data-f");
      scope.querySelectorAll("[data-cat]").forEach(function (it) { it.hidden = !(f === "all" || it.getAttribute("data-cat").indexOf(f) > -1); });
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  /* ---------- curseur ---------- */
  if (FINE && !RM) {
    var cur = document.createElement("div"); cur.className = "cur"; cur.setAttribute("aria-hidden", "true"); document.body.appendChild(cur);
    var mx = 0, my = 0, cxp = 0, cyp = 0;
    window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; var z = e.target.closest && e.target.closest("[data-cursor]"); if (z) { cur.textContent = z.getAttribute("data-cursor"); cur.classList.add("on"); } else cur.classList.remove("on"); });
    (function loop() { cxp += (mx - cxp) * .18; cyp += (my - cyp) * .18; cur.style.transform = "translate(" + cxp + "px," + cyp + "px)" + (cur.classList.contains("on") ? " scale(1)" : " scale(.4)"); requestAnimationFrame(loop); })();
  }

  /* ---------- particules du pied de page ---------- */
  (function () {
    var cv = ftr.querySelector("canvas"), pts = [], vis = false, mouse = { x: -999, y: -999 }, r = rnd(5);
    for (var i = 0; i < 160; i++) pts.push({ u: r(), o: r() * 6.28, s: .6 + r() * 1.6 });
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(ftr);
    ftr.addEventListener("pointermove", function (e) { var b = cv.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; });
    ftr.addEventListener("pointerleave", function () { mouse.x = mouse.y = -999; });
    (function loop(now) {
      if (vis) {
        var f = fitCanvas(cv), t = RM ? 0 : now / 1000; f.ctx.clearRect(0, 0, f.w, f.h);
        pts.forEach(function (q) {
          var x = q.u * f.w, y = f.h * .32 + Math.sin(q.u * 9 + t * .6 + q.o * .2) * f.h * .08 + Math.sin(t + q.o) * 6;
          var dx = x - mouse.x, dy = y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) { x += dx / d * (120 - d) * .5; y += dy / d * (120 - d) * .5; }
          f.ctx.fillStyle = "rgba(123,97,255," + (.25 + q.s * .25) + ")"; f.ctx.beginPath(); f.ctx.arc(x, y, q.s, 0, 6.283); f.ctx.fill();
        });
      }
      requestAnimationFrame(loop);
    })(0);
  })();

  /* ---------- en-tete au defilement ---------- */
  var lastY = 0, prog = hdr.querySelector(".progress");
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    hdr.classList.toggle("solid", y > 40);
    hdr.classList.toggle("hide", y > 300 && y > lastY && mnav.hidden);
    lastY = y; prog.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- tout ce qui suit demande GSAP ---------- */
  if (!window.gsap || !window.ScrollTrigger) { live.forEach(function (s) { s.p = 1; }); litAll(); return; }
  var gsap = window.gsap, ST = window.ScrollTrigger; gsap.registerPlugin(ST);
  function litAll() { document.querySelectorAll("[data-light] .w").forEach(function (w) { w.classList.add("lit"); }); }
  if (RM) { litAll(); document.querySelectorAll(".rail-bar i").forEach(function (i) { i.style.transform = "none"; }); return; }

  if (window.Lenis) {
    var lenis = new window.Lenis({ lerp: .1, wheelMultiplier: 1 });
    lenis.on("scroll", ST.update);
    gsap.ticker.add(function (tm) { lenis.raf(tm * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener("click", function (e) { var id = a.getAttribute("href"); if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -80 }); } }); });
  }

  /* scenes epinglees */
  live.forEach(function (s) {
    if (s.auto || s.stat) return;
    var steps = s.el.querySelectorAll(".cap>*"), dots = s.el.querySelectorAll(".scene-dots b");
    var len = parseFloat(s.el.getAttribute("data-len") || "250");
    if (innerWidth < 760) len *= .6;
    ST.create({
      trigger: s.el, start: "top top", end: "+=" + len + "%", pin: true, scrub: 1,
      onUpdate: function (self) {
        s.p = self.progress;
        steps.forEach(function (c, i) {
          var r = (c.getAttribute("data-at") || "0-1").split("-").map(parseFloat);
          var on = s.p >= r[0] && s.p < r[1] + (r[1] >= 1 ? .01 : 0);
          c.classList.toggle("on", on); if (dots[i]) dots[i].classList.toggle("on", on);
        });
        var k = ss(.01, .1, s.p);
        s.el.querySelectorAll("[data-hero-out]").forEach(function (hero) { hero.style.opacity = 1 - k; hero.style.transform = (hero.classList.contains("hero-hint") ? "translateX(-50%) " : "") + "translateY(" + (-k * 70) + "px)"; hero.style.visibility = k > .99 ? "hidden" : "visible"; });
        s.el.querySelectorAll("[data-hero-in]").forEach(function (h2) { h2.style.opacity = ss(.07, .13, s.p); });
      }
    });
  });

  document.querySelectorAll("[data-light]").forEach(function (el) {
    var ws = el.querySelectorAll(".w");
    ST.create({ trigger: el, start: "top 85%", end: "bottom 45%", scrub: true, onUpdate: function (self) { var n = Math.round(self.progress * ws.length); ws.forEach(function (w, i) { w.classList.toggle("lit", i < n); }); } });
  });
  document.querySelectorAll("[data-rise]").forEach(function (el) {
    gsap.from(el.querySelectorAll(".mask-line>span"), { yPercent: 70, opacity: .2, duration: .9, ease: "power3.out", stagger: .08, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  document.querySelectorAll("[data-speed]").forEach(function (el) {
    var sp = parseFloat(el.getAttribute("data-speed"));
    gsap.fromTo(el, { y: sp * 80 }, { y: -sp * 80, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count")), pre = el.getAttribute("data-pre") || "", o = { v: 0 };
    ST.create({ trigger: el, start: "top 90%", once: true, onEnter: function () {
      gsap.fromTo(o, { v: 0 }, { v: end, duration: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = pre + Math.round(o.v).toLocaleString("fr-FR").replace(/ | /g, " "); } });
    } });
  });
  document.querySelectorAll(".rail").forEach(function (r) {
    var bar = r.querySelector(".rail-bar i"), st = r.querySelectorAll(".step");
    ST.create({ trigger: r, start: "top 60%", end: "bottom 60%", scrub: true, onUpdate: function (self) {
      bar.style.transform = "scaleY(" + self.progress + ")";
      var idx = Math.min(st.length - 1, Math.floor(self.progress * st.length));
      st.forEach(function (s, i) { s.classList.toggle("on", i <= idx); });
    } });
  });
  /* defilement horizontal */
  document.querySelectorAll("[data-h]").forEach(function (sec) {
    var track = sec.querySelector(".htrack");
    if (innerWidth < 760) return;
    gsap.to(track, { x: function () { return -(track.scrollWidth - sec.clientWidth + 64); }, ease: "none",
      scrollTrigger: { trigger: sec, start: "top top", end: function () { return "+=" + (track.scrollWidth - sec.clientWidth); }, pin: true, scrub: 1, invalidateOnRefresh: true } });
  });
  /* cartes empilees */
  document.querySelectorAll("[data-stack] .card").forEach(function (c, i, all) {
    if (i === all.length - 1) return;
    gsap.to(c, { scale: .92, filter: "brightness(.94)", ease: "none", scrollTrigger: { trigger: all[i + 1], start: "top 85%", end: "top 25%", scrub: true } });
  });
  /* defilement qui accelere le bandeau de logos */
  var mq = document.querySelectorAll(".marquee");
  if (mq.length) ST.create({ start: 0, end: "max", onUpdate: function (self) { var v = Math.min(Math.abs(self.getVelocity()) / 1200, 3); mq.forEach(function (m) { m.style.animationDuration = (38 / (1 + v)) + "s"; }); } });

  /* ---------- le fil de signal, du haut vers le bas ---------- */
  var main = document.getElementById("main"), anchors = main ? main.querySelectorAll("[data-t]") : [];
  if (main && anchors.length > 1) {
    var NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg"), path = document.createElementNS(NS, "path");
    svg.setAttribute("class", "thread"); svg.setAttribute("aria-hidden", "true"); svg.appendChild(path); main.insertBefore(svg, main.firstChild);
    var samples = [], L = 0;
    function build() {
      var mb = main.getBoundingClientRect(), W = mb.width, H = main.scrollHeight;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.style.height = H + "px"; svg.style.width = W + "px";
      var pts = [].map.call(anchors, function (a) { var b = a.getBoundingClientRect(); return [parseFloat(a.getAttribute("data-t")) * W, b.top - mb.top + b.height * .5]; });
      pts.sort(function (a, b) { return a[1] - b[1]; });
      var d = "M" + pts[0][0] + " " + pts[0][1];
      for (var i = 1; i < pts.length; i++) { var a = pts[i - 1], b = pts[i], my = (a[1] + b[1]) / 2; d += " C" + a[0] + " " + my + " " + b[0] + " " + my + " " + b[0] + " " + b[1]; }
      path.setAttribute("d", d); L = path.getTotalLength();
      path.style.strokeDasharray = L; samples = [];
      for (var s = 0; s <= 300; s++) { var l = L * s / 300; samples.push([l, path.getPointAtLength(l).y]); }
      draw();
    }
    function draw() {
      if (!L) return;
      var mb = main.getBoundingClientRect(), head = -mb.top + innerHeight * .62, len = 0;
      for (var i = 0; i < samples.length; i++) { if (samples[i][1] <= head) len = Math.max(len, samples[i][0]); }
      path.style.strokeDashoffset = L - len;
    }
    ST.addEventListener("refresh", build);
    window.addEventListener("scroll", draw, { passive: true });
    gsap.ticker.add(draw);
  }
  window.addEventListener("load", function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
