"use client";

// Client component for the /live page. Polls /api/live every 30s and renders
// bet cards in a responsive grid, filterable by sport. Shows a "last updated
// N seconds ago" chip so viewers can tell at a glance how fresh the data is.

import { useEffect, useMemo, useState } from "react";
import BetCard from "./BetCard";
import type { LiveApiResponse, LiveBet, BetStatus } from "./types";

const POLL_INTERVAL_MS = 30_000;

// Status sort order: live action first, finals at the bottom. This keeps the
// most interesting cards above the fold when multiple bets are visible.
const STATUS_RANK: Record<BetStatus, number> = {
  CLOSE: 0,
  TRACKING: 1,
  HIT: 2,
  LOST: 3,
  NEUTRAL: 4,
  DNP: 5,
  FINAL_WIN: 6,
  FINAL_LOSS: 7,
  FINAL_PUSH: 8,
  FINAL_VOID: 9,
};

type SportFilter = "ALL" | "MLB" | "NBA" | "WNBA" | "NHL";
const FILTERS: SportFilter[] = ["ALL", "MLB", "NBA", "WNBA", "NHL"];

export default function LiveTracker() {
  const [data, setData] = useState<LiveApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(Date.now());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [activeFilter, setActiveFilter] = useState<SportFilter>("ALL");

  // Fetch once on mount + on a timer
  useEffect(() => {
    let cancelled = false;
    async function fetchOnce() {
      try {
        const res = await fetch("/api/live", { cache: "no-store" });
        const json: LiveApiResponse = await res.json();
        if (cancelled) return;
        setData(json);
        setError(json.error ?? null);
        setLastFetch(Date.now());
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "fetch failed");
      }
    }
    fetchOnce();
    const id = setInterval(fetchOnce, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Update the "N seconds ago" counter every second without re-fetching
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastFetch) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [lastFetch]);

  const allBets = data?.bets ?? [];

  // Count bets per sport for filter chip badges. Computed once from the full
  // list so toggling a filter doesn't change the badge counts.
  const countsBySport = useMemo(() => {
    const counts: Record<SportFilter, number> = { ALL: allBets.length, MLB: 0, NBA: 0, WNBA: 0, NHL: 0 };
    for (const b of allBets) {
      if (b.sport === "MLB" || b.sport === "NBA" || b.sport === "WNBA" || b.sport === "NHL") {
        counts[b.sport] += 1;
      }
    }
    return counts;
  }, [allBets]);

  // Filter + sort the visible bets each render
  const visibleBets = useMemo(() => {
    const filtered =
      activeFilter === "ALL" ? allBets : allBets.filter((b) => b.sport === activeFilter);
    return [...filtered].sort((a, b) => {
      const ra = STATUS_RANK[a.status] ?? 99;
      const rb = STATUS_RANK[b.status] ?? 99;
      if (ra !== rb) return ra - rb;
      // Within the same status, earlier-tip games first.
      return a.commence_time.localeCompare(b.commence_time);
    });
  }, [allBets, activeFilter]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Live <span className="text-accent">tracker</span>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Every active NovaLine bet, tracked in real time. Updates every 30 seconds.
          </p>
        </div>
        <div className="shrink-0 text-right text-xs text-muted">
          <div className="flex items-center justify-end gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-strong" />
            <span>Live</span>
          </div>
          <div className="mt-1 tabular-nums">Updated {secondsAgo}s ago</div>
        </div>
      </div>

      {/* Sport filter pills — hidden until we have at least one bet so the
          page doesn't show empty chips on slow nights. */}
      {allBets.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const count = countsBySport[f];
            const isActive = activeFilter === f;
            const disabled = f !== "ALL" && count === 0;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                disabled={disabled}
                className={[
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-accent text-background"
                    : "border border-card-border bg-card text-muted hover:text-foreground",
                  disabled ? "opacity-40 cursor-not-allowed" : "",
                ].join(" ")}
              >
                {f}
                <span
                  className={[
                    "ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-[10px] font-mono tabular-nums",
                    isActive ? "bg-background/20 text-background" : "bg-background/60 text-muted",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-6 rounded-xl border border-weak/30 bg-weak/10 p-4 text-sm text-weak">
          ⚠️ Couldn&apos;t reach live data right now ({error}). Retrying every 30 seconds.
        </div>
      )}

      {/* Initial-load skeleton */}
      {data === null && !error && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-card-border bg-card"
            />
          ))}
        </div>
      )}

      {/* Empty state — nothing live (or filter killed all results) */}
      {data !== null && visibleBets.length === 0 && (
        <div className="rounded-2xl border border-card-border bg-card p-12 text-center">
          <div className="text-2xl">🌙</div>
          <div className="mt-3 text-lg font-medium">
            {allBets.length === 0
              ? "No live bets right now"
              : `No ${activeFilter} bets active`}
          </div>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            {allBets.length === 0
              ? "When NovaLine has bets in active games, they'll show up here with live status, current stat lines, and game time. Check back when games are on."
              : "Try the All filter to see what's tracking across other sports."}
          </p>
        </div>
      )}

      {/* Bet cards grid */}
      {visibleBets.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleBets.map((bet: LiveBet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>
      )}

      {/* Footer caveat */}
      <p className="mt-12 text-center text-xs text-muted">
        Live stats are pulled from official league sources (MLB Stats API, NHL API, ESPN).
        Data may lag broadcast by 30-60 seconds. Bet outcomes are final only after the game ends.
      </p>
    </div>
  );
}
