"use client";

import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2B3A44]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold text-[#F4F1EC] hover:text-[#F4F1EC]/70 transition-colors duration-300"
        >
          The Shortlist Co
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/social"
            className="text-sm text-[#F4F1EC] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#5A6570] hover:text-[#F4F1EC]"
          >
            Social
          </Link>
          <Link
            href="/smartpages"
            className="text-sm text-[#F4F1EC] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#5A6570] hover:text-[#F4F1EC]"
          >
            SmartPages
          </Link>
          <Link
            href="/digital"
            className="text-sm text-[#F4F1EC] px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#5A6570] hover:text-[#F4F1EC]"
          >
            Digital
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#F4F1EC] hover:text-[#F4F1EC]/70 transition-colors"
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
        <div className="md:hidden border-t border-[#F4F1EC]/10 bg-[#2B3A44]">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link
              href="/social"
              className="text-sm text-[#F4F1EC] hover:text-[#F4F1EC]/70 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Social
            </Link>
            <Link
              href="/smartpages"
              className="text-sm text-[#F4F1EC] hover:text-[#F4F1EC]/70 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              SmartPages
            </Link>
            <Link
              href="/digital"
              className="text-sm text-[#F4F1EC] hover:text-[#F4F1EC]/70 transition-colors"
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
