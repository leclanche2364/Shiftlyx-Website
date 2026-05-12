import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID || "3";

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

    // Build Brevo contact payload
    const attributes: Record<string, string> = {
      SOURCE: "shiftlyx_website_waitlist",
    };
    if (name) attributes.FIRSTNAME = name;
    if (role) attributes.ROLE = role;

    const brevoPayload = {
      email,
      attributes,
      listIds: [parseInt(BREVO_LIST_ID, 10)],
      updateEnabled: true, // Update existing contacts instead of error
    };

    const response = await fetch(
      "https://api.brevo.com/v3/contacts",
      {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(brevoPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Brevo returns 409 if contact exists — still a success for us
      if (response.status === 409) {
        return NextResponse.json({
          success: true,
          message: "You're already on the waitlist!",
        });
      }

      return NextResponse.json(
        { error: data.message || "Failed to save contact" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Added to waitlist",
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
