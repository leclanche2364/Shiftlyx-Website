import type { Metadata } from "next";
import WaitlistContent from "./waitlist-content";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description: "Join the Shiftlyx waitlist — fatigue score, AI voice shift planner, recovery coach, and more. Free to download and use. Premium from £3.99/month. For NHS nurses, paramedics, midwives, and all healthcare shift workers.",
  alternates: {
    canonical: "https://www.shiftlyx.com/waitlist",
  },
  openGraph: {
    title: "Shiftlyx Waitlist — AI Voice Shift Planning for Healthcare Workers",
    description: "Join the Shiftlyx waitlist and lock in your Day One price for life. Be first to try the AI voice shift planner. For nurses, doctors, paramedics and all healthcare shift workers.",
  },
};

export default function WaitlistPage() {
  return (
    <>
      {/* SEO — server-rendered content for crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>Join the Shiftlyx Waitlist</h1>
        <p>Shiftlyx is an AI shift planner for shift workers. Join the waitlist to lock in your Day One price for life. Free fatigue score, AI voice planner, recovery coach, and partner sync included. Premium from £3.99/month.</p>
        <h2>Fatigue Score</h2>
        <p>Know your tired and why. Four measurable dimensions — consecutive work days, night clustering, short recovery, circadian disruption — combine into one score. No black box.</p>
        <h2>AI Voice Planner</h2>
        <p>Speak naturally to build your schedule. Say &ldquo;Plan my month with more nights&rdquo; or &ldquo;Show me the healthiest option.&rdquo; The voice assistant generates shift patterns ranked for you. Powered by OpenAI.</p>
        <h2>Shift Planner</h2>
        <p>Income Optimised, Balanced, Health Optimised, Shift Stacked, and Annual Leave Maximised. Compare candidates side by side. Powered AI shift scheduling is part of Premium. Free users can manually enter shifts to get their fatigue score.</p>
        <h2>Partner Sync</h2>
        <p>Link with your partner. See both rotas in one view. Four coordination modes including Childcare First. For shift-working couples.</p>
        <h2>Recovery Coach</h2>
        <p>Adaptive reminders for sleep, hydration, and rest. Never during shifts or after nights. Learns when you are receptive.</p>
        <h2>Preference Learning</h2>
        <p>Every rota you accept teaches Shiftlyx. Four affinity scores — income, recovery, continuity, social — improve over time.</p>
        <p>For NHS nurses, paramedics, midwives, HCAs in UK and US. Free to download. Waitlist members lock in Day One price for life.</p>
      </div>
      <WaitlistContent />
    </>
  );
}
