---
name: "stop-motion-studio"
description: "Réalise des vidéos stop motion de 3 s à plusieurs minutes, en vertical et en paysage (9:16, 16:9, 4:5, 1:1), pour projets pro ou perso. Couvre le brief, le storyboard en frames, le tournage, les images IA ou animées en code, l'assemblage multi-format, le son synchronisé et la QA."
---

# Stop Motion Studio

Tu es à la fois réalisateur d'animation image par image, chef opérateur, monteur et sound designer. Tu livres une vidéo finie, exportée dans chaque format demandé et prête à publier, pas un conseil théorique. Le skill contient deux moteurs testés, `smcutout.py` (animation) et `smbuild.py` (assemblage). Tu les écris sur disque à la première utilisation, depuis l'annexe en fin de fichier, et tu t'appuies dessus plutôt que de réécrire du ffmpeg à la main.

## 1. Principe directeur

Le stop motion repose sur des images fixes et sur un timing maîtrisé. Les modèles vidéo IA (Veo, Kling, Sora, Runway, Seedance) interpolent le mouvement, si bien que la cadence dérive entre 8 et 12 i/s dans un même clip. Ils ne servent donc jamais à produire le livrable. Le bon ordre est de produire des images fixes (photo, IA ou code), puis de fixer le rythme au montage, image par image.

## 2. Démarrage : hypothèses par défaut, une seule question si besoin

Quand la demande est claire, ne pose aucune question et pars sur ces valeurs par défaut, que tu annonces en une ligne :
- formats : `9x16` et `16x9` ;
- cadence : 12 i/s « on twos », c'est-à-dire chaque image tenue 2 frames dans une timeline à 24 i/s ;
- pipeline : code (C), sauf si des photos ou des images sont fournies ;
- durée : celle demandée, sinon 15 s.

Sinon, pose au maximum 3 questions à choix multiples via AskUserQuestion :
- le pipeline, parmi photos réelles (A), images IA (B), code (C) ou hybride (D) ;
- les formats ;
- la durée cible.

Les quatre pipelines :

A. Photos réelles. La personne shoote au téléphone. Tu fournis le storyboard, le guide de tournage et la feuille de prises, puis tu fais toute la post-production.

B. Images IA. Chaque pose est une image fixe, générée ou éditée à partir d'une image « bible » (Nano Banana / Gemini Image, GPT-Image, Midjourney). Tu écris les prompts frame par frame, puis tu assembles.

C. Code. Tout est produit ici avec `smcutout.py`, à partir de PNG détourés (produits, photos découpées, dessins), de formes, de textes ou de textures papier. C'est le seul pipeline 100 % autonome.

D. Hybride. Les combinaisons utiles :
- un objet réel photographié et détouré, animé en code ;
- un décor IA avec des éléments en code ;
- des plans réels intercalés avec des plans code.

## 3. Catalogue d'usages (pro et perso)

| Usage | Durée type | Formats | Technique conseillée |
|---|---|---|---|
| Pub produit sociale | 8-15 s | 9x16 + 4x5 | Produit qui s'assemble ou se déballe seul, cut-out, boucle |
| Lancement / teaser | 6-10 s | 9x16 + 16x9 | Révélation progressive, gros plan, son « pop » final |
| Explainer service (B2B, conseil) | 30-60 s | 16x9 + 9x16 + 4x5 LinkedIn | Papier découpé, icônes, typographie animée, voix off |
| Logo / identité | 3-6 s | tous | Lettres qui tombent ou se construisent, formes papier |
| Tuto / recette / DIY | 30-60 s | 9x16 | Vue de dessus (flat lay), ingrédients qui entrent seuls |
| Événement / invitation | 10-20 s | 9x16 + 1x1 | Objets symboliques, date en lettres découpées |
| Anniversaire / souvenirs | 20-60 s | 9x16 + 16x9 | Photos imprimées ou objets du quotidien animés, polaroids qui défilent |
| Voyage | 30-60 s | 16x9 + 9x16 | Carte papier, billets, souvenirs qui se posent au rythme de la musique |
| Dessins d'enfants | 15-40 s | 16x9 | Dessins scannés, détourés, animés en cut-out |
| Série récurrente (mascotte) | 15-30 s/épisode | 9x16 | Même personnage et même décor, bible visuelle réutilisée |
| CV / portfolio animé | 20-45 s | 16x9 + 4x5 | Cartes et chiffres qui se posent, fil rouge visuel |

## 4. Multi-format : composer pour l'intersection

Le format est une décision prise avant de tourner ou d'animer, pas au moment de l'export.

Le master carré est la méthode par défaut. On compose sur un canvas carré de 2160×2160. La zone sûre commune aux formats 9:16 et 16:9 est le carré central de 1215×1215 px, soit en coordonnées normalisées x et y entre 0,22 et 0,78. Tout ce qui compte (sujet, action, logo) reste dans ce carré. Le décor et les éléments secondaires peuvent déborder : ils serviront au 16:9 sur les côtés et au 9:16 en haut et en bas. `smbuild.py` recadre ensuite chaque format avec `focus` et `zoom`, réglables par format (`focus_9x16`, `zoom_16x9`…).

Pour un tournage réel, les règles sont les suivantes :
- shooter en paysage 4:3 à pleine résolution, ce qui donne environ 4000×3000 sur un téléphone ;
- un 9:16 recadré dans ce format garde une largeur d'environ 1700 px, ce qui reste supérieur aux 1080 px nécessaires ;
- garder l'action dans le tiers central horizontal ;
- en vue de dessus (flat lay), centrer le sujet et laisser 30 % de décor de chaque côté.

Les compositions dédiées sont réservées aux cas où les mises en page diffèrent vraiment, par exemple un texte long à gauche en 16:9 et empilé en 9:16. Dans ce cas, on fait une scène par format (canvas 1080×1920 et 1920×1080) avec les mêmes clés d'animation adaptées, puis deux projets `smbuild`. Pour les textes, l'option `"formats": ["9x16"]` permet d'en afficher certains dans un seul format.

| Format | Usage principal | Taille |
|---|---|---|
| 9x16 | TikTok, Reels, Shorts, Stories, statut WhatsApp | 1080×1920 |
| 16x9 | YouTube, site web, présentation, TV | 1920×1080 (ou `4k16x9`) |
| 4x5 | Feed Instagram et LinkedIn (prend le plus de place dans le fil) | 1080×1350 |
| 1x1 | Feed polyvalent, Facebook | 1080×1080 |

Vérifie les durées maximales en vigueur des plateformes au moment de publier : elles changent souvent.

## 5. Brief, durée et structure (de 3 s à 1 min et plus)

Commence par un brief de 6 lignes :
- l'objectif (vente, notoriété, teaser, souvenir, cadeau) ;
- la plateforme et les formats ;
- la durée ;
- l'idée unique ;
- la fin (CTA, logo ou boucle parfaite) ;
- l'ambiance sonore.

Règles de création :
- Un hook visuel dans la première seconde : un objet qui apparaît de nulle part, une main qui entre, un assemblage qui commence. Pas de logo en ouverture.
- Une seule idée par vidéo. Montrer le bénéfice par l'action plutôt que d'énumérer des caractéristiques.
- Une boucle quand c'est possible : la dernière image ramène à la première, ce qui fait rejouer la vidéo et augmente le temps de visionnage.
- Les séries avec un personnage ou un objet récurrent fidélisent mieux que les vidéos isolées.

Cadences :
- 12 i/s « on twos » : le standard, assez fluide, avec un look artisanal.
- 8 i/s : plus saccadé, plus « fait main », et moitié moins d'images.
- 24 i/s « on ones » : réservé aux mouvements rapides ou très fluides.
- On peut mélanger les cadences dans un même film.

Structures qui fonctionnent :
- 6-8 s : hook (1 s), action unique, payoff, boucle.
- 15 s : hook (0-1,5 s), montée (1,5-10 s), payoff ou produit (10-13 s), CTA ou logo (13-15 s).
- 30 s : hook, problème ou situation, 2 ou 3 actions qui escaladent, révélation, CTA.
- 60 s : 4 actes.
  - Hook, 0-3 s : une image qu'on n'a jamais vue.
  - Mise en place, 3-15 s : le monde et l'objet.
  - Développement, 15-45 s : 3 séquences qui escaladent, avec un changement de rythme toutes les 8-12 s (plan serré, plan large, accélération, pause).
  - Payoff, 45-55 s : la révélation.
  - Sortie, 55-60 s : le CTA, ou un retour à l'image d'ouverture pour boucler.

Budget images. Le nombre d'images uniques se calcule ainsi : durée × cadence ÷ réutilisation. Une minute pleine à 12 i/s représente 720 images. On la ramène à 250-400 images uniques avec les leviers suivants, tous gérés par `smbuild.py` :
- `holds` : maintenir une image 4 à 12 frames sur les moments clés, une respiration qui sert aussi la lisibilité ;
- `pingpong` : aller-retour, pour un objet qui respire, oscille ou flotte ;
- `repeat` : rejouer un cycle de 6 à 12 images (marche, rotation, scintillement) ;
- `range` : réutiliser une portion d'un plan ailleurs ;
- passer certaines séquences à 8 i/s (`hold` = 1,5 avec `fps` 12) ;
- mélanger avec du time-lapse (photo toutes les 2 s d'une action réelle) ou de la pixilation (une personne qui pose image par image).

Calage sur la musique. Le nombre d'images par temps vaut 12 × 60 ÷ BPM. À 120 BPM, cela fait 6 images par temps, et à 100 BPM, 7,2 (alterner 7 et 8). Les mouvements clés, les apparitions et les coupes tombent sur les temps forts.

## 6. Storyboard chiffré (toujours, avant toute production)

Livre un tableau plan par plan avec les colonnes suivantes : id, durée (s), images uniques, maintiens, action, cadrage, zone sûre respectée (oui/non), son et texte à l'écran. Livre ensuite le squelette `project.json` correspondant.

Principes d'animation à appliquer :
- Ease in / ease out : petits écarts au départ et à l'arrivée, grands au milieu (2-4-8-8-4-2).
- Anticipation : un léger recul avant un saut.
- Overshoot : dépasser puis revenir (easing `back`).
- Squash and stretch : `sx`/`sy` à 1,15/0,85 à l'impact.
- Décalage : les éléments d'un groupe partent avec 2 à 3 images d'écart, jamais tous ensemble.
- Entrées : 4 à 6 images pour une entrée naturelle, 1 seule image accompagnée d'un « pop » pour une apparition magique.
- Lisibilité : le regard ne suit qu'une chose à la fois, donc un seul mouvement principal par moment.

## 7. Pipeline A : guide de tournage pour la personne

Livre une checklist courte, adaptée au projet. La base :
- Téléphone sur trépied, ou bras articulé pour la vue de dessus. Déclenchement par télécommande Bluetooth, bouton volume des écouteurs ou minuteur de 2 s, jamais au doigt.
- Exposition, mise au point et balance des blancs verrouillées. Sur iPhone, appui long sur le sujet pour activer le verrouillage AE/AF, ou une app manuelle. Sur Android, le mode Pro.
- ISO bas, de 100 à 400. Au Maroc, le réseau électrique est à 50 Hz : régler la vitesse sur 1/50 ou 1/100 s pour éviter les bandes de scintillement des LED et néons.
- Lumière 100 % artificielle et fixe (volets fermés, 1 ou 2 lampes LED avec diffuseur ou papier calque). Pas de vêtements clairs près du set, ils renvoient de la lumière.
- Décor et fond scotchés, pâte adhésive sous les objets, fil de nylon ou tige transparente pour les objets en l'air (retirés au montage ou cachés).
- App avec pelure d'oignon : Stop Motion Studio, sur iOS et Android. Mode avion et batterie pleine.
- Shooter en paysage 4:3 à pleine résolution, en JPEG sans filtre (voir section 4).
- Pour les tournages en plusieurs sessions : prendre une photo de référence du set au début de chaque session, placer une carte grise ou une feuille blanche dans un coin hors cadre, et noter les réglages. Les variations restantes sont corrigées par le deflicker par plan de `smbuild.py`.
- Une à deux images de plateau vide au début et à la fin de chaque plan.
- Export : un dossier par plan (`shots/s01/`, `shots/s02/`…), images numérotées dans l'ordre. La personne envoie un ZIP par plan.

Fournis aussi une feuille de prises : pour chaque plan, le nombre d'images à faire, l'écart de déplacement par image (en mm) et les images à maintenir.

## 8. Pipeline B : images IA cohérentes

- Commencer par une image bible : personnage ou produit, décor, lumière, palette, texture. Pour un personnage, ajouter une planche de face, de profil et de dos.
- Ne générer que les poses clés (key poses), puis les intermédiaires (in-betweens) par édition de l'image précédente. Un prompt d'édition décrit uniquement le delta (« le bras droit monte de 15°, rien d'autre ne change »).
- Vocabulaire de texture crédible :
  - pâte à modeler avec traces de doigts ;
  - feutrine, papier découpé, carton ondulé ;
  - miniatures, petites imperfections ;
  - lumière chaude à source unique, profondeur de champ courte ;
  - références visuelles : Aardman ou Laika.
- Viser 8 i/s avec beaucoup de maintiens. Une minute IA représente 60 à 150 images uniques, pas 720.
- Vérifier si une clé d'API image existe (`env | grep -iE "gemini|openai"`) et si le réseau l'autorise. Sinon, livrer un fichier `prompts.md` numéroté frame par frame à exécuter dans l'app Gemini ou ChatGPT, et demander les images en retour dans un ZIP.
- Contrôler chaque image avant l'assemblage : couleurs, nombre d'éléments, proportions, mains. Une image incohérente se remplace, elle ne se rattrape pas.
- Recadrer et aligner au montage avec `focus` et `zoom` si le modèle a déplacé le cadrage.

## 9. Pipeline C : animation code avec `smcutout.py`

Chaque image rendue correspond à une « photo » prise à la cadence `fps`, donc le mouvement est naturellement saccadé. Le jitter (micro-décalage de 1 à 3 px et de 0,3 à 1° de rotation) ne s'applique qu'aux objets qui ont bougé entre deux images, comme quand une main touche l'objet en vrai. `boil: true` le force en permanence, pour un rendu pâte à modeler vivante. S'ajoutent des ombres portées douces, du grain, un léger scintillement d'exposition, un vignettage et une texture papier procédurale.

Schéma de scène (`scene.json`) :

```json
{
  "canvas": [2160, 2160], "fps": 12, "duration": 6.0, "out": "shots/s01", "seed": 4,
  "background": {"color": "#EFE6D8", "paper": true, "image": null},
  "jitter": {"pos": 2.0, "rot": 0.5}, "camera_jitter": 0.0,
  "shadow": {"offset": [10, 16], "blur": 12, "opacity": 0.33},
  "grain": 0.025, "flicker": 0.008, "vignette": 0.18,
  "layers": [
    {"id": "produit", "src": "assets/produit.png", "width": 700, "z": 2, "in": 0,
     "keys": [{"f": 0, "x": 0.5, "y": -0.2, "r": -20},
              {"f": 8, "y": 0.5, "r": 0, "ease": "back"},
              {"f": 10, "sx": 1.12, "sy": 0.88}, {"f": 12, "sx": 1, "sy": 1}]},
    {"id": "titre", "text": "Fait main", "size": 170, "color": "#2B2B2B", "z": 3, "in": 30,
     "keys": [{"f": 30, "x": 0.5, "y": 0.72, "s": 0.2}, {"f": 36, "s": 1, "ease": "back"}]},
    {"id": "pastille", "shape": "circle", "radius": 90, "fill": "#7FB3A6", "boil": true}
  ]
}
```

Fonctionnement des clés :
- `f` est l'index d'image, à la cadence `fps`.
- `x` et `y` sont des positions normalisées de 0 à 1 ; une valeur négative ou supérieure à 1 place l'objet hors champ.
- Les autres propriétés : `s` (échelle), `sx`/`sy` (squash), `r` (rotation en degrés), `o` (opacité).
- Une propriété absente reprend la valeur de la clé précédente.
- `ease` (`linear`, `in`, `out`, `inout`, `back`, `bounce`, `hold`) s'applique au segment qui arrive sur la clé.
- `in`/`out` définissent la fenêtre d'apparition du calque.
- Un calque peut être une image (`src` + `width` en px canvas), un texte (`text`, `size`, `font`, `color`, `stroke_width`, `stroke`) ou une forme (`shape` : `circle` ou `rect`, `radius`, `w`, `h`, `fill`, `corner`).

Commandes :
- `python3 smcutout.py scene.json --preview` : demi-résolution, pour itérer ;
- `python3 smcutout.py scene.json` : pleine résolution. Rendu parallèle sur tous les cœurs, environ 0,3 s par image en 2160² sur 2 cœurs.

Assets :
- Pour détourer une photo d'objet, tenter `pip install rembg --break-system-packages` (le modèle se télécharge depuis GitHub), sinon demander un PNG détouré.
- Polices : Poppins est disponible localement. Pour une autre police, demander le fichier `.ttf` ou utiliser `fc-list`.

Une scène par plan, un dossier de frames par plan, puis assemblage de tous les plans avec `smbuild.py`.

Remotion reste une alternative pour du motion design complexe (charger le skill Remotion s'il est installé). Pour le look stop motion, utiliser `const stepped = Math.floor(frame / 2) * 2;` partout à la place de `frame`, `random('j-' + stepped)` pour le jitter, et ne mettre ni motion blur ni easing continu.

## 10. Assemblage multi-format avec `smbuild.py`

Schéma de projet (`project.json`) :

```json
{
  "name": "film", "fps": 12, "out_fps": 24, "formats": ["9x16", "16x9"],
  "deflicker": 5, "grain": 0.01, "loop": false, "max_duration": 60, "out": "export",
  "shots": [
    {"id": "s01", "frames": "shots/s01/*.jpg", "hold": 1, "holds": {"54": 8}, "end_hold": 12,
     "focus": [0.5, 0.5], "focus_9x16": [0.45, 0.5], "zoom_16x9": 1.05},
    {"id": "s02", "frames": "shots/s02/*.jpg", "pingpong": true, "repeat": 2},
    {"id": "s03", "frames": "shots/s01/*.jpg", "range": [40, 72]}
  ],
  "texts": [
    {"text": "Chaque pierre compte", "start": 0.0, "end": 2.5, "place": "top", "size": 0.065},
    {"text": "Lien en bio", "start": 12.0, "end": 15.0, "place": "bottom", "formats": ["9x16"]}
  ],
  "audio": {
    "music": "audio/musique.mp3", "music_start": 0, "music_gain_db": -16, "fade_out": 1.5,
    "voice": "audio/voix.m4a", "voice_delay": 0.5, "lufs": -14,
    "sfx": [{"file": "pop", "shot": "s01", "image": 9, "gain_db": -4},
            {"file": "audio/froissement.wav", "at": 4.2}]
  }
}
```

Paramètres de timing :
- `hold` est un nombre d'images de prise de vue : à `fps` 12 et `out_fps` 24, `hold` 1 correspond à 2 frames de sortie.
- `holds` cible une image précise, avec un index à partir de 0 compté dans le plan après `range`.
- `end_hold` maintient la dernière image.

Autres comportements :
- Le deflicker et le raccord couleur sont automatiques : un gain par canal est lissé par médiane glissante sur `deflicker` images, plan par plan. Mettre `1` pour le désactiver.
- Les textes sont dessinés « on twos » avec un léger tremblement (boil) et placés dans les zones sûres propres à chaque format. Désactiver avec `"boil": false`.
- Les SFX intégrés, synthétisés sans téléchargement, sont `pop`, `click`, `whoosh`, `thud`, `ding` et `paper`. Tout autre fichier passe par son chemin.
- Un SFX calé par `shot` + `image` tombe exactement sur l'image, quel que soit le maintien. `offset` décale en secondes, par exemple -0,04 pour anticiper un impact.
- Le mix final est normalisé à -14 LUFS avec un true peak à -1,5 dBTP, le standard des réseaux sociaux.
- Sorties : `export/<name>_<format>.mp4` (H.264, yuv420p, faststart) et `export/<name>_<format>_contact.jpg` (24 vignettes réparties sur toute la durée).

Commandes :
- `python3 smbuild.py project.json --preview --only 9x16` : demi-résolution rapide, pour valider le timing ;
- `python3 smbuild.py project.json` : rendu final dans tous les formats ;
- `python3 smbuild.py --make-sfx sfx/` : extraire les SFX intégrés pour les écouter.

Temps de rendu. Sur 2 cœurs, compter environ 2,5 min pour 12 s de film en deux formats, et 10 à 15 min pour une minute. Pour les longs rendus, utiliser un timeout Bash de 600000 ms, ou rendre format par format avec `--only`.

Stabilisation, si un tournage réel a bougé : appliquer au MP4 final.

```bash
ffmpeg -i in.mp4 -vf vidstabdetect=shakiness=5:result=t.trf -f null -
ffmpeg -i in.mp4 -vf vidstabtransform=input=t.trf:smoothing=10:zoom=2,unsharp=5:5:0.6 -c:a copy out.mp4
```

## 11. Son : la moitié de l'illusion

- Mettre un son court sur chaque contact, apparition ou impact : `pop` pour une apparition, `thud` pour un objet posé, `paper` pour du papier, `whoosh` pour une sortie rapide, `ding` pour la révélation. Ne pas en mettre sur chaque image.
- Musique : la personne la fournit, ou la prend dans une bibliothèque libre de droits dont elle vérifie la licence (YouTube Audio Library, Pixabay Music). Ne jamais utiliser un morceau commercial pour une pub.
- Voix off : la personne l'enregistre au téléphone, dans une pièce meublée, à 20 cm du micro. Compter 2,5 mots par seconde en français.
- Une vidéo sociale doit rester compréhensible sans le son : tout message clé apparaît aussi en texte.

## 12. Texte à l'écran

- 6 mots maximum par carton.
- Durée d'affichage : 1,2 s + 0,3 s par mot.
- Taille minimale : 0,05 en 9:16.
- Contraste assuré par le contour (`stroke`).
- Jamais de texte dans les 13 % du haut ni dans les 20 % du bas en 9:16, à cause de l'interface TikTok et Reels. Le script applique cette règle automatiquement.

## 13. QA avant livraison (obligatoire)

Ouvrir chaque planche contact avec Read, puis vérifier les points suivants :
- un hook lisible en moins d'une seconde ;
- aucun élément important coupé dans un format (comparer les planches 9x16 et 16x9) ;
- aucune image incohérente, main oubliée ou support visible ;
- pas de flicker visible ;
- des textes dans les zones sûres et lisibles sur la vignette ;
- une boucle propre si `loop` est activé (le script affiche l'écart, viser moins de 6) ;
- une durée conforme au brief ;
- un `ffprobe` correct : H.264, yuv420p, 24 i/s, audio AAC.

Pour voir une seconde précise : `ffmpeg -ss 12.5 -i film.mp4 -frames:v 1 check.jpg`, puis l'ouvrir avec Read.

## 14. Livrables et organisation

Arborescence d'un projet :

```
projet/
  brief.md  storyboard.md  project.json
  scenes/s01.json ...        (pipeline C)
  assets/  audio/
  shots/s01/0001.jpg ...
  export/<name>_9x16.mp4  <name>_16x9.mp4  *_contact.jpg  <name>_cover.jpg
```

À livrer avec SendUserFile :
- les vidéos finales ;
- les planches contact ;
- une image de couverture par format, extraite au meilleur moment avec `ffmpeg -ss T -i … -frames:v 1` ;
- le storyboard.

Pour une série, livrer aussi la bible visuelle (palette, textures, personnage, lumière, police, SFX) et un `project.json` modèle réutilisable.

## 15. Pièges fréquents

| Symptôme | Cause | Correction |
|---|---|---|
| Image qui « pompe » en luminosité | Exposition auto ou lumière du jour | Verrouiller AE au tournage ; `deflicker` 5 à 9 |
| Bandes horizontales | LED à 50 Hz | Vitesse 1/50 ou 1/100 s |
| Mouvement trop fluide, effet « 3D » | Trop d'images, pas de jitter | 12 ou 8 i/s, jitter, maintiens |
| Mouvement illisible | Écarts trop grands, tout bouge en même temps | Ease in/out, un seul mouvement principal |
| Sujet coupé en 9:16 | Composé hors zone sûre | Rester dans x/y 0,22-0,78 ou utiliser `focus_9x16` |
| Son décalé | SFX calé en secondes à la main | Caler par `shot` + `image` |
| Photos tournées de 90° | EXIF du téléphone | Géré automatiquement par `smbuild.py` |
| Vidéo refusée ou floue sur la plateforme | Mauvais codec ou débit | Garder H.264 yuv420p CRF 17, ne pas réencoder ailleurs |

## Annexe : moteurs (à écrire tels quels dans `tools/` à la première utilisation)

Écris les deux fichiers exactement comme ci-dessous, puis vérifie avec `python3 -c "import ast;ast.parse(open('tools/smbuild.py').read())"`. Dépendances : Python 3, Pillow, numpy et ffmpeg (`pip install pillow numpy --break-system-packages` si besoin).

### tools/smcutout.py

```python
#!/usr/bin/env python3
"""smcutout — moteur stop motion "cut-out" : rend un plan image par image a partir d'une scene JSON.

Chaque image rendue = une "photo" a la cadence de prise de vue (fps). Le mouvement est donc
naturellement saccade. Jitter uniquement sur les objets "touches" (qui ont bouge), comme en vrai.

Usage : python3 smcutout.py scene.json [--preview] [--jobs N]
"""
import json, sys, os, math, random, argparse, glob, zlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import numpy as np

FONT_FALLBACKS = [
    "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

def hex2rgb(h, a=255):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)

def ease(t, kind):
    t = max(0.0, min(1.0, t))
    if kind == "linear": return t
    if kind == "in": return t * t
    if kind == "out": return 1 - (1 - t) ** 2
    if kind == "inout": return 3 * t * t - 2 * t * t * t
    if kind == "back":  # depasse puis revient (overshoot)
        c1 = 1.70158; c3 = c1 + 1
        return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
    if kind == "bounce":
        n1, d1 = 7.5625, 2.75
        if t < 1 / d1: return n1 * t * t
        if t < 2 / d1: t -= 1.5 / d1; return n1 * t * t + 0.75
        if t < 2.5 / d1: t -= 2.25 / d1; return n1 * t * t + 0.9375
        t -= 2.625 / d1; return n1 * t * t + 0.984375
    if kind == "hold": return 0.0
    return 3 * t * t - 2 * t * t * t

PROPS = {"x": 0.5, "y": 0.5, "s": 1.0, "r": 0.0, "o": 1.0, "sx": 1.0, "sy": 1.0}

def fill_keys(keys):
    keys = sorted(keys, key=lambda k: k["f"])
    prev = dict(PROPS)
    out = []
    for k in keys:
        cur = dict(prev); cur.update(k)
        out.append(cur); prev = cur
    return out

def state_at(keys, f):
    if f <= keys[0]["f"]: return {p: keys[0][p] for p in PROPS}
    if f >= keys[-1]["f"]: return {p: keys[-1][p] for p in PROPS}
    for a, b in zip(keys, keys[1:]):
        if a["f"] <= f <= b["f"]:
            span = max(1, b["f"] - a["f"])
            e = ease((f - a["f"]) / span, b.get("ease", "inout"))
            return {p: a[p] + (b[p] - a[p]) * e for p in PROPS}

def load_font(path, size):
    for p in ([path] if path else []) + FONT_FALLBACKS:
        if p and os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def make_layer_image(L, base_dir):
    if "src" in L:
        im = Image.open(os.path.join(base_dir, L["src"])).convert("RGBA")
        if "width" in L:  # largeur cible en px canvas
            w = int(L["width"]); im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
        return im
    if "text" in L:
        font = load_font(L.get("font"), int(L.get("size", 120)))
        stroke = int(L.get("stroke_width", 0))
        lines = L["text"].split("\n")
        dummy = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
        boxes = [dummy.textbbox((0, 0), ln, font=font, stroke_width=stroke) for ln in lines]
        lh = max(b[3] - b[1] for b in boxes); gap = int(lh * 0.25)
        W = max(b[2] - b[0] for b in boxes) + 2 * stroke + 20
        H = len(lines) * lh + (len(lines) - 1) * gap + 2 * stroke + 20
        im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        y = 10
        for ln, b in zip(lines, boxes):
            x = (W - (b[2] - b[0])) // 2 - b[0]
            d.text((x, y - b[1]), ln, font=font, fill=hex2rgb(L.get("color", "#111111")),
                   stroke_width=stroke, stroke_fill=hex2rgb(L.get("stroke", "#000000")))
            y += lh + gap
        return im
    if "shape" in L:
        r = int(L.get("radius", 80)); w = int(L.get("w", 2 * r)); h = int(L.get("h", 2 * r))
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        fill = hex2rgb(L.get("fill", "#C0392B"))
        if L["shape"] == "circle": d.ellipse([0, 0, w - 1, h - 1], fill=fill)
        elif L["shape"] == "rect": d.rounded_rectangle([0, 0, w - 1, h - 1], radius=int(L.get("corner", 0)), fill=fill)
        if L.get("shade", True):  # petit volume facon pate/papier
            hl = Image.new("L", (w, h), 0); dh = ImageDraw.Draw(hl)
            dh.ellipse([w * 0.18, h * 0.12, w * 0.55, h * 0.45], fill=90)
            hl = hl.filter(ImageFilter.GaussianBlur(max(2, w // 12)))
            white = Image.new("RGBA", (w, h), (255, 255, 255, 0)); white.putalpha(hl)
            im = Image.alpha_composite(im, Image.composite(white, Image.new("RGBA", (w, h)), im.split()[3]))
        return im
    raise ValueError("layer sans src/text/shape: %s" % L.get("id"))

def paper_background(W, H, color, seed, strength=0.06):
    rng = np.random.default_rng(seed)
    base = np.ones((H, W, 3), np.float32) * np.array(hex2rgb(color)[:3], np.float32)
    small = rng.normal(0, 1, (H // 8 + 1, W // 8 + 1)).astype(np.float32)
    fib = Image.fromarray(((small - small.min()) / (np.ptp(small) + 1e-6) * 255).astype(np.uint8))
    fib = fib.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
    tex = (np.asarray(fib, np.float32) / 255.0 - 0.5) * 2
    fine = rng.normal(0, 0.35, (H, W)).astype(np.float32)
    base *= (1 + strength * tex[..., None] + strength * 0.3 * fine[..., None])
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")

def paper_strength(v):
    if v is False or v is None: return 0.0
    if v is True: return 0.06
    return float(v)

def vignette(W, H, amount):
    y, x = np.ogrid[-1:1:H * 1j, -1:1:W * 1j]
    m = 1 - amount * np.clip(np.sqrt(x * x + y * y) / 1.4142, 0, 1) ** 2
    return m.astype(np.float32)

CTX = {}

def render_frame(f):
    c = CTX; W, H, scale = c["W"], c["H"], c["scale"]; SH = c["SH"]; seed = c["seed"]
    canvas = c["bgim"].copy()
    shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    objects = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for L in c["layers"]:
        if f < L.get("in", 0) or f > L.get("out", 10 ** 9): continue
        st = state_at(L["_keys"], f)
        if f == L.get("in", 0) or f == 0: moved = True
        else:
            pv = state_at(L["_keys"], f - 1)
            moved = any(abs(st[p] - pv[p]) > 1e-4 for p in PROPS)
        if st["o"] <= 0.01: continue
        rng = random.Random(zlib.crc32(("%s|%d|%s" % (seed, f, L.get("id", ""))).encode()))
        jit = moved or L.get("boil", False)
        jx = rng.uniform(-c["jpos"], c["jpos"]) if jit else 0; jy = rng.uniform(-c["jpos"], c["jpos"]) if jit else 0
        jr = rng.uniform(-c["jrot"], c["jrot"]) if jit else 0
        im = L["_img"]
        sw, shh = st["s"] * st["sx"], st["s"] * st["sy"]
        if abs(sw - 1) > 1e-3 or abs(shh - 1) > 1e-3:
            im = im.resize((max(1, int(im.width * sw)), max(1, int(im.height * shh))), Image.LANCZOS)
        ang = st["r"] + jr
        if abs(ang) > 0.01: im = im.rotate(-ang, resample=Image.BICUBIC, expand=True)
        if st["o"] < 0.999:
            im = im.copy(); im.putalpha(im.split()[3].point(lambda v: int(v * st["o"])))
        cx, cy = st["x"] * W + jx, st["y"] * H + jy
        pos = (int(cx - im.width / 2), int(cy - im.height / 2))
        if L.get("shadow", True) and SH:
            sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
            sh.putalpha(im.split()[3].point(lambda v: int(v * SH.get("opacity", 0.33))))
            ox, oy = SH.get("offset", [10, 16])
            shadow_layer.paste(sh, (pos[0] + int(ox * scale), pos[1] + int(oy * scale)), sh)
        objects.paste(im, pos, im)
    if SH:
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(SH.get("blur", 12) * scale))
        canvas = Image.alpha_composite(canvas, shadow_layer)
    canvas = Image.alpha_composite(canvas, objects).convert("RGB")
    arr = np.asarray(canvas, np.float32)
    rng = np.random.default_rng(seed * 100003 + f)
    gain = 1 + rng.uniform(-c["flick"], c["flick"])
    arr = arr * c["vig"][..., None] * gain
    if c["grain"] > 0: arr += rng.normal(0, c["grain"] * 255, (H, W, 1)).astype(np.float32)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    if c["cam"] > 0:
        dx, dy = rng.uniform(-c["cam"], c["cam"]), rng.uniform(-c["cam"], c["cam"])
        img = img.transform(img.size, Image.AFFINE, (1, 0, dx, 0, 1, dy), resample=Image.BICUBIC)
    img.save(os.path.join(c["out"], "%04d.jpg" % (f + 1)), quality=94)
    return f

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("scene"); ap.add_argument("--preview", action="store_true"); ap.add_argument("--jobs", type=int, default=os.cpu_count() or 1)
    a = ap.parse_args()
    S = json.load(open(a.scene)); base_dir = os.path.dirname(os.path.abspath(a.scene))
    W, H = S.get("canvas", [2160, 2160])
    scale = 0.5 if a.preview else 1.0
    W, H = int(W * scale), int(H * scale)
    fps = S.get("fps", 12)
    N = int(S["frames"]) if "frames" in S else int(round(S["duration"] * fps))
    seed = S.get("seed", 1)
    out = os.path.join(base_dir, S.get("out", "frames"))
    os.makedirs(out, exist_ok=True)
    for f in glob.glob(os.path.join(out, "*.jpg")): os.remove(f)

    bg = S.get("background", {})
    if bg.get("image"):
        bgim = Image.open(os.path.join(base_dir, bg["image"])).convert("RGBA")
        r = max(W / bgim.width, H / bgim.height)
        bgim = bgim.resize((math.ceil(bgim.width * r), math.ceil(bgim.height * r)), Image.LANCZOS)
        l, t = (bgim.width - W) // 2, (bgim.height - H) // 2
        bgim = bgim.crop((l, t, l + W, t + H))
    else:
        bgim = paper_background(W, H, bg.get("color", "#EDE6DA"), seed, paper_strength(bg.get("paper", True)))
    J = S.get("jitter", {}); jpos = J.get("pos", 2.0) * scale; jrot = J.get("rot", 0.5)
    SH = S.get("shadow", {"offset": [10, 16], "blur": 12, "opacity": 0.33})
    grain = S.get("grain", 0.025); flick = S.get("flicker", 0.008)
    vig = vignette(W, H, S.get("vignette", 0.18))
    cam = S.get("camera_jitter", 0.0) * scale

    layers = sorted(S["layers"], key=lambda L: L.get("z", 0))
    for L in layers:
        L["_img"] = make_layer_image(L, base_dir)
        if scale != 1.0:
            L["_img"] = L["_img"].resize((max(1, int(L["_img"].width * scale)), max(1, int(L["_img"].height * scale))), Image.LANCZOS)
        L["_keys"] = fill_keys(L.get("keys", [{"f": 0}]))

    global CTX
    CTX = dict(W=W, H=H, bgim=bgim, layers=layers, jpos=jpos, jrot=jrot, SH=SH, grain=grain, flick=flick,
               vig=vig, cam=cam, seed=seed, scale=scale, out=out, N=N)
    jobs = max(1, a.jobs)
    if jobs > 1:
        import multiprocessing as mp
        with mp.get_context("fork").Pool(jobs) as pool:
            for k, _ in enumerate(pool.imap_unordered(render_frame, range(N), chunksize=4)):
                if (k + 1) % 24 == 0 or k == N - 1: print("rendu %d/%d" % (k + 1, N), flush=True)
    else:
        for f in range(N):
            render_frame(f)
            if (f + 1) % 24 == 0 or f == N - 1: print("rendu %d/%d" % (f + 1, N), flush=True)
    print("OK ->", out)

if __name__ == "__main__":
    main()
```

### tools/smbuild.py

```python
#!/usr/bin/env python3
"""smbuild — assemble un film stop motion (jusqu'a plusieurs minutes) en plusieurs formats
a partir d'un project.json : plans, maintiens, ping-pong, recadrage par format, deflicker,
textes "on twos", effets sonores cales a l'image, musique, loudness reseaux, planches contact.

Usage : python3 smbuild.py project.json [--preview] [--only 9x16,16x9] [--make-sfx]
"""
import json, os, sys, glob, math, argparse, subprocess, shutil, wave, zlib, random
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

FORMATS = {"9x16": (1080, 1920), "16x9": (1920, 1080), "4x5": (1080, 1350), "1x1": (1080, 1080), "4k16x9": (3840, 2160)}
# zones sures texte (fraction haut, fraction bas) : interface TikTok/Reels/Shorts en 9:16
SAFE = {"9x16": (0.13, 0.20), "4x5": (0.07, 0.09), "1x1": (0.07, 0.08), "16x9": (0.08, 0.10), "4k16x9": (0.08, 0.10)}
FONTS = ["/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-3000:]); raise SystemExit("ffmpeg a echoue : " + " ".join(cmd[:6]))
    return r.stdout

# ---------- effets sonores de secours, synthetises (aucun telechargement) ----------
def write_wav(path, x, sr=48000):
    x = np.clip(x, -1, 1); d = (x * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(d.tobytes())

def make_sfx(dirpath):
    os.makedirs(dirpath, exist_ok=True); sr = 48000; rng = np.random.default_rng(3)
    t = lambda d: np.arange(int(sr * d)) / sr
    tt = t(0.12); f = 900 * np.exp(-tt * 25) + 180  # pop : glissando descendant
    write_wav(f"{dirpath}/pop.wav", 0.8 * np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-tt * 38))
    tt = t(0.04); write_wav(f"{dirpath}/click.wav", 0.7 * rng.normal(0, 1, len(tt)) * np.exp(-tt * 160))
    tt = t(0.45); n = rng.normal(0, 1, len(tt)); k = np.ones(40) / 40
    env = np.sin(np.pi * tt / tt[-1]) ** 2
    write_wav(f"{dirpath}/whoosh.wav", 0.5 * np.convolve(n, k, "same") * env * 4)
    tt = t(0.25); write_wav(f"{dirpath}/thud.wav", 0.9 * np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 18) + 0.2 * rng.normal(0, 1, len(tt)) * np.exp(-tt * 90))
    tt = t(0.5); write_wav(f"{dirpath}/ding.wav", 0.5 * (np.sin(2 * np.pi * 1320 * tt) + 0.4 * np.sin(2 * np.pi * 2640 * tt)) * np.exp(-tt * 7))
    tt = t(0.18); write_wav(f"{dirpath}/paper.wav", 0.5 * rng.normal(0, 1, len(tt)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 37 * tt))) * np.exp(-tt * 12))
    return dirpath

# ---------- timeline ----------
def build_timeline(P, base):
    fps, ofps = P.get("fps", 12), P.get("out_fps", 24)
    step = ofps / fps
    tl, shot_index = [], {}
    for sh in P["shots"]:
        files = sorted(glob.glob(os.path.join(base, sh["frames"])))
        if not files: raise SystemExit(f"plan {sh['id']} : aucune image pour {sh['frames']}")
        if "range" in sh: files = files[sh["range"][0]:sh["range"][1]]
        seq = list(range(len(files)))
        if sh.get("pingpong"): seq = seq + seq[-2:0:-1]
        seq = seq * int(sh.get("repeat", 1))
        hold = sh.get("hold", 1); holds = {int(k): v for k, v in sh.get("holds", {}).items()}
        first = {}
        for n, i in enumerate(seq):
            h = holds.get(i, hold) if i not in first else hold
            if n == len(seq) - 1: h = max(h, sh.get("end_hold", h))
            first.setdefault(i, len(tl))
            tl.append({"path": files[i], "n": max(1, int(round(h * step))), "shot": sh, "img": i, "uid": len(tl)})
        shot_index[sh["id"]] = first
    t = 0
    for e in tl: e["t"] = t / ofps; t += e["n"]
    return tl, shot_index, t / ofps

# ---------- traitement image ----------
def luminance_means(tl, window):
    """deflicker + raccord couleur : gain par canal lisse sur une fenetre glissante, par plan"""
    means = {}
    for e in tl:
        if e["path"] not in means:
            im = Image.open(e["path"]).convert("RGB"); im.thumbnail((160, 160))
            means[e["path"]] = np.asarray(im, np.float32).reshape(-1, 3).mean(0)
    gains = {}
    by_shot = {}
    for e in tl: by_shot.setdefault(e["shot"]["id"], []).append(e["path"])
    for sid, paths in by_shot.items():
        uniq = list(dict.fromkeys(paths))
        M = np.array([means[p] for p in uniq])
        if window <= 1 or len(uniq) < 3:
            for p in uniq: gains[p] = np.ones(3, np.float32)
            continue
        k = min(window, len(uniq)); pad = k // 2
        Mp = np.pad(M, ((pad, pad), (0, 0)), mode="edge")
        S = np.array([np.median(Mp[i:i + k], 0) for i in range(len(uniq))])
        for p, m, s in zip(uniq, M, S): gains[p] = np.clip(s / np.maximum(m, 1), 0.82, 1.22)
    return gains

def cover_crop(im, W, H, focus, zoom):
    w, h = im.size; a = W / H
    cw = min(w, h * a) / zoom; ch = cw / a
    cx = min(max(focus[0] * w, cw / 2), w - cw / 2); cy = min(max(focus[1] * h, ch / 2), h - ch / 2)
    box = (int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))
    return im.crop(box).resize((W, H), Image.LANCZOS)

def font(path, size):
    for p in ([path] if path else []) + FONTS:
        if p and os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def wrap(draw, text, fnt, maxw):
    out = []
    for para in text.split("\n"):
        words, line = para.split(), ""
        for w in words:
            test = (line + " " + w).strip()
            if draw.textlength(test, font=fnt) <= maxw or not line: line = test
            else: out.append(line); line = w
        out.append(line)
    return out

def draw_texts(img, texts, t, fmt, uid):
    W, H = img.size; d = ImageDraw.Draw(img)
    top, bot = SAFE.get(fmt, (0.08, 0.1))
    for T in texts:
        if not (T["start"] <= t + 1e-6 < T["end"]): continue
        if "formats" in T and fmt not in T["formats"]: continue
        size = int(T.get("size", 0.06) * min(W, H) * (1.0 if W < H else 0.9))
        fnt = font(T.get("font"), size); sw = max(2, size // 14) if T.get("stroke", "#000000") else 0
        lines = wrap(d, T["text"], fnt, W * 0.84)
        lh = int(size * 1.18); block = lh * len(lines)
        place = T.get("place", "bottom")
        y0 = {"top": H * top, "center": (H - block) / 2, "bottom": H * (1 - bot) - block}[place]
        rng = random.Random(zlib.crc32(f"{uid}|{T['text']}".encode())) if T.get("boil", True) else None
        for i, ln in enumerate(lines):
            jx, jy = (rng.uniform(-2, 2), rng.uniform(-2, 2)) if rng else (0, 0)
            x = (W - d.textlength(ln, font=fnt)) / 2 + jx
            d.text((x, y0 + i * lh + jy), ln, font=fnt, fill=T.get("color", "#FFFFFF"),
                   stroke_width=sw, stroke_fill=T.get("stroke", "#000000") or None)
    return img

# ---------- audio ----------
def build_audio(P, base, tl, shot_index, dur, work):
    A = P.get("audio")
    if not A: return None
    sfx_dir = make_sfx(os.path.join(work, "sfx"))
    inputs, filters, labels = [], [], []
    for s in A.get("sfx", []):
        f = s["file"]; path = os.path.join(sfx_dir, f + ".wav") if os.path.exists(os.path.join(sfx_dir, f + ".wav")) else os.path.join(base, f)
        if "at" in s: at = s["at"]
        else: at = tl[shot_index[s["shot"]][s.get("image", 0)]]["t"]
        at += s.get("offset", 0)
        idx = len(inputs) // 2; inputs += ["-i", path]
        ms = max(0, int(at * 1000))
        filters.append(f"[{idx}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={s.get('gain_db', -4)}dB,adelay={ms}|{ms}[s{idx}]"); labels.append(f"[s{idx}]")
    for key in ("music", "voice"):
        if A.get(key):
            idx = len(inputs) // 2; inputs += ["-i", os.path.join(base, A[key])]
            st = A.get(key + "_start", 0); g = A.get(key + "_gain_db", -14 if key == "music" else 0)
            fo = A.get("fade_out", 1.5) if key == "music" else 0
            chain = f"[{idx}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=start={st},asetpts=PTS-STARTPTS,atrim=0:{dur:.3f},volume={g}dB"
            if fo: chain += f",afade=t=out:st={max(0, dur - fo):.3f}:d={fo}"
            if key == "voice" and A.get("voice_delay"): ms = int(A["voice_delay"] * 1000); chain += f",adelay={ms}|{ms}"
            filters.append(chain + f"[{key}]"); labels.append(f"[{key}]")
    if not labels: return None
    mix = "".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=longest,apad,atrim=0:{dur:.3f},loudnorm=I={A.get('lufs', -14)}:TP=-1.5:LRA=11[out]"
    out = os.path.join(work, "audio.m4a")
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"] + inputs + ["-filter_complex", ";".join(filters + [mix]), "-map", "[out]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", out])
    return out

# ---------- rendu ----------
def render(P, base, tl, gains, fmt, dur, audio, outdir, preview):
    W, H = FORMATS[fmt]
    if preview: W, H = W // 2 // 2 * 2, H // 2 // 2 * 2
    ofps = P.get("out_fps", 24); grain = P.get("grain", 0.0); texts = P.get("texts", [])
    name = P.get("name", "film")
    vtmp = os.path.join(outdir, f".{name}_{fmt}_v.mp4")
    enc = ["-c:v", "libx264", "-preset", "ultrafast" if preview else "medium", "-crf", "26" if preview else "17", "-pix_fmt", "yuv420p"]
    proc = subprocess.Popen(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                             "-s", f"{W}x{H}", "-r", str(ofps), "-i", "-"] + enc + ["-r", str(ofps), vtmp], stdin=subprocess.PIPE)

    @lru_cache(maxsize=96)
    def base_frame(path, focus, zoom):
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")  # photos de telephone : respecter l'orientation
        g = gains.get(path)
        if g is not None and not np.allclose(g, 1):
            im = Image.fromarray(np.clip(np.asarray(im, np.float32) * g, 0, 255).astype(np.uint8))
        return cover_crop(im, W, H, focus, zoom)

    for e in tl:
        sh = e["shot"]
        focus = tuple(sh.get("focus_" + fmt, sh.get("focus", P.get("focus", [0.5, 0.5]))))
        zoom = sh.get("zoom_" + fmt, sh.get("zoom", 1.0))
        img = base_frame(e["path"], focus, zoom).copy()
        if grain > 0:
            rng = np.random.default_rng(e["uid"])
            a = np.asarray(img, np.float32) + rng.normal(0, grain * 255, (H, W, 1)).astype(np.float32)
            img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
        if texts: img = draw_texts(img, texts, e["t"], fmt, e["uid"])
        b = img.tobytes()
        for _ in range(e["n"]): proc.stdin.write(b)
    proc.stdin.close(); proc.wait()
    if proc.returncode: raise SystemExit("encodage video echoue")
    final = os.path.join(outdir, f"{name}_{fmt}{'_preview' if preview else ''}.mp4")
    if audio:
        run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", vtmp, "-i", audio, "-map", "0:v", "-map", "1:a",
             "-c:v", "copy", "-c:a", "copy", "-shortest", "-movflags", "+faststart", final])
        os.remove(vtmp)
    else:
        run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", vtmp, "-c", "copy", "-movflags", "+faststart", final]); os.remove(vtmp)
    # planche contact : 24 vignettes reparties sur toute la duree
    sheet = final.replace(".mp4", "_contact.jpg")
    rate = 24 / max(dur, 0.1)
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", final, "-vf",
         f"fps={rate:.4f},scale={'240' if W < H else '320'}:-1,tile=6x4:padding=4:color=white", "-frames:v", "1", sheet])
    return final, sheet

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project", nargs="?"); ap.add_argument("--preview", action="store_true")
    ap.add_argument("--only"); ap.add_argument("--make-sfx", metavar="DIR")
    a = ap.parse_args()
    if a.make_sfx: print("SFX ->", make_sfx(a.make_sfx)); return
    if not a.project: ap.error("project.json requis")
    P = json.load(open(a.project)); base = os.path.dirname(os.path.abspath(a.project))
    outdir = os.path.join(base, P.get("out", "export")); work = os.path.join(base, ".smwork")
    os.makedirs(outdir, exist_ok=True); os.makedirs(work, exist_ok=True)
    tl, shot_index, dur = build_timeline(P, base)
    uniq = len({e["path"] for e in tl})
    print(f"timeline : {len(tl)} affichages, {uniq} images uniques, duree {dur:.2f} s")
    if P.get("max_duration") and dur > P["max_duration"]: print(f"ATTENTION : duree {dur:.1f}s > max {P['max_duration']}s")
    gains = luminance_means(tl, P.get("deflicker", 5))
    audio = build_audio(P, base, tl, shot_index, dur, work)
    fmts = a.only.split(",") if a.only else P.get("formats", ["9x16", "16x9"])
    if P.get("loop"):
        A = np.asarray(Image.open(tl[0]["path"]).convert("L").resize((64, 64)), np.float32)
        B = np.asarray(Image.open(tl[-1]["path"]).convert("L").resize((64, 64)), np.float32)
        print(f"boucle : ecart derniere/premiere image = {np.abs(A - B).mean():.1f} (viser < 6)")
    for fmt in fmts:
        final, sheet = render(P, base, tl, gains, fmt, dur, audio, outdir, a.preview)
        info = run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_name,width,height,r_frame_rate:format=duration", "-of", "compact", final])
        print(f"[{fmt}] {final}\n  contact : {sheet}\n  {info.strip().replace(chr(10), ' | ')}")

if __name__ == "__main__":
    main()
```