/**
 * A vintage newspaper strip that shows through where the film band's paper is torn away: "The Shortlist Gazette", aged newsprint
 * with a masthead, columns of fine print, headlines about Shorty and halftone pictures. Decorative only (aria-hidden).
 */
import Image from "next/image";
import { TornEdge } from "./TornEdge";

const PRINT = "#2b241b";
const PAPER = "#E7DCBF";
const SERIF = "var(--font-fraunces), Georgia, serif";
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
const DOTS = `radial-gradient(${PRINT} 26%, transparent 29%) 0 0/4px 4px`;

const FINE = [
  "Shorty answers every text before the shop even opens its doors.",
  "Menus, hours and specials updated the moment you say the word.",
  "Customers order, book and ask questions, and nobody is left on read.",
  "Your Shortlist page speaks the language the new AI agents expect.",
  "Square and Stripe stay yours. We never touch the money.",
  "Neighbors find the corner bakery, the barber and the food truck.",
  "No more missed calls, no more handwritten signs in the window.",
  "One coworker who never clocks out, never calls in sick.",
  "Events, loyalty rewards and newsletters go out on schedule.",
  "Ask Shorty for a report and the week is summed up in a line.",
];
const Fine = ({ from, n }: { from: number; n: number }) => (
  <p className="text-[8.5px] leading-[1.45] text-justify opacity-80" style={{ fontFamily: "Georgia, serif", hyphens: "auto" }}>
    {Array.from({ length: n }, (_, i) => FINE[(from + i) % FINE.length]).join(" ")}
  </p>
);
const Head = ({ children, size = 17 }: { children: string; size?: number }) => (
  <h3 className="mb-1.5 border-b border-[#2b241b]/60 pb-1.5 font-black uppercase leading-[1.05] tracking-[-0.01em]" style={{ fontFamily: SERIF, fontSize: size }}>{children}</h3>
);
const Pic = ({ children, caption }: { children: React.ReactNode; caption: string }) => (
  <figure className="m-0">
    <div className="relative h-[104px] overflow-hidden border border-[#2b241b]/70">
      {children}
      <span className="absolute inset-0 opacity-[.28] mix-blend-multiply" style={{ background: DOTS }} />
    </div>
    <figcaption className="mt-1 text-[8px] italic leading-tight opacity-75" style={{ fontFamily: "Georgia, serif" }}>{caption}</figcaption>
  </figure>
);

export function Newsprint() {
  return (
    <div aria-hidden="true" className="relative">
    <div className="relative select-none overflow-hidden px-4 pb-10 pt-14 sm:px-8 sm:pt-16" style={{ background: PAPER, color: PRINT }}>
      <TornEdge fill="#eadcb8" />
      <span className="pointer-events-none absolute inset-0 opacity-[.3] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
      <span className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 70px 0 70px -50px rgba(120,80,30,.28), inset -70px 0 70px -50px rgba(120,80,30,.28)" }} />
      <div className="relative mx-auto max-w-[1100px]">
        <div className="mb-2 flex items-center justify-between border-y-[3px] border-double border-[#2b241b]/70 py-1 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ fontFamily: "Georgia, serif" }}>
          <span>Vol. 1 · No. 1</span><span className="hidden sm:inline">Free to every shop on the block</span><span>Est. 2026</span>
        </div>
        <p className="mb-3 text-center font-black uppercase leading-none tracking-[-0.01em]" style={{ fontFamily: SERIF, fontSize: "clamp(30px, 6vw, 58px)" }}>The Shortlist Gazette</p>
        <div className="grid grid-cols-2 gap-x-5 border-t border-[#2b241b]/60 pt-3 sm:grid-cols-4 [&>*]:border-l [&>*]:border-[#2b241b]/30 [&>*]:pl-4 [&>*:first-child]:border-l-0 [&>*:first-child]:pl-0">
          <div className="min-w-0">
            <Head>Corner Bakery Hires Shorty</Head>
            <Fine from={0} n={5} />
          </div>
          <div className="min-w-0">
            <Pic caption="The new hire, on his first day on the job.">
              <Image src="/shortlist-mint-mark.png" alt="" width={200} height={200} className="absolute left-1/2 top-1/2 h-[120px] w-[120px] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-multiply" style={{ filter: "grayscale(1) contrast(2.4) brightness(.72)" }} />
            </Pic>
          </div>
          <div className="hidden min-w-0 sm:block">
            <Head>AI Agents Have Arrived</Head>
            <Fine from={3} n={5} />
          </div>
          <div className="hidden min-w-0 sm:block">
            <Pic caption="Main Street, open for business around the clock.">
              <svg viewBox="0 0 200 104" className="absolute inset-0 h-full w-full" fill="none" stroke={PRINT} strokeWidth={2}>
                <rect x="18" y="26" width="164" height="78" fill="#cdbf9c" />
                <path d="M12 26 H188 L178 8 H22 Z" fill="#a89a78" />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${22 + i * 20.5} 8 V26`} />)}
                <rect x="30" y="44" width="48" height="36" fill="#e6dcc0" /><rect x="122" y="44" width="48" height="36" fill="#e6dcc0" />
                <rect x="88" y="44" width="26" height="60" fill="#8a7a5a" />
                <circle cx="100" cy="17" r="5" fill="#2b241b" stroke="none" />
              </svg>
            </Pic>
          </div>
        </div>
        <div className="mt-4 hidden grid-cols-4 gap-x-5 sm:grid [&>*]:border-l [&>*]:border-[#2b241b]/30 [&>*]:pl-4 [&>*:first-child]:border-l-0 [&>*:first-child]:pl-0">
          <div><Fine from={6} n={4} /></div><div><Fine from={2} n={4} /></div><div><Fine from={8} n={4} /></div><div><Fine from={5} n={4} /></div>
        </div>
      </div>
    </div>
      <TornEdge fill={PAPER} after />
    </div>
  );
}
