// Proxies the public Live API on the Hetzner box. Putting it behind a Next.js
// Route Handler means the browser fetches same-origin (no CORS), and the
// backend stays on plain HTTP behind the firewall — no SSL setup needed.
//
// Cached for 5s at the edge so a busy /live page doesn't hammer the backend.
// 30s client polling × 5s cache = at most one backend hit every 5s regardless
// of how many viewers are looking at the page.

const UPSTREAM = process.env.LIVE_API_UPSTREAM ?? "http://159.69.95.135:8000/api/live";

export const revalidate = 5;

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      // Short timeout so a hung backend doesn't keep the page spinning.
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 5 },
    });
    if (!res.ok) {
      return Response.json(
        { error: `upstream ${res.status}`, bets: [], bet_count: 0 },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }
    const data = await res.json();
    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=5, s-maxage=5" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return Response.json(
      { error: `proxy: ${msg}`, bets: [], bet_count: 0 },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
