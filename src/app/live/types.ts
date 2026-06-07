// Shared types for the /live page. Mirrors the JSON shape returned by
// /api/live (which proxies from the FastAPI backend on Hetzner).

export type BetStatus =
  | "HIT"
  | "LOST"
  | "TRACKING"
  | "CLOSE"
  | "NEUTRAL"
  | "DNP"
  // Final-result states — set after the bet is graded. Card renders a result
  // overlay instead of live progress.
  | "FINAL_WIN"
  | "FINAL_LOSS"
  | "FINAL_PUSH"
  | "FINAL_VOID";

export type BetResult = "win" | "loss" | "push" | "void" | null;

export interface LiveBet {
  id: number;
  sport: string;          // "MLB", "NHL", "NBA", "WNBA"
  sport_key: string;      // raw key, e.g. "basketball_nba"
  game: string;           // "Yankees @ Red Sox"
  player: string;
  market: string;         // human-friendly: "Total Bases", "Strikeouts"
  side: "Over" | "Under";
  line: number;
  book: string;
  odds: number;           // American format, e.g. +155 or -110
  ev: number;             // decimal, e.g. 0.068 == 6.8%
  true_prob: number;
  edge_quality: string;   // "STRONG" | "MIXED" | "WEAK" | ""
  commence_time: string;
  stake_units: number | null;

  current_stat: number | null;
  status: BetStatus;
  game_state: string;       // "5th · top" / "Final" / "Pre-Game"
  game_state_short: string; // "5th" / "Final" / "PRE"
  pace_projection: number | null;
  last_updated: string | null;

  // Set after the bet is graded; null while live.
  settled: boolean;
  result: BetResult;
  final_stat: number | null;
  net_units: number | null;
}

export interface LiveApiResponse {
  served_at: string;
  bet_count: number;
  bets: LiveBet[];
  error?: string;
}
