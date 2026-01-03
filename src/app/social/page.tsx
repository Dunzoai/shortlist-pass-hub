"use client";

/**
 * /social page - Editorial Studio Style
 * Inspired by sagesocial.co, aligned to The Shortlist Co brand
 *
 * LOCKED STRUCTURE:
 * 1. Hero
 * 2. Interest Media (immediately after hero)
 * 3. What We Do (with image shapes)
 * 4. Services (vertical text list - NO cards)
 * 5. Showing Up
 * 6. CTA Band + Footer
 */

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// =============================================================================
// SECTION 1: HERO
// Editorial serif statement, short paragraph, subtle CTA, no photography
// =============================================================================

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 min-h-[85vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/social-page/social-hero.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0C]/70 via-[#0B0B0C]/60 to-[#0B0B0C]/90" />
      </div>

      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          {/* Label */}
          <p
            className="text-[11px] uppercase tracking-[0.25em] text-[#F2F0EC]/45 mb-10"
            style={{ fontFamily: "var(--font-sans-inter)" }}
          >
            Social & Content Studio
          </p>

          {/* Editorial serif statement */}
          <h1
            className="text-[32px] md:text-[42px] lg:text-[50px] font-normal text-[#F2F0EC] leading-[1.2] tracking-[-0.015em] mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            We tell your <em className="italic">story</em>.
            <br />
            We create your <em className="italic">content</em>.
            <br />
            We build your <em className="italic">brand</em>.
          </h1>

          {/* Supporting paragraph */}
          <p
            className="text-[18px] md:text-[20px] text-[#F2F0EC]/65 leading-[1.8] max-w-xl mx-auto mb-10"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Strategic social media and content creation for businesses
            that want to be remembered — not just seen.
          </p>

          {/* Subtle CTA */}
          <a
            href="mailto:hello@shortlistpass.com?subject=Social Inquiry"
            className="inline-block text-[13px] uppercase tracking-[0.15em] text-[#F2F0EC]/50 hover:text-[#F2F0EC]/80 transition-colors duration-300 border-b border-[#F2F0EC]/20 hover:border-[#F2F0EC]/40 pb-1"
            style={{ fontFamily: "var(--font-sans-inter)" }}
          >
            Start a conversation
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 2: INTEREST MEDIA (IMMEDIATELY AFTER HERO)
// =============================================================================

function InterestMediaSection() {
  return (
    <section className="py-20 md:py-28 border-t border-[rgba(242,240,236,0.08)]">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.25em] text-[#F2F0EC]/45 mb-8"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          How Visibility Works Now
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[28px] md:text-[36px] font-normal text-[#F2F0EC] leading-[1.25] tracking-[-0.01em] mb-10"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Social isn't social anymore.
        </motion.h2>

        {/* Two paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 mb-14"
        >
          <p
            className="text-[18px] md:text-[20px] text-[#F2F0EC]/65 leading-[1.8]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Feeds are interest-driven now. People see what holds their attention,
            not what their friends posted. Follower count doesn't guarantee reach —
            a post with 50 followers can outperform one with 50,000.
          </p>
          <p
            className="text-[18px] md:text-[20px] text-[#F2F0EC]/65 leading-[1.8]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            This changes everything. Content has to earn its place.
            It has to be worth watching, worth sharing, worth remembering.
          </p>
        </motion.div>

        {/* 4 subtle bullets */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {[
            "Hooks that capture in the first half-second",
            "Watch time that signals value to the platform",
            "Saves and shares that extend reach organically",
            "Consistent brand presence across every post",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="text-[#F2F0EC]/30 mt-1">—</span>
              <span
                className="text-[16px] md:text-[17px] text-[#F2F0EC]/55 leading-relaxed"
                style={{ fontFamily: "var(--font-sans-inter)" }}
              >
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 3: WHAT WE DO
// Left: label + large serif paragraph
// Right: asymmetrical image-shape placeholders
// Below: Photography, Video, Graphics lines
// =============================================================================

function WhatWeDoSection() {
  return (
    <section className="py-20 md:py-28 border-t border-[rgba(242,240,236,0.08)]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Label */}
            <p
              className="text-[11px] uppercase tracking-[0.25em] text-[#F2F0EC]/45 mb-8"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              What We Do
            </p>

            {/* Large serif paragraph */}
            <p
              className="text-[22px] md:text-[26px] font-normal text-[#F2F0EC]/85 leading-[1.55] tracking-[-0.005em] mb-12"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              We develop social strategy, create content that resonates,
              and manage your presence with intention. Every post serves a purpose.
              Every story reinforces who you are.
            </p>

            {/* Photography, Video, Graphics lines */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className="text-[14px] text-[#F2F0EC]/40 w-24"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Photography
                </span>
                <span className="flex-1 h-px bg-[rgba(242,240,236,0.1)]" />
                <span
                  className="text-[14px] text-[#F2F0EC]/55"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Styled shoots that tell your story
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="text-[14px] text-[#F2F0EC]/40 w-24"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Video
                </span>
                <span className="flex-1 h-px bg-[rgba(242,240,236,0.1)]" />
                <span
                  className="text-[14px] text-[#F2F0EC]/55"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Motion that captures attention
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="text-[14px] text-[#F2F0EC]/40 w-24"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Graphics
                </span>
                <span className="flex-1 h-px bg-[rgba(242,240,236,0.1)]" />
                <span
                  className="text-[14px] text-[#F2F0EC]/55"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Designed for the feed
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Image (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/social-page/what-we-do.png"
                alt="Content creation showcase"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Mobile: Image below text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:hidden"
          >
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src="/social-page/what-we-do-mobile.png"
                alt="Content creation showcase"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 4: SERVICES
// Vertical text list - NO cards, NO borders, NO grids
// =============================================================================

const services = [
  {
    title: "Social Media Management",
    description: "Content calendars, captions, community management. Consistent presence handled with intention.",
  },
  {
    title: "Content Creation",
    description: "Photography, graphics, and copy designed for the feed. Work that earns attention.",
  },
  {
    title: "Short-Form Video",
    description: "Reels, TikToks, Stories. Motion that captures interest in the first second.",
  },
  {
    title: "Paid Social",
    description: "Targeted campaigns with clear objectives. Ad spend managed with precision.",
  },
  {
    title: "Brand Voice & Strategy",
    description: "A social identity that sounds like you and reaches who you want.",
  },
];

function ServicesSection() {
  return (
    <section className="py-20 md:py-28 border-t border-[rgba(242,240,236,0.08)]">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.25em] text-[#F2F0EC]/45 mb-16"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Services
        </motion.p>

        {/* Vertical text list - NO cards */}
        <div className="space-y-14">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <h3
                className="text-[22px] md:text-[26px] font-normal text-[#F2F0EC] mb-3 tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-[17px] md:text-[18px] text-[#F2F0EC]/55 leading-[1.7]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 5: SHOWING UP IS THE STRATEGY
// =============================================================================

function ShowingUpSection() {
  return (
    <section className="py-20 md:py-28 border-t border-[rgba(242,240,236,0.08)]">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.25em] text-[#F2F0EC]/45 mb-8"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Consistency Wins
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[28px] md:text-[36px] font-normal text-[#F2F0EC] leading-[1.25] tracking-[-0.01em] mb-8"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Showing up is the <em className="italic">strategy</em>.
        </motion.h2>

        {/* Tightened copy */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[18px] md:text-[20px] text-[#F2F0EC]/65 leading-[1.8] max-w-2xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Most businesses don't fail at social because they lack creativity.
          They fail because they disappear. Consistency builds trust.
          The ones who show up — keep showing up.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 6: CTA BAND + FOOTER
// =============================================================================

function CTABand() {
  return (
    <section className="py-20 md:py-28 border-t border-[rgba(242,240,236,0.08)] bg-[#0e0e10]">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[26px] md:text-[34px] font-normal text-[#F2F0EC] leading-[1.3] tracking-[-0.01em] mb-10"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Let's build something that lasts.
        </motion.h2>

        <motion.a
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          href="mailto:hello@shortlistpass.com?subject=Social Inquiry"
          className="inline-flex items-center justify-center px-8 py-4 text-[13px] uppercase tracking-[0.15em] font-medium text-[#F2F0EC] bg-[#1f1f21] hover:bg-[#2a2a2c] rounded-sm transition-colors duration-300"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Start the Conversation
        </motion.a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 border-t border-[rgba(242,240,236,0.06)]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Links */}
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.2em] text-[#F2F0EC]/35 mb-6"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Navigate
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-[14px] text-[#F2F0EC]/50 hover:text-[#F2F0EC]/80 transition-colors"
                style={{ fontFamily: "var(--font-sans-inter)" }}
              >
                Home
              </Link>
              <Link
                href="/social"
                className="block text-[14px] text-[#F2F0EC]/50 hover:text-[#F2F0EC]/80 transition-colors"
                style={{ fontFamily: "var(--font-sans-inter)" }}
              >
                Social
              </Link>
              <Link
                href="/smartpages"
                className="block text-[14px] text-[#F2F0EC]/50 hover:text-[#F2F0EC]/80 transition-colors"
                style={{ fontFamily: "var(--font-sans-inter)" }}
              >
                SmartPages
              </Link>
              <Link
                href="/digital"
                className="block text-[14px] text-[#F2F0EC]/50 hover:text-[#F2F0EC]/80 transition-colors"
                style={{ fontFamily: "var(--font-sans-inter)" }}
              >
                Digital
              </Link>
            </div>
          </div>

          {/* Column 2: Wordmark */}
          <div className="flex flex-col items-center justify-center">
            <p
              className="text-[18px] text-[#F2F0EC]/70"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              The Shortlist Co
            </p>
            <p
              className="text-[12px] text-[#F2F0EC]/35 mt-2"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Social & Content Studio
            </p>
          </div>

          {/* Column 3: Contact + Socials */}
          <div className="text-right">
            <p
              className="text-[11px] uppercase tracking-[0.2em] text-[#F2F0EC]/35 mb-6"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Contact
            </p>
            <a
              href="mailto:hello@shortlistpass.com"
              className="block text-[14px] text-[#F2F0EC]/50 hover:text-[#F2F0EC]/80 transition-colors mb-4"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              hello@shortlistpass.com
            </a>
            <div className="flex justify-end gap-4">
              <a
                href="https://instagram.com/theshortlistco"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#F2F0EC]/40 hover:text-[#F2F0EC]/70 transition-colors"
                style={{ fontFamily: "var(--font-sans-inter)" }}
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com/company/theshortlistco"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#F2F0EC]/40 hover:text-[#F2F0EC]/70 transition-colors"
                style={{ fontFamily: "var(--font-sans-inter)" }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-[rgba(242,240,236,0.05)] text-center">
          <p
            className="text-[12px] text-[#F2F0EC]/25"
            style={{ fontFamily: "var(--font-sans-inter)" }}
          >
            &copy; {new Date().getFullYear()} The Shortlist Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SocialPage() {
  return (
    <main
      className="pt-16 bg-[#0B0B0C] min-h-screen"
      style={{
        backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(242,240,236,0.02) 0%, transparent 50%)",
      }}
    >
      {/* Subtle noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <HeroSection />
        <InterestMediaSection />
        <WhatWeDoSection />
        <ServicesSection />
        <ShowingUpSection />
        <CTABand />
        <Footer />
      </div>
    </main>
  );
}
