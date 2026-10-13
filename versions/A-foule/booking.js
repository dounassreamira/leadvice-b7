/* Leadvice prototype : reservation du diagnostic en fenetre (qualification, creneau, coordonnees, confirmation).
   Les reglages viennent de admin.html (stockes dans ce navigateur pour la demo). */
(function () {
  "use strict";
  var KEY = "lv-booking-settings", BK = "lv-bookings";
  var DEF = {
    duration: 20, buffer: 10, notice: 24, horizon: 21, maxPerDay: 4,
    week: { 1: [["09:30", "12:30"], ["14:30", "17:30"]], 2: [["09:30", "12:30"], ["14:30", "17:30"]], 3: [["09:30", "12:30"], ["14:30", "17:30"]], 4: [["09:30", "12:30"], ["14:30", "17:30"]], 5: [["09:30", "12:00"]], 6: [], 0: [] },
    blocked: [], extra: []
  };
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  window.LVBooking = { DEF: DEF, KEY: KEY, BK: BK, load: load, save: save };
  if (document.documentElement.getAttribute("data-page") === "admin" || document.body.getAttribute("data-page") === "admin") return;

  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var J3 = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  function ymd(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function toMin(s) { var p = s.split(":"); return +p[0] * 60 + +p[1]; }
  function hm(m) { return Math.floor(m / 60) + " h " + ("0" + (m % 60)).slice(-2); }
  /* occupation simulee de l'agenda (remplacee par Google Calendar dans la version reelle) */
  function busy(dateStr, m) { var h = 0; for (var i = 0; i < dateStr.length; i++) h = (h * 31 + dateStr.charCodeAt(i)) % 997; return ((h + m * 7) % 11) < 3; }

  function slotsFor(day, S, books) {
    var key = ymd(day), dow = day.getDay();
    if (S.blocked.indexOf(key) > -1) return [];
    var ranges = (S.week[dow] || []).slice();
    S.extra.forEach(function (e) { if (e.date === key) ranges.push([e.from, e.to]); });
    var out = [], now = Date.now(), taken = books.filter(function (b) { return b.date === key; }).map(function (b) { return b.min; });
    ranges.forEach(function (r) {
      for (var m = toMin(r[0]); m + S.duration <= toMin(r[1]); m += S.duration + S.buffer) {
        var t = new Date(day); t.setHours(Math.floor(m / 60), m % 60, 0, 0);
        if (t.getTime() - now < S.notice * 3600e3) continue;
        if (taken.indexOf(m) > -1 || busy(key, m)) continue;
        out.push(m);
      }
    });
    var already = taken.length;
    return out.slice(0, Math.max(0, S.maxPerDay - already));
  }

  var css = document.createElement("style");
  css.textContent = ".bk{border:0;padding:0;width:min(980px,calc(100vw - 32px));max-height:calc(100vh - 32px);background:var(--paper);color:var(--ink);border-radius:2px;box-shadow:0 40px 120px -20px rgba(20,18,26,.45)}" +
    ".bk::backdrop{background:rgba(20,18,26,.55);backdrop-filter:blur(4px)}" +
    ".bk-in{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);min-height:560px}" +
    ".bk-side{background:var(--brand);color:#F6F4EF;padding:36px;display:flex;flex-direction:column;gap:20px}" +
    ".bk-side h2{font-size:clamp(1.9rem,1.4rem + 1.4vw,2.6rem);line-height:1.04}.bk-side p{color:#CFC6F5;font-size:.95rem}" +
    ".bk-sum{margin-top:auto;display:flex;flex-direction:column;gap:10px;font-size:.92rem;border-top:1px solid rgba(255,255,255,.18);padding-top:18px}.bk-sum div{display:flex;gap:10px}.bk-sum b{font-weight:500;color:#fff}" +
    ".bk-main{padding:36px;overflow:auto;max-height:calc(100vh - 32px);position:relative}" +
    ".bk-x{position:absolute;top:14px;right:14px;width:44px;height:44px;border:0;background:none;cursor:pointer;color:var(--ink);font-size:1.6rem;line-height:1}" +
    ".bk-steps{display:flex;gap:6px;margin-bottom:24px}.bk-steps b{flex:1;height:3px;background:var(--line)}.bk-steps b.on{background:var(--signal);box-shadow:var(--glow)}" +
    ".bk h3{font-size:var(--fs-h3);margin-bottom:18px}" +
    ".chips{display:flex;flex-wrap:wrap;gap:8px}.chip{position:relative}.chip input{position:absolute;opacity:0;inset:0;cursor:pointer}.chip span{display:block;padding:12px 16px;border:1px solid var(--line);background:#fff;border-radius:2px;font-weight:500;font-size:.95rem}.chip input:checked+span{border-color:var(--brand);box-shadow:inset 0 0 0 1px var(--brand);background:var(--paper-2)}.chip input:focus-visible+span{outline:2px solid var(--brand);outline-offset:2px}" +
    ".bf{display:flex;flex-direction:column;gap:6px;margin-top:16px}.bf label{font-weight:500;font-size:.92rem}.bf input,.bf select{font:inherit;min-height:48px;padding:10px 14px;border:1px solid #8A8499;border-radius:2px;background:#fff;color:var(--ink)}" +
    ".cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;text-align:center;font-size:.85rem}.cal .h{color:var(--ink-2);padding:6px 0}.cal button{min-height:44px;border:0;border-radius:2px;background:transparent;color:var(--ink-3);font:inherit;cursor:default}.cal button.av{background:#fff;color:var(--ink);font-weight:500;cursor:pointer;box-shadow:inset 0 0 0 1px var(--line)}.cal button.av:hover{box-shadow:inset 0 0 0 1px var(--brand)}.cal button.sel{background:var(--brand);color:#fff;box-shadow:none}" +
    ".slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-top:18px}.slots button{min-height:46px;border:1px solid var(--line);background:#fff;border-radius:2px;font:500 .95rem var(--sans);cursor:pointer;color:var(--ink)}.slots button:hover{border-color:var(--brand)}.slots button.sel{background:var(--brand);color:#fff;border-color:var(--brand)}" +
    ".bk-nav{display:flex;justify-content:space-between;gap:12px;margin-top:28px;flex-wrap:wrap}.bk .err{color:#B42318;font-size:.875rem;margin-top:10px}" +
    ".bk-ok svg{width:100%;height:auto;margin:10px 0 20px}" +
    "@media (max-width:820px){.bk-in{grid-template-columns:1fr}.bk-side{padding:24px}.bk-side .bk-sum{display:none}.bk-main{padding:24px}}";
  document.head.appendChild(css);

  var dlg = document.createElement("dialog");
  dlg.className = "bk"; dlg.setAttribute("aria-labelledby", "bk-t");
  dlg.innerHTML = '<div class="bk-in"><div class="bk-side"><h2 id="bk-t">Réservez votre diagnostic.</h2><p>20 minutes, offert, en visio ou par téléphone. Nous regardons vos campagnes, vos chiffres et votre offre. Vous repartez avec ce qui freine votre acquisition et par quoi commencer.</p>' +
    '<div class="bk-sum"><div><span>Durée</span><b id="bk-d">20 minutes</b></div><div><span>Créneau</span><b id="bk-c">à choisir</b></div><div><span>Avec</span><b>Nada Moujibi ou Amira Dounassre</b></div><div><span>Fuseau</span><b>Heure de Casablanca</b></div></div></div>' +
    '<div class="bk-main"><button class="bk-x" type="button" aria-label="Fermer">×</button><div class="bk-steps" aria-hidden="true"><b class="on"></b><b></b><b></b></div><p class="legend" id="bk-l" aria-live="polite">Étape 1 sur 3</p><div id="bk-body"></div></div></div>';
  document.body.appendChild(dlg);
  var body = dlg.querySelector("#bk-body"), st = {};
  var ENJ = [["leads", "Générer plus de leads qualifiés"], ["conv", "Améliorer la conversion"], ["strat", "Clarifier la stratégie"], ["crea", "Renouveler la création"], ["pilot", "Mieux piloter la performance"], ["autre", "Autre"]];

  function steps(n) { dlg.querySelectorAll(".bk-steps b").forEach(function (b, i) { b.classList.toggle("on", i < n); }); dlg.querySelector("#bk-l").textContent = n <= 3 ? "Étape " + n + " sur 3" : "Réservé"; }
  function err(msg) { var e = body.querySelector(".err"); if (!e) { e = document.createElement("p"); e.className = "err"; e.setAttribute("role", "alert"); body.appendChild(e); } e.textContent = msg; }

  function s1() {
    steps(1);
    body.innerHTML = '<h3>Quel est votre enjeu principal ?</h3><div class="chips" role="radiogroup" aria-label="Enjeu">' + ENJ.map(function (e, i) { return '<label class="chip"><input type="radio" name="bk-e" id="bk-e' + i + '" value="' + e[0] + '"' + (st.enjeu === e[0] ? " checked" : "") + '><span>' + e[1] + "</span></label>"; }).join("") + "</div>" +
      '<div class="bf"><label for="bk-ent">Entreprise</label><input id="bk-ent" autocomplete="organization" value="' + (st.ent || "") + '"></div>' +
      '<div class="bf"><label for="bk-bud">Budget marketing mensuel</label><select id="bk-bud"><option value="">Une fourchette suffit</option><option>Moins de 20 000 MAD</option><option>20 000 à 50 000 MAD</option><option>50 000 à 150 000 MAD</option><option>Plus de 150 000 MAD</option></select></div>' +
      '<div class="bk-nav"><span></span><button class="btn btn-main" type="button" id="bk-n">Choisir un créneau</button></div>';
    if (st.bud) body.querySelector("#bk-bud").value = st.bud;
    body.querySelector("#bk-n").onclick = function () {
      var e = body.querySelector('input[name="bk-e"]:checked'), ent = body.querySelector("#bk-ent").value.trim(), bud = body.querySelector("#bk-bud").value;
      if (!e) return err("Choisissez votre enjeu pour continuer.");
      if (!ent) { body.querySelector("#bk-ent").focus(); return err("Indiquez le nom de votre entreprise."); }
      if (!bud) { body.querySelector("#bk-bud").focus(); return err("Choisissez une fourchette de budget."); }
      st.enjeu = e.value; st.ent = ent; st.bud = bud; s2();
    };
  }

  function s2() {
    steps(2);
    var S = load(KEY, DEF), books = load(BK, []), today = new Date(); today.setHours(0, 0, 0, 0);
    var days = [];
    for (var i = 0; i <= S.horizon; i++) { var d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
    var first = days[0], pad = (first.getDay() + 6) % 7;
    var html = '<h3>Choisissez un créneau.</h3><p class="small" style="margin:-8px 0 16px">Heure de Casablanca. Les créneaux affichés tiennent compte de notre agenda.</p><div class="cal" role="grid" aria-label="Jours disponibles">' +
      ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(function (j) { return '<div class="h" aria-hidden="true">' + j + "</div>"; }).join("");
    for (var p = 0; p < pad; p++) html += "<span></span>";
    days.forEach(function (d) {
      var n = slotsFor(d, S, books).length, k = ymd(d);
      html += '<button type="button" data-k="' + k + '" class="' + (n ? "av" : "") + (st.day === k ? " sel" : "") + '"' + (n ? "" : " disabled") + ' aria-label="' + JOURS[d.getDay()] + " " + d.getDate() + " " + MOIS[d.getMonth()] + (n ? ", " + n + " créneaux" : ", complet") + '">' + d.getDate() + "</button>";
    });
    html += '</div><div id="bk-sl"></div><div class="bk-nav"><button class="btn btn-ghost" type="button" id="bk-b">Retour</button><button class="btn btn-main" type="button" id="bk-n">Continuer</button></div>';
    body.innerHTML = html;
    function showSlots(k) {
      var d = days.filter(function (x) { return ymd(x) === k; })[0], sl = slotsFor(d, S, books);
      body.querySelector("#bk-sl").innerHTML = '<p style="margin-top:20px;font-weight:500">' + JOURS[d.getDay()].charAt(0).toUpperCase() + JOURS[d.getDay()].slice(1) + " " + d.getDate() + " " + MOIS[d.getMonth()] + '</p><div class="slots">' +
        sl.map(function (m) { return '<button type="button" data-m="' + m + '" class="' + (st.day === k && st.min === m ? "sel" : "") + '">' + hm(m) + "</button>"; }).join("") + "</div>";
      body.querySelectorAll(".slots button").forEach(function (b) { b.onclick = function () { st.min = +b.getAttribute("data-m"); st.day = k; st.label = JOURS[d.getDay()] + " " + d.getDate() + " " + MOIS[d.getMonth()] + " à " + hm(st.min); dlg.querySelector("#bk-c").textContent = st.label; showSlots(k); }; });
    }
    body.querySelectorAll(".cal button.av").forEach(function (b) { b.onclick = function () { body.querySelectorAll(".cal button").forEach(function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); if (st.day !== b.getAttribute("data-k")) { st.min = null; } st.day = b.getAttribute("data-k"); showSlots(st.day); }; });
    if (st.day && body.querySelector('[data-k="' + st.day + '"].av')) showSlots(st.day);
    body.querySelector("#bk-b").onclick = s1;
    body.querySelector("#bk-n").onclick = function () { if (st.min == null || !st.day) return err("Choisissez un jour puis un horaire."); s3(); };
  }

  function s3() {
    steps(3);
    body.innerHTML = '<h3>Vos coordonnées.</h3><p class="small" style="margin:-8px 0 8px">Créneau choisi : <b style="color:var(--ink);font-weight:500">' + st.label + "</b></p>" +
      '<div class="bf"><label for="bk-nom">Nom et prénom</label><input id="bk-nom" autocomplete="name" value="' + (st.nom || "") + '"></div>' +
      '<div class="bf"><label for="bk-mail">E-mail professionnel</label><input id="bk-mail" type="email" autocomplete="email" value="' + (st.mail || "") + '"></div>' +
      '<div class="bf"><label for="bk-tel">Téléphone</label><input id="bk-tel" type="tel" autocomplete="tel" value="' + (st.tel || "") + '"></div>' +
      '<div class="bf"><label for="bk-mode">Format</label><select id="bk-mode"><option>Visio</option><option>Téléphone</option></select></div>' +
      '<label style="display:flex;gap:10px;margin-top:16px;font-size:.88rem;color:var(--ink-2)"><input type="checkbox" id="bk-ok" style="width:20px;height:20px;accent-color:var(--brand);flex:none">J\'accepte que Leadvice utilise ces informations pour me recontacter au sujet de ma demande.</label>' +
      '<div class="bk-nav"><button class="btn btn-ghost" type="button" id="bk-b">Retour</button><button class="btn btn-main" type="button" id="bk-n">Confirmer le rendez-vous</button></div>';
    body.querySelector("#bk-b").onclick = s2;
    body.querySelector("#bk-n").onclick = function () {
      var nom = body.querySelector("#bk-nom").value.trim(), mail = body.querySelector("#bk-mail").value.trim(), tel = body.querySelector("#bk-tel").value.trim();
      if (!nom) { body.querySelector("#bk-nom").focus(); return err("Ce champ est nécessaire pour vous répondre."); }
      if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(mail)) { body.querySelector("#bk-mail").focus(); return err("Indiquez une adresse e-mail professionnelle, par exemple nom@entreprise.ma"); }
      if (tel && tel.replace(/\D/g, "").length < 9) { body.querySelector("#bk-tel").focus(); return err("Indiquez un numéro joignable, par exemple +212 6 00 00 00 00"); }
      if (!body.querySelector("#bk-ok").checked) return err("Nous avons besoin de votre accord pour vous recontacter.");
      st.nom = nom; st.mail = mail; st.tel = tel; st.mode = body.querySelector("#bk-mode").value;
      var b = this; b.disabled = true; b.textContent = "Réservation en cours…";
      setTimeout(function () {
        var books = load(BK, []); books.push({ date: st.day, min: st.min, label: st.label, nom: st.nom, ent: st.ent, mail: st.mail, enjeu: st.enjeu, bud: st.bud, mode: st.mode, at: Date.now() }); save(BK, books);
        done();
      }, 700);
    };
  }

  function done() {
    steps(4);
    var TXT = { leads: "générer plus de leads qualifiés", conv: "transformer plus de contacts en clients", strat: "savoir où aller, et par quoi commencer", crea: "trouver le message qui fait agir", pilot: "transformer vos chiffres en décisions", autre: "noté, nous le regardons de près" };
    body.innerHTML = '<div class="bk-ok"><h3>C\'est réservé.</h3><svg viewBox="0 0 600 90" aria-hidden="true"><path id="bk-p" d="M10 70 C 120 70, 150 20, 260 28 S 430 80, 590 22" fill="none" stroke="#7B61FF" stroke-width="2"/><circle cx="590" cy="22" r="6" fill="#7B61FF"/></svg>' +
      '<p class="big-text" style="font-size:clamp(1.6rem,1.2rem + 1.4vw,2.4rem);color:var(--brand)">' + st.label.charAt(0).toUpperCase() + st.label.slice(1) + ", en " + st.mode.toLowerCase() + ".</p>" +
      '<p style="margin-top:16px;color:var(--ink-2)">Votre enjeu : ' + TXT[st.enjeu] + ". Vous recevez une invitation par e-mail à " + st.mail + ", avec un lien pour déplacer ou annuler le rendez-vous. Un rappel part la veille.</p>" +
      '<p class="small" style="margin-top:16px">Prototype : aucun e-mail n\'est envoyé, la réservation reste dans ce navigateur et apparaît dans la page d\'administration de démonstration.</p>' +
      '<div class="bk-nav"><a class="tlink" href="insights.html">En attendant, à lire</a><button class="btn btn-ghost" type="button" id="bk-f">Fermer</button></div></div>';
    var p = body.querySelector("#bk-p"), L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    requestAnimationFrame(function () { p.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.65,0,.35,1)"; p.style.strokeDashoffset = 0; });
    body.querySelector("#bk-f").onclick = close;
  }

  var opener = null;
  function open(e) { if (e) e.preventDefault(); opener = document.activeElement; st = {}; dlg.querySelector("#bk-c").textContent = "à choisir"; s1(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); var f = dlg.querySelector("input"); if (f) f.focus(); }
  function close() { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); if (opener && opener.focus) opener.focus(); }
  dlg.querySelector(".bk-x").onclick = close;
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="diagnostic.html"]');
    if (a && !a.hasAttribute("data-page-link")) open(e);
  });
})();
