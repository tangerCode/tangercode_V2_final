"use client";

import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Scene3DLoader } from "@/components/3d/Scene3DLoader";
import type { HomeData } from "@/lib/home-data";

const BITS = ["<>", "{ }", "( )", "=>", "01", "fn", "</>", "[ ]", "::", "&&", "404", "git"];

const HeroContent = memo(function HeroContent({ data }: { data: HomeData }) {
  return (
    <motion.div
      className="container hero-inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <p className="eyebrow" dangerouslySetInnerHTML={{ __html: data.heroEyebrow }} />
      <h1 className="h-hero">
        {data.heroTitlePart1}
        <span className="grad-text">{data.heroHighlight}</span>
        {data.heroTitlePart2}
        <span className="blink">_</span>
      </h1>
      <p className="hero-sub">{data.heroSubtitle}</p>
      <div className="hero-cta">
        <Link href="/contact" className="btn btn-primary btn-lg">
          {data.heroCta}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
        <Link href="/portfolio" className="btn btn-ghost btn-lg">
          {data.heroSecondary}
        </Link>
      </div>

      <div className="trust">
        {data.trust.map((item, i) => (
          <div className="t-item" key={i}>
            <div className="t-num">
              <span>{item.value}</span>{item.suffix}
            </div>
            <div className="t-label">{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

export function HeroSection({ data }: { data: HomeData }) {
  const codeBitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = codeBitsRef.current;
    if (!host) return;
    host.innerHTML = "";
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("span");
      s.textContent = BITS[i % BITS.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.fontSize = (0.7 + Math.random() * 0.9) + "rem";
      s.style.animationDuration = (6 + Math.random() * 8) + "s";
      s.style.animationDelay = (-Math.random() * 8) + "s";
      host.appendChild(s);
    }
  }, []);

  return (
    <section className="hero" id="accueil">
      <div className="hero-glow" />
      <Scene3DLoader />
      <div className="code-bits" aria-hidden="true" ref={codeBitsRef} />
      <div className="hero-veil" />

      <HeroContent data={data} />

      <a href="#services" className="scroll-cue" aria-label={data.discoverLabel}>
        <span>{data.discoverLabel}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
