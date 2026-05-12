import type { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About",
  description: "Shiftlyx was built by an ICU nurse who understands the toll shift work takes — a personal OS for shift workers, by someone who lives it.",
  openGraph: {
    title: "About — Shiftlyx",
    description: "The story behind Shiftlyx — built by an ICU nurse for shift workers.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
