import type { Metadata, ResolvingMetadata } from "next";
import JoinContent from "../join-content";

// Supabase project (public values)
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://otzyqghfozevhhrcewnm.supabase.co";

interface CrewPreview {
  crew_name: string | null;
  creator_name: string | null;
  member_count: number;
}

async function fetchPreview(token: string): Promise<CrewPreview | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/preview-crew-invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      crew_name: data?.crew_name ?? null,
      creator_name: data?.creator_name ?? null,
      member_count: data?.member_count ?? 0,
    };
  } catch {
    return null;
  }
}

type Props = {
  params: { token: string };
};

// Dynamic metadata built from the crew preview so the WhatsApp/Telegram/iMessage
// link preview shows "X invited you to join {crew}" instead of the generic
// site-wide Shiftlyx tagline.
export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const token = (params?.token ?? "").trim();
  const preview = token ? await fetchPreview(token) : null;

  if (!preview) {
    return {
      title: "Join your crew",
      description:
        "You've been invited to a Shiftlyx crew. Open the app to accept, or download Shiftlyx free on iOS and Android.",
      robots: { index: false, follow: false },
    };
  }

  const crewName = preview.crew_name || "your crew";
  const creatorName = preview.creator_name;
  const memberCount = preview.member_count;

  const title = creatorName
    ? `${creatorName} invited you to join ${crewName}`
    : `You're invited to join ${crewName}`;

  const description =
    (memberCount > 0
      ? `${memberCount} member${memberCount === 1 ? "" : "s"} · `
      : "") + "Swap shifts, coordinate days off, and plan as a crew with Shiftlyx.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Shiftlyx",
      type: "website",
      url: `https://www.shiftlyx.com/join/${token}`,
      // CRITICAL: Next.js merges route metadata with the root layout's
      // openGraph, and the layout declares `og-default.jpg`. If we do NOT set
      // images here, the merged og:image falls back to that generic card and
      // the whole point of this dynamic OG is lost. Pin it to the route's own
      // generated opengraph-image so crawlers get the crew-invite card.
      images: [
        {
          url: `https://www.shiftlyx.com/join/${token}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://www.shiftlyx.com/join/${token}/opengraph-image`],
    },
    robots: { index: false, follow: false },
  };
}

export default async function JoinTokenPage({ params }: Props) {
  // The auto-redirect + handoff logic lives in JoinContent and stays untouched.
  const token = (params?.token ?? "").trim();
  const preview = token ? await fetchPreview(token) : null;
  return <JoinContent token={token} preview={preview} />;
}
