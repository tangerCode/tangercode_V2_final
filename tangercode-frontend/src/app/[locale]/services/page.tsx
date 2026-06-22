import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { fallbackServicesData } from "@/lib/services-data";
import { ServicesListContent } from "@/components/services/ServicesListContent";

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as string;
  const data = fallbackServicesData[locale] || fallbackServicesData.fr;
  return {
    title: data.title + " — TANGER CODE",
    description: data.subtitle,
    openGraph: { title: data.title + " — TANGER CODE", description: data.subtitle, type: "website" },
    twitter: { card: "summary_large_image", title: data.title + " — TANGER CODE", description: data.subtitle },
  };
}

export default function ServicesPage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale as string;
  const data = fallbackServicesData[locale] || fallbackServicesData.fr;
  const jsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: data.title, description: data.subtitle, numberOfItems: data.services.length, itemListElement: data.services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `https://tangercode.com/${locale}/services/${s.slug}` })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServicesListContent data={data} />
    </>
  );
}
