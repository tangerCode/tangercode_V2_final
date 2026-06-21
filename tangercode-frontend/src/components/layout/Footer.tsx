import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { footerServices, footerCompany, footerContact, footerLegal } from "@/lib/navigation";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import { NewsletterForm } from "@/components/shared/NewsletterForm";

export function Footer() {
  const tNav = useTranslations("nav");
  const tNavSvc = useTranslations("navServices");
  const tFooter = useTranslations("footer");
  const tNews = useTranslations("newsletter");

  const serviceLabels: Record<string, string> = {
    "services.websites": tNavSvc("websites"),
    "services.platforms": tNavSvc("platforms"),
    "services.erp": tNavSvc("erp"),
    "services.mobile": tNavSvc("mobile"),
  };

  const contactLabels: Record<string, string> = {
    email: tFooter("email"),
    phone: tFooter("phone"),
    location: tFooter("location"),
    start: tNav("startProject"),
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="logo">
              <span className="bracket">&lt;</span>
              <span className="word">TANGER&nbsp;CODE</span>
              <span className="bracket">/&gt;</span>
            </span>
            <p className="muted" style={{ margin: "18px 0", maxWidth: "34ch", fontSize: "0.92rem" }}>
              {tFooter("tagline")}
            </p>
          </div>

          <div>
            <h5>{tFooter("services")}</h5>
            {footerServices.map((item) => (
              <Link key={item.key} href={item.href}>
                {serviceLabels[item.key] || item.key}
              </Link>
            ))}
          </div>

          <div>
            <h5>{tFooter("company")}</h5>
            {footerCompany.map((item) => (
              <Link key={item.key} href={item.href}>
                {tNav(item.key)}
              </Link>
            ))}
          </div>

          <div>
            <h5>{tFooter("contact")}</h5>
            {footerContact.map((item) => (
              <a key={item.key} href={item.href}>
                {contactLabels[item.key] || item.key}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 mb-8 border-t border-[var(--border-soft)] pt-10">
          <h5 className="mb-4 text-xs uppercase tracking-[0.1em] text-[var(--text-muted)] font-mono font-medium">
            {tNews("title")}
          </h5>
          <div className="max-w-md">
            <NewsletterForm />
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TANGER CODE. Made with ❤️ in Tangier.</span>
          <div className="social">
            <a href="#" className="icon-btn" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="icon-btn" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="icon-btn" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
          <span style={{ display: "flex", gap: 18 }}>
            {footerLegal.map((item) => (
              <Link key={item.key} href={item.href} style={{ display: "inline" }}>
                {tFooter(item.key)}
              </Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
