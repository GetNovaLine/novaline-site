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

// Quote-aware split of one CSV line into fields.
function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function parseCsv(csv: string): typeof FALLBACK & { unitsUp?: number } {
  const stats: typeof FALLBACK & { unitsUp?: number } = { ...FALLBACK };
  const lines = csv.trim().split(/\r?\n/);

  for (const line of lines) {
    // Only columns A (label) and B (value) matter. The tab also carries the
    // CLV sparkline's hidden helper data in D:E (a date on every row), which
    // must not bleed into the value — "Days,0,,,8/27" is 0 days, not 8.
    const [rawLabel = "", rawValue = ""] = splitCsvLine(line).map((f) => f.trim());
    if (!rawLabel || !rawValue) continue;

    const label = rawLabel.toLowerCase();
    // Strip $ and thousands separators; KEEP letters so we can detect the
    // "u" suffix marking unit-formatted profits.
    const valueStr = rawValue.replace(/[$,]/g, "");
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
