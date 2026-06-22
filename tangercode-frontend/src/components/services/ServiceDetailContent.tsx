"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import { ServiceAccordion } from "./ServiceAccordion";
import type { ServiceDetail } from "@/lib/services-data";

const ICONS: Record<string, React.ReactNode> = {
  web: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>,
  platform: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="7" cy="6" r="1"/><circle cx="7" cy="12" r="1"/><circle cx="7" cy="18" r="1"/></svg>,
  erp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  mobile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>,
};

const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l4 4 10-10"/></svg>;

export function ServiceDetailContent({ service }: { service: ServiceDetail }) {
  return (
    <>
      {/* 1. Page hero */}
      <section className="page-hero left">
        <div className="container">
          <nav className="breadcrumb left">
            <Link href="/">Accueil</Link><span>/</span><Link href="/services">Services</Link><span>/</span>{service.title}
          </nav>
          <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 10 }}>
            <div className="icon-tile" style={{ width: 64, height: 64 }}>{ICONS[service.icon] || ICONS.web}</div>
            <div><h1 className="h1" style={{ margin: 0 }}>{service.title}</h1></div>
          </div>
          <p style={{ marginTop: 18 }}>{service.shortDesc}</p>
          <div className="hero-cta" style={{ justifyContent: "flex-start", marginTop: 24 }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Demarrer mon projet <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
            <Link href="/portfolio" className="btn btn-ghost btn-lg">Voir des exemples</Link>
          </div>
        </div>
      </section>

      {/* 2. Prose */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container prose">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <h2>{service.longDescTitle}</h2>
            {service.longDesc.map((p, i) => <p key={i}>{p}</p>)}
          </motion.div>
        </div>
      </section>

      {/* 3. Values */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">NOTRE APPROCHE</p><h2>Comment nous travaillons</h2>
          </motion.div>
          <motion.div className="grid grid-4" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {service.values.map((v, i) => (
              <motion.div className="card card-grad value-card" key={i} variants={fadeInUp}>
                <div className="icon-tile"><CheckIcon /></div><h3>{v.title}</h3><p>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Technologies */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">STACK</p><h2>Technologies utilisees</h2>
          </motion.div>
          <motion.div className="pills" style={{ justifyContent: "center" }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {service.technologies.map((t) => <span className="pill" key={t}>{t}</span>)}
          </motion.div>
        </div>
      </section>

      {/* 5. Pricing */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">PRICING</p><h2>Tarifs {service.title.toLowerCase()}</h2>
          </motion.div>
          <motion.div className="price-grid" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {service.pricingTiers.map((t, i) => (
              <motion.article key={i} className={`card price-card${t.featured ? " featured" : " card-grad"}`} variants={fadeInUp}>
                {t.featured && <span className="badge badge-coral price-pop">★ Plus populaire</span>}
                <h4>{t.name}</h4>
                {t.price ? <><div className="price-from">A partir de</div><div className={`price-amt${t.featured ? " grad-text" : ""}`}>{t.price}</div></> : <div className="price-amt">Sur devis</div>}
                <p className="desc">{t.description}</p>
                <ul className="price-feats">{t.features.map((f, j) => <li key={j}><CheckIcon />{f}</li>)}</ul>
                <Link href="/contact" className={`btn ${t.featured ? "btn-primary" : "btn-ghost"} btn-block`}>{t.cta}</Link>
                <div className="price-meta">{t.meta.split(" · ").map((m, j) => <span key={j}>{m}</span>)}</div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. Related projects */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head row-between" style={{ maxWidth: "none", alignItems: "flex-end" }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div><p className="eyebrow">PORTFOLIO</p><h2>Projets lies</h2></div>
            <Link href="/portfolio" className="link-arrow">Voir tous &rarr;</Link>
          </motion.div>
          <motion.div className="grid grid-3" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {service.relatedProjects.map((p, i) => (
              <motion.article className="card card-grad proj-card" key={i} variants={fadeInUp}>
                <div className="proj-cover">
                  <div className="ph" data-label={`cover · ${p.title}`} />
                  <span className="badge badge-cyan cat">{p.category}</span>
                  <div className="proj-over"><Link href={p.slug} className="link-arrow">Voir &rarr;</Link></div>
                </div>
                <div className="proj-body"><h3>{p.title}</h3><p className="client">{p.client}</p><div className="proj-chips">{p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div></div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="section-head center"><p className="eyebrow">FAQ</p><h2>Questions frequentes</h2></div>
          <ServiceAccordion items={service.faq} />
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="section">
        <div className="container">
          <motion.div className="final-cta" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="final-grid">
              <div><h2>Pret a demarrer votre projet ?</h2><p className="lead">Parlons de votre idee. Reponse sous 24h, devis gratuit et sans engagement.</p>
                <div className="hero-cta" style={{ justifyContent: "flex-start" }}>
                  <Link href="/contact" className="btn btn-coral btn-lg">Demarrer un projet <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
                  <a href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"+212600000000").replace(/\D/g,"")}`} className="btn btn-ghost btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }} target="_blank" rel="noopener noreferrer">WhatsApp</a>
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
