"use client";

import { useEffect, useState, useRef } from "react";
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
  ChevronRight,
  Quote,
  Check,
  X,
  TrendingUp,
  Clock,
  Users,
  Baby,
  Sparkles,
  BarChart3,
  Zap,
  Layers,
  Banknote,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import FatigueGauge from "@/components/fatigue-gauge";
import IPhoneMockup from "@/components/iphone-mockup";
import ResearchQuote from "@/components/research-quote";
import { siteConfig } from "@/config/site";

const featureIcons: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-5 h-5" />,
  Mic: <Mic className="w-5 h-5" />,
  CalendarDays: <CalendarDays className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Rocket: <Rocket className="w-5 h-5" />,
};

const proFeatureIcons: Record<string, React.ReactNode> = {
  "Partner Sync (Premium)": <Users className="w-5 h-5" />,
  "Childcare-Aware": <Baby className="w-5 h-5" />,
  "Fatigue Intelligence": <Activity className="w-5 h-5" />,
  "Annual Leave Optimizer": <CalendarDays className="w-5 h-5" />,
  "AI Schedule Generation": <Sparkles className="w-5 h-5" />,
  "Income Forecasting": <Banknote className="w-5 h-5" />,
  "Smart Shift Stacking": <Layers className="w-5 h-5" />,
  "Candidate Comparison": <BarChart3 className="w-5 h-5" />,
};

const beforeAfter = {
  before: [
    "Exhausting shift patterns",
    "Broken recovery",
    "Poor work-life balance",
    "Wasted annual leave",
    "Constant rota frustration",
    "Opposite schedules with partner",
    "Childcare conflicts",
  ],
  after: [
    "Smarter schedules",
    "Better recovery blocks",
    "More shared time",
    "Reduced burnout risk",
    "Smarter leave planning",
    "Smarter decisions",
    "Better income visibility",
  ],
};

const proFeaturesList = [
  {
    icon: "AI Schedule Generation",
    title: "AI Schedule Generation",
    desc: "Just tell Shiftlyx your preferences. It generates optimised schedules based on recovery, fatigue, and work-life balance.",
  },
  {
    icon: "Fatigue Intelligence",
    title: "Fatigue Intelligence",
    desc: "Advanced risk analysis: burnout prediction, recovery analysis, night load tracking, and gap warnings.",
  },
  {
    icon: "Annual Leave Optimizer",
    title: "Annual Leave Optimizer",
    desc: "Turn small leave requests into longer recovery breaks. Leave extension planning and mini-holiday detection.",
  },
  {
    icon: "Childcare-Aware",
    title: "Childcare-Aware Planning",
    desc: "Plan around school runs, nursery pickups, and family commitments. Ensures one of you is always free for childcare.",
  },
  {
    icon: "Income Forecasting",
    title: "Income Forecasting",
    desc: "Estimate earnings across different rota strategies. See the £ impact of nights, weekends, and overtime before you choose.",
  },
  {
    icon: "Smart Shift Stacking",
    title: "Smart Shift Stacking",
    desc: "Group shifts to create longer uninterrupted recovery blocks. Instead of fragmented LD OFF LD OFF, get LD LD OFF OFF.",
  },
  {
    icon: "Candidate Comparison",
    title: "Candidate Comparison",
    desc: "Compare multiple schedule options side by side — earnings, fatigue score, days off, and nights worked at a glance.",
  },
];

const freeFeatures = [
  "Fatigue Score (0-100)",
  "Shift Planner (5 strategies)",
  
  "Recovery Coach",
  "Preference Learning",
];

const premiumFeatures = [
  "AI schedule generation",
  "Fatigue intelligence / advanced risk analysis",
  "Annual leave optimiser",
  "Childcare-aware planning",
  "Income forecasting",
  "Smart shift stacking",
  "Candidate comparison",
  "Import / Export",
];

function FeatureCard({ feature, index }: { feature: (typeof siteConfig.features)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/features#${feature.id}`} className="block group">
        <div className="relative p-6 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#2563eb]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 h-full">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] shrink-0 group-hover:bg-[#2563eb] group-hover:text-white transition-all duration-300">
              {featureIcons[feature.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-base font-semibold text-foreground mb-1 group-hover:text-[#2563eb] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">{feature.tagline} {feature.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94a3b8] mt-2 shrink-0 group-hover:text-[#2563eb] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const proRef = useRef(null);
  const proInView = useInView(proRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % siteConfig.researchQuotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = siteConfig.researchQuotes[quoteIndex];

  return (
    <div>
      {/* SEO H1 — visible to crawlers but hidden visually */}
      <h1 className="sr-only">
        Shiftlyx — Personal OS for Shift Workers: AI Voice Shift Planner, Fatigue Tracker &amp; Partner Sync (Premium)
      </h1>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eff6ff] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge variant="outline" className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
                  {siteConfig.hero.badge}
                </Badge>
              </motion.div>

              <motion.h2
                className="font-heading text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-bold tracking-tight text-foreground mb-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                &ldquo;<span className="text-[#2563eb]">Hey Shiftlyx,</span><br />
                plan my month.&rdquo;
              </motion.h2>

              <motion.p
                className="text-base text-[#6366f1] font-semibold mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                AI Shift Planner — Your shift, your app.
              </motion.p>

              <motion.p
                className="text-sm text-[#475569] font-medium mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
              >
                A smarter way to organise life around shift work.
              </motion.p>

              <motion.p
                className="text-lg text-[#475569] leading-relaxed mb-3 max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
              >
                Just speak. Shiftlyx listens, understands your preferences, and builds a smarter schedule that works around your life.
              </motion.p>

              <motion.p
                className="text-sm text-[#64748b] leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.26 }}
              >
                Fatigue tracking, partner sync, and AI-powered shift planning for shift workers. All in one app.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/download">
                  <Button size="lg" className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50">
                    Get Shiftlyx free →
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                className="text-sm text-[#94a3b8] italic mt-8 border-l-2 border-[#e2e8f0] pl-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {siteConfig.hero.the2amTest}
              </motion.p>
            </div>

            {/* Right */}
            <motion.div
              className="flex flex-col items-center gap-6 lg:gap-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <IPhoneMockup />
              <FatigueGauge score={42} size={200} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 1.5 How Voice Planning Works */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
              VOICE PLANNER
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Say it. Your schedule adjusts.
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              No menus. No forms. Just talk to Shiftlyx like you would a colleague.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B8CFF] via-[#7C5CFF] to-[#42C8FF] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] text-xs font-bold mb-3">
                1
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                Talk naturally
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                &ldquo;Hey Shiftlyx, plan my month. I&rsquo;m on nights first week, then I want a long weekend off.&rdquo; Just say it.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B8CFF] via-[#7C5CFF] to-[#42C8FF] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] text-xs font-bold mb-3">
                2
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                Gets you
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Powered by OpenAI Realtime Voice. Shiftlyx asks clarifying questions, remembers what you like, and learns from every conversation.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B8CFF] via-[#7C5CFF] to-[#42C8FF] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
                <CalendarDays className="w-7 h-7 text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#eff6ff] text-[#2563eb] text-xs font-bold mb-3">
                3
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                Plan is ready
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                &ldquo;I&rsquo;ve got enough to build your plan.&rdquo; Shiftlyx generates an optimised schedule and shows it instantly.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link href="/features">
              <Button variant="outline" className="text-[#2563eb] border-[#2563eb]/30 hover:bg-[#eff6ff]">
                See how voice planning works in detail →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Emotional Transformation: Before / After Shiftlyx */}
      <section className="py-20 lg:py-28 bg-white border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Before Shiftlyx.{" "}
              <span className="text-[#2563eb]">With Shiftlyx Premium.</span>
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              Same rota. Different outcome. See what changes when you take control.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Before */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-heading text-lg font-semibold text-[#ef4444] mb-6 flex items-center gap-2">
                <X className="w-5 h-5" /> BEFORE SHIFTLYX
              </h3>
              {beforeAfter.before.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#fef2f2] text-[#991b1b]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <X className="w-4 h-4 text-[#fca5a5] shrink-0" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* After */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-heading text-lg font-semibold text-[#16a34a] mb-6 flex items-center gap-2">
                <Check className="w-5 h-5" /> WITH SHIFTLYX PRO
              </h3>
              {beforeAfter.after.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#f0fdf4] text-[#166534]"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 + 0.2 }}
                >
                  <Check className="w-4 h-4 text-[#86efac] shrink-0" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Free Features Section */}
      <section ref={featuresRef} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 text-xs font-medium text-[#16a34a] border-[#16a34a]/20 bg-[#f0fdf4]">
              FREE — No subscription needed
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Shiftlyx is free to download and use.
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              Fatigue score, shift planner, and recovery coach — all included at no cost. Premium unlocks AI voice planning, fatigue intelligence, income forecasting, and more. From £3.99/month.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteConfig.features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pro Features Section */}
      <section ref={proRef} className="py-20 lg:py-28 bg-gradient-to-b from-[#f8fafc] to-white border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={proInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 text-xs font-medium text-[#f59e0b] border-[#f59e0b]/20 bg-amber-50">
              PREMIUM — From £3.99/month
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything in Free, plus shift intelligence.
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              Less than a hospital coffee. For the shifts that need another pair of eyes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {proFeaturesList.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={proInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#f59e0b]/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#f59e0b] mb-3">
                  {proFeatureIcons[feature.icon]}
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
              PRICING
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Less than a hospital coffee.
            </h2>
            <p className="text-[#475569] text-lg mb-10 max-w-xl mx-auto">
              Free core app forever. Premium from £3.99/month — or lock in Day One Annual at £18.99/year (60% off).
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-white border border-[#e2e8f0] text-left">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Free</h3>
              <p className="text-3xl font-bold text-foreground mb-6">£0</p>
              <p className="text-xs text-[#16a34a] font-medium mb-4">Free forever</p>
              <ul className="space-y-3">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                    <Check className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Day One Annual - Best Value */}
            <div className="p-8 rounded-2xl bg-[#2563eb] text-white text-left relative order-last md:order-none">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <Badge className="bg-[#16a34a] text-white border-0 text-xs font-semibold">BEST VALUE</Badge>
              </div>
              <h3 className="font-heading text-lg font-semibold mb-1">Day One Annual</h3>
              <p className="text-3xl font-bold mb-1">£18.99</p>
              <p className="text-sm text-blue-200 mb-1">/year</p>
              <p className="text-xs text-amber-300 font-medium mb-4">Save 60% — lock in your price today</p>
              <ul className="space-y-3">
                {premiumFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-blue-100">
                    <Check className="w-4 h-4 text-blue-300 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-blue-400/30">
                <p className="text-xs text-blue-200">✨ Free 1-month trial included</p>
              </div>
            </div>

            {/* Premium Monthly */}
            <div className="p-8 rounded-2xl bg-white border border-[#e2e8f0] text-left">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#f59e0b] text-white border-0 text-xs font-semibold">FLEXIBLE</Badge>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Monthly</h3>
              <p className="text-3xl font-bold text-foreground mb-1">£3.99</p>
              <p className="text-sm text-[#475569] mb-6">/month</p>
              <ul className="space-y-3">
                {premiumFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                    <Check className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Trust Section */}
      <section className="py-16 bg-[#f8fafc] border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground mb-2">Works alongside your rota</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Your hospital does not need to use Shiftlyx for you to benefit. It sits beside your existing system — yours alone.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground mb-2">Your data stays yours</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                No employer access. No NHS integration. No data selling. Your fatigue data is private by design.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground mb-2">Built by shift workers</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                We've worked nights. We know short turnarounds. We built Shiftlyx for the person we were at 3am after a double.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. Research Quote Section */}
      <section className="py-20 bg-white border-b border-[#e2e8f0]/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Quote className="w-5 h-5 text-[#2563eb]" />
            <span className="text-sm font-medium text-[#475569] uppercase tracking-wider text-xs">The Research</span>
          </div>

          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResearchQuote
              quote={currentQuote.quote}
              source={currentQuote.source}
              className="text-center border-l-0"
              variant="compact"
            />
          </motion.div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {siteConfig.researchQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === quoteIndex ? "bg-[#2563eb] w-6" : "bg-[#cbd5e1] hover:bg-[#94a3b8]"
                }`}
                aria-label={`Show quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Questions? We&apos;ve got answers.
            </h2>
            <p className="text-[#475569] text-lg">Everything you need to know about Shiftlyx.</p>
          </div>

          <Accordion className="space-y-2">
            {siteConfig.faq.map((item, i) => (
              <AccordionItem key={i} className="bg-white rounded-xl border border-[#e2e8f0] px-5">
                <AccordionTrigger className="text-left font-medium text-foreground py-4">{item.q}</AccordionTrigger>
                <AccordionContent className="text-[#475569] leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-20 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">Two minutes to your first fatigue score.</h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Get Shiftlyx free during early access — your Day One price is locked in.
          </p>
          <Link href="/waitlist">
            <Button size="lg" className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50">
              Take Control of Shift Work →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
