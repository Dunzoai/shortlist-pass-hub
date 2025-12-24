"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Container } from "@/components/Container";
import { FoodTruckTimeline } from "@/components/FoodTruckTimeline";

// =============================================================================
// SECTION 1: HERO
// "Make your business look like it belongs."
// Letter-by-letter brass fill on "your", "business", "belongs"
// Then strikethrough on "Templates aren't built for you"
// Then "Yes — this is possible for you" fades in
// =============================================================================

// Helper component for letter-by-letter brass fill animation
// Slow, intentional — like we're saying "YOUR. BUSINESS. BELONGS."
function AnimatedWord({
  word,
  startDelay,
  letterDelay = 0.12,
}: {
  word: string;
  startDelay: number;
  letterDelay?: number;
}) {
  return (
    <span className="inline-block">
      {word.split("").map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ color: "#F4F6FA" }}
          animate={{ color: "#B08D57" }}
          transition={{
            duration: 0.25,
            delay: startDelay + i * letterDelay,
            ease: "easeOut",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Animation timing — SLOW and INTENTIONAL
  // "your" = 4 letters * 0.12 = ~0.5s
  // "business" = 8 letters * 0.12 = ~1s
  // "belongs." = 8 letters * 0.12 = ~1s
  // Then PAUSE to let them read "Templates aren't built for you"
  // Then HARSH red strikethrough
  // Then PAUSE
  // Then "Yes — this is possible for you" fades in

  const yourStart = 0.5;
  const businessStart = 1.3; // after "your" + pause
  const belongsStart = 2.8; // after "business" + pause
  // belongs ends ~3.8s, then pause to read templates line
  const strikethroughStart = 5.2; // let them read it first
  // strikethrough completes ~5.5s, then pause
  const microLineStart = 6.5;

  return (
    <section
      ref={heroRef}
      className="relative min-h-[85vh] flex items-center justify-center py-24 lg:py-32 overflow-hidden"
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0B1220]" />

      {/* Grid texture with parallax */}
      <motion.div
        className="absolute inset-[-10%] opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: "url(/grid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: gridY,
        }}
      />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(176, 141, 87, 0.04) 0%, transparent 50%)",
        }}
      />

      <Container>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* H1 with letter-by-letter brass animation */}
          <motion.h1
            className="text-[40px] md:text-[56px] lg:text-[68px] font-bold text-[#F4F6FA] leading-[1.05] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            Make <AnimatedWord word="your" startDelay={yourStart} />{" "}
            <AnimatedWord word="business" startDelay={businessStart} />
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            look like it <AnimatedWord word="belongs." startDelay={belongsStart} />
          </motion.h1>

          {/* Subhead with strikethrough animation on first line */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl mx-auto mb-6"
          >
            <p className="text-lg md:text-xl text-[#A9B4C4] leading-relaxed">
              {/* Strikethrough line — HARSH red */}
              <span className="relative inline-block">
                <span>Templates aren&apos;t built for you.</span>
                <motion.span
                  className="absolute left-0 top-1/2 h-[3px] bg-[#C94A4A]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 0.25,
                    delay: strikethroughStart,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              </span>
              <br />
              We build websites and apps that make small businesses feel
              established, confident, and taken seriously.
            </p>
          </motion.div>

          {/* Micro-line - fades in after strikethrough */}
          <motion.p
            className="text-sm text-[#B08D57]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: microLineStart }}
          >
            Yes — this is possible for you.
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
          stroke="#A9B4C4"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left eye - dot */}
        <circle cx="11" cy="12" r="1.5" fill="#A9B4C4" />
        {/* Right eye - dot */}
        <circle cx="21" cy="12" r="1.5" fill="#A9B4C4" />
        {/* Frown - hand-drawn curve */}
        <path
          d="M10 22c1.5-3 3.5-4.5 6-4.5s4.5 1.5 6 4.5"
          stroke="#A9B4C4"
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
        stroke="#B08D57"
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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0B1220] overflow-x-clip">
      <Container>
        <div className="max-w-2xl mx-auto overflow-visible">
          {/* Headline - snaps in with rolling frown face */}
          <motion.h2
            className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-[#F4F6FA] leading-tight mb-10 overflow-visible"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            Templates suck.
            <FrownFace />
          </motion.h2>

          {/* Body copy */}
          <motion.div
            className="space-y-4 text-lg text-[#A9B4C4]"
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
            <p className="text-[#F4F6FA]">You&apos;re unique.</p>

            {/* Final line - bold, one line, hand-drawn underline on "We build for you" */}
            <p className="text-[#F4F6FA] text-xl md:text-2xl font-bold pt-2">
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
// SECTION 3: SHOW DON'T TELL
// Demo rail with interactive panels
// =============================================================================

function ShowDontTellSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#0B1220] to-[#0d1627]"
    >
      {/* Brass gradient strip with noise behind header */}
      <div className="relative py-20 lg:py-28">
        {/* Brass gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #8B7355 0%, #B08D57 25%, #D4B87F 50%, #B08D57 75%, #8B7355 100%)",
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Subtle darkening overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

        <Container>
          {/* Section header */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[#0B1220] leading-tight mb-6">
              So instead of explaining it — we&apos;ll show you.
            </h2>
            <p className="text-lg text-[#0B1220]/70 max-w-2xl mx-auto">
              Here&apos;s what becomes possible when your website or app is built
              around how your business actually works.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Demo panels section */}
      <div className="py-24 lg:py-32">
        <div className="space-y-20 lg:space-y-28">
          {/* DEMO A: Food Truck Timeline (CENTERPIECE) */}
          <div>
            <Container>
              <div className="text-center mb-12">
                <h3 className="text-[32px] md:text-[44px] font-bold text-[#F4F6FA] leading-tight mb-4">
                  Your business moves. Your website should too.
                </h3>
                <p className="text-lg text-[#A9B4C4]">
                  Real schedules change week to week. We build pages that keep up.
                </p>
              </div>
            </Container>

            {/* Food truck timeline demo */}
            <Container>
              <FoodTruckTimeline />
            </Container>

            <Container>
              <p className="text-center text-sm text-[#A9B4C4]/70 mt-8">
                Built around your week — not a generic layout.
              </p>
            </Container>
          </div>

        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 4: AI SCHEDULING DEMO
// "Customers don't just ask questions. They book."
// =============================================================================

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

// Calendar days for mini preview
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function AISchedulingDemo() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [messageStep, setMessageStep] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loopKey, setLoopKey] = useState(0); // Forces re-render on loop

  // Single looping animation sequence
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

    // Message 6: Confirmation
    timers.push(setTimeout(() => setMessageStep(6), 9000));

    // Show calendar takeover with booking
    timers.push(setTimeout(() => {
      setShowCalendar(true);
    }, 10000));

    // Hold for 2 seconds, then loop
    timers.push(setTimeout(() => {
      setLoopKey(k => k + 1); // Trigger re-run
    }, 13000));

    return () => timers.forEach(clearTimeout);
  }, [isInView, loopKey]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0B1220]">
      <Container>
        {/* Section header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] text-[#B08D57] uppercase tracking-[0.25em] mb-4 font-medium">
            AI That Actually Does Something
          </p>
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[#F4F6FA] leading-tight mb-6">
            Customers don&apos;t just ask questions. They book.
          </h2>
          <p className="text-lg text-[#A9B4C4] max-w-2xl mx-auto">
            Give your business an assistant that answers like a pro and handles the next step — scheduling, requests, and follow-ups — in one smooth flow.
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
              transition={{ duration: 0.4 }}
              style={{ display: showCalendar ? "none" : "block" }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#B08D57]" />
                <span className="text-xs text-[#A9B4C4]/60 uppercase tracking-wider">Live Chat</span>
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
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === "customer"
                            ? "bg-[#B08D57] text-[#0B1220]"
                            : "bg-white/5 text-[#F4F6FA] border border-white/5"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* CALENDAR TAKEOVER VIEW */}
            <motion.div
              className="absolute inset-0 p-6 md:p-8 flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: showCalendar ? 1 : 0,
                scale: showCalendar ? 1 : 0.95
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ pointerEvents: showCalendar ? "auto" : "none" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#B08D57]" />
                <span className="text-xs text-[#A9B4C4]/60 uppercase tracking-wider">Booked</span>
              </div>

              {/* Booking confirmation */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={showCalendar ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#B08D57]/20 flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-[#B08D57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-[#F4F6FA] mb-2">
                    Destiny — Haircut
                  </h3>
                  <p className="text-lg text-[#B08D57] font-medium mb-1">
                    Wednesday at 12:00 PM
                  </p>
                  <p className="text-sm text-[#A9B4C4]/70">
                    with Emma
                  </p>
                </motion.div>

                {/* Mini calendar preview */}
                <motion.div
                  className="mt-6 bg-white/5 rounded-xl p-4 max-w-xs w-full"
                  initial={{ y: 20, opacity: 0 }}
                  animate={showCalendar ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="grid grid-cols-5 gap-1 text-center mb-2">
                    {days.map((day) => (
                      <div key={day} className="text-[10px] text-[#A9B4C4]/50 font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {days.map((day) => (
                      <div
                        key={day}
                        className={`h-8 rounded-md flex items-center justify-center ${
                          day === "Wed"
                            ? "bg-[#B08D57] text-[#0B1220]"
                            : day === "Tue" || day === "Thu"
                            ? "bg-white/10"
                            : "bg-white/5"
                        }`}
                      >
                        {day === "Wed" && (
                          <span className="text-[9px] font-semibold">12PM</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tiny line under demo */}
        <motion.p
          className="text-center text-sm text-[#A9B4C4]/60 mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          This is a real interaction pattern we build — not a concept slide.
        </motion.p>
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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0B1220]">
      <Container>
        <div className="max-w-2xl mx-auto">
          <motion.h2
            className="text-[32px] md:text-[44px] font-bold text-[#F4F6FA] leading-tight mb-10"
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
                className="flex items-start gap-4 text-lg text-[#A9B4C4]"
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2.5 shrink-0" />
                {bullet}
              </motion.li>
            ))}
          </ul>

          <motion.p
            className="text-sm text-[#A9B4C4]/60"
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
      className="py-24 lg:py-32 bg-gradient-to-b from-[#0B1220] to-[#0d1627]"
    >
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-[32px] md:text-[44px] font-bold text-[#F4F6FA] leading-tight mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Websites. Apps. Custom tools.
          </motion.h2>

          <motion.div
            className="space-y-3 text-lg text-[#A9B4C4] mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p>Sometimes you need a simple site.</p>
            <p>Sometimes you need something more.</p>
            <p className="text-[#F4F6FA]">
              We design and build what fits — not what&apos;s easiest.
            </p>
          </motion.div>

          <motion.p
            className="text-sm text-[#B08D57]"
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
    <section ref={sectionRef} className="py-28 lg:py-40 bg-[#0B1220]">
      <Container>
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[#F4F6FA] leading-tight mb-10">
            If you want your business to look like it belongs — we should talk.
          </h2>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="mailto:hello@shortlistpass.com?subject=Let's talk"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-colors"
            >
              Start a conversation
            </a>
            <a
              href="#demos"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-[#A9B4C4] border border-white/10 rounded-full hover:border-white/20 hover:text-[#F4F6FA] transition-colors"
            >
              See what&apos;s possible
            </a>
          </div>

          {/* Trust line */}
          <p className="text-sm text-[#A9B4C4]/50 max-w-lg mx-auto">
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
    <footer className="border-t border-white/5 py-12 bg-[#0B1220]">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#A9B4C4]/60">
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
    <main className="pt-16 overflow-x-hidden">
      <HeroSection />
      <TemplatesSuckSection />
      <ShowDontTellSection />
      <AISchedulingDemo />
      <OutcomesSection />
      <ScopeSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
