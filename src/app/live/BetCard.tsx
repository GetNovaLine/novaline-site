// Single bet card for the /live page. Renders the bet's metadata + live status
// in a glanceable format — mobile-first, big status badge, color-coded.

import type { LiveBet, BetStatus } from "./types";

const STATUS_THEME: Record<BetStatus, { label: string; bg: string; text: string; ring: string }> = {
  HIT:      { label: "✅ HIT",      bg: "bg-strong/15",  text: "text-strong",  ring: "ring-strong/40" },
  LOST:     { label: "❌ LOST",     bg: "bg-weak/15",    text: "text-weak",    ring: "ring-weak/40" },
  TRACKING: { label: "🟢 TRACKING", bg: "bg-strong/10",  text: "text-strong",  ring: "ring-strong/30" },
  CLOSE:    { label: "👀 CLOSE",    bg: "bg-mixed/15",   text: "text-mixed",   ring: "ring-mixed/40" },
  NEUTRAL:  { label: "⏳ PRE-GAME", bg: "bg-card",       text: "text-muted",   ring: "ring-card-border" },
  DNP:      { label: "🚫 DNP",      bg: "bg-card",       text: "text-muted",   ring: "ring-card-border" },
};

function fmtOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function fmtStat(value: number | null): string {
  if (value === null || value === undefined) return "—";
  // Whole numbers display clean (no trailing .0)
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function fmtEV(ev: number): string {
  return `${(ev * 100).toFixed(1)}%`;
}

export default function BetCard({ bet }: { bet: LiveBet }) {
  const theme = STATUS_THEME[bet.status] ?? STATUS_THEME.NEUTRAL;
  const propLabel = `${bet.market} ${bet.side} ${bet.line}`;

  return (
    <article
      className={`rounded-2xl border border-card-border bg-card p-5 ring-1 ${theme.ring} transition-shadow hover:shadow-lg`}
    >
      {/* Header: sport + game + game state chip */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
            <span>{bet.sport}</span>
            <span className="text-card-border">•</span>
            <span className="truncate">{bet.game}</span>
          </div>
          <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-foreground">
            {bet.player}
          </h3>
          <div className="mt-0.5 text-sm text-muted">{propLabel}</div>
        </div>
        <div className="shrink-0 rounded-full border border-card-border bg-background px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted">
          {bet.game_state_short}
        </div>
      </div>

      {/* Status + current stat */}
      <div className={`mt-4 flex items-center justify-between rounded-xl ${theme.bg} px-4 py-3`}>
        <div className={`text-sm font-semibold ${theme.text}`}>{theme.label}</div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted">Current</div>
          <div className={`text-2xl font-bold tabular-nums ${theme.text}`}>
            {fmtStat(bet.current_stat)}
            <span className="ml-1 text-xs font-normal text-muted">/ {bet.line}</span>
          </div>
        </div>
      </div>

      {/* Bet meta footer */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted">Book</div>
          <div className="truncate font-medium">{bet.book}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted">Odds</div>
          <div className="font-mono font-medium">{fmtOdds(bet.odds)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted">EV</div>
          <div className="font-medium text-accent">{fmtEV(bet.ev)}</div>
        </div>
      </div>

      {bet.stake_units !== null && bet.stake_units > 0 && (
        <div className="mt-3 flex items-center justify-between border-t border-card-border pt-3 text-xs">
          <span className="text-muted">Stake</span>
          <span className="font-medium">{bet.stake_units.toFixed(2)}u</span>
        </div>
      )}
    </article>
  );
}
