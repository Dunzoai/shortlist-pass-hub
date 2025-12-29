"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";

// Asset paths - all in /public root
const ASSETS = {
  streetBase: "/slide-0.png",
  igPost: "/coming-soon.png",
  heart: "/heart-overlay.png",
  thumbsUp: "/thumbs-up.png",
};

// Safe image component that handles missing files
function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  style,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={style}
      onError={() => setHasError(true)}
    />
  );
}

// Floating reaction component (hearts, thumbs up)
function FloatingReaction({
  src,
  delay,
  startX,
  size,
  driftX,
  reducedMotion,
}: {
  src: string;
  delay: number;
  startX: string;
  size: number;
  driftX: number;
  reducedMotion: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || reducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: startX,
        bottom: "45%",
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.3 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [20, -20, -60, -100],
        x: [0, driftX * 0.3, driftX * 0.6, driftX],
        scale: [0.3, 1, 1, 0.7],
      }}
      transition={{
        duration: 2.2,
        delay: delay,
        ease: "easeOut",
        times: [0, 0.25, 0.7, 1],
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

// Instagram post that floats up and then drifts away
function FloatingIGPost({
  show,
  reducedMotion,
}: {
  show: boolean;
  reducedMotion: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  if (reducedMotion) {
    // For reduced motion, just show statically if triggered
    return show ? (
      <div
        className="absolute w-28 h-36 md:w-36 md:h-44 lg:w-44 lg:h-52 pointer-events-none"
        style={{
          left: "50%",
          bottom: "35%",
          transform: "translateX(-50%)",
        }}
      >
        <Image
          src={ASSETS.igPost}
          alt=""
          fill
          className="object-contain"
          onError={() => setHasError(true)}
        />
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute w-28 h-36 md:w-36 md:h-44 lg:w-44 lg:h-52 pointer-events-none"
          style={{
            left: "50%",
            bottom: "25%",
            x: "-50%",
          }}
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            y: [60, 0, -10, -20, -60],
            scale: [0.8, 1, 1, 1, 0.9],
          }}
          transition={{
            duration: 3.5,
            ease: "easeOut",
            times: [0, 0.2, 0.5, 0.75, 1],
          }}
        >
          <Image
            src={ASSETS.igPost}
            alt=""
            fill
            className="object-contain drop-shadow-lg"
            onError={() => setHasError(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StoryStreetSection() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  // Preload images
  useEffect(() => {
    Object.values(ASSETS).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // IntersectionObserver to trigger animation when section is ~40% visible
  useEffect(() => {
    if (reducedMotion) {
      setHasTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            setHasTriggered(true);
            // Delay reactions until IG post is partially visible
            setTimeout(() => setShowReactions(true), 1200);
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
          <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden bg-[#2B3A44]/5">
            {/* Base street image - always visible */}
            <SafeImage
              src={ASSETS.streetBase}
              alt="Street scene"
              fill
              className="object-cover object-center"
              priority
            />

            {/* Instagram post floating up */}
            <FloatingIGPost show={hasTriggered} reducedMotion={reducedMotion} />

            {/* Floating reactions - hearts and thumbs up */}
            {showReactions && !reducedMotion && (
              <>
                {/* Heart 1 - left of center, smaller */}
                <FloatingReaction
                  src={ASSETS.heart}
                  delay={0}
                  startX="42%"
                  size={28}
                  driftX={-15}
                  reducedMotion={reducedMotion}
                />
                {/* Heart 2 - center-right, medium */}
                <FloatingReaction
                  src={ASSETS.heart}
                  delay={0.3}
                  startX="52%"
                  size={36}
                  driftX={10}
                  reducedMotion={reducedMotion}
                />
                {/* Heart 3 - right, larger */}
                <FloatingReaction
                  src={ASSETS.heart}
                  delay={0.6}
                  startX="48%"
                  size={32}
                  driftX={20}
                  reducedMotion={reducedMotion}
                />
                {/* Thumbs up - slightly delayed */}
                <FloatingReaction
                  src={ASSETS.thumbsUp}
                  delay={0.9}
                  startX="45%"
                  size={30}
                  driftX={-8}
                  reducedMotion={reducedMotion}
                />
              </>
            )}

            {/* Subtle gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#2B3A44]/10 to-transparent pointer-events-none" />
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
