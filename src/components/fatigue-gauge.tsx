"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FatigueGaugeProps {
  score?: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export default function FatigueGauge({
  score = 52,
  size = 200,
  showLabel = true,
  className,
}: FatigueGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * 80; // r=80
  const maxScore = 100;
  const targetOffset = circumference - (score / maxScore) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);

    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s <= 30) return "#10b981"; // green
    if (s <= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getScoreLabel = (s: number) => {
    if (s <= 30) return "Low Fatigue";
    if (s <= 60) return "Moderate Fatigue";
    return "High Fatigue";
  };

  const getScoreLevel = (s: number) => {
    if (s <= 30) return { label: "Recovery-friendly", color: "#10b981" };
    if (s <= 60) return { label: "High demand", color: "#f59e0b" };
    return { label: "Critical strain", color: "#ef4444" };
  };

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const level = getScoreLevel(score);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          className="transform -rotate-90"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={scoreColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold font-heading"
            style={{ color: scoreColor }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          >
            {animatedScore}
          </motion.span>
          {showLabel && (
            <motion.span
              className="text-sm font-medium mt-1"
              style={{ color: scoreColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              {scoreLabel}
            </motion.span>
          )}
        </div>
      </div>

      {showLabel && (
        <motion.div
          className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: level.color }}
          />
          <span className="text-sm text-muted-foreground">
            Plan: <span className="font-medium text-foreground">{level.label}</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}
