"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Asset paths - using root public/slide-0.png as base
const ASSETS = {
  streetBase: "/slide-0.png",
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

// Coming Soon Post overlay - rises from behind building, then hovers
function ComingSoonPost({
  isActive,
  reducedMotion,
  isMobile,
}: {
  isActive: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;

  const topPosition = isMobile ? "-42%" : "-10%";

  // Reduced motion: show statically above building
  if (reducedMotion && isActive) {
    return (
      <div
        className="absolute pointer-events-none z-[5]"
        style={{
          width: "clamp(210px, 42vw, 420px)",
          height: "clamp(255px, 51vw, 510px)",
          left: "50%",
          top: topPosition,
          transform: "translateX(-50%)",
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
          className="absolute pointer-events-none z-[5]"
          style={{
            width: "clamp(210px, 42vw, 420px)",
            height: "clamp(255px, 51vw, 510px)",
            left: "50%",
            x: "-50%",
          }}
          initial={{
            top: "70%",
            opacity: 0,
            rotate: -3,
          }}
          animate={{
            top: topPosition,
            opacity: 1,
            rotate: [-3, 2, -1, 1, 0],
          }}
          transition={{
            top: { duration: 1.5, ease: "easeOut" },
            opacity: { duration: 0.8 },
            rotate: { duration: 2, ease: "easeInOut", delay: 1.5 },
          }}
        >
          {/* Inner div for continuous subtle hover */}
          <motion.div
            className="w-full h-full relative"
            animate={{
              y: [0, -6, 0, -4, 0],
              rotate: [0, 1, 0, -1, 0],
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 2,
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Single floating reaction - floats up from post and fades out
function FloatingReaction({
  instance,
  reducedMotion,
}: {
  instance: ReactionInstance;
  reducedMotion: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const src = instance.type === "heart" ? ASSETS.heart : ASSETS.thumbsUp;
  const baseSize = instance.type === "heart" ? 60 : 54;

  if (hasError || reducedMotion) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-[7]"
      style={{
        width: baseSize * instance.scale,
        height: baseSize * instance.scale,
        left: `calc(50% + ${instance.xOffset}px)`,
        top: "68%",
      }}
      initial={{
        opacity: 0,
        y: 0,
        scale: 0.4,
        x: "-50%",
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -150, -350, -570],
        x: ["-50%", `calc(-50% + ${instance.xOffset * 0.4}px)`, `calc(-50% + ${instance.xOffset * 0.8}px)`, `calc(-50% + ${instance.xOffset * 1.2}px)`],
        scale: [0.4, instance.scale, instance.scale * 0.9, instance.scale * 0.5],
      }}
      transition={{
        duration: 2.5,
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
  const [showReactions, setShowReactions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const oldCardsSectionId = "old-cards-section";

  const totalSlides = 2;
  const swipeThreshold = 50;

  // Detect mobile vs desktop for responsive post positioning
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Preload images
  useEffect(() => {
    Object.values(ASSETS).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Spawn reactions - called repeatedly while on slide 2
  const spawnReactions = useCallback(() => {
    const newReactions: ReactionInstance[] = [
      { id: `heart-1-${Date.now()}`, type: "heart", scale: 0.9, xOffset: -40, delay: 0 },
      { id: `heart-2-${Date.now()}`, type: "heart", scale: 1.1, xOffset: 35, delay: 0.4 },
      { id: `thumbs-1-${Date.now()}`, type: "thumbsUp", scale: 0.85, xOffset: -10, delay: 0.8 },
      { id: `heart-3-${Date.now()}`, type: "heart", scale: 0.75, xOffset: 20, delay: 1.2 },
    ];
    setReactions(newReactions);
  }, []);

  // Continuous reaction loop - spawn new reactions every 3.5 seconds
  useEffect(() => {
    if (currentSlide !== 1 || !showReactions || reducedMotion) return;

    const interval = setInterval(() => {
      spawnReactions();
    }, 3500);

    return () => clearInterval(interval);
  }, [currentSlide, showReactions, spawnReactions, reducedMotion]);

  // Navigate to slide
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides) return;
    setCurrentSlide(index);

    // Trigger slide 2 animations
    if (index === 1 && !hasPlayedSlide2) {
      setHasPlayedSlide2(true);
      // Wait for post to rise and breathe, then spawn reactions
      setTimeout(() => {
        setShowReactions(true);
        spawnReactions();
      }, 2800);
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
        goToSlide(Math.min(currentSlide + 1, totalSlides - 1));
      } else {
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
      {/* Full-width container with FIXED background */}
      <div
        ref={containerRef}
        className="relative w-full cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Fixed base image - the street/building scene */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/9] lg:aspect-[2/1] overflow-hidden">
          <Image
            src={ASSETS.streetBase}
            alt="Street scene with storefronts"
            fill
            className="object-cover object-center z-10"
            priority
            draggable={false}
          />

          {/* Slide 2: Instagram post rises and hovers above building */}
          <ComingSoonPost
            isActive={currentSlide === 1}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />

          {/* Floating reactions - spawn from post area */}
          {showReactions && currentSlide === 1 && reactions.map((reaction) => (
            <FloatingReaction
              key={reaction.id}
              instance={reaction}
              reducedMotion={reducedMotion}
            />
          ))}

          {/* Reduced motion: show static heart */}
          {reducedMotion && currentSlide === 1 && (
            <div
              className="absolute pointer-events-none z-[7]"
              style={{
                width: 50,
                height: 50,
                left: "54%",
                top: "-25%",
                opacity: 0.85,
              }}
            >
              <Image src={ASSETS.heart} alt="" fill className="object-contain" />
            </div>
          )}
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 z-20 pointer-events-none"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: [0, 0.8, 0.8, 0], x: [-10, 0, 0, 10] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
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
