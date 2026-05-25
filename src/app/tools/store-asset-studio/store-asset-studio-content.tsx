"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// ── Template specs ──
const TEMPLATES = [
  { id: "ios-6.9",        label: "iOS 6.9\" Display",    device: "iPhone", w: 1290, h: 2796, desc: "iPhone 17/16/15 Pro Max" },
  { id: "ios-6.5",        label: "iOS 6.5\" Display",    device: "iPhone", w: 1284, h: 2778, desc: "iPhone 14/13/12 Pro Max" },
  { id: "ios-5.5",        label: "iOS 5.5\" Display",    device: "iPhone", w: 1242, h: 2208, desc: "iPhone 8/7 Plus" },
  { id: "ipad-13",        label: "iPad 13\" Display",    device: "iPad",   w: 2064, h: 2752, desc: "iPad Pro M5/M4, Air M4" },
  { id: "ipad-11",        label: "iPad 11\" Display",    device: "iPad",   w: 1488, h: 2266, desc: "iPad Pro M5/M4, Air, mini" },
  { id: "android-phone",  label: "Android Phone",        device: "Android", w: 1080, h: 1920, desc: "Play Store screenshot" },
  { id: "feature-graphic", label: "Play Feature Graphic", device: "Android", w: 1024, h: 500,  desc: "Google Play search result" },
  { id: "app-icon",       label: "App Icon",              device: "Both",   w: 1024, h: 1024, desc: "App Store + Play Store" },
] as const;

type TplId = (typeof TEMPLATES)[number]["id"];

// ── ASO tips ──
const ASO_TIPS: Record<string, string[]> = {
  "ios-6.9": [
    "First 3 screenshots drive 80% of conversions.",
    "Benefit-first headline under 40 chars.",
    "No text in bottom 15% (Home Indicator).",
    "Use blue (#2563eb) for trust, orange for urgency.",
  ],
  "ios-6.5": ["Same rules as 6.9\" — re-use layouts with margin adjustments."],
  "ios-5.5": ["Legacy size. Use larger fonts for readability on older screens."],
  "ipad-13": ["iPad screenshots required if app supports iPad.", "Show multi-pane or split-screen views.", "Bigger fonts — read at arm's length."],
  "ipad-11": ["Most popular iPad size. 3:4 ratio matches 13\".", "Consider Pencil or keyboard views."],
  "android-phone": ["First 2 screenshots show in search results.", "Text overlay under 40% of image area (Google policy).", "Portrait 9:16 recommended."],
  "feature-graphic": ["Appears in search — bold, simple, one headline + logo + CTA."],
  "app-icon": ["Recognizable at 16px. Simple shapes, high contrast.", "No text — illegible at small sizes."],
};

const COPY_PRESETS = [
  { label: "Pain point",   text: "Never show up exhausted again" },
  { label: "Outcome",      text: "Know your fatigue before your shift" },
  { label: "Social proof", text: "Trusted by 5,000+ NHS shift workers" },
  { label: "Urgency",      text: "Your next shift is in 8 hours" },
  { label: "Benefit",      text: "Cut night fatigue by 37%" },
  { label: "Hook",         text: "What's your fatigue score?" },
];

// ── Drawing helpers ──
function drawComposition(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  image: HTMLImageElement | null,
  bgColor: string,
  title: string,
  subtitle: string,
  titleColor: string,
  titleSize: number,
) {
  // Background colour
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  // Background image
  if (image) {
    const imgAspect = image.naturalWidth / image.naturalHeight;
    const canvasAspect = w / h;
    let sx, sy, sw, sh;
    if (imgAspect > canvasAspect) {
      // Image wider — crop sides
      sh = image.naturalHeight;
      sw = sh * canvasAspect;
      sx = (image.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      // Image taller — crop top/bottom
      sw = image.naturalWidth;
      sh = sw / canvasAspect;
      sx = 0;
      sy = (image.naturalHeight - sh) / 2;
    }
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, w, h);
  }

  // Gradient overlay (bottom fade for text readability)
  const grad = ctx.createLinearGradient(0, h * 0.6, 0, h);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);

  // Title
  if (title) {
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = titleColor;
    ctx.font = `800 ${titleSize}px system-ui, -apple-system, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 8;

    const maxWidth = w * 0.88;
    let fs = titleSize;
    // Shrink text if too wide
    while (ctx.measureText(title).width > maxWidth && fs > 16) {
      fs -= 2;
      ctx.font = `800 ${fs}px system-ui, -apple-system, sans-serif`;
    }

    const titleY = h - h * (subtitle ? 0.09 : 0.06);
    ctx.fillText(title, w / 2, titleY);

    // Subtitle
    if (subtitle) {
      ctx.shadowBlur = 4;
      ctx.font = `500 ${Math.round(fs * 0.45)}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = titleColor;
      ctx.globalAlpha = 0.9;
      ctx.fillText(subtitle, w / 2, titleY + Math.round(fs * 0.5));
      ctx.globalAlpha = 1;
    }
  }

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

// ── Component ──
export default function StoreAssetStudioContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const [tplId, setTplId] = useState<TplId>("ios-6.9");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#2563eb");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [titleColor, setTitleColor] = useState("#ffffff");
  const [titleSize, setTitleSize] = useState(48);
  const [showTips, setShowTips] = useState(true);
  const [showCopy, setShowCopy] = useState(true);
  const [exporting, setExporting] = useState<"single" | "batch" | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [filename, setFilename] = useState("Store Asset");

  const tpl = TEMPLATES.find((t) => t.id === tplId)!;

  // ── Preview scale ──
  const [vpWidth, setVpWidth] = useState(800);
  useEffect(() => {
    setVpWidth(window.innerWidth);
    const onResize = () => setVpWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scale = useMemo(() => {
    const maxPreview = vpWidth < 768 ? 160 : 400;
    return Math.min(maxPreview / tpl.w, 650 / tpl.h);
  }, [tpl.w, tpl.h, vpWidth]);

  const displayW = Math.round(tpl.w * scale);
  const displayH = Math.round(tpl.h * scale);

  // ── Load image ──
  useEffect(() => {
    if (!imageSrc) {
      loadedImageRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      loadedImageRef.current = img;
      renderCanvas();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // ── Render on canvas ──
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = tpl.w;
    canvas.height = tpl.h;
    drawComposition(ctx, tpl.w, tpl.h, loadedImageRef.current, bgColor, title, subtitle, titleColor, titleSize);
  }, [tpl, bgColor, title, subtitle, titleColor, titleSize]);

  // Re-render on prop changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // ── Handle upload ──
  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  // ── AI enhance ──
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
    } catch {
      // Silent fail
    } finally {
      setEnhancing(false);
    }
  }, [imageSrc]);

  // ── Export single ──
  const exportSingle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting("single");
    requestAnimationFrame(() => {
      canvas.toBlob((blob) => {
        if (!blob) { setExporting(null); return; }
        saveAs(blob, `${filename} ${tpl.label}.png`);
        setExporting(null);
      }, "image/png");
    });
  }, [tpl.label, filename]);

  // ── Export all ──
  const exportAll = useCallback(async () => {
    setExporting("batch");
    const zip = new JSZip();
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    for (const t of TEMPLATES) {
      tempCanvas.width = t.w;
      tempCanvas.height = t.h;
      if (!tempCtx) continue;
      drawComposition(tempCtx, t.w, t.h, loadedImageRef.current, bgColor, title, subtitle, titleColor, titleSize);
      await new Promise<void>((resolve) => {
        tempCanvas.toBlob((blob) => {
          if (blob) zip.file(`${t.id}-${t.label.replace(/"/g, "")}.png`, blob);
          resolve();
        }, "image/png");
      });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${filename} All Templates.zip`);
    setExporting(null);
  }, [bgColor, title, subtitle, titleColor, titleSize]);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <section className="pt-20 pb-10 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium text-[#2563eb] bg-[#eff6ff] border border-[#2563eb]/20 rounded-full mb-4">
            FREE TOOL
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Store Asset Studio
          </h1>
          <p className="text-[#475569] max-w-2xl mx-auto">
            Generate App Store and Play Store screenshots with correct sizing and ASO-ready text.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ─── Controls ─── */}
            <div className="lg:col-span-1 space-y-4">

              {/* Template picker */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <h3 className="text-sm font-semibold mb-3">1. Choose template</h3>
                <div className="space-y-1.5">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTplId(t.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        tplId === t.id
                          ? "bg-[#2563eb] text-white"
                          : "hover:bg-[#f1f5f9] text-[#475569]"
                      }`}
                    >
                      <span className="font-medium">{t.label}</span>
                      <span className="ml-2 text-xs opacity-70">{t.w}×{t.h}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <h3 className="text-sm font-semibold mb-3">2. Background image</h3>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-sm font-medium border border-dashed border-[#94a3b8] rounded-lg text-[#475569] hover:border-[#2563eb] hover:text-[#2563eb] transition-colors"
                >
                  {imageSrc ? "Change image" : "Upload image"}
                </button>
                {imageSrc && (
                  <button
                    onClick={enhanceImage}
                    disabled={enhancing}
                    className="w-full mt-2 px-3 py-2 text-xs font-medium bg-[#f59e0b]/10 text-[#d97706] rounded-lg hover:bg-[#f59e0b]/20 transition-colors disabled:opacity-50"
                  >
                    {enhancing ? "✨ Enhancing..." : "✨ Enhance with AI"}
                  </button>
                )}
                <div className="mt-3">
                  <label className="text-xs font-medium text-[#64748b] block mb-1">Background colour</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer border border-[#e2e8f0]" />
                    <span className="text-xs text-[#94a3b8]">{bgColor}</span>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <h3 className="text-sm font-semibold mb-3">3. Text overlay</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#64748b] block mb-1">Headline (max 40 chars)</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 40))} placeholder="Your main message..." className="w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]" />
                    <span className="text-[10px] text-[#94a3b8]">{title.length}/40</span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#64748b] block mb-1">Subtitle (optional)</label>
                    <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value.slice(0, 65))} placeholder="Supporting message..." className="w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]" />
                    <span className="text-[10px] text-[#94a3b8]">{subtitle.length}/65</span>
                  </div>
                  <div className="flex gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#64748b] block mb-1">Colour</label>
                      <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer border border-[#e2e8f0]" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-[#64748b] block mb-1">Size: {titleSize}px</label>
                      <input type="range" min={24} max={80} value={titleSize} onChange={(e) => setTitleSize(Number(e.target.value))} className="w-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy presets */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <button onClick={() => setShowCopy(!showCopy)} className="w-full text-left text-sm font-semibold mb-2 flex items-center justify-between">
                  <span>📝 Quick copy templates</span>
                  <span className="text-[#94a3b8]">{showCopy ? "▲" : "▼"}</span>
                </button>
                {showCopy && (
                  <div className="space-y-1.5">
                    {COPY_PRESETS.map((s) => (
                      <button key={s.text} onClick={() => setTitle(s.text)} className="w-full text-left px-3 py-2 rounded-lg bg-[#f8fafc] hover:bg-[#eff6ff] transition-colors border border-[#e2e8f0] text-xs">
                        <span className="text-[#2563eb] font-medium block">{s.label}</span>
                        <span className="text-[#475569]">{s.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ASO tips */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <button onClick={() => setShowTips(!showTips)} className="w-full text-left text-sm font-semibold mb-2 flex items-center justify-between">
                  <span>💡 ASO tips</span>
                  <span className="text-[#94a3b8]">{showTips ? "▲" : "▼"}</span>
                </button>
                {showTips && (
                  <ul className="space-y-2">
                    {(ASO_TIPS[tplId] || []).map((tip, i) => (
                      <li key={i} className="text-xs text-[#64748b] leading-relaxed flex gap-2">
                        <span className="text-[#2563eb] shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Export */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#64748b] block mb-1">Filename</label>
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="Store Asset"
                    className="w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                  />
                </div>
                <button
                  onClick={exportSingle}
                  disabled={exporting !== null}
                  className="w-full py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
                >
                  {exporting === "single" ? "Exporting..." : `⬇ Download ${tpl.label}`}
                </button>
                <button
                  onClick={exportAll}
                  disabled={exporting !== null}
                  className="w-full py-2.5 bg-[#f59e0b] text-white text-sm font-semibold rounded-lg hover:bg-[#d97706] transition-colors disabled:opacity-50"
                >
                  {exporting === "batch" ? "Exporting all..." : "📦 Download all templates (ZIP)"}
                </button>
              </div>
            </div>

            {/* ─── Preview ─── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4 w-full">
                  <span className="text-sm font-semibold text-foreground">Preview</span>
                  <span className="text-xs text-[#94a3b8]">{tpl.w}×{tpl.h}px</span>
                </div>
                <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ width: displayW, height: displayH }}>
                  <canvas
                    ref={canvasRef}
                    className="block"
                    style={{
                      width: displayW,
                      height: displayH,
                    }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-4 text-[10px] text-[#94a3b8] flex-wrap justify-center">
                  <span>📐 {Math.round(scale * 100)}% scale</span>
                  <span>📏 {tpl.w}×{tpl.h}px</span>
                  <span>📱 {tpl.device}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
