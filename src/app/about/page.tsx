import type { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About",
  description: "Shiftlyx was built by shift workers who understand the toll — an AI shift planner for healthcare shift workers, by people who live it. Fatigue tracking and AI voice planning.",
  alternates: {
    canonical: "https://www.shiftlyx.com/about",
  },
  openGraph: {
    title: "About Shiftlyx — AI Voice Shift Planner Built by an ICU Nurse",
    description: "Built by NHS shift workers who couldn't find a tool that understood fatigue. The story behind Shiftlyx, our philosophy, and our privacy-first commitment.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
