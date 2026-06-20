# 🏗️ CAHIER DE CONCEPTION — TANGER CODE

**Projet** : Site web vitrine professionnel — TANGER CODE
**Version** : 1.0
**Date** : Juin 2026
**Document précédent** : Cahier des charges v1.1 (validé)

---

## 📑 TABLE DES MATIÈRES

1. [Vue d'ensemble de l'architecture](#1-vue-densemble-de-larchitecture)
2. [Modèle de données (Base de données)](#2-modèle-de-données-base-de-données)
3. [Spécifications API REST](#3-spécifications-api-rest)
4. [Architecture Frontend Next.js](#4-architecture-frontend-nextjs)
5. [Système de traduction IA](#5-système-de-traduction-ia)
6. [Sécurité & Authentification](#6-sécurité--authentification)
7. [User Flows clés](#7-user-flows-clés)
8. [Découpe en phases de développement](#8-découpe-en-phases-de-développement)
9. [Stratégie de tests](#9-stratégie-de-tests)
10. [Plan de déploiement VPS a2hosting](#10-plan-de-déploiement-vps-a2hosting)

---

## 1. VUE D'ENSEMBLE DE L'ARCHITECTURE

### 1.1 Architecture trois couches

```
┌─────────────────────────────────────────────────────────────────┐
│                       COUCHE PRÉSENTATION                       │
│                                                                 │
│  ┌──────────────────────┐         ┌────────────────────────┐   │
│  │  Site Public         │         │  Dashboard Admin       │   │
│  │  Next.js 14+ (SSR)   │         │  Next.js (CSR + JWT)   │   │
│  │  tangercode.com      │         │  tangercode.com/admin  │   │
│  └──────────────────────┘         └────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS / REST API
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                       COUCHE APPLICATION                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Django REST Framework — api.tangercode.com              │  │
│  │                                                          │  │
│  │  • Public API (lecture seule)                            │  │
│  │  • Admin API (JWT)                                       │  │
│  │  • Translation Service (Claude API)                      │  │
│  │  • Analytics Service (GA4 API)                           │  │
│  │  • Email Service                                         │  │
│  │  • Celery Workers (tâches asynchrones)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ PostgreSQL  │ │   Redis     │ │ Cloudinary  │
│ (Données)   │ │ (Cache+     │ │ (Images)    │
│             │ │  Celery)    │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Claude API │ │  GA4 API    │ │  SMTP       │
│ (Anthropic) │ │  (Google)   │ │ (a2hosting) │
└─────────────┘ └─────────────┘ └─────────────┘
```

### 1.2 Domaines et sous-domaines

| Domaine | Service | Description |
|---------|---------|-------------|
| `tangercode.com` | Next.js | Site public multilangue |
| `tangercode.com/admin` | Next.js | Dashboard admin (même app) |
| `api.tangercode.com` | Django REST | API backend |
| `staging.tangercode.com` | Next.js | Environnement de pré-production (optionnel) |

### 1.3 Repositories

| Repository | Contenu |
|------------|---------|
| `tangercode-frontend` | Next.js (site public + admin intégré) |
| `tangercode-backend` | Django + DRF + Celery |
| `tangercode-deployment` | Docker Compose, Nginx configs, scripts de déploiement |

---

## 2. MODÈLE DE DONNÉES (BASE DE DONNÉES)

### 2.1 Schéma général

Le schéma utilise un **pattern de traduction séparée** : chaque entité traduisible a une table principale (données neutres) et une table de traductions (contenu par langue).

### 2.2 Modèles complets

#### 2.2.1 Utilisateurs & Authentification

```python
# User (administrateurs)
class User(AbstractUser):
    email = EmailField(unique=True)  # username = email
    first_name, last_name
    role = CharField(choices=[SUPER_ADMIN, EDITOR, CONTRIBUTOR])
    is_active, is_staff
    avatar = ImageField(nullable)
    phone = CharField(nullable)
    two_factor_enabled = BooleanField(default=False)
    two_factor_secret = CharField(nullable, encrypted)
    last_login_ip = GenericIPAddressField(nullable)
    created_at, updated_at

# ActivityLog
class ActivityLog(Model):
    user = ForeignKey(User)
    action = CharField()  # 'created', 'updated', 'deleted', 'login', etc.
    model_name = CharField()
    object_id = CharField(nullable)
    ip_address = GenericIPAddressField()
    user_agent = TextField()
    details = JSONField(default=dict)
    created_at
```

#### 2.2.2 Multilangue

```python
# Language
class Language(Model):
    code = CharField(max_length=5, unique=True)  # 'fr', 'en', 'ar'
    name = CharField()  # 'Français', 'English', 'العربية'
    native_name = CharField()
    is_default = BooleanField(default=False)
    is_active = BooleanField(default=True)
    is_rtl = BooleanField(default=False)
    order = IntegerField()
```

#### 2.2.3 Services

```python
# Technology
class Technology(Model):
    name = CharField(unique=True)
    slug = SlugField(unique=True)
    logo = ImageField()
    category = CharField(choices=[FRONTEND, BACKEND, MOBILE, DATABASE, DEVOPS, DESIGN])
    color = CharField()  # hex
    order = IntegerField()
    is_active = BooleanField(default=True)

# Service
class Service(Model):
    slug = SlugField(unique=True)
    icon = CharField()  # lucide icon name
    cover_image = ImageField()
    technologies = ManyToManyField(Technology)
    featured = BooleanField(default=False)
    order = IntegerField()
    is_active = BooleanField(default=True)
    created_at, updated_at

# ServiceTranslation
class ServiceTranslation(Model):
    service = ForeignKey(Service, related_name='translations')
    language = ForeignKey(Language)
    title = CharField()
    short_description = TextField()
    long_description = TextField()  # rich text
    meta_title = CharField(nullable)
    meta_description = TextField(nullable)
    auto_translated = BooleanField(default=False)
    last_edited_manually = DateTimeField(nullable)
    
    class Meta:
        unique_together = [('service', 'language')]
```

#### 2.2.4 Tarification

```python
# PricingTier
class PricingTier(Model):
    service = ForeignKey(Service, related_name='pricing_tiers')
    code = CharField()  # 'starter', 'pro', 'premium'
    price_mad = DecimalField()  # prix de base en MAD
    price_eur = DecimalField(nullable)  # conversion manuelle ou auto
    price_usd = DecimalField(nullable)
    is_custom_quote = BooleanField(default=False)  # "sur devis"
    delivery_days = IntegerField(nullable)
    revisions_count = IntegerField(nullable)
    support_days = IntegerField(nullable)
    is_featured = BooleanField(default=False)
    order = IntegerField()
    is_active = BooleanField(default=True)

# PricingTierTranslation
class PricingTierTranslation(Model):
    pricing_tier = ForeignKey(PricingTier, related_name='translations')
    language = ForeignKey(Language)
    name = CharField()
    description = TextField()
    features = JSONField(default=list)  # liste des fonctionnalités
    cta_text = CharField(default='Commander')
    auto_translated = BooleanField(default=False)
```

#### 2.2.5 Portfolio

```python
# Project
class Project(Model):
    slug = SlugField(unique=True)
    client_name = CharField()
    category = CharField(choices=[WEBSITE, ECOMMERCE, PLATFORM, ERP, MOBILE])
    project_url = URLField(nullable)
    year = IntegerField()
    duration_months = IntegerField(nullable)
    technologies = ManyToManyField(Technology)
    cover_image = ImageField()
    featured = BooleanField(default=False)
    order = IntegerField()
    is_active = BooleanField(default=True)
    created_at, updated_at

# ProjectImage (galerie)
class ProjectImage(Model):
    project = ForeignKey(Project, related_name='images')
    image = ImageField()
    alt_text = CharField()
    order = IntegerField()

# ProjectTranslation
class ProjectTranslation(Model):
    project = ForeignKey(Project, related_name='translations')
    language = ForeignKey(Language)
    title = CharField()
    short_description = TextField()
    long_description = TextField()  # rich text (challenge, solution, results)
    client_testimonial = TextField(nullable)
    meta_title = CharField(nullable)
    meta_description = TextField(nullable)
    auto_translated = BooleanField(default=False)
```

#### 2.2.6 Blog

```python
# BlogCategory
class BlogCategory(Model):
    slug = SlugField(unique=True)
    color = CharField()  # hex
    order = IntegerField()
    is_active = BooleanField(default=True)

class BlogCategoryTranslation(Model):
    category = ForeignKey(BlogCategory, related_name='translations')
    language = ForeignKey(Language)
    name = CharField()
    description = TextField(nullable)

# BlogTag
class BlogTag(Model):
    slug = SlugField(unique=True)

class BlogTagTranslation(Model):
    tag = ForeignKey(BlogTag, related_name='translations')
    language = ForeignKey(Language)
    name = CharField()

# BlogPost
class BlogPost(Model):
    slug = SlugField(unique=True)
    author = ForeignKey(User)
    categories = ManyToManyField(BlogCategory)
    tags = ManyToManyField(BlogTag)
    cover_image = ImageField()
    status = CharField(choices=[DRAFT, PUBLISHED, ARCHIVED])
    published_at = DateTimeField(nullable)
    views_count = IntegerField(default=0)
    featured = BooleanField(default=False)
    created_at, updated_at

class BlogPostTranslation(Model):
    post = ForeignKey(BlogPost, related_name='translations')
    language = ForeignKey(Language)
    title = CharField()
    excerpt = TextField()
    content = TextField()  # rich text (HTML)
    meta_title = CharField(nullable)
    meta_description = TextField(nullable)
    auto_translated = BooleanField(default=False)
```

#### 2.2.7 Témoignages

```python
class Testimonial(Model):
    client_photo = ImageField(nullable)
    client_name = CharField()
    client_company = CharField()
    client_position = CharField(nullable)
    rating = IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    project = ForeignKey(Project, nullable, blank=True)
    video_url = URLField(nullable)
    is_active = BooleanField(default=True)
    order = IntegerField()
    created_at

class TestimonialTranslation(Model):
    testimonial = ForeignKey(Testimonial, related_name='translations')
    language = ForeignKey(Language)
    content = TextField()
    auto_translated = BooleanField(default=False)
```

#### 2.2.8 FAQ

```python
class FAQCategory(Model):
    slug = SlugField(unique=True)
    icon = CharField(nullable)
    order = IntegerField()
    is_active = BooleanField(default=True)

class FAQCategoryTranslation(Model):
    category = ForeignKey(FAQCategory, related_name='translations')
    language = ForeignKey(Language)
    name = CharField()

class FAQ(Model):
    category = ForeignKey(FAQCategory, related_name='faqs')
    order = IntegerField()
    is_active = BooleanField(default=True)

class FAQTranslation(Model):
    faq = ForeignKey(FAQ, related_name='translations')
    language = ForeignKey(Language)
    question = CharField()
    answer = TextField()
    auto_translated = BooleanField(default=False)
```

#### 2.2.9 Messages de contact

```python
class ContactMessage(Model):
    name = CharField()
    email = EmailField()
    phone = CharField(nullable)
    company = CharField(nullable)
    subject = CharField()
    message = TextField()
    service_interested = ForeignKey(Service, nullable)
    budget_range = CharField(nullable, choices=[BUDGET_RANGES])
    status = CharField(choices=[NEW, READ, REPLIED, ARCHIVED, SPAM])
    ip_address = GenericIPAddressField()
    user_agent = TextField()
    language = CharField()  # langue depuis laquelle le message a été envoyé
    created_at
    read_at = DateTimeField(nullable)
    replied_at = DateTimeField(nullable)
    reply_content = TextField(nullable)
    replied_by = ForeignKey(User, nullable)
```

#### 2.2.10 Configuration & SEO

```python
# SiteConfig (singleton)
class SiteConfig(Model):
    site_name = CharField()
    site_email = EmailField()
    site_phone = CharField()
    site_address = TextField()
    whatsapp_number = CharField()
    logo_light = ImageField()
    logo_dark = ImageField()
    favicon = ImageField()
    linkedin_url, github_url, instagram_url, facebook_url, twitter_url = URLField
    ga4_property_id = CharField(nullable)
    ga4_measurement_id = CharField(nullable)
    google_search_console_verification = CharField(nullable)
    recaptcha_site_key = CharField(nullable)
    recaptcha_secret_key = CharField(nullable, encrypted)

class SiteConfigTranslation(Model):
    config = ForeignKey(SiteConfig, related_name='translations')
    language = ForeignKey(Language)
    tagline = CharField()
    hero_subtitle = TextField()
    footer_description = TextField()
    whatsapp_message = TextField()  # message pré-rempli
    seo_default_title = CharField()
    seo_default_description = TextField()

# PageSEO (SEO par page statique)
class PageSEO(Model):
    page_key = CharField(unique=True)  # 'home', 'services', 'portfolio', ...
    og_image = ImageField(nullable)

class PageSEOTranslation(Model):
    page_seo = ForeignKey(PageSEO, related_name='translations')
    language = ForeignKey(Language)
    meta_title = CharField()
    meta_description = TextField()
```

#### 2.2.11 IA & Traduction

```python
# AIProvider
class AIProvider(Model):
    name = CharField()  # 'claude-anthropic', 'openai', 'google'
    api_key = CharField(encrypted)  # chiffré
    base_url = URLField()
    model_name = CharField()  # 'claude-opus-4-7', etc.
    max_tokens = IntegerField(default=4096)
    temperature = FloatField(default=0.3)
    is_active = BooleanField(default=True)
    is_default = BooleanField(default=False)
    created_at, updated_at

# TranslationPrompt
class TranslationPrompt(Model):
    name = CharField()  # 'default', 'blog', 'legal', 'technical'
    field_type = CharField()  # 'short_text', 'long_text', 'rich_text', 'list'
    prompt_template = TextField()
    # Exemple: "Translate the following {field_type} from {source_lang} to {target_lang}.
    # Keep technical terms unchanged. Return ONLY the translation without explanation.
    # Content: {content}"
    is_default = BooleanField(default=False)

# TranslationLog
class TranslationLog(Model):
    content_type = ForeignKey(ContentType)
    object_id = PositiveIntegerField()
    field_name = CharField()
    source_language = ForeignKey(Language, related_name='+')
    target_language = ForeignKey(Language, related_name='+')
    source_text = TextField()
    translated_text = TextField()
    status = CharField(choices=[SUCCESS, ERROR, PENDING])
    error_message = TextField(nullable)
    tokens_used = IntegerField(nullable)
    cost_usd = DecimalField(nullable)
    ai_provider = ForeignKey(AIProvider)
    duration_ms = IntegerField(nullable)
    created_at
```

#### 2.2.12 Newsletter & Sauvegardes (optionnel)

```python
class NewsletterSubscriber(Model):
    email = EmailField(unique=True)
    language = ForeignKey(Language)
    is_active = BooleanField(default=True)
    confirmed = BooleanField(default=False)
    confirmation_token = CharField()
    subscribed_at, unsubscribed_at

class Backup(Model):
    file_path = CharField()
    file_size = BigIntegerField()
    backup_type = CharField(choices=[AUTO, MANUAL])
    status = CharField(choices=[SUCCESS, FAILED])
    created_at
    created_by = ForeignKey(User, nullable)
```

### 2.3 Relations clés (diagramme ER simplifié)

```
User ──┬── ActivityLog (auteur d'actions)
       └── BlogPost (auteur d'articles)

Service ──┬── ServiceTranslation (1-N)
          ├── Technology (M-N)
          └── PricingTier (1-N) ── PricingTierTranslation (1-N)

Project ──┬── ProjectTranslation (1-N)
          ├── ProjectImage (1-N)
          ├── Technology (M-N)
          └── Testimonial (0-N)

BlogPost ──┬── BlogPostTranslation (1-N)
           ├── BlogCategory (M-N)
           ├── BlogTag (M-N)
           └── User (auteur)

FAQ ──┬── FAQTranslation (1-N)
      └── FAQCategory (N-1) ── FAQCategoryTranslation (1-N)

ContactMessage ──── Service (intérêt, optionnel)
                ──── User (répondu par, optionnel)

TranslationLog ──┬── ContentType (générique)
                 ├── Language × 2 (source + target)
                 └── AIProvider
```

---

## 3. SPÉCIFICATIONS API REST

### 3.1 Convention générale

- **Base URL** : `https://api.tangercode.com/api/v1/`
- **Format** : JSON
- **Authentification admin** : `Authorization: Bearer <JWT_TOKEN>`
- **Header langue** : `Accept-Language: fr | en | ar` (détermine la langue de réponse)
- **Pagination** : `?page=1&page_size=10`
- **Filtres** : `?category=web&technology=nextjs`
- **Recherche** : `?search=mot-clé`
- **Tri** : `?ordering=-created_at`

### 3.2 Endpoints publics (`/api/v1/public/`)

#### Services
```
GET    /services/                    → Liste des services actifs
GET    /services/{slug}/             → Détail d'un service
GET    /services/{slug}/pricing/     → Tarifs d'un service
```

#### Portfolio
```
GET    /projects/                    → Liste avec filtres (?category, ?technology, ?year, ?featured)
GET    /projects/{slug}/             → Détail d'un projet
GET    /projects/categories/         → Liste des catégories
GET    /projects/featured/           → Projets mis en avant
```

#### Blog
```
GET    /blog/posts/                  → Liste avec filtres et recherche
GET    /blog/posts/{slug}/           → Détail d'un article
GET    /blog/posts/{slug}/related/   → Articles liés
GET    /blog/categories/             → Liste des catégories
GET    /blog/tags/                   → Liste des tags
POST   /blog/posts/{slug}/view/      → Incrémenter le compteur de vues
```

#### Tarifs
```
GET    /pricing/                     → Toutes les formules tarifaires
GET    /pricing/by-service/{slug}/   → Formules d'un service
```

#### Témoignages, FAQ, Technologies
```
GET    /testimonials/                → Liste des témoignages actifs
GET    /faq/                         → Liste des FAQ groupées par catégorie
GET    /technologies/                → Liste des technologies
```

#### Configuration & SEO
```
GET    /site-config/                 → Configuration globale du site
GET    /site-config/seo/{page_key}/  → SEO d'une page spécifique
```

#### Contact
```
POST   /contact/                     → Envoi du formulaire
       Body: { name, email, phone?, company?, subject, message, service_interested?, recaptcha_token }
```

### 3.3 Endpoints admin (`/api/v1/admin/`) — JWT requis

#### Authentification
```
POST   /auth/login/                  → Body: { email, password } → { access, refresh, user }
POST   /auth/refresh/                → Body: { refresh } → { access }
POST   /auth/logout/                 → Invalide le refresh token
GET    /auth/me/                     → Profil de l'utilisateur connecté
PATCH  /auth/me/                     → Mise à jour du profil
POST   /auth/change-password/        → Changement de mot de passe
POST   /auth/2fa/enable/             → Activer 2FA
POST   /auth/2fa/verify/             → Vérifier code 2FA
POST   /auth/password-reset/         → Demande de reset
POST   /auth/password-reset/confirm/ → Confirmation avec token
```

#### CRUD complet pour chaque ressource
```
GET    /services/                    → Liste paginée (incluant inactifs)
POST   /services/                    → Création
GET    /services/{id}/               → Détail
PATCH  /services/{id}/               → Modification partielle
DELETE /services/{id}/               → Suppression
POST   /services/{id}/translate/     → Lancer/relancer la traduction auto
PATCH  /services/{id}/translations/{lang}/ → Édition manuelle d'une traduction

(Pattern identique pour : projects, pricing-tiers, blog/posts, blog/categories,
 blog/tags, testimonials, faq, faq/categories, technologies)
```

#### Messages
```
GET    /messages/                    → Liste avec filtres par statut
GET    /messages/{id}/               → Détail
PATCH  /messages/{id}/               → Changement de statut
POST   /messages/{id}/reply/         → Envoi d'une réponse par email
GET    /messages/export/             → Export CSV
GET    /messages/stats/              → Statistiques (nouveaux, traités, etc.)
```

#### Analytics (Google Analytics 4)
```
GET    /analytics/overview/          → KPIs (visiteurs, sessions, etc.) sur période
       Query: ?start_date=&end_date=
GET    /analytics/traffic-sources/   → Sources de trafic
GET    /analytics/top-pages/         → Pages les plus visitées
GET    /analytics/devices/           → Répartition appareils
GET    /analytics/countries/         → Répartition géographique
GET    /analytics/conversions/       → Formulaires, clics WhatsApp
```

#### Configuration
```
GET    /config/site/                 → Config actuelle
PATCH  /config/site/                 → Mise à jour
GET    /config/languages/            → Langues disponibles
PATCH  /config/languages/{id}/       → Activation/désactivation
```

#### IA & Traduction
```
GET    /config/ai-providers/         → Liste des providers
POST   /config/ai-providers/         → Création
PATCH  /config/ai-providers/{id}/    → Modification (changement de clé API, modèle, etc.)
POST   /config/ai-providers/{id}/test/ → Test de la connexion API
GET    /config/translation-prompts/  → Liste des prompts
PATCH  /config/translation-prompts/{id}/ → Modification d'un prompt
POST   /translate/                   → Traduction à la demande
       Body: { content, source_lang, target_lang, field_type?, prompt_id? }
GET    /translation-logs/            → Logs des traductions effectuées
GET    /translation-logs/stats/      → Stats coûts, volume
```

#### Utilisateurs admin
```
GET    /users/                       → Liste des admins
POST   /users/                       → Créer un admin
PATCH  /users/{id}/                  → Modifier
DELETE /users/{id}/                  → Désactiver
GET    /users/{id}/activity/         → Logs d'activité d'un utilisateur
```

#### Sauvegardes
```
GET    /backups/                     → Liste
POST   /backups/                     → Créer une sauvegarde manuelle
GET    /backups/{id}/download/       → Télécharger
DELETE /backups/{id}/                → Supprimer
```

### 3.4 Codes de réponse

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé |
| 204 | Pas de contenu (DELETE OK) |
| 400 | Données invalides |
| 401 | Non authentifié |
| 403 | Non autorisé (permissions) |
| 404 | Ressource introuvable |
| 422 | Erreur de validation |
| 429 | Rate limit dépassé |
| 500 | Erreur serveur |

### 3.5 Format d'erreur standard

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides",
    "details": {
      "email": ["Format d'email invalide"],
      "password": ["Au moins 8 caractères requis"]
    }
  }
}
```

---

## 4. ARCHITECTURE FRONTEND NEXT.JS

### 4.1 Structure des dossiers

```
tangercode-frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/                    # Routes publiques multilangues
│   │   │   ├── layout.tsx               # Layout public (header, footer)
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── services/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── legal/
│   │   │       ├── mentions/page.tsx
│   │   │       └── privacy/page.tsx
│   │   ├── admin/                       # Dashboard admin (CSR)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx           # Layout avec sidebar
│   │   │   │   ├── page.tsx             # Dashboard home
│   │   │   │   ├── services/...
│   │   │   │   ├── portfolio/...
│   │   │   │   ├── blog/...
│   │   │   │   ├── pricing/...
│   │   │   │   ├── testimonials/...
│   │   │   │   ├── faq/...
│   │   │   │   ├── messages/...
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   ├── config/...
│   │   │   │   ├── ai/...
│   │   │   │   ├── users/...
│   │   │   │   └── backups/page.tsx
│   │   ├── api/                         # Routes API Next.js (revalidation, webhooks)
│   │   │   ├── revalidate/route.ts
│   │   │   └── sitemap.xml/route.ts
│   │   ├── robots.txt/route.ts
│   │   ├── sitemap.xml/route.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                          # shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   ├── BackToTopButton.tsx
│   │   │   └── CookieBanner.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   ├── PortfolioPreview.tsx
│   │   │   ├── PricingPreview.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── TechnologiesSection.tsx
│   │   │   ├── BlogPreview.tsx
│   │   │   └── ContactCTA.tsx
│   │   ├── 3d/
│   │   │   ├── CodeArchitectScene.tsx       # Scène principale
│   │   │   ├── CrystalPolyhedron.tsx        # Polyèdre central
│   │   │   ├── FloatingParticles.tsx        # Particules
│   │   │   ├── CodeFlowLines.tsx            # Lignes de code animées
│   │   │   └── SceneController.tsx          # Gestion morphing & scroll
│   │   ├── services/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceDetail.tsx
│   │   │   └── ServiceTechnologies.tsx
│   │   ├── portfolio/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGallery.tsx
│   │   │   ├── ProjectFilters.tsx
│   │   │   └── ProjectDetail.tsx
│   │   ├── pricing/
│   │   │   ├── PricingCard.tsx
│   │   │   ├── PricingComparison.tsx
│   │   │   └── CurrencySelector.tsx
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogSearch.tsx
│   │   │   ├── BlogPostContent.tsx
│   │   │   └── RelatedPosts.tsx
│   │   ├── shared/
│   │   │   ├── AnimatedCounter.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── NewsletterForm.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── TranslationPanel.tsx
│   │   │   ├── ServiceForm.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   └── ...
│   │   └── seo/
│   │       ├── JsonLd.tsx
│   │       └── MetaTags.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts               # Axios instance
│   │   │   ├── public.ts               # Endpoints publics
│   │   │   ├── admin.ts                # Endpoints admin
│   │   │   ├── auth.ts                 # Login, refresh, etc.
│   │   │   └── types.ts                # Types des réponses API
│   │   ├── utils.ts                    # cn, formatDate, formatPrice, etc.
│   │   ├── constants.ts
│   │   ├── seo.ts                      # Helpers SEO
│   │   ├── analytics.ts                # GA4 tracking côté client
│   │   └── validation.ts               # Schémas Zod
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useLanguage.ts
│   │   ├── useScroll.ts
│   │   ├── useMediaQuery.ts
│   │   └── useTranslation.ts
│   ├── store/                          # Zustand
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── adminStore.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── routing.ts                  # next-intl routing
│   │   └── messages/
│   │       ├── fr.json
│   │       ├── en.json
│   │       └── ar.json
│   ├── types/
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── ui.ts
│   └── middleware.ts                   # i18n + auth admin
├── public/
│   ├── images/
│   ├── fonts/                          # Cabinet Grotesk, JetBrains Mono, Cairo
│   └── favicon.ico
├── messages/                           # Fichiers de traduction (si pas dans src/i18n)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── components.json                     # shadcn config
├── .env.local.example
└── package.json
```

### 4.2 Configuration clé

#### next.config.js
- App Router
- next-intl plugin
- Image domains (Cloudinary)
- Headers de sécurité
- Redirects (langue par défaut)

#### tailwind.config.ts
- Couleurs personnalisées (palette Mediterranean Tech)
- Polices custom (Cabinet Grotesk, Inter, JetBrains Mono, Cairo)
- Animations custom (glow, float, morph)
- Support RTL

#### middleware.ts
- next-intl pour redirection langue (/fr, /en, /ar)
- Protection des routes /admin (vérification JWT)

### 4.3 Gestion des thèmes (Dark/Light)

```typescript
// Utilisation de next-themes
// app/[locale]/layout.tsx
<ThemeProvider 
  attribute="class" 
  defaultTheme="dark"      // ← mode sombre par défaut
  enableSystem={true}       // respect preference système au 1er chargement
  storageKey="tangercode-theme"
>
  {children}
</ThemeProvider>
```

### 4.4 Gestion du multilangue (next-intl)

```
URLs structure:
- /            → redirige vers /fr
- /fr          → home FR
- /en          → home EN
- /ar          → home AR (avec dir="rtl")
- /fr/services → liste services FR
- /ar/services → liste services AR (RTL)
```

```typescript
// i18n/routing.ts
export const routing = defineRouting({
  locales: ['fr', 'en', 'ar'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/services': {
      fr: '/services',
      en: '/services',
      ar: '/الخدمات'
    },
    // ...
  }
});
```

---

## 5. SYSTÈME DE TRADUCTION IA

### 5.1 Architecture

```
┌──────────────────┐
│  Admin Dashboard │
│  Crée/édite      │
│  contenu en FR   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│  Django API      │────────►│  Celery Queue    │
│  Sauvegarde +    │         │  (Redis)         │
│  déclenche tâche │         └────────┬─────────┘
└──────────────────┘                  │
                                      ▼
                            ┌──────────────────┐
                            │  Celery Worker   │
                            │  Translation     │
                            │  Service         │
                            └────────┬─────────┘
                                     │
                          ┌──────────┼──────────┐
                          ▼          ▼          ▼
                     ┌────────┐ ┌────────┐ ┌────────┐
                     │ Claude │ │ Build  │ │ Save   │
                     │  API   │►│ prompt │►│ to DB  │
                     └────────┘ └────────┘ └────────┘
                          │
                          ▼
                     ┌────────────┐
                     │ Log into   │
                     │ Translation│
                     │ Log        │
                     └────────────┘
```

### 5.2 Service de traduction (Python)

```python
# translation/services.py

class TranslationService:
    def __init__(self, provider: AIProvider = None):
        self.provider = provider or AIProvider.objects.get(is_default=True)
        self.client = self._init_client()
    
    def translate(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        field_type: str = 'long_text',
        prompt_template: TranslationPrompt = None
    ) -> dict:
        """
        Returns: {
            'translated_text': str,
            'tokens_used': int,
            'cost_usd': Decimal,
            'duration_ms': int,
            'status': 'success' | 'error',
            'error_message': str | None
        }
        """
        # 1. Build prompt
        # 2. Call API
        # 3. Track usage
        # 4. Return result
    
    def translate_object(
        self,
        instance,
        source_language: Language,
        target_languages: list[Language] = None,
        fields: list[str] = None
    ):
        """Traduit une instance modèle vers les langues cibles"""
        # Détecte automatiquement les champs traduisibles
        # Préserve les champs déjà édités manuellement (sauf force=True)
```

### 5.3 Prompt template par défaut

```
You are a professional translator specializing in tech and web development content.

TASK: Translate the following {field_type} from {source_language} to {target_language}.

RULES:
- Maintain the original tone and style
- Keep technical terms in English (e.g., "Next.js", "Django", "API", "ERP")
- Keep brand names unchanged ("TANGER CODE")
- Preserve HTML tags if present
- For Arabic: use Modern Standard Arabic, professional tone
- For French: use a professional but accessible tone
- Return ONLY the translation, no explanations, no quotes

CONTENT TO TRANSLATE:
{content}

TRANSLATION:
```

### 5.4 Workflow côté admin

1. L'admin remplit un formulaire (ex : créer un service) en FR
2. Au clic sur **"Enregistrer"** :
   - Le contenu FR est sauvegardé
   - Une tâche Celery est déclenchée pour traduire vers EN et AR
   - L'UI affiche "Traduction en cours..." pour EN et AR
3. Une fois les traductions terminées (websocket ou polling) :
   - L'UI affiche les traductions
   - L'admin peut **éditer** chaque traduction manuellement
   - L'admin peut **relancer** une traduction spécifique
   - Le flag `auto_translated=True` devient `False` après édition manuelle
4. Boutons disponibles par traduction :
   - 🔄 Retraduire
   - ✏️ Éditer manuellement
   - 🚫 Désactiver auto-translation pour ce champ

---

## 6. SÉCURITÉ & AUTHENTIFICATION

### 6.1 Authentification JWT

```
[Client]                       [Server]
   │                              │
   │  POST /auth/login            │
   │  { email, password }         │
   ├─────────────────────────────►│
   │                              │
   │  { access (15min),           │
   │    refresh (7d),             │
   │    user }                    │
   │◄─────────────────────────────┤
   │                              │
   │  Stocke access en mémoire    │
   │  Stocke refresh en httpOnly  │
   │  cookie                      │
   │                              │
   │  Requête authentifiée:       │
   │  Authorization: Bearer ...   │
   ├─────────────────────────────►│
   │                              │
   │  Si access expiré:           │
   │  POST /auth/refresh          │
   ├─────────────────────────────►│
   │                              │
   │  { access (nouveau) }        │
   │◄─────────────────────────────┤
```

### 6.2 Permissions

```python
# Permissions DRF
- IsAuthenticated : tous les endpoints admin
- IsSuperAdmin : gestion des users, AI providers, sauvegardes
- IsEditorOrAbove : CRUD contenu
- IsContributor : création blog uniquement
```

### 6.3 Headers de sécurité (Nginx + Next.js)

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 6.4 Rate limiting (Django)

```
- /auth/login/         : 5 requests / minute / IP
- /contact/            : 3 requests / hour / IP
- /translate/          : 100 requests / hour / user
- Autres endpoints     : 1000 requests / hour / IP
```

### 6.5 Validation des entrées
- Côté frontend : Zod (validation immédiate)
- Côté backend : DRF Serializers (validation autoritaire)
- Sanitization HTML : bleach pour le rich text

---

## 7. USER FLOWS CLÉS

### 7.1 Visiteur : découverte d'un service

```
Home (Hero 3D) 
  → Click "Voir les services" 
    → Liste services 
      → Click sur "Sites web" 
        → Détail service + Tarifs 
          → Click "Demander un devis" 
            → Formulaire de contact (pré-rempli avec service)
              → Soumission 
                → Confirmation email + redirection thanks
```

### 7.2 Visiteur : contact WhatsApp rapide

```
N'importe quelle page 
  → Click bouton WhatsApp flottant 
    → Ouverture WhatsApp avec message pré-rempli 
      → Conversation directe
```

### 7.3 Admin : créer un service multilangue

```
Login admin 
  → Dashboard 
    → Services > Nouveau 
      → Remplir formulaire en FR 
        → Cliquer "Enregistrer" 
          → [Background] Traduction auto EN + AR 
            → Notification "Traduction terminée" 
              → Onglets FR/EN/AR avec aperçu 
                → Édition manuelle si besoin 
                  → Service publié sur le site (3 langues)
```

### 7.4 Admin : analyse du trafic

```
Login admin 
  → Dashboard (vue d'ensemble) 
    → Stats du jour (depuis GA4) 
      → Click "Analytics détaillé" 
        → Sélection période 
          → Vue trafic / sources / pages / conversions 
            → Export CSV si besoin
```

---

## 8. DÉCOUPE EN PHASES DE DÉVELOPPEMENT

> **🎯 Principe** : chaque phase produit un livrable autonome et testable. Les phases sont séquentielles avec quelques dépendances claires. Un prompt Claude Code est fourni pour chaque phase.

### Vue d'ensemble des phases

| Phase | Nom | Durée | Repo |
|-------|-----|-------|------|
| **P0** | Setup repositories & environnements | 1j | both |
| **P1** | Backend — Setup Django + DB + Auth JWT | 2j | backend |
| **P2** | Backend — Modèles & Admin Django | 2j | backend |
| **P3** | Backend — API publique (services, projets, blog, etc.) | 3j | backend |
| **P4** | Backend — API admin (CRUD complet) | 3j | backend |
| **P5** | Backend — Traduction IA Claude + Celery | 2j | backend |
| **P6** | Backend — Contact, Emails, reCAPTCHA | 1j | backend |
| **P7** | Backend — Intégration Google Analytics 4 | 1j | backend |
| **P8** | Frontend — Setup Next.js + Tailwind + Shadcn + i18n | 1j | frontend |
| **P9** | Frontend — Composants UI globaux (Header, Footer, etc.) | 2j | frontend |
| **P10** | Frontend — Scène 3D "L'Architecte du Code" | 3j | frontend |
| **P11** | Frontend — Page Accueil complète | 3j | frontend |
| **P12** | Frontend — Pages Services + détail | 2j | frontend |
| **P13** | Frontend — Pages Portfolio + détail | 2j | frontend |
| **P14** | Frontend — Page Tarifs | 1j | frontend |
| **P15** | Frontend — Blog (liste + détail + recherche) | 2j | frontend |
| **P16** | Frontend — Pages À propos, FAQ, Contact, Legal, 404 | 2j | frontend |
| **P17** | Frontend — Dashboard Admin (auth + layout) | 2j | frontend |
| **P18** | Frontend — Modules admin (CRUD contenus) | 4j | frontend |
| **P19** | Frontend — Modules admin (analytics, config, IA) | 2j | frontend |
| **P20** | SEO & Performance (Lighthouse > 90) | 2j | both |
| **P21** | Tests E2E (Playwright) | 2j | both |
| **P22** | Déploiement VPS a2hosting + CI/CD | 2j | deployment |
| **P23** | Documentation & Formation | 2j | both |

**Durée totale estimée** : ~48 jours-homme (~9-10 semaines avec marge)

---

### 🟢 PHASE P0 — Setup repositories & environnements

**Objectif** : Initialiser les deux repositories avec une structure propre, Docker Compose pour le développement local, et les fichiers de configuration de base.

**Livrables** :
- Repository `tangercode-frontend` (Next.js 14+ avec TypeScript)
- Repository `tangercode-backend` (Django 5+ avec Python 3.12+)
- `docker-compose.yml` pour le développement local (PostgreSQL + Redis + Django + Next.js)
- Fichiers `.env.example`
- README de base
- `.gitignore` propres

#### 📝 Prompt Claude Code — P0

```
Tu travailles sur le projet TANGER CODE — un site vitrine pour une activité freelance 
en développement web. Lis attentivement le cahier des charges et le cahier de conception 
fournis avant de commencer.

OBJECTIF DE CETTE PHASE (P0) : initialiser deux repositories et un environnement de 
développement Docker.

STRUCTURE À CRÉER :

1. Repository `tangercode-backend` (Django) :
   - Python 3.12+, Django 5+, Django REST Framework
   - Structure : config/ (settings split dev/prod), apps/ (un dossier par app future)
   - requirements/ avec base.txt, dev.txt, prod.txt
   - Dockerfile pour le service Django
   - .env.example avec toutes les variables nécessaires (DATABASE_URL, REDIS_URL, 
     SECRET_KEY, CLAUDE_API_KEY, GA4_PROPERTY_ID, etc.)
   - pre-commit avec black, isort, ruff
   - pytest configuré

2. Repository `tangercode-frontend` (Next.js) :
   - Next.js 14+ avec App Router, TypeScript strict
   - Tailwind CSS configuré avec la palette "Mediterranean Tech" :
     primaire #0052CC, accent1 #00D4FF, accent2 #FF6B35, dark base #0A1628
   - shadcn/ui initialisé
   - next-intl pour i18n (locales: fr, en, ar)
   - next-themes pour dark/light mode (default: dark)
   - Polices : Cabinet Grotesk (titres), Inter (body), JetBrains Mono (code), Cairo (arabe)
   - Structure /src/ avec app/, components/, lib/, hooks/, store/, types/, i18n/
   - ESLint + Prettier configurés
   - Dockerfile pour Next.js

3. À la racine du projet (peut être un repo `tangercode-deployment` ou dans backend) :
   - docker-compose.yml avec services :
     * postgres (PostgreSQL 16)
     * redis (Redis 7)
     * backend (Django avec hot reload)
     * frontend (Next.js avec hot reload)
     * celery_worker
     * celery_beat
   - Volumes persistants pour postgres et redis
   - Network commune
   - Variables d'environnement via .env

4. Documentation :
   - README.md à la racine de chaque repo expliquant comment démarrer le projet
   - Instructions claires : `docker-compose up`, accès aux services, etc.

CONTRAINTES :
- Utilise les dernières versions stables
- Suis les bonnes pratiques de structuration (12-factor app)
- Tout doit fonctionner avec un simple `docker-compose up` après avoir copié .env.example en .env

LIVRABLE FINAL : 
Les deux repos doivent être prêts à recevoir du code dans les phases suivantes. 
Lance `docker-compose up` et vérifie que tous les services démarrent sans erreur.
Le frontend doit afficher une page "TANGER CODE - Coming soon" sur http://localhost:3000.
Le backend doit répondre 200 sur http://localhost:8000/api/v1/health/.
```

---

### 🟢 PHASE P1 — Backend : Django + Database + Auth JWT

**Objectif** : Mettre en place la base Django solide avec la connexion PostgreSQL, l'authentification JWT et le système d'utilisateurs admin.

**Dépendances** : P0 terminée

**Livrables** :
- App `users` avec modèle User custom (email comme identifiant)
- App `core` avec settings, middleware custom
- Authentification JWT (djangorestframework-simplejwt)
- Endpoints `/auth/login/`, `/auth/refresh/`, `/auth/me/`, `/auth/logout/`
- Permissions custom (IsSuperAdmin, IsEditor, etc.)
- Rate limiting sur les endpoints sensibles
- Documentation Swagger configurée (drf-spectacular)

#### 📝 Prompt Claude Code — P1

```
Phase précédente terminée : P0 (setup des repos et Docker).

OBJECTIF DE CETTE PHASE (P1) : implémenter la base Django solide avec authentification JWT 
et système d'utilisateurs admin.

À RÉALISER dans `tangercode-backend` :

1. App `users` :
   - Modèle User custom (hérite de AbstractUser) avec email comme USERNAME_FIELD
   - Champs supplémentaires : role (SUPER_ADMIN, EDITOR, CONTRIBUTOR), avatar, phone, 
     two_factor_enabled, two_factor_secret (encrypted), last_login_ip
   - Manager custom (create_user, create_superuser)
   - Modèle ActivityLog (user, action, model_name, object_id, ip_address, user_agent, 
     details JSON, created_at)
   - Migrations initiales

2. Authentification JWT :
   - Utiliser `djangorestframework-simplejwt`
   - access_token : 15 minutes
   - refresh_token : 7 jours
   - Custom serializer pour retourner aussi les infos user au login
   - Endpoints :
     * POST /api/v1/admin/auth/login/ → { access, refresh, user }
     * POST /api/v1/admin/auth/refresh/ → { access }
     * POST /api/v1/admin/auth/logout/ → blacklist du refresh token
     * GET /api/v1/admin/auth/me/ → profil utilisateur
     * PATCH /api/v1/admin/auth/me/ → mise à jour profil
     * POST /api/v1/admin/auth/change-password/
     * POST /api/v1/admin/auth/password-reset/ → email avec token
     * POST /api/v1/admin/auth/password-reset/confirm/

3. Permissions custom dans `users/permissions.py` :
   - IsSuperAdmin
   - IsEditorOrAbove
   - IsContributorOrAbove
   - IsOwnerOrReadOnly

4. Rate limiting (django-ratelimit ou DRF throttling) :
   - Login : 5/min/IP
   - Password reset : 3/hour/IP
   - Configuration dans settings/base.py

5. Documentation API (drf-spectacular) :
   - Configuration Swagger UI sur /api/docs/
   - Schéma OpenAPI sur /api/schema/

6. Settings split :
   - config/settings/base.py
   - config/settings/dev.py (DEBUG=True, console email backend)
   - config/settings/prod.py (DEBUG=False, sécurité renforcée)

7. Tests :
   - Tests pytest pour l'authentification (login, refresh, logout, permissions)
   - Au moins 80% de couverture sur l'app users

8. Logger d'activité :
   - Signal Django pour logger automatiquement les login/logout
   - Middleware pour capturer IP et user-agent

CONTRAINTES :
- Validation stricte des mots de passe (min 12 chars, complexité)
- Mot de passe hashé avec Argon2
- Tokens stockés en blacklist après logout
- Toutes les routes admin doivent commencer par /api/v1/admin/

LIVRABLE FINAL :
- Création d'un superadmin via `python manage.py createsuperuser` doit fonctionner
- Login via POST /api/v1/admin/auth/login/ retourne les tokens JWT
- Tous les tests pytest passent
- Swagger accessible sur http://localhost:8000/api/docs/
```

---

### 🟢 PHASE P2 — Backend : Modèles & Admin Django

**Objectif** : Créer tous les modèles métier (services, portfolio, blog, etc.) avec leur système de traduction, et configurer le Django Admin pour une utilisation rapide.

**Dépendances** : P1 terminée

#### 📝 Prompt Claude Code — P2

```
Phase précédente : P1 (Auth JWT + users) terminée.

OBJECTIF DE CETTE PHASE (P2) : créer tous les modèles métier du projet avec leur système 
de traduction multilangue séparée, et configurer le Django Admin pour gérer ces contenus.

Référence : section 2 du cahier de conception (Modèle de données).

À RÉALISER dans `tangercode-backend` :

1. App `languages` :
   - Modèle Language (code, name, native_name, is_default, is_active, is_rtl, order)
   - Migration de données initiales : FR (default), EN, AR (is_rtl=True)

2. App `core` (modèles transverses) :
   - Modèle abstrait TranslatableMixin avec helper get_translation(lang)
   - SiteConfig (singleton) + SiteConfigTranslation
   - PageSEO + PageSEOTranslation

3. App `services` :
   - Technology (name, slug, logo, category, color, order, is_active)
   - Service (slug, icon, cover_image, technologies M2M, featured, order, is_active)
   - ServiceTranslation (FK service, FK language, title, short_description, 
     long_description, meta_title, meta_description, auto_translated, last_edited_manually)
   - PricingTier (FK service, code, price_mad, price_eur, price_usd, is_custom_quote, 
     delivery_days, revisions_count, support_days, is_featured, order, is_active)
   - PricingTierTranslation (name, description, features JSON, cta_text)

4. App `portfolio` :
   - Project (slug, client_name, category, project_url, year, duration_months, 
     technologies M2M, cover_image, featured, order, is_active)
   - ProjectImage (FK project, image, alt_text, order)
   - ProjectTranslation (title, short_description, long_description, client_testimonial)

5. App `blog` :
   - BlogCategory + BlogCategoryTranslation
   - BlogTag + BlogTagTranslation
   - BlogPost (slug, FK author=User, categories M2M, tags M2M, cover_image, 
     status, published_at, views_count, featured)
   - BlogPostTranslation (title, excerpt, content rich text, meta_title, meta_description)

6. App `testimonials` :
   - Testimonial (client_photo, client_name, client_company, client_position, rating 1-5, 
     FK project nullable, video_url, is_active, order)
   - TestimonialTranslation (content)

7. App `faq` :
   - FAQCategory + FAQCategoryTranslation
   - FAQ (FK category, order, is_active)
   - FAQTranslation (question, answer)

8. App `messages_app` :
   - ContactMessage (name, email, phone, company, subject, message, 
     FK service_interested nullable, budget_range, status, ip_address, user_agent, 
     language, created_at, read_at, replied_at, reply_content, FK replied_by=User)

9. Django Admin :
   - Configurer un ModelAdmin pour CHAQUE modèle avec :
     * Liste filtrable (list_filter), recherchable (search_fields)
     * Inlines pour les traductions (TabularInline)
     * Inlines pour les images du portfolio
     * Actions custom (publier, archiver, etc.)
     * Aperçu des images dans la liste
     * Compteur de traductions manquantes
   - Surcharge du Django Admin avec un theme custom (django-admin-interface ou custom CSS)

10. Migrations :
    - Toutes les migrations doivent être propres
    - Fichier de seed (management command `seed_data.py`) qui crée :
      * 3 langues (FR, EN, AR)
      * Quelques technologies (Next.js, Django, React, etc.)
      * Quelques pages SEO de base
      * 1 superadmin de test

11. Tests :
    - Tests pytest pour les relations entre modèles
    - Tests pour les méthodes custom (get_translation, etc.)

CONTRAINTES :
- Utilise des `slug` auto-générés (django-autoslug) pour Service, Project, BlogPost, etc.
- Toutes les ForeignKeys doivent avoir `on_delete` explicite
- Index sur les champs souvent filtrés (slug, status, is_active, featured)
- Validation custom : un service ne peut avoir qu'une traduction par langue (unique_together)
- Stockage des images : pour l'instant en local sous /media/, on intégrera Cloudinary en P5

LIVRABLE FINAL :
- `python manage.py migrate` fonctionne sans erreur
- `python manage.py seed_data` peuple la base
- Le Django Admin permet de créer un Service avec ses 3 traductions, 
  ses tarifs, ses technologies → tout depuis une seule page admin
- Tous les tests pytest passent
```

---

### 🟢 PHASE P3 — Backend : API publique

**Objectif** : Exposer tous les contenus via une API REST publique consommée par le frontend Next.js.

**Dépendances** : P2 terminée

#### 📝 Prompt Claude Code — P3

```
Phases précédentes terminées : P0, P1, P2 (modèles + admin Django prêts).

OBJECTIF DE CETTE PHASE (P3) : implémenter tous les endpoints publics de l'API REST 
(lecture seule pour les visiteurs du site).

Référence : section 3.2 du cahier de conception (Endpoints publics).

À RÉALISER dans `tangercode-backend` :

1. Serializers (DRF) pour chaque modèle :
   - ServiceSerializer (avec traduction selon Accept-Language)
   - ServiceDetailSerializer (avec pricing tiers et technologies)
   - ProjectSerializer
   - ProjectDetailSerializer (avec images, testimonial, technologies)
   - BlogPostSerializer (liste, sans contenu complet)
   - BlogPostDetailSerializer (avec contenu complet, related posts)
   - TestimonialSerializer
   - FAQSerializer (grouped by category)
   - PricingTierSerializer
   - TechnologySerializer
   - SiteConfigSerializer
   - PageSEOSerializer

2. Système de traduction automatique des réponses :
   - Middleware ou décorateur custom qui lit le header Accept-Language
   - Helpers dans les serializers pour retourner les champs traduits dans la bonne langue
   - Fallback sur la langue par défaut si traduction manquante

3. ViewSets / APIViews avec filtres :
   - ServiceViewSet (ReadOnly, lookup_field='slug')
   - ProjectViewSet (filtres : category, technology, year, featured)
   - BlogPostViewSet (filtres : category, tag, search)
   - + endpoints pour testimonials, faq, pricing-tiers, technologies, etc.

4. URLs sous /api/v1/public/ :
   - /services/, /services/{slug}/
   - /projects/, /projects/{slug}/, /projects/categories/
   - /blog/posts/, /blog/posts/{slug}/, /blog/categories/, /blog/tags/
   - /testimonials/, /faq/, /pricing/, /technologies/
   - /site-config/, /site-config/seo/{page_key}/

5. Pagination personnalisée :
   - PageNumberPagination avec page_size par défaut = 10
   - Réponse formatée : { count, next, previous, results }

6. Cache Redis :
   - Cache de 5 minutes sur les endpoints publics (sauf POST)
   - Invalidation automatique du cache via signaux Django à la modification

7. Endpoint POST /blog/posts/{slug}/view/ :
   - Incrémente le compteur de vues (sans authentification)
   - Rate limit : 1 par IP par heure pour ce post

8. Documentation Swagger :
   - Tous les endpoints documentés avec exemples de réponses
   - Tags par ressource (services, portfolio, blog, etc.)

9. Tests :
   - Tests pour chaque endpoint public
   - Tests de filtrage, recherche, pagination
   - Tests de cache
   - Tests de traduction selon Accept-Language

CONTRAINTES :
- TOUS les endpoints publics sont en lecture seule (GET uniquement, sauf view counter et contact)
- Permission : AllowAny
- Throttling : 1000 req/h/IP pour anonymes
- CORS configuré pour autoriser le domaine frontend
- Format de réponse cohérent et documenté

LIVRABLE FINAL :
- Tous les endpoints publics sont fonctionnels
- Tester avec : curl http://localhost:8000/api/v1/public/services/?lang=fr
- Documentation Swagger complète et navigable
- Tests pytest tous verts
- Cache Redis fonctionnel (visible dans les logs Redis)
```

---

### 🟢 PHASE P4 — Backend : API admin (CRUD complet)

**Objectif** : Implémenter tous les endpoints admin protégés par JWT pour la gestion complète du contenu.

**Dépendances** : P3 terminée

#### 📝 Prompt Claude Code — P4

```
Phases précédentes : P0-P3 terminées (API publique fonctionnelle).

OBJECTIF DE CETTE PHASE (P4) : implémenter tous les endpoints CRUD admin sous /api/v1/admin/, 
protégés par JWT, pour la gestion complète du contenu depuis le dashboard.

Référence : section 3.3 du cahier de conception (Endpoints admin).

À RÉALISER dans `tangercode-backend` :

1. Serializers admin (différents des serializers publics) :
   - Inclusion des champs administratifs (is_active, order, created_at, updated_at)
   - Toutes les traductions imbriquées (pas seulement la langue demandée)
   - Validation stricte (unique_together, formats, etc.)
   - Support de la création nested (créer un Service avec ses traductions et tarifs en 1 requête)

2. ViewSets admin avec :
   - Permission IsAuthenticated minimum
   - Permission custom selon rôle (ex: seuls super_admin peuvent supprimer)
   - Filtres avancés (django-filter) : status, dates, recherche full-text
   - Tri (ordering)
   - Pagination avec page_size configurable (max 100)
   - Actions custom (POST /publish/, /archive/, /duplicate/, etc.)

3. Endpoints sous /api/v1/admin/ :

   Services :
   - GET/POST    /services/
   - GET/PATCH/DELETE /services/{id}/
   - POST       /services/{id}/translate/ (déclenche traduction auto via Celery — P5)
   - PATCH      /services/{id}/translations/{lang_code}/ (édition manuelle)
   - POST       /services/{id}/duplicate/

   Projets :
   - GET/POST   /projects/
   - GET/PATCH/DELETE /projects/{id}/
   - POST       /projects/{id}/images/ (ajout d'image)
   - DELETE     /projects/{id}/images/{img_id}/
   - PATCH      /projects/{id}/images/{img_id}/ (modification ordre, alt)
   - POST       /projects/{id}/translate/

   Blog :
   - GET/POST   /blog/posts/
   - GET/PATCH/DELETE /blog/posts/{id}/
   - POST       /blog/posts/{id}/publish/
   - POST       /blog/posts/{id}/archive/
   - POST       /blog/posts/{id}/translate/
   - CRUD       /blog/categories/, /blog/tags/

   Témoignages, FAQ, FAQ categories, Technologies, Pricing tiers :
   - CRUD standard pour chacun

   Messages :
   - GET        /messages/ (filtres : status, date)
   - GET        /messages/{id}/
   - PATCH      /messages/{id}/ (mise à jour status)
   - POST       /messages/{id}/reply/ (envoi email + sauvegarde reply_content)
   - GET        /messages/export/ (export CSV)
   - GET        /messages/stats/

   Configuration :
   - GET/PATCH  /config/site/ (singleton)
   - GET/PATCH  /config/languages/{id}/ (active/désactive)

   Utilisateurs :
   - GET/POST   /users/
   - GET/PATCH/DELETE /users/{id}/
   - GET        /users/{id}/activity/

   Sauvegardes (préparer mais implémentation complète en P22) :
   - GET        /backups/
   - POST       /backups/ (crée une sauvegarde manuelle)

4. Upload d'images :
   - Endpoint dédié /media/upload/ avec validation
   - Limite : 5MB par fichier, formats : jpg, jpeg, png, webp
   - Génération automatique de thumbnails (Pillow)
   - Stockage local pour l'instant, abstraction prête pour Cloudinary

5. Logs d'activité automatiques :
   - Hook sur les actions CREATE/UPDATE/DELETE via DRF mixins
   - Crée une entrée ActivityLog pour chaque action admin

6. Permissions par rôle :
   - SUPER_ADMIN : tout
   - EDITOR : CRUD sur services, projects, blog, testimonials, faq, pricing, messages
   - CONTRIBUTOR : créer/éditer ses propres articles de blog uniquement

7. Validations spécifiques :
   - Un service ne peut pas être désactivé s'il a des PricingTier actifs
   - Un projet ne peut pas être supprimé s'il a un témoignage lié (warning)
   - Un BlogPost ne peut être publié que si toutes ses traductions sont présentes
   - Un slug ne peut pas être changé une fois publié (créer une redirection à la place)

8. Tests pytest complets pour chaque endpoint admin :
   - Test création, lecture, modification, suppression
   - Test des permissions (anonyme, contributor, editor, super_admin)
   - Test des validations
   - Test des actions custom

CONTRAINTES :
- TOUS les endpoints admin requièrent JWT valide
- Logs systématiques de toutes les actions admin
- Réponses cohérentes (format d'erreur uniforme)
- Documentation Swagger mise à jour

LIVRABLE FINAL :
- API admin complète et testée
- Tous les tests pytest passent
- Possibilité de créer un service complet (avec tarifs + traductions) en 1 seule requête
- Documentation Swagger affiche les endpoints admin
```

---

### 🟢 PHASE P5 — Backend : Traduction IA Claude + Celery

**Objectif** : Implémenter le système de traduction automatique multilangue via l'API Claude, en asynchrone avec Celery.

**Dépendances** : P4 terminée

#### 📝 Prompt Claude Code — P5

```
Phases précédentes : P0-P4 terminées.

OBJECTIF DE CETTE PHASE (P5) : implémenter le système de traduction automatique via 
l'API Claude (Anthropic), géré en asynchrone via Celery, avec édition manuelle possible 
depuis le dashboard.

Référence : section 5 du cahier de conception (Système de traduction IA).

À RÉALISER dans `tangercode-backend` :

1. App `translation` :
   - Modèle AIProvider (name, api_key encrypted, base_url, model_name, max_tokens, 
     temperature, is_active, is_default)
   - Modèle TranslationPrompt (name, field_type, prompt_template, is_default)
   - Modèle TranslationLog (content_type GFK, object_id, field_name, source_language, 
     target_language, source_text, translated_text, status, tokens_used, cost_usd, 
     ai_provider, duration_ms, created_at)

2. Service `TranslationService` (translation/services.py) :
   - Méthode `translate(text, source_lang, target_lang, field_type, prompt_template)` 
     → appelle l'API Claude, retourne le résultat structuré
   - Méthode `translate_object(instance, source_lang, target_langs, fields)` 
     → traduit toutes les traductions d'un objet
   - Gestion des erreurs (retry, fallback, logs)
   - Estimation du coût (basé sur tokens)
   - Cache pour éviter les traductions redondantes (clé : hash(text + source + target + model))

3. Client API Claude :
   - Utiliser le SDK Anthropic Python officiel
   - Configuration via AIProvider en BDD (clé API chiffrée)
   - Chiffrement de la clé API avec Fernet (cryptography lib)
   - Test de connexion : POST /api/v1/admin/config/ai-providers/{id}/test/

4. Celery tasks :
   - Task `translate_object_task(content_type_id, object_id, source_lang, target_langs)` 
     → exécutée en background à chaque sauvegarde
   - Task `bulk_translate_task` pour retraduire tout un type de contenu
   - Retry automatique en cas d'erreur (max 3, exponential backoff)
   - Notification au super_admin par email si échec persistant

5. Hooks automatiques :
   - Signal post_save sur les modèles traduisibles :
     * Si le contenu source est nouveau ou modifié ET auto_translate est activé pour ce champ
     * Déclenche la task Celery
   - Préservation des traductions éditées manuellement (last_edited_manually != null) 
     sauf si force=True

6. Endpoints admin de traduction :
   - POST /api/v1/admin/translate/ → traduction à la demande
     Body: { content, source_lang, target_lang, field_type, prompt_id? }
     Returns: { translated_text, tokens_used, cost_usd, duration_ms }
   - POST /api/v1/admin/services/{id}/translate/ → relance la traduction d'un service
     Body: { target_languages: ['en', 'ar'], force: false }
   - GET /api/v1/admin/translation-logs/ → consultation des logs
   - GET /api/v1/admin/translation-logs/stats/ → stats coûts, volumes par mois
   - GET/POST/PATCH /api/v1/admin/config/ai-providers/
   - GET/PATCH /api/v1/admin/config/translation-prompts/

7. Prompts par défaut (seed) :
   - Prompt "default" pour les textes courts
   - Prompt "long_text" pour les descriptions
   - Prompt "rich_text" pour les articles de blog (préservation HTML)
   - Prompt "list" pour les listes de features (chaque item séparé)
   - Tous suivent le template :
     ```
     You are a professional translator specializing in tech and web development content.
     Translate the following {field_type} from {source_language} to {target_language}.
     RULES:
     - Maintain the original tone and style
     - Keep technical terms in English (Next.js, Django, API, ERP, etc.)
     - Keep brand names unchanged (TANGER CODE)
     - For Arabic: use Modern Standard Arabic
     - Return ONLY the translation, no explanations
     CONTENT: {content}
     TRANSLATION:
     ```

8. Gestion des coûts :
   - Calcul du coût par appel basé sur les pricing Claude (input + output tokens)
   - Tableau de bord des coûts dans le module admin (préparé pour P19)
   - Limite mensuelle configurable (alerte si dépassée)

9. Configuration .env :
   - CLAUDE_API_KEY (clé par défaut, peut être surchargée via BDD)
   - CLAUDE_MODEL (par défaut: claude-opus-4-7)
   - CLAUDE_MAX_TOKENS (par défaut: 4096)

10. Tests :
    - Mock de l'API Claude pour les tests
    - Tests de la chaîne complète : save → signal → task → translation → DB
    - Tests d'erreurs (API down, quota dépassé, etc.)

CONTRAINTES :
- La clé API est TOUJOURS chiffrée en BDD (Fernet)
- Aucune clé API en clair dans les logs
- Architecture en abstraction : facile de remplacer Claude par OpenAI/Google plus tard 
  (interface commune `AIProviderClient`)
- Les tâches Celery doivent être idempotentes

LIVRABLE FINAL :
- Création d'un Service en FR via API → traductions EN et AR générées automatiquement 
  en quelques secondes
- Édition manuelle d'une traduction préservée même après modification du contenu source
- Logs détaillés dans TranslationLog
- Tests pytest verts
- Endpoint /api/v1/admin/translate/ fonctionnel pour tests à la demande
```

---

### 🟢 PHASE P6 — Backend : Contact, Emails, reCAPTCHA

#### 📝 Prompt Claude Code — P6

```
Phases précédentes : P0-P5 terminées.

OBJECTIF (P6) : implémenter le système complet de gestion des messages de contact, 
incluant l'envoi d'emails, la protection anti-spam (reCAPTCHA v3 + honeypot), 
et la notification admin.

À RÉALISER dans `tangercode-backend` :

1. Endpoint public POST /api/v1/public/contact/ :
   - Body: { name, email, phone?, company?, subject, message, service_interested?, 
     budget_range?, recaptcha_token, honeypot }
   - Validation :
     * Tous les champs requis (sauf optionnels)
     * Vérification reCAPTCHA v3 côté serveur (score > 0.5)
     * Honeypot : si champ rempli → spam (silencieusement marqué comme tel)
     * Email valide
     * Rate limit : 3 par heure par IP
   - Création d'un ContactMessage en BDD (status=NEW si score reCAPTCHA OK, sinon SPAM)
   - Envoi d'un email de confirmation au visiteur (template HTML responsive)
   - Envoi d'une notification au super_admin (email avec lien vers /admin/messages/{id})

2. Endpoint admin POST /api/v1/admin/messages/{id}/reply/ :
   - Body: { reply_content }
   - Envoie l'email de réponse au visiteur
   - Met à jour le ContactMessage : status=REPLIED, replied_at=now, replied_by=user, 
     reply_content
   - Email envoyé en HTML avec :
     * En-tête TANGER CODE
     * Le message original cité
     * La réponse
     * Coordonnées (téléphone, WhatsApp)

3. Configuration SMTP :
   - Settings pour utiliser SMTP a2hosting (smtp.tangercode.com en prod)
   - Dev : console backend
   - Templates d'emails dans templates/emails/ :
     * contact_confirmation.html (au visiteur)
     * contact_notification.html (au super_admin)
     * contact_reply.html (réponse au visiteur)
     * password_reset.html
     * test_email.html
   - Templates avec design propre, responsive, en cohérence avec la marque

4. Intégration reCAPTCHA v3 :
   - Service `verify_recaptcha(token, action='contact')` qui appelle l'API Google
   - Stockage des clés dans SiteConfig (modifiables depuis admin)
   - Si recaptcha_secret_key non configurée → bypass (mode dev)
   - Log des scores pour analyse

5. Endpoints admin pour messages :
   - GET /api/v1/admin/messages/?status=NEW&search=...
   - GET /api/v1/admin/messages/{id}/
   - PATCH /api/v1/admin/messages/{id}/ (change status: READ, ARCHIVED, SPAM)
   - POST /api/v1/admin/messages/{id}/reply/
   - GET /api/v1/admin/messages/export/?start_date=&end_date= (CSV)
   - GET /api/v1/admin/messages/stats/ : 
     { new, read, replied, archived, today, this_week, this_month, response_rate }

6. Newsletter (optionnel mais à préparer) :
   - Modèle NewsletterSubscriber
   - Endpoint public POST /api/v1/public/newsletter/subscribe/
   - Endpoint public GET /api/v1/public/newsletter/confirm/?token=...
   - Endpoint public GET /api/v1/public/newsletter/unsubscribe/?token=...

7. Tests :
   - Test création message + envoi emails (avec mock SMTP)
   - Test reCAPTCHA (mock API Google)
   - Test honeypot
   - Test rate limiting
   - Test export CSV

CONTRAINTES :
- Tous les emails partent en HTML + texte brut (multipart)
- Logs systématiques des emails envoyés
- Anti-spam : honeypot + reCAPTCHA + rate limit
- Sanitization du contenu des messages (anti-XSS)

LIVRABLE FINAL :
- Soumettre un message via POST /api/v1/public/contact/ → email de confirmation reçu + 
  notification admin
- Répondre depuis l'admin → email envoyé au visiteur
- Export CSV fonctionnel
- Tests verts
```

---

### 🟢 PHASE P7 — Backend : Intégration Google Analytics 4

#### 📝 Prompt Claude Code — P7

```
Phases précédentes : P0-P6 terminées.

OBJECTIF (P7) : intégrer l'API Google Analytics 4 pour récupérer les données 
de trafic et les exposer via l'API admin afin d'alimenter le dashboard.

À RÉALISER dans `tangercode-backend` :

1. App `analytics` :
   - Service `GA4Service` qui utilise google-analytics-data API
   - Authentification via service account JSON (chemin dans .env)
   - Property ID configuré dans SiteConfig (modifiable)

2. Méthodes du service GA4Service :
   - get_overview(start_date, end_date) → 
     { users, sessions, page_views, bounce_rate, avg_session_duration, conversions }
   - get_traffic_sources(start_date, end_date) → 
     [{ source, medium, sessions, users }]
   - get_top_pages(start_date, end_date, limit=10) → 
     [{ page_path, page_title, views, avg_time }]
   - get_devices(start_date, end_date) → 
     [{ device_category, sessions, percentage }]
   - get_countries(start_date, end_date, limit=10) → 
     [{ country, sessions, users }]
   - get_conversions(start_date, end_date) → 
     { contact_submissions, whatsapp_clicks, total_conversions, conversion_rate }
   - get_realtime_users() → nombre d'utilisateurs actifs en ce moment

3. Endpoints admin :
   - GET /api/v1/admin/analytics/overview/?start_date=&end_date=
   - GET /api/v1/admin/analytics/traffic-sources/?start_date=&end_date=
   - GET /api/v1/admin/analytics/top-pages/?start_date=&end_date=&limit=10
   - GET /api/v1/admin/analytics/devices/?start_date=&end_date=
   - GET /api/v1/admin/analytics/countries/?start_date=&end_date=
   - GET /api/v1/admin/analytics/conversions/?start_date=&end_date=
   - GET /api/v1/admin/analytics/realtime/

4. Cache Redis :
   - Cache de 15 minutes sur les données GA4 (sauf realtime)
   - Invalidation manuelle possible via POST /api/v1/admin/analytics/refresh/

5. Events GA4 customs à tracker (depuis le frontend) :
   - `contact_form_submitted` (paramètre : service_interested)
   - `whatsapp_button_clicked`
   - `pricing_cta_clicked` (paramètre : pricing_tier)
   - `language_switched` (paramètre : new_language)
   - Ces events doivent être documentés pour le frontend

6. Gestion des erreurs :
   - Si GA4 n'est pas configuré (pas de property_id) → retourner données vides 
     avec status `not_configured`
   - Si l'API GA4 échoue → fallback sur le dernier cache + warning

7. Documentation :
   - README dans l'app analytics expliquant comment configurer GA4 :
     1. Créer une propriété GA4
     2. Créer un service account dans Google Cloud
     3. Ajouter le service account comme viewer dans GA4
     4. Télécharger le JSON et le placer dans /secrets/ga4-service-account.json
     5. Configurer GA4_PROPERTY_ID dans le dashboard admin

8. Tests :
   - Mock de l'API GA4 (responses fixtures)
   - Tests des endpoints avec données mockées
   - Tests de cache
   - Test du fallback en cas d'erreur

CONTRAINTES :
- Le service account JSON ne doit JAMAIS être commit
- Variables : GA4_SERVICE_ACCOUNT_PATH dans .env
- Property ID dans la BDD (modifiable sans redéploiement)
- Pas d'appels GA4 synchrones bloquants → tout via cache

LIVRABLE FINAL :
- Endpoints /api/v1/admin/analytics/* fonctionnels (testés avec mock)
- Configuration documentée
- Cache opérationnel
- Tests verts
```

---

### 🟢 PHASE P8 — Frontend : Setup Next.js + Tailwind + Shadcn + i18n

#### 📝 Prompt Claude Code — P8

```
Le backend est terminé jusqu'à P7. Maintenant on attaque le frontend.

OBJECTIF (P8) : initialiser proprement le frontend Next.js avec toute la stack technique 
configurée (Tailwind, Shadcn, next-intl, next-themes, etc.) et la structure de dossiers prête.

Référence : section 4 du cahier de conception (Architecture Frontend Next.js).

À RÉALISER dans `tangercode-frontend` :

1. Initialisation propre :
   - Next.js 14+ avec App Router, TypeScript strict mode
   - ESLint + Prettier configurés (airbnb + custom rules)
   - Husky + lint-staged (hooks pre-commit)

2. Tailwind CSS avec configuration custom :
   - Palette "Mediterranean Tech" complète dans `tailwind.config.ts` :
     ```
     primary: { DEFAULT: '#0052CC', 50-900: ... }
     accent: { DEFAULT: '#00D4FF', orange: '#FF6B35' }
     dark: { base: '#0A1628', surface: '#0F1F3D' }
     light: { base: '#F8FAFC', surface: '#FFFFFF' }
     ```
   - Variables CSS custom dans globals.css (pour theming dynamique)
   - Support RTL (extension tailwindcss-rtl)
   - Animations custom : glow, float, morph, gradient-shift, fade-in-up

3. Polices :
   - Cabinet Grotesk (titres) : via next/font/local (télécharger les fichiers)
   - Inter (body) : via next/font/google
   - JetBrains Mono : via next/font/google
   - Cairo (arabe) : via next/font/google
   - Configuration dans `app/layout.tsx` avec variables CSS

4. shadcn/ui :
   - Initialisation avec config dans `components.json`
   - Theme custom adapté à Mediterranean Tech (modifier `globals.css`)
   - Installer les composants de base : Button, Card, Input, Label, Textarea, Select, 
     Dialog, DropdownMenu, Tabs, Toast, Alert, Badge, Separator, Switch, Skeleton, Sheet

5. next-intl pour i18n :
   - Configuration dans `src/i18n/routing.ts` avec locales ['fr', 'en', 'ar'] et 
     defaultLocale 'fr'
   - localePrefix: 'always' (URLs avec /fr, /en, /ar)
   - Messages JSON dans `src/i18n/messages/` (fr.json, en.json, ar.json) — pour l'instant 
     avec quelques clés de test
   - middleware.ts pour routing automatique
   - Support RTL : automatiquement `dir="rtl"` sur <html> quand locale === 'ar'

6. next-themes pour dark/light mode :
   - ThemeProvider dans `app/[locale]/layout.tsx`
   - defaultTheme: 'dark' (mode sombre par défaut)
   - enableSystem: true (respect préférence système au 1er chargement)
   - storageKey: 'tangercode-theme'
   - Évite le flash de thème (suppressHydrationWarning + script inline)

7. Structure des dossiers (créer tous les dossiers vides ou avec placeholders) :
   ```
   src/
   ├── app/
   │   ├── [locale]/
   │   │   ├── layout.tsx (avec providers)
   │   │   ├── page.tsx (placeholder "Coming soon")
   │   │   ├── loading.tsx
   │   │   ├── error.tsx
   │   │   └── not-found.tsx
   │   ├── admin/ (préparé pour P17)
   │   └── globals.css
   ├── components/
   │   ├── ui/ (shadcn)
   │   ├── layout/
   │   ├── home/
   │   ├── 3d/
   │   ├── services/
   │   ├── portfolio/
   │   ├── pricing/
   │   ├── blog/
   │   ├── shared/
   │   ├── admin/
   │   └── seo/
   ├── lib/
   │   ├── api/
   │   │   ├── client.ts (axios instance avec interceptors)
   │   │   ├── public.ts (méthodes pour API publique)
   │   │   ├── admin.ts (méthodes pour API admin)
   │   │   ├── auth.ts
   │   │   └── types.ts (types TypeScript des réponses)
   │   ├── utils.ts (cn, formatDate, formatPrice, etc.)
   │   ├── constants.ts
   │   └── validation.ts (schémas Zod)
   ├── hooks/
   │   ├── useAuth.ts
   │   ├── useScroll.ts
   │   └── useMediaQuery.ts
   ├── store/ (Zustand)
   │   ├── authStore.ts
   │   └── uiStore.ts
   ├── i18n/
   │   ├── config.ts
   │   ├── routing.ts
   │   └── messages/
   │       ├── fr.json
   │       ├── en.json
   │       └── ar.json
   ├── types/
   │   ├── api.ts
   │   ├── models.ts
   │   └── ui.ts
   └── middleware.ts
   ```

8. Client API (lib/api/client.ts) :
   - Instance axios avec base URL depuis env (NEXT_PUBLIC_API_URL)
   - Intercepteur request : ajoute Authorization header si token présent (depuis Zustand)
   - Intercepteur response : 
     * 401 → tente refresh token, rejoue requête, sinon logout
     * Format d'erreur uniforme
   - Header Accept-Language automatique selon la locale courante

9. Variables d'environnement (.env.local.example) :
   - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   - NEXT_PUBLIC_SITE_URL=http://localhost:3000
   - NEXT_PUBLIC_GA4_MEASUREMENT_ID=
   - NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
   - NEXT_PUBLIC_WHATSAPP_NUMBER=+212600000000

10. Page placeholder :
    - `app/[locale]/page.tsx` : affiche un beau placeholder centré "TANGER CODE — Coming Soon" 
      avec un dégradé bleu, mode sombre par défaut, sélecteur de langue minimaliste, 
      toggle thème
    - Cette page doit déjà être responsive et bien typée

CONTRAINTES :
- Tout doit être strictement typé (pas de `any`)
- Aucun composant `client` inutile (préférer Server Components)
- Pas de CSS-in-JS, tout en Tailwind ou globals.css
- Performance Lighthouse de cette page initiale > 95

LIVRABLE FINAL :
- `npm run dev` lance le frontend sur http://localhost:3000
- Redirection automatique vers /fr
- Switch de langue fonctionne : /fr → /en → /ar (avec RTL)
- Toggle dark/light fonctionne avec préservation
- Page placeholder responsive et belle
- Lighthouse score > 95 sur cette page
- Toutes les configurations sont en place pour les phases suivantes
```

---

### 🟢 PHASE P9 — Frontend : Composants UI globaux

#### 📝 Prompt Claude Code — P9

```
Phase précédente : P8 (setup Next.js) terminée.

OBJECTIF (P9) : créer tous les composants UI globaux qui apparaissent sur toutes les pages : 
Header, Footer, Language Switcher, Theme Toggle, WhatsApp button, Back-to-top, Cookie banner.

À RÉALISER dans `tangercode-frontend` :

1. components/layout/Header.tsx :
   - Server Component (avec children client pour interactions)
   - Logo TANGER CODE (à gauche) — placeholder pour l'instant (texte stylisé)
   - Navigation desktop centrée : Accueil, Services, Portfolio, Tarifs, Blog, Contact, À propos
   - Right side : LanguageSwitcher + ThemeToggle + CTA "Devis gratuit"
   - Mobile : burger menu → Sheet (shadcn) avec navigation verticale
   - Sticky : se transforme au scroll (background blur + bordure)
   - Animation d'apparition au chargement (fade in down)
   - Hauteur : 80px desktop, 64px mobile
   - Liens actifs : underline avec couleur primary

2. components/layout/Footer.tsx :
   - 4 colonnes desktop, stack en mobile :
     * Col 1 : Logo + description courte + réseaux sociaux
     * Col 2 : Liens rapides (Services, Portfolio, Tarifs, Blog)
     * Col 3 : Liens légaux (Mentions, Confidentialité, FAQ)
     * Col 4 : Contact (email, téléphone, localisation)
   - Newsletter (input email + bouton submit) — fonctionnel mais sera connecté à l'API plus tard
   - Copyright en bas : "© 2026 TANGER CODE. Made with ❤️ in Tangier."
   - Background plus sombre que le reste

3. components/layout/LanguageSwitcher.tsx :
   - Client Component
   - Dropdown avec drapeaux 🇫🇷 🇬🇧 🇸🇦 et noms natifs (Français, English, العربية)
   - Au clic : navigation vers la même page dans la nouvelle langue 
     (en gérant le changement de slug si pathnames sont configurés)
   - Indicateur de la langue active
   - Animation fluide

4. components/layout/ThemeToggle.tsx :
   - Client Component
   - Icône Sun / Moon (lucide-react)
   - Toggle entre dark et light
   - Animation rotation au clic
   - Tooltip "Changer de thème"

5. components/layout/MobileMenu.tsx :
   - Sheet shadcn ouvert depuis le burger du Header
   - Navigation verticale
   - Sélecteurs langue + thème inclus
   - Animation slide-in

6. components/layout/WhatsAppButton.tsx :
   - Client Component
   - Position : fixed bottom-right (bottom-6 right-6)
   - Z-index élevé (50)
   - Icône WhatsApp officielle (svg)
   - Background : vert WhatsApp (#25D366)
   - Hover : scale + shadow
   - Animation pulse subtile en permanence (toutes les 3s)
   - Au clic : ouvre wa.me/{numéro}?text={message_pré-rempli} dans nouvel onglet
   - Numéro et message viennent de l'API SiteConfig (mais hardcodés en fallback)
   - Tracking GA4 : event 'whatsapp_button_clicked'

7. components/layout/BackToTopButton.tsx :
   - Client Component
   - Apparaît après scroll de 400px
   - Position : fixed bottom-24 right-6 (au-dessus du WhatsApp)
   - Icône ArrowUp (lucide)
   - Scroll smooth au top
   - Animation fade-in/out

8. components/layout/CookieBanner.tsx :
   - Client Component
   - S'affiche en bas de la page au premier visit
   - 2 boutons : "Accepter tous" / "Refuser" / "Personnaliser"
   - "Personnaliser" → Dialog avec options : 
     * Cookies essentiels (toujours activés)
     * Analytics (Google Analytics 4)
     * Marketing (placeholder)
   - Stockage de la préférence en localStorage
   - Conforme RGPD : si refus, ne charge pas GA4

9. Layout global :
   - app/[locale]/layout.tsx intègre Header + WhatsApp + BackToTop + CookieBanner + Footer
   - Les enfants (pages) sont entre Header et Footer
   - Tous les composants sont traduits via next-intl
   - Préparation des slots pour les pages

10. Composants shadcn supplémentaires à installer :
    - Sheet (mobile menu)
    - Tooltip (toggle tips)
    - Toast (notifications)
    - Sonner (toasts modernes)

11. Animations Framer Motion :
    - Installer framer-motion
    - Variants réutilisables dans lib/animations.ts :
      * fadeInUp, fadeIn, slideInLeft, scaleIn, staggerChildren
    - Page transition wrapper (optionnel)

CONTRAINTES :
- Tous les composants supportent RTL (pour locale 'ar')
- Tous les composants sont responsive
- Accessibilité : keyboard navigation, ARIA labels
- Performance : pas de re-render inutile, useMemo/useCallback où pertinent
- Animations fluides 60 FPS

LIVRABLE FINAL :
- Page placeholder de P8 affiche maintenant Header complet + Footer + WhatsApp + 
  BackToTop + CookieBanner
- Switch de langue change tout (header, footer, sélecteur)
- Switch de thème transforme tout
- Mobile : burger menu fonctionne parfaitement
- WhatsApp ouvre l'app au clic
- Cookie banner fonctionne et persiste la préférence
- Lighthouse score reste > 95
```

---

### 🟢 PHASE P10 — Frontend : Scène 3D "L'Architecte du Code"

#### 📝 Prompt Claude Code — P10

```
Phase précédente : P9 terminée.

OBJECTIF (P10) : créer la scène 3D phare "L'Architecte du Code" pour la section Hero 
de la page d'accueil. C'est un élément différenciateur visuel important.

Référence : section 3.2 du cahier des charges (concept 3D) + cahier de conception.

CONCEPT :
- Un polyèdre cristallin semi-transparent flottant au centre
- Arêtes lumineuses avec lignes de code stylisées qui circulent
- Particules flottantes en arrière-plan (symboles binaires, brackets)
- Rotation lente + effet "respiration" (légère pulsation d'échelle)
- Interactions :
  * Parallaxe au mouvement souris
  * Inclinaison douce vers la souris
  * Morphing au scroll : polyèdre → fenêtre web → écran mobile → grille ERP → schéma plateforme
- Performant et adapté mobile

À RÉALISER dans `tangercode-frontend` :

1. Installation des dépendances :
   - three
   - @react-three/fiber
   - @react-three/drei
   - @react-three/postprocessing
   - leva (dev only, pour tweaking)

2. components/3d/CodeArchitectScene.tsx (composant principal) :
   - Canvas R3F avec :
     * camera position [0, 0, 5], fov 50
     * background transparent (geler à null)
     * dpr [1, 2] (pour retina sans surcharge)
     * gl: { antialias: true, alpha: true }
   - Lighting :
     * Ambient light (intensity 0.3)
     * Point light (couleur primary #0052CC, position [5, 5, 5])
     * Point light secondaire (couleur accent cyan #00D4FF, position [-5, -5, 5])
   - Postprocessing : Bloom (intensity 0.5, radius 0.8)
   - Composants enfants : <CrystalPolyhedron />, <FloatingParticles />, <CodeFlowLines />

3. components/3d/CrystalPolyhedron.tsx :
   - Géométrie : icosahedron ou dodecahedron (drei <Icosahedron />)
   - Matériau : MeshPhysicalMaterial avec :
     * transparent: true, opacity: 0.15
     * roughness: 0.1, metalness: 0.8
     * color: dark primary
     * emissive: cyan, emissiveIntensity: 0.3
     * clearcoat: 1
   - Edges visibles avec <Edges color="#00D4FF" />
   - Rotation : useFrame, rotateY: 0.002, rotateX: 0.001
   - Breathing : scale animé via Math.sin(elapsedTime) entre 0.95 et 1.05
   - Réactif au scroll : la forme se déforme (morphing prop)

4. components/3d/FloatingParticles.tsx :
   - 200 particules réparties dans un volume sphérique de rayon 8
   - Texture : un atlas de symboles (`<>`, `{}`, `=>`, `()`, `[]`, `01`, `function`)
   - Mouvement : useFrame, chaque particule a une velocité propre (drift lent)
   - Réinitialisation aux bords
   - Performance : utiliser InstancedMesh
   - Opacity selon distance caméra (fade au loin)

5. components/3d/CodeFlowLines.tsx :
   - Le long des arêtes du polyèdre, des "lignes de code" lumineuses qui circulent
   - Implémentation : MeshLine ou shader custom
   - Animation : offset UV pour donner l'illusion du flux
   - Couleur : cyan néon avec glow
   - Synchronisé avec la rotation du polyèdre

6. components/3d/SceneController.tsx :
   - Gestion du parallaxe (mouseX, mouseY → camera rotation subtile)
   - Gestion du scroll → progress 0-1 pour le morphing
   - Hook useScroll qui retourne la progress de la section hero
   - 4 phases de morphing :
     * 0.0 : Polyèdre cristallin (forme par défaut)
     * 0.25 : Wireframe d'écran web (rectangle)
     * 0.50 : Wireframe d'écran mobile (rectangle vertical)
     * 0.75 : Grille ERP (matrice de carrés)
     * 1.00 : Schéma plateforme (réseau de nodes)
   - Interpolation entre les formes via morphTargets

7. Optimisations performance :
   - Lazy loading : importer le Canvas via next/dynamic avec ssr: false
   - Suspense fallback (placeholder pendant chargement)
   - Détection mobile : version simplifiée (moins de particules, pas de postprocessing)
   - Frustum culling activé
   - Limit pixelRatio à 2

8. Version mobile :
   - Détection via useMediaQuery
   - Polyèdre + particules uniquement (pas de morphing au scroll)
   - 50 particules au lieu de 200
   - Pas de postprocessing
   - Touch events au lieu de mousemove

9. Loader / Fallback :
   - Pendant le chargement de la scène, afficher un placeholder élégant 
     (gradient animé + texte "Loading 3D scene...")
   - Si WebGL non supporté : fallback statique (image SVG du polyèdre stylisé)

10. Tests visuels :
    - Tester sur Chrome desktop, Firefox, Safari, Edge
    - Tester sur mobile iOS et Android
    - Vérifier les performances avec Chrome DevTools (FPS > 50)
    - Bundle size de la scène < 600 KB (gzipped)

11. Intégration dans la home :
    - Pour cette phase, créer une page de test `app/[locale]/test-3d/page.tsx` 
      qui affiche uniquement la scène en plein écran
    - L'intégration finale dans le Hero se fera en P11

CONTRAINTES :
- Performance : Lighthouse score > 80 sur la page avec la scène
- Pas de bloquage du thread principal
- Accessibilité : prefers-reduced-motion → version statique
- Le composant doit fonctionner même hors ligne (toutes ressources locales)

LIVRABLE FINAL :
- Page /test-3d affiche la scène 3D magnifique, fluide, interactive
- Parallaxe souris fonctionne
- Morphing au scroll fonctionne (à tester en simulant le scroll)
- Version mobile simplifiée mais belle
- Performance acceptable (50+ FPS sur desktop, 30+ FPS sur mobile)
- prefers-reduced-motion respecté
```

---

### 🟢 PHASE P11 — Frontend : Page d'accueil complète

#### 📝 Prompt Claude Code — P11

```
Phase précédente : P10 (scène 3D) terminée.

OBJECTIF (P11) : assembler toute la page d'accueil avec ses 10 sections, en intégrant 
la scène 3D dans le Hero, et en consommant l'API publique du backend.

Référence : section 3.2 du cahier des charges (Détail de la page d'accueil).

À RÉALISER dans `tangercode-frontend` :

1. app/[locale]/page.tsx (Server Component) :
   - Fetch en parallèle (Promise.all) :
     * Site config
     * Services featured
     * Projects featured (3-6)
     * Recent blog posts (3)
     * Testimonials
     * Stats (calculées : nb projets, nb clients, etc.)
     * Pricing tiers pour la home
   - Passe les données aux composants client/server enfants
   - Metadata via generateMetadata (titre, description, OG tags)
   - JSON-LD Organization + Website

2. components/home/HeroSection.tsx :
   - Container plein écran (min-h-screen ou 90vh)
   - Background : la scène 3D en fond (absolute, z-index 0)
   - Contenu au premier plan (z-index 10) :
     * Tagline (h1) en grand, animation fade-in-up
     * Sous-titre explicatif
     * 2 CTAs : "Démarrer un projet" (primary) + "Voir le portfolio" (outline)
     * 4 stats en bas : projets, clients satisfaits, années d'expérience, technologies
   - Mise en page : centré verticalement et horizontalement
   - Scroll indicator en bas (chevron animé qui descend)
   - Adaptation mobile : tagline plus petite, stats sur 2 colonnes

3. components/home/ServicesSection.tsx :
   - Titre de section + intro
   - Grille 2x2 (desktop) ou 1 colonne (mobile) de 4 cartes services
   - Chaque carte : ServiceCard avec :
     * Icône lucide (selon service.icon)
     * Titre du service
     * Description courte
     * "À partir de X MAD" (tarif starter)
     * Bouton "En savoir plus →" (lien vers /services/{slug})
     * Animation au hover : élévation + glow border
   - Animation au scroll : stagger des cartes (Framer Motion)

4. components/home/ProcessSection.tsx :
   - 7 étapes en timeline horizontale (desktop) ou verticale (mobile)
   - Chaque étape : numéro, icône, titre, description courte
   - Animation : ligne de connexion qui se dessine au scroll
   - Étape active mise en avant
   - Étapes :
     1. Découverte & analyse des besoins
     2. Cahier des charges & conception
     3. Design UI/UX & maquettes
     4. Développement
     5. Tests & validation
     6. Mise en ligne
     7. Maintenance & évolutions

5. components/home/PortfolioPreview.tsx :
   - Titre + lien "Voir tous les projets →"
   - Grille 3 colonnes (desktop), 2 (tablette), 1 (mobile) de 6 projets featured
   - Chaque carte projet : ProjectCard avec :
     * Image de couverture (avec lazy loading)
     * Catégorie en badge
     * Titre du projet
     * Client
     * Technologies (chips)
     * Overlay au hover avec "Voir le projet →"
   - Animation au scroll

6. components/home/PricingPreview.tsx :
   - Titre + intro
   - 3 cartes principales (Starter / Pro / Premium ou par service phare)
   - Chaque carte : PricingCard avec :
     * Nom de la formule
     * Prix (en MAD par défaut, avec sélecteur MAD/EUR/USD)
     * Liste de features (avec checkmarks)
     * Bouton CTA
     * Mise en avant de la carte "Pro" (border colorée, badge "Populaire")
   - Note "Tous nos tarifs sont personnalisables → Demander un devis"

7. components/home/TestimonialsSection.tsx :
   - Titre + intro
   - Carrousel (Embla Carousel ou Swiper) ou grille selon quantité
   - 3-6 témoignages
   - Chaque témoignage :
     * Photo client (rond)
     * Nom + entreprise + poste
     * Note (5 étoiles dorées)
     * Texte du témoignage
     * Lien vers le projet associé (si applicable)
   - Navigation : flèches + dots
   - Auto-play (5s) avec pause au hover

8. components/home/StatsSection.tsx :
   - Background : gradient ou pattern
   - 4 stats en grand avec compteurs animés (depuis 0) :
     * X projets livrés
     * X clients satisfaits
     * X années d'expérience
     * X technologies maîtrisées
   - Compteurs : utiliser useInView (Framer Motion) pour déclencher au scroll
   - Animation : count up sur 2 secondes

9. components/home/TechnologiesSection.tsx :
   - Titre "Technologies maîtrisées"
   - Logos animés des technos (depuis API)
   - Filtrage par catégorie : Frontend / Backend / Mobile / Database / DevOps
   - Animation : carousel infini horizontal (sans pause)
   - Au hover sur un logo : nom + grow

10. components/home/BlogPreview.tsx :
    - Titre "Derniers articles" + lien "Voir tous →"
    - 3 articles récents en grille
    - Chaque carte : BlogCard avec :
      * Image cover
      * Catégorie badge
      * Date
      * Titre
      * Excerpt
      * Auteur + temps de lecture
      * "Lire l'article →"

11. components/home/ContactCTA.tsx :
    - Background : gradient strong (primary → accent)
    - Titre énorme : "Prêt à démarrer votre projet ?"
    - Sous-titre engageant
    - 2 boutons :
      * "Démarrer maintenant" → /contact
      * "Discuter sur WhatsApp" → ouvre WhatsApp
    - Optionnel : un formulaire de contact rapide intégré (nom, email, message)

12. SEO & métadonnées :
    - generateMetadata avec :
      * title basé sur PageSEO du backend
      * description
      * openGraph image
      * twitter card
    - JSON-LD : Organization, WebSite (with SearchAction), BreadcrumbList

13. Animations au scroll (Framer Motion) :
    - Toutes les sections : fade-in-up + stagger des enfants
    - Threshold : 0.1 (déclenche dès 10% visible)
    - once: true (animation jouée une seule fois)

14. Performance :
    - Toutes les images via next/image avec sizes correctes
    - Format WebP/AVIF
    - Lazy loading hors viewport
    - Preload de la première image hero

CONTRAINTES :
- 100% responsive sur toutes les sections
- 100% multilangue (toutes les chaînes via next-intl)
- Support RTL pour AR (textes alignés à droite, ordre inversé si nécessaire)
- Lighthouse > 90 sur la home
- Tous les contenus dynamiques viennent de l'API (pas de hardcoding sauf labels UI)

LIVRABLE FINAL :
- Page d'accueil complète, magnifique, dynamique, performante
- 10 sections fluides avec transitions
- Données récupérées depuis l'API backend
- Multilangue + multimode (dark/light) fonctionnels
- Lighthouse > 90 (Performance, A11y, BP, SEO)
```

---

### 🟢 PHASES P12-P16 — Frontend : Pages publiques

> *Pour économiser de l'espace, je résume ces phases avec un prompt-template. Chaque phase suit la même structure : fetch API + composants + multilangue + SEO + animations.*

#### 📝 Prompts résumés P12-P16

**P12 — Pages Services** : 
```
Implémenter app/[locale]/services/page.tsx (liste de tous les services en grille) 
et app/[locale]/services/[slug]/page.tsx (détail d'un service avec : hero, description, 
process spécifique, technologies utilisées, tarifs, projets associés, FAQ liées, CTA contact). 
Toutes les données depuis API publique. SEO complet (JSON-LD Service). Multilangue + RTL. 
Animations Framer Motion.
```

**P13 — Pages Portfolio** :
```
Implémenter app/[locale]/portfolio/page.tsx avec filtres (catégorie, technologie, année) 
et grille de projets avec masonry layout. Pagination ou infinite scroll. 
app/[locale]/portfolio/[slug]/page.tsx : étude de cas complète (hero image, défi, solution, 
résultats, galerie d'images, technos, témoignage client, projets similaires, CTA). 
SEO + JSON-LD CreativeWork.
```

**P14 — Page Tarifs** :
```
app/[locale]/pricing/page.tsx : 
- Sélecteur devise (MAD / EUR / USD)
- Tableau comparatif des formules par service (4 onglets : Sites web, Plateformes, ERP, Mobile)
- Pour chaque service, 3 cartes (Starter / Pro / Premium)
- FAQ tarification en bas
- CTA "Devis personnalisé" sticky
- JSON-LD Offer pour chaque formule
```

**P15 — Blog** :
```
app/[locale]/blog/page.tsx : 
- Barre de recherche fonctionnelle (debounced)
- Filtres par catégorie et tag
- Grille de cartes articles avec pagination
- Article featured en haut
app/[locale]/blog/[slug]/page.tsx :
- Hero image + métadonnées article
- Contenu HTML rendu proprement (Tailwind typography prose)
- Table des matières flottante (desktop)
- Boutons de partage social
- Articles liés en bas
- Auteur card
- Commentaires (optionnel, à intégrer plus tard)
- JSON-LD BlogPosting
- Incrémente le compteur de vues (POST /view/)
```

**P16 — Pages additionnelles** :
```
- app/[locale]/about/page.tsx : présentation, parcours, valeurs, photo
- app/[locale]/faq/page.tsx : FAQ groupées par catégorie, accordéon, recherche
- app/[locale]/contact/page.tsx : formulaire complet (React Hook Form + Zod) + 
  coordonnées + carte (Leaflet ou Google Maps) + reCAPTCHA v3
- app/[locale]/legal/mentions/page.tsx + privacy/page.tsx : pages légales
- app/[locale]/not-found.tsx : 404 stylisée avec illustration et lien retour home
- Toutes : SEO, multilangue, animations
```

---

### 🟢 PHASE P17 — Frontend : Dashboard Admin (auth + layout)

#### 📝 Prompt Claude Code — P17

```
Phases précédentes : P0-P16 terminées (site public complet).

OBJECTIF (P17) : créer la structure du dashboard admin avec authentification JWT, 
layout dédié, sidebar de navigation, page de connexion.

À RÉALISER dans `tangercode-frontend` :

1. Routes admin (NE PAS sous /[locale], le dashboard est en français uniquement) :
   - app/admin/layout.tsx (root admin layout)
   - app/admin/login/page.tsx
   - app/admin/(dashboard)/layout.tsx (avec sidebar)
   - app/admin/(dashboard)/page.tsx (dashboard home)

2. middleware.ts (mise à jour) :
   - Si chemin commence par /admin (sauf /admin/login) ET pas de JWT valide 
     → redirect vers /admin/login
   - Vérification du JWT (decode + check exp côté server)

3. components/admin/Sidebar.tsx :
   - Logo TANGER CODE en haut
   - Navigation avec icônes (lucide) :
     * 📊 Dashboard
     * 🛠️ Services
     * 💼 Portfolio
     * 💰 Tarifs
     * 📝 Blog
     * 💬 Témoignages
     * ❓ FAQ
     * 📧 Messages (badge avec compteur de non-lus)
     * 📈 Analytics
     * ⚙️ Configuration
     * 🤖 IA & Traduction
     * 👥 Utilisateurs (super_admin uniquement)
     * 💾 Sauvegardes
   - Bouton "Voir le site" (ouvre /fr dans nouvel onglet)
   - User card en bas : avatar, nom, bouton logout
   - Collapsible (icon-only) sur tablette
   - Hidden sur mobile (Sheet)

4. components/admin/Header.tsx (top bar du dashboard) :
   - Burger menu (mobile uniquement) pour ouvrir sidebar
   - Breadcrumb (selon page actuelle)
   - Right side : 
     * Notifications (bell icon avec badge)
     * Theme toggle (dashboard a aussi dark/light)
     * User dropdown (profil, paramètres, logout)

5. app/admin/login/page.tsx :
   - Centré, fond avec gradient
   - Card avec :
     * Logo TANGER CODE
     * Titre "Connexion administrateur"
     * Champ email
     * Champ password (avec toggle show/hide)
     * Checkbox "Se souvenir de moi"
     * Lien "Mot de passe oublié ?"
     * Bouton "Se connecter"
   - Form avec React Hook Form + Zod
   - Au submit :
     * Call API POST /api/v1/admin/auth/login/
     * Stocker access_token dans Zustand
     * Stocker refresh_token dans cookie httpOnly (via API route Next.js)
     * Redirect vers /admin
     * En cas d'erreur : toast d'erreur
   - Rate limit géré côté UI (désactivation après 5 échecs)

6. store/authStore.ts (Zustand) :
   - State : user, accessToken, isAuthenticated
   - Actions : login(email, password), logout(), refreshToken(), setUser()
   - Persist : sessionStorage (perdu à la fermeture du navigateur)

7. hooks/useAuth.ts :
   - Wrapper du store + helpers
   - useRequireAuth() : hook qui redirige si non auth
   - useRole() : retourne le rôle de l'utilisateur courant

8. app/admin/(dashboard)/page.tsx (Dashboard home) :
   - Pour l'instant, un placeholder avec :
     * Titre "Tableau de bord"
     * 4 cartes de stats placeholder (visiteurs, messages, articles, projets)
     * Section "Messages récents" placeholder
     * Section "Actions rapides" : boutons vers les CRUD
   - Le vrai dashboard sera implémenté en P19

9. components/admin/PageHeader.tsx :
   - Composant réutilisable pour le haut de chaque page admin
   - Title + Subtitle
   - Actions (boutons à droite, ex: "Nouveau service")
   - Breadcrumb

10. Mot de passe oublié :
    - app/admin/forgot-password/page.tsx
    - app/admin/reset-password/[token]/page.tsx
    - Flow complet avec API

11. Theme admin :
    - Le dashboard utilise le même système next-themes
    - Mais palette légèrement différente (plus sobre, mode sombre par défaut)

CONTRAINTES :
- Le dashboard admin n'est PAS multilangue (français uniquement pour simplifier)
- Sécurité : tokens jamais en localStorage (memory + httpOnly cookies)
- Tous les calls API admin passent par lib/api/admin.ts avec refresh automatique
- Responsive : utilisable depuis tablette et mobile (au moins en lecture)

LIVRABLE FINAL :
- Page /admin/login fonctionnelle
- Login OK → redirige vers /admin avec sidebar
- Logout fonctionne
- Refresh token automatique (intercepteur axios)
- Routes protégées
- UI propre et professionnelle
```

---

### 🟢 PHASES P18-P19 — Dashboard Admin (CRUD + Analytics)

#### 📝 Prompt résumé P18

```
Implémenter tous les modules CRUD du dashboard admin :
- Services (liste avec datatable, formulaire création/édition avec tabs FR/EN/AR, 
  tarifs intégrés, upload images)
- Portfolio (idem + gestion galerie images drag-drop)
- Blog (idem + éditeur rich text TipTap, gestion brouillons, programmation)
- Tarifs (CRUD pricing tiers, gestion devises)
- Témoignages, FAQ (CRUD simples)
- Messages (liste avec filtres status, vue détail, formulaire de réponse avec preview email, 
  export CSV, marquage spam)

Patterns communs :
- DataTable réutilisable (TanStack Table) avec tri, filtre, pagination, sélection multiple, 
  actions en masse
- Forms avec React Hook Form + Zod
- TranslationPanel : tabs FR/EN/AR avec indicateurs (auto-traduit, édité manuellement), 
  bouton "Retraduire", bouton "Désactiver auto-traduction par champ"
- ImageUploader avec preview, crop, drag-drop
- Toast notifications (sonner)
- Confirmation dialogs pour les deletes
- Optimistic UI quand pertinent

Tous les modules consomment l'API admin avec gestion d'erreurs propre.
```

#### 📝 Prompt résumé P19

```
Implémenter :
- Module Analytics : graphiques (Recharts) consommant l'API GA4, filtres période, 
  exports
- Module Configuration : édition SiteConfig (toutes infos + traductions), gestion langues, 
  upload logos/favicon
- Module IA & Traduction : gestion AIProviders (test de connexion en live), gestion 
  TranslationPrompts (éditeur de templates), TranslationLogs (table avec coûts, 
  graphique d'évolution mensuelle)
- Module Utilisateurs : gestion admins (création, rôles, activation/désactivation, 
  logs d'activité)
- Module Sauvegardes : liste, création manuelle, download, restauration
- Dashboard home enrichi : widgets stats GA4, derniers messages, derniers articles, 
  raccourcis actions

Tous les graphiques en Recharts, responsifs et beaux. Sécurité : permissions par rôle.
```

---

### 🟢 PHASE P20 — SEO & Performance

#### 📝 Prompt Claude Code — P20

```
Phases précédentes : P0-P19 terminées (site + admin complets).

OBJECTIF (P20) : optimiser le site pour atteindre Lighthouse > 90 sur tous les critères 
et maximiser le SEO.

À RÉALISER :

1. Sitemap.xml dynamique :
   - app/sitemap.ts : génère un sitemap multilangue avec hreflang
   - Toutes les URLs publiques : home, services, projets, blog, tarifs, légal
   - Lastmod basé sur updated_at

2. Robots.txt :
   - app/robots.ts
   - Bloquer /admin et /api
   - Pointer vers le sitemap

3. Métadonnées par page :
   - Vérifier que TOUTES les pages ont generateMetadata complet
   - Open Graph : title, description, image, type, locale, alternate locales
   - Twitter Card : summary_large_image
   - Canonical URLs
   - hreflang pour le multilangue

4. JSON-LD (données structurées) :
   - Organization (sur home + footer)
   - WebSite avec SearchAction (sur home)
   - Service (sur pages services)
   - BlogPosting (sur articles)
   - BreadcrumbList (sur toutes les pages internes)
   - FAQPage (sur la page FAQ)
   - Offer (sur les pricing)
   - Person (page À propos)

5. Performance Frontend :
   - Vérifier toutes les images : next/image avec sizes corrects, format WebP/AVIF, 
     lazy loading sauf hero
   - Code splitting agressif : lazy import des composants lourds
   - Réduction du bundle : analyser avec @next/bundle-analyzer, supprimer le mort
   - Préchargement : preload des polices, prefetch des liens internes
   - Service Worker (optionnel, via next-pwa)
   - Suppression de console.log en production
   - Tree-shaking de lucide-react

6. Performance Backend :
   - Vérifier que toutes les requêtes ORM utilisent select_related / prefetch_related
   - Pas de N+1 queries
   - Cache Redis sur tous les endpoints publics (TTL 5 min)
   - Compression gzip/brotli activée (Nginx)

7. Accessibilité (a11y) :
   - Tous les liens ont du texte (aria-label si besoin)
   - Toutes les images ont alt approprié
   - Contrastes WCAG AA respectés (vérifier avec axe DevTools)
   - Navigation au clavier complète (focus visible)
   - Labels associés à tous les inputs
   - Skip to main content
   - role="navigation", "main", "complementary"

8. PWA (optionnel) :
   - manifest.json
   - Icônes (192x192, 512x512)
   - Couleurs thème
   - Service Worker pour cache offline

9. Tests Lighthouse :
   - Lighthouse CI configuré
   - Test sur 5 pages clés : home, service détail, projet détail, blog article, contact
   - Objectifs : Performance > 90, A11y > 95, BP > 95, SEO = 100

10. Tracking GA4 final :
    - Vérifier que tous les events customs sont implémentés
    - Conversion tracking : formulaire de contact, clics WhatsApp, clics CTA pricing

LIVRABLE FINAL :
- Lighthouse scores documentés (screenshots) pour 5 pages :
  Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100
- Sitemap.xml accessible et valide
- Tous les JSON-LD validés (Google Rich Results Test)
- Bundle JS < 200 KB pour la home (gzipped)
- FCP < 1.5s, LCP < 2.5s
```

---

### 🟢 PHASE P21 — Tests E2E

#### 📝 Prompt résumé P21

```
Implémenter une suite de tests E2E avec Playwright couvrant les flows critiques :
- Visiteur : navigation home → service → contact → submit
- Visiteur : changement de langue préserve la page
- Visiteur : changement de thème préserve la préférence
- Visiteur : WhatsApp button ouvre wa.me
- Admin : login, logout, refresh token automatique
- Admin : création service avec traduction auto
- Admin : édition manuelle d'une traduction préservée
- Admin : envoi d'une réponse à un message de contact

Tests sur 3 viewports : mobile, tablette, desktop.
Tests sur Chromium, Firefox, WebKit.
CI : run automatique sur PR.
```

---

### 🟢 PHASE P22 — Déploiement VPS a2hosting + CI/CD

#### 📝 Prompt Claude Code — P22

```
Phases précédentes : P0-P21 terminées (site + admin + tests prêts).

OBJECTIF (P22) : déployer en production sur le VPS a2hosting avec CI/CD automatique.

CONTEXTE :
- VPS a2hosting Unmanaged Ubuntu 22.04 LTS
- 4 Go RAM, 2 CPU, 50 Go SSD
- Accès SSH root
- Domaine tangercode.com pointant vers l'IP du VPS

À RÉALISER :

1. Préparation du VPS (script bash) :
   - Mise à jour système (apt update && upgrade)
   - Installation : docker, docker-compose, nginx, certbot, git, ufw, fail2ban
   - Configuration UFW : autoriser 22, 80, 443 uniquement
   - Configuration fail2ban (protection SSH)
   - Création d'un user `deploy` non-root avec sudo
   - Configuration SSH : désactiver root login, key-only auth
   - Swap file 2 Go

2. Architecture des conteneurs Docker en prod :
   ```
   docker-compose.prod.yml :
   - postgres (volume persistant)
   - redis (volume persistant)
   - backend (Django + Gunicorn)
   - celery_worker
   - celery_beat
   - frontend (Next.js standalone build)
   - nginx (reverse proxy, port 80/443)
   ```

3. Configuration Nginx (nginx.conf) :
   - Reverse proxy :
     * tangercode.com → frontend (Next.js)
     * api.tangercode.com → backend (Django)
   - SSL via Let's Encrypt (Certbot)
   - Renouvellement auto SSL (cron)
   - Compression gzip/brotli
   - Cache static assets (1 an)
   - Rate limiting global
   - Headers de sécurité (HSTS, CSP, X-Frame, etc.)
   - Logs séparés par domaine

4. Configuration Django prod (config/settings/prod.py) :
   - DEBUG = False
   - ALLOWED_HOSTS = ['api.tangercode.com', 'tangercode.com']
   - CORS_ALLOWED_ORIGINS = ['https://tangercode.com']
   - CSRF_TRUSTED_ORIGINS = ['https://tangercode.com', 'https://api.tangercode.com']
   - SECURE_SSL_REDIRECT = True
   - SESSION_COOKIE_SECURE = True
   - CSRF_COOKIE_SECURE = True
   - SECURE_HSTS_SECONDS = 31536000
   - DATABASES via DATABASE_URL
   - REDIS_URL
   - EMAIL : SMTP a2hosting
   - STATIC_ROOT pour collectstatic
   - MEDIA_ROOT (ou Cloudinary)

5. Configuration Next.js prod :
   - next.config.js : output 'standalone' pour Docker
   - NEXT_PUBLIC_API_URL=https://api.tangercode.com/api/v1
   - Optimisations build

6. Scripts de déploiement :
   - `deploy.sh` : pull dernière version, build, restart conteneurs, run migrations, 
     collectstatic
   - `backup.sh` : dump PostgreSQL + tarball /media, upload vers S3 ou stockage externe
   - `restore.sh` : restauration depuis un backup
   - Cron jobs : backup quotidien à 3h du matin, renouvellement SSL

7. CI/CD avec GitHub Actions :
   - .github/workflows/deploy-backend.yml :
     * Trigger : push sur main (backend repo)
     * Steps : run tests pytest → si OK, SSH vers VPS → pull → build → restart
   - .github/workflows/deploy-frontend.yml :
     * Trigger : push sur main (frontend repo)
     * Steps : run tests → build Next.js → SSH vers VPS → pull → build Docker → restart
   - Secrets GitHub : SSH_PRIVATE_KEY, VPS_HOST, VPS_USER

8. Monitoring (basique) :
   - Healthchecks endpoints :
     * GET /api/v1/health/ (backend)
     * Next.js health automatique
   - UptimeRobot ou Better Uptime (gratuit) : ping toutes les 5 min
   - Logs centralisés via docker logs ou simple script de rotation
   - Alertes par email si downtime > 5 min

9. Initialisation production :
   - Migrations : python manage.py migrate
   - Création superadmin : python manage.py createsuperuser
   - Seed des données initiales : python manage.py seed_data
   - Configuration GA4 dans le dashboard (Property ID + service account JSON)
   - Configuration Claude API key dans le dashboard
   - Configuration reCAPTCHA dans le dashboard
   - Upload logo, favicon, etc.

10. Tests post-déploiement :
    - Vérifier que https://tangercode.com répond
    - Vérifier que https://api.tangercode.com/api/docs/ répond
    - Test login admin
    - Test envoi de message contact
    - Test création service avec traduction auto
    - Test SSL (SSL Labs grade A+)

11. Documentation déploiement :
    - DEPLOYMENT.md complet :
      * Prérequis serveur
      * Étapes d'installation
      * Commandes utiles
      * Troubleshooting
      * Procédure de rollback

CONTRAINTES :
- Zéro downtime au possible (blue-green deployment idéal mais on peut commencer simple)
- Backups automatiques journaliers
- Tous les secrets dans .env (jamais en commit)
- Logs accessibles facilement

LIVRABLE FINAL :
- Site live sur https://tangercode.com (multilangue)
- API live sur https://api.tangercode.com
- Admin live sur https://tangercode.com/admin
- HTTPS partout avec SSL A+
- CI/CD : push sur main → déploiement auto
- Backups configurés
- Monitoring actif
- Documentation déploiement complète
```

---

### 🟢 PHASE P23 — Documentation & Formation

#### 📝 Prompt résumé P23

```
Livrer :
- Documentation technique complète (architecture, BDD, API, déploiement) en Markdown
- Documentation utilisateur du dashboard admin (en français) avec captures d'écran
- Vidéos de formation (Loom ou similaire) :
  * Vidéo 1 : Tour du dashboard (10 min)
  * Vidéo 2 : Gérer les services et tarifs (10 min)
  * Vidéo 3 : Gérer le portfolio (5 min)
  * Vidéo 4 : Rédiger un article de blog + traductions (10 min)
  * Vidéo 5 : Répondre aux messages (5 min)
  * Vidéo 6 : Consulter les analytics (5 min)
  * Vidéo 7 : Configuration et sauvegardes (5 min)
- README polished pour chaque repo GitHub
- CHANGELOG.md
- LICENSE
```

---

## 9. STRATÉGIE DE TESTS

### 9.1 Pyramide de tests

```
              ┌─────────────┐
              │   E2E (P21)  │  ← Playwright, 10-15 scénarios critiques
              └─────────────┘
            ┌─────────────────┐
            │  Intégration     │  ← API endpoints, intégrations externes
            └─────────────────┘
        ┌─────────────────────────┐
        │      Tests unitaires    │  ← pytest backend, vitest frontend
        └─────────────────────────┘
```

### 9.2 Couverture cible
- Backend : > 80% (pytest + coverage)
- Frontend : > 70% (vitest + testing-library)
- E2E : 10-15 scénarios critiques

### 9.3 CI : tous les tests doivent passer avant merge
- GitHub Actions : tests automatiques sur PR
- Pre-commit hooks : linting + tests rapides

---

## 10. PLAN DE DÉPLOIEMENT VPS a2hosting

### 10.1 Pré-requis VPS

| Élément | Spécification |
|---------|---------------|
| OS | Ubuntu 22.04 LTS |
| RAM | 4 Go minimum (8 recommandé) |
| CPU | 2 cores minimum |
| Stockage | 50 Go SSD |
| Bande passante | 2 To/mois minimum |
| Accès | SSH root + IP fixe |

### 10.2 Architecture de production

```
Internet
   │
   ▼
┌─────────────────────────────────────────────────┐
│  VPS a2hosting (Ubuntu 22.04)                   │
│                                                 │
│  ┌───────────────────────────────────────┐     │
│  │  Nginx (80/443) — Reverse Proxy + SSL │     │
│  └─────────────┬─────────────────────────┘     │
│                │                                │
│        ┌───────┴───────┐                       │
│        ▼               ▼                       │
│  ┌──────────┐    ┌──────────┐                  │
│  │ Next.js  │    │ Django + │                  │
│  │ (3000)   │    │ Gunicorn │                  │
│  │          │    │ (8000)   │                  │
│  └──────────┘    └─────┬────┘                  │
│                        │                       │
│                ┌───────┼───────┐               │
│                ▼       ▼       ▼               │
│           ┌────────┐ ┌─────┐ ┌────────┐        │
│           │Postgres│ │Redis│ │Celery  │        │
│           │ (5432) │ │(6379)│ │Workers │       │
│           └────────┘ └─────┘ └────────┘        │
└─────────────────────────────────────────────────┘
```

### 10.3 DNS

```
A     tangercode.com         → IP du VPS
A     api.tangercode.com     → IP du VPS
A     www.tangercode.com     → IP du VPS (redirige vers apex)
TXT   _domainconnect         → vérifications email
MX    tangercode.com         → serveurs email (si email pro)
```

### 10.4 Procédure de mise en production

1. **Préparation VPS** (1h) : script d'installation
2. **Configuration DNS** (24h propagation)
3. **Pull du code** sur le VPS
4. **Configuration .env** prod (clés API, secrets)
5. **Build des conteneurs** Docker
6. **Migrations & seed**
7. **Configuration SSL** (Certbot)
8. **Tests fumée** (smoke tests)
9. **Configuration monitoring**
10. **Activation CI/CD**

---

## 📌 VALIDATION DU CAHIER DE CONCEPTION

**Date de soumission** : Juin 2026
**Date de validation** : _______________
**Validé par** : _______________

---

### 🚀 PROCHAINE ÉTAPE APRÈS VALIDATION

Une fois ce cahier de conception **validé**, nous passerons à la phase suivante :

**🎨 GÉNÉRATION DU DESIGN via Claude Design**

Je préparerai un **prompt Claude Design** détaillé qui permettra de générer :
- Maquettes HTML/CSS de toutes les pages (home + sous-pages clés)
- Composants UI réutilisables stylisés
- Variations dark/light
- Adaptations responsive
- Templates de base pour l'intégration Next.js

Puis nous lancerons le développement via **Claude Code** en suivant les phases P0 → P23 séquentiellement, en utilisant les prompts fournis dans ce document.

---

**Document préparé pour TANGER CODE — Juin 2026 — Cahier de Conception v1.0**
