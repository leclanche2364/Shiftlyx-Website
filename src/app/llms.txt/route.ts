import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export async function GET() {
  const blogLines = siteConfig.blog.articles
    .map(
      (a) => `- [${a.title}](https://www.shiftlyx.com/blog/${a.slug}): ${a.excerpt}`
    )
    .join("\n");

  const featuresLines = siteConfig.features
    .map(
      (f) =>
        `- **${f.title}**: ${f.tagline} ${f.description}`
    )
    .join("\n");

  const faqLines = siteConfig.faq
    .map((item) => `- **${item.q}**: ${item.a}`)
    .join("\n");

  const content = `# Shiftlyx
> An AI shift planner for shift workers — track fatigue, plan shifts, and coordinate with your partner.
> URL: https://www.shiftlyx.com
> Built by: Beemal Innovation Ltd | Company #17048693 (England & Wales)
> Contact: admin@beemalinnovation.co.uk
> Platform: iOS 16+ and Android 10+ (Flutter + Supabase)
> Launch: Late May 2026

Healthcare shift workers (nurses, doctors, paramedics, midwives, HCAs) use Shiftlyx to manage the physical and mental toll of shift work. Free to download and use. AI-powered features unlock at £3.99/month or £18.99/year.

## Pages
- [Home](https://www.shiftlyx.com/): Landing page — fatigue gauge, shift planner preview, waitlist signup
- [Features](https://www.shiftlyx.com/features): Full feature breakdown — 7 features with screenshots and detail
- [About](https://www.shiftlyx.com/about): Built by shift workers who understand the problem firsthand
- [Blog](https://www.shiftlyx.com/blog): 8+ articles on fatigue, rotas, recovery, night shifts, annual leave
- [Download](https://www.shiftlyx.com/download): App store links, waitlist signup
- [Waitlist](https://www.shiftlyx.com/waitlist): Early access signup — lock in Day One Annual price
- [Privacy](https://www.shiftlyx.com/privacy): UK GDPR-compliant privacy policy
- [Terms](https://www.shiftlyx.com/terms): Terms of Service
- [Partner Invite](https://www.shiftlyx.com/partner-invite): Partner Sync QR code connection and coordination modes
- [Tools](https://www.shiftlyx.com/tools): Free tools — Fatigue Score Validator, Store Asset Studio
- [Fatigue Score Validator](https://www.shiftlyx.com/tools/fatigue-score-validator): Upload NHS rota (photo or ICS) for instant fatigue analysis
- [Store Asset Studio](https://www.shiftlyx.com/tools/store-asset-studio): Generate App Store Play Store screenshots with correct sizing

## Features
${featuresLines}

## Pricing
- **Free**: £0/month — Fatigue Score (0-100), Manual Shift Entry, Recovery Coach, Preference Learning
- **Premium Monthly**: £3.99/month — All Free features + AI Voice Planner, Partner Sync (4 modes), Fatigue Intelligence, Income Estimator, Annual Leave Optimiser. Free 1-month trial.
- **Day One Annual**: £18.99/year (60% off) — Same as Premium, locks in launch price for life. Free 1-month trial.
- **Pricing detail**: https://www.shiftlyx.com/pricing.md

## Blog Articles
${blogLines}

## Frequently Asked Questions
${faqLines}

## Partner Sync Coordination Modes
- **Standard**: Combined calendar view, no special rules
- **Avoid Same Heavy Days**: Reranks plans so you and your partner aren't both working punishing shifts on the same day
- **Childcare First**: Ensures one parent is always available for childcare
- **Shared Off First**: Plans with shared days off ranked higher
- Connection: NFC tap or QR code. Real-time sync. Blurred names for privacy.

## Shift Planner Strategies
- **Income Optimised**: Maximises earnings via night (+30%), Saturday (+30%), Sunday (+60%) enhancements
- **Balanced**: Best mix of income and health
- **Health Optimised**: Recovery first — minimises consecutive days, avoids night clustering
- **Shift Stacked**: Clusters shifts into blocks for longer uninterrupted breaks
- **Annual Leave Maximised**: Strategically places AL around shifts for maximum consecutive days off

## Fatigue Score Dimensions
- **Consecutive Work Days**: How many in a row without a reset
- **Night Clustering**: How tightly nights are packed together
- **Short Recovery**: Shifts with fewer than 16 hours between finish and next start
- **Circadian Disruption**: How often body clock has to flip between day and night

## Research Evidence
- Nearly 70% of nurses report working through fatigue, 56% say it affects patient care (Journal of Clinical Nursing, 2023)
- Shift workers have 40% higher risk of cardiovascular disease (WHO/IARC, 2019)
- Average NHS nurse works 5.6 consecutive shifts before a day off (Nuffield Trust, 2023)
- Fatigued nurses are 3x more likely to make medication errors (BMJ Quality & Safety, 2020)
- Only 1 in 4 NHS staff feel they have a good work-life balance (NHS Staff Survey, 2023)

## Key Technical Details
- AI Voice Planner: Powered by OpenAI Realtime WebRTC — natural language shift planning
- Fatigue Engine: Deterministic, reproducible — not a black box
- Data: No employer access, no NHS integration, no data selling. Private by design
- UK-based, UK GDPR compliant
- Payment via Apple App Store and Google Play Store

## Social
- X: https://x.com/shiftlyx
- LinkedIn: https://www.linkedin.com/company/shiftlyx
- TikTok: https://www.tiktok.com/@shiftlyx
- Instagram: https://www.instagram.com/shiftlyx/
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
