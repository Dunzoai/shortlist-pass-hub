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

// Coming Soon Post overlay - floats up toward the sky
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
        className="absolute pointer-events-none z-10"
        style={{
          width: "clamp(180px, 45vw, 400px)",
          height: "clamp(220px, 55vw, 500px)",
          left: "50%",
          bottom: "20%",
          transform: "translateX(-50%)",
          opacity: 0.9,
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
          className="absolute pointer-events-none z-10"
          style={{
            width: "clamp(180px, 45vw, 400px)",
            height: "clamp(220px, 55vw, 500px)",
            left: "50%",
            x: "-50%",
            bottom: "5%",
          }}
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 0.9],
            y: [100, 0, -20, -40],
            scale: [0.8, 1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
            times: [0, 0.3, 0.7, 1],
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

// Single floating reaction - floats up toward the sky
function FloatingReaction({
  instance,
  reducedMotion,
}: {
  instance: ReactionInstance;
  reducedMotion: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const src = instance.type === "heart" ? ASSETS.heart : ASSETS.thumbsUp;
  // 4x larger base sizes
  const baseSize = instance.type === "heart" ? 100 : 90;

  if (hasError || reducedMotion) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        left: `calc(50% + ${instance.xOffset}px)`,
        bottom: "25%",
        width: baseSize * instance.scale,
        height: baseSize * instance.scale,
      }}
      initial={{ opacity: 0, y: 50, scale: 0.3, x: "-50%" }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [50, 0, -100, -200],
        x: ["-50%", `calc(-50% + ${instance.xOffset * 0.5}px)`, `calc(-50% + ${instance.xOffset}px)`, `calc(-50% + ${instance.xOffset * 1.5}px)`],
        scale: [0.3, instance.scale, instance.scale * 1.1, instance.scale * 0.8],
      }}
      transition={{
        duration: 2,
        delay: instance.delay,
        ease: "easeOut",
        times: [0, 0.2, 0.6, 1],
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
          className={`h-2 rounded-full transition-all duration-300 ${
            i === current
              ? "bg-white w-6"
              : "bg-white/50 hover:bg-white/70 w-2"
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
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const oldCardsSectionId = "old-cards-section";

  const totalSlides = 2;
  const swipeThreshold = 50;

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
      { id: "heart-1", type: "heart", scale: 0.85, xOffset: -60, delay: 0.3 },
      { id: "heart-2", type: "heart", scale: 1.1, xOffset: 50, delay: 0.6 },
      { id: "heart-3", type: "heart", scale: 0.7, xOffset: 0, delay: 0.9 },
      { id: "thumbs-1", type: "thumbsUp", scale: 0.95, xOffset: -30, delay: 1.2 },
    ];
    setReactions(newReactions);
    setTimeout(() => setReactions([]), 4000);
  }, []);

  // Navigate to slide
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides) return;
    setCurrentSlide(index);

    // Trigger slide 2 animations
    if (index === 1 && !hasPlayedSlide2) {
      setHasPlayedSlide2(true);
      setTimeout(spawnReactions, 800);
    }
  }, [hasPlayedSlide2, spawnReactions]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - go to next slide
        goToSlide(Math.min(currentSlide + 1, totalSlides - 1));
      } else {
        // Swipe right - go to previous slide
        goToSlide(Math.max(currentSlide - 1, 0));
      }
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const diff = touchStartX.current - e.clientX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToSlide(Math.min(currentSlide + 1, totalSlides - 1));
      } else {
        goToSlide(Math.max(currentSlide - 1, 0));
      }
    }
  };

  return (
    <section className="py-12 md:py-20 bg-[#F4F1EC]">
      {/* Full-width carousel container with FIXED background */}
      <div
        ref={containerRef}
        className="relative w-full cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Fixed base image - never moves */}
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
          <Image
            src={ASSETS.streetBase}
            alt="Street scene"
            fill
            className="object-cover"
            priority
            draggable={false}
          />

          {/* Overlay content changes based on current slide */}

          {/* Slide 2: Coming Soon Post + Reactions */}
          <ComingSoonPost
            isActive={currentSlide === 1}
            reducedMotion={reducedMotion}
          />

          {/* Floating reactions */}
          {currentSlide === 1 && reactions.map((reaction) => (
            <FloatingReaction
              key={reaction.id}
              instance={reaction}
              reducedMotion={reducedMotion}
            />
          ))}

          {/* Reduced motion: show static elements on slide 2 */}
          {reducedMotion && currentSlide === 1 && (
            <div
              className="absolute pointer-events-none z-20"
              style={{
                width: 80,
                height: 80,
                left: "52%",
                bottom: "45%",
                opacity: 0.8,
              }}
            >
              <Image src={ASSETS.heart} alt="" fill className="object-contain" />
            </div>
          )}

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* Carousel dots */}
        <CarouselDots
          total={totalSlides}
          current={currentSlide}
          onDotClick={goToSlide}
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
              className="w-10 h-10"
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
