import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
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
    "Shiftlyx helps NHS nurses and healthcare workers track fatigue, plan shifts around their life, and coordinate with partners.",
  icons: {
    icon: "/app-icon.jpg",
    apple: "/app-icon.jpg",
  },
  openGraph: {
    title: "Shiftlyx — A Personal OS for Shift Workers",
    description:
      "Shiftlyx helps NHS nurses and healthcare workers track fatigue, plan shifts around their life, and coordinate with partners.",
    images: "/app-icon.jpg",
    type: "website",
    siteName: "Shiftlyx",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiftlyx — A Personal OS for Shift Workers",
    description:
      "Shiftlyx helps NHS nurses and healthcare workers track fatigue, plan shifts around their life, and coordinate with partners.",
    images: "/app-icon.jpg",
  },
  metadataBase: new URL("https://shiftlyx.com"),
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shiftlyx",
  url: "https://shiftlyx.com",
  logo: "https://shiftlyx.com/app-icon.jpg",
  description:
    "Shiftlyx is a personal operating system for shift workers — track fatigue, plan shifts around your life, and coordinate with your partner.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "admin@beemalinnovation.co.uk",
    contactType: "customer support",
  },
  sameAs: [],
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
