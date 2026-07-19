"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Apple,
  Smartphone,
  Check,
  Sparkles,
  Star,
  Shield,
  Mic,
  Infinity,
  TrendingUp,
  Layers,
  Banknote,
  Users,
  CalendarDays,
  Activity,
  ChevronRight,
  Quote,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import IPhoneMockup from "@/components/iphone-mockup";
import { siteConfig } from "@/config/site";

const freeIcons: Record<string, React.ReactNode> = {
  "Fatigue Score (0-100)": <Activity className="w-4 h-4" />,
  "Manual Shift Entry": <CalendarDays className="w-4 h-4" />,
  "Recovery Coach": <Zap className="w-4 h-4" />,
  "Preference Learning": <TrendingUp className="w-4 h-4" />,
};

const premiumIcons: Record<string, React.ReactNode> = {
  "Florence — AI voice assistant with 7 free min/month": <Mic className="w-4 h-4" />,
  "Florence Ask Mode — clarifying questions before planning": <Mic className="w-4 h-4" />,
  "Florence Session History — resume conversations": <Mic className="w-4 h-4" />,
  "Easy top-up: £10/20min when you need more": <Sparkles className="w-4 h-4" />,
  "Fatigue Intelligence Dashboard": <Activity className="w-4 h-4" />,
  "Annual Leave Optimiser": <CalendarDays className="w-4 h-4" />,
  "Income Forecasting": <Banknote className="w-4 h-4" />,
  "Smart Shift Stacking": <Layers className="w-4 h-4" />,
  "Candidate Comparison": <TrendingUp className="w-4 h-4" />,
  "Import/Export": <Shield className="w-4 h-4" />,
  "Commute Engine": <TrendingUp className="w-4 h-4" />,
  "Partner Sync (Premium)": <Users className="w-4 h-4" />,
  "Childcare-Aware Planning": <Users className="w-4 h-4" />,
};

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function DownloadPage() {
  const { free, monthly, annual } = siteConfig.pricing;
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#eff6ff] via-[#f8fafc] to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-100/40 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
                Early Access 2026
              </Badge>

              <h1 className="font-heading text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-bold tracking-tight text-foreground mb-4">
                Your shift, your app.
                <br />
                <span className="gradient-text">Free to start.</span>
              </h1>

              <p className="text-lg text-[#475569] leading-relaxed mb-2 max-w-lg">
                Fatigue score, shift planner, and recovery coach — all included at no cost.
              </p>
              <p className="text-base text-[#475569] leading-relaxed mb-8 max-w-lg">
                Premium unlocks Florence, your AI voice assistant, plus fatigue intelligence,
                income forecasting, and partner sync. From{" "}
                <span className="font-semibold text-foreground">£3.99/month</span> with a{" "}
                <span className="font-semibold text-foreground">free 1-month trial</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Waitlist CTA */}
                <Link href="/waitlist">
                  <Button
                    size="lg"
                    className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 h-14 shadow-lg shadow-amber-200/50 w-full sm:w-auto"
                  >
                    Join waitlist, lock in Day One pricing →
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#64748b]">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#10b981]" />
                  No employer access
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#10b981]" />
                  Free 1-month trial
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#f59e0b]" />
                  Day One price locks in
                </span>
              </div>
            </motion.div>

            {/* Right: Download buttons + stats */}
            <motion.div
              className="flex flex-col items-center lg:items-end"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {/* Store buttons */}
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <a
                  href="https://apps.apple.com/id/app/shiftlyx-own-your-shift/id6767157095"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-base gap-3 px-6 h-14 rounded-2xl w-full cursor-pointer"
                  >
                    <Apple className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-[10px] opacity-70">Download on the</div>
                      <div className="text-base font-semibold -mt-0.5">App Store</div>
                    </div>
                  </Button>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.beemal.shiftlyxAI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-base gap-3 px-6 h-14 rounded-2xl w-full cursor-pointer"
                  >
                    <Smartphone className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-[10px] opacity-70">Get it on</div>
                      <div className="text-base font-semibold -mt-0.5">Google Play</div>
                    </div>
                  </Button>
                </a>
              </div>

              <p className="text-xs text-[#94a3b8] mt-3">iOS 16+ &bull; Android 10+</p>

              {/* Quick stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
                <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
                  <p className="text-2xl font-bold font-heading text-[#2563eb]">£0</p>
                  <p className="text-xs text-[#475569] mt-0.5">Free tier</p>
                </div>
                <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
                  <p className="text-2xl font-bold font-heading text-[#f59e0b]">60%</p>
                  <p className="text-xs text-[#475569] mt-0.5">Annual savings</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING CARDS ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <Badge className="mb-3 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
                Pricing
              </Badge>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Pick your plan
              </h2>
              <p className="text-[#475569] max-w-xl mx-auto">
                Start free, upgrade when you need more. No lock-in. No hidden fees.
              </p>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <button
                onClick={() => setBilling("monthly")}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  billing === "monthly"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-[#475569] hover:text-foreground"
                }`}
              >
                Pay monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  billing === "annual"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-[#475569] hover:text-foreground"
                }`}
              >
                Pay yearly <span className="text-[10px] opacity-80">(save 60%)</span>
              </button>
            </div>

            {/* Two cards */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
              {/* Free */}
              <motion.div
                className="relative bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">Free</h3>
                <p className="text-sm text-[#475569] mb-4">Everything you need to get started.</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold font-heading text-foreground">£0</span>
                  <span className="text-sm text-[#475569] ml-1">/forever</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {free.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-[#d1fae5] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#059669]" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#64748b]">{freeIcons[f]}</span>
                        <span className="text-foreground">{f}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link href="/waitlist">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-sm font-semibold rounded-xl"
                  >
                    Get started free
                  </Button>
                </Link>
              </motion.div>

              {/* Premium / Day One Annual */}
              <motion.div
                className="relative bg-white rounded-2xl border-2 border-[#f59e0b] p-6 lg:p-8 shadow-xl shadow-amber-100/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {/* Best value badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#f59e0b] text-white text-[10px] px-3 py-1 font-semibold rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3 mr-1" /> Best value
                  </Badge>
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                  {billing === "annual" ? annual.name : monthly.name}
                </h3>
                <p className="text-sm text-[#475569] mb-4">
                  {billing === "annual"
                    ? "Lock in your Day One price for life."
                    : "Cancel anytime. No strings attached."}
                </p>

                <div className="mb-6">
                  {billing === "annual" ? (
                    <div>
                      <span className="text-4xl font-bold font-heading text-foreground">
                        £18.99
                      </span>
                      <span className="text-sm text-[#475569] ml-1">/year</span>
                      <p className="text-xs text-[#10b981] font-medium mt-1">
                        Save 60% &mdash; that&rsquo;s just £1.58/month
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold font-heading text-foreground">£3.99</span>
                      <span className="text-sm text-[#475569] ml-1">/month</span>
                      <p className="text-xs text-[#10b981] font-medium mt-1">
                        Free 1-month trial included
                      </p>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    ...free.features.map((f) => ({ name: f, isFree: true })),
                    ...monthly.features
                      .filter((f) => !free.features.includes(f))
                      .map((f) => ({ name: f, isFree: false })),
                  ].map((f) => (
                    <li key={f.name} className="flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-[#d1fae5] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#059669]" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={f.isFree ? "text-[#64748b]" : "text-[#2563eb]"}>
                          {premiumIcons[f.name] || (f.isFree ? freeIcons[f.name] : <Sparkles className="w-4 h-4" />)}
                        </span>
                        <span className={f.isFree ? "text-[#475569]" : "text-foreground font-medium"}>
                          {f.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link href="/waitlist">
                  <Button className="w-full h-12 text-sm font-semibold rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-lg shadow-amber-200/50">
                    {billing === "annual"
                      ? "Get Day One Annual — £18.99"
                      : "Start free trial — £3.99/month"}
                  </Button>
                </Link>
              </motion.div>
            </div>

            <p className="text-center text-xs text-[#94a3b8] mt-6">
              All prices in GBP. Cancel anytime. Day One Annual locks in your early access price for life.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ COMPARISON STRIP (mobile-friendly visual) ═══ */}
      <section className="py-16 bg-[#f8fafc] border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                What&rsquo;s included
              </h2>
              <p className="text-[#475569] text-sm">
                Free gives you the essentials. Premium unlocks the full toolkit.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
              {/* Free column */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">Free</h3>
                    <p className="text-xs text-[#475569]">£0 &mdash; always</p>
                  </div>
                  <Badge className="bg-[#d1fae5] text-[#059669] text-[10px] border-0">
                    Included
                  </Badge>
                </div>
                <ul className="space-y-2.5">
                  {free.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <Check className="w-4 h-4 text-[#10b981] shrink-0" />
                      <span className="flex items-center gap-1.5">
                        <span className="text-[#94a3b8]">{freeIcons[f]}</span>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Premium column */}
              <div className="bg-white rounded-2xl border-2 border-[#f59e0b] p-5 lg:p-6 shadow-md shadow-amber-100/30 relative">
                <div className="absolute -top-2.5 right-4">
                  <Badge className="bg-[#f59e0b] text-white text-[10px] px-2.5 py-0.5 font-semibold border-0">
                    Premium
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">All Premium features</h3>
                    <p className="text-xs text-[#475569]">From £3.99/month</p>
                  </div>
                  <Badge className="bg-[#fef3c7] text-[#d97706] text-[10px] border-0">
                    7-day free trial
                  </Badge>
                </div>
                <ul className="space-y-2.5">
                  {monthly.features.map((f) => {
                    const isNew = !free.features.includes(f);
                    return (
                      <li key={f} className={`flex items-center gap-2.5 text-sm ${isNew ? "text-foreground font-medium" : "text-[#475569]"}`}>
                        <Check className={`w-4 h-4 shrink-0 ${isNew ? "text-[#2563eb]" : "text-[#10b981]"}`} />
                        <span className="flex items-center gap-1.5">
                          <span className={isNew ? "text-[#2563eb]" : "text-[#94a3b8]"}>
                            {premiumIcons[f] || <Sparkles className="w-4 h-4" />}
                          </span>
                          {f}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <Badge className="mb-3 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
                Why shift workers are switching
              </Badge>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                { number: "4", label: "fatigue dimensions scored", detail: "Consecutive days, night clusters, short recovery, circadian disruption" },
                { number: "5", label: "shift strategies", detail: "Income, balanced, health, stacked, AL-maximised" },
                { number: "60%", label: "saved on annual plan", detail: "Day One pricing — locked in for life" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 lg:p-6 text-center hover:shadow-md hover:shadow-blue-500/5 transition-shadow">
                  <p className="text-3xl lg:text-4xl font-bold font-heading text-[#2563eb]">{stat.number}</p>
                  <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">{stat.detail}</p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-gradient-to-br from-[#f0f5ff] to-[#faf5ff] rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 max-w-2xl mx-auto">
              <Quote className="w-6 h-6 text-[#2563eb]/30 mb-3" />
              <p className="text-sm lg:text-base text-foreground leading-relaxed italic">
                &ldquo;I didn&rsquo;t realise how much my fatigue was accumulating until I saw it in numbers.
                The shift planner found patterns I&rsquo;d never noticed. And my partner and I finally
                stopped playing calendar Tetris every month.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-xs font-bold">
                  JM
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Jamie M.</p>
                  <p className="text-xs text-[#475569]">NHS Nurse, Day One Annual member</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eff6ff] via-white to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-amber-100/30 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 text-xs font-medium text-[#f59e0b] border-amber-200 bg-amber-50">
              <Sparkles className="w-3 h-3 mr-1" /> Early access
            </Badge>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 leading-tight">
              Two minutes to your first fatigue score.
            </h2>
            <p className="text-lg text-[#475569] mb-3 max-w-xl mx-auto">
              Download free during early access and lock in your Day One price for life.
            </p>
            <p className="text-sm text-[#64748b] mb-8 max-w-lg mx-auto">
              No credit card required for free tier. Premium starts with a free 1-month trial.
            </p>

            <Link href="/waitlist">
              <Button
                size="lg"
                className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-10 h-14 rounded-2xl shadow-xl shadow-amber-200/50"
              >
                Join waitlist, lock in Day One pricing <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>

            <p className="text-xs text-[#94a3b8] mt-4">
              iOS 16+ &bull; Android 10+ &bull; Free tier available &bull; Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
