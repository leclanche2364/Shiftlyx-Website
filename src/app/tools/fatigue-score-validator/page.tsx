import type { Metadata } from "next";
import FatigueScoreContent from "./fatigue-score-content";

export const metadata: Metadata = {
  title: "Fatigue Score — Shiftlyx",
  description:
    "Understand your shift fatigue in numbers. Four measurable dimensions — consecutive days, night clusters, short turnarounds, circadian disruption — combine into one 0-100 score. Upload your rota and see yours now.",
  openGraph: {
    title: "Shiftlyx Fatigue Score — How Tired Are You, Really?",
    description:
      "Your fatigue isn't a feeling, it's physics. Four measurable dimensions — consecutive days, night clusters, short turnarounds, circadian disruption — combine into one 0-100 score. Upload your rota to see yours.",
    images: [
      {
        url: "/og-fatigue-score.jpg",
        width: 1200,
        height: 630,
        alt: "Shiftlyx Fatigue Score — 4 dimensions, one number",
      },
    ],
    siteName: "Shiftlyx",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiftlyx Fatigue Score — How Tired Are You, Really?",
    description:
      "Your fatigue isn't a feeling, it's physics. Four measurable dimensions — consecutive days, night clusters, short turnarounds, circadian disruption — combine into one 0-100 score. Upload your rota to see yours.",
    images: ["/og-fatigue-score.jpg"],
  },
};

export default function FatigueScorePage() {
  return <FatigueScoreContent />;
}
