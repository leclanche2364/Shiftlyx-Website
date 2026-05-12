"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Mail, User, Briefcase } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Early Access
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Free app. Premium at £3.99/month.
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Shiftlyx is free to download and use — fatigue score, shift planner, partner sync, and recovery coach are all included. Premium unlocks AI voice planning, fatigue intelligence, income forecasting, and more — £3.99/month or £18.99/year. That&apos;s less than a tea and a biscuit at the hospital canteen.
          </p>
        </div>
      </section>

      {/* Hero Conversion Copy */}
      <section className="pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-foreground font-medium">
            You&apos;ve spent years working shifts without a tool that understands them.{" "}
            <span className="text-[#2563eb]">Change that in 15 seconds.</span>
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-12">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <motion.div
              className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center"
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
              className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-lg font-semibold text-foreground text-center">
                Get notified when Shiftlyx launches
              </h2>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Your name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-sm text-foreground placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]/30 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane@nhs.net"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-sm text-foreground placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]/30 transition-all"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Your role (optional)
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] z-10" />
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]/30 transition-all"
                  >
                    <option value="">Select your role</option>
                    <option value="nurse">Nurse</option>
                    <option value="hca">HCA</option>
                    <option value="midwife">Midwife</option>
                    <option value="paramedic">Paramedic</option>
                    <option value="other-healthcare">Other healthcare</option>
                    <option value="not-healthcare">Not in healthcare</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold py-2.5"
                size="lg"
              >
                Get early access →
              </Button>

              <p className="text-xs text-center text-[#94a3b8]">
                No spam. We&apos;ll only email about Shiftlyx. Unsubscribe any time.
              </p>
            </motion.form>
          )}
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
                title: "Free app, optional premium",
                desc: "fatigue score, partner sync, recovery coach included free — premium from £3.99/month",
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
            Free app. Premium for the price of a tea.
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
                Get early access →
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
