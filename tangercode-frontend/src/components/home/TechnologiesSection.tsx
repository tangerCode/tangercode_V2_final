"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import type { HomeData } from "@/lib/home-data";

export function TechnologiesSection({ data }: { data: HomeData }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = data.technologies.map(
      (t) => `<div class="stack-logo"><span class="dot">${t.abbr}</span><span class="nm">${t.name}</span></div>`,
    ).join("");
    track.innerHTML = items + items;
  }, [data.technologies]);

  return (
    <section className="section" id="stack">
      <div className="container">
        <motion.div className="section-head center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <p className="eyebrow">{data.stackEyebrow}</p>
          <h2>{data.stackTitle}</h2>
          <p>{data.stackDesc}</p>
        </motion.div>
      </div>
      <div className="marquee">
        <div className="marquee-track" ref={trackRef} />
      </div>
    </section>
  );
}
