# État du chantier (version B7)

Mis à jour à la fin de chaque phase. Reprendre d'ici si la session s'interrompt.

## Phase 0 — Fondations : faite
- Astro 6.4 statique, TypeScript strict (`astro check` : 0 erreur), CSS natif à jetons en `@layer` (`src/styles/`).
- Identité B6/B7 dans `src/styles/tokens.css` : couleurs par rôle clair et sombre, Schibsted Grotesk (titres, interface) et Literata (lecture), auto-hébergées (`public/fonts/`, sous-ensemble latin, polices variables).
- Mise en page commune `src/layouts/Base.astro` : méta, canonical, Open Graph, JSON-LD (Organization + ProfessionalService, WebSite, fil d'Ariane), en-tête, sous-menu Expertises, menu mobile (focus piégé), pied de page, étiquette flottante, retour en haut, recherche (Pagefind), bandeau cookies (refus par défaut, Consent Mode v2), lien d'évitement, suivi UTM, mode sombre au choix.
- Scripts : `src/scripts/core.ts` (tout de suite), `motion.ts` (après le premier rendu : GSAP, ScrollTrigger, Lenis, scènes épinglées, fil conducteur), scènes canvas `src/scripts/scenes/s-*.ts` (signal, nœud, angles, cible, cadran, boucle, page, argent, 404), effets `src/scripts/fx/`.
- Textes : collections `src/content/` (site, scènes, pages, insights, légal). Aucun texte de page en dur dans les composants.
- Images de partage générées au build (`src/pages/og/[slug].png.ts`, satori + sharp).
- Pages de contrôle : `/dev/design/` (jetons, contrastes calculés, composants dans tous leurs états, clair et sombre, grille touche G) et `/dev/animations/` (chaque scène avec curseur de progression).
- Audit : `node scripts/audit.mjs` (build, HTML, liens, textes interdits, Lighthouse mobile, axe clair/sombre, débordements, console, captures). Captures : `node scripts/shots.mjs`.

## Reste à faire
- Phase 1 : accueil.
- Phase 2 : Expertises et ses cinq pages, Réalisations, Kettani, Cabinet, Insights et six articles.
- Phase 3 : Diagnostic, merci, landing pages, réservation, Pages Functions, e-mails, suivi.
- Phase 4 : Ateliers (trois pages, deux ateliers).
- Phase 5 : pages légales, 404, llms.txt, Pages CMS, README, audit complet.
