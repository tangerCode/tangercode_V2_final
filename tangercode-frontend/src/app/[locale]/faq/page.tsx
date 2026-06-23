import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { FaqContent } from "@/components/faq/FaqContent";
export async function generateMetadata(): Promise<Metadata> { return { title: "FAQ — TANGER CODE", description: "Questions frequentes sur nos services et notre facon de travailler." }; }
export default function FaqPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [] }) }} /><FaqContent locale={params.locale as string} /></>;
}
