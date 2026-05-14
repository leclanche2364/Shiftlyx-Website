import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export async function GET() {
  const blogLines = siteConfig.blog.articles
    .map(
      (a) => `- [${a.title}](https://shiftlyx.com/blog/${a.slug}): ${a.excerpt}`
    )
    .join("\n");

  const content = `# Shiftlyx
> A personal operating system for shift workers — track fatigue, plan shifts, and coordinate with your partner.

NHS nurses and healthcare workers use Shiftlyx to manage the physical and mental toll of shift work. Free to download and use. AI-powered features unlock at £3.99/month.

## Pages
- [Home](https://shiftlyx.com/): Landing page — fatigue gauge, shift planner preview, waitlist signup
- [Features](https://shiftlyx.com/features): Full feature breakdown — fatigue tracking, AI voice planning, partner sync, recovery coach, income estimator, preference learning
- [About](https://shiftlyx.com/about): Built by an ICU nurse who understands the problem firsthand
- [Blog](https://shiftlyx.com/blog): Shift worker guides on fatigue, rotas, recovery, night shifts
- [Download](https://shiftlyx.com/download): App store links, waitlist signup
- [Privacy](https://shiftlyx.com/privacy): UK GDPR-compliant privacy policy
- [Terms](https://shiftlyx.com/terms): Terms of Service
- [Waitlist](https://shiftlyx.com/waitlist): Early access signup — lock in Day One Annual price

## Core Features
- **Fatigue Score (0-100)**: Quantifies cumulative fatigue from consecutive work days, night clustering, short recoveries, and circadian disruption
- **Shift Planner**: Generates plans across 5 strategies (Income Optimized, Balanced, Health Optimized, Shift Stacked, Annual Leave Maximised) — deterministic and reproducible
- **Partner Sync (Premium)**: 4 coordination modes (Standard, Avoid Same Heavy Days, Childcare First, Shared Off First) for couples managing rosters
- **Recovery Coach**: Adaptive notification system that learns when you engage and respects shift/night/recovery windows
- **AI Voice Planning**: Natural language shift planning via Realtime WebRTC voice interface (Premium)
- **Income Estimator**: Calculates pay including night (+30%), Saturday (+30%), Sunday (+60%) enhancements (Premium)
- **Fatigue Intelligence**: Predictive fatigue forecasting and personalised recommendations (Premium)
- **Preference Learning**: Adapts to your schedule preferences over time with affinity scoring

## Pricing
- **Free**: Fatigue Score, Shift Planner, Recovery Coach, Preference Learning
- **Monthly**: £3.99/month — all Premium features
- **Day One Annual**: £18.99/year (60% off) — locks in launch price for life

## Key Details
- Built by: Beemal Innovation Ltd (company #17048693, registered in England & Wales)
- Registered address: 29 Arden Place, Luton, LU2 7YE
- Contact: admin@beemalinnovation.co.uk
- Platform: iOS + Android (Flutter/Supabase)
- Target audience: NHS nurses, healthcare assistants, paramedics, and rotating shift workers
- App launch: Late May 2026

## Blog Articles
${blogLines}

## Common Questions
- **Q: Is Shiftlyx a rota/hospital tool?** No. It's a personal OS for the shift worker — it doesn't replace NHS rostering systems like HealthRota or Loop. It sits on your phone and helps you make better decisions about your schedule.
- **Q: Can it swap shifts?** Currently shift swapping is planned but not available at launch. The focus is on choosing the right shifts and managing fatigue.
- **Q: How is fatigue calculated?** From 4 dimensions: consecutive work days, night shift clustering, short recoveries (<16h turnaround), and circadian disruption. It's deterministic and explainable — not a black box.
- **Q: Does it integrate with my NHS trust?** No. Shiftlyx works independently. You add your shifts manually or import from your calendar/rota.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
