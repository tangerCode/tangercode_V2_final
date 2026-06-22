"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import type { HomeData } from "@/lib/home-data";

export function TestimonialsSection({ data }: { data: HomeData }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = data.testimonials.length;

  const goTo = useCallback((i: number) => {
    const idx = (i + total) % total;
    setActive(idx);
  }, [total]);

  useEffect(() => {
    const timer = setInterval(() => goTo(active + 1), 5000);
    return () => clearInterval(timer);
  }, [active, goTo]);

  useEffect(() => {
    if (!trackRef.current) return;
    const slideWidth = trackRef.current.children[0]?.clientWidth || 0;
    const gap = 24;
    trackRef.current.style.transform = `translateX(-${active * (slideWidth + gap)}px)`;
  }, [active]);

  return (
    <section className="section" id="testimonials" style={{ background: "var(--bg-surface)" }}>
      <div className="container">
        <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <p className="eyebrow">{data.testimonialsEyebrow}</p>
          <h2>{data.testimonialsTitle}</h2>
        </motion.div>

        <motion.div className="tst" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <div className="tst-view">
            <div className="tst-track" ref={trackRef}>
              {data.testimonials.map((t, i) => (
                <div className="tst-slide" key={i}>
                  <div className="card tst-card">
                    <div className="stars">★★★★★</div>
                    <p className="tst-quote">&laquo; {t.quote} &raquo;</p>
                    <div className="tst-author">
                      <div className="ph av" data-label="" />
                      <div>
                        <div className="nm">{t.name}</div>
                        <div className="rl">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tst-nav">
            <div className="tst-dots">
              {data.testimonials.map((_, i) => (
                <button key={i} className={`tst-dot${i === active ? " active" : ""}`} onClick={() => goTo(i)} aria-label={`Témoignage ${i + 1}`} />
              ))}
            </div>
            <div className="tst-arrows">
              <button className="icon-btn" onClick={() => goTo(active - 1)} aria-label="Précédent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button className="icon-btn" onClick={() => goTo(active + 1)} aria-label="Suivant">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
