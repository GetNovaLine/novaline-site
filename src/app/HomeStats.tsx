"use client";

// Homepage headline stats. The server renders them from its (up to a minute
// old, or older on a quiet site) copy; this re-fetches /api/summary on load and
// whenever the tab regains focus, so a bet graded moments ago is counted.

import { useEffect, useState } from "react";
import type { SummaryResponse } from "@/lib/stats";

type HeadlineStats = { bets: number; roi: number; unitsUp: number; daysActive: number };

export default function HomeStats({ initial }: { initial: HeadlineStats }) {
  const [stats, setStats] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    async function fetchOnce() {
      if (inFlight) return;
      inFlight = true;
      try {
        const res = await fetch("/api/summary", { cache: "no-store" });
        if (!res.ok) return;
        const s: SummaryResponse = await res.json();
        if (cancelled || s.error || typeof s.bets !== "number") return;
        setStats({ bets: s.bets, roi: s.roi, unitsUp: s.units, daysActive: s.days });
      } catch {
        // Keep the server-rendered numbers.
      } finally {
        inFlight = false;
      }
    }
    function onVisible() {
      if (document.visibilityState === "visible") fetchOnce();
    }
    fetchOnce();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      <Stat label="Bets settled" value={stats.bets.toString()} />
      <Stat label="ROI" value={`${stats.roi.toFixed(2)}%`} accent />
      <Stat label="Units up" value={`${stats.unitsUp >= 0 ? "+" : ""}${stats.unitsUp.toFixed(2)}u`} />
      <Stat label="Days tracked" value={stats.daysActive.toString()} />
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-semibold tracking-tight md:text-4xl ${accent ? "text-accent" : "text-foreground"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted">{label}</div>
    </div>
  );
}
