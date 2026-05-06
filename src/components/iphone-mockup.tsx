"use client";

import { cn } from "@/lib/utils";

interface iPhoneMockupProps {
  className?: string;
}

export default function IPhoneMockup({ className }: iPhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto w-[280px]", className)}>
      {/* iPhone Frame */}
      <div className="relative rounded-[3rem] border-[3px] border-[#1a1a2e] bg-[#1a1a2e] shadow-2xl overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-[100px] h-[26px] bg-black rounded-full" />

        {/* Screen */}
        <div className="rounded-[2.6rem] overflow-hidden bg-white">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-8 pt-8 pb-2 text-[10px] text-white">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-2.5" viewBox="0 0 14 10" fill="currentColor">
                <rect x="10" y="3" width="4" height="7" rx="0.5" />
                <rect x="6" y="2" width="4" height="8" rx="0.5" />
                <rect x="2" y="1" width="4" height="9" rx="0.5" />
              </svg>
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 9a4 4 0 110-8 4 4 0 010 8z" />
              </svg>
            </div>
          </div>

          {/* App Content */}
          <div className="px-5 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[10px] font-semibold text-[#2563eb] tracking-tight">
                  SHIFTLYX
                </h3>
                <p className="text-[8px] text-[#475569]">Today&apos;s Overview</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                <svg className="w-3 h-3 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Fatigue Score Mini */}
            <div className="flex items-center gap-3 mb-4 bg-[#f8fafc] rounded-xl p-3">
              <div className="relative w-14 h-14 flex-shrink-0">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="18" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="113"
                    strokeDashoffset="52"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#f59e0b]">
                  42
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-semibold text-[#0f172a]">Moderate Fatigue</p>
                <p className="text-[7px] text-[#475569] truncate">Plan: High Demand</p>
              </div>
            </div>

            {/* Mini Bars */}
            <div className="space-y-1.5 mb-4">
              {[
                { label: "Consecutive Days", value: 78, color: "#ef4444" },
                { label: "Night Clustering", value: 45, color: "#f59e0b" },
                { label: "Short Recovery", value: 30, color: "#eab308" },
                { label: "Circadian Disruption", value: 55, color: "#f59e0b" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between text-[7px] mb-0.5">
                    <span className="text-[#475569] font-medium">{bar.label}</span>
                    <span className="text-[#0f172a] font-semibold">{bar.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${bar.value}%`, backgroundColor: bar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
              {[
                { icon: "◉", label: "Today" },
                { icon: "☰", label: "Plans" },
                { icon: "◈", label: "Partner" },
                { icon: "⚙", label: "Settings" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-0.5">
                  <span className="text-xs text-[#475569]">{item.icon}</span>
                  <span className="text-[6px] text-[#475569] font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
