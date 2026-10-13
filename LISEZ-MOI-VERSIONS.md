# Les versions à construire et à comparer : B1 à B7, et D

Toutes partent de la même base, qui contient les corrections d'octobre : diagnostic de 45 minutes, pas de question de budget, créneaux par matin et après-midi, page Sites web, menu Expertises, défilement en haut de page, pages légales, 404 animée, nouvelles scènes Création et Acquisition, fil conducteur dans la marge, bouton de réservation, fil d'Ariane fixé, articles Insights complets, manifeste du Cabinet sans « maintenir pour révéler ». Chaque zip contient aussi le skill site-web-premium (`.claude/skills/`), que Claude Code applique pendant la construction.

| | Visuels | Ce qui la distingue |
|---|---|---|
| **B1** | Vos images et vidéos Flow | Séquences d'images au défilement quand elles sont déposées, scène codée sinon |
| **B2** | Tout dessiné par Claude Code | Aucune génération externe : canvas, SVG, CSS |
| **B3** | Comme B2 | Toutes les animations en vraie 3D (Three.js), chargées en même temps que le texte |
| **B4** | Comme B1 | B1 avec le skill appliqué en entier |
| **B5** | Tout dessiné par Claude Code | B2 avec le skill appliqué en entier, revue en octobre avec les skills Impeccable, Taste et ECC : nouvelle police de titre, ouverture resserrée, signes de site généré retirés |
| **B6** | Tout dessiné par Claude Code | B5 avec la nouvelle identité Leadvice : violet de marque, encre violette au lieu du noir, violet d'action, jaune signal pour les résultats, Schibsted Grotesk et Literata, trait de progression. Détail dans `B6-identite/CONSIGNES-B6.md` |
| **B7** | Tout dessiné par Claude Code | B6 plus un menu Ateliers (piloter une campagne, construire une page qui convertit, 10 à 15 minutes chacun) et deux scènes sur la page Acquisition. Détail dans `B7-ateliers/CONSIGNES-B7.md` |
| **D** | Tout dessiné par Claude Code | Le tableau blanc : le contenu de B7 mis en scène comme une séance de travail, entonnoir dessiné au marqueur, post-its à coller, manuscrit pour les intertitres et les chiffres. Détail dans `D-tableau-blanc/CONSIGNES-D.md` |
| **Profondeur** (ancienne B6) | Tout en code, en 3D | Une seule scène 3D derrière tout le site, le contenu posé sur des plans. Détail dans `B6-bibliotheques/CONSIGNES-B6.md` ; zip `leadvice-Profondeur.zip` |

« Le skill appliqué en entier » ajoute ce que B1 et B2 n'avaient pas encore : page de contrôle du design, mode sombre au choix du visiteur, recherche, bandeau cookies conforme, retour en haut, styles d'impression, données structurées, audit chiffré à chaque phase (Lighthouse, accessibilité, liens, captures). Le détail est dans `AUDIT-SKILL.md`. Ces ajouts peuvent aussi être appliqués à B3 si la 3D l'emporte.

## Comment lancer chaque version dans Claude Code

Un zip par version, décompressé dans son propre dossier. Ouvrez Claude Code dans ce dossier et écrivez : « Lis CLAUDE.md, puis commence la phase 0. » Le fichier CLAUDE.md de chaque dossier dit quelle version construire et dans quel ordre lire les consignes. Pour B1 et B4, déposez d'abord vos visuels dans `sources/` en suivant `B1-avec-visuels/NOMMAGE-VISUELS.md`.

Chaque zip contient dans `prototype/` l'aperçu de sa version (pour B3 : `prototype-b3/`). Les consignes de chaque version priment sur le prompt maître quand elles le contredisent ; pour tout le reste, le prompt maître fait foi.

## Comment les comparer honnêtement

- Un projet Cloudflare Pages par version (gratuit) : `b1.leadvice.org`, `b2.leadvice.org`, etc. Tous en `noindex` avec une balise canonique vers `leadvice.org`, pour que Google ne voie pas plusieurs sites identiques.
- Même formulaire et même agenda partout, avec un paramètre `version=b1` à `c` enregistré avec chaque réservation : l'admin les distingue.
- Même campagne Meta, budget partagé à parts égales entre des annonces identiques qui pointent chacune vers une version, pendant deux à trois semaines. Avec six versions, le trafic est dilué : commencez par deux ou trois (par exemple B5 et B7), puis départagez les finalistes.
- À comparer : taux de réservation du diagnostic (le chiffre qui décide), profondeur de défilement, temps passé sur l'accueil, score Lighthouse mobile, et votre avis sur le rendu. Pour B3 et Profondeur, testez aussi la fluidité sur un téléphone d'entrée de gamme.
- La version gagnante passe sur `leadvice.org` ; les autres sont archivées, pas supprimées.

## Modifier le site après la mise en ligne

- Articles Insights, textes des sections, FAQ, chiffres, logos, fondatrices, réglages du simulateur : depuis Pages CMS, une interface web, sans toucher au code (prompt maître, section 5.8).
- Disponibilités du diagnostic et rendez-vous : depuis l'admin `/admin/` du site (section 5.6 bis), protégée par connexion.


## Versions écartées

La version C « Plein soleil » (façade art déco) a été refusée : le concept n'avait pas de lien avec le métier du conseil. Son zip reste dans le dossier pour mémoire, elle n'est plus proposée. Désormais, chaque nouvelle version (D, E…) commence par une validation du concept avant toute construction.
