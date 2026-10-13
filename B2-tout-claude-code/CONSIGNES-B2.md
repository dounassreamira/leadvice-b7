# Consignes B2 : le site entièrement dessiné par Claude Code

Lis d'abord `PROMPT-MAITRE-LEADVICE.md`. Ces consignes le priment pour la version B2.

## La règle

Aucune image ni vidéo générée par un outil externe (Gemini, Flow, Veo, Midjourney ou autre), aucune photo de banque d'images. Tout ce qui est visuel est écrit en code dans le dépôt : canvas 2D, SVG, CSS. Seuls fichiers externes autorisés : les logos clients de `assets-wix/`, les polices libres, et les portraits réels des fondatrices si Amira les fournit (sinon, monogrammes en arche comme dans le prototype). Ignore `PROMPTS-VISUELS-SITE-CLAIR.md`, `ANIMATIONS-SCROLL-LEADVICE.md` (sauf la section sur les budgets) et `VARIANTES-VISUELS-LEADVICE.md`.

## Ce qui remplace chaque visuel

| Emplacement | En B2 |
|---|---|
| Ouverture de l'accueil | Scène `signal` du prototype |
| Nuage de clients | Sphères dessinées en canvas, avec reflet et ombre, logos réels posés dessus (déjà dans le prototype) |
| « Même offre. Trois histoires. » (salle de sport) | Trois illustrations SVG plein cadre, une par angle, l'accroche en Instrument Serif par-dessus (référence : `prototype/extras.js`, tableau `ADV`). Prix, fond violet : la carte d'abonnement « = » une tasse de café qui fume. Temps, fond vert sauge : le bureau, un chemin en pointillés de deux rues, la salle, et un chronomètre dont l'arc se remplit jusqu'à 45 à l'entrée dans l'écran. Encadrement, fond graphite éclairé : un membre qui soulève une barre, son coach en violet avec sa fiche, une bulle avec une coche qui apparaît. Figurines simples sans visage, aucune photo |
| Le chemin d'un dirham, simulateur | Scène `money` |
| Stratégie, Création, Acquisition, Pilotage, Sites web | Scènes `knot`, `angles`, `target`, `dial`, `page` |
| Expertises | Scène `loop` |
| Arches des pages Expertises | Dernier état de la scène du levier, exporté en SVG statique et recadré en arche |
| Couvertures des articles | Composition SVG générée au build à partir du slug : un motif par catégorie (Stratégie : nœud qui se résout, Acquisition : faisceau, Création : prisme de trois cartes, Business : courbe), positions et proportions tirées d'une graine dérivée du slug, donc chaque article a sa couverture, toujours la même |
| Hauts de pages sans scène | Champ de points qui s'organise lentement en une forme liée à la page (grille pour Réalisations, deux trajectoires qui se rejoignent pour le Cabinet), en canvas léger, arrêté hors écran |
| Étude de cas | Couverture typographique SVG : les trois angles de la campagne en grand, le retenu en violet |
| Images de partage | Générées au build (Satori ou `astro-og-canvas`) : titre de la page en Instrument Serif sur papier, ligne violette, logo |
| 404 | Scène `lost` |

## Les améliorations que B2 doit apporter

Sans images générées, la qualité vient du dessin et du mouvement. Pousse le prototype plus loin, en restant dans les budgets de performance :

1. **Matière.** Un grain papier très léger (bruit généré une fois en canvas, réutilisé), des ombres de contact douces sous les objets dessinés, des dégradés radiaux qui imitent la lumière venue d'en haut à gauche. Le rendu doit évoquer la porcelaine mate décrite dans les prompts, sans aucun fichier image.
2. **Profondeur.** Deux ou trois plans par scène, avec une parallaxe de quelques pixels au mouvement du curseur sur ordinateur (désactivée au tactile et en mouvement réduit).
3. **Fil conducteur.** Il continue d'une page à l'autre grâce aux View Transitions : la tête lumineuse quitte le bas de la page et réapparaît en haut de la suivante. Aux scènes, la ligne s'épaissit légèrement et passe derrière les objets.
4. **États finaux.** Chaque scène exporte son dernier état en SVG au build : c'est ce qui s'affiche sans JavaScript, en mouvement réduit et comme vignette.
5. **Cartes publicitaires vivantes.** Dans l'exemple salle de sport, les trois cartes réagissent au survol (l'accroche se révèle, le public visé s'allume), comme dans la scène Création.
6. **Pas de copie.** Aucune forme, illustration ou animation reprise d'un site de référence.

## Contrôle

Le rapport de chaque phase confirme : aucun fichier image ou vidéo hors logos, polices et portraits fournis (`find dist -name "*.jpg" -o -name "*.png" -o -name "*.webp" -o -name "*.mp4"` ne liste que ceux-là), budgets Lighthouse respectés, captures à 390 et 1440 px.
