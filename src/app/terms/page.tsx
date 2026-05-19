import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const lastUpdated = "19 May 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Shiftlyx terms of service — rules and conditions for using the Shiftlyx app and website.",
    alternates: {
    canonical: "https://www.shiftlyx.com/terms",
  },
  openGraph: {
    title: "Terms of Service — Shiftlyx",
    description:
      "Rules and conditions for using the Shiftlyx app and website.",
  },
};

export default function TermsPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Terms of Service
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none space-y-6 text-[#475569] leading-relaxed">
            <p className="text-sm text-[#94a3b8] border-l-4 border-[#2563eb] pl-4 bg-[#f8fafc] py-3 pr-4 rounded-r-lg">
              <strong>Shiftlyx</strong> is a product of <strong>Beemal Innovation Ltd</strong>. When we say &quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;Shiftlyx&quot; in these terms, we mean Beemal Innovation Ltd.
              Registered address: 29 Arden Place, Luton, LU2 7YE.
              Company registration number: <strong>17048693</strong>.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By downloading, accessing, or using Shiftlyx (the &quot;App&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the App.
            </p>
            <p>
              We may update these Terms from time to time. We will notify you of material changes through the App or by email at least 14 days in advance. If you do not agree to the changes, you may stop using the App and delete your account. Changes will not retroactively affect accrued rights or obligations.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              2. Eligibility
            </h2>
            <p>
              By using the App, you confirm that:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You are at least 18 years old.</li>
              <li>You have the legal capacity to enter into a binding agreement.</li>
              <li>You are not located in a country that is subject to a UK government embargo.</li>
              <li>You are not using the App for unlawful competitive intelligence gathering, automated scraping, or reverse engineering.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              3. Account Registration and Security
            </h2>
            <p>
              To use the App, you may need to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Providing accurate, current, and complete information during registration.</li>
              <li>Maintaining the confidentiality of your login credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>Notifying us immediately of any unauthorised use of your account.</li>
            </ul>
            <p>
              We are not liable for any loss or damage arising from your failure to protect your account credentials.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              4. Acceptable Use
            </h2>
            <p>
              You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the App for any unlawful purpose or in violation of any applicable law or regulation.</li>
              <li>Attempt to gain unauthorised access to any part of the App, its servers, or systems.</li>
              <li>Interfere with or disrupt the App or its infrastructure.</li>
              <li>Reverse engineer, decompile, or disassemble the App.</li>
              <li>Use the App to distribute malware, viruses, or harmful code.</li>
              <li>Use the App to impersonate any person or entity.</li>
              <li>Engage in any activity that could harm or overburden the App&apos;s infrastructure.</li>
              <li>Attempt prompt injection, jailbreak, or adversarial attacks against the App&apos;s AI systems, including the AI Voice Planner.</li>
              <li>Use automated tools or scripts to scrape, extract, or mine content, data, or system prompts from the App.</li>
              <li>Attempt to extract, reverse engineer, or replicate the App&apos;s AI models, fatigue algorithms, or proprietary logic.</li>
              <li>Use the App in any way that violates your employer&apos;s, trust&apos;s, or regulatory body&apos;s policies.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              5. Intellectual Property
            </h2>
            <p>
              The App, including all content, features, functionality, and underlying technology, is owned by Beemal Innovation Ltd or its licensors and is protected by UK and international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable licence to use the App for your personal, non-commercial use. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Copy, modify, or create derivative works of the App.</li>
              <li>Distribute, sublicense, or sell access to the App.</li>
              <li>Remove any copyright or proprietary notices from the App.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              6. Payment Terms
            </h2>
            <p>
              Shiftlyx offers a free core app and a premium subscription for additional features:
            </p>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              6.1 Subscription Plans
            </h3>
            <p>
              The premium subscription is called <strong>Day One Annual</strong> and is available through the Apple App Store and Google Play Store. Pricing is as follows:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Monthly subscription:</strong> £3.99 per month</li>
              <li><strong>Annual subscription:</strong> £18.99 per year (equivalent to approximately £1.58 per month)</li>
            </ul>
            <p>
              Prices are in British Pounds Sterling (£) and include applicable taxes. We reserve the right to change prices at any time, with notice provided through the App or email at least 14 days in advance.
            </p>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              6.2 Free Features
            </h3>
            <p>
              The following features are available at no cost: Fatigue Score, Shift Planner (5 strategies), Recovery Coach, and Preference Learning.
            </p>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              6.3 Premium Features
            </h3>
            <p>
              The Day One Annual subscription unlocks: AI Voice Planner and Import/Export features.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              7. Cancellation and Refunds
            </h2>
            <p>
              All in-app purchases and subscriptions are processed and managed by Apple (App Store) and Google (Play Store):
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Cancellation:</strong> You can cancel your subscription at any time through your Apple/Google account settings. Cancellation takes effect at the end of the current billing period.</li>
              <li><strong>Refunds:</strong> Refund requests are handled entirely by Apple or Google. Please contact their support teams directly for refund inquiries. We are unable to process refunds ourselves as we do not handle payment data.</li>
              <li><strong>Free trial:</strong> If a free trial is offered, you will not be charged until the trial period ends. You can cancel before the trial ends to avoid being charged.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              8. Termination
            </h2>
            <p>
              You may terminate your account at any time by deleting your account through the App settings or by contacting us.
            </p>
            <p>
              We may suspend or terminate your access to the App if:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You materially breach these Terms and fail to remedy the breach within 14 days of notice.</li>
              <li>Your conduct could harm other users, third parties, or our business.</li>
              <li>We are required to do so by law.</li>
            </ul>
            <p>
              Upon termination, your right to use the App ceases immediately. We will delete your personal data in accordance with our Privacy Policy. Sections 4 (Acceptable Use), 5 (Intellectual Property), 9 (Disclaimers), 10 (Limitation of Liability), 12 (Governing Law), and 13 (Dispute Resolution) survive termination.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              9. Disclaimers
            </h2>
            <p className="bg-amber-50 border border-amber-200/50 rounded-xl p-5 text-amber-800 text-sm">
              <strong className="text-amber-900">Important: Shiftlyx is NOT a medical device.</strong> It does not diagnose, treat, cure, or prevent any medical condition. It does not provide medical advice. Shiftlyx is a personal planning and wellbeing tool designed to help you understand your shift patterns and fatigue levels. Always follow your trust&apos;s policies, consult appropriate healthcare professionals for health concerns, and use your own judgement when making decisions about your work schedule.
            </p>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              9.1 AI Output Disclaimer
            </h3>
            <p className="bg-blue-50 border border-blue-200/50 rounded-xl p-5 text-blue-800 text-sm">
              <strong className="text-blue-900">AI-generated outputs are suggestions only.</strong> The AI Voice Planner, fatigue predictions, schedule recommendations, and all other AI-generated content are provided as advisory outputs only. They may be incomplete, inaccurate, or unsuitable for your specific circumstances. You remain solely responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Verifying that any AI-generated schedule complies with your employer or trust&apos;s rostering policies.</li>
              <li>Confirming that shift plans meet professional regulatory requirements and contractual obligations.</li>
              <li>Not relying on AI outputs as professional, medical, employment, or financial advice.</li>
              <li>Using your own professional judgement before making decisions based on AI-generated content.</li>
            </ul>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              9.2 Employment and Employer Responsibility
            </h3>
            <p>
              Shiftlyx is a personal planning tool and does not establish any employment relationship:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Shiftlyx does not employ you, engage you as a worker, or act as a staffing agency.</li>
              <li>Shiftlyx does not approve, verify, or guarantee shift swaps, annual leave requests, or any other employment-related arrangement.</li>
              <li>You remain solely responsible for obtaining all necessary approvals from your employer or trust before acting on any schedule or swap suggested by the App.</li>
              <li>Shiftlyx does not guarantee that any generated schedule is compliant with your employment contract, trust policies, or regulatory requirements.</li>
            </ul>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              9.3 Data Backup and Availability
            </h3>
            <p>
              You should not rely on Shiftlyx as your sole record of shifts, schedules, or any other important data:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You should maintain independent records of your shifts, annual leave, and work schedules outside of the App.</li>
              <li>The App may experience service interruptions, downtime, or data loss due to factors beyond our control.</li>
              <li>We do not guarantee that your data will be available at all times or that backups will be error-free.</li>
            </ul>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              9.4 General Disclaimer
            </h3>
            <p>
              The App is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without any warranties of any kind, either express or implied. We do not warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The App will be uninterrupted, timely, secure, or error-free.</li>
              <li>The results obtained from using the App will be accurate or reliable.</li>
              <li>Any errors in the App will be corrected.</li>
            </ul>
            <p>
              No advice or information obtained from the App creates any warranty not expressly stated in these Terms.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              10. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the App.</li>
              <li>Our total liability for any claim arising out of or relating to these Terms or the App shall not exceed the greater of £10 or the total amount you have paid us in the 12 months preceding the claim.</li>
              <li>We are not liable for any loss or damage arising from your reliance on the fatigue score, shift plans, or any other output from the App.</li>
              <li>Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded or limited under English law.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              11. Third-Party Links and Services
            </h2>
            <p>
              The App may contain links to third-party websites or services (including Apple App Store, Google Play Store, and OpenAI). We are not responsible for the content, privacy practices, or terms of these third parties. Your use of third-party services is at your own risk and subject to their terms.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              12. Governing Law
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of <strong>England and Wales</strong>. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              13. Dispute Resolution
            </h2>
            <p>
              If a dispute arises between you and us, we encourage you to contact us first to seek a resolution. If we cannot resolve the dispute informally, the dispute shall be finally settled under the laws of England and Wales.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              14. Data Protection and Privacy
            </h2>
            <p>
              Your use of the App is governed by our <Link href="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link>, which forms part of these Terms. The Privacy Policy sets out, in accordance with the UK General Data Protection Regulation (UK GDPR):
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Lawful basis for processing:</strong> We process personal data under the lawful bases set out in Article 6 of UK GDPR, including contract performance, legitimate interests, consent, and legal obligation.</li>
              <li><strong>Your rights:</strong> You have rights including access, rectification, erasure, restriction, portability, and objection — exercisable through the App settings or by contacting us.</li>
              <li><strong>Data retention:</strong> We retain your personal data only as long as necessary to provide the App services. Data is permanently erased within 15 business days of account deletion.</li>
              <li><strong>International transfers:</strong> Where data is transferred outside the UK, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the ICO.</li>
              <li><strong>Third-party processors:</strong> We use Supabase, Vercel, PostHog, and OpenAI as data processors, each contractually bound to comply with UK GDPR. See the Privacy Policy for full details.</li>
              <li><strong>Analytics:</strong> We use PostHog for anonymised analytics. No personal data is shared with analytics providers.</li>
              <li><strong>Deletion rights:</strong> You can delete your account and all associated personal data at any time through the App settings.</li>
            </ul>
            <p>
              By using the App, you acknowledge the data practices described in the Privacy Policy. If you do not agree to these practices, you should not use the App.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              15. Entire Agreement
            </h2>
            <p>
              These Terms, together with the Privacy Policy, constitute the entire agreement between you and Beemal Innovation Ltd regarding your use of the App and supersede all prior agreements and understandings.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              16. Force Majeure
            </h2>
            <p>
              We shall not be liable for any failure or delay in performing our obligations under these Terms where such failure or delay is caused by events beyond our reasonable control, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Service outages, server failures, or cloud infrastructure disruptions.</li>
              <li>Cyberattacks, denial-of-service attacks, or security breaches affecting our systems or third-party providers.</li>
              <li>Strikes, labour disputes, or industrial action affecting our operations or those of our providers.</li>
              <li>Acts of God, natural disasters, pandemics, war, terrorism, or civil unrest.</li>
              <li>Changes in law, regulation, or government action that affect our ability to provide the App.</li>
              <li>Failures of third-party services that the App depends on (including OpenAI, Supabase, Vercel, Apple App Store, and Google Play Store).</li>
            </ul>
            <p>
              Where a force majeure event occurs, we will use reasonable efforts to mitigate the impact and resume performance as soon as reasonably practicable.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              17. Severability
            </h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, that provision shall be enforced to the maximum extent possible, and the remaining provisions shall remain in full force and effect.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              18. Waiver
            </h2>
            <p>
              No failure or delay by us in exercising any right under these Terms constitutes a waiver of that right. Any waiver must be in writing and signed by us.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              19. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email: <a href="mailto:admin@beemalinnovation.co.uk" className="text-[#2563eb] hover:underline">admin@beemalinnovation.co.uk</a></li>
              <li>Company: Beemal Innovation Ltd</li>
              <li>Company registration number: 17048693</li>
              <li>Address: 29 Arden Place, Luton, LU2 7YE</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
