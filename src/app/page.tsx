import Link from "next/link";
import { PAYMENT_LINKS, SITE, STATS, BOOKS, SPORTS, TRACKER_URL } from "@/lib/config";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-32 text-center md:pt-40">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-4 py-1.5 text-xs text-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Real-time +EV alerts via Discord
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Real edge.
            <br />
            <span className="text-accent">Real alerts.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted md:text-xl">
            We devig Pinnacle&apos;s no-vig lines and compare to US sportsbooks in real time.
            When a soft book drifts, you get the alert — with edge quality scoring built in.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              View pricing
            </Link>
            <a
              href={TRACKER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-card-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted"
            >
              See the tracker →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-card-border bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <Stat label="Bets settled" value={STATS.bets.toString()} />
            <Stat label="ROI" value={`${STATS.roi.toFixed(2)}%`} accent />
            <Stat label="Profit" value={`+$${STATS.profit.toLocaleString()}`} />
            <Stat label="Days tracked" value={STATS.daysActive.toString()} />
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            Live numbers from the{" "}
            <a href={TRACKER_URL} target="_blank" rel="noopener noreferrer" className="text-foreground underline">
              public bet tracker
            </a>
            . Updated daily.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-card-border">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              Three steps. No black boxes. Same methodology sharp bettors have used for decades — just automated and delivered to your phone.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Pull & devig Pinnacle"
              body="We pull live Pinnacle prices for every market on a refresh cycle. Multiplicative devig gives us the true probability — the sharpest signal the market has."
            />
            <Step
              number="02"
              title="Line shop US books"
              body={`We compare to ${BOOKS.join(", ")} on player props for ${SPORTS.join(", ")}. Best book per prop is identified automatically.`}
            />
            <Step
              number="03"
              title="Alert with edge quality"
              body="When EV is 5%+ you get an alert via Discord. Each alert is scored 🟢 STRONG / 🟡 MIXED / 🔴 WEAK based on whether other soft books agree with Pinnacle."
            />
          </div>
        </div>
      </section>

      {/* Edge quality teaser */}
      <section className="border-t border-card-border bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Not all <span className="text-accent">+EV is real edge</span>
              </h2>
              <p className="mt-4 text-muted">
                Sometimes Pinnacle is just stale and the rest of the market knows it. Every NovaLine alert is scored so you know whether you&apos;re looking at a slow soft book (real edge) or a Pinnacle hiccup (avoid).
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-strong" />
                  <span><span className="font-medium text-foreground">STRONG</span> <span className="text-muted">— other soft books agree with Pinnacle; one book is the outlier. Take it.</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-mixed" />
                  <span><span className="font-medium text-foreground">MIXED</span> <span className="text-muted">— signal is ambiguous. Size down or skip if EV is borderline.</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-weak" />
                  <span><span className="font-medium text-foreground">WEAK</span> <span className="text-muted">— soft books cluster against Pinnacle. Likely stale Pinnacle. Verify before betting.</span></span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <div className="text-xs text-muted">Example alert</div>
              <div className="mt-2 text-lg font-semibold">🔥 FIRE ALERT — Aaron Judge</div>
              <div className="mt-1 text-sm text-muted">Total Bases Over 1.5 · NYY @ BOS · MLB</div>
              <div className="my-4 h-px bg-card-border" />
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted">True Prob</div>
                  <div className="font-medium">56.2%</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Best Book</div>
                  <div className="font-medium">DraftKings +110</div>
                </div>
                <div>
                  <div className="text-xs text-muted">EV</div>
                  <div className="font-medium text-accent">8.7%</div>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-strong/30 bg-strong/5 p-3">
                <div className="text-sm font-medium text-strong">🟢 Edge Quality: STRONG</div>
                <div className="mt-1 text-xs text-muted">Best book outlier: 3.1% from soft median · Consensus gap: 0.9%</div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-muted">Recommended:</span>{" "}
                <span className="font-medium">2.5 units</span>{" "}
                <span className="text-xs text-muted">(0.375× Kelly)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Founder access opening now
          </h2>
          <p className="mt-4 text-muted">
            First 10 subscribers get locked-in pricing at $25/month — for life. Standard rate is $45/month after.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PAYMENT_LINKS.founder}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              Become a founder — $25/mo
            </a>
            <Link
              href="/pricing"
              className="rounded-full border border-card-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted"
            >
              See all plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-semibold tracking-tight md:text-4xl ${accent ? "text-accent" : "text-foreground"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted">{label}</div>
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6">
      <div className="text-xs font-mono text-accent">{number}</div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}
