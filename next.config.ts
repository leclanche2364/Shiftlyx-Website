import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure AI-crawlable routes are statically generated where possible
  outputFileTracingRoot: process.cwd(),

  // Enable compression for faster delivery to crawlers
  compress: true,

  // Increase header size limit for structured data scripts
  serverExternalPackages: [],

  // The waitlist page is retired now that the app has launched. 301 it to the
  // download page so store CTA replaces the old signup barrier, and search
  // engines consolidate any waitlist link equity onto /download.
  async redirects() {
    return [
      {
        source: "/waitlist",
        destination: "/download",
        permanent: true,
      },
      // Catch any /waitlist/* subpaths just in case one was ever shared.
      {
        source: "/waitlist/:path*",
        destination: "/download",
        permanent: true,
      },
    ];
  },

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
          // Link headers (RFC 8288) for agent/AI discovery
          // Advertise AI-readable content endpoints to autonomous agents
          {
            key: "Link",
            value: [
              "</llms.txt>; rel=\"alternate\"; type=\"text/plain\"; title=\"Shiftlyx AI Summary\"",
              "</llms-full.txt>; rel=\"alternate\"; type=\"text/plain\"; title=\"Shiftlyx Full AI Content\"",
              "</ai.txt>; rel=\"ai-txt\"; type=\"text/plain\"; title=\"AI Crawling Preferences\"",
              "</sitemap.xml>; rel=\"sitemap\"; type=\"application/xml\"",
            ].join(", "),
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
