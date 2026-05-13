"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Mail, User, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to join. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero — info-first waitlist page */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="text-center mb-6">
            <Badge className="text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
              Coming Soon
            </Badge>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
              Shiftlyx is free. Always.
            </h1>
            <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Your shift, your app, your OS — fatigue score, shift planner, partner sync, and recovery coach all included at no cost. Premium unlocks AI Voice Planner, fatigue intelligence, income forecasting, and more.
            </p>
          </div>

          {/* Key benefits preview — info before form */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-[#2563eb]">1</span>
              </div>
              <p className="text-sm font-medium text-foreground">Fatigue Score</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">4 dimensions, one number</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-[#2563eb]">2</span>
              </div>
              <p className="text-sm font-medium text-foreground">Voice Planner</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">Speak to plan your rota</p>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-2">
                <span className="text-lg font-bold text-[#2563eb]">3</span>
              </div>
              <p className="text-sm font-medium text-foreground">Partner Sync</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">Tap phones to connect</p>
            </div>
          </div>

        </div>
      </section>

      {/* Email form — below the fold, separate section */}
      <section className="pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
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
                <p className="text-[#475569]">
                  Thanks for joining{name ? `, ${name}` : ""}. We&apos;ll email you at{" "}
                  <span className="font-medium text-foreground">{email}</span> when
                  Shiftlyx launches.
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 space-y-4 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Email only — put it first */}
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

                {/* Optional fields — expanded below email */}
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
                      Get early access <ArrowRight className="w-4 h-4" />
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

      {/* Social Proof */}
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

      {/* What Early Access Means */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            What you get as an early user
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
                desc: "fatigue score, shift planner, partner sync, recovery coach included at no cost — premium from £3.99/month",
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

      {/* Waitlist FAQ */}
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

      {/* Pricing CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Shiftlyx is free to download and use.
          </h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Free fatigue score, planner, partner sync, recovery coach included. Premium from £3.99/month. Early access users lock in their Day One price for life.
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
