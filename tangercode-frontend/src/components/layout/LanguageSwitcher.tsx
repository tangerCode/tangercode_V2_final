"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const langs = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const switchLang = (code: string) => {
    if (code !== locale) {
      router.replace(pathname, { locale: code as "fr" | "en" | "ar" });
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className={`lang${open ? " open" : ""}`}>
      <button
        className="icon-btn"
        onClick={() => setOpen(!open)}
        aria-label="Changer de langue"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      </button>
      <div className="lang-menu">
        {langs.map((l) => (
          <a
            key={l.code}
            href="#"
            className={l.code === locale ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              switchLang(l.code);
            }}
          >
            {l.flag} {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
