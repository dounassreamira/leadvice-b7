/* Atelier Site web : trois niveaux. Assembler une page qui convertit, trouver les erreurs d'une page, tenir un budget de poids sur mobile.
   Les clients sont fictifs ; les regles sont celles que nous appliquons sur les sites que nous construisons. */
(function () {
  "use strict";
  var app = document.querySelector('[data-app="site"]');
  if (!app) return;
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY = "lv-atelier-site-v1";
  function fmt(n, d) { return Number(n).toLocaleString("fr-FR", { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); }

  var CL = {
    immo: { name: "Un promoteur immobilier", t: ["Bienvenue sur notre site", "L'art de vivre réinventé", "Appartements de 3 pièces à 25 minutes du centre, visites ce samedi"], cta: "Réserver ma visite", s: "Dès 690 000 DH. Visites le samedi, de 10 h à 17 h." },
    ecom: { name: "Une marque de bijoux en ligne", t: ["Bienvenue sur notre boutique", "Révélez votre éclat intérieur", "Bracelets en pierre naturelle, livrés en 48 h, payés à la livraison"], cta: "Commander", s: "Livraison partout au Maroc, retour gratuit sous 7 jours." },
    form: { name: "Une école de formation", t: ["Bienvenue à l'école", "L'excellence au service de votre avenir", "Un diplôme reconnu, en cours du soir, sans quitter votre poste"], cta: "Réserver une séance d'information", s: "Cours de 18 h 30 à 21 h, rentrée en octobre." }
  };

  /* niveau 1 : g = effets sur clarte (cl), confiance (cf), vitesse (sp), conversion (cv) ; kb = poids ajoute */
  var BLOCKS = [
    { id: "t", q: "Le titre", opts: [
      { k: 0, g: { cl: -25, cv: -10 }, why: "« Bienvenue » ne dit ni ce que vous vendez ni à qui. Le visiteur décide en quelques secondes s'il reste." },
      { k: 1, g: { cl: -10 }, why: "Un slogan peut être joli, mais il oblige le visiteur à deviner l'offre. La poésie va dans les images, pas dans le titre." },
      { k: 2, g: { cl: 30, cv: 10 }, why: "Le titre dit ce que le client obtient, avec des mots qu'il tape dans Google. Bon pour la conversion et pour le référencement." }] },
    { id: "s", q: "Le sous-titre", opts: [
      { t: "« Leader depuis 2010, nous mettons notre savoir-faire à votre service. »", g: { cl: -5, cf: -5 }, why: "Parler de soi avant de parler du client. Et « leader » sans preuve affaiblit la confiance." },
      { t: "Une phrase qui répond à la question suivante du visiteur : prix, lieu, délai.", g: { cl: 15, cv: 5 }, why: "Le sous-titre lève la première objection. Le visiteur n'a pas à chercher." },
      { t: "Pas de sous-titre", g: { cl: -5 }, why: "Sans sous-titre, le titre porte tout seul la promesse et les détails. C'est rarement assez." }] },
    { id: "v", q: "Le visuel principal", opts: [
      { t: "Vidéo en lecture automatique (8 Mo)", g: { sp: -35 }, kb: 8000, why: "Une vidéo de 8 Mo en haut de page retarde tout le reste, surtout en 4G. Si vidéo il y a, elle se charge au clic." },
      { t: "Photo réelle, compressée en WebP (120 Ko)", g: { sp: 10, cf: 5 }, kb: 120, why: "Une vraie photo, bien compressée : l'image s'affiche vite et rassure." },
      { t: "Carrousel de six photos (3,5 Mo)", g: { sp: -20, cl: -10 }, kb: 3500, why: "Les visiteurs regardent rarement au-delà de la première image d'un carrousel, qui pèse pourtant six fois plus." }] },
    { id: "b", q: "Le bouton principal", opts: [
      { t: "Envoyer", g: { cv: -10 }, why: "« Envoyer » décrit l'effort, pas ce qu'on reçoit." },
      { t: "En savoir plus", g: { cv: -5, cl: -5 }, why: "« En savoir plus » repousse la décision. Le visiteur ne sait pas ce qui l'attend." },
      { k: "cta", g: { cv: 20, cl: 5 }, why: "Le bouton dit exactement ce qui se passe au clic. On clique plus volontiers quand on sait." }] },
    { id: "p", q: "La preuve", opts: [
      { t: "« N°1 au Maroc »", g: { cf: -20 }, why: "Une affirmation qu'on ne peut pas vérifier fait l'effet inverse : elle éveille la méfiance." },
      { t: "Avis vérifiables et logos de vrais clients", g: { cf: 25, cv: 10 }, why: "Des preuves que le visiteur peut vérifier. Rien ne rassure plus." },
      { t: "Pas de preuve", g: { cf: -5 }, why: "Sans preuve, le visiteur prend tout le risque. Il hésite, et repart comparer." }] },
    { id: "f", q: "Le formulaire", opts: [
      { t: "Trois champs : prénom, téléphone, une précision", g: { cv: 20 }, why: "Trois champs se remplissent en moins d'une minute sur mobile." },
      { t: "Cinq champs, dont une question pour qualifier", g: { cv: 10, cf: 5 }, why: "Une question de qualification bien choisie trie sans décourager. Bon compromis quand l'équipe commerciale est petite." },
      { t: "Onze champs, dont le budget obligatoire", g: { cv: -30, cf: -5 }, why: "Onze champs et une question de budget dès le premier contact : la plupart abandonnent. On qualifie au téléphone." }] },
    { id: "ty", q: "La typographie", opts: [
      { t: "Une famille, deux graisses", g: { sp: 5, cl: 5 }, kb: 60, why: "Une seule famille bien choisie suffit à donner du caractère, et pèse peu." },
      { t: "Quatre polices décoratives", g: { sp: -15, cl: -10 }, kb: 400, why: "Quatre polices, c'est 400 Ko de plus et une page qui parle avec quatre voix." },
      { t: "Police du système, rien à charger", g: { sp: 10, cf: -5 }, kb: 0, why: "Rapide, mais la page ressemble à toutes les autres. La marque y perd un peu." }] },
    { id: "c", q: "Le contact sur mobile", opts: [
      { t: "Boutons d'appel et WhatsApp toujours visibles", g: { cv: 15 }, kb: 6, why: "Sur mobile, beaucoup préfèrent appeler ou écrire. Un pouce suffit." },
      { t: "Numéro en image dans le pied de page", g: { cv: -10, cf: -5 }, kb: 30, why: "Un numéro en image ne se touche pas pour appeler, et ne se lit pas par les moteurs ni les lecteurs d'écran." },
      { t: "Fenêtre de discussion qui s'ouvre toute seule", g: { sp: -15, cv: -5 }, kb: 450, why: "Elle couvre le contenu, pèse lourd et interrompt la lecture. Un bouton discret fait mieux." }] }
  ];

  /* niveau 2 : la page a auditer. bad = probleme a trouver */
  var AUD = [
    { id: "menu", bad: true, why: "Neuf entrées de menu : le visiteur ne sait pas où aller. Cinq au plus, l'action principale à part." },
    { id: "logo", bad: false },
    { id: "pop", bad: true, why: "Une fenêtre d'inscription qui s'ouvre dès l'arrivée, avant même d'avoir lu. Sur mobile, Google pénalise ce genre d'interruption." },
    { id: "h1", bad: true, why: "« Bienvenue » en titre : aucune promesse, aucun mot-clé. Le titre doit dire ce que le client obtient." },
    { id: "low", bad: true, why: "Texte gris clair sur fond blanc : contraste insuffisant, illisible au soleil et pour beaucoup de visiteurs." },
    { id: "img", bad: true, why: "« banniere-finale-v3.png », 3,2 Mo : l'image n'est pas compressée et son nom ne dit rien aux moteurs." },
    { id: "team", bad: false },
    { id: "more", bad: true, why: "Cinq liens « En savoir plus » identiques : ni le visiteur ni Google ne savent où ils mènent." },
    { id: "quote", bad: true, why: "« Super service ! », signé « Client satisfait » : un avis anonyme ne prouve rien. Nom, entreprise, résultat." },
    { id: "hours", bad: false },
    { id: "form", bad: true, why: "Onze champs, dont le budget obligatoire : le formulaire fait fuir avant le premier échange." },
    { id: "btn", bad: true, why: "Le bouton dit « Cliquez ici » : il ne dit pas ce qu'on obtient." },
    { id: "tel", bad: true, why: "Le numéro est une image : impossible de le toucher pour appeler depuis un téléphone." },
    { id: "addr", bad: false },
    { id: "legal", bad: false }
  ];
  var NBAD = AUD.filter(function (a) { return a.bad; }).length;

  /* niveau 3 : budget de poids sur mobile */
  var BASE_KB = 180;
  var ITEMS = [
    { id: "hero", t: "Photo principale en WebP", kb: 120, v: 20 },
    { id: "bgv", t: "Vidéo d'arrière-plan", kb: 6000, v: 6 },
    { id: "car", t: "Carrousel de six photos", kb: 2400, v: 4 },
    { id: "fonts", t: "Trois polices de plus", kb: 300, v: 2 },
    { id: "chat", t: "Fenêtre de discussion", kb: 450, v: 5 },
    { id: "map", t: "Carte interactive intégrée", kb: 700, v: 6 },
    { id: "pix", t: "Outils de mesure Meta et Google", kb: 140, v: 15 },
    { id: "rev", t: "Avis clients vérifiables", kb: 40, v: 14 },
    { id: "wa", t: "Bouton WhatsApp", kb: 6, v: 12 },
    { id: "anim", t: "Animation d'ouverture", kb: 520, v: 3 },
    { id: "vid", t: "Vidéo témoignage, chargée au clic", kb: 25, v: 10 },
    { id: "plan", t: "Plan d'accès en image", kb: 60, v: 6 }
  ];
  var LIMIT = 2.0;
  function lcp(kb) { return .6 + kb / 1100; }
  var BEST = (function () {
    var best = 0;
    for (var m = 0; m < (1 << ITEMS.length); m++) { var kb = BASE_KB, v = 0; for (var i = 0; i < ITEMS.length; i++) if (m & (1 << i)) { kb += ITEMS[i].kb; v += ITEMS[i].v; } if (lcp(kb) <= LIMIT && v > best) best = v; }
    return best;
  })();

  var S;
  function fresh() { return { lvl: 0, cl: null, ch: {}, s1: null, found: [], miss: 0, hints: 0, t0: 0, s2: null, sel: {}, s3: null }; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  S = load() || fresh();

  function top() { var y = app.getBoundingClientRect().top + scrollY - 100; if (Math.abs(scrollY - y) > 40) { if (window.__lenis) window.__lenis.scrollTo(y, { immediate: RM }); else scrollTo({ top: y, behavior: RM ? "auto" : "smooth" }); } }
  function steps() {
    var L = ["Assembler", "Auditer", "Alléger", "Bilan"];
    return '<ol class="st-lv">' + L.map(function (l, i) { var st = i < S.lvl ? "done" : i === S.lvl ? "now" : ""; return '<li class="' + st + '"' + (i === S.lvl ? ' aria-current="step"' : "") + "><b>" + (i < 3 ? "Niveau " + (i + 1) : "Fin") + "</b><span>" + l + "</span></li>"; }).join("") + "</ol>";
  }
  function render(focus) {
    var html = steps();
    if (S.lvl === 0) html += S.cl ? lvl1() : pick();
    else if (S.lvl === 1) html += lvl2();
    else if (S.lvl === 2) html += lvl3();
    else html += fin();
    app.innerHTML = html; bind();
    var f = app.querySelector(focus || "[data-focus]") || app.querySelector(".at-h");
    if (f && focus !== false) { if (!/^(BUTTON|A|INPUT)$/.test(f.tagName)) f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true }); }
  }

  /* ---------- niveau 1 ---------- */
  function pick() {
    return '<div class="at-screen"><h3 class="at-h">Niveau 1 : assemblez la page</h3><p class="at-p">Une page d\'atterrissage pour une campagne. Huit blocs, trois options chacun. Quatre jauges réagissent à chaque choix, et l\'aperçu se construit sous vos yeux. Pour qui construisez-vous ?</p>' +
      '<div class="at-cards">' + Object.keys(CL).map(function (k) { return '<button type="button" class="at-card" data-cl="' + k + '"><b>' + CL[k].name + "</b><span>" + esc(CL[k].t[2]) + "</span></button>"; }).join("") + "</div>" +
      '<p class="at-note">Les clients sont fictifs. Les trois niveaux prennent 10 à 15 minutes ; votre progression est gardée sur cet appareil.</p></div>';
  }
  function label(b, o) { var c = CL[S.cl]; if (o.k === "cta") return c.cta; if (typeof o.k === "number") return c.t[o.k]; return o.t; }
  function gauges() {
    var g = { cl: 40, cf: 50, sp: 70, cv: 25 }, kb = BASE_KB;
    BLOCKS.forEach(function (b) { var i = S.ch[b.id]; if (i === undefined) return; var o = b.opts[i]; for (var k in o.g) g[k] += o.g[k]; kb += o.kb || 0; });
    for (var k in g) g[k] = clamp(g[k]);
    g.kb = kb; g.lcp = lcp(kb);
    return g;
  }
  function gaugeHtml(g) {
    var L = [["cl", "Clarté"], ["cf", "Confiance"], ["sp", "Vitesse"], ["cv", "Conversion"]];
    return '<div class="st-g" aria-live="polite">' + L.map(function (x) { var v = g[x[0]]; return '<div><span>' + x[1] + '</span><b>' + v + '</b><i style="--v:' + v + '%" class="' + (v >= 70 ? "hi" : v < 40 ? "lo" : "") + '"></i></div>'; }).join("") +
      '<p class="st-lcp">Affichage estimé sur mobile 4G : <b>' + fmt(g.lcp, 1) + " s</b> " + (g.lcp <= 2 ? "(objectif : moins de 2 s)" : "(au-dessus de l'objectif de 2 s)") + "</p></div>";
  }
  function preview() {
    var c = CL[S.cl], t = S.ch.t !== undefined ? label(BLOCKS[0], BLOCKS[0].opts[S.ch.t]) : null;
    var get = function (id) { var b = BLOCKS.filter(function (x) { return x.id === id; })[0]; return S.ch[id] === undefined ? null : { i: S.ch[id], l: label(b, b.opts[S.ch[id]]) }; };
    var s = get("s"), v = get("v"), b = get("b"), p = get("p"), f = get("f"), ty = get("ty"), ct = get("c");
    var font = ty ? ["st-f1", "st-f4", "st-f0"][ty.i] : "";
    var ph = function (txt) { return '<div class="ph">' + txt + "</div>"; };
    var vis = v ? '<div class="pv-vis v' + v.i + '"><span>' + ["Vidéo, 8 Mo", "Photo WebP, 120 Ko", "Carrousel, 3,5 Mo"][v.i] + "</span></div>" : ph("Visuel");
    var proof = p ? (p.i === 1 ? '<div class="pv-proof"><i></i><i></i><i></i><span>Avis vérifiés</span></div>' : p.i === 0 ? '<div class="pv-proof bad">N°1 au Maroc</div>' : "") : ph("Preuve");
    var nf = f ? [3, 5, 11][f.i] : 0;
    var form = f ? '<div class="pv-form">' + Array.apply(null, Array(Math.min(nf, 6))).map(function () { return "<i></i>"; }).join("") + (nf > 6 ? "<small>+ " + (nf - 6) + " champs</small>" : "") + "</div>" : ph("Formulaire");
    var btn = b ? '<div class="pv-btn">' + esc(b.l) + "</div>" : ph("Bouton");
    var cont = ct ? (ct.i === 0 ? '<div class="pv-bar"><span>Appeler</span><span>WhatsApp</span></div>' : ct.i === 2 ? '<div class="pv-chat">Bonjour ! Puis-je vous aider ?</div>' : '<div class="pv-foot">Tél. en image</div>') : "";
    return '<div class="st-phone ' + font + '" aria-label="Aperçu de la page" role="img"><div class="pv-top"><i></i><span>' + esc(c.name.replace(/^Une? /, "")) + "</span></div>" +
      (t ? '<p class="pv-t">' + esc(t) + "</p>" : ph("Titre")) + (s ? (s.i === 2 ? "" : '<p class="pv-s">' + (s.i === 0 ? "Leader depuis 2010, nous mettons notre savoir-faire à votre service." : esc(c.s)) + "</p>") : ph("Sous-titre")) +
      vis + proof + form + btn + cont + "</div>";
  }
  function lvl1() {
    var g = gauges(), n = Object.keys(S.ch).length, done = n === BLOCKS.length;
    var next = BLOCKS.filter(function (b) { return S.ch[b.id] === undefined; })[0];
    var last = S.last ? BLOCKS.filter(function (b) { return b.id === S.last; })[0] : null;
    var fb = last ? '<div class="st-fb" role="status"><b>' + last.q + " : " + esc(label(last, last.opts[S.ch[last.id]])) + "</b><p>" + last.opts[S.ch[last.id]].why + "</p></div>" : "";
    var q = next ? '<fieldset class="at-opts"><legend class="at-lg">' + next.q + ' <small>' + (n + 1) + " sur " + BLOCKS.length + "</small></legend>" + next.opts.map(function (o, i) { return '<button type="button" class="at-opt at-optb" data-pick="' + next.id + ":" + i + '"' + (i === 0 ? " data-focus" : "") + "><span><b>" + esc(label(next, o)) + "</b></span></button>"; }).join("") + "</fieldset>"
      : '<div class="st-done"><p>Page assemblée. Score du niveau : <b class="res">' + score1(g) + " sur 100</b></p><div class=\"at-acts\"><button class=\"btn btn-ghost\" type=\"button\" data-act=\"redo1\">Recommencer le niveau</button><button class=\"btn btn-main\" type=\"button\" data-act=\"to2\" data-focus>Passer au niveau 2</button></div></div>";
    return '<div class="at-screen"><h3 class="at-h">Niveau 1 : assemblez la page</h3><div class="st-l1"><div class="st-left">' + gaugeHtml(g) + fb + q + '</div><div class="st-right">' + preview() + "</div></div></div>";
  }
  function score1(g) { return clamp((g.cl + g.cf + g.sp + g.cv) / 4); }

  /* ---------- niveau 2 ---------- */
  function z(id, html, tag) { var f = S.found.indexOf(id) >= 0, a = AUD.filter(function (x) { return x.id === id; })[0]; return '<button type="button" class="au-z' + (f ? " found" : "") + (S.okz && S.okz.indexOf(id) >= 0 ? " fine" : "") + '" data-z="' + id + '"' + (f ? ' aria-pressed="true"' : "") + ">" + html + (f ? '<em aria-hidden="true">' + (S.found.indexOf(id) + 1) + "</em>" : "") + "</button>"; }
  function lvl2() {
    if (!S.t0) { S.t0 = Date.now(); save(); }
    var nf = S.found.length;
    var page = '<div class="au-page" aria-label="Page à auditer">' +
      '<div class="au-hdr">' + z("logo", '<span class="au-logo">Résidence Horizon</span>') + z("menu", '<span class="au-menu">Accueil · Projet · Plans · Quartier · Galerie · Actualités · Partenaires · Carrières · Contact</span>') + "</div>" +
      z("pop", '<span class="au-pop">Inscrivez-vous à notre newsletter ! <i>×</i></span>') +
      z("h1", '<span class="au-h1">Bienvenue</span>') +
      z("low", '<span class="au-low">Découvrez un projet unique pensé pour votre confort, dans un cadre exceptionnel, avec des prestations haut de gamme et des finitions soignées.</span>') +
      z("img", '<span class="au-img">banniere-finale-v3.png<br>3,2 Mo</span>') +
      '<div class="au-row">' + z("more", '<span class="au-more">Le projet <u>En savoir plus</u></span><span class="au-more">Les plans <u>En savoir plus</u></span><span class="au-more">Le quartier <u>En savoir plus</u></span>') + z("team", '<span class="au-team">Photo de l\'équipe commerciale, avec les prénoms</span>') + "</div>" +
      '<div class="au-row">' + z("quote", '<span class="au-quote">« Super service ! »<br><small>Client satisfait</small></span>') + z("hours", '<span class="au-hours">Bureau de vente ouvert du lundi au samedi, 9 h à 18 h</span>') + "</div>" +
      z("form", '<span class="au-form"><b>Demande d\'information</b><span>Nom · Prénom · E-mail · Téléphone · Ville · Profession · Revenus · Apport · Budget* · Délai · Message</span></span>') +
      z("btn", '<span class="au-btn">Cliquez ici</span>') +
      '<div class="au-foot">' + z("tel", '<span class="au-tel">05 22 •• •• ••</span>') + z("addr", '<span class="au-addr">Bd Ghandi, Casablanca</span>') + z("legal", '<span class="au-legal">Mentions légales</span>') + "</div></div>";
    var list = S.found.map(function (id, i) { var a = AUD.filter(function (x) { return x.id === id; })[0]; return "<li><b>" + (i + 1) + "</b><p>" + a.why + "</p></li>"; }).join("");
    var hint = S.hintTxt ? '<p class="au-hint" role="status">' + S.hintTxt + "</p>" : "";
    var msg = S.msg ? '<p class="au-msg" role="status">' + S.msg + "</p>" : "";
    var allFound = nf === NBAD;
    return '<div class="at-screen"><h3 class="at-h">Niveau 2 : trouvez les erreurs</h3><p class="at-p">Cette page d\'un promoteur fictif contient ' + NBAD + " erreurs qui coûtent des clients. Touchez ce qui ne va pas. Certains éléments sont très bien : un mauvais signalement compte contre vous.</p>" +
      '<div class="au-wrap"><div>' + page + '</div><div class="au-side"><div class="au-count" aria-live="polite"><b>' + nf + " / " + NBAD + "</b> erreurs trouvées<span>" + S.miss + " signalement" + (S.miss > 1 ? "s" : "") + " à tort, " + S.hints + " indice" + (S.hints > 1 ? "s" : "") + "</span></div>" + msg + hint +
      '<div class="at-acts">' + (allFound ? '<button class="btn btn-main" type="button" data-act="end2" data-focus>Voir mon score</button>' : '<button class="btn btn-ghost" type="button" data-act="hint">Un indice</button><button class="btn btn-ghost" type="button" data-act="end2">J\'ai fini</button>') + "</div>" +
      (list ? '<ol class="au-list">' + list + "</ol>" : "") + "</div></div></div>";
  }
  function score2() { return clamp(S.found.length / NBAD * 100 - S.miss * 4 - S.hints * 5); }

  /* ---------- niveau 3 ---------- */
  function lvl3() {
    var kb = BASE_KB, v = 0;
    ITEMS.forEach(function (it) { if (S.sel[it.id]) { kb += it.kb; v += it.v; } });
    var t = lcp(kb), ok = t <= LIMIT;
    var rows = ITEMS.map(function (it) { return '<label class="w-it"><input type="checkbox" data-it="' + it.id + '"' + (S.sel[it.id] ? " checked" : "") + '><span><b>' + it.t + "</b><small>" + fmt(it.kb) + " Ko</small></span></label>"; }).join("");
    return '<div class="at-screen"><h3 class="at-h">Niveau 3 : allégez la page mobile</h3><p class="at-p">Votre page de base pèse ' + BASE_KB + " Ko (texte, styles, formulaire). Ajoutez ce qui aide vraiment à vendre, sans dépasser " + fmt(LIMIT, 1) + " secondes d'affichage en 4G. Chaque élément a une valeur commerciale que vous ne voyez pas : à vous de juger.</p>" +
      '<div class="w-wrap"><div class="w-list">' + rows + '</div><div class="w-side" aria-live="polite"><div class="w-meter ' + (ok ? "ok" : "ko") + '"><span>Affichage estimé</span><b>' + fmt(t, 1) + ' s</b><i style="--v:' + Math.min(100, t / 4 * 100) + '%"></i><small>Objectif : ' + fmt(LIMIT, 1) + " s, poids : " + fmt(kb) + " Ko</small></div>" +
      (ok ? "" : '<p class="au-msg">Trop lourd : la page dépasse l\'objectif. Retirez ce qui pèse plus qu\'il ne rapporte.</p>') +
      '<div class="at-acts"><button class="btn btn-main" type="button" data-act="end3"' + (ok ? "" : " disabled") + ">Valider ma page</button></div></div></div></div>";
  }
  function score3() { var v = 0; ITEMS.forEach(function (it) { if (S.sel[it.id]) v += it.v; }); return clamp(v / BEST * 100); }

  /* ---------- bilan ---------- */
  function fin() {
    var tot = Math.round((S.s1 + S.s2 + S.s3) / 3);
    var m = tot >= 85 ? "Vous pourriez relire nos maquettes." : tot >= 65 ? "Solide. Quelques réflexes à prendre." : "Des réflexes à prendre : c'est le but de l'atelier.";
    var lost = ITEMS.filter(function (it) { return S.sel[it.id] && it.v < 7; }).map(function (it) { return it.t.toLowerCase(); });
    var miss = ITEMS.filter(function (it) { return !S.sel[it.id] && it.v >= 10; }).map(function (it) { return it.t.toLowerCase(); });
    var l3 = (lost.length ? "Vous avez gardé des éléments qui pèsent plus qu'ils ne rapportent : " + lost.join(", ") + ". " : "") + (miss.length ? "Vous avez laissé de côté des éléments légers et utiles : " + miss.join(", ") + "." : (lost.length ? "" : "Votre sélection est très proche de la meilleure possible."));
    return '<div class="at-screen"><h3 class="at-h">Bilan</h3><div class="at-final"><div class="at-grade"><b>' + tot + "</b><span>" + m + "</span></div>" +
      '<div class="at-tot"><div><span>Assembler</span><b>' + S.s1 + "</b><small>sur 100</small></div><div><span>Auditer</span><b>" + S.s2 + "</b><small>sur 100</small></div><div><span>Alléger</span><b>" + S.s3 + "</b><small>sur 100</small></div></div></div>" +
      '<h4 class="at-h4">À retenir</h4><div class="at-read"><p>Un titre qui dit ce que le client obtient, un bouton qui dit ce qui se passe, des preuves vérifiables, un formulaire court : c\'est là que se joue la conversion.</p><p>Sur mobile, chaque kilo-octet se paie en secondes, et chaque seconde en visiteurs perdus. On charge au clic ce qui n\'est pas indispensable.</p><p>' + l3 + "</p></div>" +
      '<div class="at-cta"><p>Votre site a peut-être quelques-unes de ces erreurs. En 45 minutes, nous le regardons avec vous et vous repartez avec les corrections prioritaires.</p><div class="at-acts"><a class="btn btn-main" href="diagnostic.html">Demander un diagnostic</a><a class="btn btn-ghost" href="sites-web.html">Voir notre offre Sites web</a><button class="btn btn-ghost" type="button" data-act="restart">Recommencer l\'atelier</button></div></div></div>';
  }

  /* ---------- interactions ---------- */
  function bind() {
    app.querySelectorAll("[data-cl]").forEach(function (b) { b.addEventListener("click", function () { S.cl = b.getAttribute("data-cl"); save(); render(); top(); }); });
    app.querySelectorAll("[data-pick]").forEach(function (b) { b.addEventListener("click", function () { var p = b.getAttribute("data-pick").split(":"); S.ch[p[0]] = +p[1]; S.last = p[0]; save(); render(); }); });
    app.querySelectorAll("[data-z]").forEach(function (b) { b.addEventListener("click", function () {
      var id = b.getAttribute("data-z"), a = AUD.filter(function (x) { return x.id === id; })[0];
      if (S.found.indexOf(id) >= 0) return;
      if (a.bad) { S.found.push(id); S.msg = "Bien vu."; S.hintTxt = ""; }
      else { S.okz = S.okz || []; if (S.okz.indexOf(id) < 0) { S.okz.push(id); S.miss++; } S.msg = "Rien à redire ici : cet élément aide le visiteur."; }
      save(); render('[data-z="' + id + '"]');
    }); });
    app.querySelectorAll("[data-it]").forEach(function (c) { c.addEventListener("change", function () { S.sel[c.getAttribute("data-it")] = c.checked; save(); render('[data-it="' + c.getAttribute("data-it") + '"]'); }); });
    app.querySelectorAll("[data-act]").forEach(function (b) { b.addEventListener("click", function () { act(b.getAttribute("data-act")); }); });
  }
  var HINTS = { menu: "Regardez le haut de la page.", pop: "Qu'est-ce qui apparaît avant même qu'on lise ?", h1: "Le premier mot qu'on lit dit-il ce qu'on vend ?", low: "Ce paragraphe se lit-il bien ?", img: "Regardez le poids de l'image.", more: "Où mènent ces liens ?", quote: "Cet avis prouve-t-il quelque chose ?", form: "Comptez les champs.", btn: "Le bouton dit-il ce qu'on obtient ?", tel: "Peut-on appeler depuis un téléphone ?" };
  function act(a) {
    if (a === "redo1") { S.ch = {}; S.last = null; S.cl = null; save(); render(); top(); return; }
    if (a === "to2") { S.s1 = score1(gauges()); S.lvl = 1; S.t0 = 0; S.msg = ""; save(); render(); top(); return; }
    if (a === "hint") { var left = AUD.filter(function (x) { return x.bad && S.found.indexOf(x.id) < 0; }); if (left.length) { S.hints++; S.hintTxt = "Indice : " + HINTS[left[0].id]; } save(); render(false); return; }
    if (a === "end2") { S.s2 = score2(); S.lvl = 2; save(); render(); top(); return; }
    if (a === "end3") { S.s3 = score3(); S.lvl = 3; save(); render(); top(); return; }
    if (a === "restart") { S = fresh(); save(); render(); top(); return; }
  }
  render(false);
})();
