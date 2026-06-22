"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import type { PortfolioPageData } from "@/lib/portfolio-data";

const ITEMS_PER_PAGE = 6;

export function PortfolioListContent({ data }: { data: PortfolioPageData }) {
  const [active, setActive] = useState("all");
  const [visible, setVisible] = useState(ITEMS_PER_PAGE);

  const filtered = useMemo(
    () => (active === "all" ? data.projects : data.projects.filter((p) => p.category === active)),
    [active, data.projects],
  );
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <>
      <section className="page-hero center">
        <div className="container">
          <nav className="breadcrumb"><Link href="/">Accueil</Link><span>/</span>{data.lastBreadcrumb}</nav>
          <p className="eyebrow">{data.eyebrow}</p>
          <h1 className="h1" dangerouslySetInnerHTML={{ __html: data.title }} />
          <p>{data.subtitle}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <motion.div className="pills" style={{ marginBottom: 32, justifyContent: "center" }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {data.filters.map((f) => (
              <button key={f.key} className={`pill${active === f.key ? " active" : ""}`} onClick={() => { setActive(f.key); setVisible(ITEMS_PER_PAGE); }}>{f.label}</button>
            ))}
          </motion.div>

          <motion.div className="grid grid-3" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} layout>
            <AnimatePresence mode="popLayout">
              {shown.map((proj) => (
                <motion.article className="card card-grad proj-card" key={proj.slug} variants={fadeInUp} layout exit={{ opacity: 0, scale: 0.9 }}>
                  <div className="proj-cover">
                    <div className="ph" data-label={`cover · ${proj.title}`} />
                    <span className="badge badge-cyan cat">{proj.category}</span>
                    <span className="badge year">{proj.year}</span>
                    <div className="proj-over"><Link href={proj.slug} className="link-arrow">Voir le projet &rarr;</Link></div>
                  </div>
                  <div className="proj-body">
                    <h3>{proj.title}</h3><p className="client">{proj.client}</p>
                    <div className="proj-chips">{proj.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {hasMore && (
            <div className="center" style={{ marginTop: 48 }}>
              <button className="btn btn-ghost btn-lg" onClick={() => setVisible((v) => v + ITEMS_PER_PAGE)}>{data.loadMore}</button>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="final-cta" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="final-grid">
              <div><h2>Pret a demarrer votre projet ?</h2><p className="lead">Parlons de votre idee. Reponse sous 24h, devis gratuit et sans engagement.</p>
                <div className="hero-cta" style={{ justifyContent: "flex-start" }}>
                  <Link href="/contact" className="btn btn-coral btn-lg">Demarrer un projet <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
                  <a href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"+212600000000").replace(/\D/g,"")}`} className="btn btn-ghost btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>WhatsApp</a>
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
