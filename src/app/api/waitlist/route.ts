import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID || "2";

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
    const { email, name, role } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const attributes: Record<string, string> = {
      SOURCE: "shiftlyx_website_waitlist",
    };
    if (name) attributes.FIRSTNAME = name;
    if (role) attributes.ROLE = role;

    await upsertBrevoContact(email, attributes);

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
