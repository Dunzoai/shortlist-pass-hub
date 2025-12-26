"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-[#1A1F24] hover:text-[#2B3A44] transition-colors duration-300"
        >
          <Image
            src="/shortlist-logo-slate-blue.png"
            alt="The Shortlist Co"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          The Shortlist Co
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/social"
            className="text-sm text-[#5A6570] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#2B3A44] hover:text-[#F4F1EC]"
          >
            Social
          </Link>
          <Link
            href="/smartpages"
            className="text-sm text-[#5A6570] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#2B3A44] hover:text-[#F4F1EC]"
          >
            SmartPages
          </Link>
          <Link
            href="/digital"
            className="text-sm text-[#5A6570] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#2B3A44] hover:text-[#F4F1EC]"
          >
            Digital
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#5A6570] hover:text-[#1A1F24] transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#F4F1EC]/95 backdrop-blur-md">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link
              href="/social"
              className="text-sm text-[#5A6570] hover:text-[#1A1F24] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Social
            </Link>
            <Link
              href="/smartpages"
              className="text-sm text-[#5A6570] hover:text-[#1A1F24] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              SmartPages
            </Link>
            <Link
              href="/digital"
              className="text-sm text-[#5A6570] hover:text-[#1A1F24] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Digital
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
