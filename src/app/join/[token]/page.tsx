import type { Metadata, ResolvingMetadata } from "next";
import JoinContent from "../join-content";

interface CrewPreview {
  crew_name: string | null;
  creator_name: string | null;
  member_count: number;
}

// Fetch the crew preview through the site's OWN api route (/api/crew-preview)
// rather than calling the Supabase edge function directly.
//
// WHY: the edge function demands apikey + Authorization headers AND the env
// vars differ between runtimes. The /api/crew-preview route (Node runtime)
// is PROVEN to work — it returns 200 with the real crew name for a real
// token. generateMetadata + opengraph-image run in the edge runtime where
// process.env.ANON_KEY resolution is unreliable, so their direct edge-fn
// fetch silently failed and fell back to generic text. Routing all three
// through the single working API seam removes that ambiguity.
async function fetchPreview(token: string): Promise<CrewPreview | null> {
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.shiftlyx.com";
    const res = await fetch(
      `${origin}/api/crew-preview?token=${encodeURIComponent(token)}`,
      {
        // Reuse the edge-function fetch pattern; the api route sets its own
        // auth headers server-side.
        signal: AbortSignal.timeout(4000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.error) return null;
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
  params: Promise<{ token: string }>;
};

// Dynamic metadata built from the crew preview so the WhatsApp/Telegram/iMessage
// link preview shows "X invited you to join {crew}" instead of the generic
// site-wide Shiftlyx tagline.
export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  // Next.js 16: `params` is a Promise. Reading `.token` off it synchronously
  // yields undefined, which silently forced the generic fallback card.
  const { token: rawToken } = await params;
  const token = (rawToken ?? "").trim();
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
          url: `https://www.shiftlyx.com/join/${token}/og.png`,
          width: 600,
          height: 315,
          alt: `${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://www.shiftlyx.com/join/${token}/og.png`],
    },
    robots: { index: false, follow: false },
  };
}

export default async function JoinTokenPage({ params }: Props) {
  // The auto-redirect + handoff logic lives in JoinContent and stays untouched.
  // Next.js 16: `params` is a Promise. Reading `.token` off it synchronously
  // yields undefined, which silently forced the generic fallback card.
  const { token: rawToken } = await params;
  const token = (rawToken ?? "").trim();
  const preview = token ? await fetchPreview(token) : null;
  return <JoinContent token={token} preview={preview} />;
}
