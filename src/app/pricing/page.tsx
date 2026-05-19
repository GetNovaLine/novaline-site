import { PAYMENT_LINKS, TRACKER_URL } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Founder access $25/month locked-in. Standard $45/month after first 10 founders.",
};

const features = [
  "Real-time Discord alerts (MLB, NBA, NHL player props)",
  "Edge Quality scoring (🟢 STRONG / 🟡 MIXED / 🔴 WEAK)",
  "Unit-sized stake recommendations (Kelly-based)",
  "All book lines on every alert (DK, FD, MGM, Caesars, ESPN BET, Fanatics)",
  "Pinnacle no-vig methodology built in",
  "Subscriber-only community channels",
  "Behind-the-scenes #my-picks channel (which alerts I personally take)",
  "Public bet tracker access — verify every claim",
];

export default function Pricing() {
  return (
    <>
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-5xl px-6 pb-12 pt-24 text-center md:pt-32">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Pricing</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Pay monthly. Cancel anytime. No refunds for partial months. Founder pricing is limited and locked-in for life.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Founder card */}
          <div className="relative rounded-2xl border border-accent/30 bg-card p-8 ring-1 ring-accent/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-background">
              Limited — 10 spots
            </div>
            <div className="text-sm font-medium uppercase tracking-widest text-accent">Founder</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">$25</span>
              <span className="text-muted">/month</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Locked-in for life. Even when standard pricing goes up, founders stay at $25/month forever.
            </p>
            <a
              href={PAYMENT_LINKS.founder}
              className="mt-6 block rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              Become a founder →
            </a>
            <div className="mt-8 h-px bg-card-border" />
            <ul className="mt-6 space-y-3 text-sm">
              {features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block text-accent">✓</span>
                  <span className="text-foreground">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Standard card */}
          <div className="rounded-2xl border border-card-border bg-card p-8">
            <div className="text-sm font-medium uppercase tracking-widest text-muted">Standard</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">$45</span>
              <span className="text-muted">/month</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Available once the first 10 founder spots are filled. Same features, standard rate.
            </p>
            <a
              href={PAYMENT_LINKS.standard}
              className="mt-6 block rounded-full border border-card-border bg-background px-6 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-muted"
            >
              Subscribe →
            </a>
            <div className="mt-8 h-px bg-card-border" />
            <ul className="mt-6 space-y-3 text-sm">
              {features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block text-muted">✓</span>
                  <span className="text-foreground">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust block */}
        <div className="mt-16 rounded-2xl border border-card-border bg-card p-8 text-center">
          <h3 className="text-lg font-semibold">Before you subscribe — verify the track record</h3>
          <p className="mt-2 text-sm text-muted">
            Every settled bet is in the public tracker: Pinnacle line, EV%, stake, result, running P/L. Updated daily.
          </p>
          <a
            href={TRACKER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full border border-card-border bg-background px-5 py-2 text-sm font-medium transition-colors hover:border-muted"
          >
            Open the tracker →
          </a>
        </div>

        {/* Reassurance */}
        <div className="mt-8 grid grid-cols-1 gap-4 text-center text-sm text-muted md:grid-cols-3">
          <div>
            <div className="font-medium text-foreground">Cancel anytime</div>
            <div className="mt-1">Stripe-hosted billing portal. One-click cancel.</div>
          </div>
          <div>
            <div className="font-medium text-foreground">Secure checkout</div>
            <div className="mt-1">Payments handled by Stripe. No card data touches our servers.</div>
          </div>
          <div>
            <div className="font-medium text-foreground">Real product</div>
            <div className="mt-1">Built and operated by an active +EV bettor, not a tout shop.</div>
          </div>
        </div>
      </section>
    </>
  );
}
