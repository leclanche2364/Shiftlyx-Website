"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Apple, Smartphone, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function DownloadPage() {
  const { free, monthly } = siteConfig.pricing;

  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Download
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Get Shiftlyx
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Free on iOS and Android. Fatigue score, shift planner, partner sync, and recovery coach — all included. Premium unlocks AI Voice Planner, fatigue intelligence, income forecasting, and more. From £3.99/month with a free 1-month trial.
          </p>
        </div>
      </section>

      {/* Download Buttons */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-base gap-3 px-8 h-14"
              disabled
            >
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-[10px] opacity-70">Download on the</div>
                <div className="text-base font-semibold -mt-0.5">App Store</div>
              </div>
            </Button>
            <Button
              size="lg"
              className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-base gap-3 px-8 h-14"
              disabled
            >
              <Smartphone className="w-6 h-6" />
              <div className="text-left">
                <div className="text-[10px] opacity-70">Get it on</div>
                <div className="text-base font-semibold -mt-0.5">Google Play</div>
              </div>
            </Button>
          </motion.div>
          <div className="flex justify-center gap-6 mt-4">
            <p className="text-xs text-[#94a3b8]">iOS 16+ required</p>
            <p className="text-xs text-[#94a3b8]">Android 10+ required</p>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Table */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
            Free vs Premium plans
          </h2>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="grid grid-cols-3 border-b border-[#e2e8f0]">
              <div className="p-4 sm:p-6">
                <span className="text-sm font-medium text-[#475569]">Feature</span>
              </div>
              <div className="p-4 sm:p-6 text-center border-x border-[#e2e8f0] bg-[#f8fafc]">
                <span className="font-heading text-lg font-bold text-foreground">Free</span>
                <p className="text-xs text-[#475569] mt-1">£{free.price}</p>
              </div>
              <div className="p-4 sm:p-6 text-center bg-amber-50/50">
                <span className="font-heading text-lg font-bold text-foreground">Day One Annual</span>
                <p className="text-xs text-[#475569] mt-1">£18.99/year</p>
              </div>
            </div>

            {/* Combine all features from both tiers */}
            {[
              ...free.features.map((f) => ({ name: f, free: true, monthly: true })),
              ...monthly.features
                .filter((f) => !free.features.includes(f))
                .map((f) => ({ name: f, free: false, monthly: true })),
            ].map((feature) => (
              <div
                key={feature.name}
                className="grid grid-cols-3 border-b border-[#e2e8f0] last:border-b-0"
              >
                <div className="p-4 sm:p-6">
                  <span className="text-sm text-foreground">{feature.name}</span>
                </div>
                <div className="p-4 sm:p-6 text-center border-x border-[#e2e8f0] flex items-center justify-center">
                  {feature.free ? (
                    <Check className="w-5 h-5 text-[#10b981]" />
                  ) : (
                    <Minus className="w-5 h-5 text-[#cbd5e1]" />
                  )}
                </div>
                <div className="p-4 sm:p-6 text-center bg-amber-50/50 flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#10b981]" />
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-[#94a3b8] mt-6">
            Premium Monthly: £3.99/month · Day One Annual: £18.99/year (60% off). Free 1-month trial included. Early access locks in your Day One price for life.
          </p>
        </div>
      </section>

      {/* Pre-Download CTA */}
      <section className="py-20 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Not on mobile? No problem.
          </h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Join early access and get Shiftlyx free — your Day One price is locked in.
          </p>
          <Link href="/waitlist">
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
