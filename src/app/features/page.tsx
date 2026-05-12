"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  Mic,
  CalendarDays,
  Heart,
  Moon,
  Brain,
  Rocket,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

const featureIcons: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-6 h-6" />,
  Mic: <Mic className="w-6 h-6" />,
  CalendarDays: <CalendarDays className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Moon: <Moon className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
};

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return <section id={id} className="py-16 lg:py-24">{children}</section>;
}

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

export default function FeaturesPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Features
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {siteConfig.seo.features.title.split(" — ")[1] || "Every feature built for the 2am brain"}
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Shift work is hard enough without complicated tools. Every Shiftlyx feature follows one rule: two taps or fewer to get what you need. Here&apos;s how each one works.
          </p>
        </div>
      </section>

      {/* Feature: Fatigue Score */}
      <Section id="fatigue-score">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] mb-4">
                  {featureIcons["Activity"]}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2563eb] mb-2 block">
                  Feature 1
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {siteConfig.features[0].heading}
                </h2>
                <p className="text-[#475569] leading-relaxed mb-6">
                  {siteConfig.features[0].benefit}
                </p>

                {/* Dimensions */}
                <div className="space-y-3 mb-6">
                  {siteConfig.features[0].dimensions!.map((d) => (
                    <div key={d.name} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground text-sm">{d.name}</span>
                        <span className="text-[#475569] text-sm"> — {d.description}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Labels */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {siteConfig.features[0].labels!.map((l) => (
                    <div key={l.label} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: l.color }}
                      />
                      <div>
                        <span className="font-medium text-foreground">{l.label}</span>
                        <span className="text-[#475569] block text-xs">{l.meaning}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Why it matters */}
                <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4 mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                    Why it matters
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {siteConfig.features[0].whyItMatters}
                  </p>
                </div>

                <p className="text-xs text-[#94a3b8] italic">
                  Screenshot: {siteConfig.features[0].screenshot}
                </p>
              </div>

              {/* Visual placeholder */}
              <div className="bg-gradient-to-br from-[#eff6ff] to-white rounded-2xl border border-[#e2e8f0] p-8 aspect-square flex items-center justify-center">
                <div className="w-full max-w-sm space-y-4">
                  <div className="text-center">
                    <span className="text-5xl font-bold font-heading text-[#f59e0b]">52</span>
                    <p className="text-sm text-[#475569]">Moderate Fatigue</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Consecutive Days", value: 78, color: "bg-red-500" },
                      { label: "Night Clustering", value: 45, color: "bg-amber-500" },
                      { label: "Short Recovery", value: 30, color: "bg-yellow-500" },
                      { label: "Circadian Disruption", value: 55, color: "bg-amber-500" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-xs text-[#475569] mb-1">
                          <span>{bar.label}</span>
                          <span className="font-semibold">{bar.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${bar.color}`}
                            style={{ width: `${bar.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-xs text-[#94a3b8] pt-2 border-t border-[#e2e8f0]">
                    Plan: High Demand · Recovery: Moderate
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <hr className="border-[#e2e8f0]" />
      </div>

      {/* Feature: AI Voice Planner */}
      <Section id="ai-voice-planner">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] mb-4">
                  {featureIcons["Mic"]}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2563eb] mb-2 block">
                  Feature 2
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {siteConfig.features[1].heading}
                </h2>
                <p className="text-[#475569] leading-relaxed mb-6">
                  {siteConfig.features[1].benefit}
                </p>

                <div className="space-y-2 mb-6">
                  <p className="text-sm font-semibold text-foreground">How it works:</p>
                  <ol className="space-y-2">
                    {siteConfig.features[1].howItWorks!.map((step, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-[#475569]">
                        <span className="w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center text-xs font-semibold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                    Why it matters
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {siteConfig.features[1].whyItMatters}
                  </p>
                </div>
              </div>

              <div className="lg:order-1 bg-gradient-to-br from-[#eff6ff] to-white rounded-2xl border border-[#e2e8f0] p-8 aspect-square flex items-center justify-center">
                <div className="w-full max-w-sm space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center shadow-lg shadow-blue-200/50">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                    <p className="text-sm font-medium text-foreground mb-2">You said:</p>
                    <p className="text-sm text-[#475569] italic">&ldquo;Plan my month with more nights&rdquo;</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Night Focused", score: 92, badge: "Recommended" },
                      { name: "Balanced Nights", score: 78 },
                      { name: "Income Max", score: 65 },
                    ].map((plan) => (
                      <div
                        key={plan.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e2e8f0] text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {plan.badge && (
                            <Badge className="bg-[#2563eb] text-white text-[10px] px-1.5 py-0">
                              {plan.badge}
                            </Badge>
                          )}
                          <span className="text-foreground font-medium">{plan.name}</span>
                        </div>
                        <span className="text-[#475569]">{plan.score}/100</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-[10px] text-[#94a3b8]">Powered by OpenAI</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Remaining features in a more compact format */}
      {siteConfig.features.slice(2).map((feature, i) => {
        const featureIndex = i + 2;
        return (
          <div key={feature.id}>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <hr className="border-[#e2e8f0]" />
            </div>
            <Section id={feature.id}>
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <FadeIn delay={0.1}>
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className={featureIndex % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                      <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] mb-4">
                        {featureIcons[feature.icon]}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2563eb] mb-2 block">
                        Feature {featureIndex + 1}
                      </span>
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        {feature.heading}
                      </h2>
                      <p className="text-[#475569] leading-relaxed mb-6">
                        {feature.benefit}
                      </p>

                      {feature.modes && (
                        <div className="space-y-3 mb-6">
                          {feature.modes.map((mode) => (
                            <div key={mode.name} className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                              <div>
                                <span className="font-medium text-foreground text-sm">{mode.name}</span>
                                <span className="text-[#475569] text-sm"> — {mode.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {feature.howToUse && (
                        <div className="space-y-2 mb-6">
                          <p className="text-sm font-semibold text-foreground">How to use:</p>
                          <ol className="space-y-2">
                            {feature.howToUse.map((step, si) => (
                              <li key={si} className="flex items-center gap-3 text-sm text-[#475569]">
                                <span className="w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center text-xs font-semibold">
                                  {si + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {feature.strategies && (
                        <div className="space-y-2 mb-6">
                          <p className="text-sm font-semibold text-foreground">The five strategies:</p>
                          {feature.strategies.map((strategy) => (
                            <div key={strategy.name} className="text-sm">
                              <span className="font-medium text-foreground">{strategy.name}</span>
                              <span className="text-[#475569]"> — {strategy.description}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {feature.captures && (
                        <div className="space-y-2 mb-6">
                          {feature.captures.map((capture) => (
                            <div key={capture} className="flex items-center gap-2 text-sm text-[#475569]">
                              <CheckCircle2 className="w-4 h-4 text-[#2563eb] shrink-0" />
                              {capture}
                            </div>
                          ))}
                        </div>
                      )}

                      {feature.affinities && (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {feature.affinities.map((aff) => (
                            <div key={aff.name} className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
                              <p className="text-xs font-semibold text-foreground">{aff.name}</p>
                              <p className="text-xs text-[#475569]">{aff.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {feature.smartSuppression && (
                        <div className="bg-[#f0f9ff] border border-[#bae6fd]/50 rounded-xl p-4 mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#0284c7] mb-1">
                            Smart suppression
                          </p>
                          <p className="text-sm text-[#0c4a6e] leading-relaxed">
                            {feature.smartSuppression}
                          </p>
                        </div>
                      )}

                      <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                          Why it matters
                        </p>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          {feature.whyItMatters}
                        </p>
                      </div>
                    </div>

                    <div className={featureIndex % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                      {/* Feature visual placeholder */}
                      <div className="bg-gradient-to-br from-[#f8fafc] to-white rounded-2xl border border-[#e2e8f0] p-8 aspect-square flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] mx-auto mb-4">
                            {featureIcons[feature.icon]}
                          </div>
                          <p className="text-sm text-[#475569] italic">{feature.screenshot || "App screenshot placeholder"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </Section>
          </div>
        );
      })}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Two minutes to your first fatigue score.
          </h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Download Shiftlyx free during early access.
          </p>
          <Link href="/download">
            <Button
              size="lg"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50"
            >
              Get early access →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
