"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";

// State definitions
const states = [
  {
    id: "intro",
    label: "Start",
    headline: "Watch custom happen.",
    sub: "Scroll. One object. Clean transformation.",
    cake: "vanilla",
    icing: null,
  },
  {
    id: "vanilla",
    label: "Base",
    headline: "Vanilla base",
    sub: "Simple. Familiar. Works anywhere.",
    cake: "vanilla",
    icing: null,
  },
  {
    id: "chocolate",
    label: "Base",
    headline: "Chocolate base",
    sub: "Richer. More punch. Still clean.",
    cake: "chocolate",
    icing: null,
  },
  {
    id: "redvelvet",
    label: "Base",
    headline: "Red velvet base",
    sub: "More personality without the chaos.",
    cake: "redvelvet",
    icing: null,
  },
  {
    id: "buttercream",
    label: "Top",
    headline: "Buttercream",
    sub: "Classic finish. Soft confidence.",
    cake: "redvelvet",
    icing: "buttercream",
  },
  {
    id: "caramel",
    label: "Top",
    headline: "Salted caramel",
    sub: "Bold, but still premium.",
    cake: "redvelvet",
    icing: "caramel",
  },
  {
    id: "matcha",
    label: "Top",
    headline: "Matcha",
    sub: "Unexpected. Memorable.",
    cake: "redvelvet",
    icing: "matcha",
  },
  {
    id: "final",
    label: "Finish",
    headline: "This is what custom looks like.",
    sub: "Not a theme. Not a template. Built to fit the business.",
    cake: "redvelvet",
    icing: "matcha",
    extra: "Now imagine this level of intention applied to your schedule, ordering, bookings, or offers.",
  },
];

// Placeholder colors for cake layers (will be swapped for real images)
const cakeColors: Record<string, string> = {
  vanilla: "linear-gradient(180deg, #F5E6D3 0%, #E8D5BE 100%)",
  chocolate: "linear-gradient(180deg, #5D4037 0%, #4E342E 100%)",
  redvelvet: "linear-gradient(180deg, #8B2635 0%, #6D1F2A 100%)",
};

// Placeholder colors for icing layers
const icingColors: Record<string, string> = {
  buttercream: "linear-gradient(180deg, #FFF8E7 0%, #F5E6D3 100%)",
  caramel: "linear-gradient(180deg, #D4A574 0%, #B8956E 100%)",
  matcha: "linear-gradient(180deg, #8FBC8F 0%, #6B8E6B 100%)",
};

// Cupcake visual component
function CupcakeVisual({ cake, icing, isFinal }: { cake: string; icing: string | null; isFinal: boolean }) {
  return (
    <div className="relative w-[200px] h-[260px] md:w-[280px] md:h-[360px] mx-auto">
      {/* Icing layer (top) */}
      <AnimatePresence mode="wait">
        {icing && (
          <motion.div
            key={icing}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[100px] md:w-[200px] md:h-[140px] rounded-t-full"
            style={{ background: icingColors[icing] }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Cake layer (bottom) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cake}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[140px] md:w-[160px] md:h-[200px] rounded-b-3xl rounded-t-lg"
          style={{ background: cakeColors[cake] }}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </AnimatePresence>

      {/* Wrapper/liner */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[130px] h-[80px] md:w-[180px] md:h-[110px]">
        <div
          className="w-full h-full rounded-b-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(176, 141, 87, 0.3) 0%, rgba(176, 141, 87, 0.5) 100%)",
            borderLeft: "2px solid rgba(176, 141, 87, 0.4)",
            borderRight: "2px solid rgba(176, 141, 87, 0.4)",
            borderBottom: "2px solid rgba(176, 141, 87, 0.4)",
          }}
        />
      </div>

      {/* Final state glow */}
      {isFinal && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(176, 141, 87, 0.15) 0%, transparent 70%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0.6], scale: [0.8, 1.1, 1] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

export function CupcakeShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualMode, setManualMode] = useState(false);

  // Scroll progress within section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to active state index
  useEffect(() => {
    if (prefersReducedMotion || manualMode) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const newIndex = Math.min(
        Math.floor(progress * states.length),
        states.length - 1
      );
      setActiveIndex(newIndex);
    });

    return unsubscribe;
  }, [scrollYProgress, prefersReducedMotion, manualMode]);

  // Enable manual mode for reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      setManualMode(true);
    }
  }, [prefersReducedMotion]);

  const currentState = states[activeIndex];
  const isFinal = activeIndex === states.length - 1;

  const handleNext = () => {
    if (activeIndex < states.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0B1220]"
      style={{ height: manualMode ? "auto" : "400vh" }}
    >
      {/* Sticky container */}
      <div className={manualMode ? "py-24 lg:py-32" : "sticky top-0 min-h-screen flex items-center py-12 lg:py-0"}>
        <div className="w-full max-w-[1200px] mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <p className="text-[10px] text-[#B08D57] uppercase tracking-[0.25em] mb-4 font-medium">
              Memorable Example
            </p>
            <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-bold text-[#F4F6FA] leading-tight mb-4">
              Custom isn&apos;t a layout. <span className="text-[#B08D57]">It&apos;s motion.</span>
            </h2>
            <p className="text-base md:text-lg text-[#A9B4C4] max-w-2xl mx-auto">
              Templates give you a page. We build experiences that move with your business — and make people remember you.
            </p>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Stepper (desktop) / Hidden on mobile */}
            <div className="hidden lg:block">
              <p className="text-sm text-[#A9B4C4] mb-8">
                Instead of telling you &quot;we do custom,&quot; we show it. On mobile, one clean object transforming beats a dozen widgets fighting for attention.
              </p>

              {/* Stepper */}
              <div className="space-y-3">
                {states.map((state, index) => (
                  <button
                    key={state.id}
                    onClick={() => { setManualMode(true); setActiveIndex(index); }}
                    className={`flex items-center gap-3 w-full text-left transition-all duration-300 ${
                      index === activeIndex
                        ? "text-[#F4F6FA]"
                        : "text-[#A9B4C4]/50 hover:text-[#A9B4C4]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "bg-[#B08D57] scale-125"
                          : index < activeIndex
                          ? "bg-[#B08D57]/50"
                          : "bg-white/20"
                      }`}
                    />
                    <span className="text-xs uppercase tracking-wider font-medium">
                      {state.label}
                    </span>
                    {index === activeIndex && (
                      <span className="text-sm text-[#A9B4C4]">— {state.headline}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Payoff line */}
              <motion.p
                className="mt-10 text-sm text-[#B08D57] font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: isFinal ? 1 : 0.3 }}
                transition={{ duration: 0.4 }}
              >
                This is the difference between a template… and a build.
              </motion.p>
            </div>

            {/* Right: Cupcake Stage */}
            <div
              className="relative rounded-[28px] p-8 md:p-12"
              style={{
                background: "linear-gradient(180deg, rgba(15, 23, 36, 0.9) 0%, rgba(11, 18, 32, 0.95) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                boxShadow: isFinal
                  ? "0 40px 80px rgba(0, 0, 0, 0.4), 0 0 60px rgba(176, 141, 87, 0.1)"
                  : "0 40px 80px rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Mobile progress dots */}
              <div className="flex lg:hidden items-center justify-center gap-1.5 mb-6">
                {states.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setManualMode(true); setActiveIndex(index); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-6 bg-[#B08D57]"
                        : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Cupcake */}
              <CupcakeVisual
                cake={currentState.cake}
                icing={currentState.icing}
                isFinal={isFinal}
              />

              {/* State card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentState.id}
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-[10px] text-[#B08D57] uppercase tracking-[0.2em] mb-2 lg:hidden">
                    {currentState.label}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-[#F4F6FA] mb-2">
                    {currentState.headline}
                  </h3>
                  <p className="text-sm text-[#A9B4C4]">
                    {currentState.sub}
                  </p>
                  {currentState.extra && (
                    <p className="mt-4 text-xs text-[#B08D57]/80 italic">
                      {currentState.extra}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Manual navigation (reduced motion or tap mode) */}
              {manualMode && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className="px-4 py-2 text-sm text-[#A9B4C4] border border-white/10 rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={activeIndex === states.length - 1}
                    className="px-4 py-2 text-sm bg-[#B08D57] text-[#0B1220] font-medium rounded-lg disabled:opacity-30 hover:bg-[#c9a46a] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile payoff */}
          <motion.p
            className="lg:hidden mt-8 text-center text-sm text-[#B08D57] font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFinal ? 1 : 0.3 }}
            transition={{ duration: 0.4 }}
          >
            This is the difference between a template… and a build.
          </motion.p>

          {/* Reframe line */}
          <p className="mt-6 text-center text-sm text-[#A9B4C4]/60">
            Same idea for your business: schedules, bookings, menus, drops, announcements — whatever moves.
          </p>

          {/* Scroll hint (only when not in manual mode) */}
          {!manualMode && activeIndex < states.length - 1 && (
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs text-[#A9B4C4]/40">Scroll to explore</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
