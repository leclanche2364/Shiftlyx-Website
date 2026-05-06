"use client";

import { cn } from "@/lib/utils";

interface iPhoneMockupProps {
  className?: string;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const shiftLabels = ["OFF", "OFF", "LD", "N", "OFF", "OFF", "OFF"];
const shiftTimes = ["—", "—", "07:00–19:00", "19:00–07:00", "—", "—", "—"];

function ShiftBadge({ label, time }: { label: string; time: string }) {
  const isLD = label === "LD";
  const isN = label === "N";
  const isOff = label === "OFF";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-bold",
          isLD && "bg-[#dbeafe] text-[#2563eb]",
          isN && "bg-[#ede9fe] text-[#7c3aed]",
          isOff && "bg-[#f1f5f9] text-[#94a3b8]"
        )}
      >
        {label}
      </div>
      <span className="text-[5px] text-[#94a3b8] font-medium leading-tight">
        {time}
      </span>
    </div>
  );
}

export default function IPhoneMockup({ className }: iPhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto w-[280px]", className)}>
      {/* iPhone Frame */}
      <div className="relative rounded-[3rem] border-[3px] border-[#1a1a2e] bg-[#1a1a2e] shadow-2xl overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-[100px] h-[26px] bg-black rounded-full" />

        {/* Screen */}
        <div className="rounded-[2.6rem] overflow-hidden bg-[#f2f4f9]">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 pt-8 pb-1 text-[10px] font-semibold text-[#0f172a]">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
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
          <div className="px-3 pb-6 space-y-3">
            {/* App Bar */}
            <div className="flex items-center justify-between px-2">
              <span className="text-xl font-extrabold text-[#153D7A] tracking-tight">
                Shiftio
              </span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#f2f4f9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#61708E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="relative w-9 h-9 rounded-full border-2 border-[#d8e5f6] bg-[#e2e8f0] overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                    JD
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#ff7a6d] rounded-full flex items-center justify-center">
                    <span className="text-[6px] text-white font-bold">1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Month Header + Unit */}
            <div className="px-2">
              <h2 className="text-base font-bold text-[#0f172a] tracking-tight">
                May 2026
              </h2>
              <p className="text-[10px] text-[#61708E] font-medium mt-0.5">
                No unit joined
              </p>
            </div>

            {/* This Week Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-br from-[#f7f6fa] to-[#eaf4fa] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-[#61708E] uppercase tracking-wider">
                      THIS WEEK
                    </p>
                    <p className="text-[11px] text-[#0f172a] mt-0.5">
                      <span className="font-bold">5–11</span> May 2026
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-white/70 text-[9px] font-semibold text-[#2563eb]">
                    1d off
                  </div>
                </div>
              </div>

              {/* Shift Bar */}
              <div className="px-3 py-3">
                <div className="flex justify-between">
                  {weekDays.map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <span className="text-[7px] font-semibold text-[#61708E] uppercase tracking-wider">
                        {day}
                      </span>
                      <ShiftBadge label={shiftLabels[i]} time={shiftTimes[i]} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Planner Button */}
              <div className="px-3 pb-3">
                <div className="w-full h-8 rounded-xl bg-gradient-to-r from-[#5FB1F2] to-[#235EBE] flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-extrabold text-white tracking-wide">
                    Open Planner
                  </span>
                </div>
              </div>
            </div>

            {/* Plan with Voice Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#102148] to-[#172C60] px-3.5 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 bg-gradient-to-br from-[#5B8CFF] via-[#7C5CFF] to-[#42C8FF] p-0.5">
                  <div className="w-full h-full rounded-full bg-[#0D1733] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V5.25a3 3 0 116 0v7.5a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white">
                    Plan with voice
                  </p>
                  <p className="text-[8px] text-white/70 mt-0.5">
                    Just say: &ldquo;Hey Shiftio&hellip;&rdquo;
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rostering Cycle Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#F0C97C] to-[#2D71C7] p-[2px] shadow-sm">
              <div className="rounded-[calc(1rem-2px)] p-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#fae8c3] to-[#5486d3] opacity-30" />
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-4 h-4 rounded-md bg-white/30 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-extrabold text-white">
                      Rostering Cycle
                    </span>
                  </div>
                  <div className="bg-white/94 rounded-xl p-3">
                    <p className="text-[11px] font-extrabold text-[#243450]">
                      July 2026 Rota
                    </p>
                    <p className="text-[9px] font-semibold text-[#2C6F69] mt-1">
                      Request window open
                    </p>
                    <p className="text-[9px] text-[#243450]">
                      Closes in 8 days
                    </p>
                    <div className="mt-2 h-7 rounded-lg bg-gradient-to-r from-[#5FB1F2] to-[#235EBE] flex items-center justify-center shadow-sm">
                      <span className="text-[9px] font-extrabold text-white">
                        Plan My Requests
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between px-6 pt-1">
              {[
                { icon: "◉", label: "Home", active: true },
                { icon: "☰", label: "Plan", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span
                    className={cn(
                      "text-sm",
                      item.active ? "text-[#2563eb]" : "text-[#94a3b8]"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={cn(
                      "text-[6px] font-semibold",
                      item.active ? "text-[#2563eb]" : "text-[#94a3b8]"
                    )}
                  >
                    {item.label}
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
