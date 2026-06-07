import { NextRequest, NextResponse } from "next/server";

// Notion config
const NOTION_API_KEY = process.env.NOTION_API_KEY;
// NOTE: in Notion API v2025-09-03, each database has TWO IDs:
//   - database_id         → used when CREATING pages (parent: { database_id })
//   - data_source_id      → used when QUERYING the database (/v1/data_sources/:id/query)
// These are DIFFERENT UUIDs.
const NOTION_DATABASE_ID =
  process.env.NOTION_DATABASE_ID || "36f32d70-8844-8115-b7c2-cf22d26cad87";
const NOTION_DATA_SOURCE_ID =
  process.env.NOTION_DATA_SOURCE_ID || "36f32d70-8844-8164-84d2-000b7c21882f";
const NOTION_VERSION = "2025-09-03";

// ── GET: Check how many referrals a code has generated ──
export async function GET(request: NextRequest) {
  try {
    if (!NOTION_API_KEY) {
      return NextResponse.json(
        { error: "Notion API key not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    // Query the data source for pages where "Referral Code" rich_text contains this code
    // Using data_source_id (NOT database_id) because API v2025-09-03 separates them
    const dsId = NOTION_DATA_SOURCE_ID.replace(/-/g, "");
    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${dsId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + NOTION_API_KEY,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "Referral Code",
            rich_text: {
              contains: code,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Notion data source query error:", response.status, errorBody);
      return NextResponse.json(
        { error: "Failed to query referral count", detail: errorBody },
        { status: 502 }
      );
    }

    const data = await response.json();
    const count = data.results?.length || 0;

    return NextResponse.json({
      code,
      count,
      remaining: Math.max(0, 3 - count),
      qualified: count >= 3,
    });
  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
