import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";
export async function generateMetadata(): Promise<Metadata> { return { title: "Confidentialite — TANGER CODE", description: "Politique de confidentialite de TANGER CODE." }; }
export default function PrivacyPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <LegalContent locale={params.locale as string} type="privacy" />;
}
