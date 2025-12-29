"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";

// Asset paths
const ASSETS = {
  slide0: "/story/slide-0.jpg",
  slide1: "/story/slide-1.jpg",
  igPost: "/story/overlays/ig-post-coming-soon.png",
  heart1: "/story/overlays/heart-1.png",
  heart2: "/story/overlays/heart-2.png",
  thumbsUp: "/story/overlays/thumbs-up-1.png",
};

// Safe image component that handles missing files
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

  if (hasError) {
    return null; // Don't render anything if image fails to load
  }

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

// Floating heart/reaction component
function FloatingReaction({
  src,
  delay,
  startX,
  reducedMotion,
}: {
  src: string;
  delay: number;
  startX: string; // percentage like "45%"
  reducedMotion: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || reducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="absolute w-8 h-8 md:w-10 md:h-10 pointer-events-none"
      style={{ left: startX, bottom: "55%" }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -40, -80, -120],
        scale: [0.5, 1, 1, 0.8],
      }}
      transition={{
        duration: 2.5,
        delay: delay,
        ease: "easeOut",
        times: [0, 0.2, 0.7, 1],
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

export function StoryStreetSection() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [showOverlays, setShowOverlays] = useState(false);

  // IntersectionObserver to trigger animation when section is ~40% visible
  useEffect(() => {
    if (reducedMotion) {
      // For reduced motion, show final state immediately
      setHasTriggered(true);
      setShowOverlays(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            setHasTriggered(true);
            // Delay overlays slightly after crossfade starts
            setTimeout(() => setShowOverlays(true), 600);
          }
        });
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered, reducedMotion]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#F4F1EC]">
      <Container>
        {/* Street scene container */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Image container with aspect ratio */}
          <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-xl overflow-hidden bg-[#2B3A44]/10">
            {/* Base layer: slide-0 */}
            <div
              className={`absolute inset-0 ${
                reducedMotion ? "" : "transition-opacity duration-1000"
              }`}
              style={{ opacity: hasTriggered ? 0 : 1 }}
            >
              <SafeImage
                src={ASSETS.slide0}
                alt="Quiet street scene"
                fill
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Active layer: slide-1 (lights on) */}
            <div
              className={`absolute inset-0 ${
                reducedMotion ? "" : "transition-opacity duration-1000"
              }`}
              style={{ opacity: hasTriggered ? 1 : 0 }}
            >
              <SafeImage
                src={ASSETS.slide1}
                alt="Street scene with neighbor windows lit"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Overlays container */}
            <AnimatePresence>
              {showOverlays && (
                <>
                  {/* IG Post overlay - rising from center */}
                  <motion.div
                    className="absolute w-24 h-28 md:w-32 md:h-36 lg:w-40 lg:h-44"
                    style={{
                      left: "50%",
                      bottom: "30%",
                      transform: "translateX(-50%)",
                    }}
                    initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <SafeImage
                      src={ASSETS.igPost}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </motion.div>

                  {/* Floating reactions */}
                  {!reducedMotion && (
                    <>
                      <FloatingReaction
                        src={ASSETS.heart1}
                        delay={0.8}
                        startX="46%"
                        reducedMotion={reducedMotion}
                      />
                      <FloatingReaction
                        src={ASSETS.heart2}
                        delay={1.2}
                        startX="52%"
                        reducedMotion={reducedMotion}
                      />
                      <FloatingReaction
                        src={ASSETS.thumbsUp}
                        delay={1.6}
                        startX="48%"
                        reducedMotion={reducedMotion}
                      />
                    </>
                  )}
                </>
              )}
            </AnimatePresence>

            {/* Fallback gradient overlay for when images are missing */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B3A44]/20 to-transparent pointer-events-none" />
          </div>

          {/* Copy and CTA below image */}
          <div className="mt-8 text-center">
            <motion.p
              className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#1A1F24] mb-6"
              style={{ fontFamily: "var(--font-libre-baskerville)" }}
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Get noticed.
            </motion.p>
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link
                href="/social"
                className="inline-block px-8 py-3 bg-[#2B3A44] text-[#F4F1EC] font-medium rounded-full hover:bg-[#1A1F24] transition-colors duration-300"
              >
                Social that shows up
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Toggle component for revealing old cards section
interface CardsToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CardsToggle({ isOpen, onToggle }: CardsToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center gap-2 mx-auto text-sm text-[#5A6570] hover:text-[#2B3A44] transition-colors duration-200"
    >
      <span>{isOpen ? "Hide the long version" : "Want the straight explanation?"}</span>
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// Wrapper for the old cards section with animation
interface OldCardsSectionWrapperProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export function OldCardsSectionWrapper({ isVisible, children }: OldCardsSectionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
