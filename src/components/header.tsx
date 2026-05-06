"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
              <img
                src="/app-icon.jpg"
                alt="Shiftlyx logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-heading text-lg font-bold text-foreground">
              Shiftlyx
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.nav.links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-[#2563eb] bg-[#eff6ff]"
                      : "text-[#475569] hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href={siteConfig.nav.cta.href}>
              <Button
                className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold shadow-lg shadow-amber-200/50"
                size="sm"
              >
                {siteConfig.nav.cta.label}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#475569] hover:text-foreground hover:bg-muted transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border/50 bg-background">
          <nav className="px-4 py-4 space-y-1">
            {siteConfig.nav.links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-[#2563eb] bg-[#eff6ff]"
                      : "text-[#475569] hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link href={siteConfig.nav.cta.href} onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold">
                  {siteConfig.nav.cta.label}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
