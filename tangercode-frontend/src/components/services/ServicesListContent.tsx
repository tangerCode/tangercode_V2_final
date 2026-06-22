"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import type { ServicesPageData } from "@/lib/services-data";

const ICONS: Record<string, React.ReactNode> = {
  web: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>,
  platform: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="7" cy="6" r="1"/><circle cx="7" cy="12" r="1"/><circle cx="7" cy="18" r="1"/></svg>,
  erp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  mobile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>,
};

const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l4 4 10-10"/></svg>;

export function ServicesListContent({ data }: { data: ServicesPageData }) {
  const tlRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = tlRef.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.style.setProperty("--tl", "100%"); o.unobserve(el); } }, { threshold: 0.3 });
    o.observe(el); return () => o.disconnect();
  }, []);

  return (
    <>
      <section className="page-hero center">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link><span>/</span>{data.lastBreadcrumb}
          </nav>
          <p className="eyebrow">{data.eyebrow}</p>
          <h1 className="h1" dangerouslySetInnerHTML={{ __html: data.title }} />
          <p>{data.subtitle}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <motion.div className="grid grid-2" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {data.services.map((svc) => (
              <motion.article className="card card-grad svc-card" key={svc.slug} variants={fadeInUp}>
                <div className="icon-tile">{ICONS[svc.icon] || ICONS.web}</div>
                <h3>{svc.title}</h3>
                <p>{svc.description}</p>
                <ul className="price-feats" style={{ margin: "20px 0" }}>
                  {svc.features.map((f, i) => <li key={i}><CheckIcon />{f}</li>)}
                </ul>
                <div className="svc-tags">{svc.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
                <div className="svc-foot"><Link href={`/services/${svc.slug}`} className="link-arrow">En savoir plus &rarr;</Link></div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">{data.processEyebrow}</p><h2>{data.processTitle}</h2><p>{data.processDesc}</p>
          </motion.div>
          <motion.div className="timeline" id="timeline" ref={tlRef} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="tl-line" /><div className="tl-steps">
              {data.processSteps.map((s, i) => (
                <div className="tl-step" key={i}><div className="tl-num"><b>{i+1}</b>{s.num}</div><h4>{s.title}</h4><p>{s.desc}</p></div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="final-cta" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="final-grid">
              <div><h2>{data.ctaTitle}</h2><p className="lead">{data.ctaLead}</p>
                <div className="hero-cta" style={{ justifyContent: "flex-start" }}>
                  <Link href="/contact" className="btn btn-coral btn-lg">{data.ctaButton} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
                  <a href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"+212600000000").replace(/\D/g,"")}`} className="btn btn-ghost btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>{data.ctaWhatsapp}</a>
                </div>
              </div>
              <form className="final-form" onSubmit={(e) => e.preventDefault()}><h3>Contact rapide</h3>
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
