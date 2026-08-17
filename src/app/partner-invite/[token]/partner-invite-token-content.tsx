"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Smartphone,
  Apple,
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
  Shield,
  Users,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PartnerInviteTokenContentProps {
  /** Token extracted by the server page from the /partner-invite/:token path. */
  token?: string | null;
}

// Handoff landing page for partner-sync path-form universal links:
//   https://www.shiftlyx.com/partner-invite/{token}
//
// This mirrors the proven crew-invite flow at /join/[token]. The old
// /partner-invite page only read the token from a ?invite_token= query param
// and attempted a fragile auto-deep-link via cookie detection. That page still
// has no route for the path form, which is what the app actually generates —
// so QR scans returned a hard 404 and iOS refused to hand off to the app.
//
// This component returns 200, extracts the token from the path, and drives the
// app handoff via a real user CTA (universal link → custom scheme → store).
export default function PartnerInviteTokenContent({
  token: serverToken,
}: PartnerInviteTokenContentProps) {
  const [inviteToken, setInviteToken] = useState<string | null>(
    serverToken || null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [handOffStarted, setHandOffStarted] = useState(false);
  const [redirectingToStore, setRedirectingToStore] = useState(false);
  const autoAttemptedRef = useRef(false);
  const handedOffRef = useRef(false);

  useEffect(() => {
    // Extract the token. Partner-sync invites use the path form
    // /partner-invite/{token}, but also accept ?token= / ?invite_token= for
    // flexibility and backwards compatibility with the old query-form links.
    let token = serverToken;
    if (!token) {
      const params = new URLSearchParams(window.location.search);
      token = params.get("token") || params.get("invite_token");
    }
    if (!token && window.location.pathname) {
      const match = window.location.pathname.match(
        /^\/partner-invite\/([A-Za-z0-9_-]+)/
      );
      if (match) token = match[1];
    }
    if (token) {
      token = token.trim();
      setInviteToken(token);
    }

    const ua = navigator.userAgent || navigator.vendor || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsMobile(isIOS || /Android/i.test(ua));
    setIsIOS(isIOS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Universal-link handoff (CTA-driven) ───────────────────────────────────
  const launchApp = () => {
    if (!inviteToken || redirectingToStore || handedOffRef.current) return;
    const storeUrl = isIOS
      ? `https://apps.apple.com/id/app/shiftlyx-own-your-shift/id6767157095`
      : `https://play.google.com/store/apps/details?id=com.beemal.shiftlyxAI`;

    const universalLink = `https://www.shiftlyx.com/partner-invite/${inviteToken}`;
    const schemeLink = `shiftlyx://partner-invite/${inviteToken}`;
    const currentUrl = `${window.location.origin}${window.location.pathname}`;
    const sameUrl = currentUrl === universalLink;

    setHandOffStarted(true);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };

    const onHandedOff = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        handedOffRef.current = true;
        clearTimers();
        cleanup();
      }
    };
    const onPageHide = () => {
      handedOffRef.current = true;
      clearTimers();
      cleanup();
    };
    const cleanup = () => {
      document.removeEventListener("visibilitychange", onHandedOff);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("blur", onPageHide);
    };
    const sendToStore = () => {
      if (handedOffRef.current) return;
      cleanup();
      setRedirectingToStore(true);
      window.location.replace(storeUrl);
    };

    document.addEventListener("visibilitychange", onHandedOff);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("blur", onPageHide);

    if (sameUrl) {
      // Already on the universal-link URL; navigate to the same URL won't
      // hand off. Drive via the custom scheme so an installed app opens.
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = schemeLink;
      document.body.appendChild(iframe);
      timers.push(
        setTimeout(() => {
          if (handedOffRef.current) return;
          window.location.href = schemeLink;
        }, 50)
      );
      timers.push(setTimeout(sendToStore, 1800));
    } else {
      window.location.href = universalLink;
      timers.push(
        setTimeout(() => {
          if (handedOffRef.current) return;
          window.location.href = schemeLink;
        }, 1200)
      );
      timers.push(setTimeout(sendToStore, 3000));
    }
  };

  // ── Automatic handoff on load (mobile only) ───────────────────────────────
  useEffect(() => {
    if (autoAttemptedRef.current || handOffStarted) return;
    if (!inviteToken) return;
    const isMobileUa = isIOS || /Android/i.test(navigator.userAgent || "");
    if (!isMobileUa) return;

    autoAttemptedRef.current = true;
    const t = setTimeout(() => launchApp(), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteToken, isIOS, handOffStarted]);

  return (
    <>
      {/* Hero — immediate value, personal framing */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eff6ff] via-[#fdf4ff] to-[#fef3c7] opacity-70" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 text-xs font-medium text-pink-600 border-pink-200 bg-pink-50 gap-1.5">
              <Heart className="w-3 h-3 text-pink-500" />
              Partner Sync Invite
            </Badge>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {inviteToken ? (
                <>
                  You've been invited
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent">
                    to sync your shifts
                  </span>
                </>
              ) : (
                <>
                  Sync your shifts
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent">
                    with your partner
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed mb-8">
              {inviteToken
                ? "Someone wants to coordinate with you. Open Shiftlyx to accept the invite and start seeing each other's rotas in one place."
                : "Two rotas. One life. One calendar. See combined shifts, avoid overlapping heavy days, and coordinate childcare together."}
            </p>

            {handOffStarted && (
              <div className="flex items-center justify-center gap-2 text-sm text-[#db2777] mb-6">
                <Loader2 className="w-4 h-4 animate-spin" />
                {redirectingToStore
                  ? "Taking you to the store…"
                  : "Opening Shiftlyx…"}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {inviteToken ? (
                <button
                  type="button"
                  onClick={launchApp}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white text-base font-semibold px-8 h-14 rounded-xl shadow-lg shadow-pink-200/50 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Open in Shiftlyx →
                </button>
              ) : (
                <Link href="/download">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white text-base gap-2 px-8 h-14 shadow-lg shadow-pink-200/50"
                  >
                    <Sparkles className="w-5 h-5" />
                    Get Shiftlyx →
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link href="https://apps.apple.com/id/app/shiftlyx-own-your-shift/id6767157095">
                <Button
                  size="lg"
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm gap-2 px-6 h-12"
                >
                  <Apple className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[9px] opacity-70">Download on the</div>
                    <div className="text-sm font-semibold -mt-0.5">
                      App Store
                    </div>
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
                    <div className="text-sm font-semibold -mt-0.5">
                      Google Play
                    </div>
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
            Two rotas, one life
          </h2>
          <p className="text-[#475569] text-center mb-12 max-w-lg mx-auto">
            No more texting "what shifts do you have this week?" ever again.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Download Shiftlyx",
                sub: "Free on iOS and Android",
              },
              {
                icon: Users,
                title: "Accept the invite",
                sub: inviteToken
                  ? "We already found your invite"
                  : "Open the link your partner shared",
              },
              {
                icon: Shield,
                title: "Sync your rotas",
                sub: "See combined shifts and coordinate together",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-amber-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-pink-500" />
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-pink-200 to-amber-200" />
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

      {/* Benefits — what partner sync does */}
      <section className="py-16 bg-gradient-to-b from-[#fdf4ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
            Built for shift-work couples
          </h2>
          <p className="text-[#475569] text-center mb-12 max-w-lg mx-auto">
            When your shifts never line up, planning life takes a team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Check,
                title: "Avoid overlapping heavy days",
                sub: "See both rotas at a glance so you don't both land on back-to-back nights.",
              },
              {
                icon: Heart,
                title: "Coordinate childcare",
                sub: "Know who's free before you ask. Plan cover around both your shift patterns.",
              },
              {
                icon: CalendarDays,
                title: "One shared calendar",
                sub: "Days off, appointments, and important events in a single view.",
              },
              {
                icon: Shield,
                title: "Your rota stays private",
                sub: "Only the people you invite can see your schedule. Never your employer.",
              },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center mb-3">
                  <benefit.icon className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {benefit.sub}
                </p>
              </motion.div>
            ))}
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
            <Badge className="mb-4 text-xs font-medium text-pink-600 border-pink-200 bg-pink-50">
              Partner Sync is Premium
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Plan shifts, not around them
            </h2>
            <p className="text-[#475569] text-lg mb-6 max-w-lg mx-auto">
              Download free on iOS and Android. Premium unlocks Partner Sync,
              the AI Voice Planner, and fatigue intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white text-base gap-2 px-8 h-14 shadow-lg shadow-pink-200/50"
                >
                  <ArrowRight className="w-5 h-5" />
                  Get Shiftlyx
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
