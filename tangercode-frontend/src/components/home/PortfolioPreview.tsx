"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import type { HomeData } from "@/lib/home-data";

export function PortfolioPreview({ data }: { data: HomeData }) {
  const [active, setActive] = useState("all");

  const filtered = useMemo(
    () => (active === "all" ? data.projects : data.projects.filter((p) => p.category === active)),
    [active, data.projects],
  );

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <motion.div className="section-head row-between" style={{ maxWidth: "none", alignItems: "flex-end" }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <div style={{ maxWidth: 560 }}>
            <p className="eyebrow">{data.portfolioEyebrow}</p>
            <h2>{data.portfolioTitle}</h2>
            <p>{data.portfolioDesc}</p>
          </div>
          <Link href="/portfolio" className="link-arrow">{data.portfolioViewAll} &rarr;</Link>
        </motion.div>

        <motion.div className="pills" style={{ marginBottom: 32 }} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {data.filters.map((f) => (
            <button key={f.key} className={`pill${active === f.key ? " active" : ""}`} onClick={() => setActive(f.key)}>
              {f.label}
            </button>
          ))}
        </motion.div>

        <motion.div className="grid grid-3" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((proj) => (
              <motion.article className="card card-grad proj-card" key={proj.title} variants={fadeInUp} layout exit={{ opacity: 0, scale: 0.9 }}>
                <div className="proj-cover">
                  <div className="ph" data-label={`cover · ${proj.title}`} />
                  <span className="badge badge-cyan cat">{proj.category}</span>
                  <span className="badge year">{proj.year}</span>
                  <div className="proj-over">
                    <Link href={proj.slug} className="link-arrow">Voir le projet &rarr;</Link>
                  </div>
                </div>
                <div className="proj-body">
                  <h3>{proj.title}</h3>
                  <p className="client">{proj.client}</p>
                  <div className="proj-chips">
                    {proj.tags.map((tag, j) => (
                      <span className="chip" key={j}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
