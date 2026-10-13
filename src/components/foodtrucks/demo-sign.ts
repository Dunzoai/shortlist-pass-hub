import demo from "./demo-truck.json";
import type { SignData } from "./lot-art";

/** The sign's words, from the demo truck's weekly stops (the same file the seed script writes into the app, so the sign and the
    page show the same stops). `now` is read in the truck's timezone. */
const fmt = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; const hh = h % 12 || 12; return m ? `${hh}:${String(m).padStart(2, "0")}${ap}` : `${hh}${ap}`; };
const span = (a: string, b: string) => { const ap = (t: string) => (Number(t.split(":")[0]) >= 12 ? "PM" : "AM"); const x = fmt(a), y = fmt(b); return ap(a) === ap(b) ? `${x.replace(/AM|PM/, "")}–${y}` : `${x}–${y}`; };

export function signData(now = new Date()): SignData {
  const dow = new Date(now.toLocaleString("en-US", { timeZone: demo.timezone })).getDay();
  const stops = demo.weeklyStops;
  const today = stops.find((s) => s.dow === dow);
  const next = [...stops].sort((a, b) => ((a.dow - dow + 7) % 7 || 7) - ((b.dow - dow + 7) % 7 || 7))[0];
  return {
    tonight: today ? { title: today.title, time: span(today.start, today.end) } : null,
    nextStop: next ? { day: next.day, title: next.title } : null,
    week: stops.map((s) => ({ day: s.day, title: s.title })),
  };
}
