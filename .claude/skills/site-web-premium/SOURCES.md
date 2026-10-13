# Sources du skill site-web-premium

Le skill reprend, réécrites en français et adaptées, des règles venant de ces projets libres. Rien n'est copié tel quel, sauf les deux skills installés à part dans `.claude/skills/`.

| Projet | Licence | Ce qui a été repris |
|---|---|---|
| Impeccable (pbakaus/impeccable) | Apache 2.0 | Le plancher de qualité, les modes de page (convaincre, opérer, lire, montrer), les passes de vérification bornées, les retouches à la demande, la liste des réflexes à refuser |
| Taste Skill (Leonxlnx/taste-skill) | MIT | La lecture du brief en une ligne, les trois curseurs (audace, mouvement, densité), les signes de site généré, le contrôle final mécanique, la règle de livraison complète |
| Playwright CLI (microsoft/playwright-cli) | Apache 2.0 | Installé tel quel dans `.claude/skills/playwright-cli` : tests par snapshot texte, annotations de l'utilisateur, vidéos de démonstration |
| Awesome DESIGN.md (VoltAgent/awesome-design-md) | MIT | Le format DESIGN.md (Stitch) et la bibliothèque d'analyses de marques à étudier, jamais à copier |
| img2threejs (hoainho/img2threejs) | Apache 2.0 | Installé tel quel dans `.claude/skills/img2threejs` : objets 3D en code à partir d'une photo |
| ECC (affaan-m/ecc) | MIT | Finitions d'interface, voix de marque, audit des parcours, double relecture, vérification après mise en ligne |

Installation des outils :
- Playwright CLI : `npm install -g @playwright/cli@latest`.
- img2threejs : il faut Python 3.10 ou plus récent ; aucun paquet à installer.
