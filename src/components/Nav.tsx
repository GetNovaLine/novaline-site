import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Image src="/logo.png" alt="NovaLine" width={28} height={28} className="rounded-md" priority />
          {SITE.name}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/pricing"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Subscribe
        </Link>
      </div>
    </header>
  );
}
