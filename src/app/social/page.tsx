"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { useRef, useState } from "react";
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

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function CalendarRefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M17 14l-5 5-3-3" />
    </svg>
  );
}

function VoiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function FlowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 12h10" />
      <path d="M14 8l3 4-3 4" />
    </svg>
  );
}

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
    <section className="relative py-28 lg:py-36">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0d1627] to-[#0B1220]" />

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
            className="text-lg md:text-xl text-[#A9B4C4] leading-relaxed max-w-2xl mx-auto mb-4"
          >
            Get consistent, scroll-stopping social content — without living on Instagram.
          </motion.p>

          {/* Credibility line */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-sm text-[#A9B4C4]/70"
          >
            Built for real businesses, not influencer accounts.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
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
// SECTION 2: THE PROBLEM (WHY SOCIAL FAILS)
// =============================================================================

function ProblemSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Title */}
          <motion.h2
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[28px] md:text-[36px] lg:text-[42px] font-semibold text-[#F4F6FA] leading-tight mb-10"
          >
            Most businesses don&apos;t lose on social — they disappear.
          </motion.h2>

          {/* Pain points */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="space-y-3 text-base md:text-lg text-[#A9B4C4]"
          >
            <p>You&apos;re too busy running your business to post 3–5x per week.</p>
            <p>Posting randomly doesn&apos;t work.</p>
            <p>Sounding generic doesn&apos;t work.</p>
            <p>And hoping the algorithm is &quot;nice&quot; definitely doesn&apos;t work.</p>
          </motion.div>

          {/* Cost of inaction */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-8 text-base md:text-lg text-[#A9B4C4]"
          >
            And while you&apos;re busy running your business, someone else is showing up consistently.
          </motion.p>

          {/* Bridge line */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-8 text-lg md:text-xl text-[#F4F6FA] font-semibold"
          >
            Here&apos;s what actually works.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 3: CAROUSEL - "A GLIMPSE AT OUR WORK"
// =============================================================================

interface CarouselSlide {
  label: string;
  industry: string;
  type: "video" | "reel" | "static" | "voice" | "grid";
}

const carouselSlides: CarouselSlide[] = [
  { label: "Short-form video", industry: "Restaurant", type: "video" },
  { label: "Reel", industry: "Service business", type: "reel" },
  { label: "Static post", industry: "Local brand", type: "static" },
  { label: "Brand voice", industry: "Salon", type: "voice" },
  { label: "Content grid", industry: "Food truck", type: "grid" },
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
        <p className="text-xs text-[#A9B4C4]">{slide.label}</p>
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
          <motion.h2
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[28px] md:text-[36px] font-semibold text-[#F4F6FA] leading-tight text-center mb-3"
          >
            What showing up actually looks like.
          </motion.h2>

          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-base text-[#A9B4C4] text-center"
          >
            Real brands. Real content. Built to stop the scroll.
          </motion.p>
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
// SECTION 4: HOW WE HELP (SOCIAL-SPECIFIC CARDS)
// =============================================================================

interface HelpCardData {
  icon: React.ReactNode;
  headline: string;
  copy: string;
}

const helpCards: HelpCardData[] = [
  {
    icon: <SparkIcon className="w-8 h-8" />,
    headline: "Built to stop the scroll.",
    copy: "We design posts that compete with entertainment and big brands — without needing you to post constantly or chase trends.",
  },
  {
    icon: <CalendarRefreshIcon className="w-8 h-8" />,
    headline: "Show up without living on Instagram.",
    copy: "We handle planning, creation, and posting. Most clients spend about one hour a month reviewing content — that's it.",
  },
  {
    icon: <VoiceIcon className="w-8 h-8" />,
    headline: "Your voice. Not internet sludge.",
    copy: "AI content all sounds the same. We build a recognizable voice so customers know it's you — instantly.",
  },
  {
    icon: <FlowIcon className="w-8 h-8" />,
    headline: "Social that feeds the system.",
    copy: "Social gets attention. SmartPages and websites turn it into action. We design everything to work together — not in silos.",
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
      className="group p-7 bg-[#0F1A2B] border border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D57]/30 hover:shadow-lg hover:shadow-[#B08D57]/5"
    >
      <div className="mb-5 text-[#B08D57] transition-colors duration-300 group-hover:text-[#d4b87f]">
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
    <section id="how-it-works" className="py-20 lg:py-28">
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
            className="text-[28px] md:text-[36px] font-semibold text-[#F4F6FA] leading-tight text-center mb-12"
          >
            How we help
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
// SECTION 5: THE SYSTEM
// =============================================================================

function SystemSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#0B1220] via-[#0d1627] to-[#0B1220]">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Headline */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xl md:text-2xl text-[#F4F6FA] font-semibold leading-relaxed mb-12"
          >
            Social alone doesn&apos;t convert. Systems do.
          </motion.p>

          {/* Flow Diagram */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-12"
          >
            {/* Social */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="px-5 py-3 bg-[#0F1A2B] border border-white/10 rounded-xl">
                <span className="text-sm md:text-base font-medium text-[#F4F6FA]">Social</span>
              </div>
              <svg className="w-6 h-6 text-[#B08D57] hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <svg className="w-6 h-6 text-[#B08D57] md:hidden rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            {/* SmartPage */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="px-5 py-3 bg-[#B08D57]/20 border border-[#B08D57]/40 rounded-xl">
                <span className="text-sm md:text-base font-medium text-[#B08D57]">One Clear Page</span>
              </div>
              <svg className="w-6 h-6 text-[#B08D57] hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <svg className="w-6 h-6 text-[#B08D57] md:hidden rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            {/* Customer Action */}
            <div className="px-5 py-3 bg-[#0F1A2B] border border-white/10 rounded-xl">
              <span className="text-sm md:text-base font-medium text-[#F4F6FA]">Customer Action</span>
            </div>
          </motion.div>

          {/* Supporting text */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-[#A9B4C4] leading-relaxed"
          >
            We design everything to work together — not in silos.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// CTA SECTION
// =============================================================================

function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-xl mx-auto text-center"
        >
          {/* Primary CTA */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-4 text-sm text-[#A9B4C4]"
          >
            We&apos;ll show you where attention is leaking — and how we&apos;d fix it.
          </motion.p>

          {/* Secondary link */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-8 text-sm text-[#A9B4C4]"
          >
            Just browsing?{" "}
            <a href="#examples" className="text-[#B08D57] hover:text-[#c9a46a] transition-colors">
              See our work →
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
      <ProblemSection />
      <WorkCarousel />
      <HowWeHelpSection />
      <SystemSection />
      <CTASection />
      <Footer />
    </main>
  );
}
