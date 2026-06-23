"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeInUp } from "@/lib/animations";
import { ContactForm } from "@/components/shared/ContactForm";

const L10N: Record<string, { eyebrow: string; title: string; subtitle: string; lastCrumb: string; coordsTitle: string; coordsSub: string; emailLabel: string; email: string; telLabel: string; tel: string; waLabel: string; wa: string; addrLabel: string; addr: string; mapLabel: string; waCardTitle: string; waCardDesc: string; waCardBtn: string }> = {
  fr: { eyebrow: "CONTACT", title: "Discutons de votre projet", subtitle: "Un projet en tete, une question, un devis ? Remplissez le formulaire ou ecrivez-nous directement.", lastCrumb: "Contact", coordsTitle: "Coordonnees", coordsSub: "Reponse garantie sous 24h, du lundi au samedi.", emailLabel: "Email", email: "contact@tangercode.ma", telLabel: "Telephone", tel: "+212 6 00 00 00 00", waLabel: "WhatsApp", wa: "+212 6 00 00 00 00", addrLabel: "Adresse", addr: "Tanger, Maroc", mapLabel: "carte · Tanger, Maroc", waCardTitle: "Vous preferez discuter de vive voix ?", waCardDesc: "Contactez-nous directement sur WhatsApp pour une reponse rapide.", waCardBtn: "Discuter sur WhatsApp" },
  en: { eyebrow: "CONTACT", title: "Let's discuss your project", subtitle: "A project in mind, a question, a quote? Fill out the form or write us directly.", lastCrumb: "Contact", coordsTitle: "Contact info", coordsSub: "Response guaranteed within 24h, Monday to Saturday.", emailLabel: "Email", email: "contact@tangercode.ma", telLabel: "Phone", tel: "+212 6 00 00 00 00", waLabel: "WhatsApp", wa: "+212 6 00 00 00 00", addrLabel: "Address", addr: "Tangier, Morocco", mapLabel: "map", waCardTitle: "Prefer to talk?", waCardDesc: "Contact us directly on WhatsApp for a quick response.", waCardBtn: "Chat on WhatsApp" },
  ar: { eyebrow: "اتصل", title: "لنناقش مشروعك", subtitle: "مشروع في ذهنك؟", lastCrumb: "اتصل", coordsTitle: "معلومات", coordsSub: "رد مضمون.", emailLabel: "بريد", email: "contact@tangercode.ma", telLabel: "هاتف", tel: "+212 6 00 00 00 00", waLabel: "واتساب", wa: "+212 6 00 00 00 00", addrLabel: "عنوان", addr: "طنجة", mapLabel: "خريطة", waCardTitle: "تفضل الحديث؟", waCardDesc: "اتصل بنا.", waCardBtn: "محادثة" },
};

export function ContactPageContent({ locale }: { locale: string }) {
  const t = L10N[locale] || L10N.fr;
  return (
    <>
      <section className="page-hero center" style={{ paddingBottom: 24 }}>
        <div className="container">
          <nav className="breadcrumb"><Link href="/">Accueil</Link><span>/</span>{t.lastCrumb}</nav>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="h1" dangerouslySetInnerHTML={{ __html: t.title }} />
          <p>{t.subtitle}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: 48, alignItems: "start" }}>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              <h3 style={{ marginBottom: 8 }}>{t.coordsTitle}</h3>
              <p className="muted" style={{ marginBottom: 8 }}>{t.coordsSub}</p>
              <ul className="cinfo">
                <li><div className="icon-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></div><div><div className="l">{t.emailLabel}</div><a className="v" href={`mailto:${t.email}`}>{t.email}</a></div></li>
                <li><div className="icon-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></div><div><div className="l">{t.telLabel}</div><a className="v" href={`tel:${t.tel.replace(/\s/g,"")}`}>{t.tel}</a></div></li>
                <li><div className="icon-tile"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z"/></svg></div><div><div className="l">{t.waLabel}</div><a className="v" href={`https://wa.me/${t.wa.replace(/\D/g,"")}`}>{t.wa}</a></div></li>
                <li><div className="icon-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></div><div><div className="l">{t.addrLabel}</div><span className="v">{t.addr}</span></div></li>
              </ul>
              <div className="social" style={{ margin: "24px 0" }}>
                <a href="#" className="icon-btn" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8v12H3V8h3.9zM5 3.4a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6zM21 20h-3.9v-6.3c0-1.5-.5-2.5-1.9-2.5-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H9.3V8h3.7v1.6c.5-.8 1.4-1.9 3.4-1.9 2.5 0 4.4 1.6 4.4 5.2V20z"/></svg></a>
                <a href="#" className="icon-btn" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
                <a href="#" className="icon-btn" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l.4-3H14V4.3c0-.9.3-1.5 1.6-1.5H17.5V.1C17.1.1 16 0 14.8 0 12.2 0 10.5 1.6 10.5 4v2H7.5v3h3v9h3.5V9z"/></svg></a>
              </div>
              <div className="ph" data-label={t.mapLabel} style={{ aspectRatio: "16/9", borderRadius: "var(--radius-lg)" }} />
            </motion.div>
            <ContactForm variant="page" />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card card-grad" style={{ textAlign: "center", padding: 48 }}>
            <h2 style={{ marginBottom: 12 }}>{t.waCardTitle}</h2>
            <p className="muted" style={{ marginBottom: 24 }}>{t.waCardDesc}</p>
            <a href={`https://wa.me/${t.wa.replace(/\D/g,"")}`} className="btn btn-whatsapp btn-lg" target="_blank" rel="noopener noreferrer">{t.waCardBtn}</a>
          </div>
        </div>
      </section>
    </>
  );
}
