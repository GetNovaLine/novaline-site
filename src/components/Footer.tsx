import Link from "next/link";
import { SITE, TRACKER_URL } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              {SITE.name}
            </Link>
            <p className="mt-3 text-sm text-muted">{SITE.tagline}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/about" className="hover:text-foreground">How it works</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Track Record</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a href={TRACKER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  Public bet tracker
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-foreground">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  Twitter / X
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-card-border pt-6 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} {SITE.name}. For analytical and informational purposes only. Past performance does not predict future results. Bet responsibly. 21+.
          </p>
        </div>
      </div>
    </footer>
  );
}
