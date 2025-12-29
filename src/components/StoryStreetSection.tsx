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

// Floating reaction component - varied positions for natural feel
function FloatingReaction({ instance }: { instance: ReactionInstance }) {
  const src = instance.type === "heart" ? ASSETS.heart : ASSETS.thumbsUp;
  const baseSize = instance.type === "heart" ? 55 : 50;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: baseSize * instance.scale,
        height: baseSize * instance.scale,
        left: `calc(50% + ${instance.xOffset}px)`,
        bottom: `${20 + instance.yOffset}%`,
        zIndex: 10,
      }}
      initial={{
        opacity: 0,
        y: 0,
        scale: 0.3,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -80, -180, -280],
        scale: [0.3, instance.scale, instance.scale * 0.95, instance.scale * 0.6],
      }}
      transition={{
        duration: 4,
        delay: instance.delay,
        ease: "easeOut",
        times: [0, 0.2, 0.6, 1],
        repeat: Infinity,
        repeatDelay: 1,
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

  // Randomized reaction configs - varied positions each render cycle
  const reactionConfigs: ReactionInstance[] = useMemo(() => [
    { id: "heart-1", type: "heart", scale: 1.0, xOffset: -110, yOffset: 0, delay: 0 },
    { id: "heart-2", type: "heart", scale: 1.3, xOffset: 90, yOffset: 5, delay: 0.8 },
    { id: "heart-3", type: "heart", scale: 0.85, xOffset: -30, yOffset: -3, delay: 1.6 },
    { id: "thumbs-1", type: "thumbsUp", scale: 1.1, xOffset: -70, yOffset: 2, delay: 0.4 },
    { id: "thumbs-2", type: "thumbsUp", scale: 0.9, xOffset: 130, yOffset: -2, delay: 1.2 },
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

  return (
    <section className="py-8 md:py-16 bg-[#F4F1EC]">
      {/* Toggle between carousel and cards - in place */}
      <AnimatePresence mode="wait">
        {!showOldCards ? (
          <motion.div
            key="carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                      className="absolute pointer-events-none left-1/2 bottom-[47%] md:bottom-[27%] w-[325px] h-[395px] md:w-[550px] md:h-[668px]"
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
                        Get noticed.
                      </h2>
                      <p className="text-base md:text-lg text-[#5A6570] flex items-center justify-center gap-2">
                        <span>Swipe to see how it works</span>
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

                  {/* Slide 2 caption */}
                  {currentSlide === 1 && showCaption && (
                    <motion.div
                      key="slide2-caption"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="max-w-lg mx-auto"
                    >
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md px-6 py-5 border border-[#E0DCD4]">
                        <h3 className="font-semibold text-[#1A1F24] text-lg md:text-xl mb-2">
                          Social is how you get noticed
                        </h3>
                        <p className="text-[#5A6570] text-sm md:text-base">
                          Before websites. Before clicks. It&apos;s how strangers become familiar — and familiar turns into trust.
                        </p>
                        <p className="text-[#5A6570]/70 text-xs md:text-sm mt-3 flex items-center justify-center gap-1">
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

                  {/* Slide 2 placeholder before caption */}
                  {currentSlide === 1 && !showCaption && (
                    <motion.div
                      key="slide2-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-[120px]"
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
                <span>Want the straight explanation?</span>
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
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-6"
          >
            {/* Back button */}
            <div className="text-center mb-8">
              <button
                onClick={onToggleOldCards}
                className="inline-flex items-center gap-2 text-sm text-[#5A6570] hover:text-[#2B3A44] transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <span>Back to the story</span>
              </button>
            </div>

            {/* Old cards content */}
            {oldCardsContent}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
