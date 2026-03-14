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
// SECTION 1 - HERO (Fullscreen Cinematic Sequence with Typewriter)
// =============================================================================

function TypewriterText({
  text,
  speed = 70,
  onComplete,
  className = '',
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span
          className="font-light text-[#4ade80] animate-pulse"
          style={{ animationDuration: '0.7s' }}
        >
          |
        </span>
      )}
    </span>
  );
}

type HeroPhase = 'p1-1' | 'p1-2' | 'p1-3' | 'p1-wait' | 'p1-fadeout' | 'p2-1' | 'p2-2' | 'p2-3' | 'p3-1' | 'p3-2' | 'p3-arrow' | 'done';

function HeroSection() {
  const [phase, setPhase] = useState<HeroPhase>('p1-1');
  const [phase1Visible, setPhase1Visible] = useState(true);
  const [phase2Line, setPhase2Line] = useState<string | null>(null);
  const [phase3Started, setPhase3Started] = useState(false);
  const [showLine1, setShowLine1] = useState(true);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  const baseFontSize = 'clamp(1.6rem, 3.5vw, 2.4rem)';

  // Phase 1 completion handlers
  const onP1Line1Complete = () => {
    setTimeout(() => {
      setShowLine2(true);
      setPhase('p1-2');
    }, 400);
  };

  const onP1Line2Complete = () => {
    setTimeout(() => {
      setShowLine3(true);
      setPhase('p1-3');
    }, 400);
  };

  const onP1Line3Complete = () => {
    setTimeout(() => {
      setPhase('p1-fadeout');
      setPhase1Visible(false);
      setTimeout(() => {
        setPhase('p2-1');
        setPhase2Line('p2-1');
      }, 400);
    }, 1500);
  };

  // Phase 2 completion handlers
  const onP2Line1Complete = () => {
    setTimeout(() => {
      setPhase2Line(null);
      setTimeout(() => {
        setPhase('p2-2');
        setPhase2Line('p2-2');
      }, 400);
    }, 1000);
  };

  const onP2Line2Complete = () => {
    setTimeout(() => {
      setPhase2Line(null);
      setTimeout(() => {
        setPhase('p2-3');
        setPhase2Line('p2-3');
      }, 400);
    }, 1000);
  };

  const onP2Line3Complete = () => {
    setTimeout(() => {
      setPhase2Line(null);
      setTimeout(() => {
        setPhase('p3-1');
        setPhase3Started(true);
      }, 400);
    }, 1000);
  };

  const isPhase1 = phase.startsWith('p1-') && phase !== 'p1-fadeout';
  const isPhase2 = phase.startsWith('p2-');
  const isPhase3 = phase.startsWith('p3-');

  return (
    <section className="relative bg-[#1a1a1a] h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="max-w-[900px] mx-auto text-center">
        {/* PHASE 1: The Accusation */}
        <AnimatePresence mode="wait">
          {phase1Visible && (
            <motion.div
              key="phase1"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              {showLine1 && (
                <p
                  className="font-semibold text-[#f5f5f5] mb-4"
                  style={{ fontSize: baseFontSize }}
                >
                  <TypewriterText
                    text="Communication is the problem."
                    speed={80}
                    onComplete={onP1Line1Complete}
                  />
                </p>
              )}

              {showLine2 && (
                <p
                  className="font-black text-white mb-4"
                  style={{ fontSize: baseFontSize }}
                >
                  <TypewriterText
                    text="And it's your fault."
                    speed={80}
                    onComplete={onP1Line2Complete}
                  />
                </p>
              )}

              {showLine3 && (
                <p
                  className="font-normal text-[#6b7280] italic"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                >
                  <TypewriterText
                    text="(Even if it's not.)"
                    speed={100}
                    onComplete={onP1Line3Complete}
                  />
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 2: Single lines, one at a time */}
        <AnimatePresence mode="wait">
          {isPhase2 && phase2Line && (
            <motion.div
              key={phase2Line}
              className="flex items-center justify-center min-h-[200px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p
                className="font-semibold text-[#f5f5f5] max-w-[900px] text-center whitespace-pre-line"
                style={{ fontSize: baseFontSize }}
              >
                {phase2Line === 'p2-1' && (
                  <TypewriterText
                    text={"Your residents are in a Facebook group.\nArguing."}
                    speed={55}
                    onComplete={onP2Line1Complete}
                  />
                )}
                {phase2Line === 'p2-2' && (
                  <TypewriterText
                    text="Emails — unopened."
                    speed={110}
                    onComplete={onP2Line2Complete}
                  />
                )}
                {phase2Line === 'p2-3' && (
                  <TypewriterText
                    text={"You're not the problem.\nYour tools are."}
                    speed={75}
                    onComplete={onP2Line3Complete}
                  />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 3: The Resolution */}
        <AnimatePresence>
          {phase3Started && (
            <motion.div
              key="phase3"
              className="flex flex-col items-center justify-center min-h-[300px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p
                className="font-semibold text-[#f5f5f5] mb-6"
                style={{ fontSize: baseFontSize }}
              >
                <TypewriterText
                  text="Ready for the solution?"
                  speed={70}
                  onComplete={() => setShowArrow(true)}
                />
              </p>

              {showArrow && (
                <motion.div
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
            </motion.div>
          )}
        </AnimatePresence>
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
