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
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13v4h-5v2h5v4l5-5z" />
              </svg>
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
