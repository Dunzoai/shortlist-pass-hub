"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Asset paths
const ASSETS = {
  buildingLayer: "/storystreet/slide-0.jpg",
  theBusiness: "/storystreet/the-business.png",
  igPost: "/storystreet/coming-soon.png",
  heart: "/storystreet/heart-overlay.png",
  thumbsUp: "/storystreet/thumbs-up.png",
  // Slide 3 assets
  theBusiness3: "/storystreet/the-business-3.png",
  man: "/storystreet/man.png",
  questionBubble: "/storystreet/man-availability-question.png",
  smartpage3: "/storystreet/smartpage-3.png",
  // Slide 4 floating icons
  calendarStreet: "/storystreet/calendar-street.png",
  facebookStreet: "/storystreet/facebook-street.png",
  laptopStreet: "/storystreet/latptop-street.png",
  messagesStreet: "/storystreet/messages-street.png",
  moneySignStreet: "/storystreet/money-sign-street.png",
  reviewsStreet: "/storystreet/reviews.png",
  salesStreet: "/storystreet/sales-street.png",
};

// Digital icon instance type - matches hearts/thumbs pattern
interface DigitalIconInstance {
  id: string;
  type: "calendar" | "facebook" | "laptop" | "messages" | "money" | "reviews" | "sales" | "heart" | "thumbsUp";
  scale: number;
  xOffset: number; // pixels from center
  delay: number;
  maxY: number; // how far up to float (varied fade heights)
  duration: number; // varied durations for continuous flow
}

// Floating digital icon - matches hearts/thumbs animation style with natural sway
function FloatingDigitalIcon({ instance, isMobile }: { instance: DigitalIconInstance; isMobile: boolean }) {
  const srcMap: Record<DigitalIconInstance["type"], string> = {
    calendar: ASSETS.calendarStreet,
    facebook: ASSETS.facebookStreet,
    laptop: ASSETS.laptopStreet,
    messages: ASSETS.messagesStreet,
    money: ASSETS.moneySignStreet,
    reviews: ASSETS.reviewsStreet,
    sales: ASSETS.salesStreet,
    heart: ASSETS.heart,
    thumbsUp: ASSETS.thumbsUp,
  };
  const src = srcMap[instance.type];
  const baseSize = 70;
  // Pinch 35% on mobile to keep icons inside building container
  const mobileScale = isMobile ? 0.65 : 1;
  const adjustedXOffset = instance.xOffset * mobileScale;
  const driftDir = adjustedXOffset > 0 ? 1 : -1;
  // More natural sway - gentle sine-wave-like movement
  const swayAmount = 12 + Math.abs(adjustedXOffset) * 0.08;
  const h = instance.maxY;
  const dur = instance.duration;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: baseSize * instance.scale,
        height: baseSize * instance.scale,
        left: `calc(50% + ${adjustedXOffset}px)`,
        bottom: "38%",
        zIndex: 30,
      }}
      initial={{
        opacity: 0.9,
        y: 0,
        scale: instance.scale * 0.9,
      }}
      animate={{
        opacity: [0.9, 1, 1, 0.85, 0],
        y: [0, -h * 0.2, -h * 0.5, -h * 0.8, -h],
        scale: [instance.scale * 0.9, instance.scale, instance.scale * 0.95, instance.scale * 0.85, instance.scale * 0.6],
        // Natural sine-wave sway pattern - smoother oscillation
        x: [
          0,
          driftDir * swayAmount * 0.6,
          driftDir * -swayAmount * 0.4,
          driftDir * swayAmount * 0.5,
          driftDir * -swayAmount * 0.2,
          driftDir * swayAmount * 0.3,
          0,
        ],
      }}
      transition={{
        duration: dur,
        delay: instance.delay,
        ease: "easeInOut",
        times: [0, 0.15, 0.45, 0.75, 1],
        x: {
          duration: dur,
          delay: instance.delay,
          ease: [0.37, 0, 0.63, 1], // Smooth sine-like easing
          times: [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
          repeat: Infinity,
          repeatDelay: 0,
        },
        repeat: Infinity,
        repeatDelay: 0, // No pause - continuous flow
      }}
    >
      <Image src={src} alt="" fill className="object-contain drop-shadow-lg" />
    </motion.div>
  );
}

// Reaction instance type with z-index for depth
interface ReactionInstance {
  id: string;
  type: "heart" | "thumbsUp";
  scale: number;
  xOffset: number;
  yOffset: number;
  delay: number;
  zIndex: number; // 25 = behind IG post, 35 = in front of IG post
}

// Floating reaction component - normal speed, starts after IG post, loops
function FloatingReaction({ instance }: { instance: ReactionInstance }) {
  const src = instance.type === "heart" ? ASSETS.heart : ASSETS.thumbsUp;
  const baseSize = instance.type === "heart" ? 60 : 55;
  const driftDir = instance.xOffset > 0 ? 1 : -1;
  const driftAmount = 20 + Math.abs(instance.xOffset) * 0.12;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: baseSize * instance.scale,
        height: baseSize * instance.scale,
        left: `calc(50% + ${instance.xOffset}px)`,
        bottom: `${57 + instance.yOffset}%`,
        zIndex: instance.zIndex,
      }}
      initial={{
        opacity: 0.85,
        y: 0,
        scale: instance.scale * 0.9,
      }}
      animate={{
        opacity: [0.85, 1, 1, 0.8, 0],
        y: [0, -60, -150, -280, -400],
        scale: [instance.scale * 0.9, instance.scale, instance.scale * 0.95, instance.scale * 0.8, instance.scale * 0.5],
        x: [0, driftDir * driftAmount * 0.5, driftDir * -driftAmount * 0.4, driftDir * driftAmount * 0.6, driftDir * driftAmount * 0.2],
      }}
      transition={{
        duration: 4,
        delay: instance.delay,
        ease: "easeInOut",
        times: [0, 0.15, 0.45, 0.75, 1],
        repeat: Infinity,
        repeatDelay: 0.15,
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for icon positioning
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Keys to force remount animations on each slide entry
  const [slide2Key, setSlide2Key] = useState(0);
  const [slide3Key, setSlide3Key] = useState(0);
  const [slide4Key, setSlide4Key] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const totalSlides = 4;
  const swipeThreshold = 50;

  // Reaction configs - pause slightly after IG post, then stagger
  const reactionConfigs: ReactionInstance[] = useMemo(() => [
    { id: "heart-1", type: "heart", scale: 1.1, xOffset: -90, yOffset: 0, delay: 0.2, zIndex: 25 },
    { id: "thumbs-1", type: "thumbsUp", scale: 1.15, xOffset: 70, yOffset: 4, delay: 0.28, zIndex: 35 },
    { id: "heart-2", type: "heart", scale: 1.3, xOffset: 20, yOffset: -2, delay: 0.38, zIndex: 35 },
    { id: "thumbs-2", type: "thumbsUp", scale: 1.0, xOffset: -50, yOffset: 5, delay: 0.5, zIndex: 25 },
    { id: "heart-3", type: "heart", scale: 0.95, xOffset: 100, yOffset: -3, delay: 0.65, zIndex: 25 },
  ], []);

  // Digital icon configs - varied durations for continuous flow (no pause between loops)
  const digitalIconConfigs: DigitalIconInstance[] = useMemo(() => [
    { id: "laptop-1", type: "laptop", scale: 1.1, xOffset: -30, delay: 0.2, maxY: 500, duration: 4.8 },
    { id: "calendar-1", type: "calendar", scale: 0.9, xOffset: -110, delay: 0.5, maxY: 440, duration: 5.4 },
    { id: "facebook-1", type: "facebook", scale: 0.95, xOffset: 95, delay: 0.8, maxY: 560, duration: 5.1 },
    { id: "messages-1", type: "messages", scale: 1.05, xOffset: 25, delay: 1.1, maxY: 400, duration: 4.6 },
    { id: "money-1", type: "money", scale: 0.85, xOffset: -70, delay: 1.4, maxY: 520, duration: 5.7 },
    { id: "reviews-1", type: "reviews", scale: 1.0, xOffset: 120, delay: 1.7, maxY: 470, duration: 5.0 },
    { id: "sales-1", type: "sales", scale: 0.9, xOffset: -5, delay: 2.0, maxY: 540, duration: 5.3 },
    // Hearts and thumbs mixed in
    { id: "heart-s4-1", type: "heart", scale: 1.0, xOffset: 55, delay: 0.35, maxY: 480, duration: 4.9 },
    { id: "thumbs-s4-1", type: "thumbsUp", scale: 0.95, xOffset: -90, delay: 1.25, maxY: 510, duration: 5.5 },
  ], []);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      // Increment keys when entering slides to force animation replay
      if (index === 1) {
        setSlide2Key((k) => k + 1);
      }
      if (index === 2) {
        setSlide3Key((k) => k + 1);
      }
      if (index === 3) {
        setSlide4Key((k) => k + 1);
      }
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

  // No timers needed - everything visible immediately on Slide 2

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
    onToggleOldCards();
  };

  return (
    <section
      ref={sectionRef}
      className="py-8 md:py-16 bg-[#F4F1EC] relative cursor-grab active:cursor-grabbing select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel - always mounted */}
      <motion.div
        animate={{ opacity: showOldCards ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
      >
            <div className="relative max-w-7xl mx-auto px-4">
              {/* Stage container */}
              <div
                className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/9] lg:aspect-[2/1] overflow-hidden rounded-lg"
              >
                {/* Building layer - TOP foreground */}
                <Image
                  src={ASSETS.buildingLayer}
                  alt="Street scene"
                  fill
                  className="object-cover object-bottom pointer-events-none"
                  style={{ zIndex: 10 }}
                  priority
                  draggable={false}
                />

                {/* Hearts and Thumbs - BOTTOM layer - visible immediately on Slide 2 */}
                {currentSlide === 1 && (
                  <>
                    {reactionConfigs.map((reaction) => (
                      <FloatingReaction key={`${reaction.id}-${slide2Key}`} instance={reaction} />
                    ))}
                  </>
                )}

                {/* IG Post - in front of dim overlay, pops */}
                <AnimatePresence mode="sync">
                  {currentSlide === 1 && (
                    <motion.div
                      key={`igpost-${slide2Key}`}
                      className="absolute pointer-events-none left-1/2 bottom-[39%] md:bottom-[27%] w-[325px] h-[395px] md:w-[495px] md:h-[601px]"
                      style={{ zIndex: 30 }}
                      initial={{
                        x: "-50%",
                        y: "3%",
                        opacity: 0.85,
                        scale: 0.97,
                      }}
                      animate={{
                        x: "-50%",
                        y: "-3%",
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.12 },
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      {/* Subtle hover animation */}
                      <motion.div
                        className="w-full h-full relative"
                        animate={{ y: [0, -8, 0, -5, 0] }}
                        transition={{
                          duration: 5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          delay: 0.4,
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

                {/* Persistent dim overlay for slides 2-4 - instant, no animation */}
                {currentSlide >= 1 && (
                  <div
                    className="absolute inset-0 bg-black/15 pointer-events-none"
                    style={{ zIndex: 20 }}
                  />
                )}

                {/* The Business layer - on top so IG post & emojis emerge from behind */}
                {/* Always rendered to prevent mobile blink, visibility controlled via opacity */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-0"
                  style={{
                    zIndex: 38,
                    opacity: currentSlide === 1 ? 1 : 0,
                    visibility: currentSlide === 1 ? 'visible' : 'hidden',
                  }}
                >
                  <Image
                    src={ASSETS.theBusiness}
                    alt=""
                    fill
                    className="object-cover object-bottom"
                    draggable={false}
                    priority
                  />
                </div>

                {/* ========== SLIDE 3: SmartPages ========== */}

                {/* Slide 3: SmartPage - rises from behind business after question fades in */}
                <AnimatePresence>
                  {currentSlide === 2 && (
                    <motion.div
                      key={`smartpage-${slide3Key}`}
                      className="absolute pointer-events-none left-1/2 bottom-[35%] md:bottom-[34%] w-[280px] h-[380px] md:w-[420px] md:h-[570px]"
                      style={{ zIndex: 30 }}
                      initial={{
                        x: "-50%",
                        y: "20%",
                        opacity: 0,
                        scale: 0.97,
                      }}
                      animate={{
                        x: "-50%",
                        y: "0%",
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.1 },
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.6,
                      }}
                    >
                      {/* Subtle hover animation */}
                      <motion.div
                        className="w-full h-full relative"
                        animate={{ y: [0, -8, 0, -5, 0] }}
                        transition={{
                          duration: 5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          delay: 1.0,
                        }}
                      >
                        <Image
                          src={ASSETS.smartpage3}
                          alt="SmartPage interface"
                          fill
                          className="object-contain drop-shadow-2xl"
                          draggable={false}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Slide 3: The Business layer - on TOP so SmartPage emerges from behind */}
                {/* Always rendered to prevent blink, visibility controlled */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    zIndex: 38,
                    opacity: currentSlide === 2 ? 1 : 0,
                    visibility: currentSlide === 2 ? 'visible' : 'hidden',
                  }}
                >
                  <Image
                    src={ASSETS.theBusiness3}
                    alt=""
                    fill
                    className="object-cover object-bottom"
                    draggable={false}
                    priority
                  />
                </div>

                {/* Slide 3: Man character - foreground */}
                {currentSlide === 2 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 39 }}
                  >
                    <Image
                      src={ASSETS.man}
                      alt=""
                      fill
                      className="object-cover object-bottom"
                      draggable={false}
                    />
                  </div>
                )}

                {/* Slide 3: Question bubble - fades in near man's head, then hovers */}
                <AnimatePresence>
                  {currentSlide === 2 && (
                    <motion.div
                      key={`question-bubble-${slide3Key}`}
                      className="absolute pointer-events-none left-[38%] md:left-[45%] bottom-[30%] md:bottom-[34%] w-[270px] h-[135px] md:w-[330px] md:h-[165px]"
                      style={{ zIndex: 42 }}
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.1 },
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.15,
                      }}
                    >
                      {/* Subtle hover animation */}
                      <motion.div
                        className="w-full h-full relative"
                        animate={{ y: [0, -5, 0, -3, 0] }}
                        transition={{
                          duration: 4.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          delay: 0.6,
                        }}
                      >
                        <Image
                          src={ASSETS.questionBubble}
                          alt="Customer question"
                          fill
                          className="object-contain drop-shadow-lg"
                          draggable={false}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ========== SLIDE 4: Digital Systems ========== */}

                {/* Slide 4: Floating digital icons - grouped like hearts/thumbs */}
                {currentSlide === 3 && (
                  <>
                    {digitalIconConfigs.map((icon) => (
                      <FloatingDigitalIcon key={`${icon.id}-${slide4Key}`} instance={icon} isMobile={isMobile} />
                    ))}
                  </>
                )}

                {/* Slide 4: The Business layer - always rendered to prevent blink */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    zIndex: 38,
                    opacity: currentSlide === 3 ? 1 : 0,
                    visibility: currentSlide === 3 ? 'visible' : 'hidden',
                  }}
                >
                  {/* Light flicker effect - toned down 25% */}
                  <motion.div
                    className="w-full h-full relative"
                    animate={currentSlide === 3 ? {
                      filter: [
                        "brightness(1)",
                        "brightness(1.09)",
                        "brightness(1)",
                        "brightness(1.06)",
                        "brightness(1.11)",
                        "brightness(1)",
                        "brightness(1.045)",
                        "brightness(1)",
                      ],
                    } : {}}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
                    }}
                  >
                    <Image
                      src={ASSETS.theBusiness3}
                      alt=""
                      fill
                      className="object-cover object-bottom"
                      draggable={false}
                      priority
                    />
                    {/* Warm amber glow overlay for windows/doors - toned down 25% */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "radial-gradient(ellipse 40% 30% at 50% 72%, rgba(255, 191, 105, 0.38) 0%, rgba(255, 166, 77, 0.22) 40%, transparent 70%)",
                        mixBlendMode: "soft-light",
                      }}
                      animate={currentSlide === 3 ? {
                        opacity: [0.4, 0.75, 0.45, 0.75, 0.52, 0.67, 0.4],
                      } : { opacity: 0 }}
                      transition={{
                        duration: 2.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        times: [0, 0.15, 0.35, 0.5, 0.7, 0.85, 1],
                      }}
                    />
                    {/* Secondary warmer glow pulse - toned down 25% */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "radial-gradient(ellipse 30% 22% at 48% 75%, rgba(255, 147, 41, 0.3) 0%, transparent 60%)",
                        mixBlendMode: "overlay",
                      }}
                      animate={currentSlide === 3 ? {
                        opacity: [0.22, 0.67, 0.3, 0.75, 0.38, 0.6, 0.22],
                      } : { opacity: 0 }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        times: [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1],
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Slide 2 Caption overlay - appears AFTER emojis with a breath */}
              <AnimatePresence>
                {currentSlide === 1 && (
                  <motion.div
                    key={`slide2-caption-${slide2Key}`}
                    className="relative -mt-24 sm:-mt-28 md:-mt-20 mx-auto w-[85%] sm:w-[80%] max-w-md"
                    style={{ zIndex: 40 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.8 }}
                  >
                    <div className="bg-white/65 backdrop-blur-sm rounded-xl shadow-lg px-4 py-4 md:px-6 md:py-5 border-2 border-[#5b8fc9]/35 ring-1 ring-[#5b8fc9]/15 text-center">
                      <h3 className="font-semibold text-[#1A1F24] text-sm sm:text-base md:text-lg mb-1">
                        Social is how you get noticed
                      </h3>
                      <p className="text-[#5A6570] text-xs sm:text-sm md:text-base">
                        Before websites. Before clicks. It&apos;s how strangers become familiar and familiar turns into trust.
                      </p>
                      <p className="text-[#5A6570]/70 text-[10px] sm:text-xs md:text-sm mt-2 mb-3 flex items-center justify-center gap-1">
                        <span>Swipe for the next step</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                      </p>
                      <div className="flex justify-center">
                        <Link
                          href="/social"
                          className="inline-block px-6 py-3 bg-[#2B3A44] text-[#F4F1EC] text-sm font-semibold rounded-lg hover:bg-[#1f2b33] transition-colors duration-200 pointer-events-auto shadow-md"
                        >
                          Why social comes first
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Slide 3 Caption overlay - appears AFTER business answers */}
              <AnimatePresence>
                {currentSlide === 2 && (
                  <motion.div
                    key={`slide3-caption-${slide3Key}`}
                    className="relative -mt-24 sm:-mt-28 md:-mt-20 mx-auto w-[90%] sm:w-[85%] max-w-lg"
                    style={{ zIndex: 40 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 1.5 }}
                  >
                    <div className="bg-white/65 backdrop-blur-sm rounded-xl shadow-lg px-4 py-4 md:px-6 md:py-5 border-2 border-[#5b8fc9]/35 ring-1 ring-[#5b8fc9]/15 text-center">
                      <h3 className="font-semibold text-[#1A1F24] text-sm sm:text-base md:text-lg mb-1">
                        Your business assistant, online.
                      </h3>
                      <p className="text-[#5A6570] text-xs sm:text-sm md:text-base mb-2">
                        Think of a SmartPage as a lightweight website with superpowers. It knows your hours, availability, links, services, and delivers it to your customers. One link. Every Answer. Customers satisfied.
                      </p>
                      <p className="text-[#5A6570]/70 text-[10px] sm:text-xs md:text-sm mt-2 mb-3 flex items-center justify-center gap-1">
                        <span>Swipe for the next step</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                      </p>
                      <div className="flex justify-center">
                        <Link
                          href="/smartpages"
                          className="inline-block px-6 py-3 bg-[#2B3A44] text-[#F4F1EC] text-sm font-semibold rounded-lg hover:bg-[#1f2b33] transition-colors duration-200 pointer-events-auto shadow-md"
                        >
                          Meet your SmartPage
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Slide 4 Caption overlay - appears AFTER digital tools emerge */}
              <AnimatePresence>
                {currentSlide === 3 && (
                  <motion.div
                    key={`slide4-caption-${slide4Key}`}
                    className="relative -mt-24 sm:-mt-28 md:-mt-20 mx-auto w-[90%] sm:w-[85%] max-w-lg"
                    style={{ zIndex: 40 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 1.2 }}
                  >
                    <div className="bg-white/65 backdrop-blur-sm rounded-xl shadow-lg px-4 py-4 md:px-6 md:py-5 border-2 border-[#5b8fc9]/35 ring-1 ring-[#5b8fc9]/15 text-center">
                      <h3 className="font-semibold text-[#1A1F24] text-sm sm:text-base md:text-lg mb-1">
                        This is where it becomes digital.
                      </h3>
                      <p className="text-[#5A6570] text-xs sm:text-sm md:text-base mb-3">
                        Websites, apps, and SmartPages working together — booking customers, answering questions, and moving money without constant effort from you.
                      </p>
                      <div className="flex justify-center">
                        <Link
                          href="/digital"
                          className="inline-block px-6 py-3 bg-[#2B3A44] text-[#F4F1EC] text-sm font-semibold rounded-lg hover:bg-[#1f2b33] transition-colors duration-200 pointer-events-auto shadow-md"
                        >
                          Explore our digital builds
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                      <motion.p
                        className="text-sm md:text-base text-[#2B3A44] flex items-center justify-center gap-2 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                      >
                        <motion.span
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                        >
                          Swipe to see what separates the ones that do
                        </motion.span>
                        <motion.span
                          className="inline-flex text-[#2B3A44]"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
                        >
                          →
                        </motion.span>
                      </motion.p>
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

                  {/* Slide 3 - placeholder space (visual tells the story) */}
                  {currentSlide === 2 && (
                    <motion.div
                      key="slide3-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-[60px]"
                    />
                  )}

                  {/* Slide 4 - placeholder space (caption is overlay) */}
                  {currentSlide === 3 && (
                    <motion.div
                      key="slide4-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-[60px]"
                    />
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

      {/* Text explanation overlay - puzzle reveal with scene pieces */}
      <AnimatePresence>
        {showOldCards && (
          <motion.div
            key="cards-overlay"
            className="absolute inset-0 z-50 overflow-y-auto"
          >
            {/* Grid of image tiles for puzzle effect - showing pieces of the street scene */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-8 pointer-events-none">
              {Array.from({ length: 48 }).map((_, i) => {
                const col = i % 6;
                const row = Math.floor(i / 6);
                return (
                  <motion.div
                    key={i}
                    className="relative overflow-hidden"
                    style={{
                      backgroundImage: `url(${ASSETS.buildingLayer})`,
                      backgroundSize: "600% 800%",
                      backgroundPosition: `${col * 20}% ${row * 14.28}%`,
                    }}
                    initial={{ opacity: 0, scale: 0.7, rotate: -5 + Math.random() * 10 }}
                    animate={{ opacity: 0.92, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.85, rotate: 5 - Math.random() * 10 }}
                    transition={{
                      duration: 0.5,
                      delay: (row * 0.04) + (col * 0.02) + Math.random() * 0.08,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </div>

            {/* Frosted overlay for readability */}
            <motion.div
              className="absolute inset-0 bg-[#F4F1EC]/85 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />

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
