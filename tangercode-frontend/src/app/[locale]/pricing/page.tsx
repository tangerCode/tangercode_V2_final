import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { fallbackServicesData } from "@/lib/services-data";
import { PricingContent } from "@/components/pricing/PricingContent";
import type { PricingTierData } from "@/lib/home-data";

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = fallbackServicesData[params.locale] || fallbackServicesData.fr;
  return {
    title: "Tarifs — TANGER CODE",
    description: data.subtitle,
    openGraph: { title: "Tarifs — TANGER CODE", description: data.subtitle, type: "website" },
    twitter: { card: "summary_large_image", title: "Tarifs — TANGER CODE", description: data.subtitle },
  };
}

export default function PricingPage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale as string;
  const data = fallbackServicesData[locale] || fallbackServicesData.fr;

  const allOffers = data.details.flatMap((svc) =>
    svc.pricingTiers
      .filter((t: PricingTierData) => t.price)
      .map((t: PricingTierData) => ({
        "@type": "Offer",
        name: `${t.name} — ${svc.title}`,
        price: t.price.replace(/\D/g, ""),
        priceCurrency: "MAD",
        description: t.description,
        offeredBy: { "@type": "Organization", name: "TANGER CODE" },
      })),
  );

  const jsonLd = { "@context": "https://schema.org", "@graph": allOffers };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PricingContent locale={locale} />
    </>
  );
}
