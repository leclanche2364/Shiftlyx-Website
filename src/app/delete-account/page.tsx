import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trash2, Clock, ShieldCheck, Mail, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Delete Account",
  description:
    "How to delete your Shiftlyx account and associated data — step-by-step guide.",
    alternates: {
    canonical: "https://www.shiftlyx.com/delete-account",
  },
  openGraph: {
    title: "Delete Account — Shiftlyx",
    description: "Step-by-step guide to deleting your Shiftlyx account.",
  },
};

export default function DeleteAccountPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Account Deletion
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Delete Your Account
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Your data is yours. When you want to leave, you can — completely and permanently.
          </p>
        </div>
      </section>

      {/* How to Delete */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* In-App Deletion */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-8">
            <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fef2f2] flex items-center justify-center text-[#ef4444]">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Delete from the App
                  </h2>
                  <p className="text-sm text-[#475569]">
                    The quickest way to delete your account
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#2563eb] shrink-0 mt-0.5">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Step 1: Open Settings</p>
                  <p className="text-sm text-[#475569]">
                    Open the Shiftlyx app and navigate to <strong>Settings</strong> from the bottom navigation bar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#2563eb] shrink-0 mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Step 2: Select Delete Account</p>
                  <p className="text-sm text-[#475569]">
                    Scroll to the bottom of Settings and tap <strong>Delete Account</strong>. You will be asked to confirm your decision.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#2563eb] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Step 3: Confirm</p>
                  <p className="text-sm text-[#475569]">
                    Read the confirmation message carefully, then tap <strong>Confirm Delete</strong>. Your account and data will be queued for permanent deletion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Gets Deleted */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-8">
            <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[#16a34a]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    What Gets Deleted
                  </h2>
                  <p className="text-sm text-[#475569]">
                    All personal data associated with your account
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-heading text-base font-semibold text-foreground mb-3 text-green-700">
                Permanently deleted:
              </h3>
              <ul className="space-y-2 mb-6">
                {[
                  "Account credentials and login information",
                  "Profile information (profession, band, hours, commute)",
                  "All shift data, patterns, and history",
                  "Fatigue scores and analytics history",
                  "Partner Sync connections and shared data",
                  "Preference learning data and affinity scores",
                  "Subscription and billing history (anonymised records may be retained for tax purposes)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#475569]">
                    <svg className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-heading text-base font-semibold text-foreground mb-3 text-[#475569]">
                Retained (anonymised):
              </h3>
              <ul className="space-y-2">
                {[
                  "Aggregated, anonymised usage analytics (PostHog) — these cannot be linked back to you and are kept for service improvement",
                  "Anonymised crash reports and diagnostic logs — retained for up to 90 days",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#475569]">
                    <svg className="w-4 h-4 text-[#94a3b8] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeframe */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-8">
            <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Timeframe
                  </h2>
                  <p className="text-sm text-[#475569]">
                    How long the deletion process takes
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] text-center">
                  <p className="text-2xl font-bold font-heading text-[#2563eb]">Immediate</p>
                  <p className="text-xs text-[#475569] mt-1">Account deactivated</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] text-center">
                  <p className="text-2xl font-bold font-heading text-[#2563eb]">30 days</p>
                  <p className="text-xs text-[#475569] mt-1">Full data erasure completed</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] text-center">
                  <p className="text-2xl font-bold font-heading text-[#2563eb]">90 days</p>
                  <p className="text-xs text-[#475569] mt-1">Diagnostic logs purged</p>
                </div>
              </div>
              <p className="text-xs text-[#94a3b8] mt-4">
                Backup retention cycles may add up to 30 days beyond the standard deletion period. We securely overwrite all data using industry-standard practices.
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-8">
            <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fef2f2] flex items-center justify-center text-[#ef4444]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Need Help?
                  </h2>
                  <p className="text-sm text-[#475569]">
                    If you can&apos;t delete through the app, contact us
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#475569]">
                If you&apos;re unable to delete your account through the App settings, or if you have any questions about the deletion process, please email us at:
              </p>
              <a
                href="mailto:admin@beemalinnovation.co.uk"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4" />
                admin@beemalinnovation.co.uk
              </a>
              <p className="text-xs text-[#94a3b8]">
                We will process your request within 30 days of receiving it. You may need to verify your identity before we can proceed.
              </p>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-5">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong className="text-amber-900">Important:</strong> Deleting your account is permanent and cannot be undone. If you have an active subscription, you should cancel it through the Apple App Store or Google Play Store before deleting your account. We cannot process refunds for subscription payments — please contact Apple or Google support for refunds.
            </p>
            <p className="text-sm text-amber-800 leading-relaxed mt-2">
              For more information about how we handle your data, please see our <Link href="/privacy" className="text-[#2563eb] hover:underline font-medium">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
