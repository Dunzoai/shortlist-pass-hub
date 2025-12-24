"use client";

import { motion, useInView, useScroll, useTransform, MotionValue } from "framer-motion";
import { Container } from "@/components/Container";
import { useRef, useState, useEffect, useCallback } from "react";

// =============================================================================
// SECTION 1: HERO
// Immediate status + intrigue. No explanation. Let the scroll do the talking.
// =============================================================================

function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center py-20 lg:py-28 overflow-hidden overflow-x-clip">
      {/* Dark navy background */}
      <div className="absolute inset-0 bg-[#0B1220]" />

      {/* Grid background with parallax */}
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

      {/* Subtle light sweep behind headline */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(176, 141, 87, 0.06) 0%, transparent 50%)",
        }}
      />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          {/* Headline - large, centered */}
          <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-bold text-[#F4F6FA] leading-[1.05] mb-8">
            Look like the business you already are.
          </h1>

          {/* Single line subheadline */}
          <p className="text-lg md:text-xl text-[#A9B4C4] max-w-2xl mx-auto">
            Custom websites and apps that make small businesses feel established.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 2: THE "WAIT... YOU CAN DO THAT?" MOMENT
// Aspirational discovery. This should make them stop scrolling.
// =============================================================================

function DiscoveryVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto">
      {/* Subtle glow behind */}
      <motion.div
        className="absolute -inset-8 rounded-3xl"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(176, 141, 87, 0.08) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.3 }}
      />

      {/* Main container */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 36, 0.95) 0%, rgba(11, 18, 32, 0.98) 100%)",
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(176, 141, 87, 0.1)",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="p-8 md:p-12 lg:p-16">
          {/* Abstract UI moments - no labels, no fake buttons */}
          <div className="space-y-6">
            {/* Top row - subtle blocks */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="h-16 flex-1 rounded-xl bg-gradient-to-r from-[#B08D57]/10 to-transparent" />
              <div className="h-16 w-32 rounded-xl bg-white/[0.03]" />
            </motion.div>

            {/* Middle - larger element with glow */}
            <motion.div
              className="h-28 rounded-xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(176, 141, 87, 0.08) 0%, rgba(176, 141, 87, 0.02) 100%)",
                boxShadow: "inset 0 0 40px rgba(176, 141, 87, 0.05)",
              }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Soft edge glow */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(176, 141, 87, 0.1)",
                }}
              />
            </motion.div>

            {/* Bottom row - three small blocks */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="h-12 flex-1 rounded-lg bg-white/[0.04]" />
              <div className="h-12 flex-1 rounded-lg bg-[#B08D57]/8" />
              <div className="h-12 flex-1 rounded-lg bg-white/[0.03]" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DiscoverySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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
            Most small businesses don&apos;t know<br className="hidden md:block" /> this is even an option.
          </h2>
          <p className="text-lg md:text-xl text-[#A9B4C4]/80">
            Clean layouts. Smart interactions. Built exactly for how you operate.
          </p>
        </motion.div>

        {/* Visual */}
        <DiscoveryVisual />
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 3: REAL BUILDS
// Proof without explaining. Confidence over cleverness.
// =============================================================================

function SmartPageModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
    >
      <div className="absolute inset-0 bg-[#0B1220]/90 backdrop-blur-sm" />
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] bg-[#0B1220] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0F1A2B] border border-white/10 flex items-center justify-center text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <iframe
          src="https://nitos.shortlistpass.com/"
          className="w-full h-full border-0"
          title="SmartPage"
        />
      </motion.div>
    </motion.div>
  );
}

function FamilyVaultModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
    >
      <div className="absolute inset-0 bg-[#0B1220]/90 backdrop-blur-sm" />
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] bg-[#0B1220] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0F1A2B] border border-white/10 flex items-center justify-center text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <iframe
          src="https://vault.shortlistpass.com/"
          className="w-full h-full border-0"
          title="Family Vault"
        />
      </motion.div>
    </motion.div>
  );
}

function RealBuildsSection() {
  const [isSmartPageModalOpen, setIsSmartPageModalOpen] = useState(false);
  const [isFamilyVaultModalOpen, setIsFamilyVaultModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const openSmartPageModal = useCallback(() => setIsSmartPageModalOpen(true), []);
  const closeSmartPageModal = useCallback(() => setIsSmartPageModalOpen(false), []);
  const openFamilyVaultModal = useCallback(() => setIsFamilyVaultModalOpen(true), []);
  const closeFamilyVaultModal = useCallback(() => setIsFamilyVaultModalOpen(false), []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0B1220]">
      <Container>
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] text-[#B08D57] uppercase tracking-[0.2em] mb-6 font-medium">
            Real Builds
          </p>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#F4F6FA] leading-[1.1]">
            Not concepts. Not templates.<br />Real things we&apos;ve built.
          </h2>
        </motion.div>

        {/* SmartPages preview */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
              onClick={openSmartPageModal}
              style={{
                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)",
              }}
            >
              <img
                src="/nitos-modal-mock.png"
                alt="SmartPage"
                className="block w-[280px] md:w-[320px] h-auto rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#B08D57]/0 group-hover:bg-[#B08D57]/5 transition-colors duration-300 rounded-2xl" />
            </div>
            <div className="text-center lg:text-left">
              <p className="text-lg md:text-xl text-[#A9B4C4]/70">
                A real SmartPage built for a real business.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Family Vault preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
              onClick={openFamilyVaultModal}
              style={{
                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)",
              }}
            >
              <img
                src="/family-vault.png"
                alt="Family Vault"
                className="block w-full max-w-[480px] h-auto rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[#B08D57]/0 group-hover:bg-[#B08D57]/5 transition-colors duration-300 rounded-2xl" />
            </div>
            <div className="text-center lg:text-left">
              <p className="text-lg md:text-xl text-[#A9B4C4]/70">
                A private app built for real life — not a demo.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>

      <SmartPageModal isOpen={isSmartPageModalOpen} onClose={closeSmartPageModal} />
      <FamilyVaultModal isOpen={isFamilyVaultModalOpen} onClose={closeFamilyVaultModal} />
    </section>
  );
}

// =============================================================================
// SECTION 4: CUSTOM BUILDS
// Status, not features. Should feel expensive, not instructional.
// =============================================================================

function CustomBuildsVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hasGlowed, setHasGlowed] = useState(false);

  useEffect(() => {
    if (isInView && !hasGlowed) {
      setHasGlowed(true);
    }
  }, [isInView, hasGlowed]);

  return (
    <div ref={containerRef} className="relative max-w-md mx-auto lg:mx-0">
      {/* Calm architectural layout */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0F1724 0%, #0B1220 100%)",
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Soft glow pulse once on scroll */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: "inset 0 0 60px rgba(176, 141, 87, 0.08)",
          }}
          initial={{ opacity: 0 }}
          animate={hasGlowed ? { opacity: [0, 1, 0.3] } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        <div className="p-8 md:p-10 space-y-5">
          {/* Abstract blocks - one strong visual moment */}
          <div className="h-6 w-2/3 rounded bg-white/[0.04]" />
          <div className="h-20 rounded-lg bg-gradient-to-br from-[#B08D57]/10 to-transparent" />
          <div className="flex gap-3">
            <div className="h-14 flex-1 rounded bg-white/[0.03]" />
            <div className="h-14 flex-1 rounded bg-white/[0.05]" />
          </div>
          <div className="h-5 w-1/2 rounded bg-white/[0.03]" />
        </div>
      </motion.div>
    </div>
  );
}

function CustomBuildsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-gradient-to-b from-[#0B1220] to-[#0d1627]">
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
            <p className="text-lg md:text-xl text-[#A9B4C4]/80">
              Websites and apps made from scratch — designed around your business, not a template.
            </p>
          </motion.div>

          {/* Visual */}
          <CustomBuildsVisual />
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 5: STATEMENT PANEL
// Breathing room. Full-width contrast.
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

      <Container>
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Big statement */}
          <h2 className="text-[32px] md:text-[44px] lg:text-[56px] font-bold text-[#0B1220] leading-[1.1] mb-4">
            Good digital doesn&apos;t add work.
          </h2>
          <h2 className="text-[32px] md:text-[44px] lg:text-[56px] font-bold text-[#0B1220] leading-[1.1] mb-10">
            It{" "}
            <span className="relative inline-block">
              raises the bar.
              <motion.span
                className="absolute -bottom-2 left-0 h-[4px] bg-[#0B1220]"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              />
            </span>
          </h2>

          {/* Supporting line */}
          <p className="text-lg md:text-xl text-[#0B1220]/70">
            Your business looks intentional, modern, and confident — without you touching the tech.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 6: HOW IT WORKS
// Reassurance, not process. Clear steps. No surprises.
// =============================================================================

function ProcessStepNumber({ index, scrollProgress }: { index: number; scrollProgress: MotionValue<number> }) {
  const thresholds = [0.25, 0.45, 0.65];
  const threshold = thresholds[index] || 0.65;

  const color = useTransform(
    scrollProgress,
    [threshold - 0.1, threshold],
    ["rgba(169, 180, 196, 0.3)", "#B08D57"]
  );

  const borderColor = useTransform(
    scrollProgress,
    [threshold - 0.1, threshold],
    ["rgba(169, 180, 196, 0.15)", "rgba(176, 141, 87, 0.5)"]
  );

  return (
    <motion.div
      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-base font-semibold border-2"
      style={{ color, borderColor }}
    >
      {index + 1}
    </motion.div>
  );
}

function ProcessConnectorLine({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const height = useTransform(scrollProgress, [0.2, 0.7], ["0%", "100%"]);

  return (
    <div className="absolute left-6 top-12 bottom-12 w-px bg-white/10 -translate-x-1/2">
      <motion.div
        className="w-full bg-[#B08D57]/40"
        style={{ height }}
      />
    </div>
  );
}

function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const steps = [
    "Understand your business",
    "Design what fits",
    "Build it cleanly",
  ];

  const closingOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-[#0B1220]">
      <Container>
        <div className="max-w-xl mx-auto">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#F4F6FA] leading-tight mb-16 text-center">
            Working with us is simple.
          </h2>

          {/* Steps with connector line */}
          <div className="relative">
            <ProcessConnectorLine scrollProgress={scrollYProgress} />

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
// Confidence, not push. This is the moment.
// =============================================================================

function FinalCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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
            Ready to look like you belong?
          </h2>

          <p className="text-lg md:text-xl text-[#A9B4C4]/80 mb-12">
            We&apos;ll handle the build. You take the credit.
          </p>

          <a
            href="mailto:hello@shortlistpass.com?subject=Project consult"
            className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-all duration-300"
          >
            Book a project consult
          </a>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#A9B4C4]/60">
          <span>&copy; {year} Shortlist Pass</span>
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
