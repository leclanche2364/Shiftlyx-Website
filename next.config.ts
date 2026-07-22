import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure AI-crawlable routes are statically generated where possible
  outputFileTracingRoot: process.cwd(),

  // Enable compression for faster delivery to crawlers
  compress: true,

  // Increase header size limit for structured data scripts
  serverExternalPackages: [],

  // Headers for better crawl behavior
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "all",
          },
          // Cloudflare Content-Signal headers
          // These tell Cloudflare's AI Content-Signal feature NOT to inject
          // its own managed robots.txt rules that block AI crawlers.
          // Per Cloudflare docs: origin-served Content-Signal takes precedence
          // over managed defaults.
          {
            key: "Content-Signal",
            value: "search=yes,ai-input=yes,ai-train=no,use=reference",
          },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/llms-full.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/ai.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
        ],
      },
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=7200",
          },
        ],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=7200",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
