# Guide de démarrage : générer le site Leadvice avec Claude Code sur le web (claude.ai/code)

Aucune installation, aucun terminal. Tout se passe dans le navigateur, sur claude.ai/code. Claude Code tourne dans un environnement cloud dédié à ton projet.

---

## 0. Créer le dépôt GitHub du projet

claude.ai/code travaille à partir d'un dépôt GitHub, c'est l'équivalent du "dossier projet" en version web.

1. Va sur **github.com**, connecte-toi (crée un compte si tu n'en as pas, gratuit).
2. Clique sur le bouton vert **New** (ou le "+" en haut à droite, puis "New repository").
3. Nom du dépôt : `leadvice-site`. Visibilité : **Private**. Ne coche aucune case d'initialisation (pas de README). Clique **Create repository**.

## 1. Déposer les fichiers de départ dans le dépôt

Sur la page du dépôt tout juste créé :
1. Clique **uploading an existing file** (ou le bouton **Add file → Upload files**).
2. Dézippe sur ton ordinateur le fichier `leadvice-site-final.zip`. Tu obtiens `PROMPT-MAITRE-LEADVICE.md`, `CLAUDE.md` et le sous-dossier `assets-wix/` (les logos).
3. Glisse-dépose ces deux fichiers et le dossier `assets-wix` entier dans la zone d'upload de GitHub. Si tu as des portraits d'Amira et Nada, ajoute-les dans un dossier `assets/fondatrices/` ; sinon le site utilisera des portraits graphiques.
4. En bas de page, clique **Commit changes**.

Vérifie que l'arborescence dans GitHub ressemble à :
```
leadvice-site/
├── PROMPT-MAITRE-LEADVICE.md
├── CLAUDE.md
└── assets-wix/
    └── (les logos)
```

## 2. Ouvrir claude.ai/code

1. Va sur **claude.ai/code** dans ton navigateur, connecte-toi avec ton compte Claude (le Max).
2. Clique sur **New session** (ou "Nouvelle session").
3. Choisis **Connect to GitHub** si ce n'est pas déjà fait : une fenêtre d'autorisation GitHub s'ouvre, accepte l'accès pour Claude.
4. Sélectionne le dépôt `leadvice-site` que tu viens de créer.

Claude Code démarre une session cloud avec ce dépôt déjà cloné à l'intérieur. Tu es prête.

## 3. Choisir le modèle

Dans les réglages de la session (icône en haut, souvent un menu modèle), choisis **Opus** pour cette première phase. Tu pourras repasser sur Sonnet plus tard pour les tâches répétitives via le même menu.

## 4. Envoyer le premier prompt

Colle ce message dans la zone de saisie, puis Entrée :

```
Lis PROMPT-MAITRE-LEADVICE.md en entier, puis présente-moi ton plan pour la phase 0 (section 6.1).
```

Claude Code lit le prompt maître et `CLAUDE.md`, puis te présente son plan pour la phase 0. Réponds en langage courant. Quand il veut créer des fichiers ou installer des paquets, des boutons d'approbation s'affichent dans la conversation : clique dessus pour valider, comme tu le ferais ici.

## 5. Voir le résultat

Comme la session tourne dans le cloud, demande simplement à Claude Code de te montrer le résultat : "montre-moi une capture d'écran de la page d'accueil" ou "donne-moi un lien pour prévisualiser le site". Il peut soit prendre des captures d'écran du rendu, soit déployer une version de prévisualisation accessible par une adresse web que tu ouvres directement dans un nouvel onglet. Demande-lui cette prévisualisation à la fin de chaque étape importante plutôt que de chercher un "localhost" (qui n'existe pas sur une session web, c'est propre au cloud, pas à ton ordinateur).

## 6. Continuer phase par phase

Une fois la phase 0 validée (regarde surtout la page `/dev/animations/`), écris : "Phase 0 validée, présente le plan de la phase 1." Regarde le résultat, demande des ajustements en langage normal ("le H1 est trop petit sur mobile", "l'animation va trop vite"). Même chose pour les phases 2, 3 et 4, dans l'ordre, dans la même session ou une nouvelle session reliée au même dépôt.

Si tu veux repartir d'une conversation fraîche entre deux phases (pour que Claude Code reste rapide et concentré), crée une **nouvelle session** sur le même dépôt `leadvice-site` : il relira le brief et tout ce qui a déjà été codé, rien n'est perdu.

## 7. Demander une correction

Pas besoin de formule particulière. Décris ce que tu vois et ce que tu veux changer : "la carte Kettani n'affiche pas le logo correctement, utilise assets-wix/logo-client-kettani.png", "je veux que le bouton Demander un diagnostic soit plus visible sur mobile". Claude Code modifie les fichiers, puis redemande-lui une capture ou un lien de prévisualisation pour vérifier.

## 8. À la fin de chaque phase

Demande explicitement : "lance le build et donne-moi le rapport Lighthouse mobile". S'il y a des erreurs, Claude Code les corrige lui-même, tu n'as rien à faire de ton côté.

## 9. Sauvegarder ton avancée

Sur claude.ai/code, le travail est automatiquement sauvegardé dans la session et peut être envoyé vers GitHub sous forme de commits. Demande simplement : "envoie ce travail sur GitHub avec un message de commit clair" après chaque phase validée. Tu retrouveras l'historique complet sur la page du dépôt `leadvice-site` sur github.com, avec la possibilité de revenir en arrière si besoin.

## 10. Mettre le site en ligne pour le montrer ou le tester sur mobile

Quand tu veux une adresse accessible depuis n'importe où, en dehors des aperçus de la session :
1. Crée un compte sur **dash.cloudflare.com**, gratuit.
2. Dans Cloudflare Pages, clique **Connect to Git**, choisis le dépôt `leadvice-site` sur GitHub.
3. Laisse les réglages par défaut pour Astro (commande de build `npm run build`, dossier de sortie `dist`), valide.
4. Cloudflare te donne une adresse en `.pages.dev` en quelques minutes, qui se met à jour automatiquement à chaque fois que Claude Code envoie du nouveau code sur GitHub. C'est cette adresse que tu testes sur ton téléphone en 4G et que tu passes dans PageSpeed Insights.

Le nom de domaine `leadvice.org` se branche dessus plus tard, une fois le site validé, en changeant les enregistrements DNS chez ton registrar actuel.

---

## Si quelque chose bloque

- Claude Code demande une autorisation GitHub qui échoue : vérifie dans les réglages de ton compte GitHub (Settings → Applications) que l'accès à Claude est bien installé sur le dépôt `leadvice-site`.
- Tu ne retrouves plus ta session : reviens sur claude.ai/code, l'historique de tes sessions liées au dépôt `leadvice-site` est listé, clique sur celle à reprendre.
- Tu veux comparer avec Astra ou Gemini CLI en parallèle : crée un second dépôt GitHub (`leadvice-astra` ou `leadvice-gemini`), uploade exactement les mêmes fichiers, en renommant `CLAUDE.md` en `AGENTS.md` pour ChatGPT/Codex ou `GEMINI.md` pour Gemini, et envoie le même premier message.
- Si tu perds le fil d'une phase à moitié faite, ne t'inquiète pas : rouvre simplement la session et demande "où en est-on, qu'est-ce qu'il reste à faire sur cette phase".
