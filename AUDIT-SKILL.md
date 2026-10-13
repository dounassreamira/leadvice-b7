# Le skill site-web-premium : ce qui était appliqué, ce que B4 et B5 ajoutent

Le skill a guidé tout le projet depuis le début : l'analyse des six sites de référence, le prompt maître, le design, les textes, les prompts visuels et le prototype viennent de ses étapes. Mais B1 et B2 ne l'appliquaient pas en entier. B4 (B1 + skill complet) et B5 (B2 + skill complet) comblent les manques. B3, la version en 3D, part de B2 ; ces ajouts peuvent lui être appliqués de la même façon.

| Exigence du skill | B1 et B2 | B4 et B5 |
|---|---|---|
| Étape 1, `BRIEF.md` | Contenu dans le prompt maître, pas de fichier dédié | `BRIEF.md` |
| Étape 2, `CONCEPT.md` | Prompt maître partie 3 et `reference/ANALYSE.md` | `CONCEPT.md` en plus |
| Étape 3, tokens et composants | `DESIGN-LEADVICE.md` | Idem, plus la page de contrôle `design.html` (tokens, contrastes calculés, composants dans leurs états, clair et sombre) |
| Mode sombre | Absent | Au choix du visiteur (bouton lune), jamais imposé : le site reste clair par défaut |
| Étape 4, textes humanisés | Fait | Repassé : deux « essentiel » retirés des articles, aucun mot banni, aucun placeholder |
| Étape 5, visuels | B1 : prompts Flow ; B2 : code | Identique à B1 pour B4, à B2 pour B5 |
| Recherche | Absente | Loupe dans l'en-tête et touche « / », index de toutes les pages et articles |
| Bandeau cookies conforme | Décrit, pas construit | Refus par défaut, Refuser et Accepter de même poids, Personnaliser par catégorie, « Gérer les cookies » dans le pied de page |
| Retour en haut | Absent | Bouton après deux écrans |
| Styles d'impression | Absents | Articles et pages imprimables, sans animations ni boutons |
| Données structurées JSON-LD | Décrites, pas posées | Organization et ProfessionalService, BreadcrumbList, FAQPage, Service, Article, WebSite sur chaque page |
| Lien d'évitement, FAQ, bouton flottant, page merci | Faits | Faits |
| Étape 7, audit accessibilité (axe-core, WCAG 2.2 AA) | Non mesuré | 0 violation sur les 24 pages, en clair et en sombre |
| Liens internes, débordements, erreurs console | Contrôlés | 0 lien cassé, 0 débordement à 390 et 1440 px, 0 erreur |
| Lighthouse mobile | Non mesuré | Voir ci-dessous |

## Lighthouse mobile mesuré sur l'aperçu (pas encore le site final)

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| B5 accueil | 71 | 100 | 96 | 100 |
| B5 Stratégie | 77 | 100 | 96 | 100 |
| B5 article | 76 | 100 | 96 | 100 |
| B2 Stratégie | 97 | 100 | 96 | 100 |

La performance de l'aperçu est sous l'objectif de 95 parce qu'il charge les polices depuis Google Fonts et GSAP depuis un CDN, sans compression ni découpage. Le site final construit par Claude Code (Astro, polices auto-hébergées, JavaScript groupé et chargé seulement là où il sert, images en WebP) doit atteindre 95 : c'est un critère bloquant du prompt maître, à vérifier à chaque phase. Le 96 en bonnes pratiques venait d'une icône d'onglet manquante, ajoutée depuis.

## Test de positionnement (30 secondes sur l'accueil)
Qui : « Leadvice, cabinet de conseil » dès le premier écran. Quoi : stratégie, création, Meta Ads, Google Ads, pilotage. Pourquoi eux : « Moins de bruit. Plus de clients. », les logos, les chiffres réels. Comment les contacter : bouton « Demander un diagnostic » visible sans défiler, et bouton flottant. Réussi.
