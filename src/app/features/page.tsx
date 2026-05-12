import type { Metadata } from "next";
import FeaturesContent from "./features-content";

export const metadata: Metadata = {
  title: "Features",
  description: "Shiftlyx features — fatigue tracking, AI shift planner, partner sync, recovery coach, and income estimator for shift workers.",
  openGraph: {
    title: "Features — Shiftlyx",
    description: "Full breakdown of Shiftlyx features — from fatigue scoring to AI voice planning.",
  },
};

export default function FeaturesPage() {
  return <FeaturesContent />;
}
