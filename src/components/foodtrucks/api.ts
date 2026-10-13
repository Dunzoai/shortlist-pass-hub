import { APP_BASE, CITY, EMAIL_LIVE, TEXTING_LIVE } from "./config";

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

export type AskResult = { ok: true; reply: string } | { ok: false };

/**
 * A typed question goes to the app's public Shorty (/api/shorty/demo-chat). That route's knowledge is written into the route
 * itself, not read from the Binder yet. If it can't answer, we say so; we never make up an answer here.
 */
export async function askShorty(question: string): Promise<AskResult> {
  try {
    const framed =
      "A food truck owner is looking at the Shortlist Pass food trucks page and asks: " + question +
      "\nAnswer as Shorty in at most 3 short plain sentences, no emoji, no lists. Only say what Shortlist really does. " +
      "We do not integrate with Toast or Square. If you are not sure, say so.";
    const r = await fetch(`${APP_BASE}/api/shorty/demo-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: framed }] }),
    });
    const j = await r.json().catch(() => null);
    if (!r.ok || typeof j?.reply !== "string" || !j.reply.trim()) return { ok: false };
    return { ok: true, reply: j.reply.trim() };
  } catch {
    return { ok: false };
  }
}

export type SendResult = { ok: boolean; sent: boolean };

/**
 * "Text me": ONE function so the real route can be dropped in. Today it sends nothing (TEXTING_LIVE is false) and the number
 * never leaves the browser. The page shows the demo messages on the stage phone instead.
 */
export async function sendDemoText(_phone: string, _messageIndex: number): Promise<SendResult> {
  void _phone; void _messageIndex;
  if (!TEXTING_LIVE) return { ok: true, sent: false };
  return { ok: false, sent: false };
}

/** "Email it to me instead": same rule. Sends nothing until EMAIL_LIVE and a real route exist. */
export async function sendPageEmail(_to: string): Promise<SendResult> {
  void _to;
  if (!EMAIL_LIVE) return { ok: true, sent: false };
  return { ok: false, sent: false };
}
