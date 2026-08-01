import { NextRequest, NextResponse } from "next/server";

// Supabase project (public values — anon key is designed to be exposed)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://otzyqghfozevhhrcewnm.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// ── Lightweight in-memory rate limiting ─────────────────────────
// Limits how often a single client (identified by IP) can report a
// download. This is the layer that actually sees request sources and
// stops bot loops + double-click spam at the source. RLS/trigger guard
// the DB as a second layer.
// NOTE: in-memory Map resets on redeploy/restart (per serverless
// instance). Good enough to stop casual spam; for distributed strict
// limits you'd use an external store (Upstash/Redis) later.
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // max 5 download events per IP per minute
};

const hitCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hitCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    hitCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }

  if (entry.count >= RATE_LIMIT.maxRequests) {
    return true;
  }

  entry.count += 1;
  return false;
}

function getClientIp(request: NextRequest): string {
  // Respect forwarded headers set by Vercel / proxies. Fall back to a
  // constant so the limiter still functions (just less granular) when
  // no IP is available.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "unknown";
}

// POST /api/track-download — log a download click as its own Supabase row
export async function POST(request: NextRequest) {
  try {
    // Rate limit: reject if the client has been too chatty this minute.
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Too many download events." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      platform, // "iOS" | "Android"
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      referrer,
      page,
    } = body;

    if (!platform) {
      return NextResponse.json(
        { error: "platform is required" },
        { status: 400 }
      );
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "SUPABASE_ANON_KEY not configured" },
        { status: 500 }
      );
    }

    // Normalise platform to what the CHECK constraint allows
    const normalizedPlatform = platform === "iOS" ? "iOS" : "Android";

    const payload = {
      platform: normalizedPlatform,
      utm_source: utm_source ? String(utm_source).slice(0, 200) : null,
      utm_medium: utm_medium ? String(utm_medium).slice(0, 200) : null,
      utm_campaign: utm_campaign ? String(utm_campaign).slice(0, 200) : null,
      utm_content: utm_content ? String(utm_content).slice(0, 200) : null,
      referrer: referrer ? String(referrer).slice(0, 2048) : null,
      page: page ? String(page).slice(0, 200) : "/download",
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/download_events`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Supabase download-event insert error:", response.status, errorBody);
      return NextResponse.json(
        { error: "Failed to write download event", detail: errorBody },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("track-download API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
