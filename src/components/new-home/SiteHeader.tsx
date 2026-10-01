"use client";

import Link from "next/link";
import { useState } from "react";

export const APP_SIGNUP_URL = "https://app.shortlistpass.com/signup";
const APP_LOGIN_URL = "https://app.shortlistpass.com/login";

/** The Shortlist ticket mark: the same check-ticket Shorty wears, on green. */
export function ShortlistMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="23 77 80 80" className={className} aria-hidden="true">
      <rect x="23" y="77" width="80" height="80" rx="18" fill="#8cc3a1" />
      <path d="M82 104 V150 H42 V90 A20 20 0 0 1 81 85" fill="none" stroke="#fbf6e6" strokeWidth="6" transform="translate(63 117) scale(.72) translate(-63 -117)" />
      <path d="M50 113 L59.5 123.5 L84 93" fill="none" stroke="#fbf6e6" strokeWidth="6.4" strokeLinecap="square" transform="translate(63 117) scale(.72) translate(-63 -117)" />
    </svg>
  );
}

function AudienceToggle() {
  const [audience, setAudience] = useState<"business" | "hoa">("business");
  const item = (key: typeof audience, label: string) => (
    <button
      type="button"
      onClick={() => setAudience(key)}
      aria-pressed={audience === key}
      className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors sm:px-5 ${
        audience === key ? "bg-[#7fd0a4] text-[#12301f]" : "text-[#f4efe3] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex rounded-full bg-[#1d1a16] p-1">
      {item("business", "For Businesses")}
      {item("hoa", "For HOAs")}
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 pt-5 sm:px-8 lg:pt-7">
        <Link href="/new" className="flex items-center gap-2.5">
          <ShortlistMark className="h-8 w-8" />
          <span className="font-[family-name:var(--font-fraunces)] text-[19px] tracking-[-0.01em] text-[#1d1a16]">
            Shortlist Pass
          </span>
        </Link>
        <div className="hidden lg:block">
          <AudienceToggle />
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <a href={APP_LOGIN_URL} className="hidden text-[14px] font-medium text-[#1d1a16] hover:underline sm:inline">
            Sign in
          </a>
          <a
            href={APP_SIGNUP_URL}
            className="rounded-full bg-[#1d1a16] px-4 py-2.5 text-[13px] font-semibold text-[#fbf6e6] transition-transform hover:-translate-y-px"
          >
            Hire Shorty
          </a>
        </div>
      </div>
      <div className="mt-4 flex justify-center lg:hidden">
        <AudienceToggle />
      </div>
    </header>
  );
}
