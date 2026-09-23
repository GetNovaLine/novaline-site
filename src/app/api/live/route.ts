// Proxies the public Live API on the Hetzner box. Putting it behind a Next.js
// Route Handler means the browser fetches same-origin (no CORS), and the
// backend stays on plain HTTP behind the firewall — no SSL setup needed.
//
// Must stay fully dynamic: any route-level `revalidate` turns this into an ISR
// route, and Vercel then serves a STALE snapshot (observed 20+ minutes old)
// while regenerating in the background — the live page looked frozen until a
// hard refresh. The upstream FastAPI read is cheap, so every request goes
// straight through.

const UPSTREAM = process.env.LIVE_API_UPSTREAM ?? "http://159.69.95.135:8000/api/live";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      // Short timeout so a hung backend doesn't keep the page spinning.
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) {
      return Response.json(
        { error: `upstream ${res.status}`, bets: [], bet_count: 0 },
        { status: 502, headers: NO_STORE },
      );
    }
    const data = await res.json();
    return Response.json(data, { headers: NO_STORE });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return Response.json(
      { error: `proxy: ${msg}`, bets: [], bet_count: 0 },
      { status: 502, headers: NO_STORE },
    );
  }
}
