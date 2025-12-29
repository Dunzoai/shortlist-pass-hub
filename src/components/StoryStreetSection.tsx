"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  yOffset: number;
  delay: number;
}

// Floating reaction component - smooth float with varied drift
function FloatingReaction({ instance }: { instance: ReactionInstance }) {
  const src = instance.type === "heart" ? ASSETS.heart : ASSETS.thumbsUp;
  const baseSize = instance.type === "heart" ? 60 : 55;

  // Alternate drift direction based on instance position
  const driftDir = instance.xOffset > 0 ? 1 : -1;
  const driftAmount = 25 + Math.abs(instance.xOffset) * 0.15;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: baseSize * instance.scale,
        height: baseSize * instance.scale,
        left: `calc(50% + ${instance.xOffset}px)`,
        bottom: `${15 + instance.yOffset}%`,
        zIndex: 10,
      }}
      initial={{
        opacity: 0,
        y: 0,
        scale: 0.3,
      }}
      animate={{
        opacity: [0, 0.9, 1, 1, 0.8, 0],
        y: [0, -80, -200, -380, -520, -680],
        scale: [
          0.3,
          instance.scale * 1.05,
          instance.scale,
          instance.scale * 0.95,
          instance.scale * 0.8,
          instance.scale * 0.4
        ],
        rotate: [0, driftDir * 8, driftDir * -6, driftDir * 4, driftDir * -3, 0],
        x: [
          0,
          driftDir * driftAmount * 0.4,
          driftDir * -driftAmount * 0.6,
          driftDir * driftAmount * 0.8,
          driftDir * -driftAmount * 0.3,
          driftDir * driftAmount * 0.2
        ],
      }}
      transition={{
        duration: 6,
        delay: instance.delay,
        ease: "easeInOut",
        times: [0, 0.12, 0.35, 0.58, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 0.3,
      }}
    >
      <Image src={src} alt="" fill className="object-contain drop-shadow-lg" />
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
    <div className="flex justify-center gap-2 mt-4">
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

  const hasEnteredSlide2 = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const totalSlides = 3;
  const swipeThreshold = 50;

  // Randomized reaction configs - staggered delays for continuous stream
  const reactionConfigs: ReactionInstance[] = useMemo(() => [
    { id: "heart-1", type: "heart", scale: 1.1, xOffset: -100, yOffset: 0, delay: 0 },
    { id: "heart-2", type: "heart", scale: 1.4, xOffset: 85, yOffset: 8, delay: 1.0 },
    { id: "heart-3", type: "heart", scale: 0.9, xOffset: -20, yOffset: -5, delay: 2.0 },
    { id: "thumbs-1", type: "thumbsUp", scale: 1.2, xOffset: -60, yOffset: 3, delay: 0.5 },
    { id: "thumbs-2", type: "thumbsUp", scale: 1.0, xOffset: 120, yOffset: -3, delay: 1.5 },
  ], []);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Trigger slide 2 animations: IG post → hearts/thumbs → copy box
  useEffect(() => {
    let reactionTimer: NodeJS.Timeout;
    let captionTimer: NodeJS.Timeout;

    if (currentSlide === 1 && !hasEnteredSlide2.current) {
      hasEnteredSlide2.current = true;

      // Hearts/thumbs appear AFTER IG post rises (1.4s animation)
      reactionTimer = setTimeout(() => {
        setShowReactions(true);
      }, 1600);

      // Caption appears AFTER hearts/thumbs are animating
      captionTimer = setTimeout(() => {
        setShowCaption(true);
      }, 3000);
    }

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

  // Reset to slide 1 when closing overlay
  const handleCloseOverlay = () => {
    setCurrentSlide(0);
    hasEnteredSlide2.current = false;
    setShowCaption(false);
    setShowReactions(false);
    onToggleOldCards();
  };

  return (
    <section className="py-8 md:py-16 bg-[#F4F1EC] relative">
      {/* Carousel - always mounted */}
      <motion.div
        animate={{ opacity: showOldCards ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
      >
            <div className="relative max-w-7xl mx-auto px-4">
              {/* Stage container */}
              <div
                ref={containerRef}
                className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/9] lg:aspect-[2/1] overflow-hidden cursor-grab active:cursor-grabbing select-none rounded-lg"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {/* Building layer - TOP foreground */}
                <Image
                  src={ASSETS.buildingLayer}
                  alt="Street scene"
                  fill
                  className="object-cover object-bottom pointer-events-none"
                  style={{ zIndex: 30 }}
                  priority
                  draggable={false}
                />

                {/* Hearts and Thumbs - BOTTOM layer */}
                {currentSlide === 1 && showReactions && (
                  <>
                    {reactionConfigs.map((reaction) => (
                      <FloatingReaction key={reaction.id} instance={reaction} />
                    ))}
                  </>
                )}

                {/* IG Post - MIDDLE layer */}
                <AnimatePresence mode="sync">
                  {currentSlide === 1 && (
                    <motion.div
                      key="igpost"
                      className="absolute pointer-events-none left-1/2 bottom-[42%] md:bottom-[27%] w-[325px] h-[395px] md:w-[550px] md:h-[668px]"
                      style={{ zIndex: 20 }}
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
                        animate={{ y: [0, -6, 0, -4, 0] }}
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

                {/* Dim overlay for slide 2 */}
                <AnimatePresence>
                  {currentSlide === 1 && (
                    <motion.div
                      key="dim-overlay"
                      className="absolute inset-0 bg-black/10 pointer-events-none"
                      style={{ zIndex: 32 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Slide 2 caption - overlay at bottom of street */}
                <AnimatePresence>
                  {currentSlide === 1 && showCaption && (
                    <motion.div
                      key="slide2-caption-overlay"
                      className="absolute left-1/2 bottom-[-2%] md:bottom-[2%] -translate-x-1/2 w-[90%] max-w-lg pointer-events-none"
                      style={{ zIndex: 35 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-white/85 backdrop-blur-sm rounded-xl shadow-lg px-5 py-4 border-2 border-[#64748b]/30 ring-1 ring-[#64748b]/10">
                        <h3 className="font-semibold text-[#1A1F24] text-base md:text-lg mb-1">
                          Social is how you get noticed
                        </h3>
                        <p className="text-[#5A6570] text-sm md:text-base">
                          Before websites. Before clicks. It&apos;s how strangers become familiar — and familiar turns into trust.
                        </p>
                        <p className="text-[#5A6570]/70 text-xs md:text-sm mt-2 flex items-center justify-center gap-1">
                          <span>Swipe for the next step</span>
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            →
                          </motion.span>
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
                      style={{ zIndex: 35 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-[#5A6570] text-lg">Next: SmartPages</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Caption area BELOW the stage image */}
              <div className="mt-6 text-center">
                <AnimatePresence mode="wait">
                  {/* Slide 1 caption */}
                  {currentSlide === 0 && (
                    <motion.div
                      key="slide1-caption"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#1A1F24] mb-3"
                        style={{ fontFamily: "var(--font-libre-baskerville)" }}
                      >
                        Your business belongs here.
                      </h2>
                      <p className="text-base md:text-lg text-[#5A6570] mb-2">
                        Most never make it past the scroll.
                      </p>
                      <p className="text-sm md:text-base text-[#5A6570]/80 flex items-center justify-center gap-2">
                        <span>Swipe to see what separates the ones that do</span>
                        <motion.span
                          className="inline-flex"
                          animate={{ x: [0, 8, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                      </p>
                    </motion.div>
                  )}

                  {/* Slide 2 - placeholder space (caption is now overlay) */}
                  {currentSlide === 1 && (
                    <motion.div
                      key="slide2-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-[60px]"
                    />
                  )}

                  {/* Slide 3 caption */}
                  {currentSlide === 2 && (
                    <motion.div
                      key="slide3-caption"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-[#5A6570]">Coming soon...</p>
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

            {/* Toggle button */}
            <div className="text-center mt-8">
              <button
                onClick={onToggleOldCards}
                className="inline-flex items-center gap-2 text-sm text-[#5A6570] hover:text-[#2B3A44] transition-colors duration-200"
              >
                <span>Want to read about it instead?</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </motion.div>

      {/* Text explanation overlay - puzzle reveal */}
      <AnimatePresence>
        {showOldCards && (
          <motion.div
            key="cards-overlay"
            className="absolute inset-0 z-50 overflow-y-auto"
          >
            {/* Animated background tiles for puzzle effect */}
            <motion.div
              className="absolute inset-0 bg-[#F4F1EC]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.97 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* Grid overlay for puzzle reveal effect */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-[#F4F1EC]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.03,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Content with staggered reveal */}
            <motion.div
              className="relative max-w-4xl mx-auto px-6 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {/* Back button */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <button
                  onClick={handleCloseOverlay}
                  className="inline-flex items-center gap-2 text-sm text-[#5A6570] hover:text-[#2B3A44] transition-colors duration-200"
                >
                  <span>←</span>
                  <span>Back to the visual story</span>
                </button>
              </motion.div>

              {/* Old cards content with fade in */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {oldCardsContent}
              </motion.div>

              {/* Bottom back button */}
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <button
                  onClick={handleCloseOverlay}
                  className="inline-flex items-center gap-2 text-sm text-[#5A6570] hover:text-[#2B3A44] transition-colors duration-200"
                >
                  <span>←</span>
                  <span>Back to the visual story</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
