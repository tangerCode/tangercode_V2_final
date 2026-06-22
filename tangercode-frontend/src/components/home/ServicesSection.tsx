"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import type { HomeData } from "@/lib/home-data";

const ICONS: Record<string, React.ReactNode> = {
  web: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>,
  platform: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="7" cy="6" r="1"/><circle cx="7" cy="12" r="1"/><circle cx="7" cy="18" r="1"/></svg>,
  erp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  mobile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>,
};

export function ServicesSection({ data }: { data: HomeData }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <p className="eyebrow">{data.servicesEyebrow}</p>
          <h2>{data.servicesTitle}</h2>
          <p>{data.servicesDesc}</p>
        </motion.div>

        <motion.div className="grid grid-4" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {data.services.map((svc, i) => (
            <motion.article className="card card-grad svc-card" key={i} variants={fadeInUp}>
              <div className="icon-tile">{ICONS[svc.icon] || ICONS.web}</div>
              <h3>{svc.title}</h3>
              <p>{svc.description}</p>
              <div className="svc-tags">
                {svc.tags.map((tag) => (
                  <span className="chip" key={tag}>{tag}</span>
                ))}
              </div>
              <div className="svc-foot">
                <Link href={svc.slug} className="link-arrow">En savoir plus &rarr;</Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
