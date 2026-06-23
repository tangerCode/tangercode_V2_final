"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";

const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l4 4 10-10"/></svg>;

const L10N: Record<string, { eyebrow: string; title: string; subtitle: string; parTitle: string; parEye: string; parSteps: { num: string; title: string; desc: string }[]; valTitle: string; valEye: string; values: { title: string; desc: string }[]; whyTitle: string; whyEye: string; reasons: { title: string; desc: string }[]; ctaTitle: string; ctaLead: string; ctaBtn: string; ctaWa: string; photoLabel: string; lastCrumb: string }> = {
  fr: { eyebrow: "A PROPOS", title: "Le developpeur derriere", subtitle: "Passionne de code et de design depuis plus de 5 ans, j aide les entreprises a concretiser leurs idees digitales avec exigence et clarte. De Tanger, je concois des produits qui rayonnent bien au-dela.", parTitle: "Mon parcours", parEye: "PARCOURS", parSteps: [{ num: "2019", title: "Premiers pas", desc: "Debut en freelance, premiers sites vitrines pour des commercants de Tanger." }, { num: "2021", title: "Montee en competence", desc: "Specialisation full-stack : React, Node.js, Django. Premiers projets SaaS." }, { num: "2023", title: "Mobile & ERP", desc: "Elargissement vers les applications mobiles Flutter et les ERP sur mesure." }, { num: "2025", title: "TANGER CODE", desc: "Lancement de la marque, plus de 50 projets livres au Maroc et a l international." }], valTitle: "Mes valeurs", valEye: "VALEURS", values: [{ title: "Transparence", desc: "Des devis clairs, une communication honnete et zero cout cache. Vous savez toujours ou en est votre projet." }, { title: "Excellence", desc: "Un code propre, teste et documente. La qualite n est pas une option, c est la base." }, { title: "Proximite", desc: "Un interlocuteur unique, reactif, qui comprend votre metier et parle votre langue." }, { title: "Engagement", desc: "Votre reussite est la mienne. Je m investis comme si le projet etait le mien." }], whyTitle: "Pourquoi choisir TANGER CODE ?", whyEye: "POURQUOI NOUS", reasons: [{ title: "Interlocuteur unique", desc: "Pas d intermediaire : vous echangez directement avec le developpeur." }, { title: "Base a Tanger", desc: "Ancre localement, ouvert sur le monde — FR, EN et AR." }, { title: "Technologies modernes", desc: "Next.js, React, Flutter, Django : les meilleurs outils du marche." }, { title: "Respect des delais", desc: "Un planning clair, des jalons tenus, des livraisons a l heure." }, { title: "Code qui vous appartient", desc: "A la livraison, tout le code et les acces sont a vous." }, { title: "Support durable", desc: "Une relation qui ne s arrete pas a la mise en ligne." }], ctaTitle: "Pret a demarrer votre projet ?", ctaLead: "Parlons de votre idee. Reponse sous 24h, devis gratuit et sans engagement.", ctaBtn: "Demarrer un projet", ctaWa: "WhatsApp", photoLabel: "photo professionnelle", lastCrumb: "A propos" },
  en: { eyebrow: "ABOUT", title: "The developer behind", subtitle: "Passionate about code and design for over 5 years, I help businesses bring their digital ideas to life with rigor and clarity. From Tangier, I design products that shine far beyond.", parTitle: "My journey", parEye: "JOURNEY", parSteps: [{ num: "2019", title: "First steps", desc: "Started freelancing, first showcase sites for merchants in Tangier." }, { num: "2021", title: "Skill growth", desc: "Full-stack specialization: React, Node.js, Django. First SaaS projects." }, { num: "2023", title: "Mobile & ERP", desc: "Expansion to Flutter mobile apps and custom ERPs." }, { num: "2025", title: "TANGER CODE", desc: "Brand launch, 50+ projects delivered in Morocco and abroad." }], valTitle: "My values", valEye: "VALUES", values: [{ title: "Transparency", desc: "Clear quotes, honest communication and zero hidden costs. You always know where your project stands." }, { title: "Excellence", desc: "Clean, tested and documented code. Quality is not an option, it is the foundation." }, { title: "Proximity", desc: "A single, responsive point of contact who understands your business and speaks your language." }, { title: "Commitment", desc: "Your success is mine. I invest as if the project were my own." }], whyTitle: "Why choose TANGER CODE?", whyEye: "WHY US", reasons: [{ title: "Single point of contact", desc: "No middleman: you talk directly with the developer." }, { title: "Based in Tangier", desc: "Locally rooted, globally open — FR, EN and AR." }, { title: "Modern technologies", desc: "Next.js, React, Flutter, Django: the best tools on the market." }, { title: "On-time delivery", desc: "Clear planning, milestones met, deliveries on time." }, { title: "You own the code", desc: "At delivery, all code and access belong to you." }, { title: "Lasting support", desc: "A relationship that doesn't end at go-live." }], ctaTitle: "Ready to start?", ctaLead: "Let's talk about your idea.", ctaBtn: "Start a project", ctaWa: "WhatsApp", photoLabel: "professional photo", lastCrumb: "About" },
  ar: { eyebrow: "من نحن", title: "المطور وراء", subtitle: "شغوف بالبرمجة والتصميم منذ أكثر من 5 سنوات، أساعد الشركات على تحقيق أفكارها الرقمية بدقة ووضوح.", parTitle: "مسيرتي", parEye: "المسيرة", parSteps: [{ num: "2019", title: "الخطوات الأولى", desc: "بداية العمل الحر." }, { num: "2021", title: "تطوير المهارات", desc: "تخصص Full-stack." }, { num: "2023", title: "الجوال وERP", desc: "توسع نحو Flutter." }, { num: "2025", title: "TANGER CODE", desc: "إطلاق العلامة، 50+ مشروع." }], valTitle: "قيمي", valEye: "القيم", values: [{ title: "الشفافية", desc: "عروض أسعار واضحة وتواصل صادق." }, { title: "التميز", desc: "كود نظيف ومختبر وموثق." }, { title: "القرب", desc: "محاور وحيد يتفهم مهنتك." }, { title: "الالتزام", desc: "نجاحك هو نجاحي." }], whyTitle: "لماذا تختار TANGER CODE؟", whyEye: "لماذا نحن", reasons: [{ title: "محاور وحيد", desc: "لا وسطاء." }, { title: "مقره في طنجة", desc: "منغرس محلياً." }, { title: "تقنيات حديثة", desc: "Next.js، React، Flutter." }, { title: "احترام المواعيد", desc: "تخطيط واضح." }, { title: "الكود ملكك", desc: "عند التسليم." }, { title: "دعم دائم", desc: "علاقة لا تتوقف." }], ctaTitle: "مستعد؟", ctaLead: "لنتحدث عن فكرتك.", ctaBtn: "ابدأ", ctaWa: "واتساب", photoLabel: "صورة", lastCrumb: "من نحن" },
};

export function AboutContent({ locale }: { locale: string }) {
  const t = L10N[locale] || L10N.fr;
  const tlRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = tlRef.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.style.setProperty("--tl", "100%"); o.unobserve(el); } }, { threshold: 0.3 });
    o.observe(el); return () => o.disconnect();
  }, []);

  return (
    <>
      <section className="page-hero left">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "center", gap: 48 }}>
            <div>
              <nav className="breadcrumb left"><Link href="/">Accueil</Link><span>/</span>{t.lastCrumb}</nav>
              <p className="eyebrow">{t.eyebrow}</p>
              <h1 className="h1" style={{ margin: "14px 0 16px" }}>{t.title} <span className="grad-text">TANGER CODE</span></h1>
              <p>{t.subtitle}</p>
              <div className="hero-cta" style={{ justifyContent: "flex-start", marginTop: 24 }}>
                <Link href="/contact" className="btn btn-primary btn-lg">{t.ctaBtn} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
              </div>
            </div>
            <div className="ph" data-label={t.photoLabel} style={{ aspectRatio: "4/5", borderRadius: "var(--radius-lg)" }} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">{t.parEye}</p><h2>{t.parTitle}</h2>
          </motion.div>
          <motion.div className="timeline" id="timeline" ref={tlRef} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="tl-line" />
            <div className="tl-steps" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {t.parSteps.map((s, i) => (
                <div className="tl-step" key={i}><div className="tl-num">{s.num}</div><h4>{s.title}</h4><p>{s.desc}</p></div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">{t.valEye}</p><h2>{t.valTitle}</h2>
          </motion.div>
          <motion.div className="grid grid-4" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {t.values.map((v, i) => (
              <motion.div className="card card-grad value-card" key={i} variants={fadeInUp}><div className="icon-tile"><CheckIcon /></div><h3>{v.title}</h3><p>{v.desc}</p></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">{t.whyEye}</p><h2>{t.whyTitle}</h2>
          </motion.div>
          <motion.div className="grid grid-3" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {t.reasons.map((r, i) => (
              <motion.div className="card card-grad value-card" key={i} variants={fadeInUp}><div className="icon-tile"><CheckIcon /></div><h3 style={{ fontSize: "1.1rem" }}>{r.title}</h3><p>{r.desc}</p></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="final-cta" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="final-grid">
              <div><h2>{t.ctaTitle}</h2><p className="lead">{t.ctaLead}</p>
                <div className="hero-cta" style={{ justifyContent: "flex-start" }}>
                  <Link href="/contact" className="btn btn-coral btn-lg">{t.ctaBtn} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
                  <a href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"+212600000000").replace(/\D/g,"")}`} className="btn btn-ghost btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>{t.ctaWa}</a>
                </div>
              </div>
              <form className="final-form" onSubmit={e => e.preventDefault()}><h3>Contact rapide</h3>
                <div className="field"><label htmlFor="n">Nom</label><input className="input" id="n" type="text" placeholder="Votre nom" required /></div>
                <div className="field"><label htmlFor="e">Email</label><input className="input" id="e" type="email" placeholder="vous@email.com" required /></div>
                <div className="field"><label htmlFor="tel">Telephone</label><input className="input" id="tel" type="tel" placeholder="+212 6 00 00 00 00" /></div>
                <div className="field"><label htmlFor="m">Message</label><textarea className="textarea" id="m" placeholder="Decrivez votre projet…" required /></div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Envoyer</button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
