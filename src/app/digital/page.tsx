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
      <div className="absolute inset-0 pointer-events-none">
        {/* Left icon - business */}
        <motion.img
          src="/business.png"
          alt=""
          className="absolute w-24 md:w-36 lg:w-44 opacity-[0.025] md:opacity-[0.045]"
          style={{ left: "8%", top: "25%" }}
          animate={{
            x: [0, 12, 0, -8, 0],
            y: [0, -10, 0, 8, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Right icon - calendar */}
        <motion.img
          src="/calendar.png"
          alt=""
          className="absolute w-20 md:w-32 lg:w-40 opacity-[0.025] md:opacity-[0.05] hidden md:block"
          style={{ right: "10%", top: "30%" }}
          animate={{
            x: [0, -10, 0, 14, 0],
            y: [0, 8, 0, -12, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Bottom icon - message bubble */}
        <motion.img
          src="/message-bubble.png"
          alt=""
          className="absolute w-16 md:w-28 lg:w-36 opacity-[0.025] md:opacity-[0.04] hidden md:block"
          style={{ right: "20%", bottom: "15%" }}
          animate={{
            x: [0, 8, 0, -6, 0],
            y: [0, -8, 0, 10, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <Container>
        <div className="relative z-10 max-w-[1000px] mx-auto text-center px-4 -mt-16 md:-mt-8 lg:mt-0">
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
            className="text-base md:text-lg text-[#5A6570] max-w-[600px] mx-auto"
          >
            Not cookie-cutter. Not like everyone else. Because your business deserves to stand out.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 2: LINE IN THE SAND
// "Templates suck."
// =============================================================================

// Hand-drawn frown face SVG - rolls in from the right
function FrownFace() {
  return (
    <motion.span
      className="inline-block ml-2 md:ml-3"
      style={{ verticalAlign: "middle", display: "inline-block" }}
      initial={{ x: 60, rotate: 540, opacity: 0 }}
      whileInView={{ x: 0, rotate: -6, opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 12,
        mass: 1,
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        {/* Face circle - slightly imperfect */}
        <path
          d="M16 3C8.5 3.2 3.2 8.8 3 16c-.2 7.5 5.8 13.2 13 13.5 7.5.3 13.5-5.5 13.5-13C29.5 9 24 2.8 16 3z"
          stroke="#5A6570"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left eye - dot */}
        <circle cx="11" cy="12" r="1.5" fill="#5A6570" />
        {/* Right eye - dot */}
        <circle cx="21" cy="12" r="1.5" fill="#5A6570" />
        {/* Frown - hand-drawn curve */}
        <path
          d="M10 22c1.5-3 3.5-4.5 6-4.5s4.5 1.5 6 4.5"
          stroke="#5A6570"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.span>
  );
}

// Hand-drawn underline SVG - wavy and imperfect
function HandDrawnUnderline() {
  return (
    <motion.svg
      className="absolute -bottom-2 left-0 w-full h-3"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
    >
      <motion.path
        d="M2 8c20-4 40 2 60-1s40 3 60 0 40-2 60 1 15 2 16 0"
        stroke="#2E8B57"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

function TemplatesSuckSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#F4F1EC] overflow-x-clip">
      <Container>
        <div className="max-w-2xl mx-auto overflow-visible">
          {/* Headline - snaps in with rolling frown face */}
          <motion.h2
            className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-[#1A1F24] leading-tight mb-10 overflow-visible"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            Templates suck.
            <FrownFace />
          </motion.h2>

          {/* Body copy */}
          <motion.div
            className="space-y-4 text-lg text-[#5A6570]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p>They&apos;re built on assumptions.</p>
            <p>
              They guess what your business does, how your customers think, and
              what matters most.
            </p>
            <p>That&apos;s why so many sites and apps look the same.</p>
            <p className="text-[#1A1F24]">You&apos;re unique.</p>

            {/* Final line - bold, one line, hand-drawn underline on "We build for you" */}
            <p className="text-[#1A1F24] text-xl md:text-2xl font-bold pt-2">
              We build around you.{" "}
              <span className="relative inline-block">
                We build for you.
                <HandDrawnUnderline />
              </span>
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 3: TALK VS WALK (Intro before demos)
// Static, calm pause before the interactive demos
// =============================================================================

function TalkVsWalkSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#F4F1EC]">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline - Two lines, static, no animation */}
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[#1A1F24] leading-tight mb-6">
            Everyone explains.
            <br />
            <span className="text-[#2E8B57]">Very few execute.</span>
          </h2>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-[#5A6570] mb-4">
            So instead of telling you what we do, we&apos;ll show you what your business can have.
          </p>

          {/* Optional clarifier */}
          <p className="text-sm text-[#5A6570]/60">
            Built around how real businesses actually work — not templates or assumptions.
          </p>
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
                <h3 className="text-[32px] md:text-[44px] font-bold text-[#1A1F24] leading-tight mb-4">
                  Your business moves. Your website should too.
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
  headline: "Most websites answer questions.",
  headlineBrass: "The better ones book the appointment.",
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
  const [loopKey, setLoopKey] = useState(0);

  // Single looping animation sequence with deliberate pause before transition
  useEffect(() => {
    if (!isInView) return;

    // Reset for new loop
    setMessageStep(0);
    setShowCalendar(false);

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

    // PAUSE: Let it breathe ~1100ms after final message, then transition
    timers.push(setTimeout(() => {
      setShowCalendar(true);
    }, 10100));

    // Hold booked view for 3 seconds, then loop
    timers.push(setTimeout(() => {
      setLoopKey(k => k + 1);
    }, 14100));

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
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[#1A1F24] leading-tight mb-6">
            {AI_DEMO_COPY.headline}
            <br />
            <span className="text-[#2E8B57]">{AI_DEMO_COPY.headlineBrass}</span>
          </h2>
          <p className="text-lg text-[#5A6570] max-w-2xl mx-auto">
            {AI_DEMO_COPY.subhead}
          </p>
        </motion.div>

        {/* Glass super-card */}
        <motion.div
          className="relative rounded-[28px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(15, 23, 36, 0.9) 0%, rgba(11, 18, 32, 0.95) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: "0 40px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
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
                <div className="w-2 h-2 rounded-full bg-[#2E8B57]" />
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
                            ? "bg-[#2E8B57] text-[#F4F1EC]"
                            : "bg-white/5 text-[#1A1F24] border border-white/5"
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
                opacity: showCalendar ? 1 : 0,
                scale: showCalendar ? 1 : 0.95
              }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              style={{ pointerEvents: showCalendar ? "auto" : "none" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#2E8B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                              ? "bg-[#2E8B57] text-[#F4F1EC]"
                              : "bg-white/5 text-[#5A6570]/60"
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
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(176, 141, 87, 0.2)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    }}
                    initial={{ y: 15, opacity: 0 }}
                    animate={showCalendar ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
                  >
                    {/* Time badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="px-2.5 py-1 rounded-md bg-[#2E8B57]/20 text-[#2E8B57] text-xs font-semibold">
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
                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                      <div className="w-7 h-7 rounded-full bg-[#2E8B57]/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-[#2E8B57]">
                          {appointment.stylist.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-[#5A6570]/70">with {appointment.stylist}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
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
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const bullets = [
    "Customers understand you faster",
    "Your brand feels intentional",
    "Your business looks confident — even before first contact",
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#F4F1EC]">
      <Container>
        <div className="max-w-2xl mx-auto">
          <motion.h2
            className="text-[32px] md:text-[44px] font-bold text-[#1A1F24] leading-tight mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            This is how businesses start feeling established.
          </motion.h2>

          <ul className="space-y-5 mb-10">
            {bullets.map((bullet, i) => (
              <motion.li
                key={bullet}
                className="flex items-start gap-4 text-lg text-[#5A6570]"
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] mt-2.5 shrink-0" />
                {bullet}
              </motion.li>
            ))}
          </ul>

          <motion.p
            className="text-sm text-[#5A6570]/60"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            You don&apos;t need to know how it works. You just need it to work.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 5: SCOPE
// "Websites. Apps. Custom tools."
// =============================================================================

function ScopeSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gradient-to-b from-[#F4F1EC] to-[#F4F1EC]"
    >
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-[32px] md:text-[44px] font-bold text-[#1A1F24] leading-tight mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Websites. Apps. Custom tools.
          </motion.h2>

          <motion.div
            className="space-y-3 text-lg text-[#5A6570] mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p>Sometimes you need a simple site.</p>
            <p>Sometimes you need something more.</p>
            <p className="text-[#1A1F24]">
              We design and build what fits — not what&apos;s easiest.
            </p>
          </motion.div>

          <motion.p
            className="text-sm text-[#2E8B57]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Built for real businesses. Not big budgets.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

// =============================================================================
// SECTION 6: FINAL CTA
// "If you want your business to look like it belongs — we should talk."
// =============================================================================

function FinalCTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-28 lg:py-40 bg-[#F4F1EC]">
      <Container>
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[#1A1F24] leading-tight mb-10">
            If you want your business to look like it belongs — we should talk.
          </h2>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="mailto:hello@shortlistpass.com?subject=Let's talk"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-[#2E8B57] text-[#F4F1EC] rounded-full hover:bg-[#236B43] transition-colors"
            >
              Start a conversation
            </a>
            <a
              href="#demos"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-[#5A6570] border border-white/10 rounded-full hover:border-white/20 hover:text-[#1A1F24] transition-colors"
            >
              See what&apos;s possible
            </a>
          </div>

          {/* Trust line */}
          <p className="text-sm text-[#5A6570]/50 max-w-lg mx-auto">
            Shortlist Pass builds digital experiences that make small businesses
            feel established — without the big-agency baggage.
          </p>
        </motion.div>
      </Container>
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
      <TemplatesSuckSection />
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
