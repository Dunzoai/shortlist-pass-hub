"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { WhyBlock } from "@/components/WhyBlock";

// --- EDITABLE COPY ---
const CUPCAKE_COPY = {
  // Build sequence copy (4-6 words, calm, confident, neutral)
  states: [
    "Start with the base.",
    "Add the cake.",
    "Top it off.",
    "That's it.",
    "Ready to order.",
  ],
  // Section headline (shown after demo completes)
  headline: "Ordering doesn't have to feel like a form.",
  subline: "We let customers see their order come together as they scroll.",
  // Why block
  why: {
    heading: "Why we built it this way",
    lines: [
      "When people can see the result, they decide faster — and with more confidence.",
    ],
  },
};

// Image paths for each layer state
const CUPCAKE_IMAGES = [
  "/cupcake 1.png", // liner only
  "/cupcake 2.png", // liner + cake
  "/cupcake 3.png", // liner + cake + icing
  "/cupcake 4.png", // full cupcake
  "/cupcake 5.png", // packaged/finished
];

export function CupcakeShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll progress within section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to discrete states (snap points, not continuous)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      // 5 states over the scroll range
      // Each state gets ~20% of the scroll
      const stateCount = CUPCAKE_IMAGES.length;
      const newIndex = Math.min(
        Math.floor(progress * stateCount),
        stateCount - 1
      );
      setActiveIndex(newIndex);
    });

    return unsubscribe;
  }, [scrollYProgress, prefersReducedMotion]);

  // Manual navigation for reduced motion
  const handleNext = () => {
    if (activeIndex < CUPCAKE_IMAGES.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0B1220]"
      style={{ height: prefersReducedMotion ? "auto" : "225vh" }} // ~1.25vh of pinning
    >
      {/* Sticky container */}
      <div
        className={
          prefersReducedMotion
            ? "py-24 lg:py-32"
            : "sticky top-0 min-h-screen flex flex-col items-center justify-center py-12 lg:py-0"
        }
      >
        <div className="w-full max-w-[800px] mx-auto px-6">
          {/* Cupcake Stage */}
          <div className="relative flex flex-col items-center">
            {/* Stacked cupcake images - only opacity changes */}
            <div className="relative w-[280px] h-[320px] md:w-[340px] md:h-[400px]">
              {CUPCAKE_IMAGES.map((src, index) => (
                <motion.div
                  key={src}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{
                    opacity: index <= activeIndex ? 1 : 0,
                    y: index <= activeIndex ? 0 : 4,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <Image
                    src={src}
                    alt={`Cupcake build stage ${index + 1}`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </motion.div>
              ))}
            </div>

            {/* State copy - below cupcake */}
            <motion.p
              key={activeIndex}
              className="mt-6 text-lg md:text-xl text-[#F4F6FA] font-medium text-center"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {CUPCAKE_COPY.states[activeIndex]}
            </motion.p>

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

            {/* Manual navigation (reduced motion only) */}
            {prefersReducedMotion && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className="px-4 py-2 text-sm text-[#A9B4C4] border border-white/10 rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeIndex === CUPCAKE_IMAGES.length - 1}
                  className="px-4 py-2 text-sm bg-[#B08D57] text-[#0B1220] font-medium rounded-lg disabled:opacity-30 hover:bg-[#c9a46a] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section copy - appears after the sticky section */}
      <div className="relative bg-[#0B1220] py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6">
          {/* Headline + supporting line */}
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

          {/* Why block */}
          <WhyBlock
            heading={CUPCAKE_COPY.why.heading}
            lines={CUPCAKE_COPY.why.lines}
          />
        </div>
      </div>
    </section>
  );
}
