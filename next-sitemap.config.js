/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.shiftlyx.com",
  generateRobotsTxt: false, // We already have a custom robots.txt
  generateIndexSitemap: false,
  exclude: [
    "/partner-invite",
    "/api/*",
    "/apple-icon.png",
    "/icon.png",
    "/favicon*",
    "/robots.txt",
    "/sitemap.xml",
    "/llms.txt",
    "/llms-full.txt",
    "/ai.txt",
    "/delete-account",
  ],
  transform: async (config, path) => {
    // Prioritise important pages
    const priorities = {
      "/": 1.0,
      "/waitlist": 0.9,
      "/features": 0.8,
      "/download": 0.8,
      "/blog": 0.7,
      "/about": 0.5,
      "/privacy": 0.4,
      "/terms": 0.4,
      "/tools": 0.6,
    };

    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority: priorities[path] || 0.5,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    // All 15 blog posts (from siteConfig.blog.articles)
    const blogs = [
      "fatigue-score-explained",
      "night-work-and-your-body-clock",
      "real-cost-of-shift-work",
      "partner-sync-guide",
      "recovery-beyond-the-coffee",
      "how-voice-planning-works",
      "maximise-annual-leave-shift-workers-2026",
      "hidden-cost-short-turnaround-shifts",
      "night-shift-survival-guide",
      "fatigue-warning-signs-shift-workers",
      "hse-fatigue-guide-2026",
      "this-is-bigger-than-burnout",
      "why-shift-scheduling-tools-ignore-fatigue",
      "double-shifts-cortisol-inversion",
      "permanent-circadian-misalignment",
    ];
    return blogs.map((slug) => ({
      loc: `/blog/${slug}`,
      changefreq: "monthly",
      priority: 0.6,
      lastmod: new Date().toISOString(),
    }));
  },
  outDir: "public",
};
