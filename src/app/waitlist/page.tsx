import type { Metadata } from "next";
import WaitlistContent from "./waitlist-content";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description: "Join the Shiftlyx waitlist — fatigue score, AI voice shift planner, recovery coach, and more. Free to download and use. Premium from £3.99/month. For NHS nurses, paramedics, midwives, and all healthcare shift workers.",
  alternates: {
    canonical: "https://www.shiftlyx.com/waitlist",
  },
  openGraph: {
    title: "Shiftlyx Waitlist — AI Voice Shift Planning for Healthcare Workers",
    description: "Join the Shiftlyx waitlist and lock in your Day One price for life. Be first to try the AI voice shift planner. For nurses, doctors, paramedics and all healthcare shift workers.",
  },
};

export default function WaitlistPage() {
  return <WaitlistContent />;
}
