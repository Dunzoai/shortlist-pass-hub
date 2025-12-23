"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const wipeInVariant = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

// =============================================================================
// SECTION 1: HERO
// =============================================================================

function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Grid moves at 3-5% slower than content (parallax)
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center py-20 lg:py-28 overflow-hidden">
      {/* Dark navy background */}
      <div className="absolute inset-0 bg-[#0B1220]" />

      {/* Grid background - static with subtle scroll parallax */}
      <motion.div
        className="absolute inset-[-10%] opacity-[0.6] pointer-events-none"
        style={{
          backgroundImage: "url(/grid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          y: gridY,
        }}
      />

      {/* Slow diagonal light sweep - subtle depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent 0%, transparent 40%, rgba(176, 141, 87, 0.08) 50%, transparent 60%, transparent 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold text-[#F4F6FA] leading-[1.1] mb-6"
          >
            Websites & apps built from scratch — for how your business actually works.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#A9B4C4] leading-relaxed mb-6 max-w-2xl mx-auto"
          >
            Most digital tools weren&apos;t built for real businesses. We design and build custom websites and apps that remove friction, save time, and make running your business easier — not harder.
          </motion.p>

          {/* Emphasis phrases - slap in from left, landing one by one */}
          <div className="flex justify-center gap-x-2 mb-10 whitespace-nowrap">
            <motion.span
              initial={{ opacity: 0, x: -150, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-base text-[#B08D57] font-medium"
            >
              No guessing.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -150, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-base text-[#B08D57] font-medium"
            >
              No shortcuts.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -150, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-base text-[#B08D57] font-medium"
            >
              No templates.
            </motion.span>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="mailto:hello@shortlistpass.com?subject=Project consult"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-all duration-300"
            >
              Book a project consult
            </a>
            <a
              href="#real-builds"
              className="text-sm text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors duration-300 py-3.5"
            >
              See what we&apos;ve built
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 2: HARD LINE (BEAT THE DRUM)
// =============================================================================

function HardLineSection() {
  return (
    <section className="relative py-28 lg:py-40 bg-gradient-to-b from-[#a38542] via-[#d4b87f] to-[#c9a46a] overflow-hidden">
      {/* Grain texture - adds material feel */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ghost grid on right side - balances empty space */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[45%] opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "url(/grid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          maskImage: "linear-gradient(to right, transparent, black 40%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 40%)",
        }}
      />

      <Container>
        <div className="max-w-4xl relative">
          {/* Vertical rhythm anchor - frames the statements */}
          <div className="absolute left-0 top-2 bottom-8 w-[2px] bg-[#0B1220]/15 -ml-6 md:-ml-10" />

          {/* Lines 1-3: Rules/principles - read quickly */}
          <div className="space-y-3 md:space-y-4 mb-12 md:mb-16">
            <p className="text-[1.5rem] md:text-[2rem] lg:text-[2.375rem] font-medium text-[#0B1220]/90 leading-[1.15]">
              We don&apos;t use templates.
            </p>
            <p className="text-[1.5rem] md:text-[2rem] lg:text-[2.375rem] font-medium text-[#0B1220]/90 leading-[1.15]">
              We don&apos;t reuse layouts.
            </p>
            <p className="text-[1.5rem] md:text-[2rem] lg:text-[2.375rem] font-medium text-[#0B1220]/90 leading-[1.15]">
              We don&apos;t force your business into someone else&apos;s system.
            </p>
          </div>

          {/* Final line: Brand positioning - dominates */}
          <div className="relative inline-block">
            <p
              className="text-[1.875rem] md:text-[3rem] lg:text-[3.5rem] font-bold text-[#0B1220] leading-[1.1] whitespace-nowrap"
              style={{ letterSpacing: "-0.005em" }}
            >
              We build around you.
            </p>
            {/* Editorial underline - full text width plus slight overhang */}
            <div className="mt-3 w-[103%] h-[2px] bg-[#B08D57]" />
          </div>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 3: THE PROBLEM
// =============================================================================

function ProblemVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0">
      {/* Side-by-side on desktop, stacked on mobile (Custom first on mobile) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Custom side - ALIVE (shows first on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="flex-1 order-1 sm:order-2"
        >
          <div className="text-[13px] text-[#B08D57] mb-2.5 uppercase tracking-[0.12em] font-semibold">
            Custom Build
          </div>
          {/* Card with inner glow */}
          <motion.div
            className="relative"
            initial={{ opacity: 0.95 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* Soft background bloom - dirty brass, warm smoke */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(180, 145, 85, 0.08) 0%, transparent 65%)",
                filter: "blur(25px)",
                transform: "scale(1.15)",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
            {/* Inner border glow */}
            <div
              className="relative bg-[#0F1A2B] rounded-xl p-5 space-y-2.5"
              style={{
                boxShadow: "inset 0 0 30px rgba(180, 145, 85, 0.06), 0 4px 20px rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(180, 145, 85, 0.15)",
              }}
            >
              {/* Smart Dashboard - subtle indicator */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "rgba(180, 145, 85, 0.35)" }}
                  animate={{ opacity: [0.25, 0.5, 0.25] }}
                  transition={{ duration: 2.8, delay: 0.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                />
                <span className="text-[8px] text-[#B08D57]/90 uppercase tracking-wider font-medium">Smart Dashboard</span>
              </div>
              <div className="h-8 bg-white/[0.06] rounded" />

              {/* Live Booking */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#B08D57]/25" />
                <span className="text-[8px] text-[#B08D57]/70 uppercase tracking-wider font-medium">Live Booking</span>
              </div>

              {/* Two blocks with subtle inner glow - dirty brass */}
              <div className="flex gap-2">
                <motion.div
                  className="h-12 rounded flex-1 relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(180, 145, 85, 0.06)",
                    boxShadow: "inset 0 0 20px rgba(180, 145, 85, 0.04)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded"
                    style={{ backgroundColor: "rgba(180, 145, 85, 0.08)" }}
                    initial={{ opacity: 0.06 }}
                    animate={{ opacity: [0.06, 0.14, 0.06] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.1 }}
                  />
                </motion.div>
                <motion.div
                  className="h-12 rounded flex-1 relative overflow-hidden"
                  style={{
                    backgroundColor: "rgba(180, 145, 85, 0.05)",
                    boxShadow: "inset 0 0 20px rgba(180, 145, 85, 0.03)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded"
                    style={{ backgroundColor: "rgba(180, 145, 85, 0.07)" }}
                    initial={{ opacity: 0.05 }}
                    animate={{ opacity: [0.05, 0.12, 0.05] }}
                    transition={{ duration: 3.8, delay: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.6 }}
                  />
                </motion.div>
              </div>

              {/* Real-time Analytics */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#B08D57]/25" />
                <span className="text-[8px] text-[#B08D57]/70 uppercase tracking-wider font-medium">Real-time Analytics</span>
              </div>

              {/* Third block - full width, subtle breathe */}
              <motion.div
                className="h-10 rounded relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(180, 145, 85, 0.04)",
                  boxShadow: "inset 0 0 25px rgba(180, 145, 85, 0.03)",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded"
                  style={{ backgroundColor: "rgba(180, 145, 85, 0.06)" }}
                  initial={{ opacity: 0.04 }}
                  animate={{ opacity: [0.04, 0.10, 0.04] }}
                  transition={{ duration: 4.2, delay: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 3.1 }}
                />
              </motion.div>

              {/* One-Click Actions - subtle pulse */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "rgba(180, 145, 85, 0.35)" }}
                  animate={{ opacity: [0.2, 0.45, 0.2] }}
                  transition={{ duration: 2.4, delay: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.8 }}
                />
                <span className="text-[8px] text-[#B08D57]/90 uppercase tracking-wider font-medium">One-Click Actions</span>
              </div>

              {/* CTA - subtle, rounded */}
              <div
                className="h-9 rounded-full w-1/2"
                style={{ backgroundColor: "rgba(180, 145, 85, 0.12)" }}
              />
            </div>
          </motion.div>
          <div className="mt-3 text-center">
            <p className="text-[11px] text-[#B08D57] tracking-wide">
              Built for how you work.
            </p>
            <p className="text-[10px] text-[#A9B4C4]/50 mt-0.5">
              Not how a template expects you to.
            </p>
          </div>
        </motion.div>

        {/* Template side - DEAD but visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 order-2 sm:order-1"
        >
          <div className="text-[10px] text-[#A9B4C4]/50 mb-2.5 uppercase tracking-[0.15em] font-medium">
            Template
          </div>
          <div className="bg-[#0a0f18] border border-white/[0.08] rounded-lg p-5 space-y-2.5 opacity-70">
            {/* Dead labels - instantly recognizable */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white/[0.08] rounded-full" />
              <span className="text-[8px] text-white/[0.25] uppercase tracking-wider">Hero Section</span>
            </div>
            <div className="h-8 bg-white/[0.05] rounded" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white/[0.08] rounded-full" />
              <span className="text-[8px] text-white/[0.25] uppercase tracking-wider">About Us</span>
            </div>
            <div className="flex gap-2">
              <div className="h-12 bg-white/[0.04] rounded flex-1" />
              <div className="h-12 bg-white/[0.04] rounded flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white/[0.08] rounded-full" />
              <span className="text-[8px] text-white/[0.25] uppercase tracking-wider">Services</span>
            </div>
            <div className="h-10 bg-white/[0.04] rounded" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white/[0.08] rounded-full" />
              <span className="text-[8px] text-white/[0.25] uppercase tracking-wider">Contact</span>
            </div>
            {/* Dead CTA - rectangle, no affordance */}
            <div className="h-9 bg-white/[0.06] rounded-none w-1/2" />
          </div>
          <p className="text-[10px] text-[#A9B4C4]/40 mt-3 text-center tracking-wide">
            Rigid. Generic. Looks done.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0B1220] overflow-hidden">
      {/* Subtle grid texture - reinforces systems/structure */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "url(/grid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-start">
          {/* Left column - Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Headline with hierarchy - line 2 creates a pause */}
            <div className="mb-8">
              <h2 className="text-[28px] md:text-[34px] lg:text-[40px] font-bold text-[#F4F6FA] leading-[1.15] mb-3">
                Most websites look fine.
              </h2>
              <p
                className="text-[22px] md:text-[26px] lg:text-[32px] text-[#A9B4C4]/70 leading-[1.2] font-normal"
                style={{ letterSpacing: "0.01em" }}
              >
                They just don&apos;t do anything.
              </p>
            </div>

            {/* Body copy */}
            <p className="text-base md:text-[17px] text-[#A9B4C4] leading-relaxed mb-8">
              Templates aren&apos;t built for how your business actually runs. They look good on day one — then quickly get in the way.
            </p>

            {/* Pain points - staggered emphasis, last one hits harder */}
            <ul className="space-y-4 mb-16 lg:mb-20">
              <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                <span className="w-1 h-1 rounded-full bg-[#A9B4C4]/40 mt-[0.6rem] shrink-0" />
                Customers get confused
              </li>
              <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                <span className="w-1 h-1 rounded-full bg-[#A9B4C4]/40 mt-[0.6rem] shrink-0" />
                Information is buried
              </li>
              <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                <span className="w-1 h-1 rounded-full bg-[#A9B4C4]/40 mt-[0.6rem] shrink-0" />
                Tools don&apos;t talk to each other
              </li>
              <li className="flex items-start gap-3 text-base text-[#F4F6FA]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-[0.55rem] shrink-0" />
                Simple tasks take too long
              </li>
            </ul>

            {/* Bridge - emotion + logic (extra space before = gut punch) */}
            <p className="text-base md:text-[17px] text-[#F4F6FA] leading-relaxed mb-4">
              When your digital tools don&apos;t match how you work, your productivity drops and your workload goes up.
            </p>

            {/* Final line - brass accent */}
            <p className="text-base md:text-[17px] text-[#B08D57] leading-relaxed">
              Your website or app shouldn&apos;t just exist. It should make your life easier.
            </p>
          </motion.div>

          {/* Right column - Visual comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="lg:pt-4"
          >
            <ProblemVisual />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 4: WHAT WE BUILD
// =============================================================================

interface BuildCardProps {
  headline: string;
  copy: string;
  emphasis?: string;
  punchline?: string;
  visual: React.ReactNode;
  index: number;
  highlighted?: boolean;
}

function BuildCard({ headline, copy, emphasis, punchline, visual, index, highlighted }: BuildCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className={`group bg-[#0F1A2B] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        highlighted
          ? "border border-[#B08D57]/25 hover:border-[#B08D57]/40 hover:shadow-xl hover:shadow-[#B08D57]/10"
          : "border border-white/10 hover:border-[#B08D57]/20 hover:shadow-lg hover:shadow-[#B08D57]/5"
      }`}
      style={highlighted ? {
        boxShadow: "inset 0 0 40px rgba(180, 145, 85, 0.04), 0 4px 20px rgba(0, 0, 0, 0.2)",
      } : undefined}
    >
      {/* Visual placeholder */}
      <div className={`h-48 flex items-center justify-center border-b ${
        highlighted
          ? "bg-gradient-to-br from-[#0F1A2B] to-[#1a2535] border-[#B08D57]/10"
          : "bg-gradient-to-br from-[#0F1A2B] to-[#1a2332] border-white/5"
      }`}>
        {visual}
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        <h3 className="text-xl font-semibold text-[#F4F6FA] mb-3">
          {headline}
        </h3>
        <p className="text-base text-[#A9B4C4] leading-relaxed mb-4">
          {copy}
        </p>
        {emphasis && (
          <p className={`text-sm font-medium mb-3 ${highlighted ? "text-[#B08D57]" : "text-[#B08D57]/80"}`}>
            {emphasis}
          </p>
        )}
        {punchline && (
          <p className="text-sm text-[#A9B4C4]/60 italic">
            {punchline}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function WebsiteWireframe() {
  return (
    <div className="w-32 h-24 bg-[#0B1220]/50 rounded border border-white/10 p-2">
      <div className="h-2 bg-white/20 rounded w-3/4 mb-2" />
      <div className="h-1.5 bg-white/10 rounded w-full mb-1" />
      <div className="h-1.5 bg-white/10 rounded w-2/3 mb-2" />
      <div className="flex gap-1">
        <div className="h-8 bg-white/5 rounded flex-1" />
        <div className="h-8 bg-[#B08D57]/20 rounded flex-1" />
      </div>
    </div>
  );
}

function AppFlowDiagram() {
  return (
    <div className="flex items-center gap-3">
      {/* Messy input */}
      <div className="relative">
        <div className="w-14 h-18 bg-[#0B1220]/60 rounded border border-white/10 p-1.5 rotate-[-2deg]">
          <div className="h-1 bg-white/15 rounded mb-1 w-3/4" />
          <div className="h-1 bg-white/10 rounded mb-1" />
          <div className="h-1 bg-white/10 rounded mb-1 w-2/3" />
          <div className="h-6 bg-white/5 rounded" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500/30 rounded-full" />
      </div>
      {/* Arrow */}
      <svg className="w-8 h-8 text-[#B08D57]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      {/* Clean output */}
      <div className="relative">
        <motion.div
          className="w-14 h-18 bg-[#0B1220]/60 rounded border border-[#B08D57]/30 p-1.5"
          style={{ boxShadow: "inset 0 0 15px rgba(180, 145, 85, 0.06)" }}
        >
          <div className="h-1 bg-[#B08D57]/35 rounded mb-1 w-2/3" />
          <div className="h-1 bg-white/15 rounded mb-1" />
          <div className="h-8 bg-[#B08D57]/15 rounded mb-1" />
          <div className="h-3 bg-[#B08D57]/25 rounded-full w-2/3" />
        </motion.div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#B08D57]/50 rounded-full" />
      </div>
    </div>
  );
}

function SystemFlowDiagram() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 bg-[#0B1220]/50 rounded border border-white/10 flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-white/15 rounded" />
      </div>
      <div className="w-6 h-px bg-white/20" />
      <div className="w-9 h-9 bg-[#0B1220]/50 rounded border border-[#B08D57]/20 flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-[#B08D57]/25 rounded" />
      </div>
      <div className="w-6 h-px bg-white/20" />
      <div className="w-9 h-9 bg-[#0B1220]/50 rounded border border-white/10 flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-white/15 rounded" />
      </div>
    </div>
  );
}

function WhatWeBuildSection() {
  const builds = [
    {
      headline: "Websites that explain clearly and convert intentionally",
      copy: "Your website isn't art. It's staff. We build sites that make it obvious what you do and what customers should do next.",
      punchline: "If a customer lands here and still has questions, we didn't do our job.",
      visual: <WebsiteWireframe />,
      highlighted: false,
    },
    {
      headline: "Apps built to remove friction",
      copy: "When a website isn't enough, we build custom apps that solve real problems — booking, intake, daily tasks, internal tracking, or anything else held together by spreadsheets.",
      emphasis: "If your business runs on notes, texts, and workarounds, this is where things get easier.",
      visual: <AppFlowDiagram />,
      highlighted: true,
    },
    {
      headline: "Systems, not one-off builds",
      copy: "We don't build in isolation. Websites, SmartPages, and apps work together — so your business runs smoother today and scales cleaner tomorrow.",
      visual: <SystemFlowDiagram />,
      highlighted: false,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#0B1220] via-[#0d1627] to-[#0B1220]">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[28px] md:text-[36px] font-semibold text-[#F4F6FA] leading-tight mb-12"
          >
            What we actually build
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {builds.map((build, index) => (
              <BuildCard key={build.headline} {...build} index={index} />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 5: REAL BUILDS — SMARTPAGE MODAL SHOWCASE
// =============================================================================

function SmartPageModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus trap - focus the close button when modal opens
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="SmartPage Preview"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0B1220]/90 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] bg-[#0B1220] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0F1A2B] border border-white/10 flex items-center justify-center text-[#A9B4C4] hover:text-[#F4F6FA] hover:border-white/20 transition-all duration-200"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* iframe */}
        <iframe
          src="https://nitos.shortlistpass.com/"
          className="w-full h-full border-0"
          title="Nito's SmartPage"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </motion.div>
    </motion.div>
  );
}

function FamilyVaultModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Family Vault Preview"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0B1220]/90 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] bg-[#0B1220] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0F1A2B] border border-white/10 flex items-center justify-center text-[#A9B4C4] hover:text-[#F4F6FA] hover:border-white/20 transition-all duration-200"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* iframe */}
        <iframe
          src="https://vault.shortlistpass.com/"
          className="w-full h-full border-0"
          title="Family Vault"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </motion.div>
    </motion.div>
  );
}

function SmartPagePreviewCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative">
      {/* Subtle navy glow behind card */}
      <div
        className="absolute -inset-4 rounded-2xl opacity-60"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(11, 18, 32, 0.8) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Browser-style preview card */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B08D57]/50 border border-[#1E2A3D]"
        style={{
          background: "linear-gradient(180deg, #0F1724 0%, #0B1220 100%)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
        }}
      >
        {/* Browser top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2A3D]/60 bg-[#0D1520]">
          {/* Window dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]/70" />
          </div>

          {/* Label */}
          <span className="text-[11px] text-[#A9B4C4]/60 uppercase tracking-wider">
            SmartPage Preview
          </span>

          {/* Open live link */}
          <a
            href="https://nitos.shortlistpass.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[#B08D57] hover:text-[#C9A66B] transition-colors flex items-center gap-1"
          >
            Open live
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>

        {/* Card content */}
        <div className="p-6 flex flex-col items-center">
          {/* Image */}
          <img
            src="/nitos-modal-mock.png"
            alt="Nito's Empanadas SmartPage"
            className="block rounded-lg max-w-[220px] md:max-w-[260px] w-full h-auto"
            style={{
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* Expand preview button */}
          <button
            onClick={onOpen}
            className="mt-5 px-4 py-2 text-[13px] text-[#A9B4C4] hover:text-[#F4F6FA] border border-[#1E2A3D] hover:border-[#B08D57]/40 rounded-lg transition-all duration-300 flex items-center gap-2 bg-[#0B1220]/50 hover:bg-[#0B1220]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            Expand preview
          </button>
        </div>
      </div>

      {/* Caption */}
      <p className="mt-4 text-[12px] text-[#A9B4C4]/50 text-center">
        This is a real SmartPage — not a mockup.
      </p>
    </div>
  );
}

function FamilyVaultPreviewCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative">
      {/* Soft pulsing glow behind card */}
      <motion.div
        className="absolute -inset-6 rounded-3xl"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(11, 18, 32, 0.9) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Preview card container */}
      <motion.div
        className="relative rounded-2xl overflow-hidden border border-[#1E2A3D] transition-colors duration-300 hover:border-[#B08D57]/50"
        style={{
          background: "linear-gradient(180deg, #0F1724 0%, #0B1220 100%)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03), inset 0 0 80px rgba(11, 18, 32, 0.5)",
        }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Browser-style top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2A3D]/60 bg-[#0D1520]">
          {/* Window dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]/70" />
          </div>

          {/* Label */}
          <span className="text-[11px] text-[#A9B4C4]/60 uppercase tracking-wider">
            Family Vault Preview
          </span>

          {/* Open live link */}
          <a
            href="https://vault.shortlistpass.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[#B08D57] hover:text-[#C9A66B] transition-colors flex items-center gap-1"
          >
            Open live
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>

        {/* Card content */}
        <div className="p-5 md:p-8 flex flex-col items-center">
          {/* Image with soft shadow */}
          <img
            src="/family-vault.png"
            alt="Family Vault interface"
            className="block rounded-2xl w-[90%] md:w-full md:max-w-[520px] h-auto"
            style={{
              boxShadow: "0 15px 40px rgba(0, 0, 0, 0.35)",
            }}
          />

          {/* Expand preview button */}
          <button
            onClick={onOpen}
            className="mt-5 px-4 py-2 text-[13px] text-[#A9B4C4] hover:text-[#F4F6FA] border border-[#1E2A3D] hover:border-[#B08D57]/40 rounded-lg transition-all duration-300 flex items-center gap-2 bg-[#0B1220]/50 hover:bg-[#0B1220]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            Expand preview
          </button>
        </div>
      </motion.div>

      {/* Caption */}
      <p className="mt-5 text-[12px] text-[#A9B4C4]/50 text-center">
        A real Family Vault interface — built for real life, not demos.
      </p>
    </div>
  );
}

function CustomWebsiteLivingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  // Cycling action cards
  const actionCards = [
    "Get started",
    "Check availability",
    "View options",
    "Contact us",
    "Book a spot",
  ];

  // Cycle through action cards
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % actionCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isInView, actionCards.length]);

  // Icon tiles data
  const iconTiles = [
    { icon: "🕒", label: "Hours & availability" },
    { icon: "📍", label: "Where to find you" },
    { icon: "💬", label: "Common questions" },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Subtle glow behind */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-40"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(11, 18, 32, 0.8) 0%, transparent 70%)",
          filter: "blur(25px)",
        }}
      />

      {/* Living canvas container */}
      <motion.div
        className="relative rounded-2xl overflow-hidden border border-[#1E2A3D] group"
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 36, 0.95) 0%, rgba(11, 18, 32, 0.98) 100%)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03), inset 0 0 60px rgba(11, 18, 32, 0.4)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Gold glow scan - top to bottom */}
        {isInView && (
          <motion.div
            className="absolute inset-x-0 h-32 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(176, 141, 87, 0.08) 0%, transparent 100%)",
            }}
            animate={{ top: ["-128px", "100%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        )}

        <div className="p-6 md:p-8 relative">
          {/* Top text - floating, minimal */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-[13px] text-[#A9B4C4]/70 leading-relaxed">
              Clear answers.<br />
              Clear actions.<br />
              No confusion.
            </p>
          </motion.div>

          {/* Swipe-in action card */}
          <motion.div
            className="mb-6 h-12 relative overflow-hidden rounded-xl border border-[#B08D57]/20"
            style={{
              background: "linear-gradient(135deg, rgba(176, 141, 87, 0.06) 0%, rgba(176, 141, 87, 0.02) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCardIndex}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <span className="text-[12px] text-[#B08D57] tracking-wide">
                  {actionCards[activeCardIndex]}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {/* Primary - gold with subtle pulse */}
            <motion.div
              className="px-4 py-2 rounded-lg text-[12px] text-[#B08D57] border border-[#B08D57]/40 flex items-center gap-1.5"
              style={{
                background: "linear-gradient(135deg, rgba(176, 141, 87, 0.15) 0%, rgba(176, 141, 87, 0.05) 100%)",
              }}
              animate={{
                boxShadow: [
                  "0 0 0 rgba(176, 141, 87, 0)",
                  "0 0 20px rgba(176, 141, 87, 0.15)",
                  "0 0 0 rgba(176, 141, 87, 0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Start here
              <span className="text-[10px]">→</span>
            </motion.div>

            {/* Secondary - ghost */}
            <div className="px-4 py-2 rounded-lg text-[12px] text-[#A9B4C4]/60 border border-[#1E2A3D] hover:border-[#A9B4C4]/30 transition-colors">
              See an example
            </div>
          </motion.div>

          {/* Icon tiles - expand on hover */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {iconTiles.map((tile, index) => (
              <motion.div
                key={index}
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredIcon(index)}
                onMouseLeave={() => setHoveredIcon(null)}
                animate={{
                  scale: hoveredIcon === index ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#1E2A3D]/60 transition-all duration-200"
                  style={{
                    background: hoveredIcon === index
                      ? "linear-gradient(135deg, rgba(176, 141, 87, 0.1) 0%, rgba(176, 141, 87, 0.03) 100%)"
                      : "linear-gradient(135deg, rgba(26, 35, 50, 0.4) 0%, rgba(15, 26, 43, 0.3) 100%)",
                    borderColor: hoveredIcon === index ? "rgba(176, 141, 87, 0.3)" : undefined,
                  }}
                >
                  <span className="text-sm opacity-60">{tile.icon}</span>
                </div>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {hoveredIcon === index && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="text-[10px] text-[#A9B4C4]/60">{tile.label}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Caption */}
      <motion.p
        className="mt-5 text-[12px] text-[#A9B4C4]/50 text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 1 }}
      >
        Built for real people, not templates.
      </motion.p>
    </div>
  );
}

function RealBuildsSection() {
  const [isSmartPageModalOpen, setIsSmartPageModalOpen] = useState(false);
  const [isFamilyVaultModalOpen, setIsFamilyVaultModalOpen] = useState(false);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  const openSmartPageModal = useCallback(() => {
    setIsSmartPageModalOpen(true);
  }, []);

  const closeSmartPageModal = useCallback(() => {
    setIsSmartPageModalOpen(false);
  }, []);

  const openFamilyVaultModal = useCallback(() => {
    setIsFamilyVaultModalOpen(true);
  }, []);

  const closeFamilyVaultModal = useCallback(() => {
    setIsFamilyVaultModalOpen(false);
  }, []);

  return (
    <section id="real-builds" className="py-20 lg:py-28 bg-[#0B1220]">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Section header */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#F4F6FA] leading-tight mb-3">
              Real problems. Real builds.
            </h2>
            <p className="text-lg text-[#A9B4C4]">
              A few examples of tools we&apos;ve built — and why they exist.
            </p>
          </motion.div>

          {/* SmartPages Showcase */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              {/* Left column - Copy */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#A9B4C4]/50 uppercase tracking-[0.15em] mb-4">SmartPages</p>
                <h3 className="text-xl md:text-2xl font-semibold text-[#F4F6FA] mb-6 leading-tight">
                  For businesses that don&apos;t need a full website —<br />
                  but still need to be understood.
                </h3>

                <div className="mb-8">
                  <p className="text-base text-[#A9B4C4] mb-4">
                    Most small businesses either don&apos;t have a website — or have one that doesn&apos;t help.
                  </p>
                  <p className="text-base text-[#A9B4C4]">
                    Information is scattered.<br />
                    Links are buried.<br />
                    Customers ask the same questions over and over.
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-[#A9B4C4]/60 uppercase tracking-wider mb-3">What we built</p>
                  <p className="text-base text-[#A9B4C4]">
                    SmartPages — an intelligent, website-light page that acts like a business assistant. It keeps everything in one place, answers real customer questions instantly, and makes it obvious what to do next.
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-[#A9B4C4]/60 uppercase tracking-wider mb-3">Why it matters</p>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2 shrink-0" />
                      Costs a fraction of a full website
                    </li>
                    <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2 shrink-0" />
                      Clear enough for any customer
                    </li>
                    <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2 shrink-0" />
                      Smart enough to handle real questions
                    </li>
                    <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2 shrink-0" />
                      Keeps customers engaged with updates and notifications
                    </li>
                  </ul>
                </div>

                <p className="text-base text-[#F4F6FA] font-semibold">
                  More useful than most websites. Less expensive than all of them.
                </p>
              </div>

              {/* Right column - Phone mockup */}
              <div className="shrink-0 self-center lg:self-start">
                <SmartPagePreviewCard onOpen={openSmartPageModal} />
              </div>
            </div>
          </motion.div>

          {/* Build 2: Family Vault */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              {/* Preview card - on left for desktop */}
              <div className="order-2 lg:order-1 shrink-0 self-center lg:self-start w-full lg:w-auto flex justify-center lg:justify-start">
                <FamilyVaultPreviewCard onOpen={openFamilyVaultModal} />
              </div>

              {/* Copy - on right for desktop */}
              <div className="order-1 lg:order-2 flex-1 min-w-0">
                <p className="text-sm text-[#B08D57] uppercase tracking-wider mb-3">Family Vault</p>
                <h3 className="text-xl md:text-2xl font-semibold text-[#F4F6FA] mb-4">
                  A custom app built around real life — not business
                </h3>

                <div className="mb-6">
                  <p className="text-sm text-[#A9B4C4]/70 uppercase tracking-wider mb-2">The problem</p>
                  <p className="text-base text-[#A9B4C4]">
                    Parents want to save memories — but life gets busy. Journals stay empty. Emails never get written. Moments disappear.
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-[#A9B4C4]/70 uppercase tracking-wider mb-2">What we built</p>
                  <p className="text-base text-[#A9B4C4]">
                    A private app that lets parents record daily memories — by typing or speaking — building a living family timeline stored forever. Over time, the app creates short- and long-form stories that preserve voices, thoughts, and moments.
                  </p>
                </div>

                <p className="text-lg text-[#F4F6FA] font-medium mb-4 italic">
                  Hear grandma tell her story — in her own words — 20 years from now.
                </p>

                <p className="text-base text-[#A9B4C4]">
                  This app exists to show one thing clearly: we don&apos;t just build business tools — we build systems that last.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Build 3: Custom Builds */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              {/* Left column - Copy */}
              <div className="flex-1 min-w-0 order-1">
                <p className="text-[11px] text-[#B08D57] uppercase tracking-[0.15em] mb-4">Custom Builds</p>
                <h3 className="text-xl md:text-2xl font-semibold text-[#F4F6FA] mb-6 leading-tight">
                  Websites that actually help your business run
                </h3>

                <div className="mb-6">
                  <p className="text-base text-[#A9B4C4] mb-4">
                    Templates are built for everyone —<br />
                    which usually means they&apos;re built for no one in particular.
                  </p>
                  <p className="text-base text-[#A9B4C4]">
                    They look fine, but customers still get confused.<br />
                    They still call.<br />
                    They still leave without taking action.
                  </p>
                </div>

                <p className="text-base text-[#A9B4C4] mb-6">
                  We build custom pages that do one thing well:<br />
                  help customers do what they came to do — fast.
                </p>

                <p className="text-lg text-[#F4F6FA] font-medium mb-3">
                  Clear pages. Clear answers. Fewer interruptions during your day.
                </p>

                <p className="text-base text-[#A9B4C4]/70">
                  Whether you sell food, services, or time — your customers shouldn&apos;t have to guess.
                </p>
              </div>

              {/* Right column - System visual */}
              <div className="shrink-0 self-center lg:self-start order-2 w-full lg:w-auto lg:max-w-[400px]">
                <CustomWebsiteLivingCanvas />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* SmartPage Modal */}
      <SmartPageModal isOpen={isSmartPageModalOpen} onClose={closeSmartPageModal} />
      <FamilyVaultModal isOpen={isFamilyVaultModalOpen} onClose={closeFamilyVaultModal} />
    </section>
  );
}

// =============================================================================
// SECTION 6: WHAT THIS DOES FOR YOU
// =============================================================================

function BenefitsSection() {
  const benefits = [
    {
      title: "Fewer confused customers",
      description: "Clear information, clear actions.",
    },
    {
      title: "Faster decisions",
      description: "Less back-and-forth, more momentum.",
    },
    {
      title: "Tools that work when you're closed",
      description: "Your digital presence doesn't sleep.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0B1220]">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12"
          >
            <p className="text-xl md:text-2xl text-[#F4F6FA] font-semibold mb-2">
              Good digital tools don&apos;t add work.
            </p>
            <p className="text-xl md:text-2xl text-[#B08D57] font-semibold">
              They remove it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="text-center"
              >
                <h3 className="text-lg font-semibold text-[#F4F6FA] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-base text-[#A9B4C4]">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-base text-[#A9B4C4]"
          >
            When your digital setup works, everything else feels lighter.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 7: PROCESS
// =============================================================================

function ProcessSection() {
  const steps = [
    "We learn how your business actually runs",
    "We identify friction and wasted effort",
    "We design the right tool — website, app, or system",
    "We build it intentionally",
    "We support and evolve it as you grow",
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#0B1220] via-[#0d1627] to-[#0B1220]">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-2xl mx-auto"
        >
          <motion.h2
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[28px] md:text-[36px] font-semibold text-[#F4F6FA] leading-tight mb-10 text-center"
          >
            How working with us actually works
          </motion.h2>

          <div className="space-y-4 mb-10">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="flex items-start gap-4"
              >
                <span className="w-8 h-8 rounded-full bg-[#B08D57]/20 text-[#B08D57] text-sm font-medium flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <p className="text-base md:text-lg text-[#A9B4C4] pt-1">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-base text-[#F4F6FA] font-medium mb-1">No over-engineering.</p>
            <p className="text-base text-[#F4F6FA] font-medium mb-1">No mystery invoices.</p>
            <p className="text-base text-[#F4F6FA] font-medium">No disappearing act.</p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 8: FINAL CTA
// =============================================================================

function FinalCTASection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0B1220]">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-xl mx-auto text-center"
        >
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xl md:text-2xl text-[#F4F6FA] font-medium mb-8"
          >
            If your business has outgrown templates, let&apos;s talk.
          </motion.p>

          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-base text-[#A9B4C4] mb-8"
          >
            Book a project consult and we&apos;ll tell you honestly what you need — and what you don&apos;t.
          </motion.p>

          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <a
              href="mailto:hello@shortlistpass.com?subject=Project consult"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-all duration-300"
            >
              Book a project consult
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-12 bg-[#0B1220]">
      <Container>
        <div className="flex flex-col items-center gap-4 text-sm text-[#A9B4C4]">
          <span className="text-xs text-[#A9B4C4]/60">Digital tools for businesses that are done guessing.</span>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <span>&copy; {year} Shortlist Pass</span>
            <span>hello@shortlistpass.com</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function DigitalPage() {
  return (
    <main className="pt-16">
      <HeroSection />
      <HardLineSection />
      <ProblemSection />
      <WhatWeBuildSection />
      <RealBuildsSection />
      <BenefitsSection />
      <ProcessSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
