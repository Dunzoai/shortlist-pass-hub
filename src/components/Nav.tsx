"use client";

import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold text-[#F4F6FA] hover:text-[#B08D57] transition-colors duration-300"
        >
          Shortlist Pass
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/social"
            className="text-sm text-[#A9B4C4] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#B08D57] hover:text-[#0B1220]"
          >
            Social
          </Link>
          <Link
            href="/smartpages"
            className="text-sm text-[#A9B4C4] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#B08D57] hover:text-[#0B1220]"
          >
            SmartPages
          </Link>
          <Link
            href="/digital"
            className="text-sm text-[#A9B4C4] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#B08D57] hover:text-[#0B1220]"
          >
            Digital
          </Link>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <a
            href="mailto:hello@shortlistpass.com"
            className="hidden sm:inline-flex px-6 py-2.5 text-sm font-semibold bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] hover:shadow-lg hover:shadow-[#B08D57]/20 transition-all duration-300"
          >
            Get a demo
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors"
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
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B1220]/95 backdrop-blur-md">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link
              href="/social"
              className="text-sm text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Social
            </Link>
            <Link
              href="/smartpages"
              className="text-sm text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              SmartPages
            </Link>
            <Link
              href="/digital"
              className="text-sm text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Digital
            </Link>
            <a
              href="mailto:hello@shortlistpass.com"
              className="sm:hidden inline-flex justify-center px-6 py-2.5 text-sm font-semibold bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-colors"
            >
              Get a demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
