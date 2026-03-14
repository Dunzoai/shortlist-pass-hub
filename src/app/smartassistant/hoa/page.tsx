'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Caveat } from 'next/font/google';
import {
  Monitor,
  Calendar,
  MessageCircle,
  BookOpen,
  Brain,
  Rss,
  Store,
  Bell,
  Smartphone,
  HelpCircle,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown,
} from 'lucide-react';

// =============================================================================
// FONTS
// =============================================================================

const caveat = Caveat({ subsets: ['latin'] });

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// =============================================================================
// SECTION WRAPPER WITH SCROLL ANIMATION
// =============================================================================

function AnimatedSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

// =============================================================================
// SECTION 1 - HERO (Fullscreen Cinematic Sequence)
// =============================================================================

function HeroSection() {
  // Phase: 'phase1' | 'phase1-fadeout' | 'phase2' | 'phase3'
  const [phase, setPhase] = useState<string>('phase1');
  const [showLine1a, setShowLine1a] = useState(false);
  const [showLine1b, setShowLine1b] = useState(false);
  const [showLine1c, setShowLine1c] = useState(false);
  const [phase1Visible, setPhase1Visible] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [showCurrentLine, setShowCurrentLine] = useState(false);
  const [showResolve1, setShowResolve1] = useState(false);
  const [showResolve2, setShowResolve2] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  const phase2Lines = [
    "Your residents are in a Facebook group right now. Arguing.",
    "Emails — unopened.",
    "You're not the problem. Your tools are.",
  ];

  useEffect(() => {
    // PHASE 1: Build accusation lines
    // Step 1a: Show first line immediately
    setShowLine1a(true);

    // Step 1b: 0.8s after 1a
    const timer1b = setTimeout(() => setShowLine1b(true), 800);

    // Step 1c: 0.6s after 1b (1.4s total)
    const timer1c = setTimeout(() => setShowLine1c(true), 1400);

    // All visible for 1.5s, then fade out (starts at 2.9s)
    // Duration of 1c animation is 0.6s, so it's done at 2s. Add 1.5s = 3.5s
    const timerFadeOut = setTimeout(() => {
      setPhase1Visible(false);
    }, 3500);

    // After fade out (0.4s), start Phase 2 (at 3.9s)
    const timerPhase2 = setTimeout(() => {
      setPhase('phase2');
      setShowCurrentLine(true);
    }, 3900);

    return () => {
      clearTimeout(timer1b);
      clearTimeout(timer1c);
      clearTimeout(timerFadeOut);
      clearTimeout(timerPhase2);
    };
  }, []);

  // PHASE 2: Cycle through lines
  useEffect(() => {
    if (phase !== 'phase2') return;

    const lineTimings = () => {
      // Show line (already shown via setShowCurrentLine)
      // After 1.8s sitting + 0.4s fade in = 2.2s, start fade out
      const fadeOutTimer = setTimeout(() => {
        setShowCurrentLine(false);
      }, 2200);

      // After fade out (0.3s) + gap (0.3s) = 2.8s, next line or Phase 3
      const nextTimer = setTimeout(() => {
        if (currentLine < phase2Lines.length - 1) {
          setCurrentLine(prev => prev + 1);
          setShowCurrentLine(true);
        } else {
          // Move to Phase 3
          setPhase('phase3');
        }
      }, 2800);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(nextTimer);
      };
    };

    const cleanup = lineTimings();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentLine]);

  // PHASE 3: Resolution sequence
  useEffect(() => {
    if (phase !== 'phase3') return;

    // Show "Don't worry —"
    setShowResolve1(true);

    // 0.5s later, show "We're the solution."
    const timer2 = setTimeout(() => setShowResolve2(true), 500);

    // 0.6s after that, show arrow (1.1s total)
    const timerArrow = setTimeout(() => setShowArrow(true), 1100);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timerArrow);
    };
  }, [phase]);

  return (
    <section className="relative bg-[#1a1a1a] h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="max-w-[700px] mx-auto text-center">
        {/* PHASE 1: The Accusation */}
        <AnimatePresence>
          {phase === 'phase1' && phase1Visible && (
            <motion.div
              key="phase1"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <AnimatePresence>
                {showLine1a && (
                  <motion.p
                    key="line1a"
                    className="font-semibold text-[#f5f5f5] mb-4"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Communication is the problem.
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showLine1b && (
                  <motion.p
                    key="line1b"
                    className="font-black text-white mb-4"
                    style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    And it's your fault.
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showLine1c && (
                  <motion.p
                    key="line1c"
                    className="text-[1.1rem] font-normal italic text-[#6b7280]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    (Even if it's not.)
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 2: Single lines, one at a time */}
        {phase === 'phase2' && (
          <div className="flex items-center justify-center min-h-[200px]">
            <AnimatePresence mode="wait">
              {showCurrentLine && (
                <motion.p
                  key={`phase2-line-${currentLine}`}
                  className="font-semibold text-[#f5f5f5] max-w-[700px]"
                  style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {phase2Lines[currentLine]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PHASE 3: The Resolution */}
        {phase === 'phase3' && (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <AnimatePresence>
              {showResolve1 && (
                <motion.p
                  key="resolve1"
                  className="font-normal text-[#9ca3af] mb-4"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Don't worry —
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showResolve2 && (
                <motion.p
                  key="resolve2"
                  className="font-black text-white mb-8"
                  style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  We're the solution.
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showArrow && (
                <motion.div
                  key="arrow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-8 h-8 text-[#4ade80]" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 2 - PHONE MOCKUP
// =============================================================================

function PhoneMockupSection() {
  const features = [
    { icon: Calendar, label: "Events & Announcements" },
    { icon: MessageCircle, label: "Ask Anything. Get Answers." },
    { icon: BookOpen, label: "Newsletters. Always There." },
  ];

  return (
    <AnimatedSection className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Phone Frame */}
        <div className="flex justify-center mb-12">
          <div className="relative w-[240px] md:w-[280px] h-[480px] md:h-[560px] rounded-[32px] md:rounded-[40px] border-2 border-[#4ade80] bg-[#111111] flex items-center justify-center">
            <div className="text-center">
              <Monitor className="w-12 h-12 md:w-16 md:h-16 text-[#4ade80] mx-auto mb-4" />
              <p className="text-sm text-[#4ade80] font-medium px-4">
                Live demo coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Feature Labels */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <feature.icon className="w-5 h-5 text-[#4ade80]" />
              <span className="text-sm md:text-base font-semibold text-[#f5f5f5]">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// =============================================================================
// SECTION 3 - FEATURES
// =============================================================================

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      headline: "An assistant that actually knows your community",
      description: "Upload your bylaws, rules, and documents by scanning, copy-pasting, or typing. A resident can ask what color they're allowed to paint their door at 2am from bed and get the exact answer. No board member woken up. No thread of 34 replies.",
    },
    {
      icon: Rss,
      headline: "An Instagram-style feed for your community",
      description: "Every event, announcement, and newsletter lives in a scrollable feed that residents actually check. Not buried in an inbox. Not lost in a Facebook thread. Right there, always available, always current.",
    },
    {
      icon: Store,
      headline: "Neighbors hiring neighbors",
      description: "Resident-owned businesses get their own verified listing inside your community app. Neighbors can tap in, ask questions 24/7, book appointments, place orders — without ever leaving your community. Local commerce that stays local.",
    },
    {
      icon: Bell,
      headline: "Push notifications that actually land",
      description: "Important memo? Gate closure? Hurricane prep? Send a push notification and it hits their phone — where they spend 70% of their day. Not their inbox. Not a Facebook group. Their home screen.",
    },
    {
      icon: Smartphone,
      headline: "A PWA — not another app to download",
      description: "Older residents who refuse to download apps open your branded website and get the full experience. Tech-savvy residents add it to their home screen like a native app. Everyone gets it. Nobody gets left out.",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="features" className="bg-[#f5f5f5] py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Everything your community needs. Nothing they have to dig for.
        </motion.h2>

        <div className="space-y-16 md:space-y-20">
          {features.map((feature, index) => {
            const isEven = index % 2 === 1;

            return (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${isEven ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#4ade80]/15 flex items-center justify-center">
                    <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-[#4ade80]" />
                  </div>
                </div>

                {/* Text */}
                <div className={`text-center md:text-left ${isEven ? 'md:text-right' : ''}`}>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-3">
                    {feature.headline}
                  </h3>
                  <p className="text-base md:text-lg text-[#1a1a1a]/70 leading-relaxed max-w-xl">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 4 - SOCIAL PROOF
// =============================================================================

function SocialProofSection() {
  const stats = [
    { number: "24/7", label: "Board assistant availability" },
    { number: "2,000+", label: "Avg. homes per community" },
    { number: "0", label: "App store downloads required" },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Quote */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-6xl md:text-8xl text-[#4ade80] font-serif leading-none block">
            "
          </span>
          <p className="text-lg md:text-2xl text-[#f5f5f5] italic leading-relaxed max-w-[600px] mx-auto mb-6 -mt-4 md:-mt-6">
            Residents started getting answers the same day we went live. The board finally stopped getting texts at night.
          </p>
          <p className="text-sm md:text-base text-[#4ade80]">
            — A Grand Strand community, active on the network
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={fadeInUp}
            >
              <p className="text-4xl md:text-5xl font-bold text-[#4ade80] mb-2">
                {stat.number}
              </p>
              <p className="text-sm md:text-base text-[#f5f5f5]/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 5 - OBJECTION BLOCK
// =============================================================================

function ObjectionSection() {
  const objections = [
    {
      question: "Our management company already has an app.",
      answer: "Their app serves them, not you. It's designed to protect their contract, not your residents. Ours is built for the community you were elected to serve.",
    },
    {
      question: "Is this expensive?",
      answer: "It's free for your community. The businesses and vendors in your network cover the cost. You bring the residents. We handle the rest.",
    },
    {
      question: "Our residents won't use it.",
      answer: "They already use their phones for everything. You're just giving them one place that works instead of seven that don't.",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#f5f5f5] py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          We know what you're thinking.
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {objections.map((obj, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm"
              variants={fadeInUp}
            >
              <HelpCircle className="w-6 h-6 text-[#4ade80] mb-4" />
              <p className="text-base md:text-lg font-bold text-[#1a1a1a] mb-3">
                {obj.question}
              </p>
              <p className="text-sm md:text-base text-[#1a1a1a]/70 leading-relaxed">
                {obj.answer}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 6 - CTA / CONTACT FORM
// =============================================================================

function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // TODO: wire up form submission to Supabase or email

  return (
    <section ref={ref} id="contact" className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-[480px] mx-auto text-center">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#f5f5f5] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Get your community on the network.
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-[#f5f5f5]/70 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Free to join. No contracts. No management company approval needed. Just a better experience for your residents starting this week.
        </motion.p>

        <motion.form
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="text"
            placeholder="Community name"
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="text"
            placeholder="Approximate number of homes"
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <textarea
            placeholder="Anything you want us to know (optional)"
            rows={4}
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors resize-none"
          />
          <button
            type="submit"
            className="w-full py-4 rounded-lg bg-[#4ade80] text-[#1a1a1a] font-bold text-base hover:bg-[#3fcf70] transition-colors"
          >
            Let's talk — we'll reach out within 24 hours
          </button>
        </motion.form>
      </div>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '/smartassistant#solution' },
    { label: 'Pricing', href: '/smartassistant#pricing' },
    { label: 'Tool Shed', href: '/smartassistant#toolshed' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Support', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

function Footer() {
  return (
    <footer className="relative bg-[#1a1a1a] py-16 px-6 border-t border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/shortlist-logo-ivory-transparent.png"
                alt="Shortlist"
                width={24}
                height={24}
              />
              <span className="text-[#f5f5f5] font-semibold text-lg">
                Shortlist
              </span>
            </div>
            <p className="text-[#f5f5f5]/40 text-sm leading-relaxed">
              Your community, always connected
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#f5f5f5]/50 hover:text-[#f5f5f5] hover:bg-white/10 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-[#f5f5f5]/40 text-xs uppercase tracking-wider font-semibold mb-4">
                {category}
              </p>
              <div className="space-y-2.5">
                {links.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-[#f5f5f5]/60 text-sm hover:text-[#f5f5f5] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[#f5f5f5]/30 text-xs">
            2026 Shortlist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function HOALandingPage() {
  // Hide the SmartPage chat widget on this page
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '#slp-widget-container { display: none !important; }';
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <HeroSection />
      <PhoneMockupSection />
      <FeaturesSection />
      <SocialProofSection />
      <ObjectionSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
