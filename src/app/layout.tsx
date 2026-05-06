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
  title: "Shiftlyx — A Personal OS for Shift Workers",
  description:
    "Shiftlyx helps NHS nurses and healthcare workers track fatigue, plan shifts around their life, and coordinate with partners.",
  openGraph: {
    title: "Shiftlyx — A Personal OS for Shift Workers",
    description:
      "Shiftlyx helps NHS nurses and healthcare workers track fatigue, plan shifts around their life, and coordinate with partners.",
    type: "website",
  },
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
      <body className="min-h-full flex flex-col bg-noise bg-gradient-overlay">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
