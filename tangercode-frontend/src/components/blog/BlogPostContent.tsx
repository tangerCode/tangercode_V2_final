"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import type { BlogPostDetail, BlogPageData } from "@/lib/blog-data";

export function BlogPostContent({ post, data }: { post: BlogPostDetail; data: BlogPageData }) {
  const related = post.relatedSlugs.map(s => data.details.find(d => d.slug === s)).filter(Boolean) as BlogPostDetail[];

  return (
    <>
      <section className="page-hero left" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <nav className="breadcrumb left"><Link href="/">Accueil</Link><span>/</span><Link href="/blog">{data.lastBreadcrumb}</Link><span>/</span>{post.title}</nav>
          <div className="blog-meta" style={{ margin: "8px 0 16px" }}><span className="chip">{post.category}</span><span>{post.date}</span><span>·</span><span>{post.readTime} de lecture</span></div>
          <h1 className="h1">{post.title}</h1>
          <div className="blog-foot" style={{ border: 0, justifyContent: "flex-start", gap: 12, marginTop: 18 }}>
            <div className="ph av" data-label="" style={{ width: 42, height: 42, borderRadius: "50%" }} />
            <div><div className="au" style={{ fontSize: ".95rem" }}>{post.authorName}</div><div style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>{post.authorRole}</div></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <div className="ph" data-label={post.coverLabel} style={{ aspectRatio: "16/9", borderRadius: "var(--radius-lg)", marginBottom: 36 }} />
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="flex gap-sm" style={{ marginTop: 36, flexWrap: "wrap" }}>
              {post.tags.map((tag, i) => <span className="chip" key={i}>{tag}</span>)}
            </div>
            <div className="card" style={{ marginTop: 40, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <div className="ph av" data-label="" style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 200 }}><div className="au" style={{ fontWeight: 700 }}>{post.authorName}</div><p className="muted" style={{ fontSize: ".9rem", marginTop: 4 }}>{post.authorBio}</p></div>
              <Link href="/contact" className="btn btn-ghost btn-sm">{data.authorContact}</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <motion.div className="section-head row-between" style={{ maxWidth: "none", alignItems: "flex-end" }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              <div><p className="eyebrow">{data.relatedEye}</p><h2>{data.relatedTitle}</h2></div>
              <Link href="/blog" className="link-arrow">{data.viewAll} &rarr;</Link>
            </motion.div>
            <motion.div className="grid grid-3" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              {related.slice(0, 3).map(r => (
                <motion.article className="card card-grad blog-card" key={r.slug} variants={fadeInUp}>
                  <Link href={`/blog/${r.slug}`} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div className="blog-cover"><div className="ph" data-label="cover" /></div>
                    <div className="blog-body"><div className="blog-meta"><span className="chip">{r.category}</span></div><h3>{r.title}</h3><span className="link-arrow" style={{ marginTop: "auto" }}>Lire &rarr;</span></div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

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
