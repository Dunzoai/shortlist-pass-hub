"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { useRef, useState, useEffect } from "react";
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
      staggerChildren: 0.1,
    },
  },
};

// =============================================================================
// ICONS
// =============================================================================

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

// =============================================================================
// SECTION 1: HERO
// =============================================================================

function HeroSection() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      {/* Dark navy background */}
      <div className="absolute inset-0 bg-[#0B1220]" />

      {/* Animated grain/noise layer */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Diagonal light sweep - brass tone */}
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
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[42px] md:text-[56px] lg:text-[64px] font-semibold text-[#F4F6FA] leading-[1.08] mb-6"
          >
            Social that actually shows up.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#A9B4C4] leading-relaxed max-w-2xl mx-auto"
          >
            Get consistent, scroll-stopping content — without living on social media.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-all duration-300"
            >
              See how it works
            </a>
            <a
              href="#examples"
              className="text-sm text-[#A9B4C4] hover:text-[#F4F6FA] transition-colors duration-300"
            >
              View examples
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 2: MOVING BELT (HIGH ENERGY)
// =============================================================================

function MovingBelt() {
  const beltText = "SCROLL-STOPPING CONTENT • POSTS THAT SOUND LIKE YOU • SHOW UP WHERE IT MATTERS • BUILT FOR REAL BUSINESSES • NO TREND CHASING • CONSISTENT VISIBILITY • CONTENT WITH A POINT";

  return (
    <div className="relative overflow-hidden h-14 bg-gradient-to-r from-[#b39347] via-[#d4b87f] to-[#b39347] flex items-center">
      <div
        className="flex items-center whitespace-nowrap animate-scroll-social"
        style={{
          animation: "scroll-social 20s linear infinite",
        }}
      >
        <span className="px-4 text-base font-bold tracking-[0.15em] text-[#0B1220] uppercase leading-none">
          {beltText} •
        </span>
        <span className="px-4 text-base font-bold tracking-[0.15em] text-[#0B1220] uppercase leading-none">
          {beltText} •
        </span>
        <span className="px-4 text-base font-bold tracking-[0.15em] text-[#0B1220] uppercase leading-none">
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

// =============================================================================
// SECTION 3: THE PROBLEM (WHY SOCIAL FAILS)
// =============================================================================

function AnimatedFeedVisualization() {
  // Simulated posts drifting up and fading
  const posts = [
    { id: 1, delay: 0, highlight: false },
    { id: 2, delay: 1.5, highlight: false },
    { id: 3, delay: 3, highlight: true }, // The breakthrough post
    { id: 4, delay: 4.5, highlight: false },
    { id: 5, delay: 6, highlight: false },
  ];

  return (
    <div className="relative h-[320px] w-full max-w-[280px] mx-auto overflow-hidden">
      {/* Feed container */}
      <div className="absolute inset-0 rounded-xl bg-[#0F1A2B]/50 border border-white/5">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            className={`absolute left-4 right-4 h-16 rounded-lg ${
              post.highlight
                ? "bg-gradient-to-r from-[#B08D57]/30 to-[#B08D57]/10 border border-[#B08D57]/40"
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
            {/* Post content placeholder */}
            <div className="p-3 h-full flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
                post.highlight ? "bg-[#B08D57]/40" : "bg-white/10"
              }`} />
              <div className="flex-1 space-y-2">
                <div className={`h-2 rounded ${
                  post.highlight ? "bg-[#B08D57]/40 w-3/4" : "bg-white/10 w-2/3"
                }`} />
                <div className={`h-2 rounded ${
                  post.highlight ? "bg-[#B08D57]/20 w-1/2" : "bg-white/5 w-1/2"
                }`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gradient fade at top */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0B1220] to-transparent pointer-events-none z-10" />
      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0B1220] to-transparent pointer-events-none z-10" />
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
          {/* Title - centered above columns */}
          <motion.h2
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[28px] md:text-[36px] lg:text-[42px] font-semibold text-[#F4F6FA] leading-tight mb-12 text-center"
          >
            Most businesses don&apos;t lose on social — they disappear.
          </motion.h2>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Copy */}
            <motion.div
              variants={fadeUpVariant}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="space-y-4"
            >
              <p className="text-base md:text-lg text-[#A9B4C4]">Posting when you remember.</p>
              <p className="text-base md:text-lg text-[#A9B4C4]">Guessing what works.</p>
              <p className="text-base md:text-lg text-[#A9B4C4]">Getting buried by the algorithm.</p>
              <p className="text-base md:text-lg text-[#A9B4C4]">Too busy to do this right.</p>

              <p className="text-base md:text-lg text-[#F4F6FA] font-medium pt-4">
                And while you&apos;re busy running your business, someone else is showing up consistently.
              </p>
            </motion.div>

            {/* Right side - Animated visualization */}
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

// =============================================================================
// SECTION 4: CAROUSEL - "WHAT SHOWING UP LOOKS LIKE"
// =============================================================================

interface CarouselSlide {
  caption: string;
  industry: string;
  type: "video" | "reel" | "static" | "voice" | "grid";
}

const carouselSlides: CarouselSlide[] = [
  { caption: "Daily specials without sounding salesy", industry: "Restaurant", type: "video" },
  { caption: "Service posts that don't feel boring", industry: "Service Business", type: "reel" },
  { caption: "Offers people actually notice", industry: "Local Brand", type: "static" },
  { caption: "A voice customers recognize instantly", industry: "Salon", type: "voice" },
  { caption: "Consistent presence that builds trust", industry: "Food Truck", type: "grid" },
];

function CarouselPlaceholder({ slide }: { slide: CarouselSlide }) {
  // Different placeholder visuals based on type
  const getPlaceholderContent = () => {
    switch (slide.type) {
      case "video":
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white/80 ml-1" />
            </div>
            <div className="w-3/4 h-2 bg-white/20 rounded mb-2" />
            <div className="w-1/2 h-2 bg-white/20 rounded" />
          </div>
        );
      case "reel":
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/40 to-purple-500/40 mb-3" />
            <div className="w-2/3 h-2 bg-white/20 rounded mb-2" />
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-white/15" />
              <div className="w-6 h-6 rounded-full bg-white/15" />
              <div className="w-6 h-6 rounded-full bg-white/15" />
            </div>
          </div>
        );
      case "static":
        return (
          <div className="absolute inset-0 flex flex-col p-6">
            <div className="text-2xl font-bold text-white/90 leading-tight mb-4">
              &quot;Your hook text goes here&quot;
            </div>
            <div className="mt-auto flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20" />
              <div className="w-20 h-2 bg-white/20 rounded" />
            </div>
          </div>
        );
      case "voice":
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="text-sm text-white/50 mb-2">BEFORE</div>
            <div className="w-full h-12 bg-white/10 rounded mb-4 flex items-center justify-center text-white/40 text-xs">
              Generic template text...
            </div>
            <div className="text-sm text-[#B08D57] mb-2">AFTER</div>
            <div className="w-full h-12 bg-[#B08D57]/20 rounded flex items-center justify-center text-[#B08D57] text-xs font-medium">
              Your authentic voice
            </div>
          </div>
        );
      case "grid":
        return (
          <div className="absolute inset-0 p-4 grid grid-cols-3 gap-1.5">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 rounded"
                style={{ opacity: 0.3 + (i * 0.08) }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-[280px] md:w-[320px] h-[380px] md:h-[420px] bg-gradient-to-br from-[#1a2332] to-[#0F1A2B] rounded-2xl border border-white/10 overflow-hidden flex-shrink-0 transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D57]/30 hover:shadow-lg hover:shadow-[#B08D57]/10">
      {getPlaceholderContent()}

      {/* Labels */}
      <div className="absolute bottom-4 left-4 right-4">
        <span className="inline-block px-3 py-1.5 text-xs font-medium text-[#F4F6FA] bg-white/10 border border-white/10 rounded-full mb-2">
          {slide.industry}
        </span>
        <p className="text-sm text-[#A9B4C4]">{slide.caption}</p>
      </div>
    </div>
  );
}

function WorkCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="examples" className="py-20 lg:py-28 bg-gradient-to-b from-[#0B1220] via-[#0a0f1a] to-[#0B1220]">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-10"
        >
          {/* Header */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm font-medium text-[#B08D57] uppercase tracking-wider text-center mb-3"
          >
            A glimpse at what showing up looks like
          </motion.p>

          <motion.h2
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-[28px] md:text-[36px] font-semibold text-[#F4F6FA] leading-tight text-center"
          >
            Content that actually gets seen.
          </motion.h2>
        </motion.div>
      </Container>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation arrows */}
        <div className="hidden md:block">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#0F1A2B] border border-white/10 flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? "hover:bg-[#B08D57] hover:border-[#B08D57] text-[#A9B4C4] hover:text-[#0B1220]"
                : "opacity-30 cursor-not-allowed text-[#A9B4C4]/50"
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#0F1A2B] border border-white/10 flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? "hover:bg-[#B08D57] hover:border-[#B08D57] text-[#A9B4C4] hover:text-[#0B1220]"
                : "opacity-30 cursor-not-allowed text-[#A9B4C4]/50"
            }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-20 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {carouselSlides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CarouselPlaceholder slide={slide} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 5: HOW WE ACTUALLY HELP (BOLD BRASS SECTION)
// =============================================================================

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  );
}

function WaveformIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h2" />
      <path d="M6 8v8" />
      <path d="M10 5v14" />
      <path d="M14 8v8" />
      <path d="M18 10v4" />
      <path d="M22 12h-2" />
    </svg>
  );
}

function CheckCalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M9 16l2 2 4-4" />
    </svg>
  );
}

function FlowArrowsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
      <circle cx="3" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

interface HelpCardData {
  icon: React.ReactNode;
  headline: string;
  copy: string;
}

const helpCards: HelpCardData[] = [
  {
    icon: <LightbulbIcon className="w-8 h-8" />,
    headline: "Show up in the feed",
    copy: "Scroll-stopping social content designed to beat the algorithms — so your business actually shows up where customers already are.",
  },
  {
    icon: <WaveformIcon className="w-8 h-8" />,
    headline: "One voice, everywhere",
    copy: "We build a recognizable voice your customers instantly associate with you — not generic, not templated, not AI sludge.",
  },
  {
    icon: <CheckCalendarIcon className="w-8 h-8" />,
    headline: "Done without the chaos",
    copy: "Planning, creation, posting — handled. Most clients spend about one hour a month reviewing content.",
  },
  {
    icon: <FlowArrowsIcon className="w-8 h-8" />,
    headline: "Social that feeds the system",
    copy: "Social gets attention. SmartPages and websites turn it into action. Everything works together.",
  },
];

function HelpCard({ card, index }: { card: HelpCardData; index: number }) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group p-7 bg-[#0B1220] border border-[#0B1220]/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0B1220]/20"
    >
      <div className="mb-5 text-[#d4b87f] transition-colors duration-300 group-hover:text-[#B08D57]">
        {card.icon}
      </div>
      <h3 className="text-xl font-semibold text-[#F4F6FA] mb-3">
        {card.headline}
      </h3>
      <p className="text-base text-[#A9B4C4] leading-relaxed">
        {card.copy}
      </p>
    </motion.div>
  );
}

function HowWeHelpSection() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 bg-gradient-to-b from-[#a38542] via-[#d4b87f] to-[#c9a46a]">
      {/* Soft shadow at top for separation */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

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
            className="text-[28px] md:text-[36px] font-semibold text-[#0B1220] leading-tight text-center mb-12"
          >
            How we actually help
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpCards.map((card, index) => (
              <HelpCard key={card.headline} card={card} index={index} />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 6: THE SYSTEM (VISUAL FLOW)
// =============================================================================

function SystemSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0B1220]">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Flow Diagram */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-10"
          >
            {/* Social */}
            <div className="flex items-center">
              <div className="px-6 py-3 bg-[#0F1A2B] border border-white/10 rounded-xl">
                <span className="text-base font-semibold text-[#F4F6FA] uppercase tracking-wide">Social</span>
              </div>
              <svg className="w-12 h-6 text-[#B08D57] hidden md:block" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="0" y1="12" x2="40" y2="12" />
                <polyline points="32 6 40 12 32 18" />
              </svg>
              <svg className="w-6 h-12 text-[#B08D57] md:hidden" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="0" x2="12" y2="40" />
                <polyline points="6 32 12 40 18 32" />
              </svg>
            </div>

            {/* One Clear Page */}
            <div className="flex items-center">
              <div className="px-6 py-3 bg-[#B08D57]/20 border border-[#B08D57]/40 rounded-xl">
                <span className="text-base font-semibold text-[#B08D57] uppercase tracking-wide">One Clear Page</span>
              </div>
              <svg className="w-12 h-6 text-[#B08D57] hidden md:block" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="0" y1="12" x2="40" y2="12" />
                <polyline points="32 6 40 12 32 18" />
              </svg>
              <svg className="w-6 h-12 text-[#B08D57] md:hidden" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="0" x2="12" y2="40" />
                <polyline points="6 32 12 40 18 32" />
              </svg>
            </div>

            {/* Customer Action */}
            <div className="px-6 py-3 bg-[#0F1A2B] border border-white/10 rounded-xl">
              <span className="text-base font-semibold text-[#F4F6FA] uppercase tracking-wide">Customer Action</span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-base md:text-lg text-[#A9B4C4] leading-relaxed"
          >
            Social isn&apos;t the whole system. It&apos;s the front door.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 7: CTA (CALM, CONFIDENT CLOSE)
// =============================================================================

function CTASection() {
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
          {/* Question */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xl md:text-2xl text-[#F4F6FA] font-medium mb-8"
          >
            Want to see what this would look like for your business?
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <a
              href="mailto:hello@shortlistpass.com?subject=15-minute strategy call"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-all duration-300"
            >
              Book a 15-minute strategy call
            </a>
          </motion.div>

          {/* Subtext */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-4 text-sm text-[#A9B4C4]"
          >
            We&apos;ll show you where attention is leaking — and how we&apos;d fix it.
          </motion.p>

          {/* Secondary link */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-8 text-sm text-[#A9B4C4]"
          >
            <a href="#examples" className="text-[#B08D57] hover:text-[#c9a46a] transition-colors">
              Or just browse examples →
            </a>
          </motion.p>
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
    <footer className="border-t border-white/5 py-12">
      <Container>
        <div className="flex flex-col items-center gap-4 text-sm text-[#A9B4C4]">
          {/* Trust signal */}
          <span className="text-xs text-[#A9B4C4]/60">Built for real operators.</span>

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

export default function SocialPage() {
  return (
    <main className="pt-16">
      <HeroSection />
      <MovingBelt />
      <ProblemSection />
      <WorkCarousel />
      <HowWeHelpSection />
      <SystemSection />
      <CTASection />
      <Footer />
    </main>
  );
}
