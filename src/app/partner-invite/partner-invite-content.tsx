"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Smartphone,
  Apple,
  Check,
  ArrowRight,
  Zap,
  CalendarDays,
  Loader2,
  Sparkles,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PartnerInvitePage() {
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [attemptedDeepLink, setAttemptedDeepLink] = useState(false);

  useEffect(() => {
    // Extract invite_token from URL query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get("invite_token");
    if (token) {
      setInviteToken(token);
    }

    // Attempt deep link to app after a short delay
    // If the app doesn't open, user stays on this page to download
    const hasApp = document.cookie.includes("shiftlyx_app_installed");
    if (token && !hasApp) {
      const timer = setTimeout(() => {
        setAttemptedDeepLink(true);
        // Try universal link first, fall back to app store
        const deepLink = `shiftlyx://partner-invite?invite_token=${token}`;
        window.location.href = deepLink;
        // Fallback: after 500ms, if we're still here, user doesn't have the app
        setTimeout(() => {
          setAttemptedDeepLink(false);
        }, 3000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const steps = [
    {
      icon: Apple,
      title: "Download Shiftlyx",
      sub: "Free on iOS and Android",
    },
    {
      icon: Heart,
      title: "Accept the invite",
      sub: inviteToken ? "We already found your invite code" : "Open the link your partner shared",
    },
    {
      icon: CalendarDays,
      title: "See your combined rota",
      sub: "Childcare, shared off days, and more",
    },
  ];

  return (
    <>
      {/* Hero — immediate value, personal framing */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf2f8] via-[#eff6ff] to-[#f0fdf4] opacity-70" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 text-xs font-medium text-pink-600 border-pink-200 bg-pink-50 gap-1.5">
              <Heart className="w-3 h-3 fill-pink-400" />
              Partner Sync
            </Badge>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {inviteToken ? (
                <>
                  Your partner invited you to
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                    sync your schedules
                  </span>
                </>
              ) : (
                <>
                  Two rotas.
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                    One life. One calendar.
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed mb-8">
              {inviteToken
                ? "Tap to accept. See your combined shifts, shared events, and coordinated days off — all in one place."
                : "QR code instant connect. Childcare-first mode. Shared events. Stop negotiating the rota and start living it."}
            </p>

            {/* Deep link auto-attempt indicator */}
            {attemptedDeepLink && (
              <div className="flex items-center justify-center gap-2 text-sm text-[#6366f1] mb-6">
                <Loader2 className="w-4 h-4 animate-spin" />
                Opening Shiftlyx...
              </div>
            )}

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={
                  inviteToken
                    ? `shiftlyx://partner-invite?invite_token=${inviteToken}`
                    : "/download"
                }
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white text-base gap-2 px-8 h-14 shadow-lg shadow-pink-200/50"
                >
                  <Zap className="w-5 h-5" />
                  {inviteToken ? "Accept invite →" : "Get Partner Sync →"}
                </Button>
              </Link>
              {!inviteToken && (
                <Link href="/features#partner-sync">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base gap-2 px-8 h-14 border-[#e2e8f0]"
                  >
                    <Sparkles className="w-5 h-5 text-[#6366f1]" />
                    See all features
                  </Button>
                </Link>
              )}
            </div>

            {/* App store links below CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link href="https://apps.apple.com/app/shiftlyx">
                <Button
                  size="lg"
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm gap-2 px-6 h-12"
                >
                  <Apple className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[9px] opacity-70">Download on the</div>
                    <div className="text-sm font-semibold -mt-0.5">App Store</div>
                  </div>
                </Button>
              </Link>
              <Link href="https://play.google.com/store/apps/details?id=com.shiftlyx.app">
                <Button
                  size="lg"
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm gap-2 px-6 h-12"
                >
                  <Smartphone className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[9px] opacity-70">Get it on</div>
                    <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                  </div>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works — 3 steps (Reduces Activation Energy) */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
            Three taps to sync
          </h2>
          <p className="text-[#475569] text-center mb-12 max-w-lg mx-auto">
            No forms. No setup. No back-and-forth texts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                {/* Step number */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-pink-500" />
                </div>

                {/* Connecting line on desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-pink-200 to-violet-200" />
                )}

                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                  Step {i + 1}
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-1 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-[#475569]">{step.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits — framed as loss aversion + jobs to be done */}
      <section className="py-16 bg-gradient-to-b from-[#fdf2f8] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
            Stop negotiating the rota
          </h2>
          <p className="text-[#475569] text-center mb-12 max-w-lg mx-auto">
            If you and your partner both work shifts, you know the pain. Shiftlyx makes it disappear.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Avoid same heavy days
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                No more coming home to an empty house after a 12-hour night shift
                because your partner pulled the same. Plans automatically rerank to
                keep you from overlapping tough days.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Childcare-first coordination
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                One tap. The system ensures one of you is always available for the
                kids. No late texts asking &quot;Can you cover Thursday?&quot;
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-violet-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Shared events + dates
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Birthday parties, anniversaries, school plays — assign shared events
                and the planner automatically avoids scheduling either of you to work.
                Heart emoji shows up on the calendar. The day stays free.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Joint off days prioritised
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Plans that give you both the same day off are ranked higher.
                More weekends together. More evenings free. The algorithm works
                for your relationship.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to use with partner — detail section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-50 via-white to-violet-50 rounded-2xl p-8 sm:p-12 border border-pink-100">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
              How it works with your partner
            </h2>
            <p className="text-[#475569] text-center mb-8 max-w-lg mx-auto">
              Designed for shift workers in healthcare. Works in seconds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  {
                    label: "NFC tap or QR code",
                    desc: "Hold phones together or scan. Instant connection.",
                  },
                  {
                    label: "4 coordination modes",
                    desc: "Standard, Avoid Same Heavy Days, Childcare First, Shared Off First.",
                  },
                  {
                    label: "Real-time sync",
                    desc: "See partner's shifts (blurred name) in your calendar grid.",
                  },
                  {
                    label: "Plan together",
                    desc: "Generation considers both schedules. Never plan blind.",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <Check className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-sm text-foreground">
                        {item.label}
                      </span>
                      <p className="text-sm text-[#475569]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "No data shared with employer",
                    desc: "Your schedules stay between you and your partner.",
                  },
                  {
                    label: "Disconnect any time",
                    desc: "One tap to unlink. No questions asked.",
                  },
                  {
                    label: "Free forever",
                    desc: "Partner Sync is included in the free tier. No premium needed.",
                  },
                  {
                    label: "Works mid-cycle",
                    desc: "Sync any time. It picks up from today.",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <Check className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-sm text-foreground">
                        {item.label}
                      </span>
                      <p className="text-sm text-[#475569]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof + final CTA */}
      <section className="py-16 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="bg-white rounded-2xl border border-[#e2e8f0] p-8 sm:p-12 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-xs font-medium text-amber-600 border-amber-200 bg-amber-50">
              Free forever
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Partner Sync is free
            </h2>
            <p className="text-[#475569] text-lg mb-6 max-w-lg mx-auto">
              No premium, no paywall, no limits. Sync with your partner and
              coordinate your schedules — included in the free tier.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white text-base gap-2 px-8 h-14 shadow-lg shadow-pink-200/50"
                >
                  <ArrowRight className="w-5 h-5" />
                  Get Partner Sync — free
                </Button>
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-4">
              iOS 16+ · Android 10+ · No account required
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
