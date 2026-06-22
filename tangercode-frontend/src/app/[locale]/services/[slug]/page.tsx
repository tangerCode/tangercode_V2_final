import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fallbackServicesData } from "@/lib/services-data";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";

const SLUGS = ["sites-web", "plateformes-web", "erp-sur-mesure", "applications-mobiles"];

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as string;
  const pageData = fallbackServicesData[locale] || fallbackServicesData.fr;
  const svc = pageData.details.find((s) => s.slug === params.slug);
  if (!svc) return { title: "Service · TANGER CODE" };
  return {
    title: `${svc.title} — TANGER CODE`,
    description: svc.shortDesc,
    openGraph: { title: `${svc.title} — TANGER CODE`, description: svc.shortDesc, type: "website" },
  };
}

export default function ServiceDetailPage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale as string;
  const pageData = fallbackServicesData[locale] || fallbackServicesData.fr;
  const svc = pageData.details.find((s) => s.slug === params.slug);
  if (!svc) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.title,
    description: svc.shortDesc,
    provider: { "@type": "Organization", name: "TANGER CODE", url: "https://tangercode.com" },
    areaServed: { "@type": "Country", name: "Morocco" },
    offers: svc.pricingTiers.filter((t) => t.price).map((t) => ({
      "@type": "Offer", name: t.name, price: t.price.replace(/\D/g, ""), priceCurrency: "MAD", description: t.description,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceDetailContent service={svc} />
    </>
  );
}
