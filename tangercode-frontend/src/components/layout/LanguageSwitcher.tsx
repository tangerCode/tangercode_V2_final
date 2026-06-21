"use client";

import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const labels: Record<string, string> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
};

const nextLocale: Record<string, "fr" | "en" | "ar"> = {
  fr: "en",
  en: "ar",
  ar: "fr",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const cycle = () => {
    const next = nextLocale[locale] || "fr";
    router.replace("/", { locale: next });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycle}
      className="gap-1.5 font-mono text-sm tracking-wider"
      aria-label="Changer de langue"
    >
      <Languages className="h-4 w-4" />
      {labels[locale] || "??"}
    </Button>
  );
}
