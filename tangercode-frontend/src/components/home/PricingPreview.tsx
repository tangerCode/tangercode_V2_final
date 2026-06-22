"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp } from "@/lib/animations";
import type { HomeData } from "@/lib/home-data";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12l4 4 10-10" />
  </svg>
);

export function PricingPreview({ data }: { data: HomeData }) {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <p className="eyebrow">{data.pricingEyebrow}</p>
          <h2>{data.pricingTitle}</h2>
          <p>{data.pricingDesc}</p>
        </motion.div>

        <div className="pills" style={{ justifyContent: "center", marginBottom: 40 }}>
          <button className="pill active">MAD</button>
          <button className="pill">EUR</button>
          <button className="pill">USD</button>
        </div>

        <motion.div className="price-grid" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {data.pricingTiers.map((tier, i) => (
            <article key={i} className={`card price-card${tier.featured ? " featured" : !tier.price ? " card-grad" : " card-grad"}`}>
              {tier.featured && (
                <span className="badge badge-coral price-pop">{data.popularBadge}</span>
              )}
              <h4>{tier.name}</h4>
              {tier.price ? (
                <>
                  <div className="price-from">A partir de</div>
                  <div className={`price-amt${tier.featured ? " grad-text" : ""}`}>{tier.price}</div>
                </>
              ) : (
                <div className="price-amt">{data.customQuote}</div>
              )}
              <p className="desc">{tier.description}</p>
              <ul className="price-feats">
                {tier.features.map((f, j) => (
                  <li key={j}><CheckIcon />{f}</li>
                ))}
              </ul>
              <Link href="/contact" className={`btn ${tier.featured ? "btn-primary" : "btn-ghost"} btn-block`}>{tier.cta}</Link>
              <div className="price-meta">
                {tier.meta.split(" · ").map((m, j) => (
                  <span key={j}>{m}</span>
                ))}
              </div>
            </article>
          ))}
        </motion.div>

        <p className="price-note">
          {data.pricingNote} <Link href="/contact" className="link-arrow">{data.pricingDiscuss} &rarr;</Link>
        </p>
      </div>
    </section>
  );
}
