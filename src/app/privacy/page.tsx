import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

const lastUpdated = "19 May 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Shiftlyx privacy policy — how we collect, use, and protect your data in compliance with UK GDPR.",
    alternates: {
    canonical: "https://www.shiftlyx.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Shiftlyx",
    description:
      "How Shiftlyx collects, uses, and protects your personal data.",
  },
};

export default function PrivacyPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Privacy Policy
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none space-y-6 text-[#475569] leading-relaxed">
            <p className="text-sm text-[#94a3b8] border-l-4 border-[#2563eb] pl-4 bg-[#f8fafc] py-3 pr-4 rounded-r-lg">
              <strong>Shiftlyx</strong> is a product of <strong>Beemal Innovation Ltd</strong>. When we say &quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;Shiftlyx&quot; in this policy, we mean Beemal Innovation Ltd.
              Registered address: 29 Arden Place, Luton, LU2 7YE.
              Company registration number: <strong>17048693</strong>.
            </p>

            <p>
              This Privacy Policy explains how we collect, use, store, and protect your personal data when you use the Shiftlyx mobile application (the &quot;App&quot;). Shiftlyx is a personal planning and wellbeing tool designed for shift workers — it is <strong>not a medical device</strong> and does <strong>not</strong> process NHS patient data.
            </p>

            <p>
              We take your privacy seriously. Shiftlyx was built with privacy by design and by default. We collect only what we need to make the App work, and we never sell your data.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              1. Who We Are
            </h2>
            <p>
              Shiftlyx is operated by <strong>Beemal Innovation Ltd</strong>, a company registered in England and Wales.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Company: Beemal Innovation Ltd</li>
              <li>Website: <a href="https://beemalinnovation.co.uk" className="text-[#2563eb] hover:underline" target="_blank" rel="noopener noreferrer">beemalinnovation.co.uk</a></li>
              <li>Registered address: 29 Arden Place, Luton, LU2 7YE</li>
              <li>Company registration number: 17048693</li>
              <li>Contact email: <a href="mailto:admin@beemalinnovation.co.uk" className="text-[#2563eb] hover:underline">admin@beemalinnovation.co.uk</a></li>
            </ul>
            <p>
              We are the data controller for your personal data collected through the App.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              2. What Data We Collect
            </h2>
            <p>
              We collect only the data necessary to provide and improve the App. We do <strong>not</strong> collect NHS data, employer data, or any health information beyond what you choose to enter regarding your shift patterns and fatigue.
            </p>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              2.1 Data You Provide
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account information:</strong> When you create an account, we collect a unique identifier (e.g., email address or anonymous auth token) to authenticate you.</li>
              <li><strong>Profile information:</strong> Optional details such as your profession (e.g., Nurse, Paramedic), NHS band, contracted hours, and commute time.</li>
              <li><strong>Shift data:</strong> Your shift patterns, including shift types (LD, MLD, TW, N), dates, and times. This data is stored locally on your device and optionally synced to our servers for cross-device use.</li>
              <li><strong>Partner Sync:</strong> If you use Partner Sync, we store limited data about your linked partner to enable coordination features. You control what is shared.</li>
              <li><strong>Communications:</strong> If you contact us, we keep records of those communications.</li>
            </ul>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              2.2 Data Collected Automatically
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Analytics data:</strong> We use <strong>PostHog</strong> (self-hosted or cloud) to collect anonymised usage data. This includes: app opens, feature interactions, crash reports, and device type. This data is anonymised and cannot be linked back to you personally.</li>
              <li><strong>Session recordings:</strong> We use <strong>UXCam</strong> to record user sessions (screen taps, navigation flows, and interactions) for the purpose of improving app usability. Session recordings may capture what you see and interact with on screen, but do not capture passwords, payment card details, or any data entered into secure text fields. You can opt out of session recording at any time through the App settings.</li>
              <li><strong>Advertising analytics:</strong> We use <strong>Meta (Facebook) App Events</strong> to measure the effectiveness of our advertising campaigns and attribute app installs and in-app actions to specific ad campaigns. This involves sharing anonymised event data (e.g., app opens, sign-ups, premium feature usage) with Meta. No personal data (name, email, shift data) is shared with Meta for advertising purposes.</li>
              <li><strong>Firebase Analytics &amp; Crashlytics:</strong> We use <strong>Google Firebase</strong> for analytics and crash reporting. This collects: app usage events, session duration, device model, operating system version, and crash stack traces. Firebase Analytics data is anonymised. Crash reports may include device state at the time of crash but no personal data.</li>
              <li><strong>Technical data:</strong> Device model, operating system version, app version, and basic diagnostic logs for troubleshooting.</li>
            </ul>

            <h3 className="font-heading text-lg font-semibold text-foreground mt-6 mb-3">
              2.3 Data We Do NOT Collect
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>NHS patient data (we never connect to hospital systems)</li>
              <li>Employer or trust information</li>
              <li>Government identifiers (NHS number, National Insurance number)</li>
              <li>Medical records or clinical data</li>
              <li>Location data (we do not track your location)</li>
              <li>Contacts list (we do not access your device contacts)</li>
              <li>Biometric data (fingerprint, face recognition data)</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              3. Why We Collect Your Data and Our Lawful Basis
            </h2>
            <p>
              Under the UK General Data Protection Regulation (UK GDPR), we rely on the following lawful bases for processing your personal data:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-[#e2e8f0] text-sm">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">Purpose</th>
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">Data Used</th>
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">Lawful Basis (Art. 6)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Account creation &amp; authentication</td>
                    <td className="border border-[#e2e8f0] p-3">Email / auth token</td>
                    <td className="border border-[#e2e8f0] p-3">Performance of a contract (Art. 6(1)(b))</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Providing the App features</td>
                    <td className="border border-[#e2e8f0] p-3">Shift data, profile info</td>
                    <td className="border border-[#e2e8f0] p-3">Performance of a contract (Art. 6(1)(b))</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Analytics &amp; improvement</td>
                    <td className="border border-[#e2e8f0] p-3">Anonymised usage data</td>
                    <td className="border border-[#e2e8f0] p-3">Legitimate interests (Art. 6(1)(f))</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Crash reporting &amp; troubleshooting</td>
                    <td className="border border-[#e2e8f0] p-3">Diagnostic logs</td>
                    <td className="border border-[#e2e8f0] p-3">Legitimate interests (Art. 6(1)(f))</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Partner Sync</td>
                    <td className="border border-[#e2e8f0] p-3">Selected shift data</td>
                    <td className="border border-[#e2e8f0] p-3">Consent (Art. 6(1)(a))</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Marketing communications (if opted in)</td>
                    <td className="border border-[#e2e8f0] p-3">Email address</td>
                    <td className="border border-[#e2e8f0] p-3">Consent (Art. 6(1)(a))</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Legal obligations</td>
                    <td className="border border-[#e2e8f0] p-3">Account data</td>
                    <td className="border border-[#e2e8f0] p-3">Legal obligation (Art. 6(1)(c))</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Advertising analytics &amp; attribution</td>
                    <td className="border border-[#e2e8f0] p-3">Anonymised app event data</td>
                    <td className="border border-[#e2e8f0] p-3">Consent (Art. 6(1)(a))</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3">Session recording &amp; usability analysis</td>
                    <td className="border border-[#e2e8f0] p-3">Screen recordings (no sensitive data)</td>
                    <td className="border border-[#e2e8f0] p-3">Consent (Art. 6(1)(a)) / Legitimate interests (Art. 6(1)(f))</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              4. How We Store and Protect Your Data
            </h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Encryption in transit:</strong> All data transmitted between the App and our servers is encrypted using TLS 1.3.</li>
              <li><strong>Encryption at rest:</strong> Data stored on our servers is encrypted using industry-standard AES-256 encryption.</li>
              <li><strong>Local-first architecture:</strong> Wherever possible, your data stays on your device. Cloud sync is optional.</li>
              <li><strong>Access controls:</strong> Only authorised personnel with a legitimate need can access server data.</li>
              <li><strong>UK-based hosting:</strong> Our primary data storage is in UK-based servers (via Supabase and Vercel).</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              5. Data Retention
            </h2>
            <p>
              We retain your personal data only for as long as necessary to provide the App services:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Active accounts:</strong> We retain your data for the duration of your account. Backup retention cycles may add up to 30 days beyond account deletion.</li>
              <li><strong>Deleted accounts:</strong> When you delete your account, we permanently erase your personal data within 15 business days. We may retain anonymised analytics data indefinitely as this cannot be linked to you.</li>
              <li><strong>Diagnostic logs:</strong> Retained for a maximum of 90 days.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              6. Third-Party Processors
            </h2>
            <p>
              We use the following third-party service providers who process your data on our behalf. Each processor is contractually bound to comply with UK GDPR and may only process data for the purposes we specify:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-[#e2e8f0] text-sm">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">Processor</th>
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">Purpose</th>
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">Data Location</th>
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">Safeguards</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Supabase</td>
                    <td className="border border-[#e2e8f0] p-3">Database &amp; authentication</td>
                    <td className="border border-[#e2e8f0] p-3">UK (London)</td>
                    <td className="border border-[#e2e8f0] p-3">SOC 2 certified, DPA in place</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Vercel</td>
                    <td className="border border-[#e2e8f0] p-3">Website hosting &amp; Edge Functions</td>
                    <td className="border border-[#e2e8f0] p-3">UK / EU</td>
                    <td className="border border-[#e2e8f0] p-3">SOC 2 certified, DPA in place</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">PostHog</td>
                    <td className="border border-[#e2e8f0] p-3">Anonymised analytics</td>
                    <td className="border border-[#e2e8f0] p-3">UK / EU (self-hosted option)</td>
                    <td className="border border-[#e2e8f0] p-3">Data anonymised, no personal data shared</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">OpenAI</td>
                    <td className="border border-[#e2e8f0] p-3">AI Voice Planner (Realtime API)</td>
                    <td className="border border-[#e2e8f0] p-3">US (data not used for training)</td>
                    <td className="border border-[#e2e8f0] p-3">OpenAI API data not used for model training; Standard DPA and SCCs in place</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Apple / Google</td>
                    <td className="border border-[#e2e8f0] p-3">In-app purchases &amp; subscriptions</td>
                    <td className="border border-[#e2e8f0] p-3">Varies by platform</td>
                    <td className="border border-[#e2e8f0] p-3">Apple/Google manage payment data; we never see card details</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">UXCam</td>
                    <td className="border border-[#e2e8f0] p-3">Session recording &amp; usability analytics</td>
                    <td className="border border-[#e2e8f0] p-3">EU (Germany)</td>
                    <td className="border border-[#e2e8f0] p-3">GDPR compliant, data encrypted, opt-out available in-app</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Google Firebase</td>
                    <td className="border border-[#e2e8f0] p-3">Analytics &amp; crash reporting</td>
                    <td className="border border-[#e2e8f0] p-3">US / EU</td>
                    <td className="border border-[#e2e8f0] p-3">SOC 2 certified, SCCs in place, data anonymised</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Meta (Facebook)</td>
                    <td className="border border-[#e2e8f0] p-3">Ad attribution &amp; campaign measurement</td>
                    <td className="border border-[#e2e8f0] p-3">US / EU</td>
                    <td className="border border-[#e2e8f0] p-3">SCCs in place, limited to anonymised event data, no personal data shared</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              7. International Data Transfers
            </h2>
            <p>
              Where we transfer your data to processors outside the UK, we ensure appropriate safeguards are in place. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Transfers to the EU are covered by the UK&apos;s adequacy decision for EU countries.</li>
              <li>Transfers to the US are covered by Standard Contractual Clauses (SCCs) approved by the ICO, together with supplementary measures where required.</li>
              <li>We always choose UK or EU data centres where possible.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              8. Your Rights Under UK GDPR
            </h2>
            <p>
              You have the following rights regarding your personal data. You can exercise most of these directly through the App settings, or by contacting us:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-[#e2e8f0] text-sm">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">Right</th>
                    <th className="border border-[#e2e8f0] p-3 text-left font-semibold text-foreground">What It Means</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Right to be informed</td>
                    <td className="border border-[#e2e8f0] p-3">This Privacy Policy provides that information.</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Right of access</td>
                    <td className="border border-[#e2e8f0] p-3">You can request a copy of the personal data we hold about you.</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Right to rectification</td>
                    <td className="border border-[#e2e8f0] p-3">You can correct inaccurate or incomplete data in the App settings.</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Right to erasure</td>
                    <td className="border border-[#e2e8f0] p-3">You can delete your account and associated data in the App settings.</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Right to restrict processing</td>
                    <td className="border border-[#e2e8f0] p-3">You can request we limit how we use your data.</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Right to data portability</td>
                    <td className="border border-[#e2e8f0] p-3">You can request your data in a machine-readable format.</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Right to object</td>
                    <td className="border border-[#e2e8f0] p-3">You can object to processing based on legitimate interests (e.g., analytics).</td>
                  </tr>
                  <tr>
                    <td className="border border-[#e2e8f0] p-3 font-medium">Rights relating to automated decision-making</td>
                    <td className="border border-[#e2e8f0] p-3">You can request human review of automated decisions. Our fatigue score is deterministic and explainable.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              To exercise any of these rights, contact us at <a href="mailto:admin@beemalinnovation.co.uk" className="text-[#2563eb] hover:underline">admin@beemalinnovation.co.uk</a>. We will respond within one month.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              9. Cookies, Tracking, and Analytics
            </h2>
            <p>
              The App itself does not use cookies, but we use the following tracking and analytics technologies:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>PostHog:</strong> Anonymised product analytics — tracks app opens, feature usage, and navigation flows. Data is anonymised and cannot be linked to you. The Shiftlyx website also uses PostHog, which sets cookies with anonymised identifiers. You can opt out through your browser settings or our cookie preferences.</li>
              <li><strong>UXCam:</strong> Session recording for usability improvement — records screen interactions (taps, navigation) during your app sessions. Does <em>not</em> record passwords, payment data, or secure text fields. You can disable UXCam at any time from the App settings.</li>
              <li><strong>Firebase (Google):</strong> App analytics and crash reporting — collects anonymised usage events and crash stack traces to help us fix bugs and improve performance.</li>
              <li><strong>Meta (Facebook) App Events:</strong> Advertising measurement — tracks anonymised app events (e.g., install, sign-up, purchase) to help us measure ad campaign effectiveness and optimise marketing spend. No personal data (name, email, shift data) is shared with Meta.</li>
              <li><strong>Firebase Crashlytics:</strong> Crash reporting — automatically captures crash logs and device state when the app crashes. No personal data is included in crash reports.</li>
            </ul>
            <p>
              You can opt out of analytics tracking at any time through the App settings or by contacting us at <a href="mailto:admin@beemalinnovation.co.uk" className="text-[#2563eb] hover:underline">admin@beemalinnovation.co.uk</a>. Opting out will not affect your ability to use the App.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p>
              Shiftlyx is not intended for use by individuals under the age of 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us immediately at <a href="mailto:admin@beemalinnovation.co.uk" className="text-[#2563eb] hover:underline">admin@beemalinnovation.co.uk</a>.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              11. AI Voice Planner and OpenAI
            </h2>
            <p>
              The AI Voice Planner feature uses OpenAI&apos;s Realtime API via WebRTC for natural language shift planning. Voice conversations are processed in real-time and are <strong>not</strong> used to train OpenAI models (as per OpenAI&apos;s API data usage policy). We do not send your shift data, fatigue scores, or personal information to OpenAI as part of this feature beyond what you voluntarily say during a voice planning session.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes through the App or by email. We encourage you to review this policy periodically. The date of the latest revision is shown at the top of this page.
            </p>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              13. How to Make a Complaint
            </h2>
            <p>
              If you have concerns about how we handle your personal data, please contact us first — we will do our best to resolve the issue:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email: <a href="mailto:admin@beemalinnovation.co.uk" className="text-[#2563eb] hover:underline">admin@beemalinnovation.co.uk</a></li>
            </ul>
            <p>
              If you are not satisfied with our response, you have the right to lodge a complaint with the <strong>Information Commissioner&apos;s Office (ICO)</strong>, the UK&apos;s data protection regulator:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Website: <a href="https://ico.org.uk" className="text-[#2563eb] hover:underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a></li>
              <li>Phone: 0303 123 1113</li>
              <li>Address: Information Commissioner&apos;s Office, Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-foreground mt-10 mb-4">
              14. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us:
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
