/*
  Run this in Supabase SQL editor:

  CREATE TABLE hoa_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    community_name TEXT NOT NULL,
    num_homes TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  ALTER TABLE hoa_leads ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow public insert for hoa leads"
    ON hoa_leads FOR INSERT TO anon
    WITH CHECK (true);
*/

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Caveat } from 'next/font/google';
import { createClient } from '@supabase/supabase-js';
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
  Link,
  Clock,
  Gift,
  Globe,
  Loader2,
  CheckCircle,
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

function HeroSection() {
  const [currentLine, setCurrentLine] = useState(0);
  const [showArrow, setShowArrow] = useState(false);

  const baseFontSize = 'clamp(1.6rem, 3.5vw, 2.4rem)';

  const lines = [
    { text: "Emails go unopened.", speed: 80 },
    { text: "Your residents are in a Facebook group.\nArguing.", speed: 55 },
    { text: "Website?\nLink hunting & never ending scrolls.", speed: 55 },
    { text: "Communication was a problem.", speed: 70 },
    { text: "Until now.", speed: 90, isFinal: true },
  ];

  const onLineComplete = () => {
    if (currentLine < lines.length - 1) {
      setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 1200);
    } else {
      setTimeout(() => {
        setShowArrow(true);
      }, 400);
    }
  };

  return (
    <section className="relative bg-[#1a1a1a] h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="max-w-[900px] mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLine}
            className="flex flex-col items-center justify-center min-h-[200px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p
              className="font-semibold text-[#f5f5f5] max-w-[900px] text-center whitespace-pre-line"
              style={{ fontSize: baseFontSize }}
            >
              <TypewriterText
                text={lines[currentLine].text}
                speed={lines[currentLine].speed}
                onComplete={onLineComplete}
              />
            </p>

            {showArrow && lines[currentLine].isFinal && (
              <motion.div
                className="mt-8"
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
        </AnimatePresence>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 2 - PHONE MOCKUP
// =============================================================================

function PhoneMockupSection() {
  const marqueeItems = [
    { icon: Calendar, label: "Events & Announcements" },
    { icon: MessageCircle, label: "Ask Anything. Get Answers." },
    { icon: BookOpen, label: "Newsletters. Always There." },
    { icon: Link, label: "Important Links." },
    { icon: HelpCircle, label: "FAQs." },
    { icon: Store, label: "Resident Owned Business Promotion." },
    { icon: Globe, label: "City Wide Connections." },
    { icon: Gift, label: "Perks and Resident Discounts." },
    { icon: Clock, label: "24/7 - No Days Off." },
  ];

  return (
    <AnimatedSection className="bg-[#1a1a1a] py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Headline */}
        <h2 className="text-2xl md:text-4xl font-bold text-[#f5f5f5] text-center mb-12">
          Meet your new 24/7 SmartAssistant.
        </h2>

        {/* Phone Frame */}
        <div className="flex justify-center mb-12">
          <div className="relative w-[240px] md:w-[280px] h-[480px] md:h-[560px] rounded-[32px] md:rounded-[40px] border-[3px] border-[#4ade80] bg-[#111111] overflow-hidden">
            <video
              src="/demo.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Scrolling Marquee */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden">
          <div
            className="flex gap-3 animate-scroll-left"
            style={{ width: 'max-content' }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 shrink-0 py-2 px-4 rounded-full bg-[#1f1f1f] border border-[#4ade80] hover:bg-[#2a2a2a] hover:border-[#5eed9a] transition-colors"
              >
                <item.icon className="w-4 h-4 text-[#4ade80]" />
                <span className="text-[0.85rem] font-medium text-[#f5f5f5] whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scrollLeft 18s linear infinite;
        }
        @media (min-width: 768px) {
          .animate-scroll-left {
            animation: scrollLeft 25s linear infinite;
          }
        }
      `}</style>
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
    <section ref={ref} id="features" className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-white text-center mb-16"
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
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {feature.headline}
                  </h3>
                  <p className="text-base md:text-lg text-[#9ca3af] leading-relaxed max-w-xl">
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-white text-center mb-12"
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
          {/* Card 1 */}
          <motion.div
            className="bg-[#2a2a2a] rounded-xl p-8 border border-[#2f2f2f] border-t-[3px] border-t-[#4ade80]"
            variants={fadeInUp}
          >
            <p className="text-lg font-bold text-white mb-4">
              Your management company has an app.
            </p>
            <p className="text-[#9ca3af] leading-relaxed mb-4">
              Theirs links to their pages, routes complaints back to their desk, and protects their contract. It's a glorified chatbot dressed up as a community tool.
            </p>
            <p className="text-sm font-bold text-[#4ade80]">
              Ours is a 24/7 point of contact for your neighborhood — connected to businesses and events across your entire city. Your residents actually use it.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="bg-[#2a2a2a] rounded-xl p-8 border border-[#2f2f2f] border-t-[3px] border-t-[#4ade80]"
            variants={fadeInUp}
          >
            <p className="text-lg font-bold text-white mb-1">
              Is this expensive?
            </p>
            <p className="text-[2.5rem] font-bold text-[#4ade80] leading-tight mb-4">
              No. It's free.
            </p>
            <p className="text-[#9ca3af] leading-relaxed">
              The businesses and vendors in the network cover the cost. You bring the residents. We handle everything else.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="bg-[#2a2a2a] rounded-xl p-8 border border-[#2f2f2f] border-t-[3px] border-t-[#4ade80]"
            variants={fadeInUp}
          >
            <p className="text-lg font-bold text-white mb-4">
              Our residents won't use it.
            </p>
            <p className="text-[#9ca3af] leading-relaxed">
              They already use their phones for everything. You're just giving them one place that works instead of seven that don't.
            </p>
          </motion.div>
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    community_name: '',
    num_homes: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validate required fields
    const newErrors: Record<string, boolean> = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.community_name.trim()) newErrors.community_name = true;
    if (!formData.num_homes.trim()) newErrors.num_homes = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.from('hoa_leads').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        community_name: formData.community_name.trim(),
        num_homes: formData.num_homes.trim(),
        message: formData.message.trim() || null,
      });

      if (error) throw error;

      setIsSuccess(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors ${
      errors[field] ? 'border-red-500' : 'border-[#3a3a3a]'
    }`;

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

        {isSuccess ? (
          <motion.div
            className="py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle className="w-12 h-12 text-[#4ade80] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              We'll be in touch within 24 hours.
            </h3>
            <p className="text-[#9ca3af]">
              Check your email — we'll reach out shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass('name')}
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass('email')}
            />
            <input
              type="text"
              name="community_name"
              placeholder="Community name"
              value={formData.community_name}
              onChange={handleChange}
              className={inputClass('community_name')}
            />
            <input
              type="text"
              name="num_homes"
              placeholder="Approximate number of homes"
              value={formData.num_homes}
              onChange={handleChange}
              className={inputClass('num_homes')}
            />
            <textarea
              name="message"
              placeholder="Anything you want us to know (optional)"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-lg bg-[#4ade80] text-[#1a1a1a] font-bold text-base hover:bg-[#3fcf70] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Let's talk — we'll reach out within 24 hours"
              )}
            </button>
            {submitError && (
              <p className="text-red-500 text-sm mt-2">{submitError}</p>
            )}
          </motion.form>
        )}
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
