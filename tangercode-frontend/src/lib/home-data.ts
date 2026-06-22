export interface ServiceData {
  title: string;
  description: string;
  icon: string;
  tags: string[];
  slug: string;
}

export interface ProjectData {
  title: string;
  client: string;
  category: string;
  year: number;
  tags: string[];
  slug: string;
}

export interface PricingTierData {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  meta: string;
}

export interface TestimonialData {
  quote: string;
  name: string;
  role: string;
}

export interface StatData {
  value: number;
  suffix: string;
  label: string;
}

export interface TechData {
  name: string;
  abbr: string;
}

export interface BlogPostData {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

export interface HomeData {
  heroEyebrow: string;
  heroTitlePart1: string;
  heroHighlight: string;
  heroTitlePart2: string;
  heroSubtitle: string;
  heroCta: string;
  heroSecondary: string;
  trust: { value: number; suffix: string; label: string }[];
  services: ServiceData[];
  servicesEyebrow: string;
  servicesTitle: string;
  servicesDesc: string;
  processEyebrow: string;
  processTitle: string;
  processDesc: string;
  processSteps: { num: string; title: string; desc: string }[];
  portfolioEyebrow: string;
  portfolioTitle: string;
  portfolioDesc: string;
  portfolioViewAll: string;
  filters: { key: string; label: string }[];
  projects: ProjectData[];
  pricingEyebrow: string;
  pricingTitle: string;
  pricingDesc: string;
  pricingTiers: PricingTierData[];
  pricingNote: string;
  pricingDiscuss: string;
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonials: TestimonialData[];
  stats: StatData[];
  stackEyebrow: string;
  stackTitle: string;
  stackDesc: string;
  technologies: TechData[];
  blogEyebrow: string;
  blogTitle: string;
  blogViewAll: string;
  blogPosts: BlogPostData[];
  ctaTitle: string;
  ctaLead: string;
  ctaButton: string;
  ctaWhatsapp: string;
  discoverLabel: string;
  popularBadge: string;
  customQuote: string;
}

const fr: HomeData = {
  heroEyebrow: "DEVELOPPEMENT WEB &amp; MOBILE",
  heroTitlePart1: "Construire le ",
  heroHighlight: "digital",
  heroTitlePart2: " de demain",
  heroSubtitle:
    "Sites web, plateformes, ERP et applications mobiles sur mesure. Basé à Tanger, déployé dans le monde.",
  heroCta: "Démarrer un projet",
  heroSecondary: "Voir le portfolio",
  trust: [
    { value: 50, suffix: "+", label: "Projets livrés" },
    { value: 30, suffix: "+", label: "Clients satisfaits" },
    { value: 5, suffix: "+", label: "Années d'expérience" },
    { value: 15, suffix: "+", label: "Technologies maîtrisées" },
  ],
  servicesEyebrow: "EXPERTISE",
  servicesTitle: "Nos services",
  servicesDesc: "Des solutions sur mesure pour chaque besoin digital.",
  services: [
    {
      title: "Sites web",
      description:
        "Vitrines, e-commerce et blogs performants, rapides et optimisés pour le référencement.",
      icon: "web",
      tags: ["Next.js", "SEO", "CMS"],
      slug: "/services",
    },
    {
      title: "Plateformes web",
      description:
        "SaaS et applications métier robustes, scalables et sécurisées, pensées pour la croissance.",
      icon: "platform",
      tags: ["React", "Node.js", "API"],
      slug: "/services",
    },
    {
      title: "ERP sur mesure",
      description:
        "Solutions de gestion intégrées : stock, facturation, RH et reporting unifiés en un outil.",
      icon: "erp",
      tags: ["Django", "PostgreSQL", "BI"],
      slug: "/services",
    },
    {
      title: "Applications mobiles",
      description:
        "Apps natives et cross-platform iOS / Android fluides, élégantes et prêtes pour les stores.",
      icon: "mobile",
      tags: ["Flutter", "iOS", "Android"],
      slug: "/services",
    },
  ],
  processEyebrow: "METHODOLOGIE",
  processTitle: "Notre process",
  processDesc: "De l'idée à la mise en ligne, chaque étape est maîtrisée.",
  processSteps: [
    { num: "01", title: "Découverte", desc: "Cadrage des besoins et des objectifs." },
    { num: "02", title: "Conception", desc: "Architecture & spécifications techniques." },
    { num: "03", title: "Design", desc: "Maquettes UI/UX sur mesure." },
    { num: "04", title: "Développement", desc: "Code propre, testé et documenté." },
    { num: "05", title: "Tests", desc: "Qualité, performance & sécurité." },
    { num: "06", title: "Déploiement", desc: "Mise en ligne et optimisation." },
    { num: "07", title: "Maintenance", desc: "Suivi, évolutions & support." },
  ],
  portfolioEyebrow: "PORTFOLIO",
  portfolioTitle: "Réalisations",
  portfolioDesc: "Quelques-uns de nos projets récents.",
  portfolioViewAll: "Voir tous les projets",
  filters: [
    { key: "all", label: "Tous" },
    { key: "web", label: "Sites web" },
    { key: "ecom", label: "E-commerce" },
    { key: "platform", label: "Plateformes" },
    { key: "erp", label: "ERP" },
    { key: "mobile", label: "Mobile" },
  ],
  projects: [
    {
      title: "Atlas Market",
      client: "Marketplace · Casablanca",
      category: "ecom",
      year: 2025,
      tags: ["Next.js", "Stripe", "Sanity"],
      slug: "/portfolio/atlas-market",
    },
    {
      title: "Medina ERP",
      client: "Gestion industrielle · Tanger",
      category: "erp",
      year: 2025,
      tags: ["Django", "PostgreSQL", "Docker"],
      slug: "/portfolio/medina-erp",
    },
    {
      title: "RihlaGo",
      client: "App de voyage · Maroc",
      category: "mobile",
      year: 2024,
      tags: ["Flutter", "Firebase", "Maps"],
      slug: "/portfolio/rihlago",
    },
    {
      title: "Détroit Avocats",
      client: "Cabinet juridique · Tanger",
      category: "web",
      year: 2024,
      tags: ["Astro", "CMS", "SEO"],
      slug: "/portfolio/detroit-avocats",
    },
    {
      title: "Mizan",
      client: "SaaS comptable · Rabat",
      category: "platform",
      year: 2025,
      tags: ["React", "Node.js", "AWS"],
      slug: "/portfolio/mizan",
    },
    {
      title: "Zellige Store",
      client: "Artisanat en ligne · Fès",
      category: "ecom",
      year: 2024,
      tags: ["Shopify", "i18n", "CDN"],
      slug: "/portfolio/zellige-store",
    },
  ],
  pricingEyebrow: "PRICING",
  pricingTitle: "Tarifs transparents",
  pricingDesc: "Des formules claires adaptées à votre projet.",
  popularBadge: "★ Plus populaire",
  customQuote: "Sur devis",
  pricingDiscuss: "Discuter de votre projet",
  pricingTiers: [
    {
      name: "Starter",
      price: "8 000 MAD",
      description: "Site vitrine simple, idéal pour démarrer votre présence en ligne.",
      features: [
        "5 pages, design standard",
        "Responsive mobile",
        "Formulaire de contact",
        "2 révisions incluses",
      ],
      cta: "Choisir Starter",
      meta: "2 semaines · Support 1 mois",
    },
    {
      name: "Pro",
      price: "25 000 MAD",
      description: "Site sur mesure avec fonctionnalités avancées et optimisation SEO.",
      features: [
        "Pages illimitées, design custom",
        "Blog & CMS intégré",
        "SEO avancé & analytics",
        "Animations & micro-interactions",
      ],
      cta: "Choisir Pro",
      featured: true,
      meta: "4 semaines · Support 3 mois",
    },
    {
      name: "Premium",
      price: "",
      description: "Plateforme, ERP ou application mobile complète, sur mesure intégral.",
      features: [
        "Architecture sur mesure",
        "Intégrations & API tierces",
        "Formation & documentation",
        "Support 1 an inclus",
      ],
      cta: "Demander un devis",
      meta: "Sur planning · Support 1 an",
    },
  ],
  pricingNote: "Tous nos tarifs sont personnalisables —",
  testimonialsEyebrow: "TEMOIGNAGES",
  testimonialsTitle: "Ce que disent nos clients",
  testimonials: [
    {
      quote:
        "Un travail d'orfèvre. Le site est rapide, magnifique et nos ventes ont bondi de 40 % en trois mois.",
      name: "Yasmine Bennani",
      role: "CEO · Atlas Market",
    },
    {
      quote:
        "Notre ERP a transformé notre gestion. Tout est centralisé, fluide et enfin compréhensible.",
      name: "Karim El Fassi",
      role: "Directeur · Medina Industries",
    },
    {
      quote:
        "Réactif, précis et force de proposition. L'app mobile a dépassé toutes nos attentes.",
      name: "Sofia Alaoui",
      role: "Fondatrice · RihlaGo",
    },
    {
      quote:
        "Du conseil au déploiement, un partenaire de confiance. Je recommande sans hésiter.",
      name: "Omar Tazi",
      role: "Associé · Détroit Avocats",
    },
    {
      quote:
        "Une plateforme SaaS solide, livrée dans les délais. La qualité du code est remarquable.",
      name: "Leila Mansouri",
      role: "CTO · Mizan",
    },
  ],
  stats: [
    { value: 50, suffix: "+", label: "Projets livrés" },
    { value: 30, suffix: "+", label: "Clients satisfaits" },
    { value: 5, suffix: "+", label: "Années d'expérience" },
    { value: 99, suffix: "%", label: "Taux de satisfaction" },
  ],
  stackEyebrow: "STACK",
  stackTitle: "Technologies maîtrisées",
  stackDesc: "Les meilleurs outils pour les meilleurs résultats.",
  technologies: [
    { name: "Next.js", abbr: "N" },
    { name: "React", abbr: "R" },
    { name: "Django", abbr: "Dj" },
    { name: "Python", abbr: "Py" },
    { name: "Node.js", abbr: "No" },
    { name: "Flutter", abbr: "Fl" },
    { name: "PostgreSQL", abbr: "Pg" },
    { name: "Docker", abbr: "Dk" },
    { name: "TypeScript", abbr: "Ts" },
    { name: "Tailwind", abbr: "Tw" },
    { name: "Three.js", abbr: "3D" },
    { name: "AWS", abbr: "Aw" },
  ],
  blogEyebrow: "BLOG",
  blogTitle: "Derniers articles",
  blogViewAll: "Voir tous",
  blogPosts: [
    {
      title: "Next.js 15 : ce qui change vraiment",
      excerpt:
        "Tour d'horizon des nouveautés et de leur impact concret sur la performance de vos sites.",
      category: "Développement",
      date: "12 mai 2025",
      readTime: "6 min",
      slug: "/blog/nextjs-15",
    },
    {
      title: "Concevoir un ERP que vos équipes adorent",
      excerpt:
        "Les principes UX qui font la différence entre un outil subi et un outil adopté.",
      category: "Design",
      date: "28 avr. 2025",
      readTime: "8 min",
      slug: "/blog/erp-ux",
    },
    {
      title: "Flutter ou natif : comment choisir ?",
      excerpt:
        "Critères de décision pour votre prochaine application mobile, sans jargon inutile.",
      category: "Mobile",
      date: "15 avr. 2025",
      readTime: "5 min",
      slug: "/blog/flutter-vs-native",
    },
  ],
  ctaTitle: "Prêt à démarrer votre projet ?",
  ctaLead: "Parlons de votre idée. Réponse sous 24h, devis gratuit et sans engagement.",
  ctaButton: "Démarrer un projet",
  ctaWhatsapp: "WhatsApp",
  discoverLabel: "Découvrir",
};

const en: HomeData = {
  ...fr,
  heroEyebrow: "WEB &amp; MOBILE DEVELOPMENT",
  heroTitlePart1: "Building tomorrow's ",
  heroHighlight: "digital",
  heroTitlePart2: " world",
  heroSubtitle:
    "Custom websites, platforms, ERP and mobile applications. Based in Tangier, deployed worldwide.",
  heroCta: "Start a project",
  heroSecondary: "View portfolio",
  trust: [
    { value: 50, suffix: "+", label: "Projects delivered" },
    { value: 30, suffix: "+", label: "Happy clients" },
    { value: 5, suffix: "+", label: "Years experience" },
    { value: 15, suffix: "+", label: "Technologies mastered" },
  ],
  servicesEyebrow: "EXPERTISE",
  servicesTitle: "Our services",
  servicesDesc: "Tailored solutions for every digital need.",
  services: [
    {
      title: "Websites",
      description:
        "High-performance showcase, e-commerce and blog sites optimized for SEO.",
      icon: "web",
      tags: ["Next.js", "SEO", "CMS"],
      slug: "/services",
    },
    {
      title: "Web Platforms",
      description:
        "Robust, scalable and secure SaaS and business applications built for growth.",
      icon: "platform",
      tags: ["React", "Node.js", "API"],
      slug: "/services",
    },
    {
      title: "Custom ERP",
      description:
        "Integrated management solutions: inventory, billing, HR and reporting unified in one tool.",
      icon: "erp",
      tags: ["Django", "PostgreSQL", "BI"],
      slug: "/services",
    },
    {
      title: "Mobile Apps",
      description:
        "Smooth, elegant native and cross-platform iOS/Android apps ready for the stores.",
      icon: "mobile",
      tags: ["Flutter", "iOS", "Android"],
      slug: "/services",
    },
  ],
  processEyebrow: "METHODOLOGY",
  processTitle: "Our process",
  processDesc: "From idea to launch, every step is mastered.",
  processSteps: [
    { num: "01", title: "Discovery", desc: "Needs and objectives framing." },
    { num: "02", title: "Design", desc: "Architecture & technical specifications." },
    { num: "03", title: "UI/UX", desc: "Tailored interface mockups." },
    { num: "04", title: "Development", desc: "Clean, tested and documented code." },
    { num: "05", title: "Testing", desc: "Quality, performance & security." },
    { num: "06", title: "Deployment", desc: "Go-live and optimization." },
    { num: "07", title: "Maintenance", desc: "Monitoring, updates & support." },
  ],
  portfolioEyebrow: "PORTFOLIO",
  portfolioTitle: "Our work",
  portfolioDesc: "Some of our recent projects.",
  portfolioViewAll: "View all projects",
  filters: [
    { key: "all", label: "All" },
    { key: "web", label: "Websites" },
    { key: "ecom", label: "E-commerce" },
    { key: "platform", label: "Platforms" },
    { key: "erp", label: "ERP" },
    { key: "mobile", label: "Mobile" },
  ],
  pricingEyebrow: "PRICING",
  pricingTitle: "Transparent pricing",
  pricingDesc: "Clear plans tailored to your project.",
  popularBadge: "★ Most popular",
  customQuote: "Custom quote",
  pricingDiscuss: "Discuss your project",
  pricingTiers: [
    {
      name: "Starter",
      price: "8 000 MAD",
      description: "Simple showcase site, ideal to start your online presence.",
      features: [
        "5 pages, standard design",
        "Mobile responsive",
        "Contact form",
        "2 revisions included",
      ],
      cta: "Choose Starter",
      meta: "2 weeks · Support 1 month",
    },
    {
      name: "Pro",
      price: "25 000 MAD",
      description: "Custom site with advanced features and SEO optimization.",
      features: [
        "Unlimited pages, custom design",
        "Blog & integrated CMS",
        "Advanced SEO & analytics",
        "Animations & micro-interactions",
      ],
      cta: "Choose Pro",
      featured: true,
      meta: "4 weeks · Support 3 months",
    },
    {
      name: "Premium",
      price: "",
      description: "Complete platform, ERP or mobile app, fully custom.",
      features: [
        "Custom architecture",
        "Third-party integrations & APIs",
        "Training & documentation",
        "1 year support included",
      ],
      cta: "Request a quote",
      meta: "On schedule · Support 1 year",
    },
  ],
  pricingNote: "All our pricing is customizable —",
  testimonialsEyebrow: "TESTIMONIALS",
  testimonialsTitle: "What our clients say",
  testimonials: [
    {
      quote:
        "A masterpiece of work. The site is fast, beautiful and our sales jumped 40% in three months.",
      name: "Yasmine Bennani",
      role: "CEO · Atlas Market",
    },
    {
      quote:
        "Our ERP transformed our management. Everything is centralized, smooth and finally understandable.",
      name: "Karim El Fassi",
      role: "Director · Medina Industries",
    },
    {
      quote:
        "Responsive, precise and proactive. The mobile app exceeded all our expectations.",
      name: "Sofia Alaoui",
      role: "Founder · RihlaGo",
    },
    {
      quote:
        "From consulting to deployment, a trusted partner. I recommend without hesitation.",
      name: "Omar Tazi",
      role: "Partner · Détroit Avocats",
    },
    {
      quote:
        "A solid SaaS platform, delivered on time. The code quality is remarkable.",
      name: "Leila Mansouri",
      role: "CTO · Mizan",
    },
  ],
  stats: [
    { value: 50, suffix: "+", label: "Projects delivered" },
    { value: 30, suffix: "+", label: "Happy clients" },
    { value: 5, suffix: "+", label: "Years experience" },
    { value: 99, suffix: "%", label: "Satisfaction rate" },
  ],
  stackEyebrow: "STACK",
  stackTitle: "Technologies we master",
  stackDesc: "The best tools for the best results.",
  blogEyebrow: "BLOG",
  blogTitle: "Latest articles",
  blogViewAll: "View all",
  blogPosts: [
    {
      title: "Next.js 15: what really changes",
      excerpt: "Overview of new features and their concrete impact on your site performance.",
      category: "Development",
      date: "May 12, 2025",
      readTime: "6 min",
      slug: "/blog/nextjs-15",
    },
    {
      title: "Designing an ERP your teams will love",
      excerpt: "UX principles that make the difference between a tolerated tool and an adopted one.",
      category: "Design",
      date: "Apr 28, 2025",
      readTime: "8 min",
      slug: "/blog/erp-ux",
    },
    {
      title: "Flutter or native: how to choose?",
      excerpt: "Decision criteria for your next mobile app, without unnecessary jargon.",
      category: "Mobile",
      date: "Apr 15, 2025",
      readTime: "5 min",
      slug: "/blog/flutter-vs-native",
    },
  ],
  ctaTitle: "Ready to start your project?",
  ctaLead: "Let's talk about your idea. Response within 24h, free quote with no obligation.",
  ctaButton: "Start a project",
  ctaWhatsapp: "WhatsApp",
  discoverLabel: "Discover",
};

const ar: HomeData = {
  ...fr,
  heroEyebrow: "تطوير الويب والجوال",
  heroTitlePart1: "نبني ",
  heroHighlight: "العالم الرقمي",
  heroTitlePart2: " للغد",
  heroSubtitle: "مواقع، منصات، أنظمة تخطيط موارد المؤسسات وتطبيقات جوال حسب الطلب. مقرنا في طنجة، ونخدم حول العالم.",
  heroCta: "ابدأ مشروعاً",
  heroSecondary: "شاهد المشاريع",
  trust: [
    { value: 50, suffix: "+", label: "مشروع منجز" },
    { value: 30, suffix: "+", label: "عميل راض" },
    { value: 5, suffix: "+", label: "سنوات خبرة" },
    { value: 15, suffix: "+", label: "تقنية متقنة" },
  ],
  servicesEyebrow: "خبراتنا",
  servicesTitle: "خدماتنا",
  servicesDesc: "حلول مخصصة لكل احتياج رقمي.",
  services: [
    {
      title: "مواقع الويب",
      description: "مواقع عروض وتجارة إلكترونية ومدونات عالية الأداء ومحسنة لمحركات البحث.",
      icon: "web",
      tags: ["Next.js", "SEO", "CMS"],
      slug: "/services",
    },
    {
      title: "منصات الويب",
      description: "تطبيقات SaaS وأعمال قوية وقابلة للتطوير وآمنة، مصممة للنمو.",
      icon: "platform",
      tags: ["React", "Node.js", "API"],
      slug: "/services",
    },
    {
      title: "أنظمة تخطيط الموارد",
      description: "حلول إدارة متكاملة: المخزون، الفوترة، الموارد البشرية والتقارير موحدة في أداة واحدة.",
      icon: "erp",
      tags: ["Django", "PostgreSQL", "BI"],
      slug: "/services",
    },
    {
      title: "تطبيقات الجوال",
      description: "تطبيقات أصلية ومتعددة المنصات لنظامي iOS وAndroid سلسة وأنيقة وجاهزة للمتاجر.",
      icon: "mobile",
      tags: ["Flutter", "iOS", "Android"],
      slug: "/services",
    },
  ],
  processEyebrow: "منهجيتنا",
  processTitle: "طريقة عملنا",
  processDesc: "من الفكرة إلى الإطلاق، كل خطوة تحت السيطرة.",
  processSteps: [
    { num: "01", title: "الاكتشاف", desc: "تحديد الاحتياجات والأهداف." },
    { num: "02", title: "التصميم", desc: "الهندسة والمواصفات التقنية." },
    { num: "03", title: "الواجهات", desc: "نماذج UI/UX مخصصة." },
    { num: "04", title: "التطوير", desc: "كود نظيف ومختبر وموثق." },
    { num: "05", title: "الاختبار", desc: "الجودة والأداء والأمان." },
    { num: "06", title: "النشر", desc: "الإطلاق والتحسين." },
    { num: "07", title: "الصيانة", desc: "المتابعة والتحديثات والدعم." },
  ],
  portfolioEyebrow: "المشاريع",
  portfolioTitle: "أعمالنا",
  portfolioDesc: "بعض من مشاريعنا الأخيرة.",
  portfolioViewAll: "شاهد كل المشاريع",
  filters: [
    { key: "all", label: "الكل" },
    { key: "web", label: "مواقع" },
    { key: "ecom", label: "متاجر" },
    { key: "platform", label: "منصات" },
    { key: "erp", label: "ERP" },
    { key: "mobile", label: "جوال" },
  ],
  pricingEyebrow: "الأسعار",
  pricingTitle: "أسعار شفافة",
  pricingDesc: "خطط واضحة مصممة لمشروعك.",
  popularBadge: "★ الأكثر شيوعاً",
  customQuote: "عرض سعر مخصص",
  pricingDiscuss: "ناقش مشروعك",
  pricingTiers: [
    {
      name: "Starter",
      price: "8 000 MAD",
      description: "موقع عرض بسيط، مثالي لبدء وجودك الرقمي.",
      features: [
        "5 صفحات، تصميم قياسي",
        "متجاوب مع الجوال",
        "نموذج اتصال",
        "مراجعتان مشمولتان",
      ],
      cta: "اختر Starter",
      meta: "أسبوعان · دعم شهر",
    },
    {
      name: "Pro",
      price: "25 000 MAD",
      description: "موقع مخصص بميزات متقدمة وتحسين SEO.",
      features: [
        "صفحات غير محدودة، تصميم مخصص",
        "مدونة ونظام CMS مدمج",
        "SEO متقدم وتحليلات",
        "حركات وتفاعلات دقيقة",
      ],
      cta: "اختر Pro",
      featured: true,
      meta: "4 أسابيع · دعم 3 أشهر",
    },
    {
      name: "Premium",
      price: "",
      description: "منصة كاملة، ERP أو تطبيق جوال، مخصص بالكامل.",
      features: [
        "هندسة مخصصة",
        "تكاملات وAPI طرف ثالث",
        "تدريب وتوثيق",
        "دعم سنة كاملة",
      ],
      cta: "اطلب عرض سعر",
      meta: "حسب الجدول · دعم سنة",
    },
  ],
  pricingNote: "جميع أسعارنا قابلة للتخصيص —",
  testimonialsEyebrow: "آراء العملاء",
  testimonialsTitle: "ماذا يقول عملاؤنا",
  testimonials: [
    {
      quote: "عمل متقن. الموقع سريع وجميل وزادت مبيعاتنا بنسبة 40% في ثلاثة أشهر.",
      name: "ياسمين بناني",
      role: "مديرة · Atlas Market",
    },
    {
      quote: "حوّل نظام ERP إدارتنا. كل شيء مركزي وسلس ومفهوم أخيراً.",
      name: "كريم الفاسي",
      role: "مدير · Medina Industries",
    },
    {
      quote: "سريع الاستجابة ودقيق واستباقي. تجاوز التطبيق كل توقعاتنا.",
      name: "صفية العلوي",
      role: "مؤسسة · RihlaGo",
    },
    {
      quote: "من الاستشارة إلى النشر، شريك موثوق. أوصي بدون تردد.",
      name: "عمر التازي",
      role: "شريك · Détroit Avocats",
    },
    {
      quote: "منصة SaaS صلبة، سُلّمت في الوقت المحدد. جودة الكود رائعة.",
      name: "ليلى المنصوري",
      role: "مديرة تقنية · Mizan",
    },
  ],
  stats: [
    { value: 50, suffix: "+", label: "مشروع منجز" },
    { value: 30, suffix: "+", label: "عميل راض" },
    { value: 5, suffix: "+", label: "سنوات خبرة" },
    { value: 99, suffix: "%", label: "نسبة الرضا" },
  ],
  stackEyebrow: "التقنيات",
  stackTitle: "التقنيات التي نتقنها",
  stackDesc: "أفضل الأدوات لأفضل النتائج.",
  blogEyebrow: "المدونة",
  blogTitle: "آخر المقالات",
  blogViewAll: "عرض الكل",
  blogPosts: [
    {
      title: "Next.js 15: ما الذي تغير حقاً",
      excerpt: "جولة في الميزات الجديدة وتأثيرها الملموس على أداء مواقعكم.",
      category: "تطوير",
      date: "12 مايو 2025",
      readTime: "6 دقائق",
      slug: "/blog/nextjs-15",
    },
    {
      title: "تصميم ERP تحبه فرقكم",
      excerpt: "مبادئ UX التي تصنع الفرق بين أداة مفروضة وأداة متبناة.",
      category: "تصميم",
      date: "28 أبريل 2025",
      readTime: "8 دقائق",
      slug: "/blog/erp-ux",
    },
    {
      title: "Flutter أم أصلي: كيف تختار؟",
      excerpt: "معايير القرار لتطبيقك الجوال القادم، بدون تعقيدات تقنية.",
      category: "جوال",
      date: "15 أبريل 2025",
      readTime: "5 دقائق",
      slug: "/blog/flutter-vs-native",
    },
  ],
  ctaTitle: "مستعد لبدء مشروعك؟",
  ctaLead: "لنتحدث عن فكرتك. رد خلال 24 ساعة، عرض سعر مجاني وبدون التزام.",
  ctaButton: "ابدأ مشروعاً",
  ctaWhatsapp: "واتساب",
  discoverLabel: "اكتشف",
};

export const fallbackHomeData: Record<string, HomeData> = { fr, en, ar };
