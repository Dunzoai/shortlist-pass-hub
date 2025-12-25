"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { WhyBlock } from "@/components/WhyBlock";

// --- EDITABLE COPY ---
const CUPCAKE_COPY = {
  states: [
    "Start with the base.",
    "Add the cake.",
    "Top it off.",
    "That's it.",
    "Ready to order.",
  ],
  headline: "Ordering doesn't have to feel like a form.",
  subline: "We let customers see their order come together as they scroll.",
  why: {
    heading: "Why we built it this way",
    lines: [
      "When people can see the result, they decide faster — and with more confidence.",
    ],
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

  // Lock scroll when section enters viewport center
  useEffect(() => {
    if (prefersReducedMotion || isComplete) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Section is more than 50% visible - lock it
            if (!isComplete) {
              setIsLocked(true);
              // Scroll section to center
              section.scrollIntoView({ behavior: "instant", block: "center" });
            }
          }
        });
      },
      { threshold: [0.5] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion, isComplete]);

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
      <section className="bg-[#0B1220] py-24 lg:py-32">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <div className="relative w-[280px] h-[320px] md:w-[340px] md:h-[400px]">
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
            <p className="mt-6 text-lg md:text-xl text-[#F4F6FA] font-medium text-center">
              {CUPCAKE_COPY.states[activeIndex]}
            </p>
            <div className="flex items-center gap-2 mt-6">
              {CUPCAKE_IMAGES.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-6 bg-[#B08D57]"
                      : index < activeIndex
                      ? "w-1.5 bg-[#B08D57]/50"
                      : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="px-4 py-2 text-sm text-[#A9B4C4] border border-white/10 rounded-lg disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={activeIndex === TOTAL_STATES - 1}
                className="px-4 py-2 text-sm bg-[#B08D57] text-[#0B1220] font-medium rounded-lg disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-bold text-[#F4F6FA] leading-tight mb-4">
              {CUPCAKE_COPY.headline}
            </h2>
            <p className="text-base md:text-lg text-[#A9B4C4]">
              {CUPCAKE_COPY.subline}
            </p>
          </div>
          <WhyBlock heading={CUPCAKE_COPY.why.heading} lines={CUPCAKE_COPY.why.lines} />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Cupcake Build Section */}
      <section
        ref={sectionRef}
        className="relative bg-[#0B1220] min-h-screen flex flex-col items-center justify-center py-16"
      >
        <div className="w-full max-w-[800px] mx-auto px-6">
          <div className="flex flex-col items-center">
            {/* Stacked cupcake images */}
            <div className="relative w-[280px] h-[320px] md:w-[340px] md:h-[400px]">
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
                className="mt-6 text-lg md:text-xl text-[#F4F6FA] font-medium text-center"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.3 }}
              >
                {CUPCAKE_COPY.states[activeIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mt-6">
              {CUPCAKE_IMAGES.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-6 bg-[#B08D57]"
                      : index < activeIndex
                      ? "w-1.5 bg-[#B08D57]/50"
                      : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* Scroll hint */}
            {isLocked && activeIndex < TOTAL_STATES - 1 && (
              <motion.p
                className="mt-8 text-xs text-[#A9B4C4]/50"
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

      {/* Section copy - after the build */}
      <div className="bg-[#0B1220] py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-bold text-[#F4F6FA] leading-tight mb-4">
              {CUPCAKE_COPY.headline}
            </h2>
            <p className="text-base md:text-lg text-[#A9B4C4]">
              {CUPCAKE_COPY.subline}
            </p>
          </motion.div>
          <WhyBlock heading={CUPCAKE_COPY.why.heading} lines={CUPCAKE_COPY.why.lines} />
        </div>
      </div>
    </>
  );
}
