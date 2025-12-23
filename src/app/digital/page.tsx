"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { useRef } from "react";
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
          background: "linear-gradient(135deg, transparent 0%, transparent 35%, rgba(176, 141, 87, 0.14) 50%, transparent 65%, transparent 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 10,
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
    <section className="relative py-28 lg:py-36 bg-gradient-to-b from-[#a38542] via-[#d4b87f] to-[#c9a46a] overflow-hidden">
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Faint grid carryover */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url(/grid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Container>
        <div className="max-w-3xl relative">
          {/* Thin vertical brass rule on left */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0B1220]/20 -ml-6 md:-ml-10" />

          {/* Assertions - first 3 lines */}
          <div className="space-y-5 md:space-y-6 mb-14 md:mb-16">
            <p className="text-2xl md:text-3xl lg:text-[2.5rem] font-semibold text-[#0B1220] leading-snug">
              We don&apos;t use templates.
            </p>
            <p className="text-2xl md:text-3xl lg:text-[2.5rem] font-semibold text-[#0B1220] leading-snug">
              We don&apos;t reuse layouts.
            </p>
            <p className="text-2xl md:text-3xl lg:text-[2.5rem] font-semibold text-[#0B1220] leading-snug">
              We don&apos;t force your business into someone else&apos;s system.
            </p>
          </div>

          {/* Resolution - the landing moment */}
          <div className="relative">
            <p className="text-3xl md:text-4xl lg:text-[3rem] font-bold text-[#0B1220] leading-tight">
              We build around you.
            </p>
            {/* Subtle underline */}
            <div className="mt-3 w-32 h-[2px] bg-[#0B1220]/30" />
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
    <div className="relative w-full max-w-md mx-auto">
      {/* Template side - faded, rigid */}
      <div className="flex gap-4">
        <div className="flex-1 opacity-40">
          <div className="text-xs text-[#A9B4C4] mb-2 uppercase tracking-wider">Template</div>
          <div className="bg-[#0F1A2B] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-3/4" />
            <div className="h-8 bg-white/5 rounded" />
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-12 bg-white/5 rounded" />
              <div className="h-12 bg-white/5 rounded" />
              <div className="h-12 bg-white/5 rounded" />
            </div>
          </div>
          <p className="text-xs text-[#A9B4C4]/50 mt-2 text-center">Rigid. Generic.</p>
        </div>

        {/* Custom side - clear, flexible */}
        <div className="flex-1">
          <div className="text-xs text-[#B08D57] mb-2 uppercase tracking-wider">Custom Build</div>
          <div className="bg-[#0F1A2B] border border-[#B08D57]/30 rounded-lg p-4 space-y-3">
            <div className="h-3 bg-[#B08D57]/30 rounded w-2/3" />
            <div className="h-3 bg-white/20 rounded w-full" />
            <div className="flex gap-2">
              <div className="h-16 bg-[#B08D57]/20 rounded flex-1" />
              <div className="h-16 bg-white/10 rounded flex-[2]" />
            </div>
            <div className="h-3 bg-white/20 rounded w-4/5" />
            <div className="h-10 bg-[#B08D57]/20 rounded-full w-1/2" />
          </div>
          <p className="text-xs text-[#B08D57] mt-2 text-center">Flexible. Intentional.</p>
        </div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0B1220]">
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
            className="mb-12"
          >
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#F4F6FA] leading-tight mb-4">
              Most websites look fine.
            </h2>
            <p className="text-xl text-[#A9B4C4]">They just don&apos;t do anything.</p>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Copy */}
            <motion.div
              variants={fadeUpVariant}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <p className="text-base md:text-lg text-[#A9B4C4] mb-6">
                Templates aren&apos;t built for how your business actually runs. They look good on day one — then quickly get in the way.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9B4C4]/50 mt-2.5 shrink-0" />
                  Customers get confused
                </li>
                <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9B4C4]/50 mt-2.5 shrink-0" />
                  Information is buried
                </li>
                <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9B4C4]/50 mt-2.5 shrink-0" />
                  Tools don&apos;t talk to each other
                </li>
                <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9B4C4]/50 mt-2.5 shrink-0" />
                  Simple tasks take too long
                </li>
              </ul>

              <p className="text-base md:text-lg text-[#F4F6FA] font-medium mb-4">
                When your digital tools don&apos;t match how you work, your productivity drops and your workload goes up.
              </p>

              <p className="text-base text-[#B08D57]">
                Your website or app shouldn&apos;t just exist. It should make your life easier.
              </p>
            </motion.div>

            {/* Right - Visual */}
            <motion.div
              variants={fadeUpVariant}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <ProblemVisual />
            </motion.div>
          </div>
        </motion.div>
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
  visual: React.ReactNode;
  index: number;
}

function BuildCard({ headline, copy, emphasis, visual, index }: BuildCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group bg-[#0F1A2B] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D57]/30 hover:shadow-lg hover:shadow-[#B08D57]/5"
    >
      {/* Visual placeholder */}
      <div className="h-48 bg-gradient-to-br from-[#0F1A2B] to-[#1a2332] flex items-center justify-center border-b border-white/5">
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
          <p className="text-sm text-[#B08D57] font-medium">
            {emphasis}
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
    <div className="flex items-center gap-2">
      <div className="w-12 h-16 bg-[#0B1220]/50 rounded border border-white/10 p-1">
        <div className="h-1 bg-white/20 rounded mb-1" />
        <div className="h-6 bg-white/5 rounded mb-1" />
        <div className="h-4 bg-[#B08D57]/20 rounded" />
      </div>
      <svg className="w-6 h-6 text-[#B08D57]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      <div className="w-12 h-16 bg-[#0B1220]/50 rounded border border-[#B08D57]/30 p-1">
        <div className="h-1 bg-[#B08D57]/30 rounded mb-1" />
        <div className="h-8 bg-[#B08D57]/10 rounded mb-1" />
        <div className="h-2 bg-white/10 rounded" />
      </div>
    </div>
  );
}

function SystemFlowDiagram() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#0B1220]/50 rounded border border-white/10 flex items-center justify-center">
        <div className="w-4 h-4 bg-white/20 rounded" />
      </div>
      <div className="w-8 h-0.5 bg-[#B08D57]/30" />
      <div className="w-10 h-10 bg-[#0B1220]/50 rounded border border-[#B08D57]/30 flex items-center justify-center">
        <div className="w-4 h-4 bg-[#B08D57]/30 rounded" />
      </div>
      <div className="w-8 h-0.5 bg-[#B08D57]/30" />
      <div className="w-10 h-10 bg-[#0B1220]/50 rounded border border-white/10 flex items-center justify-center">
        <div className="w-4 h-4 bg-white/20 rounded" />
      </div>
    </div>
  );
}

function WhatWeBuildSection() {
  const builds = [
    {
      headline: "Websites that explain clearly and convert intentionally",
      copy: "We build custom websites from scratch — designed to make it obvious what you do, who you're for, and what customers should do next. No clutter. No fluff. No guessing. Just clear information and clear actions that help customers choose you.",
      visual: <WebsiteWireframe />,
    },
    {
      headline: "Apps built to remove friction",
      copy: "When a website isn't enough, we build simple custom apps that solve real problems — scheduling, internal tools, ordering flows, dashboards, or systems that replace messy spreadsheets.",
      emphasis: "If your business is held together by notes, texts, and workarounds, this is usually where things start to get easier.",
      visual: <AppFlowDiagram />,
    },
    {
      headline: "Systems, not one-off builds",
      copy: "We don't build things in isolation. Websites, SmartPages, and apps are designed to work together — so your business runs smoother today and scales cleaner tomorrow.",
      visual: <SystemFlowDiagram />,
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
// SECTION 5: REAL BUILDS
// =============================================================================

function RealBuildsSection() {
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

          {/* Build 1: SmartPages */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm text-[#B08D57] uppercase tracking-wider mb-3">SmartPages</p>
                <h3 className="text-xl md:text-2xl font-semibold text-[#F4F6FA] mb-4">
                  For businesses that don&apos;t need a full website — but still need to be understood
                </h3>

                <div className="mb-6">
                  <p className="text-sm text-[#A9B4C4]/70 uppercase tracking-wider mb-2">The problem</p>
                  <p className="text-base text-[#A9B4C4]">
                    Many small businesses don&apos;t have a website — or have one customers don&apos;t understand. Information is scattered. Links are buried. Questions go unanswered.
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-[#A9B4C4]/70 uppercase tracking-wider mb-2">What we built</p>
                  <p className="text-base text-[#A9B4C4]">
                    SmartPages — an intelligent, website-light page that acts like a business assistant. It stores all your information in one place, answers customer questions instantly, and gives people clear next steps without confusion.
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-[#A9B4C4]/70 uppercase tracking-wider mb-2">Why it matters</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2.5 shrink-0" />
                      Fraction of the cost of a full website
                    </li>
                    <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2.5 shrink-0" />
                      Clear enough for any business
                    </li>
                    <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2.5 shrink-0" />
                      Smart enough to handle real customer questions
                    </li>
                    <li className="flex items-start gap-3 text-base text-[#A9B4C4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2.5 shrink-0" />
                      Keeps customers engaged through updates and notifications
                    </li>
                  </ul>
                </div>

                <p className="text-base text-[#F4F6FA] font-medium mb-4">
                  More useful than most websites. Less expensive than all of them.
                </p>

                <Link href="/smartpages" className="text-sm text-[#B08D57] hover:text-[#c9a46a] transition-colors">
                  View SmartPages →
                </Link>
              </div>

              {/* Visual placeholder */}
              <div className="bg-[#0F1A2B] border border-white/10 rounded-2xl p-6 lg:p-8">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1a2332] to-[#0F1A2B] rounded-lg flex items-center justify-center">
                  <div className="w-48 space-y-3">
                    <div className="h-3 bg-[#B08D57]/30 rounded w-2/3" />
                    <div className="h-2 bg-white/10 rounded w-full" />
                    <div className="h-2 bg-white/10 rounded w-4/5" />
                    <div className="h-8 bg-white/5 rounded mt-4" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 bg-[#B08D57]/20 rounded-full flex-1" />
                      <div className="h-8 bg-white/10 rounded-full flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Build 2: Family Vault */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Visual placeholder - on left for alternating layout */}
              <div className="bg-[#0F1A2B] border border-white/10 rounded-2xl p-6 lg:p-8 order-2 lg:order-1">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1a2332] to-[#0F1A2B] rounded-lg flex items-center justify-center">
                  <div className="w-48 space-y-3">
                    {/* Timeline visualization */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-[#B08D57]/40" />
                      <div className="h-0.5 flex-1 bg-[#B08D57]/20" />
                      <div className="w-3 h-3 rounded-full bg-[#B08D57]/60" />
                      <div className="h-0.5 flex-1 bg-[#B08D57]/20" />
                      <div className="w-3 h-3 rounded-full bg-[#B08D57]" />
                    </div>
                    <div className="h-2 bg-white/10 rounded w-full" />
                    <div className="h-2 bg-white/10 rounded w-3/4" />
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-8 h-8 rounded-full bg-[#B08D57]/20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#B08D57]/40" />
                      </div>
                      <div className="flex-1 h-6 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
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

          {/* Build 3: Custom Websites */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm text-[#B08D57] uppercase tracking-wider mb-3">Custom Websites</p>
                <h3 className="text-xl md:text-2xl font-semibold text-[#F4F6FA] mb-4">
                  For businesses that have outgrown templates
                </h3>

                <p className="text-base text-[#A9B4C4] mb-6">
                  When businesses grow, templates stop working. We design custom websites that match how customers actually decide — and how your business actually operates.
                </p>

                <p className="text-base text-[#F4F6FA] font-medium">
                  Clear structure. Clear messaging. Built to convert, not just look nice.
                </p>
              </div>

              {/* Visual placeholder */}
              <div className="bg-[#0F1A2B] border border-white/10 rounded-2xl p-6 lg:p-8">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1a2332] to-[#0F1A2B] rounded-lg flex items-center justify-center">
                  <div className="w-56 space-y-3">
                    <div className="h-4 bg-[#B08D57]/30 rounded w-1/2" />
                    <div className="h-2 bg-white/10 rounded w-full" />
                    <div className="h-2 bg-white/10 rounded w-5/6" />
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="h-16 bg-white/5 rounded" />
                      <div className="h-16 bg-white/5 rounded" />
                    </div>
                    <div className="h-10 bg-[#B08D57]/20 rounded-full w-1/3 mt-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
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
