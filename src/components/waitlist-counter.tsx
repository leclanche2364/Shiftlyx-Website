"use client";

import { useEffect, useState } from "react";

interface WaitlistCounterProps {
  baseCount?: number;
  cap?: number;
  dailyRate?: number;
  targetDate?: string; // ISO date, e.g. "2026-07-01T00:00:00+01:00"
}

export default function WaitlistCounter({
  baseCount = 847,
  cap = 1000,
  dailyRate = 40,
  targetDate = "2026-07-01T00:00:00+01:00",
}: WaitlistCounterProps) {
  const [count, setCount] = useState(baseCount);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hourlyJoins, setHourlyJoins] = useState(3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Reference time for the fake counter: June 7 2026 00:00 BST
    const refTime = new Date("2026-06-06T23:00:00Z").getTime();
    const ratePerMs = dailyRate / 86400000;
    let lastHourCount = 0;
    let hourlyTimer = 0;

    const tick = () => {
      const now = Date.now();
      // Counter
      const elapsed = now - refTime;
      const fakeGrowth = Math.floor(elapsed * ratePerMs);
      const newCount = Math.min(baseCount + fakeGrowth, cap);
      setCount(newCount);

      // Track last-hour joins
      const hourElapsed = Math.floor(elapsed / 3600000);
      if (hourElapsed !== hourlyTimer) {
        hourlyTimer = hourElapsed;
        setHourlyJoins(Math.max(1, Math.floor(dailyRate / 8) + Math.floor(Math.random() * 5)));
      }

      // Countdown
      const target = new Date(targetDate).getTime();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [baseCount, dailyRate, targetDate]);

  const displayCount = Math.min(count, cap);
  const spotsLeft = Math.max(0, cap - displayCount);
  const spotsPct = (spotsLeft / cap) * 100;

  if (!mounted) return <div className="h-[520px]" />; // prevent hydration mismatch

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1a1a3e] to-[#0d0d2b] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,150,136,0.2)] border border-[#009688]/40">

        {/* ── SOCIAL PROOF TICKER ── */}
        <div className="flex items-center justify-center gap-5 mb-6 text-xs font-bold text-[#94a3b8] tracking-wide">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {hourlyJoins} joined this hour
          </span>
          <span className="text-[#009688]/40">|</span>
          <span className="flex items-center gap-1">
            📱 {Math.max(80, Math.floor(dailyRate * 2.5))} viewing now
          </span>
        </div>

        {/* ── SPOTS LEFT — HERO ── */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 px-5 py-2 rounded-full border border-amber-500/30 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
              {spotsLeft === 0 ? "⚠️ SOLD OUT" : `🚨 Only ${spotsLeft} Spots Left`}
            </span>
          </div>
          <h3 className="font-heading text-3xl font-extrabold text-white leading-tight">
            {displayCount.toLocaleString()} Shift Workers<br/>
            Already Locked In
          </h3>
          <p className="text-sm font-semibold text-[#94a3b8] mt-2 max-w-xs mx-auto">
            The waitlist is filling fast. When the cap hits, 3 months free is gone.{" "}
            <span className="text-amber-400">Don't be the one who misses it.</span>
          </p>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-[#94a3b8] font-semibold">
              <span className="text-white font-extrabold tabular-nums text-base">{displayCount.toLocaleString()}</span> joined
            </span>
            <span className="text-amber-400 font-extrabold tabular-nums text-base">{spotsLeft} spots left</span>
          </div>
          <div className="w-full h-5 bg-[#1e1e4a] rounded-full overflow-hidden border border-[#009688]/20">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{
                width: `${100 - spotsPct}%`,
                background:
                  spotsLeft > 200
                    ? "linear-gradient(90deg, #009688, #00BFA5)"
                    : spotsLeft > 50
                    ? "linear-gradient(90deg, #FFA000, #FF8F00)"
                    : "linear-gradient(90deg, #E53935, #D32F2F)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full" />
            </div>
          </div>
        </div>

        {/* ── REFERRAL CTA — CENTERPIECE ── */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 rounded-xl p-5 border border-amber-500/20 mb-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">⏩</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white mb-1">
                Refer 3 colleagues → skip the queue entirely
              </p>
              <p className="text-xs font-medium text-[#94a3b8]">
                Everyone who signs up gets 3 months free. Refer 3 and you don't wait — you're in, guaranteed.{" "}
                <span className="text-amber-400">No queue. No risk. No catch.</span>
              </p>
              <div className="mt-3 flex items-center gap-2 bg-[#0f172a]/80 px-4 py-2.5 rounded-lg border border-[#1e1e4a]">
                <span className="text-xs text-[#64748b]">🔗</span>
                <code className="text-sm text-[#AAE0D5] font-mono font-semibold flex-1 truncate">
                  shiftlyx.com/waitlist?ref=YOUR_CODE
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* ── COUNTDOWN ── */}
        <div className="bg-[#1e1e4a]/60 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#64748b]">
              Early access ends in
            </span>
            <div className="flex gap-3">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((unit) => (
                <div key={unit.label} className="text-center min-w-[36px]">
                  <span className="text-sm font-extrabold text-white tabular-nums block leading-none">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748b] block">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
