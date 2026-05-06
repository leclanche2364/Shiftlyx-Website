"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Eye, Lightbulb, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

const philosophyIcons = [
  <Lightbulb key="advice" className="w-5 h-5" />,
  <Shield key="privacy" className="w-5 h-5" />,
  <Eye key="simple" className="w-5 h-5" />,
  <Heart key="science" className="w-5 h-5" />,
];

export default function AboutPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            About
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Built by shift workers. For shift workers.
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Shiftlyx started in a staff room at 3am. Two nurses, one paramedic, and a software developer who&apos;d worked nights on a support desk. The question was simple: why is there no tool for <em>us</em>?
          </p>
        </div>
      </section>

      {/* The Story */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
              The app that shouldn&apos;t need to exist
            </h2>
            <div className="space-y-4 text-[#475569] leading-relaxed">
              {siteConfig.about.story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Why &ldquo;operating system&rdquo;?
            </h2>
            <p className="text-[#475569] leading-relaxed">
              Because shift work isn&apos;t a 9-to-5 with overtime. It&apos;s a whole different way of living. Your body clock runs on a separate schedule. Your relationships require negotiation. Your health needs active management.
            </p>
            <p className="text-[#475569] leading-relaxed mt-4">
              Shiftlyx sits at the centre of all that. It&apos;s where fatigue data, planning, recovery, and coordination meet. Not a rota app. Not a calendar. A personal OS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-[#f8fafc] border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
            Our philosophy
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {siteConfig.about.philosophy.map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] mb-3">
                  {philosophyIcons[i]}
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Your rota. Your data. Your rules.
            </h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              Shiftlyx makes one promise that overrides everything else: your data never leaves your control for any purpose other than making the app work for you.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            {siteConfig.about.privacy.map((item, i) => (
              <div
                key={item.q}
                className={`grid sm:grid-cols-2 gap-2 p-5 ${
                  i < siteConfig.about.privacy.length - 1
                    ? "border-b border-[#e2e8f0]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563eb] shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {item.q}
                  </span>
                </div>
                <div className="text-sm text-[#475569] sm:text-right">
                  {item.a}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[#94a3b8] mt-6 text-center">
            We&apos;ll publish a full privacy policy before launch. The short version: we don&apos;t want your data. We want you to use the app.
          </p>
        </div>
      </section>

      {/* Team / Credibility */}
      <section className="py-16 bg-[#f8fafc] border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Who&apos;s building this
          </h2>
          <p className="text-[#475569] max-w-2xl mx-auto mb-8">
            A small team of people who&apos;ve done the work — and people who&apos;ve built for it.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Healthcare shift workers",
                desc: "ICU, A&E, community nursing",
              },
              {
                title: "Software engineers",
                desc: "Healthtech, consumer apps",
              },
              {
                title: "Product designers",
                desc: "Low-cognitive-load UX specialists",
              },
            ].map((group) => (
              <div
                key={group.title}
                className="bg-white rounded-xl border border-[#e2e8f0] p-5"
              >
                <p className="font-heading text-sm font-semibold text-foreground mb-1">
                  {group.title}
                </p>
                <p className="text-xs text-[#475569]">{group.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#94a3b8] mt-8">
            We&apos;re not a VC-funded growth machine. We&apos;re not a big healthtech company. We&apos;re a focused team building one tool, well, for one group of people.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Built for you. Use it for you.
          </h2>
          <Link href="/waitlist">
            <Button
              size="lg"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50"
            >
              Join the waitlist →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
