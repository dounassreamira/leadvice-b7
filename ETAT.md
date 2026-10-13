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

## Phase 1 — Accueil : faite
- `src/pages/index.astro`, textes dans `src/content/pages/accueil.yaml`, chiffres, clients, fondatrices et méthode dans `src/content/site/`.
- Scènes : ouverture « du bruit au signal » (épinglée), nuage de clients (sphères à lancer), texte qui s'allume, « Même offre. Trois histoires. » (défilement horizontal, annonces dessinées en SVG), système, quatre leviers avec vignettes animées, chemin d'un dirham (épinglé), chiffres avec phrase sur la courbe, méthode en rail, fondatrices, FAQ, bande violette.
- Mouvement réduit et sans JavaScript : chaque scène affiche son état final, sans épinglage ; défilement horizontal natif.
- Lighthouse mobile accueil : 100 / 100 / 100 / 100, LCP 1,4 s, CLS 0, JS 71 Ko.

## Phase 2 — Pages de contenu : faite
- Expertises (rangées, trois façons de travailler en cartes empilées, scène de la boucle), cinq pages leviers sur un gabarit commun (`src/components/LevierPage.astro`, textes dans `src/content/pages/<levier>.yaml`), Acquisition avec les deux scènes B7, le simulateur et le plan de campagne.
- Réalisations (mur de logos filtrable, chiffres, étude de cas), Kettani Immobilier (défilement horizontal des sept programmes, récit, exécution, enseignements, date et copier le lien).
- Cabinet (manifeste qui se révèle au défilement, engagement, méthode en cartes empilées, fondatrices, FAQ de huit questions).
- Insights : bibliothèque filtrable avec couvertures générées, six articles en Markdown (`src/content/insights/`), sommaire suivi, temps de lecture, dates, copier le lien, bloc diagnostic, expertise liée, « À lire aussi ».
- Recherche Pagefind : 17 pages indexées.
- Lighthouse mobile : 98 à 100 en performance, 100 en accessibilité, bonnes pratiques et SEO sur les 17 pages.

## Phase 3 — Conversion : faite
- Fenêtre de réservation (`src/scripts/booking.ts`, textes `src/content/site/reservation.yaml`) ouverte par chaque bouton « Demander un diagnostic » : qualification, calendrier, onglets Matin / Après-midi, tous les créneaux libres, heure locale si le fuseau diffère, coordonnées, confirmation. Repli vers le formulaire si aucun créneau.
- `/diagnostic/` : six étapes, une par écran avec JavaScript, toutes visibles et envoyées d'un coup sans JavaScript ; validation à la sortie du champ et à l'envoi, résumé des erreurs avec liens, sauvegarde dans la session, « Recommencer » et sortie de page confirmés (`<dialog>`), états d'envoi et d'erreur avec Réessayer et copier l'adresse. `/diagnostic/merci/` (enjeu repris, deux articles selon l'enjeu), `/diagnostic/rendez-vous/` (déplacer, annuler depuis le lien reçu).
- Trois landing pages `/lp/*` (noindex, hors plan) : header réduit, scène (cible, nœud, nouvelle scène « lentille »), bénéfices, chiffres, logos, méthode, formulaire court avec enjeu présélectionné et confirmation sur place, FAQ.
- Back-end Cloudflare : Pages Functions `functions/api/` (créneaux, réservations avec contrainte d'unicité, gestion par jeton, demande de diagnostic, administration), base D1 (`migrations/0001_init.sql`), Google Agenda (freeBusy, événement avec Meet), e-mails Resend avec `.ics`, rappels par Worker cron (`workers/rappels/`), Turnstile, champ piège, API Conversions Meta après consentement, fuseau `Africa/Casablanca` par `Intl`. Tests : `npm test` (créneaux, Ramadan, délai minimal, jour bloqué, plafond).
- `/admin/` (Cloudflare Access) : horaires à plusieurs plages, règles, jours bloqués, créneaux exceptionnels, rendez-vous (déplacer, annuler, diagnostic tenu, client signé), export CSV, état des connexions.
- Variables : `.env.example`. Lighthouse mobile : 99-100 / 100 / 100 / 100 sur `/diagnostic/` (les pages noindex ont un SEO plafonné par la directive noindex, voulue).

## Phase 4 — Ateliers : faite
- `/ateliers/` (présentation), `/ateliers/simulateur-campagne/` (« Pilotez une campagne » : trois clients fictifs, six décisions, huit semaines, imprévus, référence, bilan noté de A à D) et `/ateliers/page-qui-convertit/` (assembler avec jauges et aperçu de téléphone, auditer dix erreurs, alléger sous 2 s, bilan).
- Logique portée du prototype en TypeScript (`src/scripts/ateliers/`), chargée seulement sur ces pages ; données et textes dans `src/content/ateliers/*.json`, textes des pages dans `src/content/pages/atelier-*.yaml`. Premier écran rendu au build. Progression en stockage local avec repli silencieux, rien n'est envoyé.
- Guide indexable, glossaire et FAQ (JSON-LD FAQPage) sous chaque atelier ; recherche : 21 pages indexées.
- Lighthouse mobile : 99-100 / 100 / 100 / 100 sur les trois pages.

## Phase 5 — Finitions et audit : faite
- Pages légales `/mentions-legales/`, `/confidentialite/`, `/cookies/` (Markdown dans `src/content/legal/`, date de mise à jour, progression de lecture, identifiants à copier, bouton « Gérer les cookies »).
- Page 404 (scène « lost » : le curseur recolle les points), liens accueil, expertises, diagnostic et recherche.
- `/llms.txt` (texte dans `src/content/site/llms.yaml`), `.pages.yml` (Pages CMS), `README.md` (mise en ligne, D1, Resend, Turnstile, Google Agenda, Cloudflare Access, Worker des rappels).
- Impression : logo en tête, URL après chaque lien, adresse et e-mail en pied.
- Audit complet : toutes les pages contrôlées (HTML, liens, textes, Lighthouse mobile, axe clair et sombre). Scores dans `apercus/lighthouse.json`, captures finales dans `apercus/final/`.

## Reste à faire (côté Leadvice)
- Relier la base D1 et renseigner les secrets dans Cloudflare Pages (voir README) ; tant que ce n'est pas fait, la fenêtre de réservation propose le formulaire en repli.
- Configurer Cloudflare Access pour `/admin/`, le domaine Resend, Turnstile, le compte de service Google Agenda, les identifiants GTM, Pixel et LinkedIn.
