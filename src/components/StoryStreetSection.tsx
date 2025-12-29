"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

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

// Slide 1: Swipe education
function Slide1Content({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-12 pointer-events-none z-20">
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
    </div>
  );
}

// Slide 2: IG Post with animations
function Slide2Content({
  isActive,
  hasEntered,
  onEnter,
  reducedMotion,
}: {
  isActive: boolean;
  hasEntered: boolean;
  onEnter: () => void;
  reducedMotion: boolean;
}) {
  const [showCaption, setShowCaption] = useState(false);
  const [reactions, setReactions] = useState<ReactionInstance[]>([]);

  // Trigger animations when slide becomes active
  useEffect(() => {
    if (isActive && !hasEntered) {
      onEnter();
      // Show caption after IG post lands
      setTimeout(() => setShowCaption(true), 1800);

      // Spawn reactions once
      if (!reducedMotion) {
        setTimeout(() => {
          setReactions([
            { id: "heart-1", type: "heart", scale: 1.0, xOffset: -100, delay: 0 },
            { id: "heart-2", type: "heart", scale: 1.2, xOffset: 80, delay: 0.3 },
            { id: "heart-3", type: "heart", scale: 0.9, xOffset: 0, delay: 0.6 },
            { id: "thumbs-1", type: "thumbsUp", scale: 1.0, xOffset: -50, delay: 0.2 },
            { id: "thumbs-2", type: "thumbsUp", scale: 0.85, xOffset: 100, delay: 0.5 },
          ]);
        }, 2200);
      }
    }

    if (!isActive) {
      setShowCaption(false);
      setReactions([]);
    }
  }, [isActive, hasEntered, onEnter, reducedMotion]);

  if (!isActive) return null;

  return (
    <>
      {/* Dim overlay */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-[11]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating reactions - always behind building */}
      {!reducedMotion && reactions.map((reaction) => (
        <FloatingReaction key={reaction.id} instance={reaction} />
      ))}

      {/* IG Post - starts behind building, rises up, then comes forward */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "clamp(320px, 75vw, 600px)",
          height: "clamp(388px, 91vw, 728px)",
          left: "50%",
          x: "-50%",
        }}
        initial={{
          top: "70%",
          opacity: 0,
          scale: 0.8,
          zIndex: 5,
        }}
        animate={{
          top: "20%",
          y: "-50%",
          opacity: 1,
          scale: 1,
          zIndex: 15,
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          zIndex: { delay: 0.6, duration: 0.3 },
        }}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{
            y: [0, -8, 0, -5, 0],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1.5,
          }}
        >
          <Image
            src={ASSETS.igPost}
            alt="Coming soon post"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Caption card */}
      <AnimatePresence>
        {showCaption && (
          <motion.div
            className="absolute bottom-[8%] md:bottom-[12%] left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="bg-[#F4F1EC] rounded-lg shadow-lg px-6 py-4 max-w-sm mx-auto border border-[#E0DCD4]">
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
  );
}

// Single floating reaction - always behind all layers
function FloatingReaction({ instance }: { instance: ReactionInstance }) {
  const src = instance.type === "heart" ? ASSETS.heart : ASSETS.thumbsUp;
  const baseSize = instance.type === "heart" ? 60 : 55;

  return (
    <motion.div
      className="absolute pointer-events-none z-[2]"
      style={{
        width: baseSize * instance.scale,
        height: baseSize * instance.scale,
        left: `calc(50% + ${instance.xOffset}px)`,
        top: "60%",
      }}
      initial={{
        opacity: 0,
        y: 0,
        scale: 0.3,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -100, -220, -380],
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

// Slide 3: Placeholder
function Slide3Content({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <p className="text-[#5A6570] text-lg">Slide 3 - SmartPages coming soon</p>
    </div>
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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30 pointer-events-auto">
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

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    watchDrag: true,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasEnteredSlide2, setHasEnteredSlide2] = useState(false);

  // Sync current slide with Embla
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Preload images
  useEffect(() => {
    Object.values(ASSETS).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="py-12 md:py-20 bg-[#F4F1EC]">
      {/* Carousel container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Embla viewport - wraps the draggable area */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {/* All 3 slides render the same scene with different overlays */}
            {[0, 1, 2].map((slideIndex) => (
              <div
                key={slideIndex}
                className="flex-[0_0_100%] min-w-0"
              >
                <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/9] lg:aspect-[2/1]">
                  {/* Fixed base scene */}
                  <Image
                    src={ASSETS.streetBase}
                    alt="Street scene"
                    fill
                    className="object-cover object-center z-10"
                    style={{ position: 'absolute' }}
                    priority
                  />

                  {/* Overlay content based on current slide */}
                  <AnimatePresence mode="wait">
                    {currentIndex === slideIndex && slideIndex === 0 && (
                      <Slide1Content key="slide1" isActive={currentIndex === 0} />
                    )}
                    {currentIndex === slideIndex && slideIndex === 1 && (
                      <Slide2Content
                        key="slide2"
                        isActive={currentIndex === 1}
                        hasEntered={hasEnteredSlide2}
                        onEnter={() => setHasEnteredSlide2(true)}
                        reducedMotion={reducedMotion}
                      />
                    )}
                    {currentIndex === slideIndex && slideIndex === 2 && (
                      <Slide3Content key="slide3" isActive={currentIndex === 2} />
                    )}
                  </AnimatePresence>

                  {/* Pagination dots - only show on first slide to avoid duplicates */}
                  {slideIndex === 0 && (
                    <PaginationDots
                      slideCount={3}
                      currentIndex={currentIndex}
                      onDotClick={scrollTo}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
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
