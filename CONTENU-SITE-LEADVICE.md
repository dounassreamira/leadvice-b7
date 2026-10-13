# Contenu définitif du site Leadvice

Ce fichier contient tous les textes du site, page par page. Claude Code les intègre tels quels, sans les réécrire. Quand un texte de ce fichier diffère d'un texte cité dans `PROMPT-MAITRE-LEADVICE.md` ou `ANIMATIONS-SCROLL-LEADVICE.md`, c'est ce fichier qui fait foi. Les six articles Insights sont dans `CONTENU-INSIGHTS.md`.

Conventions : les textes entre guillemets « » sont affichés tels quels. Les indications en italique sont des consignes, pas du texte à afficher.

---

## 0. Ce qui a changé par rapport au premier jet, et pourquoi

Le premier jet du contenu était surtout écrit pour l'animation : des phrases courtes et belles, mais trop abstraites pour un dirigeant qui arrive d'une recherche Google ou d'une publicité. Un directeur marketing qui lit « Trouvez le signal » ne sait toujours pas, au bout de cinq secondes, ce que vous vendez. Les corrections vont toutes dans le même sens : garder la poésie dans les scènes, et mettre du concret partout où le visiteur prend une décision.

- **Le H1 dit ce que vous apportez.** « Moins de bruit. Plus de clients. » remplace « Trouvez le signal qui fait croître votre entreprise. » La métaphore du signal reste dans les scènes animées ; le titre parle de résultat. Le sous-titre contient les mots que vos prospects tapent dans Google (cabinet de conseil, stratégie marketing, acquisition client, Meta Ads, Google Ads, Casablanca).
- **Le diagnostic est enfin défini.** Partout, le bouton disait « Demander un diagnostic » sans dire ce que c'est. C'est maintenant un premier échange de 45 minutes, offert, dont le visiteur sait ce qu'il retire. Un bouton dont on connaît la contrepartie est beaucoup plus cliqué.
- **Les formats d'accompagnement apparaissent.** Un acheteur B2B veut savoir comment on travaille avec vous avant d'écrire. Trois formats sont décrits, sans prix.
- **Chaque page levier répond à « pour moi ? »** avec trois situations concrètes dans lesquelles un dirigeant se reconnaît.
- **Les preuves sont reliées à la méthode.** Les chiffres ne sont plus posés seuls : chacun est rattaché à ce qu'il démontre.
- **La sélectivité se lit sans s'annoncer.** Les situations décrites, le vocabulaire (direction marketing, comité, plusieurs programmes, plusieurs canaux) et les questions de qualification parlent à des entreprises établies, sans jamais écrire qu'on refuse les petites.
- **Le ton est plus direct et plus incarné.** Le cabinet parle à la première personne du pluriel, sans jargon, avec des phrases qu'on pourrait dire en rendez-vous.

## 0 bis. Décisions prises dans ce fichier, à valider par Amira

Tout est rédigé et intégrable en l'état. Ces points engagent toutefois le cabinet, donc relis-les avant de lancer Claude Code :

1. **Le diagnostic** : un échange de 45 minutes, offert, en visio ou par téléphone, suivi d'une proposition seulement si elle a du sens. C'est le format que tu as déjà utilisé en prospection.
2. **Les trois formats d'accompagnement** (section 2, page Expertises) : Diagnostic et plan d'action, Accompagnement acquisition (mensuel), Conseil stratégique (en mission). Aucun prix ni durée minimale n'est affiché.
3. **La directrice de la publication** dans les mentions légales : Amira Dounassre. Remplace-la par la gérante en titre si ce n'est pas toi.
4. **Zone d'intervention** : tout le Maroc, et à distance pour les entreprises qui ciblent le Maroc ou les Marocains résidant à l'étranger.
5. **Conservation des données du formulaire** : 24 mois, choix des cookies conservé 6 mois.
6. **Répartition des rôles affichée** : Nada mène les diagnostics, la stratégie et le cadrage ; Amira l'acquisition et les campagnes.
7. **Engagements de service** : les comptes publicitaires appartiennent au client ; le budget publicitaire est payé directement aux plateformes, séparément des honoraires.
8. **Étude de cas Kettani** : les sept programmes sont présentés comme résidentiels, sauf Corporate. Corrige une ligne si un programme est d'une autre nature.

## 0 ter. Révision après l'analyse des six sites de référence

L'étude d'oryzo.ai, why.zero.university, mindmarket.com, mont-fort.com, davidwhyte.com/experience et era-residence.com (voir `reference/ANALYSE.md`) a changé le contenu sur ces points :

- **Plus de sur-titre au-dessus du H1.** Les mots-clés « cabinet de conseil stratégique et marketing, Casablanca » sont dans le title, la meta description et le sous-titre ; l'étiquette au-dessus du titre faisait gabarit.
- **Un seul nom pour l'action principale.** « Demander un diagnostic » partout (en-tête, scènes, pied de page). « Parlons-nous » disparaît : deux noms pour la même action font hésiter.
- **Plus de flèches dans les libellés**, et des liens qui disent où ils mènent (« La stratégie en détail » au lieu de « Découvrir »). Meilleur pour le clic, l'accessibilité et le référencement interne.
- **Un bandeau animé des huit logos clients juste après l'ouverture**, tous au même rang (aucun client mis en avant). Kettani n'est jamais le client central : il n'apparaît qu'à égalité dans le bandeau et la grille, et dans son étude de cas.
- **Un site multipage, animé du haut vers le bas sur chaque page** : un fil de signal violet se dessine au défilement d'un bout à l'autre de chaque page, chaque expertise a sa scène racontée (nœud, prisme, phare, cadran), les textes s'allument au passage, les chiffres se composent. Référence visuelle : le prototype `prototype/` livré avec ce pack.
- **Une FAQ sur l'accueil**, cinq questions, dont le coût par lead. C'est ce que les moteurs IA citent et ce qu'un acheteur demande en premier.
- **Les textes des interactions sont écrits** : micro-légendes du funnel et de la scène Angle, phrase sur la courbe dans Preuves, compteur du carrousel, « Revoir l'ouverture », phrase finale du pied de page.
- **Bannière cookies équitable** : « Tout refuser » a le même poids que « Tout accepter ».
- **Plus de chaînes à points médians ni d'anglicismes de titre** (« Strategy Lead » devient « responsable stratégie »).

---

## 1. Éléments communs à toutes les pages

### Header
- Logo : LEADVICE
- Navigation : « Expertises » · « Réalisations » · « Le cabinet » · « Insights »
- Bouton : « Demander un diagnostic » (sous 640 px : « Diagnostic »)
- Interrupteur de mode : libellé accessible « Mode sombre »
- Recherche : libellé accessible « Rechercher sur le site » ; raccourci affiché « ⌘K »
- Mobile : bouton « Menu » / « Fermer »
- Lien d'évitement : « Aller au contenu »

### Sous-menu Expertises (en-tête)
Ordinateur : « Expertises » reste un lien vers la page d'ensemble ; une flèche à côté ouvre le sous-menu (survol, clic, clavier, Échap ferme). Entrées, avec leur ligne d'aide : « Vue d'ensemble » (Les leviers et comment ils travaillent ensemble) · « Stratégie » (Comprendre avant d'agir) · « Création » (Le message qui fait agir) · « Acquisition » (Meta Ads, Google Ads, leads qualifiés) · « Pilotage » (Des chiffres qui deviennent des décisions) · « Sites web » (Des pages qui transforment les visites en demandes).
Mobile : « Expertises » ouvre la liste des mêmes entrées sous le titre, sans quitter le menu.

### Footer
- « LEADVICE »
- « Conseil stratégique & marketing. Casablanca, Maroc. »
- Colonne 1, titre « Le cabinet » : « Expertises » · « Réalisations » · « Le cabinet » · « Insights »
- Colonne 2, titre « Parlons-en » : « Demander un diagnostic » · « contact@leadvice.org » *(avec bouton copier)* · « Instagram »
- Colonne 3, titre « Informations » : « Mentions légales » · « Confidentialité » · « Cookies » · « Gérer les cookies »
- Ligne de bas : « © 2026 Leadvice SARL. Tous droits réservés. » + lien « Revoir l'ouverture » (remonte en haut de l'accueil et rejoue la séquence funnel)
- Mentions d'identification en très petit : « Leadvice SARL au capital de 100 000 DH. RC 527921, ICE 002978060000045, IF 51669892. Hay Laayoune, angle rue Ait Yaflmane, Fida n° 341, 2ᵉ étage, Casablanca. »
- Phrase au-dessus des colonnes, en grande serif : « Le bon client est déjà quelque part. Allons le chercher. » + bouton « Demander un diagnostic »

### Boutons et liens récurrents
- Principal : « Demander un diagnostic »
- Navigation : « Demander un diagnostic »
- Secondaires : « Découvrir les expertises », « Voir le cas Kettani », « Découvrir le cabinet », « Lire l'article », « Tous les insights » (aucune flèche ajoutée au texte : le soulignement animé suffit)
- Bouton flottant : libellé accessible « Nous écrire » ; panneau : « WhatsApp », « Écrire un e-mail », « Demander un diagnostic »
- Retour en haut : libellé accessible « Retour en haut de la page »

### Bloc « Le diagnostic » (réutilisé sous chaque CTA principal, en petit)
« 45 minutes, offert. Nous regardons vos campagnes, vos chiffres et votre offre. Vous repartez avec ce qui freine votre acquisition et par quoi commencer. »

### Bannière cookies
- Texte : « Nous utilisons des cookies pour mesurer l'audience du site et la performance de nos publicités. Rien n'est activé sans votre accord. »
- Trois boutons de même poids : « Tout refuser », « Personnaliser », « Tout accepter »
- Panneau Personnaliser, titre : « Vos choix »
  - « Nécessaires » — « Indispensables au fonctionnement du site : mémoriser vos choix, protéger le formulaire contre les robots. Toujours actifs. »
  - « Mesure d'audience » — « Comprendre quelles pages sont lues et comment le site est utilisé (Google Analytics). »
  - « Publicité » — « Mesurer l'efficacité de nos campagnes sur Meta, Google et LinkedIn. »
  - Boutons : « Enregistrer mes choix » · « Tout accepter »

### Recherche
- Champ : « Rechercher un sujet, une expertise, une question… »
- Aucun résultat : « Aucun résultat. Essayez un autre mot, ou parlons-en directement. » + lien « Demander un diagnostic »
- Chargement : *(squelette, pas de texte)*
- Fermer : « Échap pour fermer »

### Copier
- Après copie : « Copié »
- Bouton article : « Copier le lien »

### Fenêtres de confirmation
- Quitter un diagnostic commencé : titre « Vous avez commencé votre demande. » — texte « Si vous quittez la page, vos réponses seront perdues. » — boutons « Continuer ma demande » · « Quitter »
- Recommencer le formulaire : titre « Effacer toutes vos réponses ? » — boutons « Garder mes réponses » · « Tout effacer »

### Maintenir pour révéler
Supprimé (décision d'Amira, octobre) : l'interaction n'apportait rien. Le manifeste du Cabinet se révèle au défilement : la phrase de gauche se barre et passe en gris, la réponse violette apparaît.

---

## 2. Accueil `/`

**Title** : « Leadvice — Cabinet de conseil stratégique & marketing à Casablanca »
**Meta description** : « Leadvice aide les entreprises à transformer leur marketing en clients : stratégie, création, Meta Ads, Google Ads et pilotage de la performance. Diagnostic offert. »

### Ouverture (premier écran, sans animation qui retarde la lecture)
- H1 : « Moins de bruit. Plus de clients. »
- Texte : « Leadvice est un cabinet de conseil en stratégie marketing et en acquisition client, à Casablanca. Nous trouvons ce qui compte dans votre marketing, puis nous le mettons en mouvement : stratégie, création, Meta Ads, Google Ads, pilotage. »
- Bouton : « Demander un diagnostic » ; dessous : « 45 minutes, offert. Réponse sous un jour ouvré. »
- Indication en bas, qui disparaît au premier défilement : « Défilez : voici comment un budget devient des clients »
- L'ouverture et la scène « Du bruit au client » forment une seule section continue (voir `DESIGN-LEADVICE.md` 6.23 quinquies).

### Scène « Du bruit au client » (remplace la séquence funnel et les colonnes de points)
Concept : une foule de petites silhouettes, en grille, représente les personnes qui voient la publicité. À chaque étape, une barre de lumière violette balaie la foule de gauche à droite comme un filtre : ceux qui ne passent pas pâlissent, ceux qui restent se foncent. À la fin, les quelques clients deviennent violets, sortent de la foule, s'alignent au centre et une ligne lumineuse se trace sous eux. Lecture immédiate sur mobile comme sur desktop : une phrase à la fois en haut, la foule au centre, un rail de cinq étapes en bas. Aucun texte dans le dessin.
- Légende : « Du bruit au client »
- Étape 1 : « Des milliers de personnes voient votre publicité. »
- Étape 2 : « Une partie clique. »
- Étape 3 : « Quelques-uns laissent leurs coordonnées. »
- Étape 4 : « Certains ont un vrai projet. »
- Étape 5 : « Ceux-là deviennent vos clients. Notre métier : qu'il y en ait plus, pour moins cher. »
- Rail : « Audience », « Clic », « Contact », « Projet », « Client »
- Proportions gardées à chaque étape (visuelles, aucun chiffre affiché) : 100 %, 45 %, 16 %, 7 %, puis 4 à 7 clients.

- Juste après la scène d'ouverture : nuage de clients (huit logos sur des sphères qui flottent et scintillent, voir `DESIGN-LEADVICE.md` 6.23 bis). Centre : « Ils nous ont fait confiance. », « +23 », « entreprises accompagnées depuis 2022, de la compagnie aérienne à la marque de parfums. ». Libellé de chaque sphère au survol : nom et secteur (Frag'in : « Aromatique »).

### Scène Angle
- Titre : « Même offre. Trois histoires. »
- Texte d'introduction : « Prenons une salle de sport. La même offre peut se vendre par le prix, par le temps gagné ou par l'encadrement. Chaque angle parle à une autre personne, et chacune réagit à sa propre accroche. Avant de changer d'offre ou de budget, nous changeons d'angle. »
- Exemple B2C volontairement grand public (salle de sport fictive « Club Atlas, Casablanca »), présenté en trois fausses publicités Instagram, avec la mention « Exemple illustratif : la salle de sport et ses annonces sont fictives. » :
  - « Angle 1 sur 3, le prix » — « Votre forme, pour le prix d'un café par jour. » — cible « Pour les étudiants et les jeunes actifs » — bouton « Voir l'offre »
  - « Angle 2 sur 3, le temps » — « À deux rues de votre bureau. Une séance de 45 minutes. » — cible « Pour les cadres qui n'ont jamais le temps » — bouton « Réserver une séance »
  - « Angle 3 sur 3, l'encadrement » — « Un coach vous attend à chaque séance. » — cible « Pour ceux qui ont déjà abandonné une salle » — bouton « Essayer une semaine »
- Interaction : défilement horizontal épinglé (glissement natif sur mobile). Annonce pour lecteur d'écran : « Angle affiché : prix », puis « temps », puis « encadrement ».
- Phrase finale : « Le problème n'est pas toujours l'offre. C'est parfois l'angle. »

### Scène Système
- « Le marketing n'est pas une suite d'actions. »
- Mots : « Business » · « Data » · « Audience » · « Message » · « Media » · « Conversion » · au centre « Stratégie »
- « C'est un système. »
- Texte court sous la scène : « Une campagne qui fonctionne repose sur une offre claire, un message juste, une audience bien choisie et des chiffres lus chaque semaine. Quand un seul de ces éléments manque, le budget part ailleurs. Notre travail consiste à les faire tenir ensemble. »

### Scène Les quatre leviers
- Titre : « Quatre leviers. Un seul objectif : des clients. »
- Stratégie — « Comprendre avant d'agir. » — « Audit, positionnement, plan d'action : nous clarifions où aller avant de dépenser un dirham. » — « La stratégie en détail »
- Création — « Trouver le message qui mérite d'être vu. » — « Angles, accroches, publicités et contenus pensés pour faire agir, pas seulement pour plaire. » — « La création en détail »
- Acquisition — « Mettre le bon message devant les bonnes personnes. » — « Meta Ads, Google Ads et génération de leads, avec des formulaires qui qualifient avant de compter. » — « L'acquisition en détail »
- Pilotage — « Mesurer. Comprendre. Optimiser. » — « Des chiffres suivis chaque semaine, des décisions prises avec vous, des campagnes qui progressent. » — « Le pilotage en détail »
- Lien final : « Découvrir les expertises »
- Phrase discrète sous les rangées : « Vos publicités renvoient vers un site qui ne convertit pas ? Nous concevons aussi des sites et des pages de destination pensés pour vos campagnes. » (lien sur « des sites et des pages de destination » vers `/expertises/sites-web/`)

### Scène Le chemin d'un dirham (entre les quatre leviers et les preuves)
- Titre : « Le chemin d'un dirham. »
- Scène épinglée, quatre légendes au défilement :
  - « Vos dirhams partent en publicité. »
  - « Il devient des prospects. Les bons restent, les autres tombent. »
  - « Les bons deviennent des clients. Et les clients paient. »
  - « Et l'argent revient. Notre travail : qu'il revienne plus gros qu'il n'est parti. » + lien « Simuler votre propre flux » vers le simulateur de la page Acquisition.
- Étiquettes du schéma : « Budget investi », « Publicité », « Clients », « Chiffre d'affaires ». Billets, personnes et pièces d'or animés (voir `DESIGN-LEADVICE.md` 6.23 ter). Aucun chiffre affiché.
- Sous le nuage de clients, indication : « Attrapez une sphère et lancez-la » (desktop) ou « Touchez une sphère pour la lancer » (mobile).

### Scène Preuves
- Titre : « Des résultats qui se comptent. »
- « +1 000 » — « leads générés chaque mois pour nos clients »
- « +10 893 » — « prospects générés »
- « 126 » — « campagnes lancées »
- « +23 » — « clients accompagnés »
- « +300 » — « posts et créatives publicitaires produits »
- « < 1 $ » — « coût moyen par lead sur Meta Ads, constaté sur nos clients »
- « 1 à 2 $ » — « coût moyen par lead sur Google Ads, constaté sur nos clients »
- Note sous les chiffres, petit : « Chiffres cumulés depuis la création du cabinet. »
- Titre clients : « Des entreprises. Des problématiques différentes. Une même exigence. »
- Phrase qui suit la courbe du ruban de signal (texte sur courbe, aussi présent en HTML pour Google et les lecteurs d'écran) : « Chaque chiffre ici a commencé par une question simple : à qui parle-t-on vraiment ? »
- Pas de carrousel centré sur un client : les chiffres suffisent ici, les logos sont déjà dans le bandeau. Lien « Voir les réalisations ».
- Lien : « Voir les réalisations »

### Scène Méthode
- Rail des étapes numéroté de 1 à 5 (vraie séquence) ; l'étape courante porte le liseré d'activation.
- Titre : « Notre méthode, en cinq temps. »
- « Diagnostiquer » · « Structurer » · « Exécuter » · « Mesurer » · « Optimiser »
- Fin : « Un système qui apprend. »

### Scène Humain
- « Derrière les données, il y a toujours une décision humaine. »
- Amira Dounassre — « Cofondatrice » — « Acquisition, digital, transformation »
- Nada Moujibi — « Cofondatrice, responsable stratégie » — « Stratégie, audit, business »
- Texte : « Leadvice, ce sont deux ingénieures qui ont choisi le conseil. L'une vient de la technologie et de l'acquisition, l'autre de l'audit et de la stratégie. Vous travaillez directement avec elles. »
- Lien : « Découvrir le cabinet »

### FAQ de l'accueil (liste en grande serif, balisage FAQPage)
Titre : « Les questions qu'on nous pose avant de commencer. »
1. **« Que fait exactement Leadvice ? »** — « Nous sommes un cabinet de conseil en stratégie marketing et en acquisition client, basé à Casablanca. Nous clarifions votre stratégie, créons les messages et les publicités, lançons et pilotons vos campagnes Meta Ads et Google Ads, et lisons les chiffres avec vous jusqu'aux ventes. »
2. **« Combien coûte un lead avec Leadvice ? »** — « Sur l'ensemble de nos clients, le coût moyen par lead constaté est inférieur à 1 $ sur Meta Ads et se situe entre 1 et 2 $ sur Google Ads. Il varie selon le secteur et le prix de ce que vous vendez : un bien immobilier à plusieurs millions de dirhams coûte plus cher à vendre qu'un produit du quotidien. Le chiffre qui compte vraiment est le coût par client. »
3. **« À qui s'adresse votre accompagnement ? »** — « À des entreprises qui investissent déjà dans leur marketing et veulent que cet investissement produise des clients : promoteurs immobiliers, banques et services financiers, transport, services B2B, marques. Le plus souvent, nous travaillons avec la direction générale ou la direction marketing. »
4. **« Que se passe-t-il pendant le diagnostic offert ? »** — « Un échange de 45 minutes, en visio ou par téléphone. Nous regardons vos campagnes, vos chiffres et votre offre. Vous repartez avec ce qui freine votre acquisition et par quoi commencer, que vous travailliez avec nous ensuite ou non. »
5. **« Les comptes publicitaires nous appartiennent-ils ? »** — « Oui. Les comptes Meta et Google sont à votre nom, et le budget publicitaire est payé directement aux plateformes, séparément de nos honoraires. »

### Scène Clôture
- « Et si nous trouvions votre signal ? »
- Bouton : « Demander un diagnostic »
- Petit : « 45 minutes, offert. Nous regardons vos campagnes, vos chiffres et votre offre. Vous repartez avec ce qui freine votre acquisition et par quoi commencer. »

### Version codée de repli (scènes 1 à 4, tant que la séquence funnel n'existe pas)
Mêmes textes que la séquence funnel. Mots de la scène Bruit : « Audience » · « Data » · « Contenu » · « Media » · « Campagne » · « Search » · « Conversion » · « CRM ».

---

## 3. Expertises `/expertises/`

**Title** : « Expertises — Stratégie, création, acquisition, pilotage | Leadvice »
**Meta description** : « Stratégie marketing, création publicitaire, Meta Ads, Google Ads, génération de leads et pilotage de la performance : les quatre leviers d'acquisition de Leadvice. »

- H1 : « Ce qui doit changer dans votre marketing. »
- Réponse directe : « Leadvice intervient sur quatre leviers : la stratégie, la création, l'acquisition et le pilotage. Nous pouvons prendre en charge un levier précis ou les quatre ensemble, mais nous les pensons toujours comme un seul système, parce qu'une bonne campagne ne rattrape pas une offre floue, et qu'une bonne offre ne se vend pas sans les bonnes personnes en face. »

Les quatre univers (titre, phrase, lien) : reprendre la scène Les quatre leviers de l'accueil, avec le lien « Découvrir l'expertise ».

### Bloc « Trois façons de travailler avec nous »
- Titre : « Trois façons de travailler avec nous. »
- **Diagnostic et plan d'action** — « Une mission courte pour savoir où vous en êtes. Nous auditons votre offre, vos campagnes, vos contenus et vos chiffres, puis nous vous remettons un plan d'action hiérarchisé : ce qu'il faut arrêter, corriger et lancer, dans quel ordre. Vous pouvez l'exécuter avec vos équipes ou avec nous. »
- **Accompagnement acquisition** — « Un accompagnement mensuel. Nous construisons la stratégie, produisons les créations, gérons vos campagnes Meta Ads et Google Ads et suivons les chiffres chaque semaine avec vous. C'est le format que choisissent les entreprises qui veulent un flux régulier de prospects qualifiés. »
- **Conseil stratégique** — « Une mission de conseil sur un sujet précis : positionnement, structuration de l'offre, lancement d'un produit ou d'un programme, organisation de l'équipe marketing. Nous travaillons avec la direction, jusqu'aux décisions. »
- Lien : « Demander un diagnostic »

Fin de page :
- « Ces leviers ne fonctionnent pas seuls. »
- « La stratégie oriente la création. La création nourrit l'acquisition. L'acquisition produit des données. Les données corrigent la stratégie. »

---

## 4. Stratégie `/expertises/strategie/`

**Title** : « Conseil en stratégie marketing à Casablanca | Leadvice »
**Meta description** : « Audit marketing, positionnement, structuration de l'offre et plan d'action : Leadvice clarifie votre stratégie avant d'investir dans l'acquisition. »

- H1 : « Comprendre avant d'agir. »
- Réponse directe : « Le conseil en stratégie marketing de Leadvice consiste à clarifier trois choses avant de dépenser en publicité : à qui vous vendez, ce qui vous distingue et par quoi commencer. Nous auditons l'existant, nous tranchons les priorités avec la direction, et nous remettons un plan d'action que vos équipes peuvent exécuter dès le lendemain. »

### Textes de la séquence `noeud`
- 0-0,4 : « Trop d'options. Trop d'avis. Trop de priorités. »
- 0,6-1 : « Une direction claire. »

### Ce que nous faisons
- **Audit marketing et digital.** « Nous analysons vos campagnes, vos contenus, votre site, votre parcours de conversion et vos chiffres. Nous cherchons ce qui coûte sans rapporter, ce qui marche sans être exploité, et ce qui manque. »
- **Positionnement.** « Nous formulons ce qui vous rend préférable à vos concurrents, dans des mots que vos clients comprennent. Un positionnement clair rend chaque campagne moins chère, parce que le message n'a plus à tout expliquer. »
- **Structuration de l'offre.** « Nous aidons à présenter l'offre sous une forme qui se vend : ce qui est mis en avant, ce qui est regroupé, ce qui est retiré. »
- **Stratégie d'acquisition.** « Quels canaux, pour quelles audiences, avec quels messages et quel budget. Nous construisons l'entonnoir complet, de la première exposition à la signature. »
- **Plan d'action.** « Un plan simple, hiérarchisé, actionnable. Pas un document qui finit dans un dossier : une liste de décisions et de chantiers, avec un ordre et des responsables. »
- **Accompagnement de la direction.** « Nous structurons votre vision, vos offres et votre organisation marketing, et nous restons présents pour les arbitrages. »

### Quand faire appel à nous
- « Vous investissez en publicité depuis des mois, les leads arrivent, mais les commerciaux disent qu'ils ne sont pas bons. »
- « Vous lancez un nouveau produit, un nouveau programme ou un nouveau marché, et l'équipe n'est pas d'accord sur le message. »
- « Plusieurs prestataires travaillent sur votre marketing et personne n'a la vue d'ensemble. »

### Comment nous travaillons
« Tout commence par un diagnostic : nous écoutons, puis nous analysons. Nous revenons avec un constat et des priorités, que nous discutons avec vous avant de les écrire. Le plan d'action est construit avec vos équipes, pour qu'il soit tenu. »

### FAQ
1. **« Quelle différence entre un audit et un diagnostic ? »** — « Le diagnostic est un premier échange de 45 minutes, offert, pour identifier ce qui freine votre acquisition. L'audit est une mission complète : nous analysons en profondeur vos campagnes, vos contenus, vos chiffres et votre parcours client, et nous remettons un plan d'action. »
2. **« Combien de temps dure une mission de stratégie ? »** — « Cela dépend du périmètre. Un audit avec plan d'action se mène en quelques semaines. Un accompagnement de la direction sur le positionnement ou l'offre peut s'étendre sur plusieurs mois, avec des points réguliers. Nous fixons le calendrier ensemble dès le départ. »
3. **« Faut-il déjà avoir des campagnes en cours ? »** — « Non. Si vous en avez, nous les analysons. Si vous n'en avez pas, nous partons de votre offre, de vos clients actuels et de votre marché pour construire la stratégie avant le premier lancement, ce qui évite de payer pour apprendre. »
4. **« Qui, chez vous, mène la mission ? »** — « Les fondatrices, directement. Nada Moujibi pilote les missions de stratégie et d'audit ; Amira Dounassre intervient sur tout ce qui touche à l'acquisition. »

CTA : « Demander un diagnostic »

---

## 5. Création `/expertises/creation/`

**Title** : « Création publicitaire et contenus qui convertissent | Leadvice »
**Meta description** : « Concepts créatifs, accroches, publicités statiques et vidéo, contenus pour les réseaux sociaux : des créations pensées pour l'acquisition, en français et en arabe. »

- H1 : « Trouver le message qui mérite d'être vu. »
- Réponse directe : « La création chez Leadvice sert l'acquisition : chaque publicité et chaque contenu doit arrêter la bonne personne et lui donner une raison d'agir. Nous travaillons l'angle avant le visuel, nous testons plusieurs accroches, et nous gardons ce que les chiffres valident, en français comme en arabe. »

### Textes de la séquence `prisme`
- 0-0,45 : « Même offre. »
- 0,5-0,85 : « Autre angle. »
- Au bout des faisceaux : « Prix », « Temps », « Encadrement » (même exemple que l'accueil)
- Fin : « Le problème n'est pas toujours l'offre. C'est parfois l'angle. »

### Ce que nous faisons
- **Concepts créatifs.** « Nous cherchons les angles qui parlent à chaque audience : le prix, le confort, la sécurité, le statut, l'investissement. Un même produit peut se vendre de plusieurs façons ; nous trouvons celles qui fonctionnent pour vous. »
- **Accroches.** « Les trois premières secondes d'une vidéo et la première ligne d'une publicité décident de tout. Nous écrivons et testons plusieurs accroches par campagne. »
- **Publicités statiques et vidéo.** « Formats pensés pour chaque placement, du fil d'actualité aux stories, avec une déclinaison par audience et par langue. »
- **Contenus pour les réseaux sociaux.** « Des contenus qui servent votre acquisition, pas seulement votre image : ils préparent la décision et rendent vos publicités plus efficaces. »
- **Français et arabe.** « Nous adaptons le message à la langue de l'audience, pas seulement les mots. Ce qui convainc en français ne se dit pas toujours de la même façon en arabe. »

### Quand faire appel à nous
- « Vos publicités sont belles, mais elles ne génèrent pas de demandes. »
- « Vous diffusez les mêmes visuels depuis des mois et le coût de vos contacts augmente. »
- « Vous visez plusieurs publics, en français et en arabe, avec un seul message. »

### Comment nous travaillons
« Nous partons de votre offre et de ce que vos meilleurs clients disent de vous. Nous proposons plusieurs angles, produisons une première série de créations, puis nous laissons les chiffres trancher. Les créations gagnantes sont déclinées ; les autres sont remplacées. »

### FAQ
1. **« Produisez-vous vous-mêmes les visuels et les vidéos ? »** — « Oui, nous concevons et produisons les créations publicitaires. Pour les tournages plus ambitieux, nous dirigeons la création et travaillons avec des partenaires de production. »
2. **« Combien de créations faut-il pour une campagne ? »** — « Assez pour tester plusieurs angles à la fois. Nous commençons toujours par une série qui compare des approches différentes, plutôt que plusieurs variantes d'une même idée. »
3. **« Pouvez-vous travailler à partir de notre charte graphique ? »** — « Oui. Nous respectons votre identité visuelle et nous la déclinons pour la publicité, où les contraintes ne sont pas les mêmes que sur une plaquette. »
4. **« Créez-vous en arabe ? »** — « Oui, en arabe et en français, en adaptant le message à chaque audience plutôt qu'en traduisant mot à mot. »

CTA : « Demander un diagnostic »

---

## 6. Acquisition `/expertises/acquisition/`

**Title** : « Génération de leads, Meta Ads et Google Ads au Maroc | Leadvice »
**Meta description** : « Campagnes Meta Ads et Google Ads, génération de leads qualifiés, formulaires qui trient avant de compter : moins de 1 $ par lead en moyenne sur Meta Ads chez nos clients. »

- H1 : « Mettre le bon message devant les bonnes personnes. »
- Réponse directe : « Leadvice conçoit et gère vos campagnes d'acquisition sur Meta Ads et Google Ads, de la structure des campagnes au suivi des leads. Notre objectif n'est pas le volume de contacts, c'est le nombre de prospects avec qui vos commerciaux ont envie de parler. Chez nos clients, le coût moyen par lead est inférieur à 1 $ sur Meta Ads et se situe entre 1 et 2 $ sur Google Ads. »

### Textes de la séquence `phare`
- 0-0,4 : « Parler à tout le monde, c'est ne parler à personne. »
- 0,6-0,9 : « Le bon message, devant les bonnes personnes. »
- Fin : « Moins de 1 $ par lead sur Meta Ads, 1 à 2 $ sur Google Ads : coût moyen constaté sur nos clients. »

### Simulateur (après « Ce que nous faisons », ancre `#simulateur`)
- Titre : « Simulez le chemin de votre budget. »
- Intro : « Bougez les curseurs : le schéma montre ce que deviennent vos dirhams, du budget publicitaire jusqu'aux ventes. »
- Onglet « Vous cherchez des prospects » : budget publicitaire mensuel (10 000 MAD, curseur de 2 000 à 200 000 MAD, pour qu'aucun prospect ne se sente exclu dès le premier écran), coût par lead (10 MAD, notre moyenne Meta constatée), leads qualifiés (70 %), leads qualifiés qui signent (10 %), valeur d'un client (5 000 MAD). Résultats : leads reçus par mois, coût par lead (avec l'équivalent en dollars), nouveaux clients par mois, coût pour gagner un client, chiffre d'affaires généré, « chaque dirham investi rapporte × … ».
- Onglet « Vous vendez en ligne » : budget (10 000 MAD), coût par visite (1,2 MAD), taux de conversion (4 %), commandes livrées avec paiement à la livraison (92 %), panier moyen (450 MAD). Résultats : visites, commandes par mois, commandes livrées, coût par commande livrée, chiffre d'affaires livré, « chaque dirham investi rapporte × … ».
- Phrase de synthèse qui se met à jour : « Avec ces réglages, 10 000 MAD de publicité deviennent 70 clients et 350 000 MAD de chiffre d'affaires, soit × 35. » (vente en ligne : 307 commandes livrées, 138 000 MAD, × 13,8). Réglages très optimistes, décision d'Amira : le marché est compétitif et l'outil sert à donner envie de réserver le diagnostic.
- Bouton dans le simulateur : « Calculer mes vrais chiffres en 45 minutes » (ouvre la réservation), avec « Diagnostic offert : nous refaisons ce calcul avec vos données réelles. »
- Note : « Simulation indicative, réglée par défaut sur notre coût moyen par lead constaté sur Meta Ads (moins de 1 $, soit environ 10 MAD). Les taux réels dépendent de votre secteur, de votre offre et de vos campagnes : nous les estimons avec vous pendant le diagnostic. »
- Le schéma du chemin d'un dirham se met à jour en direct (largeur des bandes, hauteur du chiffre d'affaires, épaisseur du retour).

### Ce que nous faisons
- **Meta Ads (Facebook et Instagram).** « Nous structurons vos campagnes en entonnoir : faire connaître, faire considérer, faire agir. Chaque étape a ses audiences, ses messages et son budget. »
- **Google Ads.** « Search pour capter ceux qui cherchent déjà une solution comme la vôtre, Display pour rester présent pendant leur réflexion. »
- **Génération de leads.** « Des formulaires conçus pour qualifier : objectif, rôle, budget, situation actuelle. Vos équipes reçoivent moins de contacts inutiles et savent qui rappeler en premier. »
- **Ciblage et segmentation.** « Nous construisons des audiences précises, par intérêt, par comportement et à partir de vos propres données, et nous excluons celles qui coûtent sans convertir. »
- **Media buying.** « Répartition du budget entre canaux, campagnes et audiences, ajustée chaque semaine selon ce qui produit des clients, pas des clics. »

### Quand faire appel à nous
- « Vos campagnes génèrent des leads, mais vos commerciaux passent leurs journées à appeler des personnes qui n'achèteront pas. »
- « Votre coût par lead augmente et personne ne sait vraiment pourquoi. »
- « Vous voulez lancer l'acquisition en ligne sérieusement, avec une structure qui tienne quand le budget augmente. »

### Comment nous travaillons
« Nous commençons par la fin : ce qu'est un bon client pour vous. Nous construisons ensuite les campagnes, les formulaires et le suivi qui permettent de le trouver, puis nous lisons les chiffres chaque semaine avec vous pour déplacer le budget là où il rapporte. »

### FAQ
1. **« Quel budget publicitaire faut-il prévoir ? »** — « Il dépend de votre marché, de votre panier moyen et du nombre de clients que vous visez. Nous le calculons avec vous à partir de vos objectifs, pas l'inverse. Le budget publicitaire est payé directement aux plateformes, séparément de nos honoraires. »
2. **« Comment faites-vous pour obtenir des leads de qualité ? »** — « En triant avant de compter : des audiences précises, des messages qui attirent les bonnes personnes et repoussent les autres, et des formulaires qui posent les questions utiles. Nous suivons ensuite ce que deviennent les leads, pas seulement leur nombre. »
3. **« Les comptes publicitaires nous appartiennent-ils ? »** — « Oui. Les campagnes sont gérées dans vos comptes Meta et Google, ou dans des comptes créés à votre nom. Les données et l'historique restent chez vous. »
4. **« Pouvez-vous aussi créer nos pages de destination ? »** — « Oui. Une campagne qui renvoie vers une page pensée pour elle convertit mieux qu'une page d'accueil générale. Nous concevons ces pages, ou un site complet, dans notre offre Sites web. » (lien vers `/expertises/sites-web/`)
5. **« En combien de temps arrivent les premiers leads ? »** — « Souvent dans les jours qui suivent le lancement. Pour juger une campagne et l'optimiser sérieusement, il faut en revanche quelques semaines de données. »

CTA : « Demander un diagnostic »

---

## 7. Pilotage `/expertises/pilotage/`

**Title** : « Pilotage de la performance marketing et reporting | Leadvice »
**Meta description** : « Suivi hebdomadaire des campagnes, reporting utile, optimisation continue et co-pilotage avec vos équipes : Leadvice transforme vos chiffres en décisions. »

- H1 : « Mesurer. Comprendre. Optimiser. »
- Réponse directe : « Le pilotage, chez Leadvice, consiste à transformer les chiffres de vos campagnes en décisions. Nous suivons les indicateurs qui comptent chaque semaine, nous expliquons ce qui change et pourquoi, et nous ajustons budgets, audiences et messages avec vos équipes. »

### Textes de la séquence `cadran`
- Labels : « Mesurer » (0,25) · « Comprendre » (0,5) · « Ajuster » (0,75)
- Fin : « Un système qui apprend. »

### Ce que nous faisons
- **Suivi hebdomadaire.** « Chaque semaine, les chiffres sont relus : coût par lead, qualité des leads, taux de transformation, budget consommé. Les écarts sont repérés tôt. »
- **Reporting utile.** « Des bilans qui disent ce qui s'est passé, pourquoi, et ce que nous faisons ensuite. Pas de tableau de quarante lignes que personne ne lit. »
- **Optimisation continue.** « Budgets déplacés, audiences resserrées, créations remplacées : la campagne d'aujourd'hui n'est pas celle du lancement. »
- **Audits de campagnes.** « Détection des anomalies de coût, lecture par objectif et par étape de l'entonnoir, recalcul des indicateurs qui faussent la lecture. »
- **Co-pilotage.** « Nous travaillons avec vos équipes marketing et commerciales, pour que les chiffres des campagnes rencontrent ceux des ventes. »

### Quand faire appel à nous
- « Vous recevez des rapports, mais vous ne savez pas quelle décision en tirer. »
- « Le marketing et les commerciaux ne parlent pas des mêmes chiffres. »
- « Vos campagnes tournent seules depuis des mois sans que personne ne les remette en question. »

### Comment nous travaillons
« Nous définissons avec vous les indicateurs qui comptent pour votre activité, nous mettons en place le suivi, puis nous tenons un rendez-vous régulier où chaque chiffre est accompagné d'une décision. »

### FAQ
1. **« Quels indicateurs suivez-vous ? »** — « Ceux qui mènent à vos ventes : coût par lead, part de leads qualifiés, coût par opportunité, coût d'acquisition client. Les indicateurs de visibilité (impressions, clics) servent à comprendre, pas à juger. »
2. **« À quelle fréquence recevons-nous un bilan ? »** — « Les chiffres sont suivis chaque semaine. Le format et le rythme des bilans sont fixés avec vous au démarrage, pour qu'ils servent vraiment à décider. »
3. **« Pouvez-vous reprendre des campagnes gérées par quelqu'un d'autre ? »** — « Oui. Nous commençons par un audit de l'existant pour comprendre ce qui fonctionne et ce qui doit changer, avant de toucher quoi que ce soit. »
4. **« Faut-il un CRM ? »** — « C'est préférable pour suivre ce que deviennent les leads, mais ce n'est pas indispensable pour commencer. Nous nous adaptons à vos outils et nous vous conseillons si un changement s'impose. »

CTA : « Demander un diagnostic »

---

## 7 bis. Sites web `/expertises/sites-web/` (service complémentaire)

- Title : « Création de site web et landing pages qui convertissent | Leadvice »
- Meta : « Sites vitrines, pages de destination et parcours de prise de rendez-vous conçus pour l'acquisition : rapides, bien référencés, mesurés et faciles à mettre à jour. »
- H1 : « Un site qui transforme les visites en demandes. »
- Réponse directe : « Leadvice conçoit des sites et des pages de destination pensés pour l'acquisition. Nous partons de ce que vos campagnes promettent et de ce que vos clients demandent, puis nous construisons des pages rapides, claires et mesurées, qui mènent à une seule action : vous contacter, réserver ou acheter. »

### Textes de la scène « La page qui se construit »
« Des pages, des blocs, des idées en vrac. » · « Chaque élément trouve sa place, et son rôle. » · « Un seul geste demandé. Et une demande qui arrive. » Étiquettes : Assembler · Clarifier · Convertir.

### Ce que nous faisons
- **Sites vitrines.** « Le site de votre entreprise, construit autour de ce que vos clients cherchent à savoir avant de vous appeler : ce que vous faites, pour qui, pourquoi vous, et comment vous joindre. »
- **Pages de destination.** « Une page par campagne, par offre ou par audience. Le message de la publicité se prolonge sur la page, au lieu de se perdre sur une page d'accueil générale. »
- **Prise de rendez-vous et formulaires.** « Formulaires courts qui qualifient, réservation de créneaux reliée à votre agenda, confirmations et rappels automatiques. »
- **Mesure des conversions.** « Chaque demande est remontée à Meta et à Google, avec la source qui l'a amenée. Vos campagnes apprennent à trouver plus de personnes comme celles qui vous contactent. »
- **Vitesse et référencement.** « Des pages légères qui s'affichent vite sur mobile, une structure que Google et les moteurs de réponse comprennent, et des contenus écrits pour vos clients. »
- **Autonomie.** « Vous modifiez vos textes, vos images et vos articles vous-même, sans dépendre de nous pour chaque changement. »

### Quand faire appel à nous
- « Vos publicités renvoient vers une page d'accueil générale, et les visiteurs repartent sans rien demander. »
- « Votre site date de plusieurs années, il est lent sur mobile et vous n'osez plus l'envoyer. »
- « Vous lancez une offre et vous avez besoin d'une page prête avant la campagne, pas trois mois après. »

### Comment nous travaillons
« Nous commençons par le parcours : d'où viennent vos visiteurs, ce qu'ils doivent comprendre, l'action qu'on attend d'eux. Viennent ensuite les textes, puis le design et la construction. Le site est mesuré dès sa mise en ligne, et nous l'ajustons selon ce que les chiffres montrent. Ce site, nous l'avons conçu nous-mêmes, avec les mêmes règles. »

### FAQ
1. « Faites-vous des sites sans campagnes publicitaires ? » — « Oui. Un site bien construit sert aussi votre référencement, vos commerciaux et vos partenaires. Nous le pensons simplement pour qu'il soit prêt le jour où vous lancez vos campagnes. »
2. « Combien de temps faut-il pour créer un site ? » — « Une page de destination se livre en quelques jours. Un site vitrine complet demande quelques semaines, selon le nombre de pages et la disponibilité des contenus. Nous fixons le calendrier ensemble au départ. »
3. « Pourrons-nous modifier le site nous-mêmes ? » — « Oui. Vous disposez d'une interface simple pour changer vos textes, vos images et publier des articles. Le site vous appartient, ainsi que le nom de domaine. »
4. « Le site sera-t-il en français et en arabe ? » — « Si votre audience le demande, oui. Nous adaptons les pages à chaque langue plutôt que de traduire mot à mot. »
5. « Reprenez-vous un site existant ? » — « Oui. Nous commençons par l'auditer : ce qui peut rester, ce qui freine les demandes, ce qui doit être refait. Parfois, quelques pages refaites suffisent. »

À valider par Amira : les délais (« quelques jours », « quelques semaines ») et l'option arabe. Aucune réalisation de site client n'est montrée tant qu'aucune n'est fournie.

CTA : « Demander un diagnostic »

---

## 7 ter. Scènes refaites (création, acquisition), bouton flottant, 404

Création, légendes de la scène « Une offre, trois angles » : « Même offre. » · « Trois angles. Trois accroches. » · « Chacune parle à quelqu'un d'autre. » · « Le problème n'est pas toujours l'offre. C'est parfois l'angle. » Accroches : « 299 MAD par mois. Moins qu'un café par jour. » (prix, parle surtout aux étudiants) · « 45 minutes, trois fois par semaine. » (temps, cadres pressés) · « Un coach vous suit dès la première séance. » (encadrement, débutants). Bouton dans les pubs : « Essai gratuit ». Étiquette finale : « Retenu : temps ».

Acquisition, légendes de la scène « Du public aux leads qualifiés » : « Parler à tout le monde coûte cher. » · « Le ciblage garde ceux qui ont un projet. » · « Le formulaire trie avant de compter. » · « Moins de contacts. De meilleurs contacts. » Étapes : Diffuser · Cibler · Qualifier · Transmettre. Filtres : Intérêt, Zone, Comportement. Formulaire : Projet, Délai, Rôle. « Leads qualifiés », « Transmis à vos commerciaux ».

Bouton flottant : « Diagnostic offert », sous-ligne « 45 min, créneaux cette semaine ».

404 : sur-titre « Erreur 404 », H1 « Cette page a perdu le signal. », texte « Elle a peut-être changé d'adresse, ou n'a jamais existé. Passez la souris ou le doigt sur les chiffres : le signal se recolle. Le reste du site, lui, est bien là. », boutons « Retour à l'accueil », « Voir les expertises », lien « Demander un diagnostic ».

---

## 8. Réalisations `/realisations/`

**Title** : « Réalisations et clients | Leadvice »
**Meta description** : « Immobilier, banque, transport aérien, services IT, e-commerce : les entreprises qui ont confié leur stratégie et leur acquisition à Leadvice. »

- Hero : « Le marketing est plein de promesses. » puis « Nous préférons montrer. »
- Texte : « Des entreprises de secteurs très différents nous ont confié leur stratégie, leurs créations ou leur acquisition. Voici une partie d'entre elles. »
- Filtres : « Tous » · « Immobilier » · « Banque » · « Transport aérien » · « Services IT » · « E-commerce » · « Marques »
- Mur de logos : huit tuiles identiques (logo, nom, secteur), aucune plus grande que les autres. Sous les chiffres, un encart discret « Une étude de cas détaillée » : « Piloter l'acquisition de sept programmes immobiliers en parallèle. » + « Lire l'étude de cas ».
- Fiches des autres clients : nom + secteur, comme dans la section 2.5 du prompt maître.
- Bloc chiffres : reprendre les sept chiffres de la scène Preuves de l'accueil.
- CTA : « Votre entreprise pourrait être la prochaine. » + « Demander un diagnostic »

---

## 9. Étude de cas `/realisations/kettani-immobilier/`

**Title** : « Kettani Immobilier : sept programmes, une acquisition pilotée | Leadvice »
**Meta description** : « Comment Leadvice a structuré l'acquisition digitale de Kettani Immobilier sur sept programmes, avec Meta Ads et Google Ads : environ 41 000 leads en douze mois. »

### Textes de la séquence d'ouverture (si une séquence est placée ici) ou du hero
- « Sept programmes. Un cycle de vente long. »
- « Des prospects qualifiés, programme par programme. »

### En-tête
- Badge secteur au-dessus du H1 (information, pas étiquette décorative) : « Immobilier »
- H1 : « Kettani Immobilier : piloter l'acquisition de sept programmes à la fois. »
- Fiche : « Client » Kettani Immobilier · « Secteur » Immobilier haut de gamme · « Leviers » Stratégie, création, acquisition, pilotage · « Canaux » Meta Ads, Google Ads · « Période » avril 2025 – mars 2026

### Résultats en tête de page
- « ≈ 41 000 » — « leads générés via Meta Ads »
- « 7 » — « programmes accompagnés en parallèle »
- « 12 » — « mois d'accompagnement continu »

### Défilement horizontal des programmes
Titre : « Sept programmes, sept lectures. »
- « Aquarelle » — « Programme résidentiel, lecture des performances dédiée »
- « SDR » — « Programme résidentiel, opportunité Google Ads identifiée par l'audit »
- « Le Clos de Bouznika » — « Programme résidentiel, refonte complète du ciblage »
- « RDG » — « Programme résidentiel, lecture des performances dédiée »
- « Ramoflores » — « Programme résidentiel, lecture des performances dédiée »
- « Les Jardins de Mansouria » — « Programme résidentiel, lecture des performances dédiée »
- « Corporate » — « Campagnes de marque du promoteur »

### Le contexte
« Kettani Immobilier commercialise des résidences haut de gamme, avec des appartements à plus de 1,9 million de dirhams. Sept programmes devaient être commercialisés en même temps, chacun avec sa localisation, son public et son rythme de vente. Sur ce marché, la décision d'achat prend des mois et passe par plusieurs visites : un contact n'a de valeur que s'il mène à un rendez-vous. »

### Le problème
« Un promoteur qui communique sur plusieurs programmes risque de tout mélanger : mêmes audiences, mêmes messages, budget réparti à l'aveugle. Le volume de contacts peut sembler bon pendant que les commerciaux rappellent des personnes qui n'ont ni le projet ni le budget. L'enjeu était d'obtenir des prospects qualifiés pour chaque programme, à un coût maîtrisé, et de savoir à tout moment lequel performait. »

### L'angle
« Nous avons traité chaque programme comme une campagne à part entière, avec sa lecture propre, au lieu d'un dispositif unique. Nous avons construit pour chacun un entonnoir complet : faire connaître le programme, entretenir l'intérêt de ceux qui le découvraient, puis amener les plus avancés à demander une visite. Et nous avons décidé de parler à chaque public dans sa langue, au sens propre comme au figuré. »

### L'exécution
- « Un dispositif Meta Ads et Google Ads couvrant les sept programmes, structuré en trois étages : découverte, considération, conversion. »
- « Des audiences hyper-segmentées, avec une refonte complète du ciblage sur Le Clos de Bouznika. »
- « Des créations déclinées par format, par programme et par langue, en arabe et en français, pour comparer ce qui convainc chaque public. »
- « Des contenus dédiés aux Marocains résidant à l'étranger, au ton empathique et non commercial, pour un public qui achète à distance et a besoin de confiance avant tout. »
- « Des audits réguliers des campagnes : repérage des anomalies de coût par lead, lecture séparée selon l'objectif de chaque campagne, recalcul des indicateurs qui faussaient la comparaison entre programmes. »
- « Un reporting mensuel et un bilan annuel, programme par programme. »

### Les résultats
« Sur douze mois, d'avril 2025 à mars 2026, le dispositif a généré environ 41 000 leads via Meta Ads sur l'ensemble des programmes. Chaque programme disposait de sa propre lecture des performances, ce qui a permis de déplacer le budget vers ce qui produisait des prospects qualifiés plutôt que de le répartir à parts égales. »

### Ce que nous avons appris
- « **La langue change la performance.** Une même offre ne convainc pas de la même façon en arabe et en français : il faut tester les deux, et lire les résultats séparément. »
- « **Le ciblage fin bat le volume.** Resserrer les audiences fait parfois baisser le nombre de contacts et monter leur valeur. Dans l'immobilier haut de gamme, c'est le bon échange. »
- « **Chaque programme mérite sa propre lecture.** Une moyenne sur sept programmes cache toujours un programme qui souffre et un autre qui mériterait plus de budget. »
- « **Un levier absent est une opportunité.** L'audit a montré que SDR n'avait aucune présence sur Google Ads : des personnes cherchaient activement ce type de bien sans tomber sur le programme. »

CTA : « Vous commercialisez plusieurs programmes, produits ou offres ? Parlons de votre acquisition. » + « Demander un diagnostic »

---

## 10. Le cabinet `/cabinet/`

**Title** : « Le cabinet — Leadvice, conseil stratégique & marketing à Casablanca »
**Meta description** : « Leadvice est un cabinet de conseil fondé à Casablanca en 2022 par deux ingénieures. Notre méthode, notre philosophie et nos fondatrices. »

- H1 : « Nous ne croyons pas aux recettes toutes faites. »

### Leadvice en trois phrases
« Leadvice est un cabinet de conseil en stratégie marketing et en acquisition client, fondé à Casablanca en 2022. Nous aidons les entreprises à transformer leur marketing en clients, en reliant la stratégie, la création, les campagnes et les chiffres. Nous conseillons, et nous exécutons ce que nous conseillons. »

### Manifeste (plein écran, maintenir pour révéler)
- « Pas plus de campagnes. » → « De meilleures décisions. »
- « Pas plus de contenu. » → « De meilleurs angles. »
- « Pas plus de leads. » → « De meilleurs prospects. »
- « Pas plus de reporting. » → « Plus de compréhension. »

### Ce qui nous distingue d'une agence
Titre : « Un cabinet, pas une agence. »
« Une agence exécute ce qu'on lui demande. Nous commençons par vérifier que c'est la bonne chose à demander. Chaque mission démarre par un cadrage, avec un objectif clair : des prospects et des ventes, pas de la visibilité. Nous lisons les chiffres avec vous chaque semaine, nous adaptons la solution à votre situation au lieu de vendre un forfait, et nous restons attentives à la vision d'ensemble de votre entreprise, pas seulement à vos campagnes. »

### Notre engagement
Titre : « Notre engagement. Clair et mesurable. »
- **Des résultats visibles sur votre activité.** « Nous ne parlons pas de buzz ni de vues. Nous parlons de prospects, de ventes et de croissance que vous pouvez mesurer. »
- **Une stratégie à votre mesure.** « Adaptée à votre marché, à vos moyens et à vos priorités. Nous vous conseillons comme si c'était notre propre entreprise, et chaque recommandation est applicable. »
- **Un accompagnement transparent.** « Un interlocuteur clair et réactif. Vous savez ce qui est fait, pourquoi on le fait, et ce que ça rapporte. Pas de jargon, pas de promesse floue. »

### Méthode (cinq cartes empilées)
Titre : « Notre méthode. »
1. **Diagnostiquer** — « Nous commençons par écouter. Puis nous analysons vos publicités, vos contenus et vos performances, pour trouver ce qui freine votre acquisition. »
2. **Structurer** — « Nous construisons un plan simple, hiérarchisé, actionnable. Publicité, contenu, stratégie, organisation : tout est aligné sur vos objectifs. »
3. **Exécuter** — « Nous mettons en place les actions et pilotons les campagnes, avec vos équipes ou à leur place. »
4. **Mesurer** — « Nous suivons les chiffres chaque semaine. Vous recevez des bilans qui servent à décider. »
5. **Optimiser** — « Nous ajustons ce qui doit l'être. Chaque semaine, le système apprend un peu plus. »

### Les fondatrices
Titre : « Derrière les données, il y a toujours une décision humaine. »

**Amira Dounassre** — Cofondatrice — « Acquisition, digital, transformation »
« Ingénieure d'État en informatique de l'École Mohammadia d'Ingénieurs, diplômée du Mastère Spécialisé de l'ESSEC en stratégie, transformation digitale et innovation, Amira a commencé dans l'informatique bancaire avant de se consacrer à l'acquisition. Elle conçoit et pilote les campagnes Meta Ads et Google Ads de Leadvice, de la structure de l'entonnoir à l'optimisation du coût d'acquisition. Sa conviction : un bon chiffre ne vaut rien s'il ne mène pas à une décision. »

**Nada Moujibi** — Cofondatrice, responsable stratégie — « Stratégie, audit, business »
« Ingénieure diplômée de l'École Mohammadia d'Ingénieurs, Nada a passé trois ans comme auditrice financière senior chez EY, sur des portefeuilles de clients de secteurs très variés. Elle apporte à Leadvice la rigueur de l'audit et une lecture business des sujets marketing : elle mène les diagnostics, les missions de stratégie et le cadrage des accompagnements. Sa conviction : on ne corrige bien que ce qu'on a vraiment compris. »

Liens LinkedIn : « Amira sur LinkedIn » (linkedin.com/in/amiradounassre) · « Nada sur LinkedIn » (linkedin.com/in/nada-moujibi)

### FAQ générale
1. **« Qu'est-ce qui distingue un cabinet de conseil d'une agence marketing ? »** — « Une agence exécute un brief. Un cabinet commence par vérifier que le brief est le bon : à qui vous vendez, avec quel message, sur quels canaux, et comment on saura si ça marche. Chez Leadvice, nous faisons les deux, le conseil et l'exécution, avec un seul objectif : des clients. »
2. **« Par quoi commence un accompagnement Leadvice ? »** — « Par un diagnostic : un échange de 45 minutes, offert, pendant lequel nous regardons vos campagnes, vos chiffres et votre offre. Si nous pouvons vous aider, nous vous faisons ensuite une proposition adaptée à votre situation. »
3. **« Combien de temps faut-il pour voir des résultats en acquisition ? »** — « Les premiers leads arrivent souvent dans les jours qui suivent le lancement d'une campagne. Pour juger la qualité des prospects et optimiser sérieusement, comptez quelques semaines de données. Les effets d'un travail de stratégie, eux, se mesurent sur plusieurs mois. »
4. **« Gérez-vous les campagnes vous-mêmes ou conseillez-vous seulement ? »** — « Les deux. Nous pouvons concevoir, lancer et piloter vos campagnes Meta Ads et Google Ads, ou accompagner vos équipes qui les gèrent en interne. »
5. **« Travaillez-vous avec nos équipes internes ? »** — « Oui, c'est même ce que nous préférons. Nous travaillons avec votre direction, votre équipe marketing et vos commerciaux, pour que les chiffres des campagnes rencontrent ceux des ventes. »
6. **« Sur quels canaux intervenez-vous ? »** — « Principalement Meta Ads (Facebook, Instagram) et Google Ads (Search, Display), ainsi que les contenus pour les réseaux sociaux. Le choix des canaux dépend toujours de votre audience et de votre objectif. »
7. **« Comment mesurez-vous la performance ? »** — « Avec les indicateurs qui mènent à vos ventes : coût par lead, part de leads qualifiés, coût par opportunité, coût d'acquisition client. Nous les suivons chaque semaine et nous les définissons avec vous au démarrage. »
8. **« Intervenez-vous en dehors de Casablanca ? »** — « Oui, partout au Maroc, et à distance pour les entreprises qui ciblent le Maroc ou les Marocains résidant à l'étranger. »

CTA : « Parlons de votre croissance. » + « Demander un diagnostic »

---

## 11. Insights `/insights/`

**Title** : « Insights — Stratégie, acquisition et création marketing | Leadvice »
**Meta description** : « Analyses et méthodes de Leadvice sur la stratégie marketing, la génération de leads, Meta Ads, Google Ads et la création publicitaire au Maroc. »

- H1 : « Ce que nous avons appris. »
- Texte : « Nos analyses sur la stratégie, l'acquisition et la création, tirées de ce que nous voyons chaque semaine dans les campagnes de nos clients. »
- Filtres : « Tout » · « Stratégie » · « Acquisition » · « Création » · « Business »

Cartes (titre, catégorie, autrice, extrait) :
1. « Plus de leads ne veut pas dire plus de clients » — Acquisition — Amira Dounassre — « Pourquoi le volume de contacts est un mauvais objectif, et comment construire une acquisition qui trie avant de compter. »
2. « Trouver le bon angle : une même offre, trois histoires » — Création — Amira Dounassre — « Avant de changer d'offre ou de budget, changez d'angle. La méthode pour trouver ceux qui font agir. »
3. « Meta Ads ou Google Ads : choisir selon l'intention, pas selon la mode » — Acquisition — Amira Dounassre — « Les deux plateformes ne répondent pas au même moment de la décision. Comment répartir votre budget entre elles. »
4. « CPL, CPA, coût par opportunité : les métriques qu'un dirigeant doit suivre » — Business — Nada Moujibi — « Les indicateurs qui disent vraiment si votre marketing rapporte, et ceux qui rassurent sans rien prouver. »
5. « Arabe ou français : choisir la langue de vos publicités au Maroc » — Création — Amira Dounassre — « La langue n'est pas un détail de traduction. C'est un choix de cible, de ton et de confiance. »
6. « Audit marketing : sept signes que votre acquisition perd de l'argent » — Stratégie — Nada Moujibi — « Sept situations fréquentes qui coûtent cher sans se voir, et comment les repérer dans vos propres chiffres. »

Fin d'article (bloc commun) : « Vous voulez qu'on regarde vos propres chiffres ? » + « Demander un diagnostic » + petit « 45 minutes, offert. »
Articles liés : « À lire aussi »
Métadonnées : « Publié le {date} » · « Mis à jour le {date} » · « {n} min de lecture » · « Par {autrice} »
Sommaire : « Sommaire »

---

## 12. Diagnostic `/diagnostic/`

**Title** : « Demander un diagnostic offert | Leadvice »
**Meta description** : « 45 minutes, offert : nous regardons vos campagnes, vos chiffres et votre offre, et vous repartez avec ce qui freine votre acquisition. Réponse sous un jour ouvré. »

- H1 : « Parlons de votre croissance. »
- Sous-titre : « Six questions rapides pour préparer un premier échange utile. Réponse sous un jour ouvré. »
- Encadré : « **Le diagnostic, c'est quoi ?** Un échange de 45 minutes, offert, en visio ou par téléphone. Nous regardons vos campagnes, vos chiffres et votre offre. Vous repartez avec ce qui freine votre acquisition et par quoi commencer. Si nous pouvons vous aider, nous vous faisons ensuite une proposition. Sinon, nous vous le disons. »
- Indicateur d'étape : « Étape {n} sur 6 »
- Boutons : « Continuer » · « Retour » · dernière étape « Envoyer ma demande » · « Recommencer »

### Étape 1 — « Quel est votre enjeu principal ? »
« Générer plus de leads qualifiés » · « Améliorer la conversion » · « Clarifier la stratégie » · « Renouveler la création » · « Mieux piloter la performance » · « Autre » *(si Autre : champ « Précisez en quelques mots »)*

### Étape 2 — « Votre entreprise »
- « Nom de l'entreprise »
- « Secteur » : Immobilier · Banque et assurance · Éducation · Santé · Distribution · E-commerce · Industrie · Services B2B · Tourisme et transport · Autre
- « Taille » : « Moins de 10 salariés » · « 10 à 49 » · « 50 à 249 » · « 250 et plus »

### Étape 3 — « Votre rôle »
« Dirigeant(e) » · « Direction marketing » · « Direction commerciale » · « Autre »

### Étape 4 — « Quand aimeriez-vous démarrer ? »
« Dès que possible » · « Dans les trois prochains mois » · « Je me renseigne pour l'instant »
(Aucune question de budget : une fourchette chiffrée fait fuir ceux qui se sentent trop petits, et le diagnostic sert justement à en parler.)

### Fenêtre de réservation (bouton « Demander un diagnostic »)
- Étape 1 : « Quel est votre enjeu principal ? » (six choix), « Entreprise », « Vos campagnes aujourd'hui » (Aucune pour le moment · Gérées en interne · Gérées par une agence · Un peu des deux). Erreur : « Dites-nous où en sont vos campagnes, une réponse suffit. »
- Étape 2 : « Choisissez un créneau. » Aide : « Heure de Casablanca. Les créneaux affichés tiennent compte de notre agenda. » Après le choix du jour : le jour en toutes lettres, onglets « Matin » et « Après-midi » avec le nombre de créneaux (« 4 créneaux », « 1 créneau », « complet »), puis tous les horaires libres.

### Étape 5 — « Vos campagnes aujourd'hui »
« Aucune pour le moment » · « Gérées en interne » · « Gérées par une agence » · « Un peu des deux »

### Étape 6 — « Vos coordonnées »
- « Nom et prénom »
- « E-mail professionnel »
- « Téléphone » — aide : « Pour vous rappeler si c'est plus simple. »
- « Votre message (facultatif) » — exemple dans le champ : « Ce que vous aimeriez qu'on regarde en priorité. »
- Case : « J'accepte que Leadvice utilise ces informations pour me recontacter au sujet de ma demande, conformément à la politique de confidentialité. »
- Sous le bouton : « Vos données ne servent qu'à répondre à votre demande. Elles ne sont jamais revendues. »

### Messages d'erreur
- Champ vide : « Ce champ est nécessaire pour vous répondre. »
- Choix manquant : « Choisissez une réponse pour continuer. »
- E-mail invalide : « Indiquez une adresse e-mail professionnelle, par exemple nom@entreprise.ma »
- Téléphone invalide : « Indiquez un numéro joignable, par exemple +212 6 00 00 00 00 »
- Consentement : « Nous avons besoin de votre accord pour vous recontacter. »
- Résumé en haut de l'étape : « Il reste {n} point(s) à corriger : »
- Erreur d'envoi : « L'envoi n'a pas abouti. Vos réponses sont conservées : réessayez, ou écrivez-nous à contact@leadvice.org. » — boutons « Réessayer » · « Copier l'adresse »
- Envoi en cours : « Envoi en cours… »

---

## 13. Merci `/diagnostic/merci/`

**Title** : « Demande reçue | Leadvice » *(noindex)*

- H1 : « Merci. Votre demande est bien partie. »
- Phrase personnalisée, sous l'animation, selon l'enjeu choisi :
  - Générer plus de leads qualifiés → « Votre enjeu : générer plus de leads qualifiés. »
  - Améliorer la conversion → « Votre enjeu : transformer plus de contacts en clients. »
  - Clarifier la stratégie → « Votre enjeu : savoir où aller, et par quoi commencer. »
  - Renouveler la création → « Votre enjeu : trouver le message qui fait agir. »
  - Mieux piloter la performance → « Votre enjeu : transformer vos chiffres en décisions. »
  - Autre → « Votre enjeu est noté. Nous le regardons de près. »
- Titre : « La suite. »
  1. « Nous lisons votre demande. » — « Nous regardons votre secteur, votre situation et l'enjeu que vous avez indiqué. »
  2. « Nous vous répondons sous un jour ouvré. » — « Par e-mail, pour fixer le créneau de votre diagnostic. »
  3. « Nous faisons le point ensemble. » — « 45 minutes, en visio ou par téléphone. Vous repartez avec ce qui freine votre acquisition et par quoi commencer. »
- Titre : « En attendant, à lire. »
- Articles recommandés selon l'enjeu :
  - Leads → articles 1 et 3
  - Conversion → articles 1 et 4
  - Stratégie → articles 6 et 4
  - Création → articles 2 et 5
  - Pilotage → articles 4 et 6
  - Autre → articles 6 et 1
- Petit : « Une question d'ici là ? contact@leadvice.org » *(avec bouton copier)*

---

## 14. Landing pages *(noindex)*

### `/lp/generation-de-leads/`
**Title** : « Des leads qualifiés, pas seulement des leads | Leadvice »
- H1 : « Des leads que vos commerciaux ont envie de rappeler. »
- Sous-titre : « Nous concevons et pilotons vos campagnes Meta Ads et Google Ads pour attirer des prospects qualifiés, à un coût maîtrisé. »
- Bouton : « Demander mon diagnostic offert »
- Séquence funnel : « Beaucoup de contacts. Peu de clients. » → étapes → « Nous trouvons les bons prospects. » → « +10 893 prospects générés » · « moins de 1 $ : coût moyen par lead constaté sur nos clients (Meta Ads) »
- Trois bénéfices :
  - « **Des leads qui ont un projet.** Des formulaires qui qualifient avant de compter : objectif, rôle, budget. »
  - « **Un coût par lead maîtrisé.** Moins de 1 $ sur Meta Ads et 1 à 2 $ sur Google Ads en moyenne chez nos clients. »
  - « **Un budget qui va où ça rapporte.** Les chiffres sont relus chaque semaine et le budget suit les campagnes qui produisent des clients. »
- Chiffres : les sept chiffres de l'accueil. Logos : les huit clients.
- Méthode condensée : « Diagnostiquer · Structurer · Exécuter · Mesurer · Optimiser »
- Formulaire court, titre : « Parlons de vos leads. » *(enjeu présélectionné : Générer plus de leads qualifiés)*
- FAQ : questions 1, 2 et 4 de la page Acquisition, plus « **Combien coûte un accompagnement ?** — Nos honoraires dépendent du périmètre : nombre de canaux, de campagnes et de créations. Nous vous faisons une proposition chiffrée après le diagnostic, une fois vos objectifs connus. Le budget publicitaire est payé directement aux plateformes. »

### `/lp/conseil-strategique/`
**Title** : « Conseil stratégique marketing pour dirigeants | Leadvice »
- H1 : « Trop de priorités. Une seule direction. »
- Sous-titre : « Nous aidons les directions à clarifier leur positionnement, leur offre et leur stratégie d'acquisition, puis à passer à l'action. »
- Bouton : « Demander mon diagnostic offert »
- Séquence nœud : « Trop d'options. Trop d'avis. Trop de priorités. » → « Une direction claire. »
- Trois bénéfices :
  - « **Un diagnostic sans complaisance.** Ce qui coûte sans rapporter, ce qui marche sans être exploité, ce qui manque. »
  - « **Des décisions, pas un rapport.** Un plan hiérarchisé que vos équipes peuvent exécuter dès le lendemain. »
  - « **Un regard d'auditrice et d'ingénieure.** Une lecture business et chiffrée de vos sujets marketing. »
- Chiffres, logos, méthode condensée : comme ci-dessus.
- Formulaire court, titre : « Parlons de votre stratégie. » *(enjeu présélectionné : Clarifier la stratégie)*
- FAQ : questions 1, 2 et 3 de la page Stratégie, plus la question « Combien coûte un accompagnement ? » ci-dessus.

### `/lp/audit-marketing/`
**Title** : « Audit marketing : savez-vous ce qui fonctionne vraiment ? | Leadvice »
- H1 : « Vous dépensez. Savez-vous ce qui fonctionne ? »
- Sous-titre : « Nous auditons vos campagnes, vos contenus et vos chiffres pour vous montrer où part votre budget, et comment le remettre au travail. »
- Bouton : « Demander mon diagnostic offert »
- Scène lentille : « Tout semble urgent. » → « Regardons ce qui se passe vraiment. »
- Trois bénéfices :
  - « **Voir où part le budget.** Campagne par campagne, audience par audience. »
  - « **Repérer les fuites.** Anomalies de coût, audiences qui se chevauchent, créations usées, leads jamais rappelés. »
  - « **Savoir par quoi commencer.** Des priorités claires, dans le bon ordre. »
- Chiffres, logos, méthode condensée : comme ci-dessus.
- Formulaire court, titre : « Parlons de vos campagnes. » *(enjeu présélectionné : Mieux piloter la performance)*
- FAQ : questions 1 et 3 de la page Pilotage, question 1 de la page Stratégie, et la question « Combien coûte un accompagnement ? »

---

## 15. Page 404

**Title** : « Page introuvable | Leadvice »
- H1 : « Cette page a perdu le signal. »
- Texte : « Elle a peut-être changé d'adresse, ou n'a jamais existé. »
- Liens : « Retour à l'accueil » · « Demander un diagnostic » · « Rechercher sur le site »

---

## 16. Mentions légales `/mentions-legales/`

**Title** : « Mentions légales | Leadvice »

H1 : « Mentions légales »

**Éditeur du site**
Le site leadvice.org est édité par LEADVICE SARL, société à responsabilité limitée au capital de 100 000 dirhams.
Siège social : Hay Laayoune, Angle Rue Ait Yaflmane, Fida N°341, 2ème étage, Casablanca, Maroc.
Registre du commerce : 527921 · ICE : 002978060000045 · Identifiant fiscal : 51669892 · Patente : 33501510 · CNSS : 4200083.
Contact : contact@leadvice.org

**Directrice de la publication**
Amira Dounassre, cofondatrice.

**Hébergement**
Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.

**Propriété intellectuelle**
L'ensemble des contenus du site (textes, visuels, animations, logo, structure) est la propriété de LEADVICE SARL, sauf mention contraire. Les logos des clients présentés dans la rubrique Réalisations restent la propriété de leurs titulaires respectifs et sont reproduits avec leur accord. Toute reproduction, même partielle, sans autorisation écrite préalable est interdite.

**Responsabilité**
Les informations publiées sur ce site sont fournies à titre indicatif. Les chiffres présentés sont des résultats cumulés ou moyens constatés sur les clients de Leadvice ; ils ne constituent pas une garantie de résultat pour une mission future.

**Données personnelles**
Le traitement des données collectées sur ce site est décrit dans la politique de confidentialité.

---

## 17. Confidentialité `/confidentialite/`

**Title** : « Politique de confidentialité | Leadvice »

H1 : « Politique de confidentialité »

« Cette politique explique quelles données Leadvice collecte sur ce site, pourquoi, et quels sont vos droits. Elle s'applique conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et, pour les visiteurs concernés, au Règlement général sur la protection des données (RGPD). »

**Responsable du traitement**
LEADVICE SARL, Hay Laayoune, Angle Rue Ait Yaflmane, Fida N°341, 2ème étage, Casablanca, Maroc. Contact : contact@leadvice.org.

**Données collectées**
- Par le formulaire de diagnostic : nom, e-mail professionnel, téléphone, entreprise, secteur, taille, rôle, date de démarrage souhaitée, situation de vos campagnes, créneau de rendez-vous choisi, enjeu principal, message éventuel, ainsi que la source de votre visite (paramètres de campagne).
- Par la navigation, uniquement avec votre accord : données de mesure d'audience et de performance publicitaire (voir la politique cookies).

**Finalités**
- Répondre à votre demande et organiser le diagnostic.
- Vous adresser, le cas échéant, une proposition commerciale liée à votre demande.
- Mesurer l'audience du site et l'efficacité de nos campagnes, si vous l'avez accepté.

**Base du traitement**
Votre consentement, donné en cochant la case du formulaire et via la bannière cookies. Vous pouvez le retirer à tout moment.

**Destinataires**
Les données sont destinées à Leadvice uniquement. Elles transitent par nos prestataires techniques : Cloudflare (hébergement et protection du formulaire), Resend (envoi des e-mails) et, si vous l'avez accepté, Google, Meta et LinkedIn (mesure d'audience et publicité). Elles ne sont jamais vendues ni louées.

**Durée de conservation**
Les données du formulaire sont conservées 24 mois après notre dernier échange, puis supprimées. Votre choix concernant les cookies est conservé 6 mois.

**Vos droits**
Vous disposez d'un droit d'accès, de rectification et d'opposition, ainsi que d'un droit à l'effacement de vos données. Pour les exercer, écrivez à contact@leadvice.org. Nous vous répondons dans un délai d'un mois. Vous pouvez également adresser une réclamation à la Commission nationale de contrôle de la protection des données à caractère personnel (CNDP).

**Sécurité**
Le site est servi en HTTPS et le formulaire est protégé contre les envois automatisés. L'accès aux demandes reçues est limité à l'équipe Leadvice.

Date de mise à jour : *(date de publication du site)*

---

## 18. Cookies `/cookies/`

**Title** : « Politique cookies | Leadvice »

H1 : « Cookies »

« Un cookie est un petit fichier déposé sur votre appareil lorsque vous visitez un site. Sur leadvice.org, rien n'est déposé à des fins de mesure ou de publicité sans votre accord. »

**Nécessaires (toujours actifs)**
- Mémorisation de vos choix de cookies (6 mois).
- Mémorisation du mode clair ou sombre (stockage local de votre navigateur).
- Protection du formulaire contre les robots (Cloudflare Turnstile).

**Mesure d'audience (avec votre accord)**
- Google Analytics : comprendre quelles pages sont consultées et comment le site est utilisé.

**Publicité (avec votre accord)**
- Meta (Facebook, Instagram), Google Ads et LinkedIn : mesurer l'efficacité de nos campagnes et éviter de montrer nos publicités aux personnes qui nous ont déjà contactés.

**Changer d'avis**
Vous pouvez modifier vos choix à tout moment avec le lien « Gérer les cookies » en bas de chaque page.

---

## 19. E-mails automatiques

### Accusé de réception au prospect
- Objet : « Votre demande de diagnostic est bien reçue »
- Texte :
« Bonjour {prénom},

Merci pour votre demande. Nous l'avons bien reçue et nous la lisons avec attention.

Nous revenons vers vous sous un jour ouvré pour fixer le créneau de votre diagnostic : 45 minutes, en visio ou par téléphone, pour regarder ensemble vos campagnes, vos chiffres et votre offre.

Votre enjeu : {enjeu}

À très vite,
Amira Dounassre et Nada Moujibi
Leadvice — Conseil stratégique & marketing
leadvice.org »

### E-mail interne à Leadvice
- Objet : « [Diagnostic — Priorité haute] {entreprise} · {enjeu} » ou « [Diagnostic — À qualifier] {entreprise} · {enjeu} »
- Corps : toutes les réponses dans l'ordre du formulaire, puis : page d'entrée, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, date et heure.

---

## 20. `/llms.txt`

```
# Leadvice

> Leadvice est un cabinet de conseil en stratégie marketing et en acquisition client basé à Casablanca (Maroc), fondé en 2022 par Amira Dounassre et Nada Moujibi. Le cabinet conseille et exécute : stratégie, création publicitaire, campagnes Meta Ads et Google Ads, génération de leads et pilotage de la performance.

## Expertises
- [Stratégie](https://leadvice.org/expertises/strategie/) : audit marketing, positionnement, structuration de l'offre, stratégie d'acquisition, plan d'action.
- [Création](https://leadvice.org/expertises/creation/) : concepts créatifs, accroches, publicités statiques et vidéo, contenus en français et en arabe.
- [Acquisition](https://leadvice.org/expertises/acquisition/) : Meta Ads, Google Ads, génération de leads qualifiés, ciblage, media buying.
- [Pilotage](https://leadvice.org/expertises/pilotage/) : suivi hebdomadaire, reporting, optimisation continue, co-pilotage.

## Méthode
Diagnostiquer, structurer, exécuter, mesurer, optimiser.

## Chiffres
Plus de 1 000 leads générés chaque mois pour les clients ; 10 893 prospects générés ; 126 campagnes lancées ; plus de 23 clients accompagnés ; plus de 300 posts et créatives produits. Coût moyen par lead constaté sur les clients : moins de 1 $ sur Meta Ads, entre 1 et 2 $ sur Google Ads.

## Clients
Kettani Immobilier, Royal Air Maroc, Attijariwafa bank, ITROAD Group, ZEYA, Beadsbox, Milla, Frag'in.

## Étude de cas
- [Kettani Immobilier](https://leadvice.org/realisations/kettani-immobilier/) : acquisition digitale de sept programmes immobiliers haut de gamme, environ 41 000 leads Meta Ads en douze mois.

## Contact
- [Demander un diagnostic](https://leadvice.org/diagnostic/) : échange de 45 minutes, offert.
- contact@leadvice.org
```
