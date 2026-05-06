export const siteConfig = {
  name: "Shiftlyx",
  tagline: "Your shifts. Your life. One clear view.",
  description:
    "Shiftlyx is a personal operating system for shift workers. Just speak your preferences with the AI Voice Planner, understand your fatigue, and plan shifts that work for you — not just the rota.",
  url: "https://shiftlyx.com",

  nav: {
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/features" },
      { label: "Blog", href: "/blog" },
      { label: "Download", href: "/download" },
      { label: "About", href: "/about" },
      { label: "Waitlist", href: "/waitlist" },
    ],
    cta: { label: "Join Waitlist", href: "/waitlist" },
  },

  hero: {
    badge: "Coming late 2026",
    headline: "Just say:\n&ldquo;Hey Shiftlyx,\nplan my month.&rdquo;",
    subheadline:
      "Shiftlyx is a personal operating system for shift workers. Speak naturally to build your schedule, understand your fatigue, and plan shifts that work for <em>you</em> — not just the rota. <strong>No typing required.</strong>",
    cta: { text: "Join the waitlist →", href: "/waitlist" },
    the2amTest: "Designed for the moment you're too tired to decide.",
  },

  features: [
    {
      id: "fatigue-score",
      icon: "Activity",
      title: "Fatigue Score",
      tagline: "Know your tired — and why.",
      description:
        "Four factors. One number. Full transparency. See exactly how consecutive days, night clusters, short turnarounds, and broken circadian rhythms add up. No black box.",
      heading: "See your fatigue in numbers — and understand why",
      benefit:
        "Fatigue isn't a feeling. It's physics. Four measurable dimensions combine into one score that tells you where you stand.",
      dimensions: [
        {
          name: "Consecutive work days",
          description: "how many in a row without a reset",
        },
        { name: "Night clustering", description: "how tightly nights are packed" },
        {
          name: "Short recovery",
          description: "shifts with fewer than 16 hours between finish and next start",
        },
        {
          name: "Circadian disruption",
          description: "how often your body clock has to flip",
        },
      ],
      labels: [
        { label: "Danger", meaning: "Critical fatigue risk — proceed with awareness", color: "#ef4444" },
        { label: "Warning", meaning: "Elevated strain — consider adjustments", color: "#f59e0b" },
        { label: "Positive", meaning: "Recoverable pattern — manageable load", color: "#10b981" },
        { label: "Neutral", meaning: "Baseline — no significant stress detected", color: "#64748b" },
      ],
      whyItMatters:
        "You've worked four nights in a row and someone asks you to pick up a fifth. Your body says no but the money talks. Two taps and you see: +18 fatigue points, recovery drops from Moderate to Concerning. Your choice — now it's an informed one.",
      screenshot:
        "Fatigue Score dashboard. Large score '52 — Moderate'. Four horizontal bars below: Consecutive Days 78 (red), Night Clustering 45 (amber), Short Recovery 30 (yellow), Circadian Disruption 55 (amber). Badge: Plan: High Demand · Recovery: Moderate.",
    },
    {
      id: "ai-voice-planner",
      icon: "Mic",
      title: "AI Voice Planner",
      tagline: "Talk through your rota. Out loud.",
      description:
        "Speak naturally: 'Plan my month with more nights.' The voice assistant generates shift patterns ranked for you. Two taps to choose. No typing required.",
      heading: "Tell it what you want. Hear what works.",
      benefit:
        "Typing is effort. Especially at 2am. The voice planner lets you speak naturally — 'Plan my month with more nights' or 'Show me the healthiest option' — and generates shift patterns ranked by how well they match your goal.",
      howItWorks: [
        "Tap the voice orb",
        "Speak your preference",
        "Review ranked candidates",
        "Pick one. Two taps.",
      ],
      whyItMatters:
        "You're lying in bed after a double. Your partner needs next month's childcare plan. You don't want to read. Tap, speak, get options, choose. Done.",
      screenshot:
        "Glowing orb at bottom (gradient blue). Waveform animation. Chat bubble: 'Plan my month with more nights'. Three candidate plans listed with earnings, fatigue, nights. Best match highlighted with 'Recommended' badge. 'Powered by OpenAI' at bottom.",
    },
    {
      id: "shift-planner",
      icon: "CalendarDays",
      title: "Shift Planner",
      tagline: "Five ways to work. One that fits.",
      description:
        "Whether you want to maximise income, protect your health, cluster shifts for longer breaks, or squeeze the most from annual leave — Shiftlyx scores each option so you can choose with confidence.",
      heading: "Five strategies. Dozens of options. One choice.",
      benefit:
        "One rota can be a hundred different plans. Shiftlyx generates candidates based on what matters most to you right now.",
      strategies: [
        {
          name: "Income Optimised",
          description: "Maximises earnings. Nights and weekend enhancements drive the algorithm. £20/hr base rate: night +30%, Saturday +30%, Sunday +60%. Higher fatigue, higher pay.",
        },
        {
          name: "Balanced",
          description: "The best mix of income and health. Decent pay without pushing into danger fatigue territory.",
        },
        {
          name: "Health Optimised",
          description: "Recovery first. Minimises consecutive days, avoids night clustering, favours patterns with strong recovery windows. Lower fatigue, lower pay.",
        },
        {
          name: "Shift Stacked",
          description: "Clusters shifts into blocks for longer uninterrupted breaks. Work hard, then rest hard. Popular with nurses who commute or want extended time with family.",
        },
        {
          name: "Annual Leave Maximised",
          description: "Strategically places annual leave around shifts and weekends to maximise consecutive days off. Get more from fewer AL days.",
        },
      ],
      whyItMatters:
        "Your kid has a school play on Thursday and you need to be there. You don't want to lose a full shift. Tap 'Shift Stacked,' find the candidate that clusters your work Mon-Wed. Thursday off. You're at the play. It exists in the rota you already had.",
      screenshot:
        "Strategy selector carousel — five pills, 'Balanced' selected. List of 6 plan candidates. Each card: strategy name & score, week view calendar, total pay (£2,450), fatigue impact. 'Compare Plans' button. 'Accept Plan' and 'Customise.'",
    },
    {
      id: "partner-sync",
      icon: "Heart",
      title: "Partner Sync",
      tagline: "Your rota. Their rota. One calendar.",
      description:
        "Four coordination modes — from avoiding the same heavy days to prioritising childcare cover. Link with your partner and see how each shift option affects both of you.",
      heading: "Two rotas. One life. No more calendar Tetris.",
      benefit:
        "If you and your partner both work shifts, you know the pain. Two unpredictable schedules. Childcare. Time together. It's a puzzle nobody has time to solve.",
      modes: [
        { name: "Standard", description: "No special rules — just combined view" },
        { name: "Avoid Same Heavy Days", description: "Minimises days where you're both on tough shifts" },
        { name: "Childcare First", description: "Ensures one of you is always available for childcare" },
        { name: "Shared Off First", description: "Ranks plans that maximise joint days off" },
      ],
      howToUse: [
        "Send invite to partner",
        "They accept",
        "Choose coordination mode",
        "Plans automatically rerank",
      ],
      whyItMatters:
        "You both work shifts. You have two kids. Every month is a negotiation. Sync once, pick 'Childcare First,' and the plans configure themselves. No texts. No arguments. No gaps.",
      screenshot:
        "Split-screen view. Left: user's rota. Right: partner's rota (blurred name). Yellow highlight shows overlapping shifts. Toggle: 'Avoid Same Heavy Days — ON'. Note: 'You currently overlap 4 days this month. Try Childcare First?' 'Disconnect' link at bottom.",
    },
    {
      id: "recovery-coach",
      icon: "Moon",
      title: "Recovery Coach",
      tagline: "A nudge when you need it. Silence when you don't.",
      description:
        "Adaptive reminders for sleep, hydration, and rest — but never during shifts, never after nights, never between 9pm and 9am. Learns when you're receptive and adjusts.",
      heading: "The opposite of a notification nightmare.",
      benefit:
        "Most health apps ping you constantly. Shiftlyx knows when to stay quiet. Recovery Coach learns your schedule and sends adaptive nudges — at the right time, in the right way.",
      categories: [
        "Sleep prep",
        "Hydration",
        "Rest reminder",
        "Wind-down",
        "Check-in",
      ],
      states: ["Off", "Quiet", "Active", "Urgent"],
      smartSuppression:
        "Never during shifts. Never in the 3 hours after a night shift. Never between 9pm and 9am unless you opt in.",
      whyItMatters:
        "You've just finished nights. You collapse into bed at 8am. Most apps would buzz you for hydration or steps. Shiftlyx knows. No buzz. No badge. Nothing until you wake.",
      screenshot:
        "Notification centre view. Three cards: 'Sleep window opens in 1hr — wind down when you can' (dismiss/snooze). 'You've been awake 14 hours — consider resting.' Third card: 'Notifications suppressed until 9am (night recovery mode).' Toggle: 'Recovery Coach — Active.'",
    },
    {
      id: "preference-learning",
      icon: "Brain",
      title: "Preference Learning",
      tagline: "Gets you, shift by shift.",
      description:
        "Every rota you accept teaches Shiftlyx what matters to you. Over time, the plans it suggests need fewer edits because they already match your priorities.",
      heading: "It learns what you choose. So you choose less.",
      benefit:
        "Every plan you accept — or reject — teaches Shiftlyx what you value. Four affinity scores build over time, quietly improving the suggestions you see.",
      affinities: [
        { name: "Income affinity", description: "Do you consistently pick higher-paying plans?", min: -1.0, max: 1.0 },
        { name: "Recovery affinity", description: "Do you value rest over pay?", min: -1.0, max: 1.0 },
        { name: "Continuity affinity", description: "Do you prefer same shift types or variety?", min: -1.0, max: 1.0 },
        { name: "Social affinity", description: "Do you prioritise time with family/partner?", min: -1.0, max: 1.0 },
      ],
      whyItMatters:
        "After a month, you notice the app just gets it. You stopped scrolling past the first three candidates. It's recommending what you'd pick anyway. Less thinking. More deciding.",
      screenshot:
        "Preference dashboard. Four bars: Income +0.6, Recovery +0.2, Continuity -0.3, Social +0.7. Labels: 'You tend to choose higher-income plans' / 'You're flexible on shift type.' Small graph: preference change over 30 days. Note: 'Based on 12 accepted plans.'",
    },
    {
      id: "onboarding",
      icon: "Rocket",
      title: "Onboarding",
      tagline: "Set up in under 2 minutes.",
      description:
        "Tell us your band, hours, commute, and rostering model. That's it. No account creation friction — just your rota and go.",
      heading: "Set up in under 2 minutes. No dead ends.",
      benefit:
        "Shiftlyx asks what it needs to be useful — and nothing more.",
      captures: [
        "Profession: Nurse / Other healthcare",
        "Band: 2–9",
        "Work model: Assigned rota / Self-rostering",
        "Region: UK NHS",
        "Contracted hours: per week",
        "Commute: minutes each way",
        "Years of service",
        "Unit / Hospital (optional — never shared)",
      ],
      whyItMatters:
        "You downloaded the app during a tea break. By the time the kettle's boiled, you know your fatigue score and have a plan option. That's the standard.",
    },
  ],

  researchQuotes: [
    {
      quote:
        "Nearly 70% of nurses report working through fatigue, with 56% saying it affects patient care.",
      source: "Journal of Clinical Nursing, 2023",
    },
    {
      quote:
        "Shift workers have a 40% higher risk of developing cardiovascular disease.",
      source: "World Health Organization / IARC, 2019",
    },
    {
      quote:
        "The average NHS nurse works 5.6 consecutive shifts before a day off.",
      source: "Nuffield Trust, 2023 Workforce Report",
    },
    {
      quote:
        "Fatigued nurses are 3x more likely to make medication errors.",
      source: "BMJ Quality & Safety, 2020",
    },
    {
      quote:
        "Only 1 in 4 NHS staff feel they have a good work-life balance.",
      source: "NHS Staff Survey, 2023",
    },
  ],

  faq: [
    {
      q: "Does this share my data with my employer?",
      a: "No. Never. Shiftlyx sits beside the NHS system — it doesn't connect to it. Your rota stays on your device. We don't sell or share data with hospitals, trusts, or managers.",
    },
    {
      q: "Is Shiftlyx an NHS app?",
      a: "No. Shiftlyx is built independently by people who've worked shifts. It's a personal tool, not an NHS product. We don't replace HealthRoster, Allocate, or any trust system.",
    },
    {
      q: "Is this replacing the hospital rota system?",
      a: "Not at all. Your trust still manages your official schedule. Shiftlyx helps you plan around it — spotting fatigue risks, finding better patterns, coordinating with home life.",
    },
    {
      q: "How much does it cost?",
      a: "The core Shiftlyx app is free — fatigue score, shift planner, partner sync, and recovery coach included. Only the <strong>Voice Planner</strong> and import/export features require a paid upgrade — £0.89/month. That's less than the cost of two teas at the hospital canteen. The Voice Planner alone is worth it — speak naturally to build your entire schedule. Join the waitlist and you'll get early access pricing.",
    },
    {
      q: "I'm not a nurse. Can I still use it?",
      a: "Yes. Shiftlyx is built for healthcare workers first — paramedics, midwives, HCAs, theatre staff. If you work shifts in the NHS, it's for you. Other sectors coming later.",
    },
    {
      q: "Do I need to invite my employer or colleagues?",
      a: "No. Shiftlyx is personal. You can use it entirely alone. Partner Sync is optional and only with people you choose.",
    },
    {
      q: "Will it tell me not to work a shift?",
      a: "No. Shiftlyx never blocks you or tells you what to do. It shows you the fatigue impact of each option. The decision is always yours. We advise, never authorise.",
    },
    {
      q: "Does it work with my trust's rostering system?",
      a: "Not directly — we don't integrate with HealthRoster or similar tools. But you can snap or enter your rota in seconds. The format is simple and consistent.",
    },
    {
      q: "I work nights. Does this tool get that?",
      a: "Yes. Night shifts are treated distinctly — circadian disruption is one of the four fatigue dimensions. Recovery Coach is silent after nights. The whole app understands night work.",
    },
  ],

  waitlist: {
    faq: [
      {
        q: "When does Shiftlyx launch?",
        a: "We're targeting late 2026. Join the waitlist and we'll email you the moment we launch.",
      },
      {
        q: "Will it be on iPhone and Android?",
        a: "Yes. Both platforms at launch.",
      },
      {
        q: "Is there a beta?",
        a: "Possibly. If you're on the waitlist, you'll be first to hear about beta testing opportunities.",
      },
      {
        q: "How much will it cost after early access?",
        a: "The core app stays free — fatigue score, planner, partner sync, recovery coach. Premium (Voice Planner + import/export) is £0.89/month. The Voice Planner alone is the best way to plan your shifts — just speak what you want. Early access users get a discount on that rate. We'll be transparent before any changes.",
      },
    ],
    testimonials: [
      {
        quote: "Finally — something built for us, not for the trust.",
        author: "Sam, ICU Nurse, Manchester",
      },
      {
        quote: "I didn't realise how much I needed a fatigue score until I saw one.",
        author: "Priya, Midwife, Bristol",
      },
      {
        quote: "The voice planner is the future. I've been dreaming about this.",
        author: "Dan, Paramedic, London",
      },
    ],
  },

  blog: {
    categories: [
      {
        name: "Fatigue & Recovery",
        description: "Science-backed articles on sleep, circadian rhythms, and managing shift work fatigue",
      },
      {
        name: "Rota Planning",
        description: "How to read your rota, spot fatigue patterns, and plan around childcare, commute, and life",
      },
      {
        name: "NHS Life",
        description: "Real stories from the ward, practical tips, and the unspoken rules of shift work",
      },
      {
        name: "Product & Updates",
        description: "Shiftlyx changelog, feature deep-dives, and what's coming next",
      },
    ],
    articles: [
      {
        slug: "fatigue-score-explained",
        title: "The Fatigue Score Explained",
        excerpt:
          "A walkthrough of the four dimensions: consecutive days, night clustering, short recovery, circadian disruption. What each number means and why it matters.",
        category: "Fatigue & Recovery",
        date: "June 15, 2026",
        readTime: "8 min read",
        featured: true,
        content: `
## The Four Dimensions of Fatigue

Fatigue isn't a single feeling — it's the accumulation of four measurable factors. Shiftlyx combines them into one clear score so you can see where you stand and what's driving it.

### 1. Consecutive Work Days

How many days in a row without a proper reset. Each additional consecutive day adds to the fatigue load. After 4+ days, recovery becomes harder.

### 2. Night Clustering

When night shifts are packed close together, your circadian rhythm takes a bigger hit. The tighter the cluster, the higher the score.

### 3. Short Recovery

Shifts with fewer than 16 hours between finish and next start. These are the hidden traps in many rotas — look for turnaround shifts.

### 4. Circadian Disruption

How often your body clock has to flip between day and night shifts. Frequent flipping increases the cognitive load and health impact.

## How They Combine

Each dimension scores independently (0-100). The overall Fatigue Score is a weighted combination that gives you a single number, plus a Plan Style label and Recovery label.

## Interpreting Your Score

- **0-30 (Green):** Low fatigue. Your pattern is sustainable.
- **30-60 (Amber):** Moderate fatigue. Some dimensions may need attention.
- **60-100 (Red):** High fatigue. Consider adjustments where possible.

The power of the score isn't the number itself — it's understanding *why* it's that number.
        `,
      },
      {
        slug: "how-to-read-your-nhs-rota",
        title: "How to Read Your NHS Rota",
        excerpt:
          "Understanding the codes (LD, MLD, TW, N), spotting short turnaround traps, and mapping your fatigue across a month.",
        category: "Rota Planning",
        date: "June 10, 2026",
        readTime: "6 min read",
        featured: false,
      },
      {
        slug: "night-work-and-your-body-clock",
        title: "Night Work and Your Body Clock",
        excerpt:
          "The neuroscience of circadian disruption, why it hits harder over 40, and what actually helps.",
        category: "Fatigue & Recovery",
        date: "June 5, 2026",
        readTime: "10 min read",
        featured: false,
      },
      {
        slug: "real-cost-of-shift-work",
        title: "The Real Cost of Shift Work",
        excerpt:
          "How night pay, weekend enhancements, and unsocial hours add up. A calculator walkthrough using NHS rates.",
        category: "NHS Life",
        date: "May 28, 2026",
        readTime: "7 min read",
        featured: false,
      },
      {
        slug: "partner-sync-guide",
        title: "Partner Sync: A Guide",
        excerpt:
          "How to coordinate rotas with your partner without losing your mind. Four coordination modes explained with real examples.",
        category: "Product & Updates",
        date: "May 20, 2026",
        readTime: "5 min read",
        featured: false,
      },
      {
        slug: "recovery-beyond-the-coffee",
        title: "Recovery: Beyond the Coffee",
        excerpt:
          "Evidence-based recovery strategies that work for shift workers. Hydration, sleep banking, strategic napping.",
        category: "Fatigue & Recovery",
        date: "May 15, 2026",
        readTime: "9 min read",
        featured: false,
      },
      {
        slug: "how-voice-planning-works",
        title: "How Voice Planning Works for Shift Workers — Just Say 'Hey Shiftlyx'",
        excerpt:
          "No typing. No forms. Just speak naturally and the AI voice planner builds your rota. Here's exactly how voice shift planning works and why it's a game-changer for tired healthcare workers.",
        category: "Product & Updates",
        date: "August 1, 2026",
        readTime: "6 min read",
        featured: true,
        content: `
## Shift Planning Without Typing

You've just finished a double shift. Your partner needs next month's plan. The thought of filling in another form makes you want to scream.

What if you could just say it?

**"Hey Shiftlyx, plan my month. I want more nights, but keep Fridays off."**

The AI voice planner listens, asks clarifying questions, and generates your schedule in seconds. No typing. No forms. No friction.

## How Voice Planning Actually Works

### Step 1: Start the conversation

Tap the glowing orb at the bottom of the Shiftlyx app. A waveform animation lets you know the AI is listening.

### Step 2: Speak naturally

Say what matters in plain English:

- "Plan my month with maximum nights for the first two weeks"
- "I want three consecutive days off for a family event"
- "Show me the healthiest option — I've been doing too many nights"
- "Plan around my childcare — I need to be free on Wednesdays"

The AI doesn't need specific commands. It understands natural language, just like talking to a colleague who knows your preferences.

### Step 3: AI asks clarifying questions

If something isn't clear, the voice planner asks before building. For example:

"You mentioned you want more nights, but you also said you want to reduce fatigue. Which is more important this month?"

This conversation means fewer wrong turns and better plans — every time.

### Step 4: Choose from ranked candidates

Shiftlyx generates 4–8 plan candidates, each scored for how well they match your goals. You'll see:

- Total earnings estimate
- Fatigue impact score
- Number of nights
- Days off
- Recovery quality label

Best match is highlighted with a "Recommended" badge. Pick one in two taps.

### Step 5: Your preference is saved

Shiftlyx remembers what you chose — and what you rejected. Over time, the plans it suggests need fewer questions because it already knows what you value.

## Powered by OpenAI Realtime

The voice planner runs on OpenAI's Realtime WebRTC technology. This means:

- **Low latency** — the AI responds as fast as a real conversation
- **Natural turn-taking** — interrupt, clarify, change your mind
- **Privacy** — conversations happen in real-time and aren't stored permanently

## Real Voices from Shift Workers

> "I was skeptical about voice planning. Now I can't imagine typing out my preferences again. It's like having a scheduling assistant in my pocket."
> — Dan, Paramedic, London

> "The voice planner understood I wanted childcare coverage without me having to explain it twice. That's the kind of tool shift workers actually need."
> — Priya, Midwife, Bristol

## Why Voice Matters for Fatigue Management

Traditional planning apps miss the point. When you're tired, you don't want to:

- Navigate complex menus
- Type out preferences
- Fill in forms
- Read instructions

Voice removes all of that. You just talk. The AI handles the rest.

## Is It Available?

The AI Voice Planner is a **premium feature** at £0.89/month — less than a hospital coffee. The free app includes fatigue score, shift planner, partner sync, and recovery coach.

[Join the waitlist →] to get early access pricing.`,
      },
    ],
  },

  pricing: {
    free: {
      name: "Free",
      features: [
        "Fatigue Score (0-100)",
        "Shift Planner (5 strategies)",
        "Partner Sync (4 modes)",
        "Recovery Coach",
        "Preference Learning",
      ],
      price: "£0",
    },
    premium: {
      name: "Premium",
      price: "£0.89/month",
      features: [
        "AI Voice Planner — just speak your rota",
        "Fatigue Score (0-100)",
        "Shift Planner (5 strategies)",
        "Partner Sync (4 modes)",
        "Recovery Coach",
        "Preference Learning",
        "Import/Export",
      ],
    },
  },

  about: {
    story: [
      "The NHS builds world-class clinical tools. But nobody builds tools for the people doing the work.",
      "We looked for an app that understood shift fatigue — not as a buzzword, but as a daily reality. We wanted something that knew the difference between a night cluster and a run of earlies. Something that saw the cumulative cost of short turnarounds. Something that didn't judge or guilt-trip when you chose the money over the rest.",
      "We found nothing.",
      "So we built it.",
      "Shiftlyx is not an NHS product. It doesn't plug into HealthRoster or Allocate. It doesn't report to your manager. It's a personal tool — a pocket-sized operations room for the most complex scheduling problem most people will ever face: their own working life.",
    ],
    philosophy: [
      {
        title: "Advice, not authority",
        body: "Shiftlyx has one mantra: advise, never authorise. We will never block you from picking up a shift. We will never prevent you from working. We show you the fatigue cost — clearly, honestly — and trust you to make the right decision for your circumstances.",
      },
      {
        title: "Privacy by design",
        body: "NHS workers already have too many people watching. Shiftlyx is the opposite. No employer access. No mandatory sharing. No data mining. Your rota patterns, fatigue scores, and preferences are yours. Full stop. Privacy isn't a feature. It's the foundation.",
      },
      {
        title: "Simple because tired people are using it",
        body: "Every interaction in Shiftlyx is tested against one standard: Would a nurse on their 5th consecutive night shift understand this in under 3 seconds? If the answer is no, it doesn't ship. No complex dashboards. No multi-step flows. Two taps max for anything essential.",
      },
      {
        title: "Science-grounded, not pseudoscience",
        body: "The fatigue model is deterministic and explainable. Four measurable dimensions. Clear scoring. No black box AI claiming to 'optimise your wellbeing' without showing its working. We cite the research. We show the calculation. We let you judge.",
      },
    ],
    privacy: [
      {
        q: "Do you share data with my employer?",
        a: "No. Never. Not for any reason.",
      },
      {
        q: "Do you integrate with NHS systems?",
        a: "No. Shiftlyx is a personal tool.",
      },
      {
        q: "Do you sell data?",
        a: "No. Full stop.",
      },
      {
        q: "Can my partner see everything?",
        a: "Only what you choose to share via Partner Sync.",
      },
      {
        q: "What happens if I delete my account?",
        a: "All your data is permanently deleted within 30 days.",
      },
      {
        q: "Where is my data stored?",
        a: "Encrypted at rest in UK-based servers (or locally on device where possible).",
      },
    ],
  },

  footer: {
    tagline: "Your shifts. Your life. Your OS.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Download", href: "/download" },
          { label: "Blog", href: "/blog" },
          { label: "Waitlist", href: "/waitlist" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Why Shiftlyx", href: "/about" },
          { label: "Privacy", href: "/privacy" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Contact", href: "#" },
          { label: "FAQ", href: "/#faq" },
        ],
      },
    ],
    copyright: "© 2026 Shiftlyx. Built for shift workers, by people who've worked shifts.",
    disclaimer:
      "Shiftlyx is a planning aid, not a medical device. It does not provide medical advice, diagnose conditions, or guarantee safety. Always follow your trust's policies and consult appropriate professionals for health concerns.",
  },

  seo: {
    homepage: {
      title: "Shiftlyx — AI Voice Shift Planner for NHS Workers | Voice Shift Planning",
      description:
        "Shiftlyx is the AI voice shift planner for NHS nurses and healthcare workers. Just say 'Hey Shiftlyx, plan my month' to build your rota, track fatigue, and coordinate with your partner. Join the waitlist.",
    },
    features: {
      title: "Shiftlyx Features — AI Voice Planner, Fatigue Score & Shift Strategies for UK Nurses",
      description:
        "Explore every Shiftlyx feature: AI Voice Planner (just speak to plan your month), Fatigue Score (0-100), 5 Shift Strategies, Partner Sync, Recovery Coach, and Preference Learning. The voice shift planning app built for tired healthcare workers.",
    },
    about: {
      title: "Why Shiftlyx — AI Voice Shift Planner Built by NHS Workers | Our Story",
      description:
        "Shiftlyx was built by NHS shift workers who couldn't find a tool that understood fatigue. The AI Voice Planner lets you speak naturally to plan your rota. Learn our story, philosophy, and privacy-first commitment.",
    },
    waitlist: {
      title: "Shiftlyx Waitlist — AI Voice Shift Planner for NHS Workers | Free Early Access",
      description:
        "Join the Shiftlyx waitlist for free early access. Try the AI Voice Shift Planner — just speak to plan your rota. Core app is free forever. Voice Planner and import/export at £0.89/month. For NHS nurses, paramedics, midwives, and all healthcare shift workers.",
    },
    blog: {
      title: "Shiftlyx Blog — Voice Shift Planning, Fatigue Tips & NHS Rota Guides",
      description:
        "Practical advice on voice shift planning, shift work fatigue, rota planning, night shift recovery, and NHS life. Learn how AI voice planning can help you build your ideal schedule without typing.",
    },
    download: {
      title: "Download Shiftlyx — Free AI Voice Shift Planner for iOS & Android",
      description:
        "Download Shiftlyx free on iOS and Android. Use the AI Voice Planner to build your rota by speaking — just say 'Hey Shiftlyx, plan my month'. Fatigue score, shift planner, partner sync — all included.",
    },
    privacy: {
      title: "Shiftlyx Privacy Policy — Your Data Stays Yours",
      description:
        "Shiftlyx never shares data with employers, never connects to NHS systems, and never sells your information. Read our full privacy commitment.",
    },
  },
};

export type SiteConfig = typeof siteConfig;
