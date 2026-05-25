/**
 * POST /api/enhance-image
 *
 * Receives a base64-encoded image, sends it to OpenRouter vision API
 * (Gemini 2.0 Flash) requesting image enhancement (brightness, color,
 * composition), and returns an enhanced version.
 *
 * Body:
 *   { image: "data:image/jpeg;base64,..." }
 *
 * Response:
 *   { image: "data:image/jpeg;base64,..." }
 */

import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/gemini-2.0-flash-001";

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const prompt = `You are a professional ASO screenshot designer.

I will send you an image that will be used as a background for an App Store or Google Play screenshot.

Your task:
1. Enhance the image — make it brighter, more vibrant, and more captivating
2. Improve contrast and color saturation
3. If it's a screenshot of an app, clean it up and make it look polished
4. Return ONLY the enhanced image in base64 format with "data:image/jpeg;base64,..."
5. Do NOT change the aspect ratio or add any text
6. Keep the image at the same resolution

Return ONLY the data URI. No explanation, no markdown, no code fences.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://shiftlyx.com/tools/store-asset-studio",
        "X-Title": "Shiftlyx Store Asset Studio",
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
        max_tokens: 8192,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter enhance error:", response.status, errorBody);
      return NextResponse.json(
        { error: "AI image enhancement failed" },
        { status: 502 }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Try to extract data URI from response
    const dataUriMatch = content.match(/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]+/);
    if (dataUriMatch) {
      return NextResponse.json({ image: dataUriMatch[0] });
    }

    // If the response is just a base64 string, wrap it
    if (content.startsWith("/9j/") || content.startsWith("iVBOR")) {
      return NextResponse.json({
        image: `data:image/jpeg;base64,${content}`,
      });
    }

    console.error("No valid image in AI response:", content.slice(0, 200));
    return NextResponse.json(
      { error: "AI returned invalid image data" },
      { status: 502 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
