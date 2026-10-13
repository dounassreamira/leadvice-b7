# Analyse des six sites de référence

Ce dossier sert à étudier, jamais à publier. Les captures (`captures/`) et ce fichier restent hors du site ; rien n'en sort tel quel.

Méthode : chaque site a été chargé dans un navigateur sans écran (Chromium), sur ordinateur (1440 px) et sur téléphone (390 px), avec enregistrement de toutes les requêtes réseau ; les scripts et feuilles de style ont été lus pour identifier les bibliothèques et les techniques ; un audit Lighthouse mobile a été lancé sur chacun. Les scores de vitesse ont été mesurés dans un environnement sans carte graphique et derrière un proxy : ils sont plus sévères que la réalité, mais le classement entre les sites et les poids transférés sont fiables.

---

## Vue d'ensemble

| Site | Construit avec | Poids transféré (mobile) | Perf. | Access. | SEO | H1 |
|---|---|---|---|---|---|---|
| mindmarket.com | **Astro**, GSAP + ScrollTrigger + DrawSVG, Lenis, Rive | 1,1 Mo | 56 | 94 | 100 | oui |
| oryzo.ai | **Astro**, Three.js sur mesure, Gaussian splats, GSAP | 10,1 Mo | 25 | 87 | 100 | détourné (« Powered by AI ») |
| mont-fort.com | **Astro**, Three.js, GSAP + ScrollTrigger, Lenis, textures KTX2 | env. 24 Mo (desktop) | non mesuré | non mesuré | non mesuré | non |
| era-residence.com | Webflow, GSAP + ScrollTrigger + SplitText + CustomEase, Lenis, Barba, Lottie | 7,0 Mo | 40 | 90 | 100 | oui |
| davidwhyte.com/experience | WordPress, WebGL sur mesure (4 Mo de JS), Mapbox | 12,0 Mo | 25 | 84 | 92 | non |
| why.zero.university | Application WebGL (Three.js, modèles 3D, son), tout dans un canvas | 6,0 Mo | 44 | 88 | 100 | non |

**Trois enseignements valent pour tout le projet.**

1. **Notre stack est celle des sites primés.** Trois des six sites (MindMarket, Oryzo, Montfort) sont construits avec Astro et GSAP, comme Leadvice. Quatre utilisent Lenis pour le défilement doux. Il n'y a rien à changer dans les choix techniques ; il faut ajouter Lenis.
2. **Tous sacrifient la vitesse.** Le plus léger pèse 1,1 Mo et obtient 56 en performance dans ce test ; les autres pèsent de 6 à 24 Mo. Trois n'ont pas de vrai titre H1, ce qui nuit au référencement. C'est l'ouverture pour Leadvice : le même effet, dix fois plus léger, grâce aux séquences d'images pré-calculées au lieu de la 3D en temps réel, et un site qui se classe sur Google.
3. **Les meilleurs construisent un seul monde.** Montfort fait voyager la caméra à travers un paysage continu ; MindMarket fait courir un même ruban vert d'une section à l'autre ; David Whyte enchaîne les paysages d'aquarelle. C'est exactement le rôle de la trajectoire violette chez Leadvice, qu'il faut rendre plus présente entre les scènes.

---

## mindmarket.com — la référence la plus proche

**Ce que c'est.** Agence d'études qualitatives. Site du jour Awwwards en décembre 2025.

**Comment c'est fait.**
- Astro, GSAP + ScrollTrigger, plugin DrawSVG et chemins GSAP (MotionPath) pour dessiner le grand ruban vert qui serpente derrière les sections.
- Lenis 1.3 pour le défilement doux.
- Illustrations animées en **Rive** : des fichiers `.riv` de 35 à 45 Ko chacun (personnages, bouton « Get a quote » animé), chargés quand ils entrent à l'écran (IntersectionObserver).
- Contenu géré dans DatoCMS, images WebP redimensionnées.
- Police unique : Inter, en trois graisses.

**Ce qui marche.** Un ruban de couleur qui traverse tout le site et donne la continuité ; des cartes de texte blanches posées sur l'illustration (lisibilité parfaite au-dessus d'un fond animé) ; une photo entourée d'un ruban jaune portant une phrase écrite le long de sa courbe (« Connecting you to your audience ») ; des chiffres dans de grandes cartes ; un ton simple et direct.

**Limites.** Typographie banale (Inter partout), illustrations de personnages très « agence créative », 7,6 s de blocage du fil principal dans le test (trop de scripts tiers, dont 600 Ko de Google Tag).

**Pour Leadvice.**
- La **trajectoire violette devient un ruban continu** qui court derrière les sections de l'accueil, dessiné au scroll avec DrawSVG, au lieu d'apparaître seulement à la fin des scènes.
- Un **texte le long du ruban** (SVG `textPath`) dans la scène Preuves : « Des entreprises. Des problématiques différentes. Une même exigence. » qui glisse le long de la trajectoire autour de la constellation de logos.
- Des **cartes de texte posées sur les scènes** pour les blocs longs, au lieu de texte directement sur l'image.
- Les scripts tiers (GTM, pixel) chargés seulement après consentement, comme déjà prévu : c'est ce qui fait perdre des points à MindMarket.

## oryzo.ai — le niveau de mise en scène à viser

**Ce que c'est.** Faux produit (un dessous de verre en liège) présenté comme une keynote Apple, par le studio Lusion. Site du mois Awwwards en avril 2026.

**Comment c'est fait.** Astro ; un moteur Three.js sur mesure d'1,1 Mo ; décors en **Gaussian splats** (scènes 3D photoréalistes de 0,5 à 3 Mo chacune) ; modèles et textures chargés en flux ; vidéos via Vimeo. Polices : Halyard (variable) et Literata, plus DM Mono pour les détails techniques. Palette : brun-noir chaud et orange liège.

**Ce qui marche.** L'objet reste au centre et change de point de vue pendant que les textes changent à gauche et à droite (« Isn't just a coaster. ») ; une main qui saisit l'objet pour le titre ; un **liseré lumineux qui fait le tour de l'écran** au moment de l'« activation », inspiré du bouton Action d'Apple ; des micro-légendes en police mono ; un rythme très retenu.

**Limites.** 10 Mo sur mobile, le titre principal arrive au bout de très longues secondes dans le test, le H1 est un détournement (« Powered by AI ») ; impossible pour un site qui doit convertir.

**Pour Leadvice.**
- Le funnel de l'accueil traité comme un produit de keynote : textes courts qui changent de part et d'autre de l'objet pendant que la séquence avance (déjà prévu), avec des **micro-légendes chiffrées** (« Audience, étape 1 sur 5 ») en Geist à chiffres tabulaires pour le côté instrument de mesure. Pas de police mono : chez Oryzo elle sert la parodie technique, chez Leadvice elle ferait gadget.
- **Le liseré lumineux d'activation** : quand les cinq billes violettes sortent de l'entonnoir, un halo violet lumineux fait le tour du cadre de l'écran une seule fois. Fait en CSS (dégradé conique animé sur une bordure), quelques lignes, aucun poids.
- Pas de Gaussian splats ni de Three.js : l'équivalent visuel vient des séquences d'images.

## mont-fort.com — un groupe sérieux rendu spectaculaire

**Ce que c'est.** Groupe de négoce de matières premières et d'investissement, par Immersive Garden. Site du mois en juin 2025.

**Comment c'est fait.** Astro, Three.js, GSAP + ScrollTrigger, Lenis, textures compressées KTX2. Une seule scène 3D que la caméra traverse au scroll : montagnes dans les nuages, mer et navires, globe terrestre, forêt. Typographie fine en capitales espacées (Century Gothic, Josefin Sans), losanges numérotés comme repères.

**Ce qui marche.** Le sentiment d'un **voyage continu** : on ne change jamais de page, on change de paysage. Les nuages servent de transition entre les mondes. Le texte est rare, en capitales fines, très aéré. Le ton corporate reste crédible.

**Limites.** Environ 24 Mo, pas de H1, texte gris clair sur nuages parfois peu lisible.

**Pour Leadvice.**
- **Des transitions de brume entre les séquences** : la dernière image d'une séquence se dissout dans un voile (masque de texture animé), et la scène suivante en sort. Les cinq animations ne sont plus des blocs séparés mais les étapes d'un même voyage.
- **Des repères numérotés** discrets (cercle fin + numéro), réservés à ce qui est vraiment une suite : les cinq temps de la méthode et les cinq étapes du funnel.

## davidwhyte.com/experience — la révélation à l'aquarelle

**Ce que c'est.** Expérience d'entrée du portail d'un poète, par Immersive Garden. Site du jour en décembre 2024.

**Comment c'est fait.** WordPress ; un moteur WebGL sur mesure de 4 Mo ; un **atlas de paysages peints**, un **atlas de masques en niveaux de gris** et une texture de champ de distance (SDF) pour le texte. L'aquarelle se révèle en faisant monter un seuil sur la texture de masque : les zones claires du masque apparaissent d'abord, comme une peinture qui s'étend. Polices : Canela (serif) et Roobert.

**Ce qui marche.** La matière (le papier, l'eau, la peinture) est l'émotion ; l'appui long qui révèle un paysage ; le poème plein écran ; une FAQ très élégante en grande serif ; le lien « Restart the experience » à la fin.

**Limites.** 12 Mo, pas de H1, texte de la page cachée dans un canvas.

**Pour Leadvice.**
- La **révélation à l'encre** (déjà décidée en 3.11) reprend exactement ce principe, en léger : une texture de masque en niveaux de gris de 30 à 60 Ko et un seuil animé, dans un shader de moins de 6 Ko ou en masque CSS. La texture de masque se génère dans Flow (prompt fourni dans `VARIANTES-VISUELS-LEADVICE.md`, section 6).
- **La FAQ en grande serif**, une question par ligne, beaucoup d'air, au lieu d'un accordéon serré.
- **« Revoir l'ouverture »** : un lien discret en bas de l'accueil pour rejouer la séquence funnel.

## era-residence.com — la typographie et l'arche

**Ce que c'est.** Résidences de luxe sur la Costa del Sol. Site du jour.

**Comment c'est fait.** Webflow ; GSAP + ScrollTrigger + **SplitText** (titres découpés en lettres) + CustomEase ; Lenis ; **Barba** pour les transitions de page ; Lottie ; vidéos WebM de bougainvilliers en surimpression (3 Mo chacune) ; texte sur chemin (`textPath`) en arc.

**Ce qui marche.** Des **titres immenses en serif condensée** qui se recomposent lettre par lettre quand on change de carte (« Real-life location » → « Built to stay ») ; un mot en script qui vient croiser le titre ; des **images découpées en arche** ; un texte écrit le long d'un arc sous l'image ; un carrousel épinglé numéroté « 1 —— 3 » ; une bannière cookies dessinée comme une carte, cohérente avec le site ; un bouton rond « View available apartments » qui flotte.

**Limites.** 7 Mo dont plus de 20 Mo de vidéos de fleurs sur ordinateur, bonnes pratiques à 79.

**Pour Leadvice.**
- **L'arche** comme forme de découpe des images (portraits des fondatrices, cartes de l'étude de cas, visuels des leviers) : un clin d'œil discret à l'architecture marocaine, que les concurrents n'ont pas.
- **Les titres recomposés lettre par lettre** dans le carrousel « Trois façons de travailler avec nous » et dans le défilement horizontal des programmes Kettani (SplitText, désormais gratuit avec GSAP).
- **Le compteur « 01 —— 03 »** sur tous les carrousels et séquences épinglées.
- **La bannière cookies dessinée** dans le style du site plutôt qu'une bande générique.

## why.zero.university — ce qu'il ne faut pas faire, et une idée à garder

**Ce que c'est.** Récit immersif pour une école, par BUNQ LABS. Site du mois en septembre 2026.

**Comment c'est fait.** Une application WebGL complète : 1,2 Mo de JavaScript, mains et objets en modèles 3D, textures compressées, son d'ambiance, compteur de chargement (« 99 », « 57 »…), puis une porte d'entrée où il faut dessiner un zéro. Tout le contenu vit dans un canvas : aucun H1, une page de 900 px de haut pour le navigateur.

**Ce qui marche.** L'audace, les matières (givre, verre qui se brise), la promesse tenue en une image.

**Limites.** Un robot de Google ne voit presque rien du contenu ; l'écran de chargement et la porte d'entrée retardent tout ; 222 s de blocage cumulé dans le test.

**Pour Leadvice.** On ne reprend ni la porte, ni le chargement, ni le tout-canvas (déjà exclus en 3.11). On garde **une matière par séquence** : chaque animation Leadvice doit avoir sa sensation propre (verre, plâtre, lumière, eau), ce que les variantes permettent de tester.

---

## Ce qui change dans le projet Leadvice

| Décision | Où | Inspirée de |
|---|---|---|
| Défilement doux avec Lenis (désactivé avec `prefers-reduced-motion`) | Prompt maître 3.9 | MindMarket, Montfort, ERA |
| Trajectoire violette en ruban continu derrière les sections de l'accueil, dessinée au scroll | Prompt maître 3.11 | MindMarket |
| Texte le long de la trajectoire dans la scène Preuves | Contenu, prompt maître 3.11 | MindMarket, ERA |
| Liseré lumineux d'activation autour de l'écran à la fin du funnel | Prompt maître 3.11 | Oryzo |
| Micro-légendes chiffrées (« Audience, étape 1 sur 5 ») | Design system | Oryzo |
| Transitions de brume entre séquences | Prompt maître 3.11, animations | Montfort |
| Repères numérotés pour la méthode et le funnel, compteurs sur les carrousels | Design system | Montfort, ERA |
| Images découpées en arche | Design system | ERA (et l'architecture marocaine) |
| Titres recomposés lettre par lettre dans les carrousels | Prompt maître 3.11 | ERA |
| FAQ en grande serif, une question par ligne | Design system | David Whyte |
| Lien « Revoir l'ouverture » | Contenu | David Whyte |
| Bannière cookies dessinée | Design system | ERA |
| **Violet lumineux #7B61FF sur fond sombre** : le violet de marque #301781 n'a qu'un contraste de 1,45:1 sur Deep Space, il disparaît | Design system, prompts d'images | Audit des contrastes |
| **Logo en blanc cassé sur fond sombre** pour la même raison | Design system | Audit des contrastes |

Et la promesse qui distingue Leadvice de ces six sites : le même niveau d'émotion, avec un site qui pèse moins de 3 Mo, s'affiche en moins de 2 secondes et se classe sur Google.
