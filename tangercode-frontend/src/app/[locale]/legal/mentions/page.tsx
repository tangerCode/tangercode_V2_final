import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";
export async function generateMetadata(): Promise<Metadata> { return { title: "Mentions legales — TANGER CODE", description: "Mentions legales de TANGER CODE." }; }
export default function MentionsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <LegalContent locale={params.locale as string} type="mentions" />;
}
