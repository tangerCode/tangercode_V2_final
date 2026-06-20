# 📋 CAHIER DES CHARGES — TANGER CODE

**Projet** : Site web vitrine professionnel pour activité freelance en développement web
**Version** : **1.1** — Décisions client intégrées (à valider)
**Date** : Juin 2026
**Client / Porteur du projet** : TANGER CODE

> 🔄 **Modifications par rapport à la v1.0** : intégration des choix client sur le mode sombre, l'hébergement a2hosting, Google Analytics 4, affichage des tarifs, concept 3D et identité visuelle.

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
TANGER CODE est une activité freelance spécialisée dans le développement web et mobile basée au Maroc. Le projet consiste à créer un site web professionnel qui servira de vitrine commerciale, d'outil de prospection et de canal de conversion principal pour acquérir de nouveaux clients.

### 1.2 Description de l'activité
Services proposés :
- **Sites web** : sites vitrines, sites e-commerce, blogs, sites institutionnels, landing pages
- **Plateformes web** : applications web sur mesure, SaaS, plateformes métier
- **ERP** : solutions de gestion d'entreprise sur mesure
- **Applications mobiles** : applications iOS et Android

### 1.3 Objectifs du site web
| # | Objectif | Indicateur de succès |
|---|----------|----------------------|
| 1 | Présenter l'expertise et les services de manière professionnelle | Taux de rebond < 50% |
| 2 | Générer des demandes de devis qualifiées | Au moins 5 leads/mois après 3 mois |
| 3 | Valoriser le portfolio et les réalisations | Temps moyen sur la page portfolio > 1min |
| 4 | Améliorer la visibilité SEO sur le marché marocain et francophone | Top 10 sur les mots-clés cibles à 6 mois |
| 5 | Offrir plusieurs canaux de contact (formulaire, WhatsApp, email) | Diversification des sources de leads |
| 6 | Démontrer la maîtrise technique à travers le site lui-même | Score Lighthouse > 90 sur tous les critères |

---

## 2. CIBLE & AUDIENCE

### 2.1 Personas
- **PME / TPE marocaines** souhaitant digitaliser leur activité
- **Entrepreneurs et porteurs de projet** ayant besoin d'un site vitrine ou e-commerce
- **Entreprises moyennes** cherchant une solution ERP ou une plateforme métier
- **Clients internationaux** francophones, anglophones ou arabophones

### 2.2 Langues couvertes
- 🇫🇷 **Français** (langue par défaut)
- 🇬🇧 **Anglais**
- 🇸🇦 **Arabe** (avec support RTL — Right-To-Left)

---

## 3. PÉRIMÈTRE FONCTIONNEL — SITE PUBLIC

### 3.1 Liste des pages

| # | Page | Description | Priorité |
|---|------|-------------|----------|
| 1 | **Accueil** | Page principale avec hero 3D, services, process, portfolio, témoignages, tarifs, contact | 🔴 Critique |
| 2 | **Services** | Liste de tous les services + tarifs | 🔴 Critique |
| 3 | **Détail d'un service** | Une page dédiée par service (5 pages) avec tarification | 🔴 Critique |
| 4 | **Portfolio** | Liste de tous les projets réalisés | 🔴 Critique |
| 5 | **Détail d'un projet** | Une page dédiée par projet (étude de cas) | 🔴 Critique |
| 6 | **Tarifs** | Page dédiée aux offres et formules (NOUVEAU) | 🔴 Critique |
| 7 | **À propos** | Présentation, parcours, valeurs | 🟡 Haute |
| 8 | **Blog** | Liste des articles | 🟡 Haute |
| 9 | **Détail d'un article** | Page article individuelle | 🟡 Haute |
| 10 | **FAQ** | Questions fréquentes catégorisées | 🟡 Haute |
| 11 | **Contact** | Formulaire de contact + coordonnées + carte | 🔴 Critique |
| 12 | **Mentions légales** | Page légale | 🟢 Moyenne |
| 13 | **Politique de confidentialité** | RGPD / Données personnelles | 🟢 Moyenne |
| 14 | **404** | Page d'erreur personnalisée | 🟢 Moyenne |

### 3.2 Détail de la page d'accueil

La page d'accueil doit être structurée en **sections séquentielles** :

#### Section 1 — Hero (Bannière principale) avec animation 3D

**🎨 Concept 3D retenu : « L'Architecte du Code »**

- **Forme centrale** : un polyèdre cristallin semi-transparent flottant, aux arêtes lumineuses
- **Animation principale** : rotation lente + effet « respiration » (échelle subtile)
- **Détails internes** : des lignes de code stylisées (`<div>`, `{}`, `=>`, `function`) circulent le long des arêtes
- **Particules d'arrière-plan** : flux de symboles binaires et caractères de code
- **Interactions** :
  - Mouvement souris → parallaxe + inclinaison douce
  - Scroll → morphing : web → mobile → ERP → plateforme (les 4 services)
- **Stack** : Three.js + React Three Fiber, optimisé < 600 KB
- **Version mobile** : version simplifiée moins gourmande en GPU

**Autres éléments du hero** :
- Tagline accrocheuse multilingue
- Sous-titre expliquant la proposition de valeur
- 2 CTA : « Démarrer un projet » + « Voir le portfolio »
- Indicateurs de confiance (X projets réalisés, X clients satisfaits, X années d'expérience)

#### Section 2 — Services
- Présentation visuelle des 4 grandes catégories de services (cartes interactives)
- Animations au survol
- Lien vers chaque page service détaillée
- **Affichage du tarif « à partir de »** sur chaque carte

#### Section 3 — Process de développement
Présentation du processus en 7 étapes sous forme de timeline animée :
1. Découverte & analyse des besoins
2. Cahier des charges & conception
3. Design UI/UX & maquettes
4. Développement
5. Tests & validation
6. Mise en ligne
7. Maintenance & évolutions

#### Section 4 — Portfolio (extrait)
- 3 à 6 projets phares affichés en grille
- Lien vers la page portfolio complète
- Filtres par catégorie

#### Section 5 — Tarifs (NOUVEAU)
- Aperçu des formules avec 3 cartes principales (Starter / Pro / Premium ou par service)
- Lien vers la page tarifs complète
- CTA « Demander un devis personnalisé »

#### Section 6 — Témoignages clients
- Carrousel ou grille de 3 à 6 témoignages
- Photo, nom, entreprise, note, texte court
- Possibilité de vidéo témoignage

#### Section 7 — Statistiques / Chiffres clés
- Compteurs animés (projets, clients, années, technologies maîtrisées)

#### Section 8 — Technologies maîtrisées
- Logos animés des technos (React, Next.js, Django, Flutter, etc.)

#### Section 9 — Articles récents du blog
- 3 derniers articles
- Lien vers le blog complet

#### Section 10 — Section contact / CTA final
- Formulaire de contact rapide intégré
- Ou bouton vers la page contact complète

### 3.3 Composants transverses (présents sur toutes les pages)

#### Header
- Logo TANGER CODE (avec animation au chargement)
- Menu de navigation
- Sélecteur de langue (FR / EN / AR)
- **Toggle Dark/Light mode** (mode sombre par défaut)
- CTA « Devis gratuit »

#### Footer
- Logo + courte description
- Liens rapides (Services, Portfolio, Tarifs, Blog, Contact)
- Liens légaux (Mentions, Confidentialité)
- Réseaux sociaux (LinkedIn, GitHub, Instagram, Facebook, etc.)
- Coordonnées (email, téléphone, localisation)
- Newsletter (optionnel)
- Copyright

#### Bouton WhatsApp flottant
- Icône WhatsApp toujours visible en bas à droite
- Au clic : ouvre WhatsApp avec un message pré-rempli
- Animation pulsation subtile pour attirer l'attention
- Adapté mobile et desktop
- Message pré-rempli personnalisable depuis l'admin

#### Bouton « Retour en haut »
- Apparaît après scroll
- Animation fluide

#### Cookie banner
- Conformité RGPD
- Gestion des préférences (notamment pour Google Analytics)

### 3.4 Fonctionnalités transverses

| Fonctionnalité | Description |
|----------------|-------------|
| **Multilangue (i18n)** | 3 langues : FR (défaut), EN, AR. Support RTL pour l'arabe. URLs distinctes par langue (`/fr/`, `/en/`, `/ar/`) pour le SEO |
| **Mode sombre / clair** | **Dark mode par défaut**, switch vers light mode via toggle dans le header. Préférence sauvegardée (localStorage) |
| **Responsive design** | Adaptation parfaite mobile, tablette, desktop |
| **Animations** | Animations fluides au scroll (Framer Motion + GSAP) |
| **Recherche** | Barre de recherche dans le blog |
| **Filtres** | Filtres dans le portfolio (par catégorie, technologie, année) |
| **Partage social** | Boutons de partage sur les articles et projets |
| **Chargement progressif** | Lazy loading des images |

---

## 4. PÉRIMÈTRE FONCTIONNEL — DASHBOARD ADMIN

### 4.1 Authentification
- Connexion sécurisée (email + mot de passe)
- Authentification à deux facteurs (2FA) optionnelle
- Récupération de mot de passe
- Sessions sécurisées avec expiration
- Logs de connexion

### 4.2 Modules du dashboard

#### Module 1 — Tableau de bord (Vue d'ensemble)
- Statistiques globales (visiteurs, pages vues, messages reçus) **via Google Analytics 4 API**
- Graphiques (visites par jour/semaine/mois)
- Sources de trafic
- Pages les plus visitées
- Messages récents non lus
- Notifications

#### Module 2 — Gestion des services
- Créer / Modifier / Supprimer un service
- Champs : titre, description courte, description longue, icône, image, **tarifs (obligatoire)**, technologies utilisées, FAQ liées
- **Système de tarification** : tarif fixe, fourchette « à partir de X », ou « sur devis »
- Gestion multilingue (FR / EN / AR)
- Traduction automatique via API Claude avec édition manuelle

#### Module 3 — Gestion du portfolio
- Créer / Modifier / Supprimer un projet
- Champs : titre, client, catégorie, description, technologies, images (galerie), URL du projet, témoignage du client, date, durée
- Mise en avant (featured) sur la home
- Gestion multilingue avec traduction automatique

#### Module 4 — Gestion du blog
- Éditeur de texte riche (WYSIWYG)
- Catégories et tags
- Image à la une
- Brouillons / Publié / Archivé
- Programmation de publication
- SEO par article (meta title, meta description, slug)
- Gestion multilingue avec traduction automatique
- Statistiques par article

#### Module 5 — Gestion des témoignages clients
- Ajouter / Modifier / Supprimer un témoignage
- Photo, nom, entreprise, poste, note (étoiles), texte
- Activer/désactiver l'affichage
- Ordre d'affichage

#### Module 6 — Gestion de la FAQ
- Catégories de questions
- Questions / Réponses
- Ordre d'affichage
- Multilingue

#### Module 7 — Gestion des tarifs (NOUVEAU)
- Créer / modifier des formules tarifaires
- Champs : nom de la formule, prix, devise (MAD / EUR / USD), description, liste des fonctionnalités incluses, mise en avant, lien CTA
- Affichage en cartes comparatives
- Multilingue

#### Module 8 — Messages de contact
- Liste des messages reçus
- Détail d'un message
- Statuts : Nouveau / Lu / Répondu / Archivé
- Réponse directe par email depuis le dashboard
- Notification email à chaque nouveau message
- Export CSV

#### Module 9 — Analytics & Suivi
- **Intégration Google Analytics 4** (via API GA4)
- Visiteurs uniques / sessions / pages vues
- Sources de trafic (organique, direct, social, référent)
- Pays, appareils, navigateurs
- Pages les plus consultées
- Taux de rebond, temps moyen
- Conversion (formulaires soumis, clics WhatsApp)
- Affichage des données GA4 directement dans le dashboard admin (pas besoin de quitter pour aller sur Google)

#### Module 10 — Configuration du site
- Informations générales (nom, email, téléphone, adresse)
- Numéro WhatsApp + message pré-rempli
- Liens réseaux sociaux
- Tagline et descriptions par langue
- Logo et favicon
- ID Google Analytics 4 (modifiable)
- Couleurs (optionnel — thème dynamique)

#### Module 11 — SEO global
- Meta title et description par page
- Open Graph (Facebook)
- Twitter Cards
- Sitemap.xml automatique
- Robots.txt
- Balises hreflang multilingue
- Schema.org (données structurées)

#### Module 12 — Configuration de l'API IA
- Clé API Claude (modifiable)
- Choix du modèle Claude utilisé
- Personnalisation des prompts de traduction
- Test de la connexion API
- Logs des traductions effectuées
- Possibilité de basculer vers une autre API IA (OpenAI, Google Translate, etc.)

#### Module 13 — Gestion des utilisateurs admin
- Liste des administrateurs
- Rôles et permissions (super admin, éditeur, contributeur)
- Logs d'activité

#### Module 14 — Sauvegardes
- Sauvegardes automatiques de la BDD
- Export manuel
- Historique des sauvegardes

---

## 5. FONCTIONNALITÉ CLÉ — TRADUCTION AUTOMATIQUE PAR IA

### 5.1 Principe
Lors de la création ou modification d'un contenu (service, projet, article, FAQ, témoignage, formule tarifaire) dans **une langue source**, le système traduit automatiquement le contenu vers les **deux autres langues** via l'API de Claude (Anthropic).

### 5.2 Workflow
1. L'admin rédige le contenu dans une langue (ex : français)
2. Au clic sur « Sauvegarder » ou « Traduire automatiquement », le système :
   - Envoie le contenu à l'API Claude
   - Récupère les traductions en anglais et en arabe
   - Stocke les 3 versions en base de données
3. L'admin peut **éditer manuellement** chaque traduction si nécessaire
4. L'admin peut **relancer la traduction** d'une langue spécifique
5. L'admin peut **désactiver la traduction auto** pour un champ spécifique

### 5.3 Spécifications techniques
- API utilisée par défaut : **Claude (Anthropic)**
- Clé API stockée de manière sécurisée (chiffrée en BDD ou via variables d'environnement)
- Clé modifiable depuis le dashboard admin
- Possibilité de changer de fournisseur (architecture en abstraction)
- Gestion des erreurs et fallback
- Logs des appels API (date, contenu traduit, statut, coût estimé)
- Gestion des quotas et limites
- Cache pour éviter les traductions redondantes

### 5.4 Champs traduits
- Tous les champs textuels longs (descriptions, articles, FAQ)
- Les meta SEO (title, description)
- Les titres et sous-titres
- Les noms et descriptions de formules tarifaires
- **Non traduits** : noms propres, marques, technologies, URLs, prix numériques

---

## 6. CONTRAINTES TECHNIQUES

### 6.1 Stack technique imposée

#### Frontend
- **Framework** : Next.js (App Router, version stable la plus récente)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + Shadcn/ui
- **Animations** : Framer Motion + GSAP
- **3D** : Three.js + React Three Fiber + Drei
- **Internationalisation** : next-intl
- **Forms** : React Hook Form + Zod (validation)
- **State management** : Zustand
- **HTTP client** : Axios
- **Theme** : next-themes (gestion dark/light mode)

#### Backend
- **Framework** : Django + Django REST Framework
- **Langage** : Python (version stable)
- **Base de données** : PostgreSQL
- **Authentification** : JWT (avec refresh tokens)
- **ORM** : Django ORM
- **Cache** : Redis
- **Tâches asynchrones** : Celery + Redis (pour les traductions IA, envoi d'emails)
- **Stockage de fichiers** : Local + option Cloud (Cloudinary recommandé)
- **Documentation API** : Swagger / OpenAPI (drf-spectacular)
- **Intégration GA4** : google-analytics-data API client

#### DevOps & Outils
- **Versionning** : Git + GitHub
- **CI/CD** : GitHub Actions (déploiement auto vers VPS a2hosting)
- **Conteneurisation** : Docker + Docker Compose
- **Serveur web** : Nginx (reverse proxy)
- **Process manager** : Gunicorn (Django) + PM2 (Next.js)
- **SSL** : Let's Encrypt via Certbot

### 6.2 Performance
| Indicateur | Cible |
|------------|-------|
| Score Lighthouse — Performance | > 90 |
| Score Lighthouse — Accessibilité | > 95 |
| Score Lighthouse — Best Practices | > 95 |
| Score Lighthouse — SEO | 100 |
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |

### 6.3 SEO (Search Engine Optimization)
- **SSR / SSG** : Server-Side Rendering ou Static Site Generation via Next.js
- **Meta tags** dynamiques par page
- **Open Graph** + Twitter Cards
- **Sitemap.xml** automatique multilingue
- **Robots.txt** configuré
- **Balises hreflang** pour le multilangue
- **URLs propres et lisibles** (slugs)
- **Données structurées Schema.org** (Organization, Service, BlogPosting, FAQ, Breadcrumb, Offer pour les tarifs)
- **Images optimisées** (WebP, AVIF, lazy loading, alt text)
- **Performance mobile-first**
- **HTTPS obligatoire**
- **Canonical URLs**
- **Breadcrumbs**

### 6.4 Sécurité
- **HTTPS** obligatoire (certificat Let's Encrypt)
- **Protection CSRF** (Django built-in)
- **Protection XSS** (sanitization des entrées)
- **Protection SQL Injection** (ORM Django)
- **Rate limiting** sur les endpoints sensibles (formulaire contact, login)
- **CORS** configuré strictement
- **Headers de sécurité** : CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Hashage des mots de passe** : bcrypt / Argon2
- **JWT sécurisés** avec rotation
- **Validation stricte** côté serveur de toutes les entrées
- **Logs de sécurité** (tentatives de connexion, etc.)
- **Sauvegardes automatiques** chiffrées
- **reCAPTCHA v3** sur les formulaires
- **Honeypot** anti-spam sur le formulaire de contact
- **Mises à jour régulières** des dépendances (Dependabot)
- **Scan de vulnérabilités** (Snyk, npm audit)
- **Limitation de la taille des uploads**
- **Validation des types de fichiers uploadés**
- **Stockage sécurisé des clés API** (variables d'environnement)

### 6.5 Accessibilité
- Conformité **WCAG 2.1 niveau AA**
- Navigation au clavier complète
- Contrastes respectés (notamment en dark mode)
- Textes alternatifs sur toutes les images
- Labels sur tous les champs de formulaire
- Hiérarchie sémantique correcte (h1, h2, h3...)
- Compatibilité lecteurs d'écran

### 6.6 Responsive
Compatibilité parfaite sur :
- 📱 **Mobile** : 320px à 767px
- 📱 **Tablette** : 768px à 1023px
- 💻 **Desktop** : 1024px à 1919px
- 🖥️ **Large desktop** : 1920px+

### 6.7 Compatibilité navigateurs
- Chrome (2 dernières versions)
- Firefox (2 dernières versions)
- Safari (2 dernières versions)
- Edge (2 dernières versions)
- Safari iOS
- Chrome Android

---

## 7. ARCHITECTURE TECHNIQUE

### 7.1 Architecture globale

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   Next.js       │◄───────►│   Django REST   │
│   Frontend      │  REST   │   API Backend   │
│   (SSR/SSG)     │  HTTPS  │                 │
│                 │         │                 │
└─────────────────┘         └────────┬────────┘
        │                            │
        │                            ▼
        │                   ┌─────────────────┐
        │                   │   PostgreSQL    │
        │                   │   (Base de      │
        │                   │   données)      │
        │                   └─────────────────┘
        │                            │
        │                            ▼
        │                   ┌─────────────────┐
        │                   │     Redis       │
        │                   │   (Cache +      │
        │                   │   Celery)       │
        │                   └─────────────────┘
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│   Utilisateurs  │         │   API Claude    │
│   (Visiteurs +  │         │   (Traduction)  │
│    Admins)      │         │                 │
└─────────────────┘         └─────────────────┘
        │                            │
        │                            ▼
        │                   ┌─────────────────┐
        └──────────────────►│  Google         │
                            │  Analytics 4    │
                            └─────────────────┘
```

### 7.2 Séparation des projets
- **Repository 1** : `tangercode-frontend` (Next.js)
- **Repository 2** : `tangercode-backend` (Django)
- **Repository 3** : `tangercode-admin` (intégré au frontend Next.js sous `/admin`)

### 7.3 Communication
- API REST sécurisée
- Authentification JWT pour les routes admin
- Routes publiques pour le contenu du site
- Documentation Swagger accessible en interne

---

## 8. INTÉGRATIONS EXTERNES

| Intégration | Usage | Priorité |
|-------------|-------|----------|
| **API Claude (Anthropic)** | Traduction automatique multilangue | 🔴 Critique |
| **Google Analytics 4** | Analytics, suivi du trafic, API GA4 pour dashboard admin | 🔴 Critique |
| **SMTP (a2hosting) / SendGrid** | Envoi d'emails (formulaire contact, notifications) | 🔴 Critique |
| **WhatsApp Click-to-Chat** | Bouton flottant WhatsApp | 🔴 Critique |
| **Google Search Console** | Suivi SEO | 🟡 Haute |
| **reCAPTCHA v3** | Protection anti-spam | 🔴 Critique |
| **Cloudinary** | Stockage et optimisation des images | 🟡 Haute |
| **Calendly** (optionnel) | Planification de rendez-vous | 🟢 Moyenne |

---

## 9. CHARTE GRAPHIQUE & IDENTITÉ VISUELLE

### 9.1 Concept : « Mediterranean Tech »
Fusion entre l'identité de **Tanger** (ville-porte, méditerranée, lumière) et le **code** (modernité, technicité, futurisme).

### 9.2 Palette de couleurs

| Rôle | Couleur | Code Hex | Usage |
|------|---------|----------|-------|
| **Primaire** | Bleu électrique profond | `#0052CC` | Boutons principaux, liens, accents forts |
| **Accent 1** | Cyan néon | `#00D4FF` | Hover, glows, highlights |
| **Accent 2** | Orange corail | `#FF6B35` | CTA secondaires, badges, énergie |
| **Dark base** | Bleu nuit profond | `#0A1628` | Fond mode sombre (par défaut) |
| **Dark surface** | Bleu très sombre | `#0F1F3D` | Cartes, modales en mode sombre |
| **Light base** | Blanc cassé | `#F8FAFC` | Fond mode clair |
| **Light surface** | Blanc pur | `#FFFFFF` | Cartes, modales en mode clair |
| **Texte clair** | Blanc | `#FFFFFF` | Texte sur fond sombre |
| **Texte sombre** | Anthracite | `#0F172A` | Texte sur fond clair |
| **Gris neutre** | Slate 400 | `#94A3B8` | Texte secondaire, séparateurs |
| **Succès** | Vert | `#10B981` | Messages de succès |
| **Erreur** | Rouge | `#EF4444` | Messages d'erreur |

### 9.3 Modes
- **Mode sombre** : activé par défaut au premier chargement
- **Mode clair** : accessible via un toggle dans le header
- **Préférence sauvegardée** dans `localStorage`
- **Respect de la préférence système** (`prefers-color-scheme`) au tout premier chargement

### 9.4 Typographie

| Usage | Police | Poids utilisés | Fallback |
|-------|--------|----------------|----------|
| **Titres (h1, h2, h3)** | Cabinet Grotesk | 500, 700, 800 | sans-serif |
| **Corps de texte** | Inter | 400, 500, 600 | sans-serif |
| **Code & accents techniques** | JetBrains Mono | 400, 500 | monospace |
| **Texte arabe** | Cairo | 400, 500, 700 | Tajawal, sans-serif |

### 9.5 Iconographie
- Set d'icônes : **Lucide React** (cohérent, moderne, libre)
- Logos technologies : SVG officiels
- Illustrations : créations sur mesure dans la palette

### 9.6 Direction logo
- **Wordmark** : "TANGER CODE" en Cabinet Grotesk customisé
- **Symbole** : combinaison du `</>` avec une ligne ondulée évoquant la côte
- **Variantes** : claire (pour fonds sombres) + sombre (pour fonds clairs) + monochrome + icône seule

### 9.7 Tonalité de communication
- Professionnelle mais accessible
- Pédagogique
- Orientée résultats et valeur client
- Adaptée à chaque langue (ton plus formel en arabe, plus dynamique en anglais)

---

## 10. SYSTÈME DE TARIFICATION (NOUVEAU)

### 10.1 Affichage public
- **Page Tarifs dédiée** : formules détaillées avec comparatif
- **Cartes tarifaires** sur la home (extrait)
- **Tarif « à partir de »** sur chaque page service
- **CTA « Devis personnalisé »** systématique pour les projets sur mesure

### 10.2 Structure des formules
Pour chaque service, 3 niveaux possibles :
- **Starter** : entrée de gamme, projet simple
- **Pro** : milieu de gamme, projet moyen
- **Premium** : haut de gamme, projet complexe sur mesure

### 10.3 Informations affichées par formule
- Nom de la formule
- Prix de départ (en MAD avec conversion EUR/USD en option)
- Liste des fonctionnalités incluses
- Délai estimé de livraison
- Nombre de révisions incluses
- Support post-livraison inclus
- CTA personnalisé

### 10.4 Gestion en backend
- Module dédié dans le dashboard admin (Module 7)
- Multilangue
- Devise principale : MAD (Dirham marocain)
- Devises affichables : MAD / EUR / USD (conversion manuelle ou via API taux de change)

---

## 11. CONTENU À FOURNIR

| Type de contenu | Responsable | Statut |
|-----------------|-------------|--------|
| Textes des services | Client | À fournir |
| **Grille tarifaire détaillée** | Client | À fournir |
| Présentation personnelle / À propos | Client | À fournir |
| Photos / mockups des projets portfolio | Client | À fournir |
| Témoignages clients | Client | À fournir |
| Articles de blog (initial) | Client | Optionnel au lancement |
| FAQ (questions et réponses) | Client + assistance | À co-construire |
| Logo TANGER CODE | À créer | Inclus dans le projet |
| Vidéos de présentation | Client | Optionnel |

---

## 12. HÉBERGEMENT & DÉPLOIEMENT

### 12.1 Hébergement retenu : **a2hosting.com**

#### ⚠️ Recommandation forte sur le plan
Pour une stack Next.js + Django + PostgreSQL + Redis + Celery, un **hébergement mutualisé ne suffit pas**. Le plan minimum recommandé est :

| Plan | Recommandation | Justification |
|------|----------------|---------------|
| Shared hosting | ❌ Non recommandé | Pas de Redis, Node.js limité, pas de Celery |
| **VPS Unmanaged** | ✅ **Choix recommandé** | Contrôle total, Docker possible, Ubuntu, ~7$/mois |
| VPS Managed | ✅ Alternative | Plus simple à gérer mais plus cher |
| Dédié | ❌ Surdimensionné | Pas nécessaire pour ce projet |

**Configuration cible** :
- OS : Ubuntu 22.04 LTS
- RAM : 4 Go minimum (8 Go recommandé)
- CPU : 2 cores minimum
- Stockage : 50 Go SSD minimum
- Bande passante : illimitée ou minimum 2 To/mois

### 12.2 Architecture de déploiement sur VPS a2hosting

```
VPS a2hosting (Ubuntu 22.04)
│
├── Nginx (reverse proxy + SSL)
│   ├── tangercode.com → Next.js (PM2, port 3000)
│   ├── api.tangercode.com → Django/Gunicorn (port 8000)
│   └── admin.tangercode.com → Next.js admin (intégré)
│
├── PostgreSQL (port 5432)
├── Redis (port 6379)
├── Celery worker (process)
├── Celery beat (process)
├── Certbot (Let's Encrypt auto-renewal)
└── Sauvegardes auto (cron)
```

### 12.3 Environnements
- **Développement** : local (Docker Compose)
- **Staging** : sous-domaine `staging.tangercode.com` sur le même VPS (optionnel)
- **Production** : `tangercode.com` sur VPS a2hosting

### 12.4 Domaine
- Acquisition du nom de domaine **tangercode.com** (et variantes .ma, .net si disponibles)
- Configuration DNS pointant vers le VPS a2hosting
- Certificat SSL Let's Encrypt (gratuit, auto-renouvelé)

### 12.5 CI/CD
- **GitHub Actions** : déploiement automatique sur push vers `main`
- Tests automatiques avant déploiement
- Rollback possible en cas d'échec

---

## 13. LIVRABLES

À l'issue du projet, le client recevra :

1. ✅ **Code source complet** sur GitHub (frontend + backend)
2. ✅ **Documentation technique** (installation, déploiement, architecture)
3. ✅ **Documentation utilisateur** du dashboard admin
4. ✅ **Site web déployé** en production sur VPS a2hosting avec nom de domaine
5. ✅ **Dashboard admin** fonctionnel et sécurisé
6. ✅ **Accès aux outils** (Google Analytics, hébergement, base de données)
7. ✅ **Logo et identité visuelle** complète (kit de marque)
8. ✅ **Sauvegardes** initiales configurées
9. ✅ **Formation** à l'utilisation du dashboard (vidéo + document)
10. ✅ **Période de maintenance** post-lancement (30 jours)

---

## 14. PLANNING PRÉVISIONNEL

| Phase | Durée estimée | Livrable |
|-------|---------------|----------|
| **Phase 1** — Cahier des charges | ✅ En cours | Document validé |
| **Phase 2** — Cahier de conception | 3-5 jours | Document de conception détaillé + prompts |
| **Phase 3** — Design & maquettes | 5-7 jours | Maquettes HTML/templates via Claude Design |
| **Phase 4** — Setup & architecture | 2-3 jours | Repositories, environnements, base de l'app |
| **Phase 5** — Développement Backend | 10-15 jours | API Django fonctionnelle + admin |
| **Phase 6** — Développement Frontend | 15-20 jours | Site Next.js complet |
| **Phase 7** — Intégration 3D & animations | 3-5 jours | Scène 3D « Architecte du Code » fonctionnelle |
| **Phase 8** — Intégration IA & multilangue | 3-5 jours | Système de traduction opérationnel |
| **Phase 9** — Intégration GA4 & tarifs | 2-3 jours | Analytics et tarification fonctionnels |
| **Phase 10** — Tests & corrections | 5-7 jours | Site testé et debuggé |
| **Phase 11** — SEO & optimisations | 2-3 jours | Site optimisé Lighthouse > 90 |
| **Phase 12** — Déploiement a2hosting | 2-3 jours | Site en production sur VPS |
| **Phase 13** — Formation & livraison | 1-2 jours | Documentation + formation |
| **TOTAL** | **~8-11 semaines** | Site complet livré |

---

## 15. MAINTENANCE & ÉVOLUTIONS

### 15.1 Maintenance post-livraison
- Corrections de bugs gratuites pendant 30 jours
- Support technique sur les 90 premiers jours

### 15.2 Évolutions futures envisagées
- 🔮 Système de devis en ligne automatisé avec calculateur de prix
- 🔮 Chatbot IA pour qualifier les leads
- 🔮 Espace client (suivi de projet)
- 🔮 Intégration CRM (HubSpot, Pipedrive)
- 🔮 Newsletter automatisée (Mailchimp, Brevo)
- 🔮 Système de paiement en ligne (Stripe, CMI)
- 🔮 Application mobile dédiée

---

## 16. CRITÈRES D'ACCEPTATION

Le projet sera considéré comme **livré et accepté** lorsque :

- ☑ Toutes les pages listées sont en ligne et fonctionnelles
- ☑ Le multilangue fonctionne dans les 3 langues avec RTL pour l'arabe
- ☑ Le mode sombre/clair fonctionne avec préférence sauvegardée
- ☑ La scène 3D « Architecte du Code » est fonctionnelle et performante
- ☑ La traduction automatique via API Claude est opérationnelle
- ☑ Le dashboard admin permet de gérer tout le contenu
- ☑ Google Analytics 4 est intégré et les données s'affichent dans l'admin
- ☑ Le système de tarification est en place et géré depuis l'admin
- ☑ Le formulaire de contact envoie correctement les emails
- ☑ Le bouton WhatsApp fonctionne
- ☑ Le site est responsive sur tous les devices
- ☑ Le score Lighthouse est > 90 sur tous les critères
- ☑ Le site est sécurisé (HTTPS, headers, validations)
- ☑ Le SEO est optimisé (sitemap, meta, schema)
- ☑ Le site est déployé sur VPS a2hosting et accessible
- ☑ La documentation est livrée
- ☑ La formation est réalisée

---

## 17. VALIDATION

**Date de soumission v1.1** : _______________
**Date de validation** : _______________
**Validé par** : _______________

---

### 📌 PROCHAINE ÉTAPE

Une fois ce cahier des charges **validé**, nous passerons au **CAHIER DE CONCEPTION** qui détaillera :

1. L'architecture détaillée (schémas BDD complets, endpoints API, structure des composants Next.js)
2. Les wireframes et user flows
3. La découpe en **phases séquentielles** avec un **prompt de développement Claude Code** pour chaque étape
4. La stratégie de tests
5. Le plan de déploiement détaillé sur VPS a2hosting

---

**Document préparé pour TANGER CODE — Juin 2026 — Version 1.1**
