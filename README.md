# leadvice.org

Site du cabinet Leadvice (conseil stratégique et marketing, Casablanca). Version B7.

Astro statique, TypeScript strict, CSS natif à jetons, GSAP + ScrollTrigger, Lenis, scènes en canvas 2D,
collections de contenu (YAML, Markdown, JSON). Hébergement Cloudflare Pages, avec des Pages Functions pour le
diagnostic et la réservation, une base D1 et un petit Worker pour les rappels.

## Démarrer

```bash
npm install
npm run dev        # serveur de développement, http://localhost:4321
npm run build      # site statique dans dist/ + index de recherche Pagefind
npm run preview    # aperçu du build
npm run check      # vérification TypeScript et Astro
npm test           # tests du calcul des créneaux (fuseau, Ramadan, délai, jours bloqués, plafond)
npm run audit      # build + HTML, liens, textes, Lighthouse mobile, axe clair/sombre, captures
```

Node 22.12 ou plus récent.

## Où sont les textes

Aucun texte de page n'est écrit dans les composants : tout est dans `src/content/`.

| Dossier | Contenu |
| --- | --- |
| `src/content/site/` | textes communs (en-tête, pied de page, cookies), chiffres du cabinet, clients, fondatrices, méthode, leviers, fenêtre de réservation, textes des scènes, `llms.txt` |
| `src/content/pages/` | un fichier YAML par page (accueil, expertises, leviers, réalisations, cabinet, diagnostic, landing pages, ateliers, 404…) |
| `src/content/insights/` | les articles, en Markdown (titre, description, catégorie, dates, expertises liées) |
| `src/content/legal/` | mentions légales, confidentialité, cookies, en Markdown avec la date de mise à jour |
| `src/content/ateliers/` | données et textes des deux ateliers interactifs (clients fictifs, options, messages) |

Les chiffres et les clients forment des listes fermées (`chiffres.yaml`, `clients.yaml`) : rien d'autre n'est affiché.

### Édition sans code : Pages CMS

Le fichier `.pages.yml` décrit les contenus pour [Pages CMS](https://pagescms.org). Connexion avec le compte
GitHub qui a accès au dépôt, choix du dépôt et de la branche de production. Les articles et les pages légales
ont des champs (titre, dates, catégorie, texte) ; les autres fichiers s'éditent en YAML, en gardant la structure.
Chaque enregistrement crée un commit et Cloudflare Pages republie le site en une à deux minutes.

## Mise en ligne sur Cloudflare Pages

1. Cloudflare > Workers et Pages > Créer > Pages > connecter le dépôt GitHub.
2. Réglages de build : commande `npm run build`, dossier de sortie `dist`, variable `NODE_VERSION` = `22`.
3. Le dossier `functions/` est détecté automatiquement (API du diagnostic et de la réservation).
4. Domaine personnalisé : `leadvice.org` (et redirection de `www`). Les anciennes adresses Wix sont redirigées
   par `public/_redirects`, les en-têtes de sécurité et de cache sont dans `public/_headers`.
5. Les aperçus de branche (`*.pages.dev`) sont marqués `noindex`.

### Variables et secrets

La liste complète est dans `.env.example`. Dans Cloudflare Pages > Paramètres > Variables et secrets :

| Variable | Rôle | Sans elle |
| --- | --- | --- |
| `PUBLIC_GTM_ID`, `PUBLIC_META_PIXEL_ID`, `PUBLIC_LINKEDIN_PARTNER_ID` | mesure et publicité, chargées seulement après accord | aucun script tiers |
| `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | anti-robots des formulaires | seul le champ piège protège |
| `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` | e-mails (confirmation, notification, rappels) | pas d'e-mail ; la demande reste en base si D1 est reliée |
| `GOOGLE_SERVICE_ACCOUNT`, `GOOGLE_CALENDAR_ID`, `GOOGLE_IMPERSONATE` | Google Agenda (occupation, événement avec Meet) | créneaux calculés sur les seules règles, sans événement |
| `META_CAPI_TOKEN` | API Conversions de Meta, côté serveur | pas d'événement serveur |
| `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` | protection de `/admin/` | l'admin refuse tout accès |
| `SITE_URL` | liens dans les e-mails | `https://leadvice.org` |

Les variables `PUBLIC_*` sont lues au build : relancer un déploiement après les avoir changées.

### Base de données D1

```bash
npx wrangler d1 create leadvice
npx wrangler d1 execute leadvice --remote --file migrations/0001_init.sql
```

Puis Cloudflare Pages > Paramètres > Liaisons > D1 : nom de variable `DB`, base `leadvice` (production et aperçu).
La table `bookings` porte un index unique sur le début des rendez-vous confirmés : deux réservations
simultanées sur le même créneau ne peuvent pas passer toutes les deux.

### E-mails (Resend)

Créer un compte Resend, ajouter le domaine `leadvice.org` et ses enregistrements DNS (SPF, DKIM), créer une clé
d'API et la mettre dans `RESEND_API_KEY`. `MAIL_FROM` par exemple `Leadvice <diagnostic@leadvice.org>`.

### Anti-robots (Turnstile)

Cloudflare > Turnstile > ajouter un site `leadvice.org`, mode « Géré ». Clé publique dans
`PUBLIC_TURNSTILE_SITE_KEY`, clé secrète dans `TURNSTILE_SECRET_KEY`. Le formulaire `/diagnostic/` envoyé sans
JavaScript passe avec le seul champ piège ; l'e-mail interne le signale.

### Google Agenda

1. Google Cloud : créer un projet, activer l'API Google Calendar, créer un compte de service et une clé JSON.
2. Google Workspace (admin) : délégation au niveau du domaine pour l'identifiant client du compte de service,
   champ d'application `https://www.googleapis.com/auth/calendar`.
3. `GOOGLE_SERVICE_ACCOUNT` = le JSON complet sur une ligne, `GOOGLE_CALENDAR_ID` = l'agenda à remplir
   (souvent l'adresse e-mail d'Amira), `GOOGLE_IMPERSONATE` = l'utilisateur représenté, pour inviter le prospect
   et créer le lien Google Meet.

L'état de la connexion s'affiche dans `/admin/`.

### Administration `/admin/` (Cloudflare Access)

Cloudflare Zero Trust > Access > Applications > ajouter une application « self-hosted » :
domaine `leadvice.org`, chemins `/admin/*` et `/api/admin/*`, politique « Autoriser » limitée aux adresses
d'Amira et de Nada (connexion par code envoyé par e-mail). Reporter le domaine d'équipe
(`xxx.cloudflareaccess.com`) dans `ACCESS_TEAM_DOMAIN` et l'« Application Audience (AUD) Tag » dans `ACCESS_AUD`.

L'admin règle les horaires (plusieurs plages par jour), la durée, la pause, le délai minimal, l'horizon,
le maximum par jour, les jours bloqués et les créneaux exceptionnels ; elle liste les rendez-vous à venir
(déplacer, annuler, « Diagnostic tenu », « Client signé »), exporte en CSV et montre l'état des connexions.

### Rappels (Worker cron)

```bash
cd workers/rappels
# renseigner database_id dans wrangler.toml (Cloudflare > D1 > leadvice)
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put MAIL_FROM
npx wrangler deploy
```

Toutes les 15 minutes, le Worker envoie le rappel de la veille et celui d'une heure avant.

## Mesure et consentement

Bannière cookies avec refus par défaut (Consent Mode v2). GTM, le Pixel Meta et LinkedIn ne se chargent qu'après
accord, et seulement si leur identifiant est défini. Les paramètres UTM, `gclid` et `fbclid` sont gardés pour la
session et envoyés avec la demande. Événements : `begin_diagnostic`, `qualify_lead`, `generate_lead`, `schedule`
(navigateur, avec `event_id`), `Lead`, `QualifiedLead` et `Purchase` (serveur, API Conversions, dédoublonnés par
le même identifiant). `CAPI_SANS_CONSENTEMENT=1` envoie les événements serveur sans accord publicité : à valider
avec la CNDP avant de l'activer.

## Pages de contrôle

`/dev/design/` (jetons, contrastes, composants dans tous leurs états) et `/dev/animations/` (chaque scène avec un
curseur de progression) : non indexées, exclues du plan du site.

## Structure

```
src/components/   composants Astro (en-tête, pied de page, FAQ, rangées des leviers, scènes…)
src/layouts/      gabarit commun (méta, JSON-LD, fil d'Ariane, recherche, bandeau cookies)
src/pages/        une page par fichier ; og/ génère les images de partage au build
src/scripts/      core.ts (immédiat), motion.ts (après le premier rendu), scènes canvas, réservation,
                  formulaire de diagnostic, ateliers, administration
src/styles/       jetons, base, composants, formulaires, styles par page
functions/api/    Pages Functions (créneaux, réservations, diagnostic, administration)
server/           code partagé des fonctions (fuseau, créneaux, e-mails, Google Agenda, CAPI, D1)
workers/rappels/  Worker des rappels
migrations/       schéma D1
scripts/          audit et captures
apercus/          captures de chaque phase et scores Lighthouse
```
