"use client";

/**
 * Pricing, directly below "Shorty's got skills." on /new. Cut-paper boxes (a hand-cut edge, grain, a deeper wash
 * in one corner, a thick outline and a hard offset shadow), a cream chapter. For Businesses two boxes (the $50
 * one first, so it leads on a phone); for HOAs one.
 *
 * Both CTAs point at the signup that already exists on the page.
 */
import Image from "next/image";
import { useAudience } from "./audience";
import { APP_FREE_URL, APP_SIGNUP_URL, APP_VERIFIED_URL } from "./SiteHeader";

const INK = "#14161A", MINT_LIGHT = "#D7F5E8", MINT = "#34D399", PAPER = "#F6F1E4";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const BODY = "var(--font-sans-inter), system-ui, sans-serif";

/* Paper grain: the same noise the other sections use. */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/* ---------- the paper: a hand-cut outline, built once (no SVG filters, so it stays smooth on a phone) ---------- */

/** A rounded rectangle whose edge wobbles a little, like scissors: a seeded jitter, so server and client agree. */
function cutPath(w: number, h: number, seed: number, r = 18, step = 8, amp = 1.5) {
  let a = seed;
  const rnd = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const wob = (i: number) => (rnd() - 0.5) * amp * 1.6 + Math.sin(i * 0.41 + seed) * amp * 0.7;
  const pts: string[] = [];
  const f = (n: number) => n.toFixed(1);
  let i = 0;
  for (let x = r; x < w - r; x += step) pts.push(`${f(x)} ${f(wob(i++))}`);
  for (let k = 0; k <= 3; k++) { const ang = -Math.PI / 2 + (k / 3) * (Math.PI / 2); pts.push(`${f(w - r + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(r + Math.sin(ang) * r + wob(i++) * 0.4)}`); }
  for (let y = r; y < h - r; y += step) pts.push(`${f(w + wob(i++))} ${f(y)}`);
  for (let k = 0; k <= 3; k++) { const ang = (k / 3) * (Math.PI / 2); pts.push(`${f(w - r + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(h - r + Math.sin(ang) * r + wob(i++) * 0.4)}`); }
  for (let x = w - r; x > r; x -= step) pts.push(`${f(x)} ${f(h + wob(i++))}`);
  for (let k = 0; k <= 3; k++) { const ang = Math.PI / 2 + (k / 3) * (Math.PI / 2); pts.push(`${f(r + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(h - r + Math.sin(ang) * r + wob(i++) * 0.4)}`); }
  for (let y = h - r; y > r; y -= step) pts.push(`${f(wob(i++))} ${f(y)}`);
  for (let k = 0; k <= 3; k++) { const ang = Math.PI + (k / 3) * (Math.PI / 2); pts.push(`${f(r + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(r + Math.sin(ang) * r + wob(i++) * 0.4)}`); }
  return `M${pts.join("L")}Z`;
}
const CUT_FEATURED = cutPath(400, 560, 3);
const CUT_FREE = cutPath(400, 560, 9);
const CUT_HOA = cutPath(400, 440, 5);

/** The sheet: a hard offset shadow, the paper, a light/deep wash across it, and grain over the lot. */
function Paper({ d, h, fill, thick }: { d: string; h: number; fill: string; thick?: boolean }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox={`-8 -8 416 ${h + 24}`} preserveAspectRatio="none" className="pointer-events-none absolute -inset-[6px] h-[calc(100%+12px)] w-[calc(100%+12px)] overflow-visible">
      <path d={d} transform="translate(9 11)" fill="rgba(45,30,12,.34)" />
      <path d={d} transform="translate(4 5)" fill="rgba(45,30,12,.16)" />
      <path d={d} fill={fill} stroke="rgba(110,85,45,.28)" strokeWidth={thick ? 2 : 1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="url(#pr-wash)" />
      <path d={d} fill="url(#pr-grain)" opacity="0.3" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}

const CSS = `
.pr-box{position:relative;z-index:1;transition:translate .15s ease}
@media (hover:hover){.pr-box:hover{translate:0 -4px}}
.pr-grid{display:flex;flex-direction:column;gap:34px}
.pr-stage{position:relative}
@media (min-width:900px){
  .pr-grid{display:grid;grid-template-columns:1.12fr 1fr;gap:0 56px;padding-inline:11%;align-items:stretch}
}
@media (prefers-reduced-motion: reduce){ .pr-box{transition:none}.pr-box:hover{translate:none} }
`;

/** A small hand-drawn check mark. Decorative: the line beside it carries the meaning. */
function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="mt-[3px] h-[22px] w-[22px] shrink-0">
      <circle cx="12" cy="12" r="10" fill={MINT} stroke={INK} strokeWidth="2" />
      <path d="M6.600 12.600 L10.300 16.200 L17.600 7.800" fill="none" stroke={INK} strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lines({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[16.5px] leading-[1.35] font-semibold text-[#14161A]" style={{ fontFamily: BODY }}>
          <Check />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

const FINE = "text-[13.5px] leading-[1.45] text-[#14161A]/[0.72]";

/** The "VERIFIED" stamp: a mint circle with the site's own logo mark (its shield is a cut-out, so cream shows through), tilted, with the word under it. */
function Stamp() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -top-6 -right-3 z-20 flex w-[104px] flex-col items-center min-[900px]:-top-7 min-[900px]:-right-5 min-[900px]:w-[116px]" style={{ rotate: "8deg" }}>
      <div className="relative h-[78px] w-[78px] overflow-hidden rounded-full border-[3px] border-[#14161A] bg-[#FBF6E6] shadow-[2px_3px_0_#14161A] min-[900px]:h-[88px] min-[900px]:w-[88px]">
        <Image src="/shortlist-mint-mark.png" alt="" width={160} height={160} loading="eager" className="absolute -top-[14%] -left-[14%] h-[128%] w-[128%] max-w-none" />
      </div>
      <span
        className="relative z-10 mt-1.5 rounded-full border-[2.5px] border-[#14161A] bg-[#FBF6E6] px-2.5 py-[2px] text-[11.5px] font-extrabold tracking-[0.12em] text-[#14161A] shadow-[2px_3px_0_#14161A]"
        style={{ fontFamily: SANS }}
      >
        VERIFIED
      </span>
    </div>
  );
}

const BTN = "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-[16px] font-bold whitespace-nowrap no-underline";

function Box({ featured, d, h, fill, children }: { featured?: boolean; d: string; h: number; fill: string; children: React.ReactNode }) {
  return (
    <article className={`pr-box ${featured ? "pr-featured" : ""}`}>
      {featured && <span className="pr-halo" aria-hidden="true" />}
      <Paper d={d} h={h} fill={fill} thick={featured} />
      {featured && <span className="pr-lit" aria-hidden="true" />}
      {children}
    </article>
  );
}

export function PricingSection() {
  const { audience } = useAudience();
  const hoa = audience === "hoa";

  return (
    <section aria-labelledby="pricing-h" className="relative overflow-x-clip bg-[#FBF8F0] px-5 py-14 min-[900px]:px-10 min-[900px]:py-24">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* the shared paper textures: a wash that's lighter top-left and deeper bottom-right, and the grain */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="pr-wash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#6b5a3a" stopOpacity="0.12" />
          </linearGradient>
          <pattern id="pr-grain" patternUnits="userSpaceOnUse" width="80" height="80">
            <image href={GRAIN_URL} width="80" height="80" />
          </pattern>
        </defs>
      </svg>

      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <h2 id="pricing-h" className="font-extrabold leading-[1.04] tracking-[-0.03em] text-[#1A1C20]" style={{ fontFamily: SANS, fontSize: "clamp(32px, 5.4vw, 72px)" }}>
            {hoa ? "Your community, your voice." : "Pick your Shorty."}
          </h2>
          {!hoa && (
            <p className="mt-2 leading-[1.25] text-[#1A1C20]/80 min-[900px]:mt-3" style={{ fontFamily: SERIF, fontSize: "clamp(19px, 2.2vw, 30px)" }}>
              Claim yours free, or let him run the business.
            </p>
          )}
        </div>

        {hoa ? (
          <div className="mx-auto mt-12 max-w-[640px] min-[900px]:mt-16">
            <Box fill={MINT_LIGHT} d={CUT_HOA} h={440}>
              <div className="relative flex flex-col items-center gap-5 px-6 py-9 text-center min-[900px]:px-12 min-[900px]:py-12">
                <h3 className="text-[26px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#14161A] min-[900px]:text-[34px]" style={{ fontFamily: SANS }}>
                  Shorty is free to every HOA
                </h3>
                <p className="text-[21px] leading-[1.3] text-[#14161A] min-[900px]:text-[25px]" style={{ fontFamily: SERIF }}>
                  The Shortlist wants you to control the communication in your own community.
                </p>
                <p className={FINE} style={{ fontFamily: BODY }}>Everything Shorty does, except checkout.</p>
                <a href={APP_SIGNUP_URL} className={`${BTN} mt-1 bg-[#14161A] text-[#F6F1E4]`} style={{ fontFamily: BODY }}>
                  Set up your community, free
                </a>
              </div>
            </Box>
          </div>
        ) : (
          <div className="pr-stage mt-14 min-[900px]:mt-[72px]">
            <div className="pr-grid">
              <Box featured fill={MINT_LIGHT} d={CUT_FEATURED} h={560}>
                <Stamp />
                <div className="relative flex h-full flex-col gap-5 px-6 py-8 min-[900px]:px-10 min-[900px]:py-11">
                  <h3 className="max-w-[78%] text-[26px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#14161A] min-[900px]:max-w-[80%] min-[900px]:text-[34px]" style={{ fontFamily: SANS }}>
                    Get your own verified Shorty
                  </h3>
                  <p className="flex items-baseline gap-2 text-[#14161A]" style={{ fontFamily: SANS }}>
                    <span className="text-[76px] leading-none font-extrabold tracking-[-0.04em] min-[900px]:text-[96px]">$50</span>
                    <span className="text-[17px] font-bold" style={{ fontFamily: BODY }}>/ month</span>
                  </p>
                  <Lines items={["Answers customers 24/7", "Ordering", "Bookings", "Reports"]} />
                  <div className="flex flex-col gap-1.5">
                    <p className={FINE} style={{ fontFamily: BODY }}>Integrated with Square and Stripe. We never touch your money.</p>
                    <p className={FINE} style={{ fontFamily: BODY }}>Texting and social posting are available as add-ons.</p>
                  </div>
                  <a href={APP_VERIFIED_URL} className={`${BTN} mt-auto self-start bg-[#14161A] text-[#F6F1E4]`} style={{ fontFamily: BODY }}>
                    Get your own Shorty
                  </a>
                </div>
              </Box>

              <Box fill={PAPER} d={CUT_FREE} h={560}>
                <div className="relative flex h-full flex-col gap-5 px-6 py-8 min-[900px]:px-9 min-[900px]:py-11">
                  <h3 className="text-[24px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#14161A] min-[900px]:text-[30px]" style={{ fontFamily: SANS }}>
                    Claim a free Shorty
                  </h3>
                  <p className="text-[#14161A]" style={{ fontFamily: SANS }}>
                    <span className="text-[76px] leading-none font-extrabold tracking-[-0.04em] min-[900px]:text-[96px]">$0</span>
                  </p>
                  <Lines items={["Add your offerings", "Shorty chats with customers about your business"]} />
                  <p className={FINE} style={{ fontFamily: BODY }}>Limited knowledge. No ordering, booking or marketing.</p>
                  <a href={APP_FREE_URL} className={`${BTN} mt-auto self-start border-[3px] border-[#14161A] bg-transparent text-[#14161A]`} style={{ fontFamily: BODY }}>
                    Claim a free Shorty
                  </a>
                </div>
              </Box>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
