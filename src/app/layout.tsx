import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import GoogleAnalytics from "@/components/google-analytics";
import { siteConfig } from "@/config/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Shiftlyx",
    default: "Shiftlyx — AI Shift Planner for Shift Workers",
  },
  description:
    "Shiftlyx is an AI shift planner that analyses your rota, scores your fatigue, and helps you build safer work patterns. Plan smarter shifts with the AI Voice Planner.",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon-48x48.png",
  },
  openGraph: {
    title: "Shiftlyx — AI Shift Planner for Shift Workers",
    description:
      "Shiftlyx is an AI shift planner — analyse your rota, track fatigue, and plan smarter shifts with the AI Voice Planner.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Shiftlyx — AI Shift Planner for Shift Workers",
      },
    ],
    siteName: "Shiftlyx",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiftlyx — AI Shift Planner for Shift Workers",
    description:
      "Shiftlyx is an AI shift planner — analyse your rota, track fatigue, and plan smarter shifts with the AI Voice Planner.",
    images: ["/og-default.jpg"],
  },
  metadataBase: new URL("https://www.shiftlyx.com"),
  alternates: {
    canonical: "https://www.shiftlyx.com/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Shiftlyx",
      url: "https://www.shiftlyx.com",
      logo: "https://www.shiftlyx.com/app-icon.jpg",
      description:
        "Shiftlyx is an AI shift planner for shift workers — track fatigue, plan shifts around your life, and coordinate with your partner.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "admin@beemalinnovation.co.uk",
        contactType: "customer support",
      },
      sameAs: [
        "https://x.com/shiftlyx",
        "https://www.linkedin.com/company/shiftlyx",
        "https://www.tiktok.com/@shiftlyx",
        "https://www.instagram.com/shiftlyx/",
      ],
    },
    {
      "@type": "WebSite",
      name: "Shiftlyx",
      url: "https://www.shiftlyx.com",
      description:
        "An AI shift planner for shift workers — track fatigue, plan shifts, and coordinate with your partner.",
      inLanguage: "en-GB",
    },
    {
      "@type": "SoftwareApplication",
      name: "Shiftlyx",
      operatingSystem: "iOS 16+, Android 10+",
      applicationCategory: "HealthApplication",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "GBP",
        lowPrice: 0,
        highPrice: 18.99,
        offerCount: 3,
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            price: 0,
            priceCurrency: "GBP",
            description:
              "Fatigue Score, Shift Planner, Recovery Coach, Preference Learning",
          },
          {
            "@type": "Offer",
            name: "Premium Monthly",
            price: 3.99,
            priceCurrency: "GBP",
            priceInterval: "Monthly",
            description:
              "All features including AI Voice Planner, Partner Sync, Income Estimator",
          },
          {
            "@type": "Offer",
            name: "Day One Annual",
            price: 18.99,
            priceCurrency: "GBP",
            priceInterval: "Yearly",
            description:
              "All Premium features at 60% off — locks in launch price for life",
          },
        ],
      },
      description:
        "Shiftlyx is an AI shift planner for shift workers — track fatigue, plan shifts around your life, and coordinate with your partner.",
      url: "https://www.shiftlyx.com",
    },
  ],
};

const faqLd = siteConfig.faq.map((item) => ({
  "@type": "Question",
  name: item.q,
  acceptedAnswer: {
    "@type": "Answer",
    text: item.a,
  },
}));

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqLd,
};

const jsonLdBreadcrumb = {
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
      name: "Features",
      item: "https://www.shiftlyx.com/features",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Blog",
      item: "https://www.shiftlyx.com/blog",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt for Shiftlyx" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full LLMs.txt for Shiftlyx" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI.txt for Shiftlyx" />
      </head>
      <body className="min-h-full flex flex-col bg-noise bg-gradient-overlay">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
