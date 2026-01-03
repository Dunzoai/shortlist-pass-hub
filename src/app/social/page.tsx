"use client";

/**
 * /social page - Editorial Studio Style (Sage Social inspired)
 *
 * FONT NOTE: To match Sage exactly, replace Cormorant_Garamond with licensed
 * font WOFF2 files and switch to next/font/local. Current implementation uses
 * Google Fonts as a fallback.
 *
 * Typography scale:
 * - Labels: 12px uppercase tracking-wide
 * - Hero lines: 52-64px desktop, 34-42px mobile
 * - Body serif: 20-22px desktop, 18-20px mobile
 * - Section headlines: 36-44px desktop, 28-34px mobile
 */

import { motion } from "framer-motion";

// =============================================================================
// BRAND COLORS (charcoal/black theme)
// =============================================================================
// Background: #0B0B0C
// Surface: #111113
// Text primary: #F2F0EC
// Text secondary: rgba(242,240,236,0.70)
// Hairline: rgba(242,240,236,0.10)
// Button: #2A2A2C → hover #333336

// =============================================================================
// IMAGE SHAPE PLACEHOLDER COMPONENT
// Overlapping rectangle + circle like Sage
// =============================================================================

function ImageShapePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Rectangle placeholder */}
      <div
        className="w-[280px] h-[360px] md:w-[340px] md:h-[440px] bg-[#1a1a1c] rounded-sm"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Inner texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(242,240,236,0.03) 0%, transparent 50%, rgba(242,240,236,0.02) 100%)",
          }}
        />
      </div>

      {/* Circle placeholder - overlapping */}
      <div
        className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full bg-[#232325] border border-[rgba(242,240,236,0.08)]"
        style={{
          boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(242,240,236,0.04) 0%, transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// ABSTRACT HERO GRAPHIC
// =============================================================================

function HeroGraphic() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px]">
      {/* Main rectangle */}
      <div
        className="absolute right-0 top-0 w-[240px] h-[300px] md:w-[320px] md:h-[380px] bg-[#131315] rounded-sm"
        style={{
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: "linear-gradient(160deg, rgba(242,240,236,0.02) 0%, transparent 40%)",
          }}
        />
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Overlapping circle */}
      <div
        className="absolute left-0 bottom-0 w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-full bg-[#1e1e20] border border-[rgba(242,240,236,0.06)]"
        style={{
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, rgba(242,240,236,0.03) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Small accent rectangle */}
      <div
        className="absolute right-16 md:right-24 bottom-8 w-[80px] h-[100px] md:w-[100px] md:h-[120px] bg-[#191919] rounded-sm"
        style={{
          boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

// =============================================================================
// SECTION 1: HERO
// =============================================================================

function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Label */}
            <p
              className="text-[12px] uppercase tracking-[0.2em] text-[#F2F0EC]/50 mb-8"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Social & Content Studio
            </p>

            {/* Hero serif lines - Sage style */}
            <h1
              className="text-[34px] md:text-[44px] lg:text-[52px] font-normal text-[#F2F0EC] leading-[1.15] tracking-[-0.01em] mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              We tell your <em className="italic">story</em>.
              <br />
              We create your <em className="italic">content</em>.
              <br />
              We build your <em className="italic">brand</em>.
            </h1>

            {/* Supporting paragraph - large serif body */}
            <p
              className="text-[18px] md:text-[20px] text-[#F2F0EC]/70 leading-[1.7] mb-10 max-w-lg"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Strategic social media and content creation for businesses
              that want to be remembered — not just seen.
            </p>

            {/* CTA Button */}
            <a
              href="mailto:hello@shortlistpass.com?subject=Social Inquiry"
              className="inline-flex items-center justify-center px-8 py-4 text-[13px] uppercase tracking-[0.15em] font-medium text-[#F2F0EC] bg-[#2A2A2C] hover:bg-[#333336] rounded-sm transition-colors duration-300"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Start the Conversation
            </a>
          </motion.div>

          {/* Right: Abstract graphic */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <HeroGraphic />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 2: INTEREST MEDIA (NEW)
// =============================================================================

function InterestMediaSection() {
  return (
    <section className="py-24 md:py-32 border-t border-[rgba(242,240,236,0.08)]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        <div className="max-w-3xl">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[12px] uppercase tracking-[0.2em] text-[#F2F0EC]/50 mb-8"
            style={{ fontFamily: "var(--font-sans-inter)" }}
          >
            The Shift
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[28px] md:text-[36px] lg:text-[42px] font-normal text-[#F2F0EC] leading-[1.2] tracking-[-0.01em] mb-10"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Social isn't social anymore.
          </motion.h2>

          {/* Body paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 mb-12"
          >
            <p
              className="text-[18px] md:text-[20px] text-[#F2F0EC]/70 leading-[1.75]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Feeds are interest-driven now. People see what holds their attention,
              not what their friends posted. Follower count doesn't guarantee reach —
              a post with 50 followers can outperform one with 50,000.
            </p>
            <p
              className="text-[18px] md:text-[20px] text-[#F2F0EC]/70 leading-[1.75]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              This changes everything. Content has to earn its place.
              It has to be worth watching, worth sharing, worth remembering.
            </p>
          </motion.div>

          {/* Bullet points */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              "Hooks that capture in 0.5 seconds",
              "Watch time that signals value",
              "Saves and shares that extend reach",
              "Consistent brand vibe across every post",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 py-3 px-4 border border-[rgba(242,240,236,0.08)] rounded-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#F2F0EC]/40 mt-2 flex-shrink-0" />
                <span
                  className="text-[15px] text-[#F2F0EC]/60 leading-relaxed"
                  style={{ fontFamily: "var(--font-sans-inter)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 3: WHAT WE DO (Sage-style: big serif body)
// =============================================================================

function WhatWeDoSection() {
  return (
    <section className="py-24 md:py-32 border-t border-[rgba(242,240,236,0.08)] bg-[#111113]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Label */}
            <p
              className="text-[12px] uppercase tracking-[0.2em] text-[#F2F0EC]/50 mb-8"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              What We Do
            </p>

            {/* Big serif body - this IS the main content, not a headline */}
            <p
              className="text-[22px] md:text-[26px] lg:text-[30px] font-normal text-[#F2F0EC]/90 leading-[1.5] tracking-[-0.005em] mb-10"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              We help you achieve a successful brand presence on social media
              through thoughtful strategy and professional <em className="italic">content creation</em>.
            </p>

            {/* CTA Button */}
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 text-[13px] uppercase tracking-[0.15em] font-medium text-[#F2F0EC] bg-[#2A2A2C] hover:bg-[#333336] rounded-sm transition-colors duration-300"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              View Services
            </a>
          </motion.div>

          {/* Right: Image shape placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <ImageShapePlaceholder />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 4: SERVICES LIST
// =============================================================================

const services = [
  {
    title: "Social Media Management",
    description: "Content calendars, captions, and community management. Consistent presence across platforms, handled with care.",
  },
  {
    title: "Content Creation",
    description: "Photography, graphics, and copy designed for the feed. Intentional work that earns attention.",
  },
  {
    title: "Short-Form Video",
    description: "Reels, TikToks, and Stories. Motion that captures interest in the first second.",
  },
  {
    title: "Paid Social",
    description: "Targeted campaigns with clear objectives. Ad spend managed with precision.",
  },
  {
    title: "Brand Voice & Strategy",
    description: "Before execution, clarity. A social identity that sounds like you.",
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 border-t border-[rgba(242,240,236,0.08)]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        {/* Section title */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[12px] uppercase tracking-[0.2em] text-[#F2F0EC]/50 mb-16"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Services
        </motion.p>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-8 border border-[rgba(242,240,236,0.08)] rounded-sm hover:border-[rgba(242,240,236,0.15)] transition-colors duration-300"
            >
              <h3
                className="text-[20px] md:text-[22px] font-normal text-[#F2F0EC] mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-[15px] md:text-[16px] text-[#F2F0EC]/55 leading-[1.7]"
                style={{ fontFamily: "var(--font-sans-inter)" }}
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
// SECTION 5: CLOSER / CTA
// =============================================================================

function CloserSection() {
  return (
    <section className="py-24 md:py-32 border-t border-[rgba(242,240,236,0.08)] bg-[#111113]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[12px] uppercase tracking-[0.2em] text-[#F2F0EC]/50 mb-8"
            style={{ fontFamily: "var(--font-sans-inter)" }}
          >
            Consistency Wins
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[28px] md:text-[36px] lg:text-[42px] font-normal text-[#F2F0EC] leading-[1.2] tracking-[-0.01em] mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Showing up is the <em className="italic">strategy</em>.
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[18px] md:text-[20px] text-[#F2F0EC]/70 leading-[1.75] mb-12"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Most businesses don't fail at social because they lack creativity.
            They fail because they disappear. Consistency builds trust.
            Trust builds business. The ones who show up — keep showing up.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <a
              href="mailto:hello@shortlistpass.com?subject=Social Inquiry"
              className="inline-flex items-center justify-center px-8 py-4 text-[13px] uppercase tracking-[0.15em] font-medium text-[#F2F0EC] bg-[#2A2A2C] hover:bg-[#333336] rounded-sm transition-colors duration-300"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Let's Talk
            </a>
            <span
              className="text-[14px] text-[#F2F0EC]/40"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              hello@shortlistpass.com
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  return (
    <footer className="py-10 border-t border-[rgba(242,240,236,0.06)]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-[12px] text-[#F2F0EC]/30"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          &copy; {new Date().getFullYear()} The Shortlist Co
        </span>
        <span
          className="text-[12px] text-[#F2F0EC]/30"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Social & Content Studio
        </span>
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
        // Subtle vignette effect
        backgroundImage: "radial-gradient(ellipse at 50% 0%, transparent 0%, #0B0B0C 70%)",
      }}
    >
      {/* Noise overlay for texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <HeroSection />
        <InterestMediaSection />
        <WhatWeDoSection />
        <ServicesSection />
        <CloserSection />
        <Footer />
      </div>
    </main>
  );
}
