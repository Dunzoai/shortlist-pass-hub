"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Asset paths
const ASSETS = {
  buildingLayer: "/storystreet/slide-0.jpg",
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

// Floating reaction component - BEHIND IG post, loops continuously
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
        bottom: "25%",
        zIndex: 15, // Behind IG post (20) but above building (10)
      }}
      initial={{
        opacity: 0,
        y: 0,
        scale: 0.3,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -75, -180, -300], // 50% higher animation
        scale: [0.3, instance.scale, instance.scale * 0.9, instance.scale * 0.5],
      }}
      transition={{
        duration: 3.5,
        delay: instance.delay,
        ease: "easeOut",
        times: [0, 0.2, 0.6, 1],
        repeat: Infinity,
        repeatDelay: 0.5,
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
  const [showCaption, setShowCaption] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  // Use ref instead of state to prevent re-render clearing timers
  const hasEnteredSlide2 = useRef(false);

  // Touch/drag handling
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const totalSlides = 3;
  const swipeThreshold = 50;

  // Reaction configs - 3 hearts, 2 thumbs
  const reactionConfigs: ReactionInstance[] = [
    { id: "heart-1", type: "heart", scale: 1.0, xOffset: -100, delay: 0 },
    { id: "heart-2", type: "heart", scale: 1.4, xOffset: 80, delay: 0.6 },
    { id: "heart-3", type: "heart", scale: 0.8, xOffset: -20, delay: 1.2 },
    { id: "thumbs-1", type: "thumbsUp", scale: 1.1, xOffset: -60, delay: 0.3 },
    { id: "thumbs-2", type: "thumbsUp", scale: 0.9, xOffset: 120, delay: 0.9 },
  ];

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
      diff > 0 ? goNext() : goPrev();
    }
    dragStartX.current = null;
    isDragging.current = false;
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > swipeThreshold) {
      diff > 0 ? goNext() : goPrev();
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
    let reactionTimer: NodeJS.Timeout;
    let captionTimer: NodeJS.Timeout;

    if (currentSlide === 1 && !hasEnteredSlide2.current) {
      hasEnteredSlide2.current = true;

      // Show reactions after a short delay (they loop continuously)
      reactionTimer = setTimeout(() => {
        setShowReactions(true);
      }, 800);

      // Show caption 300ms after IG post lands (post animation is 1.4s)
      captionTimer = setTimeout(() => {
        setShowCaption(true);
      }, 1700);
    }

    // Reset when leaving slide 2
    if (currentSlide !== 1) {
      setShowCaption(false);
      setShowReactions(false);
    }

    return () => {
      if (reactionTimer) clearTimeout(reactionTimer);
      if (captionTimer) clearTimeout(captionTimer);
    };
  }, [currentSlide]);

  // Preload images
  useEffect(() => {
    Object.values(ASSETS).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <section className="py-12 md:py-20 bg-[#F4F1EC]">
      <div className="relative max-w-7xl mx-auto">
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/9] lg:aspect-[2/1] overflow-hidden cursor-grab active:cursor-grabbing select-none bg-[#E8E4DD]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* ===== LAYER ORDER ===== */}
          {/* z-10: Building layer (the scene) */}
          {/* z-15: Hearts/Thumbs (above building, behind IG post) */}
          {/* z-20: IG Post (in front of hearts) */}
          {/* z-30: Caption card (ON TOP of everything) */}
          {/* z-40: Pagination */}

          {/* IG Post - rises from below into the sky */}
          <AnimatePresence mode="sync">
            {currentSlide === 1 && (
              <motion.div
                key="igpost"
                className="absolute pointer-events-none left-1/2 bottom-[52%] md:bottom-[27%] w-[325px] h-[395px] md:w-[550px] md:h-[668px]"
                style={{
                  zIndex: 20,
                }}
                initial={{
                  x: "-50%",
                  y: "100%",
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  x: "-50%",
                  y: "0%",
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15 },
                }}
                transition={{
                  duration: 1.4,
                  ease: [0.16, 1, 0.3, 1],
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
                    delay: 1.6,
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
            )}
          </AnimatePresence>

          {/* Building/Street layer - the scene (base layer) */}
          <Image
            src={ASSETS.buildingLayer}
            alt="Street scene"
            fill
            className="object-cover object-center pointer-events-none"
            style={{ zIndex: 10 }}
            priority
            draggable={false}
          />

          {/* Hearts and Thumbs - ABOVE building, loop continuously */}
          {currentSlide === 1 && showReactions && (
            <>
              {reactionConfigs.map((reaction) => (
                <FloatingReaction key={reaction.id} instance={reaction} />
              ))}
            </>
          )}

          {/* Dim overlay for slide 2 */}
          <AnimatePresence>
            {currentSlide === 1 && (
              <motion.div
                key="dim-overlay"
                className="absolute inset-0 bg-black/10 pointer-events-none"
                style={{ zIndex: 25 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Slide 1 intro text */}
          <AnimatePresence>
            {currentSlide === 0 && (
              <motion.div
                key="slide1-text"
                className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-12 pointer-events-none"
                style={{ zIndex: 30 }}
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

          {/* Caption card - ON TOP of building layer, centered under IG post */}
          <AnimatePresence>
            {currentSlide === 1 && showCaption && (
              <motion.div
                key="slide2-caption"
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none px-4"
                style={{
                  zIndex: 30,
                  bottom: "12%",
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-[#F4F1EC]/95 backdrop-blur-sm rounded-lg shadow-lg px-5 md:px-6 py-4 md:py-5 max-w-xs md:max-w-sm mx-auto border border-[#E0DCD4]">
                  <p className="font-semibold text-[#1A1F24] mb-1 text-sm md:text-base">
                    Social is the introduction.
                  </p>
                  <p className="text-[#5A6570] text-xs md:text-sm">
                    It&apos;s how people meet your business before they ever click.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slide 3 placeholder */}
          <AnimatePresence>
            {currentSlide === 2 && (
              <motion.div
                key="slide3-text"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ zIndex: 30 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[#5A6570] text-lg">Slide 3 - SmartPages coming soon</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination dots */}
          <PaginationDots
            slideCount={totalSlides}
            currentIndex={currentSlide}
            onDotClick={goToSlide}
          />
        </div>
      </div>

      {/* Accordion below */}
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
