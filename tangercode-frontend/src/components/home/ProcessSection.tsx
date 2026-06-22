"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import type { HomeData } from "@/lib/home-data";

export function ProcessSection({ data }: { data: HomeData }) {
  const tlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tlRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.setProperty("--tl", "100%");
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="process">
      <div className="container">
        <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <p className="eyebrow">{data.processEyebrow}</p>
          <h2>{data.processTitle}</h2>
          <p>{data.processDesc}</p>
        </motion.div>

        <motion.div className="timeline" id="timeline" ref={tlRef} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <div className="tl-line" />
          <div className="tl-steps">
            {data.processSteps.map((step, i) => (
              <div className="tl-step" key={i}>
                <div className="tl-num">
                  <b>{i + 1}</b>
                  {step.num}
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
