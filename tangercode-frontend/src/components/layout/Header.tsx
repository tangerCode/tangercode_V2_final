"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useScroll } from "@/hooks/useScroll";
import { mainNavItems } from "@/lib/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export function Header() {
  const t = useTranslations("nav");
  const { isScrolled } = useScroll(20);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className={`site-header${isScrolled ? " scrolled" : ""}`}>
        <div className="container nav">
          <Link href="/" className="logo" aria-label="TANGER CODE">
            <span className="bracket">&lt;</span>
            <span className="word">TANGER&nbsp;CODE</span>
            <span className="bracket">/&gt;</span>
          </Link>

          <nav className="nav-links desktop" aria-label="Navigation principale">
            {mainNavItems.map((item) => (
              <Link key={item.key} href={item.href}>
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/contact" className="btn btn-primary btn-sm desktop-only">
              {t("startProject")}
            </Link>
            <button
              className="icon-btn burger"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-drawer${mobileOpen ? " open" : ""}`} aria-hidden={!mobileOpen}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="logo">
            <span className="bracket">&lt;</span>
            <span className="word">TANGER&nbsp;CODE</span>
            <span className="bracket">/&gt;</span>
          </span>
          <button
            className="icon-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="nav-links">
          {mainNavItems.map((item) => (
            <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)}>
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="btn btn-primary btn-lg btn-block"
          style={{ marginTop: 28 }}
          onClick={() => setMobileOpen(false)}
        >
          {t("startProject")}
        </Link>
      </div>
    </>
  );
}
