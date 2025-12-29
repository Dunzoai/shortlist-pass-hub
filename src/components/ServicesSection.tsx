"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";

// Service data
const services = [
  {
    title: "Social that actually shows up",
    subhead: "Be seen where customers already scroll.",
    description:
      "Social is how people first come across your business. It introduces who you are, what you offer, and why you're worth paying attention to — before they ever click a link. We create and manage social that builds familiarity early, so when someone's ready to act, your business already feels like a known choice.",
    href: "/social",
    cta: "Get seen first",
    stage: 0,
  },
  {
    title: "SmartPages",
    subhead: "One clear place customers trust.",
    description:
      "Once people want to learn more, they need a clear, reliable place to land. SmartPages bring everything about your business together — answers, hours, menus, links, updates, and booking — so customers don't have to hunt or second-guess. It's the framework that holds your business online, and makes it feel organized and real.",
    href: "/smartpages",
    cta: "Build your foundation",
    stage: 1,
  },
  {
    title: "Websites & Apps",
    subhead: "When the problem needs more than a template.",
    description:
      "As your business grows, you need more than a single page. Custom websites and lightweight apps let you explain clearly, guide people through decisions, and handle real-world needs — ordering, booking, events, memberships, and more. This is where everything comes together and actually works, turning interest into action and keeping your business running smoothly.",
    href: "/digital",
    cta: "Make it work",
    stage: 2,
  },
];

// Stage images - the house progression
const stageImages = ["/Door.png", "/house-frame.png", "/house-windows.png"];

// Preload images to prevent flicker
function useImagePreloader(srcs: string[]) {
  useEffect(() => {
    srcs.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [srcs]);
}

// Shared illustration component with smooth transitions
function IllustrationDisplay({
  activeStage,
  reducedMotion,
}: {
  activeStage: number;
  reducedMotion: boolean;
}) {
  return (
    <div className="relative w-full h-[280px] md:h-[320px] flex items-center justify-center">
      {stageImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 flex items-center justify-center ${
            reducedMotion ? "" : "transition-opacity duration-500 ease-out"
          }`}
          style={{ opacity: index === activeStage ? 1 : 0 }}
        >
          <div className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px]">
            {/* Subtle glow effect for stage 3 (windows lit) */}
            {index === 2 && activeStage === 2 && !reducedMotion && (
              <motion.div
                className="absolute inset-0 rounded-full bg-[#F4F1EC]/20 blur-2xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <Image
              src={src}
              alt=""
              fill
              className="object-contain"
              priority={index === 0}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Progress indicator dots
function ProgressIndicator({
  activeStage,
  reducedMotion,
}: {
  activeStage: number;
  reducedMotion: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {[0, 1, 2].map((stage) => (
        <div
          key={stage}
          className={`rounded-full ${
            reducedMotion ? "" : "transition-all duration-300"
          } ${
            stage === activeStage
              ? "w-6 h-2 bg-[#2B3A44]"
              : "w-2 h-2 bg-[#2B3A44]/30"
          }`}
        />
      ))}
    </div>
  );
}

// Service card component
interface ServiceCardProps {
  service: (typeof services)[0];
  isActive: boolean;
  onActivate: () => void;
  reducedMotion: boolean;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

function ServiceCard({
  service,
  isActive,
  onActivate,
  reducedMotion,
  cardRef,
}: ServiceCardProps) {
  return (
    <div
      ref={cardRef}
      className={`relative p-6 md:p-8 bg-[#F4F1EC] rounded-xl flex flex-col ${
        reducedMotion ? "" : "transition-all duration-300"
      } ${
        isActive
          ? "border-2 border-[#2B3A44] shadow-lg shadow-[#2B3A44]/10 md:scale-[1.02]"
          : "border border-[#2B3A44]/20 md:opacity-70 md:hover:opacity-100"
      }`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      tabIndex={0}
    >
      {/* Active indicator for mobile */}
      {isActive && (
        <div
          className={`absolute -left-1 top-6 bottom-6 w-1 bg-[#2B3A44] rounded-full md:hidden ${
            reducedMotion ? "" : "transition-opacity duration-300"
          }`}
        />
      )}

      <h3 className="text-xl md:text-2xl font-semibold text-[#1A1F24] mb-2">
        {service.title}
      </h3>
      <p className="text-sm font-medium text-[#2B3A44] mb-3">
        {service.subhead}
      </p>
      <p
        className={`text-sm md:text-base leading-relaxed flex-1 ${
          reducedMotion ? "" : "transition-colors duration-300"
        } ${isActive ? "text-[#5A6570]" : "text-[#5A6570]/80"}`}
      >
        {service.description}
      </p>
      <Link
        href={service.href}
        className={`mt-4 inline-block px-5 py-2.5 text-sm font-medium rounded-full ${
          reducedMotion ? "" : "transition-all duration-300"
        } ${
          isActive
            ? "bg-[#2B3A44] text-[#F4F1EC] hover:bg-[#1A1F24]"
            : "bg-[#2B3A44]/80 text-[#F4F1EC] hover:bg-[#2B3A44]"
        }`}
      >
        {service.cta}
      </Link>
    </div>
  );
}

// Main ServicesSection component
export function ServicesSection() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;

  const [activeStage, setActiveStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Preload images
  useImagePreloader(stageImages);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile: IntersectionObserver for scroll-driven activation
  useEffect(() => {
    if (!isMobile) return;

    const observers: IntersectionObserver[] = [];

    cardRefs.forEach((ref, index) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Card is active when it's ~40% visible in viewport
            if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
              setActiveStage(index);
            }
          });
        },
        {
          threshold: [0.4, 0.5, 0.6],
          rootMargin: "-20% 0px -30% 0px", // Trigger when card is in middle portion of viewport
        }
      );

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [isMobile]);

  // Desktop: default to first card
  useEffect(() => {
    if (!isMobile) {
      setActiveStage(0);
    }
  }, [isMobile]);

  const handleActivate = useCallback((stage: number) => {
    setActiveStage(stage);
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#F4F1EC]">
      <Container>
        {/* Desktop layout: illustration on left, cards on right */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-12 lg:items-start">
          {/* Sticky illustration area for desktop */}
          <div className="lg:sticky lg:top-24">
            <IllustrationDisplay
              activeStage={activeStage}
              reducedMotion={reducedMotion}
            />
            <ProgressIndicator
              activeStage={activeStage}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Cards grid for desktop */}
          <div className="flex flex-col gap-4">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                isActive={activeStage === index}
                onActivate={() => handleActivate(index)}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet layout: sticky illustration + scrolling cards */}
        <div className="lg:hidden">
          {/* Sticky illustration container */}
          <div className="sticky top-20 z-10 bg-[#F4F1EC] pt-4 pb-6 -mx-6 px-6">
            <IllustrationDisplay
              activeStage={activeStage}
              reducedMotion={reducedMotion}
            />
            <ProgressIndicator
              activeStage={activeStage}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Cards stack */}
          <div className="flex flex-col gap-6 mt-4">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                isActive={activeStage === index}
                onActivate={() => handleActivate(index)}
                reducedMotion={reducedMotion}
                cardRef={cardRefs[index]}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
