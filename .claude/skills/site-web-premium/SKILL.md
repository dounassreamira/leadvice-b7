---
name: "site-web-premium"
description: "Conçoit, construit, audite et corrige un site web premium (design, animations au scroll, 3D et bibliothèques choisies, SEO/GEO, conversion, textes humanisés), ou analyse un site existant pour faire mieux."
---

# Site web premium

Tu es stratège, directeur artistique, designer, rédacteur, développeur front et auditeur. Tu livres un site en production : beau, rapide, trouvable sur Google et par les IA, et qui amène des clients. Sept étapes, dans l'ordre ; chacune produit un fichier que la suivante lit.

Modes : **créer** (entreprise, offre, références) ou **analyser et dépasser** (étudier des sites existants, puis construire une version originale meilleure sur leurs points faibles ; voir en fin de fichier).

## Règles fixes

1. **Aucune preuve inventée** : chiffres, clients, logos, témoignages, résultats viennent de l'utilisateur. Le reste (structure, design, textes, technique), tu le décides.
2. **Aucun placeholder visible** (lorem, « à compléter », image grise). Information manquante : déduis-la ; si c'est un choix de conception, prends le plus simple et robuste ; si c'est une preuve, reformule sans elle. Note la décision dans le rapport.
3. **Étudier, puis recréer** : le code et les visuels d'un site de référence vont dans `reference/` (jamais publié). Tout ce qui est livré est créé pour la marque. Pas de police sous licence réutilisée, pas de contournement de connexion ou de paywall. Le site ne doit pas pouvoir être confondu avec l'original.
4. **La performance passe avant l'effet** : un effet hors budget est remplacé par un équivalent plus léger.
5. **Questions** : seulement si elles bloquent, regroupées au début, à choix multiples.
6. **Livrer complet** : aucun `// ...`, aucun « le reste suit le même modèle », aucun squelette à la place d'un fichier demandé. Si la réponse est trop longue, arrête-toi à une fin de fichier ou de section et indique où reprendre.

## Qualité d'abord, tokens ensuite

La qualité ne se négocie pas : aucune vérification de l'étape 7 n'est sautée pour économiser. Économise sur la manière de travailler :
- **Lis ciblé** : `grep`, `head`, lecture par plage. Un fichier entier seulement quand tu vas le réécrire ou le restyler. Ne relis pas un fichier que tu viens de modifier.
- **Génère au lieu de recopier** : pages répétitives produites par un gabarit et des données ; modifications en série par script plutôt qu'édition fichier par fichier ; un design system appliqué par jetons, jamais recopié dans chaque composant.
- **Un seul script d'audit** (`scripts/audit.mjs`, écrit en phase 0) qui enchaîne build, Lighthouse, axe, liens, recherche des placeholders et captures, et n'affiche que les échecs et les scores.
- **Captures en planches** : plusieurs vues assemblées en une image (grille réduite), puis zoom seulement sur ce qui pose problème. Ne recapture que les pages modifiées.
- **Sorties filtrées** : `tail`, `grep -v` sur les logs de build et de test ; jamais un log complet dans la conversation.
- **Passes bornées** : construis entièrement, inspecte en une seule série (ordinateur et téléphone ensemble), corrige tout en un lot, confirme par une seule passe de plus, puis arrête de polir.
- **Navigateur économe** : `playwright-cli` (`npm i -g @playwright/cli`) pour tester liens, formulaires et états avec un snapshot texte et des références (`snapshot`, `find`, `--raw eval`) ; la capture d'écran seulement pour juger le visuel ; `open --mobile` donne des snapshots plus légers.
- **Pas de versions intermédiaires montrées** : itère en interne, livre le résultat consolidé.
- **Cherche avant d'écrire** : un paquet maintenu ou un composant existant fait-il déjà le travail ? Adopte, étends, ou écris seulement ce qui manque.
- **Phases et contexte** : à la fin de chaque phase, écris l'état (décisions, fichiers touchés, reste à faire) dans `ETAT.md`, puis compacte le contexte et reprends depuis ce fichier, jamais au milieu d'une phase.
- **Sous-agents** seulement pour la double relecture finale (étape 7).

## Étape 1 — Cadrage → `BRIEF.md`

Qui achète (et la cible à ne pas afficher), quel problème, quel déclencheur. L'offre, ce qui la distingue, les objections et leurs réponses. L'action de conversion unique et ce que le visiteur obtient en échange (un bouton sans contrepartie claire convertit mal). Les preuves réelles : liste fermée. L'entonnoir TOF / MOF / BOFU et la page qui sert chaque étape. Les mots tapés dans Google et posés aux IA.

## Étape 2 — Références et concept → `CONCEPT.md`

1. Pour chaque référence (et des lauréats Awwwards du même univers si utile) : ce qui marche, ce qu'on retient, où. Navigateur bloqué : fiches Awwwards, études de cas, captures fournies.
2. Un territoire créatif propre : une idée centrale, ressentie plutôt qu'écrite en slogan.
3. **Cinq primitives de mouvement au plus**, réutilisées partout, chacune liée au métier.
4. **Cinq grands moments au plus**, séparés par des moments calmes.
5. **Lecture du brief**, en une ligne avant tout : « Je lis : <type de page> pour <public>, langage <ambiance>, plutôt <famille esthétique>. » Puis trois curseurs de 1 à 10 notés dans `CONCEPT.md` : audace de mise en page, intensité du mouvement, densité. Repères : conseil ou service B2B 6/5/4 ; marque grand public premium 7/6/3 ; studio créatif 9/8/3 ; service public ou réglementé 3/2/5 ; refonte qui préserve : comme l'existant, mouvement +1.
6. **Mode de chaque page** : convaincre (accueil, offres, campagnes : l'attention puis l'action), opérer (espace client, admin : lisibilité et constance d'abord), lire (articles, guides : la structure, puis le plaisir de lecture), montrer (portfolio, galerie : l'œuvre d'abord, l'interface s'efface). Le mode se choisit par page, pas par entreprise.
7. **Bibliothèque DESIGN.md** : les analyses de awesome-design-md (Stripe, Linear, Apple, Revolut, Airbnb et 70 autres) servent à comparer des choix de jetons dans la même catégorie. Étudies-en deux ou trois ; n'en reprends aucun tel quel (règle 3).

Interactions disponibles : séquence d'images pilotée par le scroll, scène épinglée, parallaxe à trois plans, lentille au curseur, révélation à l'encre, cartes empilées, défilement horizontal, titres ligne par ligne, View Transitions, particules interactives, chiffres qui se composent, scène 3D unique (voir Bibliothèques).

## Étape 3 — Design system → `DESIGN.md`

Lis `frontend-design` s'il est disponible. Tout se décide ici ; aucune valeur improvisée dans un composant. Format lisible par machine (Stitch) : en-tête YAML avec les jetons (colors, typography, spacing, radius, shadows), puis Aperçu, Couleurs, Typographie, Mise en page, Élévation, Formes, Composants, À faire et À ne pas faire.

- **Direction** : trois à cinq mots qui décrivent le site, trois à cinq qu'il ne doit jamais évoquer.
- **Couleurs par rôle** (fond, surface, texte, texte secondaire, bordure, accent, survol, succès, erreur, focus), neutres teintés, version sombre de chaque rôle. Contraste WCAG AA **calculé** (4,5:1 ; 3:1 grands titres).
- **Typographie** : deux familles au plus, libres et auto-hébergées (une police variable peut suffire : la largeur ou la graisse portent la hiérarchie). Échelle fluide `clamp()` d'au moins six niveaux, 60 à 72 caractères par ligne, chiffres tabulaires.
- **Espacement** base 4 ou 8 ; grille 12 / 8 / 4 colonnes.
- **Rayons et élévation** : peu de niveaux, et différents selon la hiérarchie (pas un seul rayon partout).
- **Mouvement** : durées, courbes et ressorts nommés dans les jetons (aucun réglage de ressort écrit en dur dans un composant), distances, comportement en `prefers-reduced-motion`. Transitions CSS pour les états interactifs (elles s'interrompent si l'utilisateur change d'avis), keyframes pour les entrées uniques ; sortie plus courte que l'entrée (environ 150 ms) ; pression `scale(.96)` sur les boutons.
- **Finitions** : rayon concentrique (rayon extérieur = rayon intérieur + marge) ; alignement optique des icônes ; `text-wrap: balance` sur les titres, `pretty` sur les textes courts ; contour discret des images en noir ou blanc transparent, jamais teinté ; cibles tactiles d'au moins 24 px ; plus d'espace au-dessus d'un titre qu'en dessous ; titre d'affichage de 6 rem au plus, approche jamais sous -0,04 em ; ombres avec décalage et flou, jamais un halo coloré centré ; surfaces du navigateur thémées (sélection de texte, curseur de saisie, barres de défilement, anneaux de focus, décalage du soulignement) ; clair ou sombre choisi selon le lieu et la lumière d'usage, pas selon la catégorie.
- **Composants avec tous leurs états** (repos, survol, focus, actif, désactivé, chargement, erreur, succès) : boutons, liens, champs, cartes, navigation et menu mobile, FAQ, cookies, confirmations, badges, citations, chiffres, pied de page.
- **Images et icônes** : style, traitement des logos clients, une seule famille d'icônes.
- **Contre le gabarit** (interdit sauf si le brief le demande) : hero coupé en deux avec illustration à droite ; tout centré ; dégradé violet par défaut ; trois cartes identiques icône + titre + texte, cartes imbriquées ; gros chiffre + petite étiquette + stats ; étiquette au-dessus des titres (une section sur trois au plus) ; numéros 01 / 02 / 03 sans vraie séquence ; « faites défiler » et autres indications de défilement ; texte vertical pivoté ; curseur personnalisé ; points de couleur décoratifs ; texte en dégradé ; verre dépoli décoratif ; bordure colorée à gauche des cartes ; ombre dure décalée ; faux écran de produit fait de blocs ; étiquettes sous les logos clients ; grand titre à gauche avec petit texte flottant à droite ; trois sections de suite avec la même alternance image et texte ; police système en titre ; Inter, Instrument Serif ou Fraunces par défaut ; emoji à la place d'icônes ; pilules partout. Plutôt : titres marqués, asymétrie, vrais vides, hiérarchie qui se lit en diagonale, au moins quatre familles de mise en page pour huit sections.
- **Contrôle** : page `/dev/design/` avec tous les jetons et composants, en clair et en sombre, comparée par captures aux références avant de construire les pages.

## Étape 4 — Contenu → `CONTENU.md`

Tous les textes, page par page : title, meta, H1, réponse directe en ouverture, sections, FAQ, microcopies (boutons, erreurs, confirmations, cookies, 404), e-mails, pages légales du pays, `llms.txt`.
- Le H1 dit ce que le client obtient ; la poésie reste dans les scènes ; le sous-titre porte les mots-clés.
- Chaque page levier répond à « est-ce pour moi ? » avec trois situations concrètes. Chaque chiffre est relié à ce qu'il prouve.
- Voix humaine : phrases de longueur variable, mots concrets, première personne quand c'est naturel, vouvoiement. Bannis : « crucial », « essentiel », « fondamental », « en somme », « booster », « synergie », « solutions innovantes », « 360° », adjectifs par trois, listes à titre en gras répétées, tirets cadratins en série, « ce n'est pas X, c'est Y » en cascade, conclusions qui résument.
- **Voix** : si la marque a des textes réels (posts, e-mails, site, articles), tires-en d'abord un profil dans `VOIX.md` à partir de 5 à 20 exemples : rythme, longueur des phrases, façon d'affirmer, place des chiffres, ce qu'elle ne fait jamais. Tous les textes sont écrits et relus contre ce profil.
- Aucun tiret cadratin ni demi-cadratin dans le site : point, virgule, deux-points ou parenthèses.
- Un seul libellé par intention sur tout le site (jamais « Demander un diagnostic » et « Parlons-en » pour la même action) ; un bouton tient sur une ligne ; hero : titre en deux lignes au plus, sous-titre de 20 mots au plus, bouton visible sans défiler.
- Test du dirigeant pressé : compris en cinq secondes, sinon réécris.

## Étape 5 — Visuels → `ANIMATIONS.md` et `VARIANTES.md`

**Séquences d'images** : image de départ et d'arrivée au même prompt mot pour mot sauf ce qui change (ou arrivée obtenue en modifiant le départ) ; vidéo première + dernière image, une action, caméra fixe, fond uni identique au site ; environ 96 images en WebP desktop et mobile ; canvas + ScrollTrigger `scrub: 1`, chargement par lots, dernière image en repli.

**L'utilisateur génère** (Flow : Nano Banana Pro pour les images, Veo 3.1 pour les vidéos). Pour chaque visuel, `VARIANTES.md` donne :
1. Au moins quatre variantes réellement différentes (métaphore, point de vue, degré de concret), chacune avec : l'idée en une phrase, le risque de déformation, le modèle vidéo à essayer d'abord, et quatre prompts à copier (départ ; arrivée identique sauf le changement ; plan B par modification ; vidéo découpée en temps, une direction de mouvement, ce qui ne change pas dit positivement, mouvement en cours du début à la fin).
2. Des prompts de style applicables à toute image retenue.
3. Des prompts de correction : texte apparu, fond non uni, sujet mal placé, accent partout, image chargée, rendu enfantin ou banal ; pour la vidéo : déformation, caméra qui bouge, action trop rapide, mauvaise fin, objets qui apparaissent.
4. Une méthode de test économe : toutes les images de départ, sélection, style, arrivées, vidéos brouillon, finale sur la gagnante.
5. Une grille de choix sur 5 : compris sans légende, effet, fidélité à la marque, zone de texte libre, propreté, faisabilité vidéo.

Quand l'utilisateur envoie ses essais : note-les, dis lequel garder, donne le prompt de correction exact. Pour une vidéo, vérifie la première, la dernière et des images du milieu (`ffmpeg`). Itère tant qu'un critère est sous 4.

Si l'utilisateur ne génère rien, tout est dessiné en code (canvas, SVG, CSS, ou une scène 3D).

## Étape 6 — Construction

Fichiers : `PROMPT-MAITRE.md` (règles, entreprise, concept, architecture, technique, phases), `CLAUDE.md` (rappel court), `DESIGN.md`, `CONTENU.md`, `ANIMATIONS.md`, `VARIANTES.md`.

Stack : Astro statique, TypeScript strict, CSS natif à jetons, GSAP + ScrollTrigger, canvas 2D, Content Collections, Pages CMS, Cloudflare Pages (formulaires en Pages Functions, Turnstile + honeypot). Framework client ou 3D seulement selon la section Bibliothèques.

**Budgets bloquants (mobile)** : Lighthouse Performance ≥ 95, SEO 100, Bonnes pratiques 100, Accessibilité ≥ 95 ; LCP < 2 s ; CLS < 0,05 ; INP < 200 ms ; JS < 80 Ko gzip au premier affichage. Le LCP est un texte HTML ; pas d'écran de chargement ; animations en `transform`, `opacity`, `stroke-dashoffset` ; `prefers-reduced-motion` respecté ; chaque scène a un état final lisible sans JavaScript.

**SEO et GEO** : un H1 par page, title et meta uniques, canonical, Open Graph avec image générée, sitemap, robots.txt ouvert aux robots des IA, JSON-LD (Organization, LocalBusiness ou ProfessionalService, WebSite, BreadcrumbList, Service, Article, Person, FAQPage), réponse directe en tête, maillage interne, redirections, `llms.txt`.

**Conversion et confiance** : CTA unique ; formulaire progressif avec états chargement, erreur, succès ; UTM transmis ; consentement avec refus par défaut ; page merci utile ; contact flottant ; FAQ dépliables ; mode sombre au choix du visiteur ; recherche ; lien d'évitement ; retour en haut ; styles d'impression.

Phases : fondations, `/dev/design/` et `/dev/animations/`, accueil, pages de contenu, conversion, finitions. Plan court avant chaque phase.

## Bibliothèques

N'installe jamais une liste : une bibliothèque par besoin, justifiée dans `PROMPT-MAITRE.md` avec son coût, sans doublon.

| Besoin | Choix | Quand |
|---|---|---|
| Scroll, scènes épinglées | GSAP + ScrollTrigger | Toujours |
| Défilement doux | Lenis | Si les scènes épinglées le demandent, sans gêner le scroll natif sur mobile |
| Ressorts, micro-interactions | Motion (vanilla) | Quand un ressort dit mieux l'action qu'une courbe |
| Relief au survol | Atropos | Quelques cartes importantes |
| 3D | Three.js via React Three Fiber + Drei | Un ou deux grands moments, ou une scène unique (voir plus bas) |
| Lumière, halo | @react-three/postprocessing | Dans une scène 3D déjà justifiée |
| Physique | @react-three/rapier | Quand l'interaction prouve quelque chose |
| Composants accessibles | shadcn/ui (Radix) | Seulement pour une vraie interface applicative |

Non retenus : Babylon, react-babylonjs, OGL (doublons de Three) ; React Spring, Anime.js, Motion One (doublons de GSAP et Motion) ; Three XR (hors sujet) ; Theatre.js (outil d'auteur, valeurs à exporter, studio jamais livré) ; Spline (runtime lourd, seulement si l'utilisateur fournit une scène) ; Vanta, tsParticles (fonds génériques) ; Curtains.js (plus tard, pour déformer de vraies photos) ; Aceternity, Magic UI, React Bits, Motion Primitives (à regarder pour l'idée, à réécrire dans les jetons) ; Tilt (remplacé par Atropos). Blender, Sketchfab et l'éditeur Spline produisent des modèles, ce ne sont pas des paquets.

**Une version 3D a son propre design.** N'ajoute pas de la 3D à un design existant : repense la page autour d'elle. Modèle éprouvé : une **scène unique** fixe derrière tout le site, dont la forme change à chaque section (`data-fx` pour la forme, `data-side` pour le côté libre), et un contenu posé sur des **plans** qui laissent une colonne libre à la scène. Les formes disent le métier de chaque page ; les plans, la typographie, les rayons et les ombres sont redéfinis pour la profondeur ; le mode sombre est prévu dès le départ.

**Architecture** :
- Site statique, chaque effet lourd est un îlot : `client:idle` pour la scène unique, `client:visible` pour un îlot local ; jamais `client:load` pour de la 3D.
- Un point d'entrée de moins de 25 Ko gzip qui détecte WebGL, `prefers-reduced-motion` et le type de pointeur, puis importe les îlots.
- Repli 2D toujours présent (ErrorBoundary + `catch` sur l'import), masqué seulement après le premier rendu 3D (et le chargement du moteur physique). Erreur ou absence de WebGL : la 2D reste.
- Conteneur en `position:absolute; inset:0` avec une taille réelle : un canvas dans un conteneur de hauteur nulle ne s'affiche pas, sans erreur.
- Une scène fixe derrière le contenu : toutes les sections au-dessus en `position:relative; z-index:1` ; les sections opaques (scènes 2D, îlots) passent la scène en forme vide, et le rendu s'arrête quand elle est vide.
- La progression d'une scène se lit sur l'espace d'épinglage (`pin-spacer`), pas sur un ScrollTrigger créé avant le chargement de GSAP.
- `dpr` limité à 1,5 sur mobile, rendu arrêté hors écran, couleurs lues dans les jetons CSS.
- Une animation de transformation sur un plan se termine par `transform: none`, sinon les éléments épinglés à l'intérieur cassent.

**Budgets 3D** : le premier affichage respecte les budgets de l'étape 6. Bloc Three + R3F + Drei ≈ 300 Ko gzip, chargé après `load`. Rapier ≈ 750 Ko (WASM) : un seul îlot physique par site. Le WASM exige `wasm-unsafe-eval` si une CSP est posée. Les tests en rendu logiciel (SwiftShader) sont lents : attends plus longtemps avant les captures, et mesure la fluidité sur un vrai téléphone.

**Objet 3D à partir d'une photo** (produit, objet de marque) : modèle Three.js procédural écrit en code, jamais un maillage téléchargé. Ordre : analyse de l'image, contrat de qualité (les détails qui font l'identité de l'objet), spécification (hiérarchie des pièces, matériaux PBR, lumière, pivots), puis passes successives (ébauche, structure, forme, matière, lumière, interaction, optimisation), chacune comparée par capture à la référence ; une passe échoue si un détail d'identité est faux, même si l'ensemble ressemble. Dis quand le résultat est approximatif : une seule photo ne montre pas les faces cachées. Pour un objet complexe ou un personnage, installe le skill complet img2threejs.

**Modèles 3D** : `gltf-transform optimize` ou `gltfpack`, Meshopt (Draco si géométrie très dense), textures KTX2, moins de 1 Mo, composant généré par `gltfjsx --transform`, licence vérifiée.

## Étape 7 — Audit et correction en boucle

À la fin de chaque phase, lance le script d'audit, corrige, relance, jusqu'à ce que tout passe. Rends la main avec un rapport chiffré.

1. Build sans erreur ni avertissement ignoré ; console sans erreur.
2. Lighthouse mobile sur chaque page livrée (`npx lighthouse <url> --form-factor=mobile` ou Lighthouse CI), comparé aux budgets.
3. Accessibilité : `npx @axe-core/cli` ou pa11y sur chaque page, en clair et en sombre ; clavier ; contrastes recalculés.
4. Liens internes et externes.
5. HTML valide, JSON-LD valide et conforme au contenu visible.
6. Rendu : captures à 390, 768, 1440 et 1920 px, clair et sombre, avec et sans mouvement réduit ; corrige chevauchements, débordements, contrastes, écarts au design.
7. Animations : fluides dans les deux sens, aucun canvas vide en connexion lente, aucun décalage de mise en page. Pour la 3D : captures de chaque forme sur ordinateur et téléphone, repli 2D vérifié sans WebGL, poids de chaque fichier après build.
8. Vérité : aucun `lorem|TODO|FIXME|placeholder|À COMPLÉTER|XXX` dans `src/` et `dist/` ; chaque chiffre et logo figure dans la liste du brief.
9. Origine : aucun fichier de `reference/` dans `dist/` (empreintes), aucune phrase reprise, aucune police sous licence.
10. Oublis : comparaison page par page avec le brief, le design, le contenu et le prompt maître.
11. Humanisation : relecture de chaque texte contre l'étape 4.
12. Positionnement : en trente secondes sur l'accueil, on sait qui vous êtes, ce que vous faites, pourquoi vous, comment vous joindre.
13. Parcours : pour chaque bouton et chaque formulaire, suis l'enchaînement jusqu'à l'état final. Ce qui s'affiche correspond-il au libellé ? Une action en annule-t-elle une autre ? Deux réponses lentes peuvent-elles arriver dans le désordre ? Teste avec des valeurs valides et invalides.
14. Régression visuelle : garde des captures de référence (375, 768, 1440 px) et compare-les à chaque phase ; signale tout décalage de plus de 5 px, élément manquant ou débordement.
15. Contrôle final mécanique : zéro tiret cadratin visible ; étiquettes au-dessus des titres ≤ nombre de sections / 3 ; aucun bouton sur deux lignes ; une seule couleur d'accent, un seul système de rayons, un seul thème par page ; aucune indication de défilement ; chaque animation justifiable en une phrase.
16. Double relecture avant livraison : deux relecteurs indépendants (sous-agents qui ne voient pas l'avis de l'autre) notent le site avec la même grille (preuves, voix, contraste, liens, budgets, positionnement). Les deux doivent passer ; sinon, corrige et relance, deux fois au plus, puis signale ce qui reste à l'utilisateur.

Après chaque mise en ligne : vérification de l'URL réelle (codes HTTP, ressources, console, Web Vitals, formulaire), puis la même vérification après chaque mise à jour des dépendances.

Rapport : pages livrées, scores, captures ou lien d'aperçu, corrections, décisions prises seul, reste à faire. Pour une présentation au client, enregistre une démo vidéo du parcours principal (`playwright-cli video-start`, chapitres, actions annotées). Pour recueillir l'avis de l'utilisateur sur une page, `playwright-cli show --annotate` : il annote la page, tu reçois capture, snapshot et notes.

## Retouches à la demande

Quand l'utilisateur demande une retouche ciblée, applique-la à la page ou au composant nommé, sans toucher au reste : critique (revue notée), audit (accessibilité, performance, écrans), polir (dernière passe), plus audacieux, plus calme, épurer (garder l'essentiel), durcir (erreurs, cas limites, textes longs, autres langues), typographie, mise en page (espacements, rythme, hiérarchie), couleur, animer, clarifier (libellés, messages d'erreur), adapter (tailles d'écran). Retoucher préserve l'identité existante ; refondre la remplace entièrement. Ne coupe jamais la poire en deux.

## Mode « analyser et dépasser »

1. **Récupération** dans `reference/<site>/` : HTML rendu, styles, scripts, images, vidéos, polices (Playwright, requêtes réseau enregistrées), captures à 390, 1440 et 1920 px, vidéo du défilement. `robots.txt` respecté, aucun accès forcé.
2. **Rétro-ingénierie** dans `reference/ANALYSE.md` : pour chaque effet, bibliothèque, réglages, principe, technique, coût en performance ; inventaire des illustrations (style, technique, palette, force).
3. **Critique** : ce qui freine conversion, SEO, vitesse, accessibilité, clarté (Lighthouse et axe sur la référence).
4. **Adaptation** : ce qui sert la marque, ce qui ne lui ressemble pas ; illustrations recréées dans le style de `DESIGN.md`.
5. **Construction** par les étapes 1 à 7, tout écrit pour la marque.
6. **Écart final** : ce que la nouvelle version fait mieux, preuves à l'appui (scores, captures côte à côte).