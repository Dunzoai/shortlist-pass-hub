"use client";

import { motion, useInView, useScroll, useTransform, MotionValue } from "framer-motion";
import { Container } from "@/components/Container";
import { useRef, useState, useEffect, useCallback } from "react";

// =============================================================================
// SECTION 1: HERO
// Status + Authority. Word-by-word headline, gold underline on "already are"
// =============================================================================

function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const headlineWords = ["Look", "like", "the", "business", "you", "already", "are."];

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center py-20 lg:py-28 overflow-hidden overflow-x-clip">
      {/* Dark navy background */}
      <div className="absolute inset-0 bg-[#0B1220]" />

      {/* Grid background with parallax */}
      <motion.div
        className="absolute inset-[-10%] opacity-[0.5] pointer-events-none"
        style={{
          backgroundImage: "url(/grid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: gridY,
        }}
      />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(176, 141, 87, 0.05) 0%, transparent 50%)",
        }}
      />

      <Container>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Headline - word by word */}
          <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-bold text-[#F4F6FA] leading-[1.05] mb-8 flex flex-wrap justify-center gap-x-4 md:gap-x-5">
            {headlineWords.map((word, index) => (
              <motion.span
                key={word + index}
                className={`inline-block ${word === "already" || word === "are." ? "relative" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {word}
                {/* Gold underline on "already are." */}
                {word === "are." && (
                  <motion.span
                    className="absolute -bottom-2 left-0 h-[4px] bg-[#B08D57] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                  />
                )}
              </motion.span>
            ))}
          </h1>

          {/* Supporting copy - fades in after headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-lg md:text-xl text-[#A9B4C4] leading-relaxed">
              Most small businesses grow faster than their online presence.<br className="hidden md:block" />
              We build custom websites and apps that make you look established — instantly.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 2: DISCOVERY
// "Wait... I can have this?" - Card splits into layers on scroll
// =============================================================================

function DiscoverySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-150px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Layer animations based on scroll
  const layer1X = useTransform(scrollYProgress, [0.2, 0.5], [0, -20]);
  const layer2X = useTransform(scrollYProgress, [0.2, 0.5], [0, 20]);
  const layer3Y = useTransform(scrollYProgress, [0.3, 0.55], [20, 0]);
  const layer3Opacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const goldTraceWidth = useTransform(scrollYProgress, [0.5, 0.7], ["0%", "100%"]);
  const goldTraceOpacity = useTransform(scrollYProgress, [0.7, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="py-28 lg:py-40 bg-[#0B1220]">
      <Container>
        {/* Headline */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[#F4F6FA] leading-[1.1] mb-6">
            This is what custom actually looks like.
          </h2>
          <p className="text-lg md:text-xl text-[#A9B4C4]/80 max-w-2xl mx-auto">
            Not templates. Not themes.<br />
            Real builds designed around how your business operates — and how customers decide.
          </p>
        </motion.div>

        {/* Layered card visual */}
        <div ref={containerRef} className="relative max-w-3xl mx-auto h-[400px] md:h-[450px]">
          {/* Layer 1 - Left panel */}
          <motion.div
            className="absolute left-0 top-8 w-[45%] h-[70%] rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #0F1724 0%, #0B1220 100%)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              x: layer1X,
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="p-6 space-y-4">
              <div className="h-4 w-2/3 rounded bg-white/[0.06]" />
              <div className="h-16 rounded-lg bg-[#B08D57]/8" />
              <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
            </div>
          </motion.div>

          {/* Layer 2 - Right panel */}
          <motion.div
            className="absolute right-0 top-0 w-[50%] h-[75%] rounded-2xl"
            style={{
              background: "linear-gradient(180deg, #0F1724 0%, #0A1018 100%)",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(176, 141, 87, 0.1)",
              x: layer2X,
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="p-6 space-y-4">
              <div className="h-5 w-3/4 rounded bg-white/[0.08]" />
              <div className="h-24 rounded-lg bg-gradient-to-br from-[#B08D57]/10 to-transparent" />
              <div className="flex gap-3">
                <div className="h-10 flex-1 rounded bg-white/[0.05]" />
                <div className="h-10 flex-1 rounded bg-white/[0.03]" />
              </div>
            </div>
          </motion.div>

          {/* Layer 3 - CTA locks in last */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[35%] rounded-2xl"
            style={{
              background: "linear-gradient(180deg, #0F1724 0%, #0B1220 100%)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(176, 141, 87, 0.15)",
              y: layer3Y,
              opacity: layer3Opacity,
            }}
          >
            <div className="p-5 flex flex-col justify-center h-full">
              <div className="h-3 w-1/2 rounded bg-white/[0.06] mb-3" />
              <div className="h-10 w-32 rounded-full bg-[#B08D57]/20" />
            </div>
          </motion.div>

          {/* Gold accent trace */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 h-[2px] bg-[#B08D57]"
            style={{
              width: goldTraceWidth,
              opacity: goldTraceOpacity,
            }}
          />
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 3: REAL BUILDS
// Proof with depth. Blur → focus animation. More supporting copy.
// =============================================================================

function SmartPageModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-[#0B1220]/90 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] bg-[#0B1220] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0F1A2B] border border-white/10 flex items-center justify-center text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <iframe src="https://nitos.shortlistpass.com/" className="w-full h-full border-0" title="SmartPage" />
      </motion.div>
    </motion.div>
  );
}

function FamilyVaultModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-[#0B1220]/90 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] bg-[#0B1220] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0F1A2B] border border-white/10 flex items-center justify-center text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <iframe src="https://vault.shortlistpass.com/" className="w-full h-full border-0" title="Family Vault" />
      </motion.div>
    </motion.div>
  );
}

function RealBuildsSection() {
  const [isSmartPageModalOpen, setIsSmartPageModalOpen] = useState(false);
  const [isFamilyVaultModalOpen, setIsFamilyVaultModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const smartPageRef = useRef<HTMLDivElement>(null);
  const familyVaultRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const smartPageInView = useInView(smartPageRef, { once: true, margin: "-100px" });
  const familyVaultInView = useInView(familyVaultRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-gradient-to-b from-[#0B1220] to-[#0d1627]">
      <Container>
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#F4F6FA] leading-[1.1] mb-6">
            Real businesses. Real builds.
          </h2>
          <p className="text-lg md:text-xl text-[#A9B4C4]/80 max-w-xl mx-auto">
            We don&apos;t show concepts.<br />
            We show things people actually use — every day.
          </p>
        </motion.div>

        {/* SmartPages block */}
        <div ref={smartPageRef} className="mb-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Image - blur to focus */}
            <motion.div
              className="relative cursor-pointer group flex-shrink-0"
              onClick={() => setIsSmartPageModalOpen(true)}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={smartPageInView ? { opacity: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)" }}
            >
              <img
                src="/nitos-modal-mock.png"
                alt="SmartPage"
                className="block w-[280px] md:w-[320px] h-auto rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[#B08D57]/0 group-hover:bg-[#B08D57]/5 transition-colors duration-300 rounded-2xl" />
            </motion.div>

            {/* Copy - slides in from below */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={smartPageInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-[11px] text-[#B08D57] uppercase tracking-[0.2em] mb-4 font-medium">
                SmartPages
              </p>
              <p className="text-lg md:text-xl text-[#F4F6FA] mb-4">
                Built for businesses that need to look polished fast.
              </p>
              <p className="text-base text-[#A9B4C4]/70 leading-relaxed">
                Replaces basic websites.<br />
                Answers customer questions instantly.<br />
                Makes your business look established from day one.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Family Vault block */}
        <div ref={familyVaultRef}>
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            {/* Image - blur to focus */}
            <motion.div
              className="relative cursor-pointer group flex-shrink-0"
              onClick={() => setIsFamilyVaultModalOpen(true)}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={familyVaultInView ? { opacity: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)" }}
            >
              <img
                src="/family-vault.png"
                alt="Family Vault"
                className="block w-full max-w-[480px] h-auto rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[#B08D57]/0 group-hover:bg-[#B08D57]/5 transition-colors duration-300 rounded-2xl" />
            </motion.div>

            {/* Copy - slides in from below */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={familyVaultInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-[11px] text-[#B08D57] uppercase tracking-[0.2em] mb-4 font-medium">
                Family Vault
              </p>
              <p className="text-lg md:text-xl text-[#F4F6FA] mb-4">
                A private app built for real families.
              </p>
              <p className="text-base text-[#A9B4C4]/70 leading-relaxed">
                Stores memories, voice, and moments.<br />
                Designed to last decades, not trends.<br />
                Proof that we build for real life — not demos.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>

      <SmartPageModal isOpen={isSmartPageModalOpen} onClose={() => setIsSmartPageModalOpen(false)} />
      <FamilyVaultModal isOpen={isFamilyVaultModalOpen} onClose={() => setIsFamilyVaultModalOpen(false)} />
    </section>
  );
}

// =============================================================================
// SECTION 4: CUSTOM BUILDS
// Depth + Flex. Chaos → order animation. Shows problem-solving without words.
// =============================================================================

function CustomBuildsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const visualInView = useInView(visualRef, { once: true, margin: "-50px" });

  // What we build list
  const capabilities = [
    "Custom order forms",
    "Booking flows",
    "Interactive pages",
    "Internal tools",
    "Customer-facing apps",
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0B1220]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#F4F6FA] leading-[1.1] mb-6">
              If you can imagine it,<br />we can build it.
            </h2>

            <p className="text-lg text-[#A9B4C4]/80 mb-8">
              Some businesses need more than a website.
            </p>

            <p className="text-base text-[#A9B4C4]/60 mb-4">We build:</p>
            <ul className="space-y-3 mb-8">
              {capabilities.map((item, index) => (
                <motion.li
                  key={item}
                  className="flex items-center gap-3 text-base text-[#A9B4C4]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <p className="text-base text-[#F4F6FA]/90">
              All designed from scratch — for your business.
            </p>
          </motion.div>

          {/* Visual - chaos to order */}
          <div ref={visualRef} className="relative h-[350px] md:h-[400px]">
            {/* Block 1 - starts misaligned */}
            <motion.div
              className="absolute w-[45%] h-[35%] rounded-xl"
              style={{
                background: "linear-gradient(135deg, #0F1724 0%, #0B1220 100%)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
              }}
              initial={{ left: "5%", top: "5%", rotate: -8 }}
              animate={visualInView ? { left: "0%", top: "0%", rotate: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="p-4 space-y-3">
                <div className="h-3 w-2/3 rounded bg-white/[0.06]" />
                <div className="h-8 rounded bg-[#B08D57]/10" />
              </div>
            </motion.div>

            {/* Block 2 - starts misaligned */}
            <motion.div
              className="absolute w-[50%] h-[40%] rounded-xl"
              style={{
                background: "linear-gradient(180deg, #0F1724 0%, #0A1018 100%)",
                border: "1px solid rgba(176, 141, 87, 0.1)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35)",
              }}
              initial={{ right: "-5%", top: "20%", rotate: 6 }}
              animate={visualInView ? { right: "0%", top: "15%", rotate: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-white/[0.08]" />
                <div className="h-12 rounded bg-gradient-to-br from-[#B08D57]/12 to-transparent" />
                <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
              </div>
            </motion.div>

            {/* Block 3 - starts misaligned */}
            <motion.div
              className="absolute w-[55%] h-[30%] rounded-xl"
              style={{
                background: "linear-gradient(180deg, #0F1724 0%, #0B1220 100%)",
                border: "1px solid rgba(176, 141, 87, 0.15)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
              }}
              initial={{ left: "20%", bottom: "-10%", rotate: 4 }}
              animate={visualInView ? { left: "22%", bottom: "0%", rotate: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="p-4 flex items-center gap-3">
                <div className="h-8 w-24 rounded-full bg-[#B08D57]/20" />
                <div className="h-3 flex-1 rounded bg-white/[0.05]" />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 5: STATEMENT PANEL
// Authority. Phrase-by-phrase reveal. Gold fill on "raises the bar"
// =============================================================================

function StatementSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-40 bg-gradient-to-b from-[#a38542] via-[#d4b87f] to-[#c9a46a] overflow-hidden"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Background darkens subtly */}
      <motion.div
        className="absolute inset-0 bg-[#0B1220]/0"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.05 } : {}}
        transition={{ duration: 1.5, delay: 1 }}
      />

      <Container>
        <div className="max-w-3xl mx-auto text-center">
          {/* Phrase 1 */}
          <motion.h2
            className="text-[32px] md:text-[44px] lg:text-[56px] font-bold text-[#0B1220] leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Good digital doesn&apos;t add work.
          </motion.h2>

          {/* Phrase 2 with gold fill */}
          <motion.h2
            className="text-[32px] md:text-[44px] lg:text-[56px] font-bold text-[#0B1220] leading-[1.1] mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            It{" "}
            <span className="relative inline-block">
              <span className="relative z-10">raises the bar.</span>
              {/* Gold fill behind text */}
              <motion.span
                className="absolute inset-0 bg-[#0B1220]/10 rounded-lg -mx-2 -my-1 px-2 py-1"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </motion.h2>

          {/* Supporting copy */}
          <motion.p
            className="text-lg md:text-xl text-[#0B1220]/70"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Your business looks modern, intentional, and confident —<br className="hidden md:block" />
            without you touching the tech.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 6: HOW IT WORKS
// Reassurance + depth. Connector line draws downward.
// =============================================================================

function ProcessStepNumber({ index, scrollProgress }: { index: number; scrollProgress: MotionValue<number> }) {
  const thresholds = [0.25, 0.45, 0.65];
  const threshold = thresholds[index] || 0.65;

  const color = useTransform(scrollProgress, [threshold - 0.1, threshold], ["rgba(169, 180, 196, 0.3)", "#B08D57"]);
  const borderColor = useTransform(scrollProgress, [threshold - 0.1, threshold], ["rgba(169, 180, 196, 0.15)", "rgba(176, 141, 87, 0.5)"]);
  const bgColor = useTransform(scrollProgress, [threshold - 0.1, threshold], ["transparent", "rgba(176, 141, 87, 0.1)"]);

  return (
    <motion.div
      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-base font-semibold border-2"
      style={{ color, borderColor, backgroundColor: bgColor }}
    >
      {index + 1}
    </motion.div>
  );
}

function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0.2, 0.7], ["0%", "100%"]);
  const closingOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);

  const steps = [
    "We learn how your business actually runs",
    "We design what fits — nothing extra",
    "We build it clean and modern",
  ];

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-[#0B1220]">
      <Container>
        <div className="max-w-xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#F4F6FA] leading-tight mb-16 text-center">
            Working with us is straightforward.
          </h2>

          {/* Steps with connector line */}
          <div className="relative">
            {/* Connector line background */}
            <div className="absolute left-6 top-12 bottom-12 w-px bg-white/10 -translate-x-1/2" />
            {/* Connector line fill */}
            <motion.div
              className="absolute left-6 top-12 w-px bg-[#B08D57]/50 -translate-x-1/2"
              style={{ height: lineHeight }}
            />

            <div className="space-y-10">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-6">
                  <ProcessStepNumber index={index} scrollProgress={scrollYProgress} />
                  <p className="text-lg md:text-xl text-[#A9B4C4]">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Closing reassurance */}
          <motion.p
            className="text-base text-[#A9B4C4]/50 text-center mt-16"
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
// SECTION 7: FINAL CTA
// Confident close. Button glows once. Minimal animation.
// =============================================================================

function FinalCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hasGlowed, setHasGlowed] = useState(false);

  useEffect(() => {
    if (isInView && !hasGlowed) {
      const timer = setTimeout(() => setHasGlowed(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasGlowed]);

  return (
    <section ref={sectionRef} className="py-28 lg:py-40 bg-[#0B1220]">
      <Container>
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-[#F4F6FA] leading-[1.1] mb-6">
            Ready to look established online?
          </h2>

          <p className="text-lg md:text-xl text-[#A9B4C4]/80 mb-12">
            We handle the build.<br />
            You take the credit.
          </p>

          {/* Button with one-time glow */}
          <div className="relative inline-block">
            {/* Glow effect - pulses once */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[#B08D57]"
              initial={{ opacity: 0, scale: 1 }}
              animate={hasGlowed ? { opacity: [0, 0.4, 0], scale: [1, 1.3, 1.3] } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ filter: "blur(20px)" }}
            />

            <a
              href="mailto:hello@shortlistpass.com?subject=Project consult"
              className="relative inline-flex items-center justify-center px-10 py-4 text-base font-semibold bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-all duration-300"
            >
              Book a project consult
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-[#0B1220]">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#A9B4C4]/60">
          <span>&copy; {new Date().getFullYear()} Shortlist Pass</span>
          <span>hello@shortlistpass.com</span>
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
      <DiscoverySection />
      <RealBuildsSection />
      <CustomBuildsSection />
      <StatementSection />
      <HowItWorksSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
