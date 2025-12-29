"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Asset paths
const ASSETS = {
  streetBase: "/storystreet/slide-0.jpg",
  igPost: "/storystreet/coming-soon.png",
  heart: "/storystreet/heart-overlay.png",
  thumbsUp: "/storystreet/thumbs-up.png",
};

// Reaction instance type
interface ReactionInstance {
  id: string;
  type: "heart" | "thumbsUp";
  scale: number;
  xOffset: number;
  delay: number;
}

// Floating reaction component - sits behind building/IG post layers
function FloatingReaction({ instance }: { instance: ReactionInstance }) {
  const src = instance.type === "heart" ? ASSETS.heart : ASSETS.thumbsUp;
  const baseSize = instance.type === "heart" ? 60 : 55;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: baseSize * instance.scale,
        height: baseSize * instance.scale,
        left: `calc(50% + ${instance.xOffset}px)`,
        bottom: "35%",
        zIndex: 5, // Behind building layer and IG post
      }}
      initial={{
        opacity: 0,
        y: 0,
        scale: 0.3,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -60, -140, -250],
        scale: [0.3, instance.scale, instance.scale * 0.9, instance.scale * 0.5],
      }}
      transition={{
        duration: 3.5,
        delay: instance.delay,
        ease: "easeOut",
        times: [0, 0.2, 0.6, 1],
      }}
    >
      <Image src={src} alt="" fill className="object-contain" />
    </motion.div>
  );
}

// Pagination dots
function PaginationDots({
  slideCount,
  currentIndex,
  onDotClick,
}: {
  slideCount: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40 pointer-events-auto">
      {Array.from({ length: slideCount }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === currentIndex
              ? "bg-[#2B3A44] w-6"
              : "bg-[#2B3A44]/30 hover:bg-[#2B3A44]/50 w-2"
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
  const [hasEnteredSlide2, setHasEnteredSlide2] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [reactions, setReactions] = useState<ReactionInstance[]>([]);

  // Touch/drag handling
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const totalSlides = 3;
  const swipeThreshold = 50; // minimum px to trigger slide change

  // Handle slide navigation
  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  const goNext = () => goToSlide(currentSlide + 1);
  const goPrev = () => goToSlide(currentSlide - 1);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = dragStartX.current - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goNext(); // Swipe left = next
      } else {
        goPrev(); // Swipe right = prev
      }
    }

    dragStartX.current = null;
    isDragging.current = false;
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const diff = dragStartX.current - e.clientX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    dragStartX.current = null;
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    dragStartX.current = null;
    isDragging.current = false;
  };

  // Trigger slide 2 animations
  useEffect(() => {
    if (currentSlide === 1 && !hasEnteredSlide2) {
      setHasEnteredSlide2(true);

      // Spawn reactions early - they float behind the building as post rises
      let reactionTimer: NodeJS.Timeout;
      if (!reducedMotion) {
        reactionTimer = setTimeout(() => {
          setReactions([
            { id: "heart-1", type: "heart", scale: 1.0, xOffset: -90, delay: 0 },
            { id: "heart-2", type: "heart", scale: 1.3, xOffset: 70, delay: 0.4 },
            { id: "heart-3", type: "heart", scale: 0.85, xOffset: -30, delay: 0.8 },
            { id: "thumbs-1", type: "thumbsUp", scale: 1.1, xOffset: -50, delay: 0.2 },
            { id: "thumbs-2", type: "thumbsUp", scale: 0.9, xOffset: 90, delay: 0.6 },
          ]);
        }, 600); // Start reactions early during the rise
      }

      // Show caption after IG post finishes rising and scaling (2s animation)
      const captionTimer = setTimeout(() => setShowCaption(true), 2400);

      return () => {
        clearTimeout(captionTimer);
        if (reactionTimer) clearTimeout(reactionTimer);
      };
    }

    // Reset when leaving slide 2
    if (currentSlide !== 1) {
      setShowCaption(false);
      setReactions([]);
    }
  }, [currentSlide, hasEnteredSlide2, reducedMotion]);

  // Preload images
  useEffect(() => {
    Object.values(ASSETS).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <section className="py-12 md:py-20 bg-[#F4F1EC]">
      {/* Main scene container - SINGLE fixed background */}
      <div className="relative max-w-7xl mx-auto">
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/9] lg:aspect-[2/1] overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* STATIC background - never moves */}
          <Image
            src={ASSETS.streetBase}
            alt="Street scene"
            fill
            className="object-cover object-center"
            style={{ zIndex: 1 }}
            priority
            draggable={false}
          />

          {/* ===== SLIDE 1: Intro text ===== */}
          <AnimatePresence>
            {currentSlide === 0 && (
              <motion.div
                key="slide1-content"
                className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-12 pointer-events-none"
                style={{ zIndex: 20 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center px-6">
                  <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#1A1F24] mb-4"
                    style={{ fontFamily: "var(--font-libre-baskerville)" }}
                  >
                    Get noticed.
                  </h2>
                  <p className="text-base md:text-lg text-[#5A6570] flex items-center justify-center gap-2">
                    <span>Swipe to see how it works</span>
                    <motion.span
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== SLIDE 2: IG Post animation ===== */}
          <AnimatePresence>
            {currentSlide === 1 && (
              <>
                {/* Dim overlay */}
                <motion.div
                  key="slide2-overlay"
                  className="absolute inset-0 bg-black pointer-events-none"
                  style={{ zIndex: 10 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* IG Post - Phase 1: rises from behind building (small), Phase 2: pushes forward (scales up) */}
                <motion.div
                  key="slide2-igpost"
                  className="absolute pointer-events-none left-1/2"
                  style={{
                    width: "clamp(260px, 65vw, 550px)",
                    height: "clamp(316px, 79vw, 668px)",
                  }}
                  initial={{
                    x: "-50%",
                    bottom: "-30%",
                    opacity: 0,
                    scale: 0.6,
                    zIndex: 5, // Start behind building layer
                  }}
                  animate={{
                    x: "-50%",
                    bottom: ["0%", "18%", "12%"], // Rise up, then settle
                    opacity: 1,
                    scale: [0.6, 0.75, 1.05], // Start small, grow, then hero size
                    zIndex: [5, 5, 20], // Stay behind, then come forward
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  transition={{
                    duration: 2.0,
                    ease: [0.16, 1, 0.3, 1],
                    times: [0, 0.5, 1], // Phase 1 at 50%, Phase 2 completes at 100%
                    zIndex: { duration: 0.1, delay: 1.0 }, // z-index changes at the transition point
                  }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    animate={{
                      y: [0, -6, 0, -4, 0],
                    }}
                    transition={{
                      duration: 5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: 2.2,
                    }}
                  >
                    <Image
                      src={ASSETS.igPost}
                      alt="Coming soon post"
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      draggable={false}
                    />
                  </motion.div>
                </motion.div>

                {/* Floating reactions - hearts and thumbs */}
                {!reducedMotion && reactions.map((reaction) => (
                  <FloatingReaction key={reaction.id} instance={reaction} />
                ))}

                {/* Caption card */}
                <AnimatePresence>
                  {showCaption && (
                    <motion.div
                      key="slide2-caption"
                      className="absolute left-1/2 -translate-x-1/2 pointer-events-none px-4"
                      style={{
                        zIndex: 30,
                        bottom: "6%",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <div className="bg-[#F4F1EC] rounded-lg shadow-lg px-4 md:px-6 py-3 md:py-4 max-w-xs md:max-w-sm mx-auto border border-[#E0DCD4]">
                        <p className="font-semibold text-[#1A1F24] mb-1 text-sm md:text-base">
                          Social is the introduction.
                        </p>
                        <p className="text-[#5A6570] text-xs md:text-sm">
                          It's how people meet your business before they ever click.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </AnimatePresence>

          {/* ===== SLIDE 3: Placeholder ===== */}
          <AnimatePresence>
            {currentSlide === 2 && (
              <motion.div
                key="slide3-content"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ zIndex: 20 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[#5A6570] text-lg">Slide 3 - SmartPages coming soon</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination dots - always visible */}
          <PaginationDots
            slideCount={totalSlides}
            currentIndex={currentSlide}
            onDotClick={goToSlide}
          />
        </div>
      </div>

      {/* Accordion below carousel - separate section */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="text-center">
          <button
            onClick={onToggleOldCards}
            aria-expanded={showOldCards}
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

        {/* Old cards section */}
        <div
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
