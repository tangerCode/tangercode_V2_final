import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fallbackBlogData } from "@/lib/blog-data";
import { BlogPostContent } from "@/components/blog/BlogPostContent";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as string;
  const data = fallbackBlogData[locale] || fallbackBlogData.fr;
  const post = data.details.find((p) => p.slug === params.slug);
  if (!post) return { title: "Article — TANGER CODE" };
  return { title: `${post.title} — TANGER CODE`, description: post.excerpt, openGraph: { title: `${post.title} — TANGER CODE`, description: post.excerpt, type: "article" } };
}

export default function BlogPostPage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale as string;
  const data = fallbackBlogData[locale] || fallbackBlogData.fr;
  const post = data.details.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const jsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: post.date, author: { "@type": "Person", name: post.authorName }, url: `https://tangercode.com/${locale}/blog/${post.slug}` };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostContent post={post} data={data} />
    </>
  );
}
