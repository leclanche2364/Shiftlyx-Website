"use client";

import { useEffect, useState } from "react";

interface WaitlistCounterProps {
  /** Base count at reference time (June 7 2026) */
  baseCount?: number;
  /** Maximum spots available */
  cap?: number;
  /** Daily increment rate (fake organic growth) */
  dailyRate?: number;
}

export default function WaitlistCounter({
  baseCount = 847,
  cap = 1000,
  dailyRate = 40,
}: WaitlistCounterProps) {
  const [count, setCount] = useState(baseCount);
  const remaining = Math.max(0, cap - count);

  useEffect(() => {
    // Reference time: June 7 2026 00:00 BST (UTC+1)
    const refTime = new Date("2026-06-06T23:00:00Z").getTime();
    const ratePerMs = dailyRate / 86400000; // 40 per day in ms

    const update = () => {
      const elapsed = Date.now() - refTime;
      const fakeGrowth = Math.floor(elapsed * ratePerMs);
      setCount(baseCount + fakeGrowth);
    };

    update();
    const interval = setInterval(update, 60000); // update every minute
    return () => clearInterval(interval);
  }, [baseCount, dailyRate]);

  // Cap at 1000 for display
  const displayCount = Math.min(count, cap);
  const spotsLeft = Math.max(0, cap - displayCount);

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#006D5B] rounded-2xl p-5 shadow-lg border border-[#009688]/30">
        {/* Number display */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-[#009688] rounded-lg px-4 py-2">
            <span className="text-3xl font-bold text-white tabular-nums">
              {displayCount.toLocaleString()}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#AAE0D5]">shift workers</p>
            <p className="text-xs text-[#88CCC0]">already on the waitlist</p>
          </div>
        </div>

        {/* Spots left bar */}
        <div className="bg-[#1a1a2e]/60 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-[#AAE0D5]">3 months free spots remaining</span>
            <span className="text-sm font-bold text-[#FFA000]">{spotsLeft}</span>
          </div>
          <div className="w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(remaining / cap) * 100}%`,
                background:
                  spotsLeft > 200
                    ? "linear-gradient(90deg, #009688, #00BFA5)"
                    : spotsLeft > 50
                    ? "linear-gradient(90deg, #FFA000, #FF8F00)"
                    : "linear-gradient(90deg, #E53935, #D32F2F)",
              }}
            />
          </div>
        </div>

        {/* Urgency text */}
        <p className="text-xs text-center text-[#88CCC0] mt-3 font-medium">
          {spotsLeft > 0
            ? `Refer 3 colleagues to skip the queue — only ${spotsLeft} spots left for 3 months free`
            : "Early access closed — join the public waitlist"}
        </p>
      </div>
    </div>
  );
}
