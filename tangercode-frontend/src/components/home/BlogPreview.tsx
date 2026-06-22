"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import type { HomeData } from "@/lib/home-data";

export function BlogPreview({ data }: { data: HomeData }) {
  return (
    <section className="section" id="blog">
      <div className="container">
        <motion.div className="section-head row-between" style={{ maxWidth: "none", alignItems: "flex-end" }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <div>
            <p className="eyebrow">{data.blogEyebrow}</p>
            <h2>{data.blogTitle}</h2>
          </div>
          <Link href="/blog" className="link-arrow">{data.blogViewAll} &rarr;</Link>
        </motion.div>

        <motion.div className="grid grid-3" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {data.blogPosts.map((post, i) => (
            <motion.article className="card card-grad blog-card" key={i} variants={fadeInUp}>
              <div className="blog-cover">
                <div className="ph" data-label="cover article" />
              </div>
              <div className="blog-body">
                <div className="blog-meta">
                  <span className="chip">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="ex">{post.excerpt}</p>
                <div className="blog-foot">
                  <div className="ph av" data-label="" />
                  <span className="au">A. Tanger Code</span>
                  <span className="rt">{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
