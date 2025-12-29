"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Asset paths
const ASSETS = {
  streetBase: "/story/slide-0.png",
  igPost: "/story/overlays/coming-soon.png",
  heart: "/story/overlays/heart-overlay.png",
  thumbsUp: "/story/overlays/thumbs-up.png",
};

// Reaction instance type
interface ReactionInstance {
  id: string;
  type: "heart" | "thumbsUp";
  scale: number;
  xOffset: number;
  delay: number;
}

// Coming Soon Post overlay
function ComingSoonPost({
  isActive,
  reducedMotion,
}: {
  isActive: boolean;
  reducedMotion: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;

  // Reduced motion: show statically
  if (reducedMotion && isActive) {
    return (
      <div
        className="absolute w-28 h-36 sm:w-36 sm:h-44 md:w-44 md:h-52 lg:w-52 lg:h-64 pointer-events-none z-10"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.85,
        }}
      >
        <Image
          src={ASSETS.igPost}
          alt=""
          fill
          className="object-contain drop-shadow-2xl"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute w-28 h-36 sm:w-36 sm:h-44 md:w-44 md:h-52 lg:w-52 lg:h-64 pointer-events-none z-10"
          style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 1, 1, 0.85],
            scale: [0.3, 1.05, 1, 1],
          }}
          transition={{
            duration: 1.4,
            ease: "easeOut",
            times: [0, 0.4, 0.6, 1],
          }}
        >
          <Image
            src={ASSETS.igPost}
            alt=""
            fill
            className="object-contain drop-shadow-2xl"
            onError={() => setHasError(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Single floating reaction
function FloatingReaction({
  instance,
  reducedMotion,
}: {
  instance: ReactionInstance;
  reducedMotion: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const src = instance.type === "heart" ? ASSETS.heart : ASSETS.thumbsUp;
  const size = instance.type === "heart" ? 36 : 32;

  if (hasError || reducedMotion) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        left: `calc(50% + ${instance.xOffset}px)`,
        top: "50%",
        width: size * instance.scale,
        height: size * instance.scale,
        transform: "translateX(-50%)",
      }}
      initial={{ opacity: 0, y: 0, scale: 0.3 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -40, -90, -140],
        x: [0, instance.xOffset * 0.3, instance.xOffset * 0.5, instance.xOffset * 0.7],
        scale: [0.3, instance.scale, instance.scale, instance.scale * 0.6],
      }}
      transition={{
        duration: 1.4,
        delay: instance.delay,
        ease: "easeOut",
        times: [0, 0.25, 0.6, 1],
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-contain"
        onError={() => setHasError(true)}
      />
    </motion.div>
  );
}

// Carousel dot indicator
function CarouselDots({
  total,
  current,
  onDotClick,
}: {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === current
              ? "bg-white w-6"
              : "bg-white/50 hover:bg-white/70"
          }`}
        />
      ))}
    </div>
  );
}

// Main section component
export function StoryStreetSection({
  showOldCards,
  onToggleOldCards,
  oldCardsContent,
}: {
  showOldCards: boolean;
  onToggleOldCards: () => void;
  oldCardsContent: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasPlayedSlide2, setHasPlayedSlide2] = useState(false);
  const [reactions, setReactions] = useState<ReactionInstance[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const oldCardsSectionId = "old-cards-section";

  const totalSlides = 2;

  // Preload images
  useEffect(() => {
    Object.values(ASSETS).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Spawn reactions
  const spawnReactions = useCallback(() => {
    const newReactions: ReactionInstance[] = [
      { id: "heart-1", type: "heart", scale: 0.9, xOffset: -30, delay: 0.2 },
      { id: "heart-2", type: "heart", scale: 1.1, xOffset: 25, delay: 0.4 },
      { id: "heart-3", type: "heart", scale: 0.75, xOffset: 0, delay: 0.6 },
      { id: "thumbs-1", type: "thumbsUp", scale: 0.95, xOffset: -15, delay: 0.8 },
    ];
    setReactions(newReactions);
    setTimeout(() => setReactions([]), 3500);
  }, []);

  // Handle scroll to detect current slide
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const slideWidth = carouselRef.current.offsetWidth;
    const newSlide = Math.round(scrollLeft / slideWidth);

    if (newSlide !== currentSlide) {
      setCurrentSlide(newSlide);

      // Trigger slide 2 animations
      if (newSlide === 1 && !hasPlayedSlide2) {
        setHasPlayedSlide2(true);
        setTimeout(spawnReactions, 600);
      }
    }
  }, [currentSlide, hasPlayedSlide2, spawnReactions]);

  // Scroll to specific slide
  const scrollToSlide = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const slideWidth = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({
      left: slideWidth * index,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [reducedMotion]);

  // Add scroll listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section className="py-12 md:py-20 bg-[#F4F1EC]">
      {/* Full-width carousel container */}
      <div className="relative w-full">
        {/* Carousel scroll container */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Slide 1: Base street image only */}
          <div className="flex-shrink-0 w-full snap-center">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]">
              <Image
                src={ASSETS.streetBase}
                alt="Street scene"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
            </div>
          </div>

          {/* Slide 2: Base image + Coming Soon post + reactions */}
          <div className="flex-shrink-0 w-full snap-center">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]">
              <Image
                src={ASSETS.streetBase}
                alt="Street scene"
                fill
                className="object-cover"
              />

              {/* Coming Soon Post - triggers when slide 2 is active */}
              <ComingSoonPost
                isActive={currentSlide === 1 || hasPlayedSlide2}
                reducedMotion={reducedMotion}
              />

              {/* Floating reactions */}
              {reactions.map((reaction) => (
                <FloatingReaction
                  key={reaction.id}
                  instance={reaction}
                  reducedMotion={reducedMotion}
                />
              ))}

              {/* Reduced motion: show static heart */}
              {reducedMotion && (currentSlide === 1 || hasPlayedSlide2) && (
                <div
                  className="absolute w-8 h-8 pointer-events-none z-20"
                  style={{ left: "52%", top: "35%", opacity: 0.8 }}
                >
                  <Image src={ASSETS.heart} alt="" fill className="object-contain" />
                </div>
              )}

              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Carousel dots */}
        <CarouselDots
          total={totalSlides}
          current={currentSlide}
          onDotClick={scrollToSlide}
        />

        {/* Swipe hint on first slide */}
        {currentSlide === 0 && !hasPlayedSlide2 && (
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 z-20 pointer-events-none"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: [0, 1, 1, 0], x: [-10, 0, 0, 10] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Copy, CTA, and toggle - contained width */}
      <div className="max-w-4xl mx-auto px-6 mt-10">
        {/* Copy and CTA */}
        <div className="text-center">
          <p
            className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#1A1F24] mb-6"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
          >
            Get noticed.
          </p>
          <Link
            href="/social"
            className="inline-block px-8 py-3 bg-[#2B3A44] text-[#F4F1EC] font-medium rounded-full hover:bg-[#1A1F24] transition-colors duration-300"
          >
            Social that shows up
          </Link>
        </div>

        {/* Toggle button */}
        <div className="mt-10 text-center">
          <button
            onClick={onToggleOldCards}
            aria-expanded={showOldCards}
            aria-controls={oldCardsSectionId}
            className="inline-flex items-center gap-2 text-sm text-[#5A6570] hover:text-[#2B3A44] transition-colors duration-200"
          >
            <span>
              {showOldCards ? "Hide the long version" : "Want the straight explanation?"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                showOldCards ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Old cards section - revealed IN PLACE */}
        <div
          id={oldCardsSectionId}
          className={`overflow-hidden transition-all ${
            reducedMotion ? "duration-0" : "duration-300 ease-out"
          }`}
          style={{
            maxHeight: showOldCards ? "2000px" : "0px",
            opacity: showOldCards ? 1 : 0,
            marginTop: showOldCards ? "2rem" : "0",
          }}
        >
          <motion.div
            initial={false}
            animate={{
              y: showOldCards ? 0 : 20,
              opacity: showOldCards ? 1 : 0,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.25,
              ease: "easeOut",
            }}
          >
            {oldCardsContent}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
