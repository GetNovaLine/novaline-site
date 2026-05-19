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
  twitter: "https://x.com/your_handle_here", // TODO: replace with actual handle URL
};

export const PAYMENT_LINKS = {
  founder: "https://buy.stripe.com/28E00l52S23J2LB3PlbZe00",
  standard: "https://buy.stripe.com/dRmeVfcvkbEj99ZdpVbZe01",
};

export const TRACKER_URL = "https://docs.google.com/spreadsheets/d/188qJpTJqy8753DCo1E04tfJu0-R4nC6XRCdoYSj06UQ/edit?usp=sharing"; // public bet tracker

export const STATS = {
  // Hardcoded for now — update manually as your tracker grows.
  // Later, could fetch live from the sheet via API.
  bets: 209,
  roi: 10.24,
  profit: 610,
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
