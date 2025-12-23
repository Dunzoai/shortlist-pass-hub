"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence, MotionValue } from "framer-motion";
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
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center py-20 lg:py-28 overflow-hidden overflow-x-clip">
      {/* Dark navy background */}
      <div className="absolute inset-0 bg-[#0B1220]" />

      {/* Grid background - static with subtle scroll parallax */}
      <motion.div
        className="absolute inset-[-10%] opacity-[0.75] pointer-events-none"
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wordContainerRef, { once: true, margin: "0px 0px -200px 0px" });

  const words = ["We", "build", "around", "you."];

  return (
    <section ref={sectionRef} className="relative py-28 lg:py-40 bg-gradient-to-b from-[#a38542] via-[#d4b87f] to-[#c9a46a] overflow-hidden">
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

          {/* Final line: Brand positioning - words pop up one by one, slow and impactful */}
          <div ref={wordContainerRef} className="relative inline-block">
            <div
              className="text-[1.875rem] md:text-[3rem] lg:text-[3.5rem] font-bold text-[#0B1220] leading-[1.1] flex gap-2 md:gap-4"
              style={{ letterSpacing: "-0.005em" }}
            >
              {words.map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40, scale: 0.7 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.5 + index * 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            {/* Editorial underline - animates in after words */}
            <motion.div
              className="mt-3 h-[2px] bg-[#B08D57]"
              initial={{ width: 0 }}
              animate={isInView ? { width: "103%" } : {}}
              transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 3: THE PROBLEM
// =============================================================================

function GlowingHeader({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: "rgba(180, 145, 85, 0.35)" }}
        animate={{
          opacity: isActive ? [0.4, 0.9, 0.4] : 0.25,
          scale: isActive ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      />
      <motion.span
        className="text-[8px] uppercase tracking-wider font-medium"
        animate={{
          color: isActive ? "#B08D57" : "rgba(176, 141, 87, 0.7)",
          textShadow: isActive ? "0 0 8px rgba(176, 141, 87, 0.5)" : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.span>
    </div>
  );
}

function ProblemVisual() {
  const [activeHeader, setActiveHeader] = useState(0);
  const headers = ["Smart Dashboard", "Live Booking", "Real-time Analytics", "One-Click Actions"];

  // Cycle through headers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeader((prev) => (prev + 1) % headers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [headers.length]);

  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0">
      {/* Side-by-side on desktop, stacked on mobile (Template first to show contrast) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Template side - DEAD (shows first) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 order-1"
        >
          <div className="text-[10px] text-[#A9B4C4]/50 mb-2.5 uppercase tracking-[0.15em] font-medium">
            Boring Template
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

        {/* Custom side - ALIVE */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="flex-1 order-2"
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
              {/* Smart Dashboard - header + block synced */}
              <GlowingHeader text="Smart Dashboard" isActive={activeHeader === 0} />
              <motion.div
                className="h-8 rounded"
                animate={{
                  backgroundColor: activeHeader === 0 ? "rgba(180, 145, 85, 0.15)" : "rgba(255, 255, 255, 0.06)",
                  boxShadow: activeHeader === 0 ? "inset 0 0 20px rgba(180, 145, 85, 0.1)" : "none",
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Live Booking - header + two blocks synced */}
              <GlowingHeader text="Live Booking" isActive={activeHeader === 1} />
              <div className="flex gap-2">
                <motion.div
                  className="h-12 rounded flex-1"
                  animate={{
                    backgroundColor: activeHeader === 1 ? "rgba(180, 145, 85, 0.15)" : "rgba(180, 145, 85, 0.06)",
                    boxShadow: activeHeader === 1 ? "inset 0 0 20px rgba(180, 145, 85, 0.12)" : "inset 0 0 20px rgba(180, 145, 85, 0.04)",
                  }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="h-12 rounded flex-1"
                  animate={{
                    backgroundColor: activeHeader === 1 ? "rgba(180, 145, 85, 0.15)" : "rgba(180, 145, 85, 0.05)",
                    boxShadow: activeHeader === 1 ? "inset 0 0 20px rgba(180, 145, 85, 0.12)" : "inset 0 0 20px rgba(180, 145, 85, 0.03)",
                  }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                />
              </div>

              {/* Real-time Analytics - header + block synced */}
              <GlowingHeader text="Real-time Analytics" isActive={activeHeader === 2} />
              <motion.div
                className="h-10 rounded"
                animate={{
                  backgroundColor: activeHeader === 2 ? "rgba(180, 145, 85, 0.15)" : "rgba(180, 145, 85, 0.04)",
                  boxShadow: activeHeader === 2 ? "inset 0 0 25px rgba(180, 145, 85, 0.12)" : "inset 0 0 25px rgba(180, 145, 85, 0.03)",
                }}
                transition={{ duration: 0.4 }}
              />

              {/* One-Click Actions - header + CTA synced */}
              <GlowingHeader text="One-Click Actions" isActive={activeHeader === 3} />
              <motion.div
                className="h-9 rounded-full w-1/2"
                animate={{
                  backgroundColor: activeHeader === 3 ? "rgba(180, 145, 85, 0.25)" : "rgba(180, 145, 85, 0.12)",
                  boxShadow: activeHeader === 3 ? "0 0 15px rgba(180, 145, 85, 0.3)" : "none",
                }}
                transition={{ duration: 0.4 }}
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
      </div>
    </div>
  );
}

function ScrollLitBullet({ text, index, scrollProgress }: { text: string; index: number; scrollProgress: MotionValue<number> }) {
  // Each bullet lights up at different scroll points
  const thresholds = [0.15, 0.3, 0.45, 0.6];
  const threshold = thresholds[index] || 0.6;

  const bulletColor = useTransform(
    scrollProgress,
    [threshold - 0.1, threshold],
    ["rgba(169, 180, 196, 0.4)", "#B08D57"]
  );

  const bulletSize = useTransform(
    scrollProgress,
    [threshold - 0.1, threshold],
    ["4px", "6px"]
  );

  const textColor = useTransform(
    scrollProgress,
    [threshold - 0.1, threshold],
    ["#A9B4C4", "#F4F6FA"]
  );

  return (
    <li className="flex items-start gap-3 text-base">
      <motion.span
        className="rounded-full mt-[0.55rem] shrink-0"
        style={{
          backgroundColor: bulletColor,
          width: bulletSize,
          height: bulletSize,
        }}
      />
      <motion.span style={{ color: textColor }}>{text}</motion.span>
    </li>
  );
}

function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const painPoints = [
    "Customers get confused",
    "Information is buried",
    "Tools don't talk to each other",
    "Simple tasks take too long",
  ];

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-[#0B1220] overflow-hidden">
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
            {/* Headline - single impactful line */}
            <div className="mb-8">
              <h2 className="text-[28px] md:text-[34px] lg:text-[40px] font-bold text-[#F4F6FA] leading-[1.15]">
                Most websites look fine — they just don&apos;t do anything.
              </h2>
            </div>

            {/* Body copy */}
            <p className="text-base md:text-[17px] text-[#A9B4C4] leading-relaxed mb-8">
              Templates aren&apos;t built for how your business actually runs. They look good on day one — then quickly get in the way.
            </p>

            {/* Pain points - light up one by one as you scroll */}
            <ul className="space-y-4 mb-16 lg:mb-20">
              {painPoints.map((point, index) => (
                <ScrollLitBullet
                  key={point}
                  text={point}
                  index={index}
                  scrollProgress={scrollYProgress}
                />
              ))}
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: "easeOut"
      }}
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

function CustomWebsiteVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [answerIndex, setAnswerIndex] = useState(0);

  const answers = ["Answered automatically.", "Answered creatively.", "Answered for you."];

  // Cycle through answers
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setAnswerIndex((prev) => (prev + 1) % answers.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isInView, answers.length]);

  const questionBubbles = [
    { text: "What do you offer?", delay: 0.3 },
    { text: "Where are you today?", delay: 0.5 },
    { text: "How do I book?", delay: 0.7 },
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

      {/* Browser-style website mockup */}
      <motion.div
        className="relative rounded-xl overflow-hidden border border-[#1E2A3D]"
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 36, 0.95) 0%, rgba(11, 18, 32, 0.98) 100%)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Browser top bar with URL */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1E2A3D]/60 bg-[#0D1520]">
          {/* Window dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]/70" />
          </div>

          {/* URL bar */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0B1220]/80 rounded-full border border-[#1E2A3D]/50">
              <svg className="w-3 h-3 text-[#A9B4C4]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[11px] text-[#A9B4C4]/60">yourbusiness.com</span>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="w-[52px]" />
        </div>

        {/* Website content area */}
        <div className="p-6 md:p-8 min-h-[220px] flex flex-col">
          {/* Top section - floating question bubbles */}
          <div className="relative h-24 mb-6 overflow-hidden">
            {questionBubbles.map((bubble, index) => (
              <motion.div
                key={bubble.text}
                className="absolute px-3 py-1.5 rounded-full border border-[#1E2A3D] bg-[#0F1724]/80"
                style={{
                  left: index === 0 ? "5%" : index === 1 ? "35%" : "15%",
                  top: index === 0 ? "10%" : index === 1 ? "45%" : "70%",
                }}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={isInView ? {
                  opacity: [0, 1, 1, 0.7],
                  scale: [0.8, 1, 1, 0.95],
                  y: [10, 0, -5, -8],
                  x: [0, 0, index % 2 === 0 ? 5 : -5, index % 2 === 0 ? 8 : -8],
                } : {}}
                transition={{
                  duration: 4,
                  delay: bubble.delay,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
              >
                <span className="text-[11px] text-[#A9B4C4]/70 whitespace-nowrap">{bubble.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Middle section - cycling answer with gold glow */}
          <div className="relative mb-6 py-4 border-y border-[#1E2A3D]/30">
            {/* Soft gold glow behind */}
            <motion.div
              className="absolute inset-0 -m-2 rounded-lg"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(176, 141, 87, 0.1) 0%, transparent 70%)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <AnimatePresence mode="wait">
              <motion.p
                key={answerIndex}
                className="text-[14px] text-[#B08D57] font-medium text-center relative"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {answers[answerIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Bottom section - fading text with glowing checkmark */}
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <motion.span
              className="text-[12px] text-[#A9B4C4]"
              animate={{ opacity: [0.6, 0.4, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              So you can focus on running the business.
            </motion.span>

            {/* Glowing checkmark */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.3, ease: "easeOut" }}
            >
              {/* Glow behind checkmark */}
              <motion.div
                className="absolute w-6 h-6 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(176, 141, 87, 0.4) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <svg
                className="w-4 h-4 text-[#B08D57] relative"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
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
    <>
      {/* Brass header strip */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-b from-[#a38542] via-[#d4b87f] to-[#c9a46a] overflow-hidden">
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-[#0B1220] leading-[1.1] mb-2">
              Real problems.
            </h2>
            <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-[#0B1220]/80 leading-[1.1] mb-6">
              Real builds.
            </h2>

            <p className="text-lg text-[#0B1220]/70 max-w-xl">
              A few examples of tools we&apos;ve built — and why they exist.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Builds content on dark background */}
      <section id="real-builds" className="py-20 lg:py-28 bg-[#0B1220]">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
          {/* SmartPages Showcase */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              {/* Left column - Copy */}
              <div className="flex-1 min-w-0">
                <motion.p
                  className="text-[11px] text-[#B08D57] uppercase tracking-[0.15em] mb-4 font-semibold"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(176, 141, 87, 0)",
                      "0 0 12px rgba(176, 141, 87, 0.6)",
                      "0 0 0px rgba(176, 141, 87, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  SmartPages
                </motion.p>
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

          {/* Build 2: Family Vault - with subtle background separation */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mb-20 relative -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-12 rounded-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(15, 26, 43, 0.6) 0%, rgba(11, 18, 32, 0.4) 100%)",
            }}
          >
            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-2xl"
              style={{
                backgroundImage: "url(/grid.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="relative flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              {/* Preview card - on left for desktop */}
              <div className="order-2 lg:order-1 shrink-0 self-center lg:self-start w-full lg:w-auto flex justify-center lg:justify-start">
                <FamilyVaultPreviewCard onOpen={openFamilyVaultModal} />
              </div>

              {/* Copy - on right for desktop */}
              <div className="order-1 lg:order-2 flex-1 min-w-0">
                <motion.p
                  className="text-sm text-[#B08D57] uppercase tracking-wider mb-3 font-semibold"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(176, 141, 87, 0)",
                      "0 0 12px rgba(176, 141, 87, 0.6)",
                      "0 0 0px rgba(176, 141, 87, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  Family Vault
                </motion.p>
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
                <motion.p
                  className="text-[11px] text-[#B08D57] uppercase tracking-[0.15em] mb-4 font-semibold"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(176, 141, 87, 0)",
                      "0 0 12px rgba(176, 141, 87, 0.6)",
                      "0 0 0px rgba(176, 141, 87, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  Custom Builds
                </motion.p>
                <h3 className="text-xl md:text-2xl font-semibold text-[#F4F6FA] mb-6 leading-tight">
                  Websites that stop the back-and-forth
                </h3>

                <div className="mb-6">
                  <p className="text-base text-[#A9B4C4] mb-4">
                    People know what you do.<br />
                    They know what to do next.<br />
                    They stop calling to ask.
                  </p>
                </div>

                <p className="text-base text-[#A9B4C4]/70">
                  We don&apos;t use templates. We build around how your day actually works.
                </p>
              </div>

              {/* Right column - Visual diagram */}
              <div className="shrink-0 self-center lg:self-start order-2 w-full lg:w-auto lg:max-w-[320px]">
                <CustomWebsiteVisual />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* SmartPage Modal */}
      <SmartPageModal isOpen={isSmartPageModalOpen} onClose={closeSmartPageModal} />
      <FamilyVaultModal isOpen={isFamilyVaultModalOpen} onClose={closeFamilyVaultModal} />
    </section>
    </>
  );
}

// =============================================================================
// SECTION 6: WHAT THIS DOES FOR YOU
// =============================================================================

function BenefitItem({ title, description, index }: { title: string; description: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-[#0B1220] mt-2 shrink-0"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
      />
      <div>
        <h3 className="text-lg font-semibold text-[#0B1220] mb-1">
          {title}
        </h3>
        <p className="text-base text-[#0B1220]/70">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function BenefitsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

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
    <section
      ref={containerRef}
      className="relative py-20 lg:py-28 bg-gradient-to-b from-[#a38542] via-[#d4b87f] to-[#c9a46a] overflow-hidden"
    >
      {/* Grain texture - adds material feel */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Statement header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-2xl md:text-3xl lg:text-4xl text-[#0B1220] font-semibold mb-3">
              Good digital tools don&apos;t add work.
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0B1220]">
              They{" "}
              <span className="relative">
                remove it.
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] bg-[#0B1220]"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                />
              </span>
            </p>
          </motion.div>

          {/* Benefits - fade in on scroll */}
          <div className="space-y-8 mb-12">
            {benefits.map((benefit, index) => (
              <BenefitItem key={benefit.title} {...benefit} index={index} />
            ))}
          </div>

          {/* Whisper-level closing */}
          <motion.p
            className="text-sm text-[#0B1220]/50 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            When your digital setup works, everything else feels lighter.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 7: PROCESS
// =============================================================================

function ProcessStepNumber({ index, scrollProgress }: { index: number; scrollProgress: MotionValue<number> }) {
  // Each number fills at different scroll points: 0.2, 0.5, 0.8
  const thresholds = [0.2, 0.5, 0.8];
  const threshold = thresholds[index] || 0.8;

  const color = useTransform(
    scrollProgress,
    [threshold - 0.15, threshold],
    ["rgba(169, 180, 196, 0.4)", "#B08D57"]
  );

  const borderColor = useTransform(
    scrollProgress,
    [threshold - 0.15, threshold],
    ["rgba(169, 180, 196, 0.2)", "rgba(176, 141, 87, 0.5)"]
  );

  const bgColor = useTransform(
    scrollProgress,
    [threshold - 0.15, threshold],
    ["transparent", "rgba(176, 141, 87, 0.15)"]
  );

  return (
    <motion.div
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-medium border"
      style={{
        color,
        borderColor,
        backgroundColor: bgColor,
      }}
    >
      {index + 1}
    </motion.div>
  );
}

function ProcessStepText({ index, scrollProgress, children }: { index: number; scrollProgress: MotionValue<number>; children: React.ReactNode }) {
  const thresholds = [0.2, 0.5, 0.8];
  const threshold = thresholds[index] || 0.8;

  const color = useTransform(
    scrollProgress,
    [threshold - 0.15, threshold],
    ["rgba(169, 180, 196, 0.4)", "#A9B4C4"]
  );

  return (
    <motion.p className="text-base md:text-lg" style={{ color }}>
      {children}
    </motion.p>
  );
}

function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Simplified, human step copy
  const steps = [
    "Learn how your business actually runs",
    "Find the stuff that wastes your time",
    "Build the right thing — nothing extra",
  ];

  // For the closing text
  const closingOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="py-20 lg:py-28 bg-gradient-to-b from-[#0B1220] via-[#0d1627] to-[#0B1220]"
    >
      <Container>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[28px] md:text-[36px] font-semibold text-[#F4F6FA] leading-tight mb-12 text-center">
            How working with us actually works
          </h2>

          {/* Steps - numbers fill as you scroll */}
          <div className="space-y-6 mb-12">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-5">
                <ProcessStepNumber index={index} scrollProgress={scrollYProgress} />
                <ProcessStepText index={index} scrollProgress={scrollYProgress}>
                  {step}
                </ProcessStepText>
              </div>
            ))}
          </div>

          {/* Quiet closing reassurance */}
          <motion.p
            className="text-sm text-[#A9B4C4]/50 text-center"
            style={{ opacity: closingOpacity }}
          >
            Clear steps. No surprises.
          </motion.p>
        </div>
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
    <main className="pt-16 overflow-x-hidden">
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
