"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload, Plus, Trash2, Activity, Moon, Clock, Sun,
  AlertTriangle, CheckCircle2, ChevronRight, BarChart3,
  TrendingUp, Zap, Brain, Download, Camera, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FatigueGauge from "@/components/fatigue-gauge";
import { analyzeShifts, type ShiftInput, type FatigueAnalysis } from "@/lib/fatigue-engine";
import { parseICS } from "@/lib/ics-parser";

// ---------- Shift options ----------

const SHIFT_TYPES = [
  { code: 'LD' as const, label: 'Long Day', short: 'LD', color: '#3b82f6' },
  { code: 'MLD' as const, label: 'Medium LD', short: 'MLD', color: '#6366f1' },
  { code: 'TW' as const, label: 'Twilight', short: 'TW', color: '#8b5cf6' },
  { code: 'N' as const, label: 'Night', short: 'N', color: '#1e293b' },
  { code: 'OFF' as const, label: 'Off Day', short: 'OFF', color: '#10b981' },
  { code: 'AL' as const, label: 'Annual Leave', short: 'AL', color: '#f59e0b' },
  { code: 'SL' as const, label: 'Study Leave', short: 'SL', color: '#f97316' },
];

const DIMENSIONS = [
  { key: 'consecutive_work_days', label: 'Consecutive Work Days', icon: '📅', color: '#ef4444' },
  { key: 'nights', label: 'Night Clustering', icon: '🌙', color: '#f59e0b' },
  { key: 'short_recovery', label: 'Short Recovery', icon: '⏱️', color: '#eab308' },
  { key: 'circadian_disruption', label: 'Circadian Disruption', icon: '🔄', color: '#f59e0b' },
];

// ---------- Generate sample shift data ----------

function generateSampleShifts(): ShiftInput[] {
  const today = new Date();
  const shifts: ShiftInput[] = [];
  const patterns: ShiftInput['shiftCode'][] = ['N', 'N', 'N', 'OFF', 'LD', 'LD', 'OFF', 'OFF', 'TW', 'TW', 'OFF', 'LD', 'LD', 'MLD', 'OFF'];

  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const code = patterns[i % patterns.length];
    if (code !== 'OFF' && code !== 'AL' && code !== 'SL') {
      shifts.push({ date: dateStr, shiftCode: code });
    }
  }
  return shifts;
}

// ---------- Component ----------

export default function FatigueScoreContent() {
  // Tabs: "explainer" | "upload" | "manual" | "results"
  const [tab, setTab] = useState<'explainer' | 'upload' | 'manual' | 'results'>('explainer');
  const [shifts, setShifts] = useState<ShiftInput[]>([]);
  const [results, setResults] = useState<FatigueAnalysis | null>(null);
  const [icsErrors, setIcsErrors] = useState<string[]>([]);
  const [parseSummary, setParseSummary] = useState<{ total: number; parsed: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualShift, setManualShift] = useState<ShiftInput['shiftCode']>('LD');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Add manual shift
  const addManualShift = useCallback(() => {
    const newShift: ShiftInput = { date: manualDate, shiftCode: manualShift };
    setShifts(prev => {
      const exists = prev.some(s => s.date === manualDate);
      if (exists) {
        return prev.map(s => s.date === manualDate ? newShift : s);
      }
      return [...prev, newShift].sort((a, b) => a.date.localeCompare(b.date));
    });
  }, [manualDate, manualShift]);

  // Remove shift
  const removeShift = useCallback((date: string) => {
    setShifts(prev => prev.filter(s => s.date !== date));
  }, []);

  // Load sample
  const loadSample = useCallback(() => {
    setShifts(generateSampleShifts());
    setTab('results');
  }, []);

  // Calculate
  const calculate = useCallback(() => {
    if (shifts.length === 0) {
      setError('Add some shifts first, or upload your rota file.');
      return;
    }
    setError(null);
    const analysis = analyzeShifts(shifts);
    setResults(analysis);
    setTab('results');
  }, [shifts]);

  // Handle image upload + AI parsing
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a photo of your rota (JPG, PNG, or similar).');
      return;
    }

    setAiLoading(true);
    setAiStatus('Reading your rota with AI...');
    setError(null);

    try {
      // Read image as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Estimate month/year from filename (e.g. "May 2026" or "rota-05-2026")
      const fileName = file.name.toLowerCase();
      const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
      let monthGuess: number | undefined;
      let yearGuess: number | undefined;

      const yearMatch = fileName.match(/20\d{2}/);
      if (yearMatch) yearGuess = parseInt(yearMatch[0]);

      for (let i = 0; i < 12; i++) {
        if (fileName.includes(monthNames[i]) || fileName.includes(monthNames[i + 12])) {
          monthGuess = i;
          break;
        }
      }

      setAiStatus('Sending to AI for parsing...');

      const res = await fetch('/api/read-rota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          month: monthGuess,
          year: yearGuess,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI parse failed');
      }

      if (Object.keys(data.shifts).length === 0) {
        setError('AI couldn\'t read any shifts from that photo. Try a clearer photo, or use ICS upload / manual entry.');
        setAiLoading(false);
        setAiStatus(null);
        return;
      }

      setAiStatus(`AI parsed ${data.shiftCount} shifts from your rota photo`);

      // Convert to ShiftInput[]
      const parsedShifts: ShiftInput[] = Object.entries(data.shifts)
        .filter(([_, code]) => code !== 'OFF')
        .map(([date, code]) => ({ date, shiftCode: code as ShiftInput['shiftCode'] }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setShifts(parsedShifts);

      // Small delay so user sees the status message
      setTimeout(() => {
        setAiLoading(false);
        setAiStatus(null);

        const analysis = analyzeShifts(parsedShifts);
        setResults(analysis);
        setTab('results');
      }, 1200);

    } catch (err) {
      console.error('AI rota read error:', err);
      setError(err instanceof Error ? err.message : 'Failed to read rota photo');
      setAiLoading(false);
      setAiStatus(null);
    }
  }, []);

  // Combined file handler: detect ICS vs Image
  const handleFileUpload = useCallback((file: File) => {
    // Reset states
    setError(null);

    // Image file
    if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|heic|heif)$/i.test(file.name)) {
      handleImageUpload(file);
      return;
    }

    // ICS file
    if (!file.name.endsWith('.ics') && file.type !== 'text/calendar') {
      setError('Please upload an .ics file (from HealthRota, Rotamaster) or a photo of your rota.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseICS(content);

      if (result.shifts.length === 0 && result.parsed === 0) {
        setError(`Couldn't find any shifts in that file. ${result.errors[0] || 'Make sure it\'s a valid NHS rota export.'}`);
        return;
      }

      setShifts(result.shifts);
      setParseSummary({ total: result.totalEvents, parsed: result.parsed, failed: result.failed });
      setIcsErrors(result.errors);

      const analysis = analyzeShifts(result.shifts);
      setResults(analysis);
      setError(null);
      setTab('results');
    };
    reader.onerror = () => setError('Failed to read file. Try again.');
    reader.readAsText(file);
  }, [handleImageUpload]);

  // Handle drag & drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div>
      {/* ===== HERO / EXPLAINER ===== */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Fatigue Score
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Your fatigue isn&apos;t a feeling. <br />
            <span className="text-[#f59e0b]">It&apos;s physics.</span>
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed mb-8">
            Four measurable dimensions — consecutive days, night clusters, short turnarounds, 
            and circadian disruption — combine into one clear 0-100 score. Upload your rota 
            and see yours in seconds.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-base px-6 shadow-lg shadow-blue-200/50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload your rota
            </Button>
            <Button
              onClick={() => setTab('manual')}
              size="lg"
              variant="outline"
              className="font-semibold text-base px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add shifts manually
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ics,text/calendar,image/*,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          />
          <p className="text-xs text-[#94a3b8]">
            ICS files are processed entirely in your browser. Photo upload uses AI (shifts only, nothing saved).
          </p>
        </div>
      </section>

      {/* ===== THE FOUR DIMENSIONS ===== */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
              THE FOUR DIMENSIONS
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              How fatigue adds up
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              Every shift has a hidden cost. We measure the four factors that matter most to your body and brain.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0 }}
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 hover:border-[#2563eb]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-lg mb-3">📅</div>
              <h3 className="font-semibold text-foreground mb-1">Consecutive Work Days</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                How many shifts in a row without a proper reset. Each extra day compounds fatigue exponentially — not linearly.
              </p>
              <p className="text-xs text-[#94a3b8] mt-2">Penalty starts after day 3</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 hover:border-[#2563eb]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg mb-3">🌙</div>
              <h3 className="font-semibold text-foreground mb-1">Night Clustering</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                How tightly nights are packed. Multiple nights in a row mess with your circadian rhythm harder than spread-out nights.
              </p>
              <p className="text-xs text-[#94a3b8] mt-2">Penalty starts after night 2</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 hover:border-[#2563eb]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-lg mb-3">⏱️</div>
              <h3 className="font-semibold text-foreground mb-1">Short Recovery</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Shifts with fewer than 11 hours between finish and next start. Less than 11 hours is insufficient for proper sleep and recovery.
              </p>
              <p className="text-xs text-[#94a3b8] mt-2">Penalty per incident: +10 points</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 hover:border-[#2563eb]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg mb-3">🔄</div>
              <h3 className="font-semibold text-foreground mb-1">Circadian Disruption</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Night-to-day transitions happening too quickly. Each flip between night and day patterns forces your body clock to reset.
              </p>
              <p className="text-xs text-[#94a3b8] mt-2">Penalty per flip: +9 points</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== COLOUR ZONES ===== */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              What your score means
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <span className="w-8 h-8 rounded-full bg-[#10b981]" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Low (0–30)</h3>
              <p className="text-sm text-[#475569]">
                Recovery-friendly. Your pattern is sustainable. Keep doing what you&apos;re doing.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
                <span className="w-8 h-8 rounded-full bg-[#f59e0b]" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Moderate (31–60)</h3>
              <p className="text-sm text-[#475569]">
                High demand. Your body is working harder. Consider adjustments for long-term recovery.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <span className="w-8 h-8 rounded-full bg-[#ef4444]" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">High (61–100)</h3>
              <p className="text-sm text-[#475569]">
                Critical strain. This pattern carries significant risk. Prioritise recovery and review your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE TOOL SECTION ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
              TRY IT
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              See your fatigue score
            </h2>
            <p className="text-[#475569] max-w-xl mx-auto text-sm">
              Upload your rota (photo or ICS from HealthRota/Rotamaster) or add shifts manually.
              ICS runs in-browser. Photo uses AI via OpenRouter — shifts only, nothing saved.
            </p>
          </div>

          {/* Tab Bar */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={tab === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setTab('upload'); fileInputRef.current?.click(); }}
              className={tab === 'upload' ? 'bg-[#2563eb] text-white' : ''}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload file
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              className="text-[#2563eb] border-[#2563eb]/30"
            >
              <Camera className="w-3.5 h-3.5 mr-1.5" />
              Photo (AI)
            </Button>
            <Button
              variant={tab === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTab('manual')}
              className={tab === 'manual' ? 'bg-[#2563eb] text-white' : ''}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Manual entry
            </Button>
            <Button variant="outline" size="sm" onClick={loadSample}>
              Load sample
            </Button>
          </div>

          {/* Manual Entry */}
          {tab === 'manual' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-8"
            >
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <h3 className="font-semibold text-foreground text-sm mb-3">Add a shift</h3>
                <div className="flex gap-2 items-end mb-3">
                  <div className="flex-1">
                    <label className="text-xs text-[#64748b] mb-1 block">Date</label>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#64748b] mb-1 block">Shift type</label>
                    <div className="flex gap-1">
                      {SHIFT_TYPES.filter(s => ['LD', 'MLD', 'TW', 'N'].includes(s.code)).map(opt => (
                        <button
                          key={opt.code}
                          onClick={() => setManualShift(opt.code)}
                          className={`px-2.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                            manualShift === opt.code
                              ? 'border-[#2563eb] bg-[#eff6ff] text-[#2563eb]'
                              : 'border-[#e2e8f0] text-[#64748b] hover:border-[#94a3b8]'
                          }`}
                        >
                          {opt.short}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" onClick={addManualShift} className="shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Upload area */}
          {tab === 'upload' && (
            <div className="max-w-md mx-auto mb-8">
              <div className="space-y-4">
              {/* ICS Upload Box */}
              <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 text-center hover:border-[#2563eb]/40 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-[#94a3b8] mx-auto mb-3" />
                <p className="text-sm text-[#475569] font-medium">Drop your rota file here</p>
                <p className="text-xs text-[#94a3b8] mt-1">ICS file or photo — or click to browse</p>
                <p className="text-[10px] text-[#cbd5e1] mt-3">HealthRota, Rotamaster, or a screenshot of your rota</p>
              </div>

              {/* Photo Upload Button (separate, more explicit) */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  className="text-xs border-[#2563eb]/30"
                >
                  <Camera className="w-3.5 h-3.5 mr-1.5" />
                  Upload a photo of your rota instead
                </Button>
              </div>
            </div>
            </div>
          )}

          {/* AI processing indicator */}
          {aiLoading && (
            <div className="max-w-md mx-auto mb-6 p-6 bg-[#eff6ff] border border-[#2563eb]/20 rounded-xl text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-10 h-10 mx-auto mb-3"
              >
                <Loader2 className="w-10 h-10 text-[#2563eb]" />
              </motion.div>
              <p className="text-sm font-medium text-[#2563eb]">{aiStatus || 'Reading your rota with AI...'}</p>
              <p className="text-xs text-[#64748b] mt-1">Your photo is sent to OpenRouter (Gemini Vision). No data is stored.</p>
            </div>
          )}

          {/* Shift list */}
          {!aiLoading && shifts.length > 0 && (tab === 'manual' || tab === 'results' || tab === 'upload') && (
            <div className="max-w-lg mx-auto mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Your shifts ({shifts.length})
                </h3>
                {shifts.length > 0 && (
                  <Button size="sm" variant="outline" onClick={calculate} className="text-xs">
                    <Activity className="w-3.5 h-3.5 mr-1.5" />
                    Calculate fatigue score
                  </Button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-[#e2e8f0] max-h-60 overflow-y-auto">
                {shifts.map((s) => {
                  const st = SHIFT_TYPES.find(t => t.code === s.shiftCode);
                  return (
                    <div key={s.date} className="flex items-center justify-between px-4 py-2.5 border-b border-[#e2e8f0] last:border-b-0 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#64748b] w-24">{s.date}</span>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-semibold text-white"
                          style={{ backgroundColor: st?.color || '#64748b' }}
                        >
                          {st?.short || s.shiftCode}
                        </span>
                      </div>
                      <button
                        onClick={() => removeShift(s.date)}
                        className="text-[#94a3b8] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {icsErrors.length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200/50 rounded-lg">
                  <p className="text-xs font-semibold text-amber-600 mb-1">Parse warnings</p>
                  <ul className="text-xs text-amber-700 space-y-0.5">
                    {icsErrors.slice(0, 5).map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {parseSummary && (
                <div className="mt-2 text-xs text-[#64748b] text-center">
                  Parsed {parseSummary.parsed} shifts from rota file
                  {parseSummary.failed > 0 && ` (${parseSummary.failed} skipped)`}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto mb-6 p-3 bg-red-50 border border-red-200/50 rounded-lg text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {/* ===== RESULTS ===== */}
          {results && tab === 'results' && shifts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* Score + Gauge */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-8">
                <div className="text-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Your Fatigue Score</span>
                </div>
                <div className="flex justify-center mb-4">
                  <FatigueGauge score={results.score} size={180} />
                </div>
                <p className="text-center text-sm text-[#475569] max-w-md mx-auto">
                  {results.headline}
                </p>
              </div>

              {/* Dimension Breakdown */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-6">
                <h3 className="font-semibold text-foreground text-sm mb-4">Dimension Breakdown</h3>
                <div className="space-y-3">
                  {DIMENSIONS.map((dim) => {
                    const score = results.componentScores[dim.key] || 0;
                    const absScore = Math.abs(score);
                    const pct = Math.min(absScore / 40, 1) * 100;
                    return (
                      <div key={dim.key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center gap-1.5">
                            <span>{dim.icon}</span>
                            <span className="font-medium text-foreground">{dim.label}</span>
                          </span>
                          <span className={`font-semibold ${score > 20 ? 'text-red-600' : score > 10 ? 'text-amber-600' : 'text-[#64748b]'}`}>
                            +{score}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: dim.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Recovery credit */}
                  {results.componentScores.recovery_credit && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-1.5">
                          <span>✅</span>
                          <span className="font-medium text-[#10b981]">Recovery Blocks</span>
                        </span>
                        <span className="font-semibold text-[#10b981]">{results.componentScores.recovery_credit}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                        <div className="h-full rounded-full bg-[#10b981] transition-all duration-700"
                          style={{ width: `${Math.min(Math.abs(results.componentScores.recovery_credit) / 12, 1) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Flags */}
              {results.flags.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-6">
                  <h3 className="font-semibold text-foreground text-sm mb-4">Flags &amp; Warnings</h3>
                  <div className="space-y-3">
                    {results.flags.map((flag) => (
                      <div
                        key={flag.code}
                        className={`p-3 rounded-xl text-sm border ${
                          flag.severity === 'high'
                            ? 'bg-red-50 border-red-200/50'
                            : flag.severity === 'medium'
                            ? 'bg-amber-50 border-amber-200/50'
                            : 'bg-yellow-50 border-yellow-200/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                            flag.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                          }`} />
                          <div>
                            <p className={`font-semibold text-sm ${
                              flag.severity === 'high' ? 'text-red-800' : 'text-amber-800'
                            }`}>{flag.title}</p>
                            <p className="text-xs mt-0.5 text-[#64748b]">{flag.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats summary */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-6">
                <h3 className="font-semibold text-foreground text-sm mb-3">Shift Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-[#f8fafc] text-center">
                    <p className="text-lg font-bold text-foreground">{results.nightCount}</p>
                    <p className="text-xs text-[#64748b]">Night shifts</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#f8fafc] text-center">
                    <p className="text-lg font-bold text-foreground">{results.maxConsecutiveWorkDays}</p>
                    <p className="text-xs text-[#64748b]">Max consecutive days</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#f8fafc] text-center">
                    <p className="text-lg font-bold text-foreground">{results.shortRecoveryCount}</p>
                    <p className="text-xs text-[#64748b]">Short recoveries</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#f8fafc] text-center">
                    <p className="text-lg font-bold text-foreground">{results.recoveryBlockCount}</p>
                    <p className="text-xs text-[#64748b]">Recovery blocks</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center bg-gradient-to-br from-[#eff6ff] to-white rounded-2xl border border-[#e2e8f0] p-8 mb-8">
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Want the full picture?
                </h3>
                <p className="text-sm text-[#475569] mb-4 max-w-sm mx-auto">
                  Shiftlyx tracks your fatigue over time, suggests optimisations, and helps coordinate with your partner.
                </p>
                <Link href="/download">
                  <Button
                    size="lg"
                    className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50"
                  >
                    Get Shiftlyx free →
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Two minutes to your first fatigue score.
          </h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Get the full app — fatigue tracking, AI shift planning, partner sync, and more. Free during early access.
          </p>
          <Link href="/download">
            <Button
              size="lg"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50"
            >
              Get early access →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
