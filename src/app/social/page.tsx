"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";

// =============================================================================
// COMING SOON PAGE WITH PUZZLE ANIMATION
// =============================================================================

function PuzzlePiece({
  children,
  index,
  totalPieces
}: {
  children: React.ReactNode;
  index: number;
  totalPieces: number;
}) {
  // Different starting positions for each piece
  const getInitialPosition = (idx: number) => {
    const positions = [
      { x: -200, y: -200, rotate: -45 },  // top-left
      { x: 200, y: -200, rotate: 45 },    // top-right
      { x: -200, y: 200, rotate: 45 },    // bottom-left
      { x: 200, y: 200, rotate: -45 },    // bottom-right
      { x: 0, y: -300, rotate: 0 },       // top-center
      { x: 0, y: 300, rotate: 0 },        // bottom-center
    ];
    return positions[idx % positions.length];
  };

  const initial = getInitialPosition(index);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{
        x: initial.x,
        y: initial.y,
        rotate: initial.rotate,
        opacity: 0,
        scale: 0.8
      }}
      animate={{
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        scale: 1
      }}
      transition={{
        duration: 0.8,
        delay: 0.1 + (index * 0.15),
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}

function ComingSoonSection() {
  // Create 4 puzzle pieces (2x2 grid)
  const pieces = [
    { clipPath: "inset(0 50% 50% 0)" },    // top-left
    { clipPath: "inset(0 0 50% 50%)" },    // top-right
    { clipPath: "inset(50% 50% 0 0)" },    // bottom-left
    { clipPath: "inset(50% 0 0 50%)" },    // bottom-right
  ];

  return (
    <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-16 px-6">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Puzzle Image Container */}
          <div className="relative w-full max-w-md mx-auto aspect-square mb-12">
            {pieces.map((piece, index) => (
              <PuzzlePiece key={index} index={index} totalPieces={pieces.length}>
                <img
                  src="/storystreet/coming-soon.png"
                  alt="Coming Soon"
                  className="w-full h-full object-contain"
                  style={{ clipPath: piece.clipPath }}
                />
              </PuzzlePiece>
            ))}
          </div>

          {/* Editorial Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <h1
              className="text-[28px] md:text-[36px] lg:text-[42px] font-normal text-[#1A1F24] leading-tight mb-6"
              style={{ fontFamily: "var(--font-libre-baskerville)" }}
            >
              We&apos;re rebuilding this page.
            </h1>

            <p className="text-base md:text-lg text-[#5A6570] leading-relaxed mb-8">
              Our client roster just got a whole lot more interesting. We&apos;re
              putting together something that actually shows what happens when
              small businesses stop blending in and start getting noticed.
            </p>

            <p className="text-base md:text-lg text-[#1A1F24] font-medium">
              Check back soon — or better yet, become one of the businesses we showcase.
            </p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-10"
            >
              <a
                href="mailto:hello@shortlistpass.com?subject=I want to show up"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-[#2B3A44] text-[#F4F1EC] rounded-full hover:bg-[#1A1F24] transition-all duration-300"
              >
                Let&apos;s talk
              </a>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default function SocialPage() {
  return (
    <main className="pt-16 bg-[#F4F1EC] min-h-screen">
      <ComingSoonSection />
    </main>
  );
}

// =============================================================================
// TEMPLATE: ORIGINAL SOCIAL PAGE DESIGN (PRESERVED FOR FUTURE USE)
// =============================================================================
//
// Uncomment the code below and replace the current export to restore the
// full social page with all sections.
//
// -----------------------------------------------------------------------------

/*
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useScroll, useTransform } from "framer-motion";

// ANIMATION VARIANTS
const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ICONS
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// SECTION 1: HERO
function HeroSection() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-[#F4F1EC]" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
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
          <motion.h1
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[42px] md:text-[56px] lg:text-[64px] font-normal text-[#1A1F24] leading-[1.08] mb-6"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
          >
            Social that actually shows up.
          </motion.h1>
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#5A6570] leading-relaxed max-w-2xl mx-auto"
          >
            Get consistent, scroll-stopping content — without living on social media.
          </motion.p>
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium bg-[#2B3A44] text-[#F4F1EC] rounded-full hover:bg-[#1A1F24] transition-all duration-300"
            >
              See how it works
            </a>
            <a
              href="#examples"
              className="text-sm text-[#5A6570] hover:text-[#1A1F24] transition-colors duration-300"
            >
              View examples
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// SECTION 2: MOVING BELT
function MovingBelt() {
  const beltText = "SCROLL-STOPPING CONTENT • POSTS THAT SOUND LIKE YOU • SHOW UP WHERE IT MATTERS • BUILT FOR REAL BUSINESSES • NO TREND CHASING • CONSISTENT VISIBILITY • CONTENT WITH A POINT";

  return (
    <div className="relative overflow-hidden h-14 bg-gradient-to-r from-[#2B3A44] via-[#2B3A44] to-[#2B3A44] flex items-center">
      <div
        className="flex items-center whitespace-nowrap animate-scroll-social"
        style={{
          animation: "scroll-social 20s linear infinite",
        }}
      >
        <span className="px-4 text-base font-bold tracking-[0.15em] text-[#F4F1EC] uppercase leading-none">
          {beltText} •
        </span>
        <span className="px-4 text-base font-bold tracking-[0.15em] text-[#F4F1EC] uppercase leading-none">
          {beltText} •
        </span>
        <span className="px-4 text-base font-bold tracking-[0.15em] text-[#F4F1EC] uppercase leading-none">
          {beltText} •
        </span>
      </div>
      <style jsx>{`
        @keyframes scroll-social {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}

// SECTION 3: THE PROBLEM
function AnimatedFeedVisualization() {
  const posts = [
    { id: 1, delay: 0, highlight: false },
    { id: 2, delay: 1.5, highlight: false },
    { id: 3, delay: 3, highlight: true },
    { id: 4, delay: 4.5, highlight: false },
    { id: 5, delay: 6, highlight: false },
  ];

  return (
    <div className="relative h-[320px] w-full max-w-[280px] mx-auto overflow-hidden">
      <div className="absolute inset-0 rounded-xl bg-[#F4F1EC]/50 border border-white/5">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            className={`absolute left-4 right-4 h-16 rounded-lg ${
              post.highlight
                ? "bg-gradient-to-r from-[#2B3A44]/30 to-[#2B3A44]/10 border border-[#2B3A44]/40"
                : "bg-white/5 border border-white/5"
            }`}
            initial={{ y: 280, opacity: 0 }}
            animate={{
              y: [-20, -320],
              opacity: post.highlight ? [0, 1, 1, 0.8] : [0, 0.6, 0.3, 0],
            }}
            transition={{
              duration: 8,
              delay: post.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="p-3 h-full flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
                post.highlight ? "bg-[#2B3A44]/40" : "bg-white/10"
              }`} />
              <div className="flex-1 space-y-2">
                <div className={`h-2 rounded ${
                  post.highlight ? "bg-[#2B3A44]/40 w-3/4" : "bg-white/10 w-2/3"
                }`} />
                <div className={`h-2 rounded ${
                  post.highlight ? "bg-[#2B3A44]/20 w-1/2" : "bg-white/5 w-1/2"
                }`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#F4F1EC] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F1EC] to-transparent pointer-events-none z-10" />
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="py-20 lg:py-28">
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
            className="text-[28px] md:text-[36px] lg:text-[42px] font-normal text-[#1A1F24] leading-tight mb-12 text-center"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
          >
            Most businesses don&apos;t lose on social — they disappear.
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              variants={fadeUpVariant}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="space-y-4"
            >
              <p className="text-base md:text-lg text-[#5A6570]">Posting when you remember.</p>
              <p className="text-base md:text-lg text-[#5A6570]">Guessing what works.</p>
              <p className="text-base md:text-lg text-[#5A6570]">Getting buried by the algorithm.</p>
              <p className="text-base md:text-lg text-[#5A6570]">Too busy to do this right.</p>
              <p className="text-base md:text-lg text-[#1A1F24] font-medium pt-4">
                And while you&apos;re busy running your business, someone else is showing up consistently.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUpVariant}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <AnimatedFeedVisualization />
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// Additional sections (WorkCarousel, HowWeHelpSection, SystemSection, CTASection, Footer)
// can be found in git history or restored from backup if needed.

// MAIN PAGE (TEMPLATE VERSION)
function SocialPageTemplate() {
  return (
    <main className="pt-16">
      <HeroSection />
      <MovingBelt />
      <ProblemSection />
    </main>
  );
}
*/
