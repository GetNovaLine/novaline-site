// /live — public live bet tracker page. Renders the client component below
// inside the standard site layout (Nav + Footer from layout.tsx).

import type { Metadata } from "next";
import LiveTracker from "./LiveTracker";

export const metadata: Metadata = {
  title: "Live Tracker",
  description:
    "Watch every active NovaLine bet in real time. Live status, current stats, game clock — all updating automatically.",
};

export default function LivePage() {
  return <LiveTracker />;
}
