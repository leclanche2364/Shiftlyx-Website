import type { Metadata } from "next";
import FatigueScoreContent from "./fatigue-score-content";

export const metadata: Metadata = {
  title: "Fatigue Score — Shiftlyx",
  description:
    "Understand your shift fatigue in numbers. Four measurable dimensions — consecutive days, night clusters, short turnarounds, circadian disruption — combine into one 0-100 score. Upload your rota and see yours now.",
  openGraph: {
    title: "Shiftlyx Fatigue Score — How Tired Are You, Really?",
    description:
      "Your fatigue isn't a feeling, it's physics. Four measurable dimensions — consecutive days, night clusters, short turnarounds, circadian disruption — combine into one 0-100 score. Upload your rota to see yours.",
    images: [
      {
        url: "/og-fatigue-score.jpg",
        width: 1200,
        height: 630,
        alt: "Shiftlyx Fatigue Score — 4 dimensions, one number",
      },
    ],
    siteName: "Shiftlyx",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiftlyx Fatigue Score — How Tired Are You, Really?",
    description:
      "Your fatigue isn't a feeling, it's physics. Four measurable dimensions — consecutive days, night clusters, short turnarounds, circadian disruption — combine into one 0-100 score. Upload your rota to see yours.",
    images: ["/og-fatigue-score.jpg"],
  },
};

import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "🤖 AI Voice Planner",
    desc: "'Plan my next month avoiding weekends' — just speak it. The AI builds your rota around fatigue, recovery, and preferences.",
  },
  {
    title: "🧠 Personal Fatigue Engine",
    desc: "Your rota analysed across 4 dimensions — consecutive days, night clustering, short recovery gaps, circadian disruption. Score goes 0\u2013100.",
  },
  {
    title: "👥 Partner Sync",
    desc: "Connect with your partner's rota. See coverage gaps at a glance — green for covered, red for uncovered. Plan childcare, life, and rest together.",
  },
  {
    title: "🌙 Night Recovery Mode",
    desc: "After a night shift stretch, Shiftlyx builds a sleep window and counts down your recovery hours. Persona-aware, tailored to your shift type.",
  },
  {
    title: "😴 Sleep Window Countdown",
    desc: "After night shifts, Shiftlyx sets a personalised sleep window. A live countdown timer shows you exactly when to rest and how much recovery time you have left.",
  },
  {
    title: "📊 Swap Preview",
    desc: "Before you swap a shift, see how it changes your fatigue and earnings. Make informed decisions, not gut feelings.",
  },
];

export default function FatigueScorePage() {
  return (
    <>
      <FatigueScoreContent />

      {/* ─── Shiftlyx marketing section (below the tool) ─── */}
      <section className="py-20 bg-[#f8fafc] border-t border-[#e2e8f0]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
              The fatigue score is just the start
            </h2>
            <p className="text-base text-[#475569] max-w-xl mx-auto">
              Shiftlyx goes deeper — connecting fatigue to every part of your shift life.
              Download the app and let the numbers work for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#2563eb]/30 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-foreground text-sm mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/waitlist">
              <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-base px-8 py-6 shadow-lg shadow-blue-200/50">
                Join the waitlist — coming next month →
              </Button>
            </Link>
            <p className="text-xs text-[#94a3b8] mt-3">
              iOS and Android. Built for shift workers, by shift workers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
