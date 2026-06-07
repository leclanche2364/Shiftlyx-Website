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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Reference time for the fake counter: June 7 2026 00:00 BST
    const refTime = new Date("2026-06-06T23:00:00Z").getTime();
    const ratePerMs = dailyRate / 86400000;

    const tick = () => {
      const now = Date.now();
      // Counter
      const elapsed = now - refTime;
      const fakeGrowth = Math.floor(elapsed * ratePerMs);
      setCount(Math.min(baseCount + fakeGrowth, cap));

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

  if (!mounted) return <div className="h-64" />; // prevent hydration mismatch

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* ── COUNTDOWN ── */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1a1a3e] to-[#0d0d2b] rounded-2xl p-6 shadow-[0_0_30px_rgba(0,150,136,0.15)] border border-[#009688]/40">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-[#009688]/20 px-4 py-1.5 rounded-full border border-[#009688]/30">
            <span className="w-2 h-2 rounded-full bg-[#00BFA5] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#AAE0D5]">
              Early Access closes
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white mt-3 mb-1">
            3 Months Free — First to Join
          </h3>
          <p className="text-xs text-[#94a3b8]">
            Be among the first 1,000 shift workers to get Shiftlyx free. No risk. No catch.
          </p>
        </div>

        {/* Big countdown */}
        <div className="flex justify-center gap-3 mb-5">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Mins", value: timeLeft.minutes },
            { label: "Secs", value: timeLeft.seconds },
          ].map((unit) => (
            <div key={unit.label} className="text-center">
              <div className="bg-[#1e1e4a]/80 rounded-xl px-4 py-3 min-w-[60px] border border-[#009688]/20 shadow-inner">
                <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums block leading-none">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#64748b] mt-1.5 block">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#94a3b8] font-medium">
              <span className="text-white font-bold tabular-nums">{displayCount.toLocaleString()}</span> joined
            </span>
            <span className="text-[#f59e0b] font-bold tabular-nums">{spotsLeft} left</span>
          </div>
          <div className="w-full h-3 bg-[#1e1e4a] rounded-full overflow-hidden border border-[#009688]/20">
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
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full" />
            </div>
          </div>
        </div>

        {/* Referral CTA */}
        <div className="mt-5 pt-4 border-t border-[#009688]/20 text-center">
          <p className="text-xs text-[#94a3b8] mb-2">
            Refer 3 colleagues → <span className="text-[#00BFA5] font-semibold">Skip the queue entirely</span>
          </p>
          <div className="inline-flex items-center gap-1.5 bg-[#009688]/10 px-3 py-1.5 rounded-full">
            <span className="text-[10px] text-[#AAE0D5]">🔗</span>
            <span className="text-[10px] text-[#AAE0D5] font-mono">
              shiftlyx.com/waitlist?ref=YOUR_CODE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
