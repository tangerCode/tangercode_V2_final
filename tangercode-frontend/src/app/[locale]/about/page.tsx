import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

type Props = { params: { locale: string } };

export async function generateMetadata(_props: Props): Promise<Metadata> {
  return { title: "A propos — TANGER CODE", description: "Le developpeur derriere TANGER CODE, base a Tanger." };
}

export default function AboutPage({ params }: Props) {
  setRequestLocale(params.locale);
  const jsonLd = { "@context": "https://schema.org", "@type": "AboutPage", name: "A propos — TANGER CODE", description: "Le developpeur derriere TANGER CODE, base a Tanger." };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutContent locale={params.locale as string} />
    </>
  );
}
