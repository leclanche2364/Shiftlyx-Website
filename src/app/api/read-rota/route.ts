/**
 * POST /api/read-rota
 *
 * Receives a base64-encoded rota image, sends it to OpenRouter vision API
 * (Gemini 2.0 Flash), and returns parsed shift data.
 *
 * Body:
 *   { image: "data:image/jpeg;base64,...", month?: number, year?: number }
 *
 * Response:
 *   { shifts: { "2026-5-15": "LD", ... }, month: number, year: number, shiftCount: number }
 */

import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/gemini-2.0-flash-001";

const VALID_CODES = new Set(["LD", "MLD", "TW", "N", "OFF", "AL", "SL"]);

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { image, month, year } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const targetMonth = month !== undefined ? month : new Date().getMonth();
    const targetYear = year !== undefined ? year : new Date().getFullYear();

    const prompt = `You are analysing a UK NHS shift rota photo.

This rota is for MONTH ${targetMonth + 1}, YEAR ${targetYear}.

Extract every day's shift from this rota image. Return ONLY valid JSON with no markdown, no code fences, no explanation.

The JSON must be:
{
  "shifts": {
    "YYYY-M-D": "SHIFT_CODE"
  }
}

Where the key is the date (year, 0-indexed month, day) and the value is one of:
- "LD" for Long Day shift (12h)
- "MLD" for Mid Long Day shift (11h)
- "TW" for Twilight shift (8h)
- "N" for Night shift (12h)
- "OFF" for a blank/empty day with no work
- "AL" for Annual Leave (only if explicitly marked as annual leave on the rota)
- "SL" for Sick Leave (only if explicitly marked as sick leave on the rota)

CRITICAL RULES — FOLLOW THESE EXACTLY:
1. ONLY mark a day as "AL" if the rota explicitly says "AL", "Annual Leave", "A/L" or similar leave notation. Empty cells are "OFF", NOT "AL".
2. ONLY mark a day as "SL" if the rota explicitly says "SL", "Sick", "Sick Leave" or similar. Empty cells are "OFF", NOT "SL".
3. If a cell is empty or blank, it is "OFF". Empty = OFF.
4. "DO", "D.O", "Day Off", "D Off", or anything meaning "Day Off" should be coded as "OFF", NOT as "LD" or "N".
5. If the rota uses "D" for Day shift, treat ONLY "DO"/"D.O"/"Day Off" variants as OFF — do not confuse "D" with "DO".
6. If you cannot read a specific cell clearly, SKIP that day entirely — do not guess.
7. Days before the 1st or after the last day of the month should be OMITTED from the JSON (not marked as OFF).
8. Do NOT include any days that are not visible in the photo.
9. If the entire rota is illegible (blurry, too small, wrong angle), return {"shifts": {}, "error": "Could not read rota"}.

Remember: MONTH is 0-indexed. So month 4 = May, month 5 = June.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://shiftlyx.com/tools/fatigue-score-validator",
        "X-Title": "Shiftlyx Fatigue Score",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API error:", response.status, errorBody);
      return NextResponse.json(
        { error: "AI vision API call failed", status: response.status },
        { status: 502 }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    let parsed;

    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        return NextResponse.json(
          { error: "AI returned invalid JSON", raw: content.slice(0, 500) },
          { status: 502 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "No JSON in AI response", raw: content.slice(0, 500) },
        { status: 502 }
      );
    }

    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 422 });
    }

    // Validate shift codes
    const shifts: Record<string, string> = {};
    for (const [key, code] of Object.entries(parsed.shifts || {})) {
      if (VALID_CODES.has(code as string)) {
        shifts[key] = code as string;
      }
    }

    return NextResponse.json({
      shifts,
      month: targetMonth,
      year: targetYear,
      shiftCount: Object.keys(shifts).length,
      model: result.model || MODEL,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
