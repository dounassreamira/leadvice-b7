# B6 : B5 avec la nouvelle identité Leadvice

B6 reprend B5 à l'identique (pages, textes, scènes, fonctions, skill appliqué en entier) et change une seule chose : l'identité visuelle. Le violet Leadvice reste la marque ; autour de lui, une famille de violets remplace le noir et le gris, et un jaune signal marque les résultats. Ces consignes priment sur `B5-skill-complet/CONSIGNES-B5.md` pour tout ce qui touche aux couleurs, à la typographie et aux signes graphiques.

L'aperçu est dans `prototype/` ; la feuille qui applique l'identité est `prototype/lv-brand.css`, chargée après `b5-refine.css`.

## Couleurs, par rôle

| Rôle | Jeton | Clair | Sombre | Usage |
|---|---|---|---|---|
| Fond | `--paper` | `#FBFAFD` papier, un blanc à peine violacé | `#0F0A24` | Fond de page |
| Surface douce | `--paper-2` | `#F1EEFB` lavande | `#1A1338` | Encadrés, cartes, zones de saisie |
| Surface | `--white` | `#FFFFFF` | `#1A1338` | Fenêtres, ateliers |
| Texte | `--ink` | `#1E0F52` encre violette | `#EEEAF8` | Titres et texte courant. Remplace le noir. |
| Texte secondaire | `--ink-2` | `#5B5770` ardoise | `#B7B0D4` | Légendes, aides |
| Décor | `--ink-3` | `#9C97B5` | `#8A83A8` | Jamais du texte utile |
| Bordures | `--line` | `#E2DDF2` | `#2C2452` | Filets, contours |
| Marque | `--brand` | `#301781` violet Leadvice | texte `#B4A6FF`, boutons `#4A2DC9` | Logo, boutons, grands aplats |
| Action | `--signal` | `#6B4EFF` | `#9C87FF` | Liens, survol des boutons, focus |
| Résultat | `--yellow` | `#FFC93C` jaune signal | `#FFC93C` | Uniquement pour marquer un résultat |

Contrastes calculés (WCAG) : encre sur papier 16,2:1 ; ardoise sur papier 6,6:1 ; ardoise sur lavande 6,0:1 ; violet Leadvice sur papier 12,9:1 ; blanc sur violet Leadvice 13,4:1 ; violet action sur papier 4,9:1 et sur blanc 5,1:1 (AA) ; encre sur jaune 11,0:1. En sombre : texte 16,3:1, secondaire 9,3:1, liens 6,7:1, blanc sur bouton `#4A2DC9` 8,4:1.

Règle du jaune : il n'est jamais une couleur de texte, jamais une décoration. Il surligne un chiffre de résultat (les blocs de chiffres, les totaux des ateliers), marque une étiquette « qualifié » ou « bon choix », et souligne les titres de fin de page (bande violette et pied de page). Rien d'autre.

## Typographie

- Titres et interface : **Schibsted Grotesk**, graisses 700 et 800, approche serrée (-0,028 em), titres équilibrés (`text-wrap: balance`).
- Lecture : **Literata** pour les paragraphes, les listes et les textes d'ouverture, interligne 1,6.
- Boutons, étiquettes, fil d'Ariane, champs : Schibsted Grotesk.
- Les canvas (scènes animées) utilisent aussi Schibsted Grotesk.
- Échelle : titre d'ouverture `clamp(2,9rem ; 5,8rem)`, titre de page `clamp(2,4rem ; 5rem)`, titre de section `clamp(2rem ; 3,9rem)`.

## Le surligneur

Pas de forme sous les titres. Un trait de surligneur jaune passe derrière les derniers mots du titre de chaque page (le dernier mot, ou les deux derniers si le dernier est très court), quand le titre apparaît à l'écran (`lv-hl.js`). Sur fond clair, le trait couvre le bas des lettres. Sur la bande violette, le pied de page et en mode sombre, il couvre tout le mot, qui passe en encre violette pour rester lisible. En mouvement réduit, le trait est là d'emblée. Pas de triangle ni de biais (rappel d'EY), pas de point seul (rappel de Deloitte).

## Les fondatrices

- **Les portraits.** Ceux d'Amira et de Nada sont détourés et posés sur le même fond violet clair (`#E4DFFE`). Le cadrage est identique : même taille de visage, yeux à la même hauteur. Le format est 3:4 : `img/amira.webp` et `img/nada.webp`, 1080 × 1440 px.
- **La photo de Nada.** L'original fait 400 px ; elle a été agrandie quatre fois avec un modèle de super-résolution, puis nettoyée. Une photo originale d'au moins 1 600 px de haut restera meilleure.
- **Où les portraits apparaissent.** Sur la page Cabinet et dans la section des fondatrices de l'accueil, toujours à la même hauteur : pas de décalage entre les deux.

## Noms et signatures

- **Ordre des noms.** Amira Dounassre est toujours citée avant Nada Moujibi : textes, listes, données structurées, portraits.
- **Articles.** Tous les articles Insights sont signés Amira Dounassre.
- **Écran de réservation.** Il n'affiche pas d'interlocutrice (pas de ligne « Avec … »).

## Ce qui ne change pas

Mise en page, scènes, textes, réservation, simulateur, recherche, mode sombre, cookies, données structurées : comme B5. Les rayons restent à 2 px, les boutons restent rectangulaires.
