"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ChevronRight, Calendar, Clock } from "lucide-react";
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

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const featuredArticle = siteConfig.blog.articles.find((a) => a.featured);
  const otherArticles = siteConfig.blog.articles.filter((a) => !a.featured);

  const filteredArticles = (articles: typeof siteConfig.blog.articles) =>
    articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !activeCategory || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

  const filteredFeatured = featuredArticle
    ? filteredArticles([featuredArticle])[0]
    : null;
  const filteredOthers = filteredArticles(otherArticles);

  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Blog
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Shift Workers&apos; Guide to Fatigue, Rotas & Recovery
          </h1>
          <p className="text-lg text-[#475569] max-w-3xl leading-relaxed">
            Practical advice from people who&apos;ve worked nights. No fluff, no sponsored content — just evidence-based guides written by shift workers for shift workers.
          </p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2e8f0] bg-white text-sm text-foreground placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]/30 transition-all"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                  !activeCategory
                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                )}
              >
                All
              </button>
              {siteConfig.blog.categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === cat.name ? null : cat.name
                    )
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    activeCategory === cat.name
                      ? "bg-[#2563eb] text-white border-[#2563eb]"
                      : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Featured Article */}
          {filteredFeatured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <Link href={`/blog/${filteredFeatured.slug}`} className="block group">
                <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563eb]/20 transition-all duration-300">
                  <div className="p-6 sm:p-8">
                    <Badge className={cn("mb-3", categoryColors[filteredFeatured.category])}>
                      {filteredFeatured.category}
                    </Badge>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-[#2563eb] transition-colors">
                      {filteredFeatured.title}
                    </h2>
                    <p className="text-[#475569] mb-4 leading-relaxed">
                      {filteredFeatured.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#94a3b8]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {filteredFeatured.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {filteredFeatured.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Article Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOthers.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/blog/${article.slug}`} className="block group h-full">
                  <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 h-full hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563eb]/20 transition-all duration-300 flex flex-col">
                    <Badge className={cn("mb-3 self-start", categoryColors[article.category])}>
                      {article.category}
                    </Badge>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-2 group-hover:text-[#2563eb] transition-colors flex-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[#475569] mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-[#94a3b8]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">{article.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{article.readTime}</span>
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#2563eb] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredOthers.length === 0 && !filteredFeatured && (
            <div className="text-center py-16">
              <p className="text-[#475569]">No articles found matching your search.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* Pagination (visual) */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={cn(
                  "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                  page === 1
                    ? "bg-[#2563eb] text-white"
                    : "text-[#475569] hover:bg-[#f1f5f9]"
                )}
              >
                {page}
              </button>
            ))}
            <span className="text-[#94a3b8] text-sm ml-2">Page 1 of 3</span>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Try Shiftlyx for free
          </h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Get Shiftlyx free during early access.
          </p>
          <Link href="/download">
            <Button
              size="lg"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50"
            >
              Get early access →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
