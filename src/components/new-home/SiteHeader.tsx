"use client";

import Image from "next/image";
import Link from "next/link";
import { useAudience, type Audience } from "./audience";

export const APP_SIGNUP_URL = "https://app.shortlistpass.com/signup";
const APP_LOGIN_URL = "https://app.shortlistpass.com/login";

function AudienceToggle() {
  const { audience, setAudience } = useAudience();
  const item = (key: Audience, label: string, short: string) => (
    <button
      type="button"
      onClick={() => setAudience(key)}
      aria-pressed={audience === key}
      className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors sm:px-5 sm:py-2 sm:text-[13px] ${
        audience === key ? "bg-[#7fd0a4] text-[#12301f]" : "text-[#f6f1e4] hover:text-white"
      }`}
    >
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
  return (
    <div className="inline-flex rounded-full bg-[#2a2e36] p-1">
      {item("business", "For Businesses", "Businesses")}
      {item("hoa", "For HOAs", "HOAs")}
    </div>
  );
}

/** A plain black bar that stays at the top of the screen. No scroll listeners, nothing that fades:
    it's the same bar everywhere, so it can't flicker or lag while you scroll. */
export function SiteHeader() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f6f1e4]/10 bg-[#14161a]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:py-4">
          <Link href="/new" className="flex items-center gap-2.5">
            <Image src="/shortlist-mint-mark.png" alt="" width={36} height={36} priority className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="hidden font-[family-name:var(--font-fraunces)] text-[19px] tracking-[-0.01em] text-[#f6f1e4] sm:inline">
              Shortlist Pass
            </span>
          </Link>
          <div>
            <AudienceToggle />
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href={APP_LOGIN_URL} className="hidden text-[14px] font-medium text-[#f6f1e4] hover:underline sm:inline">
              Sign in
            </a>
            <a
              href={APP_SIGNUP_URL}
              className="whitespace-nowrap rounded-full bg-[#7fd0a4] px-3.5 py-2 text-[12.5px] font-semibold text-[#12301f] transition-transform hover:-translate-y-px sm:px-4 sm:py-2.5 sm:text-[13px]"
            >
              Hire Shorty
            </a>
          </div>
        </div>
      </header>
      {/* holds the header's place at the top of the page */}
      <div aria-hidden="true" className="h-[60px] lg:h-[76px]" />
    </>
  );
}
