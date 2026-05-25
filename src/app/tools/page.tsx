import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Brain, ChevronRight } from "lucide-react";

const tools = [
  {
    title: "Fatigue Score Validator",
    href: "/tools/fatigue-score-validator",
    icon: Activity,
    description:
      "Upload your NHS rota (photo or ICS) and get an instant fatigue score across four dimensions. Free, private, browser-based.",
    tag: "Free",
    color: "text-[#2563eb]",
    bg: "bg-[#eff6ff]",
    border: "border-[#2563eb]/20",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-[#eff6ff] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 text-xs font-medium text-[#2563eb] border-[#2563eb]/20 bg-[#eff6ff]">
            Tools
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Free tools for shift workers
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Practical utilities built from the Shiftlyx engine. No signup required.
            Everything runs in your browser or using lightweight APIs.
          </p>
        </div>
      </section>

      {/* Tool cards */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group block bg-white border border-[#e2e8f0] rounded-xl p-6 hover:border-[#2563eb]/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-semibold text-foreground text-lg">
                          {tool.title}
                        </h2>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium text-[#10b981] border-[#10b981]/20 bg-[#f0fdf4]"
                        >
                          {tool.tag}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#475569] leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#cbd5e1] group-hover:text-[#2563eb] group-hover:translate-x-0.5 transition-all mt-3 shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-[#94a3b8] mb-4">
              More tools coming soon — shift pattern generator, leave maximiser, and more.
            </p>
            <Link href="/download">
              <Button
                size="sm"
                variant="outline"
                className="font-medium"
              >
                Get the full app →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
