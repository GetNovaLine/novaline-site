/**
 * Auto-pull stats from a published Google Sheets CSV.
 *
 * To enable:
 *   1. In Google Sheets: File → Share → Publish to web → pick your Summary tab → CSV format
 *   2. Copy the published CSV URL
 *   3. Set Vercel env var: NEXT_PUBLIC_STATS_CSV_URL = <that URL>
 *   4. Redeploy
 *
 * Without the env var (or if the fetch fails), falls back to hardcoded values in config.ts.
 *
 * The parser looks for labels (case-insensitive) and extracts the first numeric value:
 *   "Total bets settled" → stats.bets
 *   "ROI" → stats.roi (percentage)
 *   "Total profit" → stats.profit (dollars)
 *   "Days" → stats.daysActive
 *
 * Fetched values are cached for 1 hour at the Next.js layer (revalidate: 3600).
 */

import { STATS as FALLBACK } from "./config";

export type Stats = typeof FALLBACK;

export async function fetchStats(): Promise<Stats> {
  const url = process.env.NEXT_PUBLIC_STATS_CSV_URL;
  if (!url) return FALLBACK;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // refresh every hour
    });
    if (!res.ok) {
      console.error("Stats CSV fetch returned non-OK:", res.status);
      return FALLBACK;
    }
    const csv = await res.text();
    return parseCsv(csv);
  } catch (err) {
    console.error("Stats CSV fetch failed, using fallback:", err);
    return FALLBACK;
  }
}

function parseCsv(csv: string): Stats {
  const stats: Stats = { ...FALLBACK };
  const lines = csv.trim().split(/\r?\n/);

  for (const line of lines) {
    // Split on first comma only (in case values contain commas inside quotes)
    const idx = line.indexOf(",");
    if (idx < 0) continue;
    const rawLabel = line.slice(0, idx).trim();
    const rawValue = line.slice(idx + 1).trim();
    if (!rawLabel || !rawValue) continue;

    const label = rawLabel.replace(/^["']|["']$/g, "").toLowerCase();
    const valueStr = rawValue.replace(/^["']|["']$/g, "").replace(/[$,]/g, "");
    const value = parseFloat(valueStr);
    if (isNaN(value)) continue;

    if (label.includes("total bets") || label.includes("bets settled")) {
      stats.bets = Math.round(value);
    } else if (label === "roi" || label.includes(" roi") || label.includes("roi ")) {
      stats.roi = value;
    } else if (label.includes("total profit")) {
      stats.profit = Math.round(value);
    } else if (label.includes("days")) {
      stats.daysActive = Math.round(value);
    }
  }

  return stats;
}
