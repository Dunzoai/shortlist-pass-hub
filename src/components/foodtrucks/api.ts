import { APP_BASE, CITY } from "./config";

export type TruckStop = { truck: string; place: string | null; until: string | null; pageUrl: string; orderUrl: string | null };
export type TrucksTonight = { count: number; stops: TruckStop[] } | null;

/** Real data from the app: confirmed stops for tonight. Returns null if the app can't be reached (the card then shows no number). */
export async function getTrucksTonight(): Promise<TrucksTonight> {
  try {
    const r = await fetch(`${APP_BASE}/api/agent/v1/trucks-tonight?city=${CITY.slug}`, { headers: { Accept: "application/json" }, next: { revalidate: 60 } });
    if (!r.ok) return null;
    const j = await r.json();
    if (!j?.ok || !Array.isArray(j.tonight)) return null;
    const stops: TruckStop[] = j.tonight.map((s: Record<string, unknown>) => ({
      truck: String(s.truck ?? ""),
      place: (s.park as { name?: string } | null)?.name ?? (s.address as string | null) ?? null,
      until: (s.end as string | null) ?? null,
      pageUrl: String(s.page_url ?? ""),
      orderUrl: (s.order_url as string | null) ?? null,
    }));
    return { count: stops.length, stops };
  } catch {
    return null;
  }
}
