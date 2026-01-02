"use client";

import { motion } from "framer-motion";

// =============================================================================
// EDITORIAL SOCIAL PAGE - Luxury Creative Studio Style
// Calm, Confident, Minimal, Premium, Timeless
// =============================================================================

// =============================================================================
// SECTION 1: HERO
// Abstract texture, no photos, elegant serif headline, no buttons
// =============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#333333]">
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(244, 241, 236, 0.08) 0%, transparent 50%)",
        }}
      />

      {/* Decorative line elements */}
      <div className="absolute top-1/4 left-8 md:left-16 w-px h-24 bg-[#F4F1EC]/10" />
      <div className="absolute bottom-1/4 right-8 md:right-16 w-px h-24 bg-[#F4F1EC]/10" />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[11px] uppercase tracking-[0.3em] text-[#F4F1EC]/50 mb-8"
        >
          Social & Content Studio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-[36px] md:text-[48px] lg:text-[56px] font-normal text-[#F4F1EC] leading-[1.1] mb-8"
          style={{ fontFamily: "var(--font-libre-baskerville)" }}
        >
          We shape your presence.
          <br />
          <span className="text-[#F4F1EC]/60">We tell your story.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base md:text-lg text-[#F4F1EC]/60 leading-relaxed max-w-xl mx-auto"
        >
          Strategic social media and content creation for businesses
          that want to be remembered — not just seen.
        </motion.p>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-12 h-px bg-[#F4F1EC]/20" />
    </section>
  );
}

// =============================================================================
// SECTION 2: WHAT WE DO
// Simple section header, one concise paragraph
// =============================================================================

function WhatWeDoSection() {
  return (
    <section className="py-24 md:py-32 bg-[#2a2a2a]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#F4F1EC]/40 mb-6">
            What We Do
          </p>

          <p
            className="text-[22px] md:text-[28px] lg:text-[32px] font-normal text-[#F4F1EC]/90 leading-[1.4]"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
          >
            We develop social strategy, create content that resonates,
            and manage your presence with intention. Every post serves a purpose.
            Every story reinforces who you are.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 3: IMAGE SHAPE FEATURE
// Decorative placeholders with editorial shapes - asymmetrical layout
// =============================================================================

function ImageShapeSection() {
  return (
    <section className="py-20 md:py-28 bg-[#333333] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-5 mb-8 md:mb-0"
          >
            <h2
              className="text-[28px] md:text-[36px] font-normal text-[#F4F1EC] leading-[1.2] mb-6"
              style={{ fontFamily: "var(--font-libre-baskerville)" }}
            >
              Content that
              <br />
              <em className="text-[#F4F1EC]/70">feels like you.</em>
            </h2>
            <p className="text-base text-[#F4F1EC]/50 leading-relaxed">
              We learn your voice, your rhythm, your audience.
              Then we create content that could only come from your brand.
            </p>
          </motion.div>

          {/* Right: Editorial image shapes */}
          <div className="col-span-12 md:col-span-7">
            <div className="relative h-[400px] md:h-[500px]">
              {/* Large circle - primary shape */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute top-0 right-0 w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full bg-[#4a4a4a] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F4F1EC]/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#F4F1EC]/30">Photography</span>
                </div>
              </motion.div>

              {/* Rounded rectangle - secondary shape */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute bottom-0 left-0 w-[180px] h-[240px] md:w-[220px] md:h-[280px] rounded-[32px] bg-[#3d3d3d] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EC]/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#F4F1EC]/30">Video</span>
                </div>
              </motion.div>

              {/* Small circle - accent shape */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-20 right-16 md:right-24 w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full bg-[#555555] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F4F1EC]/8 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] uppercase tracking-[0.15em] text-[#F4F1EC]/30">Graphics</span>
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
// SECTION 4: SERVICES LIST
// Stacked, text-forward format. Serif titles. No icons. No cards.
// =============================================================================

const services = [
  {
    title: "Social Media Management",
    description: "Consistent, strategic posting across platforms. We handle the calendar, the captions, and the conversations — so you can focus on what you do best.",
  },
  {
    title: "Content Creation",
    description: "Photography, graphics, and copy that feel intentional. Every piece designed to stop the scroll and stay in memory.",
  },
  {
    title: "Short-Form Video",
    description: "Reels, TikToks, and Stories that capture attention in seconds. We bring your brand to life in motion.",
  },
  {
    title: "Paid Social",
    description: "Targeted campaigns that reach the right people. We manage your ad spend with precision and purpose.",
  },
  {
    title: "Brand Voice & Strategy",
    description: "Before we post, we listen. We develop a social identity that sounds like you — and resonates with who you want to reach.",
  },
];

function ServicesSection() {
  return (
    <section className="py-24 md:py-32 bg-[#2a2a2a]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.25em] text-[#F4F1EC]/40 mb-16 md:mb-20"
        >
          Services
        </motion.p>

        <div className="space-y-16 md:space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3
                className="text-[24px] md:text-[28px] font-normal text-[#F4F1EC] mb-4"
                style={{ fontFamily: "var(--font-libre-baskerville)" }}
              >
                {service.title}
              </h3>
              <p className="text-base md:text-lg text-[#F4F1EC]/50 leading-relaxed max-w-2xl">
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
// SECTION 5: SPLIT SECTION
// Left: serif headline. Right: supporting paragraph. Background shift.
// =============================================================================

function SplitSection() {
  return (
    <section className="py-24 md:py-32 bg-[#1c1c1e]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2
              className="text-[32px] md:text-[40px] lg:text-[48px] font-normal text-[#F4F1EC] leading-[1.15]"
              style={{ fontFamily: "var(--font-libre-baskerville)" }}
            >
              Showing up
              <br />
              <em className="text-[#F4F1EC]/60">is the strategy.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:pt-4"
          >
            <p className="text-base md:text-lg text-[#F4F1EC]/60 leading-relaxed mb-6">
              Most businesses don't fail at social because they lack creativity.
              They fail because they disappear. Consistency builds trust.
              Trust builds business.
            </p>
            <p className="text-base md:text-lg text-[#F4F1EC]/80 leading-relaxed">
              We make sure you never disappear.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 6: SIMPLE CTA FOOTER
// Minimal. One line of serif text. One understated button.
// =============================================================================

function CTASection() {
  return (
    <section className="py-28 md:py-36 bg-[#333333]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[28px] md:text-[36px] lg:text-[42px] font-normal text-[#F4F1EC] leading-[1.2] mb-10"
          style={{ fontFamily: "var(--font-libre-baskerville)" }}
        >
          Let's build something that lasts.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="mailto:hello@shortlistpass.com?subject=Social Inquiry"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-[#F4F1EC] border border-[#F4F1EC]/30 rounded-full hover:bg-[#F4F1EC]/10 hover:border-[#F4F1EC]/50 transition-all duration-300"
          >
            Start the conversation
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-sm text-[#F4F1EC]/30"
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
    <footer className="py-8 bg-[#2a2a2a] border-t border-[#F4F1EC]/5">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-[#F4F1EC]/30">
          &copy; {new Date().getFullYear()} The Shortlist Co
        </span>
        <span className="text-xs text-[#F4F1EC]/30">
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
      <ImageShapeSection />
      <ServicesSection />
      <SplitSection />
      <CTASection />
      <Footer />
    </main>
  );
}
