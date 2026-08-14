import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// Dynamic Open Graph image for crew invite links.
//
// Earlier the WhatsApp/Telegram/iMessage link preview for
// https://shiftlyx.com/join/{token} fell back to the site-wide default card
// ("Shiftlyx — AI Shift Planner for Shift Workers", generic tagline) because
// the /join/[token] page had no dynamic OG image. This generator fetches the
// crew preview and renders the invite context straight into the 1200x630 card:
// who invited you, and which crew.
//
// The preview-crew-invite edge function is open by design (the token in the
// URL is the auth) and only returns the crew name, creator name and member
// count — no member data leaks into the card.

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
      // OG crawlers (WhatsApp/Telegram) wait on this before rendering the
      // card — keep it snappy.
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

// Route segment config: cache the image briefly to avoid hammering the edge
// function on every preview render, but keep it fresh enough that a brand-new
// invite shows correctly.
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
      // Outer frame
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #7c3aed 130%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: wordmark + crew badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #3b82f6, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "30px", fontWeight: 900 }}>S</span>
            </div>
            <span
              style={{
                fontSize: "30px",
                fontWeight: 800,
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
              gap: "8px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "999px",
              padding: "10px 20px",
            }}
          >
            <span
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "999px",
                background: "#34d399",
                display: "flex",
              }}
            />
            <span style={{ fontSize: "22px", color: "#ffffff", fontWeight: 600 }}>
              Crew Invite
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: "48px" }} />

        {/* Headline: who invited you */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "34px", color: "#93c5fd", fontWeight: 600 }}>
            {creatorName} invited you to join
          </span>
          <span
            style={{
              fontSize: "72px",
              color: "#ffffff",
              fontWeight: 900,
              lineHeight: 1.1,
              marginTop: "6px",
            }}
          >
            {crewName}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ height: "40px" }} />

        {/* Sub-line: member count + tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#cbd5e1",
            fontSize: "26px",
            fontWeight: 500,
          }}
        >
          <span>{memberLine}</span>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "999px",
              background: "#64748b",
              display: "flex",
            }}
          />
          <span>Swap shifts · Coordinate days off · Plan as a crew</span>
        </div>
      </div>
    ),
    size
  );
}
