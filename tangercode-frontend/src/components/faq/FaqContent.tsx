"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp } from "@/lib/animations";
import { ServiceAccordion } from "@/components/services/ServiceAccordion";

const L10N: Record<string, { eyebrow: string; title: string; subtitle: string; searchPh: string; lastCrumb: string; categories: { id: string; title: string; items: { q: string; a: string }[] }[]; ctaTitle: string; ctaLead: string; ctaBtn: string }> = {
  fr: { eyebrow: "AIDE", title: "Questions frequentes", subtitle: "Tout ce que vous devez savoir avant de demarrer un projet avec TANGER CODE.", searchPh: "Rechercher une question...", lastCrumb: "FAQ",
    categories: [
      { id: "cat-0", title: "General", items: [{ q: "Ou etes-vous base et travaillez-vous a distance ?", a: "Je suis base a Tanger, au Maroc, et je travaille avec des clients partout dans le monde, a distance. Les echanges se font en francais, anglais ou arabe." }, { q: "Quels types de projets realisez-vous ?", a: "Sites vitrines et e-commerce, plateformes web (SaaS), ERP sur mesure et applications mobiles iOS / Android." }, { q: "Travaillez-vous avec des particuliers et des entreprises ?", a: "Les deux : entrepreneurs, PME, startups, et entreprises internationales." }] },
      { id: "cat-1", title: "Projet & delais", items: [{ q: "Combien de temps prend un projet ?", a: "De 2 semaines pour un site vitrine a plusieurs mois pour une plateforme ou un ERP complet. Un planning precis est fourni des le cadrage." }, { q: "Comment se deroule la collaboration ?", a: "Echange initial gratuit, cadrage, maquettes, developpement iteratif avec points reguliers, tests, deploiement." }, { q: "Puis-je voir l'avancement en temps reel ?", a: "Oui, vous avez acces a un environnement de staging mis a jour regulierement." }] },
      { id: "cat-2", title: "Tarifs & paiement", items: [{ q: "Comment sont calcules les prix ?", a: "Les prix dependent de la complexite, du nombre de pages/fonctionnalites et du planning. Un devis detaille est fourni apres le premier echange." }, { q: "Quels moyens de paiement acceptez-vous ?", a: "Virement bancaire, paiement echelonne (40% a la commande, 30% a mi-parcours, 30% a la livraison)." }, { q: "Y a-t-il des frais caches ?", a: "Non. Tout est detaille dans le devis initial. Les evolutions hors scope sont facturees separement apres validation." }] },
      { id: "cat-3", title: "Apres livraison", items: [{ q: "Que se passe-t-il apres la mise en ligne ?", a: "Vous beneficiez d'une periode de support incluse, puis d'un forfait maintenance optionnel." }, { q: "Suis-je proprietaire du code ?", a: "Absolument. A la livraison et au solde, l'integralite du code et des acces vous appartient." }, { q: "Proposez-vous des formations ?", a: "Oui, des sessions de formation sont incluses pour vous permettre de gerer votre site en autonomie." }] },
    ], ctaTitle: "Vous n'avez pas trouve votre reponse ?", ctaLead: "Ecrivez-nous, on vous repond sous 24h.", ctaBtn: "Nous contacter" },
  en: { eyebrow: "HELP", title: "Frequently asked questions", subtitle: "Everything you need to know before starting a project with TANGER CODE.", searchPh: "Search a question...", lastCrumb: "FAQ",
    categories: [
      { id: "cat-0", title: "General", items: [{ q: "Where are you based?", a: "I am based in Tangier, Morocco, and work with clients worldwide, remotely. Communication in French, English or Arabic." }, { q: "What types of projects do you do?", a: "Showcase sites and e-commerce, web platforms (SaaS), custom ERP and iOS/Android mobile apps." }, { q: "Do you work with individuals and companies?", a: "Both: entrepreneurs, SMEs, startups, and international companies." }] },
      { id: "cat-1", title: "Project & timeline", items: [{ q: "How long does a project take?", a: "From 2 weeks for a showcase site to several months for a platform or full ERP. A precise schedule is provided from kickoff." }, { q: "How does the collaboration work?", a: "Free initial call, scoping, mockups, iterative development with regular check-ins, testing, deployment." }] },
      { id: "cat-2", title: "Pricing & payment", items: [{ q: "How are prices calculated?", a: "Prices depend on complexity, number of pages/features and timeline. A detailed quote is provided after the first call." }] },
      { id: "cat-3", title: "After delivery", items: [{ q: "Do I own the code?", a: "Absolutely. At delivery and final payment, all code and access belongs to you." }] },
    ], ctaTitle: "Didn't find your answer?", ctaLead: "Write us, we reply within 24h.", ctaBtn: "Contact us" },
  ar: { eyebrow: "مساعدة", title: "الأسئلة الشائعة", subtitle: "كل ما تحتاج معرفته.", searchPh: "ابحث عن سؤال...", lastCrumb: "FAQ",
    categories: [
      { id: "cat-0", title: "عام", items: [{ q: "أين مقركم؟", a: "طنجة، المغرب." }] },
    ], ctaTitle: "لم تجد إجابتك؟", ctaLead: "اكتب لنا.", ctaBtn: "اتصل بنا" },
};

export function FaqContent({ locale }: { locale: string }) {
  const t = L10N[locale] || L10N.fr;
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeCat, setActiveCat] = useState("cat-0");

  useEffect(() => { const tm = setTimeout(() => setDebounced(search), 300); return () => clearTimeout(tm); }, [search]);

  const filtered = useMemo(() => {
    if (!debounced) return t.categories;
    const q = debounced.toLowerCase();
    return t.categories.map(c => ({ ...c, items: c.items.filter(i => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)) })).filter(c => c.items.length > 0);
  }, [debounced, t.categories]);

  return (
    <>
      <section className="page-hero center">
        <div className="container">
          <nav className="breadcrumb"><Link href="/">Accueil</Link><span>/</span>{t.lastCrumb}</nav>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="h1" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p>{t.subtitle}</p>
          <div className="search" style={{ margin: "28px auto 0" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
            <input className="input" type="search" placeholder={t.searchPh} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 48, alignItems: "start" }}>
            <aside className="admin-nav" style={{ position: "sticky", top: 96, background: "var(--bg-surface)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius)", padding: 10 }}>
              {t.categories.map(c => (
                <a key={c.id} href={`#${c.id}`} className={activeCat === c.id ? "active" : ""} onClick={e => { e.preventDefault(); setActiveCat(c.id); document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" }); }}>{c.title}</a>
              ))}
            </aside>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              {filtered.map(cat => (
                <div key={cat.id} id={cat.id} style={{ marginBottom: 32 }}>
                  <h3 style={{ marginBottom: 16 }}>{cat.title}</h3>
                  <ServiceAccordion items={cat.items} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="final-cta" style={{ textAlign: "center" }}>
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ color: "#fff" }}>{t.ctaTitle}</h2>
              <p className="lead" style={{ margin: "14px auto 24px", maxWidth: "50ch" }}>{t.ctaLead}</p>
              <Link href="/contact" className="btn btn-coral btn-lg">{t.ctaBtn}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
