import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EXTERNAL_CALL_TIMEOUT_MS = 5_000;
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPES = "https://www.googleapis.com/auth/spreadsheets";

const textEncoder = new TextEncoder();

// Supabase project (public values — anon key is designed to be exposed)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://otzyqghfozevhhrcewnm.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

type GoogleSheetsConfig = {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  range: string;
};

type DownloadEvent = {
  created_at: string;
  platform: "iOS" | "Android";
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  referrer: string | null;
  page: string;
};

let cachedGoogleToken: { value: string; expiresAt: number } | null = null;

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlEncode(value: string): string {
  return base64UrlEncodeBytes(textEncoder.encode(value));
}

function normalizePrivateKey(privateKey: string | undefined): string {
  return (privateKey || "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\\\\n/g, "\\n")
    .replace(/\\n/g, "\n")
    .trim();
}

function privateKeyToDer(privateKey: string): Uint8Array<ArrayBuffer> {
  const base64 = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const der = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    der[index] = binary.charCodeAt(index);
  }

  return der;
}

function getGoogleSheetsConfig(): GoogleSheetsConfig | null {
  const privateKey = normalizePrivateKey(
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );
  const clientEmail = (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "").trim();
  const spreadsheetId = (process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "").trim();
  const range = (process.env.GOOGLE_SHEETS_RANGE || "").trim();

  if (!privateKey || !clientEmail || !spreadsheetId || !range) {
    return null;
  }

  return { clientEmail, privateKey, spreadsheetId, range };
}

async function createServiceAccountJwt(config: GoogleSheetsConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  );
  const claims = base64UrlEncode(
    JSON.stringify({
      iss: config.clientEmail,
      scope: GOOGLE_SCOPES,
      aud: GOOGLE_TOKEN_URL,
      iat: now,
      exp: now + 3_600,
    })
  );
  const unsignedJwt = `${header}.${claims}`;
  const key = await globalThis.crypto.subtle.importKey(
    "pkcs8",
    privateKeyToDer(config.privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await globalThis.crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    textEncoder.encode(unsignedJwt)
  );

  return `${unsignedJwt}.${base64UrlEncodeBytes(
    new Uint8Array(signature)
  )}`;
}

async function fetchWithTimeout<T>(
  input: string | URL,
  init: RequestInit,
  handleResponse: (response: Response) => Promise<T>,
  timeoutMs = EXTERNAL_CALL_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return await handleResponse(response);
  } finally {
    clearTimeout(timeout);
  }
}

async function getGoogleAccessToken(
  config: GoogleSheetsConfig
): Promise<string> {
  if (cachedGoogleToken && cachedGoogleToken.expiresAt > Date.now()) {
    return cachedGoogleToken.value;
  }

  const assertion = await createServiceAccountJwt(config);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  return fetchWithTimeout(
    GOOGLE_TOKEN_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
    async (response) => {
      if (!response.ok) {
        throw new Error(`Google token endpoint returned ${response.status}`);
      }

      const data = (await response.json()) as {
        access_token?: unknown;
        expires_in?: unknown;
      };
      if (typeof data.access_token !== "string") {
        throw new Error("Google token endpoint did not return an access token");
      }

      const expiresIn =
        typeof data.expires_in === "number" ? data.expires_in : 3_600;
      cachedGoogleToken = {
        value: data.access_token,
        expiresAt: Date.now() + Math.max(0, expiresIn - 60) * 1_000,
      };

      return cachedGoogleToken.value;
    }
  );
}

async function writeGoogleSheet(event: DownloadEvent): Promise<void> {
  const config = getGoogleSheetsConfig();
  if (!config) {
    throw new Error("Google Sheets is not configured");
  }

  const accessToken = await getGoogleAccessToken(config);
  const appendUrl =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      config.spreadsheetId
    )}/values/${encodeURIComponent(config.range)}:append` +
    "?valueInputOption=RAW";
  await fetchWithTimeout(
    appendUrl,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range: config.range,
        majorDimension: "ROWS",
        values: [
          [
            event.created_at,
            event.platform,
            event.utm_source,
            event.utm_medium,
            event.utm_campaign,
            event.utm_content,
            event.referrer,
            event.page,
          ],
        ],
      }),
    },
    async (response) => {
      if (!response.ok) {
        throw new Error(`Google Sheets append returned ${response.status}`);
      }
    }
  );
}

async function writeSupabase(event: DownloadEvent): Promise<void> {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("Supabase is not configured");
  }

  await fetchWithTimeout(
    `${SUPABASE_URL}/rest/v1/download_events`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(event),
    },
    async (response) => {
      if (!response.ok) {
        throw new Error(`Supabase insert returned ${response.status}`);
      }
    }
  );
}

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

// POST /api/track-download — log a download click to Google Sheets, with Supabase as fallback
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

    const event: DownloadEvent = {
      created_at: new Date().toISOString(),
      // Normalise platform to what the Supabase CHECK constraint allows.
      platform: platform === "iOS" ? "iOS" : "Android",
      utm_source: utm_source ? String(utm_source).slice(0, 200) : null,
      utm_medium: utm_medium ? String(utm_medium).slice(0, 200) : null,
      utm_campaign: utm_campaign ? String(utm_campaign).slice(0, 200) : null,
      utm_content: utm_content ? String(utm_content).slice(0, 200) : null,
      referrer: referrer ? String(referrer).slice(0, 2048) : null,
      page: page ? String(page).slice(0, 200) : "/download",
    };

    try {
      await writeGoogleSheet(event);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error(
        "Google Sheets download-event write failed",
        error instanceof Error ? error.message : error
      );
    }

    try {
      await writeSupabase(event);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error(
        "Supabase download-event fallback write failed",
        error instanceof Error ? error.message : error
      );
    }

    return NextResponse.json(
      { error: "Failed to write download event" },
      { status: 500 }
    );
  } catch (error) {
    console.error(
      "track-download API error",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
