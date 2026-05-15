import type { Metadata } from "next";
import DownloadContent from "./download-content";

export const metadata: Metadata = {
  title: "Download",
  description: "Download Shiftlyx free on iOS and Android — AI voice shift planner, fatigue tracking, and recovery coach for NHS staff and shift workers. Premium features from £3.99/month with free trial.",
  alternates: {
    canonical: "https://www.shiftlyx.com/download",
  },
  openGraph: {
    title: "Download Shiftlyx — AI Voice Shift Planner for NHS Workers",
    description: "Download Shiftlyx free for iOS and Android. Speak to plan your rota, track fatigue, and coordinate schedules. Built for shift workers.",
  },
};

export default function DownloadPage() {
  return <DownloadContent />;
}
