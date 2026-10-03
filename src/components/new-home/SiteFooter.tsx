import Image from "next/image";
import { PaperCard } from "./PaperCard";

const INK = "#14161A";
const SERIF = "var(--font-fraunces), Georgia, serif";
const link = "font-semibold underline decoration-[#8cc3a1] decoration-2 underline-offset-4 hover:decoration-[#14161A] break-words";
const label = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#3f7a5a]";

/** Footer: three loose sheets of paper on the charcoal: who we are, how to reach us, where to follow. */
export function SiteFooter() {
  return (
    <footer className="bg-[#14161A] px-5 pb-14 pt-16 sm:px-8 sm:pt-20" style={{ color: INK }}>
      <div className="mx-auto grid max-w-[1040px] gap-9 sm:grid-cols-[1fr_1.2fr_1fr] sm:gap-10">
        <PaperCard seed={21} tilt={-1.1}>
          <div className="flex h-full min-h-[190px] flex-col justify-between gap-6 px-6 py-7">
            <div className="flex items-center gap-3">
              <Image src="/shortlist-mint-mark.png" alt="" width={44} height={44} className="h-11 w-11" />
              <span className="text-[21px] leading-tight tracking-[-0.01em]" style={{ fontFamily: SERIF }}>Shortlist Pass<br />Company</span>
            </div>
            <p className="text-[13px] text-[#14161A]/70">© 2026 Shortlist Pass Company</p>
          </div>
        </PaperCard>
        <PaperCard seed={34} tilt={0.7}>
          <div className="space-y-5 px-6 py-7">
            <h2 className="text-[20px] font-semibold" style={{ fontFamily: SERIF }}>Contact us</h2>
            <div>
              <p className={label}>Business and Sales</p>
              <a href="mailto:connect@shortlistpass.com" className={link}>Connect@shortlistpass.com</a>
            </div>
            <div>
              <p className={label}>Custom Builds and Tech</p>
              <a href="mailto:hello@shortlistpass.com" className={link}>Hello@shortlistpass.com</a>
            </div>
          </div>
        </PaperCard>
        <PaperCard seed={47} tilt={-0.6}>
          <div className="space-y-5 px-6 py-7">
            <h2 className="text-[20px] font-semibold" style={{ fontFamily: SERIF }}>Follow us</h2>
            <div>
              <p className={label}>Instagram</p>
              <a href="https://www.instagram.com/shortlistpass" target="_blank" rel="noopener noreferrer" className={link}>@Shortlistpass</a>
            </div>
            <div>
              <p className={label}>Facebook</p>
              <a href="https://www.facebook.com/shortlistpass" target="_blank" rel="noopener noreferrer" className={link}>facebook.com/shortlistpass</a>
            </div>
          </div>
        </PaperCard>
      </div>
    </footer>
  );
}
