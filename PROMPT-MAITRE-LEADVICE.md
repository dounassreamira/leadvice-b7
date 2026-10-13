# PROMPT MAÎTRE — NOUVEAU SITE LEADVICE (leadvice.org)

Version finale. Ce document est l'unique source de vérité du projet. Il remplace tous les briefs précédents. Toutes les décisions y sont prises ; là où il te laisse une marge, il te dit comment trancher.

---

## PARTIE 1 — COMMENT TU TRAVAILLES

### 1.1 Ce que tu construis

Tu ne fais pas une maquette. Tu livres un site en production, multipage, pour un cabinet de conseil réel. Le site doit être lui-même la preuve de compétence de Leadvice : un dirigeant qui arrive dessus doit se dire « ils savent construire des expériences digitales » avant même d'avoir lu ce qu'ils font.

### 1.2 Doit / Peut / Interdit

**Doit**
- Site multipage Astro, contenu intégralement rédigé et final sur chaque page livrée.
- Expérience très imagée : le visuel raconte, le texte complète. Moins de texte que l'ancien site, beaucoup plus de mise en scène.
- Budgets de performance, SEO et GEO de la partie 5 tenus.
- Formulaire de diagnostic fonctionnel de bout en bout.
- Chaque animation traduit une idée du métier (filtrer, comprendre, connecter, décider, exécuter, mesurer, optimiser).

**Peut** (tu décides, tu notes ta décision dans le rapport de phase)
- Organisation interne des composants, nommage, découpage des fichiers.
- Formulations des microcopies, des intertitres et des textes courts dans le respect du ton (1.6).
- Ajustements de timing, d'easing et de densité des animations tant que les budgets sont tenus.

**Interdit**
- Tout placeholder visible : lorem ipsum, `[À COMPLÉTER]`, « texte à venir », image grise, TODO dans le rendu.
- Inventer un chiffre, un résultat, un témoignage, une citation de client, un nom de client, un prix ou une distinction. Les seuls chiffres autorisés sont ceux de la section 2.4.
- Photos ou vidéos de banque d'images (personne souriante devant un ordinateur, réunion autour d'une table, poignée de main).
- Présenter Leadvice comme une agence. Le mot « agence » n'apparaît que pour s'en distinguer.
- Afficher la cible (« moyennes et grandes entreprises uniquement ») comme un message.
- Faire de Kettani Immobilier une rubrique ou une section de l'accueil. Kettani est un client parmi d'autres, avec une étude de cas dans Réalisations.
- Citer Amira, Nada ou leurs projets personnels comme références clients.
- Les cartes de services de l'ancien site, les photos rondes, les empilements d'icônes, le tableau « Leadvice vs agence classique », le formulaire d'abonnement newsletter, la répétition du même bouton à chaque section.
- Plus de cinq grands moments spectaculaires sur l'ensemble du site.

### 1.3 Règle de décision autonome

Quand une information te manque :
1. Cherche si ce document permet de la déduire. Si oui, applique.
2. Si c'est une décision de conception ou technique, prends l'option la plus simple et la plus robuste qui respecte le territoire créatif (partie 3), puis note-la dans le rapport de phase.
3. Si c'est une preuve commerciale (chiffre, résultat, client, mission chez un client), tu n'inventes pas : tu reformules sans chiffre, ou tu retires l'élément. Le rendu reste complet, sans trou visible.
4. Tu ne t'arrêtes jamais pour poser une question sur un point que ces règles permettent de trancher.

### 1.4 Politique de vérité du contenu

| Situation | Ce que tu fais |
|---|---|
| Chiffre listé en 2.4 | Tu l'affiches tel quel |
| Fait écrit dans ce document | Tu l'affirmes |
| Mission précise non documentée chez un client | Tu n'en parles pas, tu affiches le nom et le secteur |
| Résultat non documenté | Tu ne l'écris pas |
| Client absent de la liste 2.5 | Tu ne le nommes pas |

### 1.5 Définition de « terminé »

Une phase est terminée seulement si : `npm run build` passe ; zéro erreur console ; rendu vérifié à 375, 768, 1280 et 1920 px ; aucune occurrence de `lorem`, `TODO`, `FIXME`, `placeholder`, `À COMPLÉTER` dans `src/` ni dans `dist/` (vérifie avec une recherche) ; tous les liens internes résolus ; title, meta description, canonical, Open Graph et JSON-LD présents sur chaque page livrée ; Lighthouse mobile conforme à 5.2 sur chaque page livrée ; rapport de phase rédigé (1.7).

### 1.6 Ton éditorial

Français, vouvoiement. Direct, précis, intelligent, humain, jamais prétentieux. Phrases courtes pour les titres, quelques lignes d'explication en dessous. Pas de jargon creux (« synergie », « 360° », « solutions innovantes », « booster »). Pas de promesse floue. Le site doit se lire en diagonale : un titre fort suffit à comprendre chaque section.

### 1.7 Rapport de fin de phase

Pages livrées, captures ou lien de prévisualisation (pas de localhost : la session tourne dans le cloud), scores Lighthouse mobile, décisions autonomes prises, ce qui reste pour la phase suivante. Avant de coder une phase, présente un plan court (fichiers, composants, choix techniques) et attends l'accord. Ne démarre pas la phase suivante sans validation.

### 1.8 Les textes du site

Tous les textes du site sont déjà écrits : pages, microcopies, formulaire, e-mails, pages légales et `llms.txt` dans `CONTENU-SITE-LEADVICE.md`, articles dans `CONTENU-INSIGHTS.md`. Intègre-les tels quels, sans les réécrire ni les résumer. Quand un texte de ces fichiers diffère d'un texte cité dans ce prompt maître ou dans `ANIMATIONS-SCROLL-LEADVICE.md`, ce sont les fichiers de contenu qui font foi. Tu ne rédiges toi-même que ce qu'ils ne couvrent pas, dans le même ton, en le signalant dans le rapport de phase.

Toutes les valeurs visuelles (couleurs par rôle, typographie, espacements, rayons, mouvement, composants et leurs états) sont dans `DESIGN-LEADVICE.md`, qui fait foi pour le visuel. Les choix qui en découlent sont justifiés dans `reference/ANALYSE.md` (analyse des six sites de référence). Les variantes de prompts d'images et de vidéos sont dans `VARIANTES-VISUELS-LEADVICE.md`.

---

## PARTIE 2 — LEADVICE

### 2.1 Identité

Leadvice — cabinet de conseil stratégique et marketing, spécialisé dans l'acquisition client. Casablanca, Maroc. Fondé en janvier 2022.

Règle de positionnement qui traverse tout le site : **Leadvice est un cabinet de conseil qui maîtrise l'exécution, pas une agence marketing qui ajoute une couche stratégique.** Chaque page doit le faire sentir.

Informations légales (pages Mentions légales, footer, JSON-LD) :
- Raison sociale : LEADVICE SARL, capital 100 000 DH
- Siège : Hay Laayoune, Angle Rue Ait Yaflmane, Fida N°341, 2ème étage, Casablanca, Maroc
- RC 527921 · ICE 002978060000045 · IF 51669892 · Patente 33501510 · CNSS 4200083
- Contact : contact@leadvice.org
- Instagram : @theleadvice

### 2.2 Cible

Moyennes et grandes entreprises, au Maroc en priorité. C'est une contrainte de conception et de qualification, jamais un message affiché. Elle se traduit par le niveau d'exigence du ton, la nature des exemples, les questions de qualification du formulaire et la qualification interne des demandes. Aucune phrase du site n'affirme que Leadvice travaille avec des entreprises de toute taille.

### 2.3 Fondatrices

- **Amira Dounassre** — cofondatrice. Ingénieure d'État en informatique (EMI), Mastère Spécialisé ESSEC (stratégie, transformation digitale et innovation). Univers : acquisition, digital, transformation.
- **Nada Moujibi** — cofondatrice, Strategy Lead. Ingénieure EMI, trois ans d'audit financier chez EY. Univers : stratégie, audit, business.

Pas de « CEO, 10 ans d'expérience » en premier écran : on montre les personnes, puis les rôles, puis le parcours. Objectif : la confiance avant l'autorité.

Photos : si le dossier `assets/fondatrices/` contient des portraits, utilise-les en traitement éditorial (grand format, recadrage serré, légère désaturation, accent violet). S'il est vide, réalise des portraits graphiques : initiales en serif éditoriale très grand format, traversées par la trajectoire (3.4), avec les trois mots-univers de chacune. Les deux versions sont des rendus finis, pas des cases vides.

### 2.4 Chiffres autorisés (tous réels)

Chiffres du cabinet :
- **+1 000** leads générés chaque mois pour nos clients
- **+23** clients accompagnés
- **126** campagnes lancées
- **+10 893** prospects générés
- **+300** posts et créatives publicitaires produits

Formulation : jamais de compteur qui laisse croire à une donnée en temps réel. Ce sont des chiffres cumulés, présentés comme tels.

Chiffres de l'étude de cas Kettani Immobilier (période avril 2025 – mars 2026) :
- environ **41 000 leads** générés via Meta Ads
- **7 programmes** accompagnés : Aquarelle, SDR, Le Clos de Bouznika, RDG, Ramoflores, Les Jardins de Mansouria, Corporate
- **12 mois** d'accompagnement continu sur Meta Ads et Google Ads

Coûts par lead moyens constatés sur l'ensemble de nos clients (chiffres du cabinet, à afficher avec les autres preuves) :
- **moins de 1 $** par lead sur Meta Ads
- **entre 1 et 2 $** par lead sur Google Ads

Formulation imposée : « coût moyen par lead constaté sur nos clients ». Ces coûts sont une moyenne tous clients confondus : ne les attribue jamais à Kettani Immobilier, et n'affiche aucun coût par lead propre à Kettani. Dans l'étude de cas, explique simplement que l'immobilier haut de gamme (appartements à plus de 1,9 M MAD) a un coût d'acquisition naturellement plus élevé, et que l'enjeu y est la qualité et l'intention du lead plus que son prix.

Aucun autre chiffre n'est autorisé. Tu n'en as pas besoin : ces données suffisent pour toutes les sections.

### 2.5 Clients (logos fournis dans `assets-wix/`, tous autorisés)

| Logo | Fichier | Secteur affiché | Détail au survol |
|---|---|---|---|
| Kettani Immobilier | `logo-client-kettani.png` | Immobilier | Acquisition digitale · Meta Ads · Google Ads → lien étude de cas |
| Royal Air Maroc | `logo-client-royal-air-maroc.png` | Transport aérien | Nom + secteur |
| Attijariwafa bank | `logo-client-attijariwafa-bank.png` | Banque | Nom + secteur |
| ITROAD Group | `logo-client-itroad.png` | Services IT | Nom + secteur |
| ZEYA | `logo-client-zeya.png` | E-commerce · Bijoux | Nom + secteur |
| Beadsbox | `logo-client-beadsbox.png` | E-commerce | Nom + secteur |
| Milla | `logo-client-milla.png` | Marque | Nom |
| Frag'in | `logo-client-frayin.png` | Aromatique | Nom + secteur |

Seul Kettani reçoit une description de mission, parce que c'est la seule documentée. Les autres affichent nom et secteur, ce qui est vrai et suffit. Traite les logos en monochrome (blanc sur fond sombre, noir sur fond clair) via CSS ou en préparant des variantes optimisées en WebP/AVIF ; couleur d'origine au survol.

Logo Leadvice : `assets-wix/logo-leadvice.png`. Vectorise-le en SVG (forme simple) pour la netteté et le poids ; conserve exactement la couleur #301781.

### 2.6 Offre : quatre leviers

Reprend les quatre services historiques de Leadvice sous une forme plus stratégique :

1. **Stratégie** — comprendre avant d'agir. Audit marketing et digital, stratégie d'acquisition, positionnement et offre, plan d'action hiérarchisé, conseil et structuration (vision, offres, organisation).
2. **Création** — trouver le message qui mérite d'être vu. Concepts créatifs, angles et hooks, publicités statiques et vidéo, contenus pour les réseaux sociaux. Du contenu qui sert l'acquisition, pas seulement l'image.
3. **Acquisition** — mettre le bon message devant les bonnes personnes. Meta Ads (Facebook, Instagram), Google Ads (Search, Display), génération de leads, media buying, structures TOF/MOF/BOFU, ciblage et segmentation fine, formulaires qualifiants.
4. **Pilotage** — mesurer, comprendre, optimiser. Suivi hebdomadaire des chiffres, reporting utile (pas de PDF qui dort dans un dossier), optimisation continue, co-pilotage avec les équipes du client.

**Service complémentaire : Sites web.** Sites vitrines, pages de destination par campagne, prise de rendez-vous et formulaires qualifiants, mesure des conversions, vitesse et référencement, autonomie du client sur ses contenus. Ce n'est pas un cinquième levier ni un métier d'agence web générique : c'est l'endroit où l'acquisition se transforme en demandes. Il a sa page (`/expertises/sites-web/`), une ligne à part sur la page Expertises (« Et pour accueillir vos visiteurs »), une phrase discrète sous les leviers de l'accueil, une question dans la FAQ Acquisition et une entrée dans le footer. Aucun site client n'est montré tant qu'Amira n'en fournit pas : la seule vitrine est le site Leadvice lui-même.

Ces leviers ne fonctionnent pas seuls : la page Expertises se conclut sur leur interconnexion (stratégie → création → acquisition → données → retour à la stratégie).

### 2.7 Méthode (cinq temps)

1. **Diagnostiquer** — on commence par écouter. Analyse des publicités, des contenus, des performances ; identification de ce qui freine l'acquisition.
2. **Structurer** — un plan simple, hiérarchisé, actionnable. Publicité, contenu, stratégie, organisation alignés sur les objectifs.
3. **Exécuter** — mise en place des actions, pilotage des campagnes.
4. **Mesurer** — suivi des chiffres chaque semaine, bilans utiles.
5. **Optimiser** — on ajuste ce qui doit l'être. Un système qui apprend.

### 2.8 Engagement et philosophie

Engagement (reprise de l'ancien site, à condenser) : des résultats visibles sur l'activité (de vrais prospects et des ventes, pas du buzz) ; une stratégie adaptée au marché, aux moyens et aux priorités du client, conseillée comme si c'était notre propre entreprise ; un accompagnement humain, structuré et transparent : un interlocuteur clair, on sait ce qui est fait, pourquoi, et ce que ça rapporte.

Manifeste (section Philosophie, une ligne qui apparaît à la fois) :
> Pas plus de campagnes. De meilleures décisions.
> Pas plus de contenu. De meilleurs angles.
> Pas plus de leads. De meilleurs prospects.
> Pas plus de reporting. Plus de compréhension.

Les différences avec une agence classique (cadrage initial, objectif clair de prospects et de ventes, pilotage régulier, co-pilotage, solutions sur mesure, vision business) s'expriment à travers ce manifeste et la méthode, jamais sous forme de tableau comparatif.

---

## PARTIE 3 — CONCEPT CRÉATIF

### 3.1 Territoire : SIGNAL / ANGLE / PRÉCISION

Idée centrale : il ne s'agit pas de faire plus de marketing. Il s'agit de trouver ce qui compte, de trouver le bon angle, puis de le mettre en mouvement avec précision. C'est la grammaire de tout le site, jamais un slogan affiché.

Le parcours émotionnel visé : « Qu'est-ce que c'est ? » → « Ils parlent de marketing autrement » → « Ils ont une vraie méthode » → « Ils l'ont déjà fait » → « J'ai envie de leur parler ».

Rythme : immersion → respiration → information → immersion → preuve → immersion → conversion. Le luxe vient de la maîtrise du rythme : certaines sections sont volontairement très calmes.

### 3.2 Les trois modes visuels

- **Mode BRUIT** — fond violet-noir, matière dense, fragments, profondeur, flou, mouvement lent. Le visiteur est dans la complexité.
- **Mode SIGNAL** — le violet s'intensifie, les éléments importants deviennent nets, les lignes convergent, la composition se simplifie. Le visiteur comprend.
- **Mode PRÉCISION** — fond blanc cassé, typographie noire, grille stricte, beaucoup d'espace. C'est là que vivent la méthode, les expertises, les preuves et les articles.

### 3.3 Les cinq primitives de mouvement

Pas cinquante animations : cinq comportements, réutilisés partout.

| Primitive | Ce qui se passe | Ce que ça signifie |
|---|---|---|
| **LENS** | une zone de netteté suit le curseur et révèle ce qui était flou ou caché | diagnostic, observation |
| **ANGLE** | le point de vue, le cadrage ou la perspective change, et le message change avec | stratégie, création |
| **SIGNAL** | un élément devient dominant et prend le violet, les autres s'effacent | priorisation, décision |
| **FLOW** | une trajectoire se met en mouvement, des points circulent, certains sont filtrés | acquisition, exécution |
| **LOOP** | les données reviennent dans le système et corrigent la trajectoire | mesure, optimisation |

Grammaire de mouvement : apparition progressive = découverte ; mise au point = compréhension ; convergence = décision ; accélération = exécution ; retour = optimisation ; disparition = élimination d'une mauvaise piste ; changement d'angle = nouvelle lecture.

### 3.4 Les six composants signature

1. **Le signal** — le violet qui n'apparaît que lorsque quelque chose devient important.
2. **La trajectoire** — une ligne fine, toujours la même entité, qui traverse tout le site : ligne, chemin, connexion, courbe, graphique, boucle. Elle forme le L du logo à l'ouverture et conduit au CTA final.
3. **La lentille** — la zone de netteté pilotée par le curseur (desktop) ou par le toucher (mobile).
4. **L'angle** — le changement de perspective sur une même scène.
5. **Le flux** — le système qui avance.
6. **La boucle** — la donnée qui revient et améliore.

Le logo Leadvice reste fixe et stable : tout bouge autour de lui. Il est le point de repère dans la complexité.

### 3.5 Les cinq grands moments (pas un de plus)

1. **Le bruit devient signal** — l'ouverture de l'accueil.
2. **La lentille** — le visiteur fouille la matière et découvre ce qui compte.
3. **Le changement d'angle** — une même offre racontée sous trois angles (accueil, scène Angle).
4. **Le système** — les briques business s'assemblent autour de la stratégie (accueil et Expertises).
5. **La boucle** — la méthode en cinq temps qui se referme (accueil et Cabinet).

Les animations signatures sont des séquences d'images liées au scroll (3.8), déclinaisons de ces primitives et non des moments supplémentaires :
- Ouverture de l'accueil → **la foule qui se resserre** : une seule section continue. Dès l'arrivée, sans défilement, un tourbillon de traits de lumière se range en foule de silhouettes sous un faisceau violet (3,2 s), sous le H1 affiché immédiatement ; le curseur éclaire la foule. Puis, au défilement, la même scène « Du bruit au client » où une grille de silhouettes est filtrée en cinq étapes par une barre de lumière violette, jusqu'aux quelques clients violets qui s'alignent au centre (`CONTENU-SITE-LEADVICE.md` et `DESIGN-LEADVICE.md` 6.23 quinquies ; code de référence `prototype/site.js`, `SCENES.crowd`). La visibilité des scènes se calcule à chaque image avec `getBoundingClientRect`, jamais avec un `IntersectionObserver` seul, qui se trompe sur les éléments épinglés. La séquence d'images `funnel` reste une option secondaire.
- Stratégie → **le nœud de décision qui se résout** (séquence `noeud`, ANGLE + SIGNAL) : sur une île de plâtre, un enchevêtrement de chemins s'efface et il n'en reste qu'un, violet, jusqu'à une porte éclairée.
- Acquisition → **le signal qui s'amplifie** (séquence `phare`, SIGNAL + FLOW) : un phare s'allume, son faisceau violet balaie la mer et se pose sur trois bateaux parmi une douzaine.
- Création → **le prisme** (séquence `prisme`, ANGLE) : le prisme tourne et le faisceau blanc se sépare en trois (prix, confort, investissement).
- Pilotage → **le cadran** (séquence `cadran`, LOOP) : l'aiguille monte, se corrige, puis se fixe dans la zone violette.

Le reste du site est élégant et sobre : micro-interactions discrètes (un chiffre qui se compose, un logo qui devient net, une flèche qui avance), jamais de rebond, rotation ou effet gratuit.

### 3.6 Couleurs

Valeurs complètes, rôles clair et sombre et contrastes calculés : `DESIGN-LEADVICE.md`, section 2. L'essentiel :

- **Violet Leadvice #301781** — couleur de marque. Logo sur fond clair, bouton principal sur fond clair (texte blanc, 13,42:1). Ne jamais la modifier. Sur fond sombre, elle est invisible (1,45:1 sur #0E0A1F) : on ne l'y utilise pas.
- **Signal lumineux #7B61FF** — la lumière de la marque : trajectoire, lueurs, liseré d'activation, accent des séquences d'images, focus. 4,62:1 sur #0E0A1F. Jamais en texte courant sur fond clair.
- **Violet lavande #B4A6FF** — liens et accents de texte sur fond sombre (9,09:1).
- **Lavande grise #9B8EC4** — texte secondaire sur fond sombre (6,53:1), lignes du bruit.
- **Deep Space #0E0A1F** — fond des scènes immersives et du mode sombre (violet-noir, jamais #000).
- **Blanc chaud #FCFBF8** — fond du site (plus lumineux que l'ancien #F6F4EF, qui reste utilisé comme texte et logo sur fond sombre).
- **Encre #14121A** — texte sur fond clair (16,89:1).

Sur fond sombre, le bouton principal est off-white avec texte encre. Hiérarchie par la luminosité, pas par l'ajout de couleurs. Le signal n'apparaît qu'une fois par écran.

### 3.7 Typographie

- **Instrument Serif** : titres (H1 à H3), grands chiffres, questions de FAQ, manifeste, citations. Jamais en paragraphe.
- **Geist** : texte courant, interface, boutons, micro-légendes et données, en chiffres tabulaires. Pas de monospace.
- Échelle fluide à dix niveaux, interlignages et largeurs de lecture : `DESIGN-LEADVICE.md`, section 3. Casse de phrase partout, aucune étiquette en capitales, aucun mot isolé coloré dans un titre. `font-display: swap`, préchargement de la seule graisse utilisée au-dessus de la ligne de flottaison.

### 3.8 Images et matière

Aucune photo ou vidéo de banque d'images, et aucun élément `<video>` sur le site. Deux sources de matière visuelle :

- **Les séquences d'images liées au scroll** décrites dans `ANIMATIONS-SCROLL-LEADVICE.md` : `funnel` pour l'ouverture de l'accueil, `noeud`, `phare`, `prisme` et `cadran` pour les quatre leviers. Images générées par IA dans un seul monde visuel (objets sculptés façon film d'animation 3D, vide violet-noir #0E0A1F, violet lumineux #7B61FF comme unique accent), découpées en images numérotées. Elles portent l'ouverture et les animations de levier ; leur dernière image illustre aussi chaque levier sur /expertises/ et dans la scène 7 de l'accueil. Leur intégration, leurs textes et leurs budgets de poids sont définis dans ce fichier, qui fait autorité sur ce sujet. Tant qu'un dossier `sources/sequences/<nom>/` n'existe pas encore dans le dépôt, la scène correspondante utilise la version codée décrite ci-dessous ; elle bascule sur la séquence dès que le dossier est ajouté.
- **La matière produite par le code**, pour tout le reste :
- **Particules et lignes** sur un canvas 2D unique par scène.
- **Fragments de « réalité marketing »** dessinés en SVG stylisé : silhouette de téléphone, carte publicitaire, barre de recherche, courbe de performance, tunnel de conversion, notification. Traitement graphique monochrome lavande, jamais une capture d'écran posée dans une carte.
- **Textures** générées : grain léger, dégradés radiaux violet, verre dépoli (backdrop-filter avec repli), reflets.
- **Profondeur** : trois plans (avant, milieu, arrière) qui défilent à des vitesses différentes.

### 3.9 Curseur, scroll, mobile

- **Curseur** (desktop, pointeur fin uniquement) : curseur système normal ; sur zone interactive, les éléments réagissent par leur état de survol. Au-dessus d'une séquence épinglée seulement, un anneau fin de 56 px portant « Défiler » accompagne le curseur (`DESIGN-LEADVICE.md`, 6.21). Pas de traînée, pas de rond permanent. La retenue fait le premium.
- **Scroll** : trois comportements. Normal (le contenu avance), narratif (la scène est épinglée pendant qu'elle évolue, 150 à 250 vh max), transformation (un objet devient autre chose : point → ligne → trajectoire → graphique). Défilement lissé avec Lenis (environ 3 Ko gzip, `lerp` 0,1) synchronisé avec le ticker de GSAP, pour que les séquences et le ruban de signal glissent comme sur les sites de référence. Lenis est coupé sur les écrans tactiles (défilement natif), avec `prefers-reduced-motion`, et ne bloque jamais la navigation au clavier ni les ancres.
- **Mobile** : une expérience pensée pour le doigt, pas un desktop réduit. La lentille devient une zone révélée au toucher ou au passage du scroll ; le changement d'angle se fait au swipe horizontal ; les scènes épinglées sont raccourcies ; le nombre de particules est divisé par quatre.

### 3.9 bis Prototype de référence

Le dossier `prototype/` contient une maquette fonctionnelle multipage validée par Amira (accueil, expertises et les quatre pages leviers, réalisations, étude de cas, cabinet, insights, diagnostic) : fond clair, fil de signal sur chaque page, une scène canvas par levier (`knot`, `prism`, `beacon`, `dial`, `loop`), bandeau de logos animé, textes qui s'allument, formulaire en six étapes. Reprends sa structure, ses scènes et son rythme ; réécris le code proprement en composants Astro typés, avec les budgets de 5.2, les textes de `CONTENU-SITE-LEADVICE.md` et les valeurs de `DESIGN-LEADVICE.md`. Les séquences d'images de `ANIMATIONS-SCROLL-LEADVICE.md` peuvent ensuite remplacer ou enrichir ces scènes codées, page par page.

Le site est clair : les séquences et images fixes sont générées sur le fond papier `#F6F4EF` avec les prompts de `PROMPTS-VISUELS-SITE-CLAIR.md`, qui remplacent les fonds sombres des fichiers d'animation pour toutes les pages claires.

### 3.9 ter Mobile autant que desktop

Chaque page est validée à 390 px et à 1440 px avant d'être déclarée finie, selon `DESIGN-LEADVICE.md` 6.23 quater : compositions portrait propres à chaque scène, scènes épinglées 40 % plus courtes, glissements natifs, cibles de 44 px, aucune étiquette coupée, aucun débordement horizontal (`document.documentElement.scrollWidth === innerWidth`). Le nuage de clients et le chemin d'un dirham ont leur comportement tactile décrit en 6.23 bis et 6.23 ter.

### 3.9 quater Révisions d'octobre (à reprendre telles quelles)
Le fil conducteur passe dans la marge gauche avec des repères par chapitre et le titre du chapitre en cours (DESIGN 6.23 nonies) ; il ne croise jamais le texte. La création et l'acquisition ont de nouvelles scènes, « Une offre, trois angles » et « Du public aux leads qualifiés » (6.23 decies et undecies), qui remplacent le prisme et le phare, y compris dans les vignettes animées des listes de leviers. Le bouton flottant devient une étiquette de réservation (6.23 duodecies). Le fil d'Ariane se fixe en haut quand il sort de l'écran (6.23 terdecies). La 404 est une scène interactive (6.23 quaterdecies). Le simulateur garde des réglages très optimistes par décision d'Amira (CONTENU, section 6). Le diagnostic offert dure 45 minutes (créneaux de 45 min, pause 15 min). Le « maintenir pour révéler » est supprimé partout. Chaque article Insights a sa page complète avec sommaire suivi au défilement, bloc diagnostic en fin d'article et deux articles « À lire aussi » (référence : `prototype/insight-*.html`). Les séquences vidéo correspondantes sont dans `PROMPTS-VISUELS-SITE-CLAIR.md` (angles, cible, perdu).

### 3.10 Règle de robustesse

Le concept doit survivre au dispositif technique. Sans JavaScript, sans animation (`prefers-reduced-motion`), sans curseur : tout le contenu reste lisible et chaque scène affiche son état final, composé et beau. Sur un appareil modeste, on réduit la densité. Le visiteur ne doit jamais attendre l'animation pour lire le titre.

### 3.11 Références d'animation choisies par Amira

Six sites servent de référence pour le mouvement. Ouvre-les sur desktop avant la phase 0 et reprends-en l'esprit, jamais le code, les textes ou les visuels. Les trois premiers comptent double.

| Référence | Ce qu'on en retient | Où sur le site Leadvice |
|---|---|---|
| **oryzo.ai** (Lusion) | Un objet ordinaire présenté comme un produit Apple : l'objet reste au centre, le mouvement est retenu, les transitions passent sans coupure d'une composition à une autre (3D → plan → 3D) ; titres révélés par un masque ; particules interactives dans le footer | Les séquences d'images traitées comme des « keynotes » ; la trajectoire violette qui relie une scène à la suivante ; le footer (point 6) |
| **why.zero.university** | Une seule ligne de temps continue au scroll, faite de moments symboliques ; « maintenir pour avancer » ; effets de matière (givre, brûlure, verre) ; textes qui se composent ; un formulaire qui finit sur une animation personnalisée | L'accueil comme un seul récit continu ; le maintien (point 1) ; la révélation à l'encre (point 2) ; la page merci personnalisée (point 8) |
| **mindmarket.com** | Cartes qui s'empilent au scroll, survols joueurs, récit très clair d'un métier intellectuel, palette à deux couleurs | La méthode en cinq temps sur /cabinet/ (point 3) ; les survols de 5.10 ; le ton clair |
| **mont-fort.com** (Immersive Garden) | Un groupe corporate rendu premium : transitions de page très soignées, calme, beaucoup d'espace | Les transitions entre pages (point 4) |
| **davidwhyte.com/experience** (Immersive Garden) | Paysages à l'aquarelle qu'on traverse au scroll, effet aquarelle qui suit la souris, appui long qui révèle un paysage, poème plein écran | Le manifeste plein écran avec appui long (point 1) ; la lentille à l'encre (point 2) |
| **era-residence.com** | Parallaxe et récit au scroll, défilement horizontal, galerie | Parallaxe (point 5) ; défilement horizontal des sept programmes Kettani (point 7) |

Interactions à construire, en plus des séquences d'images (`ANIMATIONS-SCROLL-LEADVICE.md`) :

1. **(Supprimé en octobre, ne pas construire.)** **Maintenir pour révéler** (Why Zero, David Whyte). Une interaction signature, en deux endroits. Sur la scène Lentille de l'accueil : maintenir le clic (ou le doigt sur mobile) agrandit la zone nette jusqu'à tout l'écran ; relâcher la referme. Sur le manifeste de /cabinet/, présenté en plein écran une phrase à la fois comme le poème de David Whyte : chaque première moitié (« Pas plus de campagnes. ») s'affiche seule, et maintenir révèle la seconde (« De meilleures décisions. ») par une montée d'encre violette. Un anneau fin autour du curseur se remplit pendant le maintien (environ 800 ms). Mention discrète « Maintenez pour révéler » au premier passage. Jamais bloquant : la seconde moitié apparaît aussi d'elle-même en continuant le scroll, au clavier avec Espace ou Entrée maintenus, et directement avec `prefers-reduced-motion`.
2. **Révélation à l'encre** (David Whyte, Why Zero). La lentille et le manifeste utilisent un masque d'encre aux bords irréguliers plutôt qu'un cercle net : un petit shader WebGL écrit à la main, sans Three.js, de moins de 6 Ko, chargé après le premier rendu, avec repli en masque CSS (`mask-image` sur une texture de bruit) si WebGL n'est pas disponible.
3. **Cartes empilées** (MindMarket). Sur /cabinet/, les cinq temps de la méthode (2.7) sont cinq cartes qui montent et s'empilent au scroll, la carte active pleine, les précédentes légèrement réduites et assombries derrière. Chaque carte porte un petit dessin SVG animé de la trajectoire propre à son étape. Sur mobile, même principe en une colonne.
4. **Transitions entre pages** (Montfort, Oryzo). Avec la View Transitions API native (`@view-transition { navigation: auto; }`, sans JavaScript) : la trajectoire violette traverse l'écran, l'ancienne page s'efface sous elle et la nouvelle apparaît ; le logo et le header restent fixes, conformément à 3.4. Les navigateurs sans support changent de page normalement.
5. **Parallaxe** (ERA). Trois plans à vitesses différentes (fond, image, titre), décalages de 40 px maximum, sur : le bloc H1 de l'accueil au-dessus de la séquence, la scène des quatre leviers, le hero de /realisations/ et le hero de /cabinet/. Désactivée avec `prefers-reduced-motion`.
6. **Footer vivant** (Oryzo). Derrière le footer, quelques centaines de particules lavande sur un canvas 2D qui s'organisent en trajectoire et s'écartent doucement du curseur. Chargé seulement quand le footer approche, suspendu hors écran, absent sur mobile modeste et avec `prefers-reduced-motion`.
7. **Défilement horizontal** (ERA). Sur l'étude de cas Kettani, les sept programmes (Aquarelle, SDR, Le Clos de Bouznika, RDG, Ramoflores, Les Jardins de Mansouria, Corporate) défilent horizontalement pendant le scroll vertical, section épinglée, une carte par programme avec son nom et le type d'intervention. Sur mobile, défilement horizontal natif au doigt avec accroche (`scroll-snap`).
8. **Fin de formulaire personnalisée** (Why Zero). Sur /diagnostic/merci/, la trajectoire se dessine à travers les étapes que le visiteur vient de remplir et s'arrête sur l'enjeu qu'il a choisi, repris en grand : « Votre enjeu : générer plus de leads qualifiés. » Puis les trois prochaines étapes de 4.8.
9. **Titres révélés** (Oryzo, Why Zero). Les grands titres en Instrument Serif apparaissent ligne par ligne derrière un masque, au moment où ils entrent dans l'écran. Le texte est dans le HTML dès le chargement : seule son apparition est animée, et jamais celle du H1 au-dessus de la ligne de flottaison.

Décisions ajoutées après l'étude du code des six sites (`reference/ANALYSE.md`) :

10. **Ruban de signal continu** (Why Zero, Oryzo). Sur l'accueil, un seul tracé SVG de 1,5 px en #7B61FF avec lueur parcourt toute la page au défilement (DrawSVG, `scrub: 1`), passe derrière les textes, entre dans chaque scène et conduit au bouton final. C'est la trajectoire de 3.4 rendue visible d'un bout à l'autre.
11. **Phrase sur la courbe** (Why Zero). Dans la scène Preuves, une phrase suit une portion du ruban (`<textPath>`, `startOffset` animé). Le SVG est `aria-hidden` ; la phrase existe aussi en HTML normal. Texte dans `CONTENU-SITE-LEADVICE.md`.
12. **Liseré d'activation** (MindMarket). Bouton survolé, carte de choix sélectionnée, étape courante du rail : un liseré de lumière de 1 px fait le tour de l'élément (dégradé conique animé via `@property`, CSS seul).
13. **Transitions de brume** (Montfort). Entre une section claire et une section sombre, un fondu vertical de 160 px avec un grain très léger, jamais une coupure nette.
14. **Titres de carrousel recomposés** (MindMarket). Dans le carrousel des réalisations, le nom du client se recompose lettre par lettre au changement (SplitText, 320 ms), avec un compteur « 2 sur 8 ».
15. **Masques en arche** (Montfort). Les visuels des pages Expertises et les portraits des fondatrices sont découpés en arche (`border-radius: 999px 999px 2px 2px`).
16. **Numérotation réservée aux vraies séquences** : le rail du funnel et la méthode en cinq temps. Nulle part ailleurs.
17. **« Revoir l'ouverture »** (Oryzo). Lien en pied de page qui remonte en haut de l'accueil et rejoue la séquence funnel.

Ce qu'on ne reprend pas de ces sites, parce que ça coûterait des prospects ou de la vitesse : l'écran d'entrée à débloquer par un geste (Why Zero) et l'écran de chargement (ERA), qui retardent l'accès au contenu et nuisent au référencement ; le son ; la 3D en temps réel avec Three.js, dont l'équivalent visuel vient ici des séquences d'images pré-calculées.

Toutes ces interactions apparaissent dans `/dev/animations/` pour validation, à côté des séquences.

---

## PARTIE 4 — ARCHITECTURE ET CONTENU

### 4.1 Arborescence

```
/                                   Accueil
/expertises/                        Les quatre leviers
/expertises/strategie/
/expertises/creation/
/expertises/acquisition/
/expertises/pilotage/
/expertises/sites-web/             Service complémentaire : sites et pages de destination
/realisations/                      Galerie clients
/realisations/kettani-immobilier/   Étude de cas
/cabinet/                           Philosophie, méthode, fondatrices, FAQ
/insights/                          Bibliothèque éditoriale
/insights/[slug]/                   Articles (6 au lancement)
/diagnostic/                        Formulaire « Parlons de votre croissance »
/diagnostic/merci/
/lp/generation-de-leads/            Landing pages Ads (noindex)
/lp/conseil-strategique/
/lp/audit-marketing/
/mentions-legales/
/confidentialite/
/cookies/
/404
/llms.txt
/dev/animations/                    Démonstration des primitives (noindex, hors sitemap)
```

### 4.2 Navigation

Desktop : logo à gauche ; « Expertises · Réalisations · Le cabinet · Insights », où « Expertises » est un lien vers la page d'ensemble suivi d'un bouton flèche (`aria-expanded`, `aria-haspopup`) qui ouvre un sous-menu : Vue d'ensemble, Stratégie, Création, Acquisition, Pilotage, Sites web, chacun avec une ligne d'aide. Ouverture au survol avec un délai de fermeture de 200 ms, au clic et au clavier ; Échap ferme ; liens hors de l'ordre de tabulation quand il est fermé. Sur mobile, « Expertises » déplie la même liste dans le menu. La page Expertises reprend ces entrées en accès direct sous l'introduction ; à droite le bouton « Parlons-nous → » (vers /diagnostic/). Header transparent au-dessus des scènes sombres, fond off-white au-dessus des sections claires, réduit au scroll vers le bas, réapparaît au scroll vers le haut.

Mobile : logo + « Menu ». L'ouverture du menu est une petite scène : fond Deep Space, la trajectoire traverse l'écran et les quatre entrées apparaissent une à une, CTA en bas.

Footer minimal : logo, « Conseil stratégique & marketing », les quatre entrées, Diagnostic, contact@leadvice.org, Instagram @theleadvice, Casablanca, liens légaux, « © 2026 Leadvice SARL ». Pas de formulaire d'abonnement.

CTA unifiés sur tout le site : principal « Demander un diagnostic », navigation « Parlons-nous → », secondaires « Voir le cas → », « Découvrir les expertises → ». La flèche est un motif récurrent qui signifie la progression.

**Défilement et liens.** Toute nouvelle page s'ouvre en haut (`history.scrollRestoration = "manual"` sauf retour arrière, où la position est restaurée ; Lenis remis à 0). Un lien vers la page en cours remonte en haut en douceur au lieu de recharger. Les liens du pied de page « Mentions légales », « Confidentialité », « Cookies » mènent à leurs pages, jamais à une autre page par défaut. Cibles tactiles d'au moins 24 × 24 px (WCAG 2.2, 2.5.8), 44 px pour les boutons.

### 4.3 Accueil — onze scènes

**Rendu initial** (avant toute animation, c'est ce qui fait le LCP) : fond Deep Space, sur-titre « Cabinet de conseil stratégique & marketing — Casablanca », H1 en Instrument Serif « Moins de bruit. Plus de clients. », sous-titre et bouton « Demander un diagnostic » (textes exacts : `CONTENU-SITE-LEADVICE.md`, section 2). La première image de la séquence `funnel` s'installe derrière, après le premier rendu.

Quand la séquence `funnel` est présente, elle porte les scènes 1 à 4 : le nuage de billes est le bruit, la lentille se joue en calque par-dessus, les cinq billes violettes sont le signal d'où part la ligne qui dessine le L du logo (déroulé précis : section 7 d'`ANIMATIONS-SCROLL-LEADVICE.md`). Les descriptions des scènes 1 à 4 ci-dessous restent la version codée, utilisée tant que la séquence n'est pas déposée et comme repli.

1. **Ouverture** — des centaines de fragments (points, bouts de lignes, petits chiffres, mots minuscules) dérivent lentement. Le visiteur ne comprend pas encore ce qu'il regarde, c'est voulu.
2. **Bruit** — au premier scroll, la matière s'épaissit ; des mots se lisent (AUDIENCE, DATA, CONTENU, MEDIA, CAMPAGNE, SEARCH, CONVERSION, CRM) et des fragments SVG de réalité marketing passent. Texte : « Tout commence par comprendre. » puis « Le problème n'est pas le manque de données. » puis « C'est de savoir lesquelles comptent. »
3. **Lentille** — la zone de netteté suit le curseur ; survoler un mot révèle son contenu (AUDIENCE → une segmentation, DATA → une courbe, MEDIA → une publicité, CONVERSION → un parcours). Le visiteur fait ce que fait Leadvice : il cherche ce qui compte.
4. **Signal** — une trajectoire fine et lumineuse traverse le chaos, attire certains signaux, les autres ralentissent puis disparaissent. Silence : écran presque vide, la ligne seule, « Trouver le signal. » puis « Lui donner une direction. ». La ligne dessine le L du logo, le logo apparaît.
5. **Angle** — une même offre immobilière présentée en trois angles (Prix · Confort · Investissement) que le visiteur fait tourner au scroll ou au swipe ; chaque angle change l'image SVG et l'accroche. Texte final : « Le problème n'est pas toujours l'offre. C'est parfois l'angle. »
6. **Système** — respiration en mode Précision : « Le marketing n'est pas une suite d'actions. » puis « C'est un système. » Puis BUSINESS, DATA, AUDIENCE, MESSAGE, MEDIA, CONVERSION arrivent séparément, se connectent, et STRATÉGIE apparaît au centre.
7. **Les quatre leviers** — Stratégie, Création, Acquisition, Pilotage (2.6) : quatre rangées, chacune illustrée par la dernière image de la séquence du levier, avec une parallaxe discrète, une ligne de texte et un lien vers la page du levier. Lien final « Découvrir les expertises → ».
8. **Preuve** — les chiffres de 2.4 deviennent des objets : « 10 893 » se compose à partir de milliers de points ; « 126 » à partir de petits blocs publicitaires qui se réorganisent ; « < 1 $ » (coût moyen par lead Meta Ads constaté sur nos clients) et « 1 à 2 $ » (Google Ads) mis en avant comme la preuve d'une acquisition efficace ; les autres apparaissent en grand format typographique. Puis la constellation des huit logos sous le titre « Des entreprises. Des problématiques différentes. Une même exigence. » Au survol, le logo devient net, la trajectoire s'y connecte et la fiche apparaît (2.5). Lien « Voir les réalisations → ».
9. **Méthode** — la ligne traverse l'écran : Diagnostiquer (elle se divise en branches), Structurer (des branches disparaissent), Exécuter (elle accélère), Mesurer (des données apparaissent), Optimiser (la trajectoire se corrige). Fin : « Un système qui apprend. »
10. **Humain** — tout se calme, fond off-white. Les deux fondatrices (2.3), leurs trois mots-univers, leurs deux trajectoires qui se rejoignent. « Derrière les données, il y a toujours une décision humaine. » Lien « Découvrir le cabinet → ».
11. **Clôture** — fond très sombre, tout est calme. La trajectoire arrive à destination. « Et si nous trouvions votre signal ? » Bouton « Demander un diagnostic ».

### 4.4 Expertises

Page `/expertises/` : titre « Ce qui doit changer dans votre marketing », puis les quatre leviers comme quatre univers interactifs (Stratégie = lentille, Création = angle, Acquisition = flux, Pilotage = boucle), chacun illustré par la dernière image de sa séquence ; chacun ouvre sa page. Fin de page : animation d'interconnexion et « Ces leviers ne fonctionnent pas seuls. »

Chaque page levier suit la même structure : H1 en une phrase forte ; réponse directe en deux ou trois phrases (utile pour le GEO) ; séquence d'images du levier (3.5), en pleine largeur ; ce que nous faisons (liste de 2.6 détaillée en courts paragraphes) ; quand faire appel à nous (trois situations concrètes typiques d'une entreprise établie) ; comment nous travaillons sur ce levier (lien avec la méthode) ; FAQ de quatre questions avec réponses rédigées ; CTA « Demander un diagnostic ».

Page Sites web : même structure, scène « La page qui se construit » (des blocs épars s'assemblent en page, le bouton s'allume, un visiteur clique, une demande arrive), H1 « Un site qui transforme les visites en demandes. », cinq questions de FAQ, expertise suivante : Acquisition.

H1 des pages : Stratégie « Comprendre avant d'agir. » · Création « Trouver le message qui mérite d'être vu. » · Acquisition « Mettre le bon message devant les bonnes personnes. » · Pilotage « Mesurer. Comprendre. Optimiser. »

### 4.5 Réalisations

Hero : « Le marketing est plein de promesses. » puis « Nous préférons montrer. »

Niveau 1 : la mosaïque des huit logos, filtrable par secteur (Immobilier, Banque, Transport aérien, Services IT, E-commerce, Marques). L'immobilier est un secteur parmi d'autres, sans mise en avant.
Niveau 2 : au survol ou au toucher, la fiche du client (2.5).
Niveau 3 : l'étude de cas Kettani Immobilier.

**Étude de cas `/realisations/kettani-immobilier/`** — structure : Le contexte → Le problème → L'angle → L'exécution → Les résultats → Ce que nous avons appris. Contenu factuel à rédiger à partir de ceci : promoteur immobilier haut de gamme (appartements à plus de 1,9 M MAD), sept programmes à commercialiser en parallèle (Aquarelle, SDR, Le Clos de Bouznika, RDG, Ramoflores, Les Jardins de Mansouria, Corporate), cycle de vente long, besoin de leads qualifiés à coût maîtrisé ; dispositif Meta Ads et Google Ads couvrant tous les programmes ; structuration en entonnoir TOF/MOF/BOFU ; hyper-segmentation des audiences (refonte sur Le Clos de Bouznika) ; créatives segmentées par format, par langue (arabe et français) et par programme ; contenus dédiés aux Marocains résidant à l'étranger, au ton empathique et non commercial ; audits réguliers avec détection d'anomalies de coût par lead et recalcul du CTR pondéré ; reporting mensuel et rapport annuel. Résultats : uniquement les chiffres Kettani de 2.4, sans aucun coût par lead. Enseignements : la langue de la créative change la performance, le ciblage fin bat le volume, chaque programme mérite sa propre lecture, et un levier absent (SDR n'avait pas de présence Google Ads) est une opportunité identifiée par l'audit. Aucune citation de client.

### 4.6 Le cabinet

Hero : « Nous ne croyons pas aux recettes toutes faites. » Puis : Leadvice en trois phrases (2.1) ; la philosophie (manifeste 2.8, une ligne à la fois) ; l'engagement (2.8) ; la méthode en cinq temps (2.7, version détaillée de la scène 9) ; les fondatrices (2.3) en grand format éditorial ; FAQ générale de huit questions ; CTA.

FAQ générale (questions imposées, réponses à rédiger, sans jamais affirmer travailler avec toutes les tailles d'entreprise) :
1. Qu'est-ce qui distingue un cabinet de conseil d'une agence marketing ?
2. Par quoi commence un accompagnement Leadvice ?
3. Combien de temps faut-il pour voir des résultats en acquisition ?
4. Gérez-vous les campagnes vous-mêmes ou conseillez-vous seulement ?
5. Travaillez-vous avec nos équipes internes ?
6. Sur quels canaux intervenez-vous ?
7. Comment mesurez-vous la performance ?
8. Intervenez-vous en dehors de Casablanca ?

### 4.7 Insights

Bibliothèque éditoriale, pas un blog en liste : catégories Stratégie, Acquisition, Création, Business ; grandes cartes éditoriales (titre en serif, illustration SVG générée selon la catégorie, extrait court). Page article calme : grande typographie, largeur de lecture 68 caractères, sommaire, temps de lecture, auteur (Amira Dounassre ou Nada Moujibi selon le sujet), date, articles liés, CTA en fin d'article. Le spectaculaire s'arrête quand le contenu devient important.

Six articles complets au lancement, déjà rédigés dans `CONTENU-INSIGHTS.md` (1 000 à 1 400 mots chacun), à intégrer tels quels, sans chiffre inventé (raisonnement, méthodes, exemples génériques clairement présentés comme tels) :
1. « Plus de leads ne veut pas dire plus de clients » — Acquisition — Amira
2. « Trouver le bon angle : une même offre, trois histoires » — Création — Amira
3. « Meta Ads ou Google Ads : choisir selon l'intention, pas selon la mode » — Acquisition — Amira
4. « CPL, CPA, coût par opportunité : les métriques qu'un dirigeant doit suivre » — Business — Nada
5. « Arabe ou français : choisir la langue de vos publicités au Maroc » — Création — Amira
6. « Audit marketing : sept signes que votre acquisition perd de l'argent » — Stratégie — Nada

### 4.8 Diagnostic

Page `/diagnostic/` : titre « Parlons de votre croissance », sous-titre « Quelques questions pour préparer un premier échange utile. Réponse sous un jour ouvré. » Formulaire progressif, une question par écran sur mobile, avec la trajectoire qui avance d'étape en étape :

1. **Votre enjeu principal** : Générer plus de leads qualifiés · Améliorer la conversion · Clarifier la stratégie · Renouveler la création · Mieux piloter la performance · Autre
2. **Votre entreprise** : nom de l'entreprise ; secteur (liste : Immobilier, Banque et assurance, Éducation, Santé, Distribution, E-commerce, Industrie, Services B2B, Tourisme et transport, Autre) ; taille (Moins de 10 salariés · 10 à 49 · 50 à 249 · 250 et plus)
3. **Votre rôle** : Dirigeant(e) · Direction marketing · Direction commerciale · Autre
4. **Quand aimeriez-vous démarrer ?** : Dès que possible · Dans les trois prochains mois · Je me renseigne pour l'instant. (Décision d'Amira : aucune question de budget dans les formulaires, une fourchette chiffrée peut faire fuir un prospect qui se sent « trop petit ». Le budget se discute pendant le diagnostic.)
5. **Vos campagnes aujourd'hui** : Aucune · Gérées en interne · Gérées par une agence · Mixte
6. **Vos coordonnées** : nom, e-mail professionnel, téléphone, message libre facultatif ; case de consentement (loi 09-08) non pré-cochée.

Validation en ligne, messages d'erreur humains, sauvegarde de la progression en mémoire de la session de page, bouton final « Envoyer ma demande → ».

Qualification interne (jamais affichée) : score calculé côté serveur, prioritaire si taille ≥ 50 salariés, démarrage « Dès que possible » ou campagnes déjà actives ; le score figure dans l'objet de l'e-mail reçu (`[Diagnostic — Priorité haute]` ou `[Diagnostic — À qualifier]`). Aucune demande n'est refusée à l'écran.

Page `/diagnostic/merci/` : « Merci. Nous avons bien reçu votre demande. » Ce qui se passe ensuite en trois étapes (lecture de la demande, réponse sous un jour ouvré par e-mail, premier échange de diagnostic), puis deux articles Insights recommandés selon l'enjeu choisi.

### 4.9 Landing pages Ads

Trois pages `noindex`, exclues du sitemap, header réduit au logo (lien vers l'accueil) et au bouton de diagnostic, sans menu de navigation pour limiter les fuites :
- `/lp/generation-de-leads/` — animation du funnel, cible : entreprises qui veulent des leads qualifiés.
- `/lp/conseil-strategique/` — animation du nœud de décision, cible : dirigeants qui veulent clarifier stratégie et offre.
- `/lp/audit-marketing/` — animation de la lentille, cible : entreprises qui dépensent en publicité sans visibilité claire sur ce qui fonctionne.

Structure commune : promesse en une phrase, trois bénéfices, chiffres du cabinet (2.4), logos, méthode en cinq temps condensée, formulaire de diagnostic intégré en version courte (enjeu présélectionné), FAQ de quatre questions. Paramètres UTM conservés et transmis avec la demande.

### 4.10 Pages légales et 404

Mentions légales (2.1), politique de confidentialité conforme loi 09-08 et RGPD (données collectées par le formulaire, finalité, durée de conservation de 24 mois, droits d'accès, de rectification et d'opposition via contact@leadvice.org, sous-traitants : hébergement Cloudflare, e-mail Resend, mesure d'audience Google), politique cookies. Page 404 : la trajectoire qui se perd puis se retrouve, « Cette page a perdu le signal. », liens vers l'accueil et le diagnostic.

---

## PARTIE 5 — TECHNIQUE

### 5.1 Stack

- Astro en sortie statique, TypeScript strict.
- CSS natif à variables (tokens de 3.6 et 3.7) avec `@layer`, sans framework CSS.
- GSAP + ScrollTrigger, importés uniquement sur les pages qui ont des scènes animées, après le premier rendu.
- Canvas 2D pour les particules. Pas de Three.js ni de bibliothèque 3D ; une seule exception WebGL, le petit shader de révélation à l'encre de 3.11 (moins de 6 Ko, chargé après le premier rendu, avec repli CSS).
- Content Collections (MDX) pour Insights, études de cas, FAQ et textes éditables ; aucun texte en dur dans les composants.
- Pas de React ni d'autre framework client.
- `@astrojs/sitemap`, images via `astro:assets` (AVIF/WebP, dimensions explicites).

### 5.2 Performance (seuils bloquants)

Lighthouse mobile : Performance ≥ 95, SEO 100, Bonnes pratiques 100, Accessibilité ≥ 95. LCP < 2,0 s, INP < 200 ms, CLS < 0,05. JavaScript < 80 Ko gzip par page. Accueil < 1 Mo au premier chargement.

Comment tenir ces seuils avec un site aussi visuel :
- Le LCP est le H1 texte, rendu en HTML statique : aucune animation ne le retarde.
- Particules : un seul canvas par scène, 600 particules maximum sur desktop, 150 sur mobile, `devicePixelRatio` plafonné à 2, rendu suspendu hors écran (IntersectionObserver) et quand l'onglet est caché.
- Animations en `transform`, `opacity` et `stroke-dashoffset` uniquement.
- GSAP et les scripts de scène chargés après le rendu initial (`requestIdleCallback` avec repli).
- Polices auto-hébergées en sous-ensemble, deux familles, trois graisses au total.
- Séquences d'images : WebP redimensionnées, 2,5 Mo maximum par séquence en desktop et 0,9 Mo en mobile, chargées par lots à l'approche de la section, jamais au premier chargement (seule leur première image est préchargée). Aucune vidéo.

### 5.3 SEO

Title et meta description uniques sur chaque page, un seul H1, canonical, Open Graph et Twitter Card (image OG générée au build aux couleurs Leadvice pour chaque page), `lang="fr"`, sitemap, `robots.txt`, fil d'Ariane visible sur les pages de niveau 2.

Title de l'accueil : « Leadvice — Cabinet de conseil stratégique & marketing à Casablanca ». Meta : « Leadvice accompagne les entreprises dans leur stratégie, leur création et leur acquisition client : Meta Ads, Google Ads, génération de leads et pilotage de la performance. »

Données structurées JSON-LD : Organization et ProfessionalService (adresse, e-mail, zone desservie Maroc, fondatrices), WebSite, BreadcrumbList, Service sur chaque page levier, Article et Person sur les articles, FAQPage sur les pages qui ont une FAQ.

Maillage interne : chaque article renvoie vers au moins un levier et vers le diagnostic ; chaque levier renvoie vers deux articles et vers l'étude de cas.

### 5.4 GEO (moteurs de réponse IA)

- `/llms.txt` : présentation de Leadvice, des quatre leviers, de la méthode et des pages clés, en texte clair.
- `robots.txt` autorise GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended.
- Chaque page commence par une réponse directe en deux ou trois phrases à la question qu'elle traite.
- Entité cohérente partout : même nom, même description courte, même adresse, mêmes fondatrices, liens `sameAs` vers Instagram et les profils LinkedIn des fondatrices (linkedin.com/in/amiradounassre, linkedin.com/in/nada-moujibi).

### 5.5 Accessibilité

Contenu compréhensible sans animation, sans curseur, sans JavaScript. Navigation clavier complète avec focus visible, lien d'évitement, scènes épinglées compatibles lecteur d'écran (le texte est dans le DOM, pas dans le canvas), canvas en `aria-hidden`, logos avec texte alternatif, formulaire avec labels et erreurs annoncées, `prefers-reduced-motion` respecté partout (état final affiché directement).

### 5.6 Formulaire, e-mail, anti-spam

Envoi vers une Cloudflare Pages Function `/api/diagnostic` : validation côté serveur, Cloudflare Turnstile + champ honeypot, calcul du score (4.8), e-mail à contact@leadvice.org via Resend avec toutes les réponses et les UTM, accusé de réception automatique au prospect. Clés en variables d'environnement (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`), documentées dans le README avec la marche à suivre pour les obtenir.

### 5.6 bis Réservation intégrée du diagnostic (remplace un Calendly)

Chaque bouton « Demander un diagnostic » ouvre une fenêtre (`<dialog>` natif, focus piégé, Échap ferme) en trois étapes, puis une confirmation. Référence d'interface : `prototype/booking.js` et `prototype/admin.html`.

1. **Qualification** : enjeu (six choix), entreprise, campagnes aujourd'hui (Aucune pour le moment · Gérées en interne · Gérées par une agence · Un peu des deux). Pas de question de budget.
2. **Créneau** : calendrier des jours réservables ; au clic sur un jour, deux onglets « Matin » et « Après-midi » (avant / après 13 h) avec le nombre de créneaux de chacun, puis **tous** les horaires libres de la période choisie, en grille (trois colonnes sur mobile). Pas de plafond d'affichage : tout ce qui est libre est proposé. Heure de Casablanca (si le fuseau du visiteur diffère, afficher aussi son heure locale).
3. **Coordonnées** : nom, e-mail professionnel, téléphone facultatif, format (visio ou téléphone), consentement.
4. **Confirmation** : date et heure en toutes lettres, enjeu repris, phrase sur l'invitation et le lien pour déplacer ou annuler.

La page `/diagnostic/` reste (référencement, landing pages, fonctionnement sans JavaScript) avec le même parcours en pleine page.

**Backend** (Cloudflare, sans service payant) :
- Base **D1** : `settings` (durée 45 min, pause 15 min, délai minimal 24 h, horizon 21 jours, maximum 12 par jour, réglable), `weekly_hours` (jour, début, fin, plusieurs plages par jour), `blocked_dates`, `extra_slots`, `bookings` (id, début et fin en UTC, statut, nom, e-mail, téléphone, entreprise, enjeu, campagnes, format, UTM, jeton de gestion, dates de création et de modification), `audit_log`.
- **Pages Functions** : `GET /api/slots?from=&to=` calcule les créneaux (règles, moins réservations, moins occupation Google Agenda) ; `POST /api/bookings` vérifie Turnstile et le honeypot, revérifie le créneau dans une transaction, avec une contrainte d'unicité sur le début pour empêcher toute double réservation ; `GET/POST /api/bookings/:token` pour déplacer ou annuler depuis le lien reçu par e-mail ; `/api/admin/*` pour les réglages.
- **Google Agenda** (API Calendar, identifiants en secrets Cloudflare) : requête `freeBusy` pour exclure les créneaux occupés ; chaque réservation crée un événement avec lien Google Meet et invite le prospect ; une annulation ou un déplacement met l'événement à jour.
- **E-mails** (Resend) : confirmation au prospect avec fichier `.ics` et lien de gestion, notification à contact@leadvice.org avec toutes les réponses, rappel la veille et une heure avant (petit Worker avec déclencheur cron, qui partage la base D1).
- **Fuseau** : toujours `Africa/Casablanca` via l'API `Intl`, jamais un décalage fixe : le Maroc change d'heure pendant le Ramadan.
- **Administration** `/admin/` protégée par Cloudflare Access (connexion par e-mail réservée à Amira et Nada) : horaires de la semaine avec plusieurs plages par jour, durée, pause, délai minimal, horizon, maximum par jour, jours bloqués, créneaux exceptionnels, liste des rendez-vous à venir avec déplacement, annulation et export CSV, état de la connexion Google Agenda.
- **Suivi** : événement `diagnostic_reserve` vers GA4 et Meta CAPI seulement après consentement, UTM enregistrés avec la réservation.
- **Tests obligatoires** : deux réservations simultanées sur le même créneau (une seule passe), changement d'heure du Ramadan, délai minimal, jour bloqué, annulation par lien, e-mails reçus.

Repli si le temps manque : Cal.com auto-hébergé, intégré dans la même fenêtre et habillé aux couleurs du site. Le parcours interne reste la cible.

### 5.7 Tracking et consentement

Bannière de consentement maison, légère, conforme Google Consent Mode v2 (refus par défaut, deux boutons de même poids « Accepter » et « Refuser », lien « Personnaliser »). GTM, GA4, Meta Pixel avec Conversions API (déduplication par `event_id` côté Pages Function), Google Ads conversions améliorées, LinkedIn Insight Tag : tous chargés uniquement après consentement et uniquement si leur identifiant est défini en variable d'environnement (`PUBLIC_GTM_ID`, `PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN`, `PUBLIC_LINKEDIN_PARTNER_ID`). Sans identifiant, le script n'est simplement pas inclus : rien ne casse, rien n'apparaît. Plan d'événements (le même `event_id` est envoyé par le navigateur et par le serveur, pour que Meta et Google dédoublonnent) :

| Moment | Meta (Pixel + API Conversions) | Google (GA4 / Ads) | Usage |
|---|---|---|---|
| Ouverture de la fenêtre de réservation | événement personnalisé `OuvertureDiagnostic` | `begin_diagnostic` | audiences de relance |
| Étape 1 validée (enjeu, entreprise, campagnes) | `QualificationRemplie` | `qualify_lead` | relance des abandons |
| Rendez-vous confirmé | `Lead` **et** `Schedule` | `generate_lead` + conversion Ads « Diagnostic réservé » | **événement d'optimisation des campagnes** |
| Diagnostic tenu (marqué dans l'admin) | `QualifiedLead` via API Conversions, côté serveur | conversion hors ligne (gclid) | apprendre aux plateformes ce qu'est un bon prospect |
| Client signé (marqué dans l'admin) | `Purchase` avec valeur, via API Conversions | conversion hors ligne avec valeur | optimisation sur la valeur |

Règles :
- `Lead` et `Schedule` partent **depuis le serveur** (Pages Function de réservation) dès que la réservation est enregistrée, et aussi depuis le navigateur si le visiteur a accepté les cookies ; même `event_id`.
- Données transmises pour l'appariement : e-mail et téléphone hachés en SHA-256 (normalisés : minuscules, indicatif +212), `fbp` et `fbc` (cookie ou paramètre `fbclid`), `external_id` (identifiant de la réservation haché), adresse IP et agent du navigateur côté serveur, `gclid` pour Google.
- `value` du `Lead` : indicative, selon la réponse « campagnes aujourd'hui » (1 à 3). La valeur réelle arrive avec `QualifiedLead` (estimée pendant le diagnostic, saisie dans l'admin) et `Purchase` (montant signé) : c'est là que se fait l'optimisation sur la valeur.
- `fbclid`, `gclid`, UTM, `fbp`, `fbc` sont lus à l'arrivée, gardés pour la session, et enregistrés avec la réservation dans D1.
- Dans l'admin, chaque rendez-vous a deux boutons « Diagnostic tenu » et « Client signé » qui envoient les événements hors ligne : c'est ce qui permet à Meta d'optimiser sur de vrais prospects (objectif « Prospects de conversion ») et non sur des formulaires remplis.
- Consentement : sans accord, aucun cookie publicitaire n'est déposé ; l'envoi serveur se limite à ce que la politique de confidentialité annonce (à valider avec la loi 09-08 et la CNDP).
- Contrôle : l'outil de test des événements de Meta et le mode aperçu de GTM montrent les cinq événements, dédoublonnés, avant la mise en ligne. Le prototype (`prototype/booking.js`, `admin.html`) affiche déjà ces événements dans la page d'administration de démonstration.

### 5.8 CMS

Pages CMS (configuration `.pages.yml` à la racine, connexion avec le compte GitHub d'Amira, gratuit) pour qu'Amira modifie sans code, depuis une interface web à l'adresse app.pagescms.org :
- **Insights** : créer, modifier, programmer et dépublier un article (titre, catégorie, autrice, extrait, texte avec intertitres, image de couverture, méta title et description) ; le sommaire, le temps de lecture et les liens « À lire aussi » se calculent seuls.
- **Textes des pages** : chaque section de l'accueil, des expertises, du cabinet et du diagnostic est un fichier de contenu (titre, paragraphe, bouton), jamais du texte en dur dans un composant.
- **FAQ** de chaque page, **chiffres** de la section 2.4, **logos et fiches clients**, **fondatrices** (photo, texte, LinkedIn), **bouton flottant** et **bandeau final**.
- **Réglages du simulateur** (valeurs par défaut et bornes).
Chaque enregistrement crée un commit et Cloudflare Pages republie le site en une à deux minutes ; un aperçu est disponible avant publication. Les disponibilités du diagnostic et les rendez-vous restent dans l'admin dédiée (`/admin/`, 5.6 bis), qui n'a pas besoin de republier le site. README avec un mode d'emploi en langage simple, captures à l'appui.

### 5.9 Hébergement

Cloudflare Pages relié au dépôt GitHub `leadvice-site` (build `npm run build`, sortie `dist`), déploiement automatique à chaque push, prévisualisation par branche. Domaine leadvice.org branché une fois le site validé. En-têtes de sécurité et de cache dans `public/_headers`, redirections dans `public/_redirects` (anciennes URL Wix connues vers les nouvelles : `/services` → `/expertises/`, `/blog` → `/insights/`, `/faq` → `/cabinet/#faq`, `/contact` → `/diagnostic/`, `/a-propos` → `/cabinet/`).

### 5.10 Fonctionnalités d'interface

Dix-neuf fonctionnalités, toutes obligatoires, adaptées à la direction artistique. Elles respectent les budgets de 5.2 : chaque script est chargé seulement sur les pages qui en ont besoin, et rien ne retarde le LCP.

1. **Mode sombre.** Un interrupteur discret dans le header (icône lune/soleil, `aria-pressed`, libellé « Mode sombre »). Par défaut, le site suit le réglage du système (`prefers-color-scheme`) ; le choix du visiteur est mémorisé dans `localStorage` et appliqué par un script inline dans le `<head>` avant le premier rendu, pour éviter tout flash. Le mode sombre transforme les sections claires (mode Précision) : fond Deep Space adouci (#16122B), texte off-white, lignes lavande ; les scènes immersives restent identiques dans les deux modes. Tous les tokens de couleur existent en deux versions et tous les contrastes restent conformes AA.
2. **Bannière cookies simple.** Celle de 5.7 : une seule bande en bas d'écran, une phrase, « Accepter » et « Refuser » de même poids, lien « Personnaliser » qui ouvre le détail par catégorie. Elle ne masque jamais le H1 ni le bouton principal sur mobile. Un lien « Gérer les cookies » dans le footer la rouvre.
3. **Recherche sur le site.** Pagefind, index généré au build, chargé seulement à l'ouverture de la recherche. Ouverture par l'icône loupe du header ou par `Ctrl/Cmd + K`. Elle couvre les articles Insights, les pages leviers, l'étude de cas, la FAQ et le cabinet. Résultats instantanés avec titre, extrait et mot surligné ; message en cas d'absence de résultat : « Aucun résultat. Essayez un autre mot, ou parlons-en directement. » avec le lien vers le diagnostic. Navigation clavier complète, fermeture par `Échap`.
4. **Bouton retour en haut.** Une flèche « ↑ » dans un cercle fin, en bas à droite, qui apparaît après deux écrans de scroll et disparaît près du haut de page. Défilement fluide, instantané avec `prefers-reduced-motion`. `aria-label="Retour en haut de la page"`. Sur mobile, il se place au-dessus du bouton de contact flottant (point 19), sans le chevaucher.
5. **Menu mobile.** Celui de 4.2, avec en plus : piège du focus tant qu'il est ouvert, fermeture par `Échap`, par un clic hors du menu et au changement de page, défilement de la page bloqué derrière, `aria-expanded` sur le bouton.
6. **Animations de chargement.** Jamais d'écran de chargement plein page avant le contenu. Trois états de chargement seulement : le bouton d'envoi du formulaire (petit cercle qui tourne à la place de la flèche, bouton désactivé, texte « Envoi en cours… »), les séquences d'images (fine ligne violette en bas de la section qui progresse avec les lots chargés) et la recherche (trois lignes de résultat en squelette pendant le chargement de l'index).
7. **États au survol.** Sur tous les éléments cliquables : liens (soulignement qui se dessine de gauche à droite), boutons (fond qui s'intensifie, flèche qui avance de 4 px), cartes (prompt bonus de survol d'`ANIMATIONS-SCROLL-LEADVICE.md`), logos clients (monochrome vers couleur). Chaque survol a son équivalent au focus clavier (`:focus-visible`) et un état au toucher sur mobile. Transitions de 300 ms maximum.
8. **Barre de progression de lecture.** Une ligne violette de 2 px en haut de l'écran, qui avance avec la lecture, sur les articles Insights, l'étude de cas Kettani et les pages légales. C'est la trajectoire du site, appliquée à la lecture. Pas sur l'accueil ni sur les pages à séquences, où le scroll raconte déjà quelque chose.
9. **Bouton copier.** Trois endroits : l'adresse contact@leadvice.org (footer, page merci, message d'erreur du formulaire), « Copier le lien » en haut et en bas de chaque article, et les identifiants de la page Mentions légales. Au clic, l'icône devient une coche et un message « Copié » s'affiche deux secondes, annoncé aux lecteurs d'écran (`aria-live`). Repli si l'API presse-papiers est indisponible : le texte est sélectionné.
10. **Feuille de style d'impression.** Pour les articles, l'étude de cas, la FAQ et les pages légales : fond blanc, texte noir, Instrument Serif pour les titres, header, footer, canvas, séquences, bannière et boutons masqués, logo Leadvice en tête, URL complète affichée après chaque lien, pas de coupure au milieu d'un bloc ou d'un titre, adresse et e-mail du cabinet en pied de page imprimée.
11. **Headers collants.** Le header du site reste accessible : il se réduit et se cache au scroll vers le bas, réapparaît au scroll vers le haut (4.2). Sur les articles, le sommaire reste collé à gauche sur desktop et surligne la section en cours. Les ancres tiennent compte de la hauteur du header (`scroll-margin-top`).
12. **Lien d'évitement.** « Aller au contenu ↓ », premier élément focusable de chaque page, invisible jusqu'au focus clavier, qui mène au `<main id="contenu">`. Sur les pages à séquence, il mène directement au texte de la séquence.
13. **Suivi UTM.** À l'arrivée sur n'importe quelle page, capture de `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid` et de la page d'entrée, en `sessionStorage` (première visite de la session conservée, pas écrasée par la navigation interne). Ces valeurs sont envoyées avec le formulaire de diagnostic, apparaissent dans l'e-mail reçu par Leadvice et alimentent la Conversions API. Rien n'est stocké au-delà de la session et rien n'est envoyé ailleurs qu'avec une demande.
14. **État de succès du formulaire.** Après l'envoi : redirection vers `/diagnostic/merci/` (4.8). Sur les landing pages, où le formulaire est intégré, le formulaire se remplace sur place par un bloc de confirmation : coche violette qui se dessine, « Merci. Votre demande est bien partie. », les trois prochaines étapes, et le focus déplacé sur ce titre.
15. **États d'erreur du formulaire.** Erreurs de champ : vérifiées à la sortie du champ puis à l'envoi, message sous le champ en clair (« Indiquez une adresse e-mail professionnelle, par exemple nom@entreprise.ma »), bordure et icône, résumé des erreurs en haut de l'étape avec liens vers chaque champ, focus sur le premier champ en erreur. Erreur serveur ou réseau : les réponses sont conservées, message « L'envoi n'a pas abouti. Vos réponses sont conservées : réessayez, ou écrivez-nous à contact@leadvice.org. » avec bouton « Réessayer » et bouton copier l'adresse.
16. **Fenêtres de confirmation.** Élément `<dialog>` natif, accessible (focus piégé, `Échap`, focus rendu à l'élément d'origine). Deux usages : quand le visiteur a commencé le diagnostic et clique sur un lien qui quitte la page (« Vous avez commencé votre demande. Quitter quand même ? » — « Continuer ma demande » / « Quitter »), et avant « Recommencer » dans le formulaire (« Effacer toutes vos réponses ? »). Jamais de fenêtre au chargement d'une page, jamais de fenêtre de sortie sur les autres pages.
17. **Date de dernière mise à jour.** Sur chaque article (« Publié le … · Mis à jour le … » quand la date diffère), sur l'étude de cas et sur les pages légales. Dates en français, lues dans le frontmatter (`publishedAt`, `updatedAt`) et reprises dans le JSON-LD (`datePublished`, `dateModified`), ce qui sert aussi le SEO et le GEO.
18. **FAQ dépliable.** Toutes les FAQ du site (cabinet, pages leviers, landing pages) en `<details>`/`<summary>` : fonctionnent sans JavaScript, ouverture animée en hauteur et icône « + » qui pivote en « × », une seule question ouverte à la fois sur mobile. Les réponses restent dans le HTML pour le référencement, et le JSON-LD FAQPage est généré à partir du même contenu.
19. **Contact flottant.** Un bouton « Parlons-nous → » qui apparaît après l'écran d'accueil de chaque page, en bas à droite sur desktop et en barre basse pleine largeur sur mobile, vers `/diagnostic/`. Masqué sur `/diagnostic/`, `/diagnostic/merci/` et quand un formulaire de landing page est visible, masqué aussi quand le footer est à l'écran. Il ne recouvre jamais la bannière cookies ni le bouton retour en haut.

Il n'y a aucun champ de mot de passe sur le site (l'édition passe par la connexion GitHub de Pages CMS) : la bascule de visibilité du mot de passe ne s'applique pas.

---

## PARTIE 6 — EXÉCUTION

### 6.1 Phases

0. **Fondations** — projet Astro, tokens et typographies repris de `DESIGN-LEADVICE.md`, page `/dev/design/` (section 9 de ce fichier) montrant tous les composants dans tous leurs états en clair et en sombre, Lenis branché sur GSAP, composants de base (header, footer, boutons, trajectoire SVG), logo vectorisé, page `/dev/animations/` montrant les cinq primitives et les quatre animations de levier isolément, pour validation visuelle par Amira. Le composant de séquence d'images et son pipeline (`ANIMATIONS-SCROLL-LEADVICE.md`, section 6) sont construits dès cette phase, avec les séquences déjà présentes dans `sources/sequences/`. Les interactions de 3.11 (maintien, révélation à l'encre, cartes empilées, transitions de page, parallaxe, footer vivant, défilement horizontal, ruban de signal, phrase sur la courbe, liseré d'activation, transitions de brume, carrousel recomposé) sont prototypées dans `/dev/animations/` dès cette phase, puis posées sur leurs pages aux phases 1 à 3. Fonctionnalités de 5.10 construites ici : mode sombre, menu mobile, header collant, lien d'évitement, retour en haut, états au survol, contact flottant, suivi UTM.
1. **Accueil** — les onze scènes, versions desktop et mobile, état réduit sans animation.
2. **Pages de contenu** — Expertises et ses quatre pages, Réalisations et l'étude de cas Kettani, Cabinet, Insights avec les six articles. Avec : FAQ dépliables, barre de progression de lecture, boutons copier, dates de mise à jour (5.10).
3. **Conversion** — Diagnostic, merci, landing pages, Pages Function, e-mails, consentement et tracking. Avec : bannière cookies, états de chargement, de succès et d'erreur du formulaire, fenêtres de confirmation (5.10).
4. **Finitions** — SEO, GEO, JSON-LD, pages légales, 404, CMS, redirections, recherche Pagefind, feuille de style d'impression, audit complet, README.

### 6.2 Contrôle final avant livraison

Chaque page passe la définition de « terminé » (1.5). Recherche globale sans résultat sur `lorem|TODO|FIXME|placeholder|À COMPLÉTER|XXX`. Tous les chiffres affichés figurent dans 2.4. Tous les logos affichés figurent dans 2.5. Les dix-neuf fonctionnalités de 5.10 sont présentes et testées au clavier, au toucher, en mode sombre et sans JavaScript. Aucun « agence » présenté comme ce que Leadvice est. Le test de positionnement : un dirigeant qui parcourt l'accueil en trente secondes doit pouvoir répondre à « Qui sont-ils ? Que font-ils ? Pourquoi eux ? Comment les contacter ? » ; s'il ne le peut pas, la section fautive est retravaillée.
