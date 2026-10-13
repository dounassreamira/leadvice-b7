/* Atelier Acquisition : pilotez une campagne pendant huit semaines simulees.
   Modele pedagogique simplifie : les chiffres sont fictifs, les mecanismes sont ceux d'une vraie campagne
   (fatigue des annonces, phase d'apprentissage, plafond des recherches Google, qualification, vitesse de rappel). */
(function () {
  "use strict";
  var app = document.querySelector('[data-app="acq"]');
  if (!app) return;
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY = "lv-atelier-acq-v1";
  var WEEKS = 8;
  function fmt(n, d) { return Number(n).toLocaleString("fr-FR", { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }

  /* ---------- les trois clients fictifs ---------- */
  var SC = {
    immo: {
      name: "Un promoteur immobilier", pitch: "Une résidence de 120 appartements en périphérie de Casablanca. Il faut remplir les visites du samedi.",
      budget: 12000, cpm: 24, ctr: .012, cvrM: .10, cvrG: .08, cpc: 5.5, demand: 900, qM: .32, qG: .55, close: .30,
      unit: ["visite", "visites"], res: "Visites confirmées", lead: "Demandes",
      angle: ["« Un cadre de vie d'exception »", "« Votre trois pièces à 25 minutes du centre »", "« À partir de 690 000 DH »"],
      offer: ["Réserver une visite samedi", "Télécharger la brochure", "Nous contacter"],
      form: ["Prénom, téléphone, créneau de visite", "Les mêmes, plus : « Pour habiter ou pour investir ? »", "Neuf champs, dont revenus, apport et profession"]
    },
    ecom: {
      name: "Une marque de bijoux en ligne", pitch: "Des bracelets en pierre naturelle, livrés partout au Maroc, paiement à la livraison. Il faut des commandes livrées, pas seulement passées.",
      budget: 5000, cpm: 14, ctr: .015, cvrM: .045, cvrG: .05, cpc: 2.8, demand: 900, qM: .70, qG: .80, close: .85,
      unit: ["commande livrée", "commandes livrées"], res: "Commandes livrées", lead: "Commandes passées",
      angle: ["« Des bijoux qui vous ressemblent »", "« Pierre naturelle, livrée en 48 h, payée à la livraison »", "« -40 % sur tout le site »"],
      offer: ["Commander, paiement à la livraison", "-15 % sur la première commande", "Rejoindre la liste WhatsApp"],
      form: ["Nom, téléphone, ville", "Les mêmes, plus une confirmation par WhatsApp", "Création de compte obligatoire avant de commander"]
    },
    form: {
      name: "Une école de formation", pitch: "Des formations du soir pour salariés, à Casablanca. Il faut des inscriptions à la rentrée.",
      budget: 7000, cpm: 18, ctr: .012, cvrM: .09, cvrG: .07, cpc: 4, demand: 700, qM: .30, qG: .50, close: .22,
      unit: ["inscription", "inscriptions"], res: "Inscriptions", lead: "Demandes",
      angle: ["« L'excellence au service de votre avenir »", "« Un diplôme reconnu, le soir, sans quitter votre poste »", "« Inscription offerte ce mois-ci »"],
      offer: ["Réserver une séance d'information", "Télécharger le programme", "Demander à être rappelé"],
      form: ["Prénom, téléphone, formation visée", "Les mêmes, plus : « Salarié, indépendant ou étudiant ? »", "Neuf champs, dont diplôme, CV et motivation"]
    }
  };

  /* ---------- les decisions de preparation ----------
     rank : 1 bon choix, 2 defendable, 3 a revoir. m : effets sur le modele. */
  var STEPS = [
    { id: "aud", lever: "Stratégie", q: "Qui ciblez-vous ?", help: "La cible décide de qui voit vos annonces. Elle joue sur le prix, le volume et la qualité des leads.",
      opts: [
        { t: "Large", d: "Toute la ville, 25 à 55 ans. Beaucoup de monde, l'algorithme cherche seul.", rank: 2, m: { ctr: .9, q: .75, fat: .7 }, l: "Une cible large coûte peu par clic mais ramène des curieux. Elle marche quand le formulaire trie derrière." },
        { t: "Précise", d: "Centres d'intérêt et comportements proches de votre offre.", rank: 2, m: { ctr: 1.1, q: 1.1, fat: 1.3 }, l: "Une cible précise améliore la qualité, mais l'audience s'épuise plus vite : les annonces fatiguent plus tôt." },
        { t: "Similaire à vos clients", d: "Construite à partir de votre fichier de clients existants.", rank: 1, m: { ctr: 1.15, q: 1.25, fat: 1, cpm: 1.08 }, l: "Partir de vos vrais clients donne les meilleurs leads. Le coût par mille est un peu plus haut, le coût par client plus bas." }
      ] },
    { id: "angle", lever: "Stratégie", q: "Quel message mettez-vous en avant ?", help: "L'angle décide qui s'arrête sur l'annonce, et ce qu'il attend ensuite.",
      opts: [
        { k: 0, rank: 3, m: { ctr: .75, q: .9 }, l: "Une promesse vague ne dit pas au prospect si l'offre est pour lui. Moins de clics, et des clics moins sûrs." },
        { k: 1, rank: 1, m: { ctr: 1.15, q: 1.15 }, l: "Un bénéfice concret (une distance, un délai, un format) fait cliquer les bonnes personnes." },
        { k: 2, rank: 2, m: { ctr: 1.3, q: .8 }, l: "Le prix d'appel fait cliquer beaucoup, y compris des chasseurs de bonnes affaires qui n'achèteront pas." }
      ] },
    { id: "offer", lever: "Stratégie", q: "Que demandez-vous au prospect ?", help: "L'action demandée est ce que le prospect reçoit en échange de ses coordonnées.",
      opts: [
        { k: 0, rank: 1, m: { cvr: .85, q: 1.25 }, l: "Une action engageante (une visite, une commande, une séance) donne moins de leads, mais des leads qui avancent." },
        { k: 1, rank: 2, m: { cvr: 1.35, q: .75 }, l: "Un contenu ou une remise attire du volume. Ces leads demandent plus de relances avant d'acheter." },
        { k: 2, rank: 3, m: { cvr: .7, q: .95 }, l: "« Nous contacter » ne dit pas ce qui se passe après le clic. Le prospect hésite, et part." }
      ] },
    { id: "crea", lever: "Création", q: "Quel visuel lancez-vous ?", help: "Le visuel arrête le pouce dans le fil. Il décide aussi combien de temps l'annonce tient avant de lasser.",
      opts: [
        { t: "Photo réelle, texte court", d: "Une image du produit ou du lieu, une phrase.", rank: 2, m: { ctr: 1.05, fat: 1 }, l: "Une photo réelle inspire confiance. Elle se lasse au rythme normal." },
        { t: "Vidéo verticale de 15 secondes", d: "Le produit en situation, le message dans les trois premières secondes.", rank: 1, m: { ctr: 1.25, cpm: 1.05, fat: .8 }, l: "La vidéo courte arrête mieux le défilement et se lasse moins vite. Les trois premières secondes font tout." },
        { t: "Visuel chargé", d: "Logo, slogan, cinq arguments et le numéro de téléphone.", rank: 3, m: { ctr: .78, fat: 1.2 }, l: "Trop de texte dans l'image : on ne lit rien en défilant. Une idée par annonce." }
      ] },
    { id: "frm", lever: "Sites web", q: "Quel formulaire mettez-vous derrière ?", help: "Le formulaire décide combien de prospects vont au bout, et ce que vous savez d'eux.",
      opts: [
        { k: 0, rank: 2, m: { cvr: 1.2, q: .9 }, l: "Trois champs : le maximum de leads. La qualification se fait au téléphone." },
        { k: 1, rank: 1, m: { cvr: 1.05, q: 1.3 }, l: "Une seule question de qualification bien choisie trie sans faire fuir. C'est souvent le meilleur compromis." },
        { k: 2, rank: 3, m: { cvr: .55, q: 1.1 }, l: "Neuf champs : la plupart abandonnent avant la fin, sur mobile surtout. On qualifie au téléphone, pas dans le formulaire." }
      ] },
    { id: "split", lever: "Acquisition", q: "Comment répartissez-vous le budget ?", help: "Meta va chercher des gens qui ne vous cherchent pas encore. Google répond à ceux qui cherchent déjà, mais leur nombre est limité.", slider: true }
  ];

  /* ---------- actions possibles chaque semaine ---------- */
  var ACTIONS = {
    keep: { t: "Ne rien changer", d: "Laisser les campagnes apprendre et stabiliser les coûts.", lever: "Pilotage" },
    refresh: { t: "Renouveler les annonces", d: "Nouveau visuel, même message. Remet les compteurs de fatigue à zéro.", lever: "Création" },
    qualif: { t: "Ajouter une question de qualification", d: "Une question de plus dans le formulaire pour trier les leads.", lever: "Sites web", once: true },
    speed: { t: "Rappeler chaque lead en moins d'une heure", d: "Organiser l'équipe pour rappeler vite, pendant que le prospect y pense.", lever: "Pilotage", once: true },
    scale: { t: "Augmenter le budget de 20 %", d: "Pour toutes les semaines restantes.", lever: "Acquisition" },
    cut: { t: "Baisser le budget de 20 %", d: "Pour toutes les semaines restantes.", lever: "Acquisition" },
    exclude: { t: "Exclure les mauvais profils", d: "Retirer de la cible les leads non qualifiés déjà reçus et leurs profils proches.", lever: "Acquisition", once: true },
    abtest: { t: "Tester une seconde accroche", d: "Deux versions du texte en parallèle ; on garde la meilleure.", lever: "Création", once: true },
    landing: { t: "Accélérer la page d'atterrissage", d: "Images compressées, moins de scripts : la page s'affiche en moins de 2 secondes.", lever: "Sites web", once: true },
    retarget: { t: "Relancer les visiteurs", d: "Une annonce pour ceux qui ont vu la page sans remplir le formulaire.", lever: "Acquisition", once: true }
  };
  var EVENTS = [
    { t: "Un concurrent lance une grosse promotion.", d: "Votre taux de clic baisse cette semaine.", m: { ctr: .85 } },
    { t: "Le soir, votre audience est plus en ligne que d'habitude.", d: "Les annonces de fin de journée touchent plus de monde cette semaine.", m: { ctr: 1.1 } },
    { t: "L'équipe commerciale est réduite pendant deux jours.", d: "Les rappels prennent du retard cette semaine.", m: { close: .75 }, speedSaves: true },
    { t: "Les enchères Google montent.", d: "Un concurrent enchérit sur vos mots-clés : le coût par clic grimpe cette semaine.", m: { cpc: 1.25 } },
    { t: "Le formulaire a été en panne quelques heures.", d: "Une partie des visiteurs n'a pas pu l'envoyer.", m: { cvr: .85 } },
    { t: "Un article de presse parle de votre secteur.", d: "Plus de recherches sur Google cette semaine.", m: { demand: 1.2 } }
  ];

  /* ---------- etat ---------- */
  var S = null;
  function fresh(sc) {
    var r = rng(sc.length * 7919 + Date.now() % 100000);
    var ev = []; var pool = EVENTS.map(function (_, i) { return i; });
    for (var w = 1; w <= WEEKS; w++) ev.push(null);
    for (var k = 0; k < 4; k++) { var i = Math.floor(r() * pool.length); var e = pool.splice(i, 1)[0]; var wk; do { wk = 1 + Math.floor(r() * (WEEKS - 1)); } while (ev[wk] !== null); ev[wk] = e; }
    return { sc: sc, step: 0, ch: {}, split: .5, week: 0, hist: [], base: [], acts: [], perm: {}, budgetMul: 1, wsr: 0, events: ev, seed: Math.floor(r() * 1e6), screen: "setup" };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function opt(stepId) { var st = STEPS.filter(function (s) { return s.id === stepId; })[0]; return st.opts[S.ch[stepId]]; }
  function mods() {
    var m = { ctr: 1, q: 1, cvr: 1, cpm: 1, fat: 1, close: 1, cvrG: 1, qG: 1 };
    ["aud", "angle", "offer", "crea", "frm"].forEach(function (id) { var o = opt(id).m; for (var k in o) m[k] = (m[k] || 1) * o[k]; });
    return m;
  }

  /* le modele d'une semaine ; withActions = false pour la campagne de reference */
  function simWeek(w, ctx) {
    var sc = SC[S.sc], m = mods(), r = rng(S.seed + w * 101 + (ctx.ref ? 7 : 0));
    var noise = function () { return ctx.ref ? 1 : .94 + r() * .12; };
    var P = ctx.perm || {}, ev = S.events[w] !== null && S.events[w] !== undefined ? EVENTS[S.events[w]] : null, em = ev ? ev.m : {};
    var budget = sc.budget * (ctx.budgetMul || 1);
    var split = ctx.split, Bm = budget * split, Bg = budget * (1 - split);
    var learn = ctx.learn ? .86 : 1;
    var fat = 1 / (1 + .085 * ctx.wsr * m.fat);
    var ctr = sc.ctr * m.ctr * (P.abtest ? 1.08 : 1) * (em.ctr || 1) * fat * learn;
    var cpm = sc.cpm * m.cpm * (P.exclude ? 1.03 : 1);
    var imp = Bm / cpm * 1000;
    var clM = imp * ctr * noise();
    var cvrM = sc.cvrM * m.cvr * (P.qualif ? .9 : 1) * (em.cvr || 1) * (P.landing ? 1.05 : 1);
    var leadsM = clM * cvrM * (P.retarget ? 1.07 : 1);
    var demand = sc.demand * (em.demand || 1), cpc = sc.cpc * (em.cpc || 1);
    var clG = Bg > 0 ? demand * (1 - Math.exp(-Bg / (demand * cpc))) * noise() : 0;
    var cvrG = sc.cvrG * Math.min(1.25, m.cvr) * (P.qualif ? .92 : 1) * (em.cvr || 1) * (P.landing ? 1.18 : 1);
    var leadsG = clG * cvrG;
    var qBoost = (P.qualif ? 1.2 : 1) * (P.exclude ? 1.1 : 1);
    var qM = Math.min(.95, sc.qM * m.q * qBoost), qG = Math.min(.95, sc.qG * Math.sqrt(m.q) * qBoost);
    var qual = leadsM * qM + leadsG * qG;
    var close = sc.close * (P.speed ? 1.35 : 1) * (em.close && !(ev.speedSaves && P.speed) ? em.close : 1);
    var res = qual * Math.min(.95, close);
    return { w: w, spend: budget, imp: imp, clicks: clM + clG, clG: clG, demand: demand, leads: leadsM + leadsG, qual: qual, res: res, fat: fat, learn: !!ctx.learn, split: split, ctr: (clM / Math.max(1, imp)) };
  }

  /* ---------- rendu ---------- */
  function h(tag, html, cls) { return "<" + tag + (cls ? ' class="' + cls + '"' : "") + ">" + html + "</" + tag + ">"; }
  function render(focusSel) {
    var out;
    if (!S) out = intro();
    else if (S.screen === "setup") out = setup();
    else if (S.screen === "launch") out = launch();
    else if (S.screen === "week") out = week();
    else out = final();
    app.innerHTML = out;
    bind();
    var f = app.querySelector(focusSel || "[data-focus]") || app.querySelector("h3");
    if (f) { if (!f.hasAttribute("tabindex") && !/^(BUTTON|A|INPUT)$/.test(f.tagName)) f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true }); }
  }
  function top() { var y = app.getBoundingClientRect().top + scrollY - 100; if (Math.abs(scrollY - y) > 40) { if (window.__lenis) window.__lenis.scrollTo(y, { immediate: RM }); else scrollTo({ top: y, behavior: RM ? "auto" : "smooth" }); } }
  function bar(i, n, label) { return '<div class="at-prog"><span>' + label + '</span><div class="at-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + i + '" aria-label="' + esc(label) + '"><i style="width:' + (i / n * 100) + '%"></i></div></div>'; }

  function intro() {
    var saved = load(), resume = "";
    if (saved && saved.sc && saved.screen !== "final") resume = '<div class="at-resume"><p>Une partie est en cours avec ' + esc(SC[saved.sc].name.toLowerCase()) + (saved.screen === "week" ? ", semaine " + (saved.week + 1) + " sur " + WEEKS : ", en préparation") + '.</p><button class="btn btn-main" type="button" data-act="resume">Reprendre la partie</button></div>';
    return '<div class="at-screen">' + resume + h("h3", "Choisissez votre client", "at-h") +
      '<p class="at-p">Vous préparez la campagne en six décisions, puis vous la pilotez pendant huit semaines. À chaque semaine, un tableau de bord, un imprévu parfois, et une décision. Comptez 10 à 15 minutes.</p>' +
      '<div class="at-cards">' + Object.keys(SC).map(function (k) { var s = SC[k]; return '<button type="button" class="at-card" data-sc="' + k + '"><b>' + s.name + '</b><span>' + s.pitch + '</span><em>Budget : ' + fmt(s.budget) + ' DH par semaine</em></button>'; }).join("") + "</div>" +
      '<p class="at-note">Simulation pédagogique : les clients et les chiffres sont fictifs. Les mécanismes sont ceux que nous voyons sur de vraies campagnes.</p></div>';
  }

  function setup() {
    var st = STEPS[S.step], sc = SC[S.sc], body;
    if (st.slider) {
      var v = Math.round(S.split * 100);
      body = '<div class="at-split"><label for="at-split">Part du budget sur Meta</label><input type="range" id="at-split" min="0" max="100" step="5" value="' + v + '" data-focus><div class="at-split-o"><span>Meta <b data-o="m">' + v + ' %</b> <small data-o="mdh">' + fmt(sc.budget * v / 100) + ' DH</small></span><span>Google <b data-o="g">' + (100 - v) + ' %</b> <small data-o="gdh">' + fmt(sc.budget * (100 - v) / 100) + ' DH</small></span></div></div>' +
        '<div class="at-acts"><button class="btn btn-ghost" type="button" data-act="back">Retour</button><button class="btn btn-main" type="button" data-act="next">Voir le plan</button></div>';
    } else {
      body = '<fieldset class="at-opts"><legend class="sr">' + esc(st.q) + '</legend>' + st.opts.map(function (o, i) {
        var t = o.t || sc[st.id === "frm" ? "form" : st.id][o.k], d = o.d || "";
        return '<label class="at-opt"><input type="radio" name="o" value="' + i + '"' + (S.ch[st.id] === i ? " checked" : "") + (i === 0 ? " data-focus" : "") + '><span><b>' + esc(t) + '</b>' + (d ? '<small>' + esc(d) + '</small>' : "") + '</span></label>';
      }).join("") + '</fieldset><div class="at-acts">' + (S.step > 0 ? '<button class="btn btn-ghost" type="button" data-act="back">Retour</button>' : '<button class="btn btn-ghost" type="button" data-act="quit">Changer de client</button>') +
        '<button class="btn btn-main" type="button" data-act="next"' + (S.ch[st.id] === undefined ? " disabled" : "") + '>Décision suivante</button></div>';
    }
    return '<div class="at-screen">' + bar(S.step + 1, STEPS.length, "Préparation, décision " + (S.step + 1) + " sur " + STEPS.length) +
      '<p class="at-lever">Levier : ' + st.lever + '</p>' + h("h3", st.q, "at-h") + '<p class="at-p">' + st.help + "</p>" + body + "</div>";
  }

  function launch() {
    var sc = SC[S.sc];
    var row = function (lab, id) { var o = opt(id); return '<div class="blk"><h4>' + lab + "</h4><p>" + esc(o.t || sc[id === "frm" ? "form" : id][o.k]) + "</p></div>"; };
    return '<div class="at-screen">' + bar(STEPS.length, STEPS.length, "Préparation terminée") + h("h3", "Votre plan de campagne", "at-h") +
      '<p class="at-p">Relisez-le. Une fois lancé, vous ne pourrez plus changer la cible, le message ni l\'offre : seulement piloter.</p>' +
      '<div class="at-plan"><div class="lv-blocks">' + row("Cible", "aud") + row("Message", "angle") + row("Action demandée", "offer") + row("Visuel", "crea") + row("Formulaire", "frm") +
      '<div class="blk"><h4>Répartition</h4><p>Meta ' + Math.round(S.split * 100) + " %, Google " + Math.round((1 - S.split) * 100) + " %, sur " + fmt(sc.budget) + " DH par semaine</p></div></div></div>" +
      '<div class="at-acts"><button class="btn btn-ghost" type="button" data-act="back">Modifier</button><button class="btn btn-main" type="button" data-act="go" data-focus>Lancer la campagne</button></div></div>';
  }

  function kpis(r, prev, sc) {
    var cpr = r.spend / Math.max(.1, r.res), cpl = r.spend / Math.max(1, r.leads);
    function d(a, b, inv) { if (!prev) return ""; var x = (a - b) / Math.max(.0001, b) * 100; if (Math.abs(x) < 1) return '<small class="eq">stable</small>'; var good = inv ? x < 0 : x > 0; return '<small class="' + (good ? "up" : "dn") + '">' + (x > 0 ? "+" : "") + fmt(x) + " %</small>"; }
    return '<div class="at-kpis">' +
      '<div><span>Dépensé</span><b>' + fmt(r.spend) + ' DH</b></div>' +
      '<div><span>Clics</span><b>' + fmt(r.clicks) + "</b>" + (prev ? d(r.clicks, prev.clicks) : "") + "</div>" +
      '<div><span>' + sc.lead + '</span><b>' + fmt(r.leads) + "</b>" + (prev ? d(r.leads, prev.leads) : "") + "</div>" +
      '<div><span>Leads qualifiés</span><b>' + fmt(r.qual) + "</b>" + (prev ? d(r.qual, prev.qual) : "") + "</div>" +
      '<div class="hl"><span>' + sc.res + '</span><b>' + fmt(r.res) + "</b>" + (prev ? d(r.res, prev.res) : "") + "</div>" +
      '<div class="hl"><span>Coût par ' + sc.unit[0] + '</span><b>' + fmt(cpr) + " DH</b>" + (prev ? d(cpr, prev.spend / Math.max(.1, prev.res), true) : "") + "</div>" +
      '</div><p class="at-sub">Coût par lead : ' + fmt(cpl, 1) + " DH. Part de leads qualifiés : " + fmt(r.qual / Math.max(1, r.leads) * 100) + " %.</p>";
  }
  function chart() {
    var H = S.hist, B = S.base, max = 1;
    H.concat(B).forEach(function (r) { max = Math.max(max, r.res); });
    var w = 100 / WEEKS, sc = SC[S.sc];
    var bars = "";
    for (var i = 0; i < WEEKS; i++) {
      var r = H[i], b = B[i];
      var x = i * w;
      if (b) bars += '<rect x="' + (x + w * .14).toFixed(2) + '" y="' + (100 - b.res / max * 92).toFixed(2) + '" width="' + (w * .3).toFixed(2) + '" height="' + (b.res / max * 92).toFixed(2) + '" class="b0"/>';
      if (r) bars += '<rect x="' + (x + w * .48).toFixed(2) + '" y="' + (100 - r.res / max * 92).toFixed(2) + '" width="' + (w * .38).toFixed(2) + '" height="' + (r.res / max * 92).toFixed(2) + '" class="b1"/>';
    }
    var tbl = '<table class="sr"><caption>' + sc.res + ' par semaine</caption><tr><th>Semaine</th><th>Vous</th><th>Référence</th></tr>' + H.map(function (r, i) { return "<tr><td>" + (i + 1) + "</td><td>" + fmt(r.res) + "</td><td>" + fmt(B[i].res) + "</td></tr>"; }).join("") + "</table>";
    return '<figure class="at-chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + bars + '</svg><div class="at-weeks" aria-hidden="true">' + Array.apply(null, Array(WEEKS)).map(function (_, i) { return "<span>S" + (i + 1) + "</span>"; }).join("") + '</div><figcaption><span><i class="k1"></i>Votre campagne</span><span><i class="k0"></i>Campagne de référence, réglée par défaut</span></figcaption>' + tbl + "</figure>";
  }
  function comments(r, prev) {
    var sc = SC[S.sc], c = [];
    if (r.learn) c.push("Gros changement de répartition : les campagnes Meta repartent en apprentissage, cette semaine coûte plus cher. Changez par petites touches.");
    if (r.fat < .74) c.push("Le taux de clic baisse : vos annonces tournent depuis " + S.wsr + " semaines et la cible les a vues plusieurs fois. Il est temps de les renouveler.");
    if (r.qual / Math.max(1, r.leads) < .38 && !S.perm.qualif) c.push("Beaucoup de leads, peu de qualifiés. Le formulaire ne trie pas assez : vos commerciaux appellent des curieux.");
    if (r.clG / Math.max(1, r.demand) > .82 && r.split < .5) c.push("Sur Google, vous captez déjà presque toutes les recherches. Chaque dirham en plus y coûte plus cher que le précédent.");
    if (r.split > .85) c.push("Google est presque à l'arrêt, alors que des gens cherchent déjà ce que vous vendez. Ce sont souvent les leads les plus chauds.");
    if (!S.perm.speed && S.week >= 2 && c.length < 2) c.push("Les leads attendent qu'on les rappelle. Plus le rappel est rapide, plus ils avancent : c'est souvent le levier le moins cher.");
    if (prev && c.length < 2) { var a = prev.spend / Math.max(.1, prev.res), b = r.spend / Math.max(.1, r.res), x = (b - a) / a * 100; if (x < -3) c.push("Le coût par " + sc.unit[0] + " baisse de " + fmt(-x) + " % : gardez ce qui marche."); else if (x > 3 && c.length === 0) c.push("Le coût par " + sc.unit[0] + " monte de " + fmt(x) + " %. Regardez d'abord le taux de clic, puis la part de leads qualifiés."); }
    if (!c.length) c.push("Semaine stable. Une campagne qui tient demande surtout de la régularité.");
    return c.slice(0, 2);
  }
  function offerActions() {
    var r = rng(S.seed + S.week * 31), last = S.hist[S.hist.length - 1], picks = ["keep"];
    var want = [];
    if (last && last.fat < .8) want.push("refresh");
    if (last && last.qual / Math.max(1, last.leads) < .45 && !S.perm.qualif) want.push("qualif");
    if (!S.perm.speed && S.week >= 1) want.push("speed");
    var pool = Object.keys(ACTIONS).filter(function (k) { return k !== "keep" && !(ACTIONS[k].once && S.perm[k]) && want.indexOf(k) < 0 && !(k === "refresh" && S.wsr < 2); });
    want.forEach(function (k) { if (picks.length < 3) picks.push(k); });
    while (picks.length < 3 && pool.length) picks.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
    return picks;
  }
  function week() {
    var sc = SC[S.sc], r = S.hist[S.hist.length - 1], prev = S.hist[S.hist.length - 2];
    var ev = S.events[S.week + 1] !== null && S.week + 1 < WEEKS ? EVENTS[S.events[S.week + 1]] : null;
    var acts = offerActions(), v = Math.round(S.split * 100);
    var head = bar(S.week + 1, WEEKS, "Semaine " + (S.week + 1) + " sur " + WEEKS);
    var res = h("h3", "Bilan de la semaine " + (S.week + 1), "at-h") + kpis(r, prev, sc) + chart() +
      '<div class="at-read">' + comments(r, prev).map(function (c) { return "<p>" + c + "</p>"; }).join("") + "</div>";
    if (S.week + 1 >= WEEKS) return '<div class="at-screen">' + head + res + '<div class="at-acts"><button class="btn btn-main" type="button" data-act="end" data-focus>Voir le bilan de la campagne</button></div></div>';
    var evh = ev ? '<div class="at-ev" role="note"><b>Semaine ' + (S.week + 2) + " : " + ev.t + "</b><span>" + ev.d + "</span></div>" : "";
    var dec = '<div class="at-dec"><h4>Votre décision pour la semaine ' + (S.week + 2) + "</h4>" + evh +
      '<fieldset class="at-opts at-opts-sm"><legend class="sr">Une action pour la semaine suivante</legend>' + acts.map(function (k, i) { var a = ACTIONS[k]; return '<label class="at-opt"><input type="radio" name="a" value="' + k + '"' + (i === 0 ? " checked" : "") + '><span><b>' + a.t + '</b><small>' + a.d + '</small><em>' + a.lever + "</em></span></label>"; }).join("") + "</fieldset>" +
      '<div class="at-split at-split-sm"><label for="at-split">Répartition du budget (Meta / Google)</label><input type="range" id="at-split" min="0" max="100" step="5" value="' + v + '"><div class="at-split-o"><span>Meta <b data-o="m">' + v + ' %</b></span><span>Google <b data-o="g">' + (100 - v) + " %</b></span></div></div>" +
      '<div class="at-acts"><button class="btn btn-main" type="button" data-act="run">Lancer la semaine ' + (S.week + 2) + "</button></div></div>";
    return '<div class="at-screen">' + head + res + dec + "</div>";
  }

  function sum(a, k) { return a.reduce(function (s, r) { return s + r[k]; }, 0); }
  function final() {
    var sc = SC[S.sc], H = S.hist, B = S.base;
    var res = sum(H, "res"), spend = sum(H, "spend"), bres = sum(B, "res"), bspend = sum(B, "spend");
    var cpr = spend / Math.max(.1, res), bcpr = bspend / Math.max(.1, bres);
    var ratio = bcpr / cpr;
    var grade = ratio >= 3 ? ["A", "Campagne de cabinet."] : ratio >= 2 ? ["B", "Très bon pilotage."] : ratio >= 1.15 ? ["C", "Correct, avec de la marge."] : ["D", "La campagne a coûté plus qu'elle n'aurait dû."];
    var rows = ["aud", "angle", "offer", "crea", "frm"].map(function (id) {
      var st = STEPS.filter(function (s) { return s.id === id; })[0], o = opt(id), t = o.t || sc[id === "frm" ? "form" : id][o.k];
      var v = o.rank === 1 ? ["ok", "Bon choix"] : o.rank === 2 ? ["mid", "Défendable"] : ["ko", "À revoir"];
      return '<li><span class="at-v ' + v[0] + '">' + v[1] + "</span><div><b>" + st.q + "</b> " + esc(t) + "<p>" + o.l + "</p></div></li>";
    });
    var nRef = S.acts.filter(function (a) { return a === "refresh"; }).length;
    var piv = [];
    piv.push(S.perm.speed ? "Vous avez organisé le rappel rapide : c'est le levier qui coûte le moins et rapporte le plus en bas de l'entonnoir." : "Vous n'avez pas accéléré le rappel des leads. Sur une vraie campagne, c'est souvent la première chose que nous corrigeons.");
    piv.push(nRef ? "Vous avez renouvelé les annonces " + nRef + " fois. La fatigue est inévitable ; la surveiller l'est aussi." : "Vous n'avez jamais renouvelé les annonces. Au-delà de trois ou quatre semaines, la même création s'use.");
    if (S.perm.qualif) piv.push("La question de qualification a trié les leads : moins de volume, plus de résultats.");
    var learnN = H.filter(function (r) { return r.learn; }).length;
    if (learnN) piv.push("Vous avez fortement changé la répartition " + learnN + " fois. Chaque gros changement relance la phase d'apprentissage de Meta.");
    return '<div class="at-screen">' + h("h3", "Bilan de la campagne", "at-h") +
      '<div class="at-final"><div class="at-grade"><b>' + grade[0] + "</b><span>" + grade[1] + "</span></div>" +
      '<div class="at-tot"><div><span>' + sc.res + '</span><b><span class="res">' + fmt(res) + "</span></b><small>Référence : " + fmt(bres) + "</small></div>" +
      '<div><span>Coût par ' + sc.unit[0] + '</span><b>' + fmt(cpr) + " DH</b><small>Référence : " + fmt(bcpr) + " DH</small></div>" +
      '<div><span>Budget dépensé</span><b>' + fmt(spend) + " DH</b><small>Sur " + WEEKS + " semaines</small></div></div></div>" +
      chart() + "<h4 class=\"at-h4\">Vos décisions de départ</h4><ul class=\"at-debrief\">" + rows.join("") + "</ul>" +
      '<h4 class="at-h4">Votre pilotage</h4><div class="at-read">' + piv.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</div>" +
      '<div class="at-cta"><p>Sur votre vraie campagne, les mêmes décisions se prennent avec vos chiffres. En 45 minutes, nous regardons lesquelles comptent pour vous.</p><div class="at-acts"><a class="btn btn-main" href="diagnostic.html">Demander un diagnostic</a><button class="btn btn-ghost" type="button" data-act="again">Rejouer avec un autre client</button></div></div></div>';
  }

  /* ---------- interactions ---------- */
  function bind() {
    app.querySelectorAll("[data-sc]").forEach(function (b) { b.addEventListener("click", function () { S = fresh(b.getAttribute("data-sc")); save(); render(); top(); }); });
    app.querySelectorAll('input[name="o"]').forEach(function (i) { i.addEventListener("change", function () { S.ch[STEPS[S.step].id] = +i.value; save(); var n = app.querySelector('[data-act="next"]'); if (n) n.disabled = false; }); });
    var sl = app.querySelector("#at-split");
    if (sl) sl.addEventListener("input", function () {
      var v = +sl.value, sc = SC[S.sc];
      app.querySelector('[data-o="m"]').textContent = v + " %"; app.querySelector('[data-o="g"]').textContent = (100 - v) + " %";
      var a = app.querySelector('[data-o="mdh"]'); if (a) { a.textContent = fmt(sc.budget * v / 100) + " DH"; app.querySelector('[data-o="gdh"]').textContent = fmt(sc.budget * (100 - v) / 100) + " DH"; }
      if (S.screen === "setup") { S.split = v / 100; save(); }
    });
    app.querySelectorAll("[data-act]").forEach(function (b) { b.addEventListener("click", function () { act(b.getAttribute("data-act")); }); });
  }
  function act(a) {
    if (a === "resume") { S = load(); render(); top(); return; }
    if (a === "quit" || a === "again") { clear(); S = null; render(); top(); return; }
    if (a === "back") { if (S.screen === "launch") S.screen = "setup"; else S.step = Math.max(0, S.step - 1); save(); render(); return; }
    if (a === "next") { if (S.step < STEPS.length - 1) S.step++; else S.screen = "launch"; save(); render(); top(); return; }
    if (a === "go") { S.screen = "week"; S.week = 0; S.hist = [simWeek(0, { split: S.split, wsr: 0, perm: {}, budgetMul: 1 })]; S.base = [refWeek(0)]; save(); render(); top(); return; }
    if (a === "run") {
      var k = (app.querySelector('input[name="a"]:checked') || {}).value || "keep";
      var nv = +app.querySelector("#at-split").value / 100;
      var learn = Math.abs(nv - S.split) > .25;
      S.split = nv; S.acts.push(k);
      if (k === "refresh") S.wsr = 0; else S.wsr++;
      if (k === "scale") S.budgetMul *= 1.2;
      if (k === "cut") S.budgetMul *= .8;
      if (ACTIONS[k].once) S.perm[k] = true;
      S.week++;
      var perm = {}; for (var p in S.perm) perm[p] = S.perm[p];
      S.hist.push(simWeek(S.week, { split: S.split, wsr: S.wsr, perm: perm, budgetMul: S.budgetMul, learn: learn }));
      S.base.push(refWeek(S.week));
      save(); render(); top(); return;
    }
    if (a === "end") { S.screen = "final"; save(); render(); top(); return; }
  }
  /* la campagne de reference : reglages courants (cible large, prix d'appel, brochure, photo, formulaire court), 50/50, annonces renouvelees toutes les quatre semaines */
  function refWeek(w) {
    var keep = S.ch; S.ch = { aud: 0, angle: 2, offer: 1, crea: 0, frm: 0 };
    var r = simWeek(w, { ref: true, split: .5, wsr: w % 4, perm: {}, budgetMul: 1 });
    S.ch = keep; return r;
  }

  S = null; render(null);
  /* aucun focus force au chargement de la page */
  if (document.activeElement && app.contains(document.activeElement)) document.activeElement.blur();
})();
