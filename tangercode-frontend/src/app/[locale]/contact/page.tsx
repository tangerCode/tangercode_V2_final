import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
export async function generateMetadata(): Promise<Metadata> { return { title: "Contact — TANGER CODE", description: "Contactez TANGER CODE pour discuter de votre projet." }; }
export default function ContactPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact — TANGER CODE" }) }} /><ContactPageContent locale={params.locale as string} /></>;
}
