# Animations au scroll Leadvice — méthode « séquence d'images »

La méthode du guide de Cindy Zhu, appliquée au site Leadvice. Pour chaque animation : on génère l'image de départ et l'image d'arrivée, on laisse la vidéo créer tout ce qui se passe entre les deux, on découpe la vidéo en images numérotées, puis Claude Code relie ces images au scroll sur un canvas avec GSAP ScrollTrigger. C'est la technique des pages produit d'Apple : le visiteur fait avancer et reculer l'animation avec son doigt.

Pour tester plusieurs options par animation (trois variantes de plus pour chacune, des styles alternatifs, des prompts de correction et une grille de choix), voir `VARIANTES-VISUELS-LEADVICE.md`. Quelle que soit la variante retenue, le dossier et le code d'intégration restent les mêmes.

Ce fichier va dans le dépôt GitHub, à côté du prompt maître. Les sections 4 et 5 sont pour toi (Flow, ezgif, GitHub). Les sections 6 à 9 sont les messages à coller dans Claude Code.

---

## 1. Les quatre étapes

1. **Deux images dans Flow.** Image de départ, puis image d'arrivée, avec Nano Banana Pro. Les deux prompts sont identiques mot pour mot, sauf la phrase qui décrit ce qui change. C'est ce qui garde le même objet, le même cadrage et la même lumière d'une image à l'autre.
2. **La vidéo entre les deux.** Toujours dans Flow, *Frames to Video* (première + dernière image) avec Veo 3.1 et le prompt de mouvement. Le modèle invente toutes les images intermédiaires.
3. **Le découpage.** ezgif.com/video-to-jpg transforme la vidéo en images numérotées, téléchargées en ZIP.
4. **Claude Code.** Tu déposes le dossier d'images sur GitHub et tu colles le prompt d'intégration. Claude Code écrit le code qui relie le scroll aux images.

---

## 2. Le monde visuel

Les cinq animations appartiennent au même monde, pour que le site ne paraisse pas fait de pièces rapportées : des objets sculptés, comme les images arrêtées d'un film d'animation 3D haut de gamme, ni photo ni dessin animé. Matières mates de porcelaine et de plâtre, finition peinte à la main, léger grain. Palette sourde de blanc porcelaine, gris pierre et graphite, dans un vide violet-noir (#0E0A1F, le fond Deep Space du site). Une seule couleur vive dans chaque image, le violet Leadvice (#301781), réservée à ce qui compte : c'est le « signal » du concept.

Ce paragraphe de style est recopié tel quel dans chaque prompt d'image. Il n'y a aucune image de référence à générer ni à joindre, sauf l'image de départ quand tu crées l'image d'arrivée.

Pourquoi ces choix :
- **Une seule action par animation**, sur fond uni, caméra fixe. Le guide le dit : un sujet simple sur un fond propre donne le résultat le plus net, une scène chargée se déforme.
- **Pas de trait de contour dessiné.** Les modèles vidéo font trembler les contours d'une image à l'autre ; les volumes peints tiennent beaucoup mieux.
- **Le fond violet-noir est le même que celui du site.** Le bord de l'image disparaît dans la page, l'animation semble flotter dans le site.
- **Aucun texte dans les images.** Les modèles déforment les lettres. Tous les mots (AUDIENCE, Prix, Mesurer…) et le logo sont ajoutés par le code, par-dessus.
- **Une zone vide est prévue pour le texte** (à gauche ou en haut selon l'animation).

---

## 3. Les cinq animations

| Dossier | Où sur le site | L'idée | Ce qui change entre les deux images | Zone de texte |
|---|---|---|---|---|
| `funnel` | Ouverture de l'accueil, landing page génération de leads | Le funnel : beaucoup entrent, peu sortent, et ceux qui sortent ont de la valeur | Un nuage de 200 billes grises au-dessus d'un entonnoir de verre → cinq billes violettes dans la coupelle en dessous | tiers gauche |
| `noeud` | Page Stratégie, landing page conseil stratégique | Le nœud de décision qui se résout | Une douzaine de chemins emmêlés sur une île de plâtre → un seul chemin violet jusqu'à une porte éclairée | tiers gauche |
| `phare` | Page Acquisition | Le signal qui s'amplifie et atteint les bonnes personnes | Phare éteint, douze bateaux dans le noir → faisceau violet posé sur trois bateaux | tiers supérieur |
| `prisme` | Page Création | Même offre, autre angle | Un faisceau blanc traverse le prisme sans changer → le prisme a tourné, le faisceau se sépare en trois (violet, lavande, blanc) | tiers supérieur |
| `cadran` | Page Pilotage | Mesurer, ajuster, progresser | Aiguille en bas à gauche → aiguille fixée dans la zone violette, qui s'illumine | tiers gauche |

La dernière image de chaque séquence sert aussi d'illustration fixe sur la page Expertises et dans la scène des quatre leviers de l'accueil. Commence par `funnel` : c'est la première chose que voit un visiteur.

---

## 4. Les prompts

Prompts en anglais : les modèles d'image et de vidéo y répondent mieux. Chacun est complet, tu le copies et tu le colles tel quel.

### 4.1 `funnel` — l'ouverture de l'accueil

**Image de départ**
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A tall sculptural funnel of smoked translucent glass with a porcelain-white rim stands upright slightly right of center, its wide mouth at the top and its narrow spout at the bottom; it fills about half of the frame height. Above the mouth, a loose drifting cloud of about two hundred small matte spheres in porcelain white and stone grey hangs in the air, scattered in no particular order. Below the spout, a small shallow porcelain dish sits empty. The left third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Image d'arrivée** (joins l'image de départ comme référence)
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A tall sculptural funnel of smoked translucent glass with a porcelain-white rim stands upright slightly right of center, its wide mouth at the top and its narrow spout at the bottom; it fills about half of the frame height. Above the mouth, the air is now empty. Inside the glass, a faint luminous violet glow lingers. Below the spout, exactly five small glossy spheres glowing luminous violet rest side by side in the small shallow porcelain dish. The left third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Plan B si l'image d'arrivée ne ressemble pas assez à l'image de départ** (modification de l'image de départ)
```
Edit this image. Change only this: remove the cloud of spheres above the funnel, add a faint luminous violet glow inside the glass, and place exactly five small glossy spheres glowing luminous violet side by side in the dish. Keep the funnel, the dish, the framing, the light, the colors, the textures and the background exactly identical.
```

**Vidéo** (*Frames to Video*, 8 secondes)
```
Scroll-driven website animation, 8 seconds. The video starts exactly on the first frame and ends exactly on the last frame. Camera: locked-off 50mm shot, perfectly still for the whole clip. [00:00-00:03] From the very first frame, the cloud of white and grey spheres is already drifting downward; it pours steadily into the mouth of the glass funnel and swirls slowly as the glass narrows. [00:03-00:06] As they descend, most spheres melt into soft light inside the glass, and the funnel takes on a growing luminous violet glow. [00:06-00:08] Five spheres, now glowing luminous violet, drop one after another from the spout and settle side by side in the dish, the last one landing in the final half second. The motion is smooth and continuous at one steady pace, with no pause and no slow-down. The funnel, the dish, the light and the violet-black background stay exactly the same throughout. The scene keeps the same stylized animated-film look, the same colors and the same light from the first frame to the last, and nothing new enters the frame.
```

### 4.2 `noeud` — le nœud de décision qui se résout (Stratégie)

**Image de départ**
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A small floating island of sculpted stone-grey plaster, round and flat like a tabletop model, is seen from a high three-quarter angle slightly right of center and fills about half of the frame width. Its top surface is covered by about a dozen narrow porcelain-white paths that wind, loop and cross each other in a dense tangle, like a knot drawn on the ground. On the far edge of the island stands a small doorway of pale stone, dark inside. The left third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Image d'arrivée** (joins l'image de départ comme référence)
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A small floating island of sculpted stone-grey plaster, round and flat like a tabletop model, is seen from a high three-quarter angle slightly right of center and fills about half of the frame width. Its top surface now carries a single narrow path that runs in one clean, gentle curve from the near edge to the doorway, glowing luminous violet; the other paths have sunk into the plaster, leaving only faint grooves. On the far edge of the island stands the same small doorway of pale stone, now filled with soft luminous violet light. The left third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Plan B**
```
Edit this image. Change only this: keep a single path that runs in one clean, gentle curve from the near edge of the island to the doorway and make it glow luminous violet; let all the other paths sink into the plaster, leaving only faint grooves; fill the doorway with soft luminous violet light. Keep the island, its shape, the doorway, the framing, the light, the colors, the textures and the background exactly identical.
```

**Vidéo** (8 secondes)
```
Scroll-driven website animation, 8 seconds. The video starts exactly on the first frame and ends exactly on the last frame. Camera: locked-off 50mm shot from a high three-quarter angle, perfectly still for the whole clip. [00:00-00:03] From the very first frame, the tangle of white paths is already fading: one after another, starting from the outer edges, the paths sink smoothly into the plaster like ink drying, leaving faint grooves. [00:03-00:06] One path remains; it settles into a single clean curve toward the doorway, and a luminous violet glow travels along it from the near edge to the door. [00:06-00:08] Soft violet light rises inside the doorway and is still growing in the final second. The motion is smooth and continuous at one steady pace, with no pause and no slow-down. The island stays exactly in place without moving or rotating; the doorway, the light and the violet-black background stay exactly the same throughout. The scene keeps the same stylized animated-film look, the same colors and the same light from the first frame to the last, and nothing new enters the frame.
```

### 4.3 `phare` — le signal qui s'amplifie (Acquisition)

**Image de départ**
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A small sculpted lighthouse in porcelain-white plaster with a graphite lantern room stands on a rounded rock in the left part of the frame and rises to about half of the frame height. Around it spreads a calm sea of smooth matte graphite with gently sculpted waves, frozen like a carved surface, which fades into the void toward the horizon. The lantern is dark, holding only a tiny luminous violet spark. Scattered across the sea in the center and on the right, about a dozen small porcelain-white boats, all identical and simple like folded paper, sit still in the dark. The upper third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Image d'arrivée** (joins l'image de départ comme référence)
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A small sculpted lighthouse in porcelain-white plaster with a graphite lantern room stands on a rounded rock in the left part of the frame and rises to about half of the frame height. Around it spreads a calm sea of smooth matte graphite with gently sculpted waves, frozen like a carved surface, which fades into the void toward the horizon. The lantern is now lit: a strong, clean beam of luminous violet light shines out to the right across the sea. Scattered across the sea in the center and on the right, about a dozen small porcelain-white boats, all identical and simple like folded paper, sit still; the beam rests on three of them, which now glow softly violet, while the others remain in the dark. The upper third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Plan B**
```
Edit this image. Change only this: light the lantern so that a strong, clean beam of luminous violet light shines out to the right across the sea and rests on three of the boats, which glow softly violet; the other boats stay in the dark. Keep the lighthouse, the rock, the sea, every boat in its exact place, the framing, the colors, the textures and the background exactly identical.
```

**Vidéo** (8 secondes)
```
Scroll-driven website animation, 8 seconds. The video starts exactly on the first frame and ends exactly on the last frame. Camera: locked-off 50mm shot, perfectly still for the whole clip. [00:00-00:02] From the very first frame, the violet spark in the lantern is already brightening, and the lamp ignites. [00:02-00:06] A beam of luminous violet light grows out of the lantern and sweeps slowly to the right across the sea, gaining length and intensity as it travels. [00:06-00:08] The beam comes to rest on three boats, which take on a soft violet glow that is still brightening in the final second; the other boats stay dark. Only the light changes: the lighthouse, the rock, the boats and the carved sea stay perfectly still. The motion is smooth and continuous at one steady pace, with no pause and no slow-down. The scene keeps the same stylized animated-film look, the same colors and the violet-black background from the first frame to the last, and nothing new enters the frame.
```

### 4.4 `prisme` — même offre, autre angle (Création)

**Image de départ**
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A triangular prism of flawless clear glass stands upright on a small porcelain-white plinth in the center of the frame, with one flat face turned straight toward the camera. A single thin beam of warm white light enters from the left edge of the frame at mid-height, passes straight through the prism and leaves on the right as the same single white beam, fading into the void. The upper third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Image d'arrivée** (joins l'image de départ comme référence)
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A triangular prism of flawless clear glass stands upright on a small porcelain-white plinth in the center of the frame, now turned thirty degrees on its vertical axis. A single thin beam of warm white light enters from the left edge of the frame at mid-height and, after passing through the prism, splits into three distinct, sharp beams that fan out to the right: one luminous violet, one soft lavender and one warm white, each fading into the void. The upper third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Plan B**
```
Edit this image. Change only this: turn the prism thirty degrees on its vertical axis, and make the beam split after the prism into three distinct, sharp beams fanning out to the right: one luminous violet, one soft lavender and one warm white. Keep the plinth, the incoming white beam from the left, the framing, the light, the colors, the textures and the background exactly identical.
```

**Vidéo** (8 secondes)
```
Scroll-driven website animation, 8 seconds. The video starts exactly on the first frame and ends exactly on the last frame. Camera: locked-off 50mm shot, perfectly still for the whole clip. [00:00-00:05] From the very first frame, the prism is already turning slowly on its vertical axis, at a steady speed, on its plinth. [00:02-00:07] As it turns, the beam leaving the prism bends and gradually separates into three distinct beams, luminous violet, soft lavender and warm white, which open into a clean fan. [00:07-00:08] The prism completes its thirty-degree turn as the three beams reach full brightness. The light source on the left, the plinth and the violet-black background stay perfectly still; only the prism turns and the light changes. The motion is smooth and continuous at one steady pace, with no pause and no slow-down. The scene keeps the same stylized animated-film look, the same colors and the same light from the first frame to the last, and nothing new enters the frame.
```

### 4.5 `cadran` — mesurer, ajuster, progresser (Pilotage)

**Image de départ**
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A large round measuring dial sculpted in porcelain-white plaster, like the gauge of a precision instrument, faces the camera slightly right of center inside a graphite ring and fills about half of the frame height. Its scale is a smooth arc of evenly spaced tick marks; the last fifth of the arc, at the upper right, is inlaid in luminous violet. A fine graphite needle, pivoting from the center, points low on the left of the scale. The left third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Image d'arrivée** (joins l'image de départ comme référence)
```
Key frame for a scroll-driven website animation for a strategy and marketing consulting firm. A large round measuring dial sculpted in porcelain-white plaster, like the gauge of a precision instrument, faces the camera slightly right of center inside a graphite ring and fills about half of the frame height. Its scale is a smooth arc of evenly spaced tick marks; the last fifth of the arc, at the upper right, is inlaid in luminous violet, and the violet inlay now glows softly. A fine graphite needle, pivoting from the center, now points high on the right of the scale, resting inside the luminous violet section. The left third of the frame is empty space. Style: a still from a premium stylized 3D animated film. Simplified sculpted shapes with softly rounded edges; smooth matte surfaces like painted porcelain and fine plaster, with a delicate hand-painted finish and soft painted gradients in the shading; a whisper of film grain. Neither photorealistic nor cartoonish: calm, adult, editorial. Muted palette of warm porcelain white, soft stone grey and graphite. The scene floats in a seamless, perfectly even deep violet-black void (#0E0A1F); wherever the scene ends, it fades softly into that void. One single saturated accent, a luminous electric violet (#7B61FF) with a deeper violet core (#301781), softly glowing as if lit from within, is reserved for the element that matters. Soft key light from the upper left, a faint violet rim light from behind, long soft shadows. Locked-off camera, 50mm lens, perfectly level. Ultra sharp, high detail. All surfaces are plain, with no lettering, numbers or logos anywhere. Landscape 16:9.
```

**Plan B**
```
Edit this image. Change only this: move the needle so that it points high on the right of the scale, resting inside the luminous violet section, and make the violet inlay glow softly. Keep the dial, the ring, the tick marks, the framing, the light, the colors, the textures and the background exactly identical.
```

**Vidéo** (8 secondes)
```
Scroll-driven website animation, 8 seconds. The video starts exactly on the first frame and ends exactly on the last frame. Camera: locked-off 50mm shot, perfectly still for the whole clip. [00:00-00:03] From the very first frame, the needle is already rising from the low left of the scale; it overshoots a little, then swings back slightly, as if being adjusted. [00:03-00:06] It rises again, steadier this time, toward the upper right. [00:06-00:08] It enters the violet section and settles there while the violet inlay begins to glow, the glow still growing in the final second. The needle moves smoothly and continuously, without stopping. Only the needle moves and the light changes; the dial, the ring, the tick marks and the violet-black background stay perfectly still. The scene keeps the same stylized animated-film look, the same colors and the same light from the first frame to the last, and nothing new enters the frame.
```

---

## 5. La fabrication, pas à pas

Flow demande un abonnement Google AI payant. Les offres gratuites d'autres outils (Dreamina, Vidu) sont réservées à un usage non commercial : pour le site de Leadvice, il faut un plan payant, quel que soit l'outil.

1. **Image de départ.** Sur labs.google/fx/tools/flow, crée un projet « Leadvice ». Choisis la génération d'image avec Nano Banana Pro, format 16:9. Colle le prompt « Image de départ ». Génère plusieurs propositions et ne passe à la suite que lorsque l'une d'elles te plaît vraiment : tout le reste en dépend.
2. **Image d'arrivée.** Ajoute l'image de départ retenue comme image de référence (le bouton d'ajout d'image à côté du champ de prompt) et colle le prompt « Image d'arrivée ». Mets les deux images côte à côte : seul ce qui est censé changer doit avoir changé. Si l'objet, le cadrage ou la lumière ont bougé, régénère, ou utilise le « Plan B » sur l'image de départ. Recommencer ici ne coûte presque rien ; une vidéo ratée coûte des crédits.
3. **Vidéo.** Dans Flow, *Frames to Video* : l'image de départ en première image, l'image d'arrivée en dernière, format 16:9, 8 secondes. Colle le prompt « Vidéo ». Fais un premier essai avec Veo 3.1 Fast, puis la version finale avec Veo 3.1 Quality. Génère deux ou trois versions et garde la plus propre. Pour juger, fais glisser le curseur du lecteur à la main, d'avant en arrière, au lieu de la regarder en lecture normale : c'est comme ça que le visiteur la verra au scroll. Télécharge la vidéo en MP4, à la meilleure résolution proposée.
4. **Découpage.** Sur ezgif.com/video-to-jpg, charge la vidéo, choisis *Video to JPG (image sequence)* avec une fréquence de **12 images par seconde** (8 secondes × 12 = 96 images), convertis, puis *Download frames as ZIP*. Dézippe sans renommer les fichiers : c'est leur numérotation qui sert au code. Si ta vidéo ne dure pas 8 secondes, divise 96 par sa durée pour trouver la fréquence. Pourquoi 96 images et pas les 240 du guide : GitHub n'accepte pas plus de 100 fichiers par envoi depuis le navigateur, et 96 images suffisent pour un défilement fluide sur une section de deux écrans et demi.
5. **Dépôt sur GitHub.** Sur ton ordinateur, renomme le dossier dézippé avec le nom de la séquence (`funnel`, `noeud`, `phare`, `prisme` ou `cadran`). Range-le dans un dossier `sequences`, lui-même dans un dossier `sources`. Sur la page du dépôt `leadvice-site` : *Add file → Upload files*, glisse le dossier `sources` entier, puis *Commit changes*. Les images arrivent dans `sources/sequences/funnel/`. Pour les séquences suivantes, même chose : GitHub ajoute le nouveau dossier à côté des autres.
6. **Claude Code.** La première fois, colle le prompt d'intégration (section 6), puis le prompt de l'ouverture (section 7). Pour les séquences suivantes, il suffit d'écrire : « J'ai ajouté sources/sequences/phare/. Relance le pipeline et intègre-la comme prévu. »

---

## 6. Prompt d'intégration pour Claude Code

À coller tel quel dans claude.ai/code, dans le dépôt `leadvice-site`.

```
Lis ANIMATIONS-SCROLL-LEADVICE.md (sections 3 et 6) et les sections 3, 4.3, 4.4 et 5.2 de PROMPT-MAITRE-LEADVICE.md. Le dossier sources/sequences/ contient des images numérotées extraites de vidéos IA, un sous-dossier par séquence : funnel, noeud, phare, prisme, cadran (certains peuvent manquer pour l'instant). Construis des séquences d'images liées au scroll sur canvas, la technique des pages produit d'Apple.

1. Pipeline d'images. Crée scripts/build-sequences.mjs (avec sharp), lancé avant chaque build (script npm « prebuild »). Pour chaque sous-dossier : lis-le pour trouver le motif de nommage exact et le nombre réel d'images, sans rien supposer ; trie numériquement ; retire les images quasi identiques consécutives au tout début et à la toute fin. Génère public/sequences/<nom>/d/0001.webp… en 1600 px de large (qualité 70) et public/sequences/<nom>/m/0001.webp… en 900 px avec une image sur deux. Écris un manifest.json par séquence : nombre d'images desktop et mobile, dimensions, couleur moyenne des bords de la première et de la dernière image, point focal du sujet en pourcentage (regarde les images pour le déterminer), position de l'élément violet final en pourcentage, et zone de texte d'après le tableau de la section 3 d'ANIMATIONS-SCROLL-LEADVICE.md. Budget : 2,5 Mo maximum par séquence en desktop et 0,9 Mo en mobile ; s'il est dépassé, baisse la qualité jusqu'à 60, puis retire une image sur trois, et dis-le dans ton rapport. Le dossier sources/ n'est jamais publié. Regarde la première, la médiane et la dernière image de chaque séquence et signale-moi tout défaut visible : objet déformé, texte apparu, changement de style.

2. Composant ScrollSequence.astro. Une section avec un canvas, épinglée avec GSAP ScrollTrigger, scrub: 1, pour que les images avancent et reculent exactement avec le scroll. Hauteur proportionnelle au nombre d'images (environ 2,5 vh par image), bornée entre 150 et 250 vh. Canvas adapté aux écrans haute densité (devicePixelRatio plafonné à 2). Desktop : image en cover, centrée sur le point focal. Mobile vertical : image mise à l'échelle autour du point focal pour que le sujet occupe environ 90 % de la largeur, sans couper les éléments clés ; le fond uni de l'image se fond dans la couleur de la section. Fond de la section = couleur des bords lue dans le manifest, avec une vignette radiale sur les bords du canvas pour qu'aucune limite d'image ne se voie. Chargement : la première image est dessinée dès qu'elle arrive (jamais de canvas vide) ; les autres se chargent par lots (une image sur huit, puis sur quatre, puis sur deux, puis toutes) quand la section est à moins d'un écran et demi ; tant qu'une image manque, dessine la plus proche déjà chargée ; décode avec createImageBitmap. Pour la séquence de l'accueil, les lots ne commencent qu'à la première interaction (scroll, toucher, souris, clavier) ou après 3 secondes d'inactivité. Rendu suspendu hors écran et quand l'onglet est caché. GSAP chargé uniquement sur les pages qui ont une séquence, après le premier rendu. Calques de texte HTML synchronisés à la progression : steps = [{ from, to, contenu }], placés dans la zone de texte du manifest sur desktop et dans le tiers supérieur sur mobile, contraste AA garanti (léger dégradé derrière le texte si nécessaire). Les textes sont dans le DOM ; le canvas est aria-hidden. Une seule prop obligatoire : le nom de la séquence.

3. La trajectoire. Chaque séquence se termine sur un élément violet (les cinq billes, le chemin, le faisceau, les trois faisceaux, la zone du cadran). À la fin de la séquence, une ligne SVG fine du même violet part de cet élément (position lue dans le manifest) et se dessine avec stroke-dashoffset vers le contenu suivant. Le logo Leadvice n'est jamais tiré des images IA.

4. Repli. Avec prefers-reduced-motion ou sans JavaScript : la dernière image en <img> statique (dimensions explicites, aucun décalage de mise en page), puis tous les textes de la séquence empilés lisiblement. Si un sous-dossier n'existe pas encore, la scène affiche sa version codée : pour l'accueil, celle de la section 4.3 du prompt maître ; pour les autres, un dessin SVG au trait du même objet (entonnoir, île aux chemins, phare, prisme, cadran) animé au scroll avec stroke-dashoffset. Elle bascule sur la séquence dès que le dossier est ajouté.

5. Emplacements et textes (progression de 0 à 1) :
- funnel, ouverture de l'accueil (scènes 1, 2 et 4) : mets la séquence en place avec le bloc H1 visible au chargement ; le déroulé détaillé viendra avec le prompt de l'ouverture.
- funnel, /lp/generation-de-leads/ : 0-0,3 « Beaucoup de contacts. Peu de clients. » ; les étapes AUDIENCE, INTENTION, LEAD, OPPORTUNITÉ, CLIENT s'allument à 0,35 / 0,5 / 0,65 / 0,8 / 0,9 ; fin : « Nous trouvons les bons prospects. », puis « +10 893 prospects générés » et « moins de 1 $ : coût moyen par lead constaté sur nos clients (Meta Ads) », puis le bouton qui fait défiler jusqu'au formulaire de la page.
- noeud, /expertises/strategie/ et /lp/conseil-strategique/ : 0-0,4 « Trop d'options. Trop d'avis. Trop de priorités. » ; 0,6-1 « Une direction claire. »
- phare, /expertises/acquisition/ : 0-0,4 « Parler à tout le monde, c'est ne parler à personne. » ; 0,6-0,9 « Le bon message, devant les bonnes personnes. » ; fin : « Moins de 1 $ par lead sur Meta Ads, 1 à 2 $ sur Google Ads : coût moyen constaté sur nos clients. »
- prisme, /expertises/creation/ : 0-0,45 « Même offre. » ; 0,5-0,85 « Autre angle. » ; à 0,85, les mots Prix, Confort et Investissement apparaissent au bout des trois faisceaux ; fin : « Le problème n'est pas toujours l'offre. C'est parfois l'angle. »
- cadran, /expertises/pilotage/ : Mesurer à 0,25, Comprendre à 0,5, Ajuster à 0,75 ; fin : « Un système qui apprend. »
Sur chaque page levier, la séquence vient juste après le H1 et la réponse directe, en pleine largeur. Sur /expertises/ et dans la scène des quatre leviers de l'accueil, chaque levier est illustré par la dernière image de sa séquence (WebP statique, chargé en lazy). Aucun chiffre en dehors de la section 2.4 du prompt maître.

6. /dev/animations/ : toutes les séquences présentes, avec leur nom, leur nombre d'images et leur poids réel transféré, pour que je puisse juger.

7. Vérifie avant de me rendre la main : défilement fluide en avant et en arrière sans saut ; aucun canvas vide, même en connexion lente (teste avec un ralentissement réseau) ; aucun décalage de mise en page ; contraste des textes ; raccord propre entre l'élément violet de l'image et la ligne SVG ; Lighthouse mobile conforme à la section 5.2 sur chaque page qui porte une séquence. Donne-moi des captures à 390, 768 et 1440 px ou un lien de prévisualisation, et explique en trois lignes comment remplacer une séquence plus tard.

Avant de coder, présente ton plan en quelques lignes et attends mon accord.
```

---

## 7. Prompt Claude Code pour l'ouverture de l'accueil (le funnel)

À envoyer une fois le prompt d'intégration terminé et le dossier `funnel` déposé.

```
Travaillons l'ouverture de l'accueil avec la séquence funnel. Relis les sections 2.4, 3.3, 3.4 et 4.3 de PROMPT-MAITRE-LEADVICE.md.

1. Rendu initial, avant toute animation : le bloc H1 de la section 4.3 en HTML dans le tiers gauche (sur-titre, H1 en Instrument Serif, sous-texte, bouton « Demander un diagnostic »), la première image de la séquence derrière. Le H1 reste l'élément LCP : rien ne le retarde.

2. Pendant le scroll (progression de 0 à 1) :
- 0-0,08 : le bloc H1 s'efface doucement ; il reste dans le DOM.
- 0,08-0,28 : « Tout commence par comprendre. »
- 0,10-0,35 : la lentille. Sur desktop, un calque avec backdrop-filter: blur(6px) couvre le nuage de billes, avec un trou net de 180 px de diamètre qui suit le curseur (mask radial-gradient). Sur mobile, la zone nette suit la progression du scroll. Le calque disparaît en fondu avant 0,35.
- 0,28-0,48 : « Le problème n'est pas le manque de données. » puis « C'est de savoir lesquelles comptent. »
- 0,40-0,90 : un rail discret de cinq étapes à droite de l'entonnoir sur desktop : AUDIENCE, INTENTION, LEAD, OPPORTUNITÉ, CLIENT. Chaque étape s'allume quand les billes atteignent la hauteur correspondante dans l'image ; repère ces hauteurs en regardant les images et range-les en pourcentage dans src/data/funnel-anchors.ts, pour qu'un changement de séquence ne demande qu'une mise à jour de ce fichier. Les étapes passées restent visibles, atténuées. Sur mobile, cinq pastilles sous l'image.
- 0,80-0,95 : « Trouver le signal. » puis « Lui donner une direction. »
- 0,95-1 : une ligne SVG violette part des cinq billes violettes, traverse l'écran et dessine le L du logo Leadvice ; le logo complet apparaît, puis « Conseil stratégique & marketing ».

3. Après la séquence, la scène 5 (Angle) commence sans rupture : même fond, la ligne SVG continue.

4. Repli (prefers-reduced-motion ou sans JavaScript) : la dernière image, le bloc H1, les phrases et les cinq étapes listées dans l'ordre, puis le logo.

5. Sans séquence (dossier funnel absent) : la version codée des scènes 1 à 4 décrite en section 4.3 du prompt maître.

6. Vérifie : LCP inférieur à 2 s en mobile 4G simulée, défilement fluide dans les deux sens, rail aligné avec l'image à toutes les largeurs, contraste AA. Captures à 390, 768 et 1440 px.

Présente ton plan en quelques lignes et attends mon accord.
```

---

## 8. Les quatre problèmes habituels

Remplace `funnel` par le nom de la séquence concernée.

**Canvas vide** : presque toujours le nommage des fichiers.
```
La séquence funnel ne s'affiche pas. Ouvre sources/sequences/funnel/, vérifie le motif exact des noms de fichiers (numéros avec ou sans zéros devant, nom de la première et de la dernière image), corrige le script et le manifest, puis relance le pipeline.
```

**Premier chargement lent** : trop d'images trop lourdes.
```
La séquence funnel est trop lourde. Mesure le poids transféré, redimensionne les images à la largeur réellement affichée et baisse la qualité ou le nombre d'images jusqu'à tenir 2,5 Mo en desktop et 0,9 Mo en mobile. Relance Lighthouse mobile.
```

**Mouvement saccadé** : trop peu d'images ou scrub désactivé.
```
Le défilement de la séquence funnel est saccadé. Vérifie que scrub vaut 1 et non true, que les images du lot visible sont chargées avant d'être dessinées, et que la hauteur de la section est proportionnelle au nombre d'images.
```

**Objet qui se déforme** : ça vient de la vidéo, pas du code. Régénère la vidéo deux ou trois fois et garde la plus propre ; si ça persiste, vérifie que tes deux images clés sont vraiment identiques en dehors de ce qui change. Redécoupe dans ezgif, remplace le dossier sur GitHub, puis :
```
J'ai remplacé les images de sources/sequences/funnel/. Relance le pipeline et vérifie la séquence.
```

---

## 9. Trois prompts bonus, une fois les séquences en place

**La profondeur sur les quatre leviers de l'accueil**
```
Sur l'accueil, dans la scène des quatre leviers, donne de la profondeur à chaque rangée : un calque de fond (halo violet radial très doux), un calque intermédiaire (la dernière image de la séquence du levier) et le titre du levier, qui bougent à des vitesses légèrement différentes au scroll. GSAP ScrollTrigger, décalages discrets de 40 px maximum par calque, parce qu'une parallaxe forte fait bon marché. Sur mobile, les calques s'empilent proprement et le titre ne chevauche jamais l'image, quelle que soit la largeur. Avec prefers-reduced-motion, aucun décalage.
```

**Le défilement épinglé de l'étude de cas Kettani**
```
Sur /realisations/kettani-immobilier/, construis une section à défilement épinglé : à droite, un visuel reste fixe (une ligne SVG violette qui change de forme à chaque bloc : sept points pour les sept programmes, puis un entonnoir, puis une trajectoire montante) pendant qu'à gauche défilent les six blocs de l'étude (contexte, problème, angle, exécution, résultats, enseignements). Chaque bloc passe en pleine opacité quand il devient actif. GSAP ScrollTrigger pour l'épinglage et l'état actif ; l'épinglage se relâche proprement après le dernier bloc, sans saut. Sur mobile, une seule colonne avec le visuel au-dessus du texte, rien ne se chevauche, tout reste lisible à 390 px. Avec prefers-reduced-motion, pas d'épinglage.
```

**Le survol des cartes**
```
Ajoute une animation au survol sur les cartes de /realisations/, de /insights/ et des quatre leviers : la carte se soulève légèrement, un halo violet doux grandit dessous, l'image grossit un peu dans son cadre sans en sortir (le logo client passe du monochrome à ses couleurs), et le lien (« Voir le cas → », « Lire → », « Découvrir → ») apparaît en fondu par le bas. GSAP pour le timing, souple et sans rebond, transition complète en moins de 300 ms. Avec prefers-reduced-motion, seul le halo change. Sur écran tactile, un état au toucher remplace le survol pour qu'aucune carte ne reste bloquée à mi-animation.
```

---

## 10. Pour en tirer le meilleur

- **Verrouille les deux images avant de faire la vidéo.** Tout l'effet repose sur elles. Si elles ressemblent à deux objets différents, la vidéo entre les deux sera floue et molle.
- **Plus d'images, c'est plus fluide mais plus lourd.** 96 images par séquence, c'est l'équilibre pour ce site. Si c'est trop lourd, Claude Code compresse ; ne conclus pas trop vite que l'effet est raté.
- **Colle les prompts tels qu'ils sont écrits.** Tu n'as pas besoin de lire le code : dépose le dossier, colle le prompt, demande une capture ou un lien de prévisualisation.
- **Ce que l'IA fait mal.** Les images générées peuvent dériver d'une image à l'autre : un reflet qui clignote, un bord qui tremble, un objet qui se tord. C'est pour ça que chaque animation ne fait qu'une seule chose sur un fond uni. Une séquence courte et propre vaut mieux qu'une longue qui tremble.
