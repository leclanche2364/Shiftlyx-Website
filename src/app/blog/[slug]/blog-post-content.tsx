"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  "Fatigue & Recovery": "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  "Rota Planning": "bg-blue-50 text-blue-700 border-blue-200/50",
  "NHS Life": "bg-purple-50 text-purple-700 border-purple-200/50",
  "Product & Updates": "bg-amber-50 text-amber-700 border-amber-200/50",
};

export default function BlogPostContent({ slug }: { slug: string }) {

  const article = siteConfig.blog.articles.find((a) => a.slug === slug);
  const relatedArticles = siteConfig.blog.articles
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  if (!article) {
    return (
      <div className="pt-20 pb-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
            Article not found
          </h1>
          <p className="text-[#475569] mb-6">
            The article you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const articleJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        author: {
          "@type": "Organization",
          name: "Shiftlyx",
        },
        publisher: {
          "@type": "Organization",
          name: "Shiftlyx",
          url: "https://shiftlyx.com",
        },
      }
    : null;

  return (
    <div>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}

      {/* Back link */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#2563eb] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className={cn("mb-4", categoryColors[article.category])}>
            {article.category}
          </Badge>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-[#94a3b8] mb-8">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          className="prose prose-slate max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {article.content ? (
            <div className="text-[#475569] leading-relaxed space-y-6">
              {article.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="font-heading text-xl font-bold text-foreground mt-8 mb-4"
                    >
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3
                      key={i}
                      className="font-heading text-lg font-semibold text-foreground mt-6 mb-3"
                    >
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <li key={i} className="text-[#475569] ml-4">
                      {line.replace("- ", "")}
                    </li>
                  );
                }
                if (line.trim() === "") {
                  return <div key={i} className="h-2" />;
                }
                return (
                  <p key={i} className="text-[#475569] leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-[#94a3b8]">
                Full article content coming soon.
              </p>
            </div>
          )}
        </motion.div>
      </article>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-b from-[#eff6ff] to-transparent border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
            Try Shiftlyx for free
          </h2>
          <p className="text-[#475569] mb-6 max-w-lg mx-auto">
            Join the waitlist and be first to try the personal OS for shift workers.
          </p>
          <Link href="/waitlist">
            <Button
              size="lg"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold shadow-lg shadow-amber-200/50"
            >
              Join the waitlist →
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-bold text-foreground mb-8">
              Related articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related, i) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/blog/${related.slug}`}
                    className="block group h-full"
                  >
                    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 h-full hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563eb]/20 transition-all duration-300 flex flex-col">
                      <Badge className={cn("mb-3 self-start", categoryColors[related.category])}>
                        {related.category}
                      </Badge>
                      <h3 className="font-heading text-sm font-semibold text-foreground mb-2 group-hover:text-[#2563eb] transition-colors flex-1">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                        <span>{related.date}</span>
                        <span>·</span>
                        <span>{related.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
