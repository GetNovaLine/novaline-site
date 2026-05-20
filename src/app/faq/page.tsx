import type { Metadata } from "next";
import Link from "next/link";
import FAQItem from "@/components/FAQItem";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about NovaLine — methodology, expected ROI, books, limits, and more.",
};

const faqs = [
  {
    q: "What's the expected ROI?",
    a: "Long-term 5-10% ROI is realistic for disciplined +EV betting on player props. Variance is real — losing streaks happen even with edge. Don't expect to win every day or every week. The verified track record (linked from every page) is the honest data.",
  },
  {
    q: "How does the methodology work?",
    a: "We pull Pinnacle's no-vig probability per market on a refresh cycle, then compare to US sportsbook prices. When a soft book offers 5%+ EV over Pinnacle's true probability, you get a Discord alert. Each alert is scored for edge quality (STRONG/MIXED/WEAK) based on whether other books agree with Pinnacle.",
  },
  {
    q: "What sports and markets are covered?",
    a: "MLB pitcher props (strikeouts, outs, earned runs, hits allowed) and batter total bases. NBA player props (points, assists, rebounds, threes). NHL player props (points, assists, shots on goal, goalie saves).",
  },
  {
    q: "How does the founder pricing work?",
    a: "First 10 subscribers pay $25/month forever — even after standard pricing rises. Permanent founder rate. Once those 10 spots are filled, new subscribers pay the $45/month standard rate.",
  },
  {
    q: "Do I need accounts at every sportsbook?",
    a: "No, but more books = more chances at the best price. Minimum recommended: DraftKings, FanDuel, BetMGM. Caesars, ESPN BET, and Fanatics add additional coverage.",
  },
  {
    q: "Will the sportsbooks limit my account?",
    a: "Eventually, yes. All sharp +EV bettors get limited at US books over time — that's the nature of the market. Strategies to delay limits (spreading action across books, varying stake sizes, occasional recreational bets for camouflage) are shared in the subscriber-only methodology channel.",
  },
  {
    q: "How often are alerts sent?",
    a: "Refreshes happen on a schedule. Average 0-5 alerts per day depending on what edges are available. Slow days happen. So do days with 8+ alerts during peak MLB season.",
  },
  {
    q: "What if I miss an alert?",
    a: "By the time you see it, the line may have moved — that's the nature of sharp betting. Always check the current line at your book before placing. If the EV is gone, skip.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, anytime. Cancellation is handled via Stripe's billing portal — one click. No contracts, no commitment.",
  },
  {
    q: "How is my bankroll handled?",
    a: "Your bankroll stays private. Alerts show stake recommendations in 'units' (1 unit = 1% of your bankroll) so you can apply the sizing to whatever bankroll you actually have. We recommend starting at 1/4 Kelly until you trust the system, then graduating to 3/8 if you're comfortable.",
  },
  {
    q: "Is this gambling advice?",
    a: "No. This is sports market data analysis for informational and educational purposes only. Past performance does not predict future results. You are responsible for your own betting decisions. Must be 21+ and bet only in jurisdictions where it's legal.",
  },
  {
    q: "Who runs NovaLine?",
    a: "An active +EV bettor with a verified track record. Public bet tracker is updated daily. Methodology is fully transparent — no black boxes, no proprietary mystery models. If you want to verify edge claims, every settled bet is in the spreadsheet.",
  },
];

export default function FAQ() {
  return (
    <>
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-24 text-center md:pt-32">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">FAQ</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Common questions, honest answers. Anything not covered? Email {SITE.email}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-card-border bg-card p-8 text-center">
          <h3 className="text-xl font-semibold">Still have questions?</h3>
          <p className="mt-2 text-sm text-muted">
            Reach out before you subscribe. Better to ask than be surprised.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${SITE.email}`}
              className="rounded-full border border-card-border bg-background px-5 py-2 text-sm font-medium transition-colors hover:border-muted"
            >
              Email us
            </a>
            <Link
              href="/pricing"
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              See pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
