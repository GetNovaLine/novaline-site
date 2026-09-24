// Same-origin proxy for the homepage's headline record (see src/lib/stats.ts).
// Fully dynamic for the same reason as /api/live: a route-level `revalidate`
// makes Vercel serve a stale ISR snapshot, which is the bug this route fixes.

import { SUMMARY_UPSTREAM } from "@/lib/stats";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const res = await fetch(SUMMARY_UPSTREAM, {
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) {
      return Response.json({ error: `upstream ${res.status}` }, { status: 502, headers: NO_STORE });
    }
    return Response.json(await res.json(), { headers: NO_STORE });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return Response.json({ error: `proxy: ${msg}` }, { status: 502, headers: NO_STORE });
  }
}
