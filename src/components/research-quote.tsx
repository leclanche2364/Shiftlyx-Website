"use client";

import { cn } from "@/lib/utils";

interface ResearchQuoteProps {
  quote: string;
  source: string;
  className?: string;
  variant?: "default" | "compact";
}

export default function ResearchQuote({
  quote,
  source,
  className,
  variant = "default",
}: ResearchQuoteProps) {
  return (
    <blockquote
      className={cn(
        "relative border-l-2 border-[#2563eb] pl-6",
        variant === "compact" && "pl-4",
        className
      )}
    >
      <p
        className={cn(
          "text-[#475569] leading-relaxed italic",
          variant === "default" ? "text-base md:text-lg" : "text-sm"
        )}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <footer
        className={cn(
          "text-[#94a3b8] mt-2 not-italic font-medium",
          variant === "default" ? "text-sm" : "text-xs"
        )}
      >
        — {source}
      </footer>
    </blockquote>
  );
}
