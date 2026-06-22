import type { PricingTierData, ProjectData } from "./home-data";

export interface ValueCard {
  title: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ServiceDetail {
  slug: string;
  icon: string;
  title: string;
  shortDesc: string;
  longDescTitle: string;
  longDesc: string[];
  features: string[];
  tags: string[];
  values: ValueCard[];
  technologies: string[];
  pricingTiers: PricingTierData[];
  relatedProjects: ProjectData[];
  faq: FAQItem[];
}

export interface ServiceCardData {
  slug: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  tags: string[];
}

export interface ServicesPageData {
  eyebrow: string;
  title: string;
  subtitle: string;
  processEyebrow: string;
  processTitle: string;
  processDesc: string;
  processSteps: { num: string; title: string; desc: string }[];
  ctaTitle: string;
  ctaLead: string;
  ctaButton: string;
  ctaWhatsapp: string;
  services: ServiceCardData[];
  breadcrumb: { label: string; href: string }[];
  lastBreadcrumb: string;
  details: ServiceDetail[];
}

/* ---- EN ---- */
const enDetailSitesWeb: ServiceDetail = {
  slug: "sites-web",
  icon: "web",
  title: "Custom websites",
  shortDesc: "Showcases, e-commerce and blogs — fast, elegant, optimized for conversion and SEO.",
  longDescTitle: "What is a custom website?",
  longDesc: [
    "A custom site is the opposite of a template bought online: every screen is designed specifically for your brand, your goals and your users. The result is a site that looks like you, stands out from the competition and loads fast anywhere in the world.",
    "At TANGER CODE, we combine thoughtful design and modern technologies (Next.js, Astro) to deliver performant, accessible and easy-to-evolve websites.",
  ],
  features: ["Custom responsive design", "Technical SEO & performance", "CMS to manage your content", "E-commerce & online payment"],
  tags: ["Next.js", "Astro", "Shopify", "SEO"],
  values: [
    { title: "Listening", desc: "We start from your business goals, not a list of features." },
    { title: "Custom", desc: "No generic template: every pixel and every line of code is designed for you." },
    { title: "Performance", desc: "Sites that are fast, accessible and SEO-optimized from day one." },
    { title: "Durability", desc: "Clean, documented code, easy to evolve over time." },
  ],
  technologies: ["Next.js", "Astro", "React", "TypeScript", "Tailwind", "Sanity CMS", "Vercel", "SEO"],
  pricingTiers: [
    { name: "Starter", price: "8 000 MAD", description: "Simple showcase, 5 pages.", features: ["5 pages", "Responsive", "Contact form", "2 revisions"], cta: "Choose", meta: "2 weeks · Support 1 month" },
    { name: "Pro", price: "25 000 MAD", description: "Complete custom site.", features: ["Unlimited pages", "Blog & CMS", "Advanced SEO", "Animations"], cta: "Choose", featured: true, meta: "4 weeks · Support 3 months" },
    { name: "Premium", price: "", description: "E-commerce & integrations.", features: ["E-commerce complete", "Multilingual", "API integrations", "1 year support"], cta: "Quote", meta: "On schedule · Support 1 year" },
  ],
  relatedProjects: [
    { title: "Atlas Market", client: "Website", category: "ecom", year: 2025, tags: ["Next.js"], slug: "/portfolio" },
    { title: "Detroit Avocats", client: "Website", category: "web", year: 2024, tags: ["Astro"], slug: "/portfolio" },
    { title: "Zellige Store", client: "Website", category: "ecom", year: 2024, tags: ["Shopify"], slug: "/portfolio" },
  ],
  faq: [
    { q: "How long to deliver a showcase site?", a: "Expect 2 to 3 weeks on average for a showcase site, depending on the number of pages and design complexity." },
    { q: "Can I manage content myself?", a: "Yes. We integrate an intuitive CMS that lets you modify texts, images and articles without touching code." },
    { q: "Will the site be optimized for Google?", a: "Absolutely. Technical SEO (speed, tags, structure, sitemap) is included from the start." },
    { q: "Do you offer maintenance?", a: "Yes, maintenance and evolution packages are available after go-live." },
  ],
};

const enDetailPlateformes: ServiceDetail = {
  slug: "plateformes-web",
  icon: "platform",
  title: "Web platforms",
  shortDesc: "SaaS and business applications — robust, scalable and secure, built for growth.",
  longDescTitle: "What is a web platform?",
  longDesc: [
    "A web platform is a custom application that goes beyond a simple website: it includes user authentication, complex business logic, dashboards and third-party integrations. It is designed to scale with your business.",
    "At TANGER CODE, we build SaaS platforms and internal tools with React, Node.js and cloud-native architectures that guarantee reliability and performance.",
  ],
  features: ["Scalable architecture", "Authentication & roles", "API & third-party integrations", "Real-time dashboards"],
  tags: ["React", "Node.js", "PostgreSQL", "AWS"],
  values: [
    { title: "Listening", desc: "We start from your business goals, not a list of features." },
    { title: "Custom", desc: "No generic template: every pixel and every line of code is designed for you." },
    { title: "Performance", desc: "Architectures thought for scale and speed." },
    { title: "Durability", desc: "Clean, documented code, easy to evolve over time." },
  ],
  technologies: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "Docker", "Kubernetes", "GraphQL"],
  pricingTiers: [
    { name: "Starter", price: "15 000 MAD", description: "Basic SaaS platform, MVP.", features: ["Core features", "User auth", "Dashboard", "API"], cta: "Choose", meta: "6 weeks · Support 2 months" },
    { name: "Pro", price: "45 000 MAD", description: "Complete scalable platform.", features: ["All features", "3rd party integrations", "Admin panel", "Real-time"], cta: "Choose", featured: true, meta: "12 weeks · Support 6 months" },
    { name: "Premium", price: "", description: "Enterprise platform.", features: ["Custom architecture", "Dedicated infra", "SLA guaranteed", "1 year support"], cta: "Quote", meta: "On schedule · Support 1 year" },
  ],
  relatedProjects: [
    { title: "Mizan", client: "Platform", category: "platform", year: 2025, tags: ["React"], slug: "/portfolio" },
    { title: "Atlas Market", client: "Platform", category: "ecom", year: 2025, tags: ["Next.js"], slug: "/portfolio" },
    { title: "Medina ERP", client: "Platform", category: "erp", year: 2025, tags: ["Django"], slug: "/portfolio" },
  ],
  faq: [
    { q: "What is the difference between a website and a platform?", a: "A platform includes user accounts, complex business logic, dashboards and often integrations with other systems. It is an interactive application, not just content pages." },
    { q: "Can you integrate with our existing tools?", a: "Yes. We integrate with CRMs, ERPs, payment solutions and any external API you need." },
    { q: "How do you ensure security?", a: "We apply OWASP best practices, encrypt sensitive data, set up role-based authentication and audit access." },
    { q: "Is the platform scalable?", a: "Yes. Our cloud-native architectures are designed to grow with your user base and feature needs." },
  ],
};

const enDetailERP: ServiceDetail = {
  slug: "erp-sur-mesure",
  icon: "erp",
  title: "Custom ERP",
  shortDesc: "Centralize inventory, billing, HR and reporting in one tool tailored to your real processes.",
  longDescTitle: "What is a custom ERP?",
  longDesc: [
    "A custom ERP (Enterprise Resource Planning) is a software solution that centralizes all your business operations: inventory management, billing, human resources, accounting and reporting. Unlike off-the-shelf ERPs, it is built to fit your exact workflows.",
    "At TANGER CODE, we use Django, PostgreSQL and Docker to deliver ERPs that are robust, fast and easy to maintain. Your teams get a tool they actually want to use every day.",
  ],
  features: ["Modules adapted to your trade", "Inventory & billing management", "Reporting & Business Intelligence", "Import/export & automations"],
  tags: ["Django", "PostgreSQL", "Docker", "BI"],
  values: [
    { title: "Listening", desc: "We start from your business goals, not a list of features." },
    { title: "Custom", desc: "Modules built for your exact processes, not adapted from a generic tool." },
    { title: "Performance", desc: "Fast queries, optimized databases, smooth interfaces." },
    { title: "Durability", desc: "Clean, documented code, easy to evolve over time." },
  ],
  technologies: ["Django", "PostgreSQL", "Docker", "Redis", "Celery", "Python", "TypeScript", "BI"],
  pricingTiers: [
    { name: "Starter", price: "25 000 MAD", description: "Basic ERP, 2 modules.", features: ["2 modules", "User management", "Dashboard", "Basic reports"], cta: "Choose", meta: "8 weeks · Support 3 months" },
    { name: "Pro", price: "60 000 MAD", description: "Complete ERP, 4 modules.", features: ["4 modules", "Advanced BI", "Automations", "API"], cta: "Choose", featured: true, meta: "16 weeks · Support 6 months" },
    { name: "Premium", price: "", description: "Enterprise ERP, unlimited.", features: ["Unlimited modules", "Custom integrations", "Training & docs", "1 year support"], cta: "Quote", meta: "On schedule · Support 1 year" },
  ],
  relatedProjects: [
    { title: "Medina ERP", client: "ERP", category: "erp", year: 2025, tags: ["Django"], slug: "/portfolio" },
    { title: "Mizan", client: "ERP", category: "platform", year: 2025, tags: ["React"], slug: "/portfolio" },
    { title: "Atlas Market", client: "ERP", category: "ecom", year: 2025, tags: ["Next.js"], slug: "/portfolio" },
  ],
  faq: [
    { q: "How long does it take to build an ERP?", a: "Between 8 and 24 weeks depending on the number of modules and complexity. We build incrementally, releasing usable modules as we go." },
    { q: "Can you migrate data from our old system?", a: "Yes. We analyze your existing data and build automated migration scripts to import everything cleanly." },
    { q: "Is the ERP accessible remotely?", a: "Yes. It is a web application accessible from any device with a browser and internet connection." },
    { q: "Do you provide training?", a: "Yes. We provide complete documentation and training sessions for your teams during deployment." },
  ],
};

const enDetailMobile: ServiceDetail = {
  slug: "applications-mobiles",
  icon: "mobile",
  title: "Mobile applications",
  shortDesc: "Smooth, elegant native and cross-platform iOS/Android apps, ready for the stores.",
  longDescTitle: "What is a custom mobile app?",
  longDesc: [
    "A custom mobile app is a native or cross-platform application built specifically for your business needs and your users. It can include features like push notifications, offline mode, GPS, camera integration and more.",
    "At TANGER CODE, we use Flutter to deliver beautiful apps with a single codebase for iOS and Android, saving development time and budget while maintaining native performance.",
  ],
  features: ["One codebase, two platforms", "Push notifications & offline", "App Store & Play Store publishing", "Design compliant with guidelines"],
  tags: ["Flutter", "iOS", "Android", "Firebase"],
  values: [
    { title: "Listening", desc: "We start from your business goals, not a list of features." },
    { title: "Custom", desc: "Every screen is designed for your users and your brand." },
    { title: "Performance", desc: "Native smoothness, fast startup, optimized battery." },
    { title: "Durability", desc: "Clean code, regular updates, long-term maintenance." },
  ],
  technologies: ["Flutter", "Dart", "Firebase", "iOS", "Android", "REST API", "Push Notifications", "App Stores"],
  pricingTiers: [
    { name: "Starter", price: "20 000 MAD", description: "Simple app, 3 screens.", features: ["3 screens", "iOS + Android", "Push notifications", "Store publishing"], cta: "Choose", meta: "6 weeks · Support 2 months" },
    { name: "Pro", price: "50 000 MAD", description: "Complete app with backend.", features: ["Up to 10 screens", "Offline mode", "Camera & GPS", "Custom backend"], cta: "Choose", featured: true, meta: "12 weeks · Support 6 months" },
    { name: "Premium", price: "", description: "Enterprise mobile solution.", features: ["Unlimited screens", "Advanced features", "Custom integrations", "1 year support"], cta: "Quote", meta: "On schedule · Support 1 year" },
  ],
  relatedProjects: [
    { title: "RihlaGo", client: "Mobile", category: "mobile", year: 2024, tags: ["Flutter"], slug: "/portfolio" },
    { title: "Atlas Market", client: "Mobile", category: "ecom", year: 2025, tags: ["Next.js"], slug: "/portfolio" },
    { title: "Mizan", client: "Mobile", category: "platform", year: 2025, tags: ["React"], slug: "/portfolio" },
  ],
  faq: [
    { q: "Flutter or native: which one to choose?", a: "Flutter offers an excellent compromise: one codebase for iOS and Android, with performance close to native. For very specific cases (heavy 3D, AR), native may be preferable." },
    { q: "How long to publish on the stores?", a: "Apple App Store review takes 1-2 days on average. Google Play Store is usually immediate. We handle the entire publishing process." },
    { q: "Can you take over an existing app?", a: "Yes. We audit the existing code and propose a plan for takeover, evolution or rewriting depending on the state of the code." },
    { q: "Do you handle app updates?", a: "Yes. Maintenance packages include regular updates for OS compatibility, bug fixes and feature additions." },
  ],
};

/* ---- FR ---- */
const frDetailSitesWeb: ServiceDetail = {
  slug: "sites-web",
  icon: "web",
  title: "Sites web sur mesure",
  shortDesc: "Vitrines, e-commerce et blogs qui conjuguent design soigne, vitesse et referencement.",
  longDescTitle: "Qu'est-ce qu'un site web sur mesure ?",
  longDesc: [
    "Un site sur mesure, c'est l'inverse d'un template achete en ligne : chaque ecran est concu specifiquement pour votre marque, vos objectifs et vos utilisateurs. Le resultat est un site qui vous ressemble, se demarque de la concurrence et reste rapide a charger partout dans le monde.",
    "Chez TANGER CODE, nous combinons design reflechi et technologies modernes (Next.js, Astro) pour livrer des sites performants, accessibles et faciles a faire evoluer.",
  ],
  features: ["Design responsive sur mesure", "SEO technique & performance", "CMS pour gerer votre contenu", "E-commerce & paiement en ligne"],
  tags: ["Next.js", "Astro", "Shopify", "SEO"],
  values: [
    { title: "Ecoute", desc: "Nous partons de vos objectifs business, pas d'une liste de fonctionnalites." },
    { title: "Sur mesure", desc: "Aucun template generique : chaque pixel et chaque ligne de code sont penses pour vous." },
    { title: "Performance", desc: "Des sites rapides, accessibles et optimises pour le referencement des le depart." },
    { title: "Durabilite", desc: "Un code propre et documente, facile a faire evoluer dans le temps." },
  ],
  technologies: ["Next.js", "Astro", "React", "TypeScript", "Tailwind", "Sanity CMS", "Vercel", "SEO"],
  pricingTiers: [
    { name: "Starter", price: "8 000 MAD", description: "Vitrine simple, 5 pages.", features: ["5 pages", "Responsive", "Formulaire contact", "2 revisions"], cta: "Choisir", meta: "2 semaines · Support 1 mois" },
    { name: "Pro", price: "25 000 MAD", description: "Site sur mesure complet.", features: ["Pages illimitees", "Blog & CMS", "SEO avance", "Animations"], cta: "Choisir", featured: true, meta: "4 semaines · Support 3 mois" },
    { name: "Premium", price: "", description: "E-commerce & integrations.", features: ["E-commerce complet", "Multilingue", "Integrations API", "Support 1 an"], cta: "Devis", meta: "Sur planning · Support 1 an" },
  ],
  relatedProjects: [
    { title: "Atlas Market", client: "Site web", category: "ecom", year: 2025, tags: ["Next.js"], slug: "/portfolio" },
    { title: "Detroit Avocats", client: "Site web", category: "web", year: 2024, tags: ["Astro"], slug: "/portfolio" },
    { title: "Zellige Store", client: "Site web", category: "ecom", year: 2024, tags: ["Shopify"], slug: "/portfolio" },
  ],
  faq: [
    { q: "Combien de temps pour livrer un site vitrine ?", a: "Comptez en moyenne 2 a 3 semaines pour un site vitrine, selon le nombre de pages et la complexite du design." },
    { q: "Puis-je gerer le contenu moi-meme ?", a: "Oui. Nous integrons un CMS intuitif qui vous permet de modifier textes, images et articles sans toucher au code." },
    { q: "Le site sera-t-il optimise pour Google ?", a: "Absolument. Le SEO technique (vitesse, balises, structure, sitemap) est inclus des la conception." },
    { q: "Proposez-vous la maintenance ?", a: "Oui, des forfaits de maintenance et d'evolution sont disponibles apres la mise en ligne." },
  ],
};

const frDetailPlateformes: ServiceDetail = {
  slug: "plateformes-web",
  icon: "platform",
  title: "Plateformes web",
  shortDesc: "SaaS et applications metier robustes, scalables et securisees, penses pour accompagner votre croissance.",
  longDescTitle: "Qu'est-ce qu'une plateforme web ?",
  longDesc: [
    "Une plateforme web est une application sur mesure qui va au-dela d'un simple site : elle inclut l'authentification utilisateur, une logique metier complexe, des tableaux de bord et des integrations tierces. Elle est concue pour evoluer avec votre activite.",
    "Chez TANGER CODE, nous construisons des plateformes SaaS et des outils internes avec React, Node.js et des architectures cloud-native qui garantissent fiabilite et performance.",
  ],
  features: ["Architecture scalable", "Authentification & roles", "API & integrations tierces", "Tableaux de bord temps reel"],
  tags: ["React", "Node.js", "PostgreSQL", "AWS"],
  values: [
    { title: "Ecoute", desc: "Nous partons de vos objectifs business, pas d'une liste de fonctionnalites." },
    { title: "Sur mesure", desc: "Aucun template generique : chaque pixel et chaque ligne de code sont penses pour vous." },
    { title: "Performance", desc: "Des architectures penses pour la montee en charge et la vitesse." },
    { title: "Durabilite", desc: "Un code propre et documente, facile a faire evoluer dans le temps." },
  ],
  technologies: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "Docker", "Kubernetes", "GraphQL"],
  pricingTiers: [
    { name: "Starter", price: "15 000 MAD", description: "Plateforme SaaS basique, MVP.", features: ["Fonctionnalites cœur", "Auth utilisateurs", "Dashboard", "API"], cta: "Choisir", meta: "6 semaines · Support 2 mois" },
    { name: "Pro", price: "45 000 MAD", description: "Plateforme complete scalable.", features: ["Toutes fonctionnalites", "Integrations tierces", "Panel admin", "Temps reel"], cta: "Choisir", featured: true, meta: "12 semaines · Support 6 mois" },
    { name: "Premium", price: "", description: "Plateforme entreprise.", features: ["Architecture sur mesure", "Infra dediee", "SLA garanti", "Support 1 an"], cta: "Devis", meta: "Sur planning · Support 1 an" },
  ],
  relatedProjects: [
    { title: "Mizan", client: "Plateforme", category: "platform", year: 2025, tags: ["React"], slug: "/portfolio" },
    { title: "Atlas Market", client: "Plateforme", category: "ecom", year: 2025, tags: ["Next.js"], slug: "/portfolio" },
    { title: "Medina ERP", client: "Plateforme", category: "erp", year: 2025, tags: ["Django"], slug: "/portfolio" },
  ],
  faq: [
    { q: "Quelle est la difference entre un site web et une plateforme ?", a: "Une plateforme inclut des comptes utilisateurs, une logique metier complexe, des tableaux de bord et souvent des integrations avec d'autres systemes. C'est une application interactive, pas seulement des pages de contenu." },
    { q: "Pouvez-vous integrer nos outils existants ?", a: "Oui. Nous integrons vos CRM, ERP, solutions de paiement et toute API externe dont vous avez besoin." },
    { q: "Comment assurez-vous la securite ?", a: "Nous appliquons les bonnes pratiques OWASP, chiffrons les donnees sensibles, mettons en place une authentification par roles et auditons les acces." },
    { q: "La plateforme est-elle evolutive ?", a: "Oui. Nos architectures cloud-native sont concues pour grandir avec votre base utilisateurs et vos besoins fonctionnels." },
  ],
};

const frDetailERP: ServiceDetail = {
  slug: "erp-sur-mesure",
  icon: "erp",
  title: "ERP sur mesure",
  shortDesc: "Centralisez stock, facturation, RH et reporting dans un outil unique, adapte a vos processus reels.",
  longDescTitle: "Qu'est-ce qu'un ERP sur mesure ?",
  longDesc: [
    "Un ERP (Enterprise Resource Planning) sur mesure est une solution logicielle qui centralise toutes les operations de votre entreprise : gestion des stocks, facturation, ressources humaines, comptabilite et reporting. Contrairement aux ERP du marche, il est construit pour epouser vos processus exacts.",
    "Chez TANGER CODE, nous utilisons Django, PostgreSQL et Docker pour livrer des ERP robustes, rapides et faciles a maintenir. Vos equipes obtiennent un outil qu'elles ont envie d'utiliser au quotidien.",
  ],
  features: ["Modules adaptes a votre metier", "Gestion de stock & facturation", "Reporting & Business Intelligence", "Import/export & automatisations"],
  tags: ["Django", "PostgreSQL", "Docker", "BI"],
  values: [
    { title: "Ecoute", desc: "Nous partons de vos objectifs business, pas d'une liste de fonctionnalites." },
    { title: "Sur mesure", desc: "Des modules construits pour vos processus exacts, pas adaptes d'un outil generique." },
    { title: "Performance", desc: "Requetes rapides, bases de donnees optimisees, interfaces fluides." },
    { title: "Durabilite", desc: "Code propre et documente, facile a faire evoluer dans le temps." },
  ],
  technologies: ["Django", "PostgreSQL", "Docker", "Redis", "Celery", "Python", "TypeScript", "BI"],
  pricingTiers: [
    { name: "Starter", price: "25 000 MAD", description: "ERP basique, 2 modules.", features: ["2 modules", "Gestion utilisateurs", "Dashboard", "Rapports de base"], cta: "Choisir", meta: "8 semaines · Support 3 mois" },
    { name: "Pro", price: "60 000 MAD", description: "ERP complet, 4 modules.", features: ["4 modules", "BI avancee", "Automatisations", "API"], cta: "Choisir", featured: true, meta: "16 semaines · Support 6 mois" },
    { name: "Premium", price: "", description: "ERP entreprise, illimite.", features: ["Modules illimites", "Integrations custom", "Formation & docs", "Support 1 an"], cta: "Devis", meta: "Sur planning · Support 1 an" },
  ],
  relatedProjects: [
    { title: "Medina ERP", client: "ERP", category: "erp", year: 2025, tags: ["Django"], slug: "/portfolio" },
    { title: "Mizan", client: "ERP", category: "platform", year: 2025, tags: ["React"], slug: "/portfolio" },
    { title: "Atlas Market", client: "ERP", category: "ecom", year: 2025, tags: ["Next.js"], slug: "/portfolio" },
  ],
  faq: [
    { q: "Combien de temps pour construire un ERP ?", a: "Entre 8 et 24 semaines selon le nombre de modules et la complexite. Nous construisons de maniere incrementale, en livrant des modules utilisables au fur et a mesure." },
    { q: "Pouvez-vous migrer les donnees de notre ancien systeme ?", a: "Oui. Nous analysons vos donnees existantes et construisons des scripts de migration automatisee pour tout importer proprement." },
    { q: "L'ERP est-il accessible a distance ?", a: "Oui. C'est une application web accessible depuis n'importe quel appareil avec un navigateur et une connexion internet." },
    { q: "Fournissez-vous une formation ?", a: "Oui. Nous fournissons une documentation complete et des sessions de formation pour vos equipes lors du deploiement." },
  ],
};

const frDetailMobile: ServiceDetail = {
  slug: "applications-mobiles",
  icon: "mobile",
  title: "Applications mobiles",
  shortDesc: "Apps natives et cross-platform iOS / Android fluides et elegantes, pretes pour les stores.",
  longDescTitle: "Qu'est-ce qu'une application mobile sur mesure ?",
  longDesc: [
    "Une application mobile sur mesure est une application native ou cross-platform construite specifiquement pour les besoins de votre entreprise et de vos utilisateurs. Elle peut inclure des fonctionnalites comme les notifications push, le mode hors-ligne, le GPS, l'appareil photo et plus encore.",
    "Chez TANGER CODE, nous utilisons Flutter pour livrer de belles applications avec une base de code unique pour iOS et Android, economisant du temps et du budget de developpement tout en conservant des performances natives.",
  ],
  features: ["Une base de code, deux plateformes", "Notifications push & offline", "Publication App Store & Play Store", "Design conforme aux guidelines"],
  tags: ["Flutter", "iOS", "Android", "Firebase"],
  values: [
    { title: "Ecoute", desc: "Nous partons de vos objectifs business, pas d'une liste de fonctionnalites." },
    { title: "Sur mesure", desc: "Chaque ecran est concu pour vos utilisateurs et votre marque." },
    { title: "Performance", desc: "Fluidite native, demarrage rapide, batterie optimisee." },
    { title: "Durabilite", desc: "Code propre, mises a jour regulieres, maintenance long terme." },
  ],
  technologies: ["Flutter", "Dart", "Firebase", "iOS", "Android", "REST API", "Push Notifications", "App Stores"],
  pricingTiers: [
    { name: "Starter", price: "20 000 MAD", description: "Appli simple, 3 ecrans.", features: ["3 ecrans", "iOS + Android", "Notifications push", "Publication stores"], cta: "Choisir", meta: "6 semaines · Support 2 mois" },
    { name: "Pro", price: "50 000 MAD", description: "Appli complete avec backend.", features: ["Jusqu'a 10 ecrans", "Mode offline", "Camera & GPS", "Backend custom"], cta: "Choisir", featured: true, meta: "12 semaines · Support 6 mois" },
    { name: "Premium", price: "", description: "Solution mobile entreprise.", features: ["Ecrans illimites", "Fonctionnalites avancees", "Integrations custom", "Support 1 an"], cta: "Devis", meta: "Sur planning · Support 1 an" },
  ],
  relatedProjects: [
    { title: "RihlaGo", client: "Mobile", category: "mobile", year: 2024, tags: ["Flutter"], slug: "/portfolio" },
    { title: "Atlas Market", client: "Mobile", category: "ecom", year: 2025, tags: ["Next.js"], slug: "/portfolio" },
    { title: "Mizan", client: "Mobile", category: "platform", year: 2025, tags: ["React"], slug: "/portfolio" },
  ],
  faq: [
    { q: "Flutter ou natif : comment choisir ?", a: "Flutter offre un excellent compromis : une base de code pour iOS et Android, avec des performances proches du natif. Pour des cas tres specifiques (3D lourde, realite augmentee), le natif peut etre preferable." },
    { q: "Combien de temps pour publier sur les stores ?", a: "La validation Apple App Store prend 1 a 2 jours en moyenne. Google Play Store est generalement immediat. Nous gerons tout le processus de publication." },
    { q: "Pouvez-vous reprendre une application existante ?", a: "Oui. Nous auditons le code existant et proposons un plan de reprise, d'evolution ou de reecriture selon l'etat du code." },
    { q: "Assurez-vous les mises a jour de l'application ?", a: "Oui. Les forfaits de maintenance incluent les mises a jour regulieres pour la compatibilite OS, les corrections de bugs et les ajouts de fonctionnalites." },
  ],
};

/* ---- AR ---- */
const arDetailSitesWeb: ServiceDetail = {
  ...enDetailSitesWeb,
  slug: "sites-web",
  title: "مواقع ويب مخصصة",
  shortDesc: "مواقع عرض وتجارة إلكترونية ومدونات تجمع بين التصميم المتقن والسرعة وتحسين محركات البحث.",
  longDescTitle: "ما هو الموقع المخصص؟",
  longDesc: [
    "الموقع المخصص هو عكس القالب الجاهز: كل شاشة مصممة خصيصاً لعلامتك التجارية وأهدافك ومستخدميك. النتيجة موقع يشبهك ويتميز عن المنافسين ويحمل بسرعة في كل أنحاء العالم.",
    "في TANGER CODE، نجمع بين التصميم المدروس والتقنيات الحديثة (Next.js، Astro) لتسليم مواقع عالية الأداء وسهلة الوصول والتطوير.",
  ],
  features: ["تصميم متجاوب مخصص", "تحسين محركات البحث والأداء", "نظام إدارة محتوى", "تجارة إلكترونية ودفع"],
  values: [
    { title: "الاستماع", desc: "ننطلق من أهدافك التجارية، لا من قائمة ميزات." },
    { title: "مخصص", desc: "لا قوالب عامة: كل بكسل وكل سطر كود مصمم لك." },
    { title: "الأداء", desc: "مواقع سريعة وسهلة الوصول ومحسنة لمحركات البحث منذ البداية." },
    { title: "الاستدامة", desc: "كود نظيف وموثق، سهل التطوير مع مرور الوقت." },
  ],
  pricingTiers: [
    { name: "Starter", price: "8 000 MAD", description: "موقع عرض بسيط، 5 صفحات.", features: ["5 صفحات", "متجاوب", "نموذج اتصال", "مراجعتان"], cta: "اختيار", meta: "أسبوعان · دعم شهر" },
    { name: "Pro", price: "25 000 MAD", description: "موقع مخصص كامل.", features: ["صفحات غير محدودة", "مدونة وCMS", "SEO متقدم", "حركات"], cta: "اختيار", featured: true, meta: "4 أسابيع · دعم 3 أشهر" },
    { name: "Premium", price: "", description: "تجارة إلكترونية وتكاملات.", features: ["تجارة كاملة", "متعدد اللغات", "تكاملات API", "دعم سنة"], cta: "عرض سعر", meta: "حسب الجدول · دعم سنة" },
  ],
  faq: [
    { q: "كم من الوقت لتسليم موقع عرض؟", a: "بين 2 و3 أسابيع في المتوسط لموقع عرض، حسب عدد الصفحات وتعقيد التصميم." },
    { q: "هل يمكنني إدارة المحتوى بنفسي؟", a: "نعم. ندمج نظام إدارة محتوى سهل يتيح لك تعديل النصوص والصور والمقالات دون لمس الكود." },
    { q: "هل سيكون الموقع محسناً لجوجل؟", a: "بالتأكيد. تحسين محركات البحث التقني (السرعة، الوسوم، البنية، خريطة الموقع) مشمول منذ البداية." },
    { q: "هل تقدمون خدمة الصيانة؟", a: "نعم، باقات الصيانة والتطوير متاحة بعد الإطلاق." },
  ],
};

const arDetailPlateformes: ServiceDetail = { ...arDetailSitesWeb, slug: "plateformes-web", icon: "platform", title: "منصات ويب", shortDesc: "تطبيقات SaaS وأعمال قوية وقابلة للتطوير وآمنة، مصممة لمرافقة نموك." };
const arDetailERP: ServiceDetail = { ...arDetailSitesWeb, slug: "erp-sur-mesure", icon: "erp", title: "ERP مخصص", shortDesc: "مركز المخزون والفوترة والموارد البشرية والتقارير في أداة واحدة مكيفة مع عملياتك الحقيقية." };
const arDetailMobile: ServiceDetail = { ...arDetailSitesWeb, slug: "applications-mobiles", icon: "mobile", title: "تطبيقات جوال", shortDesc: "تطبيقات أصلية ومتعددة المنصات سلسة وأنيقة، جاهزة للمتاجر." };

/* ---- Page data per locale ---- */
function buildServicesPageData(locale: string): ServicesPageData {
  const detailMap: Record<string, ServiceDetail[]> = {
    en: [enDetailSitesWeb, enDetailPlateformes, enDetailERP, enDetailMobile],
    fr: [frDetailSitesWeb, frDetailPlateformes, frDetailERP, frDetailMobile],
    ar: [arDetailSitesWeb, arDetailPlateformes, arDetailERP, arDetailMobile],
  };

  const details = detailMap[locale] || detailMap.fr;

  const l10n: Record<string, {
    eyebrow: string; title: string; subtitle: string; processEyebrow: string; processTitle: string; processDesc: string;
    steps: { num: string; title: string; desc: string }[];
    ctaTitle: string; ctaLead: string; ctaBtn: string; ctaWa: string; breadcrumb: string; lastCrumb: string;
  }> = {
    en: { eyebrow: "EXPERTISE", title: "Custom digital solutions", subtitle: "From showcase site to complete ERP, we design and develop high-performance products built to last.", processEyebrow: "METHODOLOGY", processTitle: "Our process", processDesc: "From idea to go-live, every step is mastered.", steps: [{ num: "01", title: "Discovery", desc: "Needs framing." }, { num: "02", title: "Design", desc: "Technical architecture." }, { num: "03", title: "UI/UX", desc: "Interface mockups." }, { num: "04", title: "Development", desc: "Tested code." }, { num: "05", title: "Testing", desc: "Quality & security." }, { num: "06", title: "Deployment", desc: "Go-live." }, { num: "07", title: "Maintenance", desc: "Monitoring & support." }], ctaTitle: "Ready to start your project?", ctaLead: "Let's talk about your idea. Response within 24h, free quote with no obligation.", ctaBtn: "Start a project", ctaWa: "WhatsApp", breadcrumb: "Services", lastCrumb: "l'idee" },
    fr: { eyebrow: "EXPERTISE", title: "Des solutions digitales sur mesure", subtitle: "Du site vitrine a l'ERP complet, nous concevons et developpons des produits performants, penses pour durer.", processEyebrow: "METHODOLOGIE", processTitle: "Notre process", processDesc: "De l'idee a la mise en ligne, chaque etape est maitrisee.", steps: [{ num: "01", title: "Decouverte", desc: "Cadrage des besoins." }, { num: "02", title: "Conception", desc: "Architecture technique." }, { num: "03", title: "Design", desc: "Maquettes UI/UX." }, { num: "04", title: "Developpement", desc: "Code teste." }, { num: "05", title: "Tests", desc: "Qualite & securite." }, { num: "06", title: "Deploiement", desc: "Mise en ligne." }, { num: "07", title: "Maintenance", desc: "Suivi & support." }], ctaTitle: "Pret a demarrer votre projet ?", ctaLead: "Parlons de votre idee. Reponse sous 24h, devis gratuit et sans engagement.", ctaBtn: "Demarrer un projet", ctaWa: "WhatsApp", breadcrumb: "Services", lastCrumb: "l'idee" },
    ar: { eyebrow: "خبراتنا", title: "حلول رقمية مخصصة", subtitle: "من موقع العرض إلى نظام ERP الكامل، نصمم ونطور منتجات عالية الأداء مصممة لتدوم.", processEyebrow: "منهجيتنا", processTitle: "طريقة عملنا", processDesc: "من الفكرة إلى الإطلاق، كل خطوة تحت السيطرة.", steps: [{ num: "01", title: "الاكتشاف", desc: "تحديد الاحتياجات." }, { num: "02", title: "التصميم", desc: "الهندسة التقنية." }, { num: "03", title: "الواجهات", desc: "نماذج UI/UX." }, { num: "04", title: "التطوير", desc: "كود مختبر." }, { num: "05", title: "الاختبار", desc: "الجودة والأمان." }, { num: "06", title: "النشر", desc: "الإطلاق." }, { num: "07", title: "الصيانة", desc: "المتابعة والدعم." }], ctaTitle: "مستعد لبدء مشروعك؟", ctaLead: "لنتحدث عن فكرتك. رد خلال 24 ساعة، عرض سعر مجاني وبدون التزام.", ctaBtn: "ابدأ مشروعاً", ctaWa: "واتساب", breadcrumb: "الخدمات", lastCrumb: "الفكرة" },
  };

  const t = l10n[locale] || l10n.fr;

  return {
    eyebrow: t.eyebrow,
    title: t.title,
    subtitle: t.subtitle,
    processEyebrow: t.processEyebrow,
    processTitle: t.processTitle,
    processDesc: t.processDesc,
    processSteps: t.steps,
    ctaTitle: t.ctaTitle,
    ctaLead: t.ctaLead,
    ctaButton: t.ctaBtn,
    ctaWhatsapp: t.ctaWa,
    breadcrumb: [{ label: "Accueil", href: "/" }],
    lastBreadcrumb: t.breadcrumb,
    details,
    services: details.map((d) => ({
      slug: d.slug,
      icon: d.icon,
      title: d.title,
      description: d.shortDesc,
      features: d.features,
      tags: d.tags,
    })),
  };
}

export const fallbackServicesData: Record<string, ServicesPageData> = {
  en: buildServicesPageData("en"),
  fr: buildServicesPageData("fr"),
  ar: buildServicesPageData("ar"),
};
