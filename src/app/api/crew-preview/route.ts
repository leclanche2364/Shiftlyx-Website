import { NextRequest, NextResponse } from "next/server";

// Supabase project (public values — anon key is designed to be exposed)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://otzyqghfozevhhrcewnm.supabase.co";

// GET /api/crew-preview?token=<inviteToken>
//
// Server-side seam that calls the existing `preview-crew-invite` Edge Function
// and returns just the fields the web join page + OG card need:
//   { crew_name, creator_name, member_count, invite_mode }
//
// The edge function is open by design (the invite token is the auth), so the
// site can call it with the token from the URL. It does NOT leak member data —
// the function only returns the crew name, creator name and member count.
export async function GET(request: NextRequest) {
  const token = (
    request.nextUrl.searchParams.get("token") ||
    request.nextUrl.searchParams.get("invite_token") ||
    ""
  ).trim();

  if (!token) {
    return NextResponse.json(
      { error: "Missing invite token" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/preview-crew-invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Allow the call through with the project's anon key.
          apikey: process.env.SUPABASE_ANON_KEY || "",
        },
        body: JSON.stringify({ token }),
        // Keep server-side fetch snappy; the OG crawler (WhatsApp/Telegram)
        // waits on this before rendering the card.
        signal: AbortSignal.timeout(4000),
      }
    );

    if (!response.ok) {
      const status = response.status;
      // 404 = invite not found / token unknown. Not a server fault — return a
      // clean "not found" so the caller can render the invalid-invite state.
      if (status === 404) {
        return NextResponse.json(
          { error: "Invite not found" },
          { status: 404 }
        );
      }
      const errorBody = await response.text();
      console.error("crew-preview edge error:", status, errorBody);
      return NextResponse.json(
        { error: "Preview failed" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      crew_name: data?.crew_name ?? null,
      creator_name: data?.creator_name ?? null,
      member_count: data?.member_count ?? 0,
      invite_mode: data?.invite_mode ?? "open",
    });
  } catch (error) {
    console.error("crew-preview API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
