import type { MetadataRoute } from "next";

/**
 * NOTE: Cloudflare's managed Scrape Shield injects its OWN rules at
 * the TOP of the served robots.txt (visible via curl/Browser). Since
 * robots.txt uses first-match wins, Cloudflare's blocks on AI crawlers
 * (GPTBot, ClaudeBot, Google-Extended, etc.) take precedence over
 * the Allow rules below.
 *
 * Fix applied: next.config.ts now serves Content-Signal HTTP headers:
 *   Content-Signal: search=yes,ai-input=yes,ai-train=no,use=reference
 *
 * Cloudflare respects origin-served Content-Signal headers instead of
 * its managed defaults. If crawlers are still blocked:
 * 1. Disable "AI Content-Signal" in Cloudflare Dashboard > Scrape Shield
 * 2. OR switch DNS to grey cloud (DNS-only) so raw Vercel robots.txt serves
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Explicitly allow all major AI crawlers
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      {
        userAgent: "Applebot",
        allow: "/",
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
      },
      {
        userAgent: "ImagesiftBot",
        allow: "/",
      },
      // Block Common Crawl (used for training, not search)
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: "https://www.shiftlyx.com/sitemap.xml",
  };
}
