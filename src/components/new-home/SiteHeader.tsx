"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
        audience === key ? "bg-[#7fd0a4] text-[#12301f]" : "text-[#f4efe3] hover:text-white"
      }`}
    >
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
  return (
    <div className="inline-flex rounded-full bg-[#1d1a16] p-1">
      {item("business", "For Businesses", "Businesses")}
      {item("hoa", "For HOAs", "HOAs")}
    </div>
  );
}

/** Follows you down the page: fades out while you scroll, fades back in when you stop.
    Over the hero it's clear; once you're down the page it gets a soft tan backing. */
const SETTLE_MS = 220;

export function SiteHeader() {
  const [scrolling, setScrolling] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    let id = 0;
    const onScroll = () => {
      setDown(window.scrollY > 12);
      if (window.scrollY <= 12) { setScrolling(false); return; }
      setScrolling(true);
      window.clearTimeout(id);
      id = window.setTimeout(() => setScrolling(false), SETTLE_MS);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.clearTimeout(id); };
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[opacity,translate,background-color,box-shadow] duration-300 ease-out ${
          scrolling ? "pointer-events-none -translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        } ${down ? "bg-[#f0e5cf]/90 shadow-[0_1px_0_rgba(29,26,22,.12)] backdrop-blur-md" : "bg-transparent"}`}
      >
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:py-4">
          <Link href="/new" className="flex items-center gap-2.5">
            <Image src="/shortlist-mint-mark.png" alt="" width={36} height={36} priority className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="hidden font-[family-name:var(--font-fraunces)] text-[19px] sm:inline tracking-[-0.01em] text-[#1d1a16]">
              Shortlist Pass
            </span>
          </Link>
          <div>
            <AudienceToggle />
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href={APP_LOGIN_URL} className="hidden text-[14px] font-medium text-[#1d1a16] hover:underline sm:inline">
              Sign in
            </a>
            <a
              href={APP_SIGNUP_URL}
              className="whitespace-nowrap rounded-full bg-[#1d1a16] px-3.5 py-2 text-[12.5px] font-semibold sm:px-4 sm:py-2.5 sm:text-[13px] text-[#fbf6e6] transition-transform hover:-translate-y-px"
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
