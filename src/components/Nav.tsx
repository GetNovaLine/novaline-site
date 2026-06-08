"use client";

// Site nav. Desktop: horizontal links. Mobile: hamburger that opens a slide-down
// panel below the header. Auto-closes on link click + Escape key.

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live", live: true },
  { href: "/about", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu whenever the route changes (covers link-clicks).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape key — common pattern, makes the panel feel correct.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Image
            src="/logo.png"
            alt="NovaLine"
            width={28}
            height={28}
            className="rounded-md"
            priority
          />
          {SITE.name}
        </Link>

        {/* Desktop nav (md+) */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  isActive ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {link.live && (
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-strong"
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right-side controls */}
        <div className="flex items-center gap-2">
          {/* Subscribe button — always visible as the primary CTA */}
          <Link
            href="/pricing"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Subscribe
          </Link>

          {/* Hamburger toggle — mobile only */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((o) => !o)}
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-card md:hidden"
          >
            {open ? (
              // Close (X) icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M3 5.5a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 5.5zM3 10a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10zM3 14.5a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drop-down panel — slides open below the header.
          Uses max-height transition (vs. display:none) so we get a smooth animation. */}
      <div
        id="mobile-nav-panel"
        className={`overflow-hidden border-t border-card-border bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-200 md:hidden ${
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-6 py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 border-b border-card-border/60 py-4 text-base last:border-b-0 ${
                  isActive ? "text-foreground" : "text-muted"
                }`}
              >
                {link.live && (
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 animate-pulse rounded-full bg-strong"
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
