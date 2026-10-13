# DESIGN-LEADVICE.md — système de design

Ce fichier fixe toutes les valeurs visuelles du site. Aucun composant n'invente une couleur, une taille, une durée ou un rayon : il prend un token d'ici. En cas de conflit avec un autre fichier, ce fichier fait foi pour le visuel, `CONTENU-SITE-LEADVICE.md` pour les textes, `PROMPT-MAITRE-LEADVICE.md` pour le reste.

Sources : l'analyse des six sites choisis par Amira (`reference/ANALYSE.md`), le concept SIGNAL / ANGLE / PRÉCISION (prompt maître, section 3), et les contrastes calculés selon la formule WCAG 2.2 (pas estimés).

---

## 1. Direction artistique

**Le site est :** précis, cinématographique, éditorial, calme, lumineux dans le sombre.

**Le site n'est jamais :** start-up SaaS, agence « growth hacking », luxe ostentatoire, tableau de bord, catalogue de services.

**Clair d'abord.** Le site vit sur le papier `#F6F4EF` ; le violet de marque `#301781` arrive en aplats (section d'appel finale, boutons) ; le sombre est réservé au pied de page. Aucune page ne commence en sombre.

**Animé du haut vers le bas, sur chaque page.** Fil de signal dessiné au défilement de l'en-tête au pied de page, une scène racontée par page (ouverture de l'accueil, puis nœud, prisme, phare, cadran, boucle), textes qui s'allument mot à mot, titres qui montent ligne par ligne, chiffres qui se composent, bandeau de logos qui défile, défilement horizontal pour les angles et les programmes, cartes empilées pour les formats et la méthode. Référence : le prototype `prototype/`.

**L'élément audacieux, et un seul :** la trajectoire de signal violet lumineux. Elle naît dans l'ouverture (le bruit qui devient signal), devient le fil continu qui traverse toute la page d'accueil au défilement (tracé SVG DrawSVG), passe dans chaque séquence sculptée, et finit en particules dans le pied de page. Tout le reste est silencieux : beaucoup de vide, deux familles de caractères, des neutres teintés, aucune décoration qui ne porte pas de sens.

**Ce qu'on retient des références (et où) :**

| Référence | Ce qu'on garde | Où sur Leadvice |
|---|---|---|
| oryzo.ai | Un objet unique qui se transforme au défilement, fond uni | Les 5 séquences d'images (funnel, nœud, phare, prisme, cadran) |
| why.zero.university | Le fil continu qui relie les sections, le texte qui suit une courbe | Ruban de signal sur l'accueil, phrase en `textPath` dans « Preuves » |
| mindmarket.com | Rythme éditorial, grands titres serif, carrousel compté | Titres, carrousel des cas, FAQ en grande serif |
| mont-fort.com | Masques en arche sur les images, transitions de brume | Visuels des pages Expertise, passages clair ↔ sombre |
| davidwhyte.com/experience | Lenteur assumée, maintenir pour révéler, encre qui suit la souris | Scène Lentille de l'accueil et manifeste du Cabinet (maintenir pour révéler, masque d'encre) |
| era-residence.com | Défilement horizontal épinglé, micro-légendes | Étude de cas Kettani en défilement horizontal |

Ce qu'on fait mieux qu'eux : un H1 lisible par Google sur chaque page (trois des six n'en ont pas d'utile), un poids total sous 3 Mo au lieu de 1 à 24 Mo, un premier affichage sous 2 s, et une action de conversion visible à chaque écran.

---

## 2. Couleurs

### 2.1 Palette de base

| Nom | Hex | Usage |
|---|---|---|
| Encre | `#14121A` | Texte principal en clair, fond le plus profond des boutons sombres |
| Papier | `#F6F4EF` | Fond clair, texte principal en sombre |
| Violet Leadvice | `#301781` | Couleur de marque : logo sur clair, boutons principaux sur clair, fonds de sections signature |
| Signal lumineux | `#7B61FF` | La trajectoire, les lueurs, le focus en sombre. Jamais en texte courant sur clair |
| Violet lavande | `#B4A6FF` | Liens et accents de texte sur fond sombre |
| Espace profond | `#0E0A1F` | Fond du mode sombre et des scènes cinématographiques |

Pourquoi un second violet : le violet de marque `#301781` sur l'espace profond `#0E0A1F` donne 1,45:1, il disparaît. Le signal lumineux `#7B61FF` donne 4,62:1 sur ce fond, et c'est lui qui porte la lumière. Le violet de marque reste la couleur de marque sur fond clair (13,42:1 avec du blanc dessus).

**Mise à jour (demande d'Amira) : fond clair plus blanc.** Le fond passe de `#F6F4EF` à `#FCFBF8`, un blanc chaud presque pur ; les cartes restent `#FFFFFF` et se détachent par un filet `--c-border` plutôt que par la couleur. Contrastes recalculés sur `#FCFBF8` : encre `#14121A` 17,94:1, texte secondaire `#5B5668` 6,82:1, violet de marque `#301781` 12,97:1, signal `#7B61FF` 4,06:1 (graphique et grands titres seulement), gris `#9C97A8` 2,74:1 (décor uniquement, jamais pour du texte à lire). Les prompts d'images utilisent le même `#FCFBF8`. Si Amira fournit sa palette, ses couleurs entrent comme couleurs secondaires (illustrations, catégories, graphiques), le violet restant le signal ; chaque couple texte/fond est recalculé avant usage.

### 2.2 Rôles en mode clair (`:root`)

| Rôle | Token | Valeur | Contraste mesuré |
|---|---|---|---|
| Fond | `--c-bg` | `#FCFBF8` | — |
| Surface (cartes, champs) | `--c-surface` | `#FFFFFF` | — |
| Surface en retrait | `--c-surface-2` | `#ECE9F3` | — |
| Texte principal | `--c-text` | `#14121A` | 16,89:1 sur fond |
| Texte secondaire | `--c-text-2` | `#5B5668` | 6,42:1 sur fond |
| Bordure | `--c-border` | `#D9D4E4` | décorative |
| Bordure de champ | `--c-border-strong` | `#8A8499` | 3,6:1 sur blanc (≥ 3:1 composant) |
| Accent (boutons, liens) | `--c-accent` | `#301781` | 13,42:1 blanc dessus ; 12,21:1 sur fond |
| Accent survolé | `--c-accent-hover` | `#24106A` | plus foncé, même lecture |
| Signal | `--c-signal` | `#7B61FF` | graphique uniquement (tracés, lueurs) |
| Succès | `--c-success` | `#1E6B4E` | 5,85:1 |
| Erreur | `--c-error` | `#B42318` | 5,98:1 |
| Focus | `--c-focus` | `#301781` | anneau 2 px + décalage 3 px |

### 2.3 Rôles en mode sombre (`[data-theme="dark"]` et `prefers-color-scheme: dark`)

| Rôle | Token | Valeur | Contraste mesuré |
|---|---|---|---|
| Fond | `--c-bg` | `#0E0A1F` | — |
| Surface | `--c-surface` | `#16122B` | 16,53:1 avec papier dessus |
| Surface en retrait | `--c-surface-2` | `#1E1838` | — |
| Texte principal | `--c-text` | `#F6F4EF` | 17,66:1 |
| Texte secondaire | `--c-text-2` | `#9B8EC4` | 6,53:1 |
| Bordure | `--c-border` | `#2A2347` | décorative |
| Bordure de champ | `--c-border-strong` | `#6E6396` | 3,59:1 sur fond, 3,36:1 sur surface |
| Accent texte et liens | `--c-accent` | `#B4A6FF` | 9,09:1 |
| Bouton principal | fond `#F6F4EF`, texte `#14121A` | | 16,89:1 |
| Signal | `--c-signal` | `#7B61FF` | 4,62:1 (aussi utilisable pour un grand chiffre) |
| Succès | `--c-success` | `#6FD3A6` | 10,67:1 |
| Erreur | `--c-error` | `#FF8A7A` | 8,47:1 |
| Focus | `--c-focus` | `#B4A6FF` | anneau 2 px + décalage 3 px |

Logo sur fond sombre : version papier `#F6F4EF`, jamais le violet de marque.

### 2.4 Lueur

Un seul token de lueur, réservé au signal : `--glow: 0 0 24px rgba(123, 97, 255, .45), 0 0 2px rgba(123, 97, 255, .9);`. Utilisé sur le tracé, le liseré d'activation et le curseur-lentille. Jamais sur une carte ou un bouton au repos.

### 2.5 Règles

- Pas de dégradé décoratif. Le seul dégradé autorisé est conique, animé, dans le liseré d'activation (section 6.13), et les fondus de brume entre sections (section 5.4).
- Le signal violet n'apparaît qu'à un endroit par écran. S'il y en a deux, l'un des deux est de trop.
- Pas de noir pur, pas de gris pur : tous les neutres sont teintés de violet.

---

## 3. Typographie

Deux familles, libres (SIL OFL), auto-hébergées en WOFF2, sous-ensemble latin + latin étendu + chiffres (accents français, guillemets « », espace fine insécable).

- **Instrument Serif** (regular et italique) : titres, grands chiffres, questions de la FAQ, citations.
- **Geist** (variable, 400 à 600) : texte courant, interface, micro-légendes, boutons.

Pas de troisième famille, pas de monospace. Les données (chiffres, compteurs, légendes) sont en Geist avec `font-variant-numeric: tabular-nums`.

### 3.1 Échelle fluide (320 px → 1440 px)

| Niveau | Token | Valeur | Famille | Interligne | Approche |
|---|---|---|---|---|---|
| Ouverture | `--fs-display` | `clamp(3rem, 1.6rem + 7vw, 8.5rem)` | Serif | 0,95 | -0,02em |
| Titre 1 | `--fs-h1` | `clamp(2.5rem, 1.7rem + 4vw, 5.5rem)` | Serif | 1,0 | -0,015em |
| Titre 2 | `--fs-h2` | `clamp(2rem, 1.5rem + 2.5vw, 3.75rem)` | Serif | 1,05 | -0,01em |
| Titre 3 | `--fs-h3` | `clamp(1.375rem, 1.2rem + .9vw, 2rem)` | Serif | 1,15 | 0 |
| Chapeau | `--fs-lead` | `clamp(1.125rem, 1.05rem + .4vw, 1.375rem)` | Geist 400 | 1,5 | 0 |
| Texte | `--fs-body` | `clamp(1rem, .97rem + .15vw, 1.0625rem)` | Geist 400 | 1,6 | 0 |
| Interface | `--fs-ui` | `0.9375rem` | Geist 500 | 1,3 | 0,005em |
| Légende | `--fs-small` | `0.8125rem` | Geist 450 | 1,45 | 0,01em |
| Légal | `--fs-legal` | `0.75rem` | Geist 400 | 1,5 | 0,01em |
| Grand chiffre | `--fs-stat` | `clamp(3rem, 2rem + 5vw, 6.5rem)` | Serif, tabulaires | 0,9 | -0,02em |

Largeur de lecture : `max-width: 66ch` pour le texte, `22ch` pour les titres d'ouverture, `30ch` pour les H2.

### 3.2 Règles

- Phrase en minuscules (casse de phrase) partout. Aucune étiquette en capitales.
- Aucun mot isolé mis en couleur, en italique ou en gras dans un titre. L'italique serif est réservé aux citations.
- Pas d'étiquette au-dessus des titres. Une section qui a besoin d'un repère le prend dans son titre.
- Typographie française : espace fine insécable avant « ; : ! ? » et à l'intérieur des guillemets, milliers séparés par une espace fine (10 893), « M MAD » pour les millions.
- Les titres d'ouverture se révèlent ligne par ligne (SplitText, masque, 640 ms, décalage 80 ms), une seule fois par page.

---

## 4. Espace et grille

- **Échelle de base 8** : `--s-1: 4px`, `--s-2: 8px`, `--s-3: 16px`, `--s-4: 24px`, `--s-5: 32px`, `--s-6: 48px`, `--s-7: 64px`, `--s-8: 96px`, `--s-9: 128px`, `--s-10: 192px`.
- **Écart entre sections** : `clamp(96px, 12vw, 192px)`. Les sections calmes respirent plus que les sections denses.
- **Grille** : 12 colonnes au-dessus de 1024 px (gouttière 24 px), 8 colonnes de 640 à 1023 px (gouttière 20 px), 4 colonnes en dessous (gouttière 16 px).
- **Marges latérales** : 16 px sous 640 px, 32 px jusqu'à 1023 px, `clamp(48px, 5vw, 96px)` au-delà. Largeur maximale du contenu : 1440 px ; les scènes plein écran l'ignorent.
- **Asymétrie volontaire** : les titres d'ouverture partent de la colonne 1 et s'arrêtent vers la colonne 9 ; le texte d'accompagnement commence colonne 7. Aucun bloc entièrement centré sauf la phrase finale avant le pied de page.

Schéma de l'ouverture (desktop) :

```
| col 1 ─────────────── col 9 |           |
| Moins de bruit.             |           |
| Plus de clients.            |  funnel   |
|                 col 7 ── col 11         |
|                 chapeau + bouton        |
```

---

## 5. Formes, élévation, mouvement

### 5.1 Rayons

- `--r-sharp: 2px` : boutons, champs, cartes, badges. Net, précis, cohérent avec « précision ».
- `--r-arch: 999px 999px 2px 2px` : masque en arche pour les images des pages Expertise et l'équipe (repris de l'idée de mont-fort, appliqué à des visuels Leadvice).
- `--r-round: 999px` : seulement le curseur-lentille, le bouton de contact flottant et les pastilles de compteur.

Pas de bouton en pilule, pas de carte à coins très arrondis.

### 5.2 Élévation (3 niveaux)

- Niveau 0 : à plat, bordure `--c-border`.
- Niveau 1 : `0 1px 2px rgba(20,18,26,.06), 0 8px 24px rgba(20,18,26,.06)` (menus, bannière cookies, fenêtres).
- Niveau 2 : `--glow` (signal uniquement).

En sombre, le niveau 1 devient une bordure `--c-border` plus un fond `--c-surface-2` : pas d'ombre sur du sombre.

### 5.3 Mouvement

| Token | Valeur | Usage |
|---|---|---|
| `--t-fast` | 160 ms | survols, focus, petits changements d'état |
| `--t-mid` | 320 ms | ouverture FAQ, menu, cartes |
| `--t-slow` | 640 ms | révélations de titres, transitions de page |
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | entrées |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | transitions entre états |
| `--ease-signal` | `cubic-bezier(.7, 0, .2, 1)` | le tracé de signal, les compteurs |

- Distance maximale d'un déplacement : 40 px. Au-delà, c'est une scène épinglée, pas une entrée.
- Défilement : Lenis (durée 1,1, `lerp` 0,1), branché sur le ticker GSAP. Désactivé si `prefers-reduced-motion`, sur les appareils tactiles il reste natif.
- Pas d'apparition en fondu-glissé sur chaque section. Le mouvement est réservé aux cinq grands moments et aux réponses à une action.
- `prefers-reduced-motion: reduce` : séquences remplacées par leur dernière image, tracé affiché entier, titres affichés directement, Lenis coupé, View Transitions en fondu simple de 160 ms, particules figées.

### 5.4 Transitions de brume

Entre une section claire et une section sombre, on ne coupe pas net : un fondu vertical de 160 px (`linear-gradient` du fond sortant vers le fond entrant) recouvert d'une texture de grain très légère (PNG 8 Ko en `mix-blend-mode: overlay`, opacité 0,06). C'est le seul « dégradé » de fond autorisé.

---

## 6. Composants

Chaque composant existe en clair et en sombre, avec ces états : repos, survol, focus clavier, actif (pressé), désactivé, chargement, erreur, succès (quand ils s'appliquent). Le focus est toujours visible : anneau `2px solid var(--c-focus)`, `outline-offset: 3px`.

### 6.1 Bouton principal

- Clair : fond `--c-accent`, texte `#FFFFFF`, Geist 500 `--fs-ui`, padding 16 × 28 px, rayon `--r-sharp`, hauteur minimale 48 px.
- Sombre : fond `#F6F4EF`, texte `#14121A`.
- Survol : fond `--c-accent-hover` (clair) ou `#FFFFFF` (sombre) + liseré lumineux de 1 px qui fait le tour une fois (voir 6.13), 640 ms.
- Actif : `transform: scale(.98)`, 160 ms.
- Désactivé : opacité 0,45, curseur `not-allowed`, pas de survol.
- Chargement : le libellé reste (« Envoi en cours »), un trait de signal court parcourt le bas du bouton en boucle ; `aria-busy="true"`.
- Libellé : un verbe qui dit ce qui se passe (« Demander un diagnostic »). Pas de flèche ajoutée au texte.

### 6.2 Bouton secondaire

Fond transparent, bordure 1 px `--c-text`, texte `--c-text`. Survol : fond `--c-text`, texte `--c-bg`. Mêmes dimensions que le principal.

### 6.3 Lien texte

Couleur `--c-accent`, soulignement 1 px à 0,2em sous la ligne de base. Survol : le soulignement se redessine de gauche à droite (160 ms). Lien visité : même couleur. Lien externe : icône 12 px « sortie » après le texte et `rel="noopener"`.

### 6.4 Champs de formulaire

- Libellé toujours visible au-dessus (Geist 500 `--fs-ui`), jamais seulement un texte indicatif.
- Champ : hauteur 52 px, fond `--c-surface`, bordure 1 px `--c-border-strong`, rayon `--r-sharp`, texte `--fs-body`.
- Survol : bordure `--c-text-2`. Focus : bordure `--c-accent` 2 px + anneau focus.
- Erreur : bordure `--c-error`, message sous le champ en `--c-error` `--fs-small` précédé d'une icône, relié par `aria-describedby`, texte qui dit quoi corriger (« Indiquez un e-mail complet, par exemple nom@entreprise.ma »).
- Succès (validation en ligne) : petite coche `--c-success` à droite, pas de bordure verte.
- Désactivé : fond `--c-surface-2`, texte `--c-text-2`.

### 6.5 Cartes de choix (formulaire progressif)

Utilisées pour « Votre secteur », « Votre budget mensuel », « Votre objectif ». Bloc 2 px de rayon, bordure `--c-border`, padding 20 px, titre Geist 500, une ligne d'explication en `--c-text-2`. Survol : bordure `--c-text-2`. Sélectionnée : bordure `--c-accent` 2 px, fond `--c-surface-2`, coche en haut à droite. Clavier : groupe `role="radiogroup"`, flèches pour changer.

### 6.6 Case à cocher (consentement)

18 px, bordure `--c-border-strong`, coche `--c-accent`. Le texte cliquable entier fait partie du libellé.

### 6.7 Messages

- Confirmation en ligne : fond `--c-surface-2`, filet gauche 2 px `--c-success`, icône, texte.
- Erreur globale de formulaire : même structure en `--c-error`, placée au-dessus du bouton, focus déplacé dessus, `role="alert"`.
- Pas d'excuses dans les erreurs : ce qui s'est passé, puis quoi faire.

### 6.8 Cartes de contenu (insights, expertises)

Pas de grille de trois cartes identiques. Les articles s'affichent en liste éditoriale : grand titre serif, chapeau, temps de lecture, image en arche à droite sur desktop. Survol : l'image se décale de 8 px vers le haut et le titre se souligne. Toute la carte est cliquable via un seul lien (le titre), sans liens imbriqués.

### 6.9 Navigation

- Barre haute de 72 px, transparente au-dessus de l'ouverture, puis fond `--c-bg` à 92 % avec flou de 12 px dès 80 px de défilement. Elle se cache en descendant, réapparaît en remontant.
- Gauche : logo. Centre-droite : Expertises, Réalisations, Le cabinet, Insights. Droite : bascule clair/sombre, recherche, bouton principal « Demander un diagnostic » (« Diagnostic » sous 640 px).
- Page active : soulignement 1 px permanent + `aria-current="page"`.
- Menu Expertises : panneau niveau 1 avec les quatre expertises, chacune avec sa phrase d'une ligne et sa petite icône de primitive.

### 6.10 Menu mobile

Bouton « Menu » (texte, pas seulement trois traits), ouvre un panneau plein écran fond `--c-bg`. Liens en serif `--fs-h2`, empilés, qui apparaissent avec un décalage de 40 ms. Bouton principal en bas, fixe. Focus piégé dans le panneau, Échap ferme, le focus revient au bouton.

### 6.11 FAQ

Liste en grande serif (`--fs-h3`), une question par ligne, filet `--c-border` entre chaque. Pas de cartes. Indicateur « + » qui tourne en « − » (320 ms). La réponse s'ouvre en hauteur avec `interpolate-size` ou `grid-template-rows` (320 ms). Éléments natifs `<details>/<summary>`. Balisage `FAQPage` en JSON-LD identique au texte visible.

### 6.12 Bannière cookies

Carte niveau 1 en bas à gauche (bas plein écran sur mobile), 400 px de large, texte court, trois boutons de même poids visuel : « Tout refuser », « Personnaliser », « Tout accepter ». Refus par défaut (Consent Mode v2 « denied »). Le panneau « Personnaliser » est une fenêtre (6.14) avec un interrupteur par finalité.

### 6.13 Liseré d'activation

Effet signature des éléments actifs (bouton survolé, carte de choix sélectionnée, étape courante du rail). Un pseudo-élément avec un dégradé conique `from var(--angle)` de transparent à `--c-signal` puis transparent, masqué pour ne garder que 1 px de bord, et `--angle` animé via `@property` de 0 à 360 degrés en 640 ms (une fois au survol, en boucle lente de 4 s sur l'étape courante). CSS seul, zéro JavaScript.

### 6.14 Fenêtres (dialogues)

`<dialog>` natif, niveau 1, largeur 560 px max, titre serif `--fs-h3`, bouton fermer en haut à droite (libellé accessible « Fermer »), fond assombri `rgba(14,10,31,.6)`. Ouverture : fondu + 8 px vers le haut, 320 ms.

### 6.15 Badges secteur

Texte Geist 500 `--fs-small`, padding 4 × 10 px, bordure 1 px `--c-border`, rayon `--r-sharp`. Exemples : « Immobilier », « Banque », « Aérien ». Pas de couleur par secteur.

### 6.16 Bloc chiffre

Grand chiffre serif `--fs-stat` à chiffres tabulaires, en dessous une phrase en Geist qui dit ce qu'il prouve (« prospects générés », formulation exacte de `CONTENU-SITE-LEADVICE.md`, sans ajout de date ni de contexte non fourni). Le chiffre se compose de gauche à droite à l'entrée dans l'écran (chiffres qui défilent, 1 200 ms, `--ease-signal`), une seule fois. Lecteur d'écran : la valeur finale est dans le HTML dès le départ.

### 6.17 Rail des étapes (méthode)

Ici la numérotation est légitime : la méthode est une vraie séquence. Ligne verticale 1 px `--c-border`, que le signal remplit au défilement (`scaleY`). Chaque étape : numéro en Geist tabulaire (« 1 », pas « 01 »), titre serif, deux lignes. L'étape courante porte le liseré d'activation.

### 6.18 Compteur de carrousel

Pour le carrousel des cas : « 2 sur 6 » en Geist tabulaire, deux boutons précédent / suivant (libellés accessibles), défilement au clavier. Les titres de cas se recomposent lettre par lettre au changement (SplitText, 320 ms).

### 6.19 Micro-légendes chiffrées

Légendes discrètes en Geist `--fs-small` tabulaire, `--c-text-2`, qui accompagnent les séquences : « Audience, étape 1 sur 5 », « Angle trouvé », « 12 mois de pilotage ». Elles disent où l'on est dans l'histoire. Pas de monospace, pas de capitales.

### 6.20 Ruban de signal et texte sur courbe

- Ruban : un seul `<svg>` positionné en absolu sur toute la hauteur de l'accueil, un chemin unique dessiné au défilement (DrawSVG, `scrub: 1`), trait 1,5 px `--c-signal` + `--glow`. Il passe derrière les textes, jamais dessus.
- Texte sur courbe : dans la section Preuves, une phrase courte suit une portion de la courbe (`<textPath>`) et glisse au défilement (`startOffset`). Le même texte existe en HTML normal pour les lecteurs d'écran et Google (le SVG est `aria-hidden`).

### 6.21 Curseur et lentille

Desktop avec souris uniquement (`(hover: hover) and (pointer: fine)`). Le curseur système reste toujours visible : pas de rond qui suit la souris partout. Deux exceptions, seulement là où elles ont un sens :
- au-dessus d'une séquence épinglée, un anneau fin de 56 px (`--c-signal`, 1 px) accompagne le curseur avec un léger retard (`lerp` 0,18) et porte le mot « Défiler » ;
- dans la scène Lentille, la zone nette au masque d'encre suit le curseur (prompt maître, 3.11 point 2).
Ailleurs, les éléments interactifs réagissent par leur propre état de survol. Tout est désactivé en `prefers-reduced-motion`.

### 6.22 Maintenir pour révéler (supprimé)

Supprimé en octobre : ni sur l'accueil ni sur le Cabinet. Le manifeste se révèle au défilement (phrase de gauche barrée et grisée en #857F93, réponse en `--brand` révélée de gauche à droite avec 350 ms de décalage). Le texte ci-dessous est conservé pour mémoire et ne s'applique plus.


Deux endroits seulement : la scène Lentille de l'accueil et le manifeste du Cabinet. Pendant l'appui (souris, doigt, ou Espace/Entrée maintenus), un anneau de signal de 40 px autour du curseur se remplit en 800 ms ; à 100 %, la révélation à l'encre se fait. Relâcher avant : l'anneau se vide en 160 ms. Mention « Maintenez pour révéler » au premier passage. Jamais bloquant : la suite apparaît aussi en continuant le défilement, et directement en mouvement réduit. Le changement est annoncé par une région `aria-live="polite"`.

### 6.23 Bouton de contact flottant

Rond 56 px, en bas à droite, icône message, libellé accessible « Nous écrire ». Ouvre un petit panneau : WhatsApp, e-mail, diagnostic. Caché au-dessus de la ligne de flottaison de l'ouverture et pendant les séquences épinglées.

### 6.23 bis Nuage de clients (dynamique)

Les huit logos clients sont posés sur des sphères nacrées qui vivent dans un petit monde physique, autour d'un centre fixe : « Ils nous ont fait confiance. », « +23 » en grande serif violette (chiffre qui se compose), « entreprises accompagnées depuis 2022, de la compagnie aérienne à la marque de parfums. ».

- **Physique** : chaque sphère dérive librement, rebondit sur les bords de la section et sur les autres sphères (au choc rapide, un halo violet s'allume un instant), est repoussée par la zone de texte centrale et par le curseur, puis revient doucement vers sa place.
- **Interaction desktop** : on attrape une sphère et on la lance ; elle part avec la vitesse du geste et rebondit. Indication discrète en bas : « Attrapez une sphère et lancez-la ».
- **Interaction mobile** : toucher une sphère lui donne une impulsion (« Touchez une sphère pour la lancer ») ; le glissement vertical fait toujours défiler la page.
- **Défilement** : la vitesse de scroll pousse les sphères, à des intensités différentes, ce qui donne de la profondeur.
- **Matière** : sphère blanc nacré (dégradé radial, reflet en haut à gauche, ombre violette douce), légère respiration d'échelle, scintillement violet à tour de rôle, halo lumineux dessiné sous chaque sphère, une centaine de points qui scintillent autour.
- **Survol ou focus clavier** : la sphère grossit, le logo reprend sa couleur, nom et secteur apparaissent. Chaque sphère est focusable avec un libellé « nom, secteur ».
- **Mouvement réduit** : sphères immobiles à leur place, pas de scintillement.
- Aucun logo n'est mis en avant : les tailles varient pour le rythme, pas par importance.

### 6.23 ter Le chemin d'un dirham (argent visible)

Scène épinglée qui raconte l'argent avec de vrais objets, dessinés en code en attendant les images générées (`PROMPTS-VISUELS-SITE-CLAIR.md`, section argent) :
1. une pile de billets à gauche ; les billets s'envolent un à un en tournoyant vers un téléphone stylisé (la publicité), dont l'écran s'illumine ;
2. de l'autre côté du téléphone sortent des personnes (petites silhouettes) ; celles qui ne sont pas de bons prospects tombent et s'effacent ;
3. les bons prospects se rangent et deviennent violets et lumineux : ce sont les clients ;
4. des pièces d'or jaillissent des clients en arc et s'empilent en colonnes à droite, avec une petite étincelle à chaque atterrissage ;
5. des billets repartent de la pile vers la gauche par un grand arc et reconstruisent une pile de billets visiblement plus haute qu'au départ.

**Exception de couleur assumée** : l'or champagne des pièces (`#E2C066`, ombre `#8F6A22`) et le vert sauge des billets (`#D3E3CF`, gravure `#5E8A69`) sont réservés à l'argent, pour qu'il se lise comme de l'argent au premier coup d'œil ; le violet reste le seul accent pour les clients et la lumière. Billets et pièces sont génériques, sans reproduction d'une vraie monnaie.

Sur l'accueil : aucun chiffre, quatre légendes en haut à droite (en bas sur mobile). Sur la page Acquisition : la même scène tourne en boucle dans le simulateur, et le nombre de clients, de pièces et de billets qui reviennent suit les valeurs saisies. En portrait (mobile), le flux descend de haut en bas au lieu d'aller de gauche à droite.

### 6.23 quater Mobile

Le mobile est conçu, pas réduit : chaque scène a une composition portrait (flux vertical pour l'argent, phare raccourci, étiquettes repositionnées et jamais coupées), les scènes épinglées durent 40 % de moins, les défilements horizontaux deviennent des glissements natifs, les grilles passent à une ou deux colonnes, le curseur personnalisé disparaît, les cibles tactiles font au moins 44 px, la fenêtre de réservation passe en une colonne. Contrôle : aucune page ne déborde horizontalement à 390 px (vérifié sur les douze pages du prototype).

### 6.23 quinquies Ouverture : la foule qui se resserre

- **Une seule scène continue, dès l'arrivée** : le premier écran fait partie de la scène épinglée, il n'y a pas de passage « d'une diapositive à l'autre ». H1 en grande serif à gauche, texte et bouton à droite (empilés sur mobile) ; le H1 est affiché tout de suite et n'est jamais animé.
- **Ouverture animée (3,2 s, sans attendre le défilement)** : des centaines de traits de lumière, gris et quelques violets, tourbillonnent comme un bruit de fond ; une barre de lumière violette traverse l'écran de gauche à droite et, sur son passage, chaque trait se range et devient une silhouette : la foule apparaît sous le titre. Ensuite, la foule respire doucement, quelques personnes s'allument en violet à tour de rôle comme des signaux, et sur desktop le curseur agit comme une lampe : les silhouettes proches grossissent et les plus qualifiées passent au violet.
- **Au premier coup de molette**, le texte d'ouverture s'efface vers le haut, la foule glisse au centre et la première phrase d'étape apparaît, avec la légende et le rail.
- **Scène épinglée** en trois rangées fixes, pour qu'aucun texte ne chevauche le dessin : en haut la légende et une seule phrase d'étape (serif, fondu croisé), au centre la foule (canvas), en bas un rail de cinq étapes en HTML (filet violet sur l'étape en cours).
- **Foule** : 26 colonnes sur desktop, 18 sur tablette, 12 sur mobile ; silhouettes tête-épaules ; personnes écartées à 9 % d'opacité (on voit toujours l'ampleur de la foule), personnes retenues de plus en plus foncées, clients violets avec lueur.
- **Filtre** : à chaque étape, une barre verticale violette lumineuse traverse la foule de gauche à droite ; l'état de chaque personne change au passage de la barre.
- **Final** : les clients quittent la grille, s'alignent au centre en grand et une ligne violette se dessine sous eux.
- **Mobile** : padding bas pour que le rail ne passe pas sous le bouton de contact, pin 40 % plus court.
- **Mouvement réduit** : la scène n'est pas épinglée, elle montre l'état final.

### 6.23 sexies Ouverture B (à comparer avec A) : du bruit au signal

Deux ouvertures restent au choix d'Amira. **A, la foule** (6.23 quinquies) est figée dans `versions/A-foule/` et visible sur `accueil-a.html`. **B, le signal** est l'accueil actuel du prototype (`index.html`, scène `signal`). Les essais de B avec des mots (anneau, mur de mots) sont archivés dans `versions/B-mur-de-mots/` mais ne sont plus proposés. Le sélecteur « A, la foule / B, le signal » en bas à gauche n'existe que dans le prototype.

B, en détail :
- **Mise en page ancrée en haut**, comme A : titre à gauche, texte et bouton à droite (empilés sur mobile), puis une large bande sous le texte où vit l'onde. Rien n'est centré verticalement dans un grand vide, rien ne passe sur le texte.
- **À l'arrivée (2,6 s)** : la bande montre un bruit de fond, une ligne grise hachée et nerveuse. Une barre de réglage violette traverse l'écran de gauche à droite, comme quand on cherche une station de radio ; derrière elle, le bruit devient une onde nette, violette et lumineuse, accompagnée de deux échos lavande. Une impulsion lumineuse parcourt ensuite l'onde en boucle.
- **Survol** : la souris amplifie l'onde là où elle passe, comme une loupe sur le signal.
- **Défilement, quatre temps** : « Votre marketing envoie beaucoup de signaux. » (quatre lignes de canaux bruitées apparaissent : vues, likes, impressions, abonnés) ; « La plupart ne sont que du bruit. » (elles s'aplatissent et disparaissent) ; « Nous isolons celui qui compte. » (l'onde principale redevient nette, plus ample, plus lumineuse) ; « Et nous l'amplifions, jusqu'à vos ventes. » (l'onde se redresse en courbe de croissance remplie de violet, des clients s'allument le long de la courbe, « clients » au sommet). Rail : Bruit, Tri, Signal, Croissance.
- **Pourquoi c'est fort pour Leadvice** : c'est littéralement « moins de bruit, plus de clients », sans aucun mot à déchiffrer ; une seule ligne, donc lisible sur mobile ; et la fin dessine ce qu'un dirigeant veut voir, une courbe qui monte.

### 6.24 Pied de page

Fond `#0E0A1F` dans les deux modes. Haut : la phrase finale en serif `--fs-h1` + bouton principal (version sombre). Puis les trois colonnes de `CONTENU-SITE-LEADVICE.md` : Le cabinet, Parlons-en, Informations. Bas : mentions légales complètes (RC, ICE, IF, patente, CNSS, capital, adresse), réseaux, « Revoir l'ouverture » (remonte et rejoue l'ouverture). Couche de particules (canvas, 1 200 points au plus, attirés par la souris, figés en mouvement réduit) qui reprend la trajectoire du signal.

---

## 7. Images, illustrations, icônes, logos

- **Séquences et visuels** : sculptures en verre fumé et métal sombre, un seul accent violet lumineux `#7B61FF`, fond uni identique au fond de la section (`#0E0A1F` ou `#F6F4EF`), éclairage de studio, aucun texte dans l'image. Détails et prompts : `ANIMATIONS-SCROLL-LEADVICE.md` et `VARIANTES-VISUELS-LEADVICE.md`.
- **Photos d'équipe** : noir et blanc légèrement teinté violet (duotone `#14121A` / `#F6F4EF`), masque en arche, même cadrage pour tout le monde.
- **Logos clients** : monochromes (`--c-text-2` au repos, `--c-text` au survol), hauteur optique égalisée (32 px de référence, ajustée à l'œil pour que les poids paraissent égaux), espacés de 64 px, défilement lent horizontal en boucle qui s'arrête au survol et en mouvement réduit.
- **Icônes** : une seule famille, Lucide, trait 1,5 px, 20 px ; uniquement là où l'icône aide à agir (formulaire, contact, navigation, téléchargement). Pas d'icône décorative devant les titres.
- **Icônes de primitives** : cinq petits pictogrammes dessinés pour Leadvice (entonnoir, nœud, phare, prisme, cadran), trait 1,5 px, utilisés dans le menu Expertises et en repère discret des pages correspondantes.
- **Image Open Graph** : générée à la construction (Satori), fond `#0E0A1F`, titre de la page en Instrument Serif papier, tracé de signal, logo papier.

---

## 8. Contrôle anti-gabarit

À vérifier sur chaque page avant de la déclarer finie :

- [ ] Aucune ouverture coupée en deux avec une illustration à droite et un texte à gauche de même poids.
- [ ] Aucune grille de trois cartes identiques aux coins arrondis.
- [ ] Aucune étiquette en capitales au-dessus d'un titre.
- [ ] Aucun mot seul coloré ou en italique dans un titre.
- [ ] Aucune numérotation « 01 / 02 / 03 » hors méthode et funnel.
- [ ] Aucune flèche « → » ajoutée aux libellés de boutons.
- [ ] Aucune apparition en fondu-glissé répétée sur chaque section.
- [ ] Le signal violet n'apparaît qu'une fois par écran.
- [ ] Les textes respectent `max-width: 66ch`.
- [ ] Clair et sombre testés ; contrastes recalculés si une couleur a bougé.

---

## 9. Page `/dev/design/`

Construite avant toute page du site, non indexée (`noindex`, exclue du sitemap). Elle montre :

1. Toutes les couleurs par rôle, en clair et en sombre, avec le ratio de contraste calculé en JavaScript à côté de chaque couple texte/fond.
2. L'échelle typographique complète avec un vrai texte Leadvice à chaque niveau, de 320 à 1440 px (curseur de largeur).
3. Les espacements, la grille superposable (touche G).
4. Chaque composant de la section 6 dans chacun de ses états, côte à côte, en clair et en sombre.
5. Les tokens de mouvement rejoués à la demande, et le même écran en mouvement réduit.

Captures Playwright de cette page à 390 et 1440 px, en clair et en sombre, comparées aux captures de `reference/captures/`. Si le niveau de finition n'y est pas, on corrige ici, pas dans les pages.

### 6.23 septies Fenêtre de réservation : créneaux par moment de la journée
Au clic sur un jour : le jour en toutes lettres à gauche, à droite un sélecteur segmenté « Matin / Après-midi » (fond `--paper-2`, onglet actif blanc avec liseré `--brand`, compteur de créneaux en petit, onglet désactivé à 45 % s'il est complet). En dessous, tous les horaires libres de la période, grille auto (cases de 96 px min) sur desktop, trois colonnes sur mobile. Aucun plafond d'affichage. Le budget n'est plus demandé : il est remplacé par « Vos campagnes aujourd'hui ».

### 6.23 octies Scène « La page qui se construit » (page Sites web)
Canvas 2D, piloté par le scroll. 0 à 0,5 : onze blocs gris (barre de navigation, deux lignes de titre, trois lignes de texte, bouton, visuel, trois cartes) flottent en désordre, inclinés, puis rejoignent leur place dans un cadre de navigateur blanc qui apparaît (coins 6 px, trois pastilles). Les lignes de titre passent en `--brand`, le visuel est lavande avec une courbe montante. 0,66 à 0,76 : le bouton passe du gris au `--signal` avec halo et affiche « Réserver ». 0,7 à 0,86 : un curseur entre par le bas à droite et clique (onde violette). 0,86 à 1 : un point violet part du bouton en arc vers la droite et une carte « Nouvelle demande / Diagnostic, mardi 10 h » apparaît. Étiquettes sous le cadre : Assembler · Clarifier · Convertir. Desktop large : cadre à 62 % de la largeur pour laisser la légende à gauche ; mobile : cadre centré en haut. Version mini (rangée « Sites web ») sans texte ni carte.

### 6.23 nonies Le fil conducteur (toutes les pages)
Il ne traverse plus le texte. C'est une ligne verticale dans la marge gauche (à 45 % de la gouttière, ondulation de 10 px au plus), qui va du titre de la page jusqu'au haut du bandeau violet final. Trois couches : le tracé à venir en pointillés `--line`, le tracé parcouru en `--signal` avec halo (découpé à la hauteur de lecture, 55 % de l'écran), et une tête blanche cerclée de violet qui suit la lecture. Chaque titre de section et chaque scène est un repère sur la ligne : cercle vide, qui se remplit en violet quand on l'atteint (les scènes ont un repère plus gros, rempli en `--brand`). Sur grand écran, le titre du chapitre en cours s'écrit verticalement le long de la tête (Geist 11 px, `--ink-2`) : la ligne raconte la page, chapitre par chapitre. Le repère final, plus grand, marque l'arrivée au bandeau « Parlons de votre croissance ». Absent de l'admin et de la 404, masqué à l'impression, entièrement tracé en mouvement réduit. Avec les visuels générés, la ligne peut passer derrière les objets des scènes et ressortir de l'autre côté.

### 6.23 decies Scène « Une offre, trois angles » (Création)
Une carte d'offre (« Abonnement salle de sport ») se dédouble en trois téléphones reliés par des fils lavande : angle prix (étiquette), angle temps (horloge), angle encadrement (deux personnes). Sous chaque téléphone : l'accroche en Instrument Serif, puis sept personnes dont l'angle en allume certaines (étudiants, cadres pressés, débutants), avec de petites étincelles qui montent vers la pub. À la fin, une barre de résultats remplit chaque publicité, l'angle temps est entouré de violet et étiqueté « Retenu », les deux autres s'estompent à 70 %. Mobile : trois rangées (téléphone à gauche, angle, accroche et public à droite).

### 6.23 undecies Scène « Du public aux leads qualifiés » (Acquisition)
Une publicité diffuse des ondes sur une foule de 140 personnes grises (Diffuser). Trois filtres s'activent l'un après l'autre (Intérêt, Zone, Comportement), le faisceau se resserre et la foule s'éteint sauf une douzaine de personnes qui passent au violet (Cibler). Elles traversent un formulaire (Projet, Délai, Rôle) : neuf passent et s'alignent dans une liste « Leads qualifiés » cochée, trois s'effacent (Qualifier). La liste se termine par « Transmis à vos commerciaux » avec une sonnerie (Transmettre).

### 6.23 duodecies Bouton flottant de réservation
Plus de bulle ronde de discussion : une étiquette rectangulaire `--brand` aux coins de 2 px, liseré `--signal` lumineux à gauche, case icône calendrier coché, « Diagnostic offert » et en dessous un point vert qui pulse avec « 45 min, créneaux cette semaine ». Elle glisse depuis le bas après une demi-hauteur d'écran, disparaît quand le bandeau violet ou le pied de page sont visibles, et sur mobile pendant les scènes épinglées. Mobile : pleine largeur avec 12 px de marge.

### 6.23 terdecies Fil d'Ariane fixé
Quand le fil d'Ariane de la page sort de l'écran, une fine barre translucide le reprend en haut (sous l'en-tête quand il est visible, tout en haut quand il se cache), page en cours en `--ink` et 500.

### 6.23 quaterdecies Page 404
Les chiffres « 404 » en Instrument Serif sont faits de points qui respirent et se dispersent légèrement ; le curseur (ou le doigt) les recolle et les colore en violet ; une tête de lecture balaie les chiffres en continu. Sous les chiffres, la ligne de signal du site est rompue en son milieu (grésillement) et se ressoude quand on la survole. Texte en bas à gauche : « Cette page a perdu le signal. », retour à l'accueil, expertises, diagnostic.

