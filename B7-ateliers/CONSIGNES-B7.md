# B7 : B6 avec les ateliers

B7 reprend B6 (identité comprise) et ajoute deux choses : un menu **Ateliers** avec deux ateliers interactifs, et deux scènes sur la page Acquisition. Ces consignes priment sur `B6-identite/CONSIGNES-B6.md` et sur les consignes précédentes pour ces ajouts. L'aperçu est dans `prototype/`.

## Le menu Ateliers

Une entrée « Ateliers » dans l'en-tête, le menu mobile et le pied de page, après Insights. Trois pages :

- `ateliers.html` : présentation des deux ateliers, ce qu'on y apprend, pourquoi ils existent.
- `atelier-acquisition.html` : **Pilotez une campagne** (`atelier-acq.js`).
- `atelier-site-web.html` : **Construisez une page qui convertit** (`atelier-site.js`).

Styles communs dans `ateliers.css`. Chaque atelier tient 10 à 15 minutes et garde la progression sur l'appareil (stockage local, avec repli silencieux s'il est indisponible). Aucune donnée n'est envoyée.

### Pilotez une campagne

1. Choix d'un client fictif : promoteur immobilier, marque de bijoux en ligne, école de formation. Chacun a son budget, son résultat (visites, commandes livrées, inscriptions) et ses propres libellés.
2. Préparation en six décisions : cible, message, action demandée, visuel, formulaire, répartition Meta et Google. Chaque option a un rang (bon, défendable, à revoir) et des effets sur le modèle.
3. Huit semaines de pilotage. Chaque semaine : tableau de bord (dépense, clics, leads, leads qualifiés, résultats, coût par résultat, variations), graphique face à une campagne de référence, lecture commentée, imprévu éventuel, une action à choisir parmi trois et la répartition du budget.
4. Bilan : note de A à D selon le rapport entre votre coût par résultat et celui de la référence, relecture de chaque décision avec sa leçon, lecture du pilotage, appel au diagnostic.

Mécanismes simulés : fatigue des annonces (renouveler remet à zéro), phase d'apprentissage relancée par un gros changement de répartition, plafond des recherches Google avec coût croissant, effet du formulaire sur le volume et la qualité, rappel rapide qui augmente la conversion finale. Le modèle est volontairement simple et ses chiffres sont fictifs ; la page le dit, dans l'atelier et dans la FAQ.

### Construisez une page qui convertit

1. **Assembler** : huit blocs (titre, sous-titre, visuel, bouton, preuve, formulaire, typographie, contact mobile), trois options chacun. Quatre jauges (clarté, confiance, vitesse, conversion) et un temps d'affichage estimé réagissent à chaque choix ; un aperçu de téléphone se construit en direct ; chaque choix est expliqué.
2. **Auditer** : une page de promoteur fictif avec dix erreurs et cinq éléments corrects. On touche ce qui ne va pas ; un mauvais signalement et un indice coûtent des points.
3. **Alléger** : douze éléments à garder ou non sur une page mobile, sans dépasser 2 secondes d'affichage estimé. La meilleure sélection possible est calculée ; le score compare la vôtre.
4. **Bilan** : score par niveau, ce qu'il faut retenir, appel au diagnostic et lien vers la page Sites web.

### Référencement

Le jeu lui-même n'est pas ce que Google classe. Chaque page d'atelier porte donc un guide indexable sous l'atelier (« Ce que l'atelier vous apprend », sept ou cinq mécanismes, un glossaire) et une FAQ balisée en données structurées. Titres et descriptions visent des recherches réelles : simulateur de campagne Meta Ads et Google Ads, page d'atterrissage qui convertit. Les scripts des ateliers sont chargés avec `defer` et seulement sur leurs pages : ils ne pèsent pas sur le reste du site.

## Les deux scènes de la page Acquisition

Insérées entre les sections existantes, sans toucher aux autres (`b7.css`, `b7.js`) :

- Après « Ce que nous faisons » : **Du brief au client signé.** Une scène épinglée où un même objet se transforme en six étapes : brief, annonce, diffusion dans le fil, formulaire, fiche lead, visite confirmée. À gauche, l'étape en cours et son levier. Sur mobile, seule l'étape en cours s'affiche au-dessus de l'objet.
- Après « Comment nous travaillons » : **Le plan que vous recevez.** Les blocs d'un plan de campagne arrivent en désordre et s'assemblent en un document ; un tampon jaune « Ce que vous recevez après le diagnostic » apparaît à la fin.

En mouvement réduit, les deux scènes s'affichent dans leur état final, sans épinglage. Les exemples sont fictifs et présentés comme tels.
