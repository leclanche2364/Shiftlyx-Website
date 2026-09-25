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
  // Next 16: `params` is a Promise. Typing it as a plain object and reading
  // `.token` off it synchronously yields undefined, which is why this page
  // only worked at all — the client component happens to re-parse the token
  // out of window.location.pathname, so the server prop being dead never
  // showed up. See node_modules/next/dist/docs/01-app/01-getting-started/
  // 03-layouts-and-pages.md.
  params: Promise<{ token: string }>;
};

export default async function PartnerInviteTokenPage({ params }: Props) {
  const { token: rawToken } = await params;
  return <PartnerInviteTokenContent token={(rawToken ?? "").trim()} />;
}
