import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATA_SOURCE_ID =
  process.env.NOTION_DATA_SOURCE_ID || "36f32d70-8844-8164-84d2-000b7c21882f";
const NOTION_DATABASE_ID =
  process.env.NOTION_DATABASE_ID || "36f32d70-8844-8115-b7c2-cf22d26cad87";
const NOTION_VERSION = "2025-09-03";

// Simple admin token — set SHIFTLYX_ADMIN_SECRET in Vercel env
const ADMIN_SECRET = process.env.SHIFTLYX_ADMIN_SECRET || "shiftlyx-dev-2026";

async function queryNotionAll(
  filter?: object,
  sorts?: object[]
): Promise<any[]> {
  const dsId = NOTION_DATA_SOURCE_ID.replace(/-/g, "");
  const allResults: any[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const body: any = { page_size: 100 };
    if (filter) body.filter = filter;
    if (sorts) body.sorts = sorts;
    if (cursor) body.start_cursor = cursor;

    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${dsId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + NOTION_API_KEY,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Notion query error:", response.status, errorText);
      throw new Error("Notion query failed: " + response.status);
    }

    const data = await response.json();
    allResults.push(...(data.results || []));
    hasMore = data.has_more || false;
    cursor = data.next_cursor || null;
  }

  return allResults;
}

function getTextValue(result: any, propertyName: string): string {
  const prop = result.properties?.[propertyName];
  if (!prop) return "";

  // rich_text
  if (prop.type === "rich_text" && prop.rich_text?.length > 0) {
    return prop.rich_text.map((t: any) => t.plain_text).join("");
  }
  // title
  if (prop.type === "title" && prop.title?.length > 0) {
    return prop.title.map((t: any) => t.plain_text).join("");
  }
  // email
  if (prop.type === "email" && prop.email) return prop.email;
  // select
  if (prop.type === "select" && prop.select?.name) return prop.select.name;
  // date
  if (prop.type === "date" && prop.date?.start) return prop.date.start;

  return "";
}

async function getAnalytics() {
  // 1. Fetch ALL pages from the CRM
  const allPages = await queryNotionAll();

  // 2. Classify
  const referred = allPages.filter(
    (p) => getTextValue(p, "Referral Code") !== ""
  );
  const organic = allPages.filter(
    (p) => getTextValue(p, "Referral Code") === ""
  );

  // 3. Build referral leaderboard
  const referrerCounts: Record<string, number> = {};
  for (const page of referred) {
    const code = getTextValue(page, "Referral Code").toUpperCase();
    if (code) {
      referrerCounts[code] = (referrerCounts[code] || 0) + 1;
    }
  }
  const leaderboard = Object.entries(referrerCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([code, count]) => ({ code, count }));

  // 4. Daily breakdown
  const dailyMap: Record<string, { total: number; referred: number }> = {};
  for (const page of allPages) {
    const date = getTextValue(page, "Signed Up")?.split("T")[0];
    if (!date) continue;
    if (!dailyMap[date]) dailyMap[date] = { total: 0, referred: 0 };
    dailyMap[date].total++;
    if (getTextValue(page, "Referral Code") !== "") {
      dailyMap[date].referred++;
    }
  }
  const dailyBreakdown = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));

  // 5. Role breakdown
  const roleMap: Record<string, number> = {};
  for (const page of allPages) {
    const role = getTextValue(page, "Role") || "Unknown";
    roleMap[role] = (roleMap[role] || 0) + 1;
  }

  return {
    total: allPages.length,
    referred: referred.length,
    organic: organic.length,
    conversionRate:
      allPages.length > 0
        ? Math.round((referred.length / allPages.length) * 100)
        : 0,
    leaderboard,
    dailyBreakdown,
    roleBreakdown: roleMap,
    generatedAt: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token || token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!NOTION_API_KEY) {
      return NextResponse.json(
        { error: "Notion API key not configured" },
        { status: 500 }
      );
    }

    const analytics = await getAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
