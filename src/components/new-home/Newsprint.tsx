/**
 * The faded old newspaper behind the film card: a yellowed front page of "The Shortlist Gazette" laid out like a 1940s daily
 * (blackletter masthead, dateline rule, a huge headline, columns of justified fine print, halftone photos, a fold crease), washed
 * out so it reads as texture, not as something to read. It fills the film section; the card sits on top. Decorative only.
 */
import Image from "next/image";
import { UnifrakturCook } from "next/font/google";

const blackletter = UnifrakturCook({ weight: "700", subsets: ["latin"], display: "swap" });

export const NEWSPRINT = "#E5D7B1";
const PRINT = "#33291d";
const SERIF = "var(--font-fraunces), Georgia, serif";
const BODY = "Georgia, 'Times New Roman', serif";
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
const HALFTONE = `radial-gradient(${PRINT} 28%, transparent 31%) 0 0/3.5px 3.5px`;

const H = ({ children, size = 20 }: { children: string; size?: number }) => (
  <h3 className="mb-1 mt-2 break-after-avoid font-black leading-[1.02] tracking-[-0.015em]" style={{ fontFamily: SERIF, fontSize: size, color: PRINT }}>{children}</h3>
);
const By = ({ children }: { children: string }) => <p className="mb-1 text-[7.5px] font-bold uppercase tracking-[0.1em]" style={{ fontFamily: BODY }}>{children}</p>;
const P = ({ children }: { children: string }) => <p className="mb-1.5 text-justify text-[9.5px] leading-[1.28]" style={{ fontFamily: BODY, hyphens: "auto", textIndent: "1em" }}>{children}</p>;

export function NewsBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden" style={{ background: NEWSPRINT }}>
      {/* the page itself, washed out */}
      <div className="absolute left-1/2 top-0 w-[1280px] -translate-x-1/2 px-6 pt-10" style={{ color: PRINT, opacity: 0.5, filter: "sepia(.45) contrast(.95)" }}>
        {/* top line: weather, masthead, price */}
        <div className="flex items-end justify-between gap-6 border-b-2 border-[#33291d] pb-1">
          <div className="w-[190px] text-[8px] leading-[1.3]" style={{ fontFamily: BODY }}>
            <p className="font-bold">The Weather</p>
            <p>Sunny and mild on Main Street, a light breeze from the south. Shops open early. Low tonight, 61.</p>
          </div>
          <p className={`${blackletter.className} text-center leading-none`} style={{ fontSize: 76, letterSpacing: "0.01em" }}>The Shortlist Gazette</p>
          <div className="w-[190px] text-right text-[8px] leading-[1.3]" style={{ fontFamily: BODY }}>
            <p className="font-bold">Established 2026</p>
            <p>Published wherever there is a shop, a text, and a customer waiting to hear back.</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-[#33291d] py-0.5 text-[8.5px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: BODY }}>
          <span>Vol. 1, No. 1 — First Year</span><span>Main Street · Friday, October 2, 2026</span><span>16 Pages</span><span>Free to Every Shop</span>
        </div>
        {/* the big headline */}
        <h2 className="whitespace-nowrap border-b-2 border-[#33291d] pb-1 pt-1 text-center font-black leading-[0.95] tracking-[-0.03em]" style={{ fontFamily: SERIF, fontSize: 80 }}>Shorty Takes Over Main Street</h2>
        <p className="border-b border-[#33291d] py-0.5 text-center text-[11px] italic" style={{ fontFamily: BODY }}>New hire answers every text, fills the calendar and never asks for a day off, owners say</p>

        <div className="mt-2" style={{ columnCount: 6, columnGap: 20, columnRuleStyle: "solid", columnRuleWidth: 1, columnRuleColor: "rgba(51,41,29,.5)", height: 760 }}>
          <H>Corner Bakery Hires New Coworker</H>
          <By>By the Gazette Staff</By>
          <P>MAIN STREET — The corner bakery opened Tuesday with a new face behind the counter: a small green ticket named Shorty, who answers every customer text before the ovens are warm. The owner said the new hire has already updated the menu, posted the weekend special and moved two bookings without being asked twice.</P>
          <P>“He never clocks out,” she said, “and he never forgets to write back.” Customers who once waited until morning for a reply now hear back within moments, day or night, and the shop has stopped losing orders to the missed call.</P>
          <P>Neighbors say the change is plain to see. The line at the register moves faster, the chalkboard is always right, and the phone, long the loudest thing in the building, has gone quiet.</P>

          <figure className="m-0 mb-2 mt-3 break-inside-avoid">
            <div className="relative h-[170px] overflow-hidden border border-[#33291d]">
              <Image src="/shortlist-mint-mark.png" alt="" width={300} height={300} className="absolute left-1/2 top-1/2 h-[190px] w-[190px] max-w-none -translate-x-1/2 -translate-y-1/2" style={{ filter: "grayscale(1) contrast(1.8) brightness(.8)" }} />
              <span className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ background: HALFTONE }} />
            </div>
            <figcaption className="mt-0.5 text-[7.5px] font-bold leading-tight" style={{ fontFamily: BODY }}>The new hire, pictured on his first day on the job.</figcaption>
          </figure>

          <H size={22}>AI Agents Arrive on Main Street. Is Your Shop Ready?</H>
          <By>Special to the Gazette</By>
          <P>Personal assistants from the largest technology companies are now ordering lunch, booking haircuts and hunting for a plumber on behalf of their owners. Most small businesses, whose websites and social pages were built for people, are invisible to them.</P>
          <P>The Shortlist gives each shop a page these agents can read, so a request for a Saturday plumber can end with a booked appointment instead of a shrug. Everyone, the company says, is going to have an agent, much as everyone has an email address.</P>
          <P>Shop owners who wish to be found are advised to claim their page without delay. Those who do not may find that the customers have already gone looking elsewhere.</P>

          <H>The Money Stays With the Shop</H>
          <P>Shortlist Pass works with Square and Stripe, so customers order and pay the way they always have. The company says it never touches the money, a point it has stressed in every conversation with the owners it serves.</P>
          <P>Owners who use neither may keep whatever they use now and add Shorty alongside it. “A sale is a sale,” said one.</P>

          <H size={22}>Barber Chairs Full for Third Straight Week</H>
          <By>By Our Local Correspondent</By>
          <P>The calendar at the barbershop on Elm filled itself this week, as it has for three weeks running. Appointments are booked, moved and confirmed by text, and the only thing left for the barber to do is cut hair.</P>
          <P>“I used to answer the phone with one hand,” he said. “Now I use both on the clippers.”</P>

          <figure className="m-0 mb-2 mt-3 break-inside-avoid">
            <div className="relative h-[150px] overflow-hidden border border-[#33291d]" style={{ background: "#cdbf9c" }}>
              <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" fill="none" stroke={PRINT} strokeWidth={2.2}>
                <rect x="14" y="44" width="172" height="106" fill="#bfae86" />
                <path d="M8 44 H192 L180 20 H20 Z" fill="#8f7f5c" />
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <path key={i} d={`M${22 + i * 19.5} 20 V44`} />)}
                <rect x="28" y="62" width="54" height="44" fill="#e6dcc0" /><rect x="118" y="62" width="54" height="44" fill="#e6dcc0" />
                <rect x="88" y="62" width="24" height="88" fill="#6f5f3f" />
              </svg>
              <span className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ background: HALFTONE }} />
            </div>
            <figcaption className="mt-0.5 text-[7.5px] font-bold leading-tight" style={{ fontFamily: BODY }}>Main Street, open for business around the clock.</figcaption>
          </figure>

          <H>HOA Residents Get a Say</H>
          <P>Homeowner associations will receive their own Shorty at no charge, the company announced, so that the community controls how it talks to its own residents. He will answer questions about the rules, take a bingo RSVP and carry word of the block party to every door.</P>
          <H size={18}>Classifieds</H>
          <P>WANTED — One reliable coworker. Must work weekends and holidays. Apply to Shorty.</P>
          <P>LOST — One missed call, last seen Tuesday. If found, Shorty has already returned it.</P>
          <P>FOR SALE — Handwritten signs, gently used. Owner has gone digital.</P>
          <H size={18}>Weather</H>
          <P>Fair skies over the city, a gentle breeze, and not a customer left on read.</P>
        </div>
      </div>

      {/* age: yellowed edges, a fold crease, stains and grain; nothing at the bottom so the torn edge below matches */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 40%, rgba(229,215,177,0) 45%, rgba(176,128,52,.42) 100%)" }} />
      <div className="absolute inset-y-0 left-1/2 w-[34px] -translate-x-1/2" style={{ background: "linear-gradient(90deg, rgba(60,40,15,0), rgba(60,40,15,.22) 46%, rgba(255,250,235,.45) 52%, rgba(60,40,15,0))" }} />
      <div className="absolute -left-10 top-[22%] h-[160px] w-[220px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(150,100,40,.28), transparent)" }} />
      <div className="absolute right-[6%] top-[58%] h-[130px] w-[180px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(150,100,40,.22), transparent)" }} />
      <div className="absolute inset-0 opacity-[.28] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
    </div>
  );
}
