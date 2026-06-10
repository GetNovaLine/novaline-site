// Central config — swap these URLs as they change.
// PAYMENT LINKS are placeholders. Replace with your actual Stripe payment link URLs
// from https://dashboard.stripe.com/payment-links.

export const SITE = {
  name: "NovaLine",
  tagline: "+EV Player Prop Alerts",
  description:
    "Pinnacle no-vig devig methodology applied to US sportsbooks. Real-time Discord alerts for MLB, NBA, NHL player props.",
  domain: "getnovaline.com",
  url: "https://getnovaline.com",
  email: "getnovaline@gmail.com",
  twitter: "https://x.com/getnovaline",
};

export const PAYMENT_LINKS = {
  founder: "https://buy.stripe.com/28E00l52S23J2LB3PlbZe00",
  standard: "https://buy.stripe.com/dRmeVfcvkbEj99ZdpVbZe01",
};

// Auto-tracker — every alert that gets hearted in Telegram is appended live
// by the backend service (see betting-alerts/sheets_sync.py). The `gid=` param
// drops the visitor directly on the "Public Tracker" tab which hides internal
// columns (Pinnacle prices, dollar stakes) and shows units instead. If the
// link is changing again: GIDs come from sheets_sync._get_*_worksheet().id.
export const TRACKER_URL = "https://docs.google.com/spreadsheets/d/17t5nqamV9kEcI9rXGxM36ivvpoXnrtD7qC8gEJq-Hho/edit?usp=sharing&gid=1545678831#gid=1545678831";

// Fallback stats used if the auto-fetch from Google Sheets fails or env var isn't set.
// To enable auto-pull: set NEXT_PUBLIC_STATS_CSV_URL env var in Vercel to the published
// CSV URL of your Summary tab. See src/lib/stats.ts for parser details.
// To update manually: just change these numbers and commit.
export const STATS = {
  bets: 209,
  roi: 10.24,
  profit: 610,
  bankroll: 2300, // used only to compute units up — never displayed
  daysActive: 26,
};

export const BOOKS = [
  "DraftKings",
  "FanDuel",
  "BetMGM",
  "Caesars",
  "ESPN BET",
  "Fanatics",
];

export const SPORTS = ["MLB", "NBA", "NHL"];
