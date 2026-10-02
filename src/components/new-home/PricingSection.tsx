"use client";

/**
 * Pricing, directly below "Shorty's got skills." on /new. Static: torn-paper boxes with a thick outline and a hard
 * offset shadow, a cream chapter. For Businesses two boxes (the $50 one first, so it leads on a phone); for HOAs one.
 * The only motion is a 4px hover lift on desktop. Both CTAs point at the signup that already exists on the page.
 */
import Image from "next/image";
import { useAudience } from "./audience";
import { APP_SIGNUP_URL } from "./SiteHeader";

const INK = "#14161A", MINT_LIGHT = "#D7F5E8", MINT = "#34D399";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const BODY = "var(--font-sans-inter), system-ui, sans-serif";

/* Paper grain: the same noise the other sections use. */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const CSS = `
.pr-box{position:relative;transition:translate .15s ease}
@media (hover:hover){.pr-box:hover{translate:0 -4px}}
.pr-paper{position:absolute;inset:0;border-radius:18px;border:3px solid ${INK};filter:url(#pr-tear);pointer-events:none}
.pr-paper::after{content:"";position:absolute;inset:0;border-radius:inherit;background-image:url("${GRAIN_URL}");opacity:.14;mix-blend-mode:multiply}
.pr-featured .pr-paper{border-width:4px}
.pr-stamp{filter:url(#pr-tear-sm)}
@media (prefers-reduced-motion: reduce){.pr-box{transition:none}.pr-box:hover{translate:none}}
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
    <div aria-hidden="true" className="pointer-events-none absolute -top-6 -right-3 z-10 flex w-[104px] flex-col items-center min-[900px]:-top-7 min-[900px]:-right-5 min-[900px]:w-[116px]" style={{ rotate: "8deg" }}>
      <div className="pr-stamp relative h-[78px] w-[78px] overflow-hidden rounded-full border-[3px] border-[#14161A] bg-[#FBF6E6] min-[900px]:h-[88px] min-[900px]:w-[88px]">
        <Image src="/shortlist-mint-mark.png" alt="" width={160} height={160} loading="eager" className="absolute -top-[14%] -left-[14%] h-[128%] w-[128%] max-w-none" />
      </div>
      <span
        className="pr-stamp -mt-2.5 rounded-full border-[2.5px] border-[#14161A] bg-[#FBF6E6] px-2.5 py-[2px] text-[11.5px] font-extrabold tracking-[0.12em] text-[#14161A]"
        style={{ fontFamily: SANS }}
      >
        VERIFIED
      </span>
    </div>
  );
}

const BTN = "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-[16px] font-bold whitespace-nowrap no-underline";

function Box({ featured, fill, children, className = "" }: { featured?: boolean; fill: string; children: React.ReactNode; className?: string }) {
  return (
    <article className={`pr-box ${featured ? "pr-featured" : ""} ${className}`}>
      <span className="pr-paper" aria-hidden="true" style={{ background: fill }} />
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
      {/* the torn edge and hard offset shadow for the boxes (and a finer one for the stamp) */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <filter id="pr-tear" x="-6%" y="-6%" width="114%" height="116%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={1} seed={11} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.5} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feDropShadow in="torn" dx="6" dy="7" stdDeviation="0" floodColor="#14161A" floodOpacity="1" />
          </filter>
          <filter id="pr-tear-sm" x="-10%" y="-10%" width="125%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves={1} seed={4} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={3} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feDropShadow in="torn" dx="2" dy="3" stdDeviation="0" floodColor="#14161A" floodOpacity="1" />
          </filter>
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
            <Box fill={MINT_LIGHT} featured>
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
          <div className="mt-14 grid gap-12 min-[900px]:mt-[72px] min-[900px]:grid-cols-[1.12fr_1fr] min-[900px]:items-stretch min-[900px]:gap-12">
            <Box featured fill={MINT_LIGHT}>
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
                <a href={APP_SIGNUP_URL} className={`${BTN} mt-auto self-start bg-[#14161A] text-[#F6F1E4]`} style={{ fontFamily: BODY }}>
                  Get your own Shorty
                </a>
              </div>
            </Box>

            <Box fill="#F6F1E4">
              <div className="relative flex h-full flex-col gap-5 px-6 py-8 min-[900px]:px-9 min-[900px]:py-11">
                <h3 className="text-[24px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#14161A] min-[900px]:text-[30px]" style={{ fontFamily: SANS }}>
                  Claim a free Shorty
                </h3>
                <p className="text-[#14161A]" style={{ fontFamily: SANS }}>
                  <span className="text-[76px] leading-none font-extrabold tracking-[-0.04em] min-[900px]:text-[96px]">$0</span>
                </p>
                <Lines items={["Add your offerings", "Shorty chats with customers about your business"]} />
                <p className={FINE} style={{ fontFamily: BODY }}>Limited knowledge. No ordering, booking or marketing.</p>
                <a href={APP_SIGNUP_URL} className={`${BTN} mt-auto self-start border-[3px] border-[#14161A] bg-transparent text-[#14161A]`} style={{ fontFamily: BODY }}>
                  Claim a free Shorty
                </a>
              </div>
            </Box>
          </div>
        )}
      </div>
    </section>
  );
}
