"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import type { ProjectDetail } from "@/lib/portfolio-data";

export function ProjectDetailContent({ project }: { project: ProjectDetail }) {
  return (
    <>
      {/* 1. Hero cover */}
      <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div className="ph" data-label={project.coverLabel} style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, var(--bg-base) 4%, rgba(10,22,40,0.7) 50%, rgba(10,22,40,0.5))" }} />
        <div className="container" style={{ position: "relative", zIndex: 2, paddingBottom: 56, paddingTop: 140 }}>
          <nav className="breadcrumb left"><Link href="/">Accueil</Link><span>/</span><Link href="/portfolio">Portfolio</Link><span>/</span>{project.title}</nav>
          <span className="badge badge-cyan" style={{ marginBottom: 16 }}>{project.category}</span>
          <h1 className="h-hero" style={{ fontSize: "clamp(2.4rem,6vw,4.5rem)", maxWidth: "16ch", margin: "8px 0 20px" }}>{project.title}</h1>
          <div className="flex gap" style={{ flexWrap: "wrap", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            <span>Client · {project.client}</span><span>•</span><span>Annee · {project.year}</span><span>•</span><span>Duree · {project.duration}</span><span>•</span><a href="#" className="link-arrow">Voir le site live &rarr;</a>
          </div>
          <div className="proj-chips" style={{ marginTop: 18 }}>{project.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
        </div>
      </section>

      {/* 2. Prose */}
      <section className="section">
        <div className="container prose">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <h2>Le defi</h2>
            {project.defi.map((p, i) => <p key={i}>{p}</p>)}
            <h2>Notre solution</h2>
            {project.solution.map((p, i) => <p key={i}>{p}</p>)}
          </motion.div>
        </div>
      </section>

      {/* 3. Results */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">RESULTATS</p><h2>Un impact mesurable</h2>
          </motion.div>
          <motion.div className="stat-trio" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {project.results.map((r, i) => (
              <motion.div className="card" key={i} variants={fadeInUp}><div className="n">{r.value}</div><p className="muted">{r.label}</p></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Gallery mosaic */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <p className="eyebrow">GALERIE</p><h2>Le projet en images</h2>
          </motion.div>
          <motion.div className="mosaic" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {project.images.map((label, i) => (
              <div key={i} className={`ph${i === 0 ? " big" : ""}`} data-label={`ecran · ${label}`} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Testimonial */}
      <motion.section className="section" style={{ paddingTop: 0 }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
        <div className="container" style={{ maxWidth: 820, textAlign: "center" }}>
          <div className="stars" style={{ justifyContent: "center", color: "var(--gold)" }}>★★★★★</div>
          <p className="tst-quote" style={{ fontSize: "1.5rem", margin: "18px 0" }}>&laquo; {project.testimonial.quote} &raquo;</p>
          <div className="tst-author" style={{ justifyContent: "center", border: 0 }}><div className="ph av" data-label="" /><div style={{ textAlign: "left" }}><div className="nm">{project.testimonial.name}</div><div className="rl">{project.testimonial.role}</div></div></div>
        </div>
      </motion.section>

      {/* 6. Related projects */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div className="section-head row-between" style={{ maxWidth: "none", alignItems: "flex-end" }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div><p className="eyebrow">A DECOUVRIR</p><h2>Projets similaires</h2></div>
            <Link href="/portfolio" className="link-arrow">Voir tous &rarr;</Link>
          </motion.div>
          <motion.div className="grid grid-3" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {project.relatedProjects.map((rp, i) => (
              <motion.article className="card card-grad proj-card" key={i} variants={fadeInUp}>
                <div className="proj-cover"><div className="ph" data-label={`cover · ${rp.title}`} /><span className="badge badge-cyan cat">{rp.category}</span><div className="proj-over"><Link href={rp.slug} className="link-arrow">Voir &rarr;</Link></div></div>
                <div className="proj-body"><h3>{rp.title}</h3><p className="client">{rp.client}</p><div className="proj-chips">{rp.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div></div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. Final CTA */}
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
