# Construire B7 ou D avec Claude Code : la méthode

Chaque zip contient tout ce qu'il faut, qu'il s'agisse de `leadvice-B7.zip`, de `leadvice-D.zip` ou de `leadvice-B6.zip` :

- le prototype validé (`prototype/`), avec vos deux portraits ;
- les consignes de la version et le prompt maître ;
- tous vos skills, dans `.claude/skills/`.

Claude Code reconstruit le site en production (Astro, Cloudflare Pages) en prenant le prototype comme référence. Il le fait d'une traite, phase après phase, sans attendre votre validation. À chaque fin de phase, il vous laisse un lien d'aperçu et des captures.

Le pas à pas détaillé de Claude Code sur le web est dans `GUIDE-DEMARRAGE-CLAUDE-CODE.md`.

## 1. Préparer le projet (une fois par version)

1. Sur GitHub, créez un dépôt vide par version : `leadvice-b7`, puis `leadvice-d`.
2. Décompressez le zip et déposez **tout son contenu** à la racine du dépôt, y compris le dossier caché `.claude/`. Pour ça, cliquez sur « Add file », puis « Upload files », et glissez le contenu du dossier, pas le zip lui-même. Si le dossier `.claude/` n'apparaît pas sur votre Mac, appuyez sur Cmd + Maj + point dans le Finder pour afficher les fichiers cachés.
3. Ouvrez claude.ai/code. Choisissez le dépôt et le modèle le plus puissant proposé.

## 2. Les skills

Claude Code ne voit pas les skills installés dans votre compte Claude : ce sont deux environnements séparés. Il charge en revanche tout ce qui se trouve dans le dossier `.claude/skills/` du projet. C'est pourquoi chaque zip contient vos skills de compte, plus `playwright-cli` et `img2threejs`. Le skill `site-web-premium` y est dans sa version la plus récente.

Il n'y a rien à installer. Claude Code les trouve seul, et le fichier `CLAUDE.md` lui dit lesquels servent au site.

## 3. L'aperçu à chaque phase : Cloudflare Pages

Faites ce réglage une fois par dépôt, après la première phase, quand le projet contient un `package.json`. Claude Code vous le signalera.

1. Créez un compte gratuit sur dash.cloudflare.com.
2. Allez dans « Workers & Pages », puis « Create », puis l'onglet « Pages », puis « Connect to Git ». Autorisez GitHub et choisissez le dépôt.
3. Réglages de build : préréglage **Astro**, commande `npm run build`, dossier de sortie `dist`.
4. Cliquez sur « Save and Deploy ».

Ensuite, chaque phase que Claude Code envoie sur GitHub produit automatiquement un lien d'aperçu. Vous le trouverez dans Cloudflare, dans le projet, onglet « Deployments ». Ouvrez-le sur ordinateur et sur téléphone.

En plus, Claude Code range des captures (mobile et ordinateur, clair et sombre) dans `apercus/phase-N/` et vous les montre dans la conversation.

Si l'interface de Cloudflare a changé, demandez à Claude Code : « Guide-moi pour connecter ce dépôt à Cloudflare Pages ».

## 4. Le premier message

Copiez ceci tel quel :

> Lis CLAUDE.md, puis les fichiers qu'il indique, dans l'ordre. Construis le site d'une traite, phase après phase, sans attendre ma validation : le dossier prototype/ est la référence. À la fin de chaque phase, envoie sur GitHub, mets les captures dans apercus/ et donne-moi un rapport court. Ne t'arrête que si une décision est irréversible ou si une information manque vraiment.

## 5. Pendant la construction

- **Le déroulé.** Il enchaîne les phases : fondations, page de contrôle du design, accueil, pages de contenu, réservation et formulaires, ateliers, finitions et audit.
- **Si la session s'arrête ou devient longue.** Écrivez : « Mets à jour CLAUDE.md avec ce qui est fait et ce qui reste, puis continue. » Si besoin, ouvrez une nouvelle session sur le même dépôt et écrivez : « Lis CLAUDE.md et reprends où tu t'étais arrêté. »
- **Pour corriger.** Écrivez simplement ce qui ne va pas, par exemple : « Sur la page Cabinet, les deux photos doivent être à la même hauteur. » Il corrige et garde la règle pour la suite.
- **B7 et D.** Chaque version a son dépôt et sa session. Vous pouvez les lancer l'une après l'autre ou en même temps.

## 6. Les règles qu'il respecte (déjà écrites dans les consignes)

- Amira Dounassre est toujours citée avant Nada Moujibi.
- Tous les articles Insights sont signés Amira Dounassre.
- Aucun « Avec … » sur l'écran de réservation.
- Le diagnostic dure 45 minutes. Aucune question de budget dans les formulaires.
- Aucun chiffre ni client en dehors de la liste fermée du brief.
- Les chiffres clés tiennent sur une ligne (« +1 000 », « 1 à 2 $ »).
- Pour B7 : un surligneur jaune derrière les derniers mots des titres, sans triangle ni biais.
- Pour D : le tableau blanc et le marqueur, comme décrit dans `D-tableau-blanc/CONSIGNES-D.md`.

## 7. Mettre en ligne pour de vrai

Quand la version gagnante est choisie, écrivez :

> Prépare la mise en production sur leadvice.org : domaine, redirections des anciennes adresses, formulaires, vérifications finales. Explique-moi chaque clic à faire.
