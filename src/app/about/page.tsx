import Link from "next/link";
import type { Metadata } from "next";
import { BOOKS, SPORTS, TRACKER_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "How it works",
  description: "The methodology behind NovaLine: Pinnacle no-vig devig, US sportsbook line shopping, and edge quality scoring.",
};

export default function About() {
  return (
    <>
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-24 text-center md:pt-32">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">How it works</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            No black box, no proprietary mystery models. Just the methodology sharp bettors have used for decades, automated and delivered to your phone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        {/* Step 1 */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">STEP 01</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Pull Pinnacle&apos;s no-vig probability</h2>
          <p className="mt-4 text-muted">
            Pinnacle is widely regarded as the sharpest sportsbook in the world. They accept large action from professional bettors and adjust quickly. Their lines incorporate sharp money — making their no-vig (devigged) probability the closest thing to true probability the market has.
          </p>
          <p className="mt-3 text-muted">
            We pull Pinnacle&apos;s live odds for every supported player prop on a refresh cycle and apply multiplicative devig to get the implied true probability for each side.
          </p>
        </article>

        {/* Step 2 */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">STEP 02</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Compare to US sportsbooks</h2>
          <p className="mt-4 text-muted">
            For every prop, we compare Pinnacle&apos;s true probability to the offered prices at {BOOKS.join(", ")}. The book offering the best (most generous) price relative to true probability is identified automatically.
          </p>
          <p className="mt-3 text-muted">
            Supported sports: {SPORTS.join(", ")}. Player prop markets only — pitcher stats, batter total bases, player points/assists/rebounds/threes, shots on goal, goalie saves.
          </p>
        </article>

        {/* Step 3 */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">STEP 03</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Alert with edge quality scoring</h2>
          <p className="mt-4 text-muted">
            When the best soft-book price implies a 5%+ edge over Pinnacle&apos;s true probability, you get a Discord alert. 8%+ EV gets a 🔥 fire alert.
          </p>
          <p className="mt-3 text-muted">
            Every alert is scored with an <strong className="text-foreground">Edge Quality tier</strong> based on whether other soft books agree with Pinnacle or cluster against it:
          </p>
          <div className="mt-6 space-y-3">
            <div className="rounded-lg border border-strong/30 bg-strong/5 p-4">
              <div className="font-medium text-strong">🟢 STRONG</div>
              <div className="mt-1 text-sm text-muted">
                Other soft books align with Pinnacle. Best book is the clear outlier. This is real edge — one book is slow.
              </div>
            </div>
            <div className="rounded-lg border border-mixed/30 bg-mixed/5 p-4">
              <div className="font-medium text-mixed">🟡 MIXED</div>
              <div className="mt-1 text-sm text-muted">
                Signals are ambiguous. Take with a smaller stake or skip if EV is borderline.
              </div>
            </div>
            <div className="rounded-lg border border-weak/30 bg-weak/5 p-4">
              <div className="font-medium text-weak">🔴 WEAK</div>
              <div className="mt-1 text-sm text-muted">
                Soft books cluster against Pinnacle — likely a stale Pinnacle line. Verify current prices before betting.
              </div>
            </div>
          </div>
        </article>

        {/* Sizing */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">SIZING</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Fractional Kelly with hard caps</h2>
          <p className="mt-4 text-muted">
            Every alert includes a recommended stake sized using fractional Kelly (currently 3/8 Kelly). The stake is shown in <strong className="text-foreground">units</strong> — where 1 unit = 1% of your bankroll — so you can apply it to any bankroll size.
          </p>
          <p className="mt-3 text-muted">
            All recommendations are capped at 5% of bankroll per bet to limit single-bet variance. You can always size smaller if you want.
          </p>
        </article>

        {/* Why */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">WHY THIS WORKS</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Soft books are slow. Pinnacle is fast.</h2>
          <p className="mt-4 text-muted">
            US sportsbooks make most of their money from recreational bettors. They&apos;re optimized for handle, not for pricing efficiency. When news breaks, lineups confirm, or sharp action hits Pinnacle, US books often take minutes to hours to catch up.
          </p>
          <p className="mt-3 text-muted">
            That delta is your edge. NovaLine just makes it visible the moment it appears.
          </p>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-card-border bg-card p-8 text-center">
          <h3 className="text-xl font-semibold">See the methodology in action</h3>
          <p className="mt-2 text-sm text-muted">
            Every alert that&apos;s ever fired (with Pinnacle line, EV, stake, result) is in the public bet tracker.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={TRACKER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-card-border bg-background px-5 py-2 text-sm font-medium transition-colors hover:border-muted"
            >
              Open the tracker
            </a>
            <Link
              href="/pricing"
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              View pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
