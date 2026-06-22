import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { fallbackHomeData, type HomeData } from "@/lib/home-data";
import { HomePage } from "@/components/home/HomePage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchHomeData(): Promise<HomeData | null> {
  try {
    const res = await fetch(`${API_URL}/public/site-config/`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    // API connected — use fallback for now since data structure differs
    return null;
  } catch {
    return null;
  }
}

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as string;
  const data = fallbackHomeData[locale] || fallbackHomeData.fr;

  return {
    title: "TANGER CODE — Développement web & mobile sur mesure",
    description: data.heroSubtitle,
    openGraph: {
      title: "TANGER CODE — Développement web & mobile sur mesure",
      description: data.heroSubtitle,
      type: "website",
      siteName: "TANGER CODE",
      locale: locale === "ar" ? "ar_MA" : locale === "en" ? "en_US" : "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: "TANGER CODE — Développement web & mobile sur mesure",
      description: data.heroSubtitle,
    },
  };
}

export default async function IndexPage({ params }: Props) {
  setRequestLocale(params.locale);

  const locale = params.locale as string;
  const apiData = await fetchHomeData();
  const data = apiData || fallbackHomeData[locale] || fallbackHomeData.fr;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "TANGER CODE",
        url: "https://tangercode.com",
        logo: "https://tangercode.com/logo.png",
        description: data.heroSubtitle,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tanger",
          addressCountry: "MA",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+212-6-00-00-00-00",
          contactType: "sales",
          availableLanguage: ["French", "English", "Arabic"],
        },
        sameAs: [
          "https://www.linkedin.com/company/tangercode",
          "https://www.instagram.com/tangercode",
        ],
      },
      {
        "@type": "WebSite",
        url: "https://tangercode.com",
        name: "TANGER CODE",
        description: data.heroSubtitle,
        inLanguage: locale,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://tangercode.com/{locale}/blog?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage data={data} />
    </>
  );
}
