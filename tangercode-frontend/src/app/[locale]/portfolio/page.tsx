import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { fallbackPortfolioData } from "@/lib/portfolio-data";
import { PortfolioListContent } from "@/components/portfolio/PortfolioListContent";

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as string;
  const data = fallbackPortfolioData[locale] || fallbackPortfolioData.fr;
  return {
    title: data.title + " — TANGER CODE",
    description: data.subtitle,
    openGraph: { title: data.title + " — TANGER CODE", description: data.subtitle, type: "website" },
    twitter: { card: "summary_large_image", title: data.title + " — TANGER CODE", description: data.subtitle },
  };
}

export default function PortfolioPage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale as string;
  const data = fallbackPortfolioData[locale] || fallbackPortfolioData.fr;
  const jsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: data.title, description: data.subtitle, numberOfItems: data.projects.length, itemListElement: data.projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: `https://tangercode.com/${locale}${p.slug}` })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioListContent data={data} />
    </>
  );
}
