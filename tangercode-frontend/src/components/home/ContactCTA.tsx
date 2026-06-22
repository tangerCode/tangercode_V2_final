"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp } from "@/lib/animations";
import type { HomeData } from "@/lib/home-data";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+212600000000";

export function ContactCTA({ data }: { data: HomeData }) {
  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div className="final-cta" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <div className="final-grid">
            <div>
              <h2>{data.ctaTitle}</h2>
              <p className="lead">{data.ctaLead}</p>
              <div className="hero-cta" style={{ justifyContent: "flex-start" }}>
                <Link href="/contact" className="btn btn-coral btn-lg">
                  {data.ctaButton}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`}
                  className="btn btn-ghost btn-lg"
                  style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.ctaWhatsapp}
                </a>
              </div>
            </div>
            <form className="final-form" onSubmit={(e) => e.preventDefault()}>
              <h3>Contact rapide</h3>
              <div className="field">
                <label htmlFor="n">Nom</label>
                <input className="input" id="n" type="text" placeholder="Votre nom" required />
              </div>
              <div className="field">
                <label htmlFor="e">Email</label>
                <input className="input" id="e" type="email" placeholder="vous@email.com" required />
              </div>
              <div className="field">
                <label htmlFor="tel">Telephone</label>
                <input className="input" id="tel" type="tel" placeholder="+212 6 00 00 00 00" />
              </div>
              <div className="field">
                <label htmlFor="m">Message</label>
                <textarea className="textarea" id="m" placeholder="Decrivez votre projet..." rows={3} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">
                Envoyer
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
