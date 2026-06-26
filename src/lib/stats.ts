/**
 * Auto-pull stats from a Google Sheets CSV export.
 *
 * To enable:
 *   1. Set Vercel env var NEXT_PUBLIC_STATS_CSV_URL to the export URL of the
 *      auto-tracker's Public Summary tab:
 *        https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=<TAB_GID>
 *      (sheet must be "Anyone with the link can view")
 *   2. Redeploy
 *
 * Without the env var (or if the fetch fails), falls back to hardcoded values in config.ts.
 *
 * The parser handles two value styles for "Total Profit":
 *   - Dollars: e.g. "$348"     → stats.profit (legacy Summary tab)
 *   - Units:   e.g. "+18.52u"  → stats.unitsUp directly (Public Summary tab — current)
 *
 * Label matches (case-insensitive substring):
 *   "Total bets settled" → stats.bets
 *   "ROI"                → stats.roi (percentage)
 *   "Total profit"       → stats.unitsUp OR stats.profit, depending on format
 *   "Bankroll"           → stats.bankroll
 *   "Days"               → stats.daysActive
 *
 * Fetched values are cached for 1 hour at the Next.js layer (revalidate: 3600).
 */

import { STATS as FALLBACK } from "./config";

export type Stats = typeof FALLBACK & { unitsUp: number };

function computeUnits(s: typeof FALLBACK & { unitsUp?: number }): number {
  // If the CSV gave us units directly (Public Summary tab), use it — keep
  // the decimal precision so the homepage can render "+18.52u" etc.
  if (typeof s.unitsUp === "number") return s.unitsUp;
  // Otherwise derive from dollar profit / bankroll (legacy Summary format).
  if (s.bankroll <= 0) return 0;
  return (s.profit / s.bankroll) * 100;
}

export async function fetchStats(): Promise<Stats> {
  const url = process.env.NEXT_PUBLIC_STATS_CSV_URL;
  if (!url) return { ...FALLBACK, unitsUp: computeUnits(FALLBACK) };

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // refresh every hour
    });
    if (!res.ok) {
      console.error("Stats CSV fetch returned non-OK:", res.status);
      return { ...FALLBACK, unitsUp: computeUnits(FALLBACK) };
    }
    const csv = await res.text();
    const parsed = parseCsv(csv);
    return { ...parsed, unitsUp: computeUnits(parsed) };
  } catch (err) {
    console.error("Stats CSV fetch failed, using fallback:", err);
    return { ...FALLBACK, unitsUp: computeUnits(FALLBACK) };
  }
}

function parseCsv(csv: string): typeof FALLBACK & { unitsUp?: number } {
  const stats: typeof FALLBACK & { unitsUp?: number } = { ...FALLBACK };
  const lines = csv.trim().split(/\r?\n/);

  for (const line of lines) {
    // Split on first comma only (in case values contain commas inside quotes)
    const idx = line.indexOf(",");
    if (idx < 0) continue;
    const rawLabel = line.slice(0, idx).trim();
    const rawValue = line.slice(idx + 1).trim();
    if (!rawLabel || !rawValue) continue;

    const label = rawLabel.replace(/^["']|["']$/g, "").toLowerCase();
    // Strip wrapping quotes + $ and , from the value; KEEP letters so we can
    // detect the "u" suffix marking unit-formatted profits.
    const valueStr = rawValue.replace(/^["']|["']$/g, "").replace(/[$,]/g, "");
    const value = parseFloat(valueStr);
    if (isNaN(value)) continue;

    if (label.includes("total bets") || label.includes("bets settled")) {
      stats.bets = Math.round(value);
    } else if (label.includes("roi")) {
      stats.roi = value;
    } else if (label.includes("total profit")) {
      // Detect Public Summary's unit format (e.g. "+18.52u") vs the legacy
      // dollar format. parseFloat truncates at the "u", so `value` is the
      // numeric units; we just need to route it to the right field.
      if (/u\s*$/i.test(valueStr)) {
        stats.unitsUp = value;
      } else {
        stats.profit = Math.round(value);
      }
    } else if (label.includes("bankroll")) {
      stats.bankroll = Math.round(value);
    } else if (label.includes("days")) {
      stats.daysActive = Math.round(value);
    }
  }

  return stats;
}
