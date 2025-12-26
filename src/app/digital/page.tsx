"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Container } from "@/components/Container";
import { FoodTruckTimeline } from "@/components/FoodTruckTimeline";
import { CupcakeShowcaseSection } from "@/components/digital/CupcakeShowcaseSection";
import { WhyBlock } from "@/components/WhyBlock";

// =============================================================================
// SECTION 1: HERO
// Bold, editorial, confident. The text is the star.
// =============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-[#F4F1EC] overflow-hidden">
      {/* Floating background icons - editorial polish */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Top left icon - laptop */}
        <motion.img
          src="/laptop-website.png"
          alt=""
          className="absolute w-52 md:w-[345px] lg:w-[460px] mobile-corner-1 md:opacity-[0.65]"
          style={{ left: "2%", top: "-10%" }}
          animate={{
            x: [0, 8, 0, -6, 0],
            y: [0, -8, 0, 6, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Left icon - business (below laptop, staggered left) */}
        <motion.img
          src="/business.png"
          alt=""
          className="absolute w-[229px] md:w-[390px] lg:w-[540px] mobile-corner-2 md:opacity-[0.65]"
          style={{ left: "-10%", top: "12%" }}
          animate={{
            x: [0, 10, 0, -12, 0],
            y: [0, -6, 0, 10, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Top right icon - calendar (staggered higher) */}
        <motion.img
          src="/calendar.png"
          alt=""
          className="absolute w-52 md:w-[370px] lg:w-[490px] mobile-corner-3 md:opacity-[0.65]"
          style={{ right: "0%", top: "-18%" }}
          animate={{
            x: [0, -14, 0, 10, 0],
            y: [0, 10, 0, -8, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Bottom right icon - message bubble (staggered inward) */}
        <motion.img
          src="/message-bubble.png"
          alt=""
          className="absolute w-[166px] md:w-[345px] lg:w-[440px] mobile-corner-4 md:opacity-[0.65]"
          style={{ right: "3%", bottom: "-10%" }}
          animate={{
            x: [0, 6, 0, -10, 0],
            y: [0, -12, 0, 8, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </div>

      <Container>
        <div className="relative z-20 max-w-[1000px] mx-auto text-center px-4 -mt-16 md:-mt-8 lg:mt-0">
          {/* H1 - Serif */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[28px] md:text-[44px] lg:text-[56px] font-normal text-[#1A1F24] leading-[1.15] tracking-[-0.01em] mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-libre-baskerville)", textWrap: "balance" }}
          >
            We build websites and apps for small businesses that help customers choose you.
          </motion.h1>

          {/* Anchor - Sans */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-sm md:text-lg text-[#5A6570]"
          >
            Not cookie-cutter. Because your business deserves to stand out.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 2: VALUE PROPOSITION
// Editorial conviction section with subtle texture and micro-motion
// Proves "not templated" via restrained animation, not gimmicks
// =============================================================================

// Hand-drawn underline SVG - draws left to right once
function DrawUnderline({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.svg
      className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3"
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M0 6c30-2 60 2 90 0s60 2 90 1c20-0.5 18 1 20 0"
        stroke="#2B3A44"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
      />
    </motion.svg>
  );
}

function ValuePropositionSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const underlineRef = useRef(null);
  const underlineInView = useInView(underlineRef, { once: true, margin: "-30%" });

  // Scroll-based reveal for background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Map scroll progress to Y translation (starts off-screen, slides up)
  const bgY = useTransform(scrollYProgress, [0, 0.5], ["100%", "0%"]);
  // Start 40% darker (0.77) and transition to final opacity (0.37)
  const bgOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0.77, 0.37]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-36 bg-[#F4F1EC] overflow-hidden"
    >
      {/* Background texture image - anchored to bottom, scroll-based reveal */}
      <motion.div
        className="absolute inset-x-0 bottom-0 pointer-events-none section-2-bg"
        style={{
          backgroundImage: `url("/section-2-background.png")`,
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          height: "100%",
          y: bgY,
          opacity: bgOpacity,
        }}
      />

      {/* Light grey overlay */}
      <div
        className="absolute inset-0 pointer-events-none bg-[#E8E5E0]/70"
      />

      {/* Light slate blue sky overlay - gradient from top, meets the background image */}
      <div
        className="absolute inset-x-0 top-0 h-[60%] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(200, 215, 225, 0.35) 0%, rgba(200, 215, 225, 0.15) 60%, transparent 100%)",
        }}
      />

      {/* Floating clouds - subtle continuous drift like hero images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1] section-2-clouds">
        {/* Cloud 1 - top left, large */}
        <motion.img
          src="/cloud.png"
          alt=""
          className="absolute w-28 md:w-44 lg:w-56"
          style={{ left: "3%", top: "5%" }}
          initial={{ opacity: 0 }}
          animate={isInView ? {
            opacity: 0.65,
            x: [0, 15, 0, -12, 0],
            y: [0, -10, 0, 8, 0],
          } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1, delay: 0.3 },
            x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        {/* Cloud 2 - top center, medium */}
        <motion.img
          src="/cloud.png"
          alt=""
          className="absolute w-20 md:w-32 lg:w-40"
          style={{ left: "42%", top: "8%" }}
          initial={{ opacity: 0 }}
          animate={isInView ? {
            opacity: 0.6,
            x: [0, -10, 0, 12, 0],
            y: [0, 8, 0, -6, 0],
          } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1, delay: 0.5 },
            x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 16, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        {/* Cloud 3 - top right, small */}
        <motion.img
          src="/cloud.png"
          alt=""
          className="absolute w-16 md:w-24 lg:w-32"
          style={{ right: "12%", top: "10%" }}
          initial={{ opacity: 0 }}
          animate={isInView ? {
            opacity: 0.55,
            x: [0, -18, 0, 14, 0],
            y: [0, 8, 0, -10, 0],
          } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1, delay: 0.4 },
            x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 19, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        {/* Cloud 4 - left side mid, medium-large */}
        <motion.img
          src="/cloud.png"
          alt=""
          className="absolute w-24 md:w-36 lg:w-48"
          style={{ left: "-5%", top: "25%" }}
          initial={{ opacity: 0 }}
          animate={isInView ? {
            opacity: 0.6,
            x: [0, 20, 0, -15, 0],
            y: [0, -10, 0, 12, 0],
          } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1, delay: 0.6 },
            x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 17, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        {/* Cloud 5 - right side mid, small */}
        <motion.img
          src="/cloud.png"
          alt=""
          className="absolute w-14 md:w-20 lg:w-28"
          style={{ right: "5%", top: "22%" }}
          initial={{ opacity: 0 }}
          animate={isInView ? {
            opacity: 0.5,
            x: [0, -14, 0, 16, 0],
            y: [0, 10, 0, -12, 0],
          } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1, delay: 0.7 },
            x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 21, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      {/* Hairline framing rules */}
      <div className="absolute top-12 left-8 md:left-16 w-16 md:w-24 h-px bg-[#1A1F24] opacity-[0.1]" />
      <div className="absolute bottom-12 right-8 md:right-16 w-16 md:w-24 h-px bg-[#1A1F24] opacity-[0.1]" />

      <Container>
        <motion.div
          className="relative max-w-[820px] mx-auto text-center px-4"
          initial={{ opacity: 0.85, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.85, y: 10 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1] as const,
          }}
        >
          {/* Headline with letter-spacing animation */}
          <motion.h2
            className="text-[24px] md:text-[36px] lg:text-[44px] font-normal text-[#1A1F24] leading-[1.22] mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
            initial={{ letterSpacing: "0.02em" }}
            animate={isInView ? { letterSpacing: "-0.01em" } : { letterSpacing: "0.02em" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            Most small businesses don&apos;t get custom websites. They get{" "}
            <motion.span
              className="relative"
              initial={{ opacity: 0.85 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0.85 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="italic">templates</span>
            </motion.span>
            .
            <br />
            <span ref={underlineRef} className="relative inline-block whitespace-nowrap mt-4 md:mt-6">
              We don&apos;t do that.
              <DrawUnderline isVisible={underlineInView} />
            </span>
          </motion.h2>

          {/* Body copy */}
          <motion.p
            className="text-[17px] md:text-[22px] lg:text-[26px] font-normal text-[#1A1F24]/85 leading-[1.45]"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
            initial={{ opacity: 0.8, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 6 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            We build websites and apps from the ground up — so your online presence feels intentional, confident, and unmistakably yours.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 3: TALK VS WALK (Intro before demos)
// Static, calm pause before the interactive demos
// =============================================================================

function TalkVsWalkSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [cursorLine, setCursorLine] = useState(1);
  const [showSubtext, setShowSubtext] = useState(false);

  const fullLine1 = "Everyone explains.";
  const fullLine2 = "Very few execute.";

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    let j = 0;

    // Type line 1
    const typeInterval1 = setInterval(() => {
      if (i < fullLine1.length) {
        setLine1(fullLine1.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval1);
        // Dramatic pause before line 2
        setTimeout(() => {
          setCursorLine(2);
          // Type line 2 slower
          const typeInterval2 = setInterval(() => {
            if (j < fullLine2.length) {
              setLine2(fullLine2.slice(0, j + 1));
              j++;
            } else {
              clearInterval(typeInterval2);
              // Hide cursor and show subtext
              setTimeout(() => {
                setShowCursor(false);
                setShowSubtext(true);
              }, 400);
            }
          }, 80); // Slower typing for line 2
        }, 800); // Pause between lines
      }
    }, 50); // Fast typing for line 1

    return () => clearInterval(typeInterval1);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#2B3A44]">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline with typewriter effect */}
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-normal text-[#F4F1EC] leading-tight mb-6 min-h-[140px] md:min-h-[160px]" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
            <span>
              {line1}
              {showCursor && cursorLine === 1 && (
                <span className="animate-pulse">|</span>
              )}
            </span>
            {line2 && (
              <>
                <br />
                <span className="text-[#F4F1EC]/70">
                  {line2}
                  {showCursor && cursorLine === 2 && (
                    <span className="animate-pulse">|</span>
                  )}
                </span>
              </>
            )}
          </h2>

          {/* Subhead - fades in after typing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={showSubtext ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg md:text-xl text-[#F4F1EC]/80 mb-4">
              So instead of telling you what we do, we&apos;ll show you what your business can have.
            </p>

            <p className="text-sm text-[#F4F1EC]/50">
              Built around how real businesses actually work — not templates or assumptions.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// Demo panels container (follows TalkVsWalk intro)
function ShowDontTellSection() {
  return (
    <section className="bg-[#F4F1EC]">
      {/* Demo panels */}
      <div className="py-24 lg:py-32">
        <div className="space-y-20 lg:space-y-28">
          {/* DEMO A: Food Truck Timeline (CENTERPIECE) */}
          <div>
            <Container>
              <div className="text-center mb-12">
                <h3 className="text-[32px] md:text-[44px] font-normal text-[#1A1F24] leading-tight mb-4" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
                  <span className="block">You move.</span>
                  <span className="block text-[#1A1F24]/70">Your site should too.</span>
                </h3>
                <p className="text-lg text-[#5A6570]">
                  Real schedules change week to week. We build pages that keep up.
                </p>
              </div>
            </Container>

            {/* Food truck timeline demo */}
            <Container>
              <FoodTruckTimeline />

              {/* Why block - owner-to-owner explanation */}
              <WhyBlock
                heading="Why we didn't just list the dates"
                lines={[
                  "Anyone can post a list.",
                  "But when something is fun to interact with, people remember it —",
                  "and they come back when they're ready to buy.",
                  "That's what this does.",
                ]}
              />
            </Container>
          </div>

        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 4: AI SCHEDULING DEMO
// "Most websites answer questions. The better ones book the appointment."
// =============================================================================

// --- EDITABLE COPY ---
const AI_DEMO_COPY = {
  headline: "Websites inform.",
  headlineBrass: "Ours convert.",
  subhead: "This is what happens when your site is built to guide customers — not just inform them.",
  chatLabel: "Live Chat",
  confirmedLabel: "Appointment Confirmed",
  // Appointment details
  appointment: {
    name: "Destiny",
    service: "Haircut",
    day: "Wednesday",
    dayShort: "WED",
    dayNumber: "12",
    time: "12:00 PM",
    stylist: "Emma",
  },
  // Why block
  why: {
    heading: "Why we built it this way",
    lines: [
      "Missed messages = missed money.",
      "This flow checks real availability and books the slot on the spot.",
      "You wake up to confirmed appointments — not DMs to chase.",
    ],
  },
};

interface ChatMessage {
  role: "customer" | "assistant";
  text: string;
}

// Single conversation that loops
const chatScript: ChatMessage[] = [
  { role: "customer", text: "Hey — can I book a haircut this Tuesday around 3?" },
  { role: "assistant", text: "Tuesday's full. I can do Wednesday at 12:00 PM with Emma or Thursday at 4:30 PM with Kelly. Want one?" },
  { role: "customer", text: "I'll take Wednesday at noon with Emma." },
  { role: "assistant", text: "Got it. What name should I put the appointment under?" },
  { role: "customer", text: "Destiny" },
  { role: "assistant", text: "Done. You're booked for Wed 12:00 PM with Emma. See you then!" },
];

// Calendar week row for booked view
const weekDays = [
  { day: "Mon", date: 10 },
  { day: "Tue", date: 11 },
  { day: "Wed", date: 12 },
  { day: "Thu", date: 13 },
  { day: "Fri", date: 14 },
];

function AISchedulingDemo() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [messageStep, setMessageStep] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBooked, setShowBooked] = useState(false);
  const [loopKey, setLoopKey] = useState(0);

  // Single looping animation sequence with deliberate pause before transition
  useEffect(() => {
    if (!isInView) return;

    // Reset for new loop
    setMessageStep(0);
    setShowCalendar(false);
    setShowBooked(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Message 1: Customer asks
    timers.push(setTimeout(() => setMessageStep(1), 800));

    // Message 2: Assistant responds with options
    timers.push(setTimeout(() => setMessageStep(2), 2400));

    // Message 3: Customer picks Wednesday
    timers.push(setTimeout(() => setMessageStep(3), 4500));

    // Message 4: Assistant asks for name
    timers.push(setTimeout(() => setMessageStep(4), 6000));

    // Message 5: Customer says "Destiny"
    timers.push(setTimeout(() => setMessageStep(5), 7500));

    // Message 6: Confirmation - "Done. You're booked..."
    timers.push(setTimeout(() => setMessageStep(6), 9000));

    // PAUSE: Let it breathe ~1100ms after final message, then show calendar
    timers.push(setTimeout(() => {
      setShowCalendar(true);
    }, 10100));

    // After 2.5 seconds on calendar, show the celebration checkmark
    timers.push(setTimeout(() => {
      setShowBooked(true);
    }, 12600));

    // Hold celebration for 2.5 seconds, then loop
    timers.push(setTimeout(() => {
      setLoopKey(k => k + 1);
    }, 15100));

    return () => timers.forEach(clearTimeout);
  }, [isInView, loopKey]);

  const { appointment } = AI_DEMO_COPY;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#F4F1EC]">
      <Container>
        {/* Section header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-normal text-[#1A1F24] leading-tight mb-6" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
            <span className="block">{AI_DEMO_COPY.headline}</span>
            <span className="block text-[#2B3A44]">{AI_DEMO_COPY.headlineBrass}</span>
          </h2>
          <p className="text-lg text-[#5A6570] max-w-2xl mx-auto">
            {AI_DEMO_COPY.subhead}
          </p>
        </motion.div>

        {/* Glass super-card - bone color */}
        <motion.div
          className="relative rounded-[28px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(244, 241, 236, 0.95) 0%, rgba(232, 229, 224, 0.98) 100%)",
            border: "1px solid rgba(43, 58, 68, 0.1)",
            boxShadow: "0 40px 80px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative h-[580px] md:h-[480px]">
            {/* CHAT VIEW */}
            <motion.div
              className="p-6 md:p-8"
              initial={false}
              animate={{ opacity: showCalendar ? 0 : 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ display: showCalendar ? "none" : "block" }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#2B3A44]" />
                <span className="text-xs text-[#5A6570]/60 uppercase tracking-wider">{AI_DEMO_COPY.chatLabel}</span>
              </div>

              <div className="space-y-3 max-w-lg mx-auto">
                {chatScript.map((msg, i) => {
                  const isVisible = messageStep >= i + 1;
                  return (
                    <motion.div
                      key={`${loopKey}-${i}`}
                      className={`flex ${msg.role === "customer" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === "customer"
                            ? "bg-[#2B3A44] text-[#F4F1EC]"
                            : "bg-white/90 text-[#1A1F24] border border-[#2B3A44]/10"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* APPOINTMENT CONFIRMED VIEW */}
            <motion.div
              className="absolute inset-0 p-6 md:p-8 flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: showCalendar && !showBooked ? 1 : 0,
                scale: showCalendar && !showBooked ? 1 : 0.95
              }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              style={{ pointerEvents: showCalendar && !showBooked ? "auto" : "none" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#2B3A44]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-[#5A6570]/60 uppercase tracking-wider">{AI_DEMO_COPY.confirmedLabel}</span>
              </div>

              {/* Calendar-style appointment card */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div
                  className="w-full max-w-sm"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={showCalendar ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                >
                  {/* Week row with selected date */}
                  <div className="flex justify-center gap-2 mb-4">
                    {weekDays.map((d) => {
                      const isSelected = d.day === "Wed";
                      return (
                        <div
                          key={d.day}
                          className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
                            isSelected
                              ? "bg-[#2B3A44] text-[#F4F1EC]"
                              : "bg-white/60 text-[#5A6570]/60"
                          }`}
                        >
                          <span className={`text-[10px] uppercase tracking-wider font-medium ${isSelected ? "text-[#F4F1EC]/70" : ""}`}>
                            {d.day}
                          </span>
                          <span className={`text-lg font-bold ${isSelected ? "" : "text-[#1A1F24]/40"}`}>
                            {d.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Appointment card */}
                  <motion.div
                    className="rounded-2xl p-5 md:p-6"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(43, 58, 68, 0.15)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
                    }}
                    initial={{ y: 15, opacity: 0 }}
                    animate={showCalendar ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
                  >
                    {/* Time badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="px-2.5 py-1 rounded-md bg-[#2B3A44]/20 text-[#2B3A44] text-xs font-semibold">
                        {appointment.time}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-[#5A6570]/30" />
                      <span className="text-xs text-[#5A6570]/60">{appointment.day}</span>
                    </div>

                    {/* Service & Name */}
                    <h3 className="text-xl md:text-2xl font-bold text-[#1A1F24] mb-1">
                      {appointment.service}
                    </h3>
                    <p className="text-base text-[#5A6570]/80 mb-3">
                      {appointment.name}
                    </p>

                    {/* Stylist */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#2B3A44]/10">
                      <div className="w-7 h-7 rounded-full bg-[#2B3A44]/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-[#2B3A44]">
                          {appointment.stylist.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-[#5A6570]/70">with {appointment.stylist}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* BOOKED CELEBRATION VIEW - Checkmark pop */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{
                opacity: showBooked ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ pointerEvents: showBooked ? "auto" : "none" }}
            >
              {/* Slate blue circle with checkmark */}
              <motion.div
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#2B3A44] flex items-center justify-center mb-6"
                initial={{ scale: 0, rotate: -20 }}
                animate={showBooked ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  mass: 0.8,
                }}
              >
                {/* Inner glow ring */}
                <div className="absolute inset-2 rounded-full border border-[#F4F1EC]/20" />

                {/* Checkmark that draws in */}
                <motion.svg
                  className="w-14 h-14 md:w-18 md:h-18 text-[#F4F1EC]"
                  viewBox="0 0 24 24"
                  fill="none"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={showBooked ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={showBooked ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                  />
                </motion.svg>

                {/* Burst particles */}
                {showBooked && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-[#2B3A44]/30"
                        style={{
                          top: "50%",
                          left: "50%",
                        }}
                        initial={{ x: "-50%", y: "-50%", scale: 0 }}
                        animate={{
                          x: `calc(-50% + ${Math.cos((i * Math.PI * 2) / 8) * 80}px)`,
                          y: `calc(-50% + ${Math.sin((i * Math.PI * 2) / 8) * 80}px)`,
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          delay: 0.1,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>

              {/* Text */}
              <motion.h3
                className="text-2xl md:text-3xl font-bold text-[#1A1F24] mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={showBooked ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.25, duration: 0.35, ease: "easeOut" }}
              >
                Appointment Booked
              </motion.h3>
              <motion.p
                className="text-base text-[#5A6570]"
                initial={{ opacity: 0, y: 8 }}
                animate={showBooked ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" }}
              >
                No follow-up needed.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Why block */}
        <WhyBlock
          heading={AI_DEMO_COPY.why.heading}
          lines={AI_DEMO_COPY.why.lines}
        />
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 5: OUTCOMES
// "This is how businesses start feeling established."
// =============================================================================

function OutcomesSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Slide in from left based on scroll position
  const x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["-100%", "0%", "0%", "-100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const bullets = [
    "Customers understand you faster",
    "Your brand feels intentional",
    "Your business looks confident — even before first contact",
  ];

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-[#F4F1EC] overflow-hidden">
      <motion.div
        className="bg-[#2B3A44] py-16 lg:py-24 px-6 md:px-12 lg:px-20"
        style={{ x, opacity }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-[32px] md:text-[44px] font-normal text-[#F4F1EC] leading-tight mb-10"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
          >
            This is how businesses start feeling established.
          </h2>

          <ul className="space-y-5 mb-10">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-4 text-lg text-[#F4F1EC]/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F4F1EC] mt-2.5 shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>

          <p className="text-sm text-[#F4F1EC]/50">
            You don&apos;t need to know how it works. You just need it to work.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// =============================================================================
// SECTION 5: SCOPE
// "Websites. Apps. Custom tools."
// =============================================================================

function ScopeSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Slide in from right based on scroll position
  const x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["100%", "0%", "0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F4F1EC] overflow-hidden"
    >
      <motion.div
        className="py-20 lg:py-28 px-6 md:px-12 lg:px-20"
        style={{ x, opacity }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-[32px] md:text-[44px] font-normal text-[#1A1F24] leading-tight mb-8"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
          >
            Websites. Apps. Custom tools.
          </h2>

          <div className="space-y-3 text-lg text-[#5A6570] mb-8">
            <p>Sometimes you need a simple site.</p>
            <p>Sometimes you need something more.</p>
            <p className="text-[#1A1F24]">
              We design and build what fits — not what&apos;s easiest.
            </p>
          </div>

          <p className="text-sm text-[#2B3A44]">
            Built for real businesses. Not big budgets.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// =============================================================================
// SECTION 6: FINAL CTA
// "If you want your business to look like it belongs — we should talk."
// =============================================================================

function FinalCTASection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Slide up from bottom based on scroll position
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["100%", "0%", "0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="bg-[#F4F1EC] overflow-hidden">
      <motion.div
        className="bg-[#2B3A44] py-28 lg:py-40"
        style={{ y, opacity }}
      >
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-normal text-[#F4F1EC] leading-tight mb-10" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
              If you want your business to look like it belongs — we should talk.
            </h2>

            {/* Button */}
            <div className="flex justify-center mb-10">
              <a
                href="mailto:hello@shortlistpass.com?subject=Let's talk"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-[#F4F1EC] text-[#2B3A44] rounded-full hover:bg-white transition-colors"
              >
                Start a conversation
              </a>
            </div>

            {/* Trust line */}
            <p className="text-sm text-[#F4F1EC]/50 max-w-lg mx-auto">
              Shortlist Pass builds digital experiences that make small businesses
              feel established — without the big-agency baggage.
            </p>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-[#F4F1EC]">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#5A6570]/60">
          <span>&copy; {new Date().getFullYear()} Shortlist Pass</span>
          <span>hello@shortlistpass.com</span>
        </div>
      </Container>
    </footer>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function DigitalPage() {
  return (
    <main className="pt-16 overflow-x-clip">
      <HeroSection />
      <ValuePropositionSection />
      <TalkVsWalkSection />
      <ShowDontTellSection />
      <CupcakeShowcaseSection />
      <AISchedulingDemo />
      <OutcomesSection />
      <ScopeSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
