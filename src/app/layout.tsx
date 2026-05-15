import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import GoogleAnalytics from "@/components/google-analytics";
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
    default: "Shiftlyx — A Personal OS for Shift Workers",
  },
  description:
    "Your shift, your app, your OS — Shiftlyx helps healthcare shift workers plan smart shifts with voice AI, track fatigue across 4 dimensions, and sync with partners. Built for shift workers, not employers.",
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
    title: "Shiftlyx — A Personal OS for Shift Workers",
    description:
      "Your shift, your app, your OS — Shiftlyx helps healthcare shift workers track fatigue, plan shifts around their life, and coordinate with partners.",
    images: "/app-icon.jpg",
    type: "website",
    siteName: "Shiftlyx",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiftlyx — A Personal OS for Shift Workers",
    description:
      "Your shift, your app, your OS — Shiftlyx helps healthcare shift workers track fatigue, plan shifts around their life, and coordinate with partners.",
    images: "/app-icon.jpg",
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
        "Shiftlyx is a personal operating system for shift workers — track fatigue, plan shifts around your life, and coordinate with your partner.",
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
        "A personal operating system for shift workers — track fatigue, plan shifts, and coordinate with your partner.",
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
        "Shiftlyx is a personal operating system for shift workers — track fatigue, plan shifts around your life, and coordinate with your partner.",
      url: "https://www.shiftlyx.com",
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
