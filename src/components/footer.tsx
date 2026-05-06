import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-[#f8fafc] mt-16">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563eb]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#2563eb] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13v4h-5v2h5v4l5-5z" />
                </svg>
              </div>
              <span className="font-heading text-base font-bold text-foreground">
                Shiftlyx
              </span>
            </Link>
            <p className="text-sm text-[#475569] leading-relaxed">
              {siteConfig.footer.tagline}
            </p>
          </div>

          {/* Link Columns */}
          {siteConfig.footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold text-foreground mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#475569] hover:text-[#2563eb] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/50 space-y-4">
          <p className="text-xs text-[#94a3b8] leading-relaxed max-w-3xl">
            {siteConfig.footer.disclaimer}
          </p>
          <p className="text-sm text-[#94a3b8]">
            {siteConfig.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
