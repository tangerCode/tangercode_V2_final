"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { mainNavItems } from "@/lib/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const t = useTranslations("nav");

  return (
    <>
      {/* Burger button - shown outside Sheet */}
      <button
        className="icon-btn burger"
        onClick={() => onOpenChange(true)}
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sheet drawer */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <SheetDescription className="sr-only">Navigation principale du site</SheetDescription>
          
          <div className="flex flex-col h-full p-6 bg-[var(--bg-base)]">
            {/* Logo + Close */}
            <div className="flex items-center justify-between mb-10">
              <span className="logo">
                <span className="bracket">&lt;</span>
                <span className="word">TANGER&nbsp;CODE</span>
                <span className="bracket">/&gt;</span>
              </span>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-2 mb-8">
              {mainNavItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="py-3 text-xl font-display font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--cyan)]"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            {/* Language + Theme */}
            <div className="flex items-center gap-3 mb-8">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="btn btn-primary btn-lg btn-block"
              onClick={() => onOpenChange(false)}
            >
              {t("startProject")}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
