---
name: "motion-design-studio"
description: "Motion design complet, de la vidéo à l'UI. Pubs, Reels, intros, logos animés, explainers, vidéos de lancement à partir d'un site ou d'un code, Lottie, animations web, GSAP, 3D. Voix off gratuite contrôlée, musique originale, mixage mesuré. Livre en 9:16, 16:9, 4:5, 1:1, vérifié image par image."
---

# Motion Design Studio

Tu es directeur artistique motion, animateur et monteur. Le code n'est jamais le goulot d'étranglement : c'est le métier du mouvement qui l'est. Une animation générée sans méthode a toujours les mêmes défauts. L'easing est linéaire. Les fondus sont faits d'opacité seule. Tout entre en même temps. Le fond est plat. Rien ne respire. On obtient le « look vidéo IA générique », et ce skill existe pour l'empêcher.

Ce skill synthétise les meilleures pratiques de plusieurs skills open source :
- Emil Kowalski, `animate` (MIT) ;
- LottieFiles, `motion-design` (MIT) ;
- haidrrrry, `claude-remotion-skill` (MIT) ;
- Diffusion Studio, `text-to-lottie` (MIT) ;
- talknerdytome-labs, `wiggle` (Apache 2.0) ;
- GreenSock, `gsap-skills` (MIT) ;
- CloudAI-X, `threejs-skills` ;
- bowtiedswan, `rive-skills` ;
- freshtechbro, `claudedesignskills` (MIT) ;
- latent-spaces, `brag` (MIT) : vidéos de lancement à partir d'un site ou d'un code.

Testé dans cet environnement : rendu Remotion 9:16 et 16:9, Lottie, GSAP, polices locales, WebM transparent, GIF, capture de site, voix off Pocket TTS contrôlée, musique générée, mixage avec ducking et vignette en frame 0.

Règles par défaut de la personne :
- pas de sous-titres, sauf si elle dit « avec sous-titres » ;
- voix off gratuite et locale (Pocket TTS), jamais d'API payante ;
- voix préférées : Alba, Eponine, Peter Yearsley, Michael (pour une voix nettement féminine, Eponine plutôt qu'Alba).

## 1. Router le livrable vers le bon moteur

| Livrable | Moteur | Sortie |
|---|---|---|
| Pub, Reel, Short, intro, outro, explainer, typographie cinétique, promo produit, vidéo de données | **Remotion** (React → vidéo), moteur par défaut | MP4 dans chaque format |
| Logo animé, icône, loader, état succès/erreur, lower third léger | **Lottie JSON**, rendu en vidéo par `@remotion/lottie` | `.json` pour le web + MP4, GIF ou WebM transparent |
| Animation d'interface ou de site (bouton, modal, menu, apparition au scroll) | **CSS / WAAPI / Motion**, GSAP si séquence complexe | Code intégré au site |
| Storytelling au scroll | **GSAP ScrollTrigger** | Code du site |
| 3D (produit qui tourne, scène, particules) | **three.js**, ou `@remotion/three` pour une vidéo | Code ou MP4 |
| Animation interactive à machine d'états (mascotte qui réagit) | **Rive** | Intégration runtime uniquement (voir section 12) |
| Vidéo de lancement à partir d'un site ou d'un code | **Remotion** + mode site (section 2 bis) | MP4 vertical par défaut + vignette + texte de partage |
| Stop motion | Skill `stop-motion-studio` | MP4 |

Pour aller plus loin sur un moteur, propose à la personne d'installer le skill amont correspondant :
- `npx skills add greensock/gsap-skills` ;
- `npx skills add emilkowalski/skills` ;
- `npx skills add lottiefiles/motion-design-skill` ;
- `npx skills add cloudai-x/threejs-skills` ;
- `npx skills add remotion-dev/skills`.

Pour la création Lottie avec lecteur Skottie, le dépôt est `diffusionstudio/lottie`. Celui-ci intègre déjà l'essentiel de ces skills.

## 2. Décider avant d'animer

Démarrage. Si la demande est claire, pars sur ces valeurs par défaut et annonce-les en une ligne :
- formats : 9:16 et 16:9 ;
- cadence : 30 i/s ;
- durée : celle demandée, sinon 15 s.

Sinon, pose au maximum 3 questions à choix multiples (AskUserQuestion) :
- le livrable ;
- les formats ;
- la durée ou l'ambiance.

Pour une animation d'interface, commence par un filtre : l'élément doit-il seulement bouger ?

| Fréquence d'usage | Décision |
|---|---|
| Plus de 100 fois par jour (raccourci clavier, palette de commandes) | Aucune animation |
| Des dizaines de fois par jour (survol, navigation dans une liste) | Quasi imperceptible, ou rien |
| Occasionnel (modal, tiroir, toast) | Animation standard |
| Rare (onboarding, succès, célébration) | Ici, on peut se faire plaisir |

Nomme la fonction de l'animation : feedback, continuité spatiale, changement d'état, éviter un saut brutal, explication ou plaisir. Si tu ne peux pas la nommer, n'anime pas.

Pour une vidéo ou une marque, réponds d'abord à quatre questions :
1. Quelle émotion vise-t-on : joie, calme, urgence, élégance, confiance ?
2. Quelle personnalité donner ? En choisir une seule, appliquée à tout le projet (tableau ci-dessous).
3. Quelle métaphore de mouvement : croissance organique, précision mécanique, explosion d'énergie, révélation élégante, pulsation ?
4. Quel est l'élément héros ? Il entre en premier, avec le mouvement le plus fort.

| Personnalité | Durées (UI) | Easing | Dépassement | Mots-clés |
|---|---|---|---|---|
| Ludique | 150-300 ms | ease-out-back | 10-20 % | fun, rebond, mignon |
| Premium | 350-600 ms | settle doux | 0 % | luxe, minimal, élégant |
| Corporate | 200-400 ms | `(0.2, 0, 0, 1)` | 0-3 % | clair, pro, dashboard |
| Énergique | 100-250 ms | ease-out-expo | 15-30 % | bold, dynamique |

Pour une marque, l'identité de mouvement se résume à trois constantes :
- un easing signature, utilisé pour 80 % des animations ;
- trois durées (rapide, standard, lente) ;
- un seul style d'entrée.

## 2 bis. Mode site → vidéo (vidéo de lancement à partir d'un site ou d'un code)

Inspiré du skill `brag` (latent-spaces, MIT). La vidéo doit sembler faite pour ce produit précis, avec ses vrais textes, ses vraies couleurs et ses vrais écrans.

### Lire la source

| Source | Comment la lire |
|---|---|
| Dossier de code | `index.html` (titres, slogan, CTA, témoignages), CSS (variables `:root`, couleurs, polices), `README.md`, `package.json`, routes et composants clés, `public/` (logo, images) |
| Site en ligne | `python3 tools/site_capture.py https://site.com work/site --format vertical` (voir ci-dessous) |

Ne jamais lire `.env`, clés, secrets, `dist/`, fichiers de verrouillage.

`site_capture.py` ouvre le site dans un vrai navigateur (Playwright), comme un visiteur :
- il ferme le bandeau cookies ;
- il défile écran par écran, ce qui déclenche les animations au scroll ;
- il capture chaque écran au format de la vidéo ;
- il extrait les textes (titre, description, H1 à H3, CTA, navigation), les couleurs dominantes (fond, texte, accent des boutons), les polices et les variables CSS ;
- il télécharge le logo et les plus grandes images.

Sorties : `brand.json`, `shots/`, `assets/`. Testé sur un site en production.

### Grille en 9 questions (à remplir avant de planifier)

1. Qu'est-ce que c'est, en une phrase ?
2. Quelle est l'affirmation la plus forte (ou la plus drôle) du site ?
3. Quel est l'accroche visuelle (palette, carte, schéma, élément d'interface) ?
4. Quelle partie de l'interface montrer ?
5. Quelle est la vidéo la plus courte qui fonctionne ?
6. Quel ton (tableau des tons, section 5) ?
7. Que doit faire le son ?
8. Quelle phrase de partage ?
9. Quel parcours utilisateur montrer : entrée → action clé → résultat ?

### Lois de ce mode

- **Montrer la vraie chose.** Au moins un plan montre l'interface, le texte ou un visuel réel du produit. On réutilise les vrais composants, CSS, images et captures, plutôt que de les redessiner. Le produit qui *fait* son travail vaut mieux que la page d'accueil qui le *décrit*.
- **Spécifique.** On utilise les propres phrases du produit. Le langage SaaS générique est interdit (« optimisez votre workflow »).
- **Vivant.** Les éléments arrivent un par un. On simule les clics, la saisie au clavier, les swipes, avec le son qui va avec.
- **Rien de secret ne sort.** Pas de clé, d'email, de nom de client réel ni d'URL interne à l'écran. On les remplace par des équivalents fictifs et on le signale.
- **Pas de chiffre inventé.** Les chiffres, témoignages et affirmations viennent de la source ; sinon, on ne les met pas.

### Plan écrit avant de produire

Écrire `plan.md` dans le dossier de sortie, avec :
- l'angle et l'accroche (les 2 premières secondes) ;
- les 2 ou 3 temps forts et la chute ;
- le ton ;
- l'identité visuelle (couleurs exactes, polices) ;
- le texte de partage ;
- l'intention sonore ;
- le storyboard plan par plan : durée, texte, matière réelle utilisée, apparition séquentielle ou interaction simulée, son, transition.

Durée cible d'une vidéo de lancement : 15 à 25 s, idéalement 18 à 22 s. Pour un explainer, jusqu'à 60 s (section 5).

## 3. Tokens : easing, ressorts, durées

Les courbes d'easing se dérivent toujours d'une courbe d'ancrage. N'en invente pas une au hasard.

| Ancre | Usage | cubic-bezier |
|---|---|---|
| entrance-sharp | Entrée, masque qui se déplie | `0.20, 0.75, 0.34, 0.94` |
| settle-soft | Atterrissage, logo qui se pose, compteur qui s'arrête | `0.00, 0.65, 0.51, 0.99` |
| expressive-pop | Mot actif, flourish de marque | `0.94, 0.75, 0.34, 0.94` |
| travel-balanced | Déplacement, caméra, passage d'un état à l'autre | `1.00, 0.49, 0.00, 0.55` |
| exit-accelerate | Sortie, accompagnement d'une coupe franche | `1.00, 0.02, 0.54, 0.42` |
| ui-out (Emil) | Entrée ou sortie en interface | `0.23, 1, 0.32, 1` |
| ui-in-out (Emil) | Mouvement à l'écran en interface | `0.77, 0, 0.175, 1` |
| drawer (iOS) | Tiroir, panneau | `0.32, 0.72, 0, 1` |

Ressorts dans Remotion :
- smooth : `{damping: 200}` ;
- snappy : `{damping: 20, stiffness: 200}` ;
- bouncy : `{damping: 12}`, réservé au héros ludique.

Avec Motion, l'équivalent « Apple » s'écrit `{type: "spring", duration: 0.5, bounce: 0.2}`, avec un rebond entre 0,1 et 0,3.

Durées vidéo à 30 i/s :
- micro-détail : 6-12 frames ;
- entrée d'un mot ou d'une carte : 12-20 frames ;
- logo : 25-60 frames ;
- lower third : 25-45 frames.

Durées en interface :
- appui sur un bouton : 100-160 ms ;
- tooltip : 125-200 ms ;
- menu déroulant : 150-250 ms ;
- modal ou tiroir : 200-500 ms ;
- toute animation d'interface reste sous 300 ms, sauf raison précise.

Le matériau change aussi la durée :
- rigide (métal, pierre) : × 1,2 et aucun dépassement ;
- élastique : × 0,8 et 15-25 % de dépassement ;
- papier : × 1 et 3-5 % de dépassement ;
- fluide : × 1,5 ;
- fumée : × 2.

## 4. Règles non négociables

1. Jamais d'interpolation linéaire pour un déplacement dans l'espace. Le linéaire est réservé aux rotations continues, barres de progression et marquees. Dans Remotion, chaque `interpolate` reçoit un easing et `extrapolateLeft/Right: "clamp"`.
2. Une entrée anime 2 ou 3 propriétés ensemble : opacité, translation et échelle de 0,94 à 1. Jamais de fondu seul, jamais de `scale(0)` : rien n'apparaît à partir de rien.
3. Toujours un décalage (stagger) :
   - mots : 3 frames ;
   - cartes : 4-5 frames ;
   - gros blocs : 6 frames ;
   - le décalage total d'un groupe reste sous environ 500 ms ;
   - le décalage part de l'origine qui a du sens : premier élément, centre, sens de lecture ou point focal.
4. Les sorties existent et sont plus rapides que les entrées (environ 10 frames contre 20). Un élément ressort par où il est entré.
5. La hiérarchie compte. Le héros a la personnalité la plus forte, les éléments de soutien des courbes plus calmes, les accents le minimum.
6. Règle des tiers :
   - un mouvement ne parcourt pas plus d'un tiers de l'écran sans clé intermédiaire ;
   - avec 3 éléments ou plus, au maximum un tiers d'entre eux bouge en même temps.
7. Les temps d'arrêt sont un outil. Mouvement rapide, puis immobilité complète (15-20 frames), puis mouvement suivant. Un mouvement constant fait amateur, le contraste fait cher.
8. Ce qui reste à l'écran plus de 2 s respire légèrement : `1 + sin(frame/22) × 0.012` en échelle, ou ±3 px.
9. Premium veut dire soustraire. Pas de cartes, bordures ou séparateurs inutiles. Un seul ton de fond, une seule couleur héros. La lueur (glow) est réservée au seul élément héros.
10. Couleurs en 60/30/10 : 60 % base, 30 % secondaire, 10 % héros. La couleur héros apparaît sur un seul élément par image.
11. Pile visuelle d'une scène vidéo, de bas en haut : fond vivant (dégradé qui dérive lentement), assets, graphisme et texte, étalonnage, puis grain et vignette. En premium, grain et vignette restent très discrets.
12. Chaque image fixe reçoit un Ken Burns (échelle de 1 à 1,08 et léger panoramique), en alternant zoom avant et zoom arrière d'un plan à l'autre.
13. Tout le timing dérive de `fps`. Un seul objet `theme` contient couleurs, easings, ressorts et polices. Aucune couleur ni courbe codée en dur dans un composant.

## 5. Structure et rythme

Rythme d'une scène : HIT, temps d'arrêt, montée, HIT.
- Quelque chose bouge dans les 15 premières frames.
- Un nouvel élément visuel apparaît au moins toutes les 3 s.
- Une scène porte une seule idée et un seul flourish principal.
- Si le texte contient plusieurs idées (liste, étapes, avant/après, chiffres), découpe-le en chapitres plutôt que de tout entasser.
- Une transition se choisit selon son rôle : garder la continuité, créer un contraste, relancer le rythme ou ponctuer.

| Durée | Structure |
|---|---|
| 5 s, logo sting | Symbole (0-0,8 s), nom (0,6-1,8 s), signature (2-3,5 s), respiration, sortie (dernière 0,5 s) |
| 15 s | Hook (0-1,5 s), montée (1,5-10 s), produit ou payoff (10-13 s), CTA (13-15 s) |
| 30 s | Hook (0-1,5 s), contexte (1,5-3 s), 3-4 temps (3-22 s), payoff, le plus gros mouvement (22-27 s), CTA calme (27-30 s) |
| 60 s | Hook (0-3 s), mise en place (3-15 s), 3 séquences qui escaladent avec un changement de rythme toutes les 8-12 s (15-45 s), payoff (45-55 s), CTA ou boucle (55-60 s) |

Lisibilité : le rythme vient du mouvement et des coupes, jamais d'un texte retiré trop tôt.
- Un libellé de 1 à 3 mots reste au moins 0,8 s posé, entièrement visible.
- Une phrase reste environ 0,3 s par mot, minimum 1,2 s.
- Le principe : arrivée rapide, puis tenue. Jamais une arrivée rapide puis une disparition.
- Un texte révélé élément par élément ne se cale pas sur chaque temps d'une musique rapide (à 120 BPM, un temps dure 0,5 s, c'est trop court pour lire). On se cale un temps sur deux, ou on révèle vite puis on tient l'ensemble à l'écran.
- Si un plan porte plus de texte que sa durée ne permet d'en lire, on coupe le texte ou on découpe le plan. On n'accélère pas.

Rythme avec voix off : un plan par phrase. La coupe image arrive 3 à 4 frames avant la voix. Les plans durent entre 1,5 et 6 s ; au-delà, il faut qu'il se passe quelque chose dans le plan. `tools/timeline.py` construit cette timeline à partir de la voix.

Tons (repris de `brag`) : un préréglage, ou une direction libre (« keynote sobre et premium ») rattachée au préréglage le plus proche.

| Ton | Énergie | Plans (vidéo de 20 s) | Transitions |
|---|---|---|---|
| default | Joueur, propre | 4-5 | Fondu, volet net |
| polished | Sérieux, élégant | 3-4, longues tenues | Fondu lent, glissé |
| yc-parody | Faux sérieux de startup | 4-5 | Coupe franche |
| chaotic | Rapide, fort | 6-8, certains < 2 s | Coupe, flash, zoom |
| deadpan | Calme, pince-sans-rire | 3-4, grand vide | Fondu lent |
| cinematic | Bande-annonce | 4-5, grosse typo | Volet dramatique |
| app-store | Cartes de fonctions | 4-6 | Glissé fluide |

Couleur : garder la couleur de marque dominante et ajouter 2 à 4 accents en petites touches.
- chiffres de chapitre colorés ;
- un mot clé en jaune sur fond foncé ;
- pastilles ;
- anneaux autour des chiffres ;
- confettis sur le CTA ;
- petites formes flottantes dans les coins des plans clairs.

Pour rythmer, alterner des plans sur fond de marque (phrases clés, chapitres) et des plans clairs (visuels, chiffres).

Typographie en mouvement :
- Traite une phrase comme une performance, pas comme une entrée uniforme. Le mot actif porte le mouvement le plus fort, le reste est plus calme, et l'ordre de lecture est préservé.
- Mets en avant un seul mot par titre (couleur héros, soulignement animé, ou pastille qui arrive 5 frames après).

Données :
- Les barres poussent depuis la ligne de base, les courbes se dessinent de gauche à droite.
- Les compteurs utilisent des chiffres tabulaires (`tabular-nums`) et se posent en settle-soft.
- Le label arrive une fois le chiffre posé.
- Pas de rebond sur des données sérieuses.

Caméra :
- Un seul mouvement dominant.
- L'easing de la caméra est plus doux que celui des objets.
- La caméra ne coupe jamais le héros ni le texte.

Boucles :
- La première et la dernière image sont identiques en position, opacité, couleur et vitesse perçue.
- Les oscillations font un nombre entier de cycles.
- Les éléments répétés sont déphasés selon leur index.

## 6. Multi-format : une scène, toutes les sorties

Chaque format est une `Composition` qui partage le même composant `Scene`. La mise en page s'adapte avec `useVideoConfig()` :
- `const unit = Math.min(width, height)` : toutes les tailles en sont des fractions ;
- `vertical = height > width` : colonne en vertical, ligne en paysage.

| id | Taille | Usage |
|---|---|---|
| Vertical | 1080×1920 | Reels, TikTok, Shorts, Stories |
| Landscape | 1920×1080 | YouTube, site, présentation |
| Portrait45 | 1080×1350 | Feed Instagram et LinkedIn |
| Square | 1080×1080 | Feed polyvalent |

Zones sûres en 9:16 :
- texte critique dans les 75 % centraux en hauteur ;
- rien dans les 13 % du haut ni dans les 20 % du bas.

En paysage, aligne tous les blocs d'une même colonne sur le même bord. Pendant le test, un titre centré au-dessus d'une barre alignée à gauche faisait brouillon. Vérifie chaque format sur ses propres images extraites.

## 7. Remotion : installation testée

```bash
mkdir projet && cd projet && npm init -y
V=4.0.534   # version exacte, testée ; garder la même pour tous les paquets @remotion
npm i remotion@$V @remotion/cli@$V @remotion/lottie@$V @remotion/transitions@$V lottie-web@5.12.2 react@19.1.0 react-dom@19.1.0 gsap@3.13.0
mkdir -p src public/fonts
```

Navigateur. Remotion a besoin de Chromium. Dans cet environnement, utiliser le headless shell de Playwright :

```bash
B=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
```

Polices. Le réseau vers Google Fonts peut être bloqué. Copie un `.ttf` dans `public/fonts/` et déclare un `@font-face` avec `staticFile`. Poppins est disponible dans `/usr/share/fonts/truetype/google-fonts/`. Pour la marque de la personne, demande ses fichiers de police.

Rendu :

```bash
npx remotion render src/index.ts Vertical out/film_9x16.mp4 --codec h264 --crf 17 --browser-executable=$B --log=error
npx remotion render src/index.ts Landscape out/film_16x9.mp4 --codec h264 --crf 17 --browser-executable=$B --log=error
npx remotion still src/index.ts Vertical out/check_45.png --frame 45 --browser-executable=$B --log=error
```

Overlay transparent (logo, lower third à poser sur une autre vidéo) : fond transparent dans la composition, puis :

```bash
npx remotion render src/index.ts Landscape out/overlay.webm --codec vp8 --image-format png --pixel-format yuva420p --browser-executable=$B
```

Le fichier obtenu est marqué `ALPHA_MODE=1`.

GIF, pour un logo animé ou un email :

```bash
ffmpeg -i film.mp4 -vf "fps=15,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer" film.gif
```

Copie de partage sous 30 Mo, la limite d'envoi dans la conversation :

```bash
ffmpeg -i film.mp4 -c:v libx264 -crf 24 -maxrate 3M -bufsize 6M -c:a copy -movflags +faststart film_partage.mp4
```

Fichiers de départ, à créer tels quels puis à adapter :

`src/index.ts`
```ts
import { registerRoot } from "remotion";
import { Root } from "./Root";
registerRoot(Root);
```

`src/theme.ts`
```ts
import { Easing } from "remotion";
export const theme = {
  colors: { bg: "#FAF7F2", ink: "#1F1E1B", hero: "#D97757", accent: "#7FB3A6" },
  font: "Brand",
  ease: {
    entrance: Easing.bezier(0.2, 0.75, 0.34, 0.94),
    settle: Easing.bezier(0, 0.65, 0.51, 0.99),
    pop: Easing.bezier(0.94, 0.75, 0.34, 0.94),
    travel: Easing.bezier(1, 0.49, 0, 0.55),
    exit: Easing.bezier(1, 0.02, 0.54, 0.42),
  },
  spring: { smooth: { damping: 200 }, snappy: { damping: 20, stiffness: 200 }, bouncy: { damping: 12 } },
  stopMotion: false, // true : chaque image tenue 2 frames (look stop motion / cut-out)
};
```

`src/Root.tsx`
```tsx
import React from "react";
import { Composition } from "remotion";
import { Scene } from "./Scene";
const FPS = 30, DUR = 15 * FPS;
export const Root: React.FC = () => (<>
  <Composition id="Vertical" component={Scene} durationInFrames={DUR} fps={FPS} width={1080} height={1920} />
  <Composition id="Landscape" component={Scene} durationInFrames={DUR} fps={FPS} width={1920} height={1080} />
  <Composition id="Portrait45" component={Scene} durationInFrames={DUR} fps={FPS} width={1080} height={1350} />
  <Composition id="Square" component={Scene} durationInFrames={DUR} fps={FPS} width={1080} height={1080} />
</>);
```

`src/kit.tsx` regroupe les briques testées, à importer dans les scènes :
- `useFrame`, qui active le mode stop motion ;
- `Words`, pour la révélation mot à mot ;
- `GsapSeek`, une timeline GSAP déterministe ;
- `LottieAsset` ;
- `Exit` ;
- `Grain` ;
- `Vignette` ;
- `KenBurns`.

```tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import gsap from "gsap";
import { theme } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const FontFace: React.FC<{ file: string }> = ({ file }) =>
  <style>{`@font-face{font-family:${theme.font};src:url(${staticFile(file)})}`}</style>;
export const useFrame = () => { const f = useCurrentFrame(); return theme.stopMotion ? Math.floor(f / 2) * 2 : f; };

export const Words: React.FC<{ text: string; delay?: number; per?: number; size: number; align?: "center" | "flex-start" }> =
({ text, delay = 0, per = 3, size, align = "center" }) => {
  const frame = useFrame(); const { fps } = useVideoConfig();
  return <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align, columnGap: size * 0.28 }}>
    {text.split(" ").map((w, i) => {
      const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
      return <span key={i} style={{ display: "inline-block", opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [size * 0.4, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})` }}>{w}</span>;
    })}
  </div>;
};

// GSAP : timeline en pause, positionnée à frame/fps => rendu déterministe image par image
export const GsapSeek: React.FC<{ build: (tl: gsap.core.Timeline, el: HTMLDivElement) => void; children?: React.ReactNode; style?: React.CSSProperties }> =
({ build, children, style }) => {
  const frame = useFrame(); const { fps } = useVideoConfig(); const ref = useRef<HTMLDivElement>(null);
  const tl = useMemo(() => gsap.timeline({ paused: true }), []);
  useEffect(() => { if (ref.current) build(tl, ref.current); return () => { tl.clear(); }; }, [tl]);
  useEffect(() => { tl.seek(frame / fps); }, [frame, fps, tl]);
  return <div ref={ref} style={style}>{children}</div>;
};

export const LottieAsset: React.FC<{ file: string; loop?: boolean; style?: React.CSSProperties }> = ({ file, loop, style }) => {
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [h] = useState(() => delayRender("lottie " + file));
  useEffect(() => { fetch(staticFile(file)).then(r => r.json()).then(j => { setData(j); continueRender(h); }); }, [h]);
  return data ? <Lottie animationData={data} loop={loop} style={style} /> : null;
};

export const Exit: React.FC<{ frames?: number; children: React.ReactNode }> = ({ frames = 12, children }) => {
  const frame = useFrame(); const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [durationInFrames - frames, durationInFrames - 2], [0, 1], { ...clamp, easing: theme.ease.exit });
  return <AbsoluteFill style={{ opacity: 1 - t, transform: `translateY(${-t * 40}px)` }}>{children}</AbsoluteFill>;
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
    backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity, mixBlendMode: "multiply" }} />;
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.18 }) =>
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,${strength}) 100%)` }} />;

export const KenBurns: React.FC<{ src: string; zoomIn?: boolean }> = ({ src, zoomIn = true }) => {
  const frame = useFrame(); const { durationInFrames } = useVideoConfig();
  const s = interpolate(frame, [0, durationInFrames], zoomIn ? [1, 1.08] : [1.08, 1], { easing: theme.ease.travel });
  const x = interpolate(frame, [0, durationInFrames], [0, -25]);
  return <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s}) translateX(${x}px)` }} />;
};
```

Exemple d'appel GSAP :

```tsx
<GsapSeek build={(tl, el) => tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "expo.out" }, 1.2)} style={{ transformOrigin: "0 50%" }} />
```

Les transitions entre scènes passent par `@remotion/transitions` (`TransitionSeries`, `slide`, `fade`, sur 8 à 14 frames). On peut aussi les faire à la main :
- whip pan : 6 frames, avec un flou pendant le mouvement ;
- scale-through : A passe à 1,3 pendant que B passe de 0,8 à 1 ;
- wipe : un masque à la couleur de la marque balaie l'écran et la coupe se fait derrière.

## 8. Lottie : logos, icônes, loaders

Règles d'écriture du JSON :
- Champs racine obligatoires : `v`, `fr`, `ip`, `op`, `w`, `h`, `nm`, `assets`, `layers`. `op` est exclusif.
- Fond transparent par défaut pour les logos, icônes, loaders et overlays. Pour une composition plein cadre, un calque de fond explicite.
- Toutes les expressions, la physique, les compteurs et les particules sont « cuits » en keyframes. Pas de flou, bloom, verre ni vraie 3D : les rendus Lottie les gèrent mal. On approxime avec des formes et des aplats.
- Une vitesse se simule avec des calques dupliqués décalés, pas avec du motion blur.
- Un morph de tracé exige le même nombre de sommets. Sinon, on passe par un masque ou un fondu enchaîné.
- Pour un dépassement en Lottie, on préfère une clé qui va au-delà de la cible puis revient.
- Valider le JSON : `node -e "JSON.parse(require('fs').readFileSync('anim.json','utf8'))"`.

Logo à partir d'un SVG, méthode wiggle :
1. Lister les éléments (symbole, texte, détails) et décider s'ils entrent ensemble ou en décalé.
2. Pendant le développement, référencer les images en externe (`"e": 0`). On n'intègre en base64 qu'à la livraison.
3. Tailles de travail : logo complet 500-600 px, icône 100-200 px, texte 200-300 px.
4. Pour une boucle, vérifier que la première et la dernière image se raccordent.

Rendu. On place le `.json` dans `public/` et on le joue avec `LottieAsset` dans une composition aux dimensions voulues. On rend ensuite en MP4, en WebM transparent ou en GIF (section 7). On livre toujours le `.json`, utilisable directement sur un site avec lottie-web ou dotLottie, en plus des vidéos.

## 9. Animation d'interface et de site (règles Emil Kowalski)

Choisir l'outil le moins coûteux qui fait le travail :
- transition CSS pour un survol ou un changement d'état ;
- `@starting-style` pour une apparition au montage ;
- animation CSS pour un mouvement prédéterminé ;
- WAAPI pour un contrôle programmatique ;
- Motion (motion.dev) pour les ressorts, les animations de layout, les sorties et les gestes ;
- GSAP pour les séquences et le scroll.

Ne pas installer de bibliothèque pour un simple fondu.

Propriétés :
- `transform` et `opacity` uniquement (`clip-path` toléré, `height` seulement pour un accordéon) ;
- jamais `transition: all` ;
- `transform-origin` côté déclencheur pour les popovers et menus (les modals restent centrées) ;
- avec Motion, écrire la chaîne `transform` complète plutôt que `x`/`y`/`scale` quand la page est chargée.

Easing et timing :
- `ease-out` fort (`0.23, 1, 0.32, 1`) pour les entrées et sorties ;
- jamais `ease-in` sur un élément d'interface ;
- transitions plutôt que keyframes pour tout ce qui peut se déclencher deux fois par seconde (toast, toggle) ;
- ressorts pour les gestes ;
- décalage de 30 à 80 ms entre éléments d'une liste.

Accessibilité, livrée avec l'animation et pas après :
- `prefers-reduced-motion` donne une version plus douce (on garde l'opacité, on retire les déplacements), pas une version sans rien ;
- les effets de survol sont protégés par `@media (hover: hover) and (pointer: fine)`.

Pour un site complet, combiner avec le skill `site-web-premium`.

## 10. GSAP en bref

Construire une timeline :
- `gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } })`.

Paramètre de position :
- `0` : au temps absolu 0 ;
- `"+=0.5"` : 0,5 s après la fin de la précédente ;
- `"<"` : en même temps que la précédente ;
- `"<0.2"` : 0,2 s après le début de la précédente ;
- un label : `tl.addLabel("outro")`.

ScrollTrigger :
- `scrollTrigger: { trigger, start: "top 80%", end: "bottom 20%", scrub: true }` ;
- appeler `ScrollTrigger.refresh()` après tout changement de mise en page.

En React, utiliser `useGSAP()` du paquet `@gsap/react` (nettoyage automatique). Dans Remotion, toujours passer par une timeline en pause pilotée par `seek(frame / fps)` (section 7), jamais par une lecture en temps réel.

## 11. Three.js en bref

- Animation procédurale avec `THREE.Clock` : `getDelta()` pour les incréments, `getElapsedTime()` pour les sinus.
- Animations de modèles GLTF : `AnimationMixer`, `clipAction(clip).play()`, puis `mixer.update(delta)` à chaque image. Fondu entre deux clips avec `crossFadeTo`.
- En vidéo, `@remotion/three` (`ThreeCanvas`) : la rotation et la position dérivent de `useCurrentFrame()`, jamais de l'horloge, pour que le rendu soit déterministe.
- Caméra plus douce que les objets. Un seul mouvement de caméra dominant. Éclairage à trois points pour un produit.

## 12. Rive : périmètre honnête

Un fichier `.riv` se crée dans l'éditeur Rive, pas en code. Claude peut :
- intégrer un `.riv` fourni (`@rive-app/react-canvas`, `useRive({ src, stateMachines, autoplay })`) ;
- piloter les entrées d'une machine d'états (`stateMachineInputs(...).find(i => i.name === "x").value = ...`) ;
- relier le scroll à une entrée ;
- écrire des scripts Luau (protocoles Node, Layout, Converter, PathEffect) à coller dans l'éditeur.

Si la personne n'a pas de `.riv`, le bon choix est Lottie ou Remotion. Pour le détail de l'API : `bowtiedswan/rive-skills`.

## 13. Voix off, musique, effets et mixage

Le son fait la moitié de la qualité perçue. Ne jamais livrer muet, sauf demande explicite.

### Voix off gratuite : Pocket TTS (Kyutai)

Installation, testée :

```bash
pip install --break-system-packages torch --index-url https://download.pytorch.org/whl/cpu
pip install --break-system-packages "pocket-tts[audio]" faster-whisper librosa
```

Licence : modèle sous CC BY 4.0, usage commercial autorisé. Créditer « Voix : Pocket TTS (Kyutai) » en description.

Vitesse : une minute de voix se génère en environ une minute sur processeur.

Voix utilisables commercialement avec le modèle `french`. La hauteur indiquée est la médiane mesurée :

| Profil | Voix |
|---|---|
| Féminines claires | estelle (246 Hz, française native), azelma (235), fantine (228), jane (225), anna (214), eve (211) |
| Féminines médium | mary (196), vera (184), **eponine (163)**, caro_davy (159) |
| Ambiguë, à éviter si on veut une femme | **alba (140-145)** |
| Masculines médium | george (129), bill_boerst (128), paul (124), stuart_bell (120) |
| Masculines graves | **peter_yearsley (96)**, marius (95), **michael (95)**, javert (87), charles (86) |

Les voix en gras sont celles préférées par la personne. Ne pas utiliser cosette ni jean (licence non commerciale), ni giovanni, lola, juergen, rafael ou daan (licence inconnue).

Le clonage de voix (un fichier `.wav` à la place d'un nom de voix) exige d'avoir accepté les conditions sur huggingface.co/kyutai/pocket-tts et d'avoir un jeton Hugging Face. Il ouvre la banque `kyutai/tts-voices` (35 voix françaises CML-TTS, sous CC BY) ; ne jamais cloner une personne sans son accord.

Voix d'enfant : il n'en existe pas de gratuite. On peut approcher une mascotte en remontant la hauteur (`librosa.effects.pitch_shift`, +3 à +5 demi-tons) d'une voix féminine claire, mais il faut prévenir que ça ne sonne pas comme un vrai enfant.

Toujours passer par `tools/voiceover.py`, jamais par une génération phrase par phrase sans contrôle. Pocket TTS n'est pas déterministe : une même voix peut dériver d'une phrase à l'autre. Avec Alba, la hauteur a varié de 122 à 174 Hz sur une vidéo, et certaines phrases sonnaient masculines.

Le script génère chaque phrase et la refait (jusqu'à 6 fois) dans deux cas :
- la retranscription automatique (faster-whisper) ne correspond pas au texte ;
- la hauteur sort de la plage de la voix de référence (-10 % / +12 %).

Les phrases qui échouent malgré tout sont signalées `!!` : il faut les réécouter.

Écriture du script :
- 2,5 à 3 mots par seconde ;
- une phrase = un plan ;
- les nombres en toutes lettres (« plus de mille ») ;
- les mots anglais ou les marques mal prononcés ont un champ `tts` avec une graphie phonétique (« Lid-vaïce » pour Leadvice) ;
- si un mot reste ambigu (« leads » entendu comme « lits »), on le remplace dans la voix (« contacts qualifiés »), et l'écran garde le mot exact.

### Musique originale : `tools/music_gen.py`

Elle est composée à partir de la timeline, donc libre de droits. Sa structure :
- une intro légère ;
- la rythmique qui entre au premier chapitre (`--drop`) ;
- une pause avec une nappe et une montée avant le final (`--break`) ;
- un impact sur le logo (`--hit`) ;
- un fondu de sortie.

Ambiances : `corporate` (124 BPM, par défaut), `energetic`, `calm`. À 124 BPM, un temps dure 14,5 images à 30 i/s.

Si la personne fournit un morceau, on analyse ses temps forts avec `analyze_music_cues.py` du dépôt `latent-spaces/brag` (MIT, librosa). On rapproche les 1 à 3 révélations majeures d'un temps fort, à ±0,15 s près, et les petites entrées d'un temps, à ±0,10 s. On ignore le calage s'il nuit à la lisibilité. On n'utilise pas les morceaux livrés avec brag : leur licence n'est pas écrite.

Visuels réactifs à la musique : seulement subtils. Le volume ou les basses font respirer un halo ou une carte ; jamais d'égaliseur ni de barres de spectre.

### Effets sonores

Banque CC0 (Kenney, domaine public), récupérable avec :

```bash
git clone --depth 1 https://github.com/latent-spaces/brag /tmp/brag
mkdir -p public/sfx
cp -r /tmp/brag/skills/brag/assets/sfx/{interface,impact,casino,ui,keyboard} public/sfx/
```

Lire `assets/sfx/sfx-analysis.md` avant de choisir. Pour les vidéos sobres, préférer les sons à faible risque d'aigus.

| Moment | Familles de sons |
|---|---|
| Choix sûr, toutes situations | `impact/impactSoft_medium_00x`, `interface/bong_001` |
| Cartes ou éléments qui arrivent un par un | `casino/card-place-*`, `interface/drop_*` |
| Clic, interaction simulée | `ui/click2`, `interface/click_00x`, `ui/mouseclick1` |
| Texte tapé | `keyboard/keypress-*`, en tirant un fichier au hasard par caractère |
| Succès, chiffre qui se pose, logo | `impact/impactBell_heavy_000` |

Calage :
- le son démarre au début de l'animation, 0 à 0,1 s avant la première image visible ;
- dans une série, accentuer le premier élément, le dernier ou le plus fort, pas tous ;
- sans la banque, il reste le kit synthétisé (`smbuild.py --make-sfx`) du skill `stop-motion-studio`.

### Mixage : `tools/mix.py`

`tools/mix.py` fait tout le mixage final :
- la voix passe par un filtre passe-haut, une compression douce, et sort à -16 LUFS ;
- la musique reçoit un creux à 1,8 kHz et un ducking. Son gain est **ajusté automatiquement jusqu'à 18 dB sous la voix** pendant qu'elle parle ;
- les effets du rendu Remotion sont ajoutés ;
- le mix final sort à -14 LUFS / -1,5 dBTP ;
- la vidéo est en H.264 yuv420p, plage TV (Remotion sort en yuvj420p par défaut, moins compatible) ;
- la vignette est extraite, puis posée en frame 0.

Dans Remotion, on ne rend que les effets sonores : la voix et la musique sont ajoutées par `mix.py`.

## 14. Vérification (obligatoire)

Rendre, extraire les images clés, les regarder avec Read, corriger, puis rendre à nouveau. Ne jamais livrer un rendu non vérifié.

Images à inspecter :
- la frame 0 ;
- le premier temps fort ;
- le milieu ;
- le moment où les éléments se posent ;
- la dernière frame ;
- le raccord de boucle, s'il y a une boucle ;
- chaque moment où un chiffre se pose, un mot arrive ou le CTA apparaît.

Bande de contrôle rapide :

```bash
ffmpeg -v error -i film.mp4 -vf "select='eq(n\,5)+eq(n\,20)+eq(n\,45)+eq(n\,84)',scale=-1:480,tile=4x1" -frames:v 1 strip.jpg
```

Défauts à chercher, du plus fréquent au plus rare :
- espacement en `em` à côté d'un gros titre : utiliser des px dans les conteneurs flex ;
- texte qui touche le bord ou sort de la zone sûre ;
- élément visible avant son entrée ou après sa sortie (`clamp` oublié) ;
- couleur héros présente sur plus d'un élément ;
- texte illisible sur le fond ;
- ordre des calques (grain et vignette tout en haut) ;
- alignements différents entre formats ;
- émojis utilisés comme icônes : les dessiner en SVG aux couleurs du thème ;
- fondu enchaîné boueux (deux plans à moitié visibles, texte sur texte) : regarder les images au milieu de chaque transition ;
- secret à l'écran (clé, email, client réel, URL interne).

Checklist finale :
- [ ] aucun easing linéaire spatial, tout est clampé ;
- [ ] entrées sur 2-3 propriétés, décalées ;
- [ ] sorties animées et plus rapides ;
- [ ] au moins 3 temps d'arrêt ;
- [ ] une seule couleur héros ;
- [ ] police display de graisse 600 ou plus sur les titres ;
- [ ] zones sûres respectées ;
- [ ] effets sonores sur les HIT, coupes sur le temps ;
- [ ] chaque format vérifié sur ses propres images ;
- [ ] H.264 yuv420p ;
- [ ] aucune phrase `!!` non réécoutée dans `voiceover.json` ;
- [ ] voix 17 à 20 dB au-dessus de la musique, mix à -14 LUFS ;
- [ ] vignette posée en frame 0 ;
- [ ] chaque texte tenu assez longtemps pour être lu.

Pour un mouvement suspect, extraire les images une par une ou ralentir au quart de la vitesse : les défauts d'easing invisibles à vitesse normale sautent aux yeux.

## 15. Chaîne complète et livrables

Chaîne testée pour une vidéo avec voix off :

```bash
# 1. (mode site) python3 tools/site_capture.py https://site.com work/site --format vertical
# 2. script.json écrit à partir du plan (une phrase par plan, champs visuels libres : shot, big, hl, items…)
python3 tools/voiceover.py script.json vo --voice eponine          # voix contrôlée
python3 tools/timeline.py script.json vo .                          # timeline.json + vo_track.wav
python3 tools/music_gen.py timeline.json music.wav --mood corporate # musique calée
# 3. Remotion lit timeline.json (un <Sequence> par plan) ; rendu des images + effets sonores
npx remotion render src/index.ts Vertical out/render.mp4 --codec h264 --crf 17 --browser-executable=$B --log=error
# 4. mix, niveau, vignette en frame 0
python3 tools/mix.py out/render.mp4 vo_track.wav music.wav timeline.json out/Film_9x16.mp4 --poster-at 4.2
```

Pour `--poster-at`, choisir l'instant le plus fort **posé** (accroche ou logo entièrement apparus, pas en pleine transition). Une image figée doit pouvoir se partager seule. Si on règle cette vignette en frame 0, toutes les plateformes l'affichent en miniature (Slack, X, Discord ignorent la couverture intégrée). Le `_cover.jpg` sert de couverture à téléverser sur Instagram, TikTok, YouTube et LinkedIn.

Dossier de sortie : `video-output/`, ou `video-output-AAAA-MM-JJ-HHmmss/` s'il existe déjà, pour ne jamais écraser une version précédente. Il contient :
- un MP4 par format, avec la vignette en frame 0 ;
- `*_cover.jpg` ;
- `plan.md` ;
- `share-copy.txt` : 1 à 3 phrases publiables telles quelles, spécifiques au produit, sans « ravi de vous présenter » ;
- `voiceover.json` ;
- les bandes de contrôle ;
- le projet Remotion, qu'on peut rendre à nouveau.

Pour un logo ou une icône, on livre aussi le `.json` Lottie ; pour un overlay, le WebM transparent ; le GIF si on le demande.

Envoyer avec SendUserFile. Au-delà de 30 Mo, envoyer la copie de partage et indiquer où se trouve le master.

Retouche : on peut refaire un seul plan (« refais seulement le plan 2, plus court ») en gardant tout le reste. On régénère la phrase de voix concernée si besoin, puis on relance `timeline.py`, le rendu et `mix.py`.

## Annexe : outils son et site (à écrire tels quels dans `tools/` à la première utilisation)

Dépendances :
- Python 3 ;
- `playwright`, avec Chromium déjà installé dans `/opt/pw-browsers` ;
- `pocket-tts`, `torch` (version CPU), `faster-whisper`, `librosa`, `soundfile`, `numpy` ;
- `ffmpeg`.

Les cinq scripts ont été testés de bout en bout dans cet environnement.

### tools/site_capture.py

```python
#!/usr/bin/env python3
"""site_capture — lit un site en ligne comme un visiteur et en extrait la matière d'une vidéo.
Sorties dans OUT/ : brand.json (textes, couleurs, polices, images), shots/NN.png (captures par section
au format de la vidéo), assets/ (logo et images téléchargés).
Usage : python3 site_capture.py https://site.com OUT [--format vertical|landscape|square] [--max-shots 8]
"""
import argparse, json, os, re, sys, urllib.parse, collections
from playwright.sync_api import sync_playwright

SIZES = {"vertical": (1080, 1920), "landscape": (1920, 1080), "square": (1080, 1080)}
COOKIE_WORDS = ["accepter", "tout accepter", "accept", "accept all", "j'accepte", "ok", "agree", "got it", "autoriser", "allow all"]

JS_EXTRACT = r"""
() => {
  const txt = el => (el.innerText || "").replace(/\s+/g, " ").trim();
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05; };
  const meta = n => (document.querySelector(`meta[name="${n}"], meta[property="${n}"]`) || {}).content || "";
  const pick = (sel, n) => [...new Set([...document.querySelectorAll(sel)].filter(vis).map(txt).filter(t => t && t.length < 160))].slice(0, n);
  const colors = {}, fonts = {};
  const add = (m, k, w) => { const v = (k || "").split("|")[1] || ""; if (!v || v === "transparent" || /rgba\([^)]*,\s*0\)$/.test(v)) return; m[k] = (m[k] || 0) + w; };
  for (const el of [...document.querySelectorAll("body, body *")].slice(0, 4000)) {
    if (!vis(el)) continue; const s = getComputedStyle(el); const r = el.getBoundingClientRect(); const area = Math.min(r.width * r.height, 2e6) / 1e4;
    add(colors, "bg|" + s.backgroundColor, area);
    if (el.childNodes.length && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) {
      add(colors, "text|" + s.color, txt(el).length); add(fonts, "f|" + s.fontFamily.split(",")[0].replace(/["']/g, "").trim() + " " + s.fontWeight, txt(el).length);
    }
    if (/^(A|BUTTON)$/.test(el.tagName) || el.getAttribute("role") === "button") add(colors, "accent|" + s.backgroundColor, 50);
  }
  const top = (m, pref, n) => Object.entries(m).filter(([k]) => k.startsWith(pref)).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => k.split("|")[1]);
  const imgs = [...document.images].filter(vis).map(i => ({ src: i.currentSrc || i.src, alt: i.alt || "", w: i.naturalWidth, h: i.naturalHeight,
      logo: /logo/i.test(i.src + i.alt + i.className + (i.closest("header") ? " header" : "")) })).filter(i => i.src && !i.src.startsWith("data:"));
  const svgLogo = [...document.querySelectorAll("header svg, a[href='/'] svg, [class*=logo] svg")].slice(0, 1).map(s => s.outerHTML)[0] || "";
  const icons = [...document.querySelectorAll("link[rel~=icon], link[rel=apple-touch-icon]")].map(l => l.href);
  const cssVars = {}; for (const sh of [...document.styleSheets]) { try { for (const r of sh.cssRules) { if (r.selectorText === ":root") {
      for (const p of r.style) if (p.startsWith("--")) cssVars[p] = r.style.getPropertyValue(p).trim(); } } } catch (e) {} }
  return { title: document.title, description: meta("description") || meta("og:description"), ogImage: meta("og:image"),
    h1: pick("h1", 3), h2: pick("h2", 12), h3: pick("h3", 16), ctas: pick("a[class*=btn], a[class*=button], button, [role=button]", 12),
    paragraphs: pick("main p, section p", 12), nav: pick("nav a", 12),
    colors: { background: top(colors, "bg", 4), text: top(colors, "text", 3), accent: top(colors, "accent", 4) },
    fonts: top(fonts, "f", 4), cssVars, images: imgs.slice(0, 40), svgLogo, icons, height: document.documentElement.scrollHeight };
}
"""

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("url"); ap.add_argument("out")
    ap.add_argument("--format", default="vertical", choices=SIZES); ap.add_argument("--max-shots", type=int, default=8)
    a = ap.parse_args(); url = a.url if a.url.startswith("http") else "https://" + a.url
    W, H = SIZES[a.format]; os.makedirs(f"{a.out}/shots", exist_ok=True); os.makedirs(f"{a.out}/assets", exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(viewport={"width": W // 2, "height": H // 2}, device_scale_factor=2, locale="fr-FR")
        pg = ctx.new_page(); pg.goto(url, wait_until="networkidle", timeout=60000); pg.wait_for_timeout(1500)
        for w in COOKIE_WORDS:  # bandeau cookies : on clique le premier bouton qui correspond
            try:
                btn = pg.get_by_role("button", name=re.compile("^" + re.escape(w) + "$", re.I)).first
                if btn.is_visible(timeout=300): btn.click(timeout=1000); pg.wait_for_timeout(600); break
            except Exception: pass
        # défilement section par section : déclenche les animations au scroll et capture chaque écran
        total = pg.evaluate("document.documentElement.scrollHeight"); step = H // 2; shots = []
        for i, y in enumerate(range(0, max(total, 1), step)):
            if i >= a.max_shots: break
            pg.evaluate(f"window.scrollTo(0, {y})"); pg.wait_for_timeout(700)
            path = f"{a.out}/shots/{i:02d}.png"; pg.screenshot(path=path); shots.append({"file": path, "scrollY": y})
        pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(400)
        data = pg.evaluate(JS_EXTRACT)
        # téléchargement du logo et des plus grandes images
        cand = sorted(data["images"], key=lambda i: (not i["logo"], -(i["w"] * i["h"])))[:8]
        saved = []
        for k, im in enumerate(cand):
            try:
                r = ctx.request.get(im["src"], timeout=20000)
                if r.ok:
                    ext = os.path.splitext(urllib.parse.urlparse(im["src"]).path)[1][:5] or ".img"
                    fn = f"{a.out}/assets/{'logo' if im['logo'] else 'img'}_{k}{ext}"; open(fn, "wb").write(r.body()); saved.append({**im, "file": fn})
            except Exception: pass
        if data.get("svgLogo"): open(f"{a.out}/assets/logo_inline.svg", "w").write(data["svgLogo"])
        b.close()
    data.update(url=url, format=a.format, shots=shots, downloaded=saved); data.pop("svgLogo", None)
    json.dump(data, open(f"{a.out}/brand.json", "w"), ensure_ascii=False, indent=1)
    print(json.dumps({k: data[k] for k in ("title", "description", "h1", "colors", "fonts")}, ensure_ascii=False, indent=1))
    print(f"{len(shots)} captures, {len(saved)} images -> {a.out}")

if __name__ == "__main__":
    main()
```

### tools/voiceover.py

```python
#!/usr/bin/env python3
"""voiceover — voix off française gratuite (Pocket TTS, Kyutai, CC BY 4.0), phrase par phrase, contrôlée.
Chaque phrase est régénérée (jusqu'à --tries fois) tant que :
  - la retranscription automatique (faster-whisper) ne correspond pas au texte (similarité < --min-sim),
  - ou la hauteur médiane (F0) sort de la plage de la voix de référence (même voix d'une phrase à l'autre).
Entrée  : script.json = [{"id": "s01", "say": "texte affiché/attendu", "tts": "graphie phonétique optionnelle"}, ...]
Sorties : OUT/<id>.wav, OUT/voiceover.json (durées, F0, similarité, transcription), rapport en console.
Usage   : python3 voiceover.py script.json OUT --voice eponine [--tries 6] [--min-sim 0.8] [--band 0.9 1.12]
Voix commerciales : estelle azelma fantine jane anna eve mary vera eponine caro_davy alba george bill_boerst
                    paul stuart_bell peter_yearsley marius michael javert charles (ou un .wav si clonage activé)
"""
import argparse, json, os, re, difflib, unicodedata
import numpy as np, soundfile as sf, librosa
from pocket_tts import TTSModel
from faster_whisper import WhisperModel

def norm(t):
    t = unicodedata.normalize("NFKD", t.lower()); t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9 ]+", " ", t).split()

def sim(a, b): return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()

def f0_median(a, sr):
    y = librosa.resample(a, orig_sr=sr, target_sr=16000)
    f, _, _ = librosa.pyin(y, fmin=60, fmax=400, sr=16000); return float(np.nanmedian(f))

def trim(a, sr):
    idx = np.where(np.abs(a) > 0.012)[0]
    return a[max(0, idx[0] - int(0.03 * sr)): idx[-1] + int(0.08 * sr)] if len(idx) else a

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("script"); ap.add_argument("out")
    ap.add_argument("--voice", default="eponine"); ap.add_argument("--language", default="french")
    ap.add_argument("--tries", type=int, default=6); ap.add_argument("--min-sim", type=float, default=0.8)
    ap.add_argument("--band", type=float, nargs=2, default=[0.9, 1.12])
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    m = TTSModel.load_model(language=a.language); sr = 24000
    st = m.get_state_for_audio_prompt(a.voice)
    W = WhisperModel("small", device="cpu", compute_type="int8")
    # hauteur de référence de la voix : moyenne sur deux phrases neutres
    ref = np.median([f0_median(trim(m.generate_audio(st, t).cpu().numpy().astype(np.float32).squeeze(), sr), sr)
                     for t in ["Bonjour, voici une phrase de référence pour mesurer la voix.", "Votre marque mérite une voix qui inspire confiance."]])
    lo, hi = ref * a.band[0], ref * a.band[1]
    print(f"voix {a.voice} : F0 de référence {ref:.0f} Hz, plage acceptée {lo:.0f}-{hi:.0f} Hz")
    S = json.load(open(a.script)); report = []
    for s in S:
        best = None
        for k in range(a.tries):
            x = trim(m.generate_audio(st, s.get("tts", s["say"])).cpu().numpy().astype(np.float32).squeeze(), sr)
            f0 = f0_median(x, sr)
            seg, _ = W.transcribe(librosa.resample(x, orig_sr=sr, target_sr=16000), language=a.language[:2], beam_size=5)
            txt = " ".join(z.text.strip() for z in seg); sc = sim(s["say"], txt)
            ok = sc >= a.min_sim and lo <= f0 <= hi
            score = sc - abs(np.log(f0 / ref))  # meilleur compromis si aucun essai ne passe
            if best is None or ok or score > best["score"]:
                best = dict(audio=x, f0=f0, sim=sc, asr=txt, ok=ok, score=score, tries=k + 1)
            if ok: break
        sf.write(f"{a.out}/{s['id']}.wav", best["audio"], sr)
        r = dict(id=s["id"], say=s["say"], dur=round(len(best["audio"]) / sr, 3), f0=int(round(best["f0"])), sim=round(float(best["sim"]), 2),
                 ok=bool(best["ok"]), tries=int(best["tries"]), asr=best["asr"]); report.append(r)
        print(f"{'OK ' if r['ok'] else '!! '}{r['id']} {r['dur']}s F0={r['f0']} sim={r['sim']} essais={r['tries']} | {r['asr']}", flush=True)
    json.dump({"voice": a.voice, "ref_f0": int(round(ref)), "band": [int(round(lo)), int(round(hi))], "lines": report},
              open(f"{a.out}/voiceover.json", "w"), ensure_ascii=False, indent=1)
    bad = [r["id"] for r in report if not r["ok"]]
    print("total voix", round(sum(r["dur"] for r in report), 1), "s ;", "à réécouter :" if bad else "tout est conforme", " ".join(bad))

if __name__ == "__main__":
    main()
```

### tools/timeline.py

```python
#!/usr/bin/env python3
"""timeline — un plan par phrase de voix off. Lit voiceover.json (+ script.json pour les champs visuels)
et écrit timeline.json (start/length en frames) + vo_track.wav (la voix placée au bon endroit).
Usage : python3 timeline.py script.json VO_DIR OUT_DIR [--fps 30] [--lead 0.5] [--gap 0.3] [--voice-delay 4] [--tail 3]
  lead        : silence avant la 1re phrase (s)       gap  : respiration entre deux phrases (s)
  voice-delay : la coupe image arrive N frames avant la voix (le regard précède l'oreille)
  tail        : temps ajouté sur le dernier plan (logo / CTA), en secondes
"""
import argparse, json, os, numpy as np, soundfile as sf
ap = argparse.ArgumentParser(); ap.add_argument("script"); ap.add_argument("vo"); ap.add_argument("out")
ap.add_argument("--fps", type=int, default=30); ap.add_argument("--lead", type=float, default=0.5)
ap.add_argument("--gap", type=float, default=0.3); ap.add_argument("--voice-delay", type=int, default=4); ap.add_argument("--tail", type=float, default=3.0)
a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
S = json.load(open(a.script)); V = {l["id"]: l for l in json.load(open(f"{a.vo}/voiceover.json"))["lines"]}
sr = 24000; F = a.fps; t = a.lead; shots = []; chunks = []
for k, s in enumerate(S):
    x, r = sf.read(f"{a.vo}/{s['id']}.wav"); assert r == sr
    start = round(t * F); vf = round(len(x) / sr * F)
    length = a.voice_delay + vf + round(a.gap * F) + (round(a.tail * F) if k == len(S) - 1 else 0)
    chunks.append((start + a.voice_delay, x)); shot = dict(s); shot.update(start=start, length=length, voiceFrames=vf); shots.append(shot)
    t = (start + length) / F
total = shots[-1]["start"] + shots[-1]["length"]
track = np.zeros(int(total / F * sr) + sr, np.float32)
for f0, x in chunks: i = int(f0 / F * sr); track[i:i + len(x)] += x
sf.write(f"{a.out}/vo_track.wav", track, sr)
json.dump({"fps": F, "total": total, "shots": shots}, open(f"{a.out}/timeline.json", "w"), ensure_ascii=False, indent=1)
lens = [round(s["length"] / F, 1) for s in shots]
print(f"{len(shots)} plans, {total / F:.1f} s ; durées : {lens}")
if max(lens[:-1] or [0]) > 6: print("ATTENTION : un plan dépasse 6 s, découper la phrase ou ajouter une évolution dans le plan")
```

### tools/music_gen.py

```python
#!/usr/bin/env python3
"""music_gen — musique originale (donc libre de droits) calée sur la timeline : intro, entrée de la rythmique,
pause avec nappe + montée avant le final, impact sur le logo, fondu de sortie.
Usage : python3 music_gen.py timeline.json OUT.wav [--bpm 124] [--mood corporate|energetic|calm]
        [--drop SHOT_ID] [--break SHOT_ID] [--hit SHOT_ID]
Par défaut : drop = 3e plan, break = avant-dernier plan, hit = dernier plan.
"""
import argparse, json, numpy as np, soundfile as sf
ap = argparse.ArgumentParser(); ap.add_argument("timeline"); ap.add_argument("out")
ap.add_argument("--bpm", type=float, default=124); ap.add_argument("--mood", default="corporate", choices=["corporate", "energetic", "calm"])
ap.add_argument("--drop"); ap.add_argument("--break", dest="brk"); ap.add_argument("--hit"); ap.add_argument("--seed", type=int, default=5)
a = ap.parse_args()
T = json.load(open(a.timeline)); F = T["fps"]; D = T["total"] / F; sh = T["shots"]; st = {s["id"]: s["start"] / F for s in sh}
drop = st.get(a.drop, sh[min(2, len(sh) - 1)]["start"] / F); brk = st.get(a.brk, sh[max(0, len(sh) - 3)]["start"] / F); final = st.get(a.hit, sh[-1]["start"] / F)
if a.mood == "calm": a.bpm = min(a.bpm, 96)
sr = 44100; beat = 60 / a.bpm; n = int(sr * (D + 1)); out = np.zeros((n, 2)); rng = np.random.default_rng(a.seed)
Tm = lambda d: np.arange(int(sr * d)) / sr
def add(x, t0, g=1.0, pan=0.0):
    i = int(t0 * sr); m = min(len(x), n - i)
    if m <= 0 or i < 0: return
    out[i:i + m, 0] += x[:m] * g * (1 - max(0, pan)); out[i:i + m, 1] += x[:m] * g * (1 + min(0, pan))
n2f = lambda k: 440 * 2 ** ((k - 69) / 12)
def saw(f, d, h=8): tt = Tm(d); return sum(np.sin(2 * np.pi * f * k * tt) / k for k in range(1, h + 1))
tt = Tm(0.4); KICK = np.sin(2 * np.pi * np.cumsum(45 + 120 * np.exp(-tt * 30)) / sr) * np.exp(-tt * 7)
tt = Tm(0.25); c = rng.normal(0, 1, len(tt)); CLAP = (c - np.convolve(c, np.ones(8) / 8, "same")) * np.exp(-tt * 18) * 0.5
def HAT(o=False):
    tt = Tm(0.16 if o else 0.05); h = rng.normal(0, 1, len(tt)); h = h - np.convolve(h, np.ones(3) / 3, "same"); return h * np.exp(-tt * (25 if o else 90)) * 0.22
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
drums = a.mood != "calm"; dense = a.mood == "energetic"
for b in range(int(D / beat) + 1):
    t0 = b * beat; ch = prog[(b // 8) % 4]; intro = t0 < drop; bd = brk <= t0 < final
    if not bd and drums:
        add(KICK, t0, 0.85 if not intro else 0.6)
        if not intro and b % 4 in (1, 3): add(CLAP, t0, 0.6)
        add(HAT(), t0 + beat / 2, 1.0, 0.3)
        if not intro: add(HAT(), t0 + beat / 4, 0.5, -0.3); add(HAT(), t0 + 3 * beat / 4, 0.5, -0.3)
        if dense and not intro: add(HAT(), t0, 0.4, 0.2)
        if b % 2 == 1 and not intro: add(HAT(True), t0 + beat / 2, 0.35)
        for o, l in [(0, 0.22), (0.5, 0.16), (0.75, 0.2)]:
            tt = Tm(l); add(np.tanh(2.2 * saw(n2f(ch[0] - 24), l)) * np.exp(-tt * 6) * 0.32, t0 + o * beat)
    for k in range(4 if a.mood != "calm" else 2):
        nn = ch[[0, 1, 2, 1][k]] + (24 if bd else 12); tt = Tm(0.25)
        add(saw(n2f(nn), 0.25) * np.exp(-tt * (10 if bd else 16)) * 0.06, t0 + k * beat / (4 if a.mood != "calm" else 2), 1.0, [-0.4, 0.4, -0.2, 0.2][k])
    if (bd or a.mood == "calm") and b % 8 == 0:
        tt = Tm(8 * beat); add(sum(np.sin(2 * np.pi * n2f(k) * tt) for k in ch) / 3 * np.minimum(1, tt / 0.5) * np.minimum(1, (8 * beat - tt) / 0.5) * 0.12, t0)
tt = Tm(max(0.5, final - brk)); f = 200 + 900 * (tt / tt[-1]) ** 2; e = (tt / tt[-1]) ** 2
add(0.18 * np.sin(2 * np.pi * np.cumsum(f) / sr) * e + 0.12 * np.convolve(rng.normal(0, 1, len(tt)), np.ones(30) / 30, "same") * e * 3, final - len(tt) / sr)
tt = Tm(1.2); add(np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-tt * 10)) / sr) * np.exp(-tt * 3) * 0.9, final)
env = np.ones(n); fo = int(1.5 * sr); env[-fo:] = np.linspace(1, 0, fo); fi = int(0.3 * sr); env[:fi] = np.linspace(0, 1, fi)
out *= env[:, None]; out /= np.abs(out).max() * 1.05; sf.write(a.out, out, sr)
print(f"musique {n / sr:.1f} s, {a.bpm:.0f} BPM, {a.mood} ; drop {drop:.2f}s, pause {brk:.2f}s, impact {final:.2f}s ; images par temps : {F * 60 / a.bpm:.1f}")
```

### tools/mix.py

```python
#!/usr/bin/env python3
"""mix — voix + musique (ducking réglé automatiquement) + effets du rendu, niveau réseaux, vignette en frame 0.
1. voix : passe-haut 80 Hz, compression douce, -16 LUFS
2. musique : creux à 1,8 kHz (place pour la voix) + ducking sidechain ; le gain est ajusté jusqu'à ce que la
   musique soit 18 dB (±1,5) sous la voix pendant qu'elle parle
3. mix final -14 LUFS / -1,5 dBTP, vidéo H.264 yuv420p (plage TV), durée exacte de la timeline
4. vignette : image la plus forte (--poster-at s) extraite en .jpg ET incrustée comme frame 0 (miniature partout)
Usage : python3 mix.py RENDER.mp4 vo_track.wav music.wav timeline.json FINAL.mp4 [--poster-at 4.2] [--target-gap 18]
"""
import argparse, json, subprocess, numpy as np, soundfile as sf, os
ap = argparse.ArgumentParser()
for k in ("video", "vo", "music", "timeline", "final"): ap.add_argument(k)
ap.add_argument("--poster-at", type=float); ap.add_argument("--target-gap", type=float, default=18.0); ap.add_argument("--sfx-db", type=float, default=-4)
a = ap.parse_args(); work = os.path.splitext(a.final)[0] + "_work"; os.makedirs(work, exist_ok=True)
run = lambda *c: subprocess.run(["ffmpeg", "-v", "error", "-y", *c], check=True)
T = json.load(open(a.timeline)); D = T["total"] / T["fps"]
run("-i", a.vo, "-af", "aresample=44100,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-2:LRA=7", "-ac", "2", "-ar", "44100", f"{work}/vo.wav")
def duck(gain):
    run("-i", a.music, "-i", f"{work}/vo.wav", "-filter_complex",
        f"[0:a]volume={gain}dB,equalizer=f=1800:t=q:w=1.2:g=-4[m];[m][1:a]sidechaincompress=threshold=0.02:ratio=8:attack=25:release=300[d]",
        "-map", "[d]", f"{work}/music_ducked.wav")
    v, sr = sf.read(f"{work}/vo.wav"); m, _ = sf.read(f"{work}/music_ducked.wav"); n = min(len(v), len(m)); w = int(0.4 * sr); rv, rm = [], []
    for i in range(0, n - w, w):
        x = 20 * np.log10(np.sqrt(np.mean(v[i:i + w] ** 2)) + 1e-9); y = 20 * np.log10(np.sqrt(np.mean(m[i:i + w] ** 2)) + 1e-9)
        if x > -35: rv.append(x); rm.append(y)
    return float(np.mean(rv) - np.mean(rm))
gain = -7.5
for _ in range(6):
    gap = duck(gain); print(f"musique {gain:+.1f} dB -> {gap:.1f} dB sous la voix")
    if abs(gap - a.target_gap) <= 1.5: break
    gain += gap - a.target_gap
has_sfx = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", a.video], capture_output=True, text=True).stdout.strip() != ""
inputs = ["-i", a.video, "-i", f"{work}/vo.wav", "-i", f"{work}/music_ducked.wav"]
fc = (f"[0:a]aresample=44100,volume={a.sfx_db}dB[sfx];[1:a][2:a][sfx]amix=inputs=3:normalize=0:duration=first," if has_sfx else "[1:a][2:a]amix=inputs=2:normalize=0:duration=first,") + "loudnorm=I=-14:TP=-1.5:LRA=11[a]"
run(*inputs, "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-t", f"{D:.3f}", "-vf", "scale=in_range=pc:out_range=tv,format=yuv420p",
    "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-maxrate", "8M", "-bufsize", "16M", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", f"{work}/mixed.mp4")
if a.poster_at is not None:
    poster = os.path.splitext(a.final)[0] + "_cover.jpg"
    run("-ss", str(a.poster_at), "-i", f"{work}/mixed.mp4", "-frames:v", "1", "-q:v", "2", poster)
    run("-i", f"{work}/mixed.mp4", "-i", poster, "-filter_complex", "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]", "-map", "[v]", "-map", "0:a?",
        "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", a.final)
    print("vignette :", poster)
else:
    os.replace(f"{work}/mixed.mp4", a.final)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.final, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
I = [l for l in r.splitlines() if l.strip().startswith("I:")][-1].strip()
print(f"OK -> {a.final} | {I} | {os.path.getsize(a.final) / 1e6:.1f} Mo")
```