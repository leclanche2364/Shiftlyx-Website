"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Mail,
  User,
  Briefcase,
  ArrowRight,
  ChevronDown,
  Brain,
  Mic,
  PiggyBank,
  Heart,
  Moon,
  Repeat,
  Scale,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WaitlistCounter from "@/components/waitlist-counter";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";

const nightOptions = ["Days", "Nights", "Mixed"] as const;
const spacingOptions = ["Close together (stack)", "Spread out", "No preference"] as const;
const priorityOptions = ["Maximise income", "Protect health", "Balanced"] as const;
const maxNightsOptions = ["1", "2", "3", "4", "5+"] as const;
const recoveryOptions = ["Bounce back quick", "Need proper rest", "Takes me a while"] as const;
const featureOptions = [
  "Fatigue Score",
  "AI Voice Planning",
  "Partner Sync",
  "Recovery Coaching",
  "Shift Swap Preview",
  "Sleep Tracking",
  "Paycheck vs Fatigue",
] as const;

const incomeTrackOptions = ["Track every penny", "General idea is fine", "Don't care about £"] as const;
const sleepHabitOptions = ["Track sleep & get nudges", "Just basic sleep window", "Not interested"] as const;
const recoveryHabitOptions = ["Structured routine", "Go with the flow", "I push through"] as const;

// ── Detailed features data ──
const FEATURES = [
  {
    icon: Brain,
    title: "Fatigue Score",
    desc: "Your shift pattern scored across 4 dimensions — sleep debt, circadian strain, recovery gaps, and workload. One clear number, not a puzzle.",
    tag: "Free",
  },
  {
    icon: Mic,
    title: "AI Voice Planner",
    desc: "Just say 'Hey Shiftlyx, plan my month'. Speak your preferences, the app builds your rota. No drag-and-drop. No typing.",
    tag: "Free",
  },
  {
    icon: PiggyBank,
    title: "Income Estimator",
    desc: "See the pound signs of every rota choice. Night premiums, weekend enhancements, overtime — know what you'll earn before you agree.",
    tag: "Free",
  },
  {
    icon: Heart,
    title: "Recovery Coach",
    desc: "Adaptive rest nudges based on your actual shift pattern. When your body needs it, the app adjusts — no generic advice.",
    tag: "Free",
  },
  {
    icon: Moon,
    title: "Sleep Coach",
    desc: "Smart sleep windows that shift with your rota. Countdown timer, wind-down nudges, and sleep opportunity tracking for night workers.",
    tag: "Free",
  },
  {
    icon: Repeat,
    title: "Shift Swap Preview",
    desc: "See how a swap changes your fatigue score before you agree. No more guessing if that trade will wreck your week.",
    tag: "Free",
  },
  {
    icon: Scale,
    title: "Paycheck vs Fatigue",
    desc: "Visual trade-off between earnings and recovery. See the real cost of that extra night shift in fatigue, not just pounds.",
    tag: "Free",
  },
  {
    icon: Users,
    title: "Partner Sync",
    desc: "Two rotas, one calendar. Colour-coded coverage view for childcare, shared events, and knowing who's free when. Premium feature.",
    tag: "Premium",
  },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [probesExpanded, setProbesExpanded] = useState(false);
  const [probesCollected, setProbesCollected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [probeLoading, setProbeLoading] = useState(false);
  const [error, setError] = useState("");
  const [probeError, setProbeError] = useState("");
  const [referrerCode, setReferrerCode] = useState("");
  const [myReferralCode, setMyReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState<number | null>(null);
  const [checkingReferral, setCheckingReferral] = useState(false);
  const [savedReferralCode, setSavedReferralCode] = useState<string | null>(null);
  const [savedReferralCount, setSavedReferralCount] = useState<number | null>(null);
  const [checkingSaved, setCheckingSaved] = useState(false);
  const [savedReferralCopied, setSavedReferralCopied] = useState(false);
  const [savedReferralDismissed, setSavedReferralDismissed] = useState(false);

  // Grab ?ref=CODE from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setReferrerCode(ref);
  }, []);

  // Check localStorage for saved referral code on page load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("shiftlyx_ref_code");
      if (saved) {
        setSavedReferralCode(saved);
        setCheckingSaved(true);
        fetch(`/api/referrals?code=${saved}`)
          .then(r => r.json())
          .then(d => setSavedReferralCount(d.count))
          .catch(() => setSavedReferralCount(0))
          .finally(() => setCheckingSaved(false));
      }
    } catch (e) {
      // localStorage not available
    }
  }, []);

  // Probe answers — null = not answered
  const [nightAffinity, setNightAffinity] = useState<string | null>(null);
  const [stackingPref, setStackingPref] = useState<string | null>(null);
  const [incomeVsRecovery, setIncomeVsRecovery] = useState<string | null>(null);
  const [maxNights, setMaxNights] = useState<string | null>(null);
  const [fatigueResilience, setFatigueResilience] = useState<string | null>(null);
  const [incomeTrack, setIncomeTrack] = useState<string | null>(null);
  const [sleepCoach, setSleepCoach] = useState<string | null>(null);
  const [recoveryHabit, setRecoveryHabit] = useState<string | null>(null);

  const allProbesAnswered =
    nightAffinity &&
    stackingPref &&
    incomeVsRecovery &&
    maxNights &&
    fatigueResilience &&
    incomeTrack &&
    sleepCoach &&
    recoveryHabit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, features, referrer_code: referrerCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      // Generate a referral code for this new signup
      const baseCode = (name || email.split("@")[0])
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .slice(0, 12);
      const suffix = Math.random().toString(36).substring(2, 4);
      const code = `${baseCode}-${suffix}`;
      setMyReferralCode(code);
      // Persist for returning visitors
      localStorage.setItem("shiftlyx_ref_code", code);
      setSavedReferralCode(code);

      // Save their referral code
      fetch("/api/waitlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          my_referral_code: code,
        }),
      }).catch(() => {});

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to join. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProbeSubmit = async () => {
    if (!allProbesAnswered) return;

    setProbeLoading(true);
    setProbeError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          probes: {
            night_affinity: nightAffinity,
            stacking_pref: stackingPref,
            income_vs_recovery: incomeVsRecovery,
            max_nights: maxNights,
            fatigue_resilience: fatigueResilience,
            income_track: incomeTrack,
            sleep_coach: sleepCoach,
            recovery_habit: recoveryHabit,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save preferences");
      }

      setProbesCollected(true);
      setProbesExpanded(false);
    } catch (err: any) {
      setProbeError(err.message || "Failed to save. You can do this later in the app.");
    } finally {
      setProbeLoading(false);
    }
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="pt-20 pb-8 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-sm font-bold text-[#f59e0b] border-[#f59e0b]/20 bg-[#fffbeb]">
            🎯 3 Months Free — First 1,000 Only
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4">
            Shiftlyx is a must-have for shift workers.
          </h1>
          <p className="text-lg sm:text-xl font-medium text-[#475569] max-w-2xl mx-auto leading-relaxed mb-6">
            First 1,000 signups get 3 months free. Fatigue score, voice planner, recovery coach.
            Refer 3 colleagues to skip the waitlist.
          </p>

          {/* Fake waitlist counter */}
          <WaitlistCounter />
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* ── Persistent referral progress (from localStorage) ── */}
            {!submitted && savedReferralCode && !savedReferralDismissed && (
              <div className="bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] border border-[#10b981]/20 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    🔄 Your referral progress
                  </span>
                  <span className={`text-sm font-bold ${(savedReferralCount ?? 0) >= 3 ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                    {checkingSaved ? "..." : `${savedReferralCount ?? 0}/3`}
                  </span>
                </div>
                <div className="flex gap-2 mb-2">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${i < (savedReferralCount ?? 0) ? "bg-[#10b981]" : "bg-[#e2e8f0]"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#64748b]">
                    {(savedReferralCount ?? 0) >= 3
                      ? "🎉 You've qualified! We'll move you up the queue."
                      : `${3 - (savedReferralCount ?? 0)} more to go`}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://shiftlyx.com/waitlist?ref=${savedReferralCode}`);
                        setSavedReferralCopied(true);
                        setTimeout(() => setSavedReferralCopied(false), 2000);
                      }}
                      className="text-xs font-semibold text-[#009688] underline"
                    >
                      {savedReferralCopied ? "Copied!" : "Copy link"}
                    </button>
                    <button onClick={() => setSavedReferralDismissed(true)} className="text-xs text-[#94a3b8] hover:text-[#64748b]">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

            {submitted ? (
              <motion.div
                className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#10b981]" />
                </div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                  You&apos;re on the list!
                </h2>
                <p className="text-[#475569] mb-4">
                  Thanks for joining{name ? `, ${name}` : ""}. We&apos;ll email you at{" "}
                  <span className="font-medium text-foreground">{email}</span> when
                  Shiftlyx launches.
                </p>

                {/* ── Referral link ── */}
                <div className="bg-gradient-to-r from-[#0f172a] to-[#1a1a3e] rounded-xl p-4 mb-4 border border-[#009688]/30">
                  <p className="text-xs font-semibold text-[#AAE0D5] mb-2">
                    🔗 Your referral link — share to skip the queue
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-white bg-[#1e1e4a]/80 rounded-lg px-3 py-2 truncate font-mono border border-[#009688]/20">
                      shiftlyx.com/waitlist?ref={myReferralCode}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://shiftlyx.com/waitlist?ref=${myReferralCode}`
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="shrink-0 bg-[#009688] hover:bg-[#00BFA5] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#64748b] mt-2">
                    Refer 3 colleagues — you both skip the waitlist entirely
                  </p>
                </div>

                {/* ── Referral progress tracker ── */}
                <div className="mb-4">
                  {referralCount === null ? (
                    <button
                      onClick={async () => {
                        setCheckingReferral(true);
                        try {
                          const res = await fetch(`/api/referrals?code=${myReferralCode}`);
                          const data = await res.json();
                          setReferralCount(data.count);
                        } catch {
                          setReferralCount(0);
                        } finally {
                          setCheckingReferral(false);
                        }
                      }}
                      disabled={checkingReferral}
                      className="w-full text-xs font-semibold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] border border-[#2563eb]/20 rounded-lg py-2.5 transition-colors"
                    >
                      {checkingReferral ? "Checking..." : "🔍 Check your referral progress"}
                    </button>
                  ) : (
                    <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-foreground">Your referrals</span>
                        <span className={`text-sm font-bold ${referralCount >= 3 ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                          {referralCount}/3
                        </span>
                      </div>
                      {/* Progress dots */}
                      <div className="flex gap-2 mb-2">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 h-2.5 rounded-full transition-all ${
                              i < referralCount
                                ? "bg-[#10b981]"
                                : "bg-[#e2e8f0]"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${referralCount >= 3 ? "text-[#10b981] font-semibold" : "text-[#64748b]"}`}>
                        {referralCount >= 3
                          ? "🎉 You've qualified to skip the queue!"
                          : `Share your link — ${3 - referralCount} more colleague${3 - referralCount === 1 ? "" : "s"} to go`}
                      </p>
                      <button
                        onClick={() => setReferralCount(null)}
                        className="text-[10px] text-[#94a3b8] hover:text-[#64748b] mt-2 underline"
                      >
                        Check again
                      </button>
                    </div>
                  )}
                </div>

                {/* Cold-start probes — shown after successful signup */}
                {!probesCollected && (
                  <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
                    <button
                      onClick={() => setProbesExpanded(!probesExpanded)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <div>
                        <p className="font-heading text-sm font-semibold text-foreground">
                          🧠 Help us personalise Shiftlyx
                        </p>
                        <p className="text-xs text-[#94a3b8] mt-0.5">
                          8 quick questions — match the app to your needs
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#94a3b8] transition-transform ${
                          probesExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {probesExpanded && (
                      <motion.div
                        className="mt-4 space-y-4 text-left"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        {/* Q1: Night affinity */}
                        <div>
                          <p className="text-xs font-medium text-[#475569] mb-2">
                            🌞 Do you mostly do days, nights, or mixed?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {nightOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setNightAffinity(opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  nightAffinity === opt
                                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Q2: Stacking preference */}
                        <div>
                          <p className="text-xs font-medium text-[#475569] mb-2">
                            📋 Shifts close together or spread out?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {spacingOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setStackingPref(opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  stackingPref === opt
                                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Q3: Income vs recovery */}
                        <div>
                          <p className="text-xs font-medium text-[#475569] mb-2">
                            ⚖️ When choosing shifts — money or energy for life?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {priorityOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setIncomeVsRecovery(opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  incomeVsRecovery === opt
                                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Q4: Max nights */}
                        <div>
                          <p className="text-xs font-medium text-[#475569] mb-2">
                            🌙 How many nights in a row feel okay?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {maxNightsOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setMaxNights(opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  maxNights === opt
                                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Q6: Income tracking */}
                        <div>
                          <p className="text-xs font-medium text-[#475569] mb-2">
                            💰 How closely do you track your shift earnings?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {incomeTrackOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setIncomeTrack(opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  incomeTrack === opt
                                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Q7: Sleep coaching */}
                        <div>
                          <p className="text-xs font-medium text-[#475569] mb-2">
                            😴 Would you like sleep window reminders and wind-down nudges?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {sleepHabitOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setSleepCoach(opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  sleepCoach === opt
                                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Q8: Recovery habits */}
                        <div>
                          <p className="text-xs font-medium text-[#475569] mb-2">
                            🛌 How do you handle recovery between shifts?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {recoveryHabitOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setRecoveryHabit(opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  recoveryHabit === opt
                                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Q5: Fatigue resilience */}
                        <div>
                          <p className="text-xs font-medium text-[#475569] mb-2">
                            💪 How well do you bounce back after heavy runs?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {recoveryOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setFatigueResilience(opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  fatigueResilience === opt
                                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                                    : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {probeError && (
                          <p className="text-xs text-center text-[#ef4444]">{probeError}</p>
                        )}

                        <button
                          onClick={handleProbeSubmit}
                          disabled={!allProbesAnswered || probeLoading}
                          className={`w-full text-xs font-semibold py-2 rounded-lg transition-all ${
                            allProbesAnswered
                              ? "bg-[#2563eb]/10 text-[#2563eb] hover:bg-[#2563eb]/20 border border-[#2563eb]/20"
                              : "bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed"
                          }`}
                        >
                          {probeLoading ? "Saving..." : "Save my preferences →"}
                        </button>

                        <p className="text-[10px] text-center text-[#94a3b8]">
                          Won&apos;t share your data. You can change these anytime in the app.
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {probesCollected && (
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-xs text-[#10b981] font-medium">
                      ✅ Preferences saved — Shiftlyx will tailor your experience from Day One.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 space-y-4 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-2">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Join the waitlist
                  </h2>
                  <p className="text-xs text-[#64748b] mt-1">
                    Enter your email and be first to try Shiftlyx.
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-sm text-foreground placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]/30 transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Your name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name (optional)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-sm text-foreground placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]/30 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="role" className="sr-only">
                      Your role
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] z-10" />
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]/30 transition-all"
                      >
                        <option value="">Your role (optional)</option>
                        <option value="nurse">Nurse</option>
                        <option value="hca">HCA</option>
                        <option value="midwife">Midwife</option>
                        <option value="paramedic">Paramedic</option>
                        <option value="other-healthcare">Other healthcare</option>
                        <option value="not-healthcare">Not in healthcare</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748b] mb-2 font-medium">
                      Most anticipated features
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featureOptions.map((f) => {
                        const selected = features.includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() =>
                              setFeatures((prev) =>
                                prev.includes(f)
                                  ? prev.filter((x) => x !== f)
                                  : [...prev, f]
                              )
                            }
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                              selected
                                ? "bg-[#2563eb] text-white border-[#2563eb]"
                                : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2563eb]/30"
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-center text-[#ef4444]">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-[#93c5fd] disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl"
                  size="lg"
                >
                  {loading ? (
                    "Joining..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Join waitlist <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-center text-[#94a3b8]">
                  No spam. We&apos;ll only email about Shiftlyx. Unsubscribe any time.
                </p>
              </motion.form>
            )}
          </div>
        </div>
      </section>

      {/* ── DETAILED FEATURES ── */}
      <section className="pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Everything you need to manage shift work
            </h2>
            <p className="text-[#475569] mt-2">
              One app. Your rota. No employer access. No hidden costs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#2563eb]/20 hover:shadow-sm transition-all"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <feature.icon className="w-6 h-6 text-[#2563eb] mb-3" />
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-heading font-semibold text-foreground text-sm">
                    {feature.title}
                  </h3>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      feature.tag === "Free"
                        ? "bg-[#10b981]/10 text-[#10b981]"
                        : "bg-[#f59e0b]/10 text-[#f59e0b]"
                    }`}
                  >
                    {feature.tag}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-12 bg-[#f8fafc] border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {siteConfig.waitlist.testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                className="bg-white rounded-xl border border-[#e2e8f0] p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, si) => (
                    <Sparkles key={si} className="w-3 h-3 text-[#f59e0b]" fill="#f59e0b" />
                  ))}
                </div>
                <p className="text-sm text-[#475569] italic mb-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-xs font-medium text-[#94a3b8]">— {t.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET AS A WAITLIST MEMBER ── */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            What you get as a waitlist member
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "First access",
                desc: "when the app launches on iOS and Android",
              },
              {
                title: "Free during early access",
                desc: "full feature set, no paywall",
              },
              {
                title: "Free to download and use",
                desc: "fatigue score, shift planner, recovery coach included at no cost — premium from £3.99/month",
              },
              {
                title: "Direct influence",
                desc: "your feedback shapes what we build next",
              },
              {
                title: "Pre-launch updates",
                desc: "a few emails before launch (no spam)",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-3 p-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Check className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {item.title}
                  </p>
                  <p className="text-sm text-[#475569]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-[#f8fafc] border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Waitlist questions
          </h2>
          <Accordion className="space-y-2">
            {siteConfig.waitlist.faq.map((item, i) => (
              <AccordionItem
                key={i}
                className="bg-white rounded-xl border border-[#e2e8f0] px-5"
              >
                <AccordionTrigger className="text-left font-medium text-foreground py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#475569] leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── PRICING CTA ── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Shiftlyx is free to download and use.
          </h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Free fatigue score, planner, recovery coach included. Premium from £3.99/month. Waitlist members lock in their Day One price for life.
          </p>
          {!submitted && (
            <Link href="/download">
              <Button
                size="lg"
                className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50"
              >
                See pricing
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
