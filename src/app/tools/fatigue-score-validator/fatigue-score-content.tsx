"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload, Plus, Trash2, Activity, Moon, Clock, Sun, Calendar,
  AlertTriangle, CheckCircle2, ChevronRight, BarChart3,
  TrendingUp, Zap, Brain, Download, Loader2,
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
  // Phase: 'input' (choose method) → 'review' (calendar + shifts) → 'results'
  const [phase, setPhase] = useState<'input' | 'review' | 'results'>('input');
  const [shifts, setShifts] = useState<ShiftInput[]>([]);
  const [results, setResults] = useState<FatigueAnalysis | null>(null);
  const [icsErrors, setIcsErrors] = useState<string[]>([]);
  const [parseSummary, setParseSummary] = useState<{ total: number; parsed: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const now = new Date();
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftInput['shiftCode']>('LD');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Auto-navigate calendar to month of first shift whenever shifts are loaded externally
  useEffect(() => {
    if (shifts.length > 0) {
      const parts = shifts[0].date.split('-');
      const shiftYear = parseInt(parts[0]);
      const shiftMonth = parseInt(parts[1]) - 1; // 0-indexed
      if (shiftYear !== calendarYear || shiftMonth !== calendarMonth) {
        setCalendarYear(shiftYear);
        setCalendarMonth(shiftMonth);
      }
    }
  }, [shifts]);

  // Toggle shift on a calendar day
  const toggleDayShift = useCallback((day: number) => {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setShifts(prev => {
      const existing = prev.find(s => s.date === dateStr);
      // If same shift type exists, remove it; otherwise set/override
      if (existing && existing.shiftCode === selectedShiftType) {
        return prev.filter(s => s.date !== dateStr);
      }
      // If different shift type exists, override
      if (existing) {
        return prev.map(s => s.date === dateStr ? { date: dateStr, shiftCode: selectedShiftType as ShiftInput['shiftCode'] } : s);
      }
      return [...prev, { date: dateStr, shiftCode: selectedShiftType as ShiftInput['shiftCode'] }].sort((a, b) => a.date.localeCompare(b.date));
    });
  }, [calendarYear, calendarMonth, selectedShiftType]);

  // Get shift for a date
  const getShiftForDay = useCallback((day: number): ShiftInput | undefined => {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return shifts.find(s => s.date === dateStr);
  }, [shifts, calendarYear, calendarMonth]);

  // Calendar helpers
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
  // Convert to Mon-start: Sun=6, Mon=0, Tue=1, etc.
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calendarYear && today.getMonth() === calendarMonth;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const prevMonth = useCallback(() => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  }, [calendarMonth]);

  const nextMonth = useCallback(() => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  }, [calendarMonth]);

  // Remove shift
  const removeShift = useCallback((date: string) => {
    setShifts(prev => prev.filter(s => s.date !== date));
  }, []);

  // Load sample
  const loadSample = useCallback(() => {
    setShifts(generateSampleShifts());
    setPhase('results');
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
    setPhase('results');
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

      // Normalise dates (AI returns unpadded like "2026-5-15") then convert to ShiftInput[]
      const parsedShifts: ShiftInput[] = Object.entries(data.shifts)
        .filter(([_, code]) => code !== 'OFF')
        .map(([date, code]) => {
          const parts = date.split('-');
          const y = parts[0];
          const m = String(parseInt(parts[1])).padStart(2, '0');
          const d = String(parseInt(parts[2])).padStart(2, '0');
          return { date: `${y}-${m}-${d}`, shiftCode: code as ShiftInput['shiftCode'] };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      setShifts(parsedShifts);

      // Auto-navigate calendar to the first parsed shift's month/year
      if (parsedShifts.length > 0) {
        const firstParts = parsedShifts[0].date.split('-');
        setCalendarYear(parseInt(firstParts[0]));
        setCalendarMonth(parseInt(firstParts[1]) - 1);
      }

      // Small delay so user sees the status message, then show calendar grid to review
      setTimeout(() => {
        setAiLoading(false);
        setAiStatus(null);
        setPhase('review');
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
        setError(`Couldn't find any shifts in that file. ${result.errors[0] || 'Make sure it\'s a valid rota export (e.g. from HealthRota or your scheduling system).'}`);
        return;
      }

      setShifts(result.shifts);

      // Auto-navigate calendar to the first shift's month/year
      if (result.shifts.length > 0) {
        const firstDate = result.shifts[0].date;
        const [y, m] = firstDate.split('-').map(Number);
        setCalendarYear(y);
        setCalendarMonth(m - 1); // 0-indexed
      }

      setPhase('review');
      setParseSummary({ total: result.totalEvents, parsed: result.parsed, failed: result.failed });
      setIcsErrors(result.errors);
      setError(null);
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
      {/* ===== COMPACT HERO ===== */}
      <section className="pt-16 pb-4 bg-gradient-to-b from-[#eff6ff] to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-3 text-[11px] font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff] uppercase tracking-wider">
            Free Tool
          </Badge>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 leading-tight">
            Check your rota&apos;s fatigue score
          </h1>
          <p className="text-base text-[#475569] max-w-lg mx-auto leading-relaxed mb-6">
            Upload your rota file, snap a photo, or enter shifts manually.
            Four dimensions combine into one clear score. All in-browser — nothing stored.
          </p>
        </div>
      </section>

      {/* (4 dimensions + colour zones moved into results section below) */}



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

      {/* ===== INTERACTIVE TOOL SECTION ===== */}
      <section id="fatigue-validator" className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Section is at the top with the hero — user flows directly into the cards */}

          {/* ===== PHASE 1: INPUT METHODS ===== */}
          {phase === 'input' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-8"
            >
              {/* 3 Big Cards */}
              <div className="grid md:grid-cols-3 gap-4">

                {/* Card 1: Upload ICS */}
                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white rounded-2xl border-2 border-dashed border-[#cbd5e1] p-6 text-center hover:border-[#2563eb] hover:bg-[#f8fafc] transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#dbeafe] transition-colors">
                    <Upload className="w-8 h-8 text-[#2563eb]" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-1">Upload rota file</h3>
                  <p className="text-sm text-[#64748b] mb-4">ICS export from HealthRota, Rotamaster, or Loop</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563eb] bg-[#eff6ff] px-3 py-1.5 rounded-full">
                    <Upload className="w-3.5 h-3.5" />
                    Browse or drop
                  </span>
                  <p className="text-[10px] text-[#94a3b8] mt-4">Parses in-browser. Nothing leaves your device.</p>
                </div>

                {/* Card 2: Upload Photo */}
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="bg-white rounded-2xl border-2 border-dashed border-[#cbd5e1] p-6 text-center hover:border-[#2563eb] hover:bg-[#f8fafc] transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#fdf2f8] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#fce7f3] transition-colors">
                    <svg className="w-8 h-8 text-[#db2777]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-1">Take a photo</h3>
                  <p className="text-sm text-[#64748b] mb-4">Snap your printed rota or screenshot</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#db2777] bg-[#fdf2f8] px-3 py-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Browse photo
                  </span>
                  <p className="text-[10px] text-[#94a3b8] mt-4">AI powered by Gemini Vision. Shifts only, nothing saved.</p>
                </div>

                {/* Card 3: Manual / Sample */}
                <div className="bg-white rounded-2xl border-2 border-[#e2e8f0] p-6 text-center hover:border-[#2563eb] hover:bg-[#f8fafc] transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#dcfce7] transition-colors">
                    <Plus className="w-8 h-8 text-[#16a34a]" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-1">Enter manually</h3>
                  <p className="text-sm text-[#64748b] mb-4">Tap shifts on a calendar — or try a sample rota</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setPhase('review')}
                      className="text-xs font-medium text-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 rounded-full hover:bg-[#dcfce7] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 inline mr-1" />
                      Open calendar
                    </button>
                    <button
                      onClick={loadSample}
                      className="text-xs font-medium text-[#64748b] bg-[#f8fafc] px-3 py-1.5 rounded-full hover:bg-[#f1f5f9] transition-colors"
                    >
                      Load sample rota
                    </button>
                  </div>
                </div>

              </div>

              {/* Error display in input phase */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200/50 rounded-xl text-sm text-red-700 text-center">
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {/* ===== AI processing indicator ===== */}
          {aiLoading && (
            <div className="max-w-md mx-auto mb-8 p-8 bg-[#eff6ff] border border-[#2563eb]/20 rounded-2xl text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-12 h-12 mx-auto mb-4"
              >
                <Loader2 className="w-12 h-12 text-[#2563eb]" />
              </motion.div>
              <p className="text-base font-semibold text-[#2563eb]">{aiStatus || 'Reading your rota with AI...'}</p>
              <p className="text-xs text-[#64748b] mt-2">Your photo is sent to OpenRouter (Gemini Vision). No data is stored.</p>
            </div>
          )}

          {/* ===== PHASE 2: REVIEW (Calendar + Shift List) ===== */}
          {(phase === 'review' || phase === 'results') && !aiLoading && (
            <>
              {/* Step indicator */}
              <div className="max-w-xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-2 text-xs font-medium">
                  <span className={`px-3 py-1.5 rounded-full ${phase === 'review' ? 'bg-[#2563eb] text-white' : 'bg-[#eff6ff] text-[#2563eb]'}`}>1. Get shifts</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
                  <span className={`px-3 py-1.5 rounded-full ${phase === 'review' ? 'bg-[#2563eb] text-white' : 'bg-[#eff6ff] text-[#2563eb]'}`}>2. Review</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
                  <span className={`px-3 py-1.5 rounded-full ${phase === 'results' ? 'bg-[#2563eb] text-white' : 'bg-[#f8fafc] text-[#94a3b8]'}`}>3. Score</span>
                </div>
              </div>

              {/* Back to input button */}
              <div className="max-w-xl mx-auto mb-4">
                <button
                  onClick={() => setPhase('input')}
                  className="text-xs font-medium text-[#64748b] hover:text-[#2563eb] transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Choose a different input method
                </button>
              </div>

              {/* Calendar and shift list */}
              <div className="max-w-xl mx-auto mb-8">
                {/* Shift type legend */}
                <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-3">
                  <p className="text-xs font-medium text-[#64748b] mb-3">Select a shift type, then tap days on the calendar:</p>
                  <div className="flex flex-wrap gap-2">
                    {SHIFT_TYPES.filter(s => ['LD', 'MLD', 'TW', 'N', 'OFF', 'AL', 'SL'].includes(s.code)).map(opt => (
                      <button
                        key={opt.code}
                        onClick={() => setSelectedShiftType(opt.code)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                          selectedShiftType === opt.code
                            ? 'ring-2 ring-offset-2 ring-[#2563eb] scale-105 shadow-sm'
                            : 'opacity-80 hover:opacity-100 hover:shadow-sm'
                        }`}
                        style={{
                          backgroundColor: opt.color + '20',
                          borderColor: opt.color + '40',
                          color: opt.color,
                        }}
                      >
                        {opt.short} — {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Month navigation */}
                <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-4 py-2 mb-3">
                  <button
                    onClick={prevMonth}
                    className="w-10 h-10 rounded-lg hover:bg-[#f1f5f9] flex items-center justify-center text-[#64748b] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="font-semibold text-foreground text-sm">
                    {monthNames[calendarMonth]} {calendarYear}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="w-10 h-10 rounded-lg hover:bg-[#f1f5f9] flex items-center justify-center text-[#64748b] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                {/* Calendar grid */}
                <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                  <div className="grid grid-cols-7 border-b border-[#e2e8f0]">
                    {dayHeaders.map(d => (
                      <div key={d} className="py-2 text-center text-[11px] font-medium text-[#94a3b8] uppercase tracking-wider">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {Array.from({ length: startOffset }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square p-1.5" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const shift = getShiftForDay(day);
                      const isToday = isCurrentMonth && day === today.getDate();
                      const st = shift ? SHIFT_TYPES.find(t => t.code === shift.shiftCode) : null;
                      return (
                        <button
                          key={day}
                          onClick={() => toggleDayShift(day)}
                          className={`aspect-square p-1 relative group transition-colors
                            ${isToday ? 'bg-[#eff6ff]' : 'hover:bg-[#f8fafc]'}
                          `}
                          title={`${day} ${monthNames[calendarMonth]} — ${st?.label || 'No shift'}`}
                        >
                          <div className="w-full h-full rounded-lg flex flex-col items-center justify-center relative">
                            <span className={`text-xs font-medium ${
                              isToday ? 'text-[#2563eb]' : 'text-[#475569]'
                            }`}>
                              {day}
                            </span>
                            {st && st.code !== 'OFF' ? (
                              <span
                                className="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-white leading-tight"
                                style={{ backgroundColor: st.color }}
                              >
                                {st.short}
                              </span>
                            ) : st?.code === 'OFF' ? (
                              <span className="mt-0.5 text-[9px] text-[#94a3b8] font-medium">
                                OFF
                              </span>
                            ) : null}
                            {isToday && !st && (
                              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#2563eb]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-xs text-[#94a3b8] mt-2 text-center">
                  Tap a day to assign the selected shift type. Tap again to remove.
                </p>
              </div>

              {/* Shift List + Calculate */}
              <div className="max-w-xl mx-auto mb-8">
                {/* Header with shift count + big calc button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-base font-bold text-foreground">
                    Your shifts
                    {shifts.length > 0 && (
                      <span className="ml-1.5 text-sm font-normal text-[#64748b]">({shifts.length})</span>
                    )}
                  </h3>
                </div>

                {/* Shift items */}
                {shifts.length > 0 ? (
                  <>
                    <div className="bg-white rounded-xl border border-[#e2e8f0] max-h-48 overflow-y-auto mb-4">
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

                    {/* BIG Calculate button */}
                    <Button
                      onClick={calculate}
                      size="lg"
                      className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-base px-8 w-full shadow-lg shadow-blue-200/50"
                    >
                      <Activity className="w-5 h-5 mr-2" />
                      Calculate my fatigue score
                    </Button>
                  </>
                ) : (
                  <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-8 text-center">
                    <Calendar className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
                    <p className="text-sm text-[#64748b]">No shifts yet. Tap dates on the calendar above to build your rota.</p>
                  </div>
                )}

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

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200/50 rounded-xl text-sm text-red-700 text-center">
                    {error}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ===== PHASE 3: RESULTS ===== */}
          {results && phase === 'results' && (
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

              {/* How this score works (collapsible) */}
              <details className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-4 group">
                <summary className="px-6 py-4 font-semibold text-sm text-foreground cursor-pointer hover:bg-[#f8fafc] transition-colors list-none flex items-center justify-between">
                  <span>How this score works</span>
                  <ChevronRight className="w-4 h-4 text-[#94a3b8] group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">📅</span>
                        <h4 className="font-semibold text-sm text-foreground">Consecutive Work Days</h4>
                      </div>
                      <p className="text-xs text-[#64748b]">Penalty after day 3. Each extra day compounds fatigue.</p>
                    </div>
                    <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">🌙</span>
                        <h4 className="font-semibold text-sm text-foreground">Night Clustering</h4>
                      </div>
                      <p className="text-xs text-[#64748b]">Penalty after night 2. Packed nights disrupt circadian rhythm.</p>
                    </div>
                    <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">⏱️</span>
                        <h4 className="font-semibold text-sm text-foreground">Short Recovery</h4>
                      </div>
                      <p className="text-xs text-[#64748b]">&lt;11h between shifts = +10 per incident.</p>
                    </div>
                    <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">🔄</span>
                        <h4 className="font-semibold text-sm text-foreground">Circadian Disruption</h4>
                      </div>
                      <p className="text-xs text-[#64748b]">Night→day flips. +9 per flip.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg p-3 text-center bg-green-50 border border-green-200/50">
                      <div className="w-5 h-5 rounded-full bg-[#10b981] mx-auto mb-1" />
                      <p className="font-semibold text-xs text-foreground">Low 0–30</p>
                      <p className="text-[10px] text-[#64748b]">Sustainable</p>
                    </div>
                    <div className="rounded-lg p-3 text-center bg-amber-50 border border-amber-200/50">
                      <div className="w-5 h-5 rounded-full bg-[#f59e0b] mx-auto mb-1" />
                      <p className="font-semibold text-xs text-foreground">Moderate 31–60</p>
                      <p className="text-[10px] text-[#64748b]">High demand</p>
                    </div>
                    <div className="rounded-lg p-3 text-center bg-red-50 border border-red-200/50">
                      <div className="w-5 h-5 rounded-full bg-[#ef4444] mx-auto mb-1" />
                      <p className="font-semibold text-xs text-foreground">High 61–100</p>
                      <p className="text-[10px] text-[#64748b]">Critical strain</p>
                    </div>
                  </div>
                </div>
              </details>

              {/* Check another + App CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <Button
                  onClick={() => { setPhase('input'); setResults(null); setShifts([]); setIcsErrors([]); setParseSummary(null); }}
                  variant="outline"
                  size="lg"
                  className="border-[#cbd5e1] text-[#475569] w-full sm:w-auto"
                >
                  Check another rota
                </Button>
                <Link href="/waitlist" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50 w-full sm:w-auto"
                  >
                    Get the app — join waitlist →
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>
</div>
  );
}
