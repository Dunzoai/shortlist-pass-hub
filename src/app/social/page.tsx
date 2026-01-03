"use client";

import { motion } from "framer-motion";

// =============================================================================
// EDITORIAL SOCIAL PAGE - Luxury Creative Studio Style
// Fonts: Cormorant Garamond (serif), Inter (sans)
// Palette: Charcoal, near-black, warm off-white
// =============================================================================

// =============================================================================
// SECTION 1: HERO
// One strong headline, one supporting line, one positioning sentence
// =============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1c1c1e]">
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(244, 241, 236, 0.04) 0%, transparent 60%)",
        }}
      />

      {/* Decorative vertical lines */}
      <div className="absolute top-24 left-8 md:left-20 w-px h-16 bg-[#F4F1EC]/8" />
      <div className="absolute bottom-24 right-8 md:right-20 w-px h-16 bg-[#F4F1EC]/8" />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[11px] uppercase tracking-[0.35em] text-[#F4F1EC]/40 mb-10"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Social & Content Studio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="text-[38px] md:text-[52px] lg:text-[64px] font-light text-[#F4F1EC] leading-[1.08] mb-8 tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Presence, built with intention.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-[15px] md:text-[17px] text-[#F4F1EC]/55 leading-[1.7] max-w-lg mx-auto mb-6"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Strategic social media and content for businesses
          that want to be remembered — not just seen.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-[14px] text-[#F4F1EC]/35 tracking-wide"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Strategy. Content. Execution.
        </motion.p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-8 h-px bg-[#F4F1EC]/15" />
    </section>
  );
}

// =============================================================================
// SECTION 2: WHAT WE DO
// =============================================================================

function WhatWeDoSection() {
  return (
    <section className="py-28 md:py-36 bg-[#242426]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-[11px] uppercase tracking-[0.3em] text-[#F4F1EC]/35 mb-8"
            style={{ fontFamily: "var(--font-sans-inter)" }}
          >
            What We Do
          </p>

          <p
            className="text-[24px] md:text-[30px] lg:text-[36px] font-light text-[#F4F1EC]/90 leading-[1.45] tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Social strategy, content that resonates, and ongoing management
            with intention. Every post serves a purpose. Every story reinforces
            who you are.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 3: INTEREST MEDIA PHILOSOPHY (NEW)
// "How Visibility Works Now"
// =============================================================================

function InterestMediaSection() {
  return (
    <section className="py-28 md:py-36 bg-[#1c1c1e]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-[11px] uppercase tracking-[0.3em] text-[#F4F1EC]/35 mb-8"
            style={{ fontFamily: "var(--font-sans-inter)" }}
          >
            How Visibility Works Now
          </p>

          <h2
            className="text-[32px] md:text-[42px] lg:text-[50px] font-light text-[#F4F1EC] leading-[1.12] mb-10 tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Social isn't social anymore.
          </h2>

          <div className="space-y-6">
            <p
              className="text-[16px] md:text-[18px] text-[#F4F1EC]/55 leading-[1.75]"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Feeds are interest-driven now. People see what holds their attention,
              not what their friends posted. Follower count doesn't guarantee reach.
              A post with 50 followers can outperform one with 50,000 — if it resonates.
            </p>

            <p
              className="text-[16px] md:text-[18px] text-[#F4F1EC]/55 leading-[1.75]"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              This changes everything. Content has to earn its place. It has to be
              worth watching, worth sharing, worth remembering. That's what we build.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Subtle horizontal divider */}
      <div className="max-w-xl mx-auto mt-20">
        <div className="h-px bg-gradient-to-r from-transparent via-[#F4F1EC]/10 to-transparent" />
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 4: IMAGE SHAPE FEATURE
// Editorial shapes - asymmetrical layout
// =============================================================================

function ImageShapeSection() {
  return (
    <section className="py-24 md:py-32 bg-[#242426] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-5 mb-10 md:mb-0"
          >
            <h2
              className="text-[30px] md:text-[38px] font-light text-[#F4F1EC] leading-[1.15] mb-6 tracking-[-0.01em]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Content that
              <br />
              <em className="text-[#F4F1EC]/60 font-light">feels like you.</em>
            </h2>
            <p
              className="text-[15px] text-[#F4F1EC]/45 leading-[1.7]"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Your voice, your rhythm, your audience. Content that could only
              come from your brand — nothing templated, nothing generic.
            </p>
          </motion.div>

          {/* Right: Editorial image shapes */}
          <div className="col-span-12 md:col-span-7">
            <div className="relative h-[380px] md:h-[480px]">
              {/* Large circle - primary */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute top-0 right-0 w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full bg-[#2d2d30] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F4F1EC]/[0.03] to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[9px] uppercase tracking-[0.25em] text-[#F4F1EC]/20"
                    style={{ fontFamily: "var(--font-sans-inter)" }}
                  >
                    Photography
                  </span>
                </div>
              </motion.div>

              {/* Rounded rectangle - secondary */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="absolute bottom-0 left-0 w-[160px] h-[220px] md:w-[200px] md:h-[270px] rounded-[28px] bg-[#333336] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EC]/[0.03] to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[9px] uppercase tracking-[0.25em] text-[#F4F1EC]/20"
                    style={{ fontFamily: "var(--font-sans-inter)" }}
                  >
                    Video
                  </span>
                </div>
              </motion.div>

              {/* Small circle - accent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute bottom-16 right-12 md:right-20 w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-full bg-[#3a3a3d] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F4F1EC]/[0.04] to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[8px] uppercase tracking-[0.2em] text-[#F4F1EC]/20"
                    style={{ fontFamily: "var(--font-sans-inter)" }}
                  >
                    Graphics
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 5: SERVICES LIST
// Stacked, text-forward. Serif titles. Updated copy.
// =============================================================================

const services = [
  {
    title: "Social Media Management",
    description: "Content calendars, captions, community management. Consistent presence across platforms — handled.",
  },
  {
    title: "Content Creation",
    description: "Photography, graphics, and copy designed for the feed. Intentional work that earns attention.",
  },
  {
    title: "Short-Form Video",
    description: "Reels, TikToks, Stories. Motion that captures interest in the first second and keeps it.",
  },
  {
    title: "Paid Social",
    description: "Targeted campaigns with clear objectives. Ad spend managed with precision, not guesswork.",
  },
  {
    title: "Brand Voice & Strategy",
    description: "Before execution, clarity. A social identity that sounds like you and reaches who you want.",
  },
];

function ServicesSection() {
  return (
    <section className="py-28 md:py-36 bg-[#1c1c1e]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.3em] text-[#F4F1EC]/35 mb-20"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          Services
        </motion.p>

        <div className="space-y-20 md:space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <h3
                className="text-[26px] md:text-[32px] font-light text-[#F4F1EC] mb-4 tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-[15px] md:text-[16px] text-[#F4F1EC]/45 leading-[1.7] max-w-xl"
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
// SECTION 6: VISUAL RHYTHM (Shape Block)
// Subtle placeholder shapes before CTA
// =============================================================================

function VisualRhythmSection() {
  return (
    <section className="py-20 md:py-28 bg-[#242426] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative h-[200px] md:h-[280px] flex items-center justify-center">
          {/* Large rounded rectangle - left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="absolute left-0 md:left-12 w-[180px] h-[140px] md:w-[260px] md:h-[180px] rounded-[24px] bg-[#2a2a2c]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#F4F1EC]/[0.02] to-transparent rounded-[24px]" />
          </motion.div>

          {/* Circle - right offset */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="absolute right-4 md:right-20 w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full bg-[#333335]"
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-[#F4F1EC]/[0.02] to-transparent rounded-full" />
          </motion.div>

          {/* Small accent rectangle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-0 left-1/3 w-[80px] h-[60px] md:w-[100px] md:h-[80px] rounded-[16px] bg-[#3d3d40]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EC]/[0.02] to-transparent rounded-[16px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 7: SPLIT SECTION
// Left headline, right paragraph. Background shift.
// =============================================================================

function SplitSection() {
  return (
    <section className="py-28 md:py-36 bg-[#18181a]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2
              className="text-[34px] md:text-[44px] lg:text-[52px] font-light text-[#F4F1EC] leading-[1.1] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Showing up
              <br />
              <em className="text-[#F4F1EC]/50 font-light">is the strategy.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:pt-3"
          >
            <p
              className="text-[15px] md:text-[16px] text-[#F4F1EC]/50 leading-[1.75] mb-5"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              Most businesses don't fail at social because they lack creativity.
              They fail because they disappear. Consistency builds trust.
              Trust builds business.
            </p>
            <p
              className="text-[15px] md:text-[16px] text-[#F4F1EC]/70 leading-[1.75]"
              style={{ fontFamily: "var(--font-sans-inter)" }}
            >
              The ones who show up — keep showing up.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 8: CTA
// Minimal. Understated.
// =============================================================================

function CTASection() {
  return (
    <section className="py-32 md:py-40 bg-[#1c1c1e]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[30px] md:text-[40px] lg:text-[48px] font-light text-[#F4F1EC] leading-[1.15] mb-12 tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Let's build something that lasts.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href="mailto:hello@shortlistpass.com?subject=Social Inquiry"
            className="inline-flex items-center justify-center px-8 py-4 text-[14px] font-medium text-[#F4F1EC]/90 border border-[#F4F1EC]/20 rounded-full hover:bg-[#F4F1EC]/5 hover:border-[#F4F1EC]/35 transition-all duration-300"
            style={{ fontFamily: "var(--font-sans-inter)" }}
          >
            Start the conversation
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-[13px] text-[#F4F1EC]/25"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          hello@shortlistpass.com
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  return (
    <footer className="py-10 bg-[#18181a] border-t border-[#F4F1EC]/5">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-[12px] text-[#F4F1EC]/25"
          style={{ fontFamily: "var(--font-sans-inter)" }}
        >
          &copy; {new Date().getFullYear()} The Shortlist Co
        </span>
        <span
          className="text-[12px] text-[#F4F1EC]/25"
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
    <main className="pt-16">
      <HeroSection />
      <WhatWeDoSection />
      <InterestMediaSection />
      <ImageShapeSection />
      <ServicesSection />
      <VisualRhythmSection />
      <SplitSection />
      <CTASection />
      <Footer />
    </main>
  );
}
