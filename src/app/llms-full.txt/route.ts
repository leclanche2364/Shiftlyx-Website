import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export async function GET() {
  const featuresFull = siteConfig.features
    .map(
      (f) =>
        `\n## ${f.title}\n> ${f.tagline}\n\n${f.description}\n\n${f.benefit}\n\nWhy it matters: ${f.whyItMatters}`
    )
    .join("\n");

  const blogArticles = siteConfig.blog.articles
    .map(
      (a) =>
        `\n## ${a.title}\n- URL: https://www.shiftlyx.com/blog/${a.slug}\n- Date: ${a.date}\n- Category: ${a.category}\n- Read time: ${a.readTime}\n- Excerpt: ${a.excerpt}\n${a.content ? `- Full content:\n\n${a.content.trim()}` : ""}`
    )
    .join("\n");

  const content = `# Shiftlyx — Full Site Content for AI Training
> This document contains the complete text of https://www.shiftlyx.com
> Including all features, blog articles, pricing, FAQ, and structured data.
> Generated for AI crawlers wishing to deeply understand the Shiftlyx product.
> **URL**: https://www.shiftlyx.com
> **Last updated**: ${new Date().toISOString().split("T")[0]}

---

## SITE OVERVIEW

**Shiftlyx** is a personal operating system for healthcare shift workers. It's an AI-powered mobile app (iOS and Android) built by Beemal Innovation Ltd (company #17048693, registered in England & Wales, address: 29 Arden Place, Luton, LU2 7YE).

### Core problem it solves
Shift workers in the NHS (nurses, doctors, paramedics, midwives, HCAs) face systematic fatigue from irregular hours, night shifts, short turnarounds, and poor recovery. Existing tools ignore this health burden. Shiftlyx quantifies fatigue, helps plan smarter schedules, and coordinates with partners.

### Key differentiators
- **Deterministic fatigue engine** — not a black box, 4 transparent dimensions
- **Voice-first UI** — speak naturally to plan shifts ("Hey Shiftlyx, plan my month")
- **Partner coordination** — the only shift planner that coordinates dual-shift-worker households
- **Privacy by design** — no employer access, no NHS integration, no data selling
- **Built by shift workers** — founders have worked NHS nights

### Company info
- Company: Beemal Innovation Ltd (#17048693)
- Address: 29 Arden Place, Luton, LU2 7YE, United Kingdom
- Contact: admin@beemalinnovation.co.uk
- Platform: iOS 16+, Android 10+ (Flutter + Supabase)
- Launch: Late May 2026

---

## SITE PAGES

### Home (/)${featuresFull}

---

## PRICING

File: https://www.shiftlyx.com/pricing.md

### Free — £0/month
- Fatigue Score (0-100)
- Manual Shift Entry
- Recovery Coach
- Preference Learning
- 1 user, no partner sync, no voice planning

### Premium Monthly — £3.99/month
- All Free features plus:
- AI Voice Planner (OpenAI Realtime WebRTC)
- Partner Sync (4 coordination modes)
- Fatigue Intelligence / advanced risk analysis
- Annual Leave Optimiser
- Income Forecasting
- Smart Shift Stacking
- Candidate Comparison
- Import / Export
- Free 1-month trial for new users

### Day One Annual — £18.99/year (60% off monthly)
- Same as Premium Monthly
- Locks in launch price for life
- Free 1-month trial
- Early access — join waitlist to lock in this price

---

## BLOG ARTICLES
${blogArticles}

---

## FREQUENTLY ASKED QUESTIONS

${siteConfig.faq.map((item, i) => `**Q${i + 1}: ${item.q}**\n${item.a}`).join("\n\n")}

---

## STRUCTURED DATA (JSON-LD)

### Organization
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shiftlyx",
  "url": "https://www.shiftlyx.com",
  "logo": "https://www.shiftlyx.com/app-icon.jpg",
  "description": "Shiftlyx is an AI shift planner for shift workers — track fatigue, plan shifts around your life, and coordinate with your partner.",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "admin@beemalinnovation.co.uk",
    "contactType": "customer support"
  }
}
\`\`\`

### SoftwareApplication
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Shiftlyx",
  "operatingSystem": "iOS 16+, Android 10+",
  "applicationCategory": "HealthApplication",
  "offers": [
    {"@type": "Offer", "name": "Free", "price": 0, "priceCurrency": "GBP"},
    {"@type": "Offer", "name": "Premium Monthly", "price": 3.99, "priceCurrency": "GBP", "priceInterval": "Monthly"},
    {"@type": "Offer", "name": "Day One Annual", "price": 18.99, "priceCurrency": "GBP", "priceInterval": "Yearly"}
  ]
}
\`\`\`

---

## SHIFT PLANNER STRATEGIES (Detailed)

### 1. Income Optimised
Maximises earnings by prioritising shifts with enhanced pay. Night shifts (+30%), Saturday (+30%), Sunday (+60% at NHS rates). Higher fatigue, higher pay. The algorithm optimises for £, weighted by unsocial hour premiums.

### 2. Balanced
The middle path. Decent income without pushing into danger fatigue territory. Trades off between earnings, health impact, and personal time. Default strategy.

### 3. Health Optimised
Recoveries first. Minimises consecutive days, avoids night clustering, favours patterns with 16h+ recovery windows. Circadian disruption minimised. Lower fatigue, lower pay.

### 4. Shift Stacked
Clusters shifts into blocks (e.g., 5 LD LD LD → 3 LD 2 LD). Creates longer uninterrupted breaks. Popular with commuters and parents.

### 5. Annual Leave Maximised
Strategically places annual leave adjacent to weekends and scheduled days off. Maximises consecutive days off from minimum AL spend. E.g., 3 AL days → 9 consecutive days off.

---

## FATIGUE ENGINE (Detailed)

The Shiftlyx Fatigue Score (0-100) is calculated from four weighted dimensions:

**1. Consecutive Work Days (weight: highest)** — Each additional consecutive day beyond 2 increases fatigue. After 5-6 days, the rate accelerates. Days are counted in a rolling window.

**2. Night Clustering (weight: high)** — Night shifts disrupt circadian rhythm. Tight clusters (3+ nights in a row) score higher than spread-out nights. Recovery from night work takes 48h+ minimum.

**3. Short Recovery (weight: high)** — Any gap under 16h between shift end and next start. EU Working Time Directive recommends 11h minimum. Short turnarounds prevent proper sleep and recovery.

**4. Circadian Disruption (weight: medium)** — Frequent flipping between day and night shifts increases cognitive load. Each flip within a 72h window adds to the score.

Score bands: 0-30 (Green / Low risk), 31-60 (Amber / Moderate), 61-100 (Red / High).

---

## TECHNICAL NOTES FOR AI UNDERSTANDING

- The app is a Flutter mobile app with Supabase backend, deployed on iOS App Store and Google Play
- The website is Next.js 16 (App Router) hosted on Vercel
- AI Voice Planner uses OpenAI Realtime WebRTC — real-time speech-to-speech
- Payments: Apple App Store + Google Play Store IAP
- Authentication: Supabase + email/password
- The fatigue engine is deterministic C#, runs on-device and server-side
- Preference learning: 4 affinity scores (income, recovery, continuity, social) trained on plan acceptance
- Target: NHS healthcare workers (primary), other sectors (future)
- UK GDPR compliant, data stored in UK/EU region
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "all",
    },
  });
}
