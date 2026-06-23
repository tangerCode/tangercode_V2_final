"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import type { BlogPageData } from "@/lib/blog-data";

const PER_PAGE = 6;

export function BlogListContent({ data }: { data: BlogPageData }) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    let posts = data.posts;
    if (debounced) {
      const q = debounced.toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    if (activeFilter !== "all") posts = posts.filter(p => p.category === activeFilter);
    return posts;
  }, [debounced, activeFilter, data.posts]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentPosts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const featured = data.posts.find(p => p.featured);
  const showFeatured = activeFilter === "all" && !debounced && page === 1 && featured;

  useEffect(() => { setPage(1); }, [activeFilter, debounced]);

  return (
    <>
      <section className="page-hero center">
        <div className="container">
          <nav className="breadcrumb"><Link href="/">Accueil</Link><span>/</span>{data.lastBreadcrumb}</nav>
          <p className="eyebrow">{data.eyebrow}</p>
          <h1 className="h1" dangerouslySetInnerHTML={{ __html: data.title }} />
          <p>{data.subtitle}</p>
          <div className="search" style={{ margin: "28px auto 0" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
            <input className="input" type="search" placeholder={data.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <motion.div className="pills" style={{ justifyContent: "center", marginBottom: 36 }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {data.filters.map(f => (
              <button key={f.key} className={`pill${activeFilter === f.key ? " active" : ""}`} onClick={() => setActiveFilter(f.key)}>{f.label}</button>
            ))}
          </motion.div>

          {showFeatured && (
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              <Link href={`/blog/${featured.slug}`} className="card card-grad" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 0, overflow: "hidden", padding: 0, marginBottom: 40 }}>
                <div className="ph" data-label="article a la une" style={{ minHeight: 320 }} />
                <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="blog-meta" style={{ marginBottom: 14 }}>
                    <span className="badge badge-coral">{data.featuredBadge}</span>
                    <span className="chip">{featured.category}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".78rem", color: "var(--text-muted)" }}>{featured.date}</span>
                  </div>
                  <h2 style={{ marginBottom: 14 }}>{featured.title}</h2>
                  <p className="muted" style={{ marginBottom: 22 }}>{featured.excerpt}</p>
                  <span className="link-arrow">{data.readLabel} &rarr;</span>
                </div>
              </Link>
            </motion.div>
          )}

          <motion.div className="grid grid-3" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} layout>
            <AnimatePresence mode="popLayout">
              {currentPosts.map(post => (
                <motion.article className="card card-grad blog-card" key={post.slug} variants={fadeInUp} layout exit={{ opacity: 0, scale: 0.9 }}>
                  <Link href={`/blog/${post.slug}`} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div className="blog-cover"><div className="ph" data-label="cover article" /></div>
                    <div className="blog-body">
                      <div className="blog-meta"><span className="chip">{post.category}</span><span>{post.date}</span></div>
                      <h3>{post.title}</h3>
                      <p className="ex">{post.excerpt}</p>
                      <div className="blog-foot"><div className="ph av" data-label="" /><span className="au">{post.authorName}</span><span className="rt">{post.readTime}</span></div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <div className="pills" style={{ justifyContent: "center", marginTop: 48 }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`pill${page === i + 1 ? " active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
