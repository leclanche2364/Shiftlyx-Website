import type { Metadata } from "next";
import JoinContent from "./join-content";

export const metadata: Metadata = {
  title: "Join your crew",
  description:
    "You've been invited to a Shiftlyx crew. Open the app to accept, or download Shiftlyx free on iOS and Android.",
  alternates: {
    canonical: "https://shiftlyx.com/join",
  },
};

export default function JoinPage() {
  return <JoinContent />;
}
