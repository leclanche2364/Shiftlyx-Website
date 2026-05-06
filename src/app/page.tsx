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

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof siteConfig.features)[0];
  index: number;
}) {
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
        <div className="relative p-6 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#2563eb]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] shrink-0 group-hover:bg-[#2563eb] group-hover:text-white transition-all duration-300">
              {featureIcons[feature.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-base font-semibold text-foreground mb-1 group-hover:text-[#2563eb] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                {feature.tagline} {feature.description}
              </p>
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

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % siteConfig.researchQuotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = siteConfig.researchQuotes[quoteIndex];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#eff6ff] via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge
                  variant="outline"
                  className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]"
                >
                  {siteConfig.hero.badge}
                </Badge>
              </motion.div>

              <motion.h1
                className="font-heading text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-bold tracking-tight text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {siteConfig.hero.headline.split("\n").map((line, i) => (
                  <span key={i}>
                    {i === 1 ? (
                      <>
                        <span className="gradient-text">{line}</span>
                        <br />
                      </>
                    ) : (
                      <>
                        {line}
                        <br />
                      </>
                    )}
                  </span>
                ))}
              </motion.h1>

              <motion.p
                className="text-lg text-[#475569] leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                dangerouslySetInnerHTML={{ __html: siteConfig.hero.subheadline }}
              />

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href={siteConfig.hero.cta.href}>
                  <Button
                    size="lg"
                    className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50"
                  >
                    {siteConfig.hero.cta.text}
                  </Button>
                </Link>
              </motion.div>

              {/* 2am Test line */}
              <motion.p
                className="text-sm text-[#94a3b8] italic mt-8 border-l-2 border-[#e2e8f0] pl-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {siteConfig.hero.the2amTest}
              </motion.p>
            </div>

            {/* Right Content - Gauge + iPhone */}
            <motion.div
              className="flex flex-col items-center gap-8 lg:gap-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Fatigue Score Gauge */}
              <FatigueGauge score={42} size={220} />

              {/* iPhone Mockup */}
              <IPhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section ref={featuresRef} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage shift work
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              Seven features. One rule: two taps or fewer to get what you need.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteConfig.features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Research Quote Section */}
      <section className="py-20 bg-[#f8fafc] border-y border-[#e2e8f0]/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Quote className="w-5 h-5 text-[#2563eb]" />
            <span className="text-sm font-medium text-[#475569] uppercase tracking-wider text-xs">
              The Research
            </span>
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

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {siteConfig.researchQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === quoteIndex
                    ? "bg-[#2563eb] w-6"
                    : "bg-[#cbd5e1] hover:bg-[#94a3b8]"
                }`}
                aria-label={`Show quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Questions? We&apos;ve got answers.
            </h2>
            <p className="text-[#475569] text-lg">
              Everything you need to know about Shiftlyx.
            </p>
          </div>

          <Accordion className="space-y-2">
            {siteConfig.faq.map((item, i) => (
              <AccordionItem key={i} className="bg-white rounded-xl border border-[#e2e8f0] px-5">
                <AccordionTrigger className="text-left font-medium text-foreground py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#475569] leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Two minutes to your first fatigue score.
          </h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Join the waitlist and be first to try Shiftlyx — free during early access.
          </p>
          <Link href="/waitlist">
            <Button
              size="lg"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-base px-8 shadow-lg shadow-amber-200/50"
            >
              Join the waitlist →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
