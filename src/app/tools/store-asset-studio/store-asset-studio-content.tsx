"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// ── Template specs (canonical source) ──
const TEMPLATES = [
  {
    id: "ios-6.9",
    label: "iOS 6.9\" Display",
    device: "iOS",
    width: 1290,
    height: 2796,
    ratio: "9:19.5",
    desc: "iPhone 17 Pro Max, 16 Pro Max, 15 Pro Max",
  },
  {
    id: "ios-6.5",
    label: "iOS 6.5\" Display",
    device: "iOS",
    width: 1284,
    height: 2778,
    ratio: "9:19.5",
    desc: "iPhone 14 Plus, 13 Pro Max, 12 Pro Max",
  },
  {
    id: "ios-5.5",
    label: "iOS 5.5\" Display",
    device: "iOS",
    width: 1242,
    height: 2208,
    ratio: "9:16",
    desc: "iPhone 8 Plus, 7 Plus",
  },
  {
    id: "ipad-13",
    label: "iPad 13\" Display",
    device: "iOS",
    width: 2064,
    height: 2752,
    ratio: "3:4",
    desc: "iPad Pro M5/M4, iPad Air M4, iPad Pro 6th gen+",
  },
  {
    id: "ipad-11",
    label: "iPad 11\" Display",
    device: "iOS",
    width: 1488,
    height: 2266,
    ratio: "~2:3",
    desc: "iPad Pro M5/M4, iPad Air, iPad (A16), iPad mini",
  },
  {
    id: "android-phone",
    label: "Android Phone",
    device: "Android",
    width: 1080,
    height: 1920,
    ratio: "9:16",
    desc: "Standard Play Store screenshot",
  },
  {
    id: "feature-graphic",
    label: "Play Feature Graphic",
    device: "Android",
    width: 1024,
    height: 500,
    ratio: "~2:1",
    desc: "Appears in search results",
  },
  {
    id: "app-icon",
    label: "App Icon",
    device: "Both",
    width: 1024,
    height: 1024,
    ratio: "1:1",
    desc: "App Store + Play Store icon",
  },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

// ── ASO copy templates (from marketing-psychology + ASO skills) ──
const ASO_TIPS: Record<string, string[]> = {
  "ios-6.9": [
    "First 3 screenshots drive 80% of conversions — lead with pain, close with trust.",
    "Benefit-first headline: 'Your fatigue has a number' not 'Fatigue Score Calculator'.",
    "Keep title under 40 chars. No text in bottom 15% (Home indicator area).",
    "Use blue (#2563eb) for trust, orange (#f59e0b) for energy/urgency.",
    "Loss aversion hooks: 'Don't miss another important shift' > 'Plan better shifts'.",
    "Social proof on last screenshot: 'Trusted by X nurses' = increased conversion.",
  ],
  "ios-6.5": [
    "First 3 screenshots drive 80% of conversions — lead with pain, close with trust.",
    "Large bold headline — at least 30% of image height.",
    "One message per screenshot. Don't cram features.",
    "End with a clear CTA: 'Start your free fatigue check'.",
  ],
  "ios-5.5": [
    "Legacy size — text must be larger than usual (older screens).",
    "Fewer bullets (2 max). Larger font for readability.",
    "Focus on ONE core benefit only.",
  ],
  "android-phone": [
    "Google Play shows first 2 screenshots in search — make them count.",
    "Text overlay must be UNDER 40% of image area (Google policy).",
    "Portrait (9:16) screenshots take up more search result space.",
    "Feature graphic (1024x500) appears first — make it bold and simple.",
  ],
  "feature-graphic": [
    "This appears in Google Play search — bold, simple, readable text.",
    "1024x500 — keep text centered or top-left. No fine details.",
    "One headline + logo + CTA. That's it. Don't overcrowd.",
  ],
  "app-icon": [
    "Must be recognizable at 16px. Simple shapes, high contrast.",
    "Avoid text on app icon — it becomes illegible at small sizes.",
    "Use brand colors consistently across all store assets.",
  ],
  "ipad-13": [
    "iPad screenshots required if your app supports iPad — use 13\" Display as primary.",
    "2064×2752 is landscape-friendly — consider side-by-side UI mockups.",
    "iPad users expect richer layouts. Show multi-pane or split-screen views.",
    "Keep text readable at arm's length distance — bigger font sizes.",
  ],
  "ipad-11": [
    "11\" iPad is the most popular iPad size — don't skip this if you support iPad.",
    "1488×2266 — same 3:4 ratio as 13\". Can reuse layouts with margin adjustments.",
    "Consider showing Apple Pencil or keyboard integration if applicable.",
  ],
};

const COPY_SUGGESTIONS = [
  { label: "Pain point", text: "Never show up exhausted again" },
  { label: "Outcome", text: "Know your fatigue before your shift" },
  { label: "Social proof", text: "Trusted by 5,000+ NHS shift workers" },
  { label: "Urgency", text: "Your next shift is in 8 hours" },
  { label: "Specific benefit", text: "Cut night fatigue by 37%" },
  { label: "Question hook", text: "What's your fatigue score?" },
];

// ── Component ──
export default function StoreAssetStudioContent() {
  // Canvas
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [templateId, setTemplateId] = useState<TemplateId>("ios-6.9");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#2563eb");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [titleColor, setTitleColor] = useState("#ffffff");
  const [titleSize, setTitleSize] = useState(48);
  const [showTips, setShowTips] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [showAICopy, setShowAICopy] = useState(false);

  const template = TEMPLATES.find((t) => t.id === templateId)!;

  // Copy suggestion handler
  const applyCopy = useCallback((text: string) => {
    setTitle(text);
  }, []);

  // Generate AI-enhanced image via OpenRouter
  const enhanceImage = useCallback(async () => {
    if (!imageSrc) return;
    setEnhancing(true);
    try {
      const res = await fetch("/api/enhance-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });
      if (!res.ok) throw new Error("Enhance failed");
      const data = await res.json();
      if (data.image) setImageSrc(data.image);
    } catch (err) {
      console.error("Enhance error:", err);
      // Silently fail — user keeps original
    } finally {
      setEnhancing(false);
    }
  }, [imageSrc]);

  // Export single
  const exportSingle = useCallback(async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      const blob = await toPng(canvasRef.current, {
        quality: 1,
        pixelRatio: 1,
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.href = blob;
      a.download = `store-asset-${templateId}-${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  }, [templateId]);

  // Export all templates
  const exportAll = useCallback(async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    const zip = new JSZip();
    try {
      for (const t of TEMPLATES) {
        setTemplateId(t.id);
        // Wait for render
        await new Promise((r) => setTimeout(r, 200));
        if (canvasRef.current) {
          const blob = await toPng(canvasRef.current, {
            quality: 1,
            pixelRatio: 1,
            cacheBust: true,
          });
          const base64 = blob.split(",")[1];
          zip.file(`${t.id}-screenshot.png`, base64, { base64: true });
        }
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `store-assets-${Date.now()}.zip`);
    } catch (err) {
      console.error("Batch export error:", err);
    } finally {
      setExporting(false);
    }
  }, []);

  // Handle image upload
  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  // Current aspect ratio scaling
  const scale = Math.min(400 / template.width, 700 / template.height);
  const displayW = Math.round(template.width * scale);
  const displayH = Math.round(template.height * scale);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Hero */}
      <section className="pt-20 pb-10 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium text-[#2563eb] bg-[#eff6ff] border border-[#2563eb]/20 rounded-full mb-4">
            FREE TOOL
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Store Asset Studio
          </h1>
          <p className="text-[#475569] max-w-2xl mx-auto">
            Generate App Store and Play Store screenshots with correct sizing, ASO-optimised copy, and one-click export.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── Left: Controls ── */}
            <div className="lg:col-span-1 space-y-4">
              {/* Template selector */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  1. Choose template
                </h3>
                <div className="space-y-1.5">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        templateId === t.id
                          ? "bg-[#2563eb] text-white"
                          : "hover:bg-[#f1f5f9] text-[#475569]"
                      }`}
                    >
                      <span className="font-medium">{t.label}</span>
                      <span className="ml-2 text-xs opacity-70">
                        {t.width}×{t.height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  2. Upload background image
                </h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-sm font-medium border border-dashed border-[#94a3b8] rounded-lg text-[#475569] hover:border-[#2563eb] hover:text-[#2563eb] transition-colors"
                >
                  {imageSrc ? "Change image" : "Upload image"}
                </button>
                {imageSrc && !enhancing && (
                  <button
                    onClick={enhanceImage}
                    className="w-full mt-2 px-3 py-2 text-xs font-medium bg-[#f59e0b]/10 text-[#d97706] rounded-lg hover:bg-[#f59e0b]/20 transition-colors"
                  >
                    ✨ Enhance with AI (brighten + optimise)
                  </button>
                )}
                {enhancing && (
                  <p className="mt-2 text-xs text-[#2563eb] text-center animate-pulse">
                    ✨ Enhancing image...
                  </p>
                )}

                {/* Background color picker */}
                <div className="mt-3">
                  <label className="text-xs font-medium text-[#64748b] block mb-1">
                    Background color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-[#e2e8f0]"
                    />
                    <span className="text-xs text-[#94a3b8]">{bgColor}</span>
                  </div>
                </div>
              </div>

              {/* Text overlay */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  3. Add text overlay
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#64748b] block mb-1">
                      Headline (max 40 chars)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value.slice(0, 40))}
                      placeholder="Your main message..."
                      className="w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                    />
                    <span className="text-[10px] text-[#94a3b8]">
                      {title.length}/40 chars
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#64748b] block mb-1">
                      Subtitle (optional)
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value.slice(0, 65))}
                      placeholder="Supporting message..."
                      className="w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                    />
                    <span className="text-[10px] text-[#94a3b8]">
                      {subtitle.length}/65 chars
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#64748b] block mb-1">
                      Text color
                    </label>
                    <input
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-[#e2e8f0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#64748b] block mb-1">
                      Font size: {titleSize}px
                    </label>
                    <input
                      type="range"
                      min="24"
                      max="80"
                      value={titleSize}
                      onChange={(e) => setTitleSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* ASO copy suggestions */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <button
                  onClick={() => setShowAICopy(!showAICopy)}
                  className="w-full text-left text-sm font-semibold text-foreground mb-2 flex items-center justify-between"
                >
                  <span>📝 Quick copy templates</span>
                  <span className="text-[#94a3b8]">{showAICopy ? "▲" : "▼"}</span>
                </button>
                {showAICopy && (
                  <div className="space-y-1.5">
                    {COPY_SUGGESTIONS.map((s) => (
                      <button
                        key={s.text}
                        onClick={() => applyCopy(s.text)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-[#f8fafc] hover:bg-[#eff6ff] transition-colors border border-[#e2e8f0] text-xs"
                      >
                        <span className="text-[#2563eb] font-medium block">{s.label}</span>
                        <span className="text-[#475569]">{s.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ASO tips */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="w-full text-left text-sm font-semibold text-foreground mb-2 flex items-center justify-between"
                >
                  <span>💡 ASO tips for this template</span>
                  <span className="text-[#94a3b8]">{showTips ? "▲" : "▼"}</span>
                </button>
                {showTips && (
                  <ul className="space-y-2">
                    {(ASO_TIPS[templateId] || []).slice(0, 4).map((tip, i) => (
                      <li key={i} className="text-xs text-[#64748b] leading-relaxed flex gap-2">
                        <span className="text-[#2563eb] shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Export */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 space-y-2">
                <button
                  onClick={exportSingle}
                  disabled={exporting}
                  className="w-full py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
                >
                  {exporting ? "Exporting..." : "⬇ Download this template"}
                </button>
                <button
                  onClick={exportAll}
                  disabled={exporting}
                  className="w-full py-2.5 bg-[#f59e0b] text-white text-sm font-semibold rounded-lg hover:bg-[#d97706] transition-colors disabled:opacity-50"
                >
                  {exporting ? "Exporting all..." : "📦 Download all (ZIP)"}
                </button>
              </div>
            </div>

            {/* ── Right: Canvas Preview ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4 w-full">
                  <span className="text-sm font-semibold text-foreground">
                    Preview
                  </span>
                  <span className="text-xs text-[#94a3b8]">
                    {template.width} × {template.height}px ({template.ratio})
                  </span>
                  {!imageSrc && (
                    <span className="ml-auto text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      Upload an image to start
                    </span>
                  )}
                </div>

                {/* ── The canvas ── */}
                <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ width: displayW, height: displayH }}>
                  <div
                    ref={canvasRef}
                    style={{
                      width: template.width,
                      height: template.height,
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                      backgroundColor: bgColor,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Background image */}
                    {imageSrc && (
                      <img
                        src={imageSrc}
                        alt=""
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    {/* Gradient overlay for readability */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Text overlay */}
                    {title && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "8%",
                          left: 0,
                          right: 0,
                          padding: "0 6%",
                          textAlign: "center",
                        }}
                      >
                        <h2
                          style={{
                            color: titleColor,
                            fontSize: titleSize,
                            fontWeight: 800,
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            lineHeight: 1.15,
                            textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                            margin: 0,
                          }}
                        >
                          {title}
                        </h2>
                        {subtitle && (
                          <p
                            style={{
                              color: titleColor,
                              fontSize: Math.round(titleSize * 0.45),
                              fontWeight: 500,
                              fontFamily: "system-ui, -apple-system, sans-serif",
                              opacity: 0.9,
                              marginTop: template.id === "feature-graphic" ? 8 : 16,
                              textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                            }}
                          >
                            {subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Canvas info bar */}
                <div className="flex items-center gap-4 mt-4 text-[10px] text-[#94a3b8] flex-wrap justify-center">
                  <span>📐 Scale: {Math.round(scale * 100)}%</span>
                  <span>📏 {template.width}×{template.height}px</span>
                  <span>📱 {template.device}</span>
                  {title && <span>🔤 {title.length} chars</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
