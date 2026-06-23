"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp } from "@/lib/animations";
import { fallbackServicesData } from "@/lib/services-data";
import { ServiceAccordion } from "@/components/services/ServiceAccordion";
import type { PricingTierData } from "@/lib/home-data";

const TIERS = ["web", "platform", "erp", "mobile"] as const;
const CURRENCIES: Record<string, { label: string; rate: number }> = {
  MAD: { label: "MAD", rate: 1 },
  EUR: { label: "EUR", rate: 0.092 },
  USD: { label: "USD", rate: 0.1 },
};

const L10N: Record<
  string,
  {
    eyebrow: string;
    title: string;
    tabLabels: Record<string, string>;
    comparisonTitle: string;
    comparisonEye: string;
    features: string[];
    rows: { label: string; starter: string; pro: string; premium: string }[];
    faqTitle: string;
    faqEye: string;
    faq: { q: string; a: string }[];
    popularBadge: string;
    customQuote: string;
    fromText: string;
  }
> = {
  fr: {
    eyebrow: "PRICING",
    title: "Des tarifs clairs pour des projets reussis",
    tabLabels: { web: "Sites web", platform: "Plateformes", erp: "ERP", mobile: "Mobile" },
    comparisonTitle: "Toutes les fonctionnalites",
    comparisonEye: "COMPARATIF",
    features: ["Pages / ecrans", "Design sur mesure", "CMS / Blog", "SEO avance", "E-commerce", "Integrations API", "Multilingue (FR/EN/AR)", "Delai moyen", "Support inclus"],
    rows: [
      { label: "Pages / ecrans", starter: "5", pro: "Illimite", premium: "Illimite" },
      { label: "Design sur mesure", starter: "\u2014", pro: "\u2713", premium: "\u2713" },
      { label: "CMS / Blog", starter: "\u2014", pro: "\u2713", premium: "\u2713" },
      { label: "SEO avance", starter: "Basique", pro: "\u2713", premium: "\u2713" },
      { label: "E-commerce", starter: "Option", pro: "\u2713", premium: "\u2713" },
      { label: "Integrations API", starter: "\u2014", pro: "2", premium: "Illimite" },
      { label: "Multilingue (FR/EN/AR)", starter: "\u2014", pro: "Option", premium: "\u2713" },
      { label: "Delai moyen", starter: "2 sem.", pro: "4 sem.", premium: "Sur mesure" },
      { label: "Support inclus", starter: "1 mois", pro: "3 mois", premium: "1 an" },
    ],
    faqTitle: "Questions sur les tarifs",
    faqEye: "FAQ",
    popularBadge: "\u2605 Plus populaire",
    customQuote: "Sur devis",
    fromText: "A partir de",
    faq: [
      { q: "Les prix sont-ils definitifs ?", a: "Ce sont des points de depart. Chaque projet etant unique, nous etablissons un devis precis apres un premier echange gratuit." },
      { q: "Quels moyens de paiement acceptez-vous ?", a: "Virement bancaire, et paiement echelonne possible (acompte de 40 %, puis jalons). Devises MAD, EUR ou USD." },
      { q: "Que se passe-t-il apres la livraison ?", a: "Vous beneficiez de la periode de support incluse, puis d'un forfait de maintenance optionnel pour les evolutions." },
      { q: "Proposez-vous des reductions ?", a: "Oui pour les associations, les startups en amorcage et les projets multiples. Parlons-en." },
      { q: "Suis-je proprietaire du code ?", a: "Absolument. A la livraison et au solde, l'integralite du code et des acces vous appartient." },
    ],
  },
  en: {
    eyebrow: "PRICING",
    title: "Clear pricing for successful projects",
    tabLabels: { web: "Websites", platform: "Platforms", erp: "ERP", mobile: "Mobile" },
    comparisonTitle: "All features",
    comparisonEye: "COMPARISON",
    features: ["Pages / Screens", "Custom design", "CMS / Blog", "Advanced SEO", "E-commerce", "API Integrations", "Multilingual (FR/EN/AR)", "Average timeline", "Support included"],
    rows: [
      { label: "Pages / Screens", starter: "5", pro: "Unlimited", premium: "Unlimited" },
      { label: "Custom design", starter: "\u2014", pro: "\u2713", premium: "\u2713" },
      { label: "CMS / Blog", starter: "\u2014", pro: "\u2713", premium: "\u2713" },
      { label: "Advanced SEO", starter: "Basic", pro: "\u2713", premium: "\u2713" },
      { label: "E-commerce", starter: "Option", pro: "\u2713", premium: "\u2713" },
      { label: "API Integrations", starter: "\u2014", pro: "2", premium: "Unlimited" },
      { label: "Multilingual (FR/EN/AR)", starter: "\u2014", pro: "Option", premium: "\u2713" },
      { label: "Average timeline", starter: "2 wks", pro: "4 wks", premium: "Custom" },
      { label: "Support included", starter: "1 month", pro: "3 months", premium: "1 year" },
    ],
    faqTitle: "Questions about pricing",
    faqEye: "FAQ",
    popularBadge: "\u2605 Most popular",
    customQuote: "Custom quote",
    fromText: "Starting at",
    faq: [
      { q: "Are the prices final?", a: "These are starting points. Each project is unique, we provide a precise quote after a free initial consultation." },
      { q: "What payment methods do you accept?", a: "Bank transfer, and installment payment possible (40% deposit, then milestones). Currencies: MAD, EUR or USD." },
      { q: "What happens after delivery?", a: "You benefit from the included support period, then an optional maintenance package for updates." },
      { q: "Do you offer discounts?", a: "Yes for non-profits, early-stage startups and multiple projects. Let's discuss." },
      { q: "Do I own the code?", a: "Absolutely. Upon delivery and final payment, the entire codebase and access belongs to you." },
    ],
  },
  ar: {
    eyebrow: "الأسعار",
    title: "أسعار شفافة لمشاريع ناجحة",
    tabLabels: { web: "مواقع", platform: "منصات", erp: "ERP", mobile: "جوال" },
    comparisonTitle: "جميع الميزات",
    comparisonEye: "مقارنة",
    features: ["الصفحات", "تصميم مخصص", "نظام إدارة", "SEO", "متجر", "تكاملات", "متعدد اللغات", "المدة", "الدعم"],
    rows: [
      { label: "الصفحات / الشاشات", starter: "5", pro: "غير محدود", premium: "غير محدود" },
      { label: "تصميم مخصص", starter: "\u2014", pro: "\u2713", premium: "\u2713" },
      { label: "نظام إدارة / مدونة", starter: "\u2014", pro: "\u2713", premium: "\u2713" },
      { label: "SEO متقدم", starter: "أساسي", pro: "\u2713", premium: "\u2713" },
      { label: "متجر إلكتروني", starter: "اختياري", pro: "\u2713", premium: "\u2713" },
      { label: "تكاملات API", starter: "\u2014", pro: "2", premium: "غير محدود" },
      { label: "متعدد اللغات", starter: "\u2014", pro: "اختياري", premium: "\u2713" },
      { label: "المدة المتوسطة", starter: "أسبوعان", pro: "4 أسابيع", premium: "حسب الطلب" },
      { label: "الدعم المشمول", starter: "شهر", pro: "3 أشهر", premium: "سنة" },
    ],
    faqTitle: "أسئلة عن الأسعار",
    faqEye: "الأسئلة",
    popularBadge: "\u2605 الأكثر شيوعاً",
    customQuote: "عرض سعر",
    fromText: "ابتداء من",
    faq: [
      { q: "هل الأسعار نهائية؟", a: "هذه نقاط انطلاق. كل مشروع فريد، ونقدم عرض سعر دقيق بعد استشارة أولية مجانية." },
      { q: "ما وسائل الدفع المقبولة؟", a: "تحويل بنكي، مع إمكانية الدفع بالتقسيط (40% دفعة أولى، ثم مراحل). العملات: MAD أو EUR أو USD." },
      { q: "ماذا يحدث بعد التسليم؟", a: "تستفيد من فترة الدعم المشمولة، ثم باقة صيانة اختيارية للتحديثات." },
      { q: "هل تقدمون خصومات؟", a: "نعم للجمعيات والشركات الناشئة والمشاريع المتعددة. لنتحدث عن ذلك." },
      { q: "هل أملك الكود؟", a: "بالتأكيد. عند التسليم والدفع النهائي، كامل الكود والوصول ملك لك." },
    ],
  },
};

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12l4 4 10-10" />
  </svg>
);

function formatPrice(priceStr: string, rate: number): string {
  if (!priceStr) return "";
  const num = parseInt(priceStr.replace(/\D/g, ""), 10);
  if (isNaN(num)) return priceStr;
  const converted = Math.round(num * rate);
  if (converted >= 1000) {
    const parts = converted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts + " " + (rate === 1 ? "MAD" : rate === CURRENCIES.EUR.rate ? "EUR" : "USD");
  }
  return converted + " " + (rate === 1 ? "MAD" : rate === CURRENCIES.EUR.rate ? "EUR" : "USD");
}

export function PricingContent({ locale }: { locale: string }) {
  const [activeTier, setActiveTier] = useState<(typeof TIERS)[number]>("web");
  const [currency, setCurrency] = useState("MAD");
  const t = L10N[locale] || L10N.fr;
  const data = fallbackServicesData[locale] || fallbackServicesData.fr;
  const rate = CURRENCIES[currency]?.rate || 1;

  const tiers = useMemo(() => {
    const svc = data.details.find((d) => d.icon === activeTier);
    return svc?.pricingTiers || [];
  }, [activeTier, data.details]);

  return (
    <>
      <section className="page-hero center">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            Tarifs
          </nav>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="h1" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p>Pas de mauvaise surprise : des formules de depart transparentes, personnalisables selon vos besoins reels.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="pills" style={{ justifyContent: "center", marginBottom: 24 }}>
            {Object.entries(CURRENCIES).map(([key, cur]) => (
              <button
                key={key}
                className={`pill${currency === key ? " active" : ""}`}
                onClick={() => setCurrency(key)}
              >
                {cur.label}
              </button>
            ))}
          </div>

          <div className="pills" style={{ justifyContent: "center", marginBottom: 40 }}>
            {TIERS.map((tier) => (
              <button
                key={tier}
                className={`pill${activeTier === tier ? " active" : ""}`}
                onClick={() => setActiveTier(tier)}
              >
                {t.tabLabels[tier]}
              </button>
            ))}
          </div>

          <motion.div className="price-grid" key={activeTier + currency} variants={fadeInUp} initial="hidden" animate="visible">
            {tiers.map((tier: PricingTierData, i: number) => (
              <article
                key={i}
                className={`card price-card${tier.featured ? " featured" : " card-grad"}`}
              >
                {tier.featured && (
                  <span className="badge badge-coral price-pop">{t.popularBadge}</span>
                )}
                <h4>{tier.name}</h4>
                {tier.price ? (
                  <>
                    <div className="price-from">{t.fromText}</div>
                    <div className={`price-amt${tier.featured ? " grad-text" : ""}`}>
                      {formatPrice(tier.price, rate)}
                    </div>
                  </>
                ) : (
                  <div className="price-amt">{t.customQuote}</div>
                )}
                <p className="desc">{tier.description}</p>
                <ul className="price-feats">
                  {tier.features.map((f: string, j: number) => (
                    <li key={j}>
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`btn ${tier.featured ? "btn-primary" : "btn-ghost"} btn-block`}
                >
                  {tier.cta}
                </Link>
                <div className="price-meta">
                  {tier.meta.split(" · ").map((m: string, j: number) => (
                    <span key={j}>{m}</span>
                  ))}
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">{t.comparisonEye}</p>
            <h2>{t.comparisonTitle}</h2>
          </motion.div>
          <motion.div className="table-wrap" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Fonctionnalite</th>
                  <th>Starter</th>
                  <th>Pro</th>
                  <th>Premium</th>
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.label}</td>
                    <td>{row.starter === "\u2713" ? <span className="ck">{row.starter}</span> : row.starter === "\u2014" ? <span className="x">{row.starter}</span> : row.starter}</td>
                    <td>{row.pro === "\u2713" ? <span className="ck">{row.pro}</span> : row.pro === "\u2014" ? <span className="x">{row.pro}</span> : row.pro}</td>
                    <td>{row.premium === "\u2713" ? <span className="ck">{row.premium}</span> : row.premium === "\u2014" ? <span className="x">{row.premium}</span> : row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="section-head center">
            <p className="eyebrow">{t.faqEye}</p>
            <h2>{t.faqTitle}</h2>
          </div>
          <ServiceAccordion items={t.faq} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="final-cta" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="final-grid">
              <div>
                <h2>Pret a demarrer votre projet ?</h2>
                <p className="lead">Parlons de votre idee. Reponse sous 24h, devis gratuit et sans engagement.</p>
                <div className="hero-cta" style={{ justifyContent: "flex-start" }}>
                  <Link href="/contact" className="btn btn-coral btn-lg">
                    Demarrer un projet
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <a
                    href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+212600000000").replace(/\D/g, "")}`}
                    className="btn btn-ghost btn-lg"
                    style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <form className="final-form" onSubmit={(e) => e.preventDefault()}>
                <h3>Contact rapide</h3>
                <div className="field">
                  <label htmlFor="n">Nom</label>
                  <input className="input" id="n" type="text" placeholder="Votre nom" required />
                </div>
                <div className="field">
                  <label htmlFor="e">Email</label>
                  <input className="input" id="e" type="email" placeholder="vous@email.com" required />
                </div>
                <div className="field">
                  <label htmlFor="tel">Telephone</label>
                  <input className="input" id="tel" type="tel" placeholder="+212 6 00 00 00 00" />
                </div>
                <div className="field">
                  <label htmlFor="m">Message</label>
                  <textarea className="textarea" id="m" placeholder="Decrivez votre projet…" required />
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">
                  Envoyer
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
