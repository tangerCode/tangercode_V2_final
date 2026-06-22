"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface FAQItem { q: string; a: string; }

export function ServiceAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i);

  return (
    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
      {items.map((item, i) => (
        <div className={`acc-item${openIdx === i ? " open" : ""}`} key={i}>
          <button className="acc-head" onClick={() => toggle(i)}>
            {item.q}
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div className="acc-body"><div className="inner">{item.a}</div></div>
        </div>
      ))}
    </motion.div>
  );
}
