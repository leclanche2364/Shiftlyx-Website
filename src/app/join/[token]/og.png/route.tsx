import { ImageResponse } from "next/og";

// Crew-invite Open Graph card, served at a URL ending in `.png`.
//
// WHY A ROUTE HANDLER INSTEAD OF opengraph-image.tsx:
//   1. WhatsApp is fussy about image URLs with no file extension. The old
//      `/join/{token}/opengraph-image` URL rendered fine in Telegram and
//      iMessage but WhatsApp showed a text-only card.
//   2. A route handler lets us return a real Response with an explicit
//      Content-Length. WhatsApp will not build a thumbnail from a chunked
//      stream, and `ImageResponse` streams by default.
//
// Rendered at 600x315 (still 1.91:1, still a `summary_large_image`) rather
// than 1200x630: ~33KB instead of ~100KB, with no visible loss at the size
// these cards are actually displayed.

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shiftlyx.com";

const size = { width: 600, height: 315 };

interface CrewPreview {
  crew_name: string | null;
  creator_name: string | null;
  member_count: number;
}

async function fetchPreview(token: string): Promise<CrewPreview | null> {
  try {
    const res = await fetch(
      `${SITE_URL}/api/crew-preview?token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(4000) }
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

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  const { token: rawToken } = await ctx.params;
  const token = (rawToken ?? "").trim();
  const preview = token ? await fetchPreview(token) : null;

  const crewName = preview?.crew_name || "a crew";
  const creatorName = preview?.creator_name || "Your teammate";
  const memberCount = preview?.member_count ?? 0;
  const memberLine =
    memberCount > 0
      ? `${memberCount} member${memberCount === 1 ? "" : "s"}`
      : "New crew";

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #6d28d9 135%)",
          padding: "36px 40px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${SITE_URL}/app-icon.jpg`}
              alt="Shiftlyx"
              width={32}
              height={32}
              style={{ borderRadius: "8px" }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.25px",
              }}
            >
              Shiftlyx
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "999px",
              padding: "6px 13px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#34d399",
                display: "flex",
              }}
            />
            <span
              style={{ fontSize: "13px", color: "#ffffff", fontWeight: 800 }}
            >
              Crew Invite
            </span>
          </div>
        </div>

        <div style={{ height: "28px" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              color: "#93c5fd",
              fontWeight: 800,
              letterSpacing: "-0.25px",
            }}
          >
            {creatorName} invited you to join
          </span>
          <span
            style={{
              fontSize: "46px",
              color: "#ffffff",
              fontWeight: 900,
              lineHeight: 1.05,
              marginTop: "4px",
              letterSpacing: "-0.5px",
            }}
          >
            {crewName}
          </span>
        </div>

        <div style={{ height: "22px" }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#e2e8f0",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          <span>{memberLine}</span>
          <span
            style={{
              width: "5px",
              height: "5px",
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

  // Buffer so we can declare Content-Length — WhatsApp will not render a
  // thumbnail from a chunked response.
  const png = await image.arrayBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(png.byteLength),
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
