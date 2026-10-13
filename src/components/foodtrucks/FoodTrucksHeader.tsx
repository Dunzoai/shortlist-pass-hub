import Image from "next/image";
import Link from "next/link";
import { GET_A_SHORTY_URL, LOGIN_URL } from "./config";

/** The same black bar as the new homepage (components/new-home/SiteHeader), with this page's CTA. */
export function FoodTrucksHeader() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f6f1e4]/10 bg-[#14161a]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:py-4">
          <Link href="/new" className="flex items-center gap-2.5">
            <Image src="/shortlist-mint-mark.png" alt="" width={36} height={36} priority className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="font-[family-name:var(--font-fraunces)] text-[19px] tracking-[-0.01em] text-[#f6f1e4]">Shortlist Pass</span>
          </Link>
          <span className="hidden text-[14px] font-semibold text-[#f6f1e4]/60 md:inline">For food trucks</span>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href={LOGIN_URL} className="hidden text-[14px] font-medium text-[#f6f1e4] hover:underline sm:inline">Sign in</a>
            <a href={GET_A_SHORTY_URL} className="whitespace-nowrap rounded-full bg-[#7fd0a4] px-3.5 py-2 text-[12.5px] font-semibold text-[#12301f] transition-transform hover:-translate-y-px sm:px-4 sm:py-2.5 sm:text-[13px]">
              Get your own Shorty
            </a>
          </div>
        </div>
      </header>
      <div aria-hidden="true" className="h-[60px] lg:h-[76px]" />
    </>
  );
}
