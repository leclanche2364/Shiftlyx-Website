import type { Metadata } from "next";
import FeaturesContent from "./features-content";

export const metadata: Metadata = {
  title: "Features",
  description: "Shiftlyx features — AI Voice Planner, Fatigue Score (0-100), 5 Shift Strategies, Partner Sync (Premium), Recovery Coach, and Income Estimator for NHS shift workers. The voice shift planning app.",
  alternates: {
    canonical: "https://www.shiftlyx.com/features",
  },
  openGraph: {
    title: "Shiftlyx Features — AI Voice Shift Planner, Fatigue Score & More",
    description: "Full breakdown of every Shiftlyx feature: just speak to plan your month, track fatigue across 4 dimensions, coordinate with your partner, and recover smarter.",
  },
};

export default function FeaturesPage() {
  return <FeaturesContent />;
}
