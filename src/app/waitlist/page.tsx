import type { Metadata } from "next";
import WaitlistContent from "./waitlist-content";

export const metadata: Metadata = {
  title: "Waitlist",
  description: "Join the Shiftlyx waitlist for early access — lock in your Day One Annual price and be first to try the personal OS for shift workers.",
  openGraph: {
    title: "Waitlist — Shiftlyx",
    description: "Join the Shiftlyx waitlist and lock in your Day One Annual price.",
  },
};

export default function WaitlistPage() {
  return <WaitlistContent />;
}
