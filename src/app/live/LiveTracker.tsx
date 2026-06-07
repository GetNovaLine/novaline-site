"use client";

// Client component for the /live page. Polls /api/live every 30s and renders
// bet cards in a responsive grid. Shows a "last updated N seconds ago" chip so
// viewers can tell at a glance how fresh the data is.

import { useEffect, useState } from "react";
import BetCard from "./BetCard";
import type { LiveApiResponse } from "./types";

const POLL_INTERVAL_MS = 30_000;

export default function LiveTracker() {
  const [data, setData] = useState<LiveApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(Date.now());
  const [secondsAgo, setSecondsAgo] = useState(0);

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

  const bets = data?.bets ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
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
          <div className="mt-1 tabular-nums">
            Updated {secondsAgo}s ago
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-weak/30 bg-weak/10 p-4 text-sm text-weak">
          ⚠️ Couldn&apos;t reach live data right now ({error}). Retrying every 30 seconds.
        </div>
      )}

      {/* Initial load skeleton */}
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

      {/* Empty state — nothing live right now */}
      {data !== null && bets.length === 0 && (
        <div className="rounded-2xl border border-card-border bg-card p-12 text-center">
          <div className="text-2xl">🌙</div>
          <div className="mt-3 text-lg font-medium">No live bets right now</div>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            When NovaLine has bets in active games, they&apos;ll show up here with live status,
            current stat lines, and game time. Check back when games are on.
          </p>
        </div>
      )}

      {/* Bet cards grid */}
      {bets.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bets.map((bet) => (
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
