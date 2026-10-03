import Image from "next/image";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { TornEdge } from "./TornEdge";

const INK = "#14161A";
const CREAM = "#FBF6E6";
const MINT = "#8cc3a1";
const SERIF = "var(--font-fraunces), Georgia, serif";
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const link = "font-semibold underline decoration-[#8cc3a1] decoration-2 underline-offset-4 hover:decoration-[#14161A] break-words";
const label = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#3f7a5a]";

/** Footer: a cut-paper contact card on the page's charcoal, under a torn edge of the section above. */
export function SiteFooter() {
  return (
    <footer className="relative bg-[#14161A] px-4 pb-10 pt-20 sm:px-6 sm:pt-24">
      <TornEdge fill="#FBF8F0" />
      <div className="relative mx-auto max-w-[1000px]">
        {/* Shorty leans over the top of the card, waving */}
        <span aria-hidden="true" className="pointer-events-none absolute -top-[122px] right-8 hidden h-[170px] w-[120px] sm:block">
          <ShortyMascot mood="hello" size={150} style={{ height: "100%", width: "auto" }} />
        </span>
        <div className="relative rounded-[22px] px-6 py-8 sm:px-10 sm:py-10" style={{ background: CREAM, color: INK, boxShadow: `6px 7px 0 ${MINT}` }}>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[.16] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
          <div className="relative grid gap-8 sm:grid-cols-[1.1fr_1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Image src="/shortlist-mint-mark.png" alt="" width={40} height={40} className="h-10 w-10" />
                <span className="text-[21px] leading-tight tracking-[-0.01em]" style={{ fontFamily: SERIF }}>Shortlist Pass<br />Company</span>
              </div>
            </div>
            <div className="space-y-5">
              <h2 className="text-[19px] font-semibold" style={{ fontFamily: SERIF }}>Contact us</h2>
              <div>
                <p className={label}>Business and Sales</p>
                <a href="mailto:connect@shortlistpass.com" className={link}>Connect@shortlistpass.com</a>
              </div>
              <div>
                <p className={label}>Custom Builds and Tech</p>
                <a href="mailto:hello@shortlistpass.com" className={link}>Hello@shortlistpass.com</a>
              </div>
            </div>
            <div className="space-y-5">
              <h2 className="text-[19px] font-semibold" style={{ fontFamily: SERIF }}>Follow along</h2>
              <div>
                <p className={label}>Instagram</p>
                <a href="https://www.instagram.com/shortlistpass" target="_blank" rel="noopener noreferrer" className={link}>@Shortlistpass</a>
              </div>
              <div>
                <p className={label}>Facebook</p>
                <a href="https://www.facebook.com/shortlistpass" target="_blank" rel="noopener noreferrer" className={link}>facebook.com/shortlistpass</a>
              </div>
            </div>
          </div>
          <p className="relative mt-8 border-t-2 border-dashed border-[#14161A]/25 pt-4 text-[13px] text-[#14161A]/70">© 2026 Shortlist Pass Company</p>
        </div>
      </div>
    </footer>
  );
}
