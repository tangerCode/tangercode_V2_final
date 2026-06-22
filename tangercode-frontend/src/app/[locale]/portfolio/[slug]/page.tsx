import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fallbackPortfolioData } from "@/lib/portfolio-data";
import { ProjectDetailContent } from "@/components/portfolio/ProjectDetailContent";

const SLUGS = ["atlas-market","medina-erp","rihlago","detroit-avocats","mizan","zellige-store","cap-spartel","soukconnect","foodtruck-ma","riad-booking","gestapro","edutanger"];

export function generateStaticParams() { return SLUGS.map((s) => ({ slug: s })); }

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as string;
  const data = fallbackPortfolioData[locale] || fallbackPortfolioData.fr;
  const proj = data.details.find((p) => p.slug === params.slug);
  if (!proj) return { title: "Project — TANGER CODE" };
  return { title: `${proj.title} — ${proj.client} — TANGER CODE`, description: proj.defi[0].slice(0, 160), openGraph: { title: `${proj.title} — TANGER CODE`, description: proj.defi[0].slice(0, 160), type: "article" } };
}

export default function ProjectDetailPage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale as string;
  const data = fallbackPortfolioData[locale] || fallbackPortfolioData.fr;
  const proj = data.details.find((p) => p.slug === params.slug);
  if (!proj) notFound();

  const jsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", name: proj.title, description: proj.defi[0], dateCreated: `${proj.year}`, creator: { "@type": "Organization", name: "TANGER CODE" } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectDetailContent project={proj} />
    </>
  );
}
