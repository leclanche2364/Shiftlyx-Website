import type { Metadata } from "next";
import DownloadContent from "./download-content";

export const metadata: Metadata = {
  title: "Download",
  description: "Download Shiftlyx for iOS and Android — free fatigue tracking, shift planning, and partner sync for NHS shift workers.",
  openGraph: {
    title: "Download — Shiftlyx",
    description: "Download Shiftlyx free for iOS and Android.",
  },
};

export default function DownloadPage() {
  return <DownloadContent />;
}
