"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";

// Slide data
const slides = [
  {
    title: "Social that actually shows up",
    subhead: "Be seen where customers already scroll.",
    description:
      "Social is how people first come across your business. We create and manage content that builds familiarity early, so when someone's ready to act, your business already feels like a known choice.",
    href: "/social",
    cta: "Get seen first",
    image: "/Door.png",
  },
  {
    title: "SmartPages",
    subhead: "One clear place customers trust.",
    description:
      "SmartPages bring everything about your business together — answers, hours, menus, links, updates, and booking — so customers get what they need instantly and feel confident choosing you.",
    href: "/smartpages",
    cta: "Build your foundation",
    image: "/house-frame.png",
  },
  {
    title: "Websites & Apps",
    subhead: "When the problem needs more than a template.",
    description:
      "Custom websites and lightweight apps let you explain clearly, guide people through decisions, and handle real-world needs — ordering, booking, events, memberships, and more.",
    href: "/digital",
    cta: "Make it work",
    image: "/house-windows.png",
  },
];

// Preload images
function useImagePreloader(srcs: string[]) {
  useEffect(() => {
    srcs.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [srcs]);
}

// Illustration component with crossfade
function StoryIllustration({
  activeIndex,
  reducedMotion,
}: {
  activeIndex: number;
  reducedMotion: boolean;
}) {
  return (
    <div className="relative w-full h-[240px] md:h-[280px] lg:h-[320px] flex items-center justify-center">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 flex items-center justify-center ${
            reducedMotion ? "" : "transition-opacity duration-500 ease-out"
          }`}
          style={{ opacity: index === activeIndex ? 1 : 0 }}
        >
          <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px]">
            {/* Subtle glow for final stage */}
            {index === 2 && activeIndex === 2 && !reducedMotion && (
              <motion.div
                className="absolute inset-0 rounded-full bg-amber-200/30 blur-2xl"
                animate={{ opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-contain"
              priority={index === 0}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Dots indicator
function DotsIndicator({
  activeIndex,
  onDotClick,
  reducedMotion,
}: {
  activeIndex: number;
  onDotClick: (index: number) => void;
  reducedMotion: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`rounded-full ${
            reducedMotion ? "" : "transition-all duration-300"
          } ${
            index === activeIndex
              ? "w-8 h-2.5 bg-[#2B3A44]"
              : "w-2.5 h-2.5 bg-[#2B3A44]/30 hover:bg-[#2B3A44]/50"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

// Arrow button
function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-[#2B3A44]/20 bg-white/80 backdrop-blur-sm transition-all duration-200 ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-[#2B3A44] hover:text-white hover:border-[#2B3A44]"
      }`}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

// Slide card content
function SlideCard({
  slide,
  reducedMotion,
}: {
  slide: (typeof slides)[0];
  reducedMotion: boolean;
}) {
  return (
    <div className="text-center px-4 md:px-8">
      <h3 className="text-2xl md:text-3xl font-semibold text-[#1A1F24] mb-2">
        {slide.title}
      </h3>
      <p className="text-sm md:text-base font-medium text-[#2B3A44] mb-4">
        {slide.subhead}
      </p>
      <p className="text-sm md:text-base text-[#5A6570] leading-relaxed max-w-md mx-auto mb-6">
        {slide.description}
      </p>
      <Link
        href={slide.href}
        className="inline-block px-6 py-3 bg-[#2B3A44] text-[#F4F1EC] font-medium rounded-full hover:bg-[#1A1F24] transition-colors duration-300"
      >
        {slide.cta}
      </Link>
    </div>
  );
}

// Main slider component
export function ServicesStorySlider() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Swipe/drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragDeltaX = useRef(0);

  // Preload images
  useImagePreloader(slides.map((s) => s.image));

  // Navigation helpers
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(slides.length - 1, index)));
  }, []);

  const goNext = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex]);

  // Pointer/touch handlers for swipe
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dragDeltaX.current = 0;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartX.current;
      const deltaY = e.clientY - dragStartY.current;

      // Only track horizontal movement if it's more horizontal than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        dragDeltaX.current = deltaX;
        // Prevent vertical scroll when swiping horizontally
        e.preventDefault();
      }
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // Minimum swipe distance
    if (dragDeltaX.current < -threshold) {
      goNext();
    } else if (dragDeltaX.current > threshold) {
      goPrev();
    }
    dragDeltaX.current = 0;
  }, [isDragging, goNext, goPrev]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev]
  );

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  // Track direction for animation
  const [direction, setDirection] = useState(0);
  const prevIndex = useRef(activeIndex);

  useEffect(() => {
    setDirection(activeIndex > prevIndex.current ? 1 : -1);
    prevIndex.current = activeIndex;
  }, [activeIndex]);

  return (
    <section className="py-16 md:py-24 bg-[#F4F1EC] overflow-hidden">
      <Container>
        <div
          ref={containerRef}
          className="relative select-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "pan-y pinch-zoom" }}
        >
          {/* Illustration area */}
          <StoryIllustration
            activeIndex={activeIndex}
            reducedMotion={reducedMotion}
          />

          {/* Card area with slide animation */}
          <div className="relative min-h-[280px] md:min-h-[260px] flex items-center justify-center mt-4">
            {/* Desktop arrows */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <ArrowButton
                direction="left"
                onClick={goPrev}
                disabled={activeIndex === 0}
              />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <ArrowButton
                direction="right"
                onClick={goNext}
                disabled={activeIndex === slides.length - 1}
              />
            </div>

            {/* Slide content */}
            <div className="w-full max-w-lg mx-auto px-12 md:px-16">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={reducedMotion ? {} : slideVariants}
                  initial={reducedMotion ? {} : "enter"}
                  animate={reducedMotion ? {} : "center"}
                  exit={reducedMotion ? {} : "exit"}
                  transition={{
                    x: { type: "tween", duration: 0.3, ease: "easeOut" },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <SlideCard
                    slide={slides[activeIndex]}
                    reducedMotion={reducedMotion}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="mt-8">
            <DotsIndicator
              activeIndex={activeIndex}
              onDotClick={goToSlide}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Swipe hint for mobile */}
          <p className="text-center text-xs text-[#5A6570]/60 mt-4 md:hidden">
            Swipe to explore
          </p>
        </div>
      </Container>
    </section>
  );
}
