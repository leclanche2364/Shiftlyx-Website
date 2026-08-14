import { ImageResponse } from "next/og";

// Dynamic Open Graph image for crew invite links.
//
// WHY THIS IS DYNAMIC:
//   https://shiftlyx.com/join/{token} used to render the site-wide default
//   card ("Shiftlyx — AI Shift Planner", og-default.jpg). This generator
//   fetches the crew preview and bakes the invite context straight into the
//   1200x630 card: WHO invited you, and WHICH crew.
//
// The preview-crew-invite edge function is open by design (the token in the
// URL is the auth) and only returns the crew name, creator name and member
// count — no member data leaks into the card.

// The real Shiftlyx app icon / brand mark. Served from the site's own public
// dir. ImageResponse fetches it by absolute URL at render time.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.shiftlyx.com";

interface CrewPreview {
  crew_name: string | null;
  creator_name: string | null;
  member_count: number;
}

// Fetch the crew preview through the site's OWN api route (/api/crew-preview)
// rather than calling the Supabase edge function directly from the edge
// runtime.
//
// WHY: /api/crew-preview (Node runtime) is PROVEN to return 200 with the real
// crew name for a real token. The edge runtime here does NOT reliably resolve
// process.env.SUPABASE_ANON_KEY, so a direct edge-fn call silently failed and
// the card rendered generic fallback text. Routing through the single working
// API seam removes the runtime/env ambiguity entirely.
async function fetchPreview(token: string): Promise<CrewPreview | null> {
  try {
    const res = await fetch(
      `${SITE_URL}/api/crew-preview?token=${encodeURIComponent(token)}`,
      {
        // The api route sets its own Supabase auth headers server-side.
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

// Cache the image briefly to avoid hammering the edge function on every
// preview render, but keep it fresh enough that a brand-new invite shows right.
export const revalidate = 60;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: { token: string };
}) {
  const token = (params?.token ?? "").trim();
  const preview = token ? await fetchPreview(token) : null;

  const crewName = preview?.crew_name || "a crew";
  const creatorName = preview?.creator_name || "Your teammate";
  const memberCount = preview?.member_count ?? 0;

  const memberLine =
    memberCount > 0 ? `${memberCount} member${memberCount === 1 ? "" : "s"}` : "New crew";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #6d28d9 135%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: real Shiftlyx logo + crew badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${SITE_URL}/app-icon.jpg`}
              alt="Shiftlyx"
              width={64}
              height={64}
              style={{ borderRadius: "16px" }}
            />
            <span
              style={{
                fontSize: "40px",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.5px",
              }}
            >
              Shiftlyx
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.12)",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "999px",
              padding: "12px 26px",
            }}
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "999px",
                background: "#34d399",
                display: "flex",
              }}
            />
            <span style={{ fontSize: "26px", color: "#ffffff", fontWeight: 800 }}>
              Crew Invite
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: "56px" }} />

        {/* Headline: WHO invited you */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: "44px",
              color: "#93c5fd",
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            {creatorName} invited you to join
          </span>
          <span
            style={{
              fontSize: "92px",
              color: "#ffffff",
              fontWeight: 900,
              lineHeight: 1.05,
              marginTop: "8px",
              letterSpacing: "-1px",
            }}
          >
            {crewName}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ height: "44px" }} />

        {/* Sub-line: member count + tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            color: "#e2e8f0",
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          <span>{memberLine}</span>
          <span
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "999px",
              background: "#64748b",
              display: "flex",
            }}
          />
          <span>Swap shifts · Plan outings · Coordinate days off</span>
        </div>
      </div>
    ),
    size
  );
}
