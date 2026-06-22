"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import type { HomeData } from "@/lib/home-data";

export function StatsSection({ data }: { data: HomeData }) {
  return (
    <section className="section">
      <div className="container">
        <motion.div className="stats-band" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <div className="stats-grid">
            {data.stats.map((stat, i) => (
              <div className="stat" key={i}>
                <div className="s-num">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="s-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
