# Consignes B5 : B2 avec le skill site-web-premium appliqué en entier

Lis dans cet ordre : `PROMPT-MAITRE-LEADVICE.md`, `B2-tout-claude-code/CONSIGNES-B2.md` (tout est dessiné en code, aucune image ni vidéo générée par un outil externe), puis ces consignes, qui priment en cas de contradiction. `BRIEF.md`, `CONCEPT.md` et `AUDIT-SKILL.md` complètent.

## Ce que B5 ajoute à B2
1. **Page de contrôle `/dev/design/`** construite avant toute page : tous les tokens (contrastes calculés), tous les composants dans tous leurs états, en clair et en sombre. Modèle : `prototype/design.html`.
2. **Mode sombre au choix** : bouton dans l'en-tête, mémorisé, jamais déclenché par le réglage du système. Les tokens sombres sont dans `prototype/extras.css`. Les scènes dessinées lisent leurs couleurs dans les tokens : elles passent en sombre avec le reste.
3. **Recherche** : bouton loupe et touche « / », index généré au build (Pagefind recommandé, gratuit et statique).
4. **Bandeau cookies conforme** (prompt maître 5.7) : refus par défaut, deux boutons de même poids, personnalisation par catégorie, lien « Gérer les cookies ».
5. **Retour en haut, styles d'impression, icône d'onglet.**
6. **JSON-LD** sur chaque page, conforme au contenu visible (modèle : les balises de `prototype/*.html`).
7. **Audit à chaque phase** (skill, étape 7) : build sans avertissement, Lighthouse mobile ≥ 95 / 100 / 100 / ≥ 95 sur chaque page, axe-core sans violation en clair et en sombre, liens, HTML et JSON-LD valides, captures à 390, 768, 1440 et 1920 px en clair, en sombre et en mouvement réduit, recherche de placeholders, vérification que chaque chiffre et chaque logo figure dans la liste fermée, relecture des textes contre les mots bannis, test de positionnement. Le rapport de phase donne les chiffres.

## Aperçu
`prototype/` est l'aperçu B5 : grain papier, couvertures d'articles générées, champs de points en haut des pages, pictogrammes des annonces, tout en code.

## Revue d'octobre : B5 passée au skill v5 (Impeccable, Taste, ECC)

L'identité de B5 reste la même : papier, violet, signal, scènes. Ce qui a changé :

- **Titres.** Instrument Serif, devenue la police par défaut des sites générés, est remplacée par Newsreader, un serif éditorial à taille optique, y compris dans les scènes dessinées. Les titres d'affichage sont limités à 6 rem.
- **Ouverture de l'accueil.**
  - Trois éléments : le titre, une phrase de 16 mots qui contient l'offre (« Diagnostic de 45 minutes, offert »), le bouton.
  - La petite ligne sous le bouton et l'étiquette « Du bruit au signal » sont retirées.
- **Signes de site généré retirés :**
  - « Survolez le signal, puis défilez » ;
  - « Faites défiler pour voir les trois angles » ;
  - le curseur personnalisé « Défiler » ;
  - le libellé vertical du fil dans la marge ;
  - les noms et secteurs sous les logos des réalisations (ils restent lisibles par les lecteurs d'écran) ;
  - les tirets cadratins dans les titres d'onglet.
- **Un seul libellé par action.** « Calculer mes vrais chiffres en 45 minutes » et « Diagnostic offert » deviennent « Demander un diagnostic », comme partout ailleurs.
- **Finitions :**
  - sélection de texte, barre de défilement, curseur de saisie et soulignements aux couleurs du site ;
  - titres équilibrés ;
  - halos lumineux centrés remplacés par des ombres décalées ;
  - contour discret des images.
- **Vérifications :** axe sur les 24 pages, clair et sombre, zéro violation.

Le fichier `prototype/b5-refine.css` porte ces changements. Dans le site Astro, ils vont directement dans les jetons et les composants.
