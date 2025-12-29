"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";

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

// Safe image component
function SafeImage({
  src,
  alt,
  fill,
  className,
  priority,
  style,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      style={style}
      onError={() => setHasError(true)}
    />
  );
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
        className="absolute w-32 h-40 md:w-40 md:h-48 lg:w-48 lg:h-56 pointer-events-none z-10"
        style={{
          left: "50%",
          bottom: "30%",
          transform: "translateX(-50%)",
          opacity: 0.65,
        }}
      >
        <Image
          src={ASSETS.igPost}
          alt=""
          fill
          className="object-contain drop-shadow-xl"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute w-32 h-40 md:w-40 md:h-48 lg:w-48 lg:h-56 pointer-events-none z-10"
          style={{ left: "50%", bottom: "15%", x: "-50%" }}
          initial={{ opacity: 0, y: 80 }}
          animate={{
            opacity: [0, 1, 1, 0.65],
            y: [80, 0, 0, 0],
          }}
          transition={{
            duration: 1.7,
            ease: "easeOut",
            times: [0, 0.4, 0.6, 1],
          }}
        >
          <Image
            src={ASSETS.igPost}
            alt=""
            fill
            className="object-contain drop-shadow-xl"
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
  const size = instance.type === "heart" ? 32 : 28;

  if (hasError || reducedMotion) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        left: `calc(50% + ${instance.xOffset}px)`,
        bottom: "40%",
        width: size * instance.scale,
        height: size * instance.scale,
        transform: "translateX(-50%)",
      }}
      initial={{ opacity: 0, y: 0, scale: 0.3 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -30, -70, -110],
        x: [0, instance.xOffset * 0.2, instance.xOffset * 0.4, instance.xOffset * 0.5],
        scale: [0.3, instance.scale, instance.scale, instance.scale * 0.7],
      }}
      transition={{
        duration: 1.2,
        delay: instance.delay,
        ease: "easeOut",
        times: [0, 0.2, 0.65, 1],
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

  // Stage state
  const [stage, setStage] = useState(0);
  const [hasPlayedStage1, setHasPlayedStage1] = useState(false);
  const [reactions, setReactions] = useState<ReactionInstance[]>([]);

  // Refs for sentinel elements
  const stage1SentinelRef = useRef<HTMLDivElement>(null);
  const oldCardsSectionId = "old-cards-section";

  // Preload images
  useEffect(() => {
    Object.values(ASSETS).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Spawn reactions for Stage 1
  const spawnReactions = useCallback(() => {
    const newReactions: ReactionInstance[] = [
      { id: "heart-1", type: "heart", scale: 0.85, xOffset: -25, delay: 0.15 },
      { id: "heart-2", type: "heart", scale: 1.05, xOffset: 20, delay: 0.35 },
      { id: "heart-3", type: "heart", scale: 0.7, xOffset: 5, delay: 0.55 },
      { id: "thumbs-1", type: "thumbsUp", scale: 0.9, xOffset: -10, delay: 0.75 },
    ];
    setReactions(newReactions);

    // Clear reactions after animation completes
    setTimeout(() => setReactions([]), 3000);
  }, []);

  // Stage 1 trigger via IntersectionObserver
  useEffect(() => {
    if (hasPlayedStage1 || reducedMotion) {
      if (reducedMotion) {
        setStage(1);
        setHasPlayedStage1(true);
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedStage1) {
            setStage(1);
            setHasPlayedStage1(true);
            // Spawn reactions after post starts animating
            setTimeout(spawnReactions, 800);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (stage1SentinelRef.current) {
      observer.observe(stage1SentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasPlayedStage1, reducedMotion, spawnReactions]);

  return (
    <section className="py-16 md:py-24 bg-[#F4F1EC]">
      <Container>
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Stage 0 sentinel (top of section) */}
          <div data-stage="0" className="absolute top-0 h-1" />

          {/* Image container */}
          <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden bg-[#2B3A44]/5">
            {/* Base street image - always visible */}
            <SafeImage
              src={ASSETS.streetBase}
              alt="Street scene"
              fill
              className="object-cover object-center"
              priority
            />

            {/* Stage 1 sentinel - positioned to trigger when image is mostly visible */}
            <div
              ref={stage1SentinelRef}
              data-stage="1"
              className="absolute left-0 right-0 h-4"
              style={{ top: "60%" }}
            />

            {/* Coming Soon Post - only renders when stage >= 1 */}
            <ComingSoonPost isActive={stage >= 1} reducedMotion={reducedMotion} />

            {/* Floating reactions */}
            {reactions.map((reaction) => (
              <FloatingReaction
                key={reaction.id}
                instance={reaction}
                reducedMotion={reducedMotion}
              />
            ))}

            {/* Reduced motion: show static heart */}
            {reducedMotion && stage >= 1 && (
              <div
                className="absolute w-6 h-6 pointer-events-none z-20"
                style={{ left: "52%", bottom: "50%", opacity: 0.8 }}
              >
                <SafeImage src={ASSETS.heart} alt="" fill className="object-contain" />
              </div>
            )}

            {/* Subtle gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#2B3A44]/10 to-transparent pointer-events-none" />
          </div>

          {/* Copy and CTA */}
          <div className="mt-8 text-center">
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
      </Container>
    </section>
  );
}
