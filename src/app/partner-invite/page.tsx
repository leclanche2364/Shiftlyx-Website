import type { Metadata } from "next";
import PartnerInviteContent from "./partner-invite-content";

export const metadata: Metadata = {
  title: "Partner Sync — Shiftlyx",
  description:
    "Sync your shift schedules with your partner. QR code or tap-to-connect. See combined rotas, avoid overlapping heavy days, and plan time off together.",
  alternates: {
    canonical: "https://www.shiftlyx.com/partner-invite",
  },
  openGraph: {
    title: "Sync your shifts with your partner — Shiftlyx Partner Sync",
    description:
      "Two rotas. One life. One calendar. QR code instant connect. Childcare-first mode. Shared events.",
    images: [
      {
        url: "https://www.shiftlyx.com/icon.png",
        width: 256,
        height: 256,
        alt: "Shiftlyx Partner Sync",
      },
    ],
  },
};

export default function PartnerInvitePage() {
  return <PartnerInviteContent />;
}
