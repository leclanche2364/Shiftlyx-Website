import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import BlogPostContent from "./blog-post-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return siteConfig.blog.articles.map((article) => ({
    slug: article.slug,
  }));
}

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
      images: [
        {
          url: "/og-default.jpg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.date,
    },
    twitter: {
      title: `${article.title} — Shiftlyx`,
      description: article.excerpt,
      images: ["/og-default.jpg"],
    },
  };
}

function blogPostJsonLd(article: NonNullable<typeof siteConfig.blog.articles[0]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "Shiftlyx",
      url: "https://www.shiftlyx.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Shiftlyx",
      logo: {
        "@type": "ImageObject",
        url: "https://www.shiftlyx.com/app-icon.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.shiftlyx.com/blog/${article.slug}`,
    },
  };
}

function breadcrumbJsonLd(article: NonNullable<typeof siteConfig.blog.articles[0]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.shiftlyx.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.shiftlyx.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://www.shiftlyx.com/blog/${article.slug}`,
      },
    ],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = siteConfig.blog.articles.find((a) => a.slug === slug);

  return (
    <>
      {article && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd(article)) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(article)) }}
          />
        </>
      )}
      <BlogPostContent slug={slug} />
    </>
  );
}
