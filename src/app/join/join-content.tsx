"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Smartphone,
  Apple,
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function JoinContent() {
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [handOffStarted, setHandOffStarted] = useState(false);
  const [redirectingToStore, setRedirectingToStore] = useState(false);

  useEffect(() => {
    // Extract invite token. Crew invites use the path form /join/{token},
    // but also accept ?token= for flexibility/debugging.
    const params = new URLSearchParams(window.location.search);
    let token: string | null = params.get("token") || params.get("invite_token");

    if (!token && window.location.pathname) {
      const match = window.location.pathname.match(/^\/join\/([A-Za-z0-9_-]+)/);
      if (match) token = match[1];
    }

    if (token) {
      token = token.trim();
      setInviteToken(token);
    }

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    setIsMobile(isIOS || isAndroid);
    setIsIOS(isIOS);
  }, []);

  // ── Universal-link handoff (CTA-driven) ───────────────────────────────────
  //
  // PREVIOUS BUG: the old code auto-set `window.location.href` to the SAME
  // www.shiftlyx.com/join/{token} URL the page was already rendering from,
  // causing an infinite self-reload loop on iPhones. Universal links must be
  // triggered by a real user navigation to an app-associated URL, and the
  // browser must NOT be pointed back at the identical page it is on.
  //
  // FIXED APPROACH:
  //   - No auto-redirect. The user taps the explicit "Open in Shiftlyx" CTA,
  //     whose href is the app universal link (https://www.shiftlyx.com/join/x).
  //   - If the app is installed, iOS/Android intercept that navigation and open
  //     the join screen.
  //   - If the app is NOT installed, the tab stays on this page. We detect the
  //     app did not hand off (visibility + blur) and route to the store.
  const launchApp = () => {
    if (!inviteToken || redirectingToStore) return;
    const isIos = isIOS;
    const storeUrl = isIos
      ? `https://apps.apple.com/id/app/shiftlyx-own-your-shift/id6767157095`
      : `https://play.google.com/store/apps/details?id=com.beemal.shiftlyxAI`;

    // The universal link we hand the OS. This is genuinely different from the
    // page the user is on only when they arrived via a ?token= query or a
    // non-www host; when identical it's still a safe single navigation because
    // we never auto-fire it — it is user-initiated by the CTA tap.
    const universalLink = `https://www.shiftlyx.com/join/${inviteToken}`;
    const currentUrl = `${window.location.origin}${window.location.pathname}`;

    setHandOffStarted(true);

    let storeTimer: ReturnType<typeof setTimeout> | null = null;
    let handedOff = false;

    const onVisibility = () => {
      if (document.hidden || !document.hasFocus()) {
        // App took over the screen — universal link worked. Stop the timer.
        handedOff = true;
        if (storeTimer) clearTimeout(storeTimer);
      }
    };

    const sendToStore = () => {
      if (handedOff || redirectingToStore) return;
      setRedirectingToStore(true);
      window.location.replace(storeUrl);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onVisibility);

    // Navigate to the app universal link. This is a user-initiated tap (not an
    // auto-fire on page load), so pointing at the same www/join/{token} URL the
    // page is already on is exactly how iOS/Android universal links trigger:
    // the OS intercepts the navigation and opens the app. If the app is NOT
    // installed, the tab stays on the page and [sendToStore] routes to the store
    // after the grace period. (The original bug was auto-firing this on mount,
    // which caused an infinite self-reload loop on page load — user-gesture
    // navigation to the same URL is safe and is the intended handoff.)
    window.location.href = universalLink;
    storeTimer = setTimeout(sendToStore, 1800);
  };

  const steps = [
    {
      icon: Apple,
      title: "Download Shiftlyx",
      sub: "Free on iOS and Android",
    },
    {
      icon: Users,
      title: "Accept the invite",
      sub: inviteToken ? "We already found your invite" : "Open the link your teammate shared",
    },
    {
      icon: Shield,
      title: "Plan as a crew",
      sub: "Swap shifts, cover childcare, coordinate days off",
    },
  ];

  return (
    <>
      {/* Hero — immediate value, personal framing */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#eff6ff] via-[#f0fdf4] to-[#fef3c7] opacity-70" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 text-xs font-medium text-blue-600 border-blue-200 bg-blue-50 gap-1.5">
              <Users className="w-3 h-3 text-blue-500" />
              Crew Invite
            </Badge>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {inviteToken ? (
                <>
                  You've been invited
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 to-amber-500 bg-clip-text text-transparent">
                    to join a crew
                  </span>
                </>
              ) : (
                <>
                  Plan your shifts
                  <br />
                  <span className="bg-gradient-to-r from-blue-500 to-amber-500 bg-clip-text text-transparent">
                    as a crew
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed mb-8">
              {inviteToken
                ? "Your teammate is waiting for you. Open Shiftlyx to accept the invite and start syncing your rotas."
                : "Swap shifts, coordinate days off, and cover for each other. Free on iOS and Android."}
            </p>

            {/* Handoff indicator */}
            {handOffStarted && (
              <div className="flex items-center justify-center gap-2 text-sm text-[#2563eb] mb-6">
                <Loader2 className="w-4 h-4 animate-spin" />
                {redirectingToStore ? "Taking you to the store…" : "Opening Shiftlyx…"}
              </div>
            )}

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {inviteToken ? (
                <button
                  type="button"
                  onClick={launchApp}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-amber-500 hover:from-blue-600 hover:to-amber-600 text-white text-base font-semibold px-8 h-14 rounded-xl shadow-lg shadow-blue-200/50 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Open in Shiftlyx →
                </button>
              ) : (
                <Link href="/download">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-amber-500 hover:from-blue-600 hover:to-amber-600 text-white text-base gap-2 px-8 h-14 shadow-lg shadow-blue-200/50"
                  >
                    <Sparkles className="w-5 h-5" />
                    Get Shiftlyx →
                  </Button>
                </Link>
              )}
            </div>

            {/* App store links below CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link href="https://apps.apple.com/id/app/shiftlyx-own-your-shift/id6767157095">
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
              <Link href="https://play.google.com/store/apps/details?id=com.beemal.shiftlyxAI">
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

      {/* How it works — 3 steps */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
            Three taps to plan together
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-amber-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-blue-500" />
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-blue-200 to-amber-200" />
                )}

                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
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

      {/* Benefits — crew coordination */}
      <section className="py-16 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
            Built for your whole crew
          </h2>
          <p className="text-[#475569] text-center mb-12 max-w-lg mx-auto">
            Shift workers know the pain. Shiftlyx makes coordination disappear.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Swap shifts instantly
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                No more group texts begging for cover. Request a swap and the crew
                sees it. One tap to accept, the rota updates itself.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Cover each other
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                See who's free before you ask. Coordinate childcare, appointments,
                and days off together.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                One shared view
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Everyone's shifts, fatigue, and requests in one place. No more
                juggling screens or lost messages.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Your data stays private
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Your schedule stays between you and your crew. No employer access,
                ever.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="bg-white rounded-2xl border border-[#e2e8f0] p-8 sm:p-12 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 text-xs font-medium text-blue-600 border-blue-200 bg-blue-50">
              Free to start
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Get Shiftlyx
            </h2>
            <p className="text-[#475569] text-lg mb-6 max-w-lg mx-auto">
              Download free on iOS and Android. Plan your shifts, track fatigue,
              and coordinate with your crew.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-amber-500 hover:from-blue-600 hover:to-amber-600 text-white text-base gap-2 px-8 h-14 shadow-lg shadow-blue-200/50"
                >
                  <ArrowRight className="w-5 h-5" />
                  Download now
                </Button>
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-4">
              iOS 16+ · Android 10+ · Free tier available
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
