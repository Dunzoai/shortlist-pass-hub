import { TRUCKS_SITE_URL, CITY, GET_A_SHORTY_URL } from "./config";
import type { TrucksTonight as Tonight } from "./api";
import { C, SERIF } from "./tokens";

/** "[NUMBER] trucks out tonight in Myrtle Beach": only real data. No stops posted (or the app is unreachable) = the honest card with no number. */
export function TrucksTonight({ tonight }: { tonight: Tonight }) {
  const n = tonight?.count ?? 0;
  const stops = (tonight?.stops ?? []).slice(0, 3);
  return (
    <section className="grid items-stretch gap-6 md:grid-cols-2">
      <div aria-label="Tonight's food trucks" style={{ background: C.ink, color: C.cream, borderRadius: 24, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: C.mint }}>trucks.shortlistpass.com</div>
        {n > 0 ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontFamily: SERIF, fontSize: 60, lineHeight: 1, color: C.mint }}>{n}</span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>truck{n === 1 ? "" : "s"} out tonight in {CITY.name}</span>
          </div>
        ) : (
          <div style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1.05 }}>See who&rsquo;s out tonight in {CITY.name}.</div>
        )}
        {stops.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stops.map((s) => (
              <a key={s.pageUrl} href={s.pageUrl} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "#fff", color: C.ink, borderRadius: 14, textDecoration: "none" }}>
                <div style={{ width: 44, height: 44, flex: "none", borderRadius: 10, background: C.amber }} />
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{s.truck}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>{[s.place, s.until ? `until ${s.until}` : null].filter(Boolean).join(" · ")}</div>
                </div>
                <span style={{ flex: "none", background: s.orderUrl ? C.mint : "transparent", color: s.orderUrl ? "#0D2B20" : C.ink, border: s.orderUrl ? 0 : "1px solid " + C.hair, borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 800 }}>{s.orderUrl ? "Preorder" : "View"}</span>
              </a>
            ))}
          </div>
        )}
        <a href={TRUCKS_SITE_URL} className="inline-flex min-h-12 items-center justify-center self-start rounded-full px-6 py-3 text-[15px] font-bold transition-transform hover:-translate-y-0.5" style={{ background: C.mint, color: "#0D2B20" }}>See who&rsquo;s out tonight</a>
      </div>

      <div style={{ background: "#fff", border: "1px solid " + C.hair, borderRadius: 24, padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, boxShadow: "0 18px 36px -26px rgba(26,28,32,.5)" }}>
        <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: C.green }}>Free to start</div>
        <h2 className="text-[40px] md:text-[48px]" style={{ fontFamily: SERIF, fontWeight: 400, lineHeight: 0.98, margin: 0, textWrap: "balance" }}>Your truck. Your page. Your Shorty.</h2>
        <p className="text-[16px] md:text-[18px]" style={{ margin: 0, lineHeight: 1.55, color: C.body }}>Set up in a few minutes from your menu and your schedule. Keep your POS for walk-ups. No commission on orders.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginTop: 6 }}>
          <a href={GET_A_SHORTY_URL} className="inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3.5 text-[16px] font-bold transition-transform hover:-translate-y-0.5" style={{ background: C.ink, color: C.cream }}>Get your own Shorty</a>
          <a href={TRUCKS_SITE_URL} style={{ minHeight: 44, display: "flex", alignItems: "center", fontSize: 15.5, fontWeight: 700, color: C.green }}>Already listed? Claim your truck</a>
        </div>
      </div>
    </section>
  );
}
