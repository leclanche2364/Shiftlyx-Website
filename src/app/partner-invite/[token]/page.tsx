import type { Metadata } from "next";
import PartnerInviteTokenContent from "./partner-invite-token-content";

// The app generates partner-sync invites as path-form universal links:
//   https://www.shiftlyx.com/partner-invite/{inviteToken}
//
// WHY THIS ROUTE EXISTS (2026-08-17):
// Previously the website only had /partner-invite (no token), which read the
// token from a ?invite_token= query param. The app switched to the path form
// to match the crew-invite pattern, but the website had NO route for
// /partner-invite/{token} — so scanning the QR (which encodes the path form)
// returned a hard 404. iOS then resolved the universal link, saw the 404, and
// opened Safari showing "This page could not be found" instead of handing off
// to the installed app. This dynamic route returns 200 and performs the app
// handoff, mirroring the proven /join/[token] flow.

export const metadata: Metadata = {
  title: "Partner Sync invite",
  description:
    "You've been invited to sync your shifts with someone on Shiftlyx. Open the app to accept, or download Shiftlyx free on iOS and Android.",
  alternates: {
    canonical: "https://www.shiftlyx.com/partner-invite",
  },
  robots: { index: false, follow: false },
};

type Props = {
  params: { token: string };
};

export default function PartnerInviteTokenPage({ params }: Props) {
  const token = (params?.token ?? "").trim();
  return <PartnerInviteTokenContent token={token} />;
}
