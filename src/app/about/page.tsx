import type { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About",
  description: "Shiftlyx was built by an ICU nurse who understands the toll shift work takes — a personal OS for shift workers, by someone who lives it. NHS-grade fatigue tracking and AI voice planning.",
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
