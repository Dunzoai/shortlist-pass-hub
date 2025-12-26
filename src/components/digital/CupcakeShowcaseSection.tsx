"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { WhyBlock } from "@/components/WhyBlock";

// --- EDITABLE COPY ---
const CUPCAKE_COPY = {
  // Hero above cupcake
  hero: {
    headline: "Stop asking customers to imagine it.",
    headlineLine2: "Show them what they're getting.",
    sub: "As they scroll, the offer comes together — step by step — until the decision is obvious.",
  },
  // Build sequence copy (industry-agnostic progress labels)
  states: [
    "Foundation",
    "Options",
    "Details",
    "Finish",
    "Ready to move forward.",
  ],
  // Why block (after cupcake)
  why: {
    heading: "Why we built it this way",
    lines: [
      "Most websites explain. The better ones show.",
      "When customers can see how something comes together — instead of reading about it — they understand faster, feel more confident, and decide sooner.",
      "This turns your offer into a visual flow: one step at a time, no guessing, no friction.",
      "Whether you're selling a product, a service, or a custom job — people don't have to imagine it anymore.",
    ],
  },
  // Optional closer
  closer: {
    line1: "Clarity sells.",
    line2: "Confidence closes.",
  },
};

const CUPCAKE_IMAGES = [
  "/cupcake 1.png",
  "/cupcake 2.png",
  "/cupcake 3.png",
  "/cupcake 4.png",
  "/cupcake 5.png",
];

export function CupcakeShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);

  const SCROLL_THRESHOLD = 150; // Pixels of scroll to advance one state
  const TOTAL_STATES = CUPCAKE_IMAGES.length;

  // Lock scroll when section enters viewport
  useEffect(() => {
    if (prefersReducedMotion || isComplete) return;

    const section = sectionRef.current;
    if (!section) return;

    let isScrolling = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Lock when 25% visible (triggers earlier on desktop)
          if (entry.isIntersecting && entry.intersectionRatio > 0.25 && !isScrolling) {
            if (!isComplete && !isLocked) {
              isScrolling = true;

              // Smooth scroll to center
              section.scrollIntoView({ behavior: "smooth", block: "center" });

              // Wait for smooth scroll to complete, then lock
              setTimeout(() => {
                setIsLocked(true);
                isScrolling = false;
              }, 400); // Enough time for smooth scroll
            }
          }
        });
      },
      { threshold: [0.25] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion, isComplete, isLocked]);

  // Handle wheel events when locked
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isLocked || isComplete) return;

      e.preventDefault();

      const now = Date.now();
      // Debounce rapid scrolls
      if (now - lastScrollTime.current < 50) return;
      lastScrollTime.current = now;

      scrollAccumulator.current += Math.abs(e.deltaY);

      if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
        scrollAccumulator.current = 0;

        if (e.deltaY > 0) {
          // Scrolling down - advance
          if (activeIndex < TOTAL_STATES - 1) {
            setActiveIndex((prev) => prev + 1);
          } else {
            // Reached the end - unlock
            setIsLocked(false);
            setIsComplete(true);
          }
        } else {
          // Scrolling up - go back
          if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
          } else {
            // At beginning, scrolling up - unlock to go back
            setIsLocked(false);
            setIsComplete(true);
          }
        }
      }
    },
    [isLocked, isComplete, activeIndex, TOTAL_STATES]
  );

  // Handle touch events for mobile
  const touchStart = useRef(0);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isLocked || isComplete) return;

      e.preventDefault();

      const touchY = e.touches[0].clientY;
      const deltaY = touchStart.current - touchY;

      if (Math.abs(deltaY) > 50) {
        touchStart.current = touchY;

        if (deltaY > 0) {
          // Swiping up (scrolling down)
          if (activeIndex < TOTAL_STATES - 1) {
            setActiveIndex((prev) => prev + 1);
          } else {
            setIsLocked(false);
            setIsComplete(true);
          }
        } else {
          // Swiping down (scrolling up)
          if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
          } else {
            setIsLocked(false);
            setIsComplete(true);
          }
        }
      }
    },
    [isLocked, isComplete, activeIndex, TOTAL_STATES]
  );

  // Attach/detach event listeners
  useEffect(() => {
    if (isLocked) {
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = "";
    };
  }, [isLocked, handleWheel, handleTouchStart, handleTouchMove]);

  // Manual navigation for reduced motion
  const handleNext = () => {
    if (activeIndex < TOTAL_STATES - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // Reduced motion: simple static layout
  if (prefersReducedMotion) {
    return (
      <>
        {/* Combined Hero + Cupcake with manual controls */}
        <section className="bg-[#F4F1EC] py-16 lg:py-24">
          <div className="max-w-[800px] mx-auto px-6">
            {/* Hero text */}
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-[26px] md:text-[34px] lg:text-[42px] font-bold text-[#1A1F24] leading-tight mb-2">
                {CUPCAKE_COPY.hero.headline}
                <br />
                <span className="text-[#2E8B57]">{CUPCAKE_COPY.hero.headlineLine2}</span>
              </h2>
              <p className="text-sm md:text-base text-[#5A6570]/80 max-w-lg mx-auto">
                {CUPCAKE_COPY.hero.sub}
              </p>
            </div>

            {/* Cupcake */}
            <div className="flex flex-col items-center mb-16">
              <div className="relative w-[220px] h-[260px] md:w-[280px] md:h-[340px]">
                {CUPCAKE_IMAGES.map((src, index) => (
                  <div
                    key={src}
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ opacity: index <= activeIndex ? 1 : 0 }}
                  >
                    <Image
                      src={src}
                      alt={`Cupcake stage ${index + 1}`}
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-base md:text-lg text-[#1A1F24] font-medium text-center">
                {CUPCAKE_COPY.states[activeIndex]}
              </p>
              <div className="flex items-center gap-2 mt-4">
                {CUPCAKE_IMAGES.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-6 bg-[#2E8B57]"
                        : index < activeIndex
                        ? "w-1.5 bg-[#2E8B57]/50"
                        : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className="px-4 py-2 text-sm text-[#5A6570] border border-white/10 rounded-lg disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeIndex === TOTAL_STATES - 1}
                  className="px-4 py-2 text-sm bg-[#2E8B57] text-[#F4F1EC] font-medium rounded-lg disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
            <WhyBlock heading={CUPCAKE_COPY.why.heading} lines={CUPCAKE_COPY.why.lines} />

            {/* Closer */}
            <div className="mt-10 text-center">
              <p className="text-lg md:text-xl font-semibold text-[#1A1F24]">
                {CUPCAKE_COPY.closer.line1}
              </p>
              <p className="text-lg md:text-xl font-semibold text-[#2E8B57]">
                {CUPCAKE_COPY.closer.line2}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Combined Hero + Cupcake Section - all visible when locked */}
      <section
        ref={sectionRef}
        className="relative bg-[#F4F1EC] min-h-screen flex flex-col items-center justify-center py-12 lg:py-16"
      >
        <div className="w-full max-w-[800px] mx-auto px-6">
          {/* Hero text - stays visible during build */}
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-[26px] md:text-[34px] lg:text-[42px] font-bold text-[#1A1F24] leading-tight mb-2">
              {CUPCAKE_COPY.hero.headline}
              <br />
              <span className="text-[#2E8B57]">{CUPCAKE_COPY.hero.headlineLine2}</span>
            </h2>
            <p className="text-sm md:text-base text-[#5A6570]/80 max-w-lg mx-auto">
              {CUPCAKE_COPY.hero.sub}
            </p>
          </div>

          {/* Cupcake build area */}
          <div className="flex flex-col items-center">
            {/* Stacked cupcake images */}
            <div className="relative w-[220px] h-[260px] md:w-[280px] md:h-[340px]">
              {CUPCAKE_IMAGES.map((src, index) => (
                <motion.div
                  key={src}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: index <= activeIndex ? 1 : 0,
                    y: index <= activeIndex ? 0 : 4,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={src}
                    alt={`Cupcake stage ${index + 1}`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </motion.div>
              ))}
            </div>

            {/* State copy */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                className="mt-4 text-base md:text-lg text-[#1A1F24] font-medium text-center"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.3 }}
              >
                {CUPCAKE_COPY.states[activeIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mt-4">
              {CUPCAKE_IMAGES.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-6 bg-[#2E8B57]"
                      : index < activeIndex
                      ? "w-1.5 bg-[#2E8B57]/50"
                      : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* Scroll hint */}
            {isLocked && activeIndex < TOTAL_STATES - 1 && (
              <motion.p
                className="mt-6 text-xs text-[#5A6570]/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Keep scrolling
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Why block - after the build */}
      <div className="bg-[#F4F1EC] py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6">
          <WhyBlock heading={CUPCAKE_COPY.why.heading} lines={CUPCAKE_COPY.why.lines} />
        </div>
      </div>
    </>
  );
}
