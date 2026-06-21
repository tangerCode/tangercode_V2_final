"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useScroll } from "@/hooks/useScroll";
import { mainNavItems } from "@/lib/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const t = useTranslations("nav");
  const { isScrolled } = useScroll(20);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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
          <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
        </div>
      </div>
    </header>
  );
}
