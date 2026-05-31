import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID || "2";

// Notion — already set in Vercel
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = "36f32d70-8844-8115-b7c2-cf22d26cad87";
const NOTION_VERSION = "2025-09-03";

// Optional Discord webhook — user sets this in Vercel env
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// ── Helper: strip UUID dashes ──
function stripDashes(id: string) {
  return id.replace(/-/g, "");
}

// ── Helper: upsert a Brevo contact ──
async function upsertBrevoContact(email: string, attributes: Record<string, string>) {
  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      attributes,
      listIds: [parseInt(BREVO_LIST_ID, 10)],
      updateEnabled: true,
    }),
  });

  const data = await response.json();

  // 409 = already exists but updated — still success
  if (!response.ok && response.status !== 409) {
    throw new Error(data.message || "Failed to save contact");
  }

  return data;
}

// ── Helper: write to Notion (Leads & CRM database) ──
async function writeToNotion(data: {
  email: string;
  name?: string;
  role?: string;
  features?: string[];
}) {
  if (!NOTION_API_KEY) {
    console.warn("NOTION_API_KEY not configured, skipping Notion write");
    return null;
  }

  const now = new Date().toISOString().split("T")[0];
  const pageId = stripDashes(NOTION_DATABASE_ID);

  // Property names must match the Notion CRM database schema
  const properties: Record<string, any> = {
    Name: { title: [{ text: { content: data.name || "Anonymous" } }] },
    Email: { email: data.email },
    Source: { select: { name: "Website Waitlist" } },
    Status: { select: { name: "New" } },
    "Signed Up": { date: { start: now } },
  };

  if (data.role) {
    // Map form roles to CRM-friendly display values
    const roleMap: Record<string, string> = {
      nurse: "Nurse",
      hca: "HCA",
      midwife: "Midwife",
      paramedic: "Paramedic",
      "other-healthcare": "Other Healthcare",
      "not-healthcare": "Not in Healthcare",
    };
    properties.Role = { select: { name: roleMap[data.role] || data.role } };
  }

  if (data.features && data.features.length > 0) {
    properties["Anticipated Features"] = {
      multi_select: data.features.map((f: string) => ({ name: f })),
    };
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + NOTION_API_KEY,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: pageId },
      properties,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Notion API error:", response.status, errorBody);
    throw new Error("Failed to write to Notion: " + response.status);
  }

  return response.json();
}

// ── Helper: send Discord webhook ──
async function sendDiscordNotification(data: {
  email: string;
  name?: string;
  role?: string;
  features?: string[];
}) {
  if (!DISCORD_WEBHOOK_URL) return;

  const featuresList =
    data.features && data.features.length > 0
      ? data.features.join(", ")
      : "Not specified";

  const embed = {
    title: "New Waitlist Signup",
    color: 0x2563eb, // blue
    fields: [
      {
        name: "Name",
        value: data.name || "Not provided",
        inline: true,
      },
      {
        name: "Role",
        value: data.role || "Not provided",
        inline: true,
      },
      {
        name: "Anticipated Features",
        value: featuresList,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  }).catch((err) => console.error("Discord webhook error:", err));
}

// ── POST: Sign up to waitlist ──
export async function POST(request: NextRequest) {
  try {
    if (!BREVO_API_KEY) {
      return NextResponse.json(
        { error: "Brevo API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, name, role, features } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Save to Brevo (existing — keeps email list in sync)
    const attributes: Record<string, string> = {
      SOURCE: "shiftlyx_website_waitlist",
    };
    if (name) attributes.FIRSTNAME = name;
    if (role) attributes.ROLE = role;
    if (features && Array.isArray(features) && features.length > 0) {
      attributes.FEATURES = features.join(", ");
    }

    await upsertBrevoContact(email, attributes);

    // 2. Save to Notion (fire-and-forget — don't block the response)
    writeToNotion({ email, name, role, features }).catch((err) =>
      console.error("Notion write error:", err)
    );

    // 3. Send Discord notification (fire-and-forget)
    sendDiscordNotification({ email, name, role, features }).catch((err) =>
      console.error("Discord webhook error:", err)
    );

    return NextResponse.json({
      success: true,
      message: "Added to waitlist",
      alreadyExists: false,
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── PATCH: Save cold-start probe answers for an existing waitlister ──
export async function PATCH(request: NextRequest) {
  try {
    if (!BREVO_API_KEY) {
      return NextResponse.json(
        { error: "Brevo API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, probes } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!probes || typeof probes !== "object") {
      return NextResponse.json(
        { error: "Probes object is required" },
        { status: 400 }
      );
    }

    const attributes: Record<string, string> = {};

    if (probes.night_affinity) attributes.NIGHT_AFFINITY = probes.night_affinity;
    if (probes.stacking_pref) attributes.STACKING_PREF = probes.stacking_pref;
    if (probes.income_vs_recovery) attributes.INCOME_VS_RECOVERY = probes.income_vs_recovery;
    if (probes.max_nights) attributes.MAX_NIGHTS = probes.max_nights;
    if (probes.fatigue_resilience) attributes.FATIGUE_RESILIENCE = probes.fatigue_resilience;
    if (probes.income_track) attributes.INCOME_TRACK = probes.income_track;
    if (probes.sleep_coach) attributes.SLEEP_COACH = probes.sleep_coach;
    if (probes.recovery_habit) attributes.RECOVERY_HABIT = probes.recovery_habit;

    await upsertBrevoContact(email, attributes);

    return NextResponse.json({
      success: true,
      message: "Preferences saved",
    });
  } catch (error) {
    console.error("Probes API error:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
