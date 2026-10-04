"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAudience, type Audience } from "./audience";

export const APP_SIGNUP_URL = "https://app.shortlistpass.com/signup";
export const APP_FREE_URL = "https://app.shortlistpass.com/freeshorty";
const APP_LOGIN_URL = "https://app.shortlistpass.com/login";

function AudienceToggle() {
  const { audience, setAudience } = useAudience();
  const item = (key: Audience, label: string, short: string) => (
    <button
      type="button"
      onClick={() => setAudience(key)}
      aria-pressed={audience === key}
      className={`rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-colors sm:px-5 sm:py-2 sm:text-[13px] ${
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


/** A small menu for the old site's pages (Social, Digital), temporary until they're folded in. */
function MoreMenu() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onDown); };
  }, [open]);
  const item = "block rounded-lg px-4 py-2.5 text-[15px] font-medium text-[#f6f1e4] hover:bg-[#2a2e36]";
  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="More pages"
        aria-expanded={open}
        aria-haspopup="true"
        className="-mr-1 grid h-9 w-9 place-items-center rounded-full text-[#f6f1e4] hover:bg-[#2a2e36]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+10px)] w-44 rounded-xl border border-[#f6f1e4]/10 bg-[#14161a] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,.45)]">
          <Link role="menuitem" href="/social" className={item} onClick={() => setOpen(false)}>Social</Link>
          <Link role="menuitem" href="/digital" className={item} onClick={() => setOpen(false)}>Digital</Link>
        </div>
      )}
    </div>
  );
}

/** A plain black bar that stays at the top of the screen. No scroll listeners, nothing that fades:
    it's the same bar everywhere, so it can't flicker or lag while you scroll. */
export function SiteHeader() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f6f1e4]/10 bg-[#14161a]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-2 px-4 py-3 sm:px-8 lg:py-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image src="/shortlist-mint-mark.png" alt="" width={36} height={36} priority className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="hidden font-[family-name:var(--font-fraunces)] text-[19px] tracking-[-0.01em] text-[#f6f1e4] sm:inline">
              Shortlist Pass
            </span>
          </Link>
          <div>
            <AudienceToggle />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-5">
            <a href={APP_LOGIN_URL} className="hidden text-[14px] font-medium text-[#f6f1e4] hover:underline sm:inline">
              Sign in
            </a>
            <a
              href={APP_SIGNUP_URL}
              className="whitespace-nowrap rounded-full bg-[#7fd0a4] px-3 py-2 text-[12.5px] font-semibold text-[#12301f] transition-transform hover:-translate-y-px sm:px-4 sm:py-2.5 sm:text-[13px]"
            >
              Hire Shorty
            </a>
            <MoreMenu />
          </div>
        </div>
      </header>
      {/* holds the header's place at the top of the page */}
      <div aria-hidden="true" className="h-[60px] lg:h-[76px]" />
    </>
  );
}
