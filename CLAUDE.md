# Projet : site Leadvice (leadvice.org)

Lis `PROMPT-MAITRE-LEADVICE.md` en entier avant toute action. C'est l'unique source de vérité. Pour les séquences d'images au scroll, lis aussi `ANIMATIONS-SCROLL-LEADVICE.md`. Les textes du site sont dans `CONTENU-SITE-LEADVICE.md` et `CONTENU-INSIGHTS.md` : intègre-les tels quels. Toutes les valeurs visuelles (couleurs, typographie, espacements, mouvement, composants et états) sont dans `DESIGN-LEADVICE.md` : aucune valeur n'est improvisée dans un composant. `reference/ANALYSE.md` explique les choix tirés des six sites de référence ; le dossier `reference/` sert à l'étude et n'est jamais publié. Ce fichier rappelle seulement les règles de travail.

**Ce dossier construit la version B7** : B6 avec le menu Ateliers (deux ateliers interactifs) et deux scènes sur la page Acquisition. Lis dans l'ordre : `PROMPT-MAITRE-LEADVICE.md`, `BRIEF.md`, `CONCEPT.md`, `B2-tout-claude-code/CONSIGNES-B2.md`, `B5-skill-complet/CONSIGNES-B5.md`, `B6-identite/CONSIGNES-B6.md`, `B7-ateliers/CONSIGNES-B7.md`, `AUDIT-SKILL.md`. Les consignes B7 priment en cas de contradiction ; le code de référence des ateliers est dans `prototype/` (`atelier-acq.js`, `atelier-site.js`, `ateliers.css`, `b7.js`, `b7.css`). Applique le skill `site-web-premium` (dans `.claude/skills/`) à chaque étape, en particulier l'audit en boucle de l'étape 7, et lis `frontend-design` avant le design.

## Règles

- Aucun placeholder visible, jamais : pas de lorem, pas de `[À COMPLÉTER]`, pas de TODO dans le rendu. Quand une information manque, applique la règle de décision autonome (section 1.3 du prompt maître).
- Aucun chiffre, client, résultat ou témoignage inventé. Seuls les chiffres de la section 2.4 et les clients de la section 2.5 existent.
- Stack : Astro statique, TypeScript strict, CSS natif à tokens, GSAP + ScrollTrigger, canvas 2D, Content Collections MDX. Pas de React.
- Défilement lissé avec Lenis, coupé sur tactile et en mouvement réduit.
- Animations : `transform`, `opacity`, `stroke-dashoffset` uniquement ; `prefers-reduced-motion` respecté ; rien ne retarde le LCP.
- Budgets bloquants : Lighthouse mobile Perf ≥ 95, SEO 100, Bonnes pratiques 100, A11y ≥ 95 ; LCP < 2 s ; CLS < 0,05 ; INP < 200 ms ; JS < 80 Ko gzip par page.
- Français, vouvoiement, ton direct et sobre. Leadvice est un cabinet, jamais une agence.
- Textes éditables dans les collections de contenu, jamais en dur dans les composants.

## Façon de travailler

- Construis `/dev/design/` (DESIGN-LEADVICE.md, section 9) avant toute page.
- Enchaîne toutes les phases (section 6.1) sans attendre de validation : Amira l'a demandé. Arrête-toi seulement pour une décision qu'on ne peut pas défaire ou une information impossible à déduire ; sinon, fais l'hypothèse la plus simple et note-la dans le rapport.
- Le dossier `prototype/` est la référence : même design, mêmes textes, mêmes interactions, reconstruits proprement selon le prompt maître.
- À la fin de chaque phase : commit et push sur la branche de travail (Cloudflare Pages en tire un lien d'aperçu), captures Playwright à 390 et 1440 px, en clair et en sombre, dans `apercus/phase-N/`, montrées dans la conversation, puis un rapport de cinq lignes au plus (fait, scores, hypothèses prises, reste à faire).
- Fin de phase : définition de « terminé » (section 1.5) et rapport (section 1.7), avec captures ou lien de prévisualisation.
- Ne pas relire inutilement des fichiers connus, ne pas réécrire un fichier entier pour une petite modification.

## Skills du projet

Tous les skills de `.claude/skills/` sont disponibles. Pour ce site : `site-web-premium` (méthode et audit), `frontend-design` (design), `playwright-cli` (captures et tests), `motion-design-studio` (animations), `img2threejs` (3D si besoin), `deep-research` (vérifier un fait), `skill-creator` (améliorer un skill). Les autres (documents, tableurs, navigateur) ne servent pas à construire le site.

## Commandes

- `npm run dev` serveur de développement
- `npm run build` build de production
- `npm run preview` prévisualisation du build
