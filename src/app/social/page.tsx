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
import { useEffect, useRef } from "react";

// =============================================================================
// HAND-DRAWN UNDERLINE - Animated sketchy underline
// =============================================================================

function HandDrawnUnderline() {
  return (
    <motion.svg
      className="absolute -bottom-2 left-0 w-full h-3"
      viewBox="0 0 200 10"
      fill="none"
      preserveAspectRatio="none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/*
        Line 1: full width (100%), left to right
        Trace back to middle
        Drop + move left to start of line 2
        Line 2: 75% width, left to right
        Trace back to middle
        Drop + move left to start of line 3
        Line 3: 50% width, left to right
      */}
      <motion.path
        d="M5 2 C 50 1.5, 100 2.5, 150 2 C 180 1.5, 193 2, 195 2
           C 165 2, 135 2.5, 100 2
           C 70 3, 45 3.5, 29 4
           C 70 3.5, 120 4.5, 171 4
           C 145 4, 120 4, 100 4
           C 80 5, 65 5.5, 52 6
           C 80 5.5, 115 6.5, 147 6"
        stroke="#F2F0EC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 0.9,
            transition: { duration: 1, delay: 0.3, ease: "easeOut" }
          }
        }}
      />
    </motion.svg>
  );
}

// =============================================================================
// VIDEO NOISE COMPONENT - Flickering film grain effect
// =============================================================================

function VideoNoise({ opacity = 0.04 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 255;   // A
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(generateNoise);
    };

    resize();
    generateNoise();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none mix-blend-overlay"
      style={{ opacity }}
    />
  );
}

// =============================================================================
// SECTION 1: HERO
// Editorial serif statement, short paragraph, subtle CTA, no photography
// =============================================================================

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/social-page/social-hero.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0C]/70 via-[#0B0B0C]/60 to-[#0B0B0C]" />

        {/* Live video noise overlay - flickering film grain */}
        <VideoNoise opacity={0.07} />
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
    <section className="py-20 md:py-28 bg-[#333333]">
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
    <section className="relative min-h-[640px] md:min-h-[550px] lg:min-h-[600px] border-t border-[rgba(242,240,236,0.08)]">
      {/* Full-width background image - Desktop */}
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/social-page/what-we-do.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Full-width background image - Mobile */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/social-page/what-we-do-mobile.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Text content overlaying on the left negative space */}
      <div className="relative z-10 h-full">
        <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-[500px] lg:max-w-[550px]"
          >
            {/* Label */}
            <p
              className="text-[11px] uppercase tracking-[0.25em] text-[#222222]/60 mb-6 lg:mb-8"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              What We Do
            </p>

            {/* Large serif paragraph */}
            <p
              className="text-[20px] md:text-[24px] lg:text-[26px] font-normal text-[#222222]/90 leading-[1.55] tracking-[-0.005em] mb-8 lg:mb-12"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              We develop social strategy, create content that resonates,
              and manage your presence with intention. Every post serves a purpose.
              Every story reinforces who you are.
            </p>

            {/* Photography, Video, Graphics - Mobile (stacked) */}
            <div className="lg:hidden space-y-3">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-[13px] text-[#222222]/50 w-[90px] shrink-0"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Photography
                </span>
                <span
                  className="text-[13px] text-[#222222]/70"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Styled shoots that tell your story
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  className="text-[13px] text-[#222222]/50 w-[90px] shrink-0"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Video
                </span>
                <span
                  className="text-[13px] text-[#222222]/70"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Motion that captures attention
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  className="text-[13px] text-[#222222]/50 w-[90px] shrink-0"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Graphics
                </span>
                <span
                  className="text-[13px] text-[#222222]/70"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Designed for the feed
                </span>
              </div>
            </div>

            {/* Photography, Video, Graphics - Desktop (with lines) */}
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className="text-[14px] text-[#222222]/50 w-24 shrink-0"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Photography
                </span>
                <span className="flex-1 h-px bg-[#222222]/15" />
                <span
                  className="text-[14px] text-[#222222]/70"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Styled shoots that tell your story
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="text-[14px] text-[#222222]/50 w-24 shrink-0"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Video
                </span>
                <span className="flex-1 h-px bg-[#222222]/15" />
                <span
                  className="text-[14px] text-[#222222]/70"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Motion that captures attention
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="text-[14px] text-[#222222]/50 w-24 shrink-0"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  Graphics
                </span>
                <span className="flex-1 h-px bg-[#222222]/15" />
                <span
                  className="text-[14px] text-[#222222]/70"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Designed for the feed
                </span>
              </div>
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
    <section className="py-20 md:py-28 bg-[#333333]">
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
    <section className="py-20 md:py-28 bg-[#F2F0EC]">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.25em] text-[#222222]/50 mb-8"
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
          className="text-[28px] md:text-[36px] font-normal text-[#222222] leading-[1.25] tracking-[-0.01em] mb-8"
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
          className="text-[18px] md:text-[20px] text-[#222222]/70 leading-[1.8] max-w-2xl"
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
    <section className="py-20 md:py-28 bg-[#333333]">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[26px] md:text-[38px] font-normal text-[#F2F0EC] leading-[1.3] tracking-[-0.01em] mb-10"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="whitespace-nowrap">
            Let&apos;s work together.{" "}
            <span className="relative inline-block">
              <em className="italic">Reach out to us.</em>
              <HandDrawnUnderline />
            </span>
          </span>
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
          Contact
        </motion.a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 md:py-20 bg-[#333333]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
          {/* Column 1: Navigation Links */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block text-[16px] text-[#F2F0EC]/60 hover:text-[#F2F0EC]/90 underline underline-offset-4 transition-colors"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Home
            </Link>
            <Link
              href="/social"
              className="block text-[16px] text-[#F2F0EC]/60 hover:text-[#F2F0EC]/90 underline underline-offset-4 transition-colors"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Social
            </Link>
            <Link
              href="/smartpages"
              className="block text-[16px] text-[#F2F0EC]/60 hover:text-[#F2F0EC]/90 underline underline-offset-4 transition-colors"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              SmartPages
            </Link>
            <Link
              href="/digital"
              className="block text-[16px] text-[#F2F0EC]/60 hover:text-[#F2F0EC]/90 underline underline-offset-4 transition-colors"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Digital
            </Link>
          </div>

          {/* Column 2: Wordmark */}
          <div className="flex flex-col items-center justify-center">
            <p
              className="text-[22px] tracking-[0.25em] uppercase text-[#F2F0EC]/90 font-light"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              The Shortlist Co.
            </p>
            <p
              className="text-[28px] text-[#F2F0EC]/80 -mt-1 ml-[60px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              <em>Social</em>
            </p>
          </div>

          {/* Column 3: Contact Info + Socials */}
          <div className="text-left md:text-right space-y-3">
            <a
              href="mailto:hello@shortlistpass.com"
              className="block text-[16px] text-[#F2F0EC]/60 hover:text-[#F2F0EC]/90 underline underline-offset-4 transition-colors"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              hello@shortlistpass.com
            </a>
            <p
              className="text-[15px] text-[#F2F0EC]/50"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Monday-Thursday 9AM-5PM
            </p>
            <p
              className="text-[15px] text-[#F2F0EC]/50"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Friday 9AM-4PM
            </p>
            {/* Social Icons */}
            <div className="flex justify-start md:justify-end pt-2">
              <a
                href="https://instagram.com/shortlistpass"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F2F0EC]/50 hover:text-[#F2F0EC]/80 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
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
