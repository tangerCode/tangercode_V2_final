# CLAUDE.md — Projet TANGER CODE

> Ce fichier fournit le contexte permanent du projet à Claude Code. Il est chargé 
> automatiquement à chaque session.

## 🎯 PROJET

**TANGER CODE** est un site web vitrine pour une activité freelance de développement 
web et mobile basée à Tanger, Maroc. Cible : PME marocaines, entrepreneurs, clients 
internationaux francophones/anglophones/arabophones.

**Multilangue** : Français (défaut), Anglais, Arabe (avec RTL)
**Modes** : Sombre par défaut + switch mode clair

## 📚 DOCUMENTS DE RÉFÉRENCE (à toujours consulter)

Avant toute action, lis ces documents dans l'ordre :
1. `../docs/cahier_des_charges_tanger_code_v1.1.md` — Spécifications validées
2. `../docs/cahier_de_conception_tanger_code.md` — Architecture + 23 phases
3. `../maquettes/` — Maquettes HTML de référence visuelle (TRÈS IMPORTANT)

**Toujours te référer aux maquettes HTML correspondantes** quand tu codes une page Next.js. 
Les maquettes définissent l'aspect visuel cible. Ouvre-les avec ton tool de lecture de 
fichier et inspecte le HTML/CSS pour reproduire fidèlement le design.

## 🏗️ ARCHITECTURE

```
tangercode/
├── tangercode-backend/    ← Django REST API (api.tangercode.com)
├── tangercode-frontend/   ← Next.js (tangercode.com + /admin)
└── tangercode-deployment/ ← Docker Compose, Nginx, scripts
```

### Stack Backend
- Python 3.12+, Django 5+, Django REST Framework
- PostgreSQL 16, Redis 7
- Celery + Celery Beat (tâches async)
- JWT auth (djangorestframework-simplejwt)
- Argon2 pour les mots de passe
- Pillow pour les images
- google-analytics-data pour GA4
- anthropic (SDK Claude) pour traduction IA
- pytest pour les tests
- ruff, black, isort pour le linting

### Stack Frontend
- Next.js 14+ (App Router), TypeScript strict mode
- Tailwind CSS + Shadcn/ui
- Framer Motion + GSAP pour animations
- Three.js + React Three Fiber + Drei pour la scène 3D
- next-intl pour i18n (fr/en/ar)
- next-themes pour dark/light mode (default: dark)
- React Hook Form + Zod
- Zustand pour state management
- Axios pour HTTP
- TanStack Table pour les datatables admin
- TipTap ou Lexical pour rich text editor
- Recharts pour graphiques admin
- vitest + Testing Library pour tests
- Playwright pour E2E

### Stack DevOps
- Docker + Docker Compose
- Nginx (reverse proxy)
- Gunicorn pour Django, PM2 pour Next.js
- VPS a2hosting (Ubuntu 22.04 LTS)
- GitHub Actions pour CI/CD
- Let's Encrypt (Certbot) pour SSL

## 🎨 IDENTITÉ VISUELLE "MEDITERRANEAN TECH"

### Palette
```
PRIMAIRE
  primary-50:  #EBF2FF
  primary-500: #0052CC  ← couleur principale
  primary-700: #003D99
  primary-900: #001F4D

ACCENTS
  cyan:   #00D4FF  ← néon, glows, lignes 3D
  orange: #FF6B35  ← CTAs secondaires

MODE SOMBRE (DÉFAUT)
  bg-base:     #0A1628
  bg-surface:  #0F1F3D
  bg-elevated: #15264A
  text:        #FFFFFF
  text-muted:  #94A3B8
  border:      #1E3A5F

MODE CLAIR
  bg-base:     #F8FAFC
  bg-surface:  #FFFFFF
  text:        #0F172A
  text-muted:  #64748B
  border:      #E2E8F0

ÉTATS
  success: #10B981
  error:   #EF4444
  warning: #F59E0B
  info:    #3B82F6
```

### Typographie
- **Cabinet Grotesk** : titres (h1, h2, h3) — weights 500, 700, 800
- **Inter** : corps de texte — weights 400, 500, 600, 700
- **JetBrains Mono** : code, chiffres, accents techniques
- **Cairo** : texte arabe (RTL)

## 🎯 CONCEPT 3D HERO : "L'ARCHITECTE DU CODE"

Polyèdre cristallin (icosaèdre/dodécaèdre) flottant avec :
- Arêtes lumineuses cyan
- Lignes de code stylisées circulant le long des arêtes
- Particules flottantes en arrière-plan (symboles `<>`, `{}`, etc.)
- Rotation lente + breathing
- Parallaxe au mouvement souris
- Morphing au scroll : polyèdre → web → mobile → ERP → plateforme

Technologie : Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing

## 📂 STRUCTURE DES PHASES DE DÉVELOPPEMENT

Le développement suit 23 phases séquentielles (P0 → P23) documentées dans 
`../docs/cahier_de_conception_tanger_code.md` (section 8). Chaque phase contient 
son propre prompt détaillé à suivre.

**Phase courante** : P15 — Frontend : Blog
- [x] P0 — Setup repositories & Docker
- [x] P1 — Backend : Django + DB + Auth JWT
- [x] P2 — Backend : Modèles & Admin Django
- [x] P3 — Backend : API publique
- [x] P4 — Backend : API admin (CRUD)
- [x] P5 — Backend : Traduction IA Claude + Celery
- [x] P6 — Backend : Contact, Emails, reCAPTCHA
- [x] P7 — Backend : Intégration GA4
- [ ] P5 — Backend : Traduction IA Claude + Celery
- [ ] P6 — Backend : Contact, Emails, reCAPTCHA
- [ ] P7 — Backend : Intégration GA4
- [x] P8 — Frontend : Setup Next.js + Tailwind + Shadcn + i18n
- [x] P9 — Frontend : Composants UI globaux
- [x] P10 — Frontend : Scène 3D Architecte du Code
- [x] P11 — Frontend : Page d'accueil complete
- [x] P12 — Frontend : Pages Services
- [x] P13 — Frontend : Pages Portfolio
- [x] P14 — Frontend : Page Tarifs
- [x] P15 — Frontend : Blog
- [x] P16 — Frontend : Pages additionnelles
- [ ] P17 — Frontend : Dashboard Admin (auth + layout)
- [ ] P18 — Frontend : Modules admin (CRUD contenus)
- [ ] P19 — Frontend : Modules admin (analytics, config, IA)
- [ ] P20 — SEO & Performance (Lighthouse > 90)
- [ ] P21 — Tests E2E (Playwright)
- [ ] P22 — Déploiement VPS a2hosting + CI/CD
- [ ] P23 — Documentation & Formation

## 🛠️ COMMANDES IMPORTANTES

### Backend Django
```bash
cd tangercode-backend
docker-compose up                          # Démarre tous les services
python manage.py makemigrations            # Créer migrations
python manage.py migrate                   # Appliquer migrations
python manage.py runserver                 # Dev server
python manage.py createsuperuser           # Créer admin
python manage.py seed_data                 # Peupler la base
pytest                                     # Tests
pytest --cov                               # Tests avec couverture
ruff check . && black . && isort .         # Linting
```

### Frontend Next.js
```bash
cd tangercode-frontend
npm install
npm run dev                                # Dev server (http://localhost:3000)
npm run build                              # Build production
npm run lint                               # Lint
npm run test                               # Tests unitaires
npm run test:e2e                           # Tests Playwright
```

## 📝 CONVENTIONS DE CODE

### Python (backend)
- Black pour le formatting (line-length 100)
- isort pour les imports (profile black)
- Ruff pour le linting
- Type hints obligatoires sur les fonctions publiques
- Docstrings au format Google
- Naming : snake_case pour variables/fonctions, PascalCase pour classes
- Tests : pytest avec fixtures, factory_boy pour les fakes
- Architecture : Service Layer pour la logique métier complexe

### TypeScript (frontend)
- TypeScript strict mode obligatoire
- Pas de `any` (utiliser `unknown` si nécessaire)
- Prettier pour le formatting
- ESLint avec règles strictes
- Naming : camelCase pour variables/fonctions, PascalCase pour composants/types
- Tests : vitest + Testing Library
- Composants : Server Components par défaut, "use client" uniquement si nécessaire
- Folder structure : un dossier par composant majeur avec index.ts

### Git
- Commits sémantiques : `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Branches : `main` (prod), `develop` (staging), `feature/xxx`, `fix/xxx`
- Pas de commit direct sur main (PR obligatoires)
- Conventional Commits

## 🔐 SÉCURITÉ

- Aucune clé API en clair dans le code
- Clés API chiffrées en BDD (cryptography.Fernet)
- Variables sensibles dans `.env` (jamais commité)
- HTTPS obligatoire en prod
- Rate limiting sur endpoints sensibles
- CSRF, XSS, SQL injection : protections actives
- reCAPTCHA v3 sur formulaires publics
- Argon2 pour hash mots de passe
- JWT : access 15min, refresh 7j, blacklist au logout

## ⚡ PERFORMANCE

Objectifs Lighthouse (mesurés en P20) :
- Performance : > 90
- Accessibilité : > 95
- Best Practices : > 95
- SEO : 100

## 🌍 MULTILANGUE

- 3 langues : fr (défaut), en, ar
- URLs avec préfixe : /fr/services, /en/services, /ar/services
- RTL automatique pour l'arabe (dir="rtl" sur <html>)
- Traduction auto via API Claude (workflow Celery) avec édition manuelle possible
- Préservation des traductions éditées manuellement

## 🎯 OBJECTIFS QUALITÉ

- Code production-ready, jamais de TODO laissés en place
- Tests : couverture backend > 80%, frontend > 70%
- Documentation à jour (docstrings, README, commentaires utiles)
- Pas de console.log en production
- Pas de magic numbers (constantes nommées)
- Composants frontend : 1 responsabilité = 1 composant

## ⚠️ POINTS D'ATTENTION

1. **Toujours valider une phase avant de passer à la suivante** : exécuter les tests, 
   vérifier les critères d'acceptation listés dans le cahier de conception.

2. **Consulter les maquettes HTML** : pour chaque page Next.js, ouvrir la maquette 
   correspondante dans `../maquettes/` et la reproduire fidèlement.

3. **Préserver l'identité visuelle** : utiliser STRICTEMENT la palette Mediterranean 
   Tech, les polices spécifiées, les espacements définis.

4. **Penser RTL dès le départ** : tous les composants doivent supporter `dir="rtl"`.

5. **Mode sombre par défaut** : tester les 2 modes systématiquement.

6. **Pas de hardcoding de textes** : utiliser next-intl côté frontend pour TOUS les 
   textes UI. Les contenus dynamiques viennent de l'API backend.

7. **Backend-first** : finir le backend (P0-P7) avant d'attaquer le frontend (P8+).
```

