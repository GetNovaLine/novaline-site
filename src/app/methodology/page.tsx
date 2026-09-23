import Link from "next/link";
import type { Metadata } from "next";
import { TRACKER_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Methodology — the exact math",
  description:
    "The devigging formula, threshold logic, edge quality classifier, and Kelly sizing used to generate every NovaLine alert. Nothing hidden.",
};

export default function Methodology() {
  return (
    <>
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-24 text-center md:pt-32">
          <div className="text-xs font-mono text-accent">METHODOLOGY</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            The exact math behind every alert
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Every OddsJam competitor calls their approach &ldquo;proprietary.&rdquo; Ours isn&rsquo;t. Here&rsquo;s the
            full pipeline, formulas included. If you&rsquo;re quant-minded and want to verify
            the edge for yourself, this is your page.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        {/* 1. Devigging */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">01 · DEVIGGING</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Multiplicative devig against Pinnacle
          </h2>
          <p className="mt-4 text-muted">
            Pinnacle is the only sportsbook that welcomes sharp action and adjusts lines
            based on it. Their prices bake in the wisdom of professional bettors. Their
            hold is 2-3% on game lines and 4-6% on player props — the tightest in the
            industry.
          </p>
          <p className="mt-3 text-muted">
            For each market, we take Pinnacle&rsquo;s two-way (or three-way for soccer)
            prices and strip out the vig using the <strong className="text-foreground">multiplicative
            method</strong>:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-card-border bg-card p-4 font-mono text-sm">
{`# Two-way (totals, spreads, player props)
p_over  = implied_prob(over_odds)
p_under = implied_prob(under_odds)
overround = p_over + p_under
true_p_over  = p_over  / overround
true_p_under = p_under / overround

# Three-way (soccer moneyline w/ draw)
p_home, p_draw, p_away = implied_probs(...)
overround = p_home + p_draw + p_away
true_p_home = p_home / overround
# ... etc`}
          </pre>
          <p className="mt-3 text-sm text-muted">
            We use multiplicative over the power method because Pinnacle&rsquo;s hold is
            symmetric across sides — there&rsquo;s no evidence favorites/dogs need asymmetric
            treatment on their book. Every serious quant devig library confirms this
            choice for symmetric-vig sharps.
          </p>
        </article>

        {/* 2. Comparison */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">02 · COMPARISON</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">12-book price scan</h2>
          <p className="mt-4 text-muted">
            For every prop Pinnacle prices, we scan the same prop across 12 books:
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["DraftKings", "FanDuel", "BetMGM", "Fanatics", "Caesars", "ESPN BET",
              "Hard Rock", "BetRivers", "Bally Bet", "BetOnline", "LowVig", "ProphetX"].map(
              (b) => (
                <div key={b} className="rounded-md border border-card-border bg-card/50 px-3 py-2 text-sm">
                  {b}
                </div>
              )
            )}
          </div>
          <p className="mt-4 text-muted">
            EV per bet is computed as{" "}
            <code className="rounded bg-card px-1.5 py-0.5 font-mono text-sm">EV = true_prob × (decimal_odds - 1) - (1 - true_prob)</code>
            {" "}per $1 stake. The book with the highest EV wins the alert.
          </p>
          <p className="mt-3 text-muted">
            <strong className="text-foreground">ProphetX</strong> is a peer-to-peer exchange included
            because they don&rsquo;t limit sharp bettors — the whole point.
          </p>
        </article>

        {/* 3. Thresholds */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">03 · THRESHOLDS</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Per-market EV cutoffs</h2>
          <p className="mt-4 text-muted">
            A single global threshold is lazy. Different market types have different vig
            profiles and different variance, so we use per-class thresholds:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="pb-3 pr-4 font-medium">Market class</th>
                  <th className="pb-3 pr-4 font-medium">Threshold</th>
                  <th className="pb-3 font-medium">Reasoning</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-b border-card-border/50">
                  <td className="py-3 pr-4">Game lines (h2h, totals, spreads, team totals, BTTS)</td>
                  <td className="py-3 pr-4 font-mono">1.0%</td>
                  <td className="py-3">Pinnacle hold is 2-3%, so devig noise floor is low. Real edges cluster in 1-3% band.</td>
                </tr>
                <tr className="border-b border-card-border/50">
                  <td className="py-3 pr-4">Standard player props (K&rsquo;s, points, TB, rebounds, etc.)</td>
                  <td className="py-3 pr-4 font-mono">3.0%</td>
                  <td className="py-3">Wider Pinnacle hold + higher single-bet variance justifies a stricter cutoff.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Home run props (specifically)</td>
                  <td className="py-3 pr-4 font-mono">5.0%</td>
                  <td className="py-3">Long odds + low base rate = brutal variance. Only worth taking above 5% EV.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            🔥 <strong className="text-foreground">FIRE tier</strong> triggers at 8%+ EV on any market — separate visual
            label + routed to a dedicated Discord channel.
          </p>
        </article>

        {/* 4. Edge quality */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">04 · EDGE QUALITY</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Outlier detection vs. soft-book consensus
          </h2>
          <p className="mt-4 text-muted">
            Not all +EV alerts are equal. A soft book at +150 while every other US book is
            at −140 is a real outlier (probably slow to update). One at +150 while others
            are at +145 could just be book variance.
          </p>
          <p className="mt-3 text-muted">
            For every alert, we compute the best-book&rsquo;s implied probability distance from
            the median of the other soft books (excluding Pinnacle), then classify:
          </p>
          <div className="mt-6 space-y-3">
            <div className="rounded-lg border border-strong/30 bg-strong/5 p-4">
              <div className="font-medium text-strong">🟢 STRONG (&gt;2% distance)</div>
              <div className="mt-1 text-sm text-muted">
                Best book clearly disagrees with the market. Highest-conviction edge.
              </div>
            </div>
            <div className="rounded-lg border border-mixed/30 bg-mixed/5 p-4">
              <div className="font-medium text-mixed">🟡 MIXED (1-2% distance)</div>
              <div className="mt-1 text-sm text-muted">
                Modest outlier. Take smaller stake or skip if EV borderline.
              </div>
            </div>
            <div className="rounded-lg border border-weak/30 bg-weak/5 p-4">
              <div className="font-medium text-weak">🔴 WEAK (&lt;1% distance)</div>
              <div className="mt-1 text-sm text-muted">
                Best book hugs consensus. Edge might be a stale Pinnacle line — verify before betting.
              </div>
            </div>
          </div>
        </article>

        {/* 5. Kelly sizing */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">05 · SIZING</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Fractional Kelly, capped at 2 units
          </h2>
          <p className="mt-4 text-muted">
            Kelly criterion assumes your <code className="rounded bg-card px-1.5 py-0.5 font-mono text-sm">true_prob</code>
            {" "}estimate is exactly right. Reality has estimation noise, so we bet a fixed
            fraction of full Kelly and cap every bet. Edge quality tier doesn&rsquo;t change the size:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-card-border bg-card p-4 font-mono text-sm">
{`bankroll      = 100u         # 1 unit = 1% of bankroll
kelly_frac    = 0.375        # 3/8 Kelly (conservative default)
max_units     = 2u           # hard cap on every bet

stake = bankroll * full_kelly * kelly_frac
stake = min(stake, max_units)   # rounded to the nearest 0.25u`}
          </pre>
          <p className="mt-3 text-muted">
            Stakes shown in units where <strong className="text-foreground">1 unit = 1% of bankroll</strong>,
            so any subscriber can apply the sizing to any bankroll.
          </p>
        </article>

        {/* 6. Hedging */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">06 · HEDGING</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Auto-hedge calculation on FIRE alerts
          </h2>
          <p className="mt-4 text-muted">
            When an alert triggers at 8%+ EV on a 2-way market, we automatically check
            whether the opposite side is available at another book at odds that allow
            arbitrage. If yes, the alert includes the exact hedge stake to lock in a
            guaranteed profit regardless of outcome:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-card-border bg-card p-4 font-mono text-sm">
{`# Original bet: stake S at decimal odds d
# Hedge:        stake H at decimal odds e (opposite side)

H = S * d / e
guaranteed_profit = S * (d - 1) - H`}
          </pre>
          <p className="mt-3 text-sm text-muted">
            No arb possible → the hedge suggestion is omitted rather than recommending a
            locked loss. Only shown when the math works.
          </p>
        </article>

        {/* 7. CLV */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">07 · EVALUATION</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            CLV is the only real leading indicator
          </h2>
          <p className="mt-4 text-muted">
            Win/loss over a small sample is variance, not skill. The real proof a betting
            system works is <strong className="text-foreground">Closing Line Value</strong>: did you
            get better odds than the closing price? Sharp bettors evaluate systems by CLV
            because it converges to true EV faster than P/L does.
          </p>
          <p className="mt-3 text-muted">
            Every NovaLine alert has its closing Pinnacle price captured 5 minutes before
            first pitch/tip-off/opening bell. We track:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-muted">
            <li>
              <strong className="text-foreground">Average CLV %</strong> — how much better our entry
              was vs. the close, averaged across all bets
            </li>
            <li>
              <strong className="text-foreground">Beat-close rate</strong> — % of bets where our entry
              odds beat the closing odds
            </li>
            <li>
              <strong className="text-foreground">30-day CLV trend</strong> — live sparkline on the
              public tracker so you can see if CLV is drifting up or down over time
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted">
            Sharp tracking apps like Pikkit report CLV in the same way. Our numbers align
            when subscribers sync alerts into their Pikkit accounts — verifiable third-party
            proof of edge.
          </p>
        </article>

        {/* 8. Honest limitations */}
        <article className="mb-16">
          <div className="text-xs font-mono text-accent">08 · HONEST LIMITATIONS</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">What we can&rsquo;t do</h2>
          <p className="mt-4 text-muted">
            Every methodology page should include what the system does NOT do. Ours:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-muted">
            <li>
              <strong className="text-foreground">Markets Pinnacle doesn&rsquo;t price</strong> — batter
              hits, RBIs, runs scored, singles, doubles, triples aren&rsquo;t exposed by Pinnacle
              via our data source. We can&rsquo;t devig them, so we don&rsquo;t alert on them.
            </li>
            <li>
              <strong className="text-foreground">Futures / season-long markets</strong> — different
              market shape than daily props. Not currently supported.
            </li>
            <li>
              <strong className="text-foreground">Same-game parlays</strong> — correlated outcomes
              require a completely different model. Not offered.
            </li>
            <li>
              <strong className="text-foreground">Book limits</strong> — we can find edges but we
              can&rsquo;t place bets for you or prevent DraftKings from capping your stake to
              $5. That&rsquo;s why ProphetX (an exchange that doesn&rsquo;t limit) is in our book list.
            </li>
            <li>
              <strong className="text-foreground">Backtesting the specific strategy</strong> — we track
              live CLV going forward but don&rsquo;t claim retrospective returns from a
              backtest. Real trading data only.
            </li>
          </ul>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-card-border bg-card p-8 text-center">
          <h3 className="text-xl font-semibold">See every alert we&rsquo;ve ever fired</h3>
          <p className="mt-2 text-sm text-muted">
            The public tracker auto-updates every 5 minutes. Every bet, every result,
            every CLV number — fully public, nothing hidden.
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
