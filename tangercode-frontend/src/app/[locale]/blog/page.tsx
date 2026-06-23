import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { fallbackBlogData } from "@/lib/blog-data";
import { BlogListContent } from "@/components/blog/BlogListContent";

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as string;
  const data = fallbackBlogData[locale] || fallbackBlogData.fr;
  return {
    title: data.title + " — TANGER CODE",
    description: data.subtitle,
    openGraph: { title: data.title + " — TANGER CODE", description: data.subtitle, type: "website" },
    twitter: { card: "summary_large_image", title: data.title + " — TANGER CODE", description: data.subtitle },
  };
}

export default function BlogPage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale as string;
  const data = fallbackBlogData[locale] || fallbackBlogData.fr;
  const jsonLd = { "@context": "https://schema.org", "@type": "Blog", name: data.title, description: data.subtitle, blogPost: data.details.map(d => ({ "@type": "BlogPosting", headline: d.title, url: `https://tangercode.com/${locale}/blog/${d.slug}` })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogListContent data={data} />
    </>
  );
}
