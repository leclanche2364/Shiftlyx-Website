import type { Metadata } from "next";
import WaitlistContent from "./waitlist-content";

export const metadata: Metadata = {
  title: "Waitlist",
  description: "Join the Shiftlyx waitlist for early access — lock in your Day One Annual price (£18.99/year, 60% off forever) and be first to try AI voice shift planning for NHS workers.",
  alternates: {
    canonical: "https://www.shiftlyx.com/waitlist",
  },
  openGraph: {
    title: "Shiftlyx Waitlist — Early Access AI Voice Shift Planning",
    description: "Join the Shiftlyx waitlist and lock in your Day One Annual price for life. Be first to try the app. For NHS nurses, paramedics, and shift workers.",
  },
};

export default function WaitlistPage() {
  return <WaitlistContent />;
}
