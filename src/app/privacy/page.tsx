"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2, Lock, Server, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

const privacyIcons = [
  <Shield key="employer" className="w-5 h-5" />,
  <Server key="nhs" className="w-5 h-5" />,
  <Lock key="sell" className="w-5 h-5" />,
  <Users key="partner" className="w-5 h-5" />,
  <Trash2 key="delete" className="w-5 h-5" />,
  <Server key="stored" className="w-5 h-5" />,
];

export default function PrivacyPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Privacy
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Your rota. Your data. Your rules.
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Shiftlyx makes one promise that overrides everything else: your data never leaves your control for any purpose other than making the app work for you.
          </p>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              Our commitment to your privacy
            </h2>

            <div className="prose prose-slate max-w-none space-y-6 text-[#475569] leading-relaxed">
              <p>
                Shiftlyx was built for NHS workers — people who already have too many
                systems watching them. We designed Shiftlyx from the ground up to be
                the opposite of that.
              </p>
              <p>
                <strong className="text-foreground">Privacy isn&apos;t a feature.</strong>{" "}
                It&apos;s the foundation. Everything we build sits on top of one
                non-negotiable rule: your data belongs to you.
              </p>
              <p>
                We don&apos;t connect to hospital systems. We don&apos;t share data with
                employers. We don&apos;t sell information. Your rota patterns, fatigue
                scores, and preferences are yours. Full stop.
              </p>
              <p>
                Partner Sync is invite-only and fully optional. You control what you
                share, with whom, and for how long. Disconnect at any time.
              </p>
            </div>
          </motion.div>

          {/* Privacy Details Table */}
          <motion.div
            className="mt-12 bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Privacy details
              </h3>
            </div>
            {siteConfig.about.privacy.map((item, i) => (
              <div
                key={item.q}
                className={`grid sm:grid-cols-2 gap-3 p-5 ${
                  i < siteConfig.about.privacy.length - 1
                    ? "border-b border-[#e2e8f0]"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#2563eb] shrink-0">
                    {privacyIcons[i]}
                  </div>
                  <span className="text-sm font-medium text-foreground pt-1">
                    {item.q}
                  </span>
                </div>
                <div className="text-sm text-[#475569] sm:pt-1">
                  {item.a}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Additional Details */}
          <motion.div
            className="mt-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="font-heading text-xl font-bold text-foreground">
              Data handling
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Local-first architecture
                  </p>
                  <p className="text-sm text-[#475569]">
                    Wherever possible, your data stays on your device. Cloud sync is
                    optional and encrypted end-to-end.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    No tracking or analytics
                  </p>
                  <p className="text-sm text-[#475569]">
                    We don&apos;t use third-party analytics, tracking pixels, or
                    behavioral profiling. We measure what we need to improve the app
                    — and nothing more.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    No AI training on your data
                  </p>
                  <p className="text-sm text-[#475569]">
                    If you use the AI Voice Planner, that conversation data is not
                    used to train OpenAI models. Your fatigue data, rotas, and
                    preferences are never used for model training.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Deletion on demand
                  </p>
                  <p className="text-sm text-[#475569]">
                    Delete your account at any time. All your data is permanently
                    deleted within 30 days. No lingering backups.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    UK-based data storage
                  </p>
                  <p className="text-sm text-[#475569]">
                    Any data stored in the cloud is encrypted at rest in UK-based
                    servers. We comply with UK GDPR.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-5 mt-8">
              <h4 className="font-heading text-base font-semibold text-amber-800 mb-2">
                Questions about privacy?
              </h4>
              <p className="text-sm text-amber-700">
                We&apos;ll publish a full privacy policy before launch. If you have
                questions in the meantime, contact us. The short version: we don&apos;t
                want your data. We want you to use the app.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
