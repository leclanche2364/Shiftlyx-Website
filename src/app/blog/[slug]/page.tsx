import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BlogPostContent from "./blog-post-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = siteConfig.blog.articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for doesn't exist or has been moved.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `https://www.shiftlyx.com/blog/${slug}`,
    },
    openGraph: {
      title: `${article.title} — Shiftlyx`,
      description: article.excerpt,
      images: "/app-icon.jpg",
      type: "article",
      publishedTime: article.date,
    },
    twitter: {
      title: `${article.title} — Shiftlyx`,
      description: article.excerpt,
      images: "/app-icon.jpg",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return <BlogPostContent slug={slug} />;
}
