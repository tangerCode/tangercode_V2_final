export interface BlogPostDetail {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverLabel: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  content: string;
  tags: string[];
  relatedSlugs: string[];
  featured?: boolean;
}

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  authorName: string;
  featured?: boolean;
}

export interface BlogPageData {
  eyebrow: string;
  title: string;
  subtitle: string;
  lastBreadcrumb: string;
  searchPlaceholder: string;
  filters: { key: string; label: string }[];
  featuredBadge: string;
  readLabel: string;
  viewAll: string;
  relatedEye: string;
  relatedTitle: string;
  authorContact: string;
  posts: BlogCardData[];
  details: BlogPostDetail[];
}

function makePosts(locale: string): BlogPostDetail[] {
  const l = locale === "en" ? "en" : locale === "ar" ? "ar" : "fr";
  const t = (fr: string, en: string, ar: string) => (l === "en" ? en : l === "ar" ? ar : fr);

  return [
    {
      slug: "nextjs-15", featured: true,
      title: t("Next.js 15 : ce qui change vraiment", "Next.js 15: what really changes", "Next.js 15: ما الذي تغير حقاً"),
      excerpt: t("Tour d'horizon des nouveautes et de leur impact concret sur la performance de vos sites.", "Overview of new features and their concrete impact on your site performance.", "جولة في الميزات الجديدة وتأثيرها الملموس على أداء مواقعكم."),
      category: t("Developpement", "Development", "تطوير"),
      date: t("12 mai 2025", "May 12, 2025", "12 مايو 2025"),
      readTime: t("6 min", "6 min", "6 دقائق"),
      coverLabel: "image de couverture",
      authorName: "A. Tanger Code",
      authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"),
      authorBio: t("Developpeur full-stack base a Tanger, je concois des sites et applications sur mesure pour des clients au Maroc et a l'international.", "Full-stack developer based in Tangier, I design custom websites and applications for clients in Morocco and abroad.", "مطور شامل مقره في طنجة، أصمم مواقع وتطبيقات مخصصة لعملاء في المغرب وخارجه."),
      content: t(
        `<p>Next.js 15 est arrive avec son lot de changements. Plutot que de lister chaque entree du changelog, voyons concretement ce qui va changer dans votre quotidien de developpement et pour la performance de vos sites.</p><h2>Server Actions stables</h2><p>Les Server Actions passent en stable. Elles permettent d'ecrire des mutations cote serveur directement depuis vos composants, sans creer d'API REST dediee. Le code devient plus court et plus lisible.</p><pre><code><span class="tok-k">async function</span> <span class="tok-f">createProject</span>(formData) {\n  <span class="tok-k">'use server'</span>;\n  <span class="tok-k">await</span> db.projects.<span class="tok-f">insert</span>({\n    name: formData.<span class="tok-f">get</span>(<span class="tok-s">'name'</span>),\n  });\n}</code></pre><h2>Un cache plus previsible</h2><p>Le comportement de mise en cache, longtemps source de confusion, devient explicite. Vous decidez clairement ce qui est mis en cache et pour combien de temps.</p><blockquote>La meilleure optimisation, c'est celle que l'on comprend et que l'on maitrise.</blockquote><h3>Faut-il migrer maintenant ?</h3><p>Pour un nouveau projet, oui sans hesiter. Pour un projet existant, planifiez la migration : les gains en lisibilite et en performance en valent la peine, mais testez soigneusement le comportement du cache.</p><ul><li>Adoptez les Server Actions progressivement</li><li>Auditez vos appels de donnees mis en cache</li><li>Mesurez vos Core Web Vitals avant / apres</li></ul><p>En resume, Next.js 15 recompense ceux qui veulent un code plus simple et des performances maitrisees.</p>`,
        `<p>Next.js 15 arrived with its share of changes. Rather than listing every changelog entry, let's see what will concretely change in your development workflow and your site performance.</p><h2>Stable Server Actions</h2><p>Server Actions are now stable. They allow writing server-side mutations directly from your components, without creating a dedicated REST API. The code becomes shorter and more readable.</p><pre><code><span class="tok-k">async function</span> <span class="tok-f">createProject</span>(formData) {\n  <span class="tok-k">'use server'</span>;\n  <span class="tok-k">await</span> db.projects.<span class="tok-f">insert</span>({\n    name: formData.<span class="tok-f">get</span>(<span class="tok-s">'name'</span>),\n  });\n}</code></pre><h2>More predictable caching</h2><p>The caching behavior, long a source of confusion, becomes explicit. You clearly decide what gets cached and for how long.</p><blockquote>The best optimization is the one you understand and control.</blockquote><h3>Should you migrate now?</h3><p>For a new project, yes without hesitation. For an existing project, plan the migration: the readability and performance gains are worth it, but carefully test the cache behavior.</p><ul><li>Adopt Server Actions progressively</li><li>Audit your cached data calls</li><li>Measure your Core Web Vitals before/after</li></ul><p>In summary, Next.js 15 rewards those who want simpler code and controlled performance.</p>`,
        `<p>وصل Next.js 15 مع حصته من التغييرات. بدلاً من سرد كل إدخال في سجل التغييرات، دعونا نرى ما الذي سيتغير فعلياً في سير عملكم اليومي وفي أداء مواقعكم.</p><h2>Server Actions المستقرة</h2><p>أصبحت Server Actions مستقرة. تسمح بكتابة عمليات من جانب الخادم مباشرة من مكوناتكم، دون إنشاء API REST مخصصة. يصبح الكود أقصر وأكثر قابلية للقراءة.</p><pre><code><span class="tok-k">async function</span> <span class="tok-f">createProject</span>(formData) {\n  <span class="tok-k">'use server'</span>;\n  <span class="tok-k">await</span> db.projects.<span class="tok-f">insert</span>({\n    name: formData.<span class="tok-f">get</span>(<span class="tok-s">'name'</span>),\n  });\n}</code></pre><h2>تخزين مؤقت أكثر قابلية للتنبؤ</h2><p>سلوك التخزين المؤقت، الذي كان مصدراً للارتباك لفترة طويلة، يصبح صريحاً. تقرر بوضوح ما يتم تخزينه مؤقتاً ولمدة كم.</p><blockquote>أفضل تحسين هو الذي نفهمه ونتحكم فيه.</blockquote><h3>هل يجب الترقية الآن؟</h3><p>لمشروع جديد، نعم دون تردد. لمشروع قائم، خططوا للترقية: مكاسب قابلية القراءة والأداء تستحق العناء، لكن اختبروا سلوك التخزين المؤقت بعناية.</p><ul><li>اعتمدوا Server Actions تدريجياً</li><li>راجعوا استدعاءات البيانات المخزنة مؤقتاً</li><li>قيسوا Core Web Vitals قبل/بعد</li></ul><p>باختصار، Next.js 15 يكافئ الذين يريدون كوداً أبسط وأداءً متحكماً فيه.</p>`
      ),
      tags: ["#Next.js", "#React", "#Performance", "#SEO"],
      relatedSlugs: ["seo-technique-2025", "sur-mesure-vs-template", "docker-devops"],
    },
    {
      slug: "erp-ux",
      title: t("Concevoir un ERP que vos equipes adorent", "Designing an ERP your teams will love", "تصميم ERP تحبه فرقكم"),
      excerpt: t("Les principes UX qui font la difference entre un outil subi et un outil adopte.", "UX principles that make the difference between a tolerated tool and an adopted one.", "مبادئ تجربة المستخدم التي تصنع الفرق بين أداة مفروضة وأداة متبناة."),
      category: t("Design", "Design", "تصميم"),
      date: t("28 avr. 2025", "Apr 28, 2025", "28 أبريل 2025"),
      readTime: t("8 min", "8 min", "8 دقائق"),
      coverLabel: "image de couverture",
      authorName: "A. Tanger Code",
      authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"),
      authorBio: t("Developpeur full-stack base a Tanger.", "Full-stack developer based in Tangier.", "مطور شامل مقره في طنجة."),
      content: t(`<p>Un ERP reussi n'est pas celui qui a le plus de fonctionnalites, mais celui que vos equipes adoptent naturellement.</p><h2>Comprendre avant de construire</h2><p>La premiere etape est d'observer comment vos equipes travaillent vraiment, pas comment les manuels disent qu'elles devraient travailler.</p><h2>Principes cles</h2><p>Trois regles d'or : moins de clics, pas de champs inutiles, et un feedback immediat a chaque action.</p><ul><li>Interface epuree, actions principales visibles</li><li>Raccourcis clavier pour les utilisateurs avances</li><li>Tableaux de bord personnalisables par role</li></ul><p>Un ERP bien concu se traduit par moins de formation, moins d'erreurs et plus d'adoption.</p>`, `<p>A successful ERP is not the one with the most features, but the one your teams naturally adopt.</p><h2>Understand before building</h2><p>The first step is to observe how your teams really work, not how manuals say they should work.</p><h2>Key principles</h2><p>Three golden rules: fewer clicks, no useless fields, and immediate feedback on every action.</p><ul><li>Clean interface, main actions visible</li><li>Keyboard shortcuts for advanced users</li><li>Customizable dashboards by role</li></ul><p>A well-designed ERP means less training, fewer errors and more adoption.</p>`, `<p>نظام ERP الناجح ليس الذي يمتلك أكبر عدد من الميزات، بل الذي تتبناه فرقكم بشكل طبيعي.</p><h2>الفهم قبل البناء</h2><p>الخطوة الأولى هي مراقبة كيفية عمل فرقكم حقاً، وليس كيف تقول الأدلة أنه ينبغي لهم العمل.</p><h2>مبادئ أساسية</h2><p>ثلاث قواعد ذهبية: نقرات أقل، لا حقول غير ضرورية، وتغذية راجعة فورية لكل إجراء.</p><ul><li>واجهة نظيفة، الإجراءات الرئيسية مرئية</li><li>اختصارات لوحة المفاتيح للمستخدمين المتقدمين</li><li>لوحات معلومات قابلة للتخصيص حسب الدور</li></ul><p>نظام ERP مصمم جيداً يعني تدريباً أقل وأخطاء أقل وتبنياً أكبر.</p>`),
      tags: ["#UX", "#ERP", "#Design"],
      relatedSlugs: ["nextjs-15", "design-system", "strategie-digitale"],
    },
    {
      slug: "flutter-vs-native",
      title: t("Flutter ou natif : comment choisir ?", "Flutter or native: how to choose?", "Flutter أم أصلي: كيف تختار؟"),
      excerpt: t("Criteres de decision pour votre prochaine application mobile, sans jargon inutile.", "Decision criteria for your next mobile app, without unnecessary jargon.", "معايير القرار لتطبيقك الجوال القادم، بدون تعقيدات تقنية."),
      category: t("Mobile", "Mobile", "جوال"),
      date: t("15 avr. 2025", "Apr 15, 2025", "15 أبريل 2025"),
      readTime: t("5 min", "5 min", "5 دقائق"),
      coverLabel: "image de couverture",
      authorName: "A. Tanger Code",
      authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"),
      authorBio: t("Developpeur full-stack base a Tanger.", "Full-stack developer based in Tangier.", "مطور شامل مقره في طنجة."),
      content: t(`<p>Le choix entre Flutter et le developpement natif est l'une des decisions les plus importantes pour votre projet mobile.</p><h2>Flutter : un code, deux plateformes</h2><p>Flutter permet de developper simultanement pour iOS et Android avec une seule base de code. Le langage Dart, bien que moins connu, est rapide a prendre en main.</p><h2>Quand choisir le natif ?</h2><p>Si votre application utilise intensivement le hardware (realite augmentee, traitement video lourd), le natif reste preferable. De meme si vous avez des equipes deja specialisees Kotlin/Swift.</p><blockquote>Pour 80% des applications metier, Flutter offre le meilleur rapport qualite-prix-temps.</blockquote><ul><li>Budget : Flutter reduit les couts de ~40%</li><li>Performance : Flutter est proche du natif dans la plupart des cas</li><li>Maintenance : une seule codebase a maintenir</li></ul>`, `<p>The choice between Flutter and native development is one of the most important decisions for your mobile project.</p><h2>Flutter: one code, two platforms</h2><p>Flutter allows simultaneous iOS and Android development with a single codebase. The Dart language, although less known, is quick to learn.</p><h2>When to choose native?</h2><p>If your app intensively uses hardware (augmented reality, heavy video processing), native remains preferable. Same if you have teams already specialized in Kotlin/Swift.</p><blockquote>For 80% of business apps, Flutter offers the best quality-price-time ratio.</blockquote><ul><li>Budget: Flutter reduces costs by ~40%</li><li>Performance: Flutter is close to native in most cases</li><li>Maintenance: only one codebase to maintain</li></ul>`, `<p>الاختيار بين Flutter والتطوير الأصلي هو أحد أهم القرارات لمشروعكم الجوال.</p><h2>Flutter: كود واحد، منصتان</h2><p>يتيح Flutter تطوير iOS وAndroid في وقت واحد بقاعدة كود واحدة. لغة Dart، رغم أنها أقل شهرة، سهلة التعلم.</p><h2>متى نختار الأصلي؟</h2><p>إذا كان تطبيقكم يستخدم العتاد بشكل مكثف (الواقع المعزز، معالجة الفيديو الثقيلة)، يبقى الأصلي مفضلاً. كذلك إذا كان لديكم فرق متخصصة مسبقاً في Kotlin/Swift.</p><blockquote>لـ 80% من تطبيقات الأعمال، يقدم Flutter أفضل نسبة جودة-سعر-وقت.</blockquote><ul><li>الميزانية: Flutter يخفض التكاليف بنسبة ~40%</li><li>الأداء: Flutter قريب من الأصلي في معظم الحالات</li><li>الصيانة: قاعدة كود واحدة للصيانة</li></ul>`),
      tags: ["#Flutter", "#Mobile", "#iOS", "#Android"],
      relatedSlugs: ["nextjs-15", "design-system", "animations-web"],
    },
    {
      slug: "seo-technique-2025",
      title: t("Le SEO technique en 2025", "Technical SEO in 2025", "تحسين محركات البحث التقني في 2025"),
      excerpt: t("Les facteurs techniques qui comptent vraiment pour le referencement.", "The technical factors that really matter for SEO.", "العوامل التقنية التي تهم حقاً في تحسين محركات البحث."),
      category: "SEO", date: t("10 mars 2025", "Mar 10, 2025", "10 مارس 2025"), readTime: t("7 min", "7 min", "7 دقائق"),
      coverLabel: "image de couverture", authorName: "A. Tanger Code", authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"), authorBio: t("Developpeur full-stack base a Tanger.", "Full-stack developer based in Tangier.", "مطور شامل مقره في طنجة."),
      content: t(`<p>Le SEO technique evolue. Core Web Vitals, INP, rendu hybride... voici ce qui compte reellement en 2025.</p><h2>Core Web Vitals : l'INP remplace le FID</h2><p>L'Interaction to Next Paint (INP) est desormais la metrique cle. Elle mesure la reactivite globale de vos pages, pas seulement le premier evenement.</p><h2>Le rendu hybride, nouvel avantage concurrentiel</h2><p>Combiner SSR et CSR permet d'avoir a la fois des temps de chargement rapides et une interactivite immediate. Next.js et Astro excellent dans ce domaine.</p><ul><li>Optimisez vos images au format WebP/AVIF</li><li>Utilisez les Core Web Vitals comme KPIs</li><li>Mettez en place un monitoring continu (Lighthouse CI)</li></ul>`, `<p>Technical SEO is evolving. Core Web Vitals, INP, hybrid rendering... here's what really matters in 2025.</p><h2>Core Web Vitals: INP replaces FID</h2><p>Interaction to Next Paint (INP) is now the key metric. It measures the overall responsiveness of your pages, not just the first event.</p><h2>Hybrid rendering, new competitive advantage</h2><p>Combining SSR and CSR provides both fast load times and immediate interactivity. Next.js and Astro excel in this area.</p><ul><li>Optimize your images in WebP/AVIF format</li><li>Use Core Web Vitals as KPIs</li><li>Implement continuous monitoring (Lighthouse CI)</li></ul>`, `<p>تحسين محركات البحث التقني يتطور. Core Web Vitals وINP والعرض الهجين... إليكم ما يهم حقاً في 2025.</p><h2>Core Web Vitals: INP يحل محل FID</h2><p>أصبح Interaction to Next Paint (INP) المقياس الرئيسي الآن. يقيس استجابة صفحاتكم الإجمالية، وليس الحدث الأول فقط.</p><h2>العرض الهجين، ميزة تنافسية جديدة</h2><p>الجمع بين SSR وCSR يوفر أوقات تحميل سريعة وتفاعلية فورية. Next.js وAstro يتفوقان في هذا المجال.</p><ul><li>حسنوا صوركم بصيغة WebP/AVIF</li><li>استخدموا Core Web Vitals كمؤشرات أداء</li><li>طبقوا مراقبة مستمرة (Lighthouse CI)</li></ul>`),
      tags: ["#SEO", "#Performance", "#CoreWebVitals"], relatedSlugs: ["nextjs-15", "sur-mesure-vs-template", "docker-devops"],
    },
    {
      slug: "sur-mesure-vs-template", category: t("Strategie", "Strategy", "استراتيجية"),
      title: t("Pourquoi le sur-mesure bat le template", "Why custom beats templates", "لماذا يتفوق المخصص على القوالب"),
      excerpt: t("Les avantages concrets d'un developpement sur mesure pour votre entreprise.", "The concrete advantages of custom development for your business.", "المزايا الملموسة للتطوير المخصص لشركتكم."),
      date: t("22 fev. 2025", "Feb 22, 2025", "22 فبراير 2025"), readTime: t("5 min", "5 min", "5 دقائق"),
      coverLabel: "image de couverture", authorName: "A. Tanger Code", authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"), authorBio: t("Developpeur full-stack base a Tanger.", "Full-stack developer based in Tangier.", "مطور شامل مقره في طنجة."),
      content: t(`<p>Le template peut sembler economique au depart, mais les couts caches s'accumulent rapidement.</p><h2>Performance et SEO</h2><p>Les templates embarquent du code inutile qui ralentit votre site et penalise votre referencement.</p><h2>Identite unique</h2><p>Votre site doit refleter votre marque, pas ressembler a 10 000 autres sites.</p><blockquote>Un site sur mesure est un investissement, pas une depense.</blockquote><ul><li>Code optimise, pas de bloat</li><li>Design unique et coherent</li><li>Evolutif selon vos besoins reels</li></ul>`, `<p>Templates may seem economical upfront, but hidden costs add up quickly.</p><h2>Performance and SEO</h2><p>Templates bundle unnecessary code that slows down your site and hurts your SEO.</p><h2>Unique identity</h2><p>Your site should reflect your brand, not look like 10,000 other sites.</p><blockquote>A custom site is an investment, not an expense.</blockquote><ul><li>Optimized code, no bloat</li><li>Unique and consistent design</li><li>Scalable according to your real needs</li></ul>`, `<p>قد يبدو القالب اقتصادياً في البداية، لكن التكاليف الخفية تتراكم بسرعة.</p><h2>الأداء وتحسين محركات البحث</h2><p>القوالب تحمل كوداً غير ضروري يبطئ موقعكم ويضر بتحسين محركات البحث.</p><h2>هوية فريدة</h2><p>يجب أن يعكس موقعكم علامتكم التجارية، لا أن يشبه 10,000 موقع آخر.</p><blockquote>الموقع المخصص استثمار، وليس نفقة.</blockquote><ul><li>كود محسن، لا تضخم</li><li>تصميم فريد ومتسق</li><li>قابل للتطوير حسب احتياجاتكم الحقيقية</li></ul>`),
      tags: ["#Strategie", "#Developpement"], relatedSlugs: ["nextjs-15", "seo-technique-2025", "design-system"],
    },
    {
      slug: "animations-web", category: t("Design", "Design", "تصميم"),
      title: t("Animations web : moins, mais mieux", "Web animations: less, but better", "حركات الويب: أقل، لكن أفضل"),
      excerpt: t("Comment utiliser les animations pour sublimer l'experience sans penaliser la performance.", "How to use animations to enhance the experience without hurting performance.", "كيفية استخدام الحركات لتحسين التجربة دون الإضرار بالأداء."),
      date: t("08 fev. 2025", "Feb 8, 2025", "08 فبراير 2025"), readTime: t("4 min", "4 min", "4 دقائق"),
      coverLabel: "image de couverture", authorName: "A. Tanger Code", authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"), authorBio: t("Developpeur full-stack base a Tanger.", "Full-stack developer based in Tangier.", "مطور شامل مقره في طنجة."),
      content: t(`<p>Une animation reussie est invisible. Elle guide l'attention sans jamais la distraire.</p><h2>Les regles d'or</h2><p>Duree inferieure a 300ms, easing naturel, et une seule animation a la fois.</p><h2>Framer Motion et GSAP</h2><p>Framer Motion est ideal pour React. GSAP offre un controle plus fin pour les animations complexes.</p><ul><li>Privilegiez les transformations CSS (GPU)</li><li>Utilisez will-change avec parcimonie</li><li>Testez toujours sur mobile</li></ul>`, `<p>A successful animation is invisible. It guides attention without ever distracting.</p><h2>Golden rules</h2><p>Duration under 300ms, natural easing, and one animation at a time.</p><h2>Framer Motion and GSAP</h2><p>Framer Motion is ideal for React. GSAP offers finer control for complex animations.</p><ul><li>Prefer CSS transforms (GPU)</li><li>Use will-change sparingly</li><li>Always test on mobile</li></ul>`, `<p>الحركة الناجحة غير مرئية. توجه الانتباه دون أن تشتته أبداً.</p><h2>القواعد الذهبية</h2><p>مدة أقل من 300 مللي ثانية، تسهيل طبيعي، وحركة واحدة في كل مرة.</p><h2>Framer Motion وGSAP</h2><p>Framer Motion مثالي لـ React. GSAP يوفر تحكماً أدق للحركات المعقدة.</p><ul><li>فضلوا تحويلات CSS (GPU)</li><li>استخدموا will-change باعتدال</li><li>اختبروا دائماً على الجوال</li></ul>`),
      tags: ["#Animation", "#UX", "#FramerMotion"], relatedSlugs: ["flutter-vs-native", "design-system", "nextjs-15"],
    },
    {
      slug: "docker-devops", category: t("DevOps", "DevOps", "DevOps"),
      title: t("Docker pour les developpeurs web", "Docker for web developers", "Docker لمطوري الويب"),
      excerpt: t("Simplifiez votre environnement de developpement avec Docker et Docker Compose.", "Simplify your development environment with Docker and Docker Compose.", "بسط بيئة التطوير الخاصة بك مع Docker وDocker Compose."),
      date: t("15 jan. 2025", "Jan 15, 2025", "15 يناير 2025"), readTime: t("6 min", "6 min", "6 دقائق"),
      coverLabel: "image de couverture", authorName: "A. Tanger Code", authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"), authorBio: t("Developpeur full-stack base a Tanger.", "Full-stack developer based in Tangier.", "مطور شامل مقره في طنجة."),
      content: t(`<p>Docker n'est pas reserve aux ops. Chaque developpeur web gagne a le maitriser.</p><h2>Un environnement identique partout</h2><p>Fini le "ca marche sur ma machine". Avec Docker, toute l'equipe a exactement le meme environnement.</p><h2>Docker Compose pour les projets multi-services</h2><p>Frontend, backend, base de donnees, Redis : un seul fichier YAML pour tout orchestrer.</p><ul><li>Isolation des dependances par projet</li><li>Integration continue simplifiee</li><li>Deploiement identique en dev et prod</li></ul>`, `<p>Docker is not just for ops. Every web developer benefits from mastering it.</p><h2>Identical environment everywhere</h2><p>No more "it works on my machine". With Docker, the whole team has the exact same environment.</p><h2>Docker Compose for multi-service projects</h2><p>Frontend, backend, database, Redis: a single YAML file to orchestrate everything.</p><ul><li>Dependency isolation per project</li><li>Simplified continuous integration</li><li>Identical deployment in dev and prod</li></ul>`, `<p>Docker ليس مخصصاً لمسؤولي الأنظمة فقط. كل مطور ويب يستفيد من إتقانه.</p><h2>بيئة متطابقة في كل مكان</h2><p>لا مزيد من "إنه يعمل على جهازي". مع Docker، الفريق بأكمله لديه نفس البيئة بالضبط.</p><h2>Docker Compose للمشاريع متعددة الخدمات</h2><p>الواجهة والخلفية وقاعدة البيانات وRedis: ملف YAML واحد لتنسيق كل شيء.</p><ul><li>عزل التبعيات لكل مشروع</li><li>تكامل مستمر مبسط</li><li>نشر متطابق في التطوير والإنتاج</li></ul>`),
      tags: ["#Docker", "#DevOps", "#CI/CD"], relatedSlugs: ["nextjs-15", "seo-technique-2025", "strategie-digitale"],
    },
    {
      slug: "design-system", category: t("Design", "Design", "تصميم"),
      title: t("Creer un design system efficace", "Building an effective design system", "بناء نظام تصميم فعال"),
      excerpt: t("Les etapes pour construire un design system qui accelere votre developpement.", "The steps to build a design system that accelerates your development.", "خطوات بناء نظام تصميم يسرع تطويركم."),
      date: t("05 jan. 2025", "Jan 5, 2025", "05 يناير 2025"), readTime: t("5 min", "5 min", "5 دقائق"),
      coverLabel: "image de couverture", authorName: "A. Tanger Code", authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"), authorBio: t("Developpeur full-stack base a Tanger.", "Full-stack developer based in Tangier.", "مطور شامل مقره في طنجة."),
      content: t(`<p>Un design system bien construit divise par deux le temps de developpement des nouvelles pages.</p><h2>Commencer par les tokens</h2><p>Couleurs, typographie, espacements : definissez vos variables CSS en premier. C'est le socle de tout le systeme.</p><h2>Composants atomiques</h2><p>Construisez des composants independants et reutilisables : boutons, champs, cartes, modales.</p><ul><li>Documentez chaque composant (Storybook)</li><li>Testez l'accessibilite des le debut</li><li>Versionnez votre design system comme du code</li></ul>`, `<p>A well-built design system halves the development time for new pages.</p><h2>Start with tokens</h2><p>Colors, typography, spacing: define your CSS variables first. This is the foundation of the entire system.</p><h2>Atomic components</h2><p>Build independent, reusable components: buttons, inputs, cards, modals.</p><ul><li>Document each component (Storybook)</li><li>Test accessibility from the start</li><li>Version your design system like code</li></ul>`, `<p>نظام تصميم جيد البناء يخفض وقت تطوير الصفحات الجديدة إلى النصف.</p><h2>ابدأوا بالمتغيرات الأساسية</h2><p>الألوان والطباعة والمسافات: حددوا متغيرات CSS أولاً. هذا أساس النظام بأكمله.</p><h2>مكونات ذرية</h2><p>ابنوا مكونات مستقلة وقابلة لإعادة الاستخدام: أزرار، حقول، بطاقات، نوافذ.</p><ul><li>وثقوا كل مكون (Storybook)</li><li>اختبروا إمكانية الوصول من البداية</li><li>تحكموا في إصدارات نظام التصميم كالكود</li></ul>`),
      tags: ["#DesignSystem", "#UX", "#Frontend"], relatedSlugs: ["animations-web", "erp-ux", "flutter-vs-native"],
    },
    {
      slug: "strategie-digitale", category: t("Strategie", "Strategy", "استراتيجية"),
      title: t("Strategie digitale pour PME marocaines", "Digital strategy for Moroccan SMEs", "الاستراتيجية الرقمية للمقاولات المغربية"),
      excerpt: t("Comment les PME marocaines peuvent tirer parti du numerique pour se developper.", "How Moroccan SMEs can leverage digital to grow.", "كيف يمكن للمقاولات المغربية الاستفادة من الرقمنة للنمو."),
      date: t("20 dec. 2024", "Dec 20, 2024", "20 ديسمبر 2024"), readTime: t("6 min", "6 min", "6 دقائق"),
      coverLabel: "image de couverture", authorName: "A. Tanger Code", authorRole: t("Developpeur full-stack", "Full-stack developer", "مطور شامل"), authorBio: t("Developpeur full-stack base a Tanger.", "Full-stack developer based in Tangier.", "مطور شامل مقره في طنجة."),
      content: t(`<p>La transformation digitale n'est pas reservee aux grands groupes. Les PME marocaines ont tout a y gagner.</p><h2>Commencez par le site web</h2><p>Un site professionnel est votre vitrine 24h/24. C'est le premier investissement a faire.</p><h2>Les reseaux sociaux comme levier</h2><p>Instagram et LinkedIn sont particulierement efficaces au Maroc pour toucher votre audience.</p><ul><li>Site web optimise SEO</li><li>Presence sur les reseaux sociaux pertinents</li><li>Automatisation des processus internes</li></ul>`, `<p>Digital transformation is not reserved for large groups. Moroccan SMEs have everything to gain.</p><h2>Start with the website</h2><p>A professional website is your 24/7 showcase. It's the first investment to make.</p><h2>Social media as a lever</h2><p>Instagram and LinkedIn are particularly effective in Morocco to reach your audience.</p><ul><li>SEO-optimized website</li><li>Presence on relevant social networks</li><li>Automation of internal processes</li></ul>`, `<p>التحول الرقمي ليس حكراً على المجموعات الكبرى. المقاولات المغربية لديها كل شيء لتكسبه.</p><h2>ابدأوا بالموقع الإلكتروني</h2><p>موقع احترافي هو واجهتكم على مدار الساعة. إنه أول استثمار يجب القيام به.</p><h2>وسائل التواصل الاجتماعي كرافعة</h2><p>Instagram وLinkedIn فعالان بشكل خاص في المغرب للوصول إلى جمهوركم.</p><ul><li>موقع محسن لمحركات البحث</li><li>حضور على الشبكات الاجتماعية المناسبة</li><li>أتمتة العمليات الداخلية</li></ul>`),
      tags: ["#Strategie", "#Maroc", "#TransformationDigitale"], relatedSlugs: ["sur-mesure-vs-template", "erp-ux", "docker-devops"],
    },
  ];
}

export const fallbackBlogData: Record<string, BlogPageData> = {
  en: buildBlogPageData("en"),
  fr: buildBlogPageData("fr"),
  ar: buildBlogPageData("ar"),
};

function buildBlogPageData(locale: string): BlogPageData {
  const details = makePosts(locale);
  const l10n: Record<string, { eyebrow: string; title: string; subtitle: string; lastCrumb: string; searchPh: string; filters: { key: string; label: string }[]; featuredBadge: string; readLabel: string; viewAll: string; relatedEye: string; relatedTitle: string; authorContact: string }> = {
    en: { eyebrow: "BLOG", title: "The TANGER CODE blog", subtitle: "Tips, experience and technical watch on web and mobile development.", lastCrumb: "Blog", searchPh: "Search an article...", featuredBadge: "Featured", readLabel: "Read article", viewAll: "View all", relatedEye: "READ ALSO", relatedTitle: "Related articles", authorContact: "Contact me", filters: [{ key: "all", label: "All" }, { key: "Development", label: "Development" }, { key: "Design", label: "Design" }, { key: "Mobile", label: "Mobile" }, { key: "SEO", label: "SEO" }, { key: "DevOps", label: "DevOps" }, { key: "Strategy", label: "Strategy" }] },
    fr: { eyebrow: "BLOG", title: "Le blog TANGER CODE", subtitle: "Conseils, retours d experience et veille technique sur le developpement web et mobile.", lastCrumb: "Blog", searchPh: "Rechercher un article...", featuredBadge: "A la une", readLabel: "Lire l article", viewAll: "Voir tous", relatedEye: "A LIRE AUSSI", relatedTitle: "Articles lies", authorContact: "Me contacter", filters: [{ key: "all", label: "Tous" }, { key: "Developpement", label: "Developpement" }, { key: "Design", label: "Design" }, { key: "Mobile", label: "Mobile" }, { key: "SEO", label: "SEO" }, { key: "DevOps", label: "DevOps" }, { key: "Strategie", label: "Strategie" }] },
    ar: { eyebrow: "المدونة", title: "مدونة TANGER CODE", subtitle: "نصائح وتجارب ومراقبة تقنية حول تطوير الويب والجوال.", lastCrumb: "المدونة", searchPh: "ابحث عن مقال...", featuredBadge: "مقال مميز", readLabel: "اقرأ المقال", viewAll: "عرض الكل", relatedEye: "اقرأ أيضا", relatedTitle: "مقالات ذات صلة", authorContact: "اتصل بي", filters: [{ key: "all", label: "الكل" }, { key: "تطوير", label: "تطوير" }, { key: "تصميم", label: "تصميم" }, { key: "جوال", label: "جوال" }, { key: "SEO", label: "SEO" }, { key: "DevOps", label: "DevOps" }, { key: "استراتيجية", label: "استراتيجية" }] },
  };
  const t = l10n[locale] || l10n.fr;
  return {
    eyebrow: t.eyebrow,
    title: t.title,
    subtitle: t.subtitle,
    lastBreadcrumb: t.lastCrumb,
    searchPlaceholder: t.searchPh,
    filters: t.filters,
    featuredBadge: t.featuredBadge,
    readLabel: t.readLabel,
    viewAll: t.viewAll,
    relatedEye: t.relatedEye,
    relatedTitle: t.relatedTitle,
    authorContact: t.authorContact,
    posts: details.map(d => ({ slug: d.slug, title: d.title, excerpt: d.excerpt, category: d.category, date: d.date, readTime: d.readTime, authorName: d.authorName, featured: d.featured })),
    details,
  };
}
