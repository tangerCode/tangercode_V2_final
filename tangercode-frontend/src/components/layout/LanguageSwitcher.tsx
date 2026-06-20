"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "fr", label: "FR", native: "Français" },
  { code: "en", label: "EN", native: "English" },
  { code: "ar", label: "AR", native: "العربية" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
        <Globe size={16} />
      </button>
      <div className="absolute right-0 top-full mt-2 hidden min-w-[130px] rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-1 shadow-lg group-hover:block">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
              locale === lang.code
                ? "bg-primary/10 text-primary"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span className="font-mono text-xs">{lang.label}</span>
            <span>{lang.native}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
